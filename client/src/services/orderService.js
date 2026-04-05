import api from './api';

export const orderService = {
    async createOrder(orderData) {
        const response = await api.post('/orders', orderData);
        return response.data;
    },

    async getOrders() {
        const response = await api.get('/orders');
        return response.data;
    },

    async getOrderById(id) {
        const response = await api.get(`/orders/${id}`);
        return response.data;
    },

    async createRazorpayOrder(amount) {
        const response = await api.post('/orders/razorpay', { amount });
        return response.data;
    },

    async verifyPayment(paymentData) {
        const response = await api.post('/orders/verify', paymentData);
        return response.data;
    },

    async cancelOrder(orderId) {
        const response = await api.patch(`/orders/${orderId}/cancel`);
        return response.data;
    },

    async returnOrder(orderId, reason) {
        const response = await api.patch(`/orders/${orderId}/return`, { reason });
        return response.data;
    }
};
