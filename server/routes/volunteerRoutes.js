const express = require("express");
const router = express.Router();

const protect = require("../middleware/auth");
const {
  registerVolunteer,
  getAllVolunteers,
  updateVolunteerStatus,
  exportCSV,
  getVolunteerCount,
  getVolunteerStats,
  deleteVolunteer,
} = require("../controllers/volunteerController");

// Public
router.post("/", registerVolunteer);
router.get("/count", getVolunteerCount);

// Protected — /export and /stats must come before /:id to avoid route shadowing
router.get("/export", protect, exportCSV);
router.get("/stats", protect, getVolunteerStats);
router.get("/", protect, getAllVolunteers);
router.patch("/:id/status", protect, updateVolunteerStatus);
router.delete("/:id", protect, deleteVolunteer);

module.exports = router;
