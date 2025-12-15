const mongoose = require('mongoose');
const bcrypt = require('bcrypt');//secure import

// Connect to MongoDB 8.2
mongoose.connect('mongodb://localhost:27017/securecart', {
    useNewUrlParser: true,
    useUnifiedTopology: true
});

const userSchema = new mongoose.Schema({
    username: String,
    password: String,
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

async function seed() {
    try {
        await User.deleteMany({});
        await Product.deleteMany({});
        console.log('Seeding database with SECURE data...');

        // Hashing passwords
        const saltRounds = 10;
        const hashedPasswordJohn = await bcrypt.hash('john123', saltRounds);
        const hashedPasswordAdmin = await bcrypt.hash('admin123', saltRounds);
        const hashedPasswordArunima = await bcrypt.hash('arun123', saltRounds);
        const hashedPasswordAlice = await bcrypt.hash('alice123', saltRounds);
        const hashedPasswordBob = await bcrypt.hash('bob123', saltRounds);

        // Create users with HASHED passwords and masked cc
        await User.create([
            { 
                username: 'john', 
                password: hashedPasswordJohn, 
                role: 'user', 
                email: 'john@securecart.com', 
                creditCard: 'xxxx-xxxx-xxxx-1111' 
            },
            { 
                username: 'admin', 
                password: hashedPasswordAdmin, 
                role: 'admin', 
                email: 'admin@securecart.com', 
                creditCard: 'xxxx-xxxx-xxxx-2222' 
            },
            { 
                username: 'arunima', 
                password: hashedPasswordArunima, 
                role: 'user', 
                email: 'arunima@securecart.com', 
                creditCard: 'xxxx-xxxx-xxxx-3333' 
            },
            { 
                username: 'alice', 
                password: hashedPasswordAlice, 
                role: 'user', 
                email: 'alice@securecart.com', 
                creditCard: 'xxxx-xxxx-xxxx-4444' 
            },
            { 
                username: 'bob', 
                password: hashedPasswordBob, 
                role: 'user', 
                email: 'bob@securecart.com', 
                creditCard: 'xxxx-xxxx-xxxx-5555' 
            }
        ]);
        
        console.log(' Created 5 users with HASHED passwords and masked sensitive data');
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