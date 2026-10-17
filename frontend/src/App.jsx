import { useEffect, useMemo, useState } from 'react';
import { Route, Routes, Link } from 'react-router-dom';
import api from './services/api.js';
import { fetchProducts } from './services/products.js';
import { getServerCart, addServerItem, replaceServerCart } from './services/cart.js';
import Navbar from './components/Navbar.jsx';
import Footer from './components/Footer.jsx';
import Home from './pages/Home.jsx';
import Products from './pages/Products.jsx';
import ProductDetails from './pages/ProductDetails.jsx';
import Cart from './pages/Cart.jsx';
import Checkout from './pages/Checkout.jsx';
import Login from './pages/Login.jsx';
import Register from './pages/Register.jsx';
import Orders from './pages/Orders.jsx';
import Profile from './pages/Profile.jsx';
import Dashboard from './pages/admin/Dashboard.jsx';
import AdminProducts from './pages/admin/Products.jsx';
import AdminOrders from './pages/admin/Orders.jsx';

function mergeCarts(local, server) {
  const merged = local.map((item) => ({ ...item }));
  for (const s of server) {
    const id = String(s.product_id || s._id);
    const existing = merged.find((i) => String(i._id) === id);
    const quantity = Number(s.quantity) || 1;
    if (existing) {
      existing.quantity = Math.max(existing.quantity, quantity);
    } else if (s.name && s.price != null) {
      merged.push({ _id: id, name: s.name, price: s.price, category: s.category, quantity });
    }
  }
  return merged;
}

export default function App() {
  const [products, setProducts] = useState([]);
  const [cart, setCart] = useState([]);
  const [user, setUser] = useState(null);
  const [notice, setNotice] = useState('');
  const [search, setSearch] = useState('');

  useEffect(() => {
    fetchProducts().then(({ products }) => setProducts(products));
    const saved = sessionStorage.getItem('shop_user');
    if (saved) {
      try { setUser(JSON.parse(saved)); } catch { sessionStorage.removeItem('shop_user'); }
    }
  }, []);

  function showNotice(text) {
    setNotice(text);
    window.setTimeout(() => setNotice(''), 2500);
  }

  function pushCartToServer(next) {
    if (user) replaceServerCart(next).catch(() => {/* best-effort sync */});
  }

  const addToCart = (product) => {
    const next = (() => {
      const existing = cart.find((item) => String(item._id) === String(product._id));
      return existing
        ? cart.map((item) => String(item._id) === String(product._id) ? { ...item, quantity: item.quantity + 1 } : item)
        : [...cart, { _id: product._id, name: product.name, price: product.price, category: product.category, quantity: 1 }];
    })();
    setCart(next);
    if (user) addServerItem(product._id, 1).catch(() => {/* best-effort sync */});
    showNotice(`${product.name} added to cart`);
  };

  const changeQuantity = (id, quantity) => {
    const next = cart.map((item) => String(item._id) === String(id) ? { ...item, quantity } : item);
    setCart(next);
    pushCartToServer(next);
  };

  const removeItem = (id) => {
    const next = cart.filter((item) => String(item._id) !== String(id));
    setCart(next);
    pushCartToServer(next);
  };

  const clearCart = () => {
    setCart([]);
    pushCartToServer([]);
  };

  const filtered = useMemo(() => products.filter((p) =>
    `${p.name} ${p.category || ''}`.toLowerCase().includes(search.toLowerCase())
  ), [products, search]);

  async function login(email, password) {
    const { data } = await api.post('/login', { email, password });
    sessionStorage.setItem('access_token', data.token);
    sessionStorage.setItem('shop_user', JSON.stringify(data.user));
    setUser(data.user);
    try {
      const serverItems = await getServerCart();
      if (serverItems.length) setCart((old) => mergeCarts(old, serverItems));
    } catch {/* server cart optional */}
  }

  function logout() {
    sessionStorage.removeItem('access_token');
    sessionStorage.removeItem('shop_user');
    setUser(null);
    setCart([]);
  }

  return (
    <div className="app-shell">
      <Navbar
        user={user}
        cartCount={cart.reduce((n, i) => n + i.quantity, 0)}
        search={search}
        setSearch={setSearch}
        onLogout={logout}
      />
      {notice && <div className="toast" role="status">{notice}</div>}
      <Routes>
        <Route path="/" element={<Home products={products} addToCart={addToCart} />} />
        <Route path="/products" element={<Products products={filtered} search={search} addToCart={addToCart} />} />
        <Route path="/product/:id" element={<ProductDetails products={products} addToCart={addToCart} />} />
        <Route path="/cart" element={<Cart cart={cart} onChange={changeQuantity} onRemove={removeItem} onClear={clearCart} />} />
        <Route path="/checkout" element={<Checkout cart={cart} user={user} onOrdered={() => setCart([])} />} />
        <Route path="/login" element={<Login onLogin={login} />} />
        <Route path="/register" element={<Register />} />
        <Route path="/orders" element={<Orders user={user} />} />
        <Route path="/profile" element={<Profile user={user} onLogout={logout} />} />
        <Route path="/admin" element={<Dashboard user={user} products={products} />} />
        <Route path="/admin/products" element={<AdminProducts user={user} products={products} setProducts={setProducts} />} />
        <Route path="/admin/orders" element={<AdminOrders user={user} />} />
        <Route path="*" element={<main className="container page"><h2>Page not found</h2><Link to="/">Return to store</Link></main>} />
      </Routes>
      <Footer />
    </div>
  );
}
