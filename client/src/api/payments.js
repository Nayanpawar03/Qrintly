import API from './axios';

export const createOrder = (data) => API.post('/payments/create-order', data);
export const verifyPayment = (data) => API.post('/payments/verify', data);
export const getSubscription = () => API.get('/payments/subscription');
