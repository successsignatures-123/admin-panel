import api from '../lib/axios';

export const authAPI = {
  login: (data: any) => api.post('/auth/login', data),
  register: (data: any) => api.post('/auth/register', data),
};

export const statsAPI = {
    getAllStats: () => api.get('/stats')
}

export const jobsAPI = {
  getAllJobs: () => api.get('/jobs'),
  deleteJob: (id: string) => api.delete(`/jobs/${id}`), 
};

export const usersAPI = {
  getAllUsers: () => api.get('/users'),
  toggleEmployerStatus: (id: string, status: boolean) => api.patch(`/users/approve-employer/${id}`, { status }),
  deleteUser: (id: string) => api.delete(`/users/${id}`)
};

export const applicationsAPI = {  
  getAllApplications: () => api.get('/applications'),
  updateApplicationStatus: (id: string, status: string) => api.patch(`/applications/status/${id}`, { status })
};