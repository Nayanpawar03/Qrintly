import API from "./axios";

export const loginUser = (data) => API.post('/auth/login', data);
export const registerUser = (data) => API.post('/auth/register', data);
export const getMe = () => API.get('/auth/me');
export const uploadAvatar = (formData) => API.patch('/auth/avatar', formData, {
    headers: { 'Content-Type': 'multipart/form-data' },
});