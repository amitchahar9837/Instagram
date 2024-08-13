import mongoose from "mongoose";
const { ObjectId } = mongoose.Schema.Types
const userSchema = new mongoose.Schema({
    name:{
        type:String,
        required:true,
    },
    username:{
        default:'Instagram User',
        type:String,
        unique:true,
        required:true,
    },
    email:{
        type:String,
        unique:true,
        required:true,
    },
    password:{
        type:String,
        required:true
    },
    dp:{
        type:String,
        default:'https://res.cloudinary.com/ascoder/image/upload/v1711302086/opjujso3dr4bn0w9mo82.png'
    },
    followers:[{type:ObjectId, ref:"user"}],
    following:[{type:ObjectId, ref:"user"}],
    token:{
        type:String,
        default:'',
    }
})

const User = mongoose.model("user",userSchema);
export default User;