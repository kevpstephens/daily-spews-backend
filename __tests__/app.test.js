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
      expect(articles.length).toBeGreaterThan(0)
      
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

  test("200: Articles are sorted by created_at in descending order (latest/most recent article first)", () => {
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
})

describe("GET /api/articles/:article_id/comments", () => {
  test("200: Responds with an array of comment objects, all corresponding to the queried articled_id", () => {
    // Arrange
    return request(app)
    .get("/api/articles/1/comments")
    .expect(200)
    .then((result) => {
      const {comments} = result.body

      expect(Array.isArray(comments)).toBe(true)
      expect(comments.length).toBeGreaterThan(0)
      comments.forEach((comment) => {
        expect(comment.article_id).toBe(1)
        expect(comment).toMatchObject({
          comment_id: expect.any(Number),
          votes: expect.any(Number),
          created_at: expect.any(String),
          author: expect.any(String),
          body: expect.any(String)
        })
      })
    })
  })

  test("200: Comments are sorted by created_at in descending order (most recent comments first)", () => {
    // Arrange
    return request(app)
    .get("/api/articles/1/comments")
    .expect(200)
    .then((result) => {
      const {comments} = result.body

      expect(comments.length).toBeGreaterThan(0)
      expect(comments).toBeSortedBy("created_at", {descending: true})
    })
  })

  test("ERROR - 400: Responds with 'Bad request!' when when article_id is not a valid number", () => {
    // Arrange
    return request(app)
    .get("/api/articles/invalid-request/comments")
    .expect(400)
    .then((result) => {
      expect(result.body.msg).toBe("Bad request!")
    })
  })

  test("ERROR - 404: Responds with 'Article not found!' when queried article_id does not exist", () => {
    // Arrange
    return request(app)
    .get("/api/articles/123456789/comments")
    .expect(404)
    .then((result) => {
      expect(result.body.msg).toBe("Article not found!")
    })
  })
})