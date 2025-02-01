import express from "express";
import bodyParser from "body-parser";
import dotenv from "dotenv";
import connectDB from "./config/db.js";
import authRoutes from "./routes/auth.route.js";
import resourceRoutes from "./routes/resource.route.js";

const app = express();

dotenv.config();
app.use(express.static('public'))
app.use(bodyParser.json());
app.use(express.urlencoded({ extended: true }));

const port = process.env.PORT || 5000;

connectDB();

app.use("/api/auth", authRoutes);
app.use("/api/resource", resourceRoutes);

app.get("/", (req, res) => {
  res.render("index.html");
});

app.listen(port, () => {
  console.log(`App running on port ${port}`);
});
