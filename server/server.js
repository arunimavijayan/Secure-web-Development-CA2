const express = require('express');
const cors = require('cors');
const mongoose = require('mongoose');
const app = express();
app.use(cors());
app.use(express.json());

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

//  VULNERABLE: Simple schemas
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

// no input sanitization
app.post('/api/login', async (req, res) => {
    const { username, password } = req.body;   
    //vulnerable to injection
    const user = await User.findOne({ 
        username: username, 
        password: password // Plain text comparison
    }); 
    if (user) {
        res.json({
            username: user.username,
            role: user.role,
            message: 'Login successful'
        });
    } else {
        res.status(401).json({ error: 'Invalid credentials' });
    }
});

// Search users( NoSQL INJECTION)
app.post('/api/search-users', async (req, res) => {
    const { search } = req.body;  
    
    console.log('🔍 Raw search input:', search);
    console.log('📝 Type:', typeof search);
    
    //  Handle all injection patterns
    let query = {};
    
    if (!search || search === '' || search === '{}' || search === '*' || search === 'all') {
        // Empty or special values return all
        query = {};
    } else if (search && typeof search === 'string') {
        const trimmed = search.trim();
        
        // Handle JSON injection patterns
        if (trimmed.startsWith('{') && trimmed.endsWith('}')) {
            try {
 
                const cleanJson = trimmed.replace(/\s+/g, '');
                console.log('🔓 Cleaning JSON:', cleanJson);
                
                const parsed = JSON.parse(cleanJson);
                console.log('✅ Parsed JSON:', parsed);
                
                //Different handling based on structure
                if (parsed.$regex) {
                    // {"$regex":".*"} pattern
                    query = { username: { $regex: '.*' } };
                } else if (parsed.$ne !== undefined) {
                    // {"$ne":null} pattern
                    query = { username: { $ne: null } };
                } else if (parsed.$gt !== undefined) {
                    // {"$gt":""} pattern
                    query = { username: { $gt: '' } };
                } else if (parsed.$exists !== undefined) {
                    // {"$exists":true} pattern
                    query = { username: { $exists: true } };
                } else if (parsed.$or) {
                    // {"$or":[{"username":{"$exists":true}}]} pattern
                    query = { $or: [{ username: { $exists: true } }] };
                } else if (Object.keys(parsed).length === 0) {
                    // Empty object {}
                    query = {};
                } else {
                    // Fallback: use as direct query
                    query = parsed;
                }
                
            } catch (e) {
                console.log(' JSON parse error:', e.message);
                // Still try to extract operators
                if (trimmed.includes('$ne')) {
                    query = { username: { $ne: null } };
                } else if (trimmed.includes('$regex')) {
                    query = { username: { $regex: '.*' } };
                } else if (trimmed.includes('$or')) {
                    query = { $or: [{ username: { $exists: true } }] };
                } else {
                    query = { username: trimmed };
                }
            }
        }

        else if (trimmed === 'admin' || trimmed === 'john' || trimmed === 'alice' || 
                 trimmed === 'bob' || trimmed === 'arunima') {
            query = { username: trimmed };
        }

        else {
            query = { username: trimmed };
        }
    }
    
    console.log('Final query:', JSON.stringify(query));
    
    try {
        const users = await User.find(query);
        console.log(`Found ${users.length} users`);
        res.json(users);
    } catch (error) {
        console.error('Database error:', error);
        res.json([]);
    }
});

app.get('/api/products', async (req, res) => {
    const products = await Product.find({});
    res.json(products);
});

app.post('/api/products', async (req, res) => {
    const product = new Product(req.body);
    await product.save();
    res.json(product);
});

// No authentication for delete
app.delete('/api/products/:id', async (req, res) => {
    await Product.findByIdAndDelete(req.params.id);
    res.json({ message: 'Deleted' });
});

// Seed database with initial data
app.post('/api/seed', async (req, res) => {
    await User.deleteMany({});
    await Product.deleteMany({});
    
    await User.create([
        { 
            username: 'john', 
            password: 'john123', 
            role: 'user', 
            email: 'john@securecart.com', 
            creditCard: '4111-1111-1111-1111' 
        },
        { 
            username: 'admin', 
            password: 'admin123', 
            role: 'admin', 
            email: 'admin@securecart.com', 
            creditCard: '4222-2222-2222-2222' 
        },
        { 
            username: 'arunima', 
            password: 'arun123', 
            role: 'user', 
            email: 'arunima@securecart.com', 
            creditCard: '4333-3333-3333-3333' 
        },
        { 
            username: 'alice', 
            password: 'alice123', 
            role: 'user', 
            email: 'alice@securecart.com', 
            creditCard: '4444-4444-4444-4444' 
        },
        { 
            username: 'bob', 
            password: 'bob123', 
            role: 'user', 
            email: 'bob@securecart.com', 
            creditCard: '4555-5555-5555-5555' 
        }
    ]);
    
    await Product.create([
        { name: 'Laptop', price: 700, description: 'High-performance laptop', category: 'Electronics' },
        { name: 'Smartphone', price: 100, description: 'Latest smartphone', category: 'Electronics' },
        { name: 'Headphones', price: 80, description: 'Noise-cancelling headphones', category: 'Electronics' }
    ]);
    
    res.json({ message: 'Database seeded' });
});

