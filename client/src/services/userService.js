import api from './api';

export const userService = {
    async getProfile() {
        const response = await api.get('/user/profile');
        return response.data;
    },

    async updateProfile(profileData) {
        const response = await api.put('/user/profile', profileData);
        return response.data;
    },

    async addAddress(addressData) {
        const response = await api.post('/user/addresses', addressData);
        return response.data;
    },

    async updateAddress(id, addressData) {
        const response = await api.put(`/user/addresses/${id}`, addressData);
        return response.data;
    },

    async deleteAddress(id) {
        const response = await api.delete(`/user/addresses/${id}`);
        return response.data;
    },

    async updateNotifications(notificationData) {
        const response = await api.patch('/user/notifications', notificationData);
        return response.data;
    }
};
