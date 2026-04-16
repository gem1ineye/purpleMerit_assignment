import jwt from "jsonwebtoken";

const verifyJWT = (req, res, next) => {
  const authHeader = req.headers.authorization || "";
  const [scheme, token] = authHeader.split(" ");

  if (scheme !== "Bearer" || !token) {
    return res.status(401).json({ success: false, message: "Missing or invalid token" });
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.user = {
      id: decoded.id,
      role: decoded.role,
      email: decoded.email
    };
    return next();
  } catch {
    return res.status(401).json({ success: false, message: "Token verification failed" });
  }
};

export default verifyJWT;
