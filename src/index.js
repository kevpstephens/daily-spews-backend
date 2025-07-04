const app = require("./app");
const logger = require("./utils/logger");

const { PORT = 9090 } = process.env;

// Set default NODE_ENV if not set
process.env.NODE_ENV = process.env.NODE_ENV || "development";

const envEmojiMap = {
  development: "🌱",
  test: "🧪",
  production: "🚀",
};

const emoji = envEmojiMap[process.env.NODE_ENV] || "🛠️";

app.listen(PORT, () => {
  logger.info(
    `👂 Listening on port ${PORT} (${emoji} ${process.env.NODE_ENV.toUpperCase()})...`,
  );
});
