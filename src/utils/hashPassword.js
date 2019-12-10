import bcrypt from "bcryptjs";

export const hashPassword = password => {
  if (password.length < 8) {
    throw new Error("Password must be greater than 8 characters");
  }
  return bcrypt.hash(password, 10);
};
