const db = require("../../db/connection");

exports.convertTimestampToDate = ({ created_at, ...otherProperties }) => {
  if (!created_at) return { ...otherProperties };
  return { created_at: new Date(created_at), ...otherProperties };
};


// Correcting issue where articles.js data does not store article_id
// Reference Object aka Lookup Table
// article_title = KEY, article_id = VALUE
// Function should take an array of articles, and output an object containing article_title and article_id
// Example: { "They're not exactly dogs, are they?" : 1 }

exports.createRef = (articlesData) => {
  if (articlesData.length === 0) {
    return {}
  }
  const result = {}
  articlesData.forEach((article) => {
    result[article.title] = article.article_id
  })
  
  return result
};