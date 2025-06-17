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

describe("GET /api/articles/:article_id/comments", () => {
  test("200: Responds with an array of comment objects, all corresponding to the requested articled_id", () => {
    return request(app)
      .get("/api/articles/1/comments")
      .expect(200)
      .then((result) => {
        const { comments } = result.body;

        expect(Array.isArray(comments)).toBe(true);
        expect(comments.length).toBeGreaterThan(0);
        comments.forEach((comment) => {
          expect(comment.article_id).toBe(1);
          expect(comment).toMatchObject({
            comment_id: expect.any(Number),
            votes: expect.any(Number),
            created_at: expect.any(String),
            author: expect.any(String),
            body: expect.any(String),
          });
        });
      });
  });
  test("200: Comments are sorted by created_at in descending order (most recent comments first)", () => {
    return request(app)
      .get("/api/articles/1/comments")
      .expect(200)
      .then((result) => {
        const { comments } = result.body;

        expect(comments.length).toBeGreaterThan(0);
        expect(comments).toBeSortedBy("created_at", { descending: true });
      });
  });
  test("ERROR - 400: Responds with 'Bad request!' when when article_id is not a valid number", () => {
    return request(app)
      .get("/api/articles/invalid-request/comments")
      .expect(400)
      .then((result) => {
        expect(result.body.msg).toBe("400: Bad Request!");
      });
  });
  test("ERROR - 404: Responds with 'Article not found!' when requested article_id does not exist", () => {
    return request(app)
      .get("/api/articles/123456789/comments")
      .expect(404)
      .then((result) => {
        expect(result.body.msg).toBe("Article not found!");
      });
  });
});

describe("POST /api/articles/:article_id/comments", () => {
  test("201: Posts a comment on selected article, and responds with the newly created comment", () => {
    const testComment = {
      username: "lurker",
      body: "test body of text",
    };

    return request(app)
      .post("/api/articles/1/comments")
      .send(testComment)
      .expect(201)
      .then((result) => {
        const { comment } = result.body;
        expect(comment).toEqual(
          expect.objectContaining({
            comment_id: 19,
            article_id: 1,
            author: "lurker",
            body: "test body of text",
            votes: 0,
            created_at: expect.any(String),
          })
        );
      });
  });
  test("ERROR - 400: Post is missing a body of text", () => {
    const testComment = {
      username: "lurker",
    };

    return request(app)
      .post("/api/articles/1/comments")
      .send(testComment)
      .expect(400)
      .then(({ body }) => {
        expect(body.msg).toBe("Bad request!");
      });
  });
  test("ERROR - 400: Responds with 'Bad request!' when user attempts to post a comment to an invalid article_id", () => {
    const testComment = {
      username: "lurker",
      body: "test body of text",
    };

    return request(app)
      .post("/api/articles/invalid-article-id/comments")
      .send(testComment)
      .expect(400)
      .then(({ body }) => {
        expect(body.msg).toBe("Bad request!");
      });
  });
  test("ERROR - 404: User attempting to post the comment does not exist", () => {
    const testComment = {
      username: "non-existant-user",
      body: "I literally don't exist",
    };

    return request(app)
      .post("/api/articles/1/comments")
      .send(testComment)
      .expect(404)
      .then(({ body }) => {
        expect(body.msg).toBe(
          "404: Foreign key violation - Resource not found!"
        );
      });
  });
  test("ERROR - 404: Responds with 'Article not found!' when article requested does not exist", () => {
    const testComment = {
      username: "lurker",
      body: "test body of text",
    };

    return request(app)
      .post("/api/articles/123456789/comments")
      .send(testComment)
      .expect(404)
      .then(({ body }) => {
        expect(body.msg).toBe("Article not found!");
      });
  });
});

