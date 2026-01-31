import React from 'react'
import { assets } from '../../assets/assets'
import { Link } from 'react-router-dom'

const Adminnavbar = () => {
  return (
    <div className='flex items-center justify-between px-6
    md:px-10 h-16 border-b border-gray-300/30'>
      <Link to="/">
      <img src={assets.logokisan5} alt="logo" className="w-15 h-15 "
      style={{ borderRadius: '50%' }} />
      </Link>
    </div>
  )
}

export default Adminnavbar
