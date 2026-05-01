const express = require("express");
const authMiddleware = require("../middleware/authMiddleware");
const {
    signup,
    verifySignupOtp,
    login,
    checkEmail,
    googleAuth,
    githubCallback,
    forgotPassword,
    verifyResetOtp,
    resetPassword,
    setPassword,
    updatePassword,
    deleteAccount
} = require("../controllers/authController");

const router = express.Router();


// Routes
router.post("/signup", signup);
router.post("/verify-signup-otp", verifySignupOtp);
router.post("/login", login);
router.post("/check-email", checkEmail);
router.post("/google", googleAuth);
router.get("/github/callback", githubCallback);
router.post("/forgot-password", forgotPassword);
router.post("/verify-reset-otp", verifyResetOtp);
router.post("/reset-password", resetPassword);
router.post("/set-password", authMiddleware, setPassword);
router.put("/update-password", authMiddleware, updatePassword);
router.delete("/delete-account", authMiddleware, deleteAccount);

module.exports = router;