import User from "../models/user.schema";
import asyncHandler from "../services/asyncHandler"
import CustomError from "../utils/customError"
import mailHelper from "../utils/mailHelper";
import crypto from 'crypto'


export const cookieOptions = {
    expires: new Date(Date.now() + 3 * 24 * 60 * 60 * 1000),
    httpOnly: true
}


/*******************************************************

@SIGNUP
@route http://localhost:4000/api/auth/singup
@description User signup controller for creating a new user
@parameter name, email, password
@return User Object

********************************************************/

export const signUp = asyncHandler(async (req, res) => {

    const { name, email, password } = req.body

    if (!(name || email || password)) {
        throw new CustomError('Please fill all fields', 400)
    }

    //check if user exists
    const existingUser = await User.findOne({ email })

    if (existingUser) {
        throw new CustomError('User already exist', 400)
    }

    const user = await User.create({
        name,
        email,
        password
    })

    const token = user.getJWTToken()
    console.log(user);

    user.password = undefined //we don't need it though

    res.cookie('token', token, cookieOptions)

    res.status(200).json({
        success: true,
        token,
        user
    })

})

/*

@LOGIN
@route http://localhost:4000/api/auth/login
@description User signup controller for loging a user
@parameter email, password
@return User Object

*/

export const login = asyncHandler(async (req, res) => {
    const { email, password } = req.body

    if (!(email || password)) {
        throw new CustomError('Please fill all fields', 400)
    }

    const user = await User.findOne({ email }).select('+password')

    if (!user) {
        throw new CustomError('Invalid credentials', 400)
    }

    const isPasswordMatched = await user.comparePassword(password)

    if (isPasswordMatched) {
        const token = user.getJWTToken()

        user.password = undefined

        res.cookie('token', token, cookieOptions)

        return res.status(200).json({
            success: true,
            token,
            user
        })
    }

    throw new CustomError('Invalid credential', 400)

})

/*

@LOGOUT
@route http://localhost:4000/api/auth/logout
@description User logout by clearing user cookie
@parameter
@return success message

*/

export const logout = asyncHandler(async (_req, res) => {
    // res.clearCookie()
    //_req becoz it is not used (a practice)
    res.cookie('token', null, {
        expires: new Date(Date.now()),
        httpOnly: true
    })

    res.status(200).json({
        success: true,
        message: "logged out"
    })

})

/*

@FORGOT_PASSWORD
@route http://localhost:4000/api/auth/password/forgot
@description User will submit email and we will generate a token
@parameter email
@return success message - email send

*/

export const forgotPassword = asyncHandler(async (req, res) => {
    const { email } = req.body

    if (!email) {
        throw new CustomError('Fill all details', 404)
    }

    const user = await User.findOne({ email })

    if (!user) {
        throw new CustomError('user not found', 404)
    }

    const resetToken = user.generateForgotPasswordToken()

    await user.save({ validateBeforeSave: false })

    const resetUrl =
        `${req.protocol}://${req.get('host')}/api/auth/password/reset/${resetToken}`

    const text = `your password reset url is
    \n\n ${resetUrl}\n\n`

    try {
        await mailHelper({
            email: user.email,
            subject: 'Password reset email for website',
            text: text
        })

        res.status(200).json({
            success: true,
            message: `Email send to ${user.email}`
        })

    } catch (error) {
        //roll back - clear field

        user.forgotPasswordToken = undefined
        user.forgotPasswordExpiry = undefined

        await user.save({ validateBeforeSave: false })

        throw new CustomError(err.message || 'Email sent failure', 500)
    }

})

/*

@RESET_PASSWORD
@route http://localhost:4000/api/auth/password/reset/:resetPasswordToken
@description User will be able to reset password on url token
@parameter token from url, password and confirmpass
@return user object

*/

export const resetPassword = asyncHandler(async (req, res) => {
    const { token: resetToken } = req.params //token from forgotPassword route (above)
    const { password, confirmPassword } = req.body

    const resetPasswordToken = crypto
        .createHash('sha256')
        .update(resetToken)
        .digest('hex')

    const user = await User.findOne({
        forgotPasswordToken: resetPasswordToken,
        forgotPasswordExpiry: { $gt: Date.now() }
    })

    if (!user) {
        throw new CustomError('password token is invalid or expired', 400)
    }

    if (password !== confirmPassword) {
        throw new CustomError('password and confirm password does not match', 400)
    }

    user.password = password
    user.forgotPasswordToken = undefined
    user.forgotPasswordExpiry = undefined

    await user.save()

    //create token and send to user

    const token = user.getJWTToken()
    user.pasword = undefined

    //helper method for cookie can be added
    res.cookie('token', token, cookieOptions)
    res.status(200).json({
        success: true,
        user
    })

})

//change password  ----home-work
/*

@GET_PROFILE
@REQUEST_TYPE GET
@route http://localhost:4000/api/auth/profile
@description check for token and populate req.user
@parameter 
@return user object

*/

export const getProfile = asyncHandler(async(req,res) => {
    const {user} = req  //middleware isloggedIn

    if(!user){
        throw new CustomError('user not found' , 404)
    }

    res.status(200).json({
        success: true,
        user
    })

})
