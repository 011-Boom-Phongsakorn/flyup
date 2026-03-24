import { Link } from "react-router";
import { Search, Plus, SlidersHorizontal, ChevronDown, Eye, Edit3, Trash2 } from "lucide-react";

// Mock Data to match the image exactly
const mockProjects = [
  {
    id: 1,
    title: "UniTrack",
    statusText: "กำลังระดมทุน",
    statusType: "funding", // purple bg
    category: "EdTech",
    description: "ระบบติดตามผลการเรียนอัจฉริยะสำหรับมหาวิทยาลัย รวมตารางเรียน GPA คำนวณ และแจ้งเตือนงาน",
    raised: "36,000",
    goal: "50,000",
    backers: 48,
    progress: 72,
    milestoneText: "Milestone 2/4: Phase 2: เปิดตัว Beta — กำลังดำเนินการ",
    hasEdit: true,
    hasMilestone: true,
    hasDelete: false
  },
  {
    id: 2,
    title: "StudyBuddy",
    statusText: "รอการตรวจสอบ",
    statusType: "pending", // gray bg
    category: "Social",
    description: "แอปจับคู่เพื่อนเรียนตามวิชาและสไตล์การเรียน รองรับทั้งออนไลน์และออฟไลน์",
    hasEdit: false,
    hasMilestone: false,
    hasDelete: false
  },
  {
    id: 3,
    title: "GreenCampus",
    statusText: "เสร็จสิ้น",
    statusType: "completed", // purple bg
    category: "GreenTech",
    description: "แพลตฟอร์มจัดการขยะรีไซเคิลในมหาวิทยาลัย พร้อมระบบ Point Reward",
    completedText: "ระดมทุนครบ ฿25,000 — ส่งมอบเรียบร้อย",
    hasEdit: false,
    hasMilestone: false,
    hasDelete: false
  },
  {
    id: 4,
    title: "CampusRide",
    statusText: "ถูกระงับ",
    statusType: "suspended", // red bg
    category: "Transportation",
    description: "แอปแชร์รถระหว่างนักศึกษาเพื่อประหยัดค่าเดินทางและลดมลพิษ",
    warningText: "โปรเจกต์ถูกระงับ กรุณาติดต่อทีมสนับสนุน",
    hasEdit: false,
    hasMilestone: false,
    hasDelete: false
  },
  {
    id: 5,
    title: "QuickBite",
    statusText: "แบบร่าง",
    statusType: "draft", // white bg, border
    category: "FoodTech",
    description: "ระบบสั่งอาหารล่วงหน้าในโรงอาหารมหาวิทยาลัย ลดเวลาต่อคิว",
    hasEdit: true,
    hasMilestone: false,
    hasDelete: true
  }
];

