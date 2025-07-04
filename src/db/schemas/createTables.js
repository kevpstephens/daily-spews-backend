const db = require("../connection");

const createTables = async () => {
  await db.query("DROP TABLE IF EXISTS comments CASCADE;");
  await db.query("DROP TABLE IF EXISTS articles CASCADE;");
  await db.query("DROP TABLE IF EXISTS users CASCADE;");
  await db.query("DROP TABLE IF EXISTS topics CASCADE;");

  //! Create Topics Table
  await db.query(`CREATE TABLE topics (
    slug VARCHAR PRIMARY KEY,
    description VARCHAR,
    img_url VARCHAR(1000)
  );`);

  //! Create Users Table
  await db.query(`CREATE TABLE users (
    username VARCHAR PRIMARY KEY,
    name VARCHAR,
    email TEXT UNIQUE NOT NULL,
    password_hash TEXT NOT NULL,
    avatar_url VARCHAR(1000),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
  );`);

  //! Create Articles Table
  await db.query(`CREATE TABLE articles (
    article_id SERIAL PRIMARY KEY,
    title VARCHAR,
    topic VARCHAR REFERENCES topics(slug), 
    author VARCHAR REFERENCES users(username),
    body TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    votes INT DEFAULT 0,
    article_img_url VARCHAR(1000)
  );`);

  //! Create Comments Table
  await db.query(`CREATE TABLE comments (
    comment_id SERIAL PRIMARY KEY,
    article_id INT REFERENCES articles(article_id) ON DELETE CASCADE,
    body TEXT,
    votes INT DEFAULT 0,
    author VARCHAR REFERENCES users(username),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
  );`);
};

module.exports = createTables;
