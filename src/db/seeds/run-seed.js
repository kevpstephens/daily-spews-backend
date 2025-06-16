const seed = require("./seed.js");
const db = require("../connection.js");

// Determine the environment (default to 'development' if not set)
const ENV = process.env.NODE_ENV || "development";

// Dynamically load the appropriate data set
const data =
  ENV === "production"
    ? require("../data/production-data/index.js")
    : require("../data/development-data/index.js");

console.log(
  `🌱 Seeding ${ENV} database with ${
    ENV === "production" ? "production" : "development"
  } data...`
);

const runSeed = () => {
  return seed(data).then(() => {
    console.log("✅ Seeding complete. Closing DB connection...");
    db.end();
  });
};

runSeed();
