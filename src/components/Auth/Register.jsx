// src/components/Auth/Register.jsx
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import './Register.css';

const Register = () => {
    const navigate = useNavigate();
    const [formData, setFormData] = useState({
        name: '',
        avatar: '',
        password: '',
        confirmPassword: '',
        email: '',
        phone: ''
    });
    const [errors, setErrors] = useState({});
    const [dragActive, setDragActive] = useState(false);
    const [previewUrl, setPreviewUrl] = useState('');

    const validateForm = () => {
        const newErrors = {};
        
        if (!formData.name.trim()) {
            newErrors.name = 'Name is required';
        }

        if (!formData.password) {
            newErrors.password = 'Password is required';
        }

        if (formData.password !== formData.confirmPassword) {
            newErrors.confirmPassword = 'Passwords do not match';
        }

        if (!formData.email && !formData.phone) {
            newErrors.email = 'Either email or phone is required';
            newErrors.phone = 'Either email or phone is required';
        }

        return newErrors;
    };

    const handleDrag = (e) => {
        e.preventDefault();
        e.stopPropagation();
        if (e.type === "dragenter" || e.type === "dragover") {
            setDragActive(true);
        } else if (e.type === "dragleave") {
            setDragActive(false);
        }
    };

    const handleDrop = (e) => {
        e.preventDefault();
        e.stopPropagation();
        setDragActive(false);
        
        if (e.dataTransfer.files && e.dataTransfer.files[0]) {
            const file = e.dataTransfer.files[0];
            handleFile(file);
        }
    };

    const handleFile = (file) => {
        if (file.type.startsWith('image/')) {
            const reader = new FileReader();
            reader.onload = (e) => {
                setPreviewUrl(e.target.result);
                setFormData(prev => ({
                    ...prev,
                    avatar: e.target.result
                }));
            };
            reader.readAsDataURL(file);
        }
    };

    const handleFileInput = (e) => {
        if (e.target.files && e.target.files[0]) {
            const file = e.target.files[0];
            handleFile(file);
        }
    };

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: value
        }));
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        const validationErrors = validateForm();

        if (Object.keys(validationErrors).length === 0) {
            // Store in localStorage
            const users = JSON.parse(localStorage.getItem('users') || '[]');
            users.push(formData);
            localStorage.setItem('users', JSON.stringify(users));
            
            // Store current user
            localStorage.setItem('currentUser', JSON.stringify(formData));
            
            navigate('/login');
        } else {
            setErrors(validationErrors);
        }
    };

    return (
        <div className="auth-container">
            <h1 className="auth-title">Registration</h1>
            <form onSubmit={handleSubmit} className="auth-form">
                <div 
                    className={`avatar-drop-zone ${dragActive ? 'drag-active' : ''}`}
                    onDragEnter={handleDrag}
                    onDragLeave={handleDrag}
                    onDragOver={handleDrag}
                    onDrop={handleDrop}
                    onClick={() => document.getElementById('fileInput').click()}
                >
                    {previewUrl ? (
                        <img 
                            src={previewUrl} 
                            alt="Avatar preview" 
                            className="avatar-preview"
                        />
                    ) : (
                        <div className="drop-zone-text">
                            <p>Drag & Drop Profile Picture</p>
                            <p>or click to select</p>
                        </div>
                    )}
                    <input
                        type="file"
                        id="fileInput"
                        accept="image/*"
                        onChange={handleFileInput}
                        style={{ display: 'none' }}
                    />
                </div>

                <div className="form-group">
                    <label>Name *</label>
                    <input
                        type="text"
                        name="name"
                        value={formData.name}
                        onChange={handleChange}
                        className={errors.name ? 'error' : ''}
                        placeholder="Enter your name"
                    />
                    {errors.name && <span className="error-message">{errors.name}</span>}
                </div>

                <div className="form-group">
                    <label>Password *</label>
                    <input
                        type="password"
                        name="password"
                        value={formData.password}
                        onChange={handleChange}
                        className={errors.password ? 'error' : ''}
                        placeholder="Enter password"
                    />
                    {errors.password && <span className="error-message">{errors.password}</span>}
                </div>

                <div className="form-group">
                    <label>Confirm Password *</label>
                    <input
                        type="password"
                        name="confirmPassword"
                        value={formData.confirmPassword}
                        onChange={handleChange}
                        className={errors.confirmPassword ? 'error' : ''}
                        placeholder="Confirm password"
                    />
                    {errors.confirmPassword && <span className="error-message">{errors.confirmPassword}</span>}
                </div>

                <div className="form-group">
                    <label>Email</label>
                    <input
                        type="email"
                        name="email"
                        value={formData.email}
                        onChange={handleChange}
                        className={errors.email ? 'error' : ''}
                        placeholder="Enter email"
                    />
                    {errors.email && <span className="error-message">{errors.email}</span>}
                </div>

                <div className="form-group">
                    <label>Phone</label>
                    <input
                        type="tel"
                        name="phone"
                        value={formData.phone}
                        onChange={handleChange}
                        className={errors.phone ? 'error' : ''}
                        placeholder="Enter phone number"
                    />
                    {errors.phone && <span className="error-message">{errors.phone}</span>}
                </div>

                <button type="submit" className="submit-btn">Register</button>
                <button 
                    type="button" 
                    className="switch-auth-btn"
                    onClick={() => navigate('/login')}
                >
                    Already have an account? Login
                </button>
            </form>
        </div>
    );
};

export default Register;
