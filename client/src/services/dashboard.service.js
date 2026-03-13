import { API_URL } from "../apiConfig";

const getHeaders = () => ({
  'Content-Type': 'application/json',
  'Authorization': `Bearer ${localStorage.getItem('token')}`
});

export const dashboardService = {
  getStats: async (period = '7days') => {
    const response = await fetch(`${API_URL}/api/dashboard/stats?period=${period}`, { headers: getHeaders() });
    if (!response.ok) throw new Error('Gagal mengambil data statistik');
    return response.json();
  }
};
