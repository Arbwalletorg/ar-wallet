const express = require("express");
const dotenv = require("dotenv");
const cors = require("cors");
const mongoose = require("mongoose");


// Load env
dotenv.config();

const app = express();
app.use(cors());
app.use(express.json());

// =========================
// 🔗 MongoDB Connection
// =========================
mongoose.connect(process.env.MONGO_URL)
  .then(() => console.log("✅ MongoDB Connected"))
  .catch((err) => {
    console.log("❌ FULL DB ERROR:");
    console.log(err);
  });

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
  res.send("Server is running ✅");
});

// =========================
// 📝 Register
// =========================
app.post("/register", async (req, res) => {
  try {
    const { phone, password } = req.body;

    if (!phone || !password) {
      return res.status(400).send("Missing phone or password");
    }

    const existingUser = await User.findOne({ phone });
    if (existingUser) {
      return res.status(400).send("User already exists");
    }

    const user = new User({ phone, password });
    await user.save();

   return res.json("User registered successfully ✅");
  } catch (err) {
    console.log(err);
    res.status(500).send("Server error");
  }
});

// =========================
// 🔐 Login
// =========================
app.post("/login", async (req, res) => {
  try {
    const { phone, password } = req.body;

    if (!phone || !password) {
      return res.status(400).send("Missing data");
    }

    const user = await User.findOne({ phone });

    if (!user) {
      return res.status(404).send("User not found");
    }

    if (user.password !== password) {
      return res.status(401).send("Invalid credentials");
    }

    return res.json("Login successful ✅");
  } catch (err) {
    console.log(err);
    res.status(500).send("Server error");
  }
});

// =========================
// 🚀 Start Server
// =========================
const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`🚀 Server running on port ${PORT}`);
});