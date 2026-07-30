import express from "express"
const app = express()
import dotenv from "dotenv"
dotenv.config()

import proxy  from "express-http-proxy"
const PORT = process.env.PORT ||6000

app.get("/",(req,res)=>{
    res.send("Hello from gateway")
})

app.use("/api/auth",proxy(process.env.AUTH_SERVICE_URL))

app.listen(PORT,()=>{
    console.log(`Gateway server is running on port ${PORT}`)
})