# 3Netra 👁️

**3Netra** is an anonymous crime and incident reporting web application. It allows citizens to submit geo-tagged incident reports — including photos as evidence — without revealing their identity. Authorities and the public can view all reports on an interactive map and list view, while logged-in users can track their own submissions.

---

## ✨ Features

- 🗺️ **Submit Reports** — Pin a location on an interactive map, describe the incident, set date/time, and optionally upload photo evidence
- 🔒 **Anonymous by Design** — Reports are not linked to any public identity
- 📋 **View All Reports** — Browse all submitted reports in list or grid view with search and sort
- 🗺️ **Map Overview** — See all incidents plotted on a city-wide live map
- 👤 **My Submissions** — Logged-in users can track the status of their own reports (`pending`, `resolved`, `dismissed`)
- 🔐 **Auth System** — Signup / Login with JWT-based authentication

---

## 🛠️ Tech Stack

### Frontend
| Technology | Purpose |
|---|---|
| React 19 + Vite | UI framework and build tool |
| React Router v7 | Client-side routing |
| React Leaflet + Leaflet | Interactive maps |
| React Toastify | Toast notifications |
| FontAwesome | Icons |

### Backend
| Technology | Purpose |
|---|---|
| Node.js + Express 5 | REST API server |
| MongoDB + Mongoose | Database |
| JSON Web Tokens (JWT) | Authentication |
| bcrypt | Password hashing |
| Multer + Cloudinary | Evidence image uploads |
| Joi | Request validation |
| dotenv | Environment variable management |

---

## 📁 Project Structure

```
3Netra/
├── Backend/
│   ├── controllers/
│   │   ├── AuthController.js       # Signup & Login logic
│   │   └── ReportController.js     # Submit & fetch reports
│   ├── middleware/
│   │   ├── Auth.js                 # JWT verification middleware
│   │   ├── AuthValidation.js       # Joi validation schemas
│   │   └── uploadmiddleware.js     # Multer + Cloudinary config
│   ├── models/
│   │   ├── user.js                 # User schema
│   │   └── submitReport.js         # Report schema
│   ├── routes/
│   │   ├── AuthRouter.js           # /auth/signup, /auth/login
│   │   └── Report.js               # /api/reports, /api/reports/my-reports
│   ├── uploads/                    # Local fallback (ignored by git)
│   └── server.js                   # Express app entry point
│
└── Frontend/
    ├── public/                     # Leaflet marker icons
    └── src/
        ├── App.jsx                 # Routes definition
        ├── Toast.js                # Toast helper functions
        ├── Components/
        │   └── Navbar/
        ├── pages/
        │   └── Home.jsx
        └── sections/
            ├── Auth/Login/         # Login page
            ├── Auth/Signup/        # Signup page
            ├── Home/               # Landing page sections (Hero, About, Features, Footer)
            ├── mapOverview/        # City-wide incident map
            ├── mySubmissions/      # Logged-in user's own reports
            ├── submitReport/       # Report submission form
            └── viewReports/        # Public reports list/grid view
```

---

## 🚀 Getting Started (Local Development)

### Prerequisites
- [Node.js](https://nodejs.org/) v18+
- [MongoDB Atlas](https://www.mongodb.com/atlas) account (or local MongoDB)
- [Cloudinary](https://cloudinary.com/) account (for image uploads)

---

### 1. Clone the repository

```bash
git clone https://github.com/sohail0974/3Netra.git
cd 3Netra
```

---

### 2. Setup the Backend

```bash
cd Backend
npm install
```

Create a `.env` file inside the `Backend/` folder:

```env
MONGO_URI=your_mongodb_connection_string
JWT=your_jwt_secret_key
CLOUDINARY_CLOUD_NAME=your_cloudinary_cloud_name
CLOUDINARY_API_KEY=your_cloudinary_api_key
CLOUDINARY_API_SECRET=your_cloudinary_api_secret
PORT=4000
```

Start the backend dev server:

```bash
npm run dev
```

The backend will run on `http://localhost:4000`

---

### 3. Setup the Frontend

```bash
cd ../Frontend
npm install
```

Create a `.env` file inside the `Frontend/` folder:

```env
VITE_API_URL=http://localhost:4000
```

Start the frontend dev server:

```bash
npm run dev
```

The frontend will run on `http://localhost:5173`

---

## 🔌 API Endpoints

### Auth — `/auth`
| Method | Endpoint | Description |
|---|---|---|
| `POST` | `/auth/signup` | Register a new user |
| `POST` | `/auth/login` | Login and receive a JWT token |

### Reports — `/api/reports`
| Method | Endpoint | Auth Required | Description |
|---|---|---|---|
| `GET` | `/api/reports` | ❌ | Get all reports (public) |
| `POST` | `/api/reports` | ✅ | Submit a new report |
| `GET` | `/api/reports/my-reports` | ✅ | Get the logged-in user's reports |

> **Auth header format:** `Authorization: <jwt_token>`

---

## 🔐 Environment Variables

### Backend (`Backend/.env`)
| Variable | Description |
|---|---|
| `MONGO_URI` | MongoDB connection string |
| `JWT` | Secret key used to sign JWT tokens |
| `CLOUDINARY_CLOUD_NAME` | Your Cloudinary cloud name |
| `CLOUDINARY_API_KEY` | Your Cloudinary API key |
| `CLOUDINARY_API_SECRET` | Your Cloudinary API secret |
| `PORT` | Server port (defaults to `4000`) |

### Frontend (`Frontend/.env`)
| Variable | Description |
|---|---|
| `VITE_API_URL` | Backend base URL (e.g. `http://localhost:4000`) |

> ⚠️ **Never commit `.env` files.** They are already listed in `.gitignore`.

---

## 📦 Deployment

- **Backend** — Deploy on [Render](https://render.com/) or [Railway](https://railway.app/). Set all environment variables in the platform dashboard. The server automatically uses `process.env.PORT`.
- **Frontend** — Deploy on [Vercel](https://vercel.com/) or [Netlify](https://www.netlify.com/). Set `VITE_API_URL` to your deployed backend URL in the platform's environment variable settings.

---

## 📄 License

This project is for educational purposes.
