import { useState } from 'react';
import { Search, Menu, X } from 'lucide-react';
import { Link } from 'react-router';

const Navbar = () => {
    const [isOpen, setIsOpen] = useState(false);

    // ฟังก์ชันช่วยปิดเมนูเวลาคลิกลิงก์
    const toggleMenu = () => setIsOpen(!isOpen);
    const closeMenu = () => setIsOpen(false);

    return (
        <nav className="fixed top-0 left-0 right-0 z-50 w-full py-4 bg-transparent px-4">
            <div className="w-full max-w-[1104px] mx-auto relative">
                <div className="flex items-center justify-between bg-card/90 backdrop-blur-md w-full border border-border h-[70px] px-6 md:px-8 rounded-full shadow-sm">

                    <Link to='/' className="flex-shrink-0" onClick={closeMenu}>
                        <img
                            src="/flyup-logo.png"
                            alt="Flyup Logo"
                            className="h-[50px] md:h-[70px] w-auto transition-all"
                        />
                    </Link>

                    <div className="hidden md:flex items-center gap-[10px] bg-background border border-border h-[40px] w-full md:w-[414px] rounded-[12px] px-4 focus-within:border-primary transition-all">
                        <Search size={20} className="text-muted-foreground" />
                        <input
                            type="text"
                            placeholder="ค้นหา โปรเจกต์ , หมวดหมู่ที่ต้องการ"
                            className="bg-transparent outline-none w-full text-[14px] text-foreground placeholder:text-muted-foreground"
                        />
                    </div>

                    <div className="hidden md:flex items-center gap-3">
                        <Link to='/login' className="bg-primary hover:bg-primary-hover text-white px-6 py-2 rounded-xl text-[14px] font-medium transition-all shadow-sm active:scale-95">
                            เริ่มต้น
                        </Link>
                        <Link to='/register' className="bg-background border border-border px-6 py-2 rounded-xl text-[14px] font-medium text-foreground hover:bg-muted transition-all active:scale-95">
                            สมัคร
                        </Link>
                    </div>

                    <button
                        onClick={toggleMenu}
                        className="md:hidden p-2 text-foreground focus:outline-none cursor-pointer"
                    >
                        {isOpen ? <X size={20} /> : <Menu size={20} />}
                    </button>
                </div>

                {isOpen && (
                    <div className="absolute top-[80px] left-0 right-0 bg-card/95 backdrop-blur-lg border border-border rounded-[24px] p-6 shadow-xl md:hidden flex flex-col gap-5 animate-in fade-in zoom-in duration-200">

                        <div className="flex items-center gap-3 bg-background border border-border h-[48px] rounded-[12px] px-4">
                            <Search size={20} className="text-muted-foreground" />
                            <input
                                type="text"
                                placeholder="ค้นหา โปรเจกต์ , หมวดหมู่ที่ต้องการ"
                                className="bg-transparent outline-none w-full text-[16px]"
                            />
                        </div>

                        <Link
                            to="/login"
                            className="flex items-center justify-center bg-primary text-white h-[48px] rounded-[12px] font-medium active:scale-95 transition-all"
                            onClick={closeMenu}
                        >
                            เริ่มต้น
                        </Link>

                        <Link
                            to="/register"
                            className="flex items-center justify-center bg-background border border-border text-foreground h-[48px] rounded-[12px] font-medium active:scale-95 transition-all"
                            onClick={closeMenu}
                        >
                            สมัคร
                        </Link>
                    </div>
                )}
            </div>
        </nav>
    );
};

export default Navbar;