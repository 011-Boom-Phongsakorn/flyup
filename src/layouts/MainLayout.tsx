import { Outlet } from "react-router"
import Navbar from "../components/Navbar"
import Footer from "../components/Footer"
import ChatWidget from "../components/ChatWidget"
import CookieConsent from "../components/CookieConsent"

const MainLayout = () => {
  return (
    <div className="flex flex-col min-h-screen bg-background">
        <Navbar />
        <main className="flex-1 pb-[100px]">
            <Outlet />
        </main>
        <Footer />
        <ChatWidget />
        <CookieConsent />
    </div>
  );
};

export default MainLayout;