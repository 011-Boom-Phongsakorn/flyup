import { useProjectStore, type Milestone } from '../../store/useProjectStore';

interface PreviewMilestoneProps {
  milestones: Milestone[];
}

const PreviewMilestone = ({ milestones }: PreviewMilestoneProps) => {

  const { currentProject } = useProjectStore()

  const fundingGoal = currentProject.fundingGoal || 0
  const phasePercents = [0.15, 0.20, 0.30, 0.35]

  const activeMilestones = milestones
    .map((m, i) => ({ m, phaseIndex: i }))
    .filter(({ m }) => m.title);



  if (activeMilestones.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center gap-[12px] mt-[40px] p-[40px] border border-dashed border-border rounded-[16px] bg-white">
        <span className="text-muted-foreground text-[14px]">ยังไม่ได้กำหนด Milestone</span>
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-[24px] mt-[20px] relative w-full overflow-hidden">
      <div className="absolute left-[24px] top-[24px] bottom-[24px] w-[1px] bg-border z-0 hidden md:block" />

      {activeMilestones.map(({ m, phaseIndex }, idx) => (
        <div key={phaseIndex} className="flex gap-[20px] relative z-10 w-full">
          {/* Circle Indicator */}
          <div className={`hidden md:flex shrink-0 w-[48px] h-[48px] rounded-full items-center justify-center font-bold text-[20px] shadow-sm ${idx === 0 ? 'bg-primary text-white' : 'bg-white border border-border text-foreground'}`}>
            {phaseIndex + 1}
          </div>

          {/* Card Content */}
          <div className="flex-1 bg-white border border-border rounded-[16px] p-[24px] shadow-sm flex flex-col xl:flex-row justify-between xl:items-start gap-[20px]">
            <div className="flex flex-col gap-[12px] flex-1">
              <div>
                <h3 className="text-[16px] font-bold text-foreground">{m.title}</h3>
                {m.description && (
                  <p className="text-[14px] text-muted-foreground mt-[4px]">{m.description}</p>
                )}
              </div>

              {m.criteria.filter(c => c).length > 0 && (
                <div className="flex flex-col gap-[8px] mt-[8px]">
                  <span className="text-[12px] font-bold text-foreground">สิ่งที่ส่งมอบ:</span>
                  <div className="flex flex-wrap gap-[8px]">
                    {m.criteria.filter(c => c).map((c, i) => (
                      <span key={i} className="px-[12px] py-[4px] border border-border rounded-full text-[12px] text-foreground bg-white whitespace-nowrap">
                        {c}
                      </span>
                    ))}
                  </div>
                </div>
              )}
            </div>

            <div className="flex flex-row xl:flex-col items-center xl:items-end justify-between xl:justify-start gap-[12px] shrink-0 mt-[10px] xl:mt-0">
              <span className="text-[20px] font-bold text-primary">{fundingGoal > 0 ? `฿${(fundingGoal * phasePercents[phaseIndex]).toLocaleString('th-TH')}` : 'กรุณากำหนดเป้าหมายเงินทุนก่อน'}฿</span>
              <span className="px-[12px] py-[4px] rounded-full text-[12px] font-medium border bg-white text-foreground border-border">
                รอดำเนินการ
              </span>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
};

export default PreviewMilestone;
