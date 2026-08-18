import { configureStore } from '@reduxjs/toolkit'
import resumeSlice from "./resumeSlice"
import Resume from '../../../backend/services/resume/models/resume.model'
export const store = configureStore({
  reducer: {
        resume:resumeSlice,
  },
})