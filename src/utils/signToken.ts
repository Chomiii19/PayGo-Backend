import jwt from "jsonwebtoken";

const signToken = (id: string): string => {
  if (!process.env.JWT_SECRET_KEY) {
    throw new Error("Secret key is not defined in environment variables");
  }

  return jwt.sign({ id }, process.env.JWT_SECRET_KEY, {
    expiresIn: Number(process.env.JWT_EXPIRES_AT),
  });
};

export default signToken;
