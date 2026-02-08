import { StarIcon } from 'lucide-react'
import React from 'react'
import { useNavigate } from 'react-router-dom'


const FarmerCard = ({ product }) => {     
  const navigate = useNavigate()

  if (!product) return null

  return (
    <div className='flex flex-col justify-between p-3 bg-black/20 rounded-2xl 
      hover:-translate-y-1 transition duration-300 w-66'>
      
      <img
        onClick={() => {
          navigate(`/product/${product._id}`);scrollTo(0, 0)
        }}
        src={product.backdrop_path} alt=""className="rounded-lg h-52 w-full object-cover 
        object-right-bottom cursor-pointer"/>

      <p className="font-semibold mt-2 truncate">{product.title } </p>

      <p className="text-sm text-gray-400 mt-1">
        {product.seed.slice(0,2).map(seed=>seed.name).join("||") }
        <span className="text-gray-500/70 line-through block">MRP:{product.dummyprice}</span>
        <span className="text-1xl font-medium block">MRP:{product.price}</span>
      </p>

      <div className="flex items-center justify-between mt-4 pb-3">
        <a href="/admin" className="px-4 py-2 text-xs bg-[#CEC382] hover:bg-[#b8a56e] 
            transition rounded-full font-medium cursor-pointer"  
        >Add to cart</a>
        <button
          onClick={() => {
            navigate(`/product/${product._id}`);scrollTo(0, 0)
          }}
          className="px-4 py-2 text-xs bg-[#CEC382] hover:bg-[#b8a56e] 
            transition rounded-full font-medium cursor-pointer">
          Buy Now
        </button>

        <p className="flex items-center gap-1 text-sm text-gray-400 mt-1 pr-1">
          <StarIcon className="w-4 h-4 text-primary fill-primary" />
          
            {product.vote_average.toFixed(1) }
         
        </p>
        
      </div>
      
    </div>
  )
}

export default FarmerCard