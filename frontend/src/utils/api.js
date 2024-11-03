import axios from 'axios';

// Define the base URL for the API
const API_URL = 'http://localhost:8000/api';

// ---------------------------
// Detection-related API calls
// ---------------------------

/**
 * Upload a CSV file to the backend.
 * @param {File} file - The CSV file to upload.
 * @returns {Promise} - Axios POST request promise.
 */
export const uploadCSV = (file) => {
  let formData = new FormData();
  formData.append('file', file);
  return axios.post(`${API_URL}/detections/upload_csv/`, formData, {
    headers: {
      'Content-Type': 'multipart/form-data',
    },
  });
};

/**
 * Retrieve all Detection instances.
 * @returns {Promise} - Axios GET request promise.
 */
export const getDetections = () => axios.get(`${API_URL}/detections/`);

/**
 * Retrieve a specific Detection by ID.
 * @param {number} id - The ID of the Detection.
 * @returns {Promise} - Axios GET request promise.
 */
export const getDetection = (id) => axios.get(`${API_URL}/detections/${id}/`);

/**
 * Add a new Detection.
 * @param {Object} detection - The Detection data to add.
 * @returns {Promise} - Axios POST request promise.
 */
export const addDetection = (detection) => axios.post(`${API_URL}/detections/`, detection);

/**
 * Update an existing Detection by ID.
 * @param {number} id - The ID of the Detection to update.
 * @param {Object} data - The updated Detection data.
 * @returns {Promise} - Axios PUT request promise.
 */
export const updateDetection = (id, data) => axios.put(`${API_URL}/detections/${id}/`, data);

/**
 * Delete a Detection by ID.
 * @param {number} id - The ID of the Detection to delete.
 * @returns {Promise} - Axios DELETE request promise.
 */
export const deleteDetection = (id) => axios.delete(`${API_URL}/detections/${id}/`);

/**
 * Calculate the Shannon score for a specific Detection by ID.
 * @param {number} id - The ID of the Detection.
 * @returns {Promise} - Axios POST request promise.
 */
export const calculateScore = (id) => axios.post(`${API_URL}/detections/${id}/calculate_score/`);

/**
 * Classify MITRE ATT&CK mappings for a specific Detection by ID.
 * @param {number} id - The ID of the Detection.
 * @returns {Promise} - Axios POST request promise.
 */
export const classifyMitre = (id) => axios.post(`${API_URL}/detections/${id}/classify_mitre/`);

// ---------------------------
// Shannon Score Weights API calls
// ---------------------------

// Define the singleton ID for ShannonScoreWeights
const SHANNON_WEIGHTS_ID = 1;

/**
 * Retrieve the ShannonScoreWeights instance.
 * @returns {Promise} - Axios GET request promise.
 */
export const getShannonScoreWeights = () => axios.get(`${API_URL}/shannon-score-weights/${SHANNON_WEIGHTS_ID}/`);

/**
 * Update the ShannonScoreWeights instance.
 * @param {Object} weights - The updated weights data.
 * @returns {Promise} - Axios PUT request promise.
 */
export const updateShannonScoreWeights = (weights) => {
  return axios.put(`${API_URL}/shannon-score-weights/${SHANNON_WEIGHTS_ID}/`, weights);
};