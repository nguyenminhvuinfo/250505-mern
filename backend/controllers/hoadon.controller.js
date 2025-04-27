import HoaDon from "../models/hoadon.model.js";
import Product from "../models/product.model.js"

// Hàm tiện ích để tạo số hóa đơn
const generateInvoiceNumber = async () => {
  const today = new Date();
  const day = today.getDate();  // Ngày hiện tại
  const month = today.getMonth() + 1;  // Tháng hiện tại (tháng bắt đầu từ 0)
  
  const startOfDay = new Date(today);
  startOfDay.setHours(0, 0, 0, 0);
  
  const endOfDay = new Date(today);
  endOfDay.setHours(23, 59, 59, 999);
  
  // Đếm số hóa đơn trong ngày
  const count = await HoaDon.countDocuments({ 
    "date": { $gte: startOfDay, $lt: endOfDay }
  });

  // Format: ngày + tháng + thứ tự trong ngày (đảm bảo số có 2 chữ số)
  const dayStr = day < 10 ? `0${day}` : `${day}`;
  const monthStr = month < 10 ? `0${month}` : `${month}`;
  const countStr = String(count + 1).padStart(2, '0');
  
  // Tạo số hóa đơn theo định dạng "ngày/tháng-thứ tự"
  return `${dayStr}/${monthStr}-${countStr}`;
};

// Tạo hóa đơn mới
export const createInvoice = async (req, res) => {
    const { products, userId, paymentMethod } = req.body;
  
    if (!products || !userId || !paymentMethod) {
      return res.status(400).json({ success: false, message: "Thiếu thông tin hóa đơn" });
    }
  
    try {
      // Tạo số hóa đơn
      const invoiceNumber = await generateInvoiceNumber();

      let totalAmount = 0;
      const productDetails = [];
  
      for (let i = 0; i < products.length; i++) {
        const product = await Product.findById(products[i].productId);
        if (!product) {
          return res.status(404).json({ success: false, message: "Sản phẩm không tồn tại" });
        }
  
        const total = product.price * products[i].quantity;
        totalAmount += total;
  
        productDetails.push({
          productId: product._id,
          productName: product.name,
          price: product.price,
          quantity: products[i].quantity,
          image: product.image,
          total: total,
        });
      }
  
      const newInvoice = new HoaDon({
        invoiceNumber,  // Thêm số hóa đơn được tạo ở trên
        userId,
        products: productDetails,
        totalAmount,
        paymentMethod,
      });
  
      await newInvoice.save();
  
      res.status(201).json({ success: true, data: newInvoice });
  
    } catch (error) {
      console.error("Lỗi khi tạo hóa đơn:", error.message);
      res.status(500).json({ success: false, message: "Lỗi server" });
    }
};

// Lấy danh sách hóa đơn
export const getInvoices = async (req, res) => {
  try {
    const invoices = await HoaDon.find()
      .populate("userId", "name email")
      .exec();
    res.status(200).json({ success: true, data: invoices });
  } catch (error) {
    console.error("Lỗi khi lấy danh sách hóa đơn:", error.message);
    res.status(500).json({ success: false, message: "Lỗi server" });
  }
};

// Lấy chi tiết một hóa đơn
export const getInvoiceById = async (req, res) => {
  const { id } = req.params;

  try {
    const invoice = await HoaDon.findById(id)
      .populate("userId", "name email")
      .exec();

    if (!invoice) {
      return res.status(404).json({ success: false, message: "Hóa đơn không tồn tại" });
    }

    res.status(200).json({ success: true, data: invoice });
  } catch (error) {
    console.error("Lỗi khi lấy hóa đơn:", error.message);
    res.status(500).json({ success: false, message: "Lỗi server" });
  }
};