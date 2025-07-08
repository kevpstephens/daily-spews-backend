import seed from "./seed.js";
import db from "../connection.js";
import logger from "../../utils/logger.js";

const ENV = process.env.NODE_ENV || "development";

logger.info(
  `🫘 Seeding ${ENV} database with ${
    ENV === "production" ? "production" : "development"
  } data...`,
);

const runSeed = async () => {
  const data =
    ENV === "production"
      ? await import("../data/production-data/index.js")
      : await import("../data/development-data/index.js");

  await seed(data);
  logger.info("🚫 Now closing DB connection...");
  return db.end();
};

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
