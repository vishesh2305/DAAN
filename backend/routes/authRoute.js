const express = require("express");
const mongoose = require("mongoose");
const router = express.Router();
const User = mongoose.model("User");

// This helper function remains the same
const parseDOB = (dob) => {
    if (typeof dob === "string" && dob.includes("/")) {
        const [day, month, year] = dob.split("/");
        return new Date(`${year}-${month}-${day}`);
    }
    return new Date(dob);
};

// ✅ SIGNUP Route (Modified to return user object)
router.post("/signup", async (req, res) => {
    console.log("📩 Signup request received.");
    try {
        const { name, dob, location, email, password, govtImage, selfieImage, blockchainAddress, coordinates } = req.body;

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
            password, // In production, this should be hashed before saving
            govtImage: Buffer.from(govtImage, "base64"),
            selfieImage: Buffer.from(selfieImage, "base64"),
            blockchainAddress,
            coordinates,
        });

        await newUser.save();
        
        // Auto-login the user by creating a session
        req.session.userId = newUser._id; 
        console.log("✅ User saved and session started.");
        
        // Create a safe user object to send back to the client
        const userResponse = {
            _id: newUser._id,
            name: newUser.name,
            email: newUser.email,
            avatar: newUser.avatar, // The User model has a default avatar
        };

        // Send back the user object on successful signup
        res.status(201).json({ message: "User registered successfully.", user: userResponse });

    } catch (err) {
        console.error("❌ Signup error:", err);
        res.status(500).json({ error: "Signup failed." });
    }
});


// ✅ LOGIN Route (Corrected)
router.post("/login", async (req, res) => {
    const { email, password } = req.body;
    try {
        if (!email || !password) {
            return res.status(400).json({ error: "Email and password required." });
        }
        
        const user = await User.findOne({ email });
        
        // In production, compare hashed passwords instead of plain text
        if (!user || user.password !== password) {
            return res.status(401).json({ error: "Invalid credentials." });
        }

        req.session.userId = user._id;

        // Create a safe user object to send to the client, excluding sensitive data
        const userResponse = {
            _id: user._id,
            name: user.name,
            email: user.email,
            avatar: user.avatar,
            // Add any other non-sensitive fields your frontend might need
        };
        
        res.status(200).json({
            message: "Login successful",
            user: userResponse // Send the complete, safe user object
        });

    } catch (err) {
        console.error("❌ Login error:", err);
        res.status(500).json({ error: "Login failed." });
    }
});

// ✅ LOGOUT Route (No changes needed)
router.post("/logout", (req, res) => {
    req.session.destroy((err) => {
        if (err) {
            return res.status(500).json({ message: 'Could not log out, please try again.' });
        }
        res.clearCookie("connect.sid"); // The default session cookie name
        res.status(200).json({ message: "Logged out successfully." });
    });
});

// ✅ UPDATE WALLET Route (No changes needed)
router.post("/update-wallet", async (req, res) => {
    try {
        const { blockchainAddress } = req.body;
        if (!req.session.userId) return res.status(401).json({ error: "Not authenticated" });
        if (!blockchainAddress) return res.status(400).json({ error: "Wallet address missing" });
        
        const updatedUser = await User.findByIdAndUpdate(
            req.session.userId,
            { blockchainAddress },
            { new: true }
        );
        if (!updatedUser) return res.status(404).json({ error: "User not found" });
        
        res.status(200).json({ message: "Wallet updated", user: updatedUser });
    } catch (err) {
        console.error("Wallet update error:", err);
        res.status(500).json({ error: "Internal server error" });
    }
});

// ✅ CHECK SESSION Route (Replaces old /me and incorrect /check-session)
// This is the endpoint your frontend will call on page load to see if a user is logged in.
router.get("/check-session", async (req, res) => {
    if (!req.session.userId) {
        return res.status(401).json({ message: "Not authenticated." });
    }

    try {
        // Find the user by the ID in the session and exclude sensitive data
        const user = await User.findById(req.session.userId).select('-password -govtImage -selfieImage');
        
        if (!user) {
            return res.status(404).json({ message: "User not found." });
        }

        // Send the full user object back to the client
        res.status(200).json(user);

    } catch (err) {
        console.error("❌ Session check failed:", err);
        res.status(500).json({ message: "Server error." });
    }
});

// Note: The old '/user' and '/me' routes have been removed to avoid confusion.
// The '/check-session' route now provides the definitive way to get the current logged-in user.

module.exports = router;