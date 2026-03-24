const mockMilestones = [
  { title: "Phase 1: ต้นแบบ (Prototype)", description: "สร้าง MVP พร้อมระบบแผนที่พื้นฐาน", date: "15 ม.ค. 2026", criteria: ["Wireframe & UI Design", "ระบบแผนที่พื้นฐาน", "API Backend เบื้องต้น"], amount: 10000, status: "completed" },
  { title: "Phase 2: เปิดตัว Beta", description: "พัฒนาฟีเจอร์หลักและทดสอบกับผู้ใช้จริง", date: "15 ก.พ. 2026", criteria: ["Indoor Navigation", "ปฏิทินกิจกรรม", "ระบบค้นหา", "Beta Testing กับ 50 คน"], amount: 20000, status: "pending" },
  { title: "Phase 3: เปิดตัวเต็มรูปแบบ", description: "เปิดตัวแอปบน App Store และ Play Store", date: "15 มี.ค. 2026", criteria: ["แจ้งเตือนอัจฉริยะ", "AI Route Optimization", "เผยแพร่บน Store", "Marketing"], amount: 10000, status: "pending" },
  { title: "Phase 4: ขยายผลและเติบโต", description: "ขยายฐานผู้ใช้และพัฒนาฟีเจอร์เพิ่มเติม", date: "15 เม.ย. 2026", criteria: ["ระบบแนะนำเส้นทาง AI", "รองรับหลายมหาวิทยาลัย", "ระบบ Analytics", "Community Features"], amount: 10000, status: "pending" }
];

const PreviewMilestone = () => {
    const formatCurrency = (amount: number) => {
        return new Intl.NumberFormat("th-TH").format(amount);
    };

    return (
        <div className="flex flex-col gap-[24px] mt-[20px] relative w-full overflow-hidden">
            <div className="absolute left-[24px] top-[24px] bottom-[24px] w-[1px] bg-border z-0 hidden md:block" />
            
            {mockMilestones.map((m, idx) => (
                <div key={idx} className="flex gap-[20px] relative z-10 w-full">
                    {/* Circle Indicator */}
                    <div className={`hidden md:flex shrink-0 w-[48px] h-[48px] rounded-full items-center justify-center text-white font-bold text-[20px] shadow-sm ${idx === 0 ? 'bg-primary' : idx === 1 ? 'bg-pink-500' : 'bg-transparent text-foreground'}`}>
                        {idx >= 2 ? (
                            <span className="text-[20px] text-foreground font-medium">{idx + 1}</span>
                        ) : idx === 0 ? "1" : "2"}
                    </div>

                    {/* Card Content */}
                    <div className="flex-1 bg-white border border-border rounded-[16px] p-[24px] shadow-sm flex flex-col xl:flex-row justify-between xl:items-start gap-[20px]">
                        <div className="flex flex-col gap-[12px] flex-1">
                            <div>
                                <h3 className="text-[16px] font-bold text-foreground">{m.title}</h3>
                                <p className="text-[14px] text-muted-foreground mt-[4px]">{m.description}</p>
                            </div>
                            
                            <div className="flex items-center gap-[6px] text-muted-foreground text-[12px] mt-[4px]">
                                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect width="18" height="18" x="3" y="4" rx="2" ry="2"/><line x1="16" x2="16" y1="2" y2="6"/><line x1="8" x2="8" y1="2" y2="6"/><line x1="3" x2="21" y1="10" y2="10"/></svg>
                                กำหนดส่ง: {m.date}
                            </div>

                            <div className="flex flex-col gap-[8px] mt-[8px]">
                                <span className="text-[12px] font-bold text-foreground">สิ่งที่ส่งมอบ:</span>
                                <div className="flex flex-wrap gap-[8px]">
                                    {m.criteria.map((c, i) => (
                                        <span key={i} className="px-[12px] py-[4px] border border-border rounded-full text-[12px] text-foreground bg-white whitespace-nowrap">
                                            {c}
                                        </span>
                                    ))}
                                </div>
                            </div>
                        </div>

                        <div className="flex flex-row xl:flex-col items-center xl:items-end justify-between xl:justify-start gap-[12px] shrink-0 mt-[10px] xl:mt-0">
                            <span className="text-[20px] font-bold text-primary">{formatCurrency(m.amount)}฿</span>
                            <span className={`px-[12px] py-[4px] rounded-full text-[12px] font-medium border ${m.status === 'completed' ? 'bg-[#A78BFA] text-white border-transparent' : 'bg-white text-foreground border-border'}`}>
                                {m.status === 'completed' ? 'เสร็จสิ้น' : 'รอดำเนินการ'}
                            </span>
                        </div>
                    </div>
                </div>
            ))}
        </div>
    );
}

export default PreviewMilestone;
