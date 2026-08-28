import { Annotaion } from "@langchain/langgraph"
const InterviewState = Annotaion.Root({
  action: Annotaion(),

  type: Annotaion(),

  role: Annotaion(),

  useResume: Annotaion(),

  resume: Annotaion(),

  questions: Annotaion(),

  question: Annotaion(),

  answer: Annotaion(),

  difficulty: Annotaion(),

  feedback: Annotaion(),

  report: Annotaion(),

  completed: Annotaion(),
})

export default InterviewState;