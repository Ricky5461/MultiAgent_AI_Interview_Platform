# FreshAI — Multi-Agent AI Interview Platform

FreshAI is a multi-agent AI platform that helps you prepare smarter for job interviews. It combines specialized AI agents to build your resume, score it, conduct realistic mock interviews, give detailed feedback, and generate a personalized learning roadmap.

> **Prepare smarter, not harder.**

---

## Table of Contents

- [Features](#features)
- [Tech Stack](#tech-stack)
- [Project Structure](#project-structure)
- [Prerequisites](#prerequisites)
- [Getting Started](#getting-started)
  - [1. Clone the Repository](#1-clone-the-repository)
  - [2. Install Dependencies](#2-install-dependencies)
  - [3. Environment Variables](#3-environment-variables)
  - [4. Firebase Setup (Service Account)](#4-firebase-setup-service-account)
  - [5. MongoDB Setup](#5-mongodb-setup)
  - [6. Redis Setup (via Docker)](#6-redis-setup-via-docker)
  - [7. Running the Project](#7-running-the-project)
- [Available Scripts](#available-scripts)
- [Security: Handling Secrets & `.gitignore`](#security-handling-secrets--gitignore)
- [Contributing](#contributing)
- [License](#license)

---

## Features

- **Resume Builder** — Create ATS-friendly resumes and improve profile strength.
- **Interviews Agent** — Conduct realistic HR, Technical, and Coding interview simulations powered by AI.
- **Feedback Agent** — Get detailed answer analysis, scoring reports, and recommendations.
- **RoadMap Agent** — Generate a personalized learning roadmap based on your goals, skills, and performance.
- **Resume Scorer** — Score and evaluate your resume against job requirements.
- Secure authentication via **Google Sign-In** (Firebase Auth).

---

## Tech Stack

| Layer | Technology |
|---|---|
| Frontend | React (Vite) |
| Backend | Node.js, Express (microservices architecture) |
| Database | MongoDB (Mongoose) |
| Cache / Session Store | Redis (ioredis) |
| Authentication | Firebase Authentication (Google OAuth) |
| Containerization | Docker & Docker Compose |
| API Gateway | Custom Express gateway service |

---

## Project Structure

```
2.freshAI/
├── backend/
│   ├── docker-compose.yml
│   ├── gateway/                  # API Gateway (Port 8000)
│   │   ├── .env
│   │   └── ...
│   ├── services/
│   │   └── auth/                 # Auth Service (Port 8001)
│   │       ├── .env
│   │       ├── configs/
│   │       │   ├── db.js
│   │       │   └── firebase.js
│   │       ├── controllers/
│   │       ├── models/
│   │       ├── routes/
│   │       └── serviceAccountKey.json   # NOT committed — see below
│   └── shared/
│       └── redis/
│           └── redis.js
├── frontend/                     # React + Vite app (Port 5173)
│   ├── src/
│   └── api
|   └── assets
|   └── components
|   └── pages
|   └── utils
└── .gitignore
```

---

## Prerequisites

Before you begin, make sure you have the following installed:

- [Node.js](https://nodejs.org/) (v18 or higher recommended)
- [npm](https://www.npmjs.com/)
- [Docker Desktop](https://www.docker.com/products/docker-desktop/) (must be running for Redis)
- A [MongoDB Atlas](https://www.mongodb.com/atlas) account (or a local MongoDB instance)
- A [Firebase](https://console.firebase.google.com/) project with Authentication (Google Sign-In) enabled

---

## Getting Started

### 1. Clone the Repository

```bash
git clone https://github.com/<your-username>/MultiAgent_AI_Interview_Platform.git
cd MultiAgent_AI_Interview_Platform/2.freshAI
```

### 2. Install Dependencies

Install dependencies separately for each service:

```bash
# Gateway
cd backend/gateway
npm install

# Auth Service
cd ../services/auth
npm install

# Frontend
cd ../../../frontend
npm install
```

### 3. Environment Variables

Each service needs its own `.env` file. **Never commit these files** — see the [Security section](#security-handling-secrets--gitignore) below.

#### `backend/gateway/.env`

```dotenv
PORT=8000
AUTH_SERVICE_URL=http://localhost:8001
REDIS_URL=redis://localhost:6379
```

#### `backend/services/auth/.env`

```dotenv
PORT=8001
MONGODB_URI="mongodb+srv://<username>:<password>@<cluster-url>/<database>?appName=Cluster0"
REDIS_URL="redis://localhost:6379"
```

> Replace `<username>`, `<password>`, `<cluster-url>`, and `<database>` with your actual MongoDB Atlas credentials (see [MongoDB Setup](#5-mongodb-setup) below).
>
> If your password contains special characters (`@`, `#`, `%`, etc.), URL-encode them — e.g. `@` becomes `%40`.

#### `frontend/.env`

```dotenv
VITE_FIREBASE_APIKEY=your_firebase_web_api_key
```

> This is your **Firebase client SDK config**, not a backend secret — it's safe to bundle into the frontend build. Real protection comes from Firebase Security Rules, not from hiding this key.

---

### 4. Firebase Setup (Service Account)

The auth service uses the **Firebase Admin SDK** to verify user tokens on the backend. This requires a service account key file.

1. Go to the [Firebase Console](https://console.firebase.google.com/) and select your project.
2. Click the gear icon → **Project Settings** → **Service Accounts** tab.
3. Click **Generate New Private Key**. This downloads a JSON file.
4. Rename it to `serviceAccountKey.json` and place it inside:
   ```
   backend/services/auth/serviceAccountKey.json
   ```
5. **Do not commit this file.** It grants full admin access to your Firebase project. It is already excluded via `.gitignore` (see below).

Also enable **Google Sign-In** under **Authentication → Sign-in method** in the Firebase Console, and set up your frontend Firebase client config (`firebaseConfig`) in `frontend/src/utils/firebase.js`.

---

### 5. MongoDB Setup

1. Create a free cluster on [MongoDB Atlas](https://www.mongodb.com/atlas).
2. Under **Database Access**, create a database user with a username and password.
3. Under **Network Access**, allow your current IP (or `0.0.0.0/0` for local development/testing only).
4. Copy your connection string from **Connect → Drivers**, and paste it into `backend/services/auth/.env` as `MONGODB_URI` (see format above).

---

### 6. Redis Setup (via Docker)

Redis runs locally via Docker Compose. Make sure **Docker Desktop is running**, then from the `backend` folder:

```bash
cd backend
docker-compose up -d
```

Verify the container is running:

```bash
docker ps
```

You should see a `redis` container with status `Up`.

To stop it later:

```bash
docker-compose down
```

---

### 7. Running the Project

Open a separate terminal for each service.

**Terminal 1 — Auth Service**
```bash
cd backend/services/auth
npm run dev
```

**Terminal 2 — Gateway**
```bash
cd backend/gateway
npm run dev
```

**Terminal 3 — Frontend**
```bash
cd frontend
npm run dev
```

The frontend will be available at **http://localhost:5173**, the gateway at **http://localhost:8000**, and the auth service at **http://localhost:8001**.

---

## Available Scripts

Run these from within each respective service folder (`backend/gateway`, `backend/services/auth`, or `frontend`):

| Command | Description |
|---|---|
| `npm install` | Installs all dependencies |
| `npm run dev` | Starts the service in development mode with hot-reload (nodemon / Vite) |
| `npm start` | Starts the service in production mode |
| `npm run build` | (Frontend only) Builds the production-ready frontend bundle |

---

## Security: Handling Secrets & `.gitignore`

This project uses `.env` files and a Firebase `serviceAccountKey.json` for credentials. These must **never** be pushed to a public repository. Here's how this repo is kept clean of secrets:

### `.gitignore`

The following is already configured at the project root:

```gitignore
# Environment files
.env
.env.local
.env.development
.env.production
.env.*.local

# Sensitive files
**/serviceAccountKey.json
```

This prevents these files from being staged in **future** commits — but it does **not** retroactively remove files that were already tracked before `.gitignore` was added.

### Removing Already-Tracked Secret Files

If a `.env` or `serviceAccountKey.json` was committed before `.gitignore` was set up, untrack it (this keeps the file on your local disk — it only stops Git from tracking it):

```bash
git rm --cached path/to/.env
git rm --cached path/to/serviceAccountKey.json
git commit -m "Remove secrets from tracking"
git pull
git push
```

### If a Secret Was Already Pushed to a Remote Repo

1. **Rotate the credential immediately** (change the MongoDB password, regenerate the Firebase service account key, etc.) — this is the step that actually neutralizes the leak, regardless of what else you do.
2. Untrack the file as shown above.
3. *(Optional, for a fully clean history)* Use [BFG Repo-Cleaner](https://rtyley.github.io/bfg-repo-cleaner/) to strip the secret from old commits:
   ```bash
   java -jar bfg.jar --delete-files serviceAccountKey.json your-repo.git
   java -jar bfg.jar --delete-files .env your-repo.git
   cd your-repo.git
   git reflog expire --expire=now --all
   git gc --prune=now --aggressive
   git push --force
   ```

### Quick Local Setup After Cloning

Since `.env` and `serviceAccountKey.json` are never committed, after cloning this repo you must create them yourself using the templates in the [Environment Variables](#3-environment-variables) and [Firebase Setup](#4-firebase-setup-service-account) sections above.

```bash
git init
git pull origin main
```

---

## Contributing

1. Fork the repository
2. Create a feature branch: `git checkout -b feature/your-feature-name`
3. Commit your changes: `git commit -m "Add your feature"`
4. Push to your branch: `git push origin feature/your-feature-name`
5. Open a Pull Request

---
# React + Vite

This template provides a minimal setup to get React working in Vite with HMR and some ESLint rules.

Currently, two official plugins are available:

- [@vitejs/plugin-react](https://github.com/vitejs/vite-plugin-react/blob/main/packages/plugin-react) uses [Oxc](https://oxc.rs)
- [@vitejs/plugin-react-swc](https://github.com/vitejs/vite-plugin-react/blob/main/packages/plugin-react-swc) uses [SWC](https://swc.rs/)

## React Compiler

The React Compiler is not enabled on this template because of its impact on dev & build performances. To add it, see [this documentation](https://react.dev/learn/react-compiler/installation).

## Expanding the ESLint configuration

If you are developing a production application, we recommend using TypeScript with type-aware lint rules enabled. Check out the [TS template](https://github.com/vitejs/vite/tree/main/packages/create-vite/template-react-ts) for information on how to integrate TypeScript and [`typescript-eslint`](https://typescript-eslint.io) in your project.

## Use Motion & React  icons for mor animation 
## License

This project is licensed under the MIT License — see the `LICENSE` file for details.

---

**Built by Ricky Kumar** — [GitHub](https://github.com/Ricky5461)
