import { Link, Navigate } from 'react-router-dom';

export default function Profile({ user, onLogout }) {
  if (!user) return <Navigate to="/login" replace />;

  return (
    <main className="container page">
      <p className="eyebrow">ACCOUNT</p>
      <h1>My profile</h1>
      <div className="auth-card">
        <label>Full name<input readOnly value={user.name || ''} /></label>
        <label>Email<input readOnly value={user.email || ''} /></label>
        <label>Account type<input readOnly value={user.role === 'admin' ? 'Administrator' : 'Customer'} /></label>
        <div className="btn-row">
          <Link className="primary-btn" to="/orders">View my orders</Link>
          <button className="remove" onClick={onLogout}>Log out</button>
        </div>
        {user.role === 'admin' && <p className="muted"><Link to="/admin">Open admin dashboard</Link></p>}
      </div>
    </main>
  );
}
