import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { money } from '../utils.js';
import { createOrder } from '../services/payment.js';
import { clearServerCart } from '../services/cart.js';

export default function Checkout({ cart, user, onOrdered }) {
  const [method, setMethod] = useState('telebirr');
  const [address, setAddress] = useState('');
  const [message, setMessage] = useState('');
  const navigate = useNavigate();
  const total = cart.reduce((sum, item) => sum + Number(item.price) * item.quantity, 0);

  async function submit(e) {
    e.preventDefault();
    if (!user) { setMessage('Please log in before checkout.'); return; }
    if (!cart.length) { setMessage('Your cart is empty.'); return; }
    try {
      const data = await createOrder({
        items: cart.map((i) => ({ product_id: i._id, quantity: i.quantity })),
        shipping_address: address,
        payment_method: method,
      });
      onOrdered();
      clearServerCart().catch(() => {/* local cart already cleared */});
      if (data.checkout_url) {
        setMessage('Order created. Continue to the secure provider checkout.');
        window.location.assign(data.checkout_url);
      } else {
        setMessage(`Order ${data.order?.order_number || ''} created as pending. Payment setup may require merchant credentials.`);
        navigate('/orders');
      }
    } catch (err) {
      setMessage(err.response?.data?.message || 'Could not create order. Ensure the API is running and you are logged in.');
    }
  }

  return (
    <main className="container page">
      <p className="eyebrow">SECURE CHECKOUT</p>
      <h1>Checkout</h1>
      {!user && <p className="notice">You need to <Link to="/login">log in</Link> before checking out.</p>}
      <form className="checkout-form" onSubmit={submit}>
        <label>Delivery address
          <textarea required value={address} onChange={(e) => setAddress(e.target.value)} placeholder="City, area, street and delivery notes" />
        </label>
        <label>Payment method
          <select value={method} onChange={(e) => setMethod(e.target.value)}>
            <option value="telebirr">Telebirr</option>
            <option value="cbe">Commercial Bank of Ethiopia (CBE)</option>
          </select>
        </label>
        <div className="cart-total"><span>Order total</span><strong>{money(total)}</strong></div>
        <p className="muted">Payment remains pending until the server verifies the provider's response.</p>
        <button className="primary-btn" type="submit">Create order &amp; continue</button>
        {message && <p role="status" className="notice">{message}</p>}
      </form>
    </main>
  );
}
