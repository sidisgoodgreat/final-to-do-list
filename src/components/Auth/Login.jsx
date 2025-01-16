// src/components/Auth/Login.jsx
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import './Login.css';

const Login = () => {
    const [formData, setFormData] = useState({
        email: '',
        password: ''
    });
    const [error, setError] = useState('');
    const navigate = useNavigate();

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: value
        }));
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        const users = JSON.parse(localStorage.getItem('users') || '[]');
        const user = users.find(u => 
            (u.email === formData.email || u.phone === formData.email) && 
            u.password === formData.password
        );

        if (user) {
            localStorage.setItem('currentUser', JSON.stringify(user));
            navigate('/today');
        } else {
            setError('Invalid email/phone or password');
        }
    };

    return (
        <div className="login-container">
            <h2>Login</h2>
            <form onSubmit={handleSubmit} className="login-form">
                <div className="form-group">
                    <label>Email or Phone</label>
                    <input
                        type="text"
                        name="email"
                        value={formData.email}
                        onChange={handleChange}
                        required
                    />
                </div>

                <div className="form-group">
                    <label>Password</label>
                    <input
                        type="password"
                        name="password"
                        value={formData.password}
                        onChange={handleChange}
                        required
                    />
                </div>

                {error && <div className="error-message">{error}</div>}

                <button type="submit" className="submit-btn">Login</button>
                <button 
                    type="button" 
                    className="register-btn"
                    onClick={() => navigate('/register')}
                >
                    Register Now
                </button>
            </form>
        </div>
    );
};

export default Login;
