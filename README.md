# 🚀 Next.js MERN Stack App

A full-stack web application built using **Next.js, Node.js, Express, and MongoDB** that enables users to perform secure and efficient project and task management through a modern, responsive interface.

---

## 🌐 Live Deployments

| Platform | Frontend | Backend |
|----------|----------|---------|
| ☁️ **GCP Cloud Run** | https://mern-frontend-482064592313.asia-south1.run.app | https://mern-backend-482064592313.asia-south1.run.app |
| ▲ **Vercel** | https://nextjs-mern-stack-project.vercel.app | Render |

---

## ✨ Features

- 🔐 Secure JWT authentication (register + login)
- 📋 Full Project CRUD (Create, Read, Update, Delete)
- ✅ Kanban Task Board — Todo / In Progress / Done
- 🔍 Real-time search with debounce
- 📄 Paginated project list
- 🌙 Dark / Light mode toggle
- 🎨 Responsive UI with Tailwind CSS
- ☁️ Deployed on GCP Cloud Run + Vercel

---

## 🛠 Tech Stack

| Layer | Technology |
|-------|-----------|
| Frontend | Next.js 16, React 19, Tailwind CSS |
| Backend | Node.js, Express.js, TypeScript |
| Database | MongoDB Atlas (Mongoose ODM) |
| Auth | JWT (JSON Web Tokens) |
| State | React Query (@tanstack/react-query) |
| Deployment | GCP Cloud Run + Vercel (frontend), Render (backend) |
| CI/CD | GCP Cloud Build + Artifact Registry |

---

## ☁️ GCP Cloud Run Architecture

```
Developer pushes to GitHub
         ↓
  GCP Cloud Build triggers
         ↓
  Docker images built &
  pushed to Artifact Registry
         ↓
┌─────────────────────────────────────┐
│           GCP Cloud Run             │
│                                     │
│  mern-frontend   |   mern-backend   │
│  (Next.js)       |   (Node.js)      │
│  asia-south1     |   asia-south1    │
└─────────────────────────────────────┘
         ↓
   MongoDB Atlas (Cloud DB)
   Secrets via GCP Secret Manager
```

**GCP Services Used:**
- **Cloud Run** — serverless container hosting (auto-scales to zero)
- **Cloud Build** — CI/CD pipeline, builds Docker images on push
- **Artifact Registry** — stores Docker images
- **Secret Manager** — securely stores `MONGO_URI` and `JWT_SECRET`

---

## 🏗️ Application Architecture

```
┌─────────────────────────────────┐
│        Next.js Frontend         │
│  React 19 + Tailwind + R-Query  │
│     GCP Cloud Run / Vercel      │
└─────────────┬───────────────────┘
              │ REST API (JWT)
              ▼
┌─────────────────────────────────┐
│   Node.js + Express API         │
│   TypeScript + JWT Middleware   │
│      GCP Cloud Run / Render     │
└─────────────┬───────────────────┘
              │ Mongoose ODM
              ▼
┌─────────────────────────────────┐
│         MongoDB Atlas           │
│      (Cloud Database)           │
└─────────────────────────────────┘
```

---

## 📱 App Pages

| Page | Description |
|------|-------------|
| `/login` | JWT login with email + password |
| `/register` | New user registration |
| `/dashboard` | Project list with search + pagination |
| `/dashboard/[id]` | Kanban board for tasks per project |

---

## 🔐 Authentication Flow

```
User Login → POST /api/auth/login
      ↓
JWT Token Generated & Returned
      ↓
Token stored in localStorage
      ↓
Attached to all API requests via headers
      ↓
Express JWT Middleware validates token
      ↓
Protected routes accessible
```

---

## 🔗 API Overview

| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | `/api/auth/register` | User registration |
| POST | `/api/auth/login` | Login, returns JWT |
| GET | `/api/projects` | List projects (paginated + search) |
| POST | `/api/projects` | Create project |
| PUT | `/api/projects/:id` | Update project |
| DELETE | `/api/projects/:id` | Delete project |
| GET | `/api/tasks/:projectId` | Get tasks for project |
| POST | `/api/tasks/:projectId` | Create task |
| PUT | `/api/tasks/task/:id` | Update task title/status |
| DELETE | `/api/tasks/task/:id` | Delete task |

---

## ⚙️ Getting Started Locally

```bash
git clone https://github.com/devReact001/nextjs-mern-stack-project.git
```

**Backend:**
```bash
cd server
npm install
# Create .env with MONGO_URI and JWT_SECRET
npm run dev
```

**Frontend:**
```bash
cd client
npm install
# Create .env.local with NEXT_PUBLIC_API_URL=http://localhost:5000
npm run dev
```

---

## 🚀 Deployment

### GCP Cloud Run (Production)

```bash
# Build and push backend
gcloud builds submit ./server \
  --tag asia-south1-docker.pkg.dev/PROJECT_ID/mern-stack/mern-backend:latest

# Deploy backend
gcloud run deploy mern-backend \
  --image=asia-south1-docker.pkg.dev/PROJECT_ID/mern-stack/mern-backend:latest \
  --region=asia-south1 \
  --set-secrets=MONGO_URI=MONGO_URI:latest,JWT_SECRET=JWT_SECRET:latest

# Build and push frontend
gcloud builds submit ./client \
  --tag asia-south1-docker.pkg.dev/PROJECT_ID/mern-stack/mern-frontend:latest

# Deploy frontend
gcloud run deploy mern-frontend \
  --image=asia-south1-docker.pkg.dev/PROJECT_ID/mern-stack/mern-frontend:latest \
  --region=asia-south1
```

