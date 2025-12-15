const express = require('express');
const cors = require('cors');
const mongoose = require('mongoose');
// 4-10 line Adding Security to the File for mitigating vulnerabilities
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const cookieParser = require('cookie-parser');
const rateLimit= require('express-rate-limit');//to stop DoS
const path = require('path'); 
require('dotenv').config({ path: path.resolve(__dirname, '..', '.env') });
const JWT_SECRET = process.env.JWT_SECRET;

const app = express();
// Mitigation  Login Rate Limiting
const loginLimiter = rateLimit({
    windowMs: 15 * 60 * 1000, 
    max: 5, // Max 5 login attempts 
    message: 'Locked!!, please try again after 15 minutes',
    standardHeaders: true,
    legacyHeaders: false,
});

//adding security headers
app.use((req, res, next) => {
    res.setHeader('X-Content-Type-Options', 'nosniff');
    res.setHeader('X-Frame-Options', 'DENY');
    res.setHeader('X-XSS-Protection', '1; mode=block');
    next();
});
app.use(cors({
    // adding next 2 lines for mitigation
    origin: 'http://localhost:3000', 
    credentials: true, 
}));
app.use(cookieParser());
app.use(express.json());

//Mitigating code 
// JWT Verification
const authenticateToken = (req, res, next) => {
    // Check for token in the HTTP-Only cookie
    const token = req.cookies.token; 
    
    if (!token) {
        req.user = null; 
        return next();
    }

    jwt.verify(token, JWT_SECRET, (err, user) => {
        if (err) {           
            res.clearCookie('token'); 
            req.user = null;
            
        }
        req.user = user;
        next();
    });
};

// Role-Based Access Control for Admin
const isAdmin = (req, res, next) => {
    if (!req.user || req.user.role !== 'admin') {
        console.warn(`Unauthorized access attempt by: ${req.user ? req.user.username : 'Dont try to login without proper access, You will be prosecuted!! '}`);
        return res.status(403).json({ error: 'Access Denied: You are not Admin!!.' });
    }
    next();
};

app.use(authenticateToken);



mongoose.connect('mongodb://localhost:27017/securecart', {
    useNewUrlParser: true,
    useUnifiedTopology: true
})
.then(() => {
    console.log(' Connected to MongoDB 8.2 on localhost:27017');
})
.catch(err => {
    console.error(' MongoDB connection error:', err);
});

// Simple schemas
const userSchema = new mongoose.Schema({
    username: String,
    password: String, // Plain text
    role: String,
    email: String,
    creditCard: String
});
const productSchema = new mongoose.Schema({
    name: String,
    price: Number,
    description: String,
    category: String
});
const User = mongoose.model('User', userSchema);
const Product = mongoose.model('Product', productSchema);

// mitigation against brute force attack
app.post('/api/login', loginLimiter, async (req, res) => {
    const { username, password } = req.body;
      // Input validation
    if (!username || !password) {
        return res.status(400).json({ error: 'Username and password are required.' });
    }

    // Secure query by username 
    const user = await User.findOne({ username });

    if (user) {
        //  bcrypt Integration
        const isMatch = await bcrypt.compare(password, user.password);

        if (isMatch) {
            // Generate JWT Token
            const token = jwt.sign(
                { id: user._id, username: user.username, role: user.role },
                JWT_SECRET,
                { expiresIn: '1h' }
            );
            // Set secure, httpOnly cookie -Security headers from Sabir's Lecture
            res.cookie('token', token, {
                httpOnly: true, // Prevents client-side script access
                secure: process.env.NODE_ENV === 'production',
                sameSite: 'strict', // CSRF mitigation
                maxAge: 3600000 // 1 hour
            });

            return res.json({
                username: user.username,
                role: user.role,
                message: 'Login successful'
            });
        }
    }
    // Generic error message
    res.status(401).json({ error: 'Invalid credentials' });
});

//Mitigation to search users api
// function to safely escape regex
const escapeRegExp = (string) => {
    return string.replace(/[.*+?^${}()|[\]\\]/g, '\\$&'); 
};

