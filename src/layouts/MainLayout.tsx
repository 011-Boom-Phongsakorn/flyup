import { Outlet } from "react-router"
import Navbar from "../components/Navbar"
import Footer from "../components/Footer"

const MainLayout = () => {
  return (
    <div className="flex flex-col min-h-screen relative">
      <div className="absolute top-0 left-0 w-full z-50">
        <Navbar />
      </div>

      <main className="flex-1">
        <Outlet />
      </main>

      <Footer />
    </div>
  )
}

export default MainLayout