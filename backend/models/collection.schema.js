import  mongoose  from "mongoose";

const collectionSchema = new mongoose.Schema(
    {
        name:{
            type: String,
            required: ['true' , "Please provide a category name"],
            trim: true,
            maxLength:[120, "collection name should not be more then 120 characters"]
        },

    },
    {
        timestamps:true
    }
)

export default mongoose.model("Collection" , collectionSchema)
