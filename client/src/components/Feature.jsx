import { ArrowRight } from 'lucide-react'
import React from 'react'
import { useNavigate } from 'react-router-dom'
import Blurcircle from './Blurcircle'
import { dummyShowsData } from '../assets/assets' 
import FarmerCard from './Farmercard'              
const Feature = () => {
  const navigate = useNavigate()

  return (
    <div className="px-6 md:px-16 lg:px-24 xl:px-44 overflow-hidden">
      <div className="relative flex items-center justify-between pt-20 pb-10">
        <Blurcircle top="-20%" right="-15%" />
        <p className="text-gray-300 font-medium text-lg">Products</p>
        <button onClick={() => {navigate(`/product`);scrollTo(0, 0) }} 
          className="group flex items-center gap-2 text-sm text-gray-300 cursor-pointer"
        >
          View All
          <ArrowRight className="group-hover:translate-x-1 transition w-5 h-5" />
        </button>
      </div>

      <div className="flex flex-wrap max-sm:justify-center gap-8 mt-8 pl-9">
        {dummyShowsData.slice(0, 8).map((product) => (
          <FarmerCard key={product._id } product={product} />
        ))}
      </div>

      <div className="flex justify-center mt-16">
        <button onClick={() => {navigate(`/product`);scrollTo(0, 0) }}
          className="px-10 py-3 text-sm bg-[#CEC382] hover:bg-[#b8a56e] 
            transition rounded-md font-medium cursor-pointer"
        >
          Show More
        </button>
      </div>
    </div>
  )
}

export default Feature