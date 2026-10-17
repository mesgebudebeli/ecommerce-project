import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import api from '../services/api.js';

export default function Register() {
  const navigate = useNavigate();
  const [form, setForm] = useState({ name: '', email: '', password: '', password_confirmation: '' });
  const [message, setMessage] = useState('');

  async function submit(e) {
    e.preventDefault();
    try {
      await api.post('/register', form);
      setMessage('Account created. Redirecting to login…');
      setTimeout(() => navigate('/login'), 900);
    } catch (err) {
      const errors = err.response?.data?.errors;
      const firstError = errors ? Object.values(errors).flat().join(' ') : '';
      setMessage(firstError || err.response?.data?.message || 'Registration failed. Check the API and form validation.');
    }
  }

  return (
    <main className="container auth-page">
      <form className="auth-card" onSubmit={submit}>
        <p className="eyebrow">JOIN E-SHOP</p>
        <h1>Create account</h1>
        {[['name', 'Full name', 'text'], ['email', 'Email', 'email'], ['password', 'Password', 'password'], ['password_confirmation', 'Confirm password', 'password']].map(([key, label, type]) => (
          <label key={key}>{label}
            <input
              required
              type={type}
              minLength={key.startsWith('password') ? 10 : undefined}
              autoComplete={key === 'password' ? 'new-password' : key === 'email' ? 'email' : 'off'}
              value={form[key]}
              onChange={(e) => setForm({ ...form, [key]: e.target.value })}
            />
          </label>
        ))}
        <button className="primary-btn full">Create account</button>
        {message && <p role="status">{message}</p>}
        <p>Already registered? <Link to="/login">Log in</Link></p>
      </form>
    </main>
  );
}
