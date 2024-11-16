import api from "./api";

export const reportService = {
  generateReport: async (params) => {
    const response = await api.post("/reports/generate", params);
    return response.data;
  },

  getReportsList: async (params) => {
    const response = await api.get("/reports", { params });
    return response.data;
  },

  downloadReport: async (dateRange, format) => {
    const response = await api.get(`/reports/download`, {
      params: {
        startDate: dateRange.startDate,
        endDate: dateRange.endDate,
        format,
      },
      responseType: "blob",
    });
    return response.data;
  },

  getAttendanceReport: async (params) => {
    const response = await api.get("/reports/attendance", { params });
    return response.data;
  },

  getDepartmentReport: async (params) => {
    const response = await api.get("/reports/department", { params });
    return response.data;
  },

  getCustomReport: async (params) => {
    const response = await api.post("/reports/custom", params);
    return response.data;
  },
};
