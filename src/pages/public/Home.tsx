import { Link } from 'react-router';
import {
  ChevronRight,
  Flame,
  Sparkles,
  Rocket,
  SquarePen,
  Heart,
<<<<<<< HEAD
  ListChecks,
  Clock,
  TrendingUp,
  Users,
  ShieldCheck
=======
  ListChecks
>>>>>>> 0cac18849156581f83a394ec17ad8ee4cd12fabb
} from 'lucide-react';

const recommendedMain = {
  id: 1,
  title: 'UniTrack',
  description: 'แอปนำทางในมหาวิทยาลัยอัจฉริยะ',
<<<<<<< HEAD
  image: 'https://images.unsplash.com/photo-1524661135-423995f22d0b?auto=format&fit=crop&q=80&w=1200',
=======
  image: 'https://images.unsplash.com/photo-1551288049-bebda4e38f71?auto=format&fit=crop&q=80&w=1200',
>>>>>>> 0cac18849156581f83a394ec17ad8ee4cd12fabb
  category: 'แอปมือถือ',
  progress: 72,
  raised: 36000,
  daysLeft: 30,
};

const recommendedList = [
<<<<<<< HEAD
  { 
    id: 2, 
    title: 'radar of B2', 
    description: 'software เรดาร์สำหรับ B2 Bomber', 
    image: 'https://images.unsplash.com/photo-1540962351504-03099e0a754b?auto=format&fit=crop&q=80&w=400',
    progress: 82, 
    raised: 56000, 
    daysLeft: 10 
  },
  { 
    id: 3, 
    title: 'หมวกนักบิน F35', 
    description: 'หมวกนักบินอัจฉริยะ', 
    image: 'https://images.unsplash.com/photo-1517976487492-5750f3195933?auto=format&fit=crop&q=80&w=400',
    progress: 72, 
    raised: 36000, 
    daysLeft: 30 
  },
  { 
    id: 4, 
    title: 'CodeReview AI', 
    description: 'เครื่องมือรีวิว code โดย AI', 
    image: 'https://images.unsplash.com/photo-1555066931-4365d14bab8c?auto=format&fit=crop&q=80&w=400',
    progress: 24, 
    raised: 24000, 
    daysLeft: 25 
  },
];

const hotProjects = [
  { 
    id: 5, 
    title: 'Terminator T-X', 
    description: 'หุ่นยนต์ตามหนังของ terminator สร้างเพื่อยึดครองโลก', 
    image: 'https://images.unsplash.com/photo-1535378917042-10a22c95931a?auto=format&fit=crop&q=80&w=800',
    category: 'IOT', 
    progress: 83, 
    raised: 30000, 
    daysLeft: 15, 
    isHot: true 
  },
  { 
    id: 6, 
    title: 'Toi-Nee Human droid', 
    description: 'หุ่นยนต์สั่งอาหาร ร้องลิเก version human droid', 
    image: 'https://images.unsplash.com/photo-1485827404703-89b55fcc595e?auto=format&fit=crop&q=80&w=800',
    category: 'IOT', 
    progress: 72, 
    raised: 50000, 
    daysLeft: 25, 
    isHot: true 
  },
  { 
    id: 7, 
    title: 'Cybersecurity EdTech', 
    description: 'เรียนรู้การป้องกันภัยไซเบอร์ผ่านการจำลองสถานการณ์จริง', 
    image: 'https://images.unsplash.com/photo-1526374965328-7f61d4dc18c5?auto=format&fit=crop&q=80&w=800',
    category: 'Cybersecurity', 
    progress: 92, 
    raised: 10000, 
    daysLeft: 10, 
    isHot: true 
  },
];

