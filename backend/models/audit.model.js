import mongoose from "mongoose";

// Sub-schema cho dữ liệu trước và sau thay đổi
const DataSnapshotSchema = new mongoose.Schema({
  name:  { type: String },
  price: { type: Number },
  image: { type: String },
}, { _id: false });

const auditSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
  },
  action: {
    type: String,
    required: true,
    enum: ['CREATE', 'UPDATE', 'DELETE'],
  },
  productId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Product',
    required: true,
  },
  timestamp: {
    type: Date,
    default: Date.now,
  },
  // Dữ liệu trước thao tác: với DELETE/UPDATE
  oldData: {
    type: DataSnapshotSchema,
    default: {},
  },
  // Dữ liệu sau thao tác: với CREATE/UPDATE
  newData: {
    type: DataSnapshotSchema,
    default: {},
  },
});

const AuditLog = mongoose.model("AuditLog", auditSchema);
export default AuditLog;
