import api from './api';

export const authService = {
  register: (data) => api.post('/auth/register', data),
  login: (email, password) => api.post('/auth/login', { email, password }),
  getAllUsers: () => api.get('/auth/users'),
  getUserById: (id) => api.get(`/auth/users/${id}`),
  updateUser: (id, data) => api.put(`/auth/users/${id}`, data),
  deleteUser: (id) => api.delete(`/auth/users/${id}`),
};

export const clientService = {
  create: (data) => api.post('/clients', data),
  getAll: () => api.get('/clients'),
  getById: (id) => api.get(`/clients/${id}`),
  update: (id, data) => api.put(`/clients/${id}`, data),
  delete: (id) => api.delete(`/clients/${id}`),
};

export const machineService = {
  create: (data) => api.post('/machines', data),
  getAll: () => api.get('/machines'),
  getById: (id) => api.get(`/machines/${id}`),
  getByClient: (clienteId) => api.get(`/machines/cliente/${clienteId}`),
  update: (id, data) => api.put(`/machines/${id}`, data),
  delete: (id) => api.delete(`/machines/${id}`),
};

export const contractService = {
  create: (data) => api.post('/contracts', data),
  getAll: () => api.get('/contracts'),
  getById: (id) => api.get(`/contracts/${id}`),
  getByClient: (clienteId) => api.get(`/contracts/cliente/${clienteId}`),
  update: (id, data) => api.put(`/contracts/${id}`, data),
  delete: (id) => api.delete(`/contracts/${id}`),
};

export const osService = {
  create: (data) => api.post('/os', data),
  getAll: () => api.get('/os'),
  getById: (id) => api.get(`/os/${id}`),
  getPendingByCity: (city) => api.get(`/os/cidade/${city}`),
  update: (id, data) => api.put(`/os/${id}`, data),
  assignTechnician: (id, tecnicoId) => api.put(`/os/${id}/atribuir`, { tecnicoId }),
  finishOS: (id, data) => api.put(`/os/${id}/finalizar`, data),
  delete: (id) => api.delete(`/os/${id}`),
};

export const supplyService = {
  create: (data) => api.post('/supplies', data),
  getAll: () => api.get('/supplies'),
  getById: (id) => api.get(`/supplies/${id}`),
  update: (id, data) => api.put(`/supplies/${id}`, data),
  delete: (id) => api.delete(`/supplies/${id}`),
  requestSupply: (data) => api.post('/supplies/request', data),
  getOrders: () => api.get('/supplies/orders'),
  updateOrder: (id, data) => api.put(`/supplies/order/${id}`, data),
};

export const counterService = {
  create: (data) => api.post('/counters', data),
  getAll: () => api.get('/counters'),
  getByMachine: (machineId) => api.get(`/counters/maquina/${machineId}`),
  fetchFromAPI: (machineId) => api.post(`/counters/fetch/${machineId}`),
  getMonthlyReport: (clienteId, mes) => api.get(`/counters/relatorio/${clienteId}/${mes}`),
};

export const billingService = {
  create: (data) => api.post('/billings', data),
  generateMonthly: (data) => api.post('/billings/gerar', data),
  getAll: () => api.get('/billings'),
  getById: (id) => api.get(`/billings/${id}`),
  getByClient: (clienteId) => api.get(`/billings/cliente/${clienteId}`),
  update: (id, data) => api.put(`/billings/${id}`, data),
};

export const deliveryNoteService = {
  create: (data) => api.post('/delivery-notes', data),
  getAll: (filters) => api.get('/delivery-notes', { params: filters }),
  getById: (id) => api.get(`/delivery-notes/${id}`),
  getByNumber: (numeroNota) => api.get(`/delivery-notes/numero/${numeroNota}`),
  update: (id, data) => api.put(`/delivery-notes/${id}`, data),
  send: (id) => api.put(`/delivery-notes/${id}/enviar`),
  markAsDelivered: (id) => api.put(`/delivery-notes/${id}/entregar`),
  confirm: (id, data) => api.put(`/delivery-notes/${id}/confirmar`, data),
  cancel: (id, data) => api.put(`/delivery-notes/${id}/cancelar`, data),
  delete: (id) => api.delete(`/delivery-notes/${id}`),
  getStats: (filters) => api.get('/delivery-notes/stats', { params: filters }),
};
