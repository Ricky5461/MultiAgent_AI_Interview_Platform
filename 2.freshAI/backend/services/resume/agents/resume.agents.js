import { SystemMessage,HumanMessage } from "@langchain/core/messages";

import llm from "../config/llm.js"

export const resumeAgent = async (resumeText) => {
    const response = await llm.invoke([
        new SystemMessage(`
You are an Expert ATS Resume Analyzer.

Analyze the given resume

Extract the following information:

- Full Name
- Email
- Phone Number
- Professional Summary
- Technical Skills
- Projects
- Education
- Experience
- Strengths
- Weaknesses
- Missing Skilss
- Suggested Job Role
- ATS Score (0-100)
- Recommendation

IMPRTANT RULES:

1. Return ONLY valid JSON.
2. Do not use markdown.
3. Do not explain anything.
4. Do not add extra text.
5. Every Field must exist.

Response Format:

{
  "name":"",
  "email":"",
  "phone":"",
  "summary":"",
  "skills":[],
  "projects":[],
  "education":[],
  "experience":[],
  "strengths":[],
  "weaknesses":[],
  "missingSkills":[],
  "suggestedRole":"",
  "score":0,
  "recommendations":[],

}
`),
   new HumanMessage(resumeText), 
    ])
    return response.content
}