// src/components/UploadCSV.jsx
import React, { useState } from 'react';
import { Button, Typography, Box, Alert, CircularProgress } from '@mui/material';
import { uploadCSV } from '../utils/api';
import GetAppIcon from '@mui/icons-material/GetApp'; // Import GetAppIcon

function UploadCSV() {
  const [file, setFile] = useState(null);
  const [uploading, setUploading] = useState(false);
  const [successMessage, setSuccessMessage] = useState('');
  const [errorMessages, setErrorMessages] = useState([]);

  // Function to handle CSV upload
  const handleSubmit = async (e) => {
    e.preventDefault();
    setSuccessMessage('');
    setErrorMessages([]);

    if (!file) {
      setErrorMessages(['Please select a CSV file to upload.']);
      return;
    }

    setUploading(true);
    try {
      const response = await uploadCSV(file);
      setSuccessMessage(response.data.detail);
      setFile(null); // Reset the file input
      // Optionally, you can trigger a refresh of the detections list here
    } catch (error) {
      if (error.response) {
        // Server responded with a status other than 2xx
        if (error.response.data.errors) {
          setErrorMessages(error.response.data.errors);
        } else if (error.response.data.error) {
          setErrorMessages([error.response.data.error]);
        } else {
          setErrorMessages(['An unknown error occurred during upload.']);
        }
      } else if (error.request) {
        // Request was made but no response received
        setErrorMessages(['No response from server. Please try again later.']);
      } else {
        // Something else happened
        setErrorMessages([error.message]);
      }
    } finally {
      setUploading(false);
    }
  };

  // Function to handle sample CSV download
  const handleDownloadSample = () => {
    const sampleData = `name,logic,description
Detection A,logic for A,Description for Detection A
Detection B,logic for B,Description for Detection B`;

    const blob = new Blob([sampleData], { type: 'text/csv' });
    const url = window.URL.createObjectURL(blob);

    const link = document.createElement('a');
    link.href = url;
    link.setAttribute('download', 'sample_detections.csv');
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <Box sx={{ maxWidth: 600, mx: 'auto', mt: 4, px: 2 }}>
      <Typography variant="h4" gutterBottom>
        Upload CSV
      </Typography>
      <Button
        variant="outlined"
        color="secondary"
        onClick={handleDownloadSample}
        startIcon={<GetAppIcon />}
        sx={{ mb: 2 }}
      >
        Download Sample CSV
      </Button>
      <form onSubmit={handleSubmit}>
        <input
          type="file"
          accept=".csv"
          onChange={(e) => setFile(e.target.files[0])}
          style={{ marginBottom: '16px' }}
          required
        />
        <br />
        <Button variant="contained" color="primary" type="submit" disabled={uploading}>
          {uploading ? <CircularProgress size={24} color="inherit" /> : 'Upload'}
        </Button>
      </form>

      {/* Display Success Message */}
      {successMessage && (
        <Alert severity="success" sx={{ mt: 2 }}>
          {successMessage}
        </Alert>
      )}

      {/* Display Error Messages */}
      {errorMessages.length > 0 && (
        <Box sx={{ mt: 2 }}>
          {errorMessages.map((msg, index) => (
            <Alert severity="error" key={index} sx={{ mb: 1 }}>
              {msg}
            </Alert>
          ))}
        </Box>
      )}
    </Box>
  );
}

export default UploadCSV;