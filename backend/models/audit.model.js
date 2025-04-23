import mongoose from "mongoose";

const auditSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
  },
  action: {
    type: String,
    required: true,
    enum: ['CREATE', 'UPDATE', 'DELETE'], // Giới hạn loại hành động
  },
  productId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Product',
  },
  timestamp: {
    type: Date,
    default: Date.now,
  },
  changes: {
    type: Object,
    default: {},
  },
});

const AuditLog = mongoose.model("AuditLog", auditSchema);

export default AuditLog;
