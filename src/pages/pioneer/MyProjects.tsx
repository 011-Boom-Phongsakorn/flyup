import { useState, useMemo } from "react";
import { Link, useNavigate } from "react-router";
import { Search, Plus, SlidersHorizontal, ChevronDown, Eye, Edit3, Trash2 } from "lucide-react";

// ประเภทสถานะทั้งหมดที่เป็นไปได้
type StatusType = "funding" | "pending" | "draft" | "completed" | "suspended";

// Interface ของโปรเจกต์
interface MockProject {
  id: number;
  title: string;
  statusText: string;
  statusType: StatusType;
  category: string;
  description: string;
  raised?: string;
  goal?: string;
  backers?: number;
  progress?: number;
  milestoneText?: string;
  completedText?: string;
  warningText?: string;
  hasEdit: boolean;
  hasMilestone: boolean;
  hasDelete: boolean;
}

// Mock Data — จำลองข้อมูลโปรเจกต์ทั้งหมด
const mockProjects: MockProject[] = [
  {
    id: 1,
    title: "UniTrack",
    statusText: "กำลังระดมทุน",
    statusType: "funding",
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
    statusType: "pending",
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
    statusType: "completed",
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
    statusType: "suspended",
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
    statusType: "draft",
    category: "FoodTech",
    description: "ระบบสั่งอาหารล่วงหน้าในโรงอาหารมหาวิทยาลัย ลดเวลาต่อคิว",
    hasEdit: true,
    hasMilestone: false,
    hasDelete: true
  }
];

// แมป statusType กับ label ภาษาไทย
const statusLabels: { type: StatusType | "all"; label: string }[] = [
  { type: "funding", label: "กำลังระดมทุน" },
  { type: "pending", label: "รอการตรวจสอบ" },
  { type: "draft", label: "แบบร่าง" },
  { type: "completed", label: "เสร็จสิ้น" },
  { type: "suspended", label: "ถูกระงับ" },
];

