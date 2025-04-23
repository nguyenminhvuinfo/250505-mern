import express from "express";
import dotenv from "dotenv";
import authenRoutes from "./routes/authen.route.js";

import { connectDB } from "./config/db.js";

import productRoutes from "./routes/product.route.js";

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;

app.use(express.json()); // này để nhận file Json nhé

app.use("/api/authen", authenRoutes);

app.use("/api/products", productRoutes);

app.listen(PORT, () => {
	connectDB();
	console.log("Server started at http://localhost:" + PORT);
});