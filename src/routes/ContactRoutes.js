const express = require("express");
const router = express.Router();
const Contact = require("../models/Contact");

// 1. Hiển thị danh sách + Tìm kiếm 
router.get("/", async (req, res) => { //router xử lý

    try {

        const query = req.query.search || "";

        const page = parseInt(req.query.page) || 1;

        const limit = 3;

        const skip = (page - 1) * limit;

        const searchQuery = {
            name: { $regex: query, $options: "i" }
        };

        const total = await Contact.countDocuments(searchQuery);

        const contacts = await Contact.find(searchQuery) //lấy dl mongodb
            .sort({ name: 1 })
            .skip(skip)
            .limit(limit);

        const totalPages = Math.ceil(total / limit);

        res.render("index", { //giao diện
            contacts,
            query,
            currentPage: page,
            totalPages,
            user: req.session.user
        });

    } catch (err) {

        console.error(err);

        res.status(500).send("Lỗi Server");
    }

});

// 2. Route xử lý khi nhấn nút "Xác nhận Lưu"
router.post("/add", async (req, res) => {
    try {
        const { name, phone, email } = req.body;

        const newContact = new Contact({
            name: name,
            phone: phone,
            email: email
        });

        await newContact.save(); // Lưu vào MongoDB
        console.log("Đã lưu thành công:", name);
        res.redirect("/"); // Lưu xong quay về trang chủ
    } catch (err) {
        console.error("Lỗi khi lưu:", err);
        res.status(500).send("Không thể lưu dữ liệu");
    }
});

// 3. Route Xóa liên hệ
router.get("/delete/:id", async (req, res) => {
    try {
        await Contact.findByIdAndDelete(req.params.id);
        res.redirect("/");
    } catch (err) {
        res.status(500).send("Lỗi khi xóa");
    }
});

// 4. trang sửa 
router.get("/edit/:id", async (req, res) => {
    try {
        const contact = await Contact.findById(req.params.id);
        res.render("edit", { contact: contact });
    } catch (err) {
        res.status(500).send("Không tìm thấy liên hệ");
    }
});

// 5. Lưu dữ liệu sau khi sửa
router.post("/edit/:id", async (req, res) => {
    try {
        const { name, phone, email } = req.body;
        await Contact.findByIdAndUpdate(req.params.id, { name, phone, email });
        res.redirect("/");
    } catch (err) {
        res.status(500).send("Lỗi khi cập nhật");
    }
});

module.exports = router;