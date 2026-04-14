import { FileText, Sparkles, CheckCircle2, Target, Check, type LucideIcon } from 'lucide-react';
import { useProjectStore, type Project } from '../store/useProjectStore';
import { useNavigate, useParams } from 'react-router';

interface StepperProps {
  currentStep: number;
}

interface StepItems {
  id: number;
  title: string;
  icon: LucideIcon;
  isComplete: (p: Project, projectId?: string) => boolean;
}

const steps: StepItems[] = [
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

const Stepper = ({ currentStep }: StepperProps) => {
  const { projectId } = useParams();
  const navigate = useNavigate();
  const currentProject = useProjectStore(s => s.currentProject);

  const completionList = steps.map(s => s.isComplete(currentProject, projectId));

  return (
    <div className="w-full max-w-[542px] mx-auto pb-8 pt-[120px] h-[219px] px-[10px]">

      <div className="relative flex justify-between items-start">
        {/* base gray line */}
        <div className="absolute top-[22px] left-[12.5%] right-[12.5%] h-[2px] bg-muted" />

        {/* colored segments — one per gap between steps */}
        {steps.slice(0, -1).map((_, idx) => {
          // segment is colored when the step on its left is the current active step or earlier
          const segmentActive = idx + 1 <= currentStep - 1;
          return (
            <div
              key={idx}
              className="absolute top-[22px] h-[2px] transition-all duration-500"
              style={{
                left: `${12.5 + idx * 25}%`,
                width: '25%',
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
              className="relative flex flex-col items-center gap-3 w-1/4 z-10 cursor-pointer"
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
