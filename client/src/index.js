const express = require('express');
const path = require('path');
const app = express();
const port = 5000;
const { engine } = require('express-handlebars');
const { route } = require('./routes/index');
const cookieParser = require('cookie-parser');
app.use(express.json());

app.engine("handlebars", engine({
  layoutsDir: path.join(__dirname, ""), // Thư mục chứa layout
  defaultLayout: "main", // Layout mặc định
  extname: ".handlebars", // Sử dụng phần mở rộng .handlebars
  helpers: {
    eqString: (a, b) => String(a) === String(b),
    includes: (item, array) => Array.isArray(array) && array.includes(item),
    formatPrice: (price) => {
      return price.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ".");
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
  path.join(__dirname, 'components', 'product', 'product_list', 'views'),
  path.join(__dirname, 'components', 'product', 'product_details', 'views'),
  path.join(__dirname, 'components', 'home', 'views'),
  path.join(__dirname, 'components', 'about_us', 'views'),
  path.join(__dirname, 'components', 'signup', 'views'),
  path.join(__dirname, 'components', 'cart', 'views'),
  path.join(__dirname, 'components', 'contact', 'views'),
  path.join(__dirname, 'components', 'login', 'views'),
  path.join(__dirname, 'components', 'order', 'views'),
]);
app.use(express.static(path.join(__dirname, "public")));
app.use(cookieParser());

route(app);

app.listen(port, () => {
  console.log(`Server is running on http://localhost:${port}`);
});

module.exports = app;
