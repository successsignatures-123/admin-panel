import api from '../lib/axios';

export const authAPI = {
  login: (data: any) => api.post('/auth/login', data),
  register: (data: any) => api.post('/auth/register', data),
};

export const adminAPI = {
    getAdmins: () => api.get('/admin/admins'),
    createAdmin: (data: any) => api.post('/admin/admins', data),
    updateAdmin: (id: string, data: any) => api.put(`/admin/admins/${id}`, data),
    deleteAdmin: (id: string) => api.delete(`/admin/admins/${id}`),
};

export const statsAPI = {
    getAllStats: () => api.get('/admin/stats'),
    getGraphStats: () => api.get('/admin/graph-stats'),
    getActiveVisitors:() => api.get('/admin/active-visitors')
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
    toggleEmployerStatus: (id: string, status: boolean) => api.patch(`/admin/users/approve-employer/${id}`, { status }),
    deleteUser: (id: string) => api.delete(`/admin/users/${id}`)
};