const MyProjects = () => {
  const navigate = useNavigate();

  // State — คำค้นหาและตัวกรองสถานะ
  const [searchQuery, setSearchQuery] = useState("");
  const [activeFilter, setActiveFilter] = useState<StatusType | "all">("all");

  // นับจำนวนโปรเจกต์แต่ละสถานะ (คำนวณจาก mockProjects)
  const statusCounts = useMemo(() => {
    const counts: Record<StatusType, number> = {
      funding: 0, pending: 0, draft: 0, completed: 0, suspended: 0
    };
    mockProjects.forEach(p => counts[p.statusType]++);
    return counts;
  }, []);

  // กรองโปรเจกต์ตาม search + filter
  const filteredProjects = useMemo(() => {
    return mockProjects.filter(p => {
      // กรองจาก statusType (ถ้าไม่ใช่ "all")
      const matchesFilter = activeFilter === "all" || p.statusType === activeFilter;
      // กรองจากคำค้นหา (ชื่อ, หมวดหมู่, คำอธิบาย)
      const q = searchQuery.toLowerCase().trim();
      const matchesSearch = q === "" ||
        p.title.toLowerCase().includes(q) ||
        p.category.toLowerCase().includes(q) ||
        p.description.toLowerCase().includes(q);
      return matchesFilter && matchesSearch;
    });
  }, [searchQuery, activeFilter]);

  // กดดูโปรเจกต์ → ไปหน้า Preview
  const handleView = (id: number) => navigate(`/preview/${id}`);
  // กดแก้ไข → ไปหน้าสร้างโปรเจกต์ (Step-based)
  const handleEdit = (id: number) => navigate(`/pioneer/create/${id}`);

  return (
    <div className="min-h-screen bg-[#F8F9FA] pb-[100px] pt-[40px] px-[20px] font-kanit">
      <div className="max-w-[1000px] mx-auto">

        {/* ====== Header Section ====== */}
        <div className="flex justify-between items-center mb-[24px]">
          <h1 className="text-[24px] font-bold text-foreground">โปรเจกต์ของฉัน</h1>
          <Link
            to="/pioneer/create"
            className="bg-primary hover:bg-primary-hover text-white px-[16px] py-[10px] rounded-[8px] flex items-center gap-[8px] text-[14px] font-medium transition-colors"
          >
            <Plus size={18} /> สร้างโปรเจกต์ใหม่
          </Link>
        </div>

        {/* ====== Search & Filter Row ====== */}
        <div className="flex flex-col md:flex-row gap-[16px] mb-[24px]">
          {/* ช่องค้นหา — ค้นได้จริง */}
          <div className="flex-1 relative">
            <div className="absolute inset-y-0 left-[16px] flex items-center pointer-events-none text-muted-foreground">
              <Search size={18} />
            </div>
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="ค้นหาชื่อโปรเจกต์..."
              className="w-full pl-[44px] pr-[16px] py-[10px] bg-white border border-border rounded-[100px] text-[14px] outline-none focus:border-primary transition-colors h-[44px]"
            />
          </div>
          {/* ปุ่มตัวกรอง (dropdown-style) — กดเลือกสถานะ */}
          <div className="relative group">
            <button className="flex items-center justify-between gap-[16px] bg-white border border-border px-[16px] py-[10px] rounded-[100px] text-[14px] font-medium text-foreground hover:bg-gray-50 h-[44px] min-w-[160px]">
              <div className="flex items-center gap-[8px]">
                <SlidersHorizontal size={16} />
                <span>{activeFilter === "all" ? "ทั้งหมด" : statusLabels.find(s => s.type === activeFilter)?.label}</span>
              </div>
              <ChevronDown size={16} />
            </button>
            {/* Dropdown Menu — แสดงเมื่อ hover */}
            <div className="absolute top-[48px] right-0 bg-white border border-border rounded-[12px] shadow-lg z-50 min-w-[180px] py-[4px] opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all">
              <button
                onClick={() => setActiveFilter("all")}
                className={`w-full text-left px-[16px] py-[10px] text-[13px] hover:bg-[#F1F3F5] transition-colors ${activeFilter === "all" ? "text-primary font-semibold" : "text-foreground"}`}
              >
                ทั้งหมด
              </button>
              {statusLabels.map(s => (
                <button
                  key={s.type}
                  onClick={() => setActiveFilter(s.type as StatusType)}
                  className={`w-full text-left px-[16px] py-[10px] text-[13px] hover:bg-[#F1F3F5] transition-colors ${activeFilter === s.type ? "text-primary font-semibold" : "text-foreground"}`}
                >
                  {s.label}
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* ====== Stats Row — กดเพื่อกรองได้ ====== */}
        <div className="grid grid-cols-2 lg:grid-cols-5 gap-[16px] mb-[32px]">
          {statusLabels.map((stat) => {
            const isActive = activeFilter === stat.type;
            return (
              <button
                key={stat.type}
                onClick={() => setActiveFilter(isActive ? "all" : stat.type as StatusType)}
                className={`bg-white border rounded-[12px] p-[16px] flex flex-col items-center justify-center text-center shadow-sm cursor-pointer transition-all hover:shadow-md ${isActive ? "border-primary ring-2 ring-primary/20" : "border-border"
                  }`}
              >
                <span className={`text-[24px] font-bold leading-none mb-[4px] ${isActive ? "text-primary" : "text-foreground"}`}>
                  {statusCounts[stat.type as StatusType]}
                </span>
                <span className={`text-[13px] font-medium ${isActive ? "text-primary" : "text-muted-foreground"}`}>
                  {stat.label}
                </span>
              </button>
            );
          })}
        </div>

        {/* ====== Project List ====== */}
        {filteredProjects.length === 0 ? (
          <div className="text-center py-[60px] bg-white rounded-[16px] border border-dashed border-border">
            <p className="text-muted-foreground text-[14px]">
              {searchQuery ? `ไม่พบโปรเจกต์ที่ตรงกับ "${searchQuery}"` : "ไม่มีโปรเจกต์ในหมวดหมู่นี้"}
            </p>
          </div>
        ) : (
          <div className="flex flex-col gap-[16px]">
            {filteredProjects.map((project) => (
              <div
                key={project.id}
                className="bg-white border border-border rounded-[16px] p-[20px] flex gap-[20px] shadow-sm hover:shadow-md transition-shadow cursor-pointer"
                onClick={() => handleView(project.id)}
              >
                {/* Thumbnail */}
                <div className="w-[64px] h-[64px] bg-[#E1E4E8] rounded-[12px] shrink-0 mt-[4px]"></div>

                {/* Content */}
                <div className="flex-1 flex flex-col">
                  <div className="flex flex-col lg:flex-row justify-between items-start gap-[16px]">

                    {/* Left Info */}
                    <div className="flex flex-col gap-[8px] flex-1">
                      <div className="flex items-center gap-[8px] flex-wrap">
                        <h3 className="text-[16px] font-bold text-foreground">{project.title}</h3>

                        {/* Status Badge */}
                        <span className={`px-[10px] py-[2px] rounded-full text-[11px] font-medium ${project.statusType === 'funding' || project.statusType === 'completed' ? 'bg-[#8B5CF6] text-white' :
                          project.statusType === 'suspended' ? 'bg-[#EF4444] text-white' :
                            project.statusType === 'pending' ? 'bg-[#F1F3F5] text-[#495057]' :
                              'bg-white border border-border text-[#495057]'
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

                      {/* Funding Progress */}
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

                    {/* Right Actions — ปุ่มต่างๆ (กด event จะ stopPropagation ไม่ให้ card navigate ด้วย) */}
                    <div className="flex items-center gap-[8px] shrink-0 mt-[10px] lg:mt-0">
                      <button
                        onClick={(e) => { e.stopPropagation(); handleView(project.id); }}
                        className="flex items-center justify-center gap-[6px] px-[16px] py-[8px] bg-[#F1F3F5] hover:bg-[#E9ECEF] transition-colors rounded-[8px] text-[13px] font-medium text-foreground"
                      >
                        <Eye size={16} /> ดู
                      </button>

                      {project.hasEdit && (
                        <button
                          onClick={(e) => { e.stopPropagation(); handleEdit(project.id); }}
                          className="flex items-center justify-center gap-[6px] px-[16px] py-[8px] bg-[#F1F3F5] hover:bg-[#E9ECEF] transition-colors rounded-[8px] text-[13px] font-medium text-foreground"
                        >
                          <Edit3 size={16} /> แก้ไข
                        </button>
                      )}

                      {project.hasMilestone && (
                        <button
                          onClick={(e) => { e.stopPropagation(); }}
                          className="flex items-center justify-center gap-[6px] px-[16px] py-[8px] bg-[#8B5CF6] hover:bg-[#7C3AED] transition-colors rounded-[8px] text-[13px] font-medium text-white shadow-sm"
                        >
                          <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M12 2v20" /><path d="M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6" /></svg>
                          Milestone
                        </button>
                      )}

                      {project.hasDelete && (
                        <button
                          onClick={(e) => { e.stopPropagation(); alert(`ลบโปรเจกต์ "${project.title}" ?`); }}
                          className="flex flex-col items-center justify-center w-[36px] h-[36px] text-[#EF4444] hover:bg-red-50 rounded-[8px] transition-colors ml-[4px]"
                        >
                          <Trash2 size={18} />
                        </button>
                      )}
                    </div>

                  </div>
                </div>

              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default MyProjects;