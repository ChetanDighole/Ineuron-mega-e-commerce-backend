import  mongoose  from "mongoose";

const couponSchema = new mongoose.Schema(
    {
        code: {
            type: String,
            required: [true , 'Please provide a coupon name']
        },
        discout: {
            type: Number,
            default: 0
        },
        active: {
            type: Boolean,
            default: true
        },
    },
    {
        timestamps: true
    }
)

export default mongoose.model("Coupon", couponSchema)