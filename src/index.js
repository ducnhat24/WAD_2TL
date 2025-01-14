const express = require('express');
const path = require('path');
const app = express();
const port = 5000;
const cors = require('cors');
const { engine } = require('express-handlebars');
require('./helpers/currencyHelper');
const { route } = require('./routes/index');
const cookieParser = require('cookie-parser');
app.use(express.json());

const session = require('express-session');


const allowedOrigins = ['http://localhost:5000', 'http://localhost:5173'];
app.use(cors({
  // origin: 'https://wad-ga-06-a8w4.vercel.app',
  origin: function (origin, callback) {
    if (allowedOrigins.includes(origin) || !origin) {
      callback(null, true);
    } else {
      callback(new Error('Not allowed by CORS'));
    }
  },
  methods: ['GET', 'POST', 'PUT', 'DELETE'],
  credentials: true // Required for cookies
}));

// Cấu hình session middleware
app.use(session({
  secret: 'your-secret-key', // Chọn một secret key mạnh
  resave: false,  // Không lưu lại session nếu không thay đổi
  saveUninitialized: true, // Lưu lại session ngay cả khi không có gì thay đổi
  cookie: { maxAge: 1000 * 60 * 60 }, // Giới hạn session tồn tại trong 1 giờ
}));


app.engine("handlebars", engine({
  layoutsDir: path.join(__dirname, ""), // Thư mục chứa layout
  defaultLayout: "main", // Layout mặc định
  extname: ".handlebars", // Sử dụng phần mở rộng .handlebars
  runtimeOptions: {
    allowProtoPropertiesByDefault: true, // Cho phép truy cập thuộc tính từ prototype
    allowProtoMethodsByDefault: true,   // Cho phép gọi các phương thức từ prototype (nếu cần)
  },
  helpers: {
    eqString: (a, b) => String(a) === String(b),
    includes: (item, array) => Array.isArray(array) && array.includes(item),
    formatPrice: (price) => {
      // Kiểm tra giá trị đầu vào là số hợp lệ
      if (typeof price === "number" && !isNaN(price)) {
        return price.toLocaleString("vi-VN"); // Định dạng số theo chuẩn Việt Nam
      } else if (typeof price === "string" && !isNaN(Number(price))) {
        return Number(price).toLocaleString("vi-VN");
      }
      return "N/A"; // Giá trị không hợp lệ trả về 'N/A'
    },
    formatDate: (input) => {
      const date = new Date(input);
      const day = date.getDate();
      const month = date.getMonth() + 1;
      const year = date.getFullYear();
      return `${day}/${month}/${year}`;
    }
  },
}));
app.set("view engine", "handlebars");
app.set('views', [
  path.join(__dirname, 'components', 'product', 'view'),
  path.join(__dirname, 'components', 'customer', 'view'),
  path.join(__dirname, 'components', 'site', 'view'),
]);
app.use(express.static(path.join(__dirname, "public")));

const db = require('./config/index');
const { seed } = require('./config/seeds/seed');
const seedData = async () => {
  await db.connect();
  // await seed();
}
seedData();

app.use(cookieParser());

route(app);

app.listen(port, () => {
  console.log(`Server is running on http://localhost:${port}`);
});

module.exports = app;
