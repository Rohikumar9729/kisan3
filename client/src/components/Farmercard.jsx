import { StarIcon } from 'lucide-react'
import React from 'react'
import { useNavigate } from 'react-router-dom'
import toast from 'react-hot-toast'

const FarmerCard = ({ product }) => {
  const navigate = useNavigate()

  if (!product) return null

  const handleAddToCart = (e) => {
    e.stopPropagation()
    try {
      const savedCart = JSON.parse(localStorage.getItem('kisan_cart') || '[]')
      const existingIdx = savedCart.findIndex((item) => item._id === product._id)
      if (existingIdx > -1) {
        savedCart[existingIdx].qty = (savedCart[existingIdx].qty || 1) + 1
      } else {
        savedCart.push({
          ...product,
          qty: 1,
          price: product.price || '450',
          dummyprice: product.dummyprice || '600',
        })
      }
      localStorage.setItem('kisan_cart', JSON.stringify(savedCart))
      toast.success(`${product.title} added to My Cart! 🛒`)
      navigate('/Cart')
    } catch (err) {
      console.error(err)
      navigate('/Cart')
    }
  }

  return (
    <div className='flex flex-col justify-between p-3 bg-black/20 rounded-2xl 
      hover:-translate-y-1 transition duration-300 w-66 border border-white/5 hover:border-white/15'>
      
      <img
        onClick={() => {
          navigate(`/product/${product._id}`);
          window.scrollTo(0, 0)
        }}
        src={product.backdrop_path || product.poster_path}
        alt={product.title}
        className="rounded-lg h-52 w-full object-cover object-right-bottom cursor-pointer"
      />

      <p className="font-semibold mt-2 truncate text-white">{product.title}</p>

      <div className="text-sm text-gray-400 mt-1">
        {product.seed && Array.isArray(product.seed) && product.seed.length > 0 && (
          <p className="truncate text-xs text-gray-400">
            {product.seed.slice(0, 2).map((s) => s.name || s).join(' · ')}
          </p>
        )}
        {product.dummyprice && (
          <span className="text-gray-500/70 line-through text-xs block">MRP: ₹{product.dummyprice}</span>
        )}
        <span className="text-sm font-bold text-white block">
          MRP: {typeof product.price === 'string' && product.price.startsWith('₹') ? product.price : `₹${product.price}`}
        </span>
      </div>

      <div className="flex items-center justify-between mt-4 pb-2">
        <button
          onClick={handleAddToCart}
          className="px-4 py-2 text-xs bg-[#CEC382] hover:bg-[#b8a56e] text-black
            transition rounded-full font-semibold cursor-pointer shadow-sm shadow-[#CEC382]/20"
        >
          Add to cart
        </button>

        <button
          onClick={() => {
            handleAddToCart({ stopPropagation: () => {} });
          }}
          className="px-3.5 py-2 text-xs bg-white/10 hover:bg-white/20 text-white
            transition rounded-full font-medium cursor-pointer border border-white/10"
        >
          Buy Now
        </button>

        <p className="flex items-center gap-1 text-xs text-gray-300 pr-1">
          <StarIcon className="w-3.5 h-3.5 text-[#CEC382] fill-[#CEC382]" />
          {product.vote_average ? Number(product.vote_average).toFixed(1) : '4.8'}
        </p>
      </div>
    </div>
  )
}

export default FarmerCard