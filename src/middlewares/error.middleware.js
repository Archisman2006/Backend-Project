import { ApiError } from "../utils/ApiError.js";

export const errorHandler=(err,req,res,next)=>{
    let error=err;
    if(!(error instanceof ApiError)){
        const statusCode=error.statusCode || 500;
        const message=error.message || "Something went wrong";
        error=new ApiError(statusCode,message,[],error?.stack);
    }
    const response={
        statusCode:error.statusCode,
        success:error.success,
        message:error.message,
        errors:error.errors,

    };
    return res.status(error.statusCode).json(response);
}