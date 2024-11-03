import React from 'react';
import { Typography, Box } from '@mui/material';

function Home() {
  return (
    <Box textAlign="center" sx={{ mt: 4 }}>
      <Typography variant="h3" gutterBottom>
        Welcome to D.A.T.A.
      </Typography>
      <Typography variant="h5" gutterBottom>
        Detection & Threat, Analytics, Tracking, Application
      </Typography>
      <img
        src="/images/robot.avif"
        alt="Robot"
        style={{ maxWidth: '400px', width: '100%', height: 'auto', marginTop: '20px' }}
      />
    </Box>
  );
}

export default Home;