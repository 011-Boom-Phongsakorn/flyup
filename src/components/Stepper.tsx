import { FileText, Sparkles, CheckCircle2, Target, Megaphone, Check, type LucideIcon } from 'lucide-react';
import { useProjectStore, type Project } from '../store/useProjectStore';
import { useNavigate, useParams } from 'react-router';

interface StepperProps {
  currentStep: number;
}

interface StepItems {
  id: number;
  title: string;
  icon: LucideIcon;
  isComplete: (p: Project, projectId?: string) => boolean; // เช็คว่า step นี้กรอกข้อมูลครบหรือยัง (ใช้โชว์ไอคอน ✓)
}

// รายการ step หลัก (1-4) ที่ต้องกรอกครบก่อนจะส่งคำขอสร้างโปรเจกต์ได้
const baseSteps: StepItems[] = [
  {
    id: 1,
    title: 'ข้อมูลพื้นฐาน',
    icon: FileText,
    isComplete: (p) =>
      !!p.title && !!p.description && p.categoryId > 0 &&
      p.fundingGoal > 0 && p.projectDuration > 0 &&
      p.campaignDuration > 0 && p.revenueShare > 0 && p.files.length > 0,
  },
  {
    id: 2,
    title: 'เรื่องราว',
    icon: Sparkles,
    isComplete: (p) => !!p.story && p.story !== '<p></p>' && !!p.risks,
  },
  {
    id: 3,
    title: 'ไมล์สโตน',
    icon: CheckCircle2,
    isComplete: (p) =>
      p.milestones?.length === 4 &&
      p.milestones.every(m => !!m.title && !!m.description && m.duration > 0),
  },
  {
    id: 4,
    title: 'ข้อตกลง',
    icon: Target,
    isComplete: (_, projectId) =>
      projectId ? localStorage.getItem(`agreed_${projectId}`) === 'true' : false,
  },
];

// step ที่ 5 (อัปเดต) จะไม่มีวันติ๊กว่า "เสร็จแล้ว" — เป็นแค่ช่องทางแจ้งข่าวต่อเนื่องระหว่าง funding
const updateStep: StepItems = {
  id: 5,
  title: 'อัปเดต',
  icon: Megaphone,
  isComplete: () => false,
};

const Stepper = ({ currentStep }: StepperProps) => {
  const { projectId } = useParams();
  const navigate = useNavigate();
  const currentProject = useProjectStore(s => s.currentProject);

  // โปรเจกต์เข้าสู่รอบระดมทุนแล้วหรือยัง (พ้นสถานะ draft/pending_review) — ถ้าใช่ให้โชว์ step 5 (อัปเดต) เพิ่ม
  const isFundingOrLater = !!currentProject.state &&
    currentProject.state !== 'draft' &&
    currentProject.state !== 'pending_review';

  const steps = isFundingOrLater ? [...baseSteps, updateStep] : baseSteps;
  const n = steps.length;
  const halfW = 100 / (2 * n);   // % offset to center of first/last step
  const gapW = 100 / n;           // % width of each segment gap

  // เช็คทีละ step ว่ากรอกข้อมูลครบหรือยัง เพื่อใช้ตัดสินว่าจุดไหนโชว์ไอคอน ✓ (เสร็จแล้ว) แทนไอคอนปกติ
  const completionList = steps.map(s => s.isComplete(currentProject, projectId));

  return (
    <div className="w-full max-w-[542px] mx-auto pb-8 pt-[120px] h-[219px] px-[10px]">
      <div className="relative flex justify-between items-start">
        {/* base gray line */}
        <div
          className="absolute top-[22px] h-[2px] bg-muted"
          style={{ left: `${halfW}%`, right: `${halfW}%` }}
        />

        {/* colored segments */}
        {steps.slice(0, -1).map((_, idx) => {
          const segmentActive = idx + 1 <= currentStep - 1;
          return (
            <div
              key={idx}
              className="absolute top-[22px] h-[2px] transition-all duration-500"
              style={{
                left: `${halfW + idx * gapW}%`,
                width: `${gapW}%`,
                backgroundColor: segmentActive ? 'var(--color-primary)' : 'transparent',
              }}
            />
          );
        })}

        {steps.map((step) => {
          const Icon = step.icon;
          const isActive = step.id <= currentStep;
          const done = completionList[step.id - 1];
          const highlighted = isActive || done;

          return (
            <button
              key={step.id}
              onClick={() => navigate(`/project/overview/${projectId}/step/${step.id}`)}
              className="relative flex flex-col items-center gap-3 z-10 cursor-pointer"
              style={{ width: `${100 / n}%` }}
            >
              <div
                className={`w-[44px] h-[44px] rounded-full flex items-center justify-center transition-all duration-300 ${
                  highlighted ? 'bg-primary text-white shadow-md' : 'bg-muted text-foreground'
                }`}
              >
                {done
                  ? <Check size={18} strokeWidth={2.5} />
                  : <Icon size={16} strokeWidth={highlighted ? 2 : 1.5} />
                }
              </div>
              <span className={`text-[12px] text-center ${highlighted ? 'text-foreground' : 'text-gray-400'}`}>
                {step.title}
              </span>
            </button>
          );
        })}
      </div>
    </div>
  );
};

export default Stepper;
