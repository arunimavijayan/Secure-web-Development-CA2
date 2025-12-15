// import React, { useState, useEffect } from 'react';
// import './ShoppingCart.css';
// import ContactUs from './contactUs';
// import SearchUsers from './searchUsers';
// import { getProducts, addProduct } from '../services/api';

// const ShoppingCart = (user, logoutUser) => {
//   //const [user, setUser] = useState({});
//   const [products, setProducts] = useState([]); // Start empty
//   const [cart, setCart] = useState([]);
//   const [newProduct, setNewProduct] = useState({ name: '', price: '', description: '', category: '' });
//   const [searchTerm, setSearchTerm] = useState('');
//   const [activeSection, setActiveSection] = useState('products');
  
//   //No server-side authentication check
//   // useEffect(() => {
//   //   const userData = JSON.parse(localStorage.getItem('user') || '{}');
//   //   setUser(userData);
//   //   // No session expiration check
//   //   if (!userData.username) {
//   //     window.location.href = '/';
//   //   }
    
//   //   // Load products from backend
//   //   const loadProducts = async () => {
//   //     try {
//   //       const productsFromAPI = await getProducts();
//   //       setProducts(productsFromAPI);
//   //     } catch (error) {
//   //       console.error('Failed to load products');
//   //       setProducts([]);
//   //     }
//   //   };
    
//   //   loadProducts();
//   // }, []);
//   useEffect(() => {
//     const loadProducts = async () => {
//       try {
//         const productsFromAPI = await getProducts();
//         setProducts(productsFromAPI);
//       } catch (error) {
//         console.error('Failed to load products');
//         setProducts([]);
//       }
//     };
//     loadProducts();
//   }, [])
 
//   const addToCart = (product) => {
//     //No input validation
//     const existingItem = cart.find(item => item.id === product.id || item._id === product._id);
//     if (existingItem) {
//       //Client-side quantity manipulation possible
//       setCart(cart.map(item => 
//         (item.id === product.id || item._id === product._id)
//           ? { ...item, quantity: item.quantity + 1 }
//           : item
//       ));
//     } else {
//       setCart([...cart, { ...product, quantity: 1 }]);
//     }
//     alert(`${product.name} added to cart!`);
//   };
  
//   const updateQuantity = (productId, newQuantity) => {
//     //No validation - negative quantities allowed
//     if (newQuantity <= 0) {
//       removeFromCart(productId);
//     } else {
//       setCart(cart.map(item =>
//         (item.id === productId || item._id === productId) ? { ...item, quantity: newQuantity } : item
//       ));
//     }
//   };

//   const removeFromCart = (productId) => {
//     //No confirmation or server-side validation
//     setCart(cart.filter(item => item.id !== productId && item._id !== productId));
//   };

//   // ADMIN FUNCTIONS
//   const addNewProduct = async () => {
//     //No authentication check for admin functions
//     // No input sanitization
//     try {
//       const product = {
//         name: newProduct.name,
//         price: parseFloat(newProduct.price),
//         description: newProduct.description,
//         category: newProduct.category
//       };
      
//       const newProductFromAPI = await addProduct(product);
//       setProducts([...products, newProductFromAPI]);
//       setNewProduct({ name: '', price: '', description: '', category: '' });
//       alert('Product added successfully!');
//     } catch (error) {
//       alert('Failed to add product');
//     }
//   };

//   const deleteProduct = async (productId) => {
//     //No authorization check
//     try {
//       await fetch(`http://localhost:5000/api/products/${productId}`, {
//         method: 'DELETE'
//       });
//     } catch (error) {
//       console.log('Backend delete failed, deleting locally');
//     }

//     setProducts(products.filter(product => product._id !== productId && product.id !== productId));
//     setCart(cart.filter(item => item.id !== productId && item._id !== productId));
//   };

//   const getTotal = () => {
//     return cart.reduce((total, item) => total + (item.price * item.quantity), 0);
//   };
  
//   //Search
//   const filteredProducts = products.filter(product => {
//     const searchLower = searchTerm.toLowerCase();
//     return (
//       product.name.toLowerCase().includes(searchLower) ||
//       product.description.toLowerCase().includes(searchLower) ||
//       product.category.toLowerCase().includes(searchLower)
//     );
//   });

//   // const logout = () => {
//   //   //Insecure logout - just removes from localStorage
//   //   localStorage.removeItem('user');
//   //   window.location.href = '/';
//   // };
//   const logout = () => {
//     // FIX 3: Call the centralized logout function
//     logoutUser(); 
//   };

