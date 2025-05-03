import User from "../models/user.model.js";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import crypto from "crypto";
import nodemailer from "nodemailer";

// Cấu hình nodemailer
const EMAIL_USERNAME="minhlam1610.work@gmail.com";
const EMAIL_PASSWORD="jhnn nfcl yygn npxw";
const EMAIL_FROM="minhlam1610.work@gmail.com";
const JWT_SECRET="tieuminhdeptrai";


const transporter = nodemailer.createTransport({
  service: "gmail", // Hoặc SMTP provider của bạn
  auth: {
    user: EMAIL_USERNAME,
    pass: EMAIL_PASSWORD
  }
});

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
      JWT_SECRET,
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

// Thêm endpoint quên mật khẩu
export const forgotPassword = async (req, res) => {
  const { email } = req.body;
  
  try {
    const user = await User.findOne({ email });
    
    if (!user) {
      return res.status(404).json({ 
        success: false, 
        message: "Email không tồn tại trong hệ thống." 
      });
    }
    
    // Tạo mã xác minh ngẫu nhiên 6 chữ số
    const resetCode = Math.floor(100000 + Math.random() * 900000).toString();
    
    // Hash mã để lưu vào database
    const resetToken = crypto
      .createHash("sha256")
      .update(resetCode)
      .digest("hex");
    
    // Lưu token và thời gian hết hạn vào database
    user.resetPasswordToken = resetToken;
    user.resetPasswordExpire = Date.now() + 15 * 60 * 1000; // 15 phút
    await user.save();
    
    // Nội dung email
    const mailOptions = {
      from: EMAIL_FROM,
      to: user.email,
      subject: "Đặt lại mật khẩu",
      html: `
        <h1>Xin chào ${user.name}</h1>
        <p>Bạn nhận được email này vì bạn (hoặc ai đó) đã yêu cầu đặt lại mật khẩu.</p>
        <p>Mã xác minh của bạn là: <strong>${resetCode}</strong></p>
        <p>Mã này sẽ hết hạn sau 15 phút.</p>
        <p>Nếu bạn không yêu cầu đặt lại mật khẩu, vui lòng bỏ qua email này.</p>
      `
    };
    
    // Gửi email
    await transporter.sendMail(mailOptions);
    
    return res.status(200).json({
      success: true,
      message: "Email đặt lại mật khẩu đã được gửi."
    });
  } catch (error) {
    console.error("Forgot password error:", error);
    return res.status(500).json({
      success: false,
      message: "Có lỗi xảy ra khi gửi email đặt lại mật khẩu."
    });
  }
};

// Xác minh mã reset
export const verifyResetCode = async (req, res) => {
  const { email, resetCode } = req.body;
  
  try {
    // Hash mã để so sánh với database
    const resetToken = crypto
      .createHash("sha256")
      .update(resetCode)
      .digest("hex");
    
    const user = await User.findOne({
      email,
      resetPasswordToken: resetToken,
      resetPasswordExpire: { $gt: Date.now() }
    });
    
    if (!user) {
      return res.status(400).json({
        success: false,
        message: "Mã xác minh không hợp lệ hoặc đã hết hạn."
      });
    }
    
    // Tạo token để dùng cho bước đặt lại mật khẩu
    const verifiedToken = jwt.sign(
      { userId: user._id, email: user.email },
      JWT_SECRET,
      { expiresIn: "15m" }
    );
    
    return res.status(200).json({
      success: true,
      message: "Mã xác minh hợp lệ.",
      resetToken: verifiedToken
    });
  } catch (error) {
    console.error("Verify reset code error:", error);
    return res.status(500).json({
      success: false,
      message: "Lỗi server."
    });
  }
};

// Đặt lại mật khẩu
export const resetPassword = async (req, res) => {
  const { resetToken, newPassword } = req.body;
  
  try {
    // Xác minh token
    const decoded = jwt.verify(resetToken, JWT_SECRET);
    
    // Tìm user
    const user = await User.findById(decoded.userId);
    
    if (!user) {
      return res.status(404).json({
        success: false,
        message: "Người dùng không tồn tại."
      });
    }
    
    // Hash mật khẩu mới
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(newPassword, salt);
    
    // Cập nhật mật khẩu và xóa token reset
    user.password = hashedPassword;
    user.resetPasswordToken = undefined;
    user.resetPasswordExpire = undefined;
    await user.save();
    
    return res.status(200).json({
      success: true,
      message: "Đặt lại mật khẩu thành công."
    });
  } catch (error) {
    console.error("Reset password error:", error);
    
    if (error.name === "JsonWebTokenError") {
      return res.status(401).json({
        success: false,
        message: "Token không hợp lệ."
      });
    }
    
    if (error.name === "TokenExpiredError") {
      return res.status(401).json({
        success: false,
        message: "Token đã hết hạn."
      });
    }
    
    return res.status(500).json({
      success: false,
      message: "Lỗi server."
    });
  }
};