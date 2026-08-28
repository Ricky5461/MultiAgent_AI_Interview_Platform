import { StateGraph } from "@langchain/langgraph";
import InterviewState from "./state.js"
import { interviewNode,summaryNode, feedbackNode} from "./nodes.js"

function router(state){
    switch (state.action) {
        case "start":
            return "interviewAgent";
        case "feedback":
            return "feedbackAgent";
        default:
            return END;
    }
}

function feedbackRouter(start){
    if(state.completed){
        return "summaryAgent";
    }

    return END;
}

const graph = new StateGraph(InterviewState)
    .addNode("interviewAgent",interviewNode)
    .addNode("feedbackAgent",feedbackNode)
    .addNode("summaryNode",summaryNode)
    //Conditional agent
    .addConditional()
    