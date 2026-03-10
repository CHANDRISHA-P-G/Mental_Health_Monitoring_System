const jwt = require("jsonwebtoken");

module.exports = function (req, res, next) {
  const header = req.header("Authorization");

  if (!header) {
    return res.status(401).json({ msg: "No token, authorization denied" });
  }

  const token = header.split(" ")[1];

  if (!token) {
    return res.status(401).json({ msg: "Token missing" });
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    // Supports both formats
    req.user = {
      id: decoded.id || decoded.user?.id
    };

    if (!req.user.id) {
      return res.status(401).json({ msg: "Invalid token structure" });
    }

    next();

  } catch (err) {
    return res.status(401).json({ msg: "Token is not valid" });
  }
};