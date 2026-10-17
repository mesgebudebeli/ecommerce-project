import { useMemo } from 'react';
import { useSearchParams } from 'react-router-dom';
import ProductCard from '../components/ProductCard.jsx';

export default function Products({ products, search, addToCart }) {
  const [params, setParams] = useSearchParams();
  const category = params.get('category') || '';

  const categories = useMemo(() => [...new Set(products.map((p) => p.category).filter(Boolean))], [products]);

  const filtered = useMemo(() => products.filter((p) => {
    const matchesSearch = `${p.name} ${p.category || ''}`.toLowerCase().includes(search.toLowerCase());
    const matchesCategory = !category || p.category === category;
    return matchesSearch && matchesCategory;
  }), [products, search, category]);

  function pickCategory(value) {
    if (value) setParams({ category: value });
    else setParams({});
  }

  return (
    <main className="container page wide">
      <p className="eyebrow">BROWSE</p>
      <h1>All products</h1>
      <div className="chip-row">
        <button className={`chip ${!category ? 'active' : ''}`} onClick={() => pickCategory('')}>All</button>
        {categories.map((c) => (
          <button key={c} className={`chip ${category === c ? 'active' : ''}`} onClick={() => pickCategory(c)}>{c}</button>
        ))}
      </div>
      {search && <p className="muted">Showing results for “{search}”.</p>}
      <div className="product-grid">
        {filtered.map((p) => <ProductCard key={p._id} product={p} addToCart={addToCart} />)}
      </div>
      {!filtered.length && <p>No products found. Try another search or category.</p>}
    </main>
  );
}
