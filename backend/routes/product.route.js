    import express from "express";
    import {createProducts, getProducts, updateProduct, deleteProduct} from "../controllers/product.controller.js";
    import { protect } from "../middleware/authen.middleware.js";

    const router = express.Router();

    // Phương thức này để fetch toàn bộ sản phẩm nhe
    router.get("/", getProducts);

    // Phương thức này để thêm mới sản phẩm nhe
    router.post("/", protect, createProducts);

    // Phương thức update sản phẩm theo Id truyền vào
    router.put("/:id", protect, updateProduct);

    // Phương thức xóa sản phẩm theo Id truyền vào
    router.delete("/:id", protect,  deleteProduct);

    // Phương thức là lọc sản phẩm tìm kiếm

    export default router;