import { app } from "../configs/firebase.js";
import { getAuth } from "firebase-admin/auth"
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
            httpOnly: true,
            secure: false,
            sameSite: "strict",
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
            await redis.del(`session: ${sessionId}`)
        }

        res.clearCookie("session", {
            httpOnly:true,
            secure:false,
            sameSite:"strict"
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

export const useCoins = async (req,res)=>{
    try {
        const sessionId = req.cookies?.session;
        if(!sessionId){
            return res.status(401).json({message:"Unauthorized"})
        }  
        const session = await redis.get(`session:${sessionId}`)
        const sessionData = JSON.parse(session)

        const {coins , action} = req.body;
        
        // if (typeof coins !== "number" || !Number.isFinite(coins) || coins <= 0) {
        //     return res.status(400).json({
        //         success: false,
        //         message: "Invalid coin amount",
        //     });
        // }


        if(!coins){
            return res.status(400).json({
                success:false,
                message:"Coins are required",
            });
        }

        const user = await User.findById(sessionData.userId)
        if(!user){
            return res.status(404).json({
                success:false,
                message:"User Not Found",
            });
        }
        if(user.interviewCoins < coins){
             return res.status(403).json({
                success:false,
                message:"Not Enough interview Coins",
                interviewCoins:user.interviewCoins,
             });           
        }
        user.interviewCoins -= coins
        await user.save();

        await redis.set(`session:${sessionId}`,JSON.stringify({
            userId:user._id,
            name:user.name,
            email:user.email,
            interviewCoins:user.interviewCoins
        }),"EX",7 * 24 * 60 * 60)

        return res.status(200).json({
            success:true,
            message:"Interview coins updated Successfully",
            action,
            interviewCoins:user.interviewCoins
        })
    } catch (error) {
        return res.status(500).json({
            success:false,
            message:error.message
        });
    }
}