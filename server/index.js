const express = require('express');
const cors = require('cors');
const app = express();
const morgan = require('morgan');
const port = 3000;
const { route } = require('./routes/index');
const cookieParser = require('cookie-parser');
app.use(express.json());
app.use(cors({
    // origin: 'https://wad-ga-06-a8w4.vercel.app',
    origin: 'http://localhost:5000',
    methods: ['GET', 'POST', 'PUT', 'DELETE'],
    credentials: true // Required for cookies
}));

const db = require('./config/index');
const { seed } = require('./config/seeds/seed');
const seedData = async () => {
    await db.connect();
    // await seed();
}
// db.connect();
seedData();
// Cấu hình Handlebars với extension mặc định
app.use(cookieParser());

route(app);

app.listen(port, () => {
    console.log(`Server is running on http://localhost:${port}`);
});
