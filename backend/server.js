    import express from "express";
    import dotenv from "dotenv";
    import {connectDB} from "./config/db.js";
    import productRoutes from "./routes/product.route.js";
    import cors from "cors";

    dotenv.config();

    const app = express();

    app.use(cors(
        {
            origin: ["https://web-mern-stack-api.vercel.app/"],
            methods: ["POST", "GET", "PUT", "DELETE"],
            credentials: true
        }
    ));

    const PORT = process.env.PORT || 5000;
    
    app.use(express.json()); // dòng này là để cho phép nhận file Json trong phần request (req.body)

    app.use("/api/products", productRoutes);

    app.listen(PORT, () => {
        connectDB();
        console.log("Server started at http://localhost:" + PORT);
    }); 