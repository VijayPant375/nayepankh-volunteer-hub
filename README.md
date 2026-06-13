<div align="center">
  <h1>NayePankh Volunteer Hub</h1>
  <p>A full-stack Volunteer Registration & Management System built for NayePankh Foundation</p>

  <img src="https://img.shields.io/badge/React-18-61DAFB?style=flat-square&logo=react&logoColor=black" alt="React" />
  <img src="https://img.shields.io/badge/Vite-646CFF?style=flat-square&logo=vite&logoColor=white" alt="Vite" />
  <img src="https://img.shields.io/badge/Node.js-339933?style=flat-square&logo=nodedotjs&logoColor=white" alt="Node.js" />
  <img src="https://img.shields.io/badge/Express-000000?style=flat-square&logo=express&logoColor=white" alt="Express" />
  <img src="https://img.shields.io/badge/MongoDB-47A248?style=flat-square&logo=mongodb&logoColor=white" alt="MongoDB" />
  <img src="https://img.shields.io/badge/JWT-000000?style=flat-square&logo=jsonwebtokens&logoColor=white" alt="JWT" />
  <img src="https://img.shields.io/badge/Google_OAuth-4285F4?style=flat-square&logo=google&logoColor=white" alt="Google OAuth" />
  <img src="https://img.shields.io/badge/Render-46E3B7?style=flat-square&logo=render&logoColor=white" alt="Render" />
</div>

## Live Demo
- **Live URL:** [https://nayepankh-volunteer-hub.onrender.com](https://nayepankh-volunteer-hub.onrender.com)
- **Note:** Admin access is restricted to an authorized Gmail account. Contact the developer for a demo walkthrough.

## Overview
The NayePankh Volunteer Hub is a comprehensive web application designed to streamline the onboarding and management of volunteers for the NayePankh Foundation. It transitions the organization away from manual spreadsheets and disparate forms into a centralized, professional system where prospective volunteers can easily register, and administrators can efficiently review and organize applications.

What sets this system apart is its robust administrative security model utilizing Google OAuth 2.0 paired with `httpOnly` JWT cookies, eliminating the risks of local storage token theft or password leaks. Additionally, the admin dashboard offers real-time client-side filtering, CSV data exports, and live loading states, all served from a single unified Express and Vite production deployment.

## Features

### For Volunteers (Public):
- Registration form with validation
- Skills multi-select
- Duplicate email detection
- Mobile responsive
- Live volunteer counter

### For Admins (Protected):
- Google OAuth login
- Stats dashboard
- Search and filters
- Approve/reject/reset applicant statuses
- CSV export
- Skeleton loading states

## Tech Stack

| Layer | Technology | Purpose |
|-------|------------|---------|
| Frontend | React 18, React Router v6, Axios | UI and routing |
| Build Tool | Vite | Dev server and production build |
| Backend | Node.js, Express.js | REST API server |
| Database | MongoDB Atlas, Mongoose | Data persistence |
| Auth | Google OAuth 2.0, Passport.js, JWT | Secure admin authentication |
| Deployment | Render | Single-service deployment |

## Architecture
Express serves the React (Vite) build as static files so everything runs from one deployment. API routes are mounted at `/api/*`, while all other unmatched routes serve the `index.html` file, allowing React Router to handle client-side routing seamlessly.

## API Endpoints

**Public:**
```text
POST /api/volunteers         — register a volunteer
GET  /api/volunteers/count   — get total volunteer count
```

**Protected (admin JWT cookie required):**
```text
GET    /api/volunteers              — get all volunteers (filterable)
PATCH  /api/volunteers/:id/status   — update status
GET    /api/volunteers/export       — download CSV
GET    /api/auth/google             — initiate Google OAuth
GET    /api/auth/google/callback    — OAuth callback
GET    /api/auth/me                 — get current admin
GET    /api/auth/logout             — logout
```

## Local Setup

**Prerequisites:** Node.js v18+, MongoDB Atlas account, Google Cloud Console OAuth credentials

**Steps:**
1. Clone the repo
2. Run `npm run install-all` from the root directory
3. Copy `server/.env.example` to `server/.env` and fill in the values
4. Start backend: `cd server && npm run dev` (runs on port 5000)
5. Start frontend: `cd client && npm run dev` (runs on port 5173)
6. Visit `http://localhost:5173`

## Environment Variables

| Variable | Description | Example |
|----------|-------------|---------|
| `PORT` | Backend server port | `5000` |
| `MONGO_URI` | MongoDB connection string | `mongodb+srv://...` |
| `JWT_SECRET` | Secret key for signing tokens | `supersecretkey123` |
| `GOOGLE_CLIENT_ID` | OAuth Client ID from GCP | `12345...apps.googleusercontent.com` |
| `GOOGLE_CLIENT_SECRET` | OAuth Client Secret from GCP | `GOCSPX-...` |
| `GOOGLE_CALLBACK_URL` | OAuth redirect URI | `http://localhost:5000/api/auth/google/callback` |
| `ADMIN_EMAIL` | Allowed admin Gmail address | `admin@gmail.com` |
| `CLIENT_URL` | Frontend URL | `http://localhost:5173` |

## Project Structure
```text
nayepankh-volunteer-hub/
├── client/
│   ├── src/
│   │   ├── api/          # Axios instance
│   │   ├── components/   # Navbar, ProtectedRoute
│   │   ├── context/      # AuthContext
│   │   └── pages/        # RegisterPage, AdminLogin, AdminDashboard
│   └── vite.config.js
├── server/
│   ├── config/           # DB and Passport config
│   ├── controllers/      # Route handlers
│   ├── middleware/       # JWT auth middleware
│   ├── models/           # Mongoose schemas
│   └── routes/           # Express routers
├── package.json          # Root build and start scripts
└── README.md
```

## What I'd Add Next
- Email notifications to volunteers on approval/rejection
- Volunteer login portal to track application status
- Analytics charts (registrations over time, area distribution)
- Bulk approve/reject actions
- Pagination for large volunteer lists

<div align="center">
  <p>Built with ❤️ by <a href="https://github.com/VijayPant375">VijayPant375</a></p>
  <p>⭐ Star this repo if you find it useful!</p>
</div>
