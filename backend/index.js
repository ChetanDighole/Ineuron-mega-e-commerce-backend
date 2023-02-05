import mongoose from 'mongoose'
import app from './app.js'
import config from './config/index'



//self invoke function ()() to connect db immigiately
(async () => {
    try {
        
        await mongoose.connect(config.MONGODB_URL)
        console.log("DB CONNECTED");

        app.on('err' , (err) => {
            console.log("ERROR: " , err);
            throw err;
        })

        const onListening =  () => {
            console.log(`Listening on ${config.PORT}`);
        }

        app.listen(config.PORT , onListening)

    } catch (error) {
        console.log("ERROR",error);
        throw err
    }
})()
