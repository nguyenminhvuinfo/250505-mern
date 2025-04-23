import jwt from "jsonwebtoken";
import User from "../models/user.model.js";

export const protect = async (req, res, next) => {
  const authHeader = req.headers.authorization;

  if (!authHeader || !authHeader.startsWith("Bearer ")) {
    return res.status(401).json({ success: false, message: "Không có token, truy cập bị từ chối" });
  }

  const token = authHeader.split(" ")[1];

  try {
    // Giải mã token
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    
    // In ra decoded để kiểm tra thông tin giải mã từ token
    console.log("Decoded user:", decoded);

    // Tìm người dùng từ cơ sở dữ liệu bằng userId từ token
    const user = await User.findById(decoded.userId);
    
    // Nếu không tìm thấy người dùng trong cơ sở dữ liệu, trả lỗi
    if (!user) {
      return res.status(401).json({ success: false, message: "Người dùng không tồn tại" });
    }

    // Lưu thông tin người dùng vào req.user để sử dụng trong các route tiếp theo
    req.user = user;
    console.log("User ID from token:", req.user._id); // Kiểm tra _id người dùng trong token

    
    // Cho phép tiếp tục vào các handler tiếp theo
    next();
  } catch (err) {
    // Trường hợp token không hợp lệ hoặc hết hạn
    res.status(401).json({ success: false, message: "Token không hợp lệ" });
  }
};
