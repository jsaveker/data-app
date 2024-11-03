import React, { useEffect, useState } from 'react';
import { getDetections } from '../utils/api';
import {
    Radar,
    RadarChart,
    PolarGrid,
    PolarAngleAxis,
    PolarRadiusAxis,
    Tooltip,
  } from 'recharts';
import { Link } from 'react-router-dom';
import { Typography, Box, List, ListItem, ListItemText, Button } from '@mui/material';

function DetectionList() {
  const [detections, setDetections] = useState([]);

  useEffect(() => {
    fetchDetections();
  }, []);

  const fetchDetections = () => {
    getDetections()
      .then((res) => setDetections(res.data))
      .catch((err) => console.error(err));
  };

  // Prepare data for radar chart
  const radarData = detections.map((detection) => ({
    name: detection.name,
    TAC: detection.tac || 0,
    DI: detection.di || 0,
    OC: detection.oc || 0,
    IRP: detection.irp || 0,
    U: detection.u || 0,
  }));

  return (
    <Box sx={{ maxWidth: 800, mx: 'auto', my: 4 }}>
      <Typography variant="h4" component="h1" gutterBottom>
        Signal Library
      </Typography>

      <RadarChart cx={400} cy={250} outerRadius={150} width={800} height={500} data={radarData}>
        <PolarGrid />
        <PolarAngleAxis dataKey="name" />
        <PolarRadiusAxis angle={30} domain={[0, 100]} />
        <Tooltip />
        <Radar name="TAC" dataKey="TAC" stroke="#8884d8" fill="#8884d8" fillOpacity={0.6} />
        <Radar name="DI" dataKey="DI" stroke="#82ca9d" fill="#82ca9d" fillOpacity={0.6} />
        <Radar name="OC" dataKey="OC" stroke="#ffc658" fill="#ffc658" fillOpacity={0.6} />
        <Radar name="IRP" dataKey="IRP" stroke="#ff7300" fill="#ff7300" fillOpacity={0.6} />
        <Radar name="U" dataKey="U" stroke="#d0ed57" fill="#d0ed57" fillOpacity={0.6} />
      </RadarChart>

      <List>
        {detections.map((detection) => (
          <ListItem key={detection.id}>
            <ListItemText
              primary={<Link to={`/detections/${detection.id}`}>{detection.name}</Link>}
              secondary={`Shannon Score: ${detection.shannon_score || 'N/A'}`}
            />
          </ListItem>
        ))}
      </List>
    </Box>
  );
}

export default DetectionList;