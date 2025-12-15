import React, { useState } from "react";
import './contactUs.css';

const ContactUs = () => {
    const [formData, setFormData] = useState({
        name: '',
        email: '',
        description: ''
    });
    
    const [submissionResult, setSubmissionResult] = useState(null);

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: value
        }));
    };

// to escape HTML entities
const escapeHTML = (str) => {
    return str.replace(/&/g, '&amp;')
              .replace(/</g, '&lt;')
              .replace(/>/g, '&gt;')
              .replace(/"/g, '&quot;')
              .replace(/'/g, '&#39;');
};
// Secure handling of user input
const handleSubmit = (e) => {
    e.preventDefault();      
    // Basic validation
    if (!formData.name || !formData.email || !formData.description) {
        setSubmissionResult({
            type: 'error',
            message: 'Please fill in all fields.'
        });
        return;
    }

    // Email validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(formData.email)) {
        setSubmissionResult({
            type: 'error',
            message: 'Please enter a valid email address.'
        });
        return;
    }

    // FIX: Sanitize user input before creating the message HTML string
    const safeName = escapeHTML(formData.name);
    const safeEmail = escapeHTML(formData.email);
    const safeDescription = escapeHTML(formData.description);

    // Using the sanitized data to construct the message
    setSubmissionResult({
        type: 'success',
        message: `
            <h3>Thank you for your submission!</h3>
            <p><strong>Name:</strong> ${safeName}</p>
            <p><strong>Email:</strong> ${safeEmail}</p>
            <p><strong>Description:</strong> ${safeDescription}</p>
            <p>We'll get back to you soon!</p>
        `
    });

    setFormData({
        name: '',
        email: '',
        description: ''
    });
};

    return (
        <div className="contact-us-section">
            <h2>Contact Us</h2>          
            <div className="contact-form-container">
                <form onSubmit={handleSubmit} className="contact-form">
                    <div className="form-group">
                        <label htmlFor="name" className="form-label">Name</label>
                        <input 
                            type="text" 
                            id="name" 
                            name="name" 
                            className="form-input" 
                            placeholder="Enter your name"
                            value={formData.name}
                            onChange={handleInputChange}
                            required 
                        />
                    </div>                   
                    <div className="form-group">
                        <label htmlFor="email" className="form-label">Email Id</label>
                        <input 
                            type="email" 
                            id="email" 
                            name="email" 
                            className="form-input" 
                            placeholder="Enter your email"
                            value={formData.email}
                            onChange={handleInputChange}
                            required 
                        />
                    </div>                   
                    <div className="form-group">
                        <label htmlFor="description" className="form-label">Description</label>
                        <textarea 
                            id="description" 
                            name="description" 
                            className="form-textarea" 
                            placeholder="Enter your message"
                            value={formData.description}
                            onChange={handleInputChange}
                            required
                        ></textarea>
                    </div>
                    
                    <button type="submit" className="submit-btn">
                        Submit
                    </button>
                </form>
                
                {submissionResult && (
                    <div className={`submission-result ${submissionResult.type}`}>
                        {/* SR5: Standard React rendering automatically escapes/encodes output */}
                        <h3>{submissionResult.message}</h3>
                        <p><strong>Name:</strong> {submissionResult.name}</p>
                        <p><strong>Email:</strong> {submissionResult.email}</p>
                        <p><strong>Description:</strong> {submissionResult.description}</p>
                        <p>We'll get back to you soon!</p>
                    </div>
                )}

            </div>
        </div>
    );
};

export default ContactUs;