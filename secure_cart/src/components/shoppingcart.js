import React from 'react';

const ShoppingCart = () => {
  //  No server-side session validation
  const user = JSON.parse(localStorage.getItem('user') || '{}');

  return (
    <div style={{ padding: '20px' }}>
      <h1>Shopping Cart</h1>
      <p>Welcome, {user_value.username}!
        {user.role === 'admin' && ' (Admin)'}</p>
      
      {user.role === 'admin' && (
        <div style={{background: '#ffeb3b', padding: '10px', margin: '10px 0'}}>
          <strong>Admin Panel:</strong> You can manage users and products
        </div>
      )}
      
      <div>
        <h3>Products will be displayed here</h3>
        <p>This is a placeholder for the shopping cart functionality.</p>
      </div>
    </div>
  );
};

export default ShoppingCart;