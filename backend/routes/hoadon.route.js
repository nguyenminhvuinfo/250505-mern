import express from "express";
import { createInvoice, getInvoices, getInvoiceById } from "../controllers/hoadon.controller.js";
import { protect } from "../middleware/authen.middleware.js"; // Middleware bảo vệ nếu cần

const router = express.Router();

// Đảm bảo có route cho POST /api/invoices
router.post("/", protect, createInvoice);  // Đây là route để tạo hóa đơn mới

router.get("/", protect, getInvoices);

router.get("/:id", protect, getInvoiceById);

export default router;
