import React, { useEffect, useState } from 'react'
import { dummyOrderData } from '../assets/assets'
import Loading from '../components/Loading'
import BlurCircle from '../components/Blurcircle'
import { dateformat } from '../lib/dateformat'

const Myorder = () => {

    const[ordering ,setOrdering]=useState([])
    const[isLoading,setIsLoading]=useState(true)

    const getMyordering=async()=>{
      setOrdering(dummyOrderData)
      setIsLoading(false)
    }

    useEffect(()=>{
      getMyordering()
    },[])

  return !isLoading ?(
    <div className='px-6 md:px-16 lg:px-40 pt-20 md:pt-40 min-h-[80vh] pb-16'>
      <BlurCircle top='100px' left='100px' />
      <div>
      <BlurCircle bottom='0px' right='600px' />
      </div>
      <h1 className='text-lg font-semibold mb-4'>My Order</h1>

     {ordering.map((item,index)=>
       <div key={index} className='flex flex-col md:flex-row justify-between 
       bg-primary/8 border border-primary/20 rounded-lg p-4 mt-4 max-w-3xl'>
        <div className='flex flex-col md:flex-row gap-4'>
         <img src={item.show.product?.poster_path} alt="product" className='md:max-w-xs
         aspect-video h-30 w-30 object-cover object-bottom rounded'/>
         <div className='flex flex-col'>
          <p className='text-lg font-semibold'>{item.show.product?.title }</p>
          <p className='text-gray-400 text-sm mt-auto'>Delivery Address:<br/>{item.show.DeliveryAddress}</p>
          <p className='text-gray-400 text-sm mt-auto'>delivered on {dateformat(item.show.showDeliveryTime)}</p>
          
        </div>
        </div>

       <div className='flex flex-col md:items-end md:text-right justify-between
       p-4'>
       <div className='text-sm '>
        <p className='text-2xl font-semibold mb-1'>₹{item.amount}</p>
        {!item.isPaid  && <button   className="bg-primary px-4 py-1.5 mb-3
        text-sm  rounded-full font-medium cursor-pointer"
          style={{ backgroundColor: '#CEC382' }}
        >Pay Now</button>}

        {  item.isPaid && <p className='text-gray-400 text-sm mt-auto'>paid</p>}
       
       </div>
       <div className='text-sm '>
        <p><span className='text-gray-400'> quantity:</span>{item.Quantity}kg</p>
       
       </div>
       </div>

       </div>)}


    </div>
  ):<Loading/>;
}

export default Myorder;
