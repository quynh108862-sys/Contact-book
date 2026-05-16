const Contact = require("../models/Contact");

// Lấy danh sách + Tìm kiếm + Phân trang
exports.getContacts = async (req, res) => {
    try {

        const keyword = req.query.search || "";
        const page = parseInt(req.query.page) || 1;

        const limit = 5;
        const skip = (page - 1) * limit;

        let query = {};

        if (keyword) {
            query = {
                name: { $regex: keyword, $options: "i" }
            };
        }

        const total = await Contact.countDocuments(query);

        const contacts = await Contact.find(query)
            .sort({ name: 1 })
            .skip(skip)
            .limit(limit);

        const totalPages = Math.ceil(total / limit);

        res.render("index", {
            contacts,
            query: keyword,
            currentPage: page,
            totalPages
        });

    } catch (error) {
        res.status(500).send("Lỗi Server");
    }
};

// Thêm mới
exports.createContact = async (req, res) => {
    try {
        const { name, phone, email } = req.body;
        await Contact.create({ name, phone, email });
        res.redirect("/");
    } catch (error) {
        res.status(400).send("Lỗi lưu dữ liệu");
    }
};

// Mở trang sửa
exports.getEditForm = async (req, res) => {
    try {
        const contact = await Contact.findById(req.params.id);
        res.render("edit", { contact });
    } catch (err) {
        res.status(500).send("Không tìm thấy liên hệ");
    }
};

// Lưu dữ liệu sau khi sửa
exports.updateContact = async (req, res) => {
    try {
        const { name, phone, email } = req.body;
        await Contact.findByIdAndUpdate(req.params.id, {
            name,
            phone,
            email
        });

        res.redirect("/");
    } catch (err) {
        res.status(500).send("Lỗi khi cập nhật");
    }
};