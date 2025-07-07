const request = require("supertest");
const endpointsJson = require("../endpoints.json");
const app = require("../src/app");
const db = require("../src/db/connection");
const seed = require("../src/db/seeds/seed");
const data = require("../src/db/data/test-data/index");

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
        expect(body.msg).toBe("Path not found!");
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
