import api from './api';

export const authService = {
    async signup(userData) {
        const response = await api.post('/auth/signup', userData);
        if (response.data.success && response.data.token) {
            localStorage.setItem('token', response.data.token);
            localStorage.setItem('user', JSON.stringify(response.data.user));
        }
        return response.data;
    },

    async login(credentials) {
        const response = await api.post('/auth/login', credentials);
        if (response.data.success && response.data.token) {
            localStorage.setItem('token', response.data.token);
            localStorage.setItem('user', JSON.stringify(response.data.user));
        }
        return response.data;
    },

    logout() {
        localStorage.removeItem('token');
        localStorage.removeItem('user');
        localStorage.removeItem('cartItems');
        localStorage.removeItem('wishlist');
    },

    async getCurrentUser() {
        const response = await api.get('/auth/me');
        return response.data;
    },

    isAuthenticated() {
        return !!localStorage.getItem('token');
    },

    getStoredUser() {
        const user = localStorage.getItem('user');
        return user ? JSON.parse(user) : null;
    }
};
