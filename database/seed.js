// MongoDB collections, indexes and sample catalog for the E-Shop starter.
//
// Run with mongosh against the database from backend/.env (DB_DATABASE=ecommerce):
//   mongosh "mongodb://127.0.0.1:27017/ecommerce" --file database/seed.js
//
// Indexes match the query patterns used by the Laravel controllers.

// --- users -------------------------------------------------------------------
db.users.createIndex({ email: 1 }, { unique: true });
db.users.createIndex({ role: 1 });

// --- products ----------------------------------------------------------------
db.products.createIndex({ slug: 1 }, { unique: true });
db.products.createIndex({ category: 1, active: 1 });
db.products.createIndex({ name: 'text', description: 'text', category: 'text' });

// --- categories --------------------------------------------------------------
db.categories.createIndex({ slug: 1 }, { unique: true });

// --- carts (one cart per user) ----------------------------------------------
db.carts.createIndex({ user_id: 1 }, { unique: true });

// --- orders ------------------------------------------------------------------
db.orders.createIndex({ order_number: 1 }, { unique: true });
db.orders.createIndex({ user_id: 1, created_at: -1 });
db.orders.createIndex({ status: 1, payment_status: 1 });

// --- payments ----------------------------------------------------------------
// Unique per provider, but only when a provider reference exists
// (pending placeholder payments may not have one yet).
db.payments.createIndex(
  { provider: 1, provider_reference: 1 },
  { unique: true, partialFilterExpression: { provider_reference: { $exists: true } } }
);
db.payments.createIndex({ order_id: 1 });

// --- reviews -----------------------------------------------------------------
db.reviews.createIndex({ product_id: 1, user_id: 1 }, { unique: true });

// --- sample catalog ----------------------------------------------------------
// Users/admins are intentionally NOT seeded here: create the first admin through
// a controlled server-side process (see README "Seed a first admin safely").
const now = new Date();

db.categories.deleteMany({});
db.categories.insertMany([
  { name: 'Electronics', slug: 'electronics', created_at: now, updated_at: now },
  { name: 'Fashion', slug: 'fashion', created_at: now, updated_at: now },
  { name: 'Home & Living', slug: 'home-living', created_at: now, updated_at: now },
]);

const existing = db.products.countDocuments();
if (existing === 0) {
  db.products.insertMany([
    {
      name: 'Wireless Headphones', slug: 'wireless-headphones-a1b2c3',
      description: 'Comfortable everyday audio with long battery life.',
      category: 'Electronics', price: 2499, stock: 12, images: [], active: true,
      created_at: now, updated_at: now,
    },
    {
      name: 'Everyday Backpack', slug: 'everyday-backpack-d4e5f6',
      description: 'A durable bag for work and travel.',
      category: 'Fashion', price: 1599, stock: 20, images: [], active: true,
      created_at: now, updated_at: now,
    },
    {
      name: 'Smart Watch', slug: 'smart-watch-g7h8i9',
      description: 'Track activity and stay connected.',
      category: 'Electronics', price: 3299, stock: 8, images: [], active: true,
      created_at: now, updated_at: now,
    },
    {
      name: 'Desk Lamp', slug: 'desk-lamp-j0k1l2',
      description: 'A clean, modern desk light.',
      category: 'Home & Living', price: 899, stock: 30, images: [], active: true,
      created_at: now, updated_at: now,
    },
  ]);
  print('Seeded 4 sample products.');
} else {
  print('Products collection already has data; skipped product seeding.');
}

print('Indexes ensured for: users, products, categories, carts, orders, payments, reviews.');
