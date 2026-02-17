# Code Snippet Manager
## By Jarom Craghead, Chandler Silk, and Ryan Wood

## Project Overview

Code Snippet Manager is a web-based application that allows developers to save, organize, and share reusable code snippets. The platform provides syntax highlighting, tagging capabilities, and search functionality to help developers maintain a personal library of useful code blocks they can reference across projects.

### Key Features
- User registration and login with JWT-based authentication
- Create, read, update, and delete code snippets
- Syntax highlighting for multiple programming languages (JavaScript, Python, Java, C++, SQL, HTML, CSS)
- Tag-based organization and search
- Public/private snippet visibility controls
- Personal snippet libraries tied to authenticated user accounts
- Copy-to-clipboard functionality

---

## System Description

Code Snippet Manager follows a three-tier client-server architecture. The frontend is a React single-page application that communicates with a Node.js/Express REST API backend over HTTP. The backend handles business logic, authentication, and all interactions with a PostgreSQL relational database. Users register and log in to receive a JWT token, which is stored client-side and sent with each subsequent request to authorize access to protected endpoints.

---

## Technologies Used

### Frontend
- **React (Vite)** – Component-based UI library for building the single-page application. Vite was chosen over Create React App for its significantly faster dev server startup and build times.
- **React Hooks (useState, useEffect)** – For managing component state and side effects such as fetching snippets on login.
- **Fetch API** – Native browser API used for all HTTP requests to the backend REST API.
- **react-syntax-highlighter** – Provides syntax highlighting for code snippets across multiple programming languages.

### Backend
- **Node.js** – JavaScript runtime for the server environment.
- **Express.js** – Lightweight, unopinionated web framework for building the REST API. Chosen specifically because it does not enforce a rigid architecture, giving us flexibility to restructure the system later in the semester.
- **bcrypt** – Used to hash and salt user passwords before storing them in the database.
- **jsonwebtoken (JWT)** – Handles stateless user authentication by issuing signed tokens on login/register.
- **dotenv** – Manages environment variables for database credentials and JWT secrets.
- **cors** – Middleware to allow cross-origin requests between the React frontend (port 3000) and Express backend (port 5000).

### Database
- **PostgreSQL** – Relational database for persistent storage of users, snippets, and tags. Chosen for its robustness, support for relational constraints (foreign keys), and strong compatibility with Node.js via the `pg` package.
- **pg (node-postgres)** – Node.js client for executing parameterized SQL queries against PostgreSQL.

### Development Tools
- **Git/GitHub** – Version control and team collaboration.
- **Nodemon** – Automatically restarts the backend server on file changes during development.
- **VS Code** – Primary code editor used by the team.

---

## Repository Structure

```
snippet-manager/
├── client/                  # React frontend (Vite)
│   ├── src/
│   │   ├── assets/
│   │   │   ├── Login.jsx    # Login page component
│   │   │   └── Register.jsx # Register page component
│   │   ├── App.jsx          # Main application component
│   │   ├── App.css          # Global styles
│   │   └── main.jsx         # React entry point
│   └── package.json
└── server/                  # Node.js/Express backend
    ├── server.js            # Express app and API routes
    ├── db.js                # PostgreSQL connection pool
    ├── .env                 # Environment variables (not committed)
    └── package.json
```

---

## Implemented Use Cases

The current prototype implements the following use cases to demonstrate the complete architecture:

1. **User Registration** – New users can create accounts with a username, email, and password. Exercises: frontend form → POST `/api/register` → bcrypt password hashing → database insert → JWT token returned.
2. **User Login** – Existing users authenticate with email and password. Demonstrates JWT token generation, bcrypt comparison, and session persistence via localStorage.
3. **Create Snippet** – Authenticated users can save new code snippets with a title, description, language, and code body. Exercises the full stack: UI form → POST `/api/snippets` with auth header → database insert → response rendered in UI.
4. **View Snippets** – Users can browse all of their saved snippets with syntax highlighting applied per language. Demonstrates: GET `/api/snippets` → database query → frontend rendering.
5. **Delete Snippet** – Users can remove snippets from their library. Demonstrates: DELETE `/api/snippets/:id` → database deletion → UI state update.
6. **Search Snippets** – Users can search by title, language, or tags. Demonstrates database querying and filtering logic through the REST API.

These use cases exercise all architectural layers: user interface, client-server communication via REST API, business logic and authentication processing, and full database CRUD operations.

---

## Setup Instructions

### Prerequisites
- Node.js v20+ (v22.11+ recommended)
- npm v9+
- PostgreSQL 15+

### Installation

1. **Clone the repository**
   ```bash
   git clone https://github.com/YOUR_REPO_URL/snippet-manager.git
   cd snippet-manager
   ```

2. **Set up the backend**
   ```bash
   cd server
   npm install
   ```

3. **Create a `.env` file inside the `server` folder**
   ```
   PORT=5000
   DB_USER=your_postgres_username
   DB_HOST=localhost
   DB_NAME=snippet_manager
   DB_PASSWORD=your_postgres_password
   DB_PORT=5432
   JWT_SECRET=mysecretkey123
   ```

4. **Set up the database**
   ```bash
   psql postgres
   ```
   ```sql
   CREATE DATABASE snippet_manager;
   \c snippet_manager

   CREATE TABLE users (
     id SERIAL PRIMARY KEY,
     username VARCHAR(50) UNIQUE NOT NULL,
     email VARCHAR(100) UNIQUE NOT NULL,
     password_hash VARCHAR(255) NOT NULL,
     created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
   );

   CREATE TABLE snippets (
     id SERIAL PRIMARY KEY,
     user_id INTEGER REFERENCES users(id),
     title VARCHAR(200) NOT NULL,
     description TEXT,
     code TEXT NOT NULL,
     language VARCHAR(50),
     is_public BOOLEAN DEFAULT false,
     created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
   );
   ```

5. **Start the backend**
   ```bash
   cd server
   npm run dev
   ```

6. **Set up and start the frontend** (in a new terminal)
   ```bash
   cd client
   npm install
   npm run dev
   ```

7. **Open the app** at `http://localhost:5173`

---

## Demo Video

https://youtu.be/B-sTZTASrWc

---

## Team Members and Contacts

- Jarom Craghead – jc4885@nau.edu
- Chandler Silk – cs2673@nau.edu
- Ryan Wood – rmw367@nau.edu
