import { useState, useEffect, useRef } from 'react';
import { Search, Menu, X, LayoutDashboard, ChevronDown, Settings, LogOut } from 'lucide-react';
import { Link, useNavigate } from 'react-router';
import { useAuthStore } from '../store/useAuthStore';

const mockProjects = [
    { id: 6, title: 'DormMate', description: 'แอปหาเพื่อนร่วมหอพักมหาวิทยาลัย ฟีเจอร์ใหม่เพียบ', image: 'https://images.unsplash.com/photo-1593640408182-31c70c8268f5?auto=format&fit=crop&q=80&w=800', category: 'Mobile App' },
    { id: 5, title: 'UniTrack', description: 'แอปนำทางในมหาวิทยาลัยอัจฉริยะสำหรับนักศึกษา', image: 'https://images.unsplash.com/photo-1551288049-bebda4e38f71?auto=format&fit=crop&q=80&w=800', category: 'Mobile App' },
    { id: 4, title: 'Smart Farm IoT', description: 'ระบบจัดการฟาร์มอัจฉริยะสำหรับเกษตรกรยุคใหม่', image: 'https://images.unsplash.com/photo-1581091226825-a6a2a5aee158?auto=format&fit=crop&q=80&w=800', category: 'IoT' },
    { id: 3, title: 'Crypto Learn', description: 'แพลตฟอร์มเรียนรู้การลงทุน Blockchain สำหรับมือใหม่', image: 'https://images.unsplash.com/photo-1611162617474-5b21e879e113?auto=format&fit=crop&q=80&w=800', category: 'Fintech / Blockchain' },
    { id: 2, title: 'EduQuest', description: 'เกมการศึกษา RPG สำหรับเด็กประถม', image: 'https://images.unsplash.com/photo-1555854877-bab0e564b8d5?auto=format&fit=crop&q=80&w=800', category: 'Game' },
    { id: 1, title: 'CyberShield', description: 'เว็บแอปตรวจสอบช่องโหว่เว็บไซต์เบื้องต้น', image: 'https://images.unsplash.com/photo-1526374965328-7f61d4dc18c5?auto=format&fit=crop&q=80&w=800', category: 'Cybersecurity' }
];

interface SearchSuggestion {
    id: number | string;
    title: string;
    description: string;
    image: string;
    category: string;
}

