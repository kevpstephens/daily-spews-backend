/* ============================================================ 
 This script is used to spam the server with requests to test the database connection pool.
 It is not used in the production environment - it is only used for testing the database connection pool to ensure limits are working as expected.
 It is run using `npm run spam:dev`
============================================================ */

import axios from "axios";
import logger from "../../src/utils/logger.js";

const BASE_URL = process.env.API_URL || "http://localhost:9090";
const REQUEST_COUNT = 100;

logger.info(`Starting spam test with ${REQUEST_COUNT} requests to ${BASE_URL}`);

for (let i = 0; i < REQUEST_COUNT; i += 1) {
  axios
    .get(`${BASE_URL}/api/articles`)
    .then(() => logger.info(`Request ${i + 1} completed`))
    .catch((error) => logger.error(`Request ${i + 1} failed:`, error.message));
}
