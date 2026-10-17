# Installation Guide

Step-by-step setup for the E-Shop starter: React + Vite frontend, Laravel REST API, MongoDB, and Telebirr/CBE payment placeholders.

## Prerequisites

| Tool | Version | Purpose |
|---|---|---|
| Node.js | 18+ (20+ recommended) | React frontend, seed script |
| npm | Comes with Node | Frontend packages |
| PHP | Version required by your Laravel release | Backend API |
| Composer | Latest | Laravel project + packages |
| MongoDB | 6+ local, or MongoDB Atlas | Database |
| Docker (optional) | Latest | Local MongoDB via `docker-compose.yml` |
| Postman (optional) | Latest | API testing |

## Project structure

```
ecommerce-project/
├── frontend/            # React + Vite storefront and admin UI
│   └── src/
│       ├── components/  # Navbar, Footer, ProductCard
│       ├── pages/       # Home, Products, ProductDetails, Cart, Checkout, Login, Register, Orders, Profile
│       ├── pages/admin/ # Dashboard, Products, Orders
│       ├── services/    # API, cart, products, payment clients
│       ├── App.jsx      # Route shell + shared state
│       └── styles.css
├── backend/             # Laravel API source files (copied into a fresh Laravel app)
├── database/            # MongoDB seed: collections, indexes, sample catalog
├── docs/                # API.md, PAYMENTS.md, this guide
├── docker-compose.yml   # Optional local MongoDB + Mongo Express
└── README.md
```

## 1. Database (MongoDB)

Option A — Docker (easiest):

```bash
docker compose up -d
```

This starts MongoDB on `mongodb://127.0.0.1:27017` and Mongo Express (a web admin UI) on http://127.0.0.1:8081.

Option B — Install MongoDB locally or create a free [MongoDB Atlas](https://www.mongodb.com/atlas) cluster.

Create collections and indexes (after choosing your database name):

```bash
mongosh "mongodb://127.0.0.1:27017/ecommerce" --file database/seed.js
```

The seed ensures indexes for `users`, `products`, `categories`, `carts`, `orders`, `payments` and `reviews`, and inserts a small sample catalog.

## 2. Backend (Laravel API)

```bash
composer create-project laravel/laravel backend-app
cd backend-app
composer require mongodb/laravel-mongodb
```

Copy the contents of this template's `backend/` folder into `backend-app/`, merging folders and keeping Laravel's framework files. See `backend/INSTALL-INTO-LARAVEL.md` for the checklist:

- Merge `config/services.php.append` into `config/services.php`.
- Register the `admin` middleware alias (see `backend/bootstrap/app.php.middleware-note`).
- Configure the MongoDB connection in `config/database.php` per the [official integration docs](https://www.mongodb.com/docs/drivers/php/laravel-mongodb/).
- Install/configure a token system (Laravel Sanctum or a MongoDB-compatible alternative) and verify it works with the MongoDB user model before enabling login.

Configure the environment:

```bash
cp .env.example .env
php artisan key:generate
# then edit .env: DB_CONNECTION=mongodb, DB_URI, DB_DATABASE, payment keys
```

Start the API:

```bash
php artisan serve
# → http://127.0.0.1:8000/api
```

### Seed the first admin safely

There is no public “register admin” endpoint by design. Create the first admin with `php artisan tinker` on the server:

```php
use App\Models\User;
use Illuminate\Support\Facades\Hash;
User::create(['name' => 'Admin', 'email' => 'admin@yourdomain.com', 'password' => Hash::make('a-long-unique-password'), 'role' => 'admin']);
```

## 3. Frontend (React)

```bash
cd ecommerce-project/frontend
cp .env.example .env
npm install
npm run dev
```

Set `VITE_API_URL=http://127.0.0.1:8000/api` in `.env` if the API is not on the default URL. Open the Vite URL printed in the terminal (typically http://localhost:5173).

Production build:

```bash
npm run build   # output in frontend/dist
```

## 4. Smoke-test the flow

1. Register a customer at `/register`, then log in.
2. Browse `/products`, add items to the cart (syncs to the server when logged in).
3. Place an order at `/checkout` — it stays **pending** because payment adapters are placeholders until merchant credentials are configured.
4. Log in as the admin, open `/admin` to view stats, manage products at `/admin/products`, and update fulfillment status at `/admin/orders`.

## Troubleshooting

| Symptom | Fix |
|---|---|
| Login returns `501` | Token system (Sanctum/compatible package) not configured for the MongoDB user model — see step 2. |
| Products page shows demo items only | Backend not running, wrong `VITE_API_URL`, or CORS not configured for `FRONTEND_URL`. |
| Order creation returns 401 | Log in first; the API needs a Bearer token. |
| MongoDB connection errors | Check `DB_URI`/`DB_DATABASE` in `.env`; ensure MongoDB is running (`docker compose ps`). |
| Admin routes return 403 | The user's `role` must be `admin` (set server-side, never via registration). |
| Checkout says payment not configured | Expected — Telebirr/CBE adapters need official merchant credentials (see `docs/PAYMENTS.md`). |

## Before production

Read the security checklist in the root `README.md` and `docs/PAYMENTS.md`. This template is a starter, not a production-certified deployment.
