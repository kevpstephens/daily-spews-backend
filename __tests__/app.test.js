const endpointsJson = require("../endpoints.json");
/* Set up your test imports here */
const db = require("../db/connection.js");
const seed = require("../db/seeds/seed.js");
const data = require("../db/data/test-data");
const app = require("../app.js");
const request = require("supertest");

/* Set up your beforeEach & afterAll functions here */
beforeEach(() => {
  return seed(data);
});
afterAll(() => {
  return db.end();
});

describe("ALL /*splat", () => {
  test("ERROR - 404: When an undefined path is entered, responds with error message stating '404: Path Not Found!'", () => {
    // Arrange
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

describe("GET /api/topics", () => {
  test("200: Responds with an array containing topic objects", () => {
    // Arrange
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

describe("GET /api/articles/:article_id", () => {
  test("200: Responds with an article object containing the article that corresponds with the requested article_id", () => {
    // Arrange
    return request(app)
      .get("/api/articles/1")
      .expect(200)
      .then(({ body }) => {
        expect(body.article.article_id).toBe(1);
        expect(body.article).toMatchObject({
          title: expect.any(String),
          topic: expect.any(String),
          author: expect.any(String),
          body: expect.any(String),
          created_at: expect.any(String),
          votes: expect.any(Number),
          article_img_url: expect.any(String),
        });
      });
  });
  test("ERROR - 400: Responds with 'Bad request!' when user makes invalid article_id request", () => {
    // Arrange
    return request(app)
      .get("/api/articles/invalid-request")
      .expect(400)
      .then(({ body }) => {
        expect(body.msg).toBe("Bad request!");
      });
  });
  test("ERROR - 404: Responds with 'Article not found!' when user requests non-existent article_id", () => {
    // Arrange
    return request(app)
      .get("/api/articles/123456789")
      .expect(404)
      .then(({ body }) => {
        expect(body.msg).toBe("Article not found!");
      });
  });
});

describe("GET /api/articles", () => {
  test("200: Responds with an array of article objects, all without the body property", () => {
    // Arrange
    return request(app)
      .get("/api/articles")
      .expect(200)
      .then((result) => {
        const { articles } = result.body;
        expect(Array.isArray(articles)).toBe(true);
        expect(articles.length).toBeGreaterThan(0);

        articles.forEach((article) => {
          expect(article).toEqual(
            expect.objectContaining({
              author: expect.any(String),
              title: expect.any(String),
              article_id: expect.any(Number),
              topic: expect.any(String),
              created_at: expect.any(String),
              votes: expect.any(Number),
              article_img_url: expect.any(String),
              comment_count: expect.any(Number),
            })
          );
        });
      });
  });
  test("200: Articles are sorted by created_at in descending order (latest/most recent article first)", () => {
    // Arrange
    return request(app)
      .get("/api/articles")
      .expect(200)
      .then((result) => {
        const { articles } = result.body;
        expect(articles.length).toBeGreaterThan(0);
        expect(articles).toBeSortedBy("created_at", { descending: true });
      });
  });
});

describe("GET /api/articles/:article_id/comments", () => {
  test("200: Responds with an array of comment objects, all corresponding to the requested articled_id", () => {
    // Arrange
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
    // Arrange
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
    // Arrange
    return request(app)
      .get("/api/articles/invalid-request/comments")
      .expect(400)
      .then((result) => {
        expect(result.body.msg).toBe("400: Bad Request!");
      });
  });
  test("ERROR - 404: Responds with 'Article not found!' when requested article_id does not exist", () => {
    // Arrange
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
    // Arrange
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
    // Arrange
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
    // Arrange
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
    // Arrange
    const testComment = {
      username: "non-existant-user",
      body: "I literally don't exist",
    };

    return request(app)
      .post("/api/articles/1/comments")
      .send(testComment)
      .expect(404)
      .then(({ body }) => {
        expect(body.msg).toBe("404: Not Found!");
      });
  });
  test("ERROR - 404: Responds with 'Article not found!' when article requested does not exist", () => {
    // Arrange
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

describe("PATCH /api/articles/:article_id", () => {
  test("200: Increments the vote count on a requested article by a specified amount and responds with updated article", () => {
    // Arrange
    const votes = { inc_votes: 50 };
    return request(app)
      .patch("/api/articles/1")
      .send(votes)
      .expect(200)
      .then((result) => {
        const { article } = result.body;

        expect(article).toMatchObject({
          article_id: 1,
          votes: 150,
          title: expect.any(String),
          topic: expect.any(String),
          author: expect.any(String),
          body: expect.any(String),
          created_at: expect.any(String),
          article_img_url: expect.any(String),
        });
      });
  });
  test("200: Decrements the vote count on a requested article by a specified amount", () => {
    // Arrange
    const votes = { inc_votes: -45 };
    return request(app)
      .patch("/api/articles/1")
      .send(votes)
      .expect(200)
      .then((result) => {
        const { article } = result.body;
        expect(article.votes).toBe(55);
      });
  });
  test("ERROR - 400: Responds with 'Bad request!' when inc_votes inputted is not a number", () => {
    // Arrange
    const votes = { inc_votes: "This is not a number" };
    return request(app)
      .patch("/api/articles/1")
      .send(votes)
      .expect(400)
      .then(({ body }) => {
        expect(body.msg).toBe("Bad request!");
      });
  });
  test("ERROR - 400: Responds with 'Bad request!' when article_id inputted is not a number", () => {
    // Arrange
    const votes = { inc_votes: "This is not a number" };
    return request(app)
      .patch("/api/articles/not-a-number")
      .send(votes)
      .expect(400)
      .then(({ body }) => {
        expect(body.msg).toBe("Bad request!");
      });
  });
  test("ERROR - 404: Responds with 'Article not found!' when article_id requested does not exist", () => {
    // Arrange
    const votes = { inc_votes: 10 };
    return request(app)
      .patch("/api/articles/123456789")
      .send(votes)
      .expect(404)
      .then(({ body }) => {
        expect(body.msg).toBe("Article not found!");
      });
  });
});

describe("DELETE /api/comments/:comment_id", () => {
  test("204: Deletes the comment, via comment_id, and returns no content in an empty object", () => {
    // Arrange
    return request(app)
      .delete("/api/comments/1")
      .expect(204)
      .then((response) => {
        expect(response.body).toEqual({});
      });
  });
  test("204: Deletes the comment, via comment_id, and then checks to ensure that comment no longer exists", () => {
    // Arrange
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
    // Arrange
    return request(app)
      .delete("/api/comments/not-a-number")
      .expect(400)
      .then((response) => {
        expect(response.body.msg).toBe("Bad request!");
      });
  });
  test("ERROR - 404: Responds with 'Comment not found!' when comment_id inputted does not exist", () => {
    // Arrange
    return request(app)
      .delete("/api/comments/123456789")
      .expect(404)
      .then((response) => {
        expect(response.body.msg).toBe("Comment not found!");
      });
  });
});

describe("GET /api/users", () => {
  test("200: Responds with an array containing all of users, stored in user objects", () => {
    // Arrange
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
            })
          );
        });
      });
  });
});

describe("GET /api/articles (sorting queries)", () => {
  test("200: Articles are sorted by an alternative valid column (default sort by is created_at column, descending) ", () => {
    // Arrange
    return request(app)
      .get("/api/articles?sort_by=article_id&order=desc")
      .expect(200)
      .then(({ body: { articles } }) => {
        expect(articles).toBeSortedBy("article_id", { descending: true });
      });
  });
  test("200: Articles are sorted in ascending order, overriding default order and sort_by values", () => {
    // Arrange
    return request(app)
      .get("/api/articles?sort_by=votes&order=asc")
      .expect(200)
      .then(({ body: { articles } }) => {
        expect(articles).toBeSortedBy("votes", { descending: false });
        expect(articles).toBeSortedBy("votes", { ascending: true });
      });
  });
  test("200: Unrecognised query keys, or mispelled query keys, such as 'szzort_by' are ignored, and instead, all articles are returned in default order", () => {
    // Arrange
    return request(app)
      .get("/api/articles?szzort_by=author")
      .expect(200)
      .then(({ body: { articles } }) => {
        expect(articles).toBeSortedBy("created_at", { descending: true });
      });
  });
  test("200: Unrecognised query keys, or mispelled query keys, such as 'szzort_by' are ignored, but queried order is valid - should return all articles in ascending order (oldest first) by their default sort_by value (created_at)", () => {
    // Arrange
    return request(app)
      .get("/api/articles?szzort_by=author&order=asc")
      .expect(200)
      .then(({ body: { articles } }) => {
        expect(articles).toBeSortedBy("created_at", { ascending: true });
        expect(articles).toBeSortedBy("created_at", { descending: false });
      });
  });
  test("ERROR - 400: Responds with 'Invalid sort_by column!' when invalid sort_by column is queried", () => {
    // Arrange
    return request(app)
      .get("/api/articles?sort_by=invalid_sort_by")
      .expect(400)
      .then((response) => {
        expect(response.body.msg).toBe("Invalid sort_by column!");
      });
  });
  test("ERROR - 400: Responds with 'Invalid order_by value!' when invalid order_by order is queried", () => {
    // Arrange
    return request(app)
      .get("/api/articles?sort_by=author&order=invalid_order")
      .expect(400)
      .then((response) => {
        expect(response.body.msg).toBe("Invalid order_by value!");
      });
  });
});

describe("GET /api/articles (topic query)", () => {
  test("200: Articles are filtered by topic query", () => {
    // Arrange
    return request(app)
      .get("/api/articles?topic=cats")
      .expect(200)
      .then(({ body }) => {
        const { articles } = body;
        expect(Array.isArray(articles)).toBe(true);
        expect(articles.length).toBeGreaterThan(0);
        articles.forEach((article) => {
          expect(article.topic).toBe("cats");
        });
      });
  });
  test("200: Responds with an empty array if topic queried exists, but currently contains no articles'", () => {
    // Arrange
    return request(app)
      .get("/api/articles?topic=paper")
      .expect(200)
      .then(({ body }) => {
        const { articles } = body;
        expect(Array.isArray(articles)).toBe(true);
        expect(articles.length).toBe(0);
        expect(articles).toEqual([]);
      });
  });
  test("200: When 'topic' query is misspelled, such as 'tzzopic', should return ALL the articles sorted by their default value (created_at, descending)", () => {
    // Arrange
    return request(app)
      .get("/api/articles?tzzopic=paper")
      .expect(200)
      .then(({ body: { articles } }) => {
        expect(articles.length).toBe(13);
        expect(articles).toBeSortedBy("created_at", { descending: true });
      });
  });
  test("ERROR - 404: When user inputs non-existent article topic, should respond with 'Topic does not exist!'", () => {
    // Arrange
    return request(app)
      .get("/api/articles?topic=does-not-exist")
      .expect(404)
      .then(({ body }) => {
        expect(body.msg).toBe("Topic does not exist!");
      });
  });
});

describe("GET /api/users/:username", () => {
  test("200: Responds with a user object with a username, avatar_url, and name property, that corresponds with the requested username", () => {
    // Arrange
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
          })
        );
      });
  });
  test("ERROR 404: Responds with 'User not found!' if username inputted does not exist", () => {
    // Arrange
    return request(app)
      .get("/api/users/user-does-not-exist")
      .expect(404)
      .then(({ body }) => {
        expect(body.msg).toBe("User does not exist!");
      });
  });
  test("ERROR 404: Responds with 'User not found!' when using incorrect casing for username", () => {
    // Arrange
    return request(app)
      .get("/api/users/LuRkEr")
      .expect(404)
      .then(({ body }) => {
        expect(body.msg).toBe("User does not exist!");
      });
  });
});

