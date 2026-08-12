import { app } from "../configs/firebase.js";
import {getAuth} from "firebase-admin/auth"
import User from "../models/user.model.js"
import crypto from "crypto"
import redis from "../../../shared/redis/redis.js"

export const GoogleAuth = async (req, res) => {
    try{
         const {token} = req.body;

         const decoded = await getAuth(app).verifyIdToken(token)

         let user =  await User.findOne({
            firebaseUid:decoded.uid
         })
         if(!user){
            user  = await User.create({
                firebaseUid:decoded.uid,
                name:decoded.name,
                email:decoded.email
            })
         }
         const sessionId = crypto.randomUUID()
         await redis.set(`session:${sessionId}`,JSON.stringify({
            userId:user._id,
            name: user.name,
            email:user.email,
            interviewCoins:user.interviewCoins
         }),"EX",7*24*60*60)

         res.cookie("session",sessionId, {
            httponly: true,
            secure: false,
            samesite: "strict",
            maxAge: 7 * 24 * 60 * 60 * 1000
         })

         res.status(200).json({ success: true, user });
    } catch(error){
        return res.status(500).json("Google Auth Error:" + error.message)
    }
}

export const logout = async (req, res) => {
    try{
        const sessionId = req.cookies?.session
        if(sessionId){
            await redis.del(`session:${sessionId}`)
        }

        res.clearCookie("session", {
            httponly:true,
            secure:false,
            samesite:"strict"
        })

        return res.status(200).json({
            success:true,
            message:"Logout Successful"
        })
    } catch(error){
         return res.status(500).json({
            success:false,
            message: error.message
         });
    }
}