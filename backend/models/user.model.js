// models/user.model.js
import mongoose from "mongoose";

const userSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, "Họ tên là bắt buộc"],
    trim: true,
    minlength: [1, "Tên phải có ít nhất 1 ký tự"],
    maxlength: [40, "Tên không vượt quá 40 ký tự"],
    validate: {
      validator: v => /^[A-Za-zÀ-ỹ\s]+$/.test(v),
      message: props => `${props.value} không hợp lệ (chỉ chữ và dấu cách)`
    }
  },
  email: {
    type: String,
    required: [true, "Email là bắt buộc"],
    unique: true,
    lowercase: true,
    match: [/\S+@\S+\.\S+/, "Email không đúng định dạng"]
  },
  password: {
    type: String,
    required: [true, "Mật khẩu là bắt buộc"],
    minlength: [6, "Mật khẩu tối thiểu 6 ký tự"]
  }
}, { timestamps: true });

export default mongoose.model("User", userSchema);
