import { useEffect, useState } from 'react';
import { Link, Navigate } from 'react-router-dom';
import { money, orderDate } from '../utils.js';
import { fetchMyOrders } from '../services/payment.js';

export default function Orders({ user }) {
  const [orders, setOrders] = useState([]);
  const [error, setError] = useState('');

  useEffect(() => {
    if (!user) return;
    fetchMyOrders().then(setOrders).catch((err) => setError(err.response?.data?.message || 'Could not load orders.'));
  }, [user]);

  if (!user) return <Navigate to="/login" replace />;

  return (
    <main className="container page wide">
      <p className="eyebrow">YOUR HISTORY</p>
      <h1>My orders</h1>
      {error && <p className="error">{error}</p>}
      {!orders.length && !error && <p>No orders yet. <Link to="/products">Start shopping</Link></p>}
      {orders.map((order) => (
        <article className="order-card" key={order._id}>
          <div className="order-head">
            <div>
              <b>{order.order_number}</b>
              <p className="muted">{orderDate(order.created_at)}</p>
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
          <div className="cart-total"><span>Total</span><strong>{money(order.subtotal)}</strong></div>
        </article>
      ))}
    </main>
  );
}
