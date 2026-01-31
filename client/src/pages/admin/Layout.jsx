import React from 'react'
import Adminnavbar from '../../components/admin/Adminnavbar'
import Adminsidebar from '../../components/admin/Adminsidebar'
import { Outlet } from 'react-router-dom'

const Layout = () => {
  return (
    <>
      <Adminnavbar />
      <div className='flex'>
        <Adminsidebar />
        <div className='flex-1 px-4 py-10 md:px-10 h-[calc(100vh-64px)] overflow-y-auto'>
          <Outlet/>
        </div>
      </div>
    </>
  )
}

export default Layout
