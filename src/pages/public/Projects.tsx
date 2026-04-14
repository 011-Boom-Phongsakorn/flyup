import { useState, useEffect, useMemo } from 'react';
import { Link } from 'react-router';
import type { ElementType } from 'react';
import {
  Search, ChevronDown, Flame, Sparkles,
  LayoutGrid, Laptop, Smartphone, Bot, Briefcase,
  Rocket, BookOpen, ShieldCheck, Wifi, Gamepad2, Loader2
} from 'lucide-react';
import { usePublicProjectStore, type PublicProject } from '../../store/usePublicProjectStore';

// ─── Category icon mapping ──────────────────────────────────────────────────

const categoryIconMap: Record<string, ElementType> = {
  'Technology': Laptop,
  'AI': Bot,
  'FinTech': Briefcase,
  'EdTech': BookOpen,
  'HealthTech': Rocket,
  'Gaming': Gamepad2,
  'Environment': Wifi,
  'Social Impact': ShieldCheck,
  'Education': BookOpen,
  'Others': LayoutGrid,
  // legacy
  'Web App': Laptop,
  'Mobile App': Smartphone,
  'AI/ML': Bot,
  'Business': Briefcase,
  'Fintech / Blockchain': Rocket,
  'Cybersecurity': ShieldCheck,
  'IoT': Wifi,
  'Game': Gamepad2,
};

function getCategoryIcon(name: string | null): ElementType {
  if (!name) return LayoutGrid;
  return categoryIconMap[name] || LayoutGrid;
}

// ─── Component ───────────────────────────────────────────────────────────────

const NOW = Date.now();

