import API from './axios';
export const submitFeedback = (data) => API.post('/feedback', data);
