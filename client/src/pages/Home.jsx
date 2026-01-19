import React from 'react';
import FarmerSection from '../components/Farmersection';   
import Feature from '../components/Feature';
import Recommended from '../components/Recommended';
const Home = () => {                
  return (
    <>
      <FarmerSection />  
    <Feature/> 
    <Recommended/>    
    </>
  );
};

export default Home;

