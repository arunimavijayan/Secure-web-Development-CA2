import React from 'react';
import { Navigate } from 'react-router-dom';

const ProtectedRoute = ({ children, user, isLoading }) => {
    if (isLoading) {
        // Show a loading screen while the session check is in progress
        return <div style={{ 
            display: 'flex', 
            justifyContent: 'center', 
            alignItems: 'center', 
            height: '100vh', 
            fontSize: '24px' 
        }}>
            Checking Session...
        </div>;
    }

    // If session check is complete and no user is found, redirect to the login page
    if (!user) {
        return <Navigate to="/" replace />;
    }

    // If user is found, render the child component (ShoppingCart)
    return children;
};

export default ProtectedRoute;