---

## 🔮 Future Improvements

- 🔄 Real-time updates using Socket.io
- 🔍 Advanced search and filtering
- 👥 Role-based authentication (RBAC)
- 🌙 Persistent dark mode
- 📁 File upload functionality
- 📊 Project analytics dashboard

---

## 📬 Contact

- 🐙 GitHub: [github.com/devReact001](https://github.com/devReact001)
- 💼 LinkedIn: [linkedin.com/in/deepak-prasad](https://linkedin.com/in/deepak-prasad)
- 🌐 Portfolio: [sql-nextjs.vercel.app](https://sql-nextjs.vercel.app)

---

<div align="center">

⭐ If you found this project useful, consider giving it a star!

**[GCP Live](https://mern-frontend-482064592313.asia-south1.run.app)** · **[Vercel Live](https://nextjs-mern-stack-project.vercel.app)** · **[GitHub](https://github.com/devReact001/nextjs-mern-stack-project)**

</div>


---

## ✨ Features

- 🔐 Secure authentication (JWT-based)
- 📊 Full CRUD functionality (Create, Read, Update, Delete)
- ⚡ RESTful API integration
- 🎨 Responsive UI with Tailwind CSS
- 🌍 Deployed on Vercel (frontend) and Render (backend)
- 🧾 Clean and modular code structure

---

## 🛠 Tech Stack

| Layer | Technology |
|-------|-----------|
| Frontend | Next.js, React.js, Tailwind CSS |
| Backend | Node.js, Express.js |
| Database | MongoDB Atlas (Mongoose ODM) |
| Auth | JWT (JSON Web Tokens) |
| Deployment | Vercel (frontend) + Render (backend) |

---

## 🏗️ Architecture

```
┌─────────────────────────────────┐
│        Next.js Frontend         │
│     (React + Tailwind CSS)      │
│        Vercel Hosted            │
└─────────────┬───────────────────┘
              │ REST API calls
              ▼
┌─────────────────────────────────┐
│     Node.js + Express API       │
│       JWT Authentication        │
│         Render Hosted           │
└─────────────┬───────────────────┘
              │ Mongoose ODM
              ▼
┌─────────────────────────────────┐
│         MongoDB Atlas           │
│      (Cloud Database)           │
└─────────────────────────────────┘
```

---

## 🔐 Authentication Flow

```
User Login → POST /api/auth/login
      ↓
JWT Token Generated & Returned
      ↓
Token stored in localStorage
      ↓
Attached to all API requests via headers
      ↓
Express JWT Middleware validates token
      ↓
Protected routes accessible
```

---

## 🔗 API Overview

| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | `/api/auth/login` | User login, returns JWT |
| POST | `/api/auth/register` | User registration |
| GET | `/api/...` | Fetch data (protected) |
| POST | `/api/...` | Create data (protected) |
| PUT | `/api/...` | Update data (protected) |
| DELETE | `/api/...` | Delete data (protected) |

---

## ⚙️ Getting Started

### 1. Clone the repository

```bash
git clone https://github.com/devReact001/nextjs-mern-stack-project.git
```

### 2. Install dependencies

**Frontend:**
```bash
cd client
npm install
```

**Backend:**
```bash
cd server
npm install
```

### 3. Setup Environment Variables

Create a `.env` file in the server folder:

```env
MONGO_URI=your_mongodb_connection_string
JWT_SECRET=your_jwt_secret_key
PORT=5000
```

Create a `.env.local` file in the client folder:

```env
NEXT_PUBLIC_API_URL=http://localhost:5000
```

### 4. Run the application

**Backend:**
```bash
cd server
npm run dev
```

**Frontend:**
```bash
cd client
npm run dev
# Open http://localhost:3000
```

---

## 🚀 Deployment

| Service | Platform | URL |
|---------|----------|-----|
| Frontend | Vercel | nextjs-mern-stack-project.vercel.app |
| Backend | Render | Auto-deployed from GitHub |
| Database | MongoDB Atlas | Cloud hosted |

---

## 🔮 Future Improvements

- 🔄 Real-time updates using Socket.io
- 🔍 Advanced search and filtering
- 👥 Role-based authentication (RBAC)
- 🌙 Dark mode support
- 📁 File upload functionality

---

## 🤝 Contributing

Contributions are welcome! Feel free to fork the repo and submit a pull request.

---

## 📬 Contact

- 🐙 GitHub: [github.com/devReact001](https://github.com/devReact001)
- 💼 LinkedIn: [linkedin.com/in/deepak-prasad](https://linkedin.com/in/deepak-prasad)
- 🌐 Portfolio: [sql-nextjs.vercel.app](https://sql-nextjs.vercel.app)

---

<div align="center">

⭐ If you found this project useful, consider giving it a star!

**[Live Demo](https://nextjs-mern-stack-project.vercel.app)** · **[GitHub](https://github.com/devReact001/nextjs-mern-stack-project)**

</div>
