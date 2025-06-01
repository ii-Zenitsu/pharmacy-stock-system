import axios from 'axios';

const API_URL = import.meta.env.VITE_API_URL;

export default {
    GetCurrentStatus: async () => {
        try {
            const response = await axios.get(`${API_URL}/pharmacy/status`);
            return response.data;
        } catch (error) {
            console.error('Error fetching pharmacy status:', error);
            return {
                success: false,
                message: error.response?.data?.message || 'Failed to fetch pharmacy status'
            };
        }
    },

    GetAllSettings: async () => {
        try {
            const response = await axios.get(`${API_URL}/pharmacy/settings`);
            return response.data;
        } catch (error) {
            console.error('Error fetching pharmacy settings:', error);
            return {
                success: false,
                message: error.response?.data?.message || 'Failed to fetch pharmacy settings'
            };
        }
    },

    UpdateSettings: async (settings) => {
        try {
            const response = await axios.post(`${API_URL}/pharmacy/settings`, settings, {
                headers: {
                    'Authorization': `Bearer ${localStorage.getItem('token')}`
                }
            });
            return response.data;
        } catch (error) {
            console.error('Error updating pharmacy settings:', error);
            return {
                success: false,
                message: error.response?.data?.message || 'Failed to update pharmacy settings'
            };
        }
    }
}; 