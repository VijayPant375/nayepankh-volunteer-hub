const express = require("express");
const router = express.Router();

// Import configured passport (also registers the Google strategy)
const passport = require("../config/passport");
const protect = require("../middleware/auth");
const { googleCallback, logout, getMe } = require("../controllers/authController");


// ── Google OAuth flow ─────────────────────────────────────────────────────────
router.get(
  "/google",
  passport.authenticate("google", { scope: ["profile", "email"], session: false })
);

router.get(
  "/google/callback",
  passport.authenticate("google", { session: false, failureRedirect: "/" }),
  googleCallback
);

// ── Protected auth routes ─────────────────────────────────────────────────────
router.get("/logout", protect, logout);
router.get("/me", protect, getMe);

module.exports = router;
