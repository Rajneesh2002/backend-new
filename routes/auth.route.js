import express from "express";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";

import User from "../models/user.model.js";
import { validateUser } from "../middleware/validation.middleware.js";

const router = express.Router();

router.post("/register", validateUser, async (req, res) => {
  const { name, email, password, role } = req.body;

  try {
    const userExists = await User.findOne({ email });
    
    if (userExists)
      return res.status(400).json({ message: "User aleady exists" });

    const hashedPassword = await bcrypt.hash(password, 12);

    if (role != "user" || role != "admin")
      res
        .status(500)
        .json({
          message: "Invalid role! Role must be either 'admin' or 'user'"
        });
    if (name.length > 255 || email.length > 255 || password.length > 255)
      res
        .status(500)
        .json({ message: "Strings can have at max 255 characters" });

    const user = new User({ name, email, password: hashedPassword, role });
    await user.save();

    res
      .status(201)
      .json({
        message: `${user.role} created successfully with username - ${user.name}`
      });
  } catch (error) {
    res.status(500).json({ message: "User registration failed" });
  }
});

router.post("/login", async (req, res) => {
  const { email, password } = req.body;

  try {
    const user = await User.findOne({ email });
    if (!user) return res.status(400).json({ message: "Invalid credentials" });

    const isMatched = await bcrypt.compare(password, user.password);
    if (!isMatched)
      return res.status(400).json({ message: "Invalid credentials" });

    const token = jwt.sign(
      { id: user._id, role: user.role },
      process.env.JWT_SECRET,
      { expiresIn: "1h" }
    );

    res.json({ token });
  } catch (error) {
    res.status(500).json({ message: "User login failed" });
  }
});

export default router;
