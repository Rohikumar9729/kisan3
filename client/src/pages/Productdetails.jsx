import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { assets, dummyShowsData } from '../assets/assets';
import BlurCircle from '../components/Blurcircle';
import { StarIcon } from 'lucide-react';

const ProductDetails = () => {
  const { id } = useParams();
  const [product, setProduct] = useState(null);

  useEffect(() => {
    
    const found = dummyShowsData.find((item) => item._id === id);
    setProduct(found); 
  }, [id]);

  if (!product) {
    return <div className="text-center py-20 text-xl">Loading...</div>;
  }

  return (
    <div className="px-6 md:px-16 lg:px-40 pt-20 md:pt-32 pb-16">
      <div className="flex flex-col md:flex-row gap-10 max-w-6xl mx-auto">
        
        <div className="shrink-0 md:w-1/3">
          <img
            src={product.poster_path} 
            alt={product.title }
            className="rounded-xl w-full max-w-[500px] mx-auto md:mx-0 object-cover shadow-2xl"
          />
        </div>

        
        <div className="relative flex flex-col gap-4 flex-1">
          <BlurCircle top="-100px" left="-100px" />

          <p className="text-primary font-medium tracking-wide">ENGLISH</p>

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

          <p className="text-gray-300 mt-4 leading-relaxed max-w-3xl">
            {product.price }
          </p>

         
        </div>
      </div>
    </div>
  );
};

export default ProductDetails;