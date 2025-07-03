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
[![Supabase](https://img.shields.io/badge/Supabase-2.50.2-3ECF8E?logo=supabase&logoColor=white)](https://supabase.com/)
&nbsp;
[![Last Commit](https://img.shields.io/github/last-commit/kevpstephens/daily-spews-backend)](https://github.com/kevpstephens/daily-spews-backend/commits/main)

</div>

> - **Daily Spews** is a full-stack, Reddit-style satirical news platform built using **Node.js**, **Express**, and **PostgreSQL** with **Supabase** for production database and file storage.
> - The backend provides a robust RESTful API with JWT authentication, file uploads, comprehensive error handling, and full CRUD operations for articles, comments, users, and topics.
> - Built as part of the **Northcoders Software Engineering Bootcamp**, the project showcases professional-grade backend architecture, security best practices, and comprehensive testing.

<br>
<p align="center">
  <img src="public/images/daily-spews-logo.png" alt="Daily Spews Logo" width="150" height="auto"/>
</p>
<br>

A modern, scalable Node.js/Express backend API for Daily Spews - a satirical news application built as part of the Northcoders Software Development Bootcamp. <br>

- Built with **Node.js**, **Express**, and **PostgreSQL** for robust data management
- Features JWT-based authentication with secure cookie handling
- Includes file upload functionality with Supabase storage integration
- Uses local PostgreSQL for development/testing and Supabase PostgreSQL for production
- Comprehensive error handling and input validation
- Full CRUD operations for articles, comments, users, and topics
- Extensive test coverage with Jest and Supertest
- RESTful API design with proper HTTP status codes and responses
- CORS configuration for secure cross-origin requests

<br>

🔗 **Live API** - [https://daily-spews-api.onrender.com/api](https://daily-spews-api.onrender.com/api) <br>
🔗 **Frontend App** - [https://daily-spews.onrender.com](https://daily-spews.onrender.com) <br>
🖥️ **Frontend Repo:** [daily-spews-frontend](https://github.com/kevpstephens/daily-spews-frontend)

## <br><br>

# Index:

- [Features](#features)
- [Requirements](#requirements)
- [Installation & Setup](#installation--setup)
- [Tech Stack](#tech-stack)
- [Project Structure](#project-structure)
- [Available Scripts](#available-scripts)
- [API Endpoints](#api-endpoints)
- [Database Schema](#database-schema)
- [Authentication](#authentication)
- [File Upload](#file-upload)
- [Error Handling](#error-handling)
- [Testing](#testing)

## <br><br>

# Features:

### 🔐 **Authentication & Security**

- JWT-based authentication with secure cookie handling
- Password hashing using bcrypt for secure storage
- User registration with email validation
- Login/logout functionality with session management
- Token verification middleware for protected routes
- CORS configuration for secure cross-origin requests

### 📰 **Article Management**

- Full CRUD operations for articles (Create, Read, Update, Delete)
- Article voting system with optimistic updates
- Topic-based filtering and categorization
- Image upload support for article thumbnails
- Pagination and sorting capabilities
- Comment count aggregation

### 💬 **Comment System**

- Create, read, update, and delete comments
- Comment voting system
- Pagination for comment lists
- Cascade deletion when articles are removed
- Author attribution and timestamps

### 👤 **User Management**

- User registration with avatar upload support
- User profile management
- Avatar upload and storage via Supabase
- User authentication and session management
- Profile image cropping and optimization

### 🏷️ **Topic System**

- Topic creation and management
- Topic-based article filtering
- Topic images and descriptions
- Hierarchical content organization

### 📁 **File Upload & Storage**

- Supabase integration for file storage
- Avatar upload with image processing
- Article image upload support
- Secure file access and public URLs
- File validation and error handling

### 🛡️ **Error Handling & Validation**

- Comprehensive error handling middleware
- Custom error classes and messages
- Input validation and sanitization
- Database constraint handling
- Graceful error responses

### 🧪 **Testing & Quality**

- Comprehensive test suite with Jest
- Supertest for API endpoint testing
- Test data seeding and cleanup
- Separate test database configuration
- Continuous integration ready

## <br><br>

# Requirements:

To run this project locally, ensure you have the following installed:

- [**Node.js**](http://nodejs.org): v18.x or higher
- [**PostgreSQL**](https://www.postgresql.org/): v15 or higher
- [**npm**](https://www.npmjs.com/) or [**yarn**](https://yarnpkg.com/): Package manager

<br>

> 💡 **Note:** Full **tech stack** listed <u>[below](#tech-stack)</u>.

## <br><br>

# Installation & Setup:

### 1️⃣ - 🧬 Clone the repo:

> Clone the repo down to your local machine using Git

```bash
git clone https://github.com/kevpstephens/daily-spews-backend.git
cd daily-spews-backend
```

<br>

### 2️⃣ - 📦 Install dependencies:

> Install all project dependencies listed in the package.json

```bash
npm install
```

<br>

### 3️⃣ - 🗄️ Setup PostgreSQL database:

> Create and configure your PostgreSQL database

```bash
# Create database
createdb daily_spews_dev
createdb daily_spews_test

# Run database setup script
npm run setup-dbs
```

<br>

### 4️⃣ - ⚙️ Setup environment variables:

> Create a `.env` file in your project's root directory:

```shell
# .env

# Database Configuration (Development/Test)
PGUSER=your_username
PGHOST=localhost
PGPASSWORD=your_password
PGDATABASE=daily_spews_dev
PGDATABASE_TEST=daily_spews_test
PGPORT=5432

# Database Configuration (Production - Supabase)
DATABASE_URL=your_supabase_database_url

# JWT Configuration
JWT_SECRET=your_super_secret_jwt_key_here

# Supabase Configuration (for file uploads)
SUPABASE_URL=your_supabase_project_url
SUPABASE_SERVICE_ROLE_KEY=your_supabase_service_role_key

# Server Configuration
PORT=9090
NODE_ENV=development
```

<br>

### 5️⃣ - 🌱 Seed the database:

> Populate the database with development data

```bash
npm run seed-dev
```

<br>

### 6️⃣ - 🚀 Start development server:

> Start the development server with hot reload

```bash
npm run dev
```

> The API will be available at `http://localhost:9090/api`

<br>

### 7️⃣ - 🧪 Run tests:

> Run the test suite

```bash
npm test
```

<br>

### 8️⃣ - 🏗️ Start production server:

> Start the production server

```bash
npm start
```

## <br><br>

# Tech Stack:

<br>

| 🛠️ Tech Used      | 🔍 Purpose                           | 🧑🏻‍💻 Required Locally?    |
| ----------------- | ------------------------------------ | ----------------------- |
| **Node.js**       | JavaScript runtime environment       | ✅ Yes                  |
| **Express**       | Web application framework            | ✅ Yes                  |
| **PostgreSQL**    | Local relational database (dev/test) | ✅ Yes                  |
| **pg**            | PostgreSQL client for Node.js        | ✅ Yes                  |
| **JWT**           | JSON Web Token authentication        | ✅ Yes                  |
| **bcrypt**        | Password hashing                     | ✅ Yes                  |
| **Multer**        | File upload middleware               | ✅ Yes                  |
| **Supabase**      | Production database & file storage   | ✅ Yes                  |
| **CORS**          | Cross-origin resource sharing        | ✅ Yes                  |
| **Cookie Parser** | Cookie parsing middleware            | ✅ Yes                  |
| **Jest**          | Testing framework                    | 🔶 Only for development |
| **Supertest**     | HTTP testing library                 | 🔶 Only for development |
| **Nodemon**       | Development server with auto-restart | 🔶 Only for development |
| **dotenv**        | Environment variable management      | ✅ Yes                  |
| **uuid**          | Unique identifier generation         | ✅ Yes                  |

## <br><br>

# Project Structure:

```
daily-spews-backend/
├── __tests__/                     # Test files
│   ├── app.test.js               # Main app tests
│   ├── articles.test.js          # Article endpoint tests
│   ├── auth.test.js              # Authentication tests
│   ├── comments.test.js          # Comment endpoint tests
│   ├── seed.test.js              # Database seeding tests
│   ├── topics.test.js            # Topic endpoint tests
│   ├── users.test.js             # User endpoint tests
│   └── utils.test.js             # Utility function tests

├── public/                        # Static files and images
│   └── images/                    # Static images
│       ├── daily-spews-logo.png   # Application logo
│       ├── default-profile.png    # Default user avatar
│       ├── topics/                # Topic images
│       └── users/                 # User avatar images

├── scripts/                       # Utility scripts
│   └── spamScript.js             # Spam testing script

├── src/
│   ├── app/                       # Main application logic
│   │   ├── controllers/           # Route controllers
│   │   │   ├── api.controller.js  # API info controller
│   │   │   ├── articles.controller.js # Article CRUD
│   │   │   ├── auth.controller.js # Authentication
│   │   │   ├── comments.controller.js # Comment CRUD
│   │   │   ├── topics.controller.js # Topic CRUD
│   │   │   └── users.controller.js # User CRUD
│   │   ├── middleware/            # Express middleware
│   │   │   ├── auth.js            # JWT authentication
│   │   │   └── multer.js          # File upload handling
│   │   ├── models/                # Data models
│   │   │   ├── articles.model.js  # Article data operations
│   │   │   ├── comments.model.js  # Comment data operations
│   │   │   ├── topics.model.js    # Topic data operations
│   │   │   └── users.model.js     # User data operations
│   │   └── routes/                # API routes
│   │       ├── api.routes.js      # Main API router
│   │       ├── articles.routes.js # Article endpoints
│   │       ├── auth.routes.js     # Authentication endpoints
│   │       ├── comments.routes.js # Comment endpoints
│   │       ├── topics.routes.js   # Topic endpoints
│   │       └── users.routes.js    # User endpoints
│   ├── db/                        # Database configuration
│   │   ├── connection.js          # Database connection
│   │   ├── queries.js             # SQL query functions
│   │   ├── schemas/               # Database schemas
│   │   │   └── createTables.js    # Table creation scripts
│   │   ├── seeds/                 # Database seeding
│   │   │   ├── run-seed.js        # Seed execution script
│   │   │   ├── seed.js            # Main seeding logic
│   │   │   └── utils.js           # Seeding utilities
│   │   ├── data/                  # Seed data
│   │   │   ├── development-data/  # Development data
│   │   │   ├── production-data/   # Production data
│   │   │   └── test-data/         # Test data
│   │   └── setup-dbs.sql          # Database setup script
│   ├── errors/                    # Error handling
│   │   └── errorHandlers.js       # Custom error handlers
│   ├── utils/                     # Utility functions
│   │   ├── supabaseClient.js      # Supabase configuration
│   │   └── uploadToSupabase.js    # File upload utilities
│   ├── app.js                     # Express app configuration
│   └── index.js                   # Server entry point

├── endpoints.json                 # API documentation
├── error-handling.md              # Error handling documentation
├── package.json                   # Dependencies and scripts
└── README.md                      # Project documentation
```

## <br><br>

# Available Scripts:

| Script              | Description                           |
| ------------------- | ------------------------------------- |
| `npm start`         | Start production server               |
| `npm run dev`       | Start development server with nodemon |
| `npm test`          | Run test suite                        |
| `npm run test-seed` | Run database seeding tests            |
| `npm run setup-dbs` | Setup PostgreSQL databases            |
| `npm run seed-dev`  | Seed development database             |
| `npm run seed-prod` | Seed production database              |
| `npm run spam`      | Run spam testing script               |

## <br><br>

# API Endpoints:

### **Authentication**

| Method | Endpoint             | Description         |
| ------ | -------------------- | ------------------- |
| `POST` | `/api/auth/register` | Register a new user |
| `POST` | `/api/auth/login`    | Login user          |
| `POST` | `/api/auth/logout`   | Logout user         |

### **Articles**

| Method   | Endpoint                    | Description                                            |
| -------- | --------------------------- | ------------------------------------------------------ |
| `GET`    | `/api/articles`             | Get all articles (with pagination, sorting, filtering) |
| `GET`    | `/api/articles/:article_id` | Get single article                                     |
| `POST`   | `/api/articles`             | Create new article                                     |
| `PATCH`  | `/api/articles/:article_id` | Update article votes                                   |
| `DELETE` | `/api/articles/:article_id` | Delete article                                         |

### **Comments**

| Method   | Endpoint                             | Description              |
| -------- | ------------------------------------ | ------------------------ |
| `GET`    | `/api/articles/:article_id/comments` | Get comments for article |
| `POST`   | `/api/articles/:article_id/comments` | Post new comment         |
| `PATCH`  | `/api/comments/:comment_id`          | Update comment votes     |
| `DELETE` | `/api/comments/:comment_id`          | Delete comment           |

### **Topics**

| Method | Endpoint      | Description      |
| ------ | ------------- | ---------------- |
| `GET`  | `/api/topics` | Get all topics   |
| `POST` | `/api/topics` | Create new topic |

### **Users**

| Method | Endpoint                      | Description          |
| ------ | ----------------------------- | -------------------- |
| `GET`  | `/api/users`                  | Get all users        |
| `GET`  | `/api/users/:username`        | Get user by username |
| `POST` | `/api/users/:username/avatar` | Upload user avatar   |

### **API Information**

| Method | Endpoint | Description                     |
| ------ | -------- | ------------------------------- |
| `GET`  | `/api`   | Get API endpoints documentation |

## <br><br>

# Database Schema:

### **Topics Table**

```sql
CREATE TABLE topics (
  slug VARCHAR PRIMARY KEY,
  description VARCHAR,
  img_url VARCHAR(1000)
);
```

### **Users Table**

```sql
CREATE TABLE users (
  username VARCHAR PRIMARY KEY,
  name VARCHAR,
  email TEXT UNIQUE NOT NULL,
  password_hash TEXT NOT NULL,
  avatar_url VARCHAR(1000),
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
```

### **Articles Table**

```sql
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
```

### **Comments Table**

```sql
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

# Authentication:

The API uses JWT (JSON Web Tokens) for authentication with the following features:

### **Token Storage**

- Primary: HTTP-only cookies for security
- Fallback: Authorization header (Bearer token)
- Automatic token verification on protected routes

### **Security Features**

- Password hashing with bcrypt
- JWT secret stored in environment variables
- Token expiration handling
- Secure cookie configuration

### **Protected Routes**

- Article creation, updating, and deletion
- Comment creation, updating, and deletion
- User avatar uploads
- Topic creation

### **Authentication Flow**

1. User registers/logs in with email and password
2. Server validates credentials and creates JWT
3. Token stored in HTTP-only cookie
4. Subsequent requests automatically include token
5. Middleware verifies token on protected routes

## <br><br>

# File Upload:

The API integrates with Supabase for file storage:

### **Avatar Uploads**

- Supports image file uploads (JPG, PNG, GIF)
- Automatic file validation and processing
- Supabase storage integration
- Public URL generation for frontend access

### **Article Images**

- Optional article thumbnail uploads
- Image URL storage in database
- Default image fallbacks

### **File Security**

- File type validation
- Size limits and restrictions
- Secure file access controls
- Automatic cleanup of old files

## <br><br>

# Error Handling:

The API implements comprehensive error handling:

### **Error Types**

- **400 Bad Request**: Invalid input data
- **401 Unauthorized**: Missing or invalid authentication
- **403 Forbidden**: Insufficient permissions
- **404 Not Found**: Resource not found
- **422 Unprocessable Entity**: Validation errors
- **500 Internal Server Error**: Server errors

### **Error Response Format**

```json
{
  "msg": "Error message description",
  "status": 400
}
```

### **Custom Error Handlers**

- Database constraint violations
- JWT token validation errors
- File upload errors
- Input validation errors

## <br><br>

# Testing:

The project includes comprehensive testing:

### **Test Coverage**

- API endpoint testing with Supertest
- Database operation testing
- Authentication flow testing
- Error handling testing
- File upload testing

### **Test Environment**

- Separate test database
- Isolated test data
- Automatic cleanup between tests
- Mock external services

### **Running Tests**

```bash
# Run all tests
npm test

# Run specific test file
npm test articles.test.js

# Run tests with coverage
npm test -- --coverage
```

### **Test Data**

- Separate test data files
- Consistent test fixtures
- Database seeding for tests
- Clean state between test runs

## <br><br>

# Development Features:

### **Development Tools**

- Nodemon for automatic server restart
- Environment-specific configurations
- Development data seeding
- Debug logging and error tracking

### **Code Quality**

- ESLint configuration
- Consistent code formatting
- Error handling best practices
- Security best practices

### **Performance Optimizations**

- Database query optimization
- Connection pooling
- Efficient data fetching
- Caching strategies

### **Security Features**

- Input validation and sanitization
- SQL injection prevention
- XSS protection
- CORS configuration
- Secure cookie handling

## <br><br>

# Deployment:

### **Environment Variables**

- Database connection strings
- JWT secrets
- Supabase credentials
- CORS origins
- Port configuration

### **Production Considerations**

- Environment-specific configurations
- Database migration scripts
- Health check endpoints
- Logging and monitoring
- Error tracking

### **Deployment Platform**

- **Render** - Current deployment platform
  - Automatic deployments from GitHub
  - Static file serving
  - Environment variable management

### **Database Architecture**

- **Development/Test**: Local PostgreSQL databases
- **Production**: Supabase PostgreSQL database
- **File Storage**: Supabase Storage for avatars and images

## <br><br>

# Future Considerations:

- [ ] Add rate limiting for API endpoints
- [ ] Implement real-time notifications with WebSockets
- [ ] Add search functionality with full-text search
- [ ] Implement user roles and permissions
- [ ] Add API versioning
- [ ] Enhance caching with Redis
- [ ] Add comprehensive logging and monitoring
- [ ] Implement automated backups
- [ ] Add API documentation with Swagger/OpenAPI
- [ ] Implement automated testing in CI/CD pipeline

<br>
<br>
<br>

> This portfolio project was created as part of a Digital Skills Bootcamp in Software Engineering provided by [Northcoders](https://northcoders.com/)
