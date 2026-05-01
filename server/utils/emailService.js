const nodemailer = require("nodemailer");

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
        <img src="data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHZpZXdCb3g9IjAgMCAxMjAgMTIwIiB3aWR0aD0iMTIwIiBoZWlnaHQ9IjEyMCI+DQogIDxkZWZzPg0KICAgIDxsaW5lYXJHcmFkaWVudCBpZD0ibG9nb0dyYWRpZW50IiB4MT0iMCUiIHkxPSIwJSIgeDI9IjEwMCUiIHkyPSIxMDAlIj4NCiAgICAgIDxzdG9wIG9mZnNldD0iMCUiIHN0eWxlPSJzdG9wLWNvbG9yOiMwYWMyZjI7c3RvcC1vcGFjaXR5OjEiIC8+DQogICAgICA8c3RvcCBvZmZzZXQ9IjQ1JSIgc3R5bGU9InN0b3AtY29sb3I6IzNhNTBlNTtzdG9wLW9wYWNpdHk6MSIgLz4NCiAgICAgIDxzdG9wIG9mZnNldD0iMTAwJSIgc3R5bGU9InN0b3AtY29sb3I6I2E4MTdkNjtzdG9wLW9wYWNpdHk6MSIgLz4NCiAgICA8L2xpbmVhckdyYWRpZW50Pg0KICA8L2RlZnM+DQogIA0KICA8IS0tIEJhY2tncm91bmQgcm91bmRlZCBzcXVhcmUgKHNxdWlyY2xlKSAtLT4NCiAgPHJlY3QgeD0iMCIgeT0iMCIgd2lkdGg9IjEyMCIgaGVpZ2h0PSIxMjAiIHJ4PSIzMiIgcnk9IjMyIiBmaWxsPSJ1cmwoI2xvZ29HcmFkaWVudCkiIHN0eWxlPSJmaWx0ZXI6IGRyb3Atc2hhZG93KDAgOHB4IDE2cHggcmdiYSg1OCwgODAsIDIyOSwgMC4yKSkiLz4NCiAgDQogIDwhLS0gSG9sbG93IGRpYW1vbmQgc2hhcGUgKHJvdGF0ZWQgc3F1YXJlIHdpdGggcm91bmRlZCBjb3JuZXJzKSAtLT4NCiAgPGcgdHJhbnNmb3JtPSJ0cmFuc2xhdGUoNjAsIDYwKSI+DQogICAgPHJlY3QgeD0iLTI0IiB5PSItMjQiIHdpZHRoPSI0OCIgaGVpZ2h0PSI0OCIgcng9IjEyIiByeT0iMTIiIGZpbGw9Im5vbmUiIHN0cm9rZT0iI2ZmZmZmZiIgc3Ryb2tlLXdpZHRoPSI0LjUiIHRyYW5zZm9ybT0icm90YXRlKDQ1KSIgLz4NCiAgPC9nPg0KICANCiAgPCEtLSBJbm5lciBzb2xpZCB3aGl0ZSBkb3QgLS0+DQogIDxjaXJjbGUgY3g9IjYwIiBjeT0iNjAiIHI9IjgiIGZpbGw9IiNmZmZmZmYiLz4NCjwvc3ZnPg==" alt="Bifrost" width="48" height="48" style="display: inline-block; vertical-align: middle; margin-right: 12px; border-radius: 12px;" />
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
            html
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
