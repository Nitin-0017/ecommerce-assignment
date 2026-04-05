import api from './api';

export const productService = {
    async getProducts(filters = {}) {
        const params = new URLSearchParams();

        if (filters.category) params.append('category', filters.category);
        if (filters.minPrice) params.append('minPrice', filters.minPrice);
        if (filters.maxPrice) params.append('maxPrice', filters.maxPrice);
        if (filters.minRating) params.append('minRating', filters.minRating);
        if (filters.search) params.append('search', filters.search);
        if (filters.sort) params.append('sort', filters.sort);
        if (filters.limit) params.append('limit', filters.limit);

        const response = await api.get(`/products?${params.toString()}`);
        return response.data;
    },

    async getProductById(id) {
        const response = await api.get(`/products/${id}`);
        return response.data;
    },

    async getRelatedProducts(id) {
        const response = await api.get(`/products/${id}/related`);
        return response.data;
    },

    async getProductReviews(id) {
        const response = await api.get(`/products/${id}/reviews`);
        return response.data;
    },

    async addProductReview(id, reviewData) {
        const response = await api.post(`/products/${id}/reviews`, reviewData);
        return response.data;
    }
};
