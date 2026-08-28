import express from "express"
import dotenv from "dotenv"
import { connectDB } from "./config/db.js"

const app = express()

app.use(express.json())
dotenv.config()

const PORT = process.env.PORT ||6003

app.get("/",(req,res)=>{
    res.send("Hello from Interview service")
})

app.listen(PORT,()=>{
    console.log(`Interview service is running on port ${PORT}`)
    connectDB()
})