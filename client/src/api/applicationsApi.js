import axiosClient from './axiosClient';

const applicationsApi = {
  // GET /api/applications with optional query params
  getAll: async (params = {}) => {
    const res = await axiosClient.get('/applications', { params });
    return res.data; // { success, count, total, page, pages, applications }
  },

  // GET /api/applications/:id
  getById: async (id) => {
    const res = await axiosClient.get(`/applications/${id}`);
    return res.data.application;
  },

  // POST /api/applications
  create: async (data) => {
    const res = await axiosClient.post('/applications', data);
    return res.data.application;
  },

  // PUT /api/applications/:id
  update: async (id, data) => {
    const res = await axiosClient.put(`/applications/${id}`, data);
    return res.data.application;
  },

  // DELETE /api/applications/:id
  remove: async (id) => {
    const res = await axiosClient.delete(`/applications/${id}`);
    return res.data;
  },

  // GET /api/applications/stats
  getStats: async () => {
    const res = await axiosClient.get('/applications/stats');
    return res.data.stats;
  },
};

export default applicationsApi;