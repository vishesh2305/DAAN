const mongoose = require("mongoose");
const encrypt = require("mongoose-encryption");
require("dotenv").config();

// Use environment keys (required in production)
const encKey = Buffer.from(process.env.ENC_KEY, "base64"); // ✅ convert to bytes
const sigKey = Buffer.from(process.env.SIG_KEY, "base64"); // ✅ convert to bytes

const userSchema = new mongoose.Schema({
  name: String,
  dob: Date,
  location: String,
  email: String,
  password: String,
  govtImage: Buffer,
  selfieImage: Buffer,
  blockchainAddress: String,
  createdAt: {
    type: Date,
    default: Date.now,
  },
  coordinates: {
    lat: Number,
    lng: Number,
  },
});

// Encrypt the sensitive fields
userSchema.plugin(encrypt, {
  encryptionKey: encKey,
  signingKey: sigKey,
  encryptedFields: [
    "name",
    "dob",
    "location",
    "password", // KEEP encrypted
    "govtImage",
    "selfieImage",
    "blockchainAddress",
    "createdAt",
    "coordinates"
    // "email" ❌ REMOVE this
  ]
});


module.exports = mongoose.model("User", userSchema); 
