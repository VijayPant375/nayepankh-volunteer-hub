const transporter = require("../config/mailer");

/**
 * Sends a status notification email to a volunteer.
 *
 * @param {{ to: string, name: string, status: "approved" | "rejected" }} options
 * @returns {Promise<void>}  Resolves when mail is accepted by the SMTP relay.
 */
const sendVolunteerEmail = async ({ to, name, status }) => {
  if (!to) return; // guard — skip if email is missing

  const isApproved = status === "approved";

  const subject = isApproved
    ? "Your Volunteer Application – Approved ✅"
    : "Your Volunteer Application – Update";

  const accentColor  = isApproved ? "#10b981" : "#f59e0b";
  const bannerBg     = isApproved ? "#d1fae5" : "#fef3c7";
  const bannerColor  = isApproved ? "#065f46" : "#78350f";
  const bannerLabel  = isApproved ? "Application Approved" : "Application Update";

  const bodyContent = isApproved
    ? `
      <p style="margin:0 0 16px">We are thrilled to welcome you to the <strong>NayePankh Foundation</strong> volunteer family! Your application has been reviewed and <strong>approved</strong>.</p>
      <p style="margin:0 0 16px">Here's what happens next:</p>
      <ul style="margin:0 0 16px;padding-left:20px;line-height:1.8">
        <li>Our team will reach out to you shortly with your first assignment details.</li>
        <li>Please keep an eye on this inbox for onboarding information.</li>
        <li>Feel free to reply to this email if you have any questions.</li>
      </ul>
      <p style="margin:0 0 16px">Together, we can make a difference. Thank you for choosing to give back! 🌱</p>
    `
    : `
      <p style="margin:0 0 16px">Thank you for your interest in volunteering with the <strong>NayePankh Foundation</strong>. After careful review, we are unable to move forward with your application at this time.</p>
      <p style="margin:0 0 16px">This decision does not reflect on your enthusiasm or commitment — we receive many applications and sometimes the fit isn't quite right for our current needs.</p>
      <p style="margin:0 0 16px">We warmly encourage you to:</p>
      <ul style="margin:0 0 16px;padding-left:20px;line-height:1.8">
        <li>Revisit our volunteer page in the future — new opportunities open regularly.</li>
        <li>Stay connected with our community on social media.</li>
        <li>Reapply whenever you feel ready — we'd love to hear from you again.</li>
      </ul>
      <p style="margin:0 0 16px">Thank you again for your willingness to contribute. Every act of goodwill matters. 🙏</p>
    `;

  const html = `
<!DOCTYPE html>
<html lang="en">
<head><meta charset="UTF-8"><meta name="viewport" content="width=device-width,initial-scale=1"></head>
<body style="margin:0;padding:0;background:#f4f7f6;font-family:Arial,Helvetica,sans-serif">
  <table width="100%" cellpadding="0" cellspacing="0" style="background:#f4f7f6;padding:40px 16px">
    <tr>
      <td align="center">
        <table width="600" cellpadding="0" cellspacing="0" style="max-width:600px;width:100%;background:#ffffff;border-radius:8px;overflow:hidden;box-shadow:0 2px 8px rgba(0,0,0,0.08)">

          <!-- Header -->
          <tr>
            <td style="background:${accentColor};padding:28px 32px;text-align:center">
              <h1 style="margin:0;color:#ffffff;font-size:1.4rem;font-weight:700;letter-spacing:0.5px">
                NayePankh Foundation
              </h1>
              <p style="margin:6px 0 0;color:rgba(255,255,255,0.85);font-size:0.9rem">
                Volunteer Management
              </p>
            </td>
          </tr>

          <!-- Status banner -->
          <tr>
            <td style="background:${bannerBg};padding:14px 32px;text-align:center">
              <span style="color:${bannerColor};font-weight:700;font-size:0.95rem;letter-spacing:0.3px">
                ${bannerLabel}
              </span>
            </td>
          </tr>

          <!-- Body -->
          <tr>
            <td style="padding:32px 32px 24px">
              <p style="margin:0 0 16px;font-size:1rem;color:#1a1a1a">
                Dear <strong>${name}</strong>,
              </p>
              <div style="font-size:0.95rem;color:#374151;line-height:1.7">
                ${bodyContent}
              </div>
            </td>
          </tr>

          <!-- Divider -->
          <tr>
            <td style="padding:0 32px"><hr style="border:none;border-top:1px solid #e5e7eb;margin:0"></td>
          </tr>

          <!-- Footer -->
          <tr>
            <td style="padding:20px 32px;text-align:center">
              <p style="margin:0;font-size:0.8rem;color:#9ca3af">
                This is an automated message from the NayePankh Foundation Volunteer Management System.<br>
                Please do not reply directly to this email.
              </p>
              <p style="margin:10px 0 0;font-size:0.8rem;color:#9ca3af">
                © ${new Date().getFullYear()} NayePankh Foundation
              </p>
            </td>
          </tr>

        </table>
      </td>
    </tr>
  </table>
</body>
</html>`;

  await transporter.sendMail({
    from: `"NayePankh Foundation" <${process.env.EMAIL_USER}>`,
    to,
    subject,
    html,
  });
};

module.exports = sendVolunteerEmail;
