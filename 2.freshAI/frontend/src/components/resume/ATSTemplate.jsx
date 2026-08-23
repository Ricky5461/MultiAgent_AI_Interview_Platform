import React from 'react'

function ATSTemplate({data}) {
    const {
        name,email,phone,location,linkedin,github,summary,skills,experience,
        projects,education,
    } = data;
  return (
    <div className='box-border 
    w-[210mm]
    min-h-[297mm]
    bg-white
    px-[18mm]
    py-[15mm]
    text-black'
    style={{
        fontFamily:"Times New Roman, Times, serif",
    }}>
        {/* Header */}
        <div>{name}</div>
      
    </div>
  )
}

export default ATSTemplate
