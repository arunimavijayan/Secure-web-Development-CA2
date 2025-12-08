const mongoose = require('mongoose');

// Connect to MongoDB 8.2
mongoose.connect('mongodb://localhost:27017/securecart', {
    useNewUrlParser: true,
    useUnifiedTopology: true
});

const userSchema = new mongoose.Schema({
    username: String,
    password: String, // Plain text - intentional vulnerability
    role: String,
    email: String,
    creditCard: String // Intentional vulnerability
});

const productSchema = new mongoose.Schema({
    name: String,
    price: Number,
    description: String,
    category: String
});

const User = mongoose.model('User', userSchema);
const Product = mongoose.model('Product', productSchema);

async function seed() {
    try {
        await User.deleteMany({});
        await Product.deleteMany({});
        
        console.log('Seeding database with vulnerable data...');
        
        // Create users with plain text passwords and sensitive data
        await User.create([
            { username: 'john', password: 'john123', role: 'user', email: 'john@securecart.com', creditCard: '4111-1111-1111-1111' },
            { username: 'admin', password: 'admin123', role: 'admin', email: 'admin@securecart.com', creditCard: '4222-2222-2222-2222' },
            { username: 'arunima', password: 'arun123', role: 'user', email: 'arunima@securecart.com', creditCard: '4333-3333-3333-3333' },
            { username: 'alice', password: 'alice123', role: 'user', email: 'alice@securecart.com', creditCard: '4444-4444-4444-4444' },
            { username: 'bob', password: 'bob123', role: 'user', email: 'bob@securecart.com', creditCard: '4555-5555-5555-5555' }
        ]);
        
        console.log(' Created 5 users with plain text passwords and credit card data');
        
        // Create products
        await Product.create([
            { name: 'Laptop', price: 700, description: 'High-performance laptop', category: 'Electronics' },
            { name: 'Smartphone', price: 100, description: 'Latest smartphone', category: 'Electronics' },
            { name: 'Headphones', price: 80, description: 'Noise-cancelling headphones', category: 'Electronics' },
            { name: 'Book', price: 25, description: 'Bestselling novel', category: 'Books' },
            { name: 'Coffee Mug', price: 3, description: 'Ceramic coffee mug', category: 'Home' }
        ]);
        
        console.log(' Database seeded successfully!');
        
    } catch (error) {
        console.error('Error seeding database:', error);
    } finally {
        mongoose.connection.close();
        process.exit();
    }
}

seed();