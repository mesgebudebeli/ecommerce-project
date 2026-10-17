import api from './api.js';

// Demo products keep the UI usable before the API is set up.
export const demoProducts = [
  { _id: 'demo-1', name: 'Wireless Headphones', price: 2499, category: 'Electronics', stock: 12, description: 'Comfortable everyday audio.' },
  { _id: 'demo-2', name: 'Everyday Backpack', price: 1599, category: 'Fashion', stock: 20, description: 'A durable bag for work and travel.' },
  { _id: 'demo-3', name: 'Smart Watch', price: 3299, category: 'Electronics', stock: 8, description: 'Track activity and stay connected.' },
  { _id: 'demo-4', name: 'Desk Lamp', price: 899, category: 'Home & Living', stock: 30, description: 'A clean, modern desk light.' },
];

export async function fetchProducts() {
  try {
    const { data } = await api.get('/products');
    const rows = data.data || data;
    if (Array.isArray(rows) && rows.length) return { products: rows, live: true };
  } catch {/* API not reachable yet; fall back to demo data. */}
  return { products: demoProducts, live: false };
}

export async function fetchProduct(id) {
  try {
    const { data } = await api.get(`/products/${id}`);
    if (data && data._id) return data;
  } catch {/* fall through */}
  return null;
}
