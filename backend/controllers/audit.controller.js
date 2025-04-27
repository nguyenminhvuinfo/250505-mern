import AuditLog from "../models/audit.model.js";

export const getAuditLogs = async (req, res) => {
  try {
    // Lấy logs, sort theo thời gian, populate user và thông tin product hiện tại
    const logs = await AuditLog.find({})
      .sort({ timestamp: -1 })
      .populate("user", "name email")
      .populate("productId", "name price image")
      .exec();

    // Định dạng lại để frontend dễ xử lý
    const formattedLogs = logs.map(log => {
      const oldData = log.oldData || {};
      const newData = log.newData || {};
      const current = log.productId || {};

      return {
        user: log.user?.name || "Người dùng không tồn tại hoặc đã bị xóa",
        action: log.action,
        // Tên sản phẩm hiện tại (từ populate) hoặc fallback về newData.name
        product: current.name || newData.name || "Sản phẩm không tồn tại hoặc đã bị xóa",
        timestamp: log.timestamp,
        // Trả về đầy đủ snapshot trước và sau để frontend tùy ý render detail
        changes: {
          old: {
            name: oldData.name,
            price: oldData.price,
            image: oldData.image,
          },
          new: {
            name: newData.name,
            price: newData.price,
            image: newData.image,
          }
        }
      };
    });

    res.status(200).json({ success: true, data: formattedLogs });
  } catch (error) {
    console.error("Lỗi khi lấy audit logs:", error);
    res.status(500).json({
      success: false,
      message: "Lỗi server khi lấy audit logs",
      error: error.message,
    });
  }
};

// Xóa toàn bộ audit logs trong collection
export const deleteAuditLogs = async (req, res) => {
  try {
    await AuditLog.deleteMany({});
    res.status(200).json({ success: true, message: "Đã xóa tất cả audit logs." });
  } catch (error) {
    console.error("Lỗi khi xóa audit logs:", error);
    res.status(500).json({
      success: false,
      message: "Lỗi server khi xóa audit logs",
      error: error.message,
    });
  }
};
