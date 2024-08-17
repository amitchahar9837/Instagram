import mongoose from "mongoose";
const { ObjectId } = mongoose.Schema.Types
const userSchema = new mongoose.Schema({
    name:{
        type:String,
        required:true,
    },
    username:{
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
        default:'https://i.pinimg.com/474x/51/f6/fb/51f6fb256629fc755b8870c801092942.jpg'
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