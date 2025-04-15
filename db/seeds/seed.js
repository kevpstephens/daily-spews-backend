const db = require("../connection"); // import db object from connection file - gives access to PostgreSQL database through pg client
const format = require("pg-format"); // import pg-format, Node.js package that helps build SQL queries.
const { convertTimestampToDate } = require("./utils");

const seed = async ({ topicData, userData, articleData, commentData }) => {
  // using async means this function will return a promise - grants use of await keyword inside function.
  await db.query(`DROP TABLE IF EXISTS comments;`);
  await db.query(`DROP TABLE IF EXISTS articles;`);
  await db.query(`DROP TABLE IF EXISTS users;`);
  await db.query(`DROP TABLE IF EXISTS topics;`); // have in reverse dependency order
  // to view table -> terminal: psql nc_news_test -> \d topics
  //! Topics Table
  await db.query(`CREATE TABLE topics (
    slug VARCHAR PRIMARY KEY,
    description VARCHAR,
    img_url VARCHAR(1000)
    );`);
  //! Users Table
  await db.query(`CREATE TABLE users (
    username VARCHAR PRIMARY KEY,
    name VARCHAR,
    avatar_url VARCHAR(1000)
    );`);
  //! Articles Table
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
  //! Comments Table
  await db.query(`CREATE TABLE comments (
    comment_id SERIAL PRIMARY KEY,
    article_id INT REFERENCES articles(article_id) ON DELETE CASCADE,
    body TEXT,
    votes INT DEFAULT 0,
    author VARCHAR REFERENCES users(username),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
    )`);

  // to view insertions => terminal: psql psql nc_news_test -> SELECT * FROM topics;

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
    `INSERT INTO articles (title, topic, author, body, created_at, votes, article_img_url) VALUES %L;`,
    formattedArticles
  );
  await db.query(insertArticlesData);

  // const createdAtErrorCorrectedCommentsData = commentData.map(convertTimestampToDate);
  // const formattedComments = createdAtErrorCorrectedCommentsData.map(
  //   ({ article_title, body, votes, author, created_at }) => [
  //     article_title,
  //     body,
  //     votes,
  //     author,
  //     created_at,
  //   ]
  // );
  // const insertCommentsData = format(
  //   `INSERT INTO comments (article_title, body, votes, author, created_at) VALUES %L;`,
  //   formattedComments
  // )
  // await db.query(insertCommentsData)
  //! Insert Comments Data
};

module.exports = seed;

// sql = format('INSERT INTO t (name, age) VALUES %L', myNestedArray);
// %L = Literal values - used for strings, numbers, dates etc.
