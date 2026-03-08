import { useEffect } from "react";
import { useParams, useNavigate } from "react-router";
import { useProjectStore } from "../../store/useProjectStore";
import { 
  CheckCircle2, 
  SendHorizontal, 
  ChevronRight, 
  Loader2 
} from "lucide-react";

// กำหนดรายการขั้นตอน (Steps) ตามรูปภาพต้นฉบับ
const setupSteps = [
  {
    id: "basic-info",
    title: "ข้อมูลพื้นฐาน",
    description: "ตั้งชื่อโครงการของคุณ อัปโหลดรูปภาพหรือวิดีโอ และกำหนดรายละเอียดของโปรเจกต์",
    path: "basic-info"
  },
  {
    id: "story",
    title: "เรื่องราว",
    description: "เพิ่มคำอธิบายโครงการโดยละเอียด พร้อมระบุถึงความเสี่ยงและความท้าทายที่อาจเกิดขึ้น",
    path: "story"
  },
  {
    id: "milestones",
    title: "Milestones",
    description: "กำหนดช่วงเวลาและเป้าหมายหลักในแต่ละระยะของโครงการ เพื่อให้ผู้สนับสนุนเห็นแผนการดำเนินงานที่ชัดเจน",
    path: "milestones"
  },
  {
    id: "terms",
    title: "ข้อตกลงและเงื่อนไข",
    description: "ยอมรับข้อกำหนดในการให้บริการ นโยบายความเป็นส่วนตัว และยืนยันความรับผิดชอบในการดำเนินโครงการให้สำเร็จตามที่ระบุไว้",
    path: "terms"
  },
];

const ProjectOverview = () => {
  const { projectId } = useParams<{ projectId: string }>();
  const navigate = useNavigate();
  
  // ดึงข้อมูลและสถานะจาก Zustand Store
  const { currentProject, getProjectById, isSaving } = useProjectStore();

  // โหลดข้อมูลโปรเจกต์เมื่อเข้าหน้าจอครั้งแรก
  useEffect(() => {
    if (projectId) {
      getProjectById(projectId);
    }
  }, [projectId, getProjectById]);

  const handleStepClick = (stepPath: string) => {
    // นำทางไปยังหน้ากรอกข้อมูลย่อย เช่น /project/overview/1/basic-info
    navigate(`/project/overview/${projectId}/${stepPath}`);
  };

  const handleSubmit = () => {
    // Logic สำหรับส่งตรวจสอบ (Submit for Review)
    console.log("Submitting project ID:", projectId);
  };

  return (
    <div className="max-w-4xl mx-auto p-4 lg:p-10 font-kanit animate-in fade-in duration-500">
      
      {/* ส่วนหัวข้อ (Header) */}
      <header className="mb-10 flex justify-between items-end">
        <div>
          <h1 className="text-2xl lg:text-3xl font-bold text-foreground mb-2">
            ภาพรวมของโปรเจกต์
          </h1>
          <p className="text-sidebar-primary text-sm font-medium">
            {isSaving ? "กำลังบันทึกการเปลี่ยนแปลง..." : "กำลังสร้างโปรเจกต์"}
          </p>
        </div>
        
        {/* แสดง Loading ตัวเล็กๆ ถ้ากำลังโหลดข้อมูลหลัก */}
        {!currentProject && <Loader2 className="animate-spin text-muted" size={20} />}
      </header>

      {/* รายการขั้นตอน (Steps Card List) */}
      <div className="grid gap-5 mb-12">
        {setupSteps.map((step) => {
          // ในอนาคตคุณสามารถเช็ค status จาก currentProject ได้ที่นี่
          const isDone = currentProject?.completedSteps?.includes(step.id);

          return (
            <button
              key={step.id}
              onClick={() => handleStepClick(step.path)}
              className="bg-white p-6 rounded-2xl border border-border flex items-start gap-6 text-left hover:border-sidebar-primary hover:shadow-xl hover:shadow-sidebar-primary/5 transition-all duration-300 group active:scale-[0.99]"
            >
              {/* ไอคอนวงกลม */}
              <div className={`mt-1 shrink-0 transition-colors ${
                isDone ? "text-success" : "text-muted/20 group-hover:text-sidebar-primary/40"
              }`}>
                <CheckCircle2 size={32} strokeWidth={1.5} />
              </div>

              {/* เนื้อหาข้อความ */}
              <div className="flex-1">
                <div className="flex justify-between items-center mb-1">
                  <h3 className="text-lg font-bold text-foreground group-hover:text-sidebar-primary transition-colors">
                    {step.title}
                  </h3>
                  <ChevronRight size={18} className="text-muted/30 group-hover:translate-x-1 transition-transform" />
                </div>
                <p className="text-muted-foreground text-sm leading-relaxed max-w-2xl">
                  {step.description}
                </p>
              </div>
            </button>
          );
        })}
      </div>

      {/* ส่วนท้ายและปุ่มส่งคำขอ */}
      <footer className="flex justify-end border-t border-border pt-8">
        <button
          onClick={handleSubmit}
          className="bg-sidebar-primary hover:bg-sidebar-primary/90 text-white px-8 py-3.5 rounded-xl flex items-center gap-3 font-semibold transition-all shadow-lg shadow-sidebar-primary/25 active:scale-95 disabled:opacity-50 disabled:pointer-events-none"
        >
          <SendHorizontal size={20} />
          ส่งคำขอสร้างโปรเจกต์
        </button>
      </footer>
    </div>
  );
};

export default ProjectOverview;