import { useEffect, useState } from 'react';
import { Navigate } from 'react-router-dom';
import api from '../../services/api.js';
import { money, orderDate } from '../../utils.js';
import { fetchAdminOrders } from '../../services/payment.js';
import AdminNav from './AdminNav.jsx';

const statuses = ['pending', 'processing', 'shipped', 'delivered', 'cancelled'];

export default function AdminOrders({ user }) {
  const [orders, setOrders] = useState([]);
  const [msg, setMsg] = useState('');

  useEffect(() => {
    if (user?.role !== 'admin') return;
    fetchAdminOrders().then(setOrders).catch((err) => setMsg(err.response?.data?.message || 'Could not load orders.'));
  }, [user]);

  if (!user) return <Navigate to="/login" replace />;
  if (user.role !== 'admin') return <Navigate to="/" replace />;

  // Fulfillment status only. payment_status changes exclusively through
  // server-verified provider callbacks — never from an admin form or browser claim.
  async function updateStatus(id, status) {
    try {
      const { data } = await api.put(`/admin/orders/${id}`, { status });
      const updated = data.order || data;
      setOrders((old) => old.map((o) => (String(o._id) === id ? updated : o)));
      setMsg(`Order ${updated.order_number || ''} marked ${status}.`);
    } catch (err) {
      setMsg(err.response?.data?.message || 'Could not update order.');
    }
  }

  return (
    <main className="container page wide">
      <p className="eyebrow">STORE CONTROL</p>
      <h1>Orders</h1>
      <AdminNav current="/admin/orders" />
      {msg && <p role="status">{msg}</p>}
      {!orders.length && <p>No orders yet.</p>}
      {orders.map((order) => (
        <article className="order-card" key={order._id}>
          <div className="order-head">
            <div>
              <b>{order.order_number}</b>
              <p className="muted">{orderDate(order.created_at)} · {order.payment_method}</p>
            </div>
            <div className="badge-row">
              <span className={`status-badge status-${order.payment_status || 'pending'}`}>Payment: {order.payment_status || 'pending'}</span>
              <span className={`status-badge status-${order.status || 'pending'}`}>Order: {order.status || 'pending'}</span>
            </div>
          </div>
          <ul>
            {(order.items || []).map((item, idx) => (
              <li key={idx}>{item.quantity} × {item.name} — {money(item.line_total ?? item.unit_price * item.quantity)}</li>
            ))}
          </ul>
          <p className="muted">Ship to: {order.shipping_address}</p>
          <div className="cart-total">
            <span>Total</span><strong>{money(order.subtotal)}</strong>
          </div>
          <label className="status-select">Fulfillment status
            <select value={order.status || 'pending'} onChange={(e) => updateStatus(order._id, e.target.value)}>
              {statuses.map((s) => <option key={s} value={s}>{s}</option>)}
            </select>
          </label>
        </article>
      ))}
    </main>
  );
}
