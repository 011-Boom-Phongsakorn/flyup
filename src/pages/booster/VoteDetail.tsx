import { useState } from 'react';
import { ArrowLeft, CheckCircle2, ChevronRight, FileText, Image as ImageIcon, Link2, XCircle } from 'lucide-react';
import { useNavigate, useParams } from 'react-router';

// ─── Mock Data ──────────────────────────────────────────────────────────────

const mockDetail = {
  id: 1,
  projectTitle: 'UniTrack',
  phaseLabel: 'Phase 2: เปิดตัว Beta',
  details: {
    description: 'พัฒนาแอป Beta version พร้อมฟีเจอร์แผนที่แบบเรียลไทม์ ระบบค้นหาห้องเรียน และปฏิทินกิจกรรมในมหาวิทยาลัย',
    summary: 'ทีมได้พัฒนาแอป Beta version สำเร็จตามแผน ผ่านการทดสอบจากนักศึกษา 25 คน ระบบค้นหาและแผนที่ทำงานได้อย่างถูกต้อง'
  },
  criteria: [
    'แอป Beta ใช้งานได้บน iOS และ Android',
    'ระบบค้นหาห้องเรียนทำงานได้ถูกต้อง',
    'แผนที่แบบเรียลไทม์แสดงตำแหน่งอาคารครบถ้วน',
    'มีผลทดสอบจากผู้ใช้จริงอย่างน้อย 20 คน'
  ],
  evidence: [
    { type: 'image', title: 'screenshot-beta-app.png' },
    { type: 'pdf', title: 'beta-test-results.pdf' },
    { type: 'link', title: 'GitHub Repository' },
    { type: 'link', title: 'Figma Design' },
  ],
  stats: {
    approve: 28,
    reject: 5,
    totalInvestors: 48,
    totalVoted: 33, // 28 + 5
    deadlineText: 'โหวดภายใน 22 มี.ค. 2026'
  },
  financial: {
    amountToRelease: 20000,
    deadline: '15 มี.ค. 2026'
  }
};

// ─── Component ──────────────────────────────────────────────────────────────

