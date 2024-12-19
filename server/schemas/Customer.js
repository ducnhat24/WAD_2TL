const mongoose = require("mongoose");

const customerSchema = new mongoose.Schema({
  customerAvatar: {
    type: String,
    default: "",
    required: false,
  },
  customerName: {
    type: String,
    required: false,
  },
  customerEmail: {
    type: String,
    required: true,
    unique: true,
  },
  customerPassword: {
    type: String,
    required: false, //để false vì khi đăng nhập bằng google sẽ không cần password
  },
  customerRegisterDateTime: {
    type: Date,
    default: new Date(),
  },
  refreshToken: {
    type: String,
    default: null,
  },
  customerCart: [
    {
      productId: {
        type: mongoose.Schema.Types.ObjectId, // Tham chiếu đến `Product`
        ref: "Product", // Model tham chiếu
      },
      quantity: {
        type: Number,
        default: 0, // Số lượng mặc định
      },
    },
  ],
  customerAccountStatus: {
    type: String,
    default: "ACTIVE",
  },
  googleId: {
    type: String,
    required: false, // Chỉ cần cho OAuth
    unique: true, // Đảm bảo mỗi Google ID là duy nhất
    sparse: true, // Để không bắt buộc trường này khi user đăng ký bằng cách khác
  },
});

const Customer = mongoose.model("Customer", customerSchema);

module.exports = Customer;
