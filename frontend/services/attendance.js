import api from "./api";

export const attendanceService = {
  checkIn: async () => {
    const response = await api.post("/attendance/check-in");
    return response.data;
  },

  checkOut: async () => {
    const response = await api.post("/attendance/check-out");
    return response.data;
  },

  getMyAttendance: async (params) => {
    const response = await api.get("/attendance/my-attendance", { params });
    return response.data;
  },

  getAllAttendance: async (params) => {
    const response = await api.get("/attendance/all", { params });
    return response.data;
  },

  updateAttendance: async (id, data) => {
    const response = await api.put(`/attendance/${id}`, data);
    return response.data;
  },

  getAttendanceStats: async (params) => {
    const response = await api.get("/attendance/stats", { params });
    return response.data;
  },

  getAttendanceById: async (id) => {
    const response = await api.get(`/attendance/${id}`);
    return response.data;
  },

  updateAttendance: async (id, data) => {
    const response = await api.put(`/attendance/${id}`, data);
    return response.data;
  },
};
