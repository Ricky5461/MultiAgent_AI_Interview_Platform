import { ChatGroq } from "@langchain/groq"
import dotenv from "dotenv"
dotenv.config()

// GROQ_API_KEY will be automatically fetch
const llm = new ChatGroq({
    model: "llama-3.3-70b-versatile",
    // model:"openai/gpt-oss-120b",
    temperature: 0.2,
    maxRetries: 2,
    // maxtries=2 if one response fails and error then 2nd time retry
    // other params...
})

export default llm