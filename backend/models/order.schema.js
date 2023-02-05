import mongoose from "mongoose";

const orderShema = new mongoose.Schema(
    {
        products: {
            type: [
                {
                    productId: {
                        type: mongoose.Schema.Types.ObjectId,
                        ref: "Product",
                        required: true
                    },
                    count: Number,
                    price: Number
                }
            ],
            required: true
        },
        user: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "User"
        },
        address: {
            type: String,
            required: ture
        },
        phoneNumber: {
            type: Number,
            required: ture
        },
        amount: {
            type: Number,
            required: ture
        },
        coupon: String,
        transactionId: String,
        status:{
            type: String,
            enum:["ORDERED", "SHIPPED" , "DELIVERED" , "CANCELLED"],
            default:"ORDERED"
        }
    },

    {
        timestamps: true
    }
)


export default mongoose.model("Order", orderShema)