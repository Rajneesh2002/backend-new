import express from "express";
import bodyParser from "body-parser";
import dotenv from "dotenv";
import connectDB from "./config/db.js";
import authRoutes from "./routes/auth.route.js";
import resourceRoutes from "./routes/resource.route.js";
import path from 'path';
import { fileURLToPath } from 'url';

const app = express();

// Manually define __dirname
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Serve static files
app.use(express.static(path.join(__dirname, 'public')));

dotenv.config();

app.use(bodyParser.json());
app.use(express.urlencoded({ extended: true }));

const port = process.env.PORT || 5000;

connectDB();

app.use("/api/auth", authRoutes);
app.use("/api/resource", resourceRoutes);

app.get("/", (req, res) => {
  res.render("index");
});

app.listen(port, () => {
  console.log(`App running on port ${port}`);
});
