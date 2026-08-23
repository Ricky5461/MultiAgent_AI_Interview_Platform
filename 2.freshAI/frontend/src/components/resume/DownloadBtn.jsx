import React from 'react'
import { FiDownload } from 'react-icons/fi'
import { useReactToPrint } from 'react-to-print'

function DownloadBtn({docRef,user,setUser}) {
  const handlePDF = useReactToPrint({
    contentRef:docRef,
    documentTitle:'FresherAiPDF'
  })
  const handleDownload = async()=>{
    handlePDF()
  }
    return (
    <button 
    onClick={handleDownload}
    className='flex items-center gap-2 rounded-lg bg-black px-3 py-2
    text-xs text-white'>
       <FiDownload/>
       Download PDF
    </button>
  )
}

export default DownloadBtn
