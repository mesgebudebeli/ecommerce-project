import api from './api.js';

// Payment client. Server recalculates all totals from trusted product prices;
// the browser never decides the amount or whether a payment succeeded.
export async function createOrder({ items, shipping_address, payment_method }) {
  const { data } = await api.post('/orders', { items, shipping_address, payment_method });
  return data;
}

export async function initiatePayment(order_id, provider) {
  const { data } = await api.post('/payments/initiate', { order_id, provider });
  return data;
}

export async function fetchMyOrders() {
  const { data } = await api.get('/orders/my-orders');
  return data.data || [];
}

export async function fetchAdminOrders() {
  const { data } = await api.get('/admin/orders');
  return data.data || [];
}
