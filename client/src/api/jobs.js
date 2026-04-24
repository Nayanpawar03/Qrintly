import API from "./axios";

export const uploadJob = (shopId, formData) =>
    API.post(`/jobs/${shopId}`, formData, {
        headers: { 'Content-Type': 'multipart/form-data' },
    });

export const getJobs = () => API.get('/jobs');
export const getJobById = (jobId) => API.get(`/jobs/${encodeURIComponent(jobId)}`);
export const trackJob = (jobId) => API.get(`/jobs/track/${encodeURIComponent(jobId)}`);
export const updateJobStatus = (jobId, status) =>
    API.patch(`/jobs/${encodeURIComponent(jobId)}/status`, { status });
export const getAnalytics = () => API.get('/jobs/analytics');
export const clearCompleted = () => API.delete('/jobs/completed');