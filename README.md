Arunima's Secure cart -  Secure web developement CA2 project

## Overview
This is a MERN-stack (MongoDB, Express.js, React, Node.js) online shopping website which is made intentionally vulnerable as per the OPTION B of the Secure web developement project requirement. This also showcases the mitigation steps applied to mitigate the shown vulnerabilities.This uses SecDevOps web development methodology.

Student: Arunima Geetha Vijayan
Student Id: 24197963
course : MSCCYB1_A - Secure Web Development  
Institution: National College of Ireland

## Video Presentation link: 
https://youtu.be/s7370jI-aIU 

Objectives:
- To show real-world vulnerabilities in a functional web application.
- To provide security mitigation steps to deploy a secure web application
- Use SecDevOps methodology to consider security from the start of development lifecycle
- Support CRUD operation , more than 3 users with different roles.

## Main Security Focus:
The project showacses 3+ Owasp top 10 vulnerabilities to simulate real world attacks, it helps to address critical vulnerability such as NoSQL injection, broken access control, input validation, authentication bypass and assist in transitioning this vulnerable state to a secure application state.

## Features and Security Objectives:

Core Functionalities:

1 User Authentication System
-Login/Logout functionality with role-based access
-Session management with token-based authentication

2 Product Management
-Browse products with search and filtering
-Shopping cart with quantity management
-Admin product CRUD operations (add/edit/delete)

3 Admin Dashboard
-User search and management interface
-Administrative controls accessible only to admin users

4 Contact System
-Contact form for user inquiries
-Input handling with security considerations

Security  Improvements :

<img width="846" height="716" alt="image" src="https://github.com/user-attachments/assets/2944bff5-0f13-43cc-a669-e8d3e4b2baaa" />

<img width="1022" height="268" alt="image" src="https://github.com/user-attachments/assets/594314a3-0a62-42d8-abbd-9df95643cd3a" />

Project Structure :

<img width="693" height="623" alt="image" src="https://github.com/user-attachments/assets/d9048408-39e6-48fa-8f56-73b58e091922" />


## Key File Descriptions:
client/src/components/Login.js:
-Handles user authentication
-Implements secure API calls with credentials
-Manages login state and error handling

client/src/components/ShoppingCart.js:
-Main shopping interface
-Implements client-side input sanitization
-Contains admin product management functions

client/src/components/SearchUsers.js:
-Admin-only user search functionality
-Demonstrates NoSQL injection prevention
-Implements role-based access controls

server/server.js:
-Core Express server with security middleware
-Contains authentication, authorization, and validation logic
-Implements rate limiting and secure headers

server/seed.js:
-Database initialization script
-Creates users with bcrypt-hashed passwords
-Sets up initial product data

## Setup and Installation Instructions
Prerequisites:
-Node.js (v16 or higher)
-MongoDB (v4.4 or higher)
-npm or yarn package manager

Step 1: Clone the Repository
git clone https://github.com/arunimavijayan/Secure-web-Development-CA2.git
cd Secure-web-Development-CA2

Step 2: Backend Setup
cd server
npm install
Create a .env file in the server directory:

env
JWT_SECRET=your_secure_jwt_secret_key_here
MONGODB_URI=mongodb://localhost:27017/securecart
NODE_ENV=development

Step 3: Frontend Setup
cd secure_cart
npm install

Step 4: Start MongoDB
Ensure MongoDB is running locally:

# On Windows (if installed as service)
net start MongoDB

Step 5: Seed the Database
cd ../server
node seed.js
This creates:
5 users with bcrypt-hashed passwords

Initial product inventory
Admin user: admin / admin123

Step 6: Run the Application
Terminal 1 - Start Backend:
cd server
npm start
# Server runs on http://localhost:5000
Terminal 2 - Start Frontend:
cd client
npm start
# Application opens on http://localhost:3000


## Usage Guidelines
Accessing the Application:
Open your browser and navigate to http://localhost:3000

You will be redirected to the login page

Available User Accounts:
Regular Users:
- Username: john     Password: john123
- Username: arunima  Password: arun123
- Username: alice    Password: alice123
- Username: bob      Password: bob123

Admin User:
- Username: admin    Password: admin123
  
Key Features Navigation:
1. User Login
-Enter credentials on the login page
-Successful login redirects to shopping cart
-Failed attempts are rate-limited (5 attempts per 15 minutes)

2. Shopping Cart Operations
-Browse products with search functionality
-Add products to cart
-Modify quantities
-View cart total
-Note: Regular users only see basic shopping functions

3. Admin Functions (Admin Users Only)
-Add New Product: Accessible via admin panel
-Delete Products: Remove products from inventory
-Search Users: Access user database with secure search
-Admin Tools: Specialized admin-only features

4. Contact Form
-Submit inquiries via contact form
-All inputs are sanitized for XSS prevention
-Form validation ensures data integrity