describe("PATCH /api/comments/:comment_id", () => {
  test("200: Increments the vote count on an identified comment by a specified amount, and responds with an updated comment object", () => {
    return request(app)
      .patch("/api/comments/1")
      .send({ inc_votes: 1 })
      .expect(200)
      .then(({ body }) => {
        expect(body.updatedComment).toMatchObject({
          comment_id: 1,
          article_id: 9,
          body: "Oh, I've got compassion running out of my nose, pal! I'm the Sultan of Sentiment!",
          votes: 17,
          author: "butter_bridge",
          created_at: expect.any(String),
        });
      });
  });
  test("200: Decrements the vote count on an identified comment by a specified anount, and responds with an updated comment object", () => {
    return request(app)
      .patch("/api/comments/1")
      .send({ inc_votes: -100 })
      .expect(200)
      .then(({ body }) => {
        expect(body.updatedComment).toMatchObject({
          comment_id: 1,
          article_id: 9,
          body: "Oh, I've got compassion running out of my nose, pal! I'm the Sultan of Sentiment!",
          votes: -84,
          author: "butter_bridge",
          created_at: expect.any(String),
        });
      });
  });
  test("ERROR - 400: Responds with 'Bad request!' when inc_votes does not contain anything", () => {
    return request(app)
      .patch("/api/comments/1")
      .send({})
      .expect(400)
      .then(({ body }) => {
        expect(body.msg).toBe("Bad Request!");
      });
  });
  test("ERROR - 400: Responds with 'Bad request!' when inv_votes inputted is not a number", () => {
    return request(app)
      .patch("/api/comments/1")
      .send({ inc_votes: "I'm literally not a number" })
      .expect(400)
      .then(({ body }) => {
        expect(body.msg).toBe("Bad Request!");
      });
  });
  test("ERROR - 400: Responds with 'Bad Request!' when trying to send inc_votes to an inavalid comment_id", () => {
    return request(app)
      .patch("/api/comments/invalid-comment-id")
      .send({ inc_votes: 1 })
      .expect(400)
      .then(({ body }) => {
        expect(body.msg).toBe("Bad Request!");
      });
  });
  test("ERROR - 404: Responds with 'Comment does not exist!' when trying to send inc_votes to a non-existent comment", () => {
    return request(app)
      .patch("/api/comments/123456789")
      .send({ inc_votes: 1 })
      .expect(404)
      .then(({ body }) => {
        expect(body.msg).toBe("Comment does not exist!");
      });
  });
});

describe("DELETE /api/comments/:comment_id", () => {
  test("204: Deletes the comment, via comment_id, and returns no content in an empty object", () => {
    return request(app)
      .delete("/api/comments/1")
      .expect(204)
      .then((response) => {
        expect(response.body).toEqual({});
      });
  });
  test("204: Deletes the comment, via comment_id, and then checks to ensure that comment no longer exists", () => {
    return request(app)
      .delete("/api/comments/1")
      .expect(204)
      .then(() => {
        return request(app)
          .delete("/api/comments/1")
          .expect(404)
          .then(({ body }) => {
            expect(body.msg).toBe("Comment not found!");
          });
      });
  });
  test("ERROR - 400: Responds with 'Bad request!' when comment_id inputted is not a number", () => {
    return request(app)
      .delete("/api/comments/not-a-number")
      .expect(400)
      .then((response) => {
        expect(response.body.msg).toBe("Bad request!");
      });
  });
  test("ERROR - 404: Responds with 'Comment not found!' when comment_id inputted does not exist", () => {
    return request(app)
      .delete("/api/comments/123456789")
      .expect(404)
      .then((response) => {
        expect(response.body.msg).toBe("Comment not found!");
      });
  });
});

describe("GET /api/articles/:article_id/comments (pagination)", () => {
  test("200: Returns paginated comments with default limit of 10 and includes total_count", () => {
    return request(app)
      .get("/api/articles/1/comments")
      .expect(200)
      .then(({ body }) => {
        expect(Array.isArray(body.comments)).toBe(true);
        expect(body.comments.length).toBeLessThanOrEqual(10);
        expect(typeof body.total_count).toBe("number");
      });
  });
  test("200: Returns correct number of comments when limit and page are provided", () => {
    return request(app)
      .get("/api/articles/1/comments?limit=5&p=2")
      .expect(200)
      .then(({ body }) => {
        expect(body.comments.length).toBeLessThanOrEqual(5);
        expect(typeof body.total_count).toBe("number");
      });
  });
  test("400: Responds with 'Invalid pagination query!' for invalid limit or page", () => {
    return request(app)
      .get("/api/articles/1/comments?limit=banana&p=-2")
      .expect(400)
      .then(({ body }) => {
        expect(body.msg).toBe("Invalid pagination query!");
      });
  });
});
