const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const jwt = require("jsonwebtoken");
const dotenv = require("dotenv");
const empmodel = require("./mod");

dotenv.config(); // Load env variables

const app = express();
app.use(cors());
app.use(express.json());

const mongoURI = process.env.MONGO_URI;
const JWT_SECRET = process.env.JWT_SECRET;

// MongoDB Atlas connection
mongoose.connect(mongoURI)
  .then(() => console.log("✅ MongoDB Atlas connected"))
  .catch((err) => console.error("❌ Connection failed:", err));

/* ---------------------- Signup ---------------------- */
app.post("/signup", async (req, res) => {
  const { username, email, password } = req.body;
  try {
    const existing = await empmodel.findOne({ email });
    if (existing) return res.status(400).json({ message: "User already exists ❌" });

    const user = new empmodel({ username, email, password });
    await user.save();
    res.status(201).json({ message: "User registered ✅" });
  } catch (err) {
    res.status(500).json({ message: "Server error" });
  }
});

/* ---------------------- Login + JWT ---------------------- */
app.post("/login", async (req, res) => {
    const { username, password } = req.body;
    
    try {
      // First find by username only
      const user = await empmodel.findOne({ username });
      
      if (!user) {
        console.log("User not found");
        return res.status(401).json({ message: "Invalid credentials ❌" });
      }
  
      // Compare plaintext passwords (TEMPORARY - should use hashing)
      if (user.password !== password) {
        console.log("Password mismatch");
        return res.status(401).json({ message: "Invalid credentials ❌" });
      }
  
      // Create JWT token
      const token = jwt.sign(
        { userId: user._id, username: user.username }, 
        JWT_SECRET, 
        { expiresIn: "2h" }
      );
  
      // Send successful response
      res.status(200).json({
        message: "Login successful ✅",
        token,
        user: {
          id: user._id,
          username: user.username,
          email: user.email,
          levelsCompleted: user.levelsCompleted || 0 // Default to 0 if undefined
        }
      });
    } catch (err) {
      console.error("Login error:", err);
      res.status(500).json({ message: "Server error" });
    }
  });
/* ---------------------- JWT Middleware ---------------------- */
const authenticate = (req, res, next) => {
  const authHeader = req.headers["authorization"];
  const token = authHeader && authHeader.split(" ")[1];
  if (!token) return res.status(403).json({ message: "Token required ❌" });

  jwt.verify(token, JWT_SECRET, (err, decoded) => {
    if (err) return res.status(401).json({ message: "Invalid token ❌" });
    req.user = decoded;
    next();
  });
};

/* ---------------------- Level Up ---------------------- */
app.put("/level-up", authenticate, async (req, res) => {
  const username = req.user.username;

  try {
    const user = await empmodel.findOne({ username });
    if (!user) return res.status(404).json({ message: "User not found ❌" });

    user.levelsCompleted += 1;
    await user.save();

    res.json({ message: "Level updated ✅", newLevel: user.levelsCompleted });
  } catch (err) {
    res.status(500).json({ message: "Server error" });
  }
});

/* ---------------------- Get Users ---------------------- */
app.get("/getusers", authenticate, async (req, res) => {
  const username = req.query.username;
  if (!username) return res.status(400).json({ message: "Username required" });

  try {
    const users = await empmodel.find({ username });
    if (users.length === 0) return res.status(404).json({ message: "User not found" });
    res.json(users);
  } catch (err) {
    res.status(500).json({ message: "Server error" });
  }
});

/* ---------------------- Test Route ---------------------- */
app.get("/", (req, res) => {
  res.send("🚀 Server running with MongoDB Atlas and JWT!");
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`🚀 Server is live on http://localhost:${PORT}`);
});
