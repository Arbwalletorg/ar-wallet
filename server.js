const express = require("express");
const mongoose = require("mongoose");
const dotenv = require("dotenv");
const cors = require("cors");

// Load env
dotenv.config();

const app = express();

// =========================
// 🔥 MIDDLEWARE (IMPORTANT)
// =========================
app.use(cors());
app.use(express.json());

// =========================
// 🔗 MongoDB Connection
// =========================
mongoose.connect(process.env.MONGO_URL)
  .then(() => console.log("✅ MongoDB Connected"))
  .catch((err) => console.log("❌ DB Error:", err));

// =========================
// 📦 Schema & Model
// =========================
const userSchema = new mongoose.Schema({
  phone: {
    type: String,
    required: true,
    unique: true,
  },
  password: {
    type: String,
    required: true,
  },
}, { timestamps: true });

const User = mongoose.model("User", userSchema);

// =========================
// 🏠 Test Route
// =========================
app.get("/", (req, res) => {
  res.json({ message: "Server is running ✅" });
});

// =========================
// 📝 REGISTER ROUTE
// =========================
app.post("/register", async (req, res) => {
  try {
    console.log("REGISTER HIT");

    const { phone, password } = req.body;

    if (!phone || !password) {
      return res.status(400).json({ message: "Missing phone or password" });
    }

    const existingUser = await User.findOne({ phone });
    if (existingUser) {
      return res.status(400).json({ message: "User already exists" });
    }

    const user = new User({ phone, password });
    await user.save();

    return res.json({ message: "User registered successfully ✅" });

  } catch (err) {
    console.log(err);
    return res.status(500).json({ message: "Server error" });
  }
});

// =========================
// 🔐 LOGIN ROUTE
// =========================
app.post("/login", async (req, res) => {
  try {
    console.log("LOGIN HIT");

    const { phone, password } = req.body;

    if (!phone || !password) {
      return res.status(400).json({ message: "Missing data" });
    }

    const user = await User.findOne({ phone });

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    if (user.password !== password) {
      return res.status(401).json({ message: "Invalid credentials" });
    }

    return res.json({ message: "Login successful ✅" });

  } catch (err) {
    console.log(err);
    return res.status(500).json({ message: "Server error" });
  }
});

// =========================
// 🚀 START SERVER
// =========================
const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`🚀 Server running on port ${PORT}`);
});