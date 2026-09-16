import { Router } from "express";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import { pool } from "../db/database.js";

const router = Router();
router.post("/login", async (req, res, next) => {
  try {
    const { username, password } = req.body;
    if (!username || !password) {
      return res.status(400).json({ message: "Username and password are required" });
    }

    const { rows } = await pool.query(
      "SELECT id, username, email, password_hash FROM users WHERE username = $1",
      [username],
    );
    const user = rows[0];
    const isValid = user && (await bcrypt.compare(password, user.password_hash));

    if (!isValid) return res.status(401).json({ message: "Invalid username or password" });

    const token = jwt.sign(
      { id: user.id, username: user.username },
      process.env.JWT_SECRET,
      { expiresIn: "7d" },
    );
    return res.json({ token, user: { id: user.id, username: user.username, email: user.email } });
  } catch (error) {
    return next(error);
  }
});

export default router;
