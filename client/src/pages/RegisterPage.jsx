import { useState } from "react";
import api from "../api/axios";
import "./RegisterPage.css";

const SKILLS = [
  "Teaching", "Mentoring", "Fundraising", "Event Management",
  "Graphic Design", "Social Media", "Content Writing", "Programming",
  "Medical Aid", "Legal Aid", "Translation", "Photography",
];

const AREAS = [
  "Education", "Environment", "Healthcare", "Animal Welfare",
  "Elderly Care", "Women Empowerment", "Child Welfare", "Disaster Relief",
];

const AVAILABILITY = ["Weekdays", "Weekends", "Both", "Flexible"];

const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const PHONE_REGEX = /^\d{10}$/;

const INITIAL_FORM = {
  name: "",
  email: "",
  phone: "",
  skills: [],
  areaOfInterest: "",
  availability: "",
};

export default function RegisterPage() {
  const [form, setForm] = useState(INITIAL_FORM);
  const [errors, setErrors] = useState({});
  const [isLoading, setIsLoading] = useState(false);
  const [successMsg, setSuccessMsg] = useState("");
  const [generalError, setGeneralError] = useState("");

  // ── Handlers ────────────────────────────────────────────────────────────────
  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
    // Clear field error on change
    if (errors[name]) setErrors((prev) => ({ ...prev, [name]: "" }));
  };

  const handleSkillToggle = (skill) => {
    setForm((prev) => {
      const already = prev.skills.includes(skill);
      const updated = already
        ? prev.skills.filter((s) => s !== skill)
        : [...prev.skills, skill];
      return { ...prev, skills: updated };
    });
    if (errors.skills) setErrors((prev) => ({ ...prev, skills: "" }));
  };

  // ── Validation ───────────────────────────────────────────────────────────────
  const validate = () => {
    const newErrors = {};
    if (!form.name.trim()) newErrors.name = "Full name is required";
    if (!form.email.trim()) {
      newErrors.email = "Email address is required";
    } else if (!EMAIL_REGEX.test(form.email.trim())) {
      newErrors.email = "Please enter a valid email address";
    }
    if (!form.phone.trim()) {
      newErrors.phone = "Phone number is required";
    } else if (!PHONE_REGEX.test(form.phone.trim())) {
      newErrors.phone = "Phone number must be exactly 10 digits";
    }
    if (form.skills.length === 0) {
      newErrors.skills = "Please select at least one skill";
    }
    if (!form.areaOfInterest) {
      newErrors.areaOfInterest = "Please select an area of interest";
    }
    if (!form.availability) {
      newErrors.availability = "Please select your availability";
    }
    return newErrors;
  };

  // ── Submit ───────────────────────────────────────────────────────────────────
  const handleSubmit = async (e) => {
    e.preventDefault();
    setSuccessMsg("");
    setGeneralError("");

    const validationErrors = validate();
    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors);
      // Scroll to first error
      const firstErrorKey = Object.keys(validationErrors)[0];
      const el = document.getElementById(`field-${firstErrorKey}`);
      if (el) el.scrollIntoView({ behavior: "smooth", block: "center" });
      return;
    }

    setIsLoading(true);
    try {
      await api.post("/api/volunteers", {
        name: form.name.trim(),
        email: form.email.trim(),
        phone: form.phone.trim(),
        skills: form.skills,
        areaOfInterest: form.areaOfInterest,
        availability: form.availability,
      });

      setSuccessMsg("Thank you for registering! We will get in touch with you soon.");
      setForm(INITIAL_FORM);
      setErrors({});
      window.scrollTo({ top: 0, behavior: "smooth" });
    } catch (err) {
      if (err.response?.status === 409) {
        setErrors({ email: "This email is already registered" });
        const el = document.getElementById("field-email");
        if (el) el.scrollIntoView({ behavior: "smooth", block: "center" });
      } else {
        setGeneralError("Something went wrong. Please try again.");
      }
    } finally {
      setIsLoading(false);
    }
  };

  // ── Render ───────────────────────────────────────────────────────────────────
  return (
    <main className="register-page" id="main-content">
      <div className="form-wrapper">

        {/* Success Banner */}
        {successMsg && (
          <div className="banner banner--success" role="alert" aria-live="polite">
            <span className="banner-icon">✅</span>
            <p>{successMsg}</p>
          </div>
        )}

        {/* Error Banner */}
        {generalError && (
          <div className="banner banner--error" role="alert" aria-live="polite">
            <span className="banner-icon">⚠️</span>
            <p>{generalError}</p>
          </div>
        )}

        <div className="form-card">
          {/* Card Header */}
          <div className="card-header">
            <div className="card-header-icon" aria-hidden="true">🤝</div>
            <h1 className="card-title">Volunteer Registration</h1>
            <p className="card-subtitle">
              Join NayePankh Foundation and help us make a difference in lives across India.
            </p>
          </div>

          {/* Form Body */}
          <form className="form-body" onSubmit={handleSubmit} noValidate>

            {/* Full Name */}
            <div className="form-group" id="field-name">
              <label className="form-label" htmlFor="name">
                Full Name <span className="required-star">*</span>
              </label>
              <input
                id="name"
                name="name"
                type="text"
                className={`form-input${errors.name ? " form-input--error" : ""}`}
                placeholder="e.g. Priya Sharma"
                value={form.name}
                onChange={handleChange}
                autoComplete="name"
                aria-describedby={errors.name ? "name-error" : undefined}
              />
              {errors.name && (
                <p className="field-error" id="name-error" role="alert">{errors.name}</p>
              )}
            </div>

            {/* Email */}
            <div className="form-group" id="field-email">
              <label className="form-label" htmlFor="email">
                Email Address <span className="required-star">*</span>
              </label>
              <input
                id="email"
                name="email"
                type="email"
                className={`form-input${errors.email ? " form-input--error" : ""}`}
                placeholder="e.g. priya@example.com"
                value={form.email}
                onChange={handleChange}
                autoComplete="email"
                aria-describedby={errors.email ? "email-error" : undefined}
              />
              {errors.email && (
                <p className="field-error" id="email-error" role="alert">{errors.email}</p>
              )}
            </div>

            {/* Phone */}
            <div className="form-group" id="field-phone">
              <label className="form-label" htmlFor="phone">
                Phone Number <span className="required-star">*</span>
              </label>
              <input
                id="phone"
                name="phone"
                type="tel"
                className={`form-input${errors.phone ? " form-input--error" : ""}`}
                placeholder="10-digit mobile number"
                value={form.phone}
                onChange={handleChange}
                maxLength={10}
                autoComplete="tel"
                aria-describedby={errors.phone ? "phone-error" : undefined}
              />
              {errors.phone && (
                <p className="field-error" id="phone-error" role="alert">{errors.phone}</p>
              )}
            </div>

            {/* Skills */}
            <div className="form-group" id="field-skills">
              <label className="form-label">
                Skills <span className="required-star">*</span>
                <span className="form-label-hint"> — select all that apply</span>
              </label>
              <div
                className={`skills-grid${errors.skills ? " skills-grid--error" : ""}`}
                role="group"
                aria-label="Select your skills"
              >
                {SKILLS.map((skill) => {
                  const checked = form.skills.includes(skill);
                  return (
                    <label
                      key={skill}
                      className={`skill-pill${checked ? " skill-pill--checked" : ""}`}
                    >
                      <input
                        type="checkbox"
                        className="visually-hidden"
                        value={skill}
                        checked={checked}
                        onChange={() => handleSkillToggle(skill)}
                        aria-label={skill}
                      />
                      <span className="skill-pill-check" aria-hidden="true">
                        {checked ? "✓" : ""}
                      </span>
                      {skill}
                    </label>
                  );
                })}
              </div>
              {errors.skills && (
                <p className="field-error" role="alert">{errors.skills}</p>
              )}
            </div>

            {/* Area of Interest */}
            <div className="form-group" id="field-areaOfInterest">
              <label className="form-label" htmlFor="areaOfInterest">
                Area of Interest <span className="required-star">*</span>
              </label>
              <div className="select-wrapper">
                <select
                  id="areaOfInterest"
                  name="areaOfInterest"
                  className={`form-select${errors.areaOfInterest ? " form-input--error" : ""}`}
                  value={form.areaOfInterest}
                  onChange={handleChange}
                  aria-describedby={errors.areaOfInterest ? "area-error" : undefined}
                >
                  <option value="">Select an area...</option>
                  {AREAS.map((area) => (
                    <option key={area} value={area}>{area}</option>
                  ))}
                </select>
                <span className="select-arrow" aria-hidden="true">▾</span>
              </div>
              {errors.areaOfInterest && (
                <p className="field-error" id="area-error" role="alert">{errors.areaOfInterest}</p>
              )}
            </div>

            {/* Availability */}
            <div className="form-group" id="field-availability">
              <label className="form-label">
                Availability <span className="required-star">*</span>
              </label>
              <div
                className={`radio-group${errors.availability ? " radio-group--error" : ""}`}
                role="radiogroup"
                aria-label="Select your availability"
              >
                {AVAILABILITY.map((option) => (
                  <label
                    key={option}
                    className={`radio-option${form.availability === option ? " radio-option--checked" : ""}`}
                  >
                    <input
                      type="radio"
                      name="availability"
                      value={option}
                      checked={form.availability === option}
                      onChange={handleChange}
                      className="visually-hidden"
                      aria-label={option}
                    />
                    <span className="radio-circle" aria-hidden="true" />
                    {option}
                  </label>
                ))}
              </div>
              {errors.availability && (
                <p className="field-error" role="alert">{errors.availability}</p>
              )}
            </div>

            {/* Submit */}
            <button
              id="submit-btn"
              type="submit"
              className="submit-btn"
              disabled={isLoading}
              aria-busy={isLoading}
            >
              {isLoading ? (
                <>
                  <span className="spinner" aria-hidden="true" />
                  Submitting...
                </>
              ) : (
                "Register as Volunteer"
              )}
            </button>
          </form>
        </div>

        <p className="form-footer">
          Already a volunteer? Our team will reach out to you. ❤️
        </p>
      </div>
    </main>
  );
}
