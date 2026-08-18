// pdf--> pdf Storage---> text ---> llm--> agent--->prompt--->
//data---->save Mongodb--->redis-->pdf delete--> resume data (score, missing,
//  skilss, recommendation)
import { json } from "express";
import redis from "../../../shared/redis/redis.js";
import { resumeAgent } from "../agents/resume.agents.js";
import extractedText from "../config/pdf.js";
import Resume from "../models/resume.model.js"
import fs from "fs"

export const uploadResume = async (req, res) => {
    let file
    try {
        const file = req.file;
        if(!file){
            return res.status(400).json({
                success:false,
                message:"Resume PDf is required"
            })
        }
        const userId = req.headers["x-user-id"] // x-user-id this will be in gateway->utils proxy
        if(!userId){
            return res.status(400).json({
                success:false,
                message:"User ID is required"
            })
        }

        const resumeText = await extractedText(file.path)

        const aiResponse = await resumeAgent(resumeText)

        const resumeData = JSON.parse(aiResponse)

        let resume = await Resume.findOne({userId})

        //update the resume
        if(resume){
            Object.assign(resume,{
                ...resumeData,
                extractedText:resumeText
                //here updating 2 thing, resume from resumeData 
                // and extractedText from current resumeText 
                // ...resumeData mean all name email pohne etc
            })
            await resume.save()
        }else{
            resume = await Resume.create({
                userId,
                extractedText:resumeText,
                ...resumeData
            })
        }
        await redis.set(`resume:${userId}`,JSON.stringify(resume))
        await fs.unlinkSync(file.path)   // after successfully save in redis, delete pdf

        return res.status(200).json({
            success:true,
            message:"Resume Analyzed successfully",
            data:resume
        })
    } catch (error) {
        console.log(error)
        if(file){
            await fs.unlinkSync(file.path);
        }
        return res.status(500).json({
            success:false,
            message:error.message,
        })
    }
}

export const getResume = async (req,res)=> {
    try {
        const userId = req.headers["x-user-id"];
        const cache = await redis.get(`resume:${userId}`)
        if(cache){
            return res.status(200).json({
                success:true,
                source:"redis",
                data:JSON.parse(cache)
            })
        }
        const resume = await Resume.findOne({userId})
        if(!resume){
            return res.status(404).JSON({
                success:false,
                message:"resume not found"
            })
        }
        await redis.set(`resume:${userId}`,JSON.stringify(resume))
        
        return res.status(200).json({
            success:true,
            source:"mongoDB",
            data:resume
        })
    } catch (error) {
        console.log(error)
        return res.status(500).json({
            success:false,
            message:error.message,
        })
    }
}
