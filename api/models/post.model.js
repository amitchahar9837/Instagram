import mongoose from 'mongoose';
const { ObjectId } = mongoose.Schema.Types
const postSchema = new mongoose.Schema({
    caption: {
        type: String,
    },
    picture: {
        type: String,
        required: true,
    },
    likes: [{ type: ObjectId, ref: "user"  }],
    comments:[{
        text:String,
        postedBy:{type:ObjectId,ref:"user"}
    }],
    postedBy: {
        type: ObjectId,
        ref: "user"
    }
},{timestamps:true})

const Post = mongoose.model('post', postSchema);
export default Post;