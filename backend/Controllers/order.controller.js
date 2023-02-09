import Product from '../models/product.schema.js'
import asyncHandler from "../services/asyncHandler"
import CustomError from "../utils/customError"
import Coupon from '../models/coupon.schema'
import Order from '../models/order.schema'
import razorpay from '../config/razorpay.config'

/**
 * @GENERATE_RAZORPAY_ID
 * @route https://localhost:5000/api/order/razorpay
 * @description Controller used for generating razorpay Id
 * @description Create a razorpay Id which is used for placing order
 * @returns Order object with "Razorpay order id generated successful"
**/

export const generateRazorpayOrderId = asyncHandler( async (req , res) => {

    //getting product and coupon from frontend

    //verify the product price from backend
    // make DB query to get all products and info

    let totalAmount
    //total amount and final amount
    //coupon check - DB
    //disount = 
    //final amount = total amt - discount

    const options = {
        amount: Math.round(totalAmount * 100),
        currency: "INR",
        receipt: `receipt_${new Date().getTime()}`
    }

    const order = await razorpay.orders.create(options)

    //if order does not exist
    //success then , send it to frontend

})

