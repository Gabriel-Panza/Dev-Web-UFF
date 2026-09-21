import { Outlet } from "react-router-dom"
import NavBar from "../components/NavBar"

const Layout = () => {
  return (
    <>
      <NavBar />
      <div className="mx-20">
        <Outlet />
      </div>
    </>
  )
}
export default Layout