const { OAuth2Client } = require("google-auth-library");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const User = require("../models/User");
const axios = require("axios");

const client = new OAuth2Client(process.env.GOOGLE_CLIENT_ID);

const normalizeEmail = (email) => (typeof email === "string" ? email.trim().toLowerCase() : "");
const sanitizeName = (name) => (typeof name === "string" ? name.trim() : "");

// ======================
// SIGNUP
// ======================
exports.signup = async (req, res) => {
    try {
        const { name, email, password } = req.body;
        const normalizedEmail = normalizeEmail(email);
        const trimmedName = sanitizeName(name);

        if (!normalizedEmail || typeof password !== "string" || !password.trim()) {
            return res.status(400).json({ message: "Email and password required" });
        }

        if (password.trim().length < 8) {
            return res.status(400).json({ message: "Password must be at least 8 characters" });
        }

        const existingUser = await User.findOne({ email: normalizedEmail });
        if (existingUser) {
            return res.status(400).json({ message: "User already exists" });
        }

        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(password, salt);

        const user = await User.create({
            name: trimmedName,
            email: normalizedEmail,
            password: hashedPassword,
            provider: "local"
        });

        res.status(201).json({
            message: "Signup successful",
            user: {
                id: user._id,
                name: user.name,
                email: user.email
            }
        });

    } catch (error) {
        res.status(500).json({ message: "Server error" });
    }
};


// ======================
// LOGIN
// ======================
exports.login = async (req, res) => {
    try {
        const { email, password } = req.body;
        const normalizedEmail = normalizeEmail(email);

        if (!normalizedEmail || typeof password !== "string" || !password.trim()) {
            return res.status(400).json({ message: "Email and password required" });
        }

        const user = await User.findOne({ email: normalizedEmail }).select("+password");
        if (!user || !user.password) {
            return res.status(400).json({ message: "Invalid credentials" });
        }

        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) {
            return res.status(400).json({ message: "Invalid credentials" });
        }

        if (!process.env.JWT_SECRET) {
            return res.status(500).json({ message: "Authentication service misconfigured" });
        }

        const token = jwt.sign(
            { id: user._id },
            process.env.JWT_SECRET,
            { expiresIn: "1d" }
        );

        res.json({
            token,
            user: {
                id: user._id,
                name: user.name,
                email: user.email
            }
        });

    } catch (error) {
        res.status(500).json({ message: "Server error" });
    }
};


// ======================
// GOOGLE AUTH
// ======================
exports.googleAuth = async (req, res) => {
    try {
        const { token, idToken, credential } = req.body;
        const googleToken = token || idToken || credential;

        if (!googleToken || typeof googleToken !== "string") {
            return res.status(400).json({ message: "Token missing" });
        }

        if (!process.env.GOOGLE_CLIENT_ID) {
            return res.status(500).json({ message: "Google auth service misconfigured" });
        }

        if (!process.env.JWT_SECRET) {
            return res.status(500).json({ message: "Authentication service misconfigured" });
        }

        // Verify token with Google
        const ticket = await client.verifyIdToken({
            idToken: googleToken,
            audience: process.env.GOOGLE_CLIENT_ID
        });

        const payload = ticket.getPayload();
        if (!payload || !payload.email || !payload.sub) {
            return res.status(400).json({ message: "Invalid Google token payload" });
        }

        const {
            sub: googleId,
            email,
            name,
            picture
        } = payload;

        // Normalize email
        const normalizedEmail = normalizeEmail(email);

        if (!normalizedEmail) {
            return res.status(400).json({ message: "Invalid Google account email" });
        }

        // Check if user exists
        let user = await User.findOne({ email: normalizedEmail });

        if (!user) {
            // Create new user
            user = await User.create({
                name: sanitizeName(name),
                email: normalizedEmail,
                provider: "google",
                providerId: googleId,
                avatar: picture
            });
        } else if (user.provider === "local") {
            user.provider = "google";
            user.providerId = googleId;
            if (picture) {
                user.avatar = picture;
            }

            await user.save();
        }

        // Generate JWT
        const jwtToken = jwt.sign(
            { id: user._id },
            process.env.JWT_SECRET,
            { expiresIn: "1d" }
        );

        res.json({
            token: jwtToken,
            user: {
                id: user._id,
                name: user.name,
                email: user.email,
                avatar: user.avatar
            }
        });

    } catch (error) {
        if (error && (error.message || "").toLowerCase().includes("token")) {
            return res.status(400).json({ message: "Invalid Google ID token" });
        }

        if (error && error.message && error.message.includes("Wrong number of segments")) {
            return res.status(400).json({ message: "Google ID token required, not the client id" });
        }

        res.status(500).json({ message: "Google authentication failed" });
    }
};


