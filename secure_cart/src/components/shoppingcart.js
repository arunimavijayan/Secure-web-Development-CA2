import React, { useState, useEffect } from 'react';
import './ShoppingCart.css';

import ContactUs from './contactUs';

// No backend API - all data stored in frontend
const initialProducts = [
  { id: 1, name: 'Laptop', price: 700, description: 'High-performance laptop', category: 'Electronics' },
  { id: 2, name: 'Smartphone', price: 100, description: 'Latest smartphone', category: 'Electronics' },
  { id: 3, name: 'Headphones', price: 80, description: 'Noise-cancelling headphones', category: 'Electronics' },
  { id: 4, name: 'Book', price: 25, description: 'Bestselling novel', category: 'Books' },
  { id: 5, name: 'Coffee Mug', price: 3, description: 'Ceramic coffee mug', category: 'Home' }
];

const ShoppingCart = () => {
  // STATE MANAGEMENT
  const [user, setUser] = useState({});
  const [products, setProducts] = useState(initialProducts);
  const [cart, setCart] = useState([]);
  const [newProduct, setNewProduct] = useState({ name: '', price: '', description: '', category: '' });
  const [searchTerm, setSearchTerm] = useState(''); // Search state
  const [activeSection, setActiveSection] = useState('products');
  
  //  No server-side authentication check
  useEffect(() => {
    const userData = JSON.parse(localStorage.getItem('user') || '{}');
    setUser(userData);
    
    // VULNERABILITY: No session expiration check
    if (!userData.username) {
      window.location.href = '/';
    }
  }, []);

  // CRUD OPERATIONS WITH INTENTIONAL VULNERABILITIES

  // CREATE - Add to cart
  const addToCart = (product) => {
    // VULNERABILITY: No input validation
    const existingItem = cart.find(item => item.id === product.id);
    if (existingItem) {
      // VULNERABILITY: Client-side quantity manipulation possible
      setCart(cart.map(item => 
        item.id === product.id 
          ? { ...item, quantity: item.quantity + 1 }
          : item
      ));
    } else {
      setCart([...cart, { ...product, quantity: 1 }]);
    }
    alert(`${product.name} added to cart!`);
  };

  // READ - Display products (already happening in render)

  // UPDATE - Update cart quantity
  const updateQuantity = (productId, newQuantity) => {
    // VULNERABILITY: No validation - negative quantities allowed
    if (newQuantity <= 0) {
      removeFromCart(productId);
    } else {
      setCart(cart.map(item =>
        item.id === productId ? { ...item, quantity: newQuantity } : item
      ));
    }
  };

  // DELETE - Remove from cart
  const removeFromCart = (productId) => {
    // VULNERABILITY: No confirmation or server-side validation
    setCart(cart.filter(item => item.id !== productId));
  };

  // ADMIN FUNCTIONS - CREATE new product
  const addNewProduct = () => {
    // VULNERABILITY: No authentication check for admin functions
    // VULNERABILITY: No input sanitization
    const product = {
      id: Date.now(), // VULNERABILITY: Predictable ID generation
      name: newProduct.name,
      price: parseFloat(newProduct.price),
      description: newProduct.description,
      category: newProduct.category
    };
    
    setProducts([...products, product]);
    setNewProduct({ name: '', price: '', description: '', category: '' });
    alert('Product added successfully!');
  };

  // ADMIN FUNCTIONS - DELETE product
  const deleteProduct = (productId) => {
    // VULNERABILITY: No authorization check
    setProducts(products.filter(product => product.id !== productId));
    // Also remove from cart if present
    setCart(cart.filter(item => item.id !== productId));
  };

  // Calculate total
  const getTotal = () => {
    return cart.reduce((total, item) => total + (item.price * item.quantity), 0);
  };

  // SEARCH FUNCTIONALITY
  const filteredProducts = products.filter(product => {
    const searchLower = searchTerm.toLowerCase();
    return (
      product.name.toLowerCase().includes(searchLower) ||
      product.description.toLowerCase().includes(searchLower) ||
      product.category.toLowerCase().includes(searchLower)
    );
  });

  const logout = () => {
    // VULNERABILITY: Insecure logout - just removes from localStorage
    localStorage.removeItem('user');
    window.location.href = '/';
  };

  return (
    <div className="shoppingcart_container">
      {/* HEADER */}
      <header className="app_header">
        <div className="logo-section">
          <img 
            src="/secure_cart_logo.png" 
            alt="Secure Cart Logo" 
            className="header-logo"
          />
          <div className="brand_name">
            <span className="secure_cart">Arunima's</span>
            <span className="secure_cart">Secure Cart</span>
          </div>
        </div>
        <div className="user-info">
          Welcome, {user.username}!
          {user.role === 'admin' && <span className="admin-badge"> (Admin)</span>}
        </div>
      </header>

      <div className="main-layout">
        {/* SIDEBAR */}
        <aside className="sidebar">
          <nav className="sidebar-nav">
           
            
            <div className="nav-section">
              
              <ul>
                <li onClick={() => setActiveSection('products')}>Home</li>
                <li onClick={() => setActiveSection('contact')}>Contact us</li>
                
              </ul>
            </div>
            
            <div className="nav-section">
              <button onClick={logout} className="logout-btn">Logout</button>
            </div>
          </nav>
        </aside>


        <main className="main-content">
        
        
          {activeSection === 'contact' ? (
            <ContactUs />
          ) : (
            <>
             
              {user.role === 'admin' && (
                <section className="admin-section">
                  <h2>Admin - Add New Product</h2>
                  <div className="add-product-form">
                    <input
                      type="text"
                      placeholder="Product Name"
                      value={newProduct.name}
                      onChange={(e) => setNewProduct({...newProduct, name: e.target.value})}
                    />
                    <input
                      type="number"
                      placeholder="Price"
                      value={newProduct.price}
                      onChange={(e) => setNewProduct({...newProduct, price: e.target.value})}
                    />
                    <input
                      type="text"
                      placeholder="Description"
                      value={newProduct.description}
                      onChange={(e) => setNewProduct({...newProduct, description: e.target.value})}
                    />
                    <input
                      type="text"
                      placeholder="Category"
                      value={newProduct.category}
                      onChange={(e) => setNewProduct({...newProduct, category: e.target.value})}
                    />
                    <button onClick={addNewProduct}>Add Product</button>
                  </div>
                </section>
              )}

              {/* SEARCH BAR */}
              <section className="search_section">
                <div className="search-container">
                  <input
                    type="text"
                    placeholder="Search products by name, description, or category..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="search-input"
                  />
                  <div className="search-results-info">
                    {searchTerm && (
                      <p>
                        Showing {filteredProducts.length} of {products.length} products
                        {filteredProducts.length === 0 && ' - No products found'}
                      </p>
                    )}
                  </div>
                </div>
              </section>

              {/* PRODUCTS SECTION */}
              <section className="products-section">
                <h2>Products {searchTerm && `- Search results for "${searchTerm}"`}</h2>
                <div className="products-grid">
                  {filteredProducts.map(product => (
                    <div key={product.id} className="product-card">
                      <h3>{product.name}</h3>
                      <p className="product-description">{product.description}</p>
                      <p className="product-price">${product.price}</p>
                      <p className="product-category">{product.category}</p>
                      <button onClick={() => addToCart(product)} className="add-to-cart-btn">
                        Add to Cart
                      </button>
                      {user.role === 'admin' && (
                        <button 
                          onClick={() => deleteProduct(product.id)} 
                          className="delete-product-btn"
                        >
                          Delete Product
                        </button>
                      )}
                    </div>
                  ))}
                </div>
              </section>

              {/* SHOPPING CART */}
              <section className="cart-section">
                <h2>Shopping Cart ({cart.length} items)</h2>
                {cart.length === 0 ? (
                  <p>Your cart is empty</p>
                ) : (
                  <div className="cart-items">
                    {cart.map(item => (
                      <div key={item.id} className="cart-item">
                        <div className="item-info">
                          <h4>{item.name}</h4>
                          <p>${item.price} each</p>
                        </div>
                        <div className="quantity-controls">
                          <button onClick={() => updateQuantity(item.id, item.quantity - 1)}>-</button>
                          <span>{item.quantity}</span>
                          <button onClick={() => updateQuantity(item.id, item.quantity + 1)}>+</button>
                        </div>
                        <div className="item-total">
                          ${(item.price * item.quantity).toFixed(2)}
                        </div>
                        <button 
                          onClick={() => removeFromCart(item.id)} 
                          className="remove-btn"
                        >
                          Remove
                        </button>
                      </div>
                    ))}
                    <div className="cart-total">
                      <strong>Total: ${getTotal().toFixed(2)}</strong>
                    </div>
                    <button className="checkout-btn">Proceed to Checkout</button>
                  </div>
                )}
              </section>
            </>
          )}
        </main>
      </div>
    </div>
  );
};

export default ShoppingCart;