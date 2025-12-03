import React, { useState, useEffect } from 'react';
import './searchUsers.css';

const SearchUsers = () => {
    const [searchQuery, setSearchQuery] = useState('');
    const [results, setResults] = useState([]);
    const [sqlQuery, setSqlQuery] = useState('');
    const [user, setUser] = useState({});
    const [isAdmin, setIsAdmin] = useState(false);

    useEffect(() => {
        const userData = JSON.parse(localStorage.getItem('user') || '{}');
        setUser(userData);
        setIsAdmin(userData.role === 'admin');
    }, []);

    useEffect(() => {
    // Add security event listeners
    const handleCopy = (e) => {
        if (e.target.className?.includes('sensitive-data')) {
            e.preventDefault();
            alert('Copying sensitive data is not allowed');
        }
    };

    const handleKeydown = (e) => {
        // Prevent F12 for dev tools (for demo purposes)
        if (e.key === 'F12') {
            e.preventDefault();
            alert('Developer tools are disabled on this page for security');
            return false;
        }
    };

    document.addEventListener('copy', handleCopy);
    document.addEventListener('keydown', handleKeydown);

    return () => {
        document.removeEventListener('copy', handleCopy);
        document.removeEventListener('keydown', handleKeydown);
    };
}, []);

    //commented by Arunima for securing from SQL Injection
    // const fakeUsersDB = [
    //     { id: 1, username: 'John', email: 'john@securecart.com', password: 'John123', role: 'user', creditCard: '1234-5678-9012-3456' },
    //     { id: 2, username: 'Admin', email: 'admin@securecart.com', password: 'admin123', role: 'admin', creditCard: '1111-2222-3333-4444' },
    //     { id: 3, username: 'Arunima', email: 'arunima@securecart.com', password: 'arun123', role: 'admin', creditCard: '5555-6666-7777-8888' },
    //     { id: 4, username: 'Alice', email: 'alice@securecart.com', password: 'alice123', role: 'user', creditCard: '9999-0000-1111-2222' },
    //     { id: 5, username: 'Bob', email: 'bob@securecart.com', password: 'bob123', role: 'user', creditCard: '3333-4444-5555-6666' }
    // ];

    //New Secure DB values- Addition 1
    const fakeUsersDB = [
    { id: 1, username: 'John', email: 'john@securecart.com', role: 'user' },
    { id: 2, username: 'Admin', email: 'admin@securecart.com', role: 'admin' },
    { id: 3, username: 'Arunima', email: 'arunima@securecart.com', role: 'admin' },
    { id: 4, username: 'Alice', email: 'alice@securecart.com', role: 'user' },
    { id: 5, username: 'Bob', email: 'bob@securecart.com', role: 'user' }
    ];

    // Addition 2
    const sanitizeInput = (input) => {
    if (!input) return '';
    
    // Remove SQL keywords and dangerous characters
    const dangerousPatterns = [
        /(\b(SELECT|INSERT|UPDATE|DELETE|DROP|UNION|OR|AND|EXEC|EXECUTE)\b)/gi,
        /('|"|;|--|\/\*|\*\/|\\|\|)/g
    ];
    
    let sanitized = input;
    dangerousPatterns.forEach(pattern => {
        sanitized = sanitized.replace(pattern, '');
    });

    sanitized = sanitized.trim().substring(0, 100);
    return sanitized;
    };

    // const executeVulnerableSQL = (query) => {
    //     console.log('Executing SQL:', query);
    //     const whereMatch = query.match(/WHERE\s+(.+)/i);
    //     if (!whereMatch) return fakeUsersDB;
        
    //     const whereClause = whereMatch[1];
        
    //     try {

    //         let jsCondition = whereClause
    //             .replace(/username\s*=/i, 'user.username ===')
    //             .replace(/email\s*=/i, 'user.email ===')
    //             .replace(/role\s*=/i, 'user.role ===')
    //             .replace(/id\s*=/i, 'user.id ===')
    //             .replace(/'1'='1'/g, 'true')
    //             .replace(/'1'='2'/g, 'false')
    //             .replace(/1=1/g, 'true')
    //             .replace(/1=2/g, 'false');

    //         if (jsCondition.includes('OR')) {
    //             jsCondition = jsCondition.replace(/OR/gi, '||');
    //         }
  
    //         if (jsCondition.includes('AND')) {
    //             jsCondition = jsCondition.replace(/AND/gi, '&&');
    //         }
            
    //         console.log('Converted to JS:', jsCondition);
            
    //         return fakeUsersDB.filter(user => {
    //             try {
    //                 return eval(jsCondition);
    //             } catch (e) {
    //                 console.error('Error in condition:', e);
    //                 return false;
    //             }
    //         });
            
    //     } catch (error) {
    //         console.error('SQL parse error:', error);
    //         return [];
    //     }
    // };

    // const searchUsers = () => {
    //     if (!isAdmin) {
    //         alert(' Access Denied!\n\nOnly administrators can search users.');
    //         return;
    //     }

    //     const vulnerableSQL = `SELECT * FROM users WHERE username = '${searchQuery}'`;
    //     setSqlQuery(vulnerableSQL);

    //     const filteredResults = executeVulnerableSQL(vulnerableSQL);
    //     setResults(filteredResults);
        
        
    // };

    //Addition 3
    const searchUsers = () => {
    // 1. Check admin status
    if (!isAdmin) {
        alert('Access Denied!\n\nOnly administrators can search users.');
        return;
    }

    // Addition 4
    if (!searchQuery || searchQuery.trim() === '') {
        alert('Please enter a search term');
        return;
    }
    
    const sanitizedQuery = sanitizeInput(searchQuery);
    
    const secureSQL = "SELECT id, username, email, role FROM users WHERE username = ?";
    setSqlQuery(`Secure Query: ${secureSQL}\nParameter: "${sanitizedQuery}"`);
    
    const filteredResults = fakeUsersDB.filter(user => {
        return user.username.toLowerCase() === sanitizedQuery.toLowerCase();
    });
 
    const safeResults = filteredResults.map(user => ({
        id: user.id,
        username: user.username,
        email: user.email,
        role: user.role
    }));
    
    setResults(safeResults);

    console.log(`[SECURITY LOG] Admin ${user.username} searched for: ${sanitizedQuery}`);

    if (searchQuery !== sanitizedQuery) {
        alert(`Input sanitized!\n\nYour input was sanitized for security.\nOriginal: "${searchQuery}"\nSanitized: "${sanitizedQuery}"`);
    }
    };

    // if (!isAdmin) {
    //     return (
    //         <div className="search-users-section">
    //             <div className="access-denied">
    //                 <h2> Admin Access Required</h2>
                    
    //                 <p className="denied-message">
    //                     <strong>Access to User Search is restricted to administrators only.</strong>
    //                 </p>
    //                 <p>Current user: <strong>{user.username || 'Not logged in'}</strong></p>
    //                 <p>Role: <strong>{user.role || 'No role assigned'}</strong></p>
                    
                    
                    
                    
    //             </div>
    //         </div>
    //     );
    // }
    //Addition 5
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
                
                {
                    <div className="results-section">
                            {results.length === 0 ? (
                                <p className="no-results">No users found matching your search criteria.</p>
                            ) : (
                                <div className="results-table-container">
                                    <table className="secure-table">
                                        <thead>
                                            <tr>
                                                <th>ID</th>
                                                <th>Username</th>
                                                <th>Role</th>
                                                <th>Email</th>
                                                <th>Status</th>
                                            </tr>
                                        </thead>
                                        <tbody>
                                            {results.map(user => (
                                                <tr key={user.id} className="user-row secure">
                                                    <td className="user-id">#{user.id}</td>
                                                    <td className="user-username">
                                                        <strong>{user.username}</strong>
                                                    </td>
                                                    <td className="user-role">
                                                        <span className={`role-badge ${user.role}`}>
                                                            {user.role}
                                                        </span>
                                                    </td>
                                                    <td className="user-email">
                                                        <span className="masked-email">
                                                            {user.email.replace(/(?<=.).(?=.*@)/g, '*')}
                                                        </span>
                                                    </td>
                                                    <td className="user-status">
                                                        <span className="status-active">Active</span>
                                                    </td>
                                                </tr>
                                            ))}
                                        </tbody>
                                    </table>
                                </div>
                            )}
                        </div>
                /* {results.length === 0 ? (
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
                )} */}
            </div>
        </div>
    );
};

export default SearchUsers;