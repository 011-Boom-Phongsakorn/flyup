import { useEffect, useState } from 'react';
import { Link } from 'react-router';
import {
  ChevronRight,
  Flame,
  Sparkles,
  Rocket,
  SquarePen,
  Heart,
  ListChecks,
  Clock,
  TrendingUp,
  Users,
  ShieldCheck,
  Loader2
} from 'lucide-react';
import { usePublicProjectStore, type PublicProject } from '../../store/usePublicProjectStore';
import { useAuthStore } from '../../store/useAuthStore';
import useCreateProjectGuard from '../../hooks/useCreateProjectGuard';

// ─── Helpers ────────────────────────────────────────────────────────────────

const getProgress = (p: PublicProject) => {
  if (!p.funding_goal || p.funding_goal === 0) return 0;
  return Math.min(Math.round((p.current_funding / p.funding_goal) * 100), 100);
};

const getDaysLeft = (p: PublicProject) => {
  if (!p.end_date) return p.duration_days || 0;
  const diff = new Date(p.end_date).getTime() - Date.now();
  return Math.max(0, Math.ceil(diff / (1000 * 60 * 60 * 24)));
};

const PLACEHOLDER_IMG = 'https://images.unsplash.com/photo-1498050108023-c5249f4df085?auto=format&fit=crop&q=80&w=800';

// ─── Project Card ───────────────────────────────────────────────────────────

const ProjectCard = ({ project }: { project: PublicProject & { isHot?: boolean; isNew?: boolean } }) => {
  const progress = getProgress(project);
  const daysLeft = getDaysLeft(project);

  return (
    <Link
      to={`/projects/${project.slug || project.id}`}
      className="bg-white rounded-2xl overflow-hidden shadow-sm border border-gray-100 hover:shadow-lg transition-all cursor-pointer group flex flex-col"
    >
      <div className="relative h-48 w-full overflow-hidden bg-gray-100">
        <img src={project.thumbnail_url || PLACEHOLDER_IMG} alt={project.title} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
        <div className="absolute top-3 right-3 flex gap-2">
          {project.isHot && (
            <div className="bg-red-500 text-white px-2.5 py-1 rounded-full text-xs font-bold flex items-center gap-1 shadow-md">
              <Flame size={14} fill="currentColor" /> {progress}%
            </div>
          )}
          {project.isNew && !project.isHot && (
            <div className="bg-purple-500 text-white px-2.5 py-1 rounded-full text-xs font-bold flex items-center gap-1 shadow-md">
              <Sparkles size={14} fill="currentColor" /> ใหม่
            </div>
          )}
        </div>
      </div>
      <div className="p-4 flex flex-col flex-1">
        <div className="flex justify-between items-start gap-2 mb-1">
          <h3 className="text-lg font-bold line-clamp-1 flex-1">{project.title}</h3>
          {project.category && (
            <span className="text-[10px] font-medium px-2.5 py-0.5 bg-white border border-gray-200 rounded-full text-gray-400 whitespace-nowrap">
              {project.category}
            </span>
          )}
        </div>

        <p className="text-xs text-gray-500 line-clamp-1 mb-4">{project.description || 'ยังไม่มีรายละเอียด'}</p>

        <div className="w-full h-1.5 bg-gray-100 rounded-full mb-3 overflow-hidden mt-auto">
          <div className="h-full bg-gradient-to-r from-pink-500 to-purple-600 rounded-full" style={{ width: `${progress}%` }}></div>
        </div>

        <div className="flex justify-between items-center pt-1">
          <span className="text-sm font-bold">{(project.current_funding ?? 0).toLocaleString()} ฿</span>
          <span className="text-xs text-gray-500">{daysLeft} วัน</span>
        </div>
      </div>
    </Link>
  );
};

// ─── Home Page ──────────────────────────────────────────────────────────────

const HERO_WORDS = ['โปรเจกต์ที่ใช่', 'นวัตกรรมใหม่', 'ไอเดียที่ดี', 'ความฝันของคุณ'];

