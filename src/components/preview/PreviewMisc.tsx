import type { Update, Question, Comment } from '../../store/useProjectDetailStore';

interface PreviewUpdateProps {
  updates: Update[];
}

export const PreviewUpdate = ({ updates }: PreviewUpdateProps) => {
  if (updates.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center gap-[12px] mt-[40px] p-[40px] border border-dashed border-border rounded-[16px] bg-white">
        <span className="text-muted-foreground text-[14px]">ยังไม่มีอัปเดต</span>
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-[20px] mt-[20px]">
      {updates.map((u, idx) => (
        <div key={idx} className="bg-white border border-border rounded-[16px] p-[24px] shadow-sm flex flex-col gap-[12px]">
          <div className="flex items-center gap-[6px] text-muted-foreground text-[13px]">
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect width="18" height="18" x="3" y="4" rx="2" ry="2"/><line x1="16" x2="16" y1="2" y2="6"/><line x1="8" x2="8" y1="2" y2="6"/><line x1="3" x2="21" y1="10" y2="10"/></svg>
            {u.date}
          </div>
          <h3 className="text-[18px] font-bold text-foreground">{u.title}</h3>
          <p className="text-[14px] text-muted-foreground">{u.description}</p>
        </div>
      ))}
    </div>
  );
};

interface PreviewQuestionProps {
  questions: Question[];
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
    <div className="flex flex-col gap-[20px] mt-[20px]">
      {questions.map((item) => (
        <div key={item.id} className="bg-white border border-border rounded-[16px] p-[24px] shadow-sm flex flex-col gap-[12px]">
          <div className="flex items-start gap-[12px]">
            <div className="text-primary mt-1">
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M7.9 20A9 9 0 1 0 4 16.1L2 22Z"/></svg>
            </div>
            <div className="flex flex-col gap-[8px]">
              <h3 className="text-[16px] font-bold text-foreground">{item.question}</h3>
              <p className="text-[14px] text-muted-foreground">{item.answer}</p>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
};

interface PreviewCommentProps {
  comments: Comment[];
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
    <div className="flex flex-col gap-[20px] mt-[20px]">
      {comments.map((c) => (
        <div key={c.id} className="bg-white border border-border rounded-[16px] p-[24px] shadow-sm flex flex-col gap-[12px]">
          <div className="flex items-center gap-[10px]">
            <div className="w-[36px] h-[36px] rounded-full bg-gray-200 flex items-center justify-center text-foreground font-bold text-[14px]">
              {c.user?.[0] ?? '?'}
            </div>
            <div className="flex flex-col">
              <div className="flex items-center gap-[8px]">
                <span className="text-[14px] font-bold text-foreground">{c.user}</span>
                {c.badge && (
                  <span className="px-[8px] py-[2px] rounded-full bg-primary/10 text-primary text-[11px] font-medium">{c.badge}</span>
                )}
              </div>
              <span className="text-[12px] text-muted-foreground">{c.time}</span>
            </div>
          </div>
          <p className="text-[14px] text-muted-foreground">{c.text}</p>
        </div>
      ))}
    </div>
  );
};
