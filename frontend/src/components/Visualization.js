import React, { useState, useEffect } from 'react';
import { getDetections } from '../utils/api';
import { Radar } from 'react-chartjs-2';
import 'chart.js/auto';
import { Typography, Box } from '@mui/material';

function Visualization() {
  const [chartData, setChartData] = useState({});

  useEffect(() => {
    getDetections()
      .then((res) => {
        const detections = res.data;
        const labels = ['TAC', 'DI', 'OC', 'IRP', 'U'];
        const datasets = detections.map((det, index) => ({
          label: det.name,
          data: [det.tac, det.di, det.oc, det.irp, det.u],
          backgroundColor: `rgba(${(index * 50) % 255}, ${
            (index * 80) % 255
          }, ${(index * 110) % 255}, 0.2)`,
          borderColor: `rgba(${(index * 50) % 255}, ${
            (index * 80) % 255
          }, ${(index * 110) % 255}, 1)`,
          borderWidth: 1,
        }));
        const data = {
          labels: labels,
          datasets: datasets,
        };
        setChartData(data);
      })
      .catch((err) => console.error(err));
  }, []);

  return (
    <Box>
      <Typography variant="h4" gutterBottom>
        Detection Posture Chart (S3 Scores)
      </Typography>
      {chartData.datasets && chartData.datasets.length > 0 ? (
        <Radar data={chartData} options={{ responsive: true }} />
      ) : (
        <Typography>No data available for visualization.</Typography>
      )}
    </Box>
  );
}

export default Visualization;