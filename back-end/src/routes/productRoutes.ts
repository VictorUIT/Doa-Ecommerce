import { Router } from "express";
import { pool } from "../db/database.js";

const router = Router();
function mapProduct(product) {
  return {
    id: product.id,
    title: product.title,
    price: Number(product.price),
    description: product.description,
    category: product.category,
    image: product.image,
    rating: { rate: Number(product.rating_rate), count: product.rating_count },
  };
}

router.get("/", async (req, res, next) => {
  try {
    const { category, search, sort } = req.query;
    const conditions = [];
    const parameters = [];
    if (category) {
      conditions.push(`category = $${parameters.length + 1}`);
      parameters.push(category);
    }
    if (search) {
      conditions.push(`(LOWER(title) LIKE $${parameters.length + 1} OR LOWER(description) LIKE $${parameters.length + 2})`);
      const term = `%${String(search).toLowerCase()}%`;
      parameters.push(term, term);
    }
    const orderBy = {
      price_asc: "price ASC",
      price_desc: "price DESC",
      name_asc: "title COLLATE NOCASE ASC",
    }[sort] || "id ASC";
    const where = conditions.length ? `WHERE ${conditions.join(" AND ")}` : "";
    const { rows } = await pool.query(`SELECT * FROM products ${where} ORDER BY ${orderBy}`, parameters);
    const products = rows.map(mapProduct);
    return res.json(products);
  } catch (error) {
    return next(error);
  }
});

router.get("/categories", async (_req, res, next) => {
  try {
    const { rows } = await pool.query("SELECT DISTINCT category FROM products ORDER BY category");
    const categories = rows
      .map((item) => item.category);
    return res.json(categories);
  } catch (error) {
    return next(error);
  }
});

router.get("/:id", async (req, res, next) => {
  try {
    const { rows } = await pool.query("SELECT * FROM products WHERE id = $1", [Number(req.params.id)]);
    const product = rows[0];
    return product
      ? res.json(mapProduct(product))
      : res.status(404).json({ message: "Product not found" });
  } catch (error) {
    return next(error);
  }
});

export default router;