const newProjects = [
  { 
    id: 8, 
    title: 'UniTrack', 
    description: 'แอปนำทางในมหาวิทยาลัยอัจฉริยะสำหรับนักศึกษา', 
    image: 'https://images.unsplash.com/photo-1498050108023-c5249f4df085?auto=format&fit=crop&q=80&w=800',
    category: 'แอปมือถือ', 
    progress: 10,
    raised: 5000, 
    daysLeft: 55, 
    isNew: true 
  },
  { 
    id: 9, 
    title: 'Arduino Drone', 
    description: 'Drone FPV DIY ซื้อง่าย งานไว', 
    image: 'https://images.unsplash.com/photo-1508614589041-895b88991e3e?auto=format&fit=crop&q=80&w=800',
    category: 'IOT', 
    progress: 15, 
    raised: 7000, 
    daysLeft: 25, 
    isNew: true 
  },
  { 
    id: 10, 
    title: 'Nightingale', 
    description: 'เป็นเกมแนว PVE Open-world Survival Crafting', 
    image: 'https://images.unsplash.com/photo-1542751371-adc38448a05e?auto=format&fit=crop&q=80&w=800',
    category: 'Game', 
    progress: 5, 
    raised: 8000, 
    daysLeft: 20, 
    isNew: true 
  },
=======
  { id: 2, title: 'CodeReview AI', description: 'เครื่องมือรีวิว code โดย AI', image: 'https://images.unsplash.com/photo-1555066931-4365d14bab8c?auto=format&fit=crop&q=80&w=400', progress: 72, raised: 35000, daysLeft: 30 },
  { id: 3, title: 'CodeReview AI', description: 'เครื่องมือรีวิว code โดย AI', image: 'https://images.unsplash.com/photo-1542831371-29b0f74f9713?auto=format&fit=crop&q=80&w=400', progress: 72, raised: 35000, daysLeft: 30 },
  { id: 4, title: 'CodeReview AI', description: 'เครื่องมือรีวิว code โดย AI', image: 'https://images.unsplash.com/photo-1550439062-609e1531270e?auto=format&fit=crop&q=80&w=400', progress: 72, raised: 35000, daysLeft: 30 },
];

const hotProjects = [
  { id: 5, title: 'DormMate', description: 'แอปหาเพื่อนร่วมหอพักมหาวิทยาลัย', image: 'https://images.unsplash.com/photo-1555854877-bab0e564b8d5?auto=format&fit=crop&q=80&w=800', category: 'แอปมือถือ', progress: 72, raised: 21000, daysLeft: 15, isHot: true },
  { id: 6, title: 'DormMate', description: 'แอปหาเพื่อนร่วมหอพักมหาวิทยาลัย', image: 'https://images.unsplash.com/photo-1555854877-bab0e564b8d5?auto=format&fit=crop&q=80&w=800', category: 'แอปมือถือ', progress: 72, raised: 21000, daysLeft: 15, isHot: true },
  { id: 7, title: 'DormMate', description: 'แอปหาเพื่อนร่วมหอพักมหาวิทยาลัย', image: 'https://images.unsplash.com/photo-1555854877-bab0e564b8d5?auto=format&fit=crop&q=80&w=800', category: 'แอปมือถือ', progress: 72, raised: 21000, daysLeft: 15, isHot: true },
];

const newProjects = [
  { id: 8, title: 'UniTrack', description: 'แอปนำทางในมหาวิทยาลัยอัจฉริยะสำหรับนักศึกษา', image: 'https://images.unsplash.com/photo-1498050108023-c5249f4df085?auto=format&fit=crop&q=80&w=800', category: 'แอปมือถือ', progress: 10, raised: 1000, daysLeft: 55, isNew: true },
  { id: 9, title: 'UniTrack', description: 'แอปนำทางในมหาวิทยาลัยอัจฉริยะสำหรับนักศึกษา', image: 'https://images.unsplash.com/photo-1498050108023-c5249f4df085?auto=format&fit=crop&q=80&w=800', category: 'แอปมือถือ', progress: 10, raised: 1000, daysLeft: 55, isNew: true },
  { id: 10, title: 'UniTrack', description: 'แอปนำทางในมหาวิทยาลัยอัจฉริยะสำหรับนักศึกษา', image: 'https://images.unsplash.com/photo-1498050108023-c5249f4df085?auto=format&fit=crop&q=80&w=800', category: 'แอปมือถือ', progress: 10, raised: 1000, daysLeft: 55, isNew: true },
>>>>>>> 0cac18849156581f83a394ec17ad8ee4cd12fabb
];

const ProjectCard = ({ project }: { project: any }) => (
  <div className="bg-white rounded-2xl overflow-hidden shadow-sm border border-gray-100 hover:shadow-lg transition-all cursor-pointer group flex flex-col">
    <div className="relative h-48 w-full overflow-hidden bg-gray-100">
      <img src={project.image} alt={project.title} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
      <div className="absolute top-3 right-3 flex gap-2">
        {project.isHot && (
          <div className="bg-red-500 text-white px-2.5 py-1 rounded-full text-xs font-bold flex items-center gap-1 shadow-md">
            <Flame size={14} fill="currentColor" /> {project.progress}%
          </div>
        )}
        {project.isNew && (
          <div className="bg-purple-500 text-white px-2.5 py-1 rounded-full text-xs font-bold flex items-center gap-1 shadow-md">
            <Sparkles size={14} fill="currentColor" /> ใหม่
          </div>
        )}
      </div>
    </div>
    <div className="p-4 flex flex-col flex-1">
      <div className="flex justify-between items-start gap-2 mb-1">
        <h3 className="text-lg font-bold line-clamp-1 flex-1">{project.title}</h3>
        <span className="text-[10px] font-medium px-2.5 py-0.5 bg-white border border-gray-200 rounded-full text-gray-400 whitespace-nowrap">
          {project.category}
        </span>
      </div>
      
      <p className="text-xs text-gray-500 line-clamp-1 mb-4">{project.description}</p>

      <div className="w-full h-1.5 bg-gray-100 rounded-full mb-3 overflow-hidden mt-auto">
        <div className="h-full bg-purple-600 rounded-full" style={{ width: `${project.progress}%` }}></div>
      </div>
      
      <div className="flex justify-between items-center pt-1">
        <span className="text-sm font-bold">{project.raised.toLocaleString()} ฿</span>
        <span className="text-xs text-gray-500">{project.daysLeft} วัน</span>
      </div>
    </div>
  </div>
);

