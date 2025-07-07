const request = require("supertest");
const jwt = require("jsonwebtoken");
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

describe("GET /api/users", () => {
  test("200: Responds with an array containing all of users, stored in user objects", () => {
    return request(app)
      .get("/api/users")
      .expect(200)
      .then(({ body }) => {
        const users = body.users;
        expect(Array.isArray(users)).toBe(true);
        expect(users.length).toBe(4);

        users.forEach((user) => {
          expect(user).toEqual(
            expect.objectContaining({
              username: expect.any(String),
              name: expect.any(String),
              avatar_url: expect.any(String),
            }),
          );
        });
      });
  });
});

describe("GET /api/users/:username", () => {
  test("200: Responds with a user object with a username, avatar_url, and name property, that corresponds with the requested username", () => {
    return request(app)
      .get("/api/users/lurker")
      .expect(200)
      .then(({ body }) => {
        const user = body.user;
        expect(user).toEqual(
          expect.objectContaining({
            username: "lurker",
            name: "do_nothing",
            avatar_url:
              "https://www.golenbock.com/wp-content/uploads/2015/01/placeholder-user.png",
          }),
        );
      });
  });
  test("ERROR - 404: Responds with 'User not found!' if username inputted does not exist", () => {
    return request(app)
      .get("/api/users/user-does-not-exist")
      .expect(404)
      .then(({ body }) => {
        expect(body.msg).toBe("User does not exist!");
      });
  });
  test("ERROR - 404: Responds with 'User not found!' when using incorrect casing for username", () => {
    return request(app)
      .get("/api/users/LuRkEr")
      .expect(404)
      .then(({ body }) => {
        expect(body.msg).toBe("User does not exist!");
      });
  });
});

describe("GET /api/users/me", () => {
  test("200: responds with user object when provided valid token", () => {
    const token = jwt.sign(
      { username: "butter_bridge" },
      process.env.JWT_SECRET,
    );

    return request(app)
      .get("/api/users/me")
      .set("Authorization", `Bearer ${token}`)
      .expect(200)
      .then((res) => {
        expect(res.body.user).toMatchObject({
          username: "butter_bridge",
          name: "jonny",
          email: expect.any(String),
          avatar_url: expect.any(String),
        });
      });
  });

  test("ERROR - 401: responds with error when token is missing", () => {
    return request(app)
      .get("/api/users/me")
      .expect(401)
      .then(({ body }) => {
        expect(body.msg).toBe("Missing or malformed token!");
      });
  });

  test("ERROR - 401: responds with error when token is invalid", () => {
    return request(app)
      .get("/api/users/me")
      .set("Authorization", "Bearer invalidtoken")
      .expect(401)
      .then(({ body }) => {
        expect(body.msg).toBe("Invalid or expired token!");
      });
  });
});
