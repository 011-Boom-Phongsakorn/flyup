import { useState, useEffect, useRef } from 'react';
import { Search, Menu, X, LayoutDashboard, ChevronDown } from 'lucide-react';
import { Link, useNavigate, useLocation } from 'react-router';
import { useAuthStore } from '../store/useAuthStore';
import { usePublicProjectStore } from '../store/usePublicProjectStore';

const PLACEHOLDER_IMG = 'https://images.unsplash.com/photo-1498050108023-c5249f4df085?auto=format&fit=crop&q=80&w=400';

const Navbar = () => {
    const [isOpen, setIsOpen] = useState(false);
    const [searchQuery, setSearchQuery] = useState('');
    const [showSuggestions, setShowSuggestions] = useState(false);
    const { authUser } = useAuthStore();
    const { publicProjects, fetchPublicProjects } = usePublicProjectStore();
    const navigate = useNavigate();
    const location = useLocation();
    const suggestionRef = useRef<HTMLDivElement>(null);

    // Hide search bar on /projects page
    const isProjectsPage = location.pathname === '/projects';

    const toggleMenu = () => setIsOpen(!isOpen);
    const closeMenu = () => {
        setIsOpen(false);
        setShowSuggestions(false);
    };

    // Load projects for search if not loaded yet
    useEffect(() => {
        if (publicProjects.length === 0) {
            fetchPublicProjects();
        }
    }, [publicProjects.length, fetchPublicProjects]);

    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            if (suggestionRef.current && !suggestionRef.current.contains(event.target as Node)) {
                setShowSuggestions(false);
            }
        };
        document.addEventListener('mousedown', handleClickOutside);
        return () => document.removeEventListener('mousedown', handleClickOutside);
    }, []);

    // Filter suggestions from real projects
    const suggestions = searchQuery.trim()
        ? publicProjects
            .filter(p => p.title.toLowerCase().includes(searchQuery.toLowerCase()) || (p.description || '').toLowerCase().includes(searchQuery.toLowerCase()))
            .slice(0, 5)
        : [];

    const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const value = e.target.value;
        setSearchQuery(value);
        setShowSuggestions(!!value.trim());
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
        setSearchQuery('');
        closeMenu();
    };

    const handleSuggestionClick = (projectId: number) => {
        navigate(`/projects/${projectId}`);
        setSearchQuery('');
        closeMenu();
    };

    return (

        <nav className={`fixed top-0 left-0 right-0 z-50 w-full py-4 bg-transparent px-4 transition-all duration-300`}>
            <div className="w-full max-w-[1104px] mx-auto relative">
                <div className="flex items-center justify-between bg-card/90 backdrop-blur-md w-full border border-border h-[70px] px-6 md:px-8 rounded-full shadow-sm">

                    <Link to='/' className="flex-shrink-0" onClick={closeMenu}>
                        <img src="/flyup-logo.png" alt="Flyup Logo" className="h-[50px] md:h-[70px] w-auto transition-all" />
                    </Link>

                    {/* Desktop Search — hidden on /projects */}
                    {!isProjectsPage && (
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
                                                    onClick={() => handleSuggestionClick(item.id)}
                                                    className="w-full flex items-center gap-4 px-4 py-3 hover:bg-muted transition-all text-left group"
                                                >
                                                    <div className="w-12 h-12 flex-shrink-0 rounded-lg overflow-hidden border border-border">
                                                        <img
                                                            src={item.thumbnail_url || PLACEHOLDER_IMG}
                                                            alt={item.title}
                                                            className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-300"
                                                        />
                                                    </div>

                                                    <div className="flex flex-col min-w-0">
                                                        <span className="text-[14px] font-semibold text-foreground truncate">
                                                            {item.title}
                                                        </span>
                                                        <span className="text-[12px] text-muted-foreground truncate">
                                                            {item.description || 'ยังไม่มีรายละเอียด'}
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
                    )}

                    <div className="hidden md:flex items-center gap-4">
                        {authUser ? (
                            <>
                                <Link to={`/${authUser?.role}/dashboard`} className="flex items-center justify-center w-11 h-11 bg-[#8B5CF6] hover:bg-[#7C3AED] text-white rounded-full transition-all shadow-sm active:scale-95">
                                    <LayoutDashboard size={22} />
                                </Link>
                                <button className="relative flex items-center justify-center focus:outline-none hover:opacity-90 transition-opacity">
                                    <img
                                        src={authUser.profile_url || "https://ui-avatars.com/api/?name=" + (authUser.email)}
                                        alt="Profile"
                                        className="w-11 h-11 rounded-full object-cover border-2 border-transparent shadow-sm"
                                    />
                                    <div className="absolute -bottom-1 -right-1 bg-[#8B5CF6] text-white rounded-full p-[2px] border-2 border-white">
                                        <ChevronDown size={12} strokeWidth={3} />
                                    </div>
                                </button>
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
                    <div className="absolute top-[80px] left-0 right-0 bg-card/95 backdrop-blur-lg border border-border rounded-[24px] p-6 shadow-xl md:hidden flex flex-col gap-5 animate-in fade-in zoom-in duration-200">
                        {/* Mobile Search — hidden on /projects */}
                        {!isProjectsPage && (
                            <div className="flex items-center gap-3 bg-background border border-border h-[48px] rounded-[12px] px-4">
                                <Search size={20} className="text-muted-foreground" />
                                <input
                                    type="text"
                                    placeholder="ค้นหา โปรเจกต์..."
                                    className="bg-transparent outline-none w-full text-[16px]"
                                    value={searchQuery}
                                    onChange={handleSearchChange}
                                    onKeyDown={handleSearch}
                                />
                            </div>
                        )}

                        {authUser ? (
                            <div className="flex items-center gap-3 pt-2 border-t border-border">
                                <Link to={`/${authUser?.role}/dashboard`} className="flex-1 flex items-center justify-center gap-2 bg-[#8B5CF6] hover:bg-[#7C3AED] text-white py-3 rounded-xl font-medium transition-all shadow-sm" onClick={closeMenu}>
                                    <LayoutDashboard size={20} /> แดชบอร์ด
                                </Link>
                                <button className="flex items-center justify-center h-12 w-12 bg-background border border-border rounded-xl">
                                    <img
                                        src={authUser.profile_url || "https://ui-avatars.com/api/?name=" + (authUser.email)}
                                        alt="Profile"
                                        className="w-8 h-8 rounded-full object-cover"
                                    />
                                </button>
                            </div>
                        ) : (
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