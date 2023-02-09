import Razorpay from 'razorpay'
import config from './index'

const razorpay = new Razorpay({
    Key_id: config.Razorpay_Key_ID,
    Key_secret: config.Razorpay_SECRET,
})

export default razorpay
