import { Outlet, useLocation, matchPath } from "react-router";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";

const MainLayout = () => {
  const location = useLocation();
  const isHome = location.pathname === "/";

  const isInvestment = !!matchPath("/projects/:id/invest", location.pathname);

  return (
    <div className="flex flex-col min-h-screen bg-background">
      <Navbar isHome={isHome} isInvestment={isInvestment} />
      <main className="flex-1">
        <Outlet />
      </main>
      <Footer />
    </div>
  );
};

export default MainLayout;