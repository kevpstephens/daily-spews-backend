export const handleCustomErrors = (err, req, res, next) => {
  if (err.status && err.message) {
    return res.status(err.status).send({ msg: err.message });
  }
  return next(err);
};

export const handlePSQLErrors = (err, req, res, next) => {
  if (err.code === "22P02") {
    return res.status(400).send({ msg: "Bad request!" });
  }
  if (err.code === "23503") {
    return res
      .status(404)
      .send({ msg: "Foreign key violation - resource not found!" });
  }
  if (err.code === "23505") {
    return res.status(500).send({ msg: "Email or username already exists!" });
  }
  return next(err);
};

export const handleServerErrors = (err, req, res) =>
  res.status(500).send({ msg: "Internal server error!" });
