import React, { useEffect, useState } from 'react'
import { useNavigate, useParams } from 'react-router-dom'

function InterviewPage() {
  
const { id } = useParams()
const [ loading , setLoading ] = useState(true);
const [interview, setInterview] = useState(null)
const navigate = useNavigate()

useEffect(()=>{
  const fetchInterview = async ()=> {
     
  }
},[id,navigate])

return (
    <div className='text-black'>
      Hello from Interview page
    </div>
  )
}

export default InterviewPage
