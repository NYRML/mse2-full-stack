import React, { useState } from 'react';
import API from '../api';
import { useNavigate, Link } from 'react-router-dom';
import '../styles/auth.css';

export default function Register() {
  const [form, setForm] = useState({ name: '', email: '', password: '' });
  const [msg, setMsg] = useState('');
  const navigate = useNavigate();

  const handleChange = e => setForm({ ...form, [e.target.name]: e.target.value });

  const handleSubmit = async e => {
    e.preventDefault();
    try {
      await API.post('/register', form);
      setMsg('Registered! Redirecting...');
      setTimeout(() => navigate('/login'), 1000);
    } catch (err) {
      setMsg(err.response?.data?.message || 'Error');
    }
  };

  return (
    <div className="auth-container">
      <div className="auth-box">
        <h2>🔍 Lost & Found</h2>
        <h3>Register</h3>
        {msg && <p className="msg">{msg}</p>}
        <form onSubmit={handleSubmit}>
          <input name="name" placeholder="Full Name" onChange={handleChange} required />
          <input name="email" type="email" placeholder="Email" onChange={handleChange} required />
          <input name="password" type="password" placeholder="Password" onChange={handleChange} required />
          <button type="submit">Register</button>
        </form>
        <p>Already have an account? <Link to="/login">Login</Link></p>
      </div>
    </div>
  );
}
