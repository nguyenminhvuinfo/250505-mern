import User from "../models/user.model.js";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";

export const registerUser = async (req, res) => {
  const { name, email, password } = req.body;

  // Kiểm tra chắc chắn có đủ 3 field
  if (!name || !email || !password) {
    return res.status(400).json({
      success: false,
      message: "Vui lòng điền đầy đủ họ tên, email và mật khẩu."
    });
  }

  try {
    // Hash mật khẩu
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    // Tạo và lưu user mới
    const newUser = new User({ name, email, password: hashedPassword });
    await newUser.save();

    return res.status(201).json({
      success: true,
      message: "Đăng ký thành công!"
    });
  } catch (err) {
    // Mongoose validation error
    if (err.name === "ValidationError") {
      const messages = Object.values(err.errors).map(e => e.message);
      return res.status(400).json({ success: false, message: messages.join(", ") });
    }
    // Duplicate key (email đã tồn tại)
    if (err.code === 11000 && err.keyPattern.email) {
      return res.status(400).json({ success: false, message: "Email đã tồn tại." });
    }
    console.error("Register error:", err);
    return res.status(500).json({ success: false, message: "Lỗi server!" });
  }
};

export const loginUser = async (req, res) => {
  const { email, password } = req.body;
  if (!email || !password) {
    return res.status(400).json({ success: false, message: "Vui lòng nhập email và mật khẩu." });
  }

  try {
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(400).json({ success: false, message: "Email không tồn tại." });
    }

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(400).json({ success: false, message: "Sai mật khẩu." });
    }

    const token = jwt.sign(
      { userId: user._id, email: user.email },
      process.env.JWT_SECRET,
      { expiresIn: "2h" }
    );

    return res.status(200).json({
      success: true,
      token,
      message: "Đăng nhập thành công"
    });
  } catch (error) {
    console.error("Login error", error.message);
    return res.status(500).json({ success: false, message: "Lỗi server" });
  }
};