//   return (
//     <div className="shoppingcart_container">
//       <header className="app_header">
//         <div className="logo-section">
//           <img 
//             src="/secure_cart_logo.png" 
//             alt="Secure Cart Logo" 
//             className="header-logo"
//           />
//           <div className="brand_name">
//             <span className="secure_cart">Arunima's</span>
//             <span className="secure_cart">Secure Cart</span>
//           </div>
//         </div>
//         {/* <div className="user-info">
//           Welcome, {user.username}!
//           {user.role === 'admin' && <span className="admin-badge"> (Admin)</span>}
//         </div> */}
//         <div className="user-info">
//            Welcome, {user && user.username}! {/* Safer access */}
//           {user && user.role === 'admin' && <span className="admin-badge"> (Admin)</span>} {/* Safer access */}
//         </div>
//       </header>

//       <div className="main-layout">
//         <aside className="sidebar">
//           <nav className="sidebar-nav">
           
            
//             <div className="nav-section">
              
//               <ul>
//                 <li onClick={() => setActiveSection('sql')}>Admin Tools</li>
//                 <li onClick={() => setActiveSection('products')}>Home</li>
//                 <li onClick={() => setActiveSection('contact')}>Contact us</li>
                
//               </ul>
//             </div>
            
//             <div className="nav-section">
//               <button onClick={logout} className="logout-btn">Logout</button>
//             </div>
//           </nav>
//         </aside>


//         <main className="main-content">
        
        
//           {activeSection === 'contact' ? (
//             <ContactUs />
//           ) :  activeSection === 'sql' ? (
//             <SearchUsers/>
//           ):(
//             <>            
//               {user.role === 'admin' && (
//                 <section className="admin-section">
//                   <h2>Admin - Add New Product</h2>
//                   <div className="add-product-form">
//                     <input
//                       type="text"
//                       placeholder="Product Name"
//                       value={newProduct.name}
//                       onChange={(e) => setNewProduct({...newProduct, name: e.target.value})}
//                     />
//                     <input
//                       type="number"
//                       placeholder="Price"
//                       value={newProduct.price}
//                       onChange={(e) => setNewProduct({...newProduct, price: e.target.value})}
//                     />
//                     <input
//                       type="text"
//                       placeholder="Description"
//                       value={newProduct.description}
//                       onChange={(e) => setNewProduct({...newProduct, description: e.target.value})}
//                     />
//                     <input
//                       type="text"
//                       placeholder="Category"
//                       value={newProduct.category}
//                       onChange={(e) => setNewProduct({...newProduct, category: e.target.value})}
//                     />
//                     <button onClick={addNewProduct}>Add Product</button>
//                   </div>
//                 </section>
//               )}
//               <section className="search_section">
//                 <div className="search-container">
//                   <input
//                     type="text"
//                     placeholder="Search products by name, description, or category..."
//                     value={searchTerm}
//                     onChange={(e) => setSearchTerm(e.target.value)}
//                     className="search-input"
//                   />
//                   <div className="search-results-info">
//                     {searchTerm && (
//                       <p>
//                         Showing {filteredProducts.length} of {products.length} products
//                         {filteredProducts.length === 0 && ' - No products found'}
//                       </p>
//                     )}
//                   </div>
//                 </div>
//               </section>

//               <section className="products-section">
//                 <h2>Products {searchTerm && `- Search results for "${searchTerm}"`}</h2>
//                 <div className="products-grid">
//                   {filteredProducts.map(product => (
//                     <div key={product._id || product.id} className="product-card">
//                       <h3>{product.name}</h3>
//                       <p className="product-description">{product.description}</p>
//                       <p className="product-price">${product.price}</p>
//                       <p className="product-category">{product.category}</p>
//                       <button onClick={() => addToCart(product)} className="add-to-cart-btn">
//                         Add to Cart
//                       </button>
//                       {user.role === 'admin' && (
//                         <button 
//                           onClick={() => deleteProduct(product._id || product.id)} 
//                           className="delete-product-btn">
//                           Delete Product
//                         </button>
//                       )}
//                     </div>
//                   ))}
//                 </div>
//               </section>

//               <section className="cart-section">
//                 <h2>Shopping Cart ({cart.length} items)</h2>
//                 {cart.length === 0 ? (
//                   <p>Your cart is empty</p>
//                 ) : (
//                   <div className="cart-items">
//                     {cart.map(item => (
//                       <div key={item._id || item.id} className="cart-item">
//                         <div className="item-info">
//                           <h4>{item.name}</h4>
//                           <p>${item.price} each</p>
//                         </div>
//                         <div className="quantity-controls">
//                           <button onClick={() => updateQuantity(item._id || item.id, item.quantity - 1)}>-</button>
//                           <span>{item.quantity}</span>
//                           <button onClick={() => updateQuantity(item._id || item.id, item.quantity + 1)}>+</button>
//                         </div>
//                         <div className="item-total">
//                           ${(item.price * item.quantity).toFixed(2)}
//                         </div>
//                         <button 
//                           onClick={() => removeFromCart(item._id || item.id)} 
//                           className="remove-btn">
//                           Remove
//                         </button>
//                       </div>
//                     ))}
//                     <div className="cart-total">
//                       <strong>Total: ${getTotal().toFixed(2)}</strong>
//                     </div>
//                     <button className="checkout-btn">Proceed to Checkout</button>
//                   </div>
//                 )}
//               </section>
//             </>
//           )}
//         </main>
//       </div>
//     </div>
//   );
// };

