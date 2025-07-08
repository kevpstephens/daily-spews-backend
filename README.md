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
- [Development Features](#development-features)
- [Deployment](#deployment)
- [Future Considerations](#future-considerations)

## <br><br>

# Features:

### 🔐 **Authentication & Security**

- **JWT Authentication** - JSON Web Tokens with HTTP-only cookies and Bearer token fallback
- **Password Security** - bcrypt hashing with secure storage and validation
- **User Registration** - Email validation with avatar upload support
- **Session Management** - Login/logout functionality with automatic token verification
- **Protected Routes** - Currently only `GET /api/users/me` requires authentication
- **Security Headers** - Helmet.js implementation with CSP, XSS protection, and security policies
- **Rate Limiting** - 100 requests per 15 minutes per IP with sliding window protection
- **Request Validation** - JSON parsing validation, size limits (10MB), and input sanitisation
- **CORS Security** - Whitelist-based origin validation with enhanced error handling
- **Security Features** - Input validation, SQL injection prevention, XSS protection

### 📰 **Article Management**

- Full CRUD operations for articles (Create, Read, Update, Delete)
- Article voting system with optimistic updates
- Topic-based filtering and categorisation
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
- Profile image cropping and optimisation

### 🏷️ **Topic System**

- Topic creation and management
- Topic-based article filtering
- Topic images and descriptions
- Hierarchical content organisation

### 📁 **File Upload & Storage**

- **Avatar Uploads** - Image file uploads (JPG, PNG, GIF) with automatic validation and processing
- **Article Images** - Optional article thumbnail uploads with URL storage and default fallbacks
- **Supabase Integration** - Cloud storage with public URL generation for frontend access
- **File Security** - Type validation, size limits, secure access controls, and automatic cleanup
- **Error Handling** - Comprehensive file upload error handling and validation

### 🛡️ **Error Handling & Validation**

- **Comprehensive Middleware** - Custom error handling across all endpoints
- **Error Types** - 400/401/403/404/422/500 status codes with descriptive messages
- **Input Validation** - Request sanitisation and data type validation
- **Database Constraints** - Proper handling of foreign key and unique violations
- **Custom Error Classes** - JWT validation, file upload, and constraint-specific errors
- **Graceful Responses** - Consistent JSON error format: `{"msg": "description", "status": 400}`

### 🧪 **Testing & Quality**

- **Comprehensive Test Suite** - 123 tests covering all endpoints and functionality
- **Supertest Integration** - API endpoint testing with real HTTP requests
- **Test Coverage** - Database operations, authentication flow, error handling, and file uploads
- **Test Environment** - Separate test database with isolated data and automatic cleanup
- **Airbnb ESLint Standards** - Industry-standard code linting and style enforcement
- **Prettier Code Formatting** - Consistent code style across entire codebase
- **Continuous Integration Ready** - Automated validation pipeline with lint + format + test

### ⚡ **Performance & Monitoring**

- **Gzip Compression** - Automatic response compression for reduced bandwidth usage
- **Request Logging** - Detailed HTTP request/response logging with timing metrics
- **Health Monitoring** - `/health` endpoint with uptime, environment, and version information
- **Environment Detection** - Development-specific middleware and enhanced debugging
- **Response Time Tracking** - Automatic timing for all API requests with performance insights
- **Connection Pooling** - PostgreSQL connection pooling for optimal database performance

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
createdb daily_spews_development
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
PGDATABASE=daily_spews_development
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

# Optional Configuration
DB_POOL_SIZE=10                      # Database connection pool size (default: 10)
LOG_POOL_STATS=true                  # Enable pool statistics logging (development only)
API_URL=http://localhost:9090        # Base URL for spam testing (development only)
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

| 🛠️ Tech Used           | 🔍 Purpose                            | 🧑🏻‍💻 Required Locally?    |
| ---------------------- | ------------------------------------- | ----------------------- |
| **Node.js**            | JavaScript runtime environment        | ✅ Yes                  |
| **Express**            | Web application framework             | ✅ Yes                  |
| **PostgreSQL**         | Local relational database (dev/test)  | ✅ Yes                  |
| **pg**                 | PostgreSQL client for Node.js         | ✅ Yes                  |
| **JWT**                | JSON Web Token authentication         | ✅ Yes                  |
| **bcrypt**             | Password hashing                      | ✅ Yes                  |
| **Multer**             | File upload middleware                | ✅ Yes                  |
| **Supabase**           | Production database & file storage    | ✅ Yes                  |
| **CORS**               | Cross-origin resource sharing         | ✅ Yes                  |
| **Cookie Parser**      | Cookie parsing middleware             | ✅ Yes                  |
| **Helmet**             | Security middleware for HTTP headers  | ✅ Yes                  |
| **Compression**        | Gzip compression middleware           | ✅ Yes                  |
| **Express Rate Limit** | API rate limiting middleware          | ✅ Yes                  |
| **Jest**               | Testing framework                     | 🔶 Only for development |
| **Supertest**          | HTTP testing library                  | 🔶 Only for development |
| **ESLint (Airbnb)**    | Code linting with Airbnb style guide  | 🔶 Only for development |
| **Prettier**           | Code formatting and style consistency | 🔶 Only for development |
| **Nodemon**            | Development server with auto-restart  | 🔶 Only for development |
| **dotenv**             | Environment variable management       | ✅ Yes                  |
| **uuid**               | Unique identifier generation          | ✅ Yes                  |
| **axios**              | HTTP client for API requests          | 🔶 Only for development |
| **pg-format**          | PostgreSQL query formatting           | ✅ Yes                  |

## <br><br>

# Project Structure:

```
daily-spews-backend/
├── __tests__/                      # Test files
│   ├── app.test.js                 # Main app tests
│   ├── articles.test.js            # Article endpoint tests
│   ├── auth.test.js                # Authentication tests
│   ├── comments.test.js            # Comment endpoint tests
│   ├── seed.test.js                # Database seeding tests
│   ├── topics.test.js              # Topic endpoint tests
│   ├── users.test.js               # User endpoint tests
│   └── utils.test.js               # Utility function tests

├── public/                         # Static files and images
│   └── images/                     # Static images
│       ├── daily-spews-logo.png    # Application logo
│       ├── default-profile.png     # Default user avatar
│       ├── topics/                 # Topic images
│       └── users/                  # User avatar images

├── scripts/                        # Utility scripts
│   └── spamScript.js               # Spam testing script

├── src/
│   ├── app/                            # Main application logic
│   │   ├── controllers/                # Route controllers
│   │   │   ├── api.controller.js       # API info controller
│   │   │   ├── articles.controller.js  # Article CRUD
│   │   │   ├── auth.controller.js      # Authentication
│   │   │   ├── comments.controller.js  # Comment CRUD
│   │   │   ├── topics.controller.js    # Topic CRUD
│   │   │   └── users.controller.js     # User CRUD
│   │   ├── middleware/                 # Express middleware
│   │   │   ├── auth.js                 # JWT authentication
│   │   │   └── multer.js               # File upload handling
│   │   ├── models/                     # Data models
│   │   │   ├── articles.model.js       # Article data operations
│   │   │   ├── comments.model.js       # Comment data operations
│   │   │   ├── topics.model.js         # Topic data operations
│   │   │   └── users.model.js          # User data operations
│   │   └── routes/                     # API routes
│   │       ├── api.routes.js           # Main API router
│   │       ├── articles.routes.js      # Article endpoints
│   │       ├── auth.routes.js          # Authentication endpoints
│   │       ├── comments.routes.js      # Comment endpoints
│   │       ├── topics.routes.js        # Topic endpoints
│   │       └── users.routes.js         # User endpoints
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
│   │   ├── logger.js              # Logging utility
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

| Script                 | Description                           |
| ---------------------- | ------------------------------------- |
| `npm start`            | Start production server               |
| `npm run dev`          | Start development server with nodemon |
| `npm test`             | Run test suite                        |
| `npm run test-seed`    | Run database seeding tests            |
| `npm run setup-dbs`    | Setup PostgreSQL databases            |
| `npm run seed-dev`     | Seed development database             |
| `npm run seed-prod`    | Seed production database              |
| `npm run lint`         | Run ESLint to check code style        |
| `npm run lint:fix`     | Run ESLint with automatic fixes       |
| `npm run format`       | Format code with Prettier             |
| `npm run format:check` | Check code formatting with Prettier   |
| `npm run validate`     | Run lint, format check, and tests     |
| `npm run prepare`      | Setup git hooks with Husky (auto-run) |
| `npm run spam:dev`     | Stress-test database connection pool  |

## <br><br>

# API Endpoints:

### **Authentication**

| Method  | Endpoint                       | Description          |
| ------- | ------------------------------ | -------------------- |
| `POST`  | `/api/auth/register`           | Register a new user  |
| `POST`  | `/api/auth/login`              | Login user           |
| `POST`  | `/api/auth/logout`             | Logout user          |
| `PATCH` | `/api/auth/:username/password` | Update user password |

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

| Method | Endpoint                      | Description                    |
| ------ | ----------------------------- | ------------------------------ |
| `GET`  | `/api/users`                  | Get all users                  |
| `GET`  | `/api/users/me`               | Get current authenticated user |
| `GET`  | `/api/users/:username`        | Get user by username           |
| `POST` | `/api/users/:username/avatar` | Upload user avatar             |

### **API Information**

| Method | Endpoint | Description                     |
| ------ | -------- | ------------------------------- |
| `GET`  | `/api`   | Get API endpoints documentation |

### **Health & Monitoring**

| Method | Endpoint  | Description                                       |
| ------ | --------- | ------------------------------------------------- |
| `GET`  | `/health` | Get system health status, uptime, and environment |

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

# Development Features:

### **Development Tools**

- Nodemon for automatic server restart
- Environment-specific configurations
- Development data seeding
- Debug logging and error tracking

### **Performance Optimisations**

- Database query optimisation
- Connection pooling
- Efficient data fetching
- Caching strategies

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

### **📈 Scalability & Performance**

- [ ] **Database Optimisation** - Implement database indexing strategies for articles/comments queries
- [ ] **Caching Layer** - Add Redis for frequently accessed articles and user sessions
- [ ] **CDN Optimisation** - Configure Supabase CDN settings for optimal global delivery
- [ ] **Database Read Replicas** - Scale read operations across multiple database instances
- [ ] **Advanced Compression** - Brotli compression and content-type specific optimisation

### **🔒 Security & Compliance**

- [ ] **Enhanced Rate Limiting** - User-specific rate limiting and advanced protection strategies
- [ ] **Content Moderation** - ML-powered content filtering for articles and comments
- [ ] **GDPR Compliance** - User data export/deletion endpoints and privacy controls
- [ ] **Advanced Security Headers** - HSTS, CSRF protection, and additional security policies
- [ ] **JWT Refresh Tokens** - Implement refresh token rotation for enhanced security

### **📊 Monitoring & DevOps**

- [ ] **Advanced Application Monitoring** - DataDog/New Relic integration for performance insights
- [ ] **Health Check Dashboard** - Real-time system status and dependency monitoring dashboard
- [ ] **Automated Alerts** - Slack/email notifications for system errors and outages
- [ ] **Load Testing** - K6/Artillery stress testing for production readiness
- [ ] **Deployment Optimisation** - Render preview environments and automated rollback strategies

### **✨ User Experience & Features**

- [ ] **Real-time Features** - WebSocket integration for live comments and notifications
- [ ] **Advanced Search** - PostgreSQL full-text search with GIN indexes and ranking
- [ ] **Mobile API Optimisation** - REST endpoint optimisation with field selection and response compression
- [ ] **Internationalisation** - Multi-language support with i18n framework
- [ ] **Analytics Integration** - User behavior tracking for product insights

<br>
<br>
<br>

> This portfolio project was created as part of a Digital Skills Bootcamp in Software Engineering provided by [Northcoders](https://northcoders.com/)
