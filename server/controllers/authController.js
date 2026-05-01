const { OAuth2Client } = require("google-auth-library");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const User = require("../models/User");
const Otp = require("../models/Otp");
const axios = require("axios");
const { sendOtpEmail } = require("../utils/emailService");

const client = new OAuth2Client(process.env.GOOGLE_CLIENT_ID);

const normalizeEmail = (email) => (typeof email === "string" ? email.trim().toLowerCase() : "");
const sanitizeName = (name) => (typeof name === "string" ? name.trim() : "");
const OTP_MAX_ATTEMPTS = 5;

const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;

const isValidEmail = (email) => emailRegex.test(email);

const isValidOtpCode = (otp) => typeof otp === "string" && /^\d{4}$/.test(otp.trim());

const generateOtp = () => {
    return Math.floor(1000 + Math.random() * 9000).toString();
};


// ======================
// CHECK EMAIL (verify if email is registered)
// ======================
exports.checkEmail = async (req, res) => {
    try {
        const { email } = req.body;
        const normalizedEmail = normalizeEmail(email);

        if (!normalizedEmail) {
            return res.status(400).json({ message: "Email is required" });
        }

        if (!isValidEmail(normalizedEmail)) {
            return res.status(400).json({ message: "Please enter a valid email address" });
        }

        const user = await User.findOne({ email: normalizedEmail });

        res.json({
            exists: !!user,
            provider: user ? user.provider : null
        });

    } catch (error) {
        console.error("Check email error:", error.message);
        res.status(500).json({ message: "Server error" });
    }
};


// ======================
// SIGNUP (sends OTP, does NOT create user yet)
// ======================
exports.signup = async (req, res) => {
    try {
        const { name, email, password } = req.body;
        const normalizedEmail = normalizeEmail(email);
        const trimmedName = sanitizeName(name);

        if (!normalizedEmail || typeof password !== "string" || !password.trim()) {
            return res.status(400).json({ message: "Email and password required" });
        }

        if (!isValidEmail(normalizedEmail)) {
            return res.status(400).json({ message: "Please enter a valid email address" });
        }

        if (password.trim().length < 8) {
            return res.status(400).json({ message: "Password must be at least 8 characters" });
        }

        const existingUser = await User.findOne({ email: normalizedEmail });
        if (existingUser) {
            return res.status(400).json({ message: "User already exists" });
        }

        // Hash password for storage in OTP record
        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(password, salt);

        // Generate and hash OTP
        const otpCode = generateOtp();
        const hashedOtp = await bcrypt.hash(otpCode, salt);

        // Remove any existing signup OTPs for this email
        await Otp.deleteMany({ email: normalizedEmail, purpose: "signup" });

        // Store OTP with pending user data
        await Otp.create({
            email: normalizedEmail,
            otp: hashedOtp,
            purpose: "signup",
            userData: {
                name: trimmedName,
                hashedPassword
            }
        });

        // Send OTP email
        await sendOtpEmail(normalizedEmail, otpCode, "signup");

        res.status(200).json({
            message: "OTP sent to your email. Please verify to complete signup.",
            email: normalizedEmail
        });

    } catch (error) {
        console.error("Signup error:", error.message);

        // Clean up the OTP record on any email-related failure
        const normalizedEmailCleanup = normalizeEmail(req.body.email);
        await Otp.deleteMany({ email: normalizedEmailCleanup, purpose: "signup" }).catch(() => {});

        // Surface actionable error messages from the email service
        if (error.message && (
            error.message.includes("Invalid login") ||
            error.message.includes("PLAIN") ||
            error.message.includes("SMTP") ||
            error.message.includes("App Password") ||
            error.message.includes("Email service not configured") ||
            error.message.includes("Username and Password not accepted")
        )) {
            return res.status(500).json({ message: "Unable to send verification email. Please try again later." });
        }

        res.status(500).json({ message: "Server error" });
    }
};


