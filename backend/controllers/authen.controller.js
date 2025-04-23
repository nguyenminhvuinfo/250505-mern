import User from "../models/user.model.js";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";

// Đăng ký người dùng mới
export const registerUser = async (req, res) => {
  const { name, email, password } = req.body;

  // Kiểm tra nhập đủ thông tin chưa
  if (!name || !email || !password) {
    return res.status(400).json({ success: false, message: "Vui lòng điền đầy đủ thông tin." });
  }

  try {
    // Kiểm tra email đã tồn tại chưa
    const userExist = await User.findOne({ email });
    if (userExist) {
      return res.status(400).json({ success: false, message: "Email đã tồn tại." });
    }

    // Hash password
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    // Tạo người dùng mới
    const newUser = new User({ name, email, password: hashedPassword });
    await newUser.save();

    res.status(201).json({ success: true, message: "Đăng ký thành công!" });
  } catch (err) {
    res.status(500).json({ success: false, message: "Lỗi server!" });
  }
};

// Đăng nhập
export const loginUser = async (req, res) => {
  const { email, password } = req.body;

  if (!email || !password) {
    return res.status(400).json({ success: false, message: "Vui lòng nhập email và mật khẩu." });
  }
  // này để check xem cái email có tồn tại không
  try {
    const user = await User.findOne({ email });
    if (!user) return res.status(400).json({ success: false, message: "Email không tồn tại." });
    // này là so sánh 2 cái mật khẩu đã được mã hóa hash với nhau
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) return res.status(400).json({ success: false, message: "Sai mật khẩu." });

    // Tạo token
    const token = jwt.sign(
        { userId: user._id, email: user.email },
        process.env.JWT_SECRET,
        { expiresIn: "2h" }
      );

    res.status(200).json({
        success: true,
        token,
        message: "Đăng nhập thành công",
    });
    } catch (error) {
      console.error("Login error", error.message);
      res.status(500).json({ success: false, message: "Lỗi server" });
    }  
};

