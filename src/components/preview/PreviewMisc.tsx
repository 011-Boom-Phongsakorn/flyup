const mockUpdates = [
  { date: "10 ก.พ. 2026", title: "Beta Version พร้อมแล้ว!", content: "เราเพิ่งปล่อย Beta version ให้นักศึกษา 50 คนทดสอบ Feedback เป็นบวกมาก!" },
  { date: "25 ม.ค. 2026", title: "ออกแบบ UI เสร็จสมบูรณ์", content: "ทีม UX ออกแบบเสร็จแล้ว ตอนนี้อยู่ระหว่างพัฒนา" }
];

export const PreviewUpdate = () => {
    return (
        <div className="flex flex-col gap-[20px] mt-[20px]">
            {mockUpdates.map((u, idx) => (
                <div key={idx} className="bg-white border border-border rounded-[16px] p-[24px] shadow-sm flex flex-col gap-[12px]">
                    <div className="flex items-center gap-[6px] text-muted-foreground text-[13px]">
                        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect width="18" height="18" x="3" y="4" rx="2" ry="2"/><line x1="16" x2="16" y1="2" y2="6"/><line x1="8" x2="8" y1="2" y2="6"/><line x1="3" x2="21" y1="10" y2="10"/></svg>
                        {u.date}
                    </div>
                    <h3 className="text-[18px] font-bold text-foreground">{u.title}</h3>
                    <p className="text-[14px] text-muted-foreground">{u.content}</p>
                </div>
            ))}
        </div>
    );
};

const mockQuestions = [
  { q: "เงินลงทุนจะถูกใช้อย่างไร?", a: "เงินจะถูกแบ่งตาม Milestone — ปล่อยเงินเมื่อผ่านการโหวตจาก Booster ในแต่ละ Phase" },
  { q: "แพลตฟอร์มรับประกันความปลอดภัยหรือไม่?", a: "ใช่ แพลตฟอร์มของเรามีระบบตรวจสอบตัวตนและควบคุม Milestone อย่างเข้มงวด" },
  { q: "สามารถคืนเงินได้ไหม?", a: "หากโปรเจกต์ไม่ผ่าน Milestone ที่กำหนด เงินส่วนที่เหลือจะถูกคืนให้กับ Booster ตามสัดส่วน" }
];

export const PreviewQuestion = () => {
    return (
        <div className="flex flex-col gap-[20px] mt-[20px]">
            {mockQuestions.map((item, idx) => (
                <div key={idx} className="bg-white border border-border rounded-[16px] p-[24px] shadow-sm flex flex-col gap-[12px]">
                    <div className="flex items-start gap-[12px]">
                        <div className="text-primary mt-1">
                            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M7.9 20A9 9 0 1 0 4 16.1L2 22Z"/></svg>
                        </div>
                        <div className="flex flex-col gap-[8px]">
                            <h3 className="text-[16px] font-bold text-foreground">{item.q}</h3>
                            <p className="text-[14px] text-muted-foreground">{item.a}</p>
                        </div>
                    </div>
                </div>
            ))}
        </div>
    );
};

export const PreviewComment = () => {
    return (
        <div className="flex flex-col items-center justify-center gap-[12px] mt-[40px] p-[40px] border border-dashed border-border rounded-[16px] bg-white">
            <span className="text-muted-foreground text-[14px]">ยังไม่มีความคิดเห็นในขณะนี้</span>
        </div>
    );
};
