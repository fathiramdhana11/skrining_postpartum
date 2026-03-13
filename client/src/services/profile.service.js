import { API_URL } from "../apiConfig";

const getHeaders = () => ({
  'Content-Type': 'application/json',
  'Authorization': `Bearer ${localStorage.getItem('token')}`
});

export const profileService = {
  getProfile: async (userId) => {
    const response = await fetch(`${API_URL}/api/users/${userId}`, { 
      headers: getHeaders() 
    });
    if (!response.ok) throw new Error('Gagal mengambil data profil');
    return response.json();
  },

  updateProfile: async (userId, profileData) => {
    const response = await fetch(`${API_URL}/api/users/${userId}`, {
      method: 'PUT',
      headers: getHeaders(),
      body: JSON.stringify({
        ...profileData,
        profile_completed: true
      })
    });
    if (!response.ok) throw new Error('Gagal memperbarui profil');
    return response.json();
  }
};
