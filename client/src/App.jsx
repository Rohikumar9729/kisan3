
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

const App = () => {

  const IsAdminRoute=useLocation().pathname.startsWith('/admin')

  return (
    <>
    <Toaster/>
      {!IsAdminRoute &&<Navbar />}
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/product" element={<Product />} />
        <Route path="/product/:id" element={<Productdetails />} />
        <Route path="/buy" element={<Buy />} />
        <Route path="/cart" element={<Cart />} />
        <Route path="/sell" element={<Sell />} />
        <Route path="/myorder" element={<Myorder />} />

      </Routes>
      {!IsAdminRoute &&<Footer />}
    </>
  )
}

export default App