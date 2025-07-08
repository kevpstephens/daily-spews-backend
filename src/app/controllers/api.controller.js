import endpoints from "../../../endpoints.json" with { type: "json" };

//! GET /api
export default function getApi(req, res, next) {
  try {
    return res.status(200).send({ endpoints });
  } catch (err) {
    return next(err);
  }
}
