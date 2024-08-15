import React, { useState } from 'react';
import { useAuth } from '../contexts/AuthContext';
import './Profile.css';

const Profile: React.FC = () => {
  const { user, updateUser, deleteUser } = useAuth();
  const [username, setUsername] = useState(user?.username || '');
  const [email, setEmail] = useState(user?.email || '');

  if (!user) {
    return <p className="message">You need to log in first.</p>;
  }

  const handleUpdate = (e: React.FormEvent) => {
    e.preventDefault();
    updateUser({ username, email });
  };

  const handleDelete = () => {
    if (window.confirm("Are you sure you want to delete your account? This action cannot be undone.")) {
      deleteUser();
    }
  };

  return (
    <div className="profile-container">
      <h2 className="profile-heading">Your Profile</h2>
      <form className="profile-form" onSubmit={handleUpdate}>
        <div className="form-group">
          <label htmlFor="username">Username:</label>
          <input
            type="text"
            id="username"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            required
          />
        </div>
        <div className="form-group">
          <label htmlFor="email">Email:</label>
          <input
            type="email"
            id="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />
        </div>
        <div className="button-container">
          <button type="submit" className="update-button">Update Profile</button>
          <button type="button" onClick={handleDelete} className="delete-button">Delete Account</button>
        </div>
      </form>
    </div>
  );
};

export default Profile;
