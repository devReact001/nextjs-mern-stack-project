# 🚀 Next.js MERN Stack App

A full-stack web application built using **Next.js, Node.js, Express, and MongoDB** that enables users to perform secure and efficient data management through a modern, responsive interface.

---

## 🌐 Live Demo

🔗 **https://nextjs-mern-stack-project.vercel.app**

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