const MyProjects = () => {
  return (
    <div className="min-h-screen bg-[#F8F9FA] pb-[100px] pt-[40px] px-[20px] font-kanit">
      <div className="max-w-[1000px] mx-auto">
        
        {/* Header Section */}
        <div className="flex justify-between items-center mb-[24px]">
          <h1 className="text-[24px] font-bold text-foreground">โปรเจกต์ของฉัน</h1>
          <Link 
            to="/pioneer/create" // or /create depending on actual routing
            className="bg-primary hover:bg-primary-hover text-white px-[16px] py-[10px] rounded-[8px] flex items-center gap-[8px] text-[14px] font-medium transition-colors"
          >
            <Plus size={18} /> สร้างโปรเจกต์ใหม่
          </Link>
        </div>

        {/* Search & Filter Row */}
        <div className="flex flex-col md:flex-row gap-[16px] mb-[24px]">
          <div className="flex-1 relative">
            <div className="absolute inset-y-0 left-[16px] flex items-center pointer-events-none text-muted-foreground">
              <Search size={18} />
            </div>
            <input 
              type="text" 
              placeholder="ค้นหาชื่อโปรเจกต์..."
              className="w-full pl-[44px] pr-[16px] py-[10px] bg-white border border-border rounded-[100px] text-[14px] outline-none focus:border-primary transition-colors h-[44px]"
            />
          </div>
          <button className="flex items-center justify-between gap-[16px] bg-white border border-border px-[16px] py-[10px] rounded-[100px] text-[14px] font-medium text-foreground hover:bg-gray-50 h-[44px] min-w-[140px]">
            <div className="flex items-center gap-[8px]">
              <SlidersHorizontal size={16} />
              <span>ทั้งหมด</span>
            </div>
            <ChevronDown size={16} />
          </button>
        </div>

        {/* Stats Row */}
        <div className="grid grid-cols-2 lg:grid-cols-5 gap-[16px] mb-[32px]">
            {[
                { count: 1, label: "กำลังระดมทุน" },
                { count: 1, label: "รอการตรวจสอบ" },
                { count: 1, label: "แบบร่าง" },
                { count: 1, label: "เสร็จสิ้น" },
                { count: 1, label: "ถูกระงับ" },
            ].map((stat, idx) => (
                <div key={idx} className="bg-white border border-border rounded-[12px] p-[16px] flex flex-col items-center justify-center text-center shadow-sm">
                    <span className="text-[24px] font-bold text-foreground leading-none mb-[4px]">{stat.count}</span>
                    <span className="text-[13px] text-muted-foreground font-medium">{stat.label}</span>
                </div>
            ))}
        </div>

        {/* Project List */}
        <div className="flex flex-col gap-[16px]">
          {mockProjects.map((project) => (
            <div key={project.id} className="bg-white border border-border rounded-[16px] p-[20px] flex gap-[20px] shadow-sm hover:shadow-md transition-shadow">
              
              {/* Thumbnail Placeholder */}
              <div className="w-[64px] h-[64px] bg-[#E1E4E8] rounded-[12px] shrink-0 mt-[4px]"></div>

              {/* Content */}
              <div className="flex-1 flex flex-col">
                <div className="flex flex-col lg:flex-row justify-between items-start gap-[16px]">
                  
                  {/* Left Info */}
                  <div className="flex flex-col gap-[8px] flex-1">
                    <div className="flex items-center gap-[8px] flex-wrap">
                      <h3 className="text-[16px] font-bold text-foreground">{project.title}</h3>
                      
                      {/* Status Badge */}
                      <span className={`px-[10px] py-[2px] rounded-full text-[11px] font-medium ${
                        project.statusType === 'funding' || project.statusType === 'completed' ? 'bg-[#8B5CF6] text-white' : 
                        project.statusType === 'suspended' ? 'bg-[#EF4444] text-white' : 
                        project.statusType === 'pending' ? 'bg-[#F1F3F5] text-[#495057]' : 
                        'bg-white border border-border text-[#495057]' // draft
                      }`}>
                        {project.statusText}
                      </span>
                      
                      {/* Category Badge */}
                      <span className="px-[10px] py-[2px] rounded-full text-[11px] font-medium bg-white border border-border text-[#495057]">
                        {project.category}
                      </span>
                    </div>
                    
                    <p className="text-[13px] text-muted-foreground line-clamp-2 lg:line-clamp-1">
                      {project.description}
                    </p>

                    {/* Funding Progress (Only for funding project) */}
                    {project.statusType === 'funding' && (
                      <div className="flex flex-col gap-[6px] mt-[4px] max-w-[400px]">
                        <div className="flex items-center gap-[16px] text-[12px] font-medium text-muted-foreground">
                          <span>{project.raised} / {project.goal}</span>
                          <span>{project.backers} Booster</span>
                        </div>
                        <div className="h-[6px] w-full bg-[#E9D5FF] rounded-full overflow-hidden">
                          <div className="h-full bg-[#8B5CF6] rounded-full" style={{ width: `${project.progress}%` }}></div>
                        </div>
                        <span className="text-[11px] text-[#8B5CF6] font-medium mt-[2px]">
                          {project.milestoneText}
                        </span>
                      </div>
                    )}

                    {/* Completed State */}
                    {project.statusType === 'completed' && project.completedText && (
                      <div className="flex items-center gap-[6px] mt-[4px]">
                        <div className="w-[14px] h-[14px] bg-[#10B981] rounded-sm flex items-center justify-center text-white shrink-0">
                          <svg xmlns="http://www.w3.org/2000/svg" width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"><polyline points="20 6 9 17 4 12"></polyline></svg>
                        </div>
                        <span className="text-[11px] text-[#8B5CF6] font-medium">{project.completedText}</span>
                      </div>
                    )}

                    {/* Suspended State */}
                    {project.statusType === 'suspended' && project.warningText && (
                      <div className="flex items-center gap-[6px] mt-[4px]">
                        <div className="text-[#F59E0B] shrink-0 mt-[1px]">
                          <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="m21.73 18-8-14a2 2 0 0 0-3.48 0l-8 14A2 2 0 0 0 4 21h16a2 2 0 0 0 1.73-3Z"></path><line x1="12" y1="9" x2="12" y2="13"></line><line x1="12" y1="17" x2="12.01" y2="17"></line></svg>
                        </div>
                        <span className="text-[12px] text-[#EF4444] font-medium">{project.warningText}</span>
                      </div>
                    )}
                  </div>

                  {/* Right Actions */}
                  <div className="flex items-center gap-[8px] shrink-0 mt-[10px] lg:mt-0">
                    <button className="flex items-center justify-center gap-[6px] px-[16px] py-[8px] bg-[#F1F3F5] hover:bg-[#E9ECEF] transition-colors rounded-[8px] text-[13px] font-medium text-foreground">
                      <Eye size={16} /> ดู
                    </button>
                    
                    {project.hasEdit && (
                      <button className="flex items-center justify-center gap-[6px] px-[16px] py-[8px] bg-[#F1F3F5] hover:bg-[#E9ECEF] transition-colors rounded-[8px] text-[13px] font-medium text-foreground">
                        <Edit3 size={16} /> แก้ไข
                      </button>
                    )}
                    
                    {project.hasMilestone && (
                      <button className="flex items-center justify-center gap-[6px] px-[16px] py-[8px] bg-[#8B5CF6] hover:bg-[#7C3AED] transition-colors rounded-[8px] text-[13px] font-medium text-white shadow-sm">
                         <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M12 2v20"/><path d="M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6"/></svg>
                         Milestone
                      </button>
                    )}

                    {project.hasDelete && (
                      <button className="flex flex-col items-center justify-center w-[36px] h-[36px] text-[#EF4444] hover:bg-red-50 rounded-[8px] transition-colors ml-[4px]">
                        <Trash2 size={18} />
                      </button>
                    )}
                  </div>

                </div>
              </div>

            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default MyProjects;