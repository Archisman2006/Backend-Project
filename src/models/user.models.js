import mongoose from 'mongoose'
import bcrypt from 'bcrypt'
import jwt from 'jsonwebtoken'
const userSchema=new mongoose.Schema(
    {
        userName:{
            type:String, required,unique,lowercase,trim,index
        },
        email:{
            type:String, required,unique,lowercase,trim
        },
        fullName:{
            type:String, required,trim
        },
        avatar:{
            type:String, required,unique,lowercase,trim
        },
        coverImage:{
            type:String
        },
        watchHistory:{
            type:mongoose.Schema.Types.ObjectId,
            ref:'Video'
        },
        password:{
            type:String, required:[true,'Password is required']
        },
        refreshToken:{
            type:String
        }
    },
    {timestamps}
)
userSchema.pre("save",async function (next){
    if(!this.isModified("password")) {next(); return;}
    this.password=await bcrypt.hash(this.password,10);
})
userSchema.methods.isPasswordCorrect=async function(password){
    return await bcrypt.compare(password,this.password);
} 
userSchema.methods.generateAccessToken=function(){
    return jwt.sign(
        {
            _id:this._id, email:this.email,userName:this.userName,fullName:this.fullName
        },
        process.env.ACCESS_TOKEN_SECRET,
        {
            expiresIn: process.env.ACCESS_TOKEN_EXPIRY
        }
    )
}
userSchema.methods.generateRefreshToken=function(){
    return jwt.sign(
        {
            _id:this._id
        },
        process.env.REFRESH_TOKEN_SECRET,
        {
            expiresIn: process.env.REFRESH_TOKEN_EXPIRY
        }
    )
}
export const User=mongoose.model("User",userSchema);