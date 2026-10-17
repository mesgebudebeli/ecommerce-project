import { Link } from 'react-router-dom';
import { money } from '../utils.js';

export default function ProductCard({ product, addToCart }) {
  return (
    <article className="product-card">
      <Link to={`/product/${product._id}`} className="product-art">
        <span>{(product.category || 'Shop').slice(0, 1).toUpperCase()}</span>
      </Link>
      <div className="product-info">
        <small>{product.category || 'General'}</small>
        <h3>{product.name}</h3>
        <p>{money(product.price)}</p>
        <button className="primary-btn full" onClick={() => addToCart(product)}>Add to cart</button>
      </div>
    </article>
  );
}
