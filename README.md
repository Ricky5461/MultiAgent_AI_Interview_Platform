# FreshAI — Multi-Agent AI Interview Platform

FreshAI is a multi-agent AI platform that helps you prepare smarter for job interviews. It combines specialized AI agents to build your resume, score it, conduct realistic mock interviews, give detailed feedback, and generate a personalized learning roadmap.

> **Prepare smarter, not harder.**

---

## Table of Contents

- [Features](#features)
- [Tech Stack](#tech-stack)
- [Architecture & Agent Flow](#architecture--agent-flow)
  - [Resume Pipeline](#resume-pipeline)
  - [Interview Pipeline (LangGraph)](#interview-pipeline-langgraph)
  - [Gateway](#gateway)
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

- **Resume Builder & Analyzer** — Upload a PDF resume; an AI agent extracts text, scores it, and returns structured feedback (strengths, weaknesses, missing skills, suggested role, recommendations).
- **ATS Resume Templates** — Build and preview an ATS-friendly resume from scratch, then download it as a PDF.
- **Multi-Agent Interview Engine** — A LangGraph state machine conducts HR/technical mock interviews, question by question, using dedicated interview, feedback, and summary agents.
- **Feedback Agent** — Scores each answer against the question and difficulty level, producing structured feedback per response.
- **Summary Agent** — Rolls up the full interview session into an overall performance summary.
- **Resume Scorer Dashboard** — View your resume score, missing skills, and role fit at a glance.
- Secure authentication via **Google Sign-In** (Firebase Auth), enforced at the gateway.

---

## Tech Stack

| Layer | Technology |
|---|---|
| Frontend | React (Vite), Redux Toolkit, React Router, Firebase Auth SDK, Axios, Motion (`motion/react`), React Icons |
| Backend | Node.js, Express (microservices architecture) |
| AI / Agents | LangChain (`@langchain/core`), LangGraph (`@langchain/langgraph`), Groq API (`@langchain/groq` / `groq-sdk`) |
| Database | MongoDB (Mongoose) |
| Cache / Session Store | Redis (`ioredis`) |
| File Handling | Multer (PDF upload), custom PDF text-extraction util |
| Authentication | Firebase Authentication (Google OAuth), verified server-side via Firebase Admin SDK |
| API Gateway | Custom Express gateway using `express-http-proxy`, injecting `x-user-id` into downstream requests |
| Containerization | Docker & Docker Compose (Redis) |

---

## Architecture & Agent Flow

FreshAI is split into independent Node/Express microservices (`auth`, `resume`, `interview`, `billing`) sitting behind a single API gateway. The frontend never talks to a service directly — every request goes through the gateway, which authenticates the user and forwards a resolved `x-user-id` header downstream.

```
Frontend (React) ──▶ Gateway (Express, proxyWithHeaders) ──▶ Auth Service   (8001)
                                                        ├──▶ Resume Service (8002)
                                                        ├──▶ Interview Service (8003)
                                                        └──▶ Billing Service
```

### Resume Pipeline

```
PDF upload (Multer) → Save to /uploads → Extract text (pdf.js) →
resumeAgent (Groq via LangChain) → Parse & normalize LLM JSON →
Save to MongoDB → Cache in Redis → Delete temp PDF → Return score + analysis
```

- `agents/resume.agents.js` — wraps a Groq chat model with a scoring/extraction prompt and returns structured JSON (score, summary, education, experience, projects, skills, strengths, weaknesses, missingSkills, suggestedRole, recommendations).
- `controllers/resume.controller.js` — orchestrates the pipeline above; normalizes whatever shape the LLM returns before it hits Mongoose, so model swaps or prompt drift don't break saves.
- `models/resume.model.js` — Mongoose schema; array fields (`education`, `experience`, `projects`, `skills`, etc.) are stored as flat strings.
- Redis caches the latest resume per `userId` (`resume:<userId>`) so repeat reads skip Mongo.

### Interview Pipeline (LangGraph)

The interview service models a mock interview as a **LangGraph state graph** rather than a simple request/response call — this lets the interview progress through multiple stages (ask → answer → feedback → summary) while carrying state between nodes.

```
graph/state.js   → defines the shared state shape (question, answer, difficulty, feedback, history…)
graph/nodes.js   → node functions: interviewNode, feedbackNode (and a summary equivalent)
graph/graph.js   → wires nodes into a LangGraph StateGraph and compiles it
agents/
  interview.agent.js → generates the next interview question (HR / technical) via Groq
  feedback.agent.js  → scores a single answer against the question + difficulty
  summary.agent.js   → produces an end-of-session performance summary
prompts/
  hrInterviewPrompt.js, feedbackPrompt.js, summaryPrompt.js → prompt templates per agent
controllers/interview-controller.js → invokes the compiled graph per request, persists results
```

Flow for a single interview turn:

```
Client answer ──▶ interview-controller ──▶ compiled LangGraph
                                             ├─ interviewNode → next question
                                             └─ feedbackNode  → { feedback } for the given answer
                        ▼
                 Save turn to MongoDB (interview.model.js)
```

At the end of a session, `summary.agent.js` is invoked to aggregate all turns into a final report (used by the roadmap/feedback dashboard on the frontend).

### Gateway

`backend/gateway/utils/proxyWithHeaders.js` wraps `express-http-proxy` so every proxied route automatically forwards the authenticated user's ID:

```js
proxyReqOptDecorator: (proxyReqOpts, srcReq) => {
  if (srcReq.user) {
    proxyReqOpts.headers["x-user-id"] = srcReq.user.userId;
  }
  return proxyReqOpts;
}
```

Downstream services (`resume`, `interview`, `billing`) read `req.headers["x-user-id"]` instead of re-verifying Firebase tokens themselves — auth is centralized at the gateway.

---

## Project Structure

```
2.freshAI/
├── backend/
│   ├── docker-compose.yml
│   ├── gateway/                        # API Gateway (Port 8000)
│   │   ├── .env
│   │   └── utils/
│   │       └── proxyWithHeaders.js     # injects x-user-id into proxied requests
│   ├── services/
│   │   ├── auth/                       # Auth Service (Port 8001)
│   │   │   ├── .env
│   │   │   ├── configs/
│   │   │   │   ├── db.js
│   │   │   │   └── firebase.js
│   │   │   ├── controllers/
│   │   │   ├── models/
│   │   │   ├── routes/
│   │   │   └── serviceAccountKey.json  # NOT committed
│   │   ├── resume/                     # Resume Service (Port 8002)
│   │   │   ├── .env
│   │   │   ├── agents/
│   │   │   │   └── resume.agents.js
│   │   │   ├── config/
│   │   │   │   ├── db.js
│   │   │   │   ├── llm.js
│   │   │   │   └── pdf.js
│   │   │   ├── controllers/
│   │   │   │   └── resume.controller.js
│   │   │   ├── middleware/
│   │   │   │   └── multer.js
│   │   │   ├── models/
│   │   │   │   └── resume.model.js
│   │   │   ├── routes/
│   │   │   │   └── resume.route.js
│   │   │   └── uploads/                # temp PDF storage, cleared after processing
│   │   ├── interview/                  # Interview Service (Port 8003)
│   │   │   ├── .env
│   │   │   ├── agents/
│   │   │   │   ├── feedback.agent.js
│   │   │   │   ├── interview.agent.js
│   │   │   │   └── summary.agent.js
│   │   │   ├── config/
│   │   │   │   ├── db.js
│   │   │   │   └── llm.js
│   │   │   ├── controllers/
│   │   │   │   └── interview-controller.js
│   │   │   ├── graph/
│   │   │   │   ├── graph.js            # LangGraph StateGraph definition
│   │   │   │   ├── nodes.js            # interviewNode, feedbackNode
│   │   │   │   └── state.js            # shared graph state schema
│   │   │   ├── models/
│   │   │   ├── prompts/
│   │   │   │   ├── feedbackPrompt.js
│   │   │   │   ├── hrInterviewPrompt.js
│   │   │   │   └── summaryPrompt.js
│   │   │   └── routes/
│   │   └── billing/
│   └── shared/
│       └── redis/
│           └── redis.js
├── frontend/                            # React + Vite app (Port 5173)
│   └── src/
│       ├── apis/
│       │   ├── resume.api.js
│       │   └── user.api.js
│       ├── assets/
│       ├── components/
│       │   └── resume/
│       │       ├── ATSTemplate.jsx
│       │       ├── DownloadBtn.jsx
│       │       ├── PreviewResume.jsx
│       │       ├── ResumeForm.jsx
│       │       ├── LoginModel.jsx
│       │       └── Sidebar.jsx
│       ├── pages/
│       │   ├── Dashboard.jsx
│       │   ├── Home.jsx
│       │   ├── ResumeBuilder.jsx
│       │   └── Scorer.jsx
│       ├── redux/
│       │   ├── resumeSlice.js
│       │   └── store.js
│       └── utils/
│           ├── axios.js
│           └── firebase.js
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
- A [Groq](https://console.groq.com/) API key (for the resume and interview agents)

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

# Resume Service
cd ../resume
npm install

# Interview Service
cd ../interview
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
RESUME_SERVICE_URL=http://localhost:8002
INTERVIEW_SERVICE_URL=http://localhost:8003
REDIS_URL=redis://localhost:6379
```

#### `backend/services/auth/.env`

```dotenv
PORT=8001
MONGODB_URI="mongodb+srv://<username>:<password>@<cluster-url>/<database>?appName=Cluster0"
REDIS_URL="redis://localhost:6379"
```

#### `backend/services/resume/.env`

```dotenv
PORT=8002
MONGODB_URI="mongodb+srv://<username>:<password>@<cluster-url>/<database>?appName=Cluster0"
REDIS_URL="redis://localhost:6379"
GROQ_API_KEY="your_groq_api_key"
```

#### `backend/services/interview/.env`

```dotenv
PORT=8003
MONGODB_URI="mongodb+srv://<username>:<password>@<cluster-url>/<database>?appName=Cluster0"
REDIS_URL="redis://localhost:6379"
GROQ_API_KEY="your_groq_api_key"
```

> Replace `<username>`, `<password>`, `<cluster-url>`, and `<database>` with your actual MongoDB Atlas credentials (see [MongoDB Setup](#5-mongodb-setup) below).
>
> If your password contains special characters (`@`, `#`, `%`, etc.), URL-encode them — e.g. `@` becomes `%40`.
>
> **Never** commit a real `GROQ_API_KEY` or `MONGODB_URI` — rotate them immediately if one is ever exposed (screenshot, commit, log output, etc.).

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
4. Copy your connection string from **Connect → Drivers**, and paste it into each service's `.env` as `MONGODB_URI` (see format above). Auth, resume, and interview services can share one cluster with separate collections, or use separate databases — either works.

---

### 6. Redis Setup (via Docker)

Redis runs locally via Docker Compose and is shared across all backend services (used for caching resumes and, if enabled, session/rate-limit data). Make sure **Docker Desktop is running**, then from the `backend` folder:

```bash
cd backend
docker-compose up -d
```

Verify the container is running:

```bash
docker ps
```

You should see a `redis` container with status `Up`, listening on port `6379`.

To stop it later:

```bash
docker-compose down
```

---

### 7. Running the Project

Open a separate terminal for each service.

**Terminal 1 — Redis** (must be up before the other services start, or you'll see `ioredis ECONNREFUSED` errors)
```bash
cd backend
docker-compose up -d
```

**Terminal 2 — Auth Service**
```bash
cd backend/services/auth
npm run dev
```

**Terminal 3 — Resume Service**
```bash
cd backend/services/resume
npm run dev
```

**Terminal 4 — Interview Service**
```bash
cd backend/services/interview
npm run dev
```

**Terminal 5 — Gateway**
```bash
cd backend/gateway
npm run dev
```

**Terminal 6 — Frontend**
```bash
cd frontend
npm run dev
```

| Service | URL |
|---|---|
| Frontend | http://localhost:5173 |
| Gateway | http://localhost:8000 |
| Auth Service | http://localhost:8001 |
| Resume Service | http://localhost:8002 |
| Interview Service | http://localhost:8003 |

---

## Available Scripts

Run these from within each respective service folder (`backend/gateway`, `backend/services/auth`, `backend/services/resume`, `backend/services/interview`, or `frontend`):

| Command | Description |
|---|---|
| `npm install` | Installs all dependencies |
| `npm run dev` | Starts the service in development mode with hot-reload (nodemon / Vite) |
| `npm start` | Starts the service in production mode |
| `npm run build` | (Frontend only) Builds the production-ready frontend bundle |

### Key Dependencies by Service

**Interview Service** (`backend/services/interview/package.json`)
```json
{
  "dependencies": {
    "@langchain/core": "^1.2.9",
    "@langchain/groq": "^1.3.1",
    "@langchain/langgraph": "^1.4.12",
    "dotenv": "^17.4.2",
    "express": "^5.2.1",
    "mongoose": "^9.9.3",
    "nodemon": "^3.1.14"
  }
}
```

**Resume Service** — same LangChain/Groq/Mongoose/Express base as above, plus `multer` for PDF upload handling and a PDF text-extraction utility.

**Gateway** — `express-http-proxy` for routing/forwarding requests to each microservice.

**Frontend** — `react`, `react-dom`, `@reduxjs/toolkit`, `react-redux`, `firebase`, `axios`, `motion`, `react-icons`.

> ⚠️ Model availability on Groq changes over time (e.g. `llama-3.3-70b-versatile` has been deprecated). Check [Groq's model list](https://console.groq.com/docs/models) if you hit a `model_not_found` error, and update `config/llm.js` in the resume and interview services accordingly.

---

## Security: Handling Secrets & `.gitignore`

This project uses `.env` files and a Firebase `serviceAccountKey.json` for credentials. These must **never** be pushed to a public repository, committed to version control, or left visible in shared screenshots/screen recordings. Here's how this repo is kept clean of secrets:

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

### If a Secret Was Already Pushed to a Remote Repo (or Exposed Any Other Way)

1. **Rotate the credential immediately** (change the MongoDB password, regenerate the Groq API key, regenerate the Firebase service account key, etc.) — this is the step that actually neutralizes the leak, regardless of what else you do.
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

## License

This project is licensed under the MIT License — see the `LICENSE` file for details.

---

**Built by Ricky Kumar** — [GitHub](https://github.com/Ricky5461)
