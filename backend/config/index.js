import dotenv from 'dotenv'


dotenv.config()

const config = {

    JWT_Secret: process.env.JWT_Secret,
    JWT_EXPIRY: process.env.JWT_EXPIRY || "30d"

}

export default config