// Mitigation to search users api 
app.post('/api/search-users', isAdmin, async (req, res) => {
    const { search } = req.body;

    if (!search || typeof search !== 'string') {
        return res.status(400).json({ error: 'Invalid search attempt' });
    }
    const safeSearch = escapeRegExp(search);

    try {
        const users = await User.find({
            $or: [
                { username: { $regex: safeSearch, $options: 'i' } },
                { email: { $regex: safeSearch, $options: 'i' } },
                { role: { $regex: safeSearch, $options: 'i' } }
            ]
        })
        .select('-password -creditCard'); 

        res.json(users);
    } catch (error) {
        console.error('Database error:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
});
// Secure Logout Endpoint
app.post('/api/logout', (req, res) => {
    
    res.clearCookie('token'); 
       res.json({ message: 'Logout successful' });
});

app.get('/api/products', async (req, res) => {
    const products = await Product.find({});
    res.json(products);
});

const sanitize = require('sanitize-html');

app.post('/api/products', authenticateToken, async (req, res) => {
    let { name, price, description, category } = req.body;
    
    // Server-Side Sanitization 
    name = sanitize(name, { allowedTags: [], allowedAttributes: {} });
    description = sanitize(description, { allowedTags: [], allowedAttributes: {} });
    category = sanitize(category, { allowedTags: [], allowedAttributes: {} });

    // Check for admin role
    if (!req.user || req.user.role !== 'admin') {
        return res.status(403).json({ error: 'Access denied. Must be admin to add a product.' });
    }

    // Basic server-side validation (Price must be a number)
    if (isNaN(price) || price <= 0 || !name || !description) {
        return res.status(400).json({ error: 'Invalid product data.' });
    }
    try {
        const newProduct = await Product.create({ name, price, description, category });
        res.status(201).json(newProduct);
    } catch (error) {
        console.error('Error adding product:', error);
        res.status(500).json({ error: 'Failed to add product.' });
    }
});

// New Endpoint to check authentication status and retrieve user data
app.get('/api/current-user', (req, res) => {

    if (req.user) {

        return res.json({ 
            username: req.user.username,
            role: req.user.role 
        });
    }
    // Failure: No valid token found in cookie
    res.status(401).json({ error: 'User is not authenticated' });
});
//Mitigation for delete api
// Enforce Admin Role for deletion (SR3)
app.delete('/api/products/:id', isAdmin, async (req, res) => {
     if (!mongoose.Types.ObjectId.isValid(req.params.id)) {
        return res.status(400).json({ error: 'Invalid product ID ' });
    }
    
    await Product.findByIdAndDelete(req.params.id);
    res.json({ message: 'Deleted' });
});

// Seed database with initial data
app.post('/api/seed', async (req, res) => {
    await User.deleteMany({});
    await Product.deleteMany({});   
    // Hashing passwords for secure storage
    const saltRounds = 10;
    const hashedPasswordJohn = await bcrypt.hash('john123', saltRounds);
    const hashedPasswordAdmin = await bcrypt.hash('admin123', saltRounds);
    const hashedPasswordArunima = await bcrypt.hash('arun123', saltRounds);
    const hashedPasswordAlice = await bcrypt.hash('alice123', saltRounds);
    const hashedPasswordBob = await bcrypt.hash('bob123', saltRounds);
    await User.create([
        { 
            username: 'john', 
            password: hashedPasswordJohn, // SECURE HASH
            role: 'user', 
            email: 'john@securecart.com', 
            creditCard: 'xxxx-xxxx-xxxx-1111' 
        },
        { 
            username: 'admin', 
            password: hashedPasswordAdmin, // SECURE HASH
            role: 'admin', 
            email: 'admin@securecart.com', 
            creditCard: 'xxxx-xxxx-xxxx-2222' 
        },
        { 
            username: 'arunima', 
            password: hashedPasswordArunima, // SECURE HASH
            role: 'user', 
            email: 'arunima@securecart.com', 
            creditCard: 'xxxx-xxxx-xxxx-3333' 
        },
        { 
            username: 'alice', 
            password: hashedPasswordAlice, // SECURE HASH
            role: 'user', 
            email: 'alice@securecart.com', 
            creditCard: 'xxxx-xxxx-xxxx-4444' 
        },
        { 
            username: 'bob', 
            password: hashedPasswordBob, // SECURE HASH
            role: 'user', 
            email: 'bob@securecart.com', 
            creditCard: 'xxxx-xxxx-xxxx-5555' 
        }
    ]);
    
    await Product.create([
        { name: 'Laptop', price: 700, description: 'High-performance laptop', category: 'Electronics' },
        { name: 'Smartphone', price: 100, description: 'Latest smartphone', category: 'Electronics' },
        { name: 'Headphones', price: 80, description: 'Noise-cancelling headphones', category: 'Electronics' }
    ]);
    
    res.json({ message: 'Database seeded successfully with hashed passwords.' });
});
//validating server-side
app.post('/api/validate-cart', authenticateToken, async (req, res) => {
    const { cartItems } = req.body;   
    // Validate each item exists and price matches
    const validatedItems = await Promise.all(
        cartItems.map(async item => {
            const product = await Product.findById(item.productId);
            if (!product || product.price !== item.price) {
                return null;
            }
            return { ...item, valid: true };
        })
    );
    
    res.json({ validatedItems });
});

const PORT = 5000;
app.listen(PORT, () => {
    console.log(`Server started on http://localhost:${PORT}`);
    console.log(`Available endpoints:`);
    console.log(`   POST http://localhost:${PORT}/api/login`);
    console.log(`   POST http://localhost:${PORT}/api/seed`);
    console.log(`   POST http://localhost:${PORT}/api/search-users`);
    console.log(`   GET  http://localhost:${PORT}/api/products`);

});