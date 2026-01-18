import React from 'react';
import FarmerSection from '../components/farmersection';   
import Feature from '../components/Feature';
import Recommended from '../components/recommended';
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

