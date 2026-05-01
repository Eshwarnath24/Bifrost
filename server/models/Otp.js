const mongoose = require("mongoose");

const otpSchema = new mongoose.Schema({
    email: {
        type: String,
        required: true,
        lowercase: true,
        trim: true,
        index: true
    },

    otp: {
        type: String,
        required: true
    },

    attempts: {
        type: Number,
        default: 0,
        min: 0
    },

    purpose: {
        type: String,
        enum: ["signup", "reset"],
        required: true
    },

    // Stores pending user data for signup OTPs (name, hashedPassword)
    userData: {
        type: Object,
        default: null
    },

    createdAt: {
        type: Date,
        default: Date.now,
        expires: 300 // Auto-delete after 5 minutes
    }
});

module.exports = mongoose.model("Otp", otpSchema);
