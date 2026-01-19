// Product.jsx or wherever you're showing products
import React from 'react';
import { dummyShowsData } from '../assets/assets';
import FarmerCard from '../components/Farmercard';
import BlurCircle from '../components/Blurcircle';


const Buy = () => {
  return (
    <div className="relative min-h-screen overflow-visible">   

      
      <BlurCircle top="-10%" left="-10%" />
      <BlurCircle bottom="-15%" right="-15%" />
      <BlurCircle top="40%" left="60%" />  

      <div className="relative z-10 px-6 py-12 max-w-7xl mx-auto">
        <h1 className=" pt-18 text-4xl font-bold mb-10 ">Buy now</h1>

        {dummyShowsData?.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
            {dummyShowsData.map((product) => (
              <FarmerCard key={product._id || product.id} product={product} />
            ))}
          </div>
        ) : (
          <p className="text-center text-xl text-gray-500">No products available right now.</p>
        )}
      </div>
    </div>
  );
};

export default Buy;