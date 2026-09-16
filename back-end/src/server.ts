import "dotenv/config";
import express from "express";
import cors from "cors";
import productRoutes from "./routes/productRoutes.js";
import authRoutes from "./routes/authRoutes.js";
import orderRoutes from "./routes/orderRoutes.js";
import { pool, initializeDatabase } from "./db/database.js";

const app = express();
const port = Number(process.env.PORT) || 4000;
const allowedOrigin = process.env.CLIENT_ORIGIN || "http://localhost:5173";

app.use(cors({ origin: allowedOrigin }));
app.use(express.json({ limit: "1mb" }));

app.get("/api/health", async (_req, res, next) => {
  try {
    const { rows } = await pool.query("SELECT COUNT(*)::int AS count FROM products");
    res.json({ status: "ok", service: "doashop-backend", database: "postgresql", productCount: rows[0].count });
  } catch (error) {
    next(error);
  }
});
app.use("/api/products", productRoutes);
app.use("/api/auth", authRoutes);
app.use("/api/orders", orderRoutes);

app.use((error, _req, res, _next) => {
  console.error(error);
  res.status(error.status || 500).json({ message: "Internal server error" });
});

initializeDatabase().then(() => {
  app.listen(port, () => {
    console.log(`DoAshop backend listening on http://localhost:${port}`);
    console.log("PostgreSQL database connected");
  });
}).catch((error) => {
  console.error("Failed to initialize database", error);
  process.exitCode = 1;
});
