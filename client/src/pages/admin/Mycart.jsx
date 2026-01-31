import React, { useEffect, useState } from 'react'
import Title from '../../components/admin/Title'
import Loading from '../../components/Loading'
import { ChartLineIcon, PlayCircleIcon, UserIcon } from 'lucide-react';
import { dummyDashboardData } from '../../assets/assets';

const Mycart = () => {

   const [cartItems, setCartItems] = useState({
    totalProduct: 0,
    Activeproduct: [],
    totalUser: 0
   });

   const [loading, setLoading] = useState(true);

   const  MycartCards=[
    {
        title:"Total Products",
        value:cartItems.totalProduct || "0",
        icon:ChartLineIcon
    },
    {
        title:"Active Products",
        value:cartItems.Activeproduct?.length || "0",
        icon:PlayCircleIcon
    },
    {
        title:"Total Users",
        value:cartItems.totalUser || "0",
        icon:UserIcon
    }
   ]


  const fetchMycarts=async()=>{
    setCartItems(dummyDashboardData)
    setLoading(false)
  }

  useEffect(()=>{
    fetchMycarts();
  },[]);

  return loading ? (
    <Loading />
  ) : (
    <div>
      <Title text1="My" text2="Cart"/>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-8">
        {MycartCards.map((card, index) => {
          const IconComponent = card.icon;
          return (
            <div key={index} className="bg-black/30 p-6 rounded-lg shadow-md hover:shadow-lg transition">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-gray-600 text-sm font-medium">{card.title}</p>
                  <p className="text-3xl font-bold mt-2">{card.value}</p>
                </div>
                <IconComponent size={40} className="text-blue-600" />
              </div>
            </div>
          );
        })}
      </div>
    </div>
  )
}

export default Mycart