describe("PATCH /api/comments/:comment_id", () => {
  test("200: Increments the vote count on an identified comment by a specified amount, and responds with an updated comment object", () => {
    // Arrange
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
    // Arrange
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
    // Arrange
    return request(app)
      .patch("/api/comments/1")
      .send({})
      .expect(400)
      .then(({ body }) => {
        expect(body.msg).toBe("Bad Request!");
      });
  });
  test("ERROR - 400: Responds with 'Bad request!' when inv_votes inputted is not a number", () => {
    // Arrange
    return request(app)
      .patch("/api/comments/1")
      .send({ inc_votes: "I'm literally not a number" })
      .expect(400)
      .then(({ body }) => {
        expect(body.msg).toBe("Bad Request!");
      });
  });
  test("ERROR - 400: Responds with 'Bad Request!' when trying to send inc_votes to an inavalid comment_id", () => {
    // Arrange
    return request(app)
      .patch("/api/comments/invalid-comment-id")
      .send({ inc_votes: 1 })
      .expect(400)
      .then(({ body }) => {
        expect(body.msg).toBe("Bad Request!");
      });
  });
  test("ERROR - 404: Responds with 'Comment does not exist!' when trying to send inc_votes to a non-existent comment", () => {
    // Arrange
    return request(app)
      .patch("/api/comments/123456789")
      .send({ inc_votes: 1 })
      .expect(404)
      .then(({ body }) => {
        expect(body.msg).toBe("Comment does not exist!");
      });
  });
});

