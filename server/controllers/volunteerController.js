const { stringify } = require("csv-stringify");
const Volunteer = require("../models/Volunteer");
const sendVolunteerEmail = require("../utils/sendVolunteerEmail");

// ── POST / — Register a new volunteer (public) ────────────────────────────────
const registerVolunteer = async (req, res) => {
  try {
    const { name, email, phone, skills, areaOfInterest, availability } =
      req.body;

    // Validate all required fields are present
    if (!name || !email || !phone || !skills || !areaOfInterest || !availability) {
      return res.status(400).json({ message: "All fields are required" });
    }

    // Check for duplicate email
    const existing = await Volunteer.findOne({ email: email.toLowerCase().trim() });
    if (existing) {
      return res.status(409).json({ message: "Email already registered" });
    }

    const volunteer = await Volunteer.create({
      name,
      email,
      phone,
      skills,
      areaOfInterest,
      availability,
    });

    return res.status(201).json({ message: "Registered successfully", volunteer });
  } catch (error) {
    console.error("registerVolunteer error:", error);
    return res.status(500).json({ message: "Server error" });
  }
};

// ── GET / — Get all volunteers with optional filters + pagination (protected) ──
const getAllVolunteers = async (req, res) => {
  try {
    const { status, areaOfInterest, search } = req.query;
    const query = {};

    if (status) {
      query.status = status;
    }

    if (areaOfInterest) {
      query.areaOfInterest = areaOfInterest;
    }

    if (search) {
      query.$or = [
        { name: { $regex: search, $options: "i" } },
        { email: { $regex: search, $options: "i" } },
      ];
    }

    const page  = Math.max(1, parseInt(req.query.page,  10) || 1);
    const limit = Math.min(100, Math.max(1, parseInt(req.query.limit, 10) || 10));
    const skip  = (page - 1) * limit;

    const [volunteers, total] = await Promise.all([
      Volunteer.find(query).sort({ registeredAt: -1 }).skip(skip).limit(limit),
      Volunteer.countDocuments(query),
    ]);

    const totalPages = Math.ceil(total / limit);

    return res.status(200).json({ volunteers, total, page, totalPages });
  } catch (error) {
    console.error("getAllVolunteers error:", error);
    return res.status(500).json({ message: "Server error" });
  }
};

// ── PATCH /:id/status — Update volunteer status (protected) ───────────────────
const updateVolunteerStatus = async (req, res) => {
  try {
    const { id } = req.params;
    const { status } = req.body;

    const validStatuses = ["pending", "approved", "rejected"];
    if (!validStatuses.includes(status)) {
      return res.status(400).json({ message: "Invalid status value" });
    }

    const volunteer = await Volunteer.findById(id);
    if (!volunteer) {
      return res.status(404).json({ message: "Volunteer not found" });
    }

    volunteer.status = status;
    await volunteer.save();

    // Send email notification for approved / rejected (not for pending resets)
    let emailSent = false;
    if ((status === "approved" || status === "rejected") && volunteer.email) {
      await sendVolunteerEmail({ to: volunteer.email, name: volunteer.name, status });
      emailSent = true;
    }

    return res.status(200).json({ message: "Status updated", volunteer, emailSent });
  } catch (error) {
    console.error("updateVolunteerStatus error:", error);
    return res.status(500).json({ message: "Server error" });
  }
};

// ── GET /export — Export all volunteers as CSV (protected) ────────────────────
const exportCSV = async (req, res) => {
  try {
    const volunteers = await Volunteer.find({}).sort({ registeredAt: -1 });

    const rows = volunteers.map((v) => [
      v.name,
      v.email,
      v.phone,
      Array.isArray(v.skills) ? v.skills.join(", ") : v.skills,
      v.areaOfInterest,
      v.availability,
      v.status,
      v.registeredAt ? new Date(v.registeredAt).toISOString() : "",
    ]);

    res.setHeader("Content-Type", "text/csv");
    res.setHeader(
      "Content-Disposition",
      'attachment; filename="volunteers.csv"'
    );

    const stringifier = stringify({
      header: true,
      columns: [
        "Name",
        "Email",
        "Phone",
        "Skills",
        "Area of Interest",
        "Availability",
        "Status",
        "Registered At",
      ],
    });

    stringifier.pipe(res);
    rows.forEach((row) => stringifier.write(row));
    stringifier.end();
  } catch (error) {
    console.error("exportCSV error:", error);
    return res.status(500).json({ message: "Server error" });
  }
};

// ── GET /count — Get total volunteer count (public) ─────────────────────────
const getVolunteerCount = async (req, res) => {
  try {
    const count = await Volunteer.countDocuments({});
    return res.status(200).json({ count });
  } catch (error) {
    console.error("getVolunteerCount error:", error);
    return res.status(500).json({ message: "Server error" });
  }
};

// ── GET /stats — Return aggregate counts by status (protected) ───────────────
const getVolunteerStats = async (req, res) => {
  try {
    const results = await Volunteer.aggregate([
      {
        $group: {
          _id: "$status",
          count: { $sum: 1 },
        },
      },
    ]);

    const stats = { total: 0, pending: 0, approved: 0, rejected: 0 };
    results.forEach(({ _id, count }) => {
      if (_id in stats) stats[_id] = count;
      stats.total += count;
    });

    return res.status(200).json(stats);
  } catch (error) {
    console.error("getVolunteerStats error:", error);
    return res.status(500).json({ message: "Server error" });
  }
};

// ── DELETE /:id — Delete a volunteer record (protected) ─────────────────────
const deleteVolunteer = async (req, res) => {
  try {
    const { id } = req.params;
    const volunteer = await Volunteer.findByIdAndDelete(id);
    if (!volunteer) {
      return res.status(404).json({ message: "Volunteer not found" });
    }
    return res.status(200).json({ message: "Volunteer deleted" });
  } catch (error) {
    console.error("deleteVolunteer error:", error);
    return res.status(500).json({ message: "Server error" });
  }
};

module.exports = {
  registerVolunteer,
  getAllVolunteers,
  updateVolunteerStatus,
  exportCSV,
  getVolunteerCount,
  getVolunteerStats,
  deleteVolunteer,
};
