import axios from 'axios';

const api = axios.create({
  baseURL: 'http://localhost:8080/vaccine-drive/v1',  // Replace with your backend API base URL
  headers: {
    'Content-Type': 'application/json',
  },
});

export default api;
