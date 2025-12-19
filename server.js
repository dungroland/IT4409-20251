const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const app = express();

// Middleware
app.use(cors());
app.use(express.json());

// Kết nối MongoDB với username là MSSV, password là MSSV, dbname là it4409
mongoose
 .connect("mongodb+srv://lamdb:it4409A@cluster0.3udajaw.mongodb.net/it4409-db")
 .then(() => console.log("Connected to MongoDB"))
 .catch((err) => console.error("MongoDB Error:", err));

// TODO: Tạo Schema
const UserSchema = new mongoose.Schema({
    name: { 
    type: String, 
    required: [true, 'Tên không được để trống'],
    minlength: [2, 'Tên phải có ít nhất 2 ký tự']
    },
    age: { 
    type: Number, 
    required: [true, 'Tuổi không được để trống'],
    min: [0, 'Tuổi phải >= 0']
    },
    email: { 
    type: String, 
    required: [true, 'Email không được để trống'],
    match: [/^\S+@\S+\.\S+$/, 'Email không hợp lệ']
    },
    address: { 
    type: String 
    }
});
const User = mongoose.model("User", UserSchema);

// TODO: Implement API endpoints

// GET - Lấy danh sách (phân trang + tìm kiếm)
app.get("/api/users", async (req, res) => {
  try {
    let { page = 1, limit = 5, search = "" } = req.query;
    page = parseInt(page);
    limit = parseInt(limit);

    const query = {
      $or: [
        { name: { $regex: search, $options: "i" } },
        { email: { $regex: search, $options: "i" } },
        { address: { $regex: search, $options: "i" } }
      ]
    };

    const total = await User.countDocuments(query);
    const totalPages = Math.ceil(total / limit);

    const data = await User.find(query)
      .skip((page - 1) * limit)
      .limit(limit);

    res.status(200).json({
      page,
      limit,
      total,
      totalPages,
      data
    });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// POST - Tạo user mới
app.post("/api/users", async (req, res) => {
  try {
    const data = await User.create(req.body);
    res.status(201).json({
      message: "Tạo người dùng thành công",
      data
    });
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

// PUT - Cập nhật user
app.put("/api/users/:id", async (req, res) => {
  try {
    const data = await User.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true, runValidators: true }
    );

    if (!data)
      return res.status(404).json({ error: "Không tìm thấy người dùng" });

    res.status(200).json({
      message: "Cập nhật người dùng thành công",
      data
    });
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

// DELETE - Xóa user
app.delete("/api/users/:id", async (req, res) => {
  try {
    const data = await User.findByIdAndDelete(req.params.id);

    if (!data)
      return res.status(404).json({ error: "Không tìm thấy người dùng" });

    res.status(200).json({ message: "Xóa người dùng thành công" });
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

// Start server
app.listen(3001, () => {
 console.log("Server running on http://localhost:3001");
});
