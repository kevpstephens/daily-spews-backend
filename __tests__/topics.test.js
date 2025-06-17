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

describe("GET /api/topics", () => {
  test("200: Responds with an array containing topic objects", () => {
    return request(app)
      .get("/api/topics")
      .expect(200)
      .then(({ body: { topics } }) => {
        expect(Array.isArray(topics)).toBe(true);
        expect(topics.length).toBe(3);

        topics.forEach((topic) => {
          expect(typeof topic.slug).toBe("string");
          expect(typeof topic.description).toBe("string");
        });
      });
  });
});

describe("POST /api/topics", () => {
  test("201: Adds a new topic and returns it", () => {
    const newTopic = {
      slug: "philosophy",
      description: "Deep and meaningful discussion",
    };

    return request(app)
      .post("/api/topics")
      .send(newTopic)
      .expect(201)
      .then((res) => {
        expect(res.body.topic).toMatchObject(newTopic);
      });
  });

  test("400: Missing fields", () => {
    return request(app)
      .post("/api/topics")
      .send({ slug: "half-baked" })
      .expect(400)
      .then((res) => {
        expect(res.body.msg).toBe("Missing required fields!");
      });
  });
});
