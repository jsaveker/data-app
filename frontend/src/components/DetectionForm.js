import React, { useState, useEffect } from 'react';
import {
  addDetection,
  getDetection,
  updateDetection,
  classifyMitre,
  calculateScore,
} from '../utils/api';
import { useNavigate, useParams } from 'react-router-dom';
import {
  TextField,
  Button,
  Box,
  Typography,
  FormControlLabel,
  Checkbox,
} from '@mui/material';

function DetectionForm({ isEdit = false }) {
  const [formData, setFormData] = useState({
    name: '',
    logic: '',
    description: '',
    tac: '',
    di: '',
    oc: '',
    irp: '',
    u: '',
    mitre_tactics: '',
    mitre_techniques: '',
  });

  const navigate = useNavigate();
  const { id } = useParams();

  useEffect(() => {
    if (isEdit && id) {
      fetchDetection();
    }
  }, [isEdit, id]);

  const fetchDetection = () => {
    getDetection(id)
      .then((res) => {
        const data = res.data;
        setFormData({
          name: data.name || '',
          logic: data.logic || '',
          description: data.description || '',
          tac: data.tac !== null ? data.tac : '',
          di: data.di !== null ? data.di : '',
          oc: data.oc !== null ? data.oc : '',
          irp: data.irp !== null ? data.irp : '',
          u: data.u !== null ? data.u : '',
          mitre_tactics: data.mitre_tactics ? data.mitre_tactics.join(', ') : '',
          mitre_techniques: data.mitre_techniques
            ? data.mitre_techniques.join(', ')
            : '',
        });
      })
      .catch((err) => console.error(err));
  };

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData({
      ...formData,
      [name]: type === 'checkbox' ? checked : value,
    });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    // Prepare data
    const data = {
      ...formData,
      tac: formData.tac !== '' ? parseFloat(formData.tac) : null,
      di: formData.di !== '' ? parseFloat(formData.di) : null,
      oc: formData.oc !== '' ? parseFloat(formData.oc) : null,
      irp: formData.irp !== '' ? parseFloat(formData.irp) : null,
      u: formData.u !== '' ? parseFloat(formData.u) : null,
      mitre_tactics: formData.mitre_tactics
        ? formData.mitre_tactics.split(',').map((item) => item.trim())
        : [],
      mitre_techniques: formData.mitre_techniques
        ? formData.mitre_techniques.split(',').map((item) => item.trim())
        : [],
    };

    const apiCall = isEdit ? updateDetection(id, data) : addDetection(data);

    apiCall
      .then(() => {
        alert(`Detection ${isEdit ? 'updated' : 'added'} successfully`);
        navigate(`/detections${isEdit ? `/${id}` : ''}`);
      })
      .catch((err) => {
        console.error(err);
        alert(`Failed to ${isEdit ? 'update' : 'add'} detection: ${err.message}`);
      });
  };

  // Function to classify MITRE ATT&CK mappings
  const handleClassifyMitre = () => {
    classifyMitre(id)
      .then((res) => {
        alert('MITRE ATT&CK mappings updated successfully');
        fetchDetection(); // Refresh the form data
      })
      .catch((err) => {
        console.error(err);
        alert('Failed to classify MITRE ATT&CK mappings');
      });
  };

  // Function to calculate Shannon score
  const handleCalculateScore = () => {
    calculateScore(id)
      .then((res) => {
        alert('Shannon score calculated successfully');
        fetchDetection(); // Refresh the form data
      })
      .catch((err) => {
        console.error(err);
        alert('Failed to calculate Shannon score');
      });
  };

  return (
    <Box sx={{ maxWidth: 600, mx: 'auto' }}>
      <Typography variant="h4" component="h1" gutterBottom>
        {isEdit ? 'Edit' : 'Add'} Detection
      </Typography>
      <form onSubmit={handleSubmit}>
        <TextField
          label="Name"
          name="name"
          value={formData.name}
          onChange={handleChange}
          fullWidth
          required
          margin="normal"
        />
        <TextField
          label="Logic"
          name="logic"
          value={formData.logic}
          onChange={handleChange}
          fullWidth
          required
          margin="normal"
          multiline
          rows={4}
        />
        <TextField
          label="Description"
          name="description"
          value={formData.description}
          onChange={handleChange}
          fullWidth
          required
          margin="normal"
          multiline
          rows={4}
        />
        {/* Shannon Score Elements */}
        <TextField
          label="TAC"
          name="tac"
          value={formData.tac}
          onChange={handleChange}
          fullWidth
          margin="normal"
          type="number"
          InputProps={{ inputProps: { min: 0, max: 100 } }}
        />
        <TextField
          label="DI"
          name="di"
          value={formData.di}
          onChange={handleChange}
          fullWidth
          margin="normal"
          type="number"
          InputProps={{ inputProps: { min: 0, max: 100 } }}
        />
        <TextField
          label="OC"
          name="oc"
          value={formData.oc}
          onChange={handleChange}
          fullWidth
          margin="normal"
          type="number"
          InputProps={{ inputProps: { min: 0, max: 100 } }}
        />
        <TextField
          label="IRP"
          name="irp"
          value={formData.irp}
          onChange={handleChange}
          fullWidth
          margin="normal"
          type="number"
          InputProps={{ inputProps: { min: 0, max: 100 } }}
        />
        <TextField
          label="U"
          name="u"
          value={formData.u}
          onChange={handleChange}
          fullWidth
          margin="normal"
          type="number"
          InputProps={{ inputProps: { min: 0, max: 100 } }}
        />
        {/* MITRE ATT&CK Mappings */}
        <TextField
          label="MITRE ATT&CK Tactics (comma-separated)"
          name="mitre_tactics"
          value={formData.mitre_tactics}
          onChange={handleChange}
          fullWidth
          margin="normal"
        />
        <TextField
          label="MITRE ATT&CK Techniques (comma-separated)"
          name="mitre_techniques"
          value={formData.mitre_techniques}
          onChange={handleChange}
          fullWidth
          margin="normal"
        />

        <Button variant="contained" color="primary" type="submit" sx={{ mt: 2 }}>
          {isEdit ? 'Update' : 'Add'} Detection
        </Button>

        {isEdit && (
          <>
            <Button
              variant="outlined"
              color="secondary"
              onClick={handleClassifyMitre}
              sx={{ mt: 2, ml: 2 }}
            >
              Classify MITRE ATT&CK
            </Button>
            <Button
              variant="outlined"
              color="secondary"
              onClick={handleCalculateScore}
              sx={{ mt: 2, ml: 2 }}
            >
              Calculate Shannon Score
            </Button>
          </>
        )}
      </form>
    </Box>
  );
}

export default DetectionForm;