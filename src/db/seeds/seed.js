const db = require("../connection");
const format = require("pg-format");
const { convertTimestampToDate, createRef } = require("./utils");

const seed = async ({ topicData, userData, articleData, commentData }) => {
  await db.query(`DROP TABLE IF EXISTS comments;`);
  await db.query(`DROP TABLE IF EXISTS articles;`);
  await db.query(`DROP TABLE IF EXISTS users;`);
  await db.query(`DROP TABLE IF EXISTS topics;`);

  await db.query(`CREATE TABLE topics (
    slug VARCHAR PRIMARY KEY,
    description VARCHAR,
    img_url VARCHAR(1000)
    );`);

  await db.query(`CREATE TABLE users (
    username VARCHAR PRIMARY KEY,
    name VARCHAR,
    avatar_url VARCHAR(1000)
    );`);

  await db.query(`CREATE TABLE articles (
    article_id SERIAL PRIMARY KEY,
    title VARCHAR,
    topic VARCHAR REFERENCES topics(slug), 
    author VARCHAR REFERENCES users(username),
    body TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    votes INT DEFAULT 0,
    article_img_url VARCHAR(1000)
    )`);

  await db.query(`CREATE TABLE comments (
    comment_id SERIAL PRIMARY KEY,
    article_id INT REFERENCES articles(article_id) ON DELETE CASCADE,
    body TEXT,
    votes INT DEFAULT 0,
    author VARCHAR REFERENCES users(username),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
    )`);

  //! Insert Topics Data
  const formattedTopics = topicData.map(({ slug, description, img_url }) => [
    slug,
    description,
    img_url,
  ]);
  const insertTopicsData = format(
    `INSERT INTO topics (slug, description, img_url)
    VALUES %L;`,
    formattedTopics
  );
  await db.query(insertTopicsData);

  //! Insert Users Data
  const formattedUsers = userData.map(({ username, name, avatar_url }) => [
    username,
    name,
    avatar_url,
  ]);
  const insertUsersData = format(
    `INSERT INTO users (username, name, avatar_url) VALUES %L;`,
    formattedUsers
  );
  await db.query(insertUsersData);

  //! Insert Aricles Data
  const createdAtErrorCorrectedArticlesData = articleData.map(
    convertTimestampToDate
  );
  const formattedArticles = createdAtErrorCorrectedArticlesData.map(
    ({ title, topic, author, body, created_at, votes, article_img_url }) => [
      title,
      topic,
      author,
      body,
      created_at,
      votes,
      article_img_url,
    ]
  );
  const insertArticlesData = format(
    `INSERT INTO articles (title, topic, author, body, created_at, votes, article_img_url) VALUES %L RETURNING *;`,
    formattedArticles
  );

  const insertedArticles = await db.query(insertArticlesData);

  //! Insert Comments Data
  const articlesRefObject = createRef(insertedArticles.rows);
  const createdAtErrorCorrectedCommentsData = commentData.map(
    convertTimestampToDate
  );
  const formattedComments = createdAtErrorCorrectedCommentsData.map(
    (comment) => {
      return [
        articlesRefObject[comment.article_title],
        comment.body,
        comment.votes,
        comment.author,
        comment.created_at,
      ];
    }
  );
  const insertCommentsData = format(
    `INSERT INTO comments (article_id, body, votes, author, created_at) VALUES %L;`,
    formattedComments
  );
  await db.query(insertCommentsData);
  console.log("🌱 Seed complete! 🌱");
};

module.exports = seed;
