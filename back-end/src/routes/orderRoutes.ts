import { Router } from "express";
import { randomUUID } from "node:crypto";
import { pool } from "../db/database.js";
import { requireAuth } from "../middleware/auth.js";

const router = Router();

function mapOrder(order, items) {
  return {
    id: order.id,
    userId: order.user_id,
    customer: {
      name: order.customer_name,
      email: order.customer_email,
      phone: order.customer_phone,
      address: order.customer_address,
    },
    items,
    total: Number(order.total),
    status: order.status,
    createdAt: order.created_at,
  };
}

router.post("/", requireAuth, async (req, res, next) => {
  const client = await pool.connect();
  try {
    const { customer, items } = req.body;
    if (!customer?.name || !customer?.email || !customer?.phone || !customer?.address) {
      return res.status(400).json({ message: "Complete shipping information is required" });
    }
    if (!Array.isArray(items) || items.length === 0) {
      return res.status(400).json({ message: "At least one item is required" });
    }

    const products = await Promise.all(
      items.map(async (item) => {
        const { rows } = await client.query(
          "SELECT id, title, price FROM products WHERE id = $1",
          [Number(item.productId)],
        );
        return rows[0];
      }),
    );
    const orderItems = items.map((item, index) => {
      const product = products[index];
      const quantity = Number(item.quantity);
      if (!product || !Number.isInteger(quantity) || quantity < 1) {
        throw Object.assign(new Error("Invalid order item"), { status: 400 });
      }
      const price = Number(product.price);
      return {
        productId: product.id,
        title: product.title,
        price,
        quantity,
        subtotal: Number((price * quantity).toFixed(2)),
      };
    });

    const order = {
      id: randomUUID(),
      userId: req.user.id,
      customer,
      items: orderItems,
      total: Number(orderItems.reduce((sum, item) => sum + item.subtotal, 0).toFixed(2)),
      status: "pending",
      createdAt: new Date().toISOString(),
    };

    await client.query("BEGIN");
    await client.query(
      `INSERT INTO orders
        (id, user_id, customer_name, customer_email, customer_phone, customer_address, total, status, created_at)
       VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9)`,
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
    for (const item of orderItems) {
      await client.query(
        `INSERT INTO order_items (order_id, product_id, title, price, quantity, subtotal)
         VALUES ($1, $2, $3, $4, $5, $6)`,
        [order.id, item.productId, item.title, item.price, item.quantity, item.subtotal],
      );
    }
    await client.query("COMMIT");
    return res.status(201).json(order);
  } catch (error) {
    await client.query("ROLLBACK").catch(() => {});
    return next(error);
  } finally {
    client.release();
  }
});

router.get("/mine", requireAuth, async (req, res, next) => {
  try {
    const { rows: orders } = await pool.query(
      "SELECT * FROM orders WHERE user_id = $1 ORDER BY created_at DESC",
      [req.user.id],
    );
    const mappedOrders = await Promise.all(orders.map(async (order) => {
      const { rows } = await pool.query(
        "SELECT product_id, title, price, quantity, subtotal FROM order_items WHERE order_id = $1",
        [order.id],
      );
      const items = rows.map((item) => ({
        productId: item.product_id,
        title: item.title,
        price: Number(item.price),
        quantity: item.quantity,
        subtotal: Number(item.subtotal),
      }));
      return mapOrder(order, items);
    }));
    return res.json(mappedOrders);
  } catch (error) {
    return next(error);
  }
});

export default router;
