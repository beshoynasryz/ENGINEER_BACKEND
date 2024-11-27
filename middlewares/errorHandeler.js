
// Error-handling middleware
module.exports = (err, req, res, next) => {
    // Handle the error
  
    err.statusCode = err.statusCode || 500
    err.status = err.status || "error"
  
    res.status(err.statusCode).json({
      status: err.status,
    //   error: err,
      message: err.message,
      stack: err.stack
    });
  }
  