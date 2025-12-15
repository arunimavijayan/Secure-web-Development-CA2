// import logo from './logo.svg';
// import './App.css';
// import {BrowserRouter as Router, Routes, Route} from "react-router-dom"
// import Login from './components/Login';
// import ShoppingCart from './components/shoppingcart';

// function App() {
//   return (
//     <div className="App">
//       <Router>
//         <Routes>
//           <Route path="/" element={<Login/>}/>
//           <Route path="/shopping_cart" element={<ShoppingCart/>}/>
//         </Routes>
//       </Router>
//     </div>
//   );
// }

// export default App;
import React, { useState } from 'react'; //useState
import './App.css';
// Navigate and ProtectedRoute
import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom"; 
import Login from './components/Login';
import ShoppingCart from './components/shoppingcart';
import ProtectedRoute from './components/ProtectedRoute'; // NEW IMPORT

function App() {
  // 1. STATE: Initialize user state from localStorage only once on mount
  const [user, setUser] = useState(() => {
    const localUser = localStorage.getItem('user');
    return localUser ? JSON.parse(localUser) : null;
  });

  // 2. LOGIN HANDLER: Updates state and localStorage
  const handleLoginSuccess = (userData) => {
    localStorage.setItem('user', JSON.stringify(userData));
    setUser(userData);
  };
  
  // 3. LOGOUT HANDLER: Clears state and localStorage
  const handleLogout = () => {
    localStorage.removeItem('user');
    setUser(null);
  };
  
  return (
    <div className="App">
      <Router>
        <Routes>
          {/* Route 1: If user is logged in, redirect from login page to cart */}
          <Route 
            path="/" 
            element={user ? 
              <Navigate to="/shopping_cart" replace /> : 
              <Login onLoginSuccess={handleLoginSuccess} />
            } 
          />
          
          {/* Route 2: Protected Route for the Shopping Cart */}
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