const Navbar = () => {
    const [isOpen, setIsOpen] = useState(false);
    const [searchQuery, setSearchQuery] = useState('');
    const [suggestions, setSuggestions] = useState<SearchSuggestion[]>([]);
    const [showSuggestions, setShowSuggestions] = useState(false);
    const [showProfileMenu, setShowProfileMenu] = useState(false);
    const { authUser, logout } = useAuthStore();
    const navigate = useNavigate();
    const suggestionRef = useRef<HTMLDivElement>(null);
    const profileMenuRef = useRef<HTMLDivElement>(null);
    const mobileMenuRef = useRef<HTMLDivElement>(null);

    const toggleMenu = () => setIsOpen(!isOpen);
    const closeMenu = () => {
        setIsOpen(false);
        setShowSuggestions(false);
    };

    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            const target = event.target as Node;
            if (mobileMenuRef.current && mobileMenuRef.current.contains(target)) return;
            if (suggestionRef.current && !suggestionRef.current.contains(target)) {
                setShowSuggestions(false);
            }
            if (profileMenuRef.current && !profileMenuRef.current.contains(target)) {
                setShowProfileMenu(false);
            }
        };
        document.addEventListener('mousedown', handleClickOutside);
        return () => document.removeEventListener('mousedown', handleClickOutside);
    }, []);

    const handleLogout = () => {
        logout();
        setShowProfileMenu(false);
        // navigate('/');
    };

    const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const value = e.target.value;
        setSearchQuery(value);

        if (value.trim()) {
            const filtered = mockProjects.filter(p =>
                p.title.toLowerCase().includes(value.toLowerCase())
            ).slice(0, 5);
            setSuggestions(filtered);
            setShowSuggestions(true);
        } else {
            setSuggestions([]);
            setShowSuggestions(false);
        }
    };

    const handleSearch = (e: React.KeyboardEvent<HTMLInputElement>) => {
        if (e.key === 'Enter') {
            e.preventDefault();
            performSearch(searchQuery);
        }
    };

    const performSearch = (query: string) => {
        if (query.trim()) {
            navigate(`/projects?q=${encodeURIComponent(query.trim())}`);
        } else {
            navigate('/projects');
        }
        closeMenu();
    };

    return (

        <nav className={`fixed top-0 left-0 right-0 z-50 w-full py-4 bg-transparent px-4 transition-all duration-300`}>
            <div className="w-full max-w-[1104px] mx-auto relative">
                <div className="flex items-center justify-between bg-card/90 backdrop-blur-md w-full border border-border h-[70px] px-6 md:px-8 rounded-full shadow-sm">

                    <Link to='/' className="flex-shrink-0" onClick={closeMenu}>
                        <img src="/flyup-logo.png" alt="Flyup Logo" className="h-[50px] md:h-[70px] w-auto transition-all" />
                    </Link>

                    <div className="hidden md:block relative" ref={suggestionRef}>
                        <div className="flex items-center gap-[10px] bg-background border border-border h-[40px] w-[414px] rounded-[12px] px-4 focus-within:border-primary transition-all">
                            <Search size={20} className="text-muted-foreground" />
                            <input
                                type="text"
                                placeholder="ค้นหา โปรเจกต์ , หมวดหมู่ที่ต้องการ"
                                className="bg-transparent outline-none w-full text-[14px] text-foreground placeholder:text-muted-foreground"
                                value={searchQuery}
                                onChange={handleSearchChange}
                                onFocus={() => searchQuery && setShowSuggestions(true)}
                                onKeyDown={handleSearch}
                            />
                        </div>

                        {showSuggestions && (
                            <div className="absolute top-[50px] left-0 w-full bg-card border border-border rounded-[16px] shadow-xl overflow-hidden animate-in fade-in slide-in-from-top-2 duration-200 z-[60]">
                                <div className="py-2">
                                    {suggestions.length > 0 ? (
                                        suggestions.map((item) => (
                                            <button
                                                key={item.id}
                                                onClick={() => performSearch(item.title)}
                                                className="w-full flex items-center gap-4 px-4 py-3 hover:bg-muted transition-all text-left group"
                                            >
                                                <div className="w-12 h-12 flex-shrink-0 rounded-lg overflow-hidden border border-border">
                                                    <img
                                                        src={item.image}
                                                        alt={item.title}
                                                        className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-300"
                                                    />
                                                </div>

                                                <div className="flex flex-col min-w-0">
                                                    <span className="text-[14px] font-semibold text-foreground truncate">
                                                        {item.title}
                                                    </span>
                                                    <span className="text-[12px] text-muted-foreground truncate">
                                                        {item.description}
                                                    </span>
                                                </div>
                                            </button>
                                        ))
                                    ) : (
                                        <button
                                            onClick={() => performSearch(searchQuery)}
                                            className="w-full px-5 py-3 text-sm text-muted-foreground flex items-center gap-3 hover:bg-muted"
                                        >
                                            <Search size={16} />
                                            <span>ค้นหาแบบละเอียดสำหรับ "{searchQuery}"</span>
                                        </button>
                                    )}
                                </div>
                            </div>
                        )}
                    </div>

                    <div className="hidden md:flex items-center gap-4">
                        {authUser ? (
                            <>
                                <Link to={`/${authUser?.role}/dashboard`} className="flex items-center justify-center w-11 h-11 bg-[#8B5CF6] hover:bg-[#7C3AED] text-white rounded-full transition-all shadow-sm active:scale-95">
                                    <LayoutDashboard size={22} />
                                </Link>
                                <div className="relative" ref={profileMenuRef}>
                                    <button
                                        onClick={() => setShowProfileMenu(prev => !prev)}
                                        className="relative flex items-center justify-center focus:outline-none hover:opacity-90 transition-opacity"
                                    >
                                        <img
                                            src={authUser.profile_url || "https://ui-avatars.com/api/?name=" + (authUser.email)}
                                            alt="Profile"
                                            className="w-11 h-11 rounded-full object-cover border-2 border-transparent shadow-sm"
                                        />
                                        <div className="absolute -bottom-1 -right-1 bg-[#8B5CF6] text-white rounded-full p-[2px] border-2 border-white">
                                            <ChevronDown size={12} strokeWidth={3} />
                                        </div>
                                    </button>

                                    {showProfileMenu && (
                                        <div className="absolute top-[56px] right-0 w-[260px] bg-card border border-border rounded-[20px] shadow-xl overflow-hidden animate-in fade-in slide-in-from-top-2 duration-200 z-[60]">
                                            <div className="flex items-center gap-3 px-5 py-4">
                                                <img
                                                    src={authUser.profile_url || "https://ui-avatars.com/api/?name=" + (authUser.email)}
                                                    alt="Profile"
                                                    className="w-10 h-10 rounded-full object-cover flex-shrink-0"
                                                />
                                                <span className="text-[14px] font-semibold text-foreground truncate">
                                                    {authUser.first_name && authUser.last_name
                                                        ? `${authUser.first_name} ${authUser.last_name}`
                                                        : authUser.name || authUser.email}
                                                </span>
                                            </div>
                                            <div className="border-t border-border" />
                                            <Link
                                                to={`/${authUser?.role}/profile`}
                                                onClick={() => setShowProfileMenu(false)}
                                                className="flex items-center gap-3 px-5 py-3 hover:bg-muted transition-colors text-[14px] text-foreground"
                                            >
                                                <Settings size={18} className="text-[#8B5CF6]" />
                                                การตั้งค่าและความเป็นส่วนตัว
                                            </Link>
                                            <button
                                                onClick={handleLogout}
                                                className="w-full flex items-center gap-3 px-5 py-3 hover:bg-muted transition-colors text-[14px] text-foreground cursor-pointer"
                                            >
                                                <LogOut size={18} className="text-[#8B5CF6]" />
                                                ออกจากระบบ
                                            </button>
                                        </div>
                                    )}
                                </div>
                            </>
                        ) : (
                            <div className="flex gap-2">
                                <Link to='/login' className="bg-primary hover:bg-primary-hover text-white px-6 py-2 rounded-xl text-[14px] font-medium transition-all shadow-sm active:scale-95">เริ่มต้น</Link>
                                <Link to='/register' className="bg-background border border-border px-6 py-2 rounded-xl text-[14px] font-medium text-foreground hover:bg-muted transition-all active:scale-95">สมัคร</Link>
                            </div>
                        )}
                    </div>

                    <button onClick={toggleMenu} className="md:hidden p-2 text-foreground focus:outline-none cursor-pointer">
                        {isOpen ? <X size={20} /> : <Menu size={20} />}
                    </button>
                </div>

                {isOpen && (
                    <div ref={mobileMenuRef} className="absolute top-[80px] left-0 right-0 bg-card/95 backdrop-blur-lg border border-border rounded-[24px] p-6 shadow-xl md:hidden flex flex-col gap-4 animate-in fade-in zoom-in duration-200">

                        {/* Search + Profile avatar row */}
                        <div className="flex items-center gap-3">
                            <div className="flex-1 flex items-center gap-3 bg-background border border-border h-[48px] rounded-[12px] px-4">
                                <Search size={20} className="text-muted-foreground flex-shrink-0" />
                                <input
                                    type="text"
                                    placeholder="ค้นหา โปรเจกต์..."
                                    className="bg-transparent outline-none w-full text-[16px]"
                                    value={searchQuery}
                                    onChange={handleSearchChange}
                                    onKeyDown={handleSearch}
                                />
                            </div>
                            {authUser && (
                                <button
                                    onClick={() => setShowProfileMenu(prev => !prev)}
                                    className="flex-shrink-0 w-[48px] h-[48px] rounded-full overflow-hidden border-2 border-transparent focus:outline-none"
                                >
                                    <img
                                        src={authUser.profile_url || "https://ui-avatars.com/api/?name=" + (authUser.email)}
                                        alt="Profile"
                                        className="w-full h-full object-cover"
                                    />
                                </button>
                            )}
                        </div>

                        {/* Search suggestions */}
                        {showSuggestions && suggestions.length > 0 && (
                            <div className="bg-background border border-border rounded-[12px] overflow-hidden">
                                {suggestions.map((item) => (
                                    <button
                                        key={item.id}
                                        onClick={() => performSearch(item.title)}
                                        className="w-full flex items-center gap-3 px-4 py-3 hover:bg-muted transition-all text-left"
                                    >
                                        <div className="w-9 h-9 flex-shrink-0 rounded-lg overflow-hidden border border-border">
                                            <img src={item.image} alt={item.title} className="w-full h-full object-cover" />
                                        </div>
                                        <div className="flex flex-col min-w-0">
                                            <span className="text-[13px] font-semibold text-foreground truncate">{item.title}</span>
                                            <span className="text-[11px] text-muted-foreground truncate">{item.description}</span>
                                        </div>
                                    </button>
                                ))}
                            </div>
                        )}

                        {/* Profile dropdown menu */}
                        {authUser && showProfileMenu && (
                            <div className="border-t border-border pt-3 flex flex-col gap-1">
                                <div className="flex items-center gap-3 px-2 py-2 mb-1">
                                    <img
                                        src={authUser.profile_url || "https://ui-avatars.com/api/?name=" + (authUser.email)}
                                        alt="Profile"
                                        className="w-9 h-9 rounded-full object-cover flex-shrink-0"
                                    />
                                    <span className="text-[14px] font-semibold text-foreground truncate">
                                        {authUser.first_name && authUser.last_name
                                            ? `${authUser.first_name} ${authUser.last_name}`
                                            : authUser.name || authUser.email}
                                    </span>
                                </div>
                                <div className="border-t border-border mb-1" />
                                <Link to={`/${authUser?.role}/dashboard`} onClick={closeMenu} className="flex items-center gap-3 px-2 py-3 rounded-xl hover:bg-muted transition-colors text-[14px] text-foreground">
                                    <LayoutDashboard size={18} className="text-[#8B5CF6]" /> แดชบอร์ด
                                </Link>
                                <Link to={`/${authUser?.role}/profile`} onClick={closeMenu} className="flex items-center gap-3 px-2 py-3 rounded-xl hover:bg-muted transition-colors text-[14px] text-foreground">
                                    <Settings size={18} className="text-[#8B5CF6]" /> การตั้งค่าและความเป็นส่วนตัว
                                </Link>
                                <button onClick={() => { handleLogout(); closeMenu(); }} className="flex items-center gap-3 px-2 py-3 rounded-xl hover:bg-muted transition-colors text-[14px] text-foreground cursor-pointer w-full">
                                    <LogOut size={18} className="text-[#8B5CF6]" /> ออกจากระบบ
                                </button>
                            </div>
                        )}

                        {!authUser && (
                            <div className="flex flex-col gap-3 pt-2 border-t border-border">
                                <Link to='/login' className="w-full bg-primary hover:bg-primary-hover text-white text-center py-3 rounded-xl text-[15px] font-medium transition-all shadow-sm" onClick={closeMenu}>เข้าสู่ระบบ</Link>
                                <Link to='/register' className="w-full bg-background border border-border text-center py-3 rounded-xl text-[15px] font-medium text-foreground hover:bg-muted transition-all" onClick={closeMenu}>สมัครสมาชิก</Link>
                            </div>
                        )}
                    </div>
                )}
            </div>
        </nav>
    );
};

export default Navbar;