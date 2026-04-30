const mongoose = require("mongoose");

const userSchema = new mongoose.Schema({
    name: {
        type: String,
        trim: true
    },

    email: {
        type: String,
        required: true,
        unique: true,
        lowercase: true,
        trim: true
    },

    password: {
        type: String,
        minlength: 8,
        select: false,
        required: function requiredPassword() {
            return this.provider === "local";
        }
    },

    provider: {
        type: String,
        enum: ["local", "google", "github", "linkedin"],
        default: "local"
    },

    providerId: {
        type: String
        // stores Google ID / GitHub ID / LinkedIn ID
    },

    avatar: {
        type: String
        // profile image (from OAuth)
    }

}, { timestamps: true });

module.exports = mongoose.model("User", userSchema);