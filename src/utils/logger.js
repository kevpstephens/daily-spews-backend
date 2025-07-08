/* eslint-disable no-console */

const logger = {
  info: (...args) => {
    if (
      process.env.NODE_ENV !== "production" &&
      process.env.NODE_ENV !== "test"
    ) {
      console.log("ℹ️ [INFO]", ...args);
    }
  },
  warn: (...args) => {
    if (process.env.NODE_ENV !== "test") {
      console.warn("⚠️ [WARN]", ...args);
    }
  },
  error: (...args) => {
    if (process.env.NODE_ENV !== "test") {
      console.error("❌ [ERROR]", ...args);
    }
  },
  debug: (...args) => {
    if (process.env.NODE_ENV !== "test") {
      console.debug("🐛 [DEBUG]", ...args);
    }
  },
};

export default logger;
