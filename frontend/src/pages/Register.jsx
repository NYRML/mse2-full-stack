import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import API from '../services/api';

export default function Register() {
  const [form, setForm] = useState({ name: '', email: '', password: '' });
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const res = await API.post('/register', form);
      localStorage.setItem('token', res.data.token);
      navigate('/dashboard');
    } catch (err) {
      setError(err.response?.data?.error || 'Registration failed');
    }
  };

  return (
    <div className="container">
      <h2>Register</h2>
      {error && <div className="error">{error}</div>}
      <form onSubmit={handleSubmit}>
        <input name="name" placeholder="Full Name" onChange={(e) => setForm({...form, name: e.target.value})} required />
        <input name="email" type="email" placeholder="Email" onChange={(e) => setForm({...form, email: e.target.value})} required />
        <input name="password" type="password" placeholder="Password" onChange={(e) => setForm({...form, password: e.target.value})} required />
        <button type="submit">Register</button>
      </form>
      <p>Already have an account? <a href="/login">Login</a></p>
    </div>
  );
}   