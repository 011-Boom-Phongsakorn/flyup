import React from 'react';
import { Link } from 'react-router';
import {
  ChevronRight,
  Flame,
  Sparkles,
  Rocket,
  SquarePen,
  Heart,
  ListChecks
} from 'lucide-react';

// --- Mock Data สำหรับหน้า Home ---
const recommendedMain = {
  id: 1,
  title: 'UniTrack',
  description: 'แอปนำทางในมหาวิทยาลัยอัจฉริยะ',
  image: 'https://images.unsplash.com/photo-1551288049-bebda4e38f71?auto=format&fit=crop&q=80&w=1200',
  category: 'แอปมือถือ',
  progress: 72,
  raised: 36000,
  daysLeft: 30,
};

const recommendedList = [
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
];

// --- Component ย่อยสำหรับการ์ดโปรเจกต์ทั่วไป ---
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
      {/* ส่วนที่แก้: ย้าย Category มาไว้ข้างชื่อโปรเจกต์ */}
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

// --- Component หลักของหน้า Home ---
const Home = () => {
  return (
    <div className="min-h-screen bg-gray-50/50 font-sans text-gray-900 pb-20">
      
      {/* 1. Hero Section (แบนเนอร์ด้านบนสุด) */}
      <section className="relative pt-24 pb-32 lg:pt-32 lg:pb-40 overflow-hidden">
        
        {/* ส่วนพื้นหลังที่ทำ Fade ด้านล่างให้เนียนไปกับ bg-background */}
        <div
          className="absolute inset-0 w-full h-full bg-cover bg-center bg-no-repeat z-0"
          style={{
            backgroundImage: "url('/bg-home.png')",
            maskImage: 'linear-gradient(to bottom, black 60%, transparent 100%)',
            WebkitMaskImage: 'linear-gradient(to bottom, black 60%, transparent 100%)'
          }}
        ></div>

        <div className="container mx-auto px-4 md:px-8 max-w-7xl relative z-10">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-10 items-center">
            
            {/* ฝั่งซ้าย: ข้อความและปุ่ม */}
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
                {/* แก้ไขปุ่ม: ใส่ Gradient ตามภาพ Figma */}
                <button className="bg-gradient-to-r from-[#7C3AED] to-[#A855F7] hover:opacity-90 text-white px-8 py-3 rounded-full font-medium transition-all shadow-lg shadow-purple-200 flex items-center gap-2">
                  สร้างโปรเจกต์ <ChevronRight size={18} />
                </button>
                <Link to="/projects" className="bg-[#F8F9FA] hover:bg-gray-100 text-gray-900 px-8 py-3 rounded-full font-medium transition-colors border border-gray-100 shadow-sm inline-block">
                  ค้นหาโครงการ
                </Link>
              </div>
            </div>

            {/* ฝั่งขวา: โซนรูปภาพ (ใส่ logo-flyup.png) */}
            <div className="relative hidden md:block">
              <div
                className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[120%] h-[120%] opacity-50 z-0"
                style={{ background: "radial-gradient(circle, rgba(168,85,247,0.15) 0%, transparent 70%)" }}
              ></div>
              
              <img
                src="/logo-flyup.png"
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
                <span className="text-gray-500 flex items-center gap-1">🕒 {recommendedMain.daysLeft} วัน</span>
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
                      <span className="text-gray-500">🕒 {item.daysLeft} วัน</span>
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
          </div>
        </div>
      </section>

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