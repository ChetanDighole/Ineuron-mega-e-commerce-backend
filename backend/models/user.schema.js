import mongoose from 'mongoose';
import { AuthRoles } from "../utils/authRoles";
import bcrypt from "bcryptjs";
import JWT from "jsonwebtoken";
import crypto from "crypto"
import config from "../config/index"

//information of user
const userScehema = mongoose.Schema(
    {
        name: {
            type: String,
            required: [true, "Name is required"],
            maxLength: [50, "Name must be less than 50"]
        },
        email: {
            type: String,
            required: [true, "Name is required"],
            unique: true,
        },
        password: {
            type: String,
            required: [true, "Password is required"],
            minLength: [8, "Password must be at least 8 characters"],
            select: false  //this will prevent password to come to frontend {user.password:undefined}
        },
        roles: {
            type: String,
            enum: Object.values(AuthRoles),
            default: AuthRoles.USER
        },
        forgotPasswordToken: String,
        forgotPasswordExpiry: Date,
    },
    {
        timestamps: true
    }
);

//challenge 1 - encrypt the password
userScehema.pre("save" , async function(next) {
    if(!this.modified("password")) return next()
    this.password = await bcrypt.hash(this.password, 10)
    next()
})


//add more feature directly to scehma
userScehema.methods = {
    //compare password
    comparePassword: async function(enteredPassword){
        return await bcrypt.compare(enteredPassword , this.password)
    },

    //generate JWT token
    getJWTToken: function(){
        return JWT.sign(
            {
                _id: this._id,
                role: this.role
            },
            config.JWT_Secret,
            {
                expiresIn: config.JWT_EXPIRY
            }
        )
    }

}



export default mongoose.model('User' , userScehema)
