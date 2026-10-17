import { useEffect, useState } from 'react';
import { Link, Navigate } from 'react-router-dom';
import { money, orderDate } from '../../utils.js';
import { fetchAdminOrders } from '../../services/payment.js';
import AdminNav from './AdminNav.jsx';

export default function Dashboard({ user, products }) {
  const [orders, setOrders] = useState([]);
  const [error, setError] = useState('');

  useEffect(() => {
    if (user?.role !== 'admin') return;
    fetchAdminOrders().then(setOrders).catch((err) => setError(err.response?.data?.message || 'Could not load orders.'));
  }, [user]);

  if (!user) return <Navigate to="/login" replace />;
  if (user.role !== 'admin') return <Navigate to="/" replace />;

  const pendingPayments = orders.filter((o) => o.payment_status !== 'paid').length;
  const lowStock = products.filter((p) => Number(p.stock) <= 5).length;
  const revenue = orders.filter((o) => o.payment_status === 'paid').reduce((sum, o) => sum + Number(o.subtotal || 0), 0);

  const stats = [
    ['Products', products.length],
    ['Low stock (≤5)', lowStock],
    ['Orders', orders.length],
    ['Awaiting payment', pendingPayments],
    ['Paid revenue', money(revenue)],
  ];

  return (
    <main className="container page wide">
      <p className="eyebrow">STORE CONTROL</p>
      <h1>Admin dashboard</h1>
      <AdminNav current="/admin" />
      {error && <p className="error">{error}</p>}
      <div className="stat-grid">
        {stats.map(([label, value]) => (
          <div className="stat-card" key={label}><small>{label}</small><b>{value}</b></div>
        ))}
      </div>
      <div className="section-heading"><h2>Recent orders</h2><Link to="/admin/orders">Manage orders</Link></div>
      {!orders.length && <p>No orders yet.</p>}
      {orders.slice(0, 5).map((order) => (
        <div className="admin-row" key={order._id}>
          <span>{order.order_number} · {money(order.subtotal)} · {orderDate(order.created_at)}</span>
          <span className={`status-badge status-${order.payment_status || 'pending'}`}>{order.payment_status || 'pending'}</span>
        </div>
      ))}
      <p className="muted" style={{ marginTop: 18 }}><Link to="/admin/products">Add or manage products →</Link></p>
    </main>
  );
}
