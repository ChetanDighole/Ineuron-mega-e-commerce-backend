import express from 'express'
import cookieParser from 'cookie-parser'
import cors from 'cors'
import morgan from 'morgan'

const app = express()

//middlewares
app.use(express.json())
app.use(express.urlencoded({extended: true}))
app.use(cors())
app.use(cookieParser())

//morgan loger
app.use(morgan('tiny'))  //it prints information of how our API req and resp in console


export default app