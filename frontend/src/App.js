// src/App.js
import React, { useState } from 'react';
import { BrowserRouter as Router, Routes, Route, useNavigate } from 'react-router-dom';
import {
  CssBaseline,
  AppBar,
  Toolbar,
  Typography,
  Container,
  Box,
  IconButton,
  Drawer,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
} from '@mui/material';
import {
  Menu as MenuIcon,
  UploadFile,
  AddCircle,
  ListAlt,
  BarChart,
  Home as HomeIcon,
  Settings as SettingsIcon, // Icon for Adjust Weights
  Info as InfoIcon, // Icon for Shannon Score Explanation
} from '@mui/icons-material';
import UploadCSV from './components/UploadCSV';
import DetectionForm from './components/DetectionForm';
import DetectionList from './components/DetectionList';
import DetectionDetail from './components/DetectionDetail'; // Existing import
import ShannonScoreWeightsForm from './components/ShannonScoreWeightsForm'; // Existing import
import Visualization from './components/Visualization';
import Home from './components/Home';
import ShannonScoreExplanation from './components/ShannonScoreExplanation'; // New import

function AppContent() {
  const [drawerOpen, setDrawerOpen] = useState(false);
  const navigate = useNavigate(); // For navigation

  const menuItems = [
    { text: 'Home', icon: <HomeIcon />, path: '/' },
    { text: 'Upload CSV', icon: <UploadFile />, path: '/upload' },
    { text: 'Add Detection', icon: <AddCircle />, path: '/add-detection' },
    { text: 'Detections', icon: <ListAlt />, path: '/detections' },
    { text: 'Visualization', icon: <BarChart />, path: '/visualization' },
    { text: 'Adjust Weights', icon: <SettingsIcon />, path: '/adjust-weights' }, // Existing menu item
    { text: 'Shannon Score Explanation', icon: <InfoIcon />, path: '/shannon-score-explanation' }, // New menu item
  ];

  return (
    <>
      <CssBaseline />
      <AppBar position="static">
        <Toolbar>
          <IconButton edge="start" color="inherit" onClick={() => setDrawerOpen(true)}>
            <MenuIcon />
          </IconButton>
          <Typography variant="h6">
            DATA - Detection & Threat Analytics Tracking Application
          </Typography>
        </Toolbar>
      </AppBar>
      <Drawer open={drawerOpen} onClose={() => setDrawerOpen(false)}>
        <List>
          {menuItems.map((item) => (
            <ListItem
              button
              key={item.text}
              onClick={() => {
                setDrawerOpen(false);
                navigate(item.path);
              }}
            >
              <ListItemIcon>{item.icon}</ListItemIcon>
              <ListItemText primary={item.text} />
            </ListItem>
          ))}
        </List>
      </Drawer>
      <Container>
        <Box my={4}>
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/upload" element={<UploadCSV />} />
            <Route path="/add-detection" element={<DetectionForm />} />
            <Route path="/detections" element={<DetectionList />} />
            <Route path="/detections/:id" element={<DetectionDetail />} /> {/* Existing route */}
            <Route path="/detections/:id/edit" element={<DetectionForm isEdit />} /> {/* Existing route */}
            <Route path="/adjust-weights" element={<ShannonScoreWeightsForm />} /> {/* Existing route */}
            <Route path="/shannon-score-explanation" element={<ShannonScoreExplanation />} /> {/* New route */}
            <Route path="/visualization" element={<Visualization />} />
            {/* Optional: Add a 404 Not Found route */}
            <Route path="*" element={<Typography variant="h5">404 - Page Not Found</Typography>} />
          </Routes>
        </Box>
      </Container>
    </>
  );
}

function App() {
  return (
    <Router>
      <AppContent />
    </Router>
  );
}

export default App;