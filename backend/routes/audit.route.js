import express from "express";
import { deleteAuditLogs, getAuditLogs } from "../controllers/audit.controller.js";
import { protect } from "../middleware/authen.middleware.js";

const router = express.Router();

router.get("/", protect, getAuditLogs); // cái này là chỉ user đã đăng nhập mới được xem log nhe Cá Doi
router.delete("/", protect, deleteAuditLogs);

export default router;
