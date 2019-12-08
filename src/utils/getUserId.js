import jwt from "jsonwebtoken";
export const getUserId = (req, requireAuth = true) => {
  const header = req.request.headers.authorization;

  if (header) {
    const token = header.replace("Bearer ", "");
    const decoded = jwt.verify(token, "secret");

    return decoded.userId;
  }
  if (requireAuth) {
    throw new Error("Authentication required");
  }
  return null;
};
