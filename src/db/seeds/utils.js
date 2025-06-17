// Converts created_at timestamps into Date objects (for seed data)
exports.convertTimestampToDate = ({ created_at, ...otherProperties }) => {
  if (!created_at) return { ...otherProperties };
  return { created_at: new Date(created_at), ...otherProperties };
};

// Builds reference object: { article_title: article_id }
exports.createRef = (articlesData) => {
  if (articlesData.length === 0) {
    return {};
  }
  const result = {};
  articlesData.forEach((article) => {
    result[article.title] = article.article_id;
  });

  return result;
};
