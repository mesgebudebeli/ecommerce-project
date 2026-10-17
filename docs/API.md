# API Reference (starter)

Base URL: `/api`

## Public

| Method | Endpoint | Access | Purpose |
|---|---|---|---|
| POST | `/register` | Public, rate limited | Register customer (role is always `customer`) |
| POST | `/login` | Public, rate limited | Get API token |
| GET | `/products` | Public | Active product list |
| GET | `/products/{id}` | Public | Product details |

## Authenticated (Bearer token)

| Method | Endpoint | Access | Purpose |
|---|---|---|---|
| POST | `/logout` | Authenticated | Revoke current token |
| GET | `/profile` | Authenticated | Current profile |
| GET | `/cart` | Authenticated | Server-side cart with hydrated product info and subtotal |
| POST | `/cart` | Authenticated | Add item (merges quantity for the same product) |
| PUT | `/cart` | Authenticated | Replace cart items (`items: [{product_id, quantity}]`) |
| DELETE | `/cart` | Authenticated | Clear cart |
| POST | `/orders` | Authenticated | Create pending order + payment (totals recalculated server-side) |
| GET | `/orders/my-orders` | Authenticated | Customer order history |
| POST | `/payments/initiate` | Authenticated | Start/retry provider checkout for an existing order |

## Provider callbacks

| Method | Endpoint | Access | Purpose |
|---|---|---|---|
| POST | `/payments/webhook/{provider}` | Provider callback | Verify payment notification (`telebirr` or `cbe`) |

## Admin

| Method | Endpoint | Access | Purpose |
|---|---|---|---|
| POST | `/admin/products` | Admin | Create product |
| PUT | `/admin/products/{id}` | Admin | Update product |
| DELETE | `/admin/products/{id}` | Admin | Delete product |
| GET | `/admin/orders` | Admin | List all orders |
| PUT | `/admin/orders/{id}` | Admin | Update **fulfillment** status only (`pending`, `processing`, `shipped`, `delivered`, `cancelled`) |

## Notes

- Public registration cannot set `role`; users are customers by default.
- Admin role must be granted through a protected server-side process.
- `payment_status` changes only through verified provider webhooks — the admin order endpoint deliberately ignores it.
- Order totals are always recalculated from database product prices; client-sent prices are never trusted.
- MongoDB IDs are strings at the API boundary.
- Add pagination, API resources, and CSRF/CORS hardening before production.
- Feature-test examples live in `backend/tests/Feature/`.
