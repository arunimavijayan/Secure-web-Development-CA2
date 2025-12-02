import React, { useState, useEffect } from 'react';
import './searchUsers.css';

const SearchUsers = () => {
    const [searchQuery, setSearchQuery] = useState('');
    const [results, setResults] = useState([]);
    const [sqlQuery, setSqlQuery] = useState('');
    const [user, setUser] = useState({});
    const [isAdmin, setIsAdmin] = useState(false);
    
    // Check if user is admin on component mount
    useEffect(() => {
        const userData = JSON.parse(localStorage.getItem('user') || '{}');
        setUser(userData);
        setIsAdmin(userData.role === 'admin');
    }, []);

    // Simulated database (like a real SQL database)
    const fakeUsersDB = [
        { id: 1, username: 'John', email: 'john@securecart.com', password: 'John123', role: 'user', creditCard: '1234-5678-9012-3456' },
        { id: 2, username: 'Admin', email: 'admin@securecart.com', password: 'admin123', role: 'admin', creditCard: '1111-2222-3333-4444' },
        { id: 3, username: 'Arunima', email: 'arunima@securecart.com', password: 'arun123', role: 'admin', creditCard: '5555-6666-7777-8888' },
        { id: 4, username: 'Alice', email: 'alice@securecart.com', password: 'alice123', role: 'user', creditCard: '9999-0000-1111-2222' },
        { id: 5, username: 'Bob', email: 'bob@securecart.com', password: 'bob123', role: 'user', creditCard: '3333-4444-5555-6666' }
    ];

    // VULNERABLE SQL PARSER (simulates backend SQL execution)
    const executeVulnerableSQL = (query) => {
        console.log('Executing SQL:', query);
        
        // Extract the WHERE condition from SQL
        const whereMatch = query.match(/WHERE\s+(.+)/i);
        if (!whereMatch) return fakeUsersDB;
        
        const whereClause = whereMatch[1];
        
        try {
            // Convert SQL condition to JavaScript
            let jsCondition = whereClause
                .replace(/username\s*=/i, 'user.username ===')
                .replace(/email\s*=/i, 'user.email ===')
                .replace(/role\s*=/i, 'user.role ===')
                .replace(/id\s*=/i, 'user.id ===')
                .replace(/'1'='1'/g, 'true')
                .replace(/'1'='2'/g, 'false')
                .replace(/1=1/g, 'true')
                .replace(/1=2/g, 'false');
            
            // Handle OR conditions
            if (jsCondition.includes('OR')) {
                jsCondition = jsCondition.replace(/OR/gi, '||');
            }
            
            // Handle AND conditions  
            if (jsCondition.includes('AND')) {
                jsCondition = jsCondition.replace(/AND/gi, '&&');
            }
            
            console.log('Converted to JS:', jsCondition);
            
            // Filter users based on condition
            return fakeUsersDB.filter(user => {
                try {
                    return eval(jsCondition);
                } catch (e) {
                    console.error('Error in condition:', e);
                    return false;
                }
            });
            
        } catch (error) {
            console.error('SQL parse error:', error);
            return [];
        }
    };

    const searchUsers = () => {
        if (!isAdmin) {
            alert(' Access Denied!\n\nOnly administrators can search users.');
            return;
        }

        // Build vulnerable SQL query
        const vulnerableSQL = `SELECT * FROM users WHERE username = '${searchQuery}'`;
        setSqlQuery(vulnerableSQL);
        
        // Execute the vulnerable query
        const filteredResults = executeVulnerableSQL(vulnerableSQL);
        setResults(filteredResults);
        
        
    };

    // If not admin, show access denied message
    if (!isAdmin) {
        return (
            <div className="search-users-section">
                <div className="access-denied">
                    <h2> Admin Access Required</h2>
                    
                    <p className="denied-message">
                        <strong>Access to User Search is restricted to administrators only.</strong>
                    </p>
                    <p>Current user: <strong>{user.username || 'Not logged in'}</strong></p>
                    <p>Role: <strong>{user.role || 'No role assigned'}</strong></p>
                    
                    
                    
                    
                </div>
            </div>
        );
    }

    return (
        <div className="search-users-section">
            <div className="admin-banner">
                <h2>Admin User Search</h2>
                <div className="admin-badge">
                     Logged in as: <strong>{user.username}</strong> (Admin)
                </div>
            </div>
            
            <div className="search-box">
                <input
                    type="text"
                    placeholder="Enter username"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="search-input"
                />
                <button onClick={searchUsers} className="search-btn">
                    Execute Search
                </button>
            </div>
            
            <div className="sql-demo">
                <h4>Generated SQL Query:</h4>
                <code className="sql-code">{sqlQuery || 'No query executed yet'}</code>
            </div>
            <div className="results-section">
                <h3> Results ({results.length} users):</h3>
                
                {results.length === 0 ? (
                    <p className="no-results">No users found</p>
                ) : (
                    <div className="results-table-container">
                        <table className="vulnerable-table">
                            <thead>
                                <tr className="table-header">
                                    <th>ID</th>
                                    <th>Username</th>
                                    <th>Role</th>
                                    <th>Email</th>
                                    <th>Password</th>
                                    <th>Credit Card</th>
                                </tr>
                            </thead>
                            <tbody>
                                {results.map(user => (
                                    <tr key={user.id} className="user-row">
                                        <td className="user-id">#{user.id}</td>
                                        <td className="user-username">
                                            <strong> {user.username}</strong>
                                        </td>
                                        <td className="user-username">
                                            <span className={`user-username ${user.role}`}>
                                                {user.role}
                                            </span>
                                        </td>
                                        <td className="user-username">
                                            {user.email}
                                        </td>
                                        <td className="user-username">
                                            <span className="user-username">
                                                {user.password}
                                            </span>
                                        </td>
                                        <td className="user-username">
                                            <span className="user-username">
                                                {user.creditCard}
                                            </span>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                )}
            </div>
        </div>
    );
};

export default SearchUsers;