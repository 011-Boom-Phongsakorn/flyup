import { Outlet, useLocation } from "react-router" // <-- เพิ่ม useLocation ตรงนี้
import Navbar from "../components/Navbar"
import Footer from "../components/Footer"

const MainLayout = () => {
  const location = useLocation()
  
  // เช็คว่าใช่หน้า Home หรือไม่ (ถ้า path หน้า Home ของคุณคือแบบอื่น เช่น "/home" ให้แก้ตรงนี้นะครับ)
  const isHome = location.pathname === "/"

  return (
    <div className="flex flex-col min-h-screen bg-background">
        {/* ส่งค่า isHome ไปให้ Navbar ตัดสินใจว่าจะใช้แบบไหน */}
        <Navbar isHome={isHome} />
        
        <main className="flex-1 pb-[100px]"> 
            <Outlet />
        </main>
        <Footer />
    </div>
  )
}

export default MainLayout