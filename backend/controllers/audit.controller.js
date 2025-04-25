import AuditLog from "../models/audit.model.js";

export const getAuditLogs = async (req, res) => {
  try {
    const logs = await AuditLog.find({})
      .sort({ timestamp: -1 })
      .populate("user", "name email")
      .populate("productId", "name price image")
      .exec();

    const formattedLogs = logs.map(log => {
      // Lấy tên sản phẩm từ changes
      const oldProductName = log.changes?.name || "Unknown Product";
      
      // Lấy tên sản phẩm hiện tại từ populate
      const currentProductName = log.productId?.name || "Unknown Product";
      
      // Format tên sản phẩm dựa trên loại hành động
      let productDisplay;
      
      if (log.action === "CREATE") {
        productDisplay = oldProductName;
      } else if (log.action === "DELETE") {
        productDisplay = oldProductName;
      } else if (log.action === "UPDATE") {
        // So sánh các trường để xác định có thay đổi gì
        const changes = [];
        
        // Kiểm tra thay đổi tên sản phẩm
        if (log.changes?.name !== log.productId?.name) {
          changes.push(`tên: ${log.changes?.name} → ${log.productId?.name}`);
        }
        
        // Kiểm tra thay đổi giá
        if (log.changes?.price !== log.productId?.price) {
          changes.push(`giá: ${log.changes?.price} → ${log.productId?.price}`);
        }
        
        // Kiểm tra thay đổi hình ảnh
        if (log.changes?.image !== log.productId?.image) {
          changes.push(`hình ảnh đã thay đổi`);
        }
        
        // Nếu có thay đổi, hiển thị chi tiết, nếu không thì chỉ hiển thị tên sản phẩm
        productDisplay = changes.length > 0 
          ? `${oldProductName} (${changes.join(", ")})`
          : oldProductName;
      }

      return {
        user: log.user?.name || "Unknown User",
        action: log.action,
        product: productDisplay,
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