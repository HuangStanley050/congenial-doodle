import jwt from "jsonwebtoken";

export const generateToken = id => {
  return jwt.sign({ userId: id }, "secret", { expiresIn: "1h" });
};
