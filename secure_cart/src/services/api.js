//VULNERABLE API Service - No error handling, no sanitization
const API_URL = 'http://localhost:5000/api';

export const login = async (username, password) => {
    const response = await fetch(`${API_URL}/login`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({ username, password })
    });
    return await response.json();
};

export const getProducts = async () => {
    const response = await fetch(`${API_URL}/products`);
    return await response.json();
};

// Search users (for admin section)
export const searchUsers = async (searchQuery) => {
    const response = await fetch(`${API_URL}/search-users`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({ search: searchQuery })
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
        body: JSON.stringify(productData)
    });
    return await response.json();
};

// Delete product (admin only)
export const deleteProduct = async (productId) => {
    const response = await fetch(`${API_URL}/products/${productId}`, {
        method: 'DELETE'
    });
    return await response.json();
};