const { Pool } = require("pg");
const config = require("./index");

const createPool = () => {
  const poolConfig = {};

  if (config.nodeEnv === "production") {
    if (config.database.url) {
      poolConfig.connectionString = config.database.url;
      poolConfig.max = config.database.maxConnections;
    } else {
      console.warn("⚠️ No DATABASE_URL set. Falling back to PGDATABASE...");
    }
  } else {
    // Development/Test configuration
    poolConfig.host = config.database.host;
    poolConfig.port = config.database.port;
    poolConfig.user = config.database.user;
    poolConfig.password = config.database.password;
    poolConfig.database = config.database.database;
    poolConfig.max = config.database.maxConnections;
  }

  return new Pool(poolConfig);
};

module.exports = createPool;
