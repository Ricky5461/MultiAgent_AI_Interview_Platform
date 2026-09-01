import express from "express"
import { GoogleAuth,logout, useCoins,resetCoins } from "../controllers/auth.controller.js"
 const authRouter = express.Router()
 
 authRouter.post("/login",GoogleAuth)
 authRouter.get("/logout",logout)
authRouter.post("/use-coins",useCoins)
authRouter.post("/reset-coins", resetCoins)
 export default authRouter