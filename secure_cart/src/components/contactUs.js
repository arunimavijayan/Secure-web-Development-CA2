import React, { useState } from 'react';
import './contactUs.css';

const ContactUs = () => {
    const [formData, setFormData] = useState({
        name: '',
        email: '',
        description: ''
    });
    
    const [submissionResult, setSubmissionResult] = useState(null);

    // VULNERABLE: No input sanitization
    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: value
        }));
    };

    // VULNERABLE: Directly using user input without sanitization
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

        // Process form submission
        // VULNERABILITY: Directly inserting user input into JSX without sanitization
        setSubmissionResult({
            type: 'success',
            message: `
                <h3>Thank you for your submission!</h3>
                <p><strong>Name:</strong> ${formData.name}</p>
                <p><strong>Email:</strong> ${formData.email}</p>
                <p><strong>Description:</strong> ${formData.description}</p>
                <p>We'll get back to you soon!</p>
            `
        });

        // Clear form
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
                    <div 
                        className={`submission-result ${submissionResult.type}`}
                        // VULNERABILITY: Using dangerouslySetInnerHTML without sanitization
                        dangerouslySetInnerHTML={{ __html: submissionResult.message }}
                    />
                )}
            </div>
        </div>
    );
};

export default ContactUs;