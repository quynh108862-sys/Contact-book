const mongoose = require("mongoose");
//tạo cấu trúc dữ liệu.
const contactSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, "Vui lòng nhập tên"],
    trim: true,
  },
  phone: {
    type: String,
    required: [true, "Vui lòng nhập số điện thoại"],
    trim: true,
  },
  email: {
    type: String,
    lowercase: true,
    trim: true,
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

// Thêm chỉ mục (index) để phục vụ tính năng tìm kiếm nhanh theo tên
contactSchema.index({ name: 'text' });

module.exports = mongoose.model("Contact", contactSchema);
//ktr dl