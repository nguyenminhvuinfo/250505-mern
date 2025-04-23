import jwt from "jsonwebtoken";

export const protect = (req, res, next) => {
  const authHeader = req.headers.authorization;

  if (!authHeader || !authHeader.startsWith("Bearer ")) {
    return res.status(401).json({ success: false, message: "Không có token, truy cập bị từ chối" });
  }

  const token = authHeader.split(" ")[1];

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.user = decoded; // gắn thông tin user vào request
    next(); // cho phép đi tiếp
  } catch (err) {
    res.status(401).json({ success: false, message: "Token không hợp lệ" });
  }
};
