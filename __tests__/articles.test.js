const request = require("supertest");
const db = require("../src/db/connection");
const seed = require("../src/db/seeds/seed");
const data = require("../src/db/data/test-data/index");
const app = require("../src/app");

beforeEach(() => {
  return seed(data);
});
afterAll(() => {
  return db.end();
});

describe("GET /api/articles", () => {
  test("200: Responds with an array of article objects, all without the body property", () => {
    return request(app)
      .get("/api/articles")
      .expect(200)
      .then(({ body }) => {
        const { articles } = body;
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
            }),
          );
        });
      });
  });
  test("200: Articles are sorted by created_at in descending order (latest/most recent article first)", () => {
    return request(app)
      .get("/api/articles")
      .expect(200)
      .then(({ body }) => {
        const { articles } = body;
        expect(articles.length).toBeGreaterThan(0);
        expect(articles).toBeSortedBy("created_at", { descending: true });
      });
  });
});

describe("GET /api/articles/:article_id", () => {
  test("200: Responds with an article object containing the article that corresponds with the requested article_id", () => {
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
    return request(app)
      .get("/api/articles/invalid-request")
      .expect(400)
      .then(({ body }) => {
        expect(body.msg).toBe("Bad request!");
      });
  });
  test("ERROR - 404: Responds with 'Article not found!' when user requests non-existent article_id", () => {
    return request(app)
      .get("/api/articles/123456789")
      .expect(404)
      .then(({ body }) => {
        expect(body.msg).toBe("Article not found!");
      });
  });
});

describe("PATCH /api/articles/:article_id", () => {
  test("200: Increments the vote count on a requested article by a specified amount and responds with updated article", () => {
    const votes = { inc_votes: 50 };
    return request(app)
      .patch("/api/articles/1")
      .send(votes)
      .expect(200)
      .then(({ body }) => {
        const { article } = body;

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
    const votes = { inc_votes: -45 };
    return request(app)
      .patch("/api/articles/1")
      .send(votes)
      .expect(200)
      .then(({ body }) => {
        const { article } = body;
        expect(article.votes).toBe(55);
      });
  });
  test("ERROR - 400: Responds with 'Bad request!' when inc_votes inputted is not a number", () => {
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

describe("GET /api/articles (sorting queries)", () => {
  test("200: Articles are sorted by an alternative valid column (default sort by is created_at column, descending) ", () => {
    return request(app)
      .get("/api/articles?sort_by=article_id&order=desc")
      .expect(200)
      .then(({ body: { articles } }) => {
        expect(articles).toBeSortedBy("article_id", { descending: true });
      });
  });
  test("200: Articles are sorted in ascending order, overriding default order and sort_by values", () => {
    return request(app)
      .get("/api/articles?sort_by=votes&order=asc")
      .expect(200)
      .then(({ body: { articles } }) => {
        expect(articles).toBeSortedBy("votes", { descending: false });
        expect(articles).toBeSortedBy("votes", { ascending: true });
      });
  });
  test("200: Unrecognised query keys, or mispelled query keys, such as 'szzort_by' are ignored, and instead, all articles are returned in default order", () => {
    return request(app)
      .get("/api/articles?szzort_by=author")
      .expect(200)
      .then(({ body: { articles } }) => {
        expect(articles).toBeSortedBy("created_at", { descending: true });
      });
  });
  test("200: Unrecognised query keys, or mispelled query keys, such as 'szzort_by' are ignored, but queried order is valid - should return all articles in ascending order (oldest first) by their default sort_by value (created_at)", () => {
    return request(app)
      .get("/api/articles?szzort_by=author&order=asc")
      .expect(200)
      .then(({ body: { articles } }) => {
        expect(articles).toBeSortedBy("created_at", { ascending: true });
        expect(articles).toBeSortedBy("created_at", { descending: false });
      });
  });
  test("ERROR - 400: Responds with 'Invalid sort_by column!' when invalid sort_by column is queried", () => {
    return request(app)
      .get("/api/articles?sort_by=invalid_sort_by")
      .expect(400)
      .then((response) => {
        expect(response.body.msg).toBe("Invalid sort_by column!");
      });
  });
  test("ERROR - 400: Responds with 'Invalid order_by value!' when invalid order_by order is queried", () => {
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
    return request(app)
      .get("/api/articles?tzzopic=paper")
      .expect(200)
      .then(({ body: { articles } }) => {
        expect(articles.length).toBe(10);
        expect(articles).toBeSortedBy("created_at", { descending: true });
      });
  });
  test("ERROR - 404: When user inputs non-existent article topic, should respond with 'Topic does not exist!'", () => {
    return request(app)
      .get("/api/articles?topic=does-not-exist")
      .expect(404)
      .then(({ body }) => {
        expect(body.msg).toBe("Topic does not exist!");
      });
  });
});

describe("POST /api/articles", () => {
  test("201: Responds with the newly created article", () => {
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
          "/images/default-profile.png",
        );
      });
  });
  test("ERROR - 404: When user creating post does not exist, responds with 'User does not exist", () => {
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
  test("ERROR - 400: Responds with 'Missing required fields!' when any of the required fields in order to post an article are missing", () => {
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
    },
  );
});

describe("GET /api/articles (pagination)", () => {
  test("200: returns paginated articles with default limit of 10 and total_count", () => {
    return request(app)
      .get("/api/articles")
      .expect(200)
      .then((res) => {
        expect(res.body.articles).toHaveLength(10);
        expect(typeof res.body.total_count).toBe("number");
        expect(res.body.articles[0]).toEqual(
          expect.objectContaining({
            article_id: expect.any(Number),
            title: expect.any(String),
            author: expect.any(String),
            topic: expect.any(String),
            created_at: expect.any(String),
            votes: expect.any(Number),
            article_img_url: expect.any(String),
            comment_count: expect.any(Number),
          }),
        );
      });
  });
  test("200: returns correct number of articles when limit and page provided", () => {
    return request(app)
      .get("/api/articles?limit=5&p=2")
      .expect(200)
      .then((res) => {
        expect(res.body.articles).toHaveLength(5);
        expect(typeof res.body.total_count).toBe("number");
      });
  });
  test("ERROR - 400: responds with error for invalid limit or page number", () => {
    return request(app)
      .get("/api/articles?limit=banana&p=-1")
      .expect(400)
      .then((res) => {
        expect(res.body.msg).toBe("Invalid pagination query!");
      });
  });
});

describe("DELETE /api/articles/:article_id", () => {
  test("204: deletes article and associated comments", () => {
    return request(app)
      .delete("/api/articles/1")
      .expect(204)
      .then(() => {
        return request(app).get("/api/articles/1").expect(404);
      });
  });

  test("ERROR - 400: invalid article_id", () => {
    return request(app)
      .delete("/api/articles/not-a-number")
      .expect(400)
      .then(({ body }) => {
        expect(body.msg).toBe("Bad request!");
      });
  });

  test("ERROR - 404: non-existent article", () => {
    return request(app)
      .delete("/api/articles/9999")
      .expect(404)
      .then(({ body }) => {
        expect(body.msg).toBe("Article not found!");
      });
  });
});
