import mongoose from "mongoose";

const productSchema = new mongoose.Schema(
    {
        name:{
            type: String,
            required: [true, "Please provide product name"],
            trim: true,
            maxLength: [120, "Product name should be a max of 120 char"]
        },
        price:{
            type: Number,
            required: [true, "Please provide product price"],
            maxLength: [5, "Product price should be not more than 5 digit"]
        },
        description: {
            type: String,
            // use some form of editor
        },
        photos: [
            {
                secure_url: {
                    type:String,
                    required: true
                }
            },
        ],
        stock:{
            type: Number,
            default:0
        },
        sold:{
            type: Number,
            default:0
        },
        collectionId:{
            type: mongoose.Schema.Types.ObjectId,
            ref:"Collection"
        },
    },
    {
        timestamps: true
    }
)

export default mongoose.model("Product",productSchema)