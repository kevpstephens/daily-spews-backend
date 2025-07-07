const endpoints = require("../../../endpoints.json");

//! GET /api
exports.getApi = (req, res, next) => {
  try {
    return res.status(200).send({ endpoints });
  } catch (err) {
    return next(err);
  }
};
