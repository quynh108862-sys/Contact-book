const User = require("../models/User");
const bcrypt = require("bcryptjs");

exports.showLogin = (req, res) => {
  res.render("login");
};

exports.showRegister = (req, res) => {
  res.render("register");
};

// Đăng ký
exports.register = async (req, res) => {
  const { username, email, password, confirmPassword } = req.body;

 const userExists = await User.findOne({
    $or: [
        { username },
        { email }
    ]
});

if (password !== confirmPassword) {
    return res.send("Mật khẩu nhập lại không khớp");
}

  if (userExists) {
    return res.send("Tài khoản đã tồn tại");
  }

  const hashedPassword = await bcrypt.hash(password, 10);

  await User.create({
    username,
    email,
    password: hashedPassword,
});

  res.redirect("/login");
};

// Đăng nhập
exports.login = async (req, res) => {
  const { username, password } = req.body;

  const user = await User.findOne({ username });

  if (!user) {
    return res.send("Sai tài khoản");
  }

  const isMatch = await bcrypt.compare(password, user.password);

  if (!isMatch) {
    return res.send("Sai mật khẩu");
  }

  req.session.user = user;

  res.redirect("/");
};

// Logout
exports.logout = (req, res) => {
    req.session.destroy(); // Xóa sạch phiên đăng nhập trên server
    res.clearCookie('connect.sid'); // Xóa cookie ở trình duyệt
    res.redirect('/login'); // Đẩy người dùng về trang đăng nhập
};