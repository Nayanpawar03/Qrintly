# Qrintly

A QR-based print job management platform for print shops. Customers scan a QR code to upload files directly to the shop. Shop owners manage jobs from a dashboard — no more WhatsApp chaos.

---

## Tech Stack

**Backend** — Node.js, Express, MongoDB + Mongoose, JWT, Passport (Google OAuth), Cloudinary, Multer, node-cron

**Frontend** — React (Vite), Tailwind CSS v4, React Router, Axios, Lucide React

---

## Project Structure

```
Qrintly/
├── client/          # React frontend
│   ├── src/
│   │   ├── api/         # Axios API functions
│   │   ├── components/  # Reusable UI components
│   │   ├── context/     # Auth & Theme context
│   │   └── pages/       # All page components
│   └── .env
├── server/          # Express backend
│   ├── src/
│   │   ├── config/      # DB, Cloudinary, Passport
│   │   ├── controllers/ # Route handlers
│   │   ├── cron/        # Auto-delete job
│   │   ├── middleware/  # Auth, Upload
│   │   ├── models/      # Mongoose schemas
│   │   └── routes/      # API routes
│   └── .env
└── README.md
```

---

## Getting Started

### Prerequisites
- Node.js 18+
- MongoDB Atlas account
- Cloudinary account
- Google OAuth credentials (optional)

### 1. Clone the repo

```bash
git clone https://github.com/your-username/qrintly.git
cd qrintly
```

### 2. Backend setup

```bash
cd server
npm install
```

Create `server/.env`:

```env
PORT=5000
MONGO_URI=your_mongodb_connection_string
JWT_SECRET=your_jwt_secret
CLOUDINARY_CLOUD_NAME=your_cloud_name
CLOUDINARY_API_KEY=your_api_key
CLOUDINARY_API_SECRET=your_api_secret
CLIENT_URL=http://localhost:5173
GOOGLE_CLIENT_ID=your_google_client_id
GOOGLE_CLIENT_SECRET=your_google_client_secret
```

```bash
npm run dev
```

### 3. Frontend setup

```bash
cd client
npm install
```

Create `client/.env`:

```env
VITE_API_URL=http://localhost:5000
```

```bash
npm run dev
```

---

## API Endpoints

| Method | Endpoint | Access | Description |
|--------|----------|--------|-------------|
| POST | `/api/auth/register` | Public | Register |
| POST | `/api/auth/login` | Public | Login |
| GET | `/api/auth/google` | Public | Google OAuth |
| GET | `/api/auth/me` | Private | Get current user |
| PATCH | `/api/auth/profile` | Private | Update profile |
| PATCH | `/api/auth/password` | Private | Update password |
| PATCH | `/api/auth/avatar` | Private | Upload avatar |
| POST | `/api/shops` | Private | Create shop |
| GET | `/api/shops/me` | Private | Get my shop |
| GET | `/api/shops/:shopId` | Public | Get shop by ID |
| PATCH | `/api/shops/settings` | Private | Update shop settings |
| POST | `/api/jobs/:shopId` | Public | Upload print job |
| GET | `/api/jobs` | Private | Get all jobs |
| GET | `/api/jobs/analytics` | Private | Dashboard analytics |
| GET | `/api/jobs/:jobId` | Private | Get single job |
| GET | `/api/jobs/track/:jobId` | Public | Track job status |
| PATCH | `/api/jobs/:jobId/status` | Private | Update job status |
| DELETE | `/api/jobs/completed` | Private | Clear completed jobs |
| GET | `/api/jobs/proxy` | Private | PDF proxy for printing |
| POST | `/api/feedback` | Public | Submit platform feedback |

---

## Pages

| Route | Description |
|-------|-------------|
| `/` | Landing page |
| `/login` | Login |
| `/register` | Register |
| `/auth/callback` | Google OAuth callback |
| `/dashboard` | Shop owner dashboard (protected) |
| `/generate-qr` | Generate shop QR (protected) |
| `/profile` | Profile & settings (protected) |
| `/upload/:shopId` | Customer file upload (public) |
| `/track/:jobId` | Customer job tracking (public) |
| `/pricing` | Pricing plans |
| `/security` | Security & Terms |

---

## Key Features

- QR-based file upload — no app needed for customers
- Real-time job status tracking with auto-refresh
- Print dialog triggered directly from dashboard
- Auto job ID generation (4-digit random, collision-safe)
- Automatic file deletion from Cloudinary via cron
- Auto status progression: printing → ready (60s timer)
- Google OAuth + JWT authentication
- Avatar upload via Cloudinary
- Platform feedback collection
- Dark mode support

---

## Environment Variables

| Variable | Description |
|----------|-------------|
| `MONGO_URI` | MongoDB connection string |
| `JWT_SECRET` | Secret for JWT signing |
| `CLOUDINARY_CLOUD_NAME` | Cloudinary cloud name |
| `CLOUDINARY_API_KEY` | Cloudinary API key |
| `CLOUDINARY_API_SECRET` | Cloudinary API secret |
| `CLIENT_URL` | Frontend URL (for OAuth redirect & QR generation) |
| `GOOGLE_CLIENT_ID` | Google OAuth client ID |
| `GOOGLE_CLIENT_SECRET` | Google OAuth client secret |
| `VITE_API_URL` | Backend API URL (frontend env) |

---

## License

MIT
