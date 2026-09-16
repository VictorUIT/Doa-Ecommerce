# DoAshop backend

Express API for the e-commerce application. It uses PostgreSQL and automatically creates the application tables on startup.

The database structure is documented in [prisma/schema.prisma](prisma/schema.prisma). The current API runtime uses the `pg` driver directly; Prisma Client has not been introduced into the request handlers yet.

## Run

```powershell
cd back-end
npm install
Copy-Item .env.example .env
npm run dev
```

Set `DATABASE_URL` in `.env`, for example:

```env
DATABASE_URL=postgresql://postgres:your_password@localhost:5433/doashop
```

The API runs at `http://localhost:4000`.

On the first startup, the database is initialized with the `users`, `products`, `orders`, and `order_items` tables. Existing JSON seed files are imported automatically when those tables are empty.

## Endpoints

- `GET /api/health`
- `GET /api/products`
- `GET /api/products/:id`
- `GET /api/products/categories`
- `POST /api/auth/login` with `{ "username": "mor_2314", "password": "83r5^_" }`
- `POST /api/orders` with a Bearer token
- `GET /api/orders/mine` with a Bearer token

Set a strong `JWT_SECRET` before deploying to production and use a dedicated PostgreSQL user with a strong password.
