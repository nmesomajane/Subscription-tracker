 const errorMiddleware = (err, req, res, next) => {
   try{
  let  error = { ...err };
  error.message = err.message;
    console.log(err);

    if (err.name === 'CastError') {
        error.message = 'RESOURCE NOT FOUND. Invalid: ' + err.path;
        error = new Error(error.message);
        error.statusCode = 404;
    }
       if (err.code === 11000) {
        error.message = 'Duplicate field value entered';
        error = new Error(error.message);
        error.statusCode = 400;

        // mongoose validation error
        if (err.name === 'ValidationError') {
            const messages = Object.values(err.errors).map(val => val.message);
            error.message = messages.join(', ');
            error = new Error(error.message);
            error.statusCode = 400;
        }
        res.status(error.statusCode || 500).json({
            success: false,
            error: error.message || 'Server Error'
        });
    }
   } catch (error) {
     
   }next(err);
}
    
export default errorMiddleware;