import React, {useState} from 'react';
import '../Login.css';

const user =[
   { username: 'john', password: 'john123', role:'user'},
   {username: 'admin', password: 'admin123', role:'admin'},
   {username: 'arunima', password: 'arun123', role:'user'}
];

const Login=()=>{
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');


const handleLogin= (e) => {
    e.preventDefault();
    const user_value= user.find(u => u.username === username && u.password === password);

    if (user_value){
        localStorage.setItem('user', JSON.stringify(user_value));
        window.location.href = '/shopping_cart';
    }
    else{
        setError('Invalid credentials! Please enter correct Username and Password')
    }

}
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