// ======================
// GITHUB AUTH
// ======================

exports.githubCallback = async (req, res) => {
    try {
        const { code } = req.query;

        if (!code) {
            return res.status(400).json({ message: "Code missing" });
        }

        // 1. Exchange code for access token
        const tokenRes = await axios.post(
            "https://github.com/login/oauth/access_token",
            {
                client_id: process.env.GITHUB_CLIENT_ID,
                client_secret: process.env.GITHUB_CLIENT_SECRET,
                code
            },
            {
                headers: { Accept: "application/json" }
            }
        );

        const accessToken = tokenRes.data.access_token;

        // 2. Get GitHub user
        const userRes = await axios.get("https://api.github.com/user", {
            headers: {
                Authorization: `Bearer ${accessToken}`
            }
        });

        // 3. Get email
        const emailRes = await axios.get("https://api.github.com/user/emails", {
            headers: {
                Authorization: `Bearer ${accessToken}`
            }
        });

        const primaryEmail = emailRes.data.find(e => e.primary)?.email;

        if (!primaryEmail) {
            return res.status(400).json({ message: "Email not found" });
        }

        const normalizedEmail = primaryEmail.toLowerCase();

        // 4. Find or create user
        let user = await User.findOne({ email: normalizedEmail });

        if (!user) {
            user = await User.create({
                name: userRes.data.name || userRes.data.login,
                email: normalizedEmail,
                provider: "github",
                providerId: userRes.data.id.toString(),
                avatar: userRes.data.avatar_url
            });
        }

        // 5. Generate JWT
        const token = jwt.sign(
            { id: user._id },
            process.env.JWT_SECRET,
            { expiresIn: "1d" }
        );

        // 6. Redirect to frontend
        res.redirect(`${process.env.CLIENT_URL}/oauth-success?token=${token}`);

    } catch (error) {
        res.status(500).json({ message: "GitHub authentication failed" });
    }
};


// ======================
// UPDATE PASSWORD
// ======================

exports.updatePassword = async (req, res) => {
    try {
        const { currentPassword, newPassword } = req.body;

        if (!currentPassword || !newPassword) {
            return res.status(400).json({ message: "All fields required" });
        }

        if (newPassword.length < 8) {
            return res.status(400).json({ message: "Password must be at least 8 characters" });
        }

        const user = await User.findById(req.user.id).select("+password");

        if (!user) {
            return res.status(404).json({ message: "User not found" });
        }

        if (user.provider !== "local") {
            return res.status(400).json({
                message: "Password update not allowed for social login users"
            });
        }

        const isMatch = await bcrypt.compare(currentPassword, user.password);

        if (!isMatch) {
            return res.status(400).json({ message: "Current password incorrect" });
        }

        const salt = await bcrypt.genSalt(10);
        user.password = await bcrypt.hash(newPassword, salt);

        await user.save();

        res.json({ message: "Password updated successfully" });

    } catch (error) {
        res.status(500).json({ message: "Server error" });
    }
};


// ======================
// DELETE ACCOUNT
// ======================

exports.deleteAccount = async (req, res) => {
    try {
        const user = await User.findByIdAndDelete(req.user.id);

        if (!user) {
            return res.status(404).json({ message: "User not found" });
        }

        res.json({ message: "Account deleted successfully" });

    } catch (error) {
        res.status(500).json({ message: "Server error" });
    }
};