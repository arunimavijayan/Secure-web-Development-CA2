import React, { useState } from 'react'; //useState
import './App.css';
// Navigate and ProtectedRoute
import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom"; 
import Login from './components/Login';
import ShoppingCart from './components/shoppingcart';
import ProtectedRoute from './components/ProtectedRoute'; // NEW IMPORT

function App() {
  const [user, setUser] = useState(() => {
    const localUser = localStorage.getItem('user');
    return localUser ? JSON.parse(localUser) : null;
  });
  const handleLoginSuccess = (userData) => {
    localStorage.setItem('user', JSON.stringify(userData));
    setUser(userData);
  };
  
  //Clears state and localStorage
  const handleLogout = () => {
    localStorage.removeItem('user');
    setUser(null);
  };
  
  return (
    <div className="App">
      <Router>
        <Routes>
          {/* If user is logged in, redirect from login page to cart */}
          <Route 
            path="/" 
            element={user ? 
              <Navigate to="/shopping_cart" replace /> : 
              <Login onLoginSuccess={handleLoginSuccess} />
            } 
          />
          
          {/*  Protected Route for the Shopping Cart */}
          <Route 
            path="/shopping_cart" 
            element={
              <ProtectedRoute user={user}>
                {/* Pass user data and the logout function to ShoppingCart */}
                <ShoppingCart user={user} logoutUser={handleLogout} /> 
              </ProtectedRoute>
            }
          />
        </Routes>
      </Router>
    </div>
  );
}

export default App;