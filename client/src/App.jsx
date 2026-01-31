
import React from 'react'
import { Routes, Route, useLocation } from 'react-router-dom'
import Navbar from './components/Navbar'
import Home from './pages/Home'
import Product from './pages/Product'
import Productdetails from './pages/Productdetails'
import Buy from './pages/Buy'
import Cart from './pages/Cart'
import Sell from './pages/Sell'
import Myorder from './pages/Myorder'
import {Toaster} from 'react-hot-toast'
import Footer from './components/Footer'
import Layout from './pages/admin/Layout'
import Mycart from './pages/admin/Mycart'
import Addproduct from './pages/admin/Addproduct'

const App = () => {

  const IsAdminRoute=useLocation().pathname.startsWith('/admin')

  return (
    <>
    <Toaster/>
      {!IsAdminRoute &&<Navbar />}
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/Product" element={<Product />} />
        <Route path="/Product/:id" element={<Productdetails />} />
        <Route path="/Buy" element={<Buy />} />
        <Route path="/Cart" element={<Cart />} />
        <Route path="/Sell" element={<Sell />} />
        <Route path="/Myorder" element={<Myorder />} />
        <Route path="/admin/*" element={<Layout />} >
          <Route index element={<Mycart />} /> 
          <Route path="add-product" element={<Addproduct/>} />
        </Route>
      </Routes>
      {!IsAdminRoute &&<Footer />}
    </>
  )
}

export default App