const errorMiddleware = {};

errorMiddleware.handleErrors = (error, req, res, next) => {
  console.error(error);
  const status = error.status || 500;
  const message = error.message || 'Internal server error';
  res.status(status).json({ message });
};

module.exports = errorMiddleware;
