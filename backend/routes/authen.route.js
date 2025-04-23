import express from "express";
import { registerUser, loginUser } from "../controllers/authen.controller.js";

const router = express.Router();

router.post("/", registerUser); // Đăng ký
router.post("/login", loginUser); // Đăng nhập

export default router;
