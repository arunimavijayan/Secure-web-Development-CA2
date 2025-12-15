// SECURE API Service - Now includes credentials for cookie handling
const API_URL = 'http://localhost:5000/api';

export const login = async (username, password) => {
    const response = await fetch(`${API_URL}/login`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({ username, password }),
        credentials: 'include' // FIX 1
    });
    return await response.json();
};

export const getProducts = async () => {
    const response = await fetch(`${API_URL}/products`, {
        credentials: 'include' // FIX 2
    });
    return await response.json();
};

// Search users (for admin section)
export const searchUsers = async (searchQuery) => {
    const response = await fetch(`${API_URL}/search-users`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({ search: searchQuery }),
        credentials: 'include' // FIX 3
    });
    return await response.json();
};

// Add new product (admin only)
export const addProduct = async (productData) => {
    const response = await fetch(`${API_URL}/products`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(productData),
        credentials: 'include' // FIX 4
    });
    return await response.json();
};

// Delete product (admin only)
export const deleteProduct = async (productId) => {
    const response = await fetch(`${API_URL}/products/${productId}`, {
        method: 'DELETE',
        credentials: 'include' // FIX 5
    });
    return await response.json();
};