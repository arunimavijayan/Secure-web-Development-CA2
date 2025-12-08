import React, { useState, useEffect } from 'react';
import './searchUsers.css';

const SearchUsers = () => {
    const [searchQuery, setSearchQuery] = useState('');
    const [results, setResults] = useState([]);
    const [mongoQuery, setMongoQuery] = useState('');
    const [user, setUser] = useState({});
    const [isAdmin, setIsAdmin] = useState(false);

    useEffect(() => {
        const userData = JSON.parse(localStorage.getItem('user') || '{}');
        setUser(userData);
        setIsAdmin(userData.role === 'admin');
    }, []);

    useEffect(() => {
    const handleCopy = (e) => {
        if (e.target.className?.includes('sensitive-data')) {
            e.preventDefault();
            alert('Copying sensitive data is not allowed');
        }
    };

    const handleKeydown = (e) => {
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

    const searchUsers = () => {
        if (!isAdmin) {
            alert(' Access Denied!\n\nOnly administrators can search users.');
            return;
        }

        if (!searchQuery.trim()) {
            alert('Please enter a search term');
            return;
        }

        
        // Generate MongoDB query for display
        let mongoQueryStr;
        if (searchQuery.trim() === '{}') {
            mongoQueryStr = 'db.users.find({})';
        } 
        else if (searchQuery.trim().startsWith('{') && searchQuery.trim().endsWith('}')) {
            try {
                const parsed = JSON.parse(searchQuery);
                mongoQueryStr = `db.users.find({ username: ${JSON.stringify(parsed)} })`;
            } catch (e) {
                mongoQueryStr = `db.users.find({ username: "${searchQuery}" })`;
            }
        } else if (searchQuery === 'all' || searchQuery === '*') {
            mongoQueryStr = 'db.users.find({})';
        } else {
            mongoQueryStr = `db.users.find({ username: "${searchQuery}" })`;
        }
        setMongoQuery(mongoQueryStr);

        fetch('http://localhost:5000/api/search-users', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ search: searchQuery })
        })
        .then(response => response.json())
        .then(backendResults => {
            setResults(backendResults || []);
        })
        .catch(error => {
            console.log('Backend search failed:', error);
            alert('Search service unavailable');
            setResults([]);
        });
    };

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
                    placeholder="Enter username or MongoDB query (e.g., {})"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="search-input"
                />
                <button onClick={searchUsers} className="search-btn">
                    Execute Search
                </button>
            </div>
            
            <div className="sql-demo">
            
                <h4>Generated MongoDB Query:</h4>
                <code className="sql-code" style={{borderLeftColor: '#ff6b6b', background: '#fff5f5'}}>
                    {mongoQuery || 'No MongoDB query executed yet'}
                </code>
            
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
                                    <tr key={user.id || user._id} className="user-row">
                                        <td className="user-id">#{user.id || user._id}</td>
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
                                        <td className="user-username sensitive-data">
                                            {user.password || 'N/A'}
                                        </td>
                                        <td className="user-username sensitive-data">
                                            {user.creditCard || 'N/A'}
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