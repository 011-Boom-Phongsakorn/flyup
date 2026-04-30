import { Link, useParams, useLocation } from "react-router";
import { ChevronLeft, ChevronRight, Send } from 'lucide-react';
import { useProjectStore } from '../store/useProjectStore';

interface StepNavigationProps {
  onSubmit?: () => void;
  disableSubmit?: boolean;
  disableNext?: boolean;
}

const StepNavigation = ({ onSubmit, disableSubmit, disableNext }: StepNavigationProps = {}) => {
  const { projectId } = useParams();
  const location = useLocation();
  const currentProject = useProjectStore(s => s.currentProject);

  // 1. ดึงหมายเลข Step ปัจจุบันจาก URL (ถ้าดึงไม่ได้ให้เป็น 1)
  const currentStep = Number(location.pathname.split('/').pop()) || 1;

  const isFundingOrLater = !!currentProject.state &&
    currentProject.state !== 'draft' &&
    currentProject.state !== 'pending_review';
  const totalSteps = isFundingOrLater ? 5 : 4;

  // 2. เงื่อนไขสำหรับปุ่ม "ย้อนกลับ"
  // ถ้าอยู่ Step 1 ให้กลับไปหน้า Overview, ถ้าอยู่ Step อื่นให้ลบ 1
  const backUrl = currentStep === 1 
    ? `/project/overview/${projectId}` 
    : `/project/overview/${projectId}/step/${currentStep - 1}`;

  // 3. เงื่อนไขสำหรับปุ่ม "ถัดไป" (บวก 1)
  const nextUrl = `/project/overview/${projectId}/step/${currentStep + 1}`;

  // เช็คว่าอยู่หน้าสุดท้ายหรือยัง
  const isLastStep = currentStep === totalSteps;

  return (
    <div className="flex items-center gap-[10px] mt-[20px] justify-between">
      
      {/* --- ปุ่มย้อนกลับ --- */}
      <Link 
        to={backUrl} 
        className="w-[129px] h-[38px] bg-white-foreground text-foreground border border-muted flex items-center justify-center gap-[4px] rounded-[12px] hover:bg-muted/50 transition-all duration-200"
      >
        <ChevronLeft size={16} />
        <span className="text-[14px]">ย้อนกลับ</span>
      </Link>

      {/* --- ปุ่มถัดไป หรือ ปุ่มบันทึก (หน้าสุดท้าย) --- */}
      {!isLastStep ? (
        disableNext ? (
          <button
            disabled
            className="w-[129px] h-[38px] bg-gray-300 text-gray-500 cursor-not-allowed flex items-center justify-center gap-[4px] rounded-[12px]"
          >
            <span className="text-[14px]">ถัดไป</span>
            <ChevronRight size={16} />
          </button>
        ) : (
        <Link
          to={nextUrl}
          className="w-[129px] h-[38px] bg-primary hover:bg-primary-hover text-white flex items-center justify-center gap-[4px] rounded-[12px] transition-all duration-200"
        >
          <span className="text-[14px]">ถัดไป</span>
          <ChevronRight size={16} />
        </Link>
        )
      ) : isFundingOrLater ? null : (
        // ถ้าเป็น Step สุดท้าย เปลี่ยนเป็นปุ่ม Button แทน Link เพื่อเอาไว้ Submit ฟอร์ม
        <button
          onClick={onSubmit || (() => console.log("ส่งคำขอแล้ว!"))}
          disabled={disableSubmit}
          className={`px-[20px] h-[38px] flex items-center justify-center gap-[6px] rounded-[12px] transition-all duration-200 cursor-pointer ${
            disableSubmit
              ? 'bg-gray-300 text-gray-500 cursor-not-allowed'
              : 'bg-primary hover:bg-primary-hover text-white'
          }`}
        >
          <Send size={14} />
          <span className="text-[14px]">ส่งคำขอสร้างโปรเจกต์</span>
        </button>
      )}

    </div>
  );
};

export default StepNavigation;