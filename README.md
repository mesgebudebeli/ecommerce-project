# E-Shop — Ethiopia E-commerce Starter

React + Vite frontend, Laravel REST API, MongoDB, and secure payment-provider adapter placeholders for Telebirr and CBE.

> This is a starter template, not a production-certified payment integration. Obtain merchant credentials and current API specifications directly from Telebirr/CBE (or their authorized payment partners). Never mark an order paid based only on a browser redirect or client request.

## Requirements
- Node.js 18+
- PHP version supported by your chosen Laravel release
- Composer
- MongoDB local instance or MongoDB Atlas
- Telebirr/CBE merchant account and official API credentials for live payments

## Project layout
- `frontend/` — React customer storefront and admin UI
  - `src/components/` — Navbar, Footer, ProductCard
  - `src/pages/` — Home, Products, ProductDetails, Cart, Checkout, Login, Register, Orders, Profile
  - `src/pages/admin/` — Dashboard, Products, Orders
  - `src/services/` — API, cart, products and payment clients
- `backend/` — Laravel API source files to copy into a fresh Laravel project
- `database/` — MongoDB seed script (collections, indexes, sample catalog)
- `docs/` — Installation guide (`docs/README.md`), API reference, payment setup notes
- `docker-compose.yml` — Optional local MongoDB + Mongo Express for development

## 1. Create the Laravel application
From the project root:

```bash
composer create-project laravel/laravel backend-app
```

Copy the contents of this template's `backend/` folder into `backend-app/`, merging folders and overwriting only the listed starter files when appropriate. Keep the Laravel-generated framework files. The step-by-step checklist is in `backend/INSTALL-INTO-LARAVEL.md`.

Install MongoDB integration compatible with your Laravel version. Current package documentation:
https://www.mongodb.com/docs/drivers/php/laravel-mongodb/

```bash
cd backend-app
composer require mongodb/laravel-mongodb
```

If using Laravel Sanctum, install/configure it according to the Laravel version you created. Verify the MongoDB integration's authentication compatibility before enabling Sanctum; for a simple API token flow, use a supported token model/package or adapt the provided auth controller to your chosen configuration.

Set `.env` values using `.env.example` as a reference. Do not commit real secrets.

## 2. Start MongoDB
Use local MongoDB, MongoDB Atlas, or the bundled Docker Compose file:

```bash
docker compose up -d
```

Example connection:

```env
DB_CONNECTION=mongodb
DB_URI=mongodb://127.0.0.1:27017
DB_DATABASE=ecommerce
```

Exact environment keys may vary by MongoDB Laravel integration version; follow that package's current documentation.

Then create collections, indexes and a sample catalog:

```bash
mongosh "mongodb://127.0.0.1:27017/ecommerce" --file database/seed.js
```

## 3. Start backend
```bash
cd backend-app
php artisan serve
```
Default API base URL: `http://127.0.0.1:8000/api`

## 4. Start frontend
In another terminal:
```bash
cd ecommerce-project/frontend
cp .env.example .env
npm install
npm run dev
```
Open the Vite URL shown in the terminal. Set `VITE_API_URL=http://127.0.0.1:8000/api`.

## 5. Seed a first admin safely
Create an admin using a controlled server-side seeder or a one-time command. Do not expose a public “register admin” endpoint. The starter uses role checks but you must create and verify the first admin account securely.

## Payments: Telebirr and CBE
The included `TelebirrService` and `CbeService` are intentionally provider-adapter placeholders. Implement the current official request signing, token acquisition, callback verification, idempotency, and status-query logic from the merchant docs before production use.

Recommended payment flow:
1. Authenticated customer creates an order; server calculates totals from trusted product prices.
2. Server creates a pending payment record and calls the official provider API.
3. Frontend redirects/displays the provider checkout flow returned by the server.
4. Provider webhook/callback is verified server-to-server, including signature, amount, currency, merchant/order reference, and transaction status.
5. Mark payment/order paid only after verification. Handle duplicate callbacks idempotently.
6. Reconcile pending payments with provider status queries.

Never put merchant secrets in React environment variables. `VITE_*` values are public.

## Security checklist before launch
- HTTPS everywhere; secure cookies/token storage strategy
- Rate limiting on login, checkout, and payment endpoints
- Password hashing and account verification
- Server-side validation and authorization on every admin route
- CSRF/CORS configuration appropriate to deployment
- Upload size/type limits and malware scanning for uploads
- Payment webhook signature verification, replay protection, and idempotency
- Audit logs for admin changes and payment events
- Backups, monitoring, error reporting, dependency updates
- Add tests for authorization, order totals, stock reservation, and payment callbacks

## API overview
See `docs/API.md` and `docs/PAYMENTS.md`. Full setup walkthrough: `docs/README.md`.
