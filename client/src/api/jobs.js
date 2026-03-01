import API from "./axios";

export const uploadJob = (shopId, formData) =>
    API.post(`/jobs/${shopId}`, formData, {
        headers: { 'Content-Type': 'multipart/form-data' },
    });

export const getJobs = () => API.get('/jobs');
export const getJobById = (jobId) => API.get(`/jobs/${jobId}`);
export const trackJob = (jobId) => API.get(`/jobs/track/${jobId}`);
export const updateJobStatus = (jobId, status) =>
    API.patch(`/jobs/${jobId}/status`, { status });
export const getAnalytics = () => API.get('/jobs/analytics');