import { FileText, Sparkles, CheckCircle2, Target, type LucideIcon } from 'lucide-react';

interface StepperProps {
  currentStep: number;
}

interface StepItems {
    id: number;
    title: string;
    icon: LucideIcon
}

const Stepper = ({ currentStep }: StepperProps) => {
  const steps: StepItems[] = [
    { id: 1, title: 'ข้อมูลพื้นฐาน', icon: FileText },
    { id: 2, title: 'เรื่องราว', icon: Sparkles },
    { id: 3, title: 'ไมล์สโตน', icon: CheckCircle2 },
    { id: 4, title: 'ข้อตกลง', icon: Target },
  ];

  return (
    <div className="w-full max-w-[542px] mx-auto pb-8 pt-[120px] h-[219px] px-[10px]">
      <div className="relative flex justify-between items-start">
        {steps.map((step) => {
          const Icon = step.icon;
          // เช็คว่า Step นี้เป็น Step ปัจจุบัน (หรือผ่านมาแล้ว) หรือไม่
          const isActive = step.id <= currentStep; 
          return (
            <div key={step.id} className="flex flex-col items-center gap-3 w-1/4">
              <div className={`w-[44px] h-[44px] px-[14px] py-[13px] rounded-full flex items-center justify-center transition-all duration-300 ${ isActive ? 'bg-primary text-white-foreground shadow-md' : 'bg-muted text-foreground' }`}>
                <Icon size={16} strokeWidth={isActive ? 2 : 1.5} className='' />
              </div>
              <span className={`text-[12px] text-center ${ isActive ? 'text-foreground' : 'text-gray-600' }`}>
                {step.title}
              </span>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default Stepper;