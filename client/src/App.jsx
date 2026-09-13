import React from 'react'
import { Routes, Route } from 'react-router-dom'
import Navbar from './components/Navbar'
import Home from './pages/Home'
import Product from './pages/Product'
import Productdetails from './pages/Productdetails'
import Buy from './pages/Buy'
import Cart from './pages/Cart'
import Sell from './pages/Sell'
import Myorder from './pages/Myorder'
import ReceivedRequests from './pages/ReceivedRequests'
import Aboutus from './pages/Aboutus'
import Contactus from './pages/Contactus'
import Privacy from './pages/Privacy'
import Login from './pages/Login'
import Signup from './pages/Signup'
import { Toaster } from 'react-hot-toast'
import Footer from './components/Footer'

const App = () => {
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
      <Navbar />
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/Product" element={<Product />} />
        <Route path="/Product/:id" element={<Productdetails />} />
        <Route path="/Buy" element={<Buy />} />
        <Route path="/Cart" element={<Cart />} />
        <Route path="/Sell" element={<Sell />} />
        <Route path="/Myorder" element={<Myorder />} />
        <Route path="/ReceivedRequests" element={<ReceivedRequests />} />
        <Route path="/received-requests" element={<ReceivedRequests />} />
        <Route path="/Aboutus" element={<Aboutus />} />
        <Route path="/Contactus" element={<Contactus />} />
        <Route path="/Privacy" element={<Privacy />} />
        <Route path="/login" element={<Login />} />
        <Route path="/signup" element={<Signup />} />
        <Route path="/register" element={<Signup />} />
      </Routes>
      <Footer />
    </>
  )
}

export default App