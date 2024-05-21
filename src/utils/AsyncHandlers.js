const asyncHandler = (requestFn) => (req, res, next) => {
  Promise.resolve(requestFn(req, res, next)).catch(next);
};

const wrapInTryCatch = (requestFn) => async (req, res, next) => {
  try {
    await requestFn(req, res, next);
  } catch (err) {
    next(err);
  }
};
