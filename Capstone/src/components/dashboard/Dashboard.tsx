import React, { useEffect } from 'react';
import { Link, Route, Routes, useLocation, useNavigate } from 'react-router-dom';
import OrderHistory from '../services/OrderHistory';
import Profile from '../services/Profile';
import OrderForm from '../orders/OrderForm'; 
import { useAuth } from '../contexts/AuthContext';
import './Dashboard.css';

const Dashboard: React.FC = () => {
  const { user, logout } = useAuth();
  const location = useLocation();
  const navigate = useNavigate();

  useEffect(() => {
    if (user) {
      console.log("User loaded:", user);
    }
  }, [user]);


  const isDashboardPath = location.pathname === '/dashboard';

  return (
    <div className="dashboard-wrapper">
      <div 
        className={`dashboard-container ${isDashboardPath ? 'dashboard-background' : ''}`}
      >
        <nav className="dashboard-navbar">
          <ul>
            <li><Link to="/dashboard">Home</Link></li>
            <li><Link to="/dashboard/order-form">Order Form</Link></li>
            <li><Link to="/dashboard/order-history">Order History</Link></li>
            <li><Link to="/dashboard/profile">Profile</Link></li>
            <li><button onClick={logout}>Logout</button></li>
          </ul>
        </nav>
        
        <div className="dashboard-main-content">
          <Routes>
            <Route path="order-form" element={<OrderForm />} />
            <Route path="order-history" element={<OrderHistory />} />
            <Route path="profile" element={<Profile />} />
          </Routes>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
