import React, { useEffect, useState } from 'react';
import { getDetection } from '../utils/api';
import { useParams, Link } from 'react-router-dom';
import {
    Radar,
    RadarChart,
    PolarGrid,
    PolarAngleAxis,
    PolarRadiusAxis,
    Tooltip,
  } from 'recharts';
import { Typography, Box, Button } from '@mui/material';

function DetectionDetail() {
  const { id } = useParams();
  const [detection, setDetection] = useState(null);

  useEffect(() => {
    fetchDetection();
  }, []);

  const fetchDetection = () => {
    getDetection(id)
      .then((res) => setDetection(res.data))
      .catch((err) => console.error(err));
  };

  if (!detection) {
    return <div>Loading...</div>;
  }

  const radarData = [
    {
      metric: 'TAC',
      score: detection.tac || 0,
    },
    {
      metric: 'DI',
      score: detection.di || 0,
    },
    {
      metric: 'OC',
      score: detection.oc || 0,
    },
    {
      metric: 'IRP',
      score: detection.irp || 0,
    },
    {
      metric: 'U',
      score: detection.u || 0,
    },
  ];

  return (
    <Box sx={{ maxWidth: 800, mx: 'auto', my: 4 }}>
      <Typography variant="h4" component="h1" gutterBottom>
        {detection.name}
      </Typography>
      <Typography variant="body1" gutterBottom>
        {detection.description}
      </Typography>
      <Typography variant="body2" gutterBottom>
        Logic: {detection.logic}
      </Typography>

      {/* Radar Chart for Shannon Score Elements */}
      <RadarChart
        cx={400}
        cy={250}
        outerRadius={150}
        width={800}
        height={500}
        data={radarData}
      >
        <PolarGrid />
        <PolarAngleAxis dataKey="metric" />
        <PolarRadiusAxis angle={30} domain={[0, 100]} />
        <Tooltip />
        <Radar
          name={detection.name}
          dataKey="score"
          stroke="#8884d8"
          fill="#8884d8"
          fillOpacity={0.6}
        />
      </RadarChart>

      <Typography variant="h6" gutterBottom>
        Shannon Score: {detection.shannon_score || 'N/A'}
      </Typography>

      <Typography variant="h6" gutterBottom>
        MITRE ATT&CK Tactics:
      </Typography>
      <Typography variant="body1">
        {detection.mitre_tactics && detection.mitre_tactics.length > 0
          ? detection.mitre_tactics.join(', ')
          : 'None'}
      </Typography>

      <Typography variant="h6" gutterBottom>
        MITRE ATT&CK Techniques:
      </Typography>
      <Typography variant="body1">
        {detection.mitre_techniques && detection.mitre_techniques.length > 0
          ? detection.mitre_techniques.join(', ')
          : 'None'}
      </Typography>

      <Button
        variant="contained"
        component={Link}
        to={`/detections/${id}/edit`}
        sx={{ mt: 2, mr: 2 }}
      >
        Edit Detection
      </Button>
      <Button
        variant="outlined"
        onClick={() => {
          // Implement calculate score functionality if needed
        }}
        sx={{ mt: 2 }}
      >
        Recalculate Score
      </Button>
    </Box>
  );
}

export default DetectionDetail;