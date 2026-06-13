const express = require("express");
const router = express.Router();

const protect = require("../middleware/auth");
const {
  registerVolunteer,
  getAllVolunteers,
  updateVolunteerStatus,
  exportCSV,
} = require("../controllers/volunteerController");

// Public
router.post("/", registerVolunteer);

// Protected — /export must come before /:id to avoid route shadowing
router.get("/export", protect, exportCSV);
router.get("/", protect, getAllVolunteers);
router.patch("/:id/status", protect, updateVolunteerStatus);

module.exports = router;
