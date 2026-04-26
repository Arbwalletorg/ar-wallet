require('dotenv').config();

const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');

const app = express();

app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// MongoDB Connection
mongoose.connect(process.env.MONGO_URL)
.then(() => console.log("MongoDB Connected"))
.catch(err => console.log("DB Error:", err));

// Schema
const userSchema = new mongoose.Schema({
  phone: String,
  password: String
});

const User = mongoose.model('User', userSchema);

// Test route
app.get('/', (req, res) => {
  res.send("Backend is working");
});

// Save user route
app.post('/save-user', async (req, res) => {
  try {
    const { phone, password } = req.body;

    if (!phone || !password) {
      return res.status(400).send("Missing data");
    }

    const newUser = new User({ phone, password });
    await newUser.save();

    res.send("User saved successfully!");
  } catch (err) {
    console.log(err);
    res.status(500).send("Error saving data");
  }
});

// Start server
const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});