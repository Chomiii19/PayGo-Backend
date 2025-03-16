import jwt from "jsonwebtoken";

const verifyToken = (token: string) => {
  if (!process.env.JWT_SECRET_KEY) {
    throw new Error("Secret key is not defined in environment variables");
  }

  return jwt.verify(token, process.env.JWT_SECRET_KEY);
};

export default verifyToken;
