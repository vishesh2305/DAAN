const express = require("express");
const mongoose = require("mongoose");
const router = express.Router();
const User = mongoose.model("User");

// Parse various date formats (like dd/mm/yyyy)
const parseDOB = (dob) => {
  if (typeof dob === "string" && dob.includes("/")) {
    const [day, month, year] = dob.split("/");
    return new Date(`${year}-${month}-${day}`);
  }
  return new Date(dob); // assume ISO or Date-compatible string
};

// ✅ SIGNUP
router.post("/signup", async (req, res) => {
  console.log("📩 Signup request received.");
  console.log("📦 Incoming req.body:", req.body);

  try {
    const {
      name,
      dob,
      location,
      email,
      password,
      govtImage,
      selfieImage,
      blockchainAddress,
      coordinates,
    } = req.body;

    if (!name || !dob || !email || !password || !govtImage || !selfieImage) {
      return res.status(400).json({ error: "Missing required fields." });
    }

    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(409).json({ error: "Email already registered." });
    }

    const parsedDOB = parseDOB(dob);

    const newUser = new User({
      name,
      dob: parsedDOB,
      location,
      email,
      password,
      govtImage: Buffer.from(govtImage, "base64"),
      selfieImage: Buffer.from(selfieImage, "base64"),
      blockchainAddress,
      coordinates,
    });

    await newUser.save();
    req.session.userId = newUser._id; // ✅ Auto-login after signup
    console.log("✅ User saved and session started.");
    res.status(201).json({ message: "User registered successfully." });

  } catch (err) {
    console.error("❌ Signup error:", err);
    res.status(500).json({ error: "Signup failed." });
  }
});

// ✅ LOGIN
router.post("/login", async (req, res) => {
  const { email, password } = req.body;

  try {
    if (!email || !password) {
      return res.status(400).json({ error: "Email and password required." });
    }

    const user = await User.findOne({ email });

    if (!user || user.password !== password) {
      return res.status(401).json({ error: "Invalid credentials." });
    }

    req.session.userId = user._id; // ✅ Store user ID in session
    res.status(200).json({
      message: "Login successful",
      user: {
        name: user.name,
        email: user.email,
      },
    });
  } catch (err) {
    console.error("❌ Login error:", err);
    res.status(500).json({ error: "Login failed." });
  }
});

// ✅ LOGOUT
router.post("/logout", (req, res) => {
  req.session.destroy(() => {
    res.clearCookie("connect.sid");
    res.status(200).json({ message: "Logged out successfully." });
  });
});
router.post("/update-wallet", async (req, res) => {
  try {
    const { blockchainAddress } = req.body;
  
    if (!req.session.userId) {
      return res.status(401).json({ error: "Not authenticated" });
    }

    if (!blockchainAddress) {
      return res.status(400).json({ error: "Wallet address missing" });
    }

    const updatedUser = await User.findByIdAndUpdate(
      req.session.userId,
      { blockchainAddress },
      { new: true }
    );

    if (!updatedUser) {
      return res.status(404).json({ error: "User not found" });
    }

    res.status(200).json({ message: "Wallet updated", user: updatedUser });
  } catch (err) {
    console.error("Wallet update error:", err);
    res.status(500).json({ error: "Internal server error" });
  }
});

// ✅ GET LOGGED-IN USER FROM SESSION
router.get("/me", async (req, res) => {
  if (!req.session.userId) {
    return res.status(401).json({ error: "Not authenticated." });
  }

  try {
    const user = await User.findById(req.session.userId).select("name email");
    if (!user) {
      return res.status(404).json({ error: "User not found." });
    }

    res.status(200).json({ user });
  } catch (err) {
    console.error("❌ Fetch current user failed:", err);
    res.status(500).json({ error: "Failed to get user." });
  }
});

// ✅ FETCH USER BY EMAIL (already existed)
router.post("/user", async (req, res) => {
  try {
    const { email } = req.body;

    if (!email) {
      return res.status(400).json({ error: "Email is required." });
    }

    const user = await User.findOne({ email });
    if (!user) {
      return res.status(404).json({ error: "User not found." });
    }

    res.json({ user });
  } catch (err) {
    console.error("User fetch error:", err);
    res.status(500).json({ error: "Failed to fetch user." });
  }
});

module.exports = router;
