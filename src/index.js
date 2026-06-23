import dotenv from 'dotenv'
dotenv.config({path:'./.env'});
import { app } from './app.js';
//require('dotenv').config({path:'./env'});
import { connectDB } from "./db/index.js";
connectDB().then(()=>{
    if (!process.env.VERCEL) {
        app.listen(process.env.PORT || 8000,()=>{
            console.log("Server is running on port: "+(process.env.PORT || 8000));
        })
    } else {
        console.log("Connected to MongoDB (Serverless Mode)");
    }
})
.catch((error)=>{
    console.log("mongodb connection failed. 2",error);
})
export default app;








// (
//     async ()=>{
//         try {
//             await mongoose.connect(`${process.env.MONGODB_URI}/${db_name}`);
//             app.on("error",(error)=>{
//                 console.log("error: "+error); throw error;
//             })
//             app.listen(process.env.PORT,()=>{
//                 console.log(`App is listening on port ${process.env.PORT}`);
//             })
//         } catch (error) {
//             console.error(error); throw error;
//         }
//     }
// )();