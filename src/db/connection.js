const { Pool } = require("pg");

const ENV = process.env.NODE_ENV || "development";

require("dotenv").config({ path: `${__dirname}/../../.env.${ENV}` });

if (!process.env.PGDATABASE && !process.env.DATABASE_URL) {
  throw new Error("PGDATABASE or DATABASE_URL not set");
} else {
  console.log(
    `🔗 Connected to ${process.env.PGDATABASE || process.env.DATABASE_URL}`,
  );
}

const config = {};
if (ENV === "production") {
  if (process.env.DATABASE_URL) {
    config.connectionString = process.env.DATABASE_URL;
    config.max = 2; // Limit max number of clients in the pool to prevent overloading Render
  } else {
    console.warn("⚠️ No DATABASE_URL set. Falling back to PGDATABASE...");
  }
}

const pool = new Pool(config);

// Log pool stats every 5 seconds (only outside of test environment)
// if (ENV !== "test") {
//   poolLogger = setInterval(() => {
//     console.log("📊 PG Pool Stats:", {
//       "Total clients": pool.totalCount,
//       "Idle clients": pool.idleCount,
//       "Pending requests": pool.waitingCount,
//     });
//   }, 5000);
// }

// pool.closeLogger = () => {
//   if (poolLogger) clearInterval(poolLogger);
// };

module.exports = pool;
