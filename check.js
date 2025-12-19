const mongoose = require("mongoose");

mongoose.connect(
  "mongodb+srv://20235052:20235052@cluster8.d2izqxc.mongodb.net/week10"
)
.then(() => console.log("✅ MongoDB connected"))
.catch(err => console.error("❌ MongoDB error:", err));
