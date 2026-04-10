import { ArrowLeft, FileText, ImageIcon, Send } from 'lucide-react';
import { useNavigate } from 'react-router';

// ─── Component ──────────────────────────────────────────────────────────────

const ComplaintDetail = () => {
  const navigate = useNavigate();

  return (
    <div className="max-w-4xl relative">
      {/* Back Button */}
      <button
        onClick={() => navigate('/booster/complaints')}
        className="flex items-center gap-2 text-sm font-medium text-muted-foreground hover:text-foreground transition-colors mb-6 cursor-pointer"
      >
        <ArrowLeft size={16} /> กลับ
      </button>

      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-4 mb-8">
        <div>
          <h1 className="text-2xl font-bold text-foreground">ทีมไม่อัปเดตความคืบหน้า</h1>
          <p className="text-sm text-muted-foreground mt-1">5 ก.พ. 2026 • StudyBuddy • ความล่าช้า</p>
        </div>
        <div className="inline-flex items-center text-[12px] font-semibold px-3 py-1 bg-muted text-muted-foreground rounded-full border border-border">
          รอตรวจสอบ
        </div>
      </div>

      <div className="space-y-6">
        {/* Details Box */}
        <div className="bg-card border border-border rounded-2xl p-6">
          <h3 className="font-bold text-foreground text-sm mb-4">รายละเอียดการร้องเรียน</h3>
          <p className="text-sm text-foreground leading-relaxed mb-6">
            ทีม StudyBuddy ไม่ได้อัปเดตความคืบหน้าของโปรเจกต์มาเป็นเวลากว่า 2 สัปดาห์ ทั้งที่กำหนดส่ง Milestone ที่ 2 ภายในวันที่ 1 ก.พ. 2026 แต่ยังไม่มีการส่งหลักฐานใดๆ ทำให้ผู้ลงทุนไม่สามารถติดตามสถานะได้
          </p>

          <h4 className="text-xs font-semibold text-muted-foreground mb-3">ไฟล์แนบ</h4>
          <div className="flex flex-wrap gap-3">
            <button className="flex items-center gap-2 px-3 py-2 border border-border rounded-xl hover:bg-muted transition-colors text-sm text-foreground">
              <ImageIcon size={16} className="text-muted-foreground" /> screenshot_milestone.png
            </button>
            <button className="flex items-center gap-2 px-3 py-2 border border-border rounded-xl hover:bg-muted transition-colors text-sm text-foreground">
              <FileText size={16} className="text-muted-foreground" /> chat_evidence.pdf
            </button>
          </div>
        </div>

        {/* Admin Response Box */}
        <div className="bg-muted border border-border rounded-2xl p-6">
          <h3 className="font-bold text-foreground text-sm mb-2">การตอบกลับจาก Admin</h3>
          <p className="text-sm text-foreground leading-relaxed mb-4">
            ทีมงานได้รับเรื่องแล้ว กำลังติดต่อทืม StudyBuddy เพื่อขอคำชี้แจง จะแจ้งผลภายใน 3 วันทำการ
          </p>
          <p className="text-[11px] text-muted-foreground font-medium">ตอบกลับเมื่อ 7 ก.พ. 2026</p>
        </div>

        {/* Timeline */}
        <div className="bg-card border border-border rounded-2xl p-6">
          <h3 className="font-bold text-foreground text-sm mb-6">ไทม์ไลน์</h3>
          
          <div className="relative border-l-2 border-muted ml-3 space-y-8 pb-2">
            {/* Step 1 */}
            <div className="relative pl-6">
              <div className="absolute -left-[9px] top-1 w-4 h-4 rounded-full bg-muted border-4 border-white" />
              <h4 className="text-sm font-bold text-foreground">ส่งคำร้องเรียน</h4>
              <p className="text-xs text-muted-foreground mt-1">5 ก.พ. 2026 10:30 • โดย คุณ</p>
            </div>
            
            {/* Step 2 */}
            <div className="relative pl-6">
              <div className="absolute -left-[9px] top-1 w-4 h-4 rounded-full bg-muted border-4 border-white" />
              <h4 className="text-sm font-bold text-foreground">รับเรื่องโดย Admin</h4>
              <p className="text-xs text-muted-foreground mt-1">5 ก.พ. 2026 14:00 • โดย Admin</p>
            </div>

            {/* Step 3 (Current) */}
            <div className="relative pl-6">
              <div className="absolute -left-[9px] top-1 w-4 h-4 rounded-full bg-primary border-4 border-white shadow-sm" />
              <h4 className="text-sm font-bold text-foreground">ตอบกลับจาก Admin</h4>
              <p className="text-xs text-muted-foreground mt-1">7 ก.พ. 2026 09:15 • โดย Admin</p>
            </div>
          </div>
        </div>

        {/* Reply Box */}
        <div className="bg-card border border-border rounded-2xl p-6">
          <h3 className="font-bold text-foreground text-sm mb-4">ส่งข้อความติดตาม</h3>
          <textarea 
            placeholder="พิมพ์ข้อความเพิ่มเติม..."
            className="w-full bg-muted/30 border border-border rounded-xl p-4 text-sm focus:outline-none focus:border-primary transition-colors min-h-[120px] resize-none mb-4"
          />
          <button className="flex items-center gap-2 bg-primary hover:bg-primary/90 text-white font-bold text-sm px-6 py-2.5 rounded-xl transition-colors">
            <Send size={16} /> ส่งข้อความ
          </button>
        </div>
      </div>
    </div>
  );
};

export default ComplaintDetail;
