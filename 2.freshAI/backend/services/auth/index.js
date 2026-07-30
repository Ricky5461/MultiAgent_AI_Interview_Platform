import express from "express"
import dotenv from "dotenv"
import { connectDB } from "./configs/db.js"
import authRouter from "./routes/auth.route.js"
import cookieParser from "cookie-parser"

const app = express()

app.use(express.json())
app.use(cookieParser())
dotenv.config()

const PORT = process.env.PORT ||6001

app.get("/",(req,res)=>{
    res.send("Hello from auth service")
})

app.use("/",authRouter)

app.listen(PORT,()=>{
    console.log(`Auth service is running on port ${PORT}`)
    connectDB()
})