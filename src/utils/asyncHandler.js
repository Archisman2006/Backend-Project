
const asynchandler=(requesthandler)=>{
    return (req,res,next)=>{
        Promise.resolve(requesthandler(req,res,next)).catch((error)=>next(error));
    }
}

// const asynchandler=(requestHandler)=>async (req,res,next)=>{
//     try {
//         await requestHandler(req,res,next);
//     } catch (error) {
//         res.status(error.code).json({success:false,message:error.message});
//     }
// }

export {asynchandler};