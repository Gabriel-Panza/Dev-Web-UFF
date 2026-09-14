import { Outlet } from 'react-router-dom'
import NavBar from '../components/NavBar'

const Layout = () => {
  return (
    <>
      <NavBar />
      <div className="">
        <Outlet />
      </div>
    </>
  )
}

export default Layout
