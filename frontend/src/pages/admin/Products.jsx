import { useState } from 'react';
import { Navigate } from 'react-router-dom';
import api from '../../services/api.js';
import { money } from '../../utils.js';
import AdminNav from './AdminNav.jsx';

const emptyForm = { name: '', category: 'General', price: '', stock: '', description: '' };

export default function AdminProducts({ user, products, setProducts }) {
  const [form, setForm] = useState(emptyForm);
  const [editingId, setEditingId] = useState(null);
  const [msg, setMsg] = useState('');

  if (!user) return <Navigate to="/login" replace />;
  if (user.role !== 'admin') return <Navigate to="/" replace />;

  async function submit(e) {
    e.preventDefault();
    const payload = { ...form, price: Number(form.price), stock: Number(form.stock) };
    try {
      if (editingId) {
        const { data } = await api.put(`/admin/products/${editingId}`, payload);
        const updated = data.product || data;
        setProducts((old) => old.map((p) => (String(p._id) === editingId ? updated : p)));
        setMsg('Product updated.');
        setEditingId(null);
      } else {
        const { data } = await api.post('/admin/products', payload);
        setProducts((old) => [data.product || data, ...old]);
        setMsg('Product added.');
      }
      setForm(emptyForm);
    } catch (err) {
      setMsg(err.response?.data?.message || 'Admin API request failed. Confirm admin permissions.');
    }
  }

  function startEdit(product) {
    setEditingId(String(product._id));
    setForm({
      name: product.name || '',
      category: product.category || 'General',
      price: product.price ?? '',
      stock: product.stock ?? '',
      description: product.description || '',
    });
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }

  function cancelEdit() {
    setEditingId(null);
    setForm(emptyForm);
  }

  async function remove(id) {
    if (!window.confirm('Delete this product? This cannot be undone.')) return;
    try {
      await api.delete(`/admin/products/${id}`);
      setProducts((old) => old.filter((p) => String(p._id) !== id));
      setMsg('Product deleted.');
    } catch (err) {
      setMsg(err.response?.data?.message || 'Could not delete product.');
    }
  }

  return (
    <main className="container page wide">
      <p className="eyebrow">STORE CONTROL</p>
      <h1>Products</h1>
      <AdminNav current="/admin/products" />

      <form className="admin-form" onSubmit={submit}>
        {[['name', 'Product name', 'text'], ['category', 'Category', 'text'], ['price', 'Price (ETB)', 'number'], ['stock', 'Stock', 'number']].map(([k, l, type]) => (
          <label key={k}>{l}
            <input required value={form[k]} type={type} min={type === 'number' ? '0' : undefined} step={k === 'price' ? '0.01' : undefined} onChange={(e) => setForm({ ...form, [k]: e.target.value })} />
          </label>
        ))}
        <label className="span-2">Description
          <input value={form.description} onChange={(e) => setForm({ ...form, description: e.target.value })} />
        </label>
        <div className="btn-row">
          <button className="primary-btn">{editingId ? 'Save changes' : 'Add product'}</button>
          {editingId && <button type="button" className="remove" onClick={cancelEdit}>Cancel edit</button>}
        </div>
      </form>
      {msg && <p role="status">{msg}</p>}

      <div className="admin-products">
        {products.map((p) => (
          <div key={p._id}>
            <span>{p.name} · {money(p.price)} · {p.stock} in stock</span>
            <span className="btn-row">
              <button className="link-button" onClick={() => startEdit(p)}>Edit</button>
              <button className="remove" onClick={() => remove(p._id)}>Delete</button>
            </span>
          </div>
        ))}
      </div>
    </main>
  );
}
