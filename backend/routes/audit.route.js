import express from "express";
import { getAuditLogs } from "../controllers/audit.controller.js";
import { protect } from "../middleware/authen.middleware.js";

const router = express.Router();

router.get("/", protect, getAuditLogs); // cái này là chỉ user đã đăng nhập mới được xem log nhe Cá Doi

export default router;
