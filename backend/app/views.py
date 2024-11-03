# views.py
from rest_framework import viewsets, status, generics
from rest_framework.response import Response
from rest_framework.decorators import action, permission_classes
from rest_framework.permissions import AllowAny
from django.shortcuts import get_object_or_404
from django.core.exceptions import ValidationError
from .models import Detection, ShannonScoreWeights
from .serializers import DetectionSerializer, ShannonScoreWeightsSerializer
import os
import openai
import json
import logging
import csv
from io import StringIO

# Configure logging
logger = logging.getLogger(__name__)

# ---------------------------
# DetectionViewSet
# ---------------------------
class DetectionViewSet(viewsets.ModelViewSet):
    """
    A viewset for viewing and editing Detection instances.
    """
    queryset = Detection.objects.all()
    serializer_class = DetectionSerializer
    permission_classes = [AllowAny]

    @action(detail=False, methods=['post'], url_path='upload_csv')
    def upload_csv(self, request):
        """
        Handle CSV file uploads to bulk create Detection instances.
        Expected CSV Columns: name, logic, description
        """
        file = request.FILES.get('file')

        if not file:
            logger.error("No file provided in the request.")
            return Response({'error': 'No file provided.'}, status=status.HTTP_400_BAD_REQUEST)

        if not file.name.endswith('.csv'):
            logger.error("Uploaded file is not a CSV.")
            return Response({'error': 'File must be a CSV.'}, status=status.HTTP_400_BAD_REQUEST)

        try:
            # Decode the file. Assuming it's UTF-8 encoded.
            decoded_file = file.read().decode('utf-8')
            io_string = StringIO(decoded_file)
            reader = csv.DictReader(io_string)

            # Validate CSV headers
            expected_headers = {'name', 'logic', 'description'}
            if not expected_headers.issubset(set(reader.fieldnames)):
                missing = expected_headers - set(reader.fieldnames)
                logger.error(f"Missing CSV columns: {missing}")
                return Response({'error': f'Missing columns: {", ".join(missing)}'}, status=status.HTTP_400_BAD_REQUEST)

            detections_to_create = []
            row_num = 1  # To track row number for error reporting
            errors = []

            for row in reader:
                row_num += 1
                name = row.get('name', '').strip()
                logic = row.get('logic', '').strip()
                description = row.get('description', '').strip()

                # Validate required fields
                if not name or not logic or not description:
                    error_msg = f"Row {row_num}: 'name', 'logic', and 'description' are required."
                    logger.error(error_msg)
                    errors.append(error_msg)
                    continue

                # Optionally, perform more validation here (e.g., length checks)

                detection = Detection(
                    name=name,
                    logic=logic,
                    description=description
                )
                detections_to_create.append(detection)

            if errors:
                return Response({'errors': errors}, status=status.HTTP_400_BAD_REQUEST)

            # Bulk create detections
            created_count = Detection.objects.bulk_create(detections_to_create)

            logger.info(f"Successfully uploaded {len(created_count)} detections via CSV.")
            return Response({'detail': f'Successfully uploaded {len(created_count)} detections.'}, status=status.HTTP_201_CREATED)

        except UnicodeDecodeError:
            logger.exception("Error decoding the uploaded CSV file.")
            return Response({'error': 'File encoding not supported. Please upload a UTF-8 encoded CSV.'}, status=status.HTTP_400_BAD_REQUEST)
        except csv.Error:
            logger.exception("Error parsing the uploaded CSV file.")
            return Response({'error': 'Invalid CSV format.'}, status=status.HTTP_400_BAD_REQUEST)
        except Exception as e:
            logger.exception(f"Unexpected error during CSV upload: {e}")
            return Response({'error': 'An unexpected error occurred during CSV upload.', 'details': str(e)}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)

    @action(detail=True, methods=['post'])
    def calculate_score(self, request, pk=None):
        """
        Calculate the Shannon score for a specific Detection instance.
        """
        detection = self.get_object()

        # Ensure OpenAI API key is set
        openai_api_key = os.environ.get('OPENAI_API_KEY')
        if not openai_api_key:
            logger.error('OPENAI_API_KEY environment variable is not set.')
            return Response({'error': 'OPENAI_API_KEY environment variable is not set.'},
                            status=status.HTTP_500_INTERNAL_SERVER_ERROR)
        openai.api_key = openai_api_key
        openai.api_base = os.environ.get('OPENAI_API_BASE', 'https://api.openai.com/v1')

        # Get weights from ShannonScoreWeights model
        weights = ShannonScoreWeights.objects.first()
        if not weights:
            logger.warning('No ShannonScoreWeights instance found. Using default weights.')
            # Use default weights summing to 1.0
            W1 = W2 = W3 = W4 = W5 = 0.2
        else:
            W1 = weights.tac_weight
            W2 = weights.di_weight
            W3 = weights.oc_weight
            W4 = weights.irp_weight
            W5 = weights.u_weight

        logger.info(f"Using weights - W1(TAC): {W1}, W2(DI): {W2}, W3(OC): {W3}, W4(IRP): {W4}, W5(U): {W5}")

        # Sanitize detection.logic to prevent injection attacks
        logic_text = detection.logic.strip()
        # Limit the length of the text to prevent excessive API usage
        logic_text = logic_text[:1000]  # Limit to first 1000 characters

        # Prompts for each component
        prompts = {
            'tac': f"""As a cybersecurity expert, evaluate the Technical Adversary Capability (TAC) based on the following detection logic: "{logic_text}". Provide a score between 0 and 100.""",
            'di': f"""As a cybersecurity expert, evaluate the Detection Integrity (DI) based on the following detection logic: "{logic_text}". Provide a score between 0 and 100.""",
            'oc': f"""As a cybersecurity expert, evaluate the Operational Complexity (OC) based on the following detection logic: "{logic_text}". Provide a score between 0 and 100.""",
            'irp': f"""As a cybersecurity expert, evaluate the Incident Response Procedures (IRP) based on the following detection logic: "{logic_text}". Provide a score between 0 and 100.""",
            'u': f"""As a cybersecurity expert, evaluate the Uncertainty (U) based on the following detection logic: "{logic_text}". Provide a score between 0 and 100.""",
        }

        # Function to get score from OpenAI
        def get_score(prompt):
            try:
                response = openai.Completion.create(
                    model='text-davinci-003',  # Updated from 'engine' to 'model'
                    prompt=prompt,
                    max_tokens=10,
                    temperature=0
                )
                content = response.choices[0].text.strip()
                # Extract the first line and try to parse it as a float
                score_line = content.split('\n')[0]
                score = float(score_line)
                # Ensure score is between 0 and 100
                if not (0 <= score <= 100):
                    logger.error(f"Score out of bounds: {score}")
                    score = 0
                logger.info(f"Obtained score from OpenAI: {score}")
                return score
            except ValueError as ve:
                logger.error(f"Invalid score format: {ve}")
                return 0  # Default to 0 if parsing fails
            except Exception as e:
                logger.error(f"Error getting score from OpenAI: {e}")
                return 0  # Default to 0 if error occurs

        # Get scores for each component if they are not already set
        try:
            if detection.tac is None:
                detection.tac = get_score(prompts['tac'])
                logger.info(f"Calculated TAC score: {detection.tac}")
            if detection.di is None:
                detection.di = get_score(prompts['di'])
                logger.info(f"Calculated DI score: {detection.di}")
            if detection.oc is None:
                detection.oc = get_score(prompts['oc'])
                logger.info(f"Calculated OC score: {detection.oc}")
            if detection.irp is None:
                detection.irp = get_score(prompts['irp'])
                logger.info(f"Calculated IRP score: {detection.irp}")
            if detection.u is None:
                detection.u = get_score(prompts['u'])
                logger.info(f"Calculated U score: {detection.u}")
        except Exception as e:
            logger.error(f"Error calculating component scores: {e}")
            return Response({'error': 'Failed to calculate component scores.', 'details': str(e)},
                            status=status.HTTP_500_INTERNAL_SERVER_ERROR)

        # Calculate the overall Shannon score
        try:
            detection.shannon_score = (
                W1 * detection.tac +
                W2 * detection.di +
                W3 * detection.oc +
                W4 * detection.irp +
                W5 * detection.u
            )
            detection.save()
            logger.info(f"Calculated Shannon Score: {detection.shannon_score}")
        except Exception as e:
            logger.error(f"Error calculating Shannon score: {e}")
            return Response({'error': 'Failed to calculate Shannon score.', 'details': str(e)},
                            status=status.HTTP_500_INTERNAL_SERVER_ERROR)

        return Response({
            'shannon_score': detection.shannon_score,
            'tac': detection.tac,
            'di': detection.di,
            'oc': detection.oc,
            'irp': detection.irp,
            'u': detection.u
        }, status=status.HTTP_200_OK)

    @action(detail=True, methods=['post'])
    def classify_mitre(self, request, pk=None):
        """
        Classify MITRE ATT&CK tactics and techniques based on detection description.
        """
        detection = self.get_object()

        # Ensure OpenAI API key is set
        openai_api_key = os.environ.get('OPENAI_API_KEY')
        if not openai_api_key:
            logger.error('OPENAI_API_KEY environment variable is not set.')
            return Response({'error': 'OPENAI_API_KEY environment variable is not set.'},
                            status=status.HTTP_500_INTERNAL_SERVER_ERROR)
        openai.api_key = openai_api_key
        openai.api_base = os.environ.get('OPENAI_API_BASE', 'https://api.openai.com/v1')

        # Sanitize detection.description
        description_text = detection.description.strip()
        # Limit the length of the text
        description_text = description_text[:1000]  # Limit to first 1000 characters

        # Prompt for classification
        prompt = f"""
You are a cybersecurity expert familiar with the MITRE ATT&CK framework. Based on the following detection description, identify the relevant MITRE ATT&CK Tactics and Techniques.

Detection Description:
"{description_text}"

Provide your answer in the following JSON format:
{{
    "tactics": ["List of tactic names"],
    "techniques": ["List of technique IDs and names in the format 'T####: Technique Name'"]
}}

Only include tactics and techniques that are directly relevant to the detection description.
"""

        try:
            response = openai.Completion.create(
                model='text-davinci-003',  # Updated from 'engine' to 'model'
                prompt=prompt,
                max_tokens=500,
                temperature=0
            )
            content = response.choices[0].text.strip()

            # Parse the JSON response
            try:
                mitre_data = json.loads(content)
                # Validate that the data is in the expected format
                tactics = mitre_data.get('tactics', [])
                techniques = mitre_data.get('techniques', [])
                if not isinstance(tactics, list) or not isinstance(techniques, list):
                    raise ValueError("Invalid format for tactics or techniques.")

                detection.mitre_tactics = tactics
                detection.mitre_techniques = techniques
                detection.save()
                logger.info(f"Classified MITRE Tactics: {tactics}")
                logger.info(f"Classified MITRE Techniques: {techniques}")
                return Response({
                    'mitre_tactics': detection.mitre_tactics,
                    'mitre_techniques': detection.mitre_techniques
                }, status=status.HTTP_200_OK)
            except json.JSONDecodeError as e:
                logger.error(f"JSON parsing error: {e}")
                return Response({'error': 'Failed to parse MITRE ATT&CK classification response.',
                                 'details': str(e)}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)
            except ValueError as ve:
                logger.error(f"ValueError: {ve}")
                return Response({'error': str(ve)}, status=status.HTTP_400_BAD_REQUEST)
            except Exception as e:
                logger.error(f"Error processing MITRE data: {e}")
                return Response({'error': 'Invalid data format received from OpenAI.', 'details': str(e)},
                                status=status.HTTP_500_INTERNAL_SERVER_ERROR)

        except Exception as e:
            logger.error(f"Error classifying MITRE: {e}")
            return Response({'error': 'Failed to classify MITRE mappings.', 'details': str(e)},
                            status=status.HTTP_500_INTERNAL_SERVER_ERROR)

