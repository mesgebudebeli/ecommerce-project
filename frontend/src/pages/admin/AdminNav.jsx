import { Link } from 'react-router-dom';

export default function AdminNav({ current }) {
  const tabs = [
    ['/admin', 'Dashboard'],
    ['/admin/products', 'Products'],
    ['/admin/orders', 'Orders'],
  ];
  return (
    <nav className="admin-tabs">
      {tabs.map(([to, label]) => (
        <Link key={to} to={to} className={current === to ? 'active' : ''}>{label}</Link>
      ))}
      <Link to="/">← Back to store</Link>
    </nav>
  );
}
