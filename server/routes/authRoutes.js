const express = require("express");
const authMiddleware = require("../middleware/authMiddleware");
const { signup, login, googleAuth, githubCallback, updatePassword, deleteAccount } = require("../controllers/authController");

const router = express.Router();


// Routes
router.post("/signup", signup);
router.post("/login", login);
router.post("/google", googleAuth);
router.get("/github/callback", githubCallback);
router.put("/update-password", authMiddleware, updatePassword);
router.delete("/delete-account", authMiddleware, deleteAccount);

module.exports = router;