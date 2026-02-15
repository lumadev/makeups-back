export const errorHandler = (err, req, res, _next) => {
  const statusCode = err.status || 500

  res.status(statusCode).json({
    error: true,
    message: statusCode === 500 ? 'Internal Server Error' : err.message,
    ...(process.env.NODE_ENV === 'development' && { stack: err.stack })
  })
}