const jwt = require("jsonwebtoken");

const SEVEN_DAYS_MS = 7 * 24 * 60 * 60 * 1000;

// ── GET /api/auth/google/callback — called after passport verifies ─────────────
const googleCallback = (req, res) => {
  // req.user is false if Google account is not the admin
  if (!req.user) {
    return res.redirect(
      `${process.env.CLIENT_URL}/admin/login?error=unauthorized`
    );
  }

  const token = jwt.sign(
    { email: req.user.email, name: req.user.name },
    process.env.JWT_SECRET,
    { expiresIn: "7d" }
  );

  res.cookie("token", token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",       // set to true in production (HTTPS)
    sameSite: "lax",
    maxAge: SEVEN_DAYS_MS,
  });

  return res.redirect(`${process.env.CLIENT_URL}/admin/dashboard`);
};

// ── GET /api/auth/logout — clear cookie ───────────────────────────────────────
const logout = (req, res) => {
  res.clearCookie("token");
  return res.status(200).json({ message: "Logged out" });
};

// ── GET /api/auth/me — return current admin from token ────────────────────────
const getMe = (req, res) => {
  return res.status(200).json({ admin: req.admin });
};

module.exports = { googleCallback, logout, getMe };
