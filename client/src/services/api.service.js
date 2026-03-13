import { API_URL } from "../apiConfig";

const getHeaders = () => ({
  'Content-Type': 'application/json',
  'Authorization': `Bearer ${localStorage.getItem('token')}`
});

export const screeningService = {
  getAll: async () => {
    const response = await fetch(`${API_URL}/api/screenings`, { headers: getHeaders() });
    if (!response.ok) throw new Error('Gagal mengambil data skrining');
    return response.json();
  },
  
  getHistory: async (userId) => {
    const response = await fetch(`${API_URL}/api/screenings/history/${userId}`, { headers: getHeaders() });
    if (!response.ok) throw new Error('Gagal mengambil riwayat skrining');
    return response.json();
  },

  updateNotes: async (id, data) => {
    const response = await fetch(`${API_URL}/api/screenings/${id}/notes`, {
      method: 'PUT',
      headers: getHeaders(),
      body: JSON.stringify(data)
    });
    if (!response.ok) throw new Error('Gagal mengupdate catatan');
    return response.json();
  },

  delete: async (id) => {
    const response = await fetch(`${API_URL}/api/screenings/${id}`, {
      method: 'DELETE',
      headers: getHeaders()
    });
    if (!response.ok) throw new Error('Gagal menghapus riwayat');
    return response.json();
  }
};

export const userService = {
  getAll: async (role = '') => {
    const url = role ? `${API_URL}/api/users?role=${role}` : `${API_URL}/api/users`;
    const response = await fetch(url, { headers: getHeaders() });
    if (!response.ok) throw new Error('Gagal mengambil data user');
    return response.json();
  },

  getPatients: async () => {
    const response = await fetch(`${API_URL}/api/users?role=pasien`, { headers: getHeaders() });
    if (!response.ok) throw new Error('Gagal mengambil data pasien');
    return response.json();
  },

  deletePatient: async (id) => {
    const response = await fetch(`${API_URL}/api/users/${id}`, {
      method: 'DELETE',
      headers: getHeaders()
    });
    if (!response.ok) throw new Error('Gagal menghapus data pasien');
    return response.json();
  }
};
