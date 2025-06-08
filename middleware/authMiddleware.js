const jwt = require("jsonwebtoken");

function authMiddleware(req, res, next) {
  const token =
    req.cookies?.accessToken || req.headers.authorization?.split(" ")[1];

  if (!token) {
    return res.status(401).json({ message: "Нет токена" });
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.user = decoded;
    next();
  } catch (err) {
    console.error("Ошибка в authMiddleware:", err);
    return res.status(401).json({ message: "Недействительный токен" });
  }
}

module.exports = authMiddleware;

