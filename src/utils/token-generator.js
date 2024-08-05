import jwt from "jsonwebtoken";

const generateAccessToken = (user) => {
  return jwt.sign(
    { email: user.email, userId: user.id },
    process.env.JWT_SECRET,
    { expiresIn: "2h" }
  );
};

const generateRefreshToken = (user) => {
  return jwt.sign(
    { email: user.email, userId: user.id },
    process.env.JWT_REFRESH_SECRET,
    { expiresIn: "24h" }
  );
};

export { generateAccessToken, generateRefreshToken };
