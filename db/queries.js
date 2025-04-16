const db = require("./connection.js");



// db.query("SELECT * FROM users;")
// .then((result) => {
//     console.log("\n ===== Get all of the users: ===== \n")
//     console.table(result.rows);
// });

// db.query("SELECT * FROM articles WHERE topic = 'coding';")
// .then((result) => {
//   console.log("\n ===== Get all of the articles where the topic is coding: ===== \n");
//   console.table(result.rows);
// });

// db.query("SELECT * FROM comments WHERE votes < 0;")
// .then((result) => {
//     console.log("Get all of the comments where the votes are less than zero")
//     console.table(result.rows);
// });

// db.query("SELECT * FROM topics;")
// .then((result) => {
//     console.log("Get all of the topics:")
//     console.table(result.rows);
// }); 

// db.query("SELECT * FROM articles WHERE author = 'grumpy19';")
// .then((result) => {
//     console.log("Get all of the articles by user grumpy19:")
//     console.table(result.rows);
// }); 

// db.query("SELECT * FROM comments WHERE votes > 10;")
// .then((result) => {
//     console.log("Get all of the comments that have more than 10 votes.:")
//     console.table(result.rows);
// }); 



const runQueries = async () => {
  try {
    const getUsersResult = await db.query("SELECT * FROM users;");
    console.log("\n ===== Get all of the users: ===== \n")
    console.table(getUsersResult.rows);

    const getAllCodingArticles = await db.query(
      "SELECT article_id, title, author, created_at FROM articles WHERE topic = 'coding';"
    ); // body excluded for readability
    console.log("\n ===== Get all of the articles where the topic is coding: ===== \n")
    console.table(getAllCodingArticles.rows);

    const getCommentsVotesAbove0 = await db.query("SELECT comment_id, article_id, votes, author, created_at FROM comments WHERE votes < 0;") // body excluded for readability 
    console.log("\n ===== Get all of the comments where the votes are less than zero: ===== \n")
    console.table(getCommentsVotesAbove0.rows)

    const getAllTopics = await db.query("SELECT * FROM topics;")
    console.log("\n ===== Get all of the topics: ===== \n")
    console.table(getAllTopics.rows)

    const getAllGrumpy19Articles = await db.query("SELECT article_id, title, topic, author, created_at, votes FROM articles WHERE author = 'grumpy19';") // body & article_img_url excluded for readability
    console.log("\n ===== Get all of the articles by user grumpy19: ===== \n")
    console.table(getAllGrumpy19Articles.rows)

    const getCommentsWith10PlusVotes = await db.query("SELECT * FROM comments WHERE votes > 10;")
    console.log("\n ===== Get all of the comments that have more than 10 votes: ===== \n")
    console.table(getCommentsVotesAbove0.rows)

  } catch (err) {
    console.error("Error running queries", err);
  } finally {
    await db.end();
  }
};

runQueries();


// console.log("\n =====  ===== \n")
