import React, { useState } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { useNavigate } from 'react-router-dom';
import './Register.css';

const Register: React.FC = () => {
    const { register } = useAuth();
    const [username, setUsername] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState<string | null>(null);
    const navigate = useNavigate();

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setError(null);  

        try {
            await register(username, email, password);
            alert('Registration successful!');
            navigate('/login');
        } catch (err: any) {
            if (err.response && err.response.data) {
                const message = err.response.data.message;
                if (message.includes('email')) {
                    setError('Email is already taken. Please try a different one.');
                } else if (message.includes('username')) {
                    setError('Username is already taken. Please try a different one.');
                } else {
                    setError('Registration failed! Please try again.');
                }
            } else {
                setError('Registration failed! Please try again.');
            }
        }
    };

    return (
        <div className="auth-container">
            <form className="auth-form" onSubmit={handleSubmit}>
                <h2>Register</h2>
                <div>
                    <label>Username:</label>
                    <input 
                        type="text" 
                        value={username} 
                        onChange={(e) => setUsername(e.target.value)} 
                        required 
                    />
                </div>
                <div>
                    <label>Email:</label>
                    <input 
                        type="email" 
                        value={email} 
                        onChange={(e) => setEmail(e.target.value)} 
                        required 
                    />
                </div>
                <div>
                    <label>Password:</label>
                    <input 
                        type="password" 
                        value={password} 
                        onChange={(e) => setPassword(e.target.value)} 
                        required 
                    />
                </div>
                {error && <p className="error-message">{error}</p>}
                <button type="submit">Register</button>
                <button className="register-button" onClick={() => navigate('/login')}>Already have an account? Login</button>
            </form>
        </div>
    );
};

export default Register;
