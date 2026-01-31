import React, { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import BlurCircle from '../components/Blurcircle';
import {  Heart, PlayCircleIcon, StarIcon } from 'lucide-react';
import { dummyShowsData } from '../assets/assets';
import FarmerCard from '../components/Farmercard';
import Loading from '../components/Loading';

const ProductDetails = () => {
  const { id } = useParams();
  const [product, setProduct] = useState(null);

  const navigate=useNavigate()

  useEffect(() => {
    const found = dummyShowsData.find((item) => item._id === id);
    if (found) {
      setProduct(found);
    }
  }, [id]);

  if (!product) {
    return <Loading />;
  }

  return (
    <div className="px-6 md:px-16 lg:px-40 pt-20 md:pt-32 pb-16">
      <div className="flex flex-col md:flex-row gap-10 max-w-6xl mx-auto">
        
       
        <div className="shrink-0 md:w-1/2 mt-10">
          <img
            src={product.poster_path} 
            alt={product.title }
            className="rounded-xl w-full max-w-[500px] mx-auto md:mx-0 object-cover shadow-2xl"
          />
          <p className='mt-3'>Related image</p>
           <div className="flex flex-row gap-5 mt-5">
                <div className="border max-w-24 border-gray-500/30 rounded overflow-hidden cursor-pointer">
                    <img onClick={() => {navigate(`/product/${product._id}`);scrollTo(0, 0) }}
                    src={product.poster_path} />
                </div>
                <div className="border max-w-24 border-gray-500/30 rounded overflow-hidden cursor-pointer">
                    <img onClick={() => {navigate(`/product/${product._id}`);scrollTo(0, 0) }}
                    src={product.poster_path} />
                </div>
                <div className="border max-w-24 border-gray-500/30 rounded overflow-hidden cursor-pointer">
                    <img onClick={() => {navigate(`/product/${product._id}`);scrollTo(0, 0) }}
                    src={product.poster_path} />
                </div>
                <div className="border max-w-24 border-gray-500/30 rounded overflow-hidden cursor-pointer">
                    <img onClick={() => {navigate(`/product/${product._id}`);scrollTo(0, 0) }}
                    src={product.poster_path} />
                </div>
            </div>
        </div>

        
        <div className="relative flex flex-col gap-4 flex-1">
          <BlurCircle top="-100px" left="-100px" />

          <p className="text-primary font-medium tracking-wide">English</p>

          <h1 className="text-4xl md:text-5xl font-bold text-balance leading-tight">
            {product.title || product.name || 'No title'}
          </h1>

          <div className="flex items-center gap-2 text-gray-300 mt-2">
            <StarIcon className="w-6 h-6 text-primary fill-primary" />
            <span className="text-lg font-medium">
              {product.vote_average?.toFixed(1) || product.rating || '—'} User Rating
            </span>
          </div>

          <p className="text-gray-300 mt-4 leading-relaxed max-w-3xl">
            {product.overview || product.description || 'No description available.'}
          </p>

          <div className="mt-6">
                <p className="text-gray-500/70 line-through">MRP:{product.dummyprice}</p>
                <p className="text-2xl font-medium">MRP:{product.price}</p>
                <span className="text-gray-500/70">(inclusive of all taxes)</span>
            </div>
          <div>
            <button  className='flex items-center cursor-pointer'>
              <PlayCircleIcon className="w-5 h-5"/>
             Watch Product Quality
             </button>
          </div>
          
          <div className='flex items-center flex-wrap gap-4 mt-4'>
            <a href="/admin/Mycart" className="px-4 py-2 text-xs bg-[#CEC382] hover:bg-[#b8a56e] 
            transition rounded-full font-medium cursor-pointer"  
        >Add to cart</a>
             <a href="/Myorder" className="px-4 py-2 text-xs bg-[#CEC382] hover:bg-[#b8a56e] 
            transition rounded-full font-medium cursor-pointer"  
        >Buy Now</a>
             <button className='bg-gray-700 p-2.5 rounded-full transition cursor-pointer
             active:scale-95'>
              <Heart className={`w-5 h-5`}/>
             </button>
          </div>
         
        </div>
      </div>
      <p className='text-lg font-medium mt-20 mb-8' >Related product</p>
     <div className='flex flex-wrap max-sm:justify-center gap-8'>
      {dummyShowsData.slice(0,6).map((product,index)=>(
        <FarmerCard key={index} product={product}/>
      ))}
     </div>
     <div className='flex justify-center mt-20'>
     <button onClick={() => {navigate(`/product`);scrollTo(0, 0) }}
     className='px-10 py-3 text-sm bg-primary hover:bg-primary-dull
     transition rounded-md font-medium cursor-pointer'
     style={{ backgroundColor: '#CEC382' }}
     >Show More</button>
     </div>

    </div>
  );
}

export default ProductDetails;