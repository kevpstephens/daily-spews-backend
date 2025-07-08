import request from "supertest";
import endpointsJson from "../endpoints.json" with { type: "json" };
import app from "../src/app.js";
import db from "../src/db/connection.js";
import seed from "../src/db/seeds/seed.js";
import * as data from "../src/db/data/test-data/index.js";

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
