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

describe("POST /api/auth/register", () => {
  test("201: Creates a new user and responds with a user object (no password included)", () => {
    return request(app)
      .post("/api/auth/register")
      .send({
        username: "new_user",
        name: "New User",
        email: "newuser@example.com",
        password: "newuser123",
        avatar_url: "https://example.com/avatar.jpg",
      })
      .expect(201)
      .then(({ body }) => {
        expect(body.user).toEqual(
          expect.objectContaining({
            username: "new_user",
            name: "New User",
            email: "newuser@example.com",
            avatar_url: expect.any(String),
          })
        );
        expect(body.user).not.toHaveProperty("password");
        expect(body.user).not.toHaveProperty("password_hash");
      });
  });
  test("ERROR - 500: Responds with error if email or username already exists", () => {
    return request(app)
      .post("/api/auth/register")
      .send({
        username: "butter_bridge",
        name: "Duplicate",
        email: "butter_bridge@example.com",
        password: "whatever",
      })
      .expect(500)
      .then(({ body }) => {
        expect(body.msg).toBe("Internal server error!");
      });
  });
});

describe("POST /api/auth/login", () => {
  test("200: responds with user object and sets token cookie for valid credentials", () => {
    return request(app)
      .post("/api/auth/login")
      .send({
        email: "butter_bridge@example.com",
        password: "butter_bridge123",
      })
      .expect(200)
      .then((response) => {
        // Assert the user object is present
        expect(response.body.user).toMatchObject({
          username: "butter_bridge",
          email: "butter_bridge@example.com",
        });

        // Assert the token cookie is set
        const setCookieHeader = response.headers["set-cookie"];
        expect(setCookieHeader).toBeDefined();
        expect(setCookieHeader[0]).toMatch(/token=.*HttpOnly/);
      });
  });

  test("ERROR - 400: Responds with errorif email or password is missing", () => {
    return request(app)
      .post("/api/auth/login")
      .send({ email: "some@example.com" }) // missing password
      .expect(400)
      .then(({ body }) => {
        expect(body.msg).toBe("Missing email or password!");
      });
  });

  test("ERROR 401: Responds with error for incorrect password", () => {
    return request(app)
      .post("/api/auth/login")
      .send({
        email: "butter_bridge@example.com",
        password: "wrongpassword",
      })
      .expect(401)
      .then(({ body }) => {
        expect(body.msg).toBe("Invalid email or password!");
      });
  });

  test("ERROR - 401: Responds with error for nonexistent email", () => {
    return request(app)
      .post("/api/auth/login")
      .send({
        email: "nosuchuser@example.com",
        password: "irrelevant",
      })
      .expect(401)
      .then(({ body }) => {
        expect(body.msg).toBe("Invalid email or password!");
      });
  });
});

describe("POST /api/auth/logout", () => {
  test("200: Responds with success message and clears the token cookie on logout", () => {
    return request(app)
      .post("/api/auth/logout")
      .expect(200)
      .then((response) => {
        expect(response.body).toEqual({ msg: "Logged out successfully!" });
        const setCookieHeader = response.headers["set-cookie"];
        expect(setCookieHeader).toBeDefined();
        expect(setCookieHeader[0]).toMatch(/token=;/); // cookie cleared
      });
  });
});
