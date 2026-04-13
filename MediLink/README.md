# MediLink

A full-stack healthcare appointment management platform built with the **MERN** stack (MongoDB, Express.js, React, Node.js).

## Tech Stack

| Layer      | Technology                     |
| ---------- | ------------------------------ |
| Frontend   | React 19 + Vite                |
| Backend    | Express 5 + Node.js           |
| Database   | MongoDB (via Prisma ORM)       |
| Auth       | JWT + bcrypt                   |

## Project Structure

```
MediLink/
├── client/                     # React frontend (Vite)
│   ├── src/
│   │   ├── components/         # Reusable UI components (Navbar, etc.)
│   │   ├── pages/              # Page-level components
│   │   ├── services/           # API helpers
│   │   ├── assets/             # Images and static files
│   │   ├── App.jsx             # Route definitions
│   │   └── main.jsx            # Entry point
│   └── package.json
│
├── server/                     # Express backend
│   ├── src/
│   │   ├── config/             # Database client and app config
│   │   ├── controllers/        # Business logic (auth, appointments)
│   │   ├── middleware/         # Auth & authorization middleware
│   │   ├── routes/             # Route definitions
│   │   └── index.js            # Server entry point
│   ├── prisma/
│   │   └── schema.prisma       # Database schema
│   ├── .env.example            # Environment variable template
│   └── package.json
│
└── README.md
```

## Getting Started

### Prerequisites

- Node.js 18+
- MongoDB Atlas account (or local MongoDB instance)

### 1. Clone the repository

```bash
git clone <repository-url>
cd MediLink
```

### 2. Set up the server

```bash
cd server
npm install
cp .env.example .env       # then fill in your MongoDB URI
npx prisma generate        # generate Prisma client
npm run dev                 # starts on http://localhost:9281
```

### 3. Set up the client

```bash
cd client
npm install
npm run dev                 # starts on http://localhost:5173
```

## Environment Variables

See [`server/.env.example`](server/.env.example) for all required variables.

## Features

- Patient registration & login
- Doctor portal with dedicated login
- Admin portal with hardcoded credentials
- Admin can register new doctors
- Appointment booking & management
- Role-based access control (Patient / Doctor / Admin)
