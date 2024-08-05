export default (schema) => {
  return (req, res, next) => {
    const { error } = schema.validate(req.body);
    if (error) {
      const message = `Data validation was unsuccessful: ${error.details[0].message}`;
      return res.status(400).json({ message });
    }

    return next();
  };
};
