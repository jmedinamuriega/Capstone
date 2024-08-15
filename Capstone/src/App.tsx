import React from 'react';
import { BrowserRouter as Router, Route, Routes, Navigate } from 'react-router-dom';
import { AuthProvider, useAuth } from './components/contexts/AuthContext';
import Register from './components/user/Register';
import Login from './components/user/Login';
import Dashboard from './components/dashboard/Dashboard';
import OrderForm from './components/orders/OrderForm';
import OrderHistory from './components/services/OrderHistory';
import Profile from './components/services/Profile'; 
import './App.css';

const App: React.FC = () => {
    return (
        <AuthProvider>
            <Router>
                <Routes>
                    <Route path="/register" element={<Register />} />
                    <Route path="/login" element={<Login />} />
                    <Route path="/dashboard/*" element={<PrivateRoute><Dashboard /></PrivateRoute>} />
                    <Route path="/" element={<Navigate to="/login" />} />
                </Routes>
            </Router>
        </AuthProvider>
    );
};

const PrivateRoute: React.FC<{ children: React.ReactNode }> = ({ children }) => {
    const { user } = useAuth();
    return user ? <>{children}</> : <Navigate to="/login" />;
};

export default App;
