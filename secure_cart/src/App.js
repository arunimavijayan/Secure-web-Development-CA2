import logo from './logo.svg';
import './App.css';
import {BrowserRouter as Router, Routes, Route} from "react-router-dom"
import Login from './components/Login';
import ShoppingCart from './components/shoppingcart';

function App() {
  return (
    <div className="App">
      <Router>
        <Routes>
          // adding the route paths
          <Route path="/" element={<Login/>}/>
          <Route path="/shopping_cart" element={<ShoppingCart/>}/>
        </Routes>
      </Router>
    </div>
  );
}

export default App;