const Projects = () => {
  const { publicProjects, categories, isLoading, fetchPublicProjects, fetchCategories } = usePublicProjectStore();

  const [activeCategory, setActiveCategory] = useState(() => {
    const params = new URLSearchParams(window.location.search);
    return params.get('category') || 'ทั้งหมด';
  });
  const [searchQuery, setSearchQuery] = useState(() => {
    const params = new URLSearchParams(window.location.search);
    return params.get('q') || '';
  });
  const [sortOrder, setSortOrder] = useState<'latest' | 'oldest'>('latest');
  const [isSortDropdownOpen, setIsSortDropdownOpen] = useState(false);

  useEffect(() => {
    fetchPublicProjects();
    fetchCategories();
  }, [fetchPublicProjects, fetchCategories]);

  const categoryList = useMemo(() => {
    const allOption = { name: 'ทั้งหมด', icon: LayoutGrid };
    const apiCategories = categories.map(c => ({
      name: c.name,
      icon: getCategoryIcon(c.name),
    }));
    return [allOption, ...apiCategories];
  }, [categories]);

  const filteredProjects = useMemo(() => {
    let result = [...publicProjects];

    if (searchQuery.trim()) {
      const query = searchQuery.toLowerCase();
      result = result.filter(project =>
        project.title.toLowerCase().includes(query) ||
        (project.description || '').toLowerCase().includes(query)
      );
    }

    if (activeCategory !== 'ทั้งหมด') {
      result = result.filter(project => project.category === activeCategory);
    }

    result.sort((a, b) => {
      return sortOrder === 'latest' ? b.id - a.id : a.id - b.id;
    });

    return result;
  }, [publicProjects, activeCategory, searchQuery, sortOrder]);

  const getProgress = (p: PublicProject) => {
    if (!p.funding_goal || p.funding_goal === 0) return 0;
    return Math.min(Math.round((p.current_funding / p.funding_goal) * 100), 100);
  };

  const getDaysLeft = (p: PublicProject) => {
    if (!p.end_date) return p.duration_days || 0;
    const diff = new Date(p.end_date).getTime() - NOW;
    return Math.max(0, Math.ceil(diff / (1000 * 60 * 60 * 24)));
  };

  return (
    <div className="bg-background min-h-screen pb-20 font-sans text-foreground mt-[100px]">
      <div className="container mx-auto px-4 md:px-8 max-w-7xl">

        <div className="mb-5 md:mb-6">
          <h1 className="text-2xl md:text-3xl font-bold mb-1">สำรวจโปรเจกต์</h1>
          <p className="text-sm text-muted-foreground">ค้นพบโปรเจกต์ซอฟต์แวร์จากนักศึกษาที่กำลังระดมทุน</p>
        </div>

        <div className="flex flex-col lg:flex-row gap-3 md:gap-4 mb-6">
          <div className="flex-1 flex items-center gap-2 bg-card border border-border h-12 md:h-11 rounded-lg px-4 focus-within:border-primary transition-all shadow-sm w-full">
            <Search size={18} className="text-muted-foreground flex-shrink-0" />
            <input
              type="text"
              placeholder="ค้นหาชื่อโปรเจกต์..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="bg-transparent outline-none w-full text-sm placeholder:text-muted-foreground"
            />
          </div>

          <div className="flex gap-3 w-full lg:w-auto">
            <div className="relative flex-1 lg:flex-none w-full lg:w-auto">
              <div
                onClick={() => setIsSortDropdownOpen(!isSortDropdownOpen)}
                className="flex items-center justify-between bg-card border border-border h-12 md:h-11 rounded-lg px-4 lg:min-w-[140px] cursor-pointer hover:bg-muted/30 transition-all shadow-sm select-none w-full"
              >
                <span className="text-sm font-medium whitespace-nowrap">
                  {sortOrder === 'latest' ? 'ล่าสุด' : 'เก่าสุด'}
                </span>
                <ChevronDown size={16} className={`text-muted-foreground transition-transform ${isSortDropdownOpen ? 'rotate-180' : ''}`} />
              </div>

              {isSortDropdownOpen && (
                <div className="absolute top-14 md:top-12 left-0 w-full bg-card border border-border rounded-lg shadow-lg overflow-hidden z-20">
                  <div
                    onClick={() => { setSortOrder('latest'); setIsSortDropdownOpen(false); }}
                    className={`px-4 py-3 text-sm cursor-pointer hover:bg-muted/30 whitespace-nowrap ${sortOrder === 'latest' ? 'text-primary font-medium bg-primary-light' : ''}`}
                  >
                    ล่าสุด
                  </div>
                  <div
                    onClick={() => { setSortOrder('oldest'); setIsSortDropdownOpen(false); }}
                    className={`px-4 py-3 text-sm cursor-pointer hover:bg-muted/30 whitespace-nowrap ${sortOrder === 'oldest' ? 'text-primary font-medium bg-primary-light' : ''}`}
                  >
                    เก่าสุด
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>

        <div className="flex overflow-x-auto gap-2.5 pb-3 mb-6 md:mb-8 scrollbar-hide -mx-4 px-4 md:mx-0 md:px-0">
          {categoryList.map((category) => {
            const Icon = category.icon;
            const isActive = activeCategory === category.name;
            return (
              <button
                key={category.name}
                onClick={() => setActiveCategory(category.name)}
                className={`flex items-center gap-1.5 whitespace-nowrap px-4 py-2 rounded-full text-sm font-medium transition-all border shadow-sm flex-shrink-0 ${isActive
                    ? 'bg-primary-light text-primary border-primary'
                    : 'bg-card text-muted-foreground border-border hover:border-primary hover:text-foreground'
                  }`}
              >
                <Icon size={16} className={isActive ? 'text-primary' : ''} />
                {category.name}
              </button>
            );
          })}
        </div>

        {isLoading ? (
          <div className="flex flex-col items-center justify-center py-16 md:py-20">
            <Loader2 size={32} className="animate-spin text-primary mb-4" />
            <p className="text-sm text-muted-foreground">กำลังโหลดโปรเจกต์...</p>
          </div>
        ) : filteredProjects.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5 md:gap-6">
            {filteredProjects.map((project) => {
              const ProjectCategoryIcon = getCategoryIcon(project.category);
              const progress = getProgress(project);
              const daysLeft = getDaysLeft(project);
              const isHot = progress >= 70;
              const isNew = (NOW - new Date(project.created_at).getTime()) < 7 * 24 * 60 * 60 * 1000;

              return (
                <Link
                  key={project.id}
                  to={`/projects/${project.id}`}
                  className="bg-card rounded-2xl overflow-hidden border border-border hover:shadow-lg hover:border-primary/30 transition-all cursor-pointer group flex flex-col"
                >
                  <div className="relative h-48 w-full overflow-hidden bg-muted">
                    <img
                      src={project.thumbnail_url || `https://images.unsplash.com/photo-1498050108023-c5249f4df085?auto=format&fit=crop&q=80&w=800`}
                      alt={project.title}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                    />
                    <div className="absolute top-3 right-3 flex gap-2">
                      {isHot && (
                        <div className="bg-error text-white px-2.5 py-1 rounded-full text-xs font-bold flex items-center gap-1 shadow-md">
                          <Flame size={14} fill="currentColor" />
                          {progress}%
                        </div>
                      )}
                      {isNew && !isHot && (
                        <div className="bg-[image:var(--gradient-primary)] text-white px-2.5 py-1 rounded-full text-xs font-bold flex items-center gap-1 shadow-md">
                          <Sparkles size={14} fill="currentColor" />
                          ใหม่
                        </div>
                      )}
                    </div>
                  </div>

                  <div className="p-4 md:p-5 flex flex-col flex-1">
                    <div className="flex justify-between items-start mb-2 gap-2">
                      <h3 className="text-base md:text-lg font-bold line-clamp-1 flex-1">{project.title}</h3>
                      {project.category && (
                        <span className="flex items-center gap-1 text-xs font-medium text-primary bg-primary-light border border-primary/20 px-2 py-1 rounded-full whitespace-nowrap">
                          <ProjectCategoryIcon size={12} />
                          {project.category}
                        </span>
                      )}
                    </div>

                    <p className="text-sm text-muted-foreground line-clamp-2 mb-4 h-10">
                      {project.description || 'ยังไม่มีรายละเอียด'}
                    </p>

                    <div className="w-full h-1.5 bg-muted rounded-full mb-3 overflow-hidden mt-auto">
                      <div
                        className="h-full bg-primary rounded-full transition-all duration-500"
                        style={{ width: `${progress}%` }}
                      ></div>
                    </div>

                    <div className="flex justify-between items-center pt-2 border-t border-dashed border-border">
                      <div>
                        <p className="text-xs text-muted-foreground mb-0.5">ระดมทุนแล้ว</p>
                        <span className="text-sm md:text-base font-bold text-primary">{project.current_funding.toLocaleString()} ฿</span>
                      </div>
                      <div className="text-right">
                        <p className="text-xs text-muted-foreground mb-0.5">เหลือเวลา</p>
                        <span className="text-sm font-medium text-foreground">{daysLeft} วัน</span>
                      </div>
                    </div>
                  </div>
                </Link>
              );
            })}
          </div>
        ) : (
          <div className="flex flex-col items-center justify-center py-16 md:py-20 text-center px-4">
            <div className="w-16 h-16 md:w-20 md:h-20 bg-muted/50 rounded-full flex items-center justify-center mb-4">
              <Search size={28} className="text-muted-foreground" />
            </div>
            <h3 className="text-base md:text-lg font-bold mb-1">ไม่พบโปรเจกต์</h3>
            <p className="text-sm text-muted-foreground">ลองเปลี่ยนคำค้นหา หรือเลือกหมวดหมู่ใหม่อีกครั้ง</p>
            <button
              onClick={() => { setSearchQuery(''); setActiveCategory('ทั้งหมด'); }}
              className="mt-4 text-primary text-sm font-medium hover:underline p-2"
            >
              ล้างตัวกรอง
            </button>
          </div>
        )}

      </div>
    </div>
  );
};

export default Projects;