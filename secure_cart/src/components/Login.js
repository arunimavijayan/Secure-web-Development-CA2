import React, {useState} from 'react';
import '../Login.css';
import { login } from '../services/api';

const Login = () => {
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');

    const handleLogin = async (e) => {
        e.preventDefault();

        try {
            console.log('Logging in via backend...');
            const result = await login(username, password);
            
            if (result.message === 'Login successful') {
                localStorage.setItem('user', JSON.stringify({
                    username: result.username,
                    role: result.role
                }));
                window.location.href = '/shopping_cart';
            } else {
                setError(result.error || 'Invalid credentials! Please enter correct Username and Password');
            }
        } catch (err) {
            console.error('Login error:', err);
            setError('Login failed. Please check your credentials and try again.');
        }
    };

return (
    <div className="login_bg">
      <div className="login_container">
        
        <div className="logo-section">
          <img src="/secure_cart_logo.png" alt="Secure Cart Logo" className="logo_img"/>
          <div className="brand_name">
            <span className="secure_cart">Arunima's</span>
            <span className="secure_cart">secure_cart</span>
          </div>
        </div>
        
        <div className="welcome_text">
          Welcome to Secure_cart by Arunima@MSCCYB1_A
        </div>
        <div className="login_instruction">
          Please login to access the website
        </div>

        <form onSubmit={handleLogin} className="login_form">
          
          {error && <div className="error_message">{error}</div>}
          
   
          <div className="form_group">
            <label>UserName :</label>
            <input
              type="text"
              value={username} 
              onChange={(e) => setUsername(e.target.value)} 
              placeholder="Enter"
              //  No input sanitization
            />
          </div>
          
          
          <div className="form_group">
            <label>Password:</label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Enter"
              //No rate limiting
            />
          </div>
          
        
          <button type="submit" className="login_button">
            LOGIN
          </button>
        </form>

       
        <div className="forgot-password">
          ?Forgot password
        </div>
      </div>
    </div>
  );
};

export default Login;