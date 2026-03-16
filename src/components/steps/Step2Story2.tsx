import StepNavigation from "../StepNavigation"

const Step2Story = () => {

  return (
    <div className="flex flex-col gap-[40px] p-[10px]">
      <div className="flex flex-col bg-white-foreground rounded-[12px] px-[20px] py-[15px] gap-[15px]">
        <div className="flex flex-col px-[20px] py-[15px] gap-[15px]">
          <h1 className="text-[24px] text-foreground font-semibold">เรื่องราวของโปรเจกต์</h1>
          <div className="flex flex-col gap-[4px]">
            <p className="text-[14px] text-foreground">ความเป็นมาของโปรเจกต์</p>
            <div className="bg-background min-h-[372px] rounded-[6px] p-[12px] gap-[10px] border border-border">
            </div>
          </div>
          <p className="text-muted-foreground text-[12px]">*อธิบายความเป็นมาและรายละเอียด เชิงลึกเพื่อสร้างความเชื่อมั่น  *</p>
          <div className="flex flex-col gap-[4px]">
            <p className="text-[14px] text-foreground">ความเสี่ยงของโปรเจกต์</p>
            <div className="bg-background min-h-[372px] rounded-[6px] p-[12px] gap-[10px] border border-border">
            </div>
          </div>
          <p className="text-muted-foreground text-[12px]">*ระบุความเสี่ยงที่อาจเกิดขึ้น  เพื่อให้ผู้สนับสนุนได้รับทราบข้อมูลที่ครบถ้วน  *</p>
        </div>
      </div>
      <StepNavigation />
    </div>
  )
}

export default Step2Story