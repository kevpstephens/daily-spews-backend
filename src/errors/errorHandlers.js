exports.handleCustomErrors = (err, req, res, next) => {
  if (err.status && err.msg) {
    return res.status(err.status).send({ msg: err.msg });
  } else {
    next(err);
  }
};

exports.handlePSQLErrors = (err, req, res, next) => {
  if (err.code === "22P02") {
    return res.status(400).send({ msg: "400: Bad Request!" });
  }
  if (err.code === "23503") {
    return res
      .status(404)
      .send({ msg: "404: Foreign key violation - Resource not found!" });
  } else {
    next(err);
  }
};

exports.handleServerErrors = (err, req, res, next) => {
  return res.status(500).send({ msg: "Internal server error!" });
};
