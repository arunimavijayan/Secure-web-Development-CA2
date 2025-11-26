import React, {useState} from 'react';
import '../Login.css';

//Creating 3 users with Hardcoded credentials
const user =[
   { username: 'John', password: 'John123', role:'user'},
   {username: 'Admin', password: 'admin123', role:'admin'},
   {username: 'Arunima', password: 'arun123', role:'user'}
];

const Login=()=>{
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');


const handleLogin= (e) => {
    e.preventDefault();
    //Client-side authentication done
    const user_value= user.find(u => u.username === username && u.password === password);

    if (user_value){
        localStorage.setItem('user', JSON.stringify(user));
        alert(`welcome to Arunima's Secure_cart ${user_value.username}!`);
        window.location.href = '/shopping_cart';
    }
    else{
        setError('Invalid credentials! Please enter correct Username and Password')
    }

}
return (
    <div className="login-container">
      <div className="login-box">
        
        <div className="logo-section">
          <img src="/secure_cart_logo.png" alt="Secure Cart Logo" className="logo-image"/>
          <div className="brand-name">
            <span className="secure-cart">Arunima's</span>
            <span className="secure-cart">secure_cart</span>
          </div>
        </div>
        
        <div className="welcome-text">
          Welcome to Secure_cart by Arunima@MSCCYB1_A
        </div>
        <div className="login-instruction">
          Please login to access the website
        </div>

        <form onSubmit={handleLogin} className="login-form">
          
          {error && <div className="error-message">{error}</div>}
          
   
          <div className="form-group">
            <label>UserName :</label>
            <input
              type="text"
              value={username} 
              onChange={(e) => setUsername(e.target.value)} 
              placeholder="Enter"
              //  No input sanitization
            />
          </div>
          
          
          <div className="form-group">
            <label>Password:</label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Enter"
              //No rate limiting
            />
          </div>
          
        
          <button type="submit" className="login-button">
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