## Important Notes:
-Session expires after 1 hour of inactivity
-Admin routes are protected and inaccessible to regular users
-All user inputs undergo client and server-side validation
-Sensitive operations require re-authentication

## Security Improvements
Critical Security Enhancements:

1. Authentication & Session Security
Before: Plain text passwords stored in localStorage
After: bcrypt hashing + JWT tokens in HTTP-only cookies

Implementation:
// JWT token generation with expiration
const token = jwt.sign(userData, JWT_SECRET, { expiresIn: '1h' });

// Secure cookie configuration
res.cookie('token', token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'strict',
    maxAge: 3600000
});

2. Authorization & Access Control
Before: Client-side role checking only
After: Server-side RBAC middleware

Implementation:
const isAdmin = (req, res, next) => {
    if (!req.user || req.user.role !== 'admin') {
        return res.status(403).json({ error: 'Access Denied' });
    }
    next();
};

3. Input Validation & Sanitization
Before: Minimal validation, vulnerable to XSS
After: Dual-layer client/server validation

Implementation:
// Client-side escapeHTML function
const escapeHTML = (str) => {
    return str.replace(/[&<>"']/g, char => ({
        '&': '&amp;', '<': '&lt;', '>': '&gt;',
        '"': '&quot;', "'": '&#39;'
    }));
};

// Server-side sanitization
const sanitize = require('sanitize-html');
name = sanitize(name, { allowedTags: [], allowedAttributes: {} });

4. NoSQL Injection Prevention
Before: Raw user input in MongoDB queries
After: Parameterized queries with input escaping

Implementation:
const escapeRegExp = (string) => {
    return string.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
};

// Secure search implementation
const safeSearch = escapeRegExp(searchTerm);
const users = await User.find({ 
    username: { $regex: safeSearch, $options: 'i' } 
}).select('-password -creditCard');

5. Rate Limiting & Brute Force Protection
Before: Unlimited login attempts
After: 5 attempts per 15 minutes

Implementation:
const loginLimiter = rateLimit({
    windowMs: 15 * 60 * 1000, // 15 minutes
    max: 5, // 5 attempts per window
    message: 'Too many login attempts, please try again later'
});

app.post('/api/login', loginLimiter, loginHandler);

6. Security Headers Implementation
Before: Default Express headers
After: Hardened security headers

Implementation:
app.use((req, res, next) => {
    res.setHeader('X-Content-Type-Options', 'nosniff');
    res.setHeader('X-Frame-Options', 'DENY');
    res.setHeader('X-XSS-Protection', '1; mode=block');
    next();
});

## Testing Process
Testing Methodology:
The project follows a SAST and Functional testing approach:

1. Static Application Security Testing (SAST)
-Tool: ESLint with security plugins
-Configuration: Custom .eslintrc.js with security rules
-Key Findings:
  -Identified dangerouslySetInnerHTML usage in ContactUs.js
  -Detected potential XSS vectors in form inputs
  -Found insecure localStorage usage patterns
-Remediation: All SAST findings were addressed through code refactoring

2. Functional Security Testing

   <img width="1007" height="465" alt="image" src="https://github.com/user-attachments/assets/4cd18e8e-e220-40e8-aa04-fe3edf095ae4" />

## Contributions and References
Original Project Basis:
This project was developed from scratch specifically for the Secure Web Development module at National College of Ireland. All code was written as part of academic requirements to demonstrate security principles.

Key Contributors:
-Arunima Geetha Vijayan (24197963) - Primary developer, security implementer
-Academic Supervision: Dr. Zakaria Sabir, National College of Ireland

Technologies and Libraries Used:
Frontend Technologies:
-React.js (v18.2.0) - UI framework with built-in XSS protection
-React Router DOM (v6.14.2) - Client-side routing
-CSS3 - Styling and layout

Backend Technologies:
-Node.js (v18.16.0) - JavaScript runtime
-Express.js (v4.18.2) - Web application framework
-MongoDB (v6.0) - NoSQL database
-Mongoose (v7.5.0) - MongoDB object modeling

Security Libraries:
-jsonwebtoken (v9.0.1) - JWT implementation for authentication
-bcrypt (v5.1.1) - Password hashing algorithm
-express-rate-limit (v6.10.0) - Rate limiting middleware
-sanitize-html (v2.11.0) - HTML sanitization library
-cookie-parser (v1.4.6) - Cookie parsing middleware

Development Tools:
-ESLint (v8.46.0) - Code linting with security rules
-VSCode- Editor for writing code
-MongoDB compass for Database implementation

Academic References:
-OWASP Foundation - Security guidelines and best practices
-Mozilla Developer Network - Web security documentation
-React Official Documentation - Security best practices

Learning Resources:
-OWASP Top 10 2021: https://owasp.org/Top10/
-React Security: https://react.dev/reference/react/Component#security
-Express.js Security Best Practices: https://expressjs.com/en/advanced/best-practice-security.html
-MongoDB Security: https://www.mongodb.com/docs/manual/security/
