// // //VULNERABLE API Service - No error handling, no sanitization
// // const API_URL = 'http://localhost:5000/api';

// // // Login using backend
// // export const login = async (username, password) => {
// //     const response = await fetch(`${API_URL}/login`, {
// //         method: 'POST',
// //         headers: {
// //             'Content-Type': 'application/json'
// //         },
// //         body: JSON.stringify({ username, password })
// //     });
// //     return await response.json();
// // };

// // export const getProducts = async () => {
// //     const response = await fetch(`${API_URL}/products`);
// //     return await response.json();
// // };

// // // Search users (for admin section)
// // export const searchUsers = async (searchQuery) => {
// //     const response = await fetch(`${API_URL}/search-users`, {
// //         method: 'POST',
// //         headers: {
// //             'Content-Type': 'application/json'
// //         },
// //         body: JSON.stringify({ search: searchQuery })
// //     });
// //     return await response.json();
// // };

// // // Add new product (admin only)
// // export const addProduct = async (productData) => {
// //     const response = await fetch(`${API_URL}/products`, {
// //         method: 'POST',
// //         headers: {
// //             'Content-Type': 'application/json'
// //         },
// //         body: JSON.stringify(productData)
// //     });
// //     return await response.json();
// // };

// // // Delete product (admin only)
// // export const deleteProduct = async (productId) => {
// //     const response = await fetch(`${API_URL}/products/${productId}`, {
// //         method: 'DELETE'
// //     });
// //     return await response.json();
// // };
// // SECURE API Service - Now includes credentials for cookie handling
// const API_URL = 'http://localhost:5000/api';

// export const login = async (username, password) => {
//     const response = await fetch(`${API_URL}/login`, {
//         method: 'POST',
//         headers: {
//             'Content-Type': 'application/json'
//         },
//         body: JSON.stringify({ username, password }),
//         // FIX: Tells the browser to include cookies for authentication
//         credentials: 'include' 
//     });
//     return await response.json();
// };

// export const getProducts = async () => {
//     const response = await fetch(`${API_URL}/products`, {
//         // Adding for consistency, though this is a public GET route
//         credentials: 'include' 
//     });
//     return await response.json();
// };

// // Search users (for admin section)
// export const searchUsers = async (searchQuery) => {
//     const response = await fetch(`${API_URL}/search-users`, {
//         method: 'POST',
//         headers: {
//             'Content-Type': 'application/json'
//         },
//         body: JSON.stringify({ search: searchQuery }),
//         // FIX: Sends the authentication cookie (JWT)
//         credentials: 'include' 
//     });
//     return await response.json();
// };

// // Add new product (admin only)
// export const addProduct = async (productData) => {
//     const response = await fetch(`${API_URL}/products`, {
//         method: 'POST',
//         headers: {
//             'Content-Type': 'application/json'
//         },
//         body: JSON.stringify(productData),
//         // FIX: Sends the authentication cookie (JWT)
//         credentials: 'include'
//     });
//     return await response.json();
// };

// // Delete product (admin only)
// export const deleteProduct = async (productId) => {
//     const response = await fetch(`${API_URL}/products/${productId}`, {
//         method: 'DELETE',
//         // FIX: Sends the authentication cookie (JWT)
//         credentials: 'include'
//     });
//     return await response.json();
// };

// export const logout = async () => {
//     const response = await fetch(`${API_URL}/logout`, {
//         method: 'POST',
//         credentials: 'include' 
//     });
//     return await response.json();
// };

// // In api.js, add the following function:

// export const getCurrentUser = async () => {
//     const response = await fetch(`${API_URL}/current-user`, {
//         method: 'GET',
//         credentials: 'include' 
//     });
    
//     if (!response.ok) {
       
//         return null;
//     }
   
//     return await response.json();
// };

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