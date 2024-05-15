const jwt = require("jwt-simple");

exports.authenticate = (req, res, next) => {
  const token = req.headers.authorization.split(" ")[1];
  try {
    const decoded = jwt.decode(
      token,
      process.env.JWT_SECRET ||
        "745e3cba4ca842aec9739870f667d4c663e0a001609567aa7009a2e41613d660"
    );
    req.user = decoded;
    next();
  } catch (error) {
    res.status(401).send({ message: "Unauthorized" });
  }
};
