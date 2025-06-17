const endpoints = require("../../../endpoints.json");

//! GET /api
exports.getApi = (req, res) => {
  res.status(200).send({ endpoints });
};
