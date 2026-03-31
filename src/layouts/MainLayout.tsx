import { Outlet, useLocation } from "react-router"
import Navbar from "../components/Navbar"
import Footer from "../components/Footer"

const MainLayout = () => {
  const location = useLocation()
  const isHome = location.pathname === "/"

  return (
    <div className="flex flex-col min-h-screen bg-background">
        <Navbar isHome={isHome} />
        <main className="flex-1 pb-[100px]">
            <Outlet />
        </main>
        <Footer />
    </div>
  )
}

export default MainLayout