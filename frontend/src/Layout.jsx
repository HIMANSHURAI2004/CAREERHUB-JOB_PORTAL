// import Footer from '@/components/ui/Header'
import { Outlet } from 'react-router-dom'
import Navbar from './components/Navbar'

function Layout() {
  return (
    <>
    {/* <Header/> */}
    <Navbar/>
    <Outlet/>
    {/* <Footer/> */}
    </>
  )
}

export default Layout
