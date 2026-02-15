import dotenv from 'dotenv'
dotenv.config({path:'./.env'});
//require('dotenv').config({path:'./env'});
import { connectDB } from "./db/index.js";;
connectDB();








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