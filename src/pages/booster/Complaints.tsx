import { Plus, MessageSquareWarning, ChevronRight, AlertCircle } from 'lucide-react';
import { Link } from 'react-router';

// ─── Mock Data ──────────────────────────────────────────────────────────────

const complaintsList = [
  {
    id: 1,
    title: 'ทีมไม่อัปเดตความคืบหน้า',
    projectTitle: 'StudyBuddy',
    date: '5 ก.พ. 2026',
    status: 'investigating', // กำลังตรวจสอบ
  },
  {
    id: 2,
    title: 'ส่งหลักฐานที่ไม่ถูกต้อง',
    projectTitle: 'LabConnect',
    date: '1 ก.พ. 2026',
    status: 'resolved', // จัดการแล้ว
  }
];

// ─── Component ──────────────────────────────────────────────────────────────

const Complaints = () => {
  return (
    <div className="max-w-5xl relative">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
        <div>
          <h1 className="text-2xl font-bold text-foreground">การร้องเรียน</h1>
          <p className="text-sm text-muted-foreground mt-1">แจ้งปัญหาเกี่ยวกับโปรเจกต์ที่คุณลงทุน</p>
        </div>
        <Link 
          to="/booster/complaints/new"
          className="flex items-center gap-2 bg-primary hover:bg-primary/90 text-white px-4 py-2.5 rounded-xl text-sm font-semibold transition-colors flex-shrink-0"
        >
          <Plus size={18} /> ร้องเรียนใหม่
        </Link>
      </div>

      {/* List */}
      <div className="space-y-4">
        {complaintsList.map((item) => (
          <Link 
            key={item.id} 
            to={`/booster/complaints/${item.id}`}
            className="bg-white border border-border rounded-xl p-5 flex flex-col sm:flex-row sm:items-center justify-between gap-4 hover:border-primary/50 transition-colors group/card block"
          >
            <div className="flex items-start gap-4">
              <div className={`mt-1 flex-shrink-0 w-8 h-8 rounded-full flex items-center justify-center transition-colors ${item.status === 'resolved' ? 'bg-primary/10 text-primary' : 'bg-red-50 text-red-500'}`}>
                {item.status === 'resolved' ? <AlertCircle size={16} className="text-primary" /> : <MessageSquareWarning size={16} className="text-red-500" />}
              </div>
              <div>
                <h3 className="font-bold text-foreground text-sm group-hover/card:text-primary transition-colors">{item.title}</h3>
                <p className="text-xs text-muted-foreground mt-0.5">{item.projectTitle} · {item.date}</p>
              </div>
            </div>

            <div className="flex items-center gap-6">
              <div className={`text-[11px] font-semibold px-3 py-1 rounded-full ${item.status === 'resolved' ? 'bg-primary text-white' : 'bg-muted text-muted-foreground'}`}>
                {item.status === 'resolved' ? 'จัดการแล้ว' : 'กำลังตรวจสอบ'}
              </div>
              <div className="flex items-center gap-1 text-xs font-semibold text-muted-foreground group-hover/card:text-primary transition-colors">
                รายละเอียด <ChevronRight size={14} className="group-hover/card:translate-x-0.5 transition-transform" />
              </div>
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
};

export default Complaints;
