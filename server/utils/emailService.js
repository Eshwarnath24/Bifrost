const nodemailer = require("nodemailer");
const path = require("path");

let transporter = null;

/**
 * Get or create the Nodemailer transporter (lazy init so env vars are loaded).
 * Validates that required environment variables are present.
 */
const getTransporter = () => {
    if (transporter) return transporter;

    const emailUser = process.env.EMAIL_USER;
    const emailPass = process.env.EMAIL_PASSWORD;

    if (!emailUser || !emailPass) {
        throw new Error(
            "Email service not configured. Set EMAIL_USER and EMAIL_PASSWORD in .env. " +
            "For Gmail, use a 16-character App Password (not your regular password). " +
            "See: https://myaccount.google.com/apppasswords"
        );
    }

    transporter = nodemailer.createTransport({
        service: "gmail",
        auth: {
            user: emailUser,
            pass: emailPass
        }
    });

    return transporter;
};

/**
 * Send an OTP email with a styled HTML template.
 * Throws if email delivery fails — signup/reset will not proceed.
 * @param {string} to - recipient email
 * @param {string} otp - the 4-digit OTP code
 * @param {"signup"|"reset"} purpose
 */
const sendOtpEmail = async (to, otp, purpose = "signup") => {
    const subject = purpose === "signup"
        ? "Bifrost — Verify Your Email"
        : "Bifrost — Password Reset Code";

    const heading = purpose === "signup"
        ? "Verify Your Email"
        : "Reset Your Password";

    const message = purpose === "signup"
        ? "Use the code below to complete your Bifrost account setup."
        : "Use the code below to reset your Bifrost account password.";

    const html = `
    <div style="font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; max-width: 480px; margin: 0 auto; background: #0f172a; border-radius: 16px; overflow: hidden; border: 1px solid #1e293b;">
      <div style="background: linear-gradient(135deg, #6366f1, #a855f7, #ec4899); padding: 32px 24px; text-align: center;">
        <img src="cid:bifrost-logo" alt="Bifrost" width="48" height="48" style="display: inline-block; vertical-align: middle; margin-right: 12px; border-radius: 12px;" />
        <h1 style="color: #fff; margin: 0; font-size: 28px; font-weight: 800; letter-spacing: -0.5px; display: inline-block; vertical-align: middle;">Bifrost</h1>
      </div>
      <div style="padding: 32px 24px; text-align: center;">
        <h2 style="color: #e2e8f0; margin: 0 0 8px; font-size: 22px; font-weight: 700;">${heading}</h2>
        <p style="color: #94a3b8; margin: 0 0 24px; font-size: 14px; line-height: 1.6;">${message}</p>
        <div style="background: #1e293b; border-radius: 12px; padding: 20px; display: inline-block; border: 1px solid #334155;">
          <span style="font-size: 36px; font-weight: 800; letter-spacing: 12px; color: #a5b4fc; font-family: monospace;">${otp}</span>
        </div>
        <p style="color: #64748b; margin: 24px 0 0; font-size: 12px;">This code expires in <strong style="color: #94a3b8;">5 minutes</strong>.</p>
        <p style="color: #475569; margin: 16px 0 0; font-size: 11px;">If you didn't request this, you can safely ignore this email.</p>
      </div>
    </div>`;

    try {
        await getTransporter().sendMail({
            from: `"Bifrost" <${process.env.EMAIL_USER}>`,
            to,
            subject,
            html,
            attachments: [{
                filename: "logo.png",
                path: path.join(__dirname, "..", "assets", "logo.png"),
                cid: "bifrost-logo"
            }]
        });
    } catch (error) {
        // Log the raw error for debugging
        console.error("[EmailService] Raw SMTP error:", error.message);
        console.error("[EmailService] Error code:", error.code);
        console.error("[EmailService] Error command:", error.command);
        const msg = error.message || "";

        if (msg.includes("Invalid login") || msg.includes("PLAIN") || msg.includes("Username and Password not accepted")) {
            transporter = null; // Reset so new credentials are picked up on next attempt
            throw new Error(
                "Gmail authentication failed. Your EMAIL_PASSWORD must be a 16-character App Password, " +
                "not your regular Gmail password. Generate one at: https://myaccount.google.com/apppasswords"
            );
        }

        if (msg.includes("self signed certificate") || msg.includes("ECONNREFUSED")) {
            throw new Error("Cannot connect to Gmail SMTP server. Check your network/firewall.");
        }

        throw error;
    }
};

module.exports = { sendOtpEmail };
