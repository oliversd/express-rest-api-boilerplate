const validateRequest = schema => (req, res, next) => {
  req.check(schema);

  req.getValidationResult()
      .then((result) => {
        if (!result.isEmpty()) {
          result.throw(result.array);
        }
        next();
      })
      .catch(r => next(r.mapped()));
};

export default validateRequest;
