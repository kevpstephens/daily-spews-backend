const seed = require("./seed");
const db = require("../connection");
const logger = require("../../utils/logger");

const ENV = process.env.NODE_ENV || "development";

const data =
  ENV === "production"
    ? require("../data/production-data/index")
    : require("../data/development-data/index");

logger.info(
  `🫘 Seeding ${ENV} database with ${
    ENV === "production" ? "production" : "development"
  } data...`,
);

const runSeed = () =>
  seed(data).then(() => {
    logger.info("🚫 Now closing DB connection...");
    return db.end();
  });

runSeed()
  .then(() => {
    logger.info("✅ Database seeding completed successfully");
    process.exit(0);
  })
  .catch((error) => {
    logger.error("❌ Database seeding failed", {
      error: error.message,
      stack: error.stack,
    });
    process.exit(1);
  });
