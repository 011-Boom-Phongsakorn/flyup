import { useState, useMemo } from 'react';
import { Link } from 'react-router';
import type { ElementType } from 'react';
import { 
  Search, ChevronDown, Flame, Sparkles,
  LayoutGrid, Laptop, Smartphone, Bot, Briefcase, 
  Rocket, BookOpen, ShieldCheck, Wifi, Gamepad2 
} from 'lucide-react';

interface Project {
  id: number;
  title: string;
  description: string;
  image: string;
  category: string;
  progress: number;
  raised: number;
  daysLeft: number;
  isHot?: boolean;
  isNew?: boolean; 
}

interface CategoryConfig {
  name: string;
  icon: ElementType;
}

const categoriesMap: CategoryConfig[] = [
  { name: 'ทั้งหมด', icon: LayoutGrid },
  { name: 'Web App', icon: Laptop },
  { name: 'Mobile App', icon: Smartphone },
  { name: 'AI/ML', icon: Bot },
  { name: 'Business', icon: Briefcase },
  { name: 'Fintech / Blockchain', icon: Rocket },
  { name: 'Education', icon: BookOpen },
  { name: 'Cybersecurity', icon: ShieldCheck },
  { name: 'IoT', icon: Wifi },
  { name: 'Game', icon: Gamepad2 }
];

const mockProjects: Project[] = [
  {
    id: 6,
    title: 'DormMate',
    description: 'แอปหาเพื่อนร่วมหอพักมหาวิทยาลัย ฟีเจอร์ใหม่เพียบ',
    image: 'https://images.unsplash.com/photo-1593640408182-31c70c8268f5?auto=format&fit=crop&q=80&w=800',
    category: 'Mobile App',
    progress: 72,
    raised: 21000,
    daysLeft: 15,
    isHot: true,
  },
  {
    id: 5,
    title: 'UniTrack',
    description: 'แอปนำทางในมหาวิทยาลัยอัจฉริยะสำหรับนักศึกษา',
    image: 'https://images.unsplash.com/photo-1551288049-bebda4e38f71?auto=format&fit=crop&q=80&w=800',
    category: 'Mobile App',
    progress: 15,
    raised: 1000,
    daysLeft: 55,
    isNew: true,
  },
  {
    id: 4,
    title: 'Smart Farm IoT',
    description: 'ระบบจัดการฟาร์มอัจฉริยะสำหรับเกษตรกรยุคใหม่',
    image: 'https://images.unsplash.com/photo-1581091226825-a6a2a5aee158?auto=format&fit=crop&q=80&w=800',
    category: 'IoT',
    progress: 45,
    raised: 15000,
    daysLeft: 30,
  },
  {
    id: 3,
    title: 'Crypto Learn',
    description: 'แพลตฟอร์มเรียนรู้การลงทุน Blockchain สำหรับมือใหม่',
    image: 'https://images.unsplash.com/photo-1611162617474-5b21e879e113?auto=format&fit=crop&q=80&w=800',
    category: 'Fintech / Blockchain',
    progress: 90,
    raised: 45000,
    daysLeft: 5,
    isHot: true,
  },
  {
    id: 2,
    title: 'EduQuest',
    description: 'เกมการศึกษา RPG สำหรับเด็กประถม',
    image: 'https://images.unsplash.com/photo-1555854877-bab0e564b8d5?auto=format&fit=crop&q=80&w=800',
    category: 'Game',
    progress: 20,
    raised: 5000,
    daysLeft: 40,
    isNew: true,
  },
  {
    id: 1,
    title: 'CyberShield',
    description: 'เว็บแอปตรวจสอบช่องโหว่เว็บไซต์เบื้องต้น',
    image: 'https://images.unsplash.com/photo-1526374965328-7f61d4dc18c5?auto=format&fit=crop&q=80&w=800',
    category: 'Cybersecurity',
    progress: 100,
    raised: 50000,
    daysLeft: 0,
  }
];

