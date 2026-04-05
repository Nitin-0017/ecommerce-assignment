import React, { createContext, useState, useContext, useEffect } from 'react';
import { cartService } from '../services/cartService';
import { authService } from '../services/authService';

const CartContext = createContext();

export const useCart = () => {
    const context = useContext(CartContext);
    if (!context) {
        throw new Error('useCart must be used within CartProvider');
    }
    return context;
};

export const CartProvider = ({ children }) => {
    const [cart, setCart] = useState({ items: [] });
    const [loading, setLoading] = useState(false);
    const [selectedItemIds, setSelectedItemIds] = useState(() => {
        const saved = localStorage.getItem('selectedItemIds');
        return saved ? JSON.parse(saved) : [];
    });

    useEffect(() => {
        localStorage.setItem('selectedItemIds', JSON.stringify(selectedItemIds));
    }, [selectedItemIds]);

    useEffect(() => {
        if (authService.isAuthenticated()) {
            fetchCart();
        }
    }, []);

    const fetchCart = async () => {
        try {
            setLoading(true);
            const cartData = await cartService.getCart();
            const currentCart = cartData.cart || { items: [] };
            setCart(currentCart);

            setSelectedItemIds(prev => prev.filter(id =>
                currentCart.items.some(item => item.product._id === id)
            ));
        } catch (error) {
            console.error('Error fetching cart:', error);
        } finally {
            setLoading(false);
        }
    };

    const addToCart = async (product, quantity = 1) => {
        try {
            const response = await cartService.addToCart(product._id || product.id, quantity);
            setCart(response.cart);

            setSelectedItemIds(prev => [...new Set([...prev, product._id || product.id])]);
            return response;
        } catch (error) {
            console.error('Error adding to cart:', error);
            throw error;
        }
    };

    const updateQuantity = async (productId, quantity) => {
        try {
            const response = await cartService.updateCartItem(productId, quantity);
            setCart(response.cart);
            return response;
        } catch (error) {
            console.error('Error updating cart:', error);
            throw error;
        }
    };

    const removeFromCart = async (productId) => {
        try {
            const response = await cartService.removeFromCart(productId);
            setCart(response.cart);
            setSelectedItemIds(prev => prev.filter(id => id !== productId));
            return response;
        } catch (error) {
            console.error('Error removing from cart:', error);
            throw error;
        }
    };

    const clearCart = async () => {
        try {
            const response = await cartService.clearCart();
            setCart(response.cart);
            setSelectedItemIds([]);
            return response;
        } catch (error) {
            console.error('Error clearing cart:', error);
            throw error;
        }
    };

    const toggleSelectItem = (productId) => {
        setSelectedItemIds(prev =>
            prev.includes(productId)
                ? prev.filter(id => id !== productId)
                : [...prev, productId]
        );
    };

    const toggleSelectAll = (checked) => {
        if (checked) {
            setSelectedItemIds(cart.items.map(item => item.product._id));
        } else {
            setSelectedItemIds([]);
        }
    };

    const cartCount = cart?.items?.reduce((totalQuantity, item) => totalQuantity + item.quantity, 0) || 0;
    const selectedCount = selectedItemIds.length;

    const value = {
        cart,
        loading,
        cartCount,
        selectedItemIds,
        selectedCount,
        addToCart,
        updateQuantity,
        removeFromCart,
        clearCart,
        toggleSelectItem,
        toggleSelectAll,
        refreshCart: fetchCart
    };

    return <CartContext.Provider value={value}>{children}</CartContext.Provider>;
};
