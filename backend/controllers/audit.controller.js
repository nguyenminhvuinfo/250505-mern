import AuditLog from "../models/audit.model.js";

export const getAuditLogs = async (req, res) => {
  try {
    const logs = await AuditLog.find({})
      .sort({ timestamp: -1 }) // sắp xếp mới nhất ở đầu nha Cá Doi
      .populate("user","name email")
      .populate("productId", "name")  // này để xuất tên sản phẩm trong audit về frontend
      .exec();
    const formattedLogs = logs.map(log => {
      console.log("Log User:", log.user);  // In ra user để kiểm tra xem populate đã hoạt động chưa
      return {
        user: log.user?.name || "Unknown User",
        action: log.action,
        product: log.productId?.name || "Unknown Product",
        timestamp: log.timestamp,
        changes: log.changes,
      };
    });
    res.status(200).json({ success: true, data: formattedLogs });
  } catch (error) {
    console.error("Lỗi khi lấy audit logs:", error.message);
    res.status(500).json({ success: false, message: "Lỗi server khi lấy audit logs" });
  }
};
