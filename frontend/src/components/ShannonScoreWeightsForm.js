import React, { useState, useEffect } from 'react';
import { getShannonScoreWeights, updateShannonScoreWeights } from '../utils/api';
import { TextField, Button, Box, Typography } from '@mui/material';

function ShannonScoreWeightsForm() {
  const [weights, setWeights] = useState({
    tac_weight: '',
    di_weight: '',
    oc_weight: '',
    irp_weight: '',
    u_weight: '',
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    fetchWeights();
  }, []);

  const fetchWeights = () => {
    setLoading(true);
    getShannonScoreWeights()
      .then((res) => {
        const data = res.data; // Corrected from res.data[0] to res.data
        setWeights({
          tac_weight: data.tac_weight || '',
          di_weight: data.di_weight || '',
          oc_weight: data.oc_weight || '',
          irp_weight: data.irp_weight || '',
          u_weight: data.u_weight || '',
        });
        setLoading(false);
      })
      .catch((err) => {
        console.error(err);
        setError('Failed to fetch weights.');
        setLoading(false);
      });
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setWeights({ ...weights, [name]: value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    setError('');

    // Validate that the sum equals 1
    const total = parseFloat(weights.tac_weight) + parseFloat(weights.di_weight) +
                  parseFloat(weights.oc_weight) + parseFloat(weights.irp_weight) +
                  parseFloat(weights.u_weight);

    if (Math.abs(total - 1.0) > 0.0001) {
      setError('The sum of all weights must equal 1.');
      return;
    }

    const data = {
      tac_weight: parseFloat(weights.tac_weight),
      di_weight: parseFloat(weights.di_weight),
      oc_weight: parseFloat(weights.oc_weight),
      irp_weight: parseFloat(weights.irp_weight),
      u_weight: parseFloat(weights.u_weight),
    };
    updateShannonScoreWeights(data)
      .then(() => {
        alert('Weights updated successfully');
      })
      .catch((err) => {
        console.error(err);
        setError('Failed to update weights.');
      });
  };

  return (
    <Box sx={{ maxWidth: 600, mx: 'auto' }}>
      <Typography variant="h4" component="h1" gutterBottom>
        Adjust Shannon Score Weights
      </Typography>
      {error && <Typography color="error">{error}</Typography>}
      {loading ? (
        <Typography>Loading...</Typography>
      ) : (
        <form onSubmit={handleSubmit}>
          <TextField
            label="TAC Weight"
            name="tac_weight"
            value={weights.tac_weight}
            onChange={handleChange}
            fullWidth
            required
            margin="normal"
            type="number"
            inputProps={{
              step: 0.01,
              min: 0,
              max: 1,
            }}
          />
          <TextField
            label="DI Weight"
            name="di_weight"
            value={weights.di_weight}
            onChange={handleChange}
            fullWidth
            required
            margin="normal"
            type="number"
            inputProps={{
              step: 0.01,
              min: 0,
              max: 1,
            }}
          />
          <TextField
            label="OC Weight"
            name="oc_weight"
            value={weights.oc_weight}
            onChange={handleChange}
            fullWidth
            required
            margin="normal"
            type="number"
            inputProps={{
              step: 0.01,
              min: 0,
              max: 1,
            }}
          />
          <TextField
            label="IRP Weight"
            name="irp_weight"
            value={weights.irp_weight}
            onChange={handleChange}
            fullWidth
            required
            margin="normal"
            type="number"
            inputProps={{
              step: 0.01,
              min: 0,
              max: 1,
            }}
          />
          <TextField
            label="U Weight"
            name="u_weight"
            value={weights.u_weight}
            onChange={handleChange}
            fullWidth
            required
            margin="normal"
            type="number"
            inputProps={{
              step: 0.01,
              min: 0,
              max: 1,
            }}
          />
          <Typography variant="body2" color={Math.abs(parseFloat(weights.tac_weight) + parseFloat(weights.di_weight) + parseFloat(weights.oc_weight) + parseFloat(weights.irp_weight) + parseFloat(weights.u_weight) - 1.0) > 0.0001 ? 'error' : 'textSecondary'}>
            Sum of weights: {parseFloat(weights.tac_weight) + parseFloat(weights.di_weight) + parseFloat(weights.oc_weight) + parseFloat(weights.irp_weight) + parseFloat(weights.u_weight)} (Must equal 1.0)
          </Typography>
          <Button variant="contained" color="primary" type="submit" sx={{ mt: 2 }}>
            Update Weights
          </Button>
        </form>
      )}
    </Box>
  );
}

export default ShannonScoreWeightsForm;