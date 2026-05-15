import api from '../lib/axios';

export const authAPI = {
  login: (data: any) => api.post('/auth/login', data),
  register: (data: any) => api.post('/auth/register', data),
};

export const statsAPI = {
    getAllStats: () => api.get('/admin/stats')
};

export const jobsAPI = {
    getAllJobs: () => api.get('/jobs'),
    deleteJob: (id: string) => api.delete(`/admin/jobs/${id}`)
};

export const applicationsAPI = {
    getEmployerApplicants: () => api.get('/applications/all-applicants'),
    updateApplicationStatus: (id: string, status: string) => api.patch(`/admin/applications/status/${id}`, { status })
};

export const usersAPI = {
    getAllUsers: () => api.get('/admin/users'),
    toggleEmployerStatus: (id: string, status: boolean) => api.patch(`/admin/users/approve-employer/${id}`, { status })
};