import api from './api.js';

// Server-side cart (requires login). Calls are best-effort: the local cart in
// App state stays authoritative for the UI so the storefront works offline.
export function getServerCart() {
  return api.get('/cart').then(({ data }) => data.items || []);
}

export function addServerItem(product_id, quantity = 1) {
  return api.post('/cart', { product_id, quantity }).then(({ data }) => data.items || []);
}

export function replaceServerCart(items) {
  return api.put('/cart', { items: items.map((i) => ({ product_id: i._id, quantity: i.quantity })) });
}

export function clearServerCart() {
  return api.delete('/cart');
}
