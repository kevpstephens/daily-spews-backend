import pkg from "pg";
import dotenv from "dotenv";
import { fileURLToPath } from "url";
import { dirname, join } from "path";
import logger from "../utils/logger.js";

const { Pool } = pkg;

const __filename = fileURLToPath(import.meta.url); // eslint-disable-line no-underscore-dangle
const __dirname = dirname(__filename); // eslint-disable-line no-underscore-dangle

const ENV = process.env.NODE_ENV || "development";

dotenv.config({ path: join(__dirname, `../../.env.${ENV}`) });

if (!process.env.PGDATABASE && !process.env.DATABASE_URL) {
  throw new Error("PGDATABASE or DATABASE_URL not set");
} else {
  logger.info("Database configuration loaded", {
    environment: ENV,
    database: process.env.PGDATABASE || "DATABASE_URL configured",
  });
}

// Configure connection pool with better defaults
const getPoolConfig = () => {
  const config = {};

  // Allow custom pool size via environment variable
  const poolSize = process.env.DB_POOL_SIZE
    ? parseInt(process.env.DB_POOL_SIZE, 10)
    : null;

  if (ENV === "production") {
    if (process.env.DATABASE_URL) {
      config.connectionString = process.env.DATABASE_URL;
      config.max = poolSize || 10;
      config.ssl = { rejectUnauthorized: false }; // Required for most cloud providers
      config.idleTimeoutMillis = 30000; // Close idle connections after 30s
      config.connectionTimeoutMillis = 10000; // Timeout connection attempts after 10s

      logger.info("Production database pool configured", {
        maxConnections: config.max,
        idleTimeout: config.idleTimeoutMillis,
        connectionTimeout: config.connectionTimeoutMillis,
      });
    } else {
      logger.warn(
        "No DATABASE_URL found in production environment, falling back to PGDATABASE",
      );
    }
  } else {
    // Development/test configuration
    config.max = poolSize || 5;
    config.idleTimeoutMillis = 10000; // Shorter timeout for development

    logger.info("Development database pool configured", {
      environment: ENV,
      maxConnections: config.max,
      idleTimeout: config.idleTimeoutMillis,
    });
  }

  return config;
};

const pool = new Pool(getPoolConfig());

// Handle pool errors
pool.on("error", (err) => {
  logger.error("PostgreSQL pool error", {
    error: err.message,
    stack: err.stack,
    environment: ENV,
  });
});

// Optional: Log pool stats in development
if (ENV === "development" && process.env.LOG_POOL_STATS === "true") {
  setInterval(() => {
    logger.debug("PostgreSQL pool statistics", {
      totalClients: pool.totalCount,
      idleClients: pool.idleCount,
      pendingRequests: pool.waitingCount,
    });
  }, 30000); // Every 30 seconds
}

export default pool;