// ======================
// VERIFY SIGNUP OTP (creates user after OTP verification)
// ======================
exports.verifySignupOtp = async (req, res) => {
    try {
        const { email, otp } = req.body;
        const normalizedEmail = normalizeEmail(email);

        if (!normalizedEmail || !otp) {
            return res.status(400).json({ message: "Email and OTP required" });
        }

        if (!isValidOtpCode(otp)) {
            return res.status(400).json({ message: "OTP must be a 4-digit code" });
        }

        // Find the OTP record
        const otpRecord = await Otp.findOne({ email: normalizedEmail, purpose: "signup" });

        if (!otpRecord) {
            return res.status(400).json({ message: "OTP expired or not found. Please sign up again." });
        }

        if (otpRecord.attempts >= OTP_MAX_ATTEMPTS) {
            await Otp.deleteMany({ email: normalizedEmail, purpose: "signup" });
            return res.status(429).json({ message: "Too many invalid OTP attempts. Please sign up again." });
        }

        // Verify OTP
        const isMatch = await bcrypt.compare(otp, otpRecord.otp);
        if (!isMatch) {
            await Otp.updateOne(
                { _id: otpRecord._id },
                { $inc: { attempts: 1 } }
            );
            return res.status(400).json({ message: "Invalid OTP" });
        }

        // Check if user was created in the meantime (race condition guard)
        const existingUser = await User.findOne({ email: normalizedEmail });
        if (existingUser) {
            await Otp.deleteMany({ email: normalizedEmail, purpose: "signup" });
            return res.status(400).json({ message: "User already exists" });
        }

        // Create user from stored data
        const user = await User.create({
            name: otpRecord.userData.name,
            email: normalizedEmail,
            password: otpRecord.userData.hashedPassword,
            provider: "local"
        });

        // Clean up OTP
        await Otp.deleteMany({ email: normalizedEmail, purpose: "signup" });

        // Generate JWT
        if (!process.env.JWT_SECRET) {
            return res.status(500).json({ message: "Authentication service misconfigured" });
        }

        const token = jwt.sign(
            { id: user._id },
            process.env.JWT_SECRET,
            { expiresIn: "1d" }
        );

        res.status(201).json({
            message: "Account created successfully",
            token,
            user: {
                id: user._id,
                name: user.name,
                email: user.email
            }
        });

    } catch (error) {
        console.error("Verify signup OTP error:", error.message);
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
// FORGOT PASSWORD (sends OTP)
// ======================
exports.forgotPassword = async (req, res) => {
    try {
        const { email } = req.body;
        const normalizedEmail = normalizeEmail(email);

        if (!normalizedEmail) {
            return res.status(400).json({ message: "Email is required" });
        }

        if (!isValidEmail(normalizedEmail)) {
            return res.status(400).json({ message: "Please enter a valid email address" });
        }

        // Check if user exists
        const user = await User.findOne({ email: normalizedEmail });
        if (!user) {
            return res.status(400).json({ message: "No account found with this email" });
        }

        // Generate and hash OTP
        const otpCode = generateOtp();
        const salt = await bcrypt.genSalt(10);
        const hashedOtp = await bcrypt.hash(otpCode, salt);

        // Remove any existing reset OTPs for this email
        await Otp.deleteMany({ email: normalizedEmail, purpose: "reset" });

        // Store OTP
        await Otp.create({
            email: normalizedEmail,
            otp: hashedOtp,
            purpose: "reset"
        });

        // Send OTP email
        await sendOtpEmail(normalizedEmail, otpCode, "reset");

        res.json({
            message: "OTP sent to your email",
            email: normalizedEmail
        });

    } catch (error) {
        console.error("Forgot password error:", error.message);

        // Clean up OTP record on email failure
        const normalizedEmailCleanup = normalizeEmail(req.body.email);
        await Otp.deleteMany({ email: normalizedEmailCleanup, purpose: "reset" }).catch(() => {});

        // Surface actionable error messages from the email service
        if (error.message && (
            error.message.includes("Invalid login") ||
            error.message.includes("PLAIN") ||
            error.message.includes("SMTP") ||
            error.message.includes("App Password") ||
            error.message.includes("Email service not configured") ||
            error.message.includes("Username and Password not accepted") ||
            error.message.includes("Gmail authentication failed")
        )) {
            return res.status(500).json({ message: "Unable to send OTP email. Please check email service configuration and try again." });
        }

        res.status(500).json({ message: "Server error" });
    }
};


// ======================
// VERIFY RESET OTP (returns a short-lived reset token)
// ======================
exports.verifyResetOtp = async (req, res) => {
    try {
        const { email, otp } = req.body;
        const normalizedEmail = normalizeEmail(email);

        if (!normalizedEmail || !otp) {
            return res.status(400).json({ message: "Email and OTP required" });
        }

        if (!isValidOtpCode(otp)) {
            return res.status(400).json({ message: "OTP must be a 4-digit code" });
        }

        const otpRecord = await Otp.findOne({ email: normalizedEmail, purpose: "reset" });

        if (!otpRecord) {
            return res.status(400).json({ message: "OTP expired or not found. Please request a new one." });
        }

        if (otpRecord.attempts >= OTP_MAX_ATTEMPTS) {
            await Otp.deleteMany({ email: normalizedEmail, purpose: "reset" });
            return res.status(429).json({ message: "Too many invalid OTP attempts. Please request a new OTP." });
        }

        const isMatch = await bcrypt.compare(otp, otpRecord.otp);
        if (!isMatch) {
            await Otp.updateOne(
                { _id: otpRecord._id },
                { $inc: { attempts: 1 } }
            );
            return res.status(400).json({ message: "Invalid OTP" });
        }

        // Clean up OTP
        await Otp.deleteMany({ email: normalizedEmail, purpose: "reset" });

        // Generate a short-lived reset token (10 minutes)
        if (!process.env.JWT_SECRET) {
            return res.status(500).json({ message: "Authentication service misconfigured" });
        }

        const resetToken = jwt.sign(
            { email: normalizedEmail, purpose: "reset" },
            process.env.JWT_SECRET,
            { expiresIn: "10m" }
        );

        res.json({
            message: "OTP verified",
            resetToken
        });

    } catch (error) {
        console.error("Verify reset OTP error:", error.message);
        res.status(500).json({ message: "Server error" });
    }
};


// ======================
// RESET PASSWORD (uses reset token)
// ======================
exports.resetPassword = async (req, res) => {
    try {
        const { resetToken, newPassword } = req.body;

        if (!resetToken || !newPassword) {
            return res.status(400).json({ message: "Reset token and new password required" });
        }

        if (newPassword.length < 8) {
            return res.status(400).json({ message: "Password must be at least 8 characters" });
        }

        // Verify reset token
        let decoded;
        try {
            decoded = jwt.verify(resetToken, process.env.JWT_SECRET);
        } catch (err) {
            return res.status(400).json({ message: "Reset link expired. Please request a new OTP." });
        }

        if (decoded.purpose !== "reset" || !decoded.email) {
            return res.status(400).json({ message: "Invalid reset token" });
        }

        const user = await User.findOne({ email: decoded.email }).select("+password");
        if (!user) {
            return res.status(404).json({ message: "User not found" });
        }

        // Hash new password and save
        const salt = await bcrypt.genSalt(10);
        user.password = await bcrypt.hash(newPassword, salt);
        await user.save();

        res.json({ message: "Password reset successfully" });

    } catch (error) {
        console.error("Reset password error:", error.message);
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
        let user = await User.findOne({ email: normalizedEmail }).select("+password");
        let isNewUser = false;

        if (!user) {
            // Create new user
            user = await User.create({
                name: sanitizeName(name),
                email: normalizedEmail,
                provider: "google",
                providerId: googleId,
                avatar: picture
            });
            isNewUser = true;
        } else if (picture && !user.avatar) {
            // Keep the existing provider unchanged for local accounts.
            user.avatar = picture;
            await user.save();
        }

        // Check if user needs to set a password
        const needsPassword = !user.password;

        // Generate JWT
        const jwtToken = jwt.sign(
            { id: user._id },
            process.env.JWT_SECRET,
            { expiresIn: "1d" }
        );

        res.json({
            token: jwtToken,
            needsPassword,
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
// SET PASSWORD (for Google/social users who don't have a password yet)
// ======================

exports.setPassword = async (req, res) => {
    try {
        const { newPassword } = req.body;

        if (!newPassword || typeof newPassword !== "string") {
            return res.status(400).json({ message: "Password is required" });
        }

        if (newPassword.length < 8) {
            return res.status(400).json({ message: "Password must be at least 8 characters" });
        }

        const user = await User.findById(req.user.id).select("+password");

        if (!user) {
            return res.status(404).json({ message: "User not found" });
        }

        if (user.password) {
            return res.status(400).json({
                message: "Password already set. Use update password instead."
            });
        }

        // Hash and save the new password
        const salt = await bcrypt.genSalt(10);
        user.password = await bcrypt.hash(newPassword, salt);
        await user.save();

        res.json({ message: "Password created successfully" });

    } catch (error) {
        console.error("Set password error:", error.message);
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