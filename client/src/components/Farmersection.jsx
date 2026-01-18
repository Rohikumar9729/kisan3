import { ArrowRight } from 'lucide-react';
import React from 'react';
import { useNavigate } from 'react-router-dom';


const FarmerSection = () => {

    const navigate=useNavigate()

  return (
    <div
      style={{
        backgroundImage: "url('/background2.jpg')",
      }}
      className="
        flex flex-col items-start justify-center gap-4
        px-6 md:px-16 lg:px-36
        bg-cover bg-center bg-no-repeat
        h-screen
      "
    >
    

     <h1  className="text-5xl md:text-[70px] md:leading-18 font-semibold
     max-w-110"  >Quality Seeds <br/> Online</h1>

    <div>
  <p >way for farmer to interact and  exchange their<br/> unused seeds/products and buy useful <br/>seeds/product</p>
    <button onClick={() => navigate('/product')} className="flex items-center gap-2 px-6 py-3 text-sm bg-primary hover:bg-primary-dull 
    transition rounded-full font-medium cursor-pointer"
  style={{
    backgroundColor: '#CEC382',
    marginTop: '1.5rem'        
  }}
>
  Explore
  <ArrowRight className="w-5 h-5" />
</button>
    </div>

    </div>



  );
};

export default FarmerSection;