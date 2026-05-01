import axios from 'axios';

const API = axios.create({ baseURL: 'http://localhost:5000/api' });

// ഓരോ റിക്വസ്റ്റിലും ടോക്കൺ ഉണ്ടോ എന്ന് പരിശോധിക്കാനുള്ള മിഡിൽവെയർ
API.interceptors.request.use((req) => {
  const token = localStorage.getItem('token');
  if (token) {
    req.headers.Authorization = `Bearer ${token}`;
  }
  return req;
});

export const login = (formData) => API.post('/users/login', formData);
export const fetchCustomers = () => API.get('/customers');
export const addCustomer = (data) => API.post('/customers/add', data);