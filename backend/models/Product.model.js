// models/product.model.js
import mongoose from "mongoose";

const productSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, "Tên sản phẩm là bắt buộc"],
    unique: true,
    trim: true,
    minlength: [1, "Tên phải có ít nhất 1 ký tự"],
    maxlength: [40, "Tên không vượt quá 40 ký tự"]
  },
  price: {
    type: Number,
    required: [true, "Giá sản phẩm là bắt buộc"],
    min: [1, "Giá phải ≥ 1"],
    max: [1000000000, "Giá phải ≤ 1000000000"]
  },
  image: {
    type: String,
    required: [true, "Link ảnh là bắt buộc"]
  }
}, { timestamps: true });

export default mongoose.model("Product", productSchema);
