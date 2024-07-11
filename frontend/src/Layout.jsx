import React from 'react'
import Header from '@/components/ui/Header.jsx'
// import Footer from '@/components/ui/Header'
import { Outlet } from 'react-router-dom'

function Layout() {
  return (
    <>
    <Header/>
    <Outlet/>
    {/* <Footer/> */}
    </>
  )
}

export default Layout
