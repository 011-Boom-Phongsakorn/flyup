import { Link } from "react-router";
import { Cookie } from "lucide-react";
import { useCookieConsent } from "./CookieConsent";

const Footer = () => {
    const { reopen } = useCookieConsent();

    return (
        <footer className="w-full h-auto h-[100px] bg-card border-t border-border flex items-center mt-auto px-4">
            <div className="w-full mx-auto max-w-[1104px] flex flex-col md:flex-row items-center justify-between gap-6">

                <div className="flex flex-col md:flex-row items-center gap-4 md:gap-8">
                    <Link to='/' className="flex-shrink-0">
                        <img
                            src="/flyup-logo.png"
                            alt="Flyup Logo"
                            className="h-[50px] md:h-[70px] w-auto transition-all"
                        />
                    </Link>
                    <span className="text-[14px] text-foreground font-medium">
                        © 2026 FLYUP — สงวนลิขสิทธิ์
                    </span>
                </div>

                <div className="flex items-center gap-6 md:gap-10">
                    <Link to="/about/we" className="text-[14px] text-foreground font-medium hover:text-primary transition-colors">
                        เกี่ยวกับเรา
                    </Link>
                    <Link to="/legal/terms" className="text-[14px] text-foreground font-medium hover:text-primary transition-colors">
                        ข้อกำหนด
                    </Link>
                    <Link to="/help" className="text-[14px] text-foreground font-medium hover:text-primary transition-colors">
                        ศูนย์ช่วยเหลือ
                    </Link>
                    <button
                        onClick={reopen}
                        className="flex items-center gap-1.5 text-[14px] text-muted-foreground font-medium hover:text-primary transition-colors cursor-pointer"
                        title="จัดการการตั้งค่า Cookie"
                    >
                        <Cookie size={14} />
                        Cookie
                    </button>
                </div>

            </div>
        </footer>
    );
};

export default Footer;