const Projects = () => {
  const [activeCategory, setActiveCategory] = useState('ทั้งหมด');
  const [searchQuery, setSearchQuery] = useState(() => {
    const params = new URLSearchParams(window.location.search);
    return params.get('q') || '';
  }); 

  const [sortOrder, setSortOrder] = useState<'latest' | 'oldest'>('latest');
  const [isSortDropdownOpen, setIsSortDropdownOpen] = useState(false); 

  const filteredProjects = useMemo(() => {
    let result = [...mockProjects];

    if (searchQuery.trim()) {
      const query = searchQuery.toLowerCase();
      result = result.filter(project => 
        project.title.toLowerCase().includes(query) ||
        project.description.toLowerCase().includes(query)
      );
    }

    if (activeCategory !== 'ทั้งหมด') {
      result = result.filter(project => project.category === activeCategory);
    }

    result.sort((a, b) => {
      return sortOrder === 'latest' ? b.id - a.id : a.id - b.id;
    });

    return result;
  }, [activeCategory, searchQuery, sortOrder]);

  return (
    <div className="bg-background min-h-screen pb-20 font-sans text-foreground">
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
          {categoriesMap.map((category) => {
            const Icon = category.icon;
            const isActive = activeCategory === category.name;
            return (
              <button
                key={category.name}
                onClick={() => setActiveCategory(category.name)}
                className={`flex items-center gap-1.5 whitespace-nowrap px-4 py-2 rounded-full text-sm font-medium transition-all border shadow-sm flex-shrink-0 ${
                  isActive
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

        {filteredProjects.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5 md:gap-6">
            {filteredProjects.map((project) => {
              const categoryConfig = categoriesMap.find(category => category.name === project.category);
              const ProjectCategoryIcon = categoryConfig ? categoryConfig.icon : LayoutGrid;

              return (
                <Link 
      key={project.id} 
      to={`/projects/${project.id}`} 
                  className="bg-card rounded-2xl overflow-hidden border border-border hover:shadow-lg hover:border-primary/30 transition-all cursor-pointer group flex flex-col"
                >
                  <div className="relative h-48 w-full overflow-hidden bg-muted">
                    <img 
                      src={project.image} 
                      alt={project.title} 
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                    />
                    <div className="absolute top-3 right-3 flex gap-2">
                      {project.isHot && (
                        <div className="bg-error text-white px-2.5 py-1 rounded-full text-xs font-bold flex items-center gap-1 shadow-md">
                          <Flame size={14} fill="currentColor" />
                          {project.progress}%
                        </div>
                      )}
                      {project.isNew && (
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
                      <span className="flex items-center gap-1 text-xs font-medium text-primary bg-primary-light border border-primary/20 px-2 py-1 rounded-full whitespace-nowrap">
                        <ProjectCategoryIcon size={12} />
                        {project.category}
                      </span>
                    </div>
                    
                    <p className="text-sm text-muted-foreground line-clamp-2 mb-4 h-10">
                      {project.description}
                    </p>

                    <div className="w-full h-1.5 bg-muted rounded-full mb-3 overflow-hidden mt-auto">
                      <div 
                        className="h-full bg-primary rounded-full transition-all duration-500"
                        style={{ width: `${project.progress}%` }}
                      ></div>
                    </div>

                    <div className="flex justify-between items-center pt-2 border-t border-dashed border-border">
                      <div>
                        <p className="text-xs text-muted-foreground mb-0.5">ระดมทุนแล้ว</p>
                        <span className="text-sm md:text-base font-bold text-primary">{project.raised.toLocaleString()} ฿</span>
                      </div>
                      <div className="text-right">
                        <p className="text-xs text-muted-foreground mb-0.5">เหลือเวลา</p>
                        <span className="text-sm font-medium text-foreground">{project.daysLeft} วัน</span>
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
              onClick={() => {setSearchQuery(''); setActiveCategory('ทั้งหมด');}}
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