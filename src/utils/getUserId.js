import jwt from "jsonwebtoken";
export const getUserId = req => {
  const header = req.request.headers.authorization;

  if (!header) {
    throw new Error("Authentication required");
  }
  const token = header.replace("Bearer ", "");
  const decoded = jwt.verify(token, "secret");

  return decoded.userId;
};
