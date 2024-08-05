const authorizeUser = (req, res, next) => {
  const requestedUserId = req.params.id;
  const authenticatedUserId = req.body.userId;

  if (authenticatedUserId !== requestedUserId) {
    return res.status(403).json({ message: "Access denied" });
  }

  return next();
};

export default authorizeUser;
