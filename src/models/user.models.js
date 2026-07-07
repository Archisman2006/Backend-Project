import mongoose from 'mongoose'
import bcrypt from 'bcrypt'
import jwt from 'jsonwebtoken'
import mongooseAggregatePaginate from 'mongoose-aggregate-paginate-v2'
const userSchema=new mongoose.Schema(
    {
        username:{
            type:String, required:true,unique:true,lowercase:true,trim:true,index:true
        },
        email:{
            type:String, required:true,unique:true,lowercase:true,trim:true
        },
        fullName:{
            type:String, required:true,trim:true
        },
        avatar:{
            type:String, required:true,trim:true
        },
        coverImage:{
            type:String
        },
        googleId:{
            type:String,unique:true,sparse:true
        },
        watchHistory:[{
            type:mongoose.Schema.Types.ObjectId,
            ref:'Video'
        }],
        password:{
            type:String
        },
        refreshToken:{
            type:String
        },
        isVerified:{
            type:Boolean,
            default:false
        },
        verificationCode:{
            type:String
        },
        verificationCodeExpiry:{
            type:Date,
            default:null
        }
    },
    {timestamps:true}
)
userSchema.pre("save",async function (next){
    if(!this.isModified("password") || !this.password) { return;}
    this.password=await bcrypt.hash(this.password,10);
})
userSchema.methods.isPasswordCorrect=async function(password){
    if(!password) return false;
    return await bcrypt.compare(password,this.password);
} 
userSchema.methods.generateAccessToken=function(){
    return jwt.sign(
        {
            _id:this._id, email:this.email,username:this.username,fullName:this.fullName
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
userSchema.plugin(mongooseAggregatePaginate)
export const User=mongoose.model("User",userSchema);