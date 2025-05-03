import express from "express";
import { registerUser, loginUser, forgotPassword, verifyResetCode, resetPassword  } from "../controllers/authen.controller.js";
import { protect } from "../middleware/authen.middleware.js"; 
import User from "../models/user.model.js";

const router = express.Router();

router.post("/forgot-password", forgotPassword);
router.post("/verify-reset-code", verifyResetCode);
router.post("/reset-password", resetPassword);

router.post("/register", registerUser); 
router.post("/login", loginUser);
router.get("/verify-token", protect, async (req, res) => {
    try {
      const user = await User.findById(req.user._id); // Lấy thông tin người dùng từ token
      if (!user) {
        return res.status(401).json({ success: false, message: "User not found" });
      }
      res.status(200).json({ success: true, user });
    } catch (error) {
      res.status(500).json({ success: false, message: "Server Error" });
    }
  });
export default router;

