from rest_framework import serializers
from .models import Detection, ShannonScoreWeights

class DetectionSerializer(serializers.ModelSerializer):
    class Meta:
        model = Detection
        fields = [
            'id',
            'name',
            'description',
            'logic',
            'shannon_score',  # Ensure this field is included
            'tac',
            'di',
            'oc',
            'irp',
            'u',
            'mitre_tactics',
            'mitre_techniques',
            # Add any other relevant fields
        ]
        read_only_fields = ['shannon_score']  # Optional: Make it read-only if it's calculated

class ShannonScoreWeightsSerializer(serializers.ModelSerializer):
    class Meta:
        model = ShannonScoreWeights
        fields = '__all__'