const Home = () => {
  const { authUser } = useAuthStore();
  const hideCreateBtn = authUser?.role === 'booster' || authUser?.role === 'admin';
  const { createWithGuard, isCreating } = useCreateProjectGuard();

  const [heroWordIdx, setHeroWordIdx] = useState(0);
  const [heroVisible, setHeroVisible] = useState(true);

  useEffect(() => {
    const interval = setInterval(() => {
      setHeroVisible(false);
      setTimeout(() => {
        setHeroWordIdx(i => (i + 1) % HERO_WORDS.length);
        setHeroVisible(true);
      }, 350);
    }, 2500);
    return () => clearInterval(interval);
  }, []);

  const {
    publicProjects, // Keep for stats
    recommendedProjects,
    newProjects,
    endingProjects,
    executingProjects,
    isLoading,
    fetchHomeProjects,
    fetchPublicProjects
  } = usePublicProjectStore();

  useEffect(() => {
    fetchHomeProjects();
    fetchPublicProjects(); // To get total count and sum for stats
  }, [fetchHomeProjects, fetchPublicProjects]);

  const handleCreateProject = () => createWithGuard();

  const recommendedMain = recommendedProjects[0] || null;
  const recommendedList = recommendedProjects.slice(1, 4);
  const hotProjects = endingProjects.map(p => ({ ...p, isHot: true }));
  const newProjectsList = newProjects.map(p => ({ ...p, isNew: true }));

  return (
    <div className="min-h-screen bg-gray-50/50 font-sans text-gray-900 pb-20">
      <section className="relative pt-24 pb-32 lg:pt-32 lg:pb-40 overflow-hidden">
        <div
          className="absolute inset-0 w-full h-full bg-cover bg-center bg-no-repeat z-0"
          style={{
            backgroundImage: "url('/bg-home.png')",
            maskImage: 'linear-gradient(to bottom, black 80%, transparent 85%)',
            WebkitMaskImage: 'linear-gradient(to bottom, black 60%, transparent 100%)'
          }}
        ></div>

        <div className="container mx-auto px-4 md:px-8 max-w-7xl relative z-10">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-10 items-center">

            <div className="max-w-xl">
              <div className="inline-flex items-center gap-2 bg-white/80 backdrop-blur-sm px-4 py-1.5 rounded-full text-sm font-medium text-purple-600 mb-6 border border-white/50 shadow-sm">
                <Sparkles size={16} /> ผลงานพัฒนาระบบซอฟต์แวร์ของนักศึกษา
              </div>

              <h1 className="text-4xl md:text-5xl lg:text-6xl font-extrabold leading-tight mb-6 text-foreground">
                ลงทุน
                <span
                  className="text-transparent bg-clip-text bg-gradient-to-r from-pink-500 to-purple-600 inline-block transition-all duration-350"
                  style={{ opacity: heroVisible ? 1 : 0, transform: heroVisible ? 'translateY(0px)' : 'translateY(-10px)' }}
                >
                  {HERO_WORDS[heroWordIdx]}
                </span>
                <br />
                กับ <span className="text-transparent bg-clip-text bg-gradient-to-r from-pink-500 to-purple-600">FlyUp</span>
              </h1>

              <p className="text-gray-500 text-lg mb-8 leading-relaxed font-medium">
                เปิดตัวไอเดียของคุณ สร้างโปรเจกต์ซอฟต์แวร์ที่มีพลัง<br />
                บนแพลตฟอร์มระดมทุนสำหรับนักศึกษา
              </p>

              <div className="flex flex-wrap gap-4 items-center">
                {!hideCreateBtn ? (
                  <button
                    onClick={handleCreateProject}
                    disabled={isCreating}
                    className="bg-primary hover:bg-primary-hover text-white-foreground px-8 py-3 rounded-full font-medium transition-all shadow-lg shadow-primary/30 flex items-center gap-2 disabled:opacity-50 cursor-pointer"
                  >
                    {isCreating ? (
                      <>
                        <Loader2 size={18} className="animate-spin" />
                        กำลังสร้าง...
                      </>
                    ) : (
                      <>
                        สร้างโปรเจกต์ <ChevronRight size={18} />
                      </>
                    )}
                  </button>
                ) : authUser?.role === 'pioneer' ? (
                  <Link to="/dashboard" className="bg-primary hover:bg-primary-hover text-white-foreground px-8 py-3 rounded-full font-medium transition-all shadow-lg shadow-primary/30 flex items-center gap-2">
                    ไปที่โปรเจกต์ของฉัน <ChevronRight size={18} />
                  </Link>
                ) : null
                }
                <Link to="/projects" className="bg-background hover:bg-muted text-foreground px-8 py-3 rounded-full font-medium transition-colors border border-border shadow-sm inline-block">
                  สำรวจโปรเจกต์
                </Link>
              </div>
            </div>
            <div className="relative hidden md:block">
              <div
                className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[120%] h-[120%] opacity-50 z-0"
                style={{ background: "radial-gradient(circle, rgba(168,85,247,0.15) 0%, transparent 70%)" }}
              ></div>

              <img
                src="/flyup-mascot.png"
                alt="FlyUp Mascot"
                className="relative z-10 w-full max-w-[500px] mx-auto drop-shadow-2xl animate-pulse-slow"
              />
            </div>

          </div>
        </div>
      </section>

      {/* ── Recommended Section ── */}
      <section className="py-16 bg-white">
        <div className="container mx-auto px-4 md:px-8 max-w-7xl">
          <div className="flex justify-between items-end mb-8">
            <div>
              <h2 className="text-2xl font-bold mb-1">โปรเจกต์แนะนำ</h2>
              <p className="text-sm text-gray-500">ค้นพบโปรเจกต์ที่กำลังระดมทุน</p>
            </div>
            <Link to="/projects" className="text-purple-600 text-sm font-medium hover:underline flex items-center">
              ดูทั้งหมด <ChevronRight size={16} />
            </Link>
          </div>

          {isLoading ? (
            <div className="flex items-center justify-center py-20">
              <Loader2 size={32} className="animate-spin text-primary" />
            </div>
          ) : recommendedMain ? (
            <div className={`grid gap-8 ${recommendedList.length > 0 ? 'grid-cols-1 lg:grid-cols-3' : 'grid-cols-1 max-w-2xl'}`}>
              <Link to={`/projects/${recommendedMain.slug || recommendedMain.id}`} className="lg:col-span-2 cursor-pointer group">
                <div className="bg-gray-100 rounded-3xl overflow-hidden relative h-[300px] md:h-[400px] mb-4">
                  <img src={recommendedMain.thumbnail_url || PLACEHOLDER_IMG} alt={recommendedMain.title} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700" />
                </div>
                <h3 className="text-2xl font-bold mb-2">{recommendedMain.title}</h3>
                <p className="text-gray-500 mb-4">{recommendedMain.description || 'ยังไม่มีรายละเอียด'}</p>

                <div className="w-full h-2 bg-gray-100 rounded-full mb-3">
                  <div className="h-full bg-gradient-to-r from-pink-500 to-purple-600 rounded-full" style={{ width: `${getProgress(recommendedMain)}%` }}></div>
                </div>

                <div className="flex gap-6 items-center text-sm">
                  <span className="font-bold text-lg">฿{(recommendedMain.current_funding ?? 0).toLocaleString()}</span>
                  <span className="text-gray-500">ระดมทุนแล้ว {getProgress(recommendedMain)}%</span>
                  <span className="text-gray-500 flex items-center gap-1.5">
                    <Clock size={16} className="text-gray-400" /> {getDaysLeft(recommendedMain)} วัน
                  </span>
                </div>
              </Link>

              <div className="flex flex-col gap-4">
                {recommendedList.map(item => (
                  <Link
                    key={item.id}
                    to={`/projects/${item.slug || item.id}`}
                    className="flex gap-4 p-3 rounded-2xl hover:bg-gray-50 transition-colors cursor-pointer border border-transparent hover:border-gray-100"
                  >
                    <img src={item.thumbnail_url || PLACEHOLDER_IMG} alt={item.title} className="w-24 h-24 rounded-xl object-cover" />
                    <div className="flex-1 py-1">
                      <h4 className="font-bold mb-1">{item.title}</h4>
                      <p className="text-xs text-gray-500 mb-2">{item.description || 'ยังไม่มีรายละเอียด'}</p>
                      <div className="w-full h-1.5 bg-gray-100 rounded-full mb-2 overflow-hidden">
                        <div
                          className="h-full bg-gradient-to-r from-pink-500 to-purple-600 rounded-full transition-all"
                          style={{ width: `${getProgress(item)}%` }}
                        />
                      </div>
                      <div className="flex justify-between items-center text-xs font-medium">
                        <span>฿{(item.current_funding ?? 0).toLocaleString()}</span>
                        <span className="text-gray-500">{getProgress(item)}%</span>
                        <span className="text-gray-500 flex items-center gap-1">
                          <Clock size={14} className="text-gray-400" /> {getDaysLeft(item)} วัน
                        </span>
                      </div>
                    </div>
                  </Link>
                ))}
              </div>
            </div>
          ) : (
            <p className="text-center text-muted-foreground py-12">ยังไม่มีโปรเจกต์</p>
          )}
        </div>
      </section>

      {/* ── Hot Projects ── */}
      {hotProjects.length > 0 && (
        <section className="py-16">
          <div className="container mx-auto px-4 md:px-8 max-w-7xl">
            <div className="flex justify-between items-end mb-8">
              <div>
                <h2 className="text-2xl font-bold mb-1 flex items-center gap-2">ใกล้สำเร็จแล้ว! <Flame className="text-orange-500" /></h2>
                <p className="text-sm text-gray-500">โปรเจกต์เหล่านี้เกือบถึงเป้าหมายระดมทุนแล้ว อย่าพลาด!</p>
              </div>
              <Link to="/projects" className="text-purple-600 text-sm font-medium hover:underline flex items-center">
                ดูทั้งหมด <ChevronRight size={16} />
              </Link>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {hotProjects.map(project => <ProjectCard key={project.id} project={project} />)}
            </div>
          </div>
        </section>
      )}

      {/* ── New Projects ── */}
      <section className="py-16 bg-white">
        <div className="container mx-auto px-4 md:px-8 max-w-7xl">
          <div className="flex justify-between items-end mb-8">
            <h2 className="text-2xl font-bold mb-1">โปรเจกต์มาใหม่</h2>
            <Link to="/projects" className="text-purple-600 text-sm font-medium hover:underline flex items-center">
              ดูทั้งหมด <ChevronRight size={16} />
            </Link>
          </div>
          {newProjectsList.length > 0 ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {newProjectsList.map(project => <ProjectCard key={project.id} project={project} />)}
            </div>
          ) : (
            <p className="text-center text-muted-foreground py-8">ยังไม่มีโปรเจกต์ใหม่</p>
          )}
        </div>
      </section>

      {/* ── Executing / Completed Projects ── */}
      {executingProjects.length > 0 && (
        <section className="py-16">
          <div className="container mx-auto px-4 md:px-8 max-w-7xl">
            <div className="flex justify-between items-end mb-8">
              <div>
                <h2 className="text-2xl font-bold mb-1">โปรเจกต์กำลังดำเนินการ</h2>
                <p className="text-sm text-muted-foreground">โปรเจกต์ที่ระดมทุนสำเร็จและอยู่ในระหว่างพัฒนา</p>
              </div>
              <Link to="/projects" className="text-purple-600 text-sm font-medium hover:underline flex items-center">
                ดูทั้งหมด <ChevronRight size={16} />
              </Link>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {executingProjects.map(project => <ProjectCard key={project.id} project={project} />)}
            </div>
          </div>
        </section>
      )}

      {/* ── Stats ── */}
      <section className="py-20 bg-card">
        <div className="container mx-auto px-4 max-w-5xl">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8 text-center">
            {[
              { icon: Rocket, label: 'โปรเจกต์ที่ได้รับทุน', value: `${publicProjects.length}+` },
              { icon: TrendingUp, label: 'ยอดระดมทุนรวม', value: `฿${publicProjects.reduce((sum, p) => sum + p.current_funding, 0).toLocaleString()}` },
              { icon: Users, label: 'ผู้สนับสนุนที่ใช้งาน', value: '—' },
              { icon: ShieldCheck, label: 'Milestone ที่ผ่าน', value: '—' },
            ].map((stat, i) => {
              const Icon = stat.icon;
              return (
                <div key={i} className="flex flex-col items-center group cursor-pointer">
                  <div className="bg-primary-light p-4 rounded-2xl text-primary mb-4 transition-all duration-300 ease-out group-hover:-translate-y-2 group-hover:shadow-lg">
                    <Icon size={28} strokeWidth={1.5} className="transition-transform duration-300 group-hover:scale-110" />
                  </div>
                  <h3 className="text-3xl font-black mb-2 text-foreground tracking-tight">{stat.value}</h3>
                  <p className="text-sm text-muted-foreground font-medium">{stat.label}</p>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* ── How It Works ── */}
      <section className="py-24 bg-card">
        <div className="container mx-auto px-4 md:px-8 max-w-6xl">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-16 items-center">
            <div className="text-center md:text-left">
              <h2 className="text-4xl md:text-6xl font-black leading-tight text-foreground">
                FLYUP<br />ทำงานอย่างไร
              </h2>
            </div>

            <div className="flex flex-col gap-10">
              <div className="flex gap-6 items-start group cursor-pointer">
                <div className="text-foreground bg-background p-4 rounded-2xl transition-all duration-300 ease-out group-hover:-translate-y-2 group-hover:bg-primary-light group-hover:shadow-md">
                  <SquarePen size={28} strokeWidth={1.5} className="transition-all duration-300 group-hover:scale-110 group-hover:text-primary" />
                </div>
                <div className="transition-transform duration-300 ease-out group-hover:translate-x-2 pt-1">
                  <h4 className="text-xl font-bold mb-2 text-foreground">สร้างโปรเจกต์</h4>
                  <p className="text-muted-foreground text-base leading-relaxed">นักศึกษาโปรเจกต์ซอฟต์แวร์พร้อม Milestone และเป้าหมายระดมทุน</p>
                </div>
              </div>

              <div className="flex gap-6 items-start group cursor-pointer">
                <div className="text-foreground bg-background p-4 rounded-2xl transition-all duration-300 ease-out group-hover:-translate-y-2 group-hover:bg-primary-light group-hover:shadow-md">
                  <Heart size={28} strokeWidth={1.5} className="transition-all duration-300 group-hover:scale-110 group-hover:text-primary" />
                </div>
                <div className="transition-transform duration-300 ease-out group-hover:translate-x-2 pt-1">
                  <h4 className="text-xl font-bold mb-2 text-foreground">ร่วมสนับสนุน</h4>
                  <p className="text-muted-foreground text-base leading-relaxed">ผู้สนับสนุนเลือกตกลงทุนในโปรเจกต์ที่สนใจ เงินถูกเก็บอย่างปลอดภัย</p>
                </div>
              </div>

              <div className="flex gap-6 items-start group cursor-pointer">
                <div className="text-foreground bg-background p-4 rounded-2xl transition-all duration-300 ease-out group-hover:-translate-y-2 group-hover:bg-primary-light group-hover:shadow-md">
                  <ListChecks size={28} strokeWidth={1.5} className="transition-all duration-300 group-hover:scale-110 group-hover:text-primary" />
                </div>
                <div className="transition-transform duration-300 ease-out group-hover:translate-x-2 pt-1">
                  <h4 className="text-xl font-bold mb-2 text-foreground">ติดตาม & โหวต</h4>
                  <p className="text-muted-foreground text-base leading-relaxed">ตรวจสอบความคืบหน้าผ่านการประชุมและโหวตก่อนปล่อยเงินทุน</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

    </div>
  );
};

export default Home;