// export default ShoppingCart;

import  { useState, useEffect } from 'react';
import './ShoppingCart.css';
import ContactUs from './contactUs';
import SearchUsers from './searchUsers';
import { getProducts, addProduct, deleteProduct as deleteProductApi } from '../services/api'; 

// Helper function to safely escape HTML entities
const escapeHTML = (str) => {
    if (typeof str !== 'string') return str;
    return str.replace(/&/g, '&amp;')
              .replace(/</g, '&lt;')
              .replace(/>/g, '&gt;')
              .replace(/"/g, '&quot;')
              .replace(/'/g, '&#39;');
};

const ShoppingCart = ({ user, logoutUser }) => { 
    const [products, setProducts] = useState([]); 
    const [cart, setCart] = useState([]);
    const [newProduct, setNewProduct] = useState({ name: '', price: '', description: '', category: '' });
    const [searchTerm, setSearchTerm] = useState('');
    const [activeSection, setActiveSection] = useState('products');
    
    useEffect(() => {
        const loadProducts = async () => {
            try {
                // FIX: Use map/filter/reduce on API data if necessary, though React handles escaping on display.
                const productsFromAPI = await getProducts();
                setProducts(productsFromAPI);
            } catch (error) {
                console.error('Failed to load products');
                setProducts([]);
            }
        };
        
        loadProducts();
    }, []); 

    const addToCart = (product) => {
        //No input validation
        const existingItem = cart.find(item => item.id === product.id || item._id === product._id);
        if (existingItem) {
            //Client-side quantity manipulation possible
            setCart(cart.map(item => 
                (item.id === product.id || item._id === product._id)
                    ? { ...item, quantity: item.quantity + 1 }
                    : item
            ));
        } else {
            setCart([...cart, { ...product, quantity: 1 }]);
        }
        alert(`${product.name} added to cart!`);
    };
    
    const updateQuantity = (productId, newQuantity) => {
        //No validation - negative quantities allowed
        if (newQuantity <= 0) {
            removeFromCart(productId);
        } else {
            setCart(cart.map(item =>
                (item.id === productId || item._id === productId) ? { ...item, quantity: newQuantity } : item
            ));
        }
    };

    const removeFromCart = (productId) => {
        //No confirmation or server-side validation
        setCart(cart.filter(item => item.id !== productId && item._id !== productId));
    };

    // SECURE HANDLER: Sanitizes input before setting state (Defense Layer 1)
    const handleNewProductChange = (e) => {
        const { name, value } = e.target;
        let safeValue = value;

        // FIX: Client-Side Input Sanitization on Change
        // Sanitize all string inputs, leave price alone (it's type="number" anyway)
        if (name !== 'price') { 
            safeValue = escapeHTML(value);
        }
        
        setNewProduct(prev => ({
            ...prev,
            [name]: safeValue // Use the sanitized value
        }));
    };


    // SECURE ADD PRODUCT: Uses sanitized state values for submission (Defense Layer 2)
    const addNewProduct = async () => {
        // 1. Client-Side Input Validation (UX/Logic check)
        if (!newProduct.name || !newProduct.description || !newProduct.category) {
            alert('Please fill in Name, Description, and Category.');
            return;
        }

        const price = parseFloat(newProduct.price);
        if (isNaN(price) || price <= 0) {
            alert('Please enter a valid price (a number greater than 0).');
            return;
        }
        
        // No need to re-sanitize here if handleNewProductChange is used correctly, 
        // but keeping it as a redundant layer for protection if future changes break the handler.
        const product = {
             // Values from state are already sanitized by handleNewProductChange
            name: newProduct.name, 
            price: price, 
            description: newProduct.description,
            category: newProduct.category
        };

        try {
            // Send the validated and sanitized data to the API
            const newProductFromAPI = await addProduct(product);
            setProducts([...products, newProductFromAPI]);
            setNewProduct({ name: '', price: '', description: '', category: '' });
            alert('Product added successfully!');
        } catch (error) {
            console.error('Failed to add product:', error);
            alert('Failed to add product. Please check server logs.');
        }
    };

    const handleDeleteProduct = async (productId) => {
        // user prop is used here to check admin role
        if (!user || user.role !== 'admin') {
            return alert('Access Denied: Only admins can delete products.');
        }
        
        try {
            // Using the renamed imported function
            await deleteProductApi(productId); 
        } catch (error) {
            console.log('Backend delete failed, deleting locally');
        }

        setProducts(products.filter(product => product._id !== productId && product.id !== productId));
        setCart(cart.filter(item => item.id !== productId && item._id !== productId));
    };

    const getTotal = () => {
        return cart.reduce((total, item) => total + (item.price * item.quantity), 0);
    };
    
    //Search
    const filteredProducts = products.filter(product => {
        const searchLower = searchTerm.toLowerCase();
        return (
            product.name.toLowerCase().includes(searchLower) ||
            product.description.toLowerCase().includes(searchLower) ||
            product.category.toLowerCase().includes(searchLower)
        );
    });

    // FIX: Use the centralized logout prop
    const logout = () => {
        logoutUser(); 
    };

    
    // Ensure user is not null/undefined before accessing properties
    if (!user) {
        // This case should be handled by ProtectedRoute, but as a safeguard
        return <div className="loading-state">Redirecting to Login...</div>;
    }
    
    return (
        <div className="shoppingcart_container">
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
                <aside className="sidebar">
                    <nav className="sidebar-nav">
                        <div className="nav-section">
                            <ul>
                                <li onClick={() => setActiveSection('sql')}>Admin Tools</li>
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
                    ) : activeSection === 'sql' ? (
                        <SearchUsers user={user} /> 
                    ) : (
                        <> 
                            {user.role === 'admin' && (
                                <section className="admin-section">
                                    <h2>Admin - Add New Product</h2>
                                    <div className="add-product-form">
                                        <input
                                            type="text"
                                            name="name" // ADDED NAME ATTRIBUTE
                                            placeholder="Product Name"
                                            value={newProduct.name}
                                            // FIXED: Use the centralized, secure handler
                                            onChange={handleNewProductChange} 
                                        />
                                        <input
                                            type="number"
                                            name="price" // ADDED NAME ATTRIBUTE
                                            placeholder="Price"
                                            value={newProduct.price}
                                            // FIXED: Use the centralized, secure handler
                                            onChange={handleNewProductChange} 
                                        />
                                        <input
                                            type="text"
                                            name="description" // ADDED NAME ATTRIBUTE
                                            placeholder="Description"
                                            value={newProduct.description}
                                            // FIXED: Use the centralized, secure handler
                                            onChange={handleNewProductChange} 
                                        />
                                        <input
                                            type="text"
                                            name="category" // ADDED NAME ATTRIBUTE
                                            placeholder="Category"
                                            value={newProduct.category}
                                            // FIXED: Use the centralized, secure handler
                                            onChange={handleNewProductChange} 
                                        />
                                        <button onClick={addNewProduct}>Add Product</button>
                                    </div>
                                </section>
                            )}
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

                            <section className="products-section">
                                <h2>Products {searchTerm && `- Search results for "${searchTerm}"`}</h2>
                                <div className="products-grid">
                                    {filteredProducts.map(product => (
                                        <div key={product._id || product.id} className="product-card">
                                            {/* React automatically escapes product.name, description, and category here */}
                                            <h3>{product.name}</h3>
                                            <p className="product-description">{product.description}</p>
                                            <p className="product-price">${product.price}</p>
                                            <p className="product-category">{product.category}</p>
                                            <button onClick={() => addToCart(product)} className="add-to-cart-btn">
                                                Add to Cart
                                            </button>
                                            {user.role === 'admin' && (
                                                <button 
                                                    onClick={() => handleDeleteProduct(product._id || product.id)} 
                                                    className="delete-product-btn">
                                                    Delete Product
                                                </button>
                                            )}
                                        </div>
                                    ))}
                                </div>
                            </section>

                            <section className="cart-section">
                                <h2>Shopping Cart ({cart.length} items)</h2>
                                {cart.length === 0 ? (
                                    <p>Your cart is empty</p>
                                ) : (
                                    <div className="cart-items">
                                        {cart.map(item => (
                                            <div key={item._id || item.id} className="cart-item">
                                                <div className="item-info">
                                                    <h4>{item.name}</h4>
                                                    <p>${item.price} each</p>
                                                </div>
                                                <div className="quantity-controls">
                                                    <button onClick={() => updateQuantity(item._id || item.id, item.quantity - 1)}>-</button>
                                                    <span>{item.quantity}</span>
                                                    <button onClick={() => updateQuantity(item._id || item.id, item.quantity + 1)}>+</button>
                                                </div>
                                                <div className="item-total">
                                                    {(item.price * item.quantity).toFixed(2)}
                                                </div>
                                                <button 
                                                    onClick={() => removeFromCart(item._id || item.id)} 
                                                    className="remove-btn">
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