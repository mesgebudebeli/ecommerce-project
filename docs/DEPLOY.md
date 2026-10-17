# Deployment guide

The project has two parts, deployed separately:

| Part | Folder | Host | Why |
|------|--------|------|-----|
| React storefront (Vite) | `frontend/` | **Vercel** | Static site — a perfect fit. |
| Laravel 12 API | `backend-app/` | **Railway** (or Render/Fly.io) | Vercel cannot run PHP, and SQLite needs a persistent disk. |

A `Dockerfile` for the API is included (`backend-app/Dockerfile`), so any
Docker host works.

---

## 1. Backend (Laravel API) → Railway

1. Sign in at <https://railway.app> and choose **New Project → Deploy from GitHub repo**,
   then pick `mesgebudebeli/ecommerce-project`.
2. Open the created service → **Settings → Source** and set **Root Directory** to
   `backend-app`. Railway auto-detects the `Dockerfile`.
3. Add a database (**New → Database**):
   - **PostgreSQL** (recommended): then set `DB_CONNECTION=pgsql` on the API service.
     Railway shares `DATABASE_URL`, which the container entrypoint maps to `DB_URL`
     automatically.
   - **SQLite + Volume** (simplest): add a **Volume** mounted at
     `/var/www/html/database` and leave `DB_CONNECTION` unset (defaults to `sqlite`).
4. Add these **Variables** to the API service:

   ```
   APP_ENV=production
   APP_DEBUG=false
   APP_KEY=base64:...            # see below
   CORS_ALLOWED_ORIGINS=https://<your-app>.vercel.app
   ```

   Generate an `APP_KEY` locally with:
   ```
   php backend-app/artisan key:generate --show
   ```

5. Deploy. On boot the entrypoint runs `php artisan migrate --force`,
   seeds the demo data (idempotent) and caches the config.
6. Copy the service's public URL, e.g.
   `https://ecommerce-project-production.up.railway.app`.

**Verify:** open `https://<backend-url>/api/products` — it should return JSON.

> Other hosts (Render, Fly.io) work the same way: build `backend-app/Dockerfile`,
> set the env vars above, and expose the port from `$PORT` (the entrypoint handles it).

---

## 2. Frontend (React) → Vercel

1. At <https://vercel.com> choose **Add New → Project** and import the same repo.
2. Set **Root Directory** to `frontend`.
3. Framework preset **Vite** (build `npm run build`, output `dist`). The
   `frontend/vercel.json` sets these, **but** if the dashboard shows stale overrides,
   clear the placeholder Build Command (`[my-framework] build --output public`) and set:
   - Build Command: `npm run build`
   - Output Directory: `dist`
4. Add an environment variable:

   ```
   VITE_API_URL=https://<backend-url>/api
   ```

   ⚠️ This value is baked in at **build time** — set it before/with the build, then
   redeploy if you change it.

5. Deploy and open `https://<your-app>.vercel.app`. Use `#/login` to sign in.

---

## Seeded accounts

| Role | Email | Password |
|------|-------|----------|
| Admin | `admin@example.com` | `admin-password-123` |
| Customer | `customer@example.com` | `customer-password-123` |

**Change both after deploying.**

## Notes & limitations

- Payments (`telebirr`, `cbe`) are **placeholders** — they return `pending` and no
  checkout URL until real merchant credentials are wired up (see `docs/PAYMENTS.md`).
- For production, tighten `CORS_ALLOWED_ORIGINS`, use a managed database, and serve
  the API over HTTPS only.
- Local development is unchanged: XAMPP Apache serves the built frontend on port 80
  and the API on port 8000.
