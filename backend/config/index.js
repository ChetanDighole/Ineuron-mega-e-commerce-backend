import dotenv from 'dotenv'


dotenv.config()

const config = {

    JWT_Secret: process.env.JWT_Secret,
    JWT_EXPIRY: process.env.JWT_EXPIRY || "30d",
    MONGODB_URL: process.env.MONGODB_URL,
    PORT: process.env.PORT,
    SMTP_MAIL_HOST: process.env.SMTP_MAIL_HOST,
    SMTP_MAIL_PORT: process.env.SMTP_MAIL_PORT,
    SMTP_MAIL_USERNAME: process.env.SMTP_MAIL_USERNAME,
    SMTP_MAIL_PASSWORD: process.env.SMTP_MAIL_PASSWORD,
    SMTP_MAIL_EMAIL: process.env.SMTP_MAIL_EMAIL,

    S3_ACCESS_KEY: process.env.S3_ACCESS_KEY,
    S3_SECRETE_ACCESS_KEY: process.env.S3_SECRETE_ACCESS_KEY,
    S3_BUCKET_NAME: process.env.S3_BUCKET_NAME,
    S3_REGION: process.env.S3_REGION,

    Razorpay_Key_ID: process.env.Razorpay_Key_ID,
    Razorpay_SECRET: process.env.Razorpay_SECRET,

}

export default config