const Home = () => {
  return (
    <div className="min-h-screen bg-gray-50/50 font-sans text-gray-900 pb-20">
      <section className="relative pt-24 pb-32 lg:pt-32 lg:pb-40 overflow-hidden">
        <div
          className="absolute inset-0 w-full h-full bg-cover bg-center bg-no-repeat z-0"
          style={{
            backgroundImage: "url('/bg-home.png')",
<<<<<<< HEAD
            maskImage: 'linear-gradient(to bottom, black 80%, transparent 85%)',
=======
            maskImage: 'linear-gradient(to bottom, black 60%, transparent 100%)',
>>>>>>> 0cac18849156581f83a394ec17ad8ee4cd12fabb
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
                ลงทุนโปรเจกต์ที่ใช่ <br />
                กับ <span className="text-transparent bg-clip-text bg-gradient-to-r from-pink-500 to-purple-600">FlyUp</span>
              </h1>
              
              <p className="text-gray-500 text-lg mb-8 leading-relaxed font-medium">
                เปิดตัวไอเดียของคุณ สร้างโปรเจกต์ซอฟต์แวร์ที่มีพลัง<br/>
                บนแพลตฟอร์มระดมทุนสำหรับนักศึกษา
              </p>

              <div className="flex flex-wrap gap-4 items-center">
<<<<<<< HEAD
                <button className="bg-primary hover:bg-primary-hover text-white-foreground px-8 py-3 rounded-full font-medium transition-all shadow-lg shadow-primary/30 flex items-center gap-2">
                  สร้างโปรเจกต์ <ChevronRight size={18} />
                </button>
                
                <Link to="/projects" className="bg-background hover:bg-muted text-foreground px-8 py-3 rounded-full font-medium transition-colors border border-border shadow-sm inline-block">
=======
                <button className="bg-gradient-to-r from-[#7C3AED] to-[#A855F7] hover:opacity-90 text-white px-8 py-3 rounded-full font-medium transition-all shadow-lg shadow-purple-200 flex items-center gap-2">
                  สร้างโปรเจกต์ <ChevronRight size={18} />
                </button>
                <Link to="/projects" className="bg-[#F8F9FA] hover:bg-gray-100 text-gray-900 px-8 py-3 rounded-full font-medium transition-colors border border-gray-100 shadow-sm inline-block">
>>>>>>> 0cac18849156581f83a394ec17ad8ee4cd12fabb
                  ค้นหาโครงการ
                </Link>
              </div>
            </div>
            <div className="relative hidden md:block">
              <div
                className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[120%] h-[120%] opacity-50 z-0"
                style={{ background: "radial-gradient(circle, rgba(168,85,247,0.15) 0%, transparent 70%)" }}
              ></div>
              
              <img
<<<<<<< HEAD
                src="/flyup-mascot.png"
=======
                src="/logo-flyup.png"
>>>>>>> 0cac18849156581f83a394ec17ad8ee4cd12fabb
                alt="FlyUp Mascot"
                className="relative z-10 w-full max-w-[500px] mx-auto drop-shadow-2xl animate-pulse-slow"
              />
            </div>

          </div>
        </div>
      </section>

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

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            <div className="lg:col-span-2 cursor-pointer group">
              <div className="bg-gray-100 rounded-3xl overflow-hidden relative h-[300px] md:h-[400px] mb-4">
                <img src={recommendedMain.image} alt={recommendedMain.title} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700" />
              </div>
              <h3 className="text-2xl font-bold mb-2">{recommendedMain.title}</h3>
              <p className="text-gray-500 mb-4">{recommendedMain.description}</p>
              
              <div className="w-full h-2 bg-gray-100 rounded-full mb-3">
                <div className="h-full bg-gradient-to-r from-pink-500 to-purple-600 rounded-full" style={{ width: `${recommendedMain.progress}%` }}></div>
              </div>
              
              <div className="flex gap-6 items-center text-sm">
                <span className="font-bold text-lg">฿{recommendedMain.raised.toLocaleString()}</span>
                <span className="text-gray-500">ระดมทุนแล้ว {recommendedMain.progress}%</span>
<<<<<<< HEAD
                <span className="text-gray-500 flex items-center gap-1.5">
                  <Clock size={16} className="text-gray-400" /> {recommendedMain.daysLeft} วัน
                </span>
=======
                <span className="text-gray-500 flex items-center gap-1">🕒 {recommendedMain.daysLeft} วัน</span>
>>>>>>> 0cac18849156581f83a394ec17ad8ee4cd12fabb
              </div>
            </div>

            <div className="flex flex-col gap-4">
              {recommendedList.map(item => (
                <div key={item.id} className="flex gap-4 p-3 rounded-2xl hover:bg-gray-50 transition-colors cursor-pointer border border-transparent hover:border-gray-100">
                  <img src={item.image} alt={item.title} className="w-24 h-24 rounded-xl object-cover" />
                  <div className="flex-1 py-1">
                    <h4 className="font-bold mb-1">{item.title}</h4>
                    <p className="text-xs text-gray-500 mb-3">{item.description}</p>
                    <div className="flex justify-between items-center text-xs font-medium">
                      <span>฿{item.raised.toLocaleString()}</span>
                      <span className="text-gray-500">{item.progress}%</span>
<<<<<<< HEAD
                      <span className="text-gray-500 flex items-center gap-1">
                        <Clock size={14} className="text-gray-400" /> {item.daysLeft} วัน
                      </span>
=======
                      <span className="text-gray-500">🕒 {item.daysLeft} วัน</span>
>>>>>>> 0cac18849156581f83a394ec17ad8ee4cd12fabb
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      <section className="py-16">
        <div className="container mx-auto px-4 md:px-8 max-w-7xl">
          <div className="mb-8">
            <h2 className="text-2xl font-bold mb-1 flex items-center gap-2">ใกล้สำเร็จแล้ว! <Flame className="text-orange-500" /></h2>
            <p className="text-sm text-gray-500">โปรเจกต์เหล่านี้เกือบถึงเป้าหมายระดมทุนแล้ว อย่าพลาด!</p>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {hotProjects.map(project => <ProjectCard key={project.id} project={project} />)}
          </div>
        </div>
      </section>

      <section className="py-16 bg-white">
        <div className="container mx-auto px-4 md:px-8 max-w-7xl">
          <div className="flex justify-between items-end mb-8">
            <h2 className="text-2xl font-bold mb-1">โปรเจกต์มาใหม่</h2>
            <Link to="/projects" className="text-purple-600 text-sm font-medium hover:underline flex items-center">
              ดูทั้งหมด <ChevronRight size={16} />
            </Link>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {newProjects.map(project => <ProjectCard key={project.id} project={project} />)}
          </div>
        </div>
      </section>

<<<<<<< HEAD
      <section className="py-20 bg-card">
        <div className="container mx-auto px-4 max-w-5xl">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8 text-center">
            {[
              { icon: Rocket, label: 'โปรเจกต์ที่ได้รับทุน', value: '120+' },
              { icon: TrendingUp, label: 'ยอดระดมทุนรวม', value: '฿2.4M' },
              { icon: Users, label: 'ผู้สนับสนุนที่ใช้งาน', value: '3,200+' },
              { icon: ShieldCheck, label: 'Milestone ที่ผ่าน', value: '480+' },
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
=======
      <section className="py-20 bg-gray-50">
        <div className="container mx-auto px-4 max-w-5xl">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8 text-center">
            {[
              { label: 'โปรเจกต์ที่กำลังระดมทุน', value: '120+' },
              { label: 'ยอดรวมระดมทุน', value: '฿2.4M' },
              { label: 'ผู้สนับสนุนเข้าร่วม', value: '120+' },
              { label: 'โปรเจกต์ที่ทำสำเร็จ', value: '120+' },
            ].map((stat, i) => (
              <div key={i} className="flex flex-col items-center">
                <div className="bg-purple-100 p-4 rounded-2xl text-purple-600 mb-4"><Rocket size={24} /></div>
                <h3 className="text-3xl font-black mb-1">{stat.value}</h3>
                <p className="text-sm text-gray-500">{stat.label}</p>
              </div>
            ))}
>>>>>>> 0cac18849156581f83a394ec17ad8ee4cd12fabb
          </div>
        </div>
      </section>

<<<<<<< HEAD
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
=======
      <section className="py-24 bg-white">
        <div className="container mx-auto px-4 md:px-8 max-w-6xl">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-16 items-center">
            <div className="text-center md:text-left">
              <h2 className="text-4xl md:text-6xl font-black leading-tight">
                FLYUP<br/>ทำงานอย่างไร
              </h2>
            </div>
            <div className="flex flex-col gap-10">
              <div className="flex gap-6 items-start">
                <div className="text-gray-800 bg-gray-50 p-3 rounded-xl"><SquarePen size={28} strokeWidth={1.5} /></div>
                <div>
                  <h4 className="text-lg font-bold mb-1">สร้างโปรเจกต์</h4>
                  <p className="text-gray-500 text-sm">นักศึกษาโปรเจกต์ซอฟต์แวร์พร้อม Milestone และเป้าหมายระดมทุน</p>
                </div>
              </div>
              <div className="flex gap-6 items-start">
                <div className="text-gray-800 bg-gray-50 p-3 rounded-xl"><Heart size={28} strokeWidth={1.5} /></div>
                <div>
                  <h4 className="text-lg font-bold mb-1">ร่วมสนับสนุน</h4>
                  <p className="text-gray-500 text-sm">ผู้สนับสนุนเลือกตกลงทุนในโปรเจกต์ที่สนใจ เงินถูกเก็บอย่างปลอดภัย</p>
                </div>
              </div>
              <div className="flex gap-6 items-start">
                <div className="text-gray-800 bg-gray-50 p-3 rounded-xl"><ListChecks size={28} strokeWidth={1.5} /></div>
                <div>
                  <h4 className="text-lg font-bold mb-1">ติดตาม & โหวต</h4>
                  <p className="text-gray-500 text-sm">ตรวจสอบความคืบหน้าผ่านการประชุมและโหวตก่อนปล่อยเงินทุน</p>
>>>>>>> 0cac18849156581f83a394ec17ad8ee4cd12fabb
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

    </div>
  );
};

<<<<<<< HEAD
export default Home;
=======
export default Home;
>>>>>>> 0cac18849156581f83a394ec17ad8ee4cd12fabb