const VoteDetail = () => {
  const navigate = useNavigate();
  useParams();
  const [voteValue, setVoteValue] = useState<'approve' | 'reject' | null>(null);
  const [comment, setComment] = useState('');
  const [isVoted, setIsVoted] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);

  const data = mockDetail;
  const progressPercent = Math.min(((data.stats.approve) / data.stats.totalInvestors) * 100, 100);

  const handleVoteSubmit = () => {
    if (!voteValue) return;
    setShowConfirm(true);
  };

  const confirmVote = () => {
    setShowConfirm(false);
    setIsVoted(true);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <div className="max-w-5xl relative">
      {/* Back Button */}
      <button
        onClick={() => navigate('/booster/votes')}
        className="flex items-center gap-2 text-sm font-medium text-muted-foreground hover:text-foreground transition-colors mb-6"
      >
        <ArrowLeft size={16} /> กลับไปหน้าโหวต
      </button>

      {/* Header */}
      <div className="mb-8">
        <p className="text-sm text-muted-foreground">{data.projectTitle}</p>
        <h1 className="text-2xl font-bold text-foreground">{data.phaseLabel}</h1>
      </div>

      <div className="flex flex-col lg:flex-row gap-6">
        {/* LEFT COLUMN: Info */}
        <div className="flex-1 space-y-6">

          {/* Details */}
          <div className="bg-card border border-border rounded-2xl p-6">
            <h3 className="font-bold text-foreground text-sm mb-4">รายละเอียดงาน</h3>
            <p className="text-sm text-muted-foreground mb-4 leading-relaxed">
              {data.details.description}
            </p>
            <p className="text-sm text-foreground leading-relaxed">
              <span className="font-bold">สรุปผล:</span> {data.details.summary}
            </p>
          </div>

          {/* Criteria */}
          <div className="bg-card border border-border rounded-2xl p-6">
            <h3 className="font-bold text-foreground text-sm mb-4">เกณฑ์การยอมรับ</h3>
            <ul className="space-y-3">
              {data.criteria.map((c, i) => (
                <li key={i} className="flex items-start gap-3">
                  <div className="bg-primary/10 rounded-full p-0.5 mt-0.5">
                    <CheckCircle2 size={14} className="text-primary fill-primary/20" />
                  </div>
                  <span className="text-sm text-foreground">{c}</span>
                </li>
              ))}
            </ul>
          </div>

          {/* Evidence */}
          <div className="bg-card border border-border rounded-2xl p-6">
            <h3 className="font-bold text-foreground text-sm mb-4">หลักฐานความสำเร็จ</h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {data.evidence.map((e, i) => (
                <button key={i} className="flex items-center justify-between gap-3 p-3 border border-border rounded-xl hover:bg-muted transition-colors">
                  <div className="flex items-center gap-2 text-sm text-foreground truncate">
                    {e.type === 'image' && <ImageIcon size={16} className="text-primary" />}
                    {e.type === 'pdf' && <FileText size={16} className="text-pink-500" />}
                    {e.type === 'link' && <Link2 size={16} className="text-muted-foreground" />}
                    <span className="truncate">{e.title}</span>
                  </div>
                  <ChevronRight size={16} className="text-muted-foreground flex-shrink-0" />
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* RIGHT COLUMN: Voting */}
        <div className="w-full lg:w-[380px] space-y-6 flex-shrink-0">

          {/* Stats Box */}
          <div className="bg-card border border-border rounded-2xl p-6">
            <h3 className="font-bold text-foreground text-sm mb-4">ผลโหวตปัจจุบัน</h3>

            <div className="mb-2">
              <div className="h-1.5 w-full bg-muted rounded-full overflow-hidden">
                <div className="h-full bg-primary" style={{ width: `${progressPercent}%` }} />
              </div>
            </div>

            <div className="flex justify-between items-center text-xs font-bold mb-4">
              <span className="text-primary">ยอมรับ {isVoted && voteValue === 'approve' ? data.stats.approve + 1 : data.stats.approve}</span>
              <span className="text-red-500">ไม่ยอมรับ {isVoted && voteValue === 'reject' ? data.stats.reject + 1 : data.stats.reject}</span>
            </div>

            {isVoted ? (
              <div className="space-y-2 text-xs font-medium border-t border-border pt-4 mt-2">
                <div className="flex justify-between">
                  <span className="text-foreground">ผู้โหวตแล้ว</span>
                  <span>{data.stats.totalVoted + 1} / {data.stats.totalInvestors} คน</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-foreground">ยังไม่โหวต</span>
                  <span>{data.stats.totalInvestors - data.stats.totalVoted - 1} คน</span>
                </div>
                <div className="mt-4 pt-4 border-t border-border flex items-center gap-2 text-green-600 bg-green-50 p-2.5 rounded-lg justify-center font-bold">
                  <CheckCircle2 size={16} /> แนวโน้มอนุมัติ (เกิน 50%)
                </div>
              </div>
            ) : (
              <p className="text-xs text-foreground font-medium mb-4">
                จากผู้ลงทุนทั้งหมด {data.stats.totalInvestors} คน (เกิน 50% = อนุมัติ)
              </p>
            )}

            <p className="text-[11px] text-muted-foreground mt-4">{data.stats.deadlineText}</p>
          </div>

          {/* Vote Action Box */}
          {isVoted ? (
            <div className="bg-card border border-border rounded-2xl p-6 flex flex-col items-center justify-center text-center">
              <div className="w-12 h-12 bg-primary/10 text-primary rounded-full flex items-center justify-center mb-4">
                <CheckCircle2 size={24} />
              </div>
              <h3 className="font-bold text-foreground text-lg mb-2">บันทึกการลงคะแนนสำเร็จ</h3>
              <p className="text-sm font-medium text-foreground flex items-center gap-1.5">
                คุณโหวต: {voteValue === 'approve' ? 'ยอมรับ' : 'ไม่ยอมรับ'}
                {voteValue === 'approve' ? <CheckCircle2 size={16} className="text-green-500" /> : <XCircle size={16} className="text-red-500" />}
              </p>
            </div>
          ) : (
            <div className="bg-card border border-border rounded-2xl p-6">
              <h3 className="font-bold text-foreground text-sm mb-4">ลงคะแนนของคุณ</h3>

              {/* Radio Buttons */}
              <div className="space-y-3 mb-5">
                <label className={`flex items-center gap-3 p-3 border rounded-xl cursor-pointer transition-all ${voteValue === 'approve' ? 'border-primary bg-primary/5' : 'border-border hover:bg-muted'}`}>
                  <input
                    type="radio"
                    name="vote"
                    className="w-4 h-4 text-primary focus:ring-primary accent-primary"
                    checked={voteValue === 'approve'}
                    onChange={() => setVoteValue('approve')}
                  />
                  <div className="flex items-center gap-2">
                    <CheckCircle2 size={16} className={voteValue === 'approve' ? 'text-primary' : 'text-muted-foreground'} />
                    <span className={`text-sm font-semibold ${voteValue === 'approve' ? 'text-foreground' : 'text-muted-foreground'}`}>ยอมรับ (Approve)</span>
                  </div>
                </label>

                <label className={`flex items-center gap-3 p-3 border rounded-xl cursor-pointer transition-all ${voteValue === 'reject' ? 'border-red-500 bg-red-50' : 'border-border hover:bg-muted'}`}>
                  <input
                    type="radio"
                    name="vote"
                    className="w-4 h-4 text-red-500 focus:ring-red-500 accent-red-500"
                    checked={voteValue === 'reject'}
                    onChange={() => setVoteValue('reject')}
                  />
                  <div className="flex items-center gap-2">
                    <XCircle size={16} className={voteValue === 'reject' ? 'text-red-500' : 'text-muted-foreground'} />
                    <span className={`text-sm font-semibold ${voteValue === 'reject' ? 'text-foreground' : 'text-muted-foreground'}`}>ไม่ยอมรับ (Reject)</span>
                  </div>
                </label>
              </div>

              {/* Comment Box */}
              <div className="mb-5">
                <label className="block text-xs font-semibold text-muted-foreground mb-2">ความเห็น (ไม่บังคับ)</label>
                <textarea
                  placeholder="ระบุความคิดเห็นหรือข้อเสนอแนะ"
                  value={comment}
                  onChange={(e) => setComment(e.target.value)}
                  className="w-full text-sm p-3 border border-border rounded-xl placeholder:text-muted-foreground outline-none focus:border-primary transition-colors resize-none h-24"
                />
              </div>

              <button
                onClick={handleVoteSubmit}
                disabled={!voteValue}
                className="w-full py-3 rounded-xl bg-primary text-white font-bold text-sm disabled:opacity-50 disabled:cursor-not-allowed hover:opacity-90 transition-opacity"
              >
                ยืนยันการโหวต
              </button>
            </div>
          )}

          {/* Financial Info */}
          <div className="bg-card border border-border rounded-2xl p-6">
            <div className="flex justify-between items-center text-sm font-semibold text-foreground mb-3">
              <span>จำนวนเงินที่ปล่อย</span>
              <span>฿{data.financial.amountToRelease.toLocaleString()}</span>
            </div>
            <div className="flex justify-between items-center text-sm font-semibold text-foreground">
              <span>กำหนดส่งงาน</span>
              <span>{data.financial.deadline}</span>
            </div>
          </div>
        </div>
      </div>

      {/* Confirmation Modal */}
      {showConfirm && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/40 backdrop-blur-sm p-4 animate-in fade-in duration-200">
          <div className="bg-card border border-border w-full max-w-sm rounded-[24px] p-6 shadow-xl animate-in zoom-in-95 duration-200">
            <h3 className="text-xl font-bold text-foreground mb-2">ยืนยันการโหวต</h3>
            <p className="text-sm text-muted-foreground mb-6">
              คุณต้องการโหวต <span className={voteValue === 'approve' ? 'text-green-600 font-bold' : 'text-red-500 font-bold'}>{voteValue === 'approve' ? 'ยอมรับ' : 'ไม่ยอมรับ'}</span> สำหรับ Phase 2: เปิดตัว Beta?
            </p>
            <div className="flex items-center gap-3">
              <button
                onClick={() => setShowConfirm(false)}
                className="flex-1 py-2.5 rounded-xl border border-border text-foreground font-semibold hover:bg-muted transition-colors text-sm"
              >
                ยกเลิก
              </button>
              <button
                onClick={confirmVote}
                className="flex-1 py-2.5 rounded-xl bg-primary text-white font-bold hover:opacity-90 transition-opacity text-sm"
              >
                ยืนยัน
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default VoteDetail;
