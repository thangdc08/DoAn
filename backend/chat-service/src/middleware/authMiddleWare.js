import jwt from "jsonwebtoken";
import { jwtSecret, trustGatewayJwt } from "../configuration/index.js";

export const authMiddleware = (req, res, next) => {
  const token = getBearerToken(req);

  if (!token) {
    return res.status(401).json({ code: 401, message: "Token khong hop le!" });
  }

  if (!jwtSecret && !trustGatewayJwt) {
    return res.status(500).json({
      code: 500,
      message: "Missing SECRET_KEY for chat-service (or set TRUST_GATEWAY_JWT=true in dev).",
    });
  }

  try {
    const decoded = trustGatewayJwt ? jwt.decode(token) : jwt.verify(token, jwtSecret);

    if (!decoded) {
      return res.status(401).json({ code: 401, message: "Token khong hop le hoac da het han!" });
    }

    req.user = decoded;
    next();
  } catch (error) {
    if (error.name === "TokenExpiredError") {
      return res.status(401).json({ code: 401, message: "Token da het han!" });
    }

    if (error.name === "JsonWebTokenError") {
      return res.status(401).json({ code: 401, message: "Token khong hop le!" });
    }

    console.error("Token verification error:", error);
    return res.status(500).json({ code: 500, message: "Internal auth verification error!" });
  }
};

export const getBearerToken = (req) => {
  const authHeader = req.headers["authorization"];
  if (authHeader && authHeader.startsWith("Bearer ")) {
    return authHeader.substring(7);
  }
  return null;
};
