const {constants} = require('../constants')
const errorHandler =(err,req,res,next)=>{
    const statusCode = res.statusCode? res.statusCode : 500
    res.json({message: err.message, stackTrace:err.stack})
    switch (statusCode){
        case constants.VALIDATION_ERROR:
            res.json({
                title:"validation failed",
                message: err.message,
                stackTrace: err.stack
            });
            break;
        case constants.UNAUTHORISED:
            res.json({
                title:"unauthorised",
                message: err.message,
                stackTrace: err.stack
            });
        case constants.FORBIDDEN:
            res.json({
                title:"forbidden",
                message: err.message,
                stackTrace: err.stack
            });
        case constants.SERVER_ERROR:
            res.json({
                title:"server error",
                message: err.message,
                stackTrace: err.stack
            });
            default:
                console.log("No error");
                break
    }
}
module.exports= errorHandler;