import api from "./api";

export const employeeService = {
  getAllEmployees: async (params) => {
    const response = await api.get("/users", { params });
    return response.data;
  },

  getEmployeeById: async (id) => {
    const response = await api.get(`/users/${id}`);
    return response.data;
  },

  createEmployee: async (employeeData) => {
    const response = await api.post("/auth/register", employeeData);
    return response.data;
  },

  updateEmployee: async (id, employeeData) => {
    const response = await api.put(`/users/${id}`, employeeData);
    return response.data;
  },

  deleteEmployee: async (id) => {
    const response = await api.delete(`/users/${id}`);
    return response.data;
  },

  getEmployeeStats: async () => {
    const response = await api.get("/users/stats");
    return response.data;
  },

  getDepartmentStats: async () => {
    const response = await api.get("/users/department-stats");
    return response.data;
  },
};
