import { Link } from 'react-router-dom';
import { money } from '../utils.js';

export default function Cart({ cart, onChange, onRemove, onClear }) {
  const total = cart.reduce((sum, item) => sum + Number(item.price) * item.quantity, 0);

  return (
    <main className="container page">
      <p className="eyebrow">YOUR BAG</p>
      <h1>Shopping cart</h1>
      {!cart.length ? (
        <p>Your cart is empty. <Link to="/products">Explore products</Link></p>
      ) : (
        <>
          <div className="cart-list">
            {cart.map((item) => (
              <div className="cart-row" key={item._id}>
                <div>
                  <b>{item.name}</b>
                  <p>{money(item.price)} each</p>
                </div>
                <div className="qty">
                  <button aria-label="Decrease quantity" onClick={() => onChange(item._id, Math.max(1, item.quantity - 1))}>−</button>
                  <span>{item.quantity}</span>
                  <button aria-label="Increase quantity" onClick={() => onChange(item._id, item.quantity + 1)}>+</button>
                  <button className="remove" onClick={() => onRemove(item._id)}>Remove</button>
                </div>
              </div>
            ))}
          </div>
          <div className="cart-total"><span>Total</span><strong>{money(total)}</strong></div>
          <div className="btn-row">
            <Link className="primary-btn" to="/checkout">Proceed to checkout</Link>
            <button className="remove" onClick={onClear}>Clear cart</button>
          </div>
        </>
      )}
    </main>
  );
}
