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
import Aboutus from './pages/Aboutus'
import Contactus from './pages/Contactus'
import Privacy from './pages/Privacy'
import Login from './pages/Login'
import Signup from './pages/Signup'
import { Toaster } from 'react-hot-toast'
import Footer from './components/Footer'
import Layout from './pages/admin/Layout'
import Mycart from './pages/admin/Mycart'
import Addproduct from './pages/admin/Addproduct'
import Orders from './pages/admin/Orders'
import SellRequests from './pages/admin/SellRequests'

const App = () => {
  const location = useLocation()
  const isAdminRoute = location.pathname.startsWith('/admin')

  return (
    <>
      <Toaster
        position="top-right"
        toastOptions={{
          style: {
            background: '#1a1a1a',
            color: '#ffffff',
            border: '1px solid rgba(206, 195, 130, 0.2)',
            borderRadius: '16px',
            fontSize: '14px',
          },
        }}
      />
      {!isAdminRoute && <Navbar />}
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/Product" element={<Product />} />
        <Route path="/Product/:id" element={<Productdetails />} />
        <Route path="/Buy" element={<Buy />} />
        <Route path="/Cart" element={<Cart />} />
        <Route path="/Sell" element={<Sell />} />
        <Route path="/Myorder" element={<Myorder />} />
        <Route path="/Aboutus" element={<Aboutus />} />
        <Route path="/Contactus" element={<Contactus />} />
        <Route path="/Privacy" element={<Privacy />} />
        <Route path="/login" element={<Login />} />
        <Route path="/signup" element={<Signup />} />
        <Route path="/register" element={<Signup />} />
        <Route path="/admin/*" element={<Layout />}>
          <Route index element={<Mycart />} />
          <Route path="add-product" element={<Addproduct />} />
          <Route path="orders" element={<Orders />} />
          <Route path="sell-requests" element={<SellRequests />} />
        </Route>
      </Routes>
      {!isAdminRoute && <Footer />}
    </>
  )
}

export default App