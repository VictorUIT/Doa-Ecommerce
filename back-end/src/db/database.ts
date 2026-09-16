import { readFile } from "node:fs/promises";
import path from "node:path";
import { fileURLToPath } from "node:url";
import pg from "pg";

const { Pool } = pg;
const currentDirectory = path.dirname(fileURLToPath(import.meta.url));
const dataDirectory = path.resolve(currentDirectory, "../data");

export const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
});

async function readSeedFile(fileName) {
  const content = await readFile(path.join(dataDirectory, fileName), "utf8");
  return JSON.parse(content);
}

async function seedProducts(products) {
  for (const product of products) {
    await pool.query(
      `INSERT INTO products
        (id, title, price, description, category, image, rating_rate, rating_count)
       VALUES ($1, $2, $3, $4, $5, $6, $7, $8)
       ON CONFLICT (id) DO UPDATE SET
         title = EXCLUDED.title,
         price = EXCLUDED.price,
         description = EXCLUDED.description,
         category = EXCLUDED.category,
         image = EXCLUDED.image,
         rating_rate = EXCLUDED.rating_rate,
         rating_count = EXCLUDED.rating_count`,
      [
        product.id,
        product.title,
        product.price,
        product.description,
        product.category,
        product.image,
        product.rating?.rate ?? 0,
        product.rating?.count ?? 0,
      ],
    );
  }
}

async function seedUsers(users) {
  for (const user of users) {
    await pool.query(
      `INSERT INTO users (id, username, email, password_hash)
       VALUES ($1, $2, $3, $4)
       ON CONFLICT (id) DO NOTHING`,
      [user.id, user.username, user.email, user.passwordHash],
    );
  }
}

async function seedOrders(orders) {
  for (const order of orders) {
    await pool.query(
      `INSERT INTO orders
        (id, user_id, customer_name, customer_email, customer_phone, customer_address, total, status, created_at)
       VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9)
       ON CONFLICT (id) DO NOTHING`,
      [
        order.id,
        order.userId,
        order.customer.name,
        order.customer.email,
        order.customer.phone,
        order.customer.address,
        order.total,
        order.status,
        order.createdAt,
      ],
    );
    for (const item of order.items) {
      await pool.query(
        `INSERT INTO order_items
          (order_id, product_id, title, price, quantity, subtotal)
         VALUES ($1, $2, $3, $4, $5, $6)
         ON CONFLICT (order_id, product_id) DO NOTHING`,
        [order.id, item.productId, item.title, item.price, item.quantity, item.subtotal],
      );
    }
  }
}

export async function initializeDatabase() {
  await pool.query(`
    CREATE TABLE IF NOT EXISTS users (
      id INTEGER PRIMARY KEY,
      username VARCHAR(100) NOT NULL UNIQUE,
      email VARCHAR(255) NOT NULL UNIQUE,
      password_hash TEXT NOT NULL,
      created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
    );

    CREATE TABLE IF NOT EXISTS products (
      id INTEGER PRIMARY KEY,
      title TEXT NOT NULL,
      price NUMERIC(12, 2) NOT NULL CHECK (price >= 0),
      description TEXT NOT NULL,
      category VARCHAR(100) NOT NULL,
      image TEXT NOT NULL,
      rating_rate NUMERIC(3, 1) NOT NULL DEFAULT 0,
      rating_count INTEGER NOT NULL DEFAULT 0,
      created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
    );

    CREATE TABLE IF NOT EXISTS orders (
      id UUID PRIMARY KEY,
      user_id INTEGER NOT NULL REFERENCES users(id),
      customer_name VARCHAR(255) NOT NULL,
      customer_email VARCHAR(255) NOT NULL,
      customer_phone VARCHAR(30) NOT NULL,
      customer_address TEXT NOT NULL,
      total NUMERIC(12, 2) NOT NULL CHECK (total >= 0),
      status VARCHAR(30) NOT NULL DEFAULT 'pending',
      created_at TIMESTAMPTZ NOT NULL
    );

    CREATE TABLE IF NOT EXISTS order_items (
      id BIGSERIAL PRIMARY KEY,
      order_id UUID NOT NULL REFERENCES orders(id) ON DELETE CASCADE,
      product_id INTEGER NOT NULL REFERENCES products(id),
      title TEXT NOT NULL,
      price NUMERIC(12, 2) NOT NULL CHECK (price >= 0),
      quantity INTEGER NOT NULL CHECK (quantity > 0),
      subtotal NUMERIC(12, 2) NOT NULL CHECK (subtotal >= 0),
      UNIQUE (order_id, product_id)
    );

    CREATE INDEX IF NOT EXISTS idx_products_category ON products(category);
    CREATE INDEX IF NOT EXISTS idx_orders_user_id ON orders(user_id);
  `);

  const userCount = await pool.query("SELECT COUNT(*)::int AS count FROM users");
  const orderCount = await pool.query("SELECT COUNT(*)::int AS count FROM orders");

  await seedProducts(await readSeedFile("products.json"));
  if (userCount.rows[0].count === 0) await seedUsers(await readSeedFile("users.json"));
  if (orderCount.rows[0].count === 0) await seedOrders(await readSeedFile("orders.json"));
}
