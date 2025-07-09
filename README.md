<!-- markdownlint-disable MD033 MD041 MD026 MD012 MD024 MD001 MD040 -->

<!-- {
  "default": true,
  "MD033": false,  // Allow inline HTML (e.g. <br>, <img>, <div>)
  "MD041": false,  // Don't force first line to be a top-level heading
  "MD026": false,  // Allow trailing punctuation in headings
  "MD012": false,  // Allow multiple consecutive blank lines
  "MD024": false,  // Allow duplicate headings
  "MD001": false,  // Don't enforce heading increments (h1 -> h2 -> h3...)
  "MD040": false   // Don't require language for fenced code blocks
} -->

<div align="center">

# Daily Spews - Backend API

[![Node.js](https://img.shields.io/badge/Node.js-18.x-339933?logo=node.js&logoColor=white)](https://nodejs.org/)
&nbsp;
[![Express](https://img.shields.io/badge/Express-5.1.0-000000?logo=express&logoColor=white)](https://expressjs.com/)
&nbsp;
[![PostgreSQL](https://img.shields.io/badge/PostgreSQL-15+-336791?logo=postgresql&logoColor=white)](https://www.postgresql.org/)
&nbsp;
[![Jest](https://img.shields.io/badge/Jest-27.5.1-C21325?logo=jest&logoColor=white)](https://jestjs.io/)
&nbsp;
[![ESLint](https://img.shields.io/badge/ESLint-Airbnb-4B32C3?logo=eslint&logoColor=white)](https://eslint.org/)
&nbsp;
[![Supabase](https://img.shields.io/badge/Supabase-2.50.2-3ECF8E?logo=supabase&logoColor=white)](https://supabase.com/)
&nbsp;
[![Last Commit](https://img.shields.io/github/last-commit/kevpstephens/daily-spews-backend)](https://github.com/kevpstephens/daily-spews-backend/commits/main)

</div>

> - **Daily Spews** is a modern RESTful API for a Reddit-style satirical news platform.
> - Built with **Node.js**, **Express**, and **PostgreSQL**, featuring JWT authentication, file uploads, comprehensive security middleware, and 123+ tests.
> - Developed as part of the **Northcoders Software Engineering Bootcamp**.

<br>
<p align="center">
  <img src="public/images/daily-spews-logo.png" alt="Daily Spews Logo" width="150" height="auto"/>
</p>
<br>

A robust, modern RESTful API for Daily Spews - a satirical news platform built as part of the Northcoders Software Development Bootcamp.

- Built with Node.js, Express, and PostgreSQL for scalable, secure server-side operations
- Features comprehensive JWT authentication, file uploads, and data validation
- Includes full CRUD operations for articles, comments, users, and topics with voting systems
- Production-grade security with rate limiting, CORS protection, and input sanitisation
- Extensive test coverage with 123+ tests and comprehensive error handling
- Serves data to the Daily Spews React frontend with optimised API endpoints

<br>

🔗 **Live API** - [https://daily-spews-api.onrender.com/api](https://daily-spews-api.onrender.com/api) <br>
🔗 **Frontend App** - [https://daily-spews.onrender.com](https://daily-spews.onrender.com) <br>
🖥️ **Frontend Repo:** [daily-spews-frontend](https://github.com/kevpstephens/daily-spews-frontend)

## <br><br>

# Index:

- [Key Features](#key-features)
- [Requirements](#requirements)
- [Installation & Setup](#installation--setup)
- [Tech Stack](#tech-stack)
- [Project Structure](#project-structure)
- [Available Scripts](#available-scripts)
- [API Endpoints](#api-endpoints)
- [Database Schema](#database-schema)
- [Deployment](#deployment)
- [Future Considerations](#future-considerations)

## <br><br>

# Key Features:

### 🔐 **Authentication & Security**

- **JWT Authentication** with HTTP-only cookies and Bearer token fallback
- **Password Security** using bcrypt hashing and secure validation
- **Security Middleware** - Helmet.js with CSP, XSS protection, and security headers
- **Rate Limiting** - 100 requests per 15 minutes with sliding window protection
- **CORS Security** - Whitelist-based origin validation with enhanced error handling

### 📰 **Content Management**

- **Full CRUD Operations** for articles, comments, users, and topics
- **Voting System** with optimistic updates for articles and comments
- **Topic-based Filtering** and categorisation with pagination
- **File Upload Support** for user avatars and article thumbnails via Supabase
- **Comment Threading** with cascade deletion and author attribution

### 🛡️ **Error Handling & Validation**

- **Comprehensive Middleware** with custom error handling across all endpoints
- **Input Validation** - Request sanitisation, type validation, and SQL injection prevention
- **Graceful Responses** - Consistent JSON error format with proper HTTP status codes
- **Database Constraints** - Foreign key and unique violation handling

### 🧪 **Testing & Quality**

- **123 Comprehensive Tests** covering all endpoints, authentication, and file uploads
- **Supertest Integration** with real HTTP requests and isolated test environment
- **Airbnb ESLint Standards** with Prettier code formatting
- **Continuous Integration Ready** with automated validation pipeline

### ⚡ **Performance & Monitoring**

- **Gzip Compression** for reduced bandwidth usage
- **Request Logging** with detailed timing metrics and performance insights
- **Health Monitoring** with `/health` endpoint and environment detection
- **Connection Pooling** - PostgreSQL optimisation for database performance

## <br><br>

# Requirements:

- [**Node.js**](http://nodejs.org): v18.x or higher
- [**PostgreSQL**](https://www.postgresql.org/): v15 or higher
- [**npm**](https://www.npmjs.com/) or [**yarn**](https://yarnpkg.com/): Package manager

## <br><br>

# Installation & Setup:

### 1️⃣ Clone & Install

```bash
git clone https://github.com/kevpstephens/daily-spews-backend.git
cd daily-spews-backend
npm install
```

### 2️⃣ Setup Database

```bash
# Create databases
createdb daily_spews_development
createdb daily_spews_test
npm run setup-dbs
```

### 3️⃣ Environment Variables

Create a `.env` file:

```shell
# Database Configuration
PGUSER=your_username
PGHOST=localhost
PGPASSWORD=your_password
PGDATABASE=daily_spews_development
PGDATABASE_TEST=daily_spews_test
PGPORT=5432

# Production Database (Supabase)
DATABASE_URL=your_supabase_database_url

# Authentication
JWT_SECRET=your_super_secret_jwt_key_here

# File Storage (Supabase)
SUPABASE_URL=your_supabase_project_url
SUPABASE_SERVICE_ROLE_KEY=your_supabase_service_role_key

# Server
PORT=9090
NODE_ENV=development
```

### 4️⃣ Seed & Start

```bash
npm run seed-dev    # Populate database
npm run dev         # Start development server
npm test            # Run test suite
```

The API will be available at `http://localhost:9090/api`

## <br><br>

# Tech Stack:

| Technology            | Purpose                              |
| --------------------- | ------------------------------------ |
| **Node.js & Express** | Server runtime and web framework     |
| **PostgreSQL & pg**   | Database and Node.js client          |
| **Supabase**          | Production database & file storage   |
| **JWT & bcrypt**      | Authentication and password security |
| **Multer**            | File upload middleware               |
| **Helmet & CORS**     | Security and cross-origin handling   |
| **Jest & Supertest**  | Testing framework and HTTP testing   |
| **ESLint & Prettier** | Code linting and formatting          |

## <br><br>

# Project Structure:

```
daily-spews-backend/
├── __tests__/                      # Test suite
├── public/images/                  # Static assets and user uploads
├── src/
│   ├── app/
│   │   ├── controllers/            # Route controllers (CRUD operations)
│   │   ├── middleware/             # Auth & file upload middleware
│   │   ├── models/                 # Data access layer
│   │   └── routes/                 # API endpoint definitions
│   ├── db/                         # Database config, schemas & seeding
│   ├── errors/                     # Custom error handling
│   ├── utils/                      # Logging, Supabase & upload utilities
│   ├── app.js                      # Express app configuration
│   └── index.js                    # Server entry point
├── endpoints.json                  # API documentation
└── package.json                    # Dependencies and scripts
```

## <br><br>

# Available Scripts:

| Script              | Description                           |
| ------------------- | ------------------------------------- |
| `npm start`         | Start production server               |
| `npm run dev`       | Start development server with nodemon |
| `npm test`          | Run comprehensive test suite          |
| `npm run setup-dbs` | Setup PostgreSQL databases            |
| `npm run seed-dev`  | Seed development database             |
| `npm run lint`      | Run ESLint code style checks          |
| `npm run format`    | Format code with Prettier             |
| `npm run validate`  | Run lint, format check, and tests     |

## <br><br>

# API Endpoints:

### **Authentication**

| Method  | Endpoint                       | Description       |
| ------- | ------------------------------ | ----------------- |
| `POST`  | `/api/auth/register`           | Register new user |
| `POST`  | `/api/auth/login`              | User login        |
| `POST`  | `/api/auth/logout`             | User logout       |
| `PATCH` | `/api/auth/:username/password` | Update password   |

### **Articles**

| Method   | Endpoint                    | Description                                   |
| -------- | --------------------------- | --------------------------------------------- |
| `GET`    | `/api/articles`             | Get articles (pagination, sorting, filtering) |
| `GET`    | `/api/articles/:article_id` | Get single article                            |
| `POST`   | `/api/articles`             | Create new article                            |
| `PATCH`  | `/api/articles/:article_id` | Update article votes                          |
| `DELETE` | `/api/articles/:article_id` | Delete article                                |

### **Comments**

| Method   | Endpoint                             | Description          |
| -------- | ------------------------------------ | -------------------- |
| `GET`    | `/api/articles/:article_id/comments` | Get article comments |
| `POST`   | `/api/articles/:article_id/comments` | Post new comment     |
| `PATCH`  | `/api/comments/:comment_id`          | Update comment votes |
| `DELETE` | `/api/comments/:comment_id`          | Delete comment       |

### **Topics & Users**

| Method | Endpoint                      | Description                    |
| ------ | ----------------------------- | ------------------------------ |
| `GET`  | `/api/topics`                 | Get all topics                 |
| `POST` | `/api/topics`                 | Create new topic               |
| `GET`  | `/api/users`                  | Get all users                  |
| `GET`  | `/api/users/me`               | Get current authenticated user |
| `GET`  | `/api/users/:username`        | Get user by username           |
| `POST` | `/api/users/:username/avatar` | Upload user avatar             |

### **System**

| Method | Endpoint  | Description              |
| ------ | --------- | ------------------------ |
| `GET`  | `/api`    | API documentation        |
| `GET`  | `/health` | System health and status |

## <br><br>

# Database Schema:

### **Core Tables**

```sql
-- Topics
CREATE TABLE topics (
  slug VARCHAR PRIMARY KEY,
  description VARCHAR,
  img_url VARCHAR(1000)
);

-- Users
CREATE TABLE users (
  username VARCHAR PRIMARY KEY,
  name VARCHAR,
  email TEXT UNIQUE NOT NULL,
  password_hash TEXT NOT NULL,
  avatar_url VARCHAR(1000),
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Articles
CREATE TABLE articles (
  article_id SERIAL PRIMARY KEY,
  title VARCHAR,
  topic VARCHAR REFERENCES topics(slug),
  author VARCHAR REFERENCES users(username),
  body TEXT,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  votes INT DEFAULT 0,
  article_img_url VARCHAR(1000)
);

-- Comments
CREATE TABLE comments (
  comment_id SERIAL PRIMARY KEY,
  article_id INT REFERENCES articles(article_id) ON DELETE CASCADE,
  body TEXT,
  votes INT DEFAULT 0,
  author VARCHAR REFERENCES users(username),
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
```

## <br><br>

# Deployment:

### **Environment Configuration**

- **Development/Test**: Local PostgreSQL databases
- **Production**: Supabase PostgreSQL with file storage
- **Platform**: Render with automatic GitHub deployments

### **Production Features**

- Environment-specific configurations
- Health check endpoints for monitoring
- Automatic database migrations
- Static file serving and CDN integration

## <br><br>

# Future Considerations:

### **🚀 Next Development Phase**

- **Database optimisation** with indexing strategies and query performance improvements
- **Redis caching layer** for frequently accessed articles and user sessions
- **Real-time features** using WebSocket integration for live comments and voting
- **Full-text search** with PostgreSQL GIN indexes for enhanced article discovery
- **Enhanced rate limiting** with user-specific controls and API throttling
- **JWT refresh tokens** for improved authentication security and session management

<br>
<br>
<br>

> This portfolio project was created as part of a Digital Skills Bootcamp in Software Engineering provided by [Northcoders](https://northcoders.com/)
