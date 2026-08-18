import React from "react";

import { Routes ,Route, Navigate} from "react-router-dom";
import Home from "./pages/Home";
import Dashboard from "./pages/Dashboard";
import { use } from "react";
import { useState } from "react";
import { useEffect } from "react";
import { getCurrentUser } from "./apis/user.api";
import Scorer from "./pages/Scorer";
import { useDispatch } from "react-redux";
import { getResume } from "./apis/resume.api";
import { setResume } from "./redux/resumeSlice";

function App(){
  const [user,setUser] = useState(null)
  const [loading,setLoading] = useState(true)  // unless not getting user data ,loading
  const dispatch = useDispatch()
  useEffect(()=>{

     const getUser = async ()=>{
       const data = await getCurrentUser()
       setUser(data?.user)
       setLoading(false)  // if getting user or not getting automaticaly false
     }

     getUser()
  },[])

    useEffect(()=>{
     const getResumeData = async()=>{
      const result = await getResume()
      dispatch(setResume(result.data))
     }
     getResumeData()
  },[])

  if(loading){
    return (
      <div className="fixed top-0 left-0 w-full z-9999">
        <div className="h-1 bg-black animate-pulse w-full"/>
      </div>
    )
  }
  return (
    <>
    <Routes>
      <Route path="/" element={
        user ? <Navigate to="/dashboard" replace/>:<Home setUser={setUser}/>
        }/>

      <Route path="/dashboard" element={
        user ? <Dashboard user={user} setUser={setUser}/>:<Navigate to="/" replace/>
      }/>

      <Route path="/scorer" element={
        user ? <Scorer user={user} setUser={setUser}/>:<Navigate to="/" replace/>
      }/>
      
    </Routes>
     </>
    
  )
}

export default App