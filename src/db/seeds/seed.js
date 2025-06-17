const bcrypt = require("bcrypt");
const db = require("../connection");
const format = require("pg-format");
const { convertTimestampToDate, createRef } = require("./utils");
const createTables = require("../schemas/createTables");

const seed = async ({ topicData, userData, articleData, commentData }) => {
  try {
    await createTables();

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
    const hashedUsers = await Promise.all(
      userData.map(async ({ username, name, email, password, avatar_url }) => {
        // Hash the password with 10 salt rounds
        const password_hash = await bcrypt.hash(password, 10);
        return [username, name, email, password_hash, avatar_url];
      })
    );
    const insertUsersData = format(
      `INSERT INTO users (username, name, email, password_hash, avatar_url) VALUES %L;`,
      hashedUsers
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
  } catch (err) {
    console.error("❌ Error seeding database:", err.message);
    throw err;
  }
};

module.exports = seed;
