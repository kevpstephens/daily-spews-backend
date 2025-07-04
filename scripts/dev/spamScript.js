/* ============================================================ 
 This script is used to spam the server with requests to test the database connection pool.
 It is not used in the production environment - it is only used for testing the database connection pool to ensure limits are working as expected.
 It is run using `npm run spam:dev`
============================================================ */

const axios = require("axios");

for (let i = 0; i < 100; i++) {
  axios.get("http://localhost:9090/api/articles").catch(console.error);
}
