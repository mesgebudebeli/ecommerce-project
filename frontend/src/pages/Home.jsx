import { Link } from 'react-router-dom';
import ProductCard from '../components/ProductCard.jsx';

export default function Home({ products, addToCart }) {
  const featured = products.slice(0, 8);
  const categories = [...new Set(products.map((p) => p.category).filter(Boolean))];

  return (
    <>
      <section className="hero">
        <div>
          <p className="eyebrow">THE EVERYDAY MARKETPLACE</p>
          <h1>Better products.<br /><span>Better living.</span></h1>
          <p>Discover useful finds for your home, work and everyday life.</p>
          <Link className="primary-btn" to="/products">Shop products</Link>
        </div>
        <div className="hero-art">
          <div className="orb orb-one" /><div className="orb orb-two" />
          <div className="hero-card"><span>✦</span><b>Fresh finds</b><small>Curated for you</small></div>
        </div>
      </section>

      <main className="container">
        {categories.length > 0 && (
          <div className="chip-row">
            {categories.map((category) => (
              <Link key={category} className="chip" to={`/products?category=${encodeURIComponent(category)}`}>{category}</Link>
            ))}
          </div>
        )}
        <div className="section-heading">
          <div><p className="eyebrow">OUR COLLECTION</p><h2>Featured products</h2></div>
          <Link to="/products">View all ({products.length})</Link>
        </div>
        <div className="product-grid">
          {featured.map((p) => <ProductCard key={p._id} product={p} addToCart={addToCart} />)}
        </div>
        {!products.length && <p>No products found. Try another search.</p>}
      </main>
    </>
  );
}
