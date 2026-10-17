import { useEffect, useState } from 'react';
import { Link, useParams } from 'react-router-dom';
import { money } from '../utils.js';
import { fetchProduct } from '../services/products.js';

export default function ProductDetails({ products, addToCart }) {
  const { id } = useParams();
  const [extra, setExtra] = useState(null);
  const product = products.find((p) => String(p._id) === id) || extra;

  useEffect(() => {
    if (!product) fetchProduct(id).then(setExtra).catch(() => setExtra(null));
  }, [id]); // eslint-disable-line react-hooks/exhaustive-deps

  if (!product) return <main className="container page"><h2>Product not found</h2><Link to="/products">Back to products</Link></main>;

  return (
    <main className="container product-detail">
      <div className="detail-art">{(product.category || 'E').slice(0, 1)}</div>
      <div>
        <p className="eyebrow">{product.category || 'Product'}</p>
        <h1>{product.name}</h1>
        <h2>{money(product.price)}</h2>
        <p>{product.description || 'Quality product, ready to order.'}</p>
        <p>{product.stock > 0 ? `${product.stock} in stock` : 'Availability to be confirmed'}</p>
        <button className="primary-btn" onClick={() => addToCart(product)}>Add to cart</button>
        <p className="muted" style={{ marginTop: 16 }}><Link to="/products">← Back to products</Link></p>
      </div>
    </main>
  );
}