describe("POST /api/articles", () => {
  test("201: Responds with the newly created article", () => {
    // Arrange
    const newArticle = {
      author: "butter_bridge",
      title: "Why cats are the best",
      body: "They're fluffy and independent, and they look you in the eye when they knock stuff over.",
      topic: "cats",
      article_img_url: "https://example.com/cat.jpg",
    };

    return request(app)
      .post("/api/articles")
      .send(newArticle)
      .expect(201)
      .then(({ body }) => {
        expect(body.newArticle).toMatchObject({
          author: "butter_bridge",
          title: "Why cats are the best",
          topic: "cats",
          body: "They're fluffy and independent, and they look you in the eye when they knock stuff over.",
          article_img_url: "https://example.com/cat.jpg",
          votes: 0,
          comment_count: 0,
          article_id: expect.any(Number),
          created_at: expect.any(String),
        });
      });
  });
  test("201: Sets article_image_url to default if not provided by user ", () => {
    // Arrange
    const defaultImageCheckArticle = {
      author: "lurker",
      title: "Default Image Checker",
      body: "Checking if default image works.",
      topic: "cats",
    };

    return request(app)
      .post("/api/articles")
      .send(defaultImageCheckArticle)
      .expect(201)
      .then(({ body }) => {
        expect(body.newArticle.article_img_url).toBe(
          "/images/default-profile.png"
        );
      });
  });
  test("ERROR - 404: When user creating post does not exist, responds with 'User does not exist", () => {
    // Arrange
    const invalidArticle = {
      author: "user-does-not-exist",
      title: "test title",
      body: "test body.",
      topic: "test topic",
    };

    return request(app)
      .post("/api/articles")
      .send(invalidArticle)
      .expect(404)
      .then(({ body }) => {
        expect(body.msg).toBe("User does not exist!");
      });
  });
});

describe("POST /api/articles - Missing required fields", () => {
  test("ERROR - 400: Responds with 'Missing rqeuired fields!' when any of the required fields in order to post an article are missing ", () => {
    // Arrange
    const invalidArticlePost = { title: "Insufficient fields deployed" };

    return request(app)
      .post("/api/articles")
      .send(invalidArticlePost)
      .expect(400)
      .then(({ body }) => {
        expect(body.msg).toBe("Missing required fields!");
      });
  });
  
  const baseArticle = {
    author: "lurker",
    title: "Valid Title",
    body: "This is the body.",
    topic: "cats",
  };

  const missingFields = ["author", "title", "body", "topic"];

  test.each(missingFields)(
    "ERROR - 400: Responds with 'Missing required fields!' when '%s' is missing",
    (missingField) => {
      const invalidArticle = { ...baseArticle };
      delete invalidArticle[missingField];

      return request(app)
        .post("/api/articles")
        .send(invalidArticle)
        .expect(400)
        .then(({ body }) => {
          expect(body.msg).toBe("Missing required fields!");
        });
    }
  );
});
