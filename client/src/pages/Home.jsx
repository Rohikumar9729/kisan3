import React from 'react';
import FarmerSection from '../components/Farmersection';
import WhyKisan from '../components/WhyKisan';
import HowItWorks from '../components/HowItWorks';
import Recommended from '../components/Recommended';

const Home = () => {
  return (
    <div className="flex flex-col gap-0 overflow-hidden">
      <FarmerSection />
      <WhyKisan />
      <HowItWorks />
      <Recommended />
    </div>
  );
};

export default Home;


