import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';

export default function Login({ onLogin }) {
  const navigate = useNavigate();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');

  async function submit(e) {
    e.preventDefault();
    setError('');
    try {
      await onLogin(email, password);
      navigate('/');
    } catch (err) {
      if (!err.response) {
        setError('Cannot reach the API server. Start the backend (php artisan serve) and check VITE_API_URL.');
      } else if (err.response.status === 422) {
        setError(err.response.data?.message || 'Invalid email or password.');
      } else {
        setError(err.response.data?.message || `Login failed (HTTP ${err.response.status}).`);
      }
    }
  }

  return (
    <main className="container auth-page">
      <form className="auth-card" onSubmit={submit}>
        <p className="eyebrow">WELCOME BACK</p>
        <h1>Log in</h1>
        <label>Email<input type="email" required autoComplete="email" value={email} onChange={(e) => setEmail(e.target.value)} /></label>
        <label>Password<input type="password" required autoComplete="current-password" value={password} onChange={(e) => setPassword(e.target.value)} /></label>
        <button className="primary-btn full">Log in securely</button>
        {error && <p className="error">{error}</p>}
        <p>New here? <Link to="/register">Create an account</Link></p>
      </form>
    </main>
  );
}
