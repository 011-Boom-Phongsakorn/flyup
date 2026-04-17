import { useState } from 'react';
import { MessageCircle, ChevronLeft, Lock } from 'lucide-react';
import type { ProjectUpdate, ProjectFAQ, ProjectThread } from '../../store/useProjectDetailStore';

// ─── PreviewUpdate ────────────────────────────────────────────────────────────

interface PreviewUpdateProps {
  updates: ProjectUpdate[];
  creatorName?: string;
  creatorAvatar?: string;
}

export const PreviewUpdate = ({ updates, creatorName = 'ผู้พัฒนาโปรเจกต์', creatorAvatar }: PreviewUpdateProps) => {
  const [selectedId, setSelectedId] = useState<number | null>(null);
  const [visibleCount, setVisibleCount] = useState(10);

  const selectedUpdate = updates.find(u => u.id === selectedId) ?? null;
  const selectedIndex = updates.findIndex(u => u.id === selectedId);

  const formatDate = (dateStr: string) => {
    try {
      return new Date(dateStr).toLocaleDateString('th-TH', {
        year: 'numeric', month: 'long', day: 'numeric',
      });
    } catch {
      return dateStr;
    }
  };

  const initials = creatorName.split(' ').map(w => w[0]).join('').slice(0, 2).toUpperCase() || 'C';

  // ── Detail View ──────────────────────────────────────────────────────────────
  if (selectedUpdate) {
    const updateNumber = updates.length - selectedIndex;

    return (
      <div className="flex flex-col gap-[24px] mt-[16px] animate-in fade-in duration-200">
        {/* Back button */}
        <button
          onClick={() => setSelectedId(null)}
          className="flex items-center gap-[6px] text-[13px] text-primary hover:text-primary/70 transition-colors font-medium w-fit cursor-pointer"
        >
          <ChevronLeft size={16} />
          อัปเดตทั้งหมด
        </button>

        <div className="bg-white border border-border rounded-[16px] p-[28px] shadow-sm flex flex-col gap-[20px]">
          {/* Header */}
          <div className="flex flex-col gap-[10px] border-b border-border pb-[20px]">
            <span className="text-[12px] font-medium text-muted-foreground uppercase tracking-wide">
              อัปเดต #{updateNumber}
            </span>
            <h2 className="text-[22px] font-bold text-foreground leading-tight">{selectedUpdate.title}</h2>

            {/* Creator + date */}
            <div className="flex items-center gap-[10px] mt-[4px]">
              <div className="w-[36px] h-[36px] rounded-full bg-primary/20 flex items-center justify-center text-primary font-bold text-[13px] flex-shrink-0 overflow-hidden">
                {creatorAvatar
                  ? <img src={creatorAvatar} alt="creator" className="w-full h-full object-cover" />
                  : initials
                }
              </div>
              <div className="flex flex-col gap-[2px]">
                <div className="flex items-center gap-[6px]">
                  <span className="text-[14px] font-semibold text-foreground">{creatorName}</span>
                  <span className="text-[11px] bg-emerald-100 text-emerald-700 px-[8px] py-[2px] rounded-full font-medium">Pioneer</span>
                </div>
                <span className="text-[12px] text-muted-foreground">{formatDate(selectedUpdate.created_at)}</span>
              </div>
            </div>
          </div>

          {/* Content */}
          <div className="text-[15px] text-foreground leading-relaxed whitespace-pre-wrap">
            {selectedUpdate.body}
          </div>

        </div>

        {/* Comments section */}
        <div className="bg-white border border-border rounded-[16px] p-[24px] flex flex-col gap-[16px] shadow-sm">
          <h3 className="text-[15px] font-semibold text-foreground flex items-center gap-[6px]">
            <MessageCircle size={16} className="text-primary" />
            ความคิดเห็น
          </h3>

          <div className="flex flex-col items-center gap-[10px] py-[24px] border border-dashed border-border rounded-[12px]">
            <Lock size={20} className="text-muted-foreground" strokeWidth={1.5} />
            <p className="text-[13px] font-medium text-foreground">เฉพาะผู้ลงทุนเท่านั้นที่แสดงความเห็นได้</p>
            <p className="text-[12px] text-muted-foreground text-center max-w-[260px] leading-relaxed">
              ลงทุนในโปรเจกต์นี้เพื่อร่วมสอบถามและติดตามความคืบหน้า
            </p>
          </div>
        </div>
      </div>
    );
  }

  // ── List View ────────────────────────────────────────────────────────────────
  if (updates.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center gap-[12px] mt-[40px] p-[40px] border border-dashed border-border rounded-[16px] bg-white">
        <span className="text-muted-foreground text-[14px]">ยังไม่มีอัปเดต</span>
      </div>
    );
  }

  const visible = updates.slice(0, visibleCount);

  return (
    <div className="flex flex-col gap-[16px] mt-[16px]">
      {visible.map((u, idx) => {
        const updateNumber = updates.length - idx;

        return (
          <div key={u.id} onClick={() => setSelectedId(u.id)} className="bg-white border border-border rounded-[16px] p-[24px] shadow-sm flex flex-col gap-[14px] hover:border-primary/40 transition-colors cursor-pointer">
            {/* Update number */}
            <span className="text-[12px] font-medium text-muted-foreground uppercase tracking-wide">
              อัปเดต #{updateNumber}
            </span>

            {/* Title */}
            <h3 className="text-[20px] font-bold text-foreground leading-tight">{u.title}</h3>

            {/* Creator + date */}
            <div className="flex items-center gap-[8px] pb-[14px] border-b border-border">
              <div className="w-[28px] h-[28px] rounded-full bg-primary/20 flex items-center justify-center text-primary font-bold text-[11px] flex-shrink-0 overflow-hidden">
                {creatorAvatar
                  ? <img src={creatorAvatar} alt="creator" className="w-full h-full object-cover" />
                  : initials
                }
              </div>
              <div className="flex flex-col gap-[1px]">
                <div className="flex items-center gap-[6px]">
                  <span className="text-[13px] font-semibold text-foreground">{creatorName}</span>
                  <span className="text-[11px] bg-emerald-100 text-emerald-700 px-[7px] py-[1px] rounded-full font-medium">Pioneer</span>
                </div>
                <span className="text-[11px] text-muted-foreground">{formatDate(u.created_at)}</span>
              </div>
            </div>

            {/* Preview content */}
            <div className="relative max-h-[150px] overflow-hidden">
              <p className="text-[14px] text-muted-foreground leading-relaxed whitespace-pre-wrap">{u.body}</p>
              <div className="absolute bottom-0 left-0 right-0 h-[48px] bg-gradient-to-t from-white to-transparent pointer-events-none" />
            </div>

            {/* Footer */}
            <div className="flex items-center">
              <span className="flex items-center gap-[5px] text-[13px] text-muted-foreground">
                <MessageCircle size={14} />
                ความคิดเห็น
              </span>
            </div>
          </div>
        );
      })}

      {updates.length > 10 && (
        <div className="flex flex-col items-center gap-[12px] pt-[8px]">
          <span className="text-[13px] text-muted-foreground">
            แสดง {Math.min(visibleCount, updates.length)} จาก {updates.length} อัปเดต
          </span>
          <div className="flex gap-[8px]">
            {visibleCount < updates.length && (
              <button
                onClick={() => setVisibleCount(v => v + 10)}
                className="bg-foreground text-background text-[14px] font-medium px-[32px] py-[10px] rounded-[8px] hover:opacity-80 transition-opacity cursor-pointer"
              >
                โหลดเพิ่มเติม
              </button>
            )}
            {visibleCount > 10 && (
              <button
                onClick={() => setVisibleCount(10)}
                className="bg-white border border-border text-foreground text-[14px] font-medium px-[32px] py-[10px] rounded-[8px] hover:border-primary/50 transition-colors cursor-pointer"
              >
                แสดงน้อยลง
              </button>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

// ─── PreviewQuestion ──────────────────────────────────────────────────────────

interface PreviewQuestionProps {
  questions: ProjectFAQ[];
}

export const PreviewQuestion = ({ questions }: PreviewQuestionProps) => {
  if (questions.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center gap-[12px] mt-[40px] p-[40px] border border-dashed border-border rounded-[16px] bg-white">
        <span className="text-muted-foreground text-[14px]">ยังไม่มีคำถาม</span>
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-[12px] mt-[16px]">
      {questions.map((item) => (
        <div key={item.id} className="bg-white border border-border rounded-[16px] p-[20px] shadow-sm">
          <div className="flex items-start gap-[12px]">
            <div className="text-primary mt-[2px] flex-shrink-0">
              <MessageCircle size={18} />
            </div>
            <div className="flex flex-col gap-[6px]">
              <p className="text-[15px] font-semibold text-foreground">{item.question}</p>
              <p className="text-[14px] text-muted-foreground leading-relaxed">{item.answer}</p>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
};

// ─── PreviewComment ───────────────────────────────────────────────────────────

interface PreviewCommentProps {
  comments: ProjectThread[];
}

export const PreviewComment = ({ comments }: PreviewCommentProps) => {
  if (comments.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center gap-[12px] mt-[40px] p-[40px] border border-dashed border-border rounded-[16px] bg-white">
        <span className="text-muted-foreground text-[14px]">ยังไม่มีความคิดเห็นในขณะนี้</span>
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-[12px] mt-[16px]">
      {comments.map((c) => (
        <div key={c.id} className="bg-white border border-border rounded-[16px] p-[20px] shadow-sm">
          <div className="flex items-center gap-[10px] mb-[10px]">
            <div className="w-[36px] h-[36px] rounded-full bg-gray-200 flex items-center justify-center text-foreground font-bold text-[14px] flex-shrink-0">
              {c.user_name?.[0] ?? '?'}
            </div>
            <div className="flex flex-col">
              <span className="text-[14px] font-semibold text-foreground">{c.user_name}</span>
              <span className="text-[12px] text-muted-foreground">{c.created_at}</span>
            </div>
          </div>
          <p className="text-[14px] text-muted-foreground leading-relaxed">{c.body}</p>
        </div>
      ))}
    </div>
  );
};