# ---------------------------
# ShannonScoreWeightsDetail View
# ---------------------------
class ShannonScoreWeightsDetail(generics.RetrieveUpdateAPIView):
    """
    A view for retrieving and updating the singleton ShannonScoreWeights instance.
    """
    serializer_class = ShannonScoreWeightsSerializer
    permission_classes = [AllowAny]  # Updated to AllowAny

    def get_object(self):
        """
        Retrieve the singleton instance of ShannonScoreWeights.
        If it doesn't exist, create it with default values.
        """
        obj, created = ShannonScoreWeights.objects.get_or_create(id=1)
        return obj

    def update(self, request, *args, **kwargs):
        """
        Override the update method to ensure that the sum of all weights equals 1.0.
        """
        instance = self.get_object()
        serializer = self.get_serializer(instance, data=request.data, partial=True)
        serializer.is_valid(raise_exception=True)

        # Calculate the sum of the weights
        total = (
            serializer.validated_data.get('tac_weight', instance.tac_weight) +
            serializer.validated_data.get('di_weight', instance.di_weight) +
            serializer.validated_data.get('oc_weight', instance.oc_weight) +
            serializer.validated_data.get('irp_weight', instance.irp_weight) +
            serializer.validated_data.get('u_weight', instance.u_weight)
        )

        if abs(total - 1.0) > 0.0001:
            logger.error(f"The sum of weights is {total}, which does not equal 1.0.")
            return Response(
                {"detail": "The sum of all weights must equal 1."},
                status=status.HTTP_400_BAD_REQUEST
            )

        self.perform_update(serializer)
        logger.info(f"Updated Shannon Score Weights: {serializer.data}")
        return Response(serializer.data, status=status.HTTP_200_OK)




# ---------------------------
# Remove ShannonScoreWeightsViewSet
# ---------------------------
# Since ShannonScoreWeights is now handled by ShannonScoreWeightsDetail,
# you should remove ShannonScoreWeightsViewSet to prevent conflicts.

# If you have existing ShannonScoreWeightsViewSet, remove or comment it out.
# For example:

# class ShannonScoreWeightsViewSet(viewsets.ModelViewSet):
#     queryset = ShannonScoreWeights.objects.all()
#     serializer_class = ShannonScoreWeightsSerializer
#
#     def get_queryset(self):
#         # Ensure only one instance exists
#         return ShannonScoreWeights.objects.all()[:1]
#
#     def create(self, request, *args, **kwargs):
#         # Prevent creating multiple instances
#         if ShannonScoreWeights.objects.exists():
#             return Response({'detail': 'Weights already exist. Use PUT to update.'},
#                             status=status.HTTP_400_BAD_REQUEST)
#         return super().create(request, *args, **kwargs)