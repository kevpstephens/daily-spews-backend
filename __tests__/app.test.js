const endpointsJson = require("../endpoints.json");
/* Set up your test imports here */
const db = require("../db/connection.js")
const seed = require("../db/seeds/seed.js")
const data = require("../db/data/test-data")
const app = require("../app.js")
const request = require("supertest")
require("jest-sorted")


/* Set up your beforeEach & afterAll functions here */
beforeEach(() => {return seed(data)})
afterAll(() => {return db.end()})


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
    .then(({body: {topics}}) => {
      expect(Array.isArray(topics)).toBe(true)
      expect(topics.length).toBe(3)
      topics.forEach((topic) => {
        expect(typeof topic.slug).toBe("string")
        expect(typeof topic.description).toBe("string")
      })
    })
  })

  test("200: responds with an empty array when no topics exist", () => {
    // Arrange
    return db.query("TRUNCATE TABLE topics CASCADE;")
    .then(() => {
    return request(app)
    .get("/api/topics")
    .expect(200)
    .then(({body: {topics}}) => {
      expect(topics).toEqual([])
    })  
    })
  })
})

describe("GET /api/articles/:article_id", () => {
  test("200: Responds with an article object containing the article that corresponds with the queried article_id", () => {
    // Arrange
    return request(app)
    .get("/api/articles/1")
    .expect(200)
    .then(({body}) => {
      expect(body.article.article_id).toBe(1)
      expect(body.article).toMatchObject({
        title: expect.any(String),
        topic: expect.any(String),
        author: expect.any(String),
        body: expect.any(String),
        created_at: expect.any(String),
        votes: expect.any(Number),
        article_img_url: expect.any(String)
      })
    })
  })

  test("ERROR - 400: Responds with 'bad request' when user makes invalid article_id request", () => {
    // Arrange
    return request(app)
    .get("/api/articles/invalid-request")
    .expect(400)
    .then(({body}) => {
      expect(body.msg).toBe("Bad request!")
    })
  })

  test("ERROR - 404: Responds with 'Article not found' when user queries non-existent article_id", () => {
    // Arrange
    return request(app)
    .get("/api/articles/123456789")
    .expect(404)
    .then(({body}) => {
      expect(body.msg).toBe("Article not found!")
    })
  })
})

describe("GET /api/articles", () => {
  test("200: Responds with an array of article objects, all without the body property", () => {
    // Arrange
    return request(app)
    .get("/api/articles")
    .expect(200)
    .then((result) => {
      const {articles} = result.body
      expect(Array.isArray(articles)).toBe(true)
      
      articles.forEach((article) => {
        expect(article).toEqual(expect.objectContaining({
          author: expect.any(String),
          title: expect.any(String),
          article_id: expect.any(Number),
          topic: expect.any(String),
          created_at: expect.any(String),
          votes: expect.any(Number),
          article_img_url: expect.any(String),
          comment_count: expect.any(Number)
        }))  
      })
    })
  })

  test("200: Articles are sorted by created_at in descending order (latest created_at date first)", () => {
    // Arrange
    return request(app)
    .get("/api/articles")
    .expect(200)
    .then((result) => {
      const {articles} = result.body
      expect(articles.length).toBeGreaterThan(0)
      expect(articles).toBeSortedBy("created_at", {descending: true})
    })
  })

  test("200: Responds with an empty array when no articles exist", () => {
    // Arrange
    return db.query("TRUNCATE TABLE topics CASCADE;")
    .then(() => {
      return request(app)
      .get("/api/articles")
      .expect(200)
      .then(({ body: { articles } }) => {
      expect(Array.isArray(articles)).toBe(true);
      expect(articles.length).toBe(0)
      expect(articles).toEqual([]);
      })
    })
  })
})

describe("GET /api/articles/:article_id/comments", () => {
  test("test", () => {
    // Arrange
  })
})