import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { authService } from '../services/authService';

const StudentRegister = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    level: 'average', // default
    dailyHours: 0,
    target: ''
  });
  const [error, setError] = useState('');

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleRegister = async (e) => {
    e.preventDefault();
    try {
      // Ensure dailyHours is a number
      const payload = {
        ...formData,
        dailyHours: Number(formData.dailyHours)
      };
      
      await authService.studentRegister(payload);
      alert('Registration successful! Please login.');
      navigate('/login');
    } catch (err) {
      setError(err.message || 'User already exists or invalid data');
    }
  };

  return (
    <div className="register-container">
      <h2>Student Registration</h2>
      {error && <p style={{ color: 'red' }}>{error}</p>}
      
      <form onSubmit={handleRegister}>
        <input name="name" placeholder="Full Name" onChange={handleChange} required />
        <input name="email" type="email" placeholder="Email" onChange={handleChange} required />
        <input name="password" type="password" placeholder="Password" onChange={handleChange} required />
        
        <select name="level" value={formData.level} onChange={handleChange}>
          <option value="topper">Topper</option>
          <option value="average">Average</option>
          <option value="last-minute">Last Minute</option>
        </select>
        
        <input name="dailyHours" type="number" placeholder="Daily Study Hours" onChange={handleChange} required />
        <input name="target" placeholder="Target (e.g., GSoC 2026)" onChange={handleChange} required />
        
        <button type="submit">Register</button>
      </form>
    </div>
  );
};

export default StudentRegister;