const endpointsJson = require("../endpoints.json");
const db = require("../src/db/connection.js");
const seed = require("../src/db/seeds/seed.js");
const data = require("../src/db/data/test-data/index.js");
const app = require("../src/app.js");
const request = require("supertest");

beforeEach(() => {
  return seed(data);
});
afterAll(() => {
  return db.end();
});

describe("Undefined Routes", () => {
  test("ERROR - 404: When an undefined path is entered, responds with error message stating '404: Path Not Found!'", () => {
    return request(app)
      .get("/api/invalid-path")
      .expect(404)
      .then(({ body }) => {
        expect(body.msg).toBe("404: Path Not Found!");
      });
  });
});

describe("GET /api", () => {
  test("200: Responds with an object detailing the documentation for each endpoint", () => {
    return request(app)
      .get("/api")
      .expect(200)
      .then(({ body: { endpoints } }) => {
        expect(endpoints).toEqual(endpointsJson);
      });
  });
});
