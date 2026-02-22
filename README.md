# SecureVault

A secure file storage web application built with React, Express, PostgreSQL, and Firebase Authentication.

## Features

- User authentication with Firebase (Email/Password)
- Secure file upload and storage
- File metadata stored in PostgreSQL
- File download and deletion
- Protected routes for authenticated users
- Responsive dashboard with file management

## Tech Stack

**Frontend**
- React (Vite)
- React Router DOM
- Axios
- Firebase SDK

**Backend**
- Node.js
- Express
- Multer (file uploads)
- Firebase Admin SDK
- PostgreSQL (pg)

**Auth**
- Firebase Authentication

**Deployment**
- Frontend: Vercel
- Backend: Render
- Database: Render PostgreSQL

## Project Structure

```
myapp/
├── frontend/          # React app
│   ├── src/
│   │   ├── pages/
│   │   │   ├── Landing.jsx
│   │   │   ├── Login.jsx
│   │   │   ├── Signup.jsx
│   │   │   ├── Dashboard.jsx
│   │   │   └── Upload.jsx
│   │   ├── components/
│   │   │   └── ProtectedRoute.jsx
│   │   ├── firebase.js
│   │   └── main.jsx
│   └── index.html
└── backend/           # Express server
    ├── routes/
    │   ├── auth.js
    │   └── files.js
    ├── uploads/
    ├── db.js
    ├── firebaseAdmin.js
    └── index.js
```

## Getting Started

### Prerequisites

- Node.js
- PostgreSQL
- Firebase project

### 1. Clone the repository

```bash
git clone https://github.com/yourusername/secureVault.git
cd secureVault
```

### 2. Set up the backend

```bash
cd backend
npm install
```

Create a `.env` file in the `backend` folder:

```
PG_USER=your_postgres_user
PG_HOST=localhost
PG_DATABASE=myapp
PG_PASSWORD=your_postgres_password
PG_PORT=5432
```

Add your Firebase service account key as `serviceAccount.json` in the `backend` folder. You can download this from Firebase Console → Project Settings → Service Accounts.

### 3. Set up the database

Open PostgreSQL and run:

```sql
CREATE DATABASE myapp;
\c myapp

CREATE TABLE users (
  id SERIAL PRIMARY KEY,
  firebase_uid VARCHAR(255) UNIQUE NOT NULL,
  email VARCHAR(255) UNIQUE NOT NULL,
  created_at TIMESTAMP DEFAULT NOW()
);

CREATE TABLE files (
  id SERIAL PRIMARY KEY,
  user_id INTEGER REFERENCES users(id) ON DELETE CASCADE,
  filename VARCHAR(255) NOT NULL,
  file_url TEXT NOT NULL,
  uploaded_at TIMESTAMP DEFAULT NOW()
);
```

### 4. Set up the frontend

```bash
cd frontend
npm install
```

Create a `.env` file in the `frontend` folder:

```
VITE_API_URL=http://localhost:3000
```

Update `src/firebase.js` with your Firebase project config from Firebase Console → Project Settings.

### 5. Run the app

In one terminal, start the backend:

```bash
cd backend
npm start
```

In another terminal, start the frontend:

```bash
cd frontend
npm run dev
```

The app will be running at `http://localhost:5173`.

## Deployment

### Backend (Render)

1. Create a new Web Service on Render
2. Set root directory to `backend`
3. Set build command to `npm install`
4. Set start command to `node index.js`
5. Add environment variables from your `.env` file
6. Add `DATABASE_URL` from your Render PostgreSQL instance

### Frontend (Vercel)

1. Create a new project on Vercel
2. Set root directory to `frontend`
3. Set framework preset to Vite
4. Add environment variable `VITE_API_URL` with your Render backend URL
5. Deploy

## Environment Variables

### Backend

| Variable | Description |
|----------|-------------|
| `PG_USER` | PostgreSQL username |
| `PG_HOST` | PostgreSQL host |
| `PG_DATABASE` | PostgreSQL database name |
| `PG_PASSWORD` | PostgreSQL password |
| `PG_PORT` | PostgreSQL port (default: 5432) |
| `DATABASE_URL` | Full PostgreSQL connection string (for Render) |

### Frontend

| Variable | Description |
|----------|-------------|
| `VITE_API_URL` | Backend API URL |

## License

MIT
