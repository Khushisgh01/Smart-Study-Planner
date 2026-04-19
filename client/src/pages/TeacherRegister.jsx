import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { authService } from '../services/authService';

const TeacherRegister = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({ name: '', email: '', password: '' });
  const [error, setError] = useState('');

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleRegister = async (e) => {
    e.preventDefault();
    try {
      await authService.teacherRegister(formData);
      alert('Teacher Registration successful! Please login.');
      navigate('/teacher-login');
    } catch (err) {
      setError(err.message || 'User already exists');
    }
  };

  return (
    <div style={{ maxWidth: '400px', margin: '50px auto', padding: '20px', border: '1px solid #ccc' }}>
      <h2>Teacher Registration</h2>
      {error && <p style={{ color: 'red' }}>{error}</p>}
      
      <form onSubmit={handleRegister} style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
        <input name="name" placeholder="Full Name (e.g. Dr. Sharma)" onChange={handleChange} required />
        <input name="email" type="email" placeholder="Email" onChange={handleChange} required />
        <input name="password" type="password" placeholder="Password" onChange={handleChange} required />
        
        <button type="submit" style={{ padding: '10px', background: '#28a745', color: 'white', border: 'none' }}>
          Register as Teacher
        </button>
      </form>
      <p style={{ marginTop: '10px' }}>
        Already have an account? <a href="/teacher-login">Login here</a>
      </p>
    </div>
  );
};

export default TeacherRegister;