import { Link, useNavigate, useLocation } from 'react-router-dom';

export default function Navbar({ user, cartCount, search, setSearch, onLogout }) {
  const navigate = useNavigate();
  const location = useLocation();

  function onSearchChange(value) {
    setSearch(value);
    if (value && location.pathname !== '/products') navigate('/products');
  }

  return (
    <header className="topbar">
      <Link className="brand" to="/"><span className="brand-mark">E</span> E-Shop</Link>
      <div className="search-wrap">
        <input aria-label="Search products" placeholder="Search products..." value={search} onChange={(e) => onSearchChange(e.target.value)} />
      </div>
      <nav>
        <Link to="/">Shop</Link>
        <Link to="/products">Products</Link>
        <Link to="/cart">Cart ({cartCount})</Link>
        {user ? (
          <>
            <Link to="/orders">Orders</Link>
            <Link to="/profile" className="user-label">{user.name || user.email}</Link>
            <button className="link-button" onClick={onLogout}>Log out</button>
            {user.role === 'admin' && <Link to="/admin">Admin</Link>}
          </>
        ) : (
          <Link to="/login">Log in</Link>
        )}
      </nav>
    </header>
  );
}
