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
Secure-web-Development-CA2/
│
├── client/                          # React Frontend Application
│   ├── public/                      # Static assets
│   └── src/
│       ├── components/              # React components
│       │   ├── Login.js            # Authentication interface
│       │   ├── ShoppingCart.js     # Main shopping interface
│       │   ├── SearchUsers.js      # Admin user search (secured)
│       │   ├── ContactUs.js        # Contact form with XSS protection
│       │   └── ProtectedRoute.js   # Route protection middleware
│       ├── services/
│       │   └── api.js              # API service with secure configuration
│       ├── styles/                  # CSS stylesheets
│       └── App.js                   # Main application component
│
├── server/                          # Node.js Backend Application
│   ├── server.js                    # Main server with security middleware
│   ├── seed.js                      # Database seeding with bcrypt hashing
│   └── package.json                # Backend dependencies
│
├── .eslintrc.js                    # SAST configuration for security linting
├── .gitignore                      # Git ignore rules
├── package.json                    # Root dependencies
└── README.md                       # This file
