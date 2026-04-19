import React from 'react';
import { authService } from '../services/authService';

const StudentDashboard = () => {
  const user = authService.getCurrentUser();

  const handleLogout = () => {
    authService.logout();
  };

  return (
    <div style={{ padding: '20px', textAlign: 'center' }}>
      <h2>Student Dashboard</h2>
      <p>Welcome, {user?.name || 'Student'}!</p>
      <p>Your target: {user?.target}</p>
      
      <button 
        onClick={handleLogout} 
        style={{ marginTop: '20px', padding: '10px 20px', cursor: 'pointer' }}
      >
        Logout
      </button>
    </div>
  );
};

export default StudentDashboard;