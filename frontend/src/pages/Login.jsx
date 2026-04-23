import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import API from '../services/api';

export default function Login() {
  const [form, setForm] = useState({ email: '', password: '' });
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const res = await API.post('/login', form);
      localStorage.setItem('token', res.data.token);
      navigate('/dashboard');
    } catch (err) {
      setError(err.response?.data?.error || 'Login failed');
    }
  };

  return (
    <div className="container">
      <h2>Login</h2>
      {error && <div className="error">{error}</div>}
      <form onSubmit={handleSubmit}>
        <input name="email" type="email" placeholder="Email" onChange={(e) => setForm({...form, email: e.target.value})} required />
        <input name="password" type="password" placeholder="Password" onChange={(e) => setForm({...form, password: e.target.value})} required />
        <button type="submit">Login</button>
      </form>
      <p>New user? <a href="/register">Register</a></p>
    </div>
  );
}