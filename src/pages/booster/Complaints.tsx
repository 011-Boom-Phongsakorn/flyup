import { useEffect } from 'react';
import { MessageSquareWarning, ChevronRight, AlertCircle, XCircle, Loader2 } from 'lucide-react';
import { Link } from 'react-router';
import { useComplaintStore } from '../../store/useComplaintStore';

// ─── Component ──────────────────────────────────────────────────────────────

const statusConfig = {
  open: {
    label: 'กำลังตรวจสอบ',
    badgeClass: 'bg-muted text-muted-foreground',
    iconClass: 'bg-red-50 text-red-500',
    Icon: MessageSquareWarning,
  },
  resolved: {
    label: 'จัดการแล้ว',
    badgeClass: 'bg-primary text-white',
    iconClass: 'bg-primary/10 text-primary',
    Icon: AlertCircle,
  },
  rejected: {
    label: 'ปฏิเสธ',
    badgeClass: 'bg-red-100 text-red-600',
    iconClass: 'bg-red-50 text-red-400',
    Icon: XCircle,
  },
} as const;

const Complaints = () => {
  const { complaints, isLoading, fetchMyComplaints } = useComplaintStore();

  useEffect(() => {
    fetchMyComplaints();
  }, [fetchMyComplaints]);

  const fmtDate = (d: string) =>
    new Date(d).toLocaleDateString('th-TH', { day: 'numeric', month: 'short', year: 'numeric' });

  return (
    <div className="relative">
      {/* Header */}
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-foreground">การร้องเรียน</h1>
        <p className="text-sm text-muted-foreground mt-1">แจ้งปัญหาเกี่ยวกับโปรเจกต์ที่คุณลงทุน</p>
      </div>

      {/* List */}
      {isLoading ? (
        <div className="flex justify-center items-center py-24">
          <Loader2 size={28} className="animate-spin text-primary" />
        </div>
      ) : complaints.length === 0 ? (
        <div className="text-center py-20 text-muted-foreground">
          <MessageSquareWarning size={36} className="mx-auto mb-3 opacity-30" />
          <p className="text-sm">ยังไม่มีคำร้องเรียน</p>
        </div>
      ) : (
        <div className="space-y-4">
          {complaints.map((item) => {
            const cfg = statusConfig[item.status] ?? statusConfig.open;
            const { Icon } = cfg;
            return (
              <Link
                key={item.id}
                to={`/booster/complaints/${item.id}`}
                className="bg-white border border-border rounded-xl p-5 flex flex-col sm:flex-row sm:items-center justify-between gap-4 hover:border-primary/50 transition-colors group/card block"
              >
                <div className="flex items-start gap-4">
                  <div className={`mt-1 flex-shrink-0 w-8 h-8 rounded-full flex items-center justify-center ${cfg.iconClass}`}>
                    <Icon size={16} />
                  </div>
                  <div>
                    <h3 className="font-bold text-foreground text-sm group-hover/card:text-primary transition-colors">
                      {item.subject}
                    </h3>
                    <p className="text-xs text-muted-foreground mt-0.5">
                      {item.project?.title ?? '—'} · {fmtDate(item.created_at)}
                    </p>
                  </div>
                </div>

                <div className="flex items-center gap-6">
                  <div className={`text-[11px] font-semibold px-3 py-1 rounded-full ${cfg.badgeClass}`}>
                    {cfg.label}
                  </div>
                  <div className="flex items-center gap-1 text-xs font-semibold text-muted-foreground group-hover/card:text-primary transition-colors">
                    รายละเอียด <ChevronRight size={14} className="group-hover/card:translate-x-0.5 transition-transform" />
                  </div>
                </div>
              </Link>
            );
          })}
        </div>
      )}
    </div>
  );
};

export default Complaints;
