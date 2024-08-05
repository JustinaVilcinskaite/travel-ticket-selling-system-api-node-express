import jwt from "jsonwebtoken";

const authUser = (req, res, next) => {
  try {
    const accessToken = req.headers.authorization;

    if (!accessToken) {
      return res.status(401).json({ message: "Auth failed" });
    }

    const decodedInfo = jwt.verify(accessToken, process.env.JWT_SECRET);

    req.body.userId = decodedInfo.userId;
    return next();
  } catch (error) {
    console.log(error);
    res.status(401).json({ message: "Auth failed" });
  }
};

export default authUser;
