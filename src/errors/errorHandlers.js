exports.handleCustomErrors = (err, req, res, next) => {
  if (err.status && err.msg) {
    return res.status(err.status).send({ msg: err.msg });
  } else {
    next(err);
  }
};

exports.handlePSQLErrors = (err, req, res, next) => {
  if (err.code === "22P02") {
    return res.status(400).send({ msg: "Bad request!" });
  }
  if (err.code === "23503") {
    return res
      .status(404)
      .send({ msg: "Foreign key violation - resource not found!" });
  } else {
    next(err);
  }
};

exports.handleServerErrors = (err, req, res, next) => {
  return res.status(500).send({ msg: "Internal server error!" });
};
