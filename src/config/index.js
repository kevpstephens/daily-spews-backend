const path = require("path");

// Environment configuration
const config = {
  // Server configuration
  port: process.env.PORT || 9090,
  nodeEnv: process.env.NODE_ENV || "development",

  // Database configuration
  database: {
    url: process.env.DATABASE_URL,
    host: process.env.PGHOST || "localhost",
    port: process.env.PGPORT || 5432,
    user: process.env.PGUSER,
    password: process.env.PGPASSWORD,
    database: process.env.PGDATABASE,
    testDatabase: process.env.PGDATABASE_TEST,
    maxConnections: process.env.NODE_ENV === "production" ? 2 : 10,
  },

  // Authentication
  jwt: {
    secret: process.env.JWT_SECRET,
    expiresIn: "1h",
  },

  // Supabase configuration
  supabase: {
    url: process.env.SUPABASE_URL,
    serviceRoleKey: process.env.SUPABASE_SERVICE_ROLE_KEY,
  },

  // Admin configuration
  admin: {
    password: process.env.ADMIN_PASSWORD || "admin123",
  },

  // CORS configuration
  cors: {
    origin: process.env.CORS_ORIGIN || true,
    credentials: true,
  },

  // File upload configuration
  upload: {
    maxFileSize: 5 * 1024 * 1024, // 5MB
    allowedTypes: ["image/jpeg", "image/png", "image/gif"],
    uploadPath: "public/images",
  },
};

// Validate required environment variables
const validateConfig = () => {
  const required = ["JWT_SECRET", "SUPABASE_URL", "SUPABASE_SERVICE_ROLE_KEY"];
  const missing = required.filter((key) => !process.env[key]);

  if (missing.length > 0) {
    console.warn(`⚠️ Missing environment variables: ${missing.join(", ")}`);
  }

  if (!config.database.url && !config.database.database) {
    throw new Error("DATABASE_URL or PGDATABASE must be set");
  }
};

// Validate on load
validateConfig();

module.exports = config;
