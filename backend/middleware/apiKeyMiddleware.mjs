const apiKeyMiddleware = function (req, res, next) {
  // const apiKey = req.query.api_key;
  // const validApiKey = process.env.API_KEY;

  // if (apiKey && apiKey === validApiKey) {
  //   next();
  // } else {
  //   res.status(401).json({ message: "Unauthorized: Invalid API key" });
  // }
  next();
};
export default apiKeyMiddleware;
