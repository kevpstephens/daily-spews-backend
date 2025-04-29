const endpointsJson = require("../endpoints.json");
/* Set up your test imports here */
const db = require("../db/connection.js")
const seed = require("../db/seeds/seed.js")
const data = require("../db/data/test-data")
const app = require("../app.js")
const request = require("supertest")


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
  test("200: Responds with an article object containing the article that corresponds with the requested article_id", () => {
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

  test("ERROR - 404: Responds with 'Article not found' when user requests non-existent article_id", () => {
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
  test("200: Responds with an array of comment objects, all corresponding to the requested articled_id", () => {
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

  test("ERROR - 404: Responds with 'Article not found!' when requested article_id does not exist", () => {
    // Arrange
    return request(app)
    .get("/api/articles/123456789/comments")
    .expect(404)
    .then((result) => {
      expect(result.body.msg).toBe("Article not found!")
    })
  })
})

describe("POST /api/articles/:article_id/comments", () => {
  test("201: Posts a comment on selected article, and responds with the newly created comment", () => {
    // Arrange
    const testComment = {
      username: "lurker",
      body: "test body of text"
    }

    return request(app)
    .post("/api/articles/1/comments")
    .send(testComment)
    .expect(201)
    .then((result) => {
      const {comment} = result.body
      expect(comment).toEqual(expect.objectContaining({
        comment_id: 19,
        article_id: 1,
        author: "lurker",
        body: 'test body of text',
        votes: 0,
        created_at: expect.any(String)
      }))
    })
  })

  test("ERROR - 400: Post is missing a body of text", () => {
    // Arrange
    const testComment = {
      username: "lurker"
    }

    return request(app)
    .post("/api/articles/1/comments")
    .send(testComment)
    .expect(400)
    .then(({body}) => {
      expect(body.msg).toBe("Bad request!")
    })
  })

  test("ERROR - 404: User attempting to post comment does not exist ", () => {
    // Arrange
    const testComment = {
      username: "non-existant-user",
      body: "I literally don't exist"
    }

    return request(app)
    .post("/api/articles/1/comments")
    .send(testComment)
    .expect(404)
    .then(({body}) => {
      expect(body.msg).toBe("User does not exist")
    })
  })

  test("ERROR - 404: Responds with 'Article not found!' when article requested does not exist", () => {
    // Arrange
    const testComment = {
      username: "lurker",
      body: "test body of text"
    }

    return request(app)
    .post("/api/articles/123456789/comments")
    .send(testComment)
    .expect(404)
    .then(({body}) => {
      expect(body.msg).toBe("Article not found!")
    })
  })
})

describe("PATCH /api/articles/:article_id", () => {
  test("200: Increments the vote count on a requested article by a specified amount and responds with updated article", () => {
    // Arrange
    const votes = {inc_votes: 50} 
    return request(app)
    .patch("/api/articles/1")
    .send(votes)
    .expect(200)
    .then((result) => {
      const {article} = result.body
      
      expect(article).toMatchObject({
        article_id: 1,
        votes: 150,
        title: expect.any(String),
        topic: expect.any(String),
        author: expect.any(String),
        body: expect.any(String),
        created_at: expect.any(String),
        article_img_url: expect.any(String)
      })
    })
  })
  
  test("200: Decrements the vote count on a requested article by a specified amount", () => {
    // Arrange
    const votes = {inc_votes: -45} 
    return request(app)
    .patch("/api/articles/1")
    .send(votes)
    .expect(200)
    .then((result) => {
      const {article} = result.body
      expect(article.votes).toBe(55)
    })
  })

  test("ERROR - 400: Responds with 'Bad request!' when inc_votes inputted is not a number", () => {
    // Arrange
    const votes = {inc_votes: "This is not a number"} 
    return request(app)
    .patch("/api/articles/1")
    .send(votes)
    .expect(400)
    .then(({body}) => {
      expect(body.msg).toBe("Bad request!")
    })
  })

  test("ERROR - 400: Responds with 'Bad request!' when article_id inputted is not a number", () => {
    // Arrange
    const votes = {inc_votes: "This is not a number"} 
    return request(app)
    .patch("/api/articles/not-a-number")
    .send(votes)
    .expect(400)
    .then(({body}) => {
      expect(body.msg).toBe("Bad request!")
    })
  })

  test("ERROR - 404: Responds with 'Article not found!' when article_id requested does not exist", () => {
    // Arrange
    const votes = {inc_votes: 10} 
    return request(app)
    .patch("/api/articles/123456789")
    .send(votes)
    .expect(404)
    .then(({body}) => {
      expect(body.msg).toBe("Article not found!")
    })
  })
})