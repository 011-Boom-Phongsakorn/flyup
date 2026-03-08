import { Outlet } from "react-router"
import Navbar from "../components/Navbar"
import Footer from "../components/Footer"

const MainLayout = () => {
  return (
    <div className="flex flex-col min-h-screen bg-white">
        <Navbar />

        <main className="flex-1 py-[100px]"> 
            <Outlet />
        </main>
        <Footer />
    </div>
  )
}

export default MainLayout