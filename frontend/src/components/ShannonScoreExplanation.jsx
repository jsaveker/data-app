// components/ShannonScoreExplanation.jsx
import React from 'react';
import { Box, Typography, Accordion, AccordionSummary, AccordionDetails, Link } from '@mui/material';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';

function ShannonScoreExplanation() {
  return (
    <Box sx={{ maxWidth: 1000, mx: 'auto', mt: 4, px: 2 }}>
      <Typography variant="h4" gutterBottom>
        Shannon Signal Score
      </Typography>
      <Typography variant="body1" gutterBottom>
        The Shannon Signal Score is a comprehensive metric designed to evaluate the effectiveness and reliability of security detections within an organization. It is calculated as a weighted sum of five key components:
      </Typography>
      <Typography variant="h6" gutterBottom>
        Formula:
      </Typography>
      <Typography variant="body1" gutterBottom>
        <strong>Shannon Score = W₁ × TAC + W₂ × DI + W₃ × OC + W₄ × IRP + W₅ × U</strong>
      </Typography>
      <Typography variant="body1" gutterBottom>
        Where:
      </Typography>
      <ul>
        <li><strong>TAC:</strong> Threat Alignment and Coverage</li>
        <li><strong>DI:</strong> Detection Integrity</li>
        <li><strong>OC:</strong> Operational Cost</li>
        <li><strong>IRP:</strong> Impact and Risk Potential</li>
        <li><strong>U:</strong> Utility</li>
      </ul>

      {/* Sections for each component */}
      <Accordion>
        <AccordionSummary expandIcon={<ExpandMoreIcon />}>
          <Typography variant="h6">1. Threat Alignment & Coverage</Typography>
        </AccordionSummary>
        <AccordionDetails>
          <Typography variant="subtitle1">1.1 Threat Intel Fidelity</Typography>
          <Typography variant="body2" gutterBottom>
            <strong>Description:</strong> How accurately does the detection reflect the threat it's intended to detect? This includes alignment with the threat landscape, prevalence, and realism of the detection.
          </Typography>
          <Typography variant="body2" gutterBottom>
            <strong>How to Measure:</strong> LLM-based evaluation.
          </Typography>

          <Typography variant="subtitle1">1.2 Organizational Risk Context</Typography>
          <Typography variant="body2" gutterBottom>
            <strong>Description:</strong> Evaluates how well the detection aligns with the specific risk profile of your organization, considering assets, processes, and unique threat modeling.
          </Typography>
          <Typography variant="body2" gutterBottom>
            <strong>How to Measure:</strong> LLM-based evaluation.
          </Typography>

          <Typography variant="subtitle1">1.3 Log Footprint & Signal Potential</Typography>
          <Typography variant="body2" gutterBottom>
            <strong>Description:</strong> Assesses the quality and potential of logs to generate meaningful signals for detection, considering the maturity and documentation of log sources.
          </Typography>
          <Typography variant="body2" gutterBottom>
            <strong>How to Measure:</strong> LLM-based evaluation.
          </Typography>

          <Typography variant="subtitle1">1.4 Attack Surface Coverage</Typography>
          <Typography variant="body2" gutterBottom>
            <strong>Description:</strong> Measures how much of your attack surface is covered by the detection, considering various domains like endpoint, network, SaaS, and Cloud.
          </Typography>
          <Typography variant="body2" gutterBottom>
            <strong>How to Measure:</strong> Percentage or ratio of specific attack surfaces to overall attack surfaces.
          </Typography>
        </AccordionDetails>
      </Accordion>

      {/* Repeat Accordion components for each main section (2, 3, 4, 5) */}
      <Accordion>
        <AccordionSummary expandIcon={<ExpandMoreIcon />}>
          <Typography variant="h6">2. Detection Integrity</Typography>
        </AccordionSummary>
        <AccordionDetails>
          <Typography variant="subtitle1">2.1 Analytic Robustness</Typography>
          <Typography variant="body2" gutterBottom>
            <strong>Description:</strong> Evaluates the resilience and sophistication of the detection, ensuring it effectively catches relevant behaviors and is resistant to changes in attacker tactics.
          </Typography>
          <Typography variant="body2" gutterBottom>
            <strong>How to Measure:</strong> LLM-based evaluation using capability abstraction models.
          </Typography>

          <Typography variant="subtitle1">2.2 Detection Logic Quality</Typography>
          <Typography variant="body2" gutterBottom>
            <strong>Description:</strong> Measures the syntax quality and efficiency of the detection logic, ensuring best practices are followed for the specific query language used.
          </Typography>
          <Typography variant="body2" gutterBottom>
            <strong>How to Measure:</strong> LLM-based evaluation.
          </Typography>

          <Typography variant="subtitle1">2.3 Precision and Recall</Typography>
          <Typography variant="body2" gutterBottom>
            <strong>Description:</strong> Assesses the accuracy of the detection in minimizing false positives (precision) and its ability to capture all relevant threats (recall).
          </Typography>
          <Typography variant="body2" gutterBottom>
            <strong>How to Measure:</strong>
            <br />
            <strong>Precision:</strong> (True Positives) / (True Positives + False Positives) * 100%
            <br />
            <strong>Recall:</strong> (True Positives) / (True Positives + False Negatives) * 100%
          </Typography>

          <Typography variant="subtitle1">2.4 Longevity</Typography>
          <Typography variant="body2" gutterBottom>
            <strong>Description:</strong> Evaluates how long the detection can run without requiring changes to its logic or the log data it relies on.
          </Typography>
          <Typography variant="body2" gutterBottom>
            <strong>How to Measure:</strong> LLM-based evaluation.
          </Typography>
        </AccordionDetails>
      </Accordion>

      <Accordion>
        <AccordionSummary expandIcon={<ExpandMoreIcon />}>
          <Typography variant="h6">3. Operational Cost</Typography>
        </AccordionSummary>
        <AccordionDetails>
          <Typography variant="subtitle1">3.1 Investigation Labor Cost</Typography>
          <Typography variant="body2" gutterBottom>
            <strong>Description:</strong> Quantifies the human effort required to investigate alerts, focusing on the labor cost for false positive investigations.
          </Typography>
          <Typography variant="body2" gutterBottom>
            <strong>How to Measure:</strong> Investigation time for false positives (hours/month).
          </Typography>

          <Typography variant="subtitle1">3.2 Detection Labor Cost</Typography>
          <Typography variant="body2" gutterBottom>
            <strong>Description:</strong> Measures how frequently the detection requires updates or maintenance, reflecting the resource investment needed to keep it functional.
          </Typography>
          <Typography variant="body2" gutterBottom>
            <strong>How to Measure:</strong> Frequency of human interaction with the detection (hours/month).
          </Typography>

          <Typography variant="subtitle1">3.3 Analytic Costs</Typography>
          <Typography variant="body2" gutterBottom>
            <strong>Description:</strong> Considers the cost of storing logs and data needed to support the detection, including compute costs based on analytic frequency.
          </Typography>
          <Typography variant="body2" gutterBottom>
            <strong>How to Measure:</strong> Frequency of scheduled searches, compute costs, storage expenses.
          </Typography>

          <Typography variant="subtitle1">3.4 Alert Volume</Typography>
          <Typography variant="body2" gutterBottom>
            <strong>Description:</strong> Tracks how often the detection generates alerts and assesses the risk of alert fatigue.
          </Typography>
          <Typography variant="body2" gutterBottom>
            <strong>How to Measure:</strong> Number of detections/month.
          </Typography>

          <Typography variant="subtitle1">3.5 Cognitive Load</Typography>
          <Typography variant="body2" gutterBottom>
            <strong>Description:</strong> Measures how long it takes a human to understand the detection, reflecting the required subject matter expertise and intuitiveness of the alert.
          </Typography>
          <Typography variant="body2" gutterBottom>
            <strong>How to Measure:</strong> LLM-based evaluation.
          </Typography>
        </AccordionDetails>
      </Accordion>

      <Accordion>
        <AccordionSummary expandIcon={<ExpandMoreIcon />}>
          <Typography variant="h6">4. Impact & Risk Potential</Typography>
        </AccordionSummary>
        <AccordionDetails>
          <Typography variant="subtitle1">4.1 Impact of Detected Threat</Typography>
          <Typography variant="body2" gutterBottom>
            <strong>Description:</strong> Assesses the potential impact of the threat the detection is designed to capture, considering the severity and organizational risk.
          </Typography>
          <Typography variant="body2" gutterBottom>
            <strong>How to Measure:</strong> LLM-based evaluation with organizational context.
          </Typography>

          <Typography variant="subtitle1">4.2 Risk Potential of False Negatives</Typography>
          <Typography variant="body2" gutterBottom>
            <strong>Description:</strong> Evaluates the organizational tolerance for missed detections and the likelihood of false negatives.
          </Typography>
          <Typography variant="body2" gutterBottom>
            <strong>How to Measure:</strong> LLM-based evaluation.
          </Typography>

          <Typography variant="subtitle1">4.3 Bias Susceptibility</Typography>
          <Typography variant="body2" gutterBottom>
            <strong>Description:</strong> Analyzes potential biases that may affect how detections are perceived and prioritized by analysts.
          </Typography>
          <Typography variant="body2" gutterBottom>
            <strong>How to Measure:</strong> Requires data on decision-making patterns; currently, LLM-based evaluations are recommended.
          </Typography>
        </AccordionDetails>
      </Accordion>

      <Accordion>
        <AccordionSummary expandIcon={<ExpandMoreIcon />}>
          <Typography variant="h6">5. Utility</Typography>
        </AccordionSummary>
        <AccordionDetails>
          <Typography variant="subtitle1">5.1 Operational Context</Typography>
          <Typography variant="body2" gutterBottom>
            <strong>Description:</strong> Assesses the practical utility of the detection within the specific environment, considering benign positives and operational relevance.
          </Typography>
          <Typography variant="body2" gutterBottom>
            <strong>How to Measure:</strong> Number of benign positives/month.
          </Typography>

          <Typography variant="subtitle1">5.2 Actionability</Typography>
          <Typography variant="body2" gutterBottom>
            <strong>Description:</strong> Determines whether alerts generated by the detection can be effectively responded to or mitigated.
          </Typography>
          <Typography variant="body2" gutterBottom>
            <strong>How to Measure:</strong> Number of true positives/month requiring no action.
          </Typography>

          <Typography variant="subtitle1">5.3 Response Consistency</Typography>
          <Typography variant="body2" gutterBottom>
            <strong>Description:</strong> Evaluates the consistency of response and investigation steps for the detection, indicating automation potential.
          </Typography>
          <Typography variant="body2" gutterBottom>
            <strong>How to Measure:</strong> Similarity of investigation/response steps across alerts using LLM-based evaluation.
          </Typography>
        </AccordionDetails>
      </Accordion>
    </Box>
  );
}

export default ShannonScoreExplanation;