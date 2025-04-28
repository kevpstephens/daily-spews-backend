// import db object from connection file - gives access to PostgreSQL database through pg client
const db = require("../connection");
// import pg-format, Node.js package that helps build SQL queries.
const format = require("pg-format");
const { convertTimestampToDate, createRef } = require("./utils");

const seed = async ({ topicData, userData, articleData, commentData }) => {
  // using async means this function will return a promise - grants use of await keyword inside function.
  await db.query(`DROP TABLE IF EXISTS comments;`); // have in reverse dependency order
  await db.query(`DROP TABLE IF EXISTS articles;`);
  await db.query(`DROP TABLE IF EXISTS users;`);
  await db.query(`DROP TABLE IF EXISTS topics;`);
  // to view table -> terminal: psql nc_news_test -> \d topics

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
  const createdAtErrorCorrectedArticlesData = articleData.map(convertTimestampToDate);
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

  const insertedArticles = await db.query(insertArticlesData)

  //! Insert Comments Data
  // console.log(insertedArticles, '<<<<<<<<<<<<<<<<<<<<---------------------insertedArticles')
  const articlesRefObject = createRef(insertedArticles.rows)
  const createdAtErrorCorrectedCommentsData = commentData.map(convertTimestampToDate);
  const formattedComments = createdAtErrorCorrectedCommentsData.map((comment) => {
    return [
      articlesRefObject[comment.article_title], 
      comment.body, 
      comment.votes, 
      comment.author, 
      comment.created_at
    ]
  })
  const insertCommentsData = format(
    `INSERT INTO comments (article_id, body, votes, author, created_at) VALUES %L;`, formattedComments
  );
  await db.query(insertCommentsData)
  console.log("Seed complete!")
};

module.exports = seed;




// sql = format('INSERT INTO t (name, age) VALUES %L', myNestedArray);
// %L = Literal values - used for strings, numbers, dates etc. - like a place holder for the values passed as second argument





// // .then version

// // console.log(formattedArticles, '<<<<<<<<<<<<<<<<<<<<----------------------formattedArticles')
// // console.log(insertArticlesData, '<<<<<<<<<<<<<<<<<<<<----------------------insertArticlesData')
// .then((result) => {
//   // console.log(result, '<<<<<<<<<<<<<<<<<<<<----------------------result')
//   // console.log(result.rows, '<<<<<<<<<<<<<<<<<<<<----------------------result')
//   const articlesRefObject = createRef(result.rows)
//   // console.log(articlesRefObject, '<<<<<<<<<<<<<<<<<<<<----------------------articlesRefObject')
//   const createdAtErrorCorrectedCommentsData = commentData.map(convertTimestampToDate);
//   const formattedComments = createdAtErrorCorrectedCommentsData.map((comment) => {
//     return [
//       articlesRefObject[comment.article_title], 
//       comment.body, 
//       comment.votes, 
//       comment.author, 
//       comment.created_at
//     ]
//   })
//   // console.log(formattedComments, '<<<<<<<<<<<<<<<<<<<<----------------------formattedComments')
//   const insertCommentsData = format(
//     `INSERT INTO comments (article_id, body, votes, author, created_at) VALUES %L;`,
//     formattedComments
//   )
//   return db.query(insertCommentsData)
// })  
// await console.log("seed complete")