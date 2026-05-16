const express = require("express");
const dotenv = require("dotenv");
const session = require("express-session");

const connectDB = require("./src/config/db");

const contactRoutes = require("./src/routes/ContactRoutes");
const authRoutes = require("./src/routes/AuthRoutes");

dotenv.config();
const app = express();

connectDB();

// Middleware để đọc dữ liệu từ Form
app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(express.static("public"));

// Session để lưu trạng thái đn
app.use(
  session({
    secret: "contactbook",
    resave: false,
    saveUninitialized: true,
  })
);

// Cấu hình View Engine
app.set("view engine", "ejs");
app.set("views", "./src/views");

// Sử dụng Routes
app.use("/", authRoutes);
app.use("/", contactRoutes);                           //nhận request

const PORT = process.env.PORT || 3000;

app.listen(PORT, () =>
  console.log(`Server chạy tại http://localhost:${PORT}`)
);