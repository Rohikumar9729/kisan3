import React from 'react'

const Blurcircle = ({ top ="auto", left="auto" ,right="auto",bottom="auto"}) => {
  return (
    <div className="absolute -z-10 h-96 w-96 aspect-square rounded-full bg-primary/
    30 blur-3xl" 
    style={{top:top,left:left,right:right,bottom:bottom}}>
      
    </div>
  )
}

export default Blurcircle
