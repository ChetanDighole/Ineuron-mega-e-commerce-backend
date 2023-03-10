import User from "../models/user.schema";
import asyncHandler from "../services/asyncHandler"
import CustomError from "../utils/customError"
import JWT from 'jsonwebtoken'
import config from '../config/index'

export const isLoggedIn = asyncHandler(async(req, _res , next) => {
    
    let token;

    if(req.cookies.token || (req.headers.authorization && req.headers.authorization.startsWith('Bearer'))){
        token = req.cookies.token || req.headers.authorization.split(" ")[1]
    }

    if(!token){
        throw new CustomError('Not authorized to access this route' , 401)
    }

    try {
        
       const decodedJwtPayload = JWT.verify(token, config.JWT_Secret)

       req.user = await User.findById(decodedJwtPayload._id , "name email role")

       next()

    } catch (error) {
        throw new CustomError('Not authorized to access this route' , 401)
    }

})

