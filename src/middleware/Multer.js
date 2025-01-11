const multer = require("multer");

// Định cấu hình nơi lưu trữ file tạm thời
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, "uploads/"); // Thư mục lưu trữ file tạm
  },
  filename: (req, file, cb) => {
    cb(null, `${Date.now()}-${file.originalname}`); // Đặt tên file
  },
});

const upload = multer({ storage });

module.exports = upload;
