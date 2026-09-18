import "dotenv/config";
import express from "express";
import cors from "cors";
import productRoutes from "./routes/productRoutes.js";
import authRoutes from "./routes/authRoutes.js";
import orderRoutes from "./routes/orderRoutes.js";
import { pool, initializeDatabase } from "./db/database.js";

const app = express();
const port = Number(process.env.PORT) || 4000;
const allowedOrigins = [
  "https://doa-ecommerce.vercel.app",
  "http://localhost:5173",
  "http://127.0.0.1:5173",
  "http://localhost:4173",
];

app.use(
  cors({
    origin: (origin, callback) => {
      // Cho phép request không có Origin
      if (!origin) {
        return callback(null, true);
      }

      // Cho phép Production và Localhost
      if (allowedOrigins.includes(origin)) {
        return callback(null, true);
      }

      // Cho phép các Preview Deployment của Vercel
      if (
        /^https:\/\/doa-ecommerce-[a-z0-9-]+-victor-ai-lab\.vercel\.app$/.test(
          origin
        )
      ) {
        return callback(null, true);
      }

      return callback(new Error("Not allowed by CORS"));
    },
  })
);
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
