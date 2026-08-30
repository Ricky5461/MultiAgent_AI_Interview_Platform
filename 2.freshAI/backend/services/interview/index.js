import express from "express"
import dotenv from "dotenv"
import { connectDB } from "./config/db.js"
import interviewRouter from "./routes/interview.route.js"

const app = express()

app.use(express.json())
dotenv.config()

const PORT = process.env.PORT ||6003

app.get("/",(req,res)=>{
    res.send("Hello from Interview service")
})

app.use("/",interviewRouter)

app.listen(PORT,()=>{
    console.log(`Interview service is running on port ${PORT}`)
    connectDB()
})