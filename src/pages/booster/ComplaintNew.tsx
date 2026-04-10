import { ArrowLeft, Send } from 'lucide-react';
import { useNavigate } from 'react-router';

// ─── Component ──────────────────────────────────────────────────────────────

const ComplaintNew = () => {
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
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-foreground">ร้องเรียนใหม่</h1>
      </div>

      {/* Form Card */}
      <div className="bg-card border border-border rounded-2xl p-6 lg:p-8">
        <div className="space-y-6">
          
          {/* Project Select */}
          <div>
            <label className="block text-sm font-semibold text-foreground mb-2">
              โปรเจกต์ที่ต้องการร้องเรียน *
            </label>
            <div className="relative">
              <select className="w-full bg-muted/30 border border-border px-4 py-3 rounded-xl text-sm focus:outline-none focus:border-primary transition-colors appearance-none text-muted-foreground">
                <option value="">เลือกโปรเจกต์</option>
                <option value="1">StudyBuddy</option>
                <option value="2">LabConnect</option>
                <option value="3">UniTrack</option>
              </select>
              <div className="absolute inset-y-0 right-4 flex items-center pointer-events-none">
                <svg className="w-4 h-4 text-muted-foreground" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7" />
                </svg>
              </div>
            </div>
          </div>

          {/* Topic */}
          <div>
            <label className="block text-sm font-semibold text-foreground mb-2">
              หัวข้อ *
            </label>
            <input 
              type="text"
              placeholder="ระบุหัวข้อการร้องเรียน"
              className="w-full bg-muted/30 border border-border px-4 py-3 rounded-xl text-sm focus:outline-none focus:border-primary transition-colors"
            />
          </div>

          {/* Details */}
          <div>
            <label className="block text-sm font-semibold text-foreground mb-2">
              รายละเอียด *
            </label>
            <textarea 
              placeholder="อธิบายรายละเอียดปัญหา..."
              className="w-full bg-muted/30 border border-border rounded-xl p-4 text-sm focus:outline-none focus:border-primary transition-colors min-h-[160px] resize-y"
            />
          </div>

          {/* Submit Button */}
          <button className="flex items-center justify-center gap-2 w-full bg-primary hover:bg-primary/90 text-white font-bold text-sm py-3.5 rounded-xl transition-all shadow-sm">
            <Send size={18} /> ส่งคำร้องเรียน
          </button>

        </div>
      </div>
    </div>
  );
};

export default ComplaintNew;
