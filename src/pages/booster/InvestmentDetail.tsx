import { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router';
import { ArrowLeft, Download, Loader2, Calendar } from 'lucide-react';
import { useBoosterStore } from '../../store/useBoosterStore';
import { usePublicProjectStore } from '../../store/usePublicProjectStore';
import { useProjectDetailStore } from '../../store/useProjectDetailStore';
import PreviewMilestone from '../../components/preview/PreviewMilestone';
import { PreviewUpdate, PreviewQuestion, PreviewComment } from '../../components/preview/PreviewMisc';

// ─── Constants ───────────────────────────────────────────────────────────────

const statusConfig: Record<string, { label: string; color: string }> = {
  pending: { label: 'รอชำระเงิน', color: 'bg-yellow-100 text-yellow-700' },
  verified: { label: 'กำลังดำเนินการ', color: 'bg-purple-100 text-purple-700' },
  funding: { label: 'กำลังดำเนินการ', color: 'bg-purple-100 text-purple-700' },
  completed: { label: 'เสร็จสิ้น', color: 'bg-green-100 text-green-700' },
  refunded: { label: 'คืนเงิน', color: 'bg-orange-100 text-orange-700' },
  cancelled: { label: 'ยกเลิก', color: 'bg-red-100 text-red-700' },
};

const phaseColors = ['bg-primary', 'bg-red-500', 'bg-gray-300', 'bg-gray-300'];

// ─── Component ───────────────────────────────────────────────────────────────

const InvestmentDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();

  const { currentInvestment, isDetailLoading: isInvLoading, fetchInvestmentById } = useBoosterStore();
  const { currentPublicProject: project, isDetailLoading: isProjLoading, fetchPublicProjectById } = usePublicProjectStore();
  const { updates, threads, faqs, fetchAll } = useProjectDetailStore();

  const [activeTab, setActiveTab] = useState<'story' | 'milestone' | 'update' | 'comment' | 'question'>('story');
  const [selectedIndex, setSelectedIndex] = useState(0);

  // 1. Fetch Investment first
  useEffect(() => {
    if (id) fetchInvestmentById(Number(id));
  }, [id, fetchInvestmentById]);

  // 2. Fetch Project details based on investment's project_id
  useEffect(() => {
    const projectId = currentInvestment?.project_id;
    if (projectId) {
      fetchPublicProjectById(projectId);
      fetchAll(projectId);
    }
  }, [currentInvestment?.project_id, fetchPublicProjectById, fetchAll]);

  if (isInvLoading || isProjLoading || !currentInvestment) {
    return (
      <div className="flex items-center justify-center py-32">
        <Loader2 size={32} className="animate-spin text-primary" />
      </div>
    );
  }

  const inv = currentInvestment;
  const statusCfg = statusConfig[inv.status] || { label: inv.status, color: 'bg-gray-100 text-gray-600' };
  const dateStr = new Date(inv.created_at).toLocaleDateString('th-TH', { day: 'numeric', month: 'short', year: 'numeric' });
  
  const title = project?.title || `โปรเจกต์ #${inv.project_id}`;
  const category = project?.category || 'ไม่ระบุ';
  const description = project?.description || '';
  const milestones = project?.milestones?.sort((a, b) => a.phase_no - b.phase_no) || [];
  

  const profitShare = inv.profit_share_pct || project?.profit_share_pct || 0;

  // Media
  type MediaItem = { type: 'video' | 'image'; url: string; name: string };
  const getMediaType = (t: string | string[]) => Array.isArray(t) ? t[0] : t;
  const mediaList: MediaItem[] = (project?.media || [])
    .sort((a, b) => a.sort_order - b.sort_order)
    .map(m => ({ type: getMediaType(m.type) as 'video'|'image', url: m.url, name: 'media' }));
  const selectedMedia = mediaList[selectedIndex] ?? null;

  return (
    <div className="animate-in fade-in duration-300">
      {/* Header Info */}
      <div className="flex flex-col gap-[10px] mb-[30px]">
        <button
          onClick={() => navigate('/booster/investments')}
          className="w-fit flex items-center gap-2 text-sm font-medium text-muted-foreground hover:text-foreground transition-colors mb-2"
        >
          <ArrowLeft size={16} /> กลับ
        </button>

        <div className="inline-flex w-fit items-center px-[12px] py-[4px] rounded-full border border-border bg-white text-[12px] font-medium text-foreground shadow-sm">
          {category}
        </div>
        <h1 className="text-[32px] sm:text-[36px] font-bold text-foreground leading-tight">
          {title}
        </h1>
        <p className="text-[14px] sm:text-[16px] text-muted-foreground w-full max-w-[800px]">
          {description || "กำลังโหลดรายละเอียดโปรเจกต์..."}
        </p>
      </div>

      <div className="flex flex-col lg:flex-row gap-[30px] pb-10">
        
        {/* ── Left Column (Project Details) ── */}
        <div className="flex-1 flex flex-col gap-[20px] min-w-0">
          
          {/* Main Media */}
          <div className="w-full aspect-[16/10] bg-white rounded-[16px] border border-border overflow-hidden shadow-sm">
            {selectedMedia ? (
              selectedMedia.type === 'video' ? (
                <video src={selectedMedia.url} controls className="w-full h-full object-cover" />
              ) : (
                <img src={selectedMedia.url} alt="media" className="w-full h-full object-cover" />
              )
            ) : (
              <div className="w-full h-full flex items-center justify-center bg-gray-100 text-muted-foreground">
                <span className="text-sm">กำลังโหลดรูปภาพ...</span>
              </div>
            )}
          </div>

          {/* Thumbnails */}
          {mediaList.length > 0 && (
            <div className="flex gap-[10px] overflow-x-auto pb-2 scrollbar-hide">
              {mediaList.map((media, idx) => (
                <div
                  key={idx}
                  onClick={() => setSelectedIndex(idx)}
                  className={`w-[80px] h-[60px] flex-shrink-0 border-2 rounded-[8px] overflow-hidden cursor-pointer transition-colors ${selectedIndex === idx ? 'border-primary' : 'border-border hover:border-primary/50'}`}
                >
                  {media.type === 'video' ? (
                    <video src={media.url} className="w-full h-full object-cover pointer-events-none" />
                  ) : (
                    <img src={media.url} alt="thumbnail" className="w-full h-full object-cover" />
                  )}
                </div>
              ))}
            </div>
          )}

          {/* Tabs Navigation */}
          <div className="flex bg-[#f1f1f4] p-[4px] rounded-[10px] my-[10px] overflow-x-auto scrollbar-hide">
            <button
              onClick={() => setActiveTab('story')}
              className={`flex-shrink-0 min-w-[100px] flex justify-center py-[8px] px-[16px] rounded-[6px] text-[13px] font-medium transition-all ${activeTab === 'story' ? 'bg-white text-foreground shadow-sm' : 'text-muted-foreground hover:text-foreground'}`}
            >
              เรื่องราว
            </button>
            <button
              onClick={() => setActiveTab('milestone')}
              className={`flex-shrink-0 min-w-[100px] flex justify-center py-[8px] px-[16px] rounded-[6px] text-[13px] font-medium transition-all ${activeTab === 'milestone' ? 'bg-white text-foreground shadow-sm' : 'text-muted-foreground hover:text-foreground'}`}
            >
              Milestone ({milestones.length})
            </button>
            <button
              onClick={() => setActiveTab('update')}
              className={`flex-shrink-0 min-w-[100px] flex justify-center py-[8px] px-[16px] rounded-[6px] text-[13px] font-medium transition-all ${activeTab === 'update' ? 'bg-white text-foreground shadow-sm' : 'text-muted-foreground hover:text-foreground'}`}
            >
              อัปเดต ({updates.length})
            </button>
            <button
              onClick={() => setActiveTab('comment')}
              className={`flex-shrink-0 min-w-[100px] flex justify-center py-[8px] px-[16px] rounded-[6px] text-[13px] font-medium transition-all ${activeTab === 'comment' ? 'bg-white text-foreground shadow-sm' : 'text-muted-foreground hover:text-foreground'}`}
            >
              ความคิดเห็น ({threads.length})
            </button>
            <button
              onClick={() => setActiveTab('question')}
              className={`flex-shrink-0 min-w-[100px] flex justify-center py-[8px] px-[16px] rounded-[6px] text-[13px] font-medium transition-all ${activeTab === 'question' ? 'bg-white text-foreground shadow-sm' : 'text-muted-foreground hover:text-foreground'}`}
            >
              คำถาม ({faqs.length})
            </button>
          </div>

          {/* Tab Content */}
          <div className="w-full bg-white border border-border p-6 rounded-[16px] shadow-sm min-h-[300px]">
             {activeTab === 'story' && (
                <div className="prose prose-sm sm:prose-base max-w-none text-muted-foreground">
                  {project?.stories && project.stories.length > 0 
                      ? <div dangerouslySetInnerHTML={{ __html: project.stories.sort((a,b)=>a.sort_order-b.sort_order).map(s=>s.body).join('') }} />
                      : "โปรเจกต์นี้ยังไม่ได้เขียนบรรยาย Story"}
                  {project?.risk && (
                      <div className="mt-8 p-4 bg-orange-50/50 border border-orange-200 rounded-xl">
                          <h4 className="font-bold text-orange-600 mb-2">ความเสี่ยงและความท้าทาย</h4>
                          <p className="text-sm">{project.risk}</p>
                      </div>
                  )}
                </div>
             )}
             {activeTab === 'milestone' && <PreviewMilestone milestones={milestones as any} />}
             {activeTab === 'update' && <PreviewUpdate updates={updates} />}
             {activeTab === 'comment' && <PreviewComment comments={threads} />}
             {activeTab === 'question' && <PreviewQuestion questions={faqs as any} />}
          </div>
        </div>

        {/* ── Right Column (Investment Sidebar) ── */}
        <div className="w-full lg:w-[360px] flex flex-col gap-[20px] flex-shrink-0">
          
          {/* Investment Snapshot */}
          <div className="bg-white border border-border rounded-[16px] p-[24px] shadow-sm relative overflow-hidden">
             <div className="absolute top-0 left-0 w-full h-[4px] bg-gradient-to-r from-primary to-purple-300"></div>
             
             <div className="flex justify-between items-start mb-6">
                 <div>
                    <h2 className="text-[28px] font-bold text-primary tracking-tight">฿{inv.amount?.toLocaleString()}</h2>
                    <p className="text-[13px] text-muted-foreground">ยอดลงทุนของคุณ</p>
                 </div>
                 <span className={`text-[12px] font-medium px-3 py-1 rounded-full ${statusCfg.color}`}>
                   {statusCfg.label}
                 </span>
             </div>

             <div className="flex flex-col gap-[12px] text-[13px] border-t border-border pt-[16px]">
                <div className="flex justify-between items-center">
                    <span className="text-muted-foreground">เลขอ้างอิง</span>
                    <span className="font-semibold text-foreground">INV-{inv.id}</span>
                </div>
                <div className="flex justify-between items-center">
                    <span className="text-muted-foreground">วันที่ทำรายการ</span>
                    <span className="font-semibold text-foreground flex items-center gap-1.5"><Calendar size={13} /> {dateStr}</span>
                </div>
                <div className="flex justify-between items-center">
                    <span className="text-muted-foreground">ส่วนแบ่งกำไร</span>
                    <span className="font-semibold text-foreground">{profitShare}%</span>
                </div>
                <div className="flex justify-between items-center mt-2 border-t border-dashed border-border pt-3">
                    <span className="text-muted-foreground">ค่าธรรมเนียมแพลตฟอร์ม</span>
                    <span className="font-semibold text-foreground text-error">฿{inv.platform_fee?.toLocaleString()}</span>
                </div>
                <div className="flex justify-between items-center">
                    <span className="text-muted-foreground">VAT</span>
                    <span className="font-semibold text-foreground text-error">฿{inv.vat?.toLocaleString()}</span>
                </div>
                <div className="flex justify-between items-center mt-2 bg-[#F8F9FA] p-3 rounded-xl border border-border">
                    <span className="text-muted-foreground font-semibold">ยอดชำระสุทธิ</span>
                    <span className="font-bold text-[16px] text-foreground">฿{(inv.net_amount || inv.amount)?.toLocaleString()}</span>
                </div>
             </div>

             <button className="w-full mt-6 bg-background hover:bg-muted border border-border text-foreground h-[44px] rounded-[10px] flex justify-center items-center gap-[8px] font-medium transition-colors text-[14px]">
                 <Download size={16} /> <span>ดาวน์โหลดสัญญา</span>
             </button>
          </div>

          {/* Project Progress Status */}
          <div className="bg-white border border-border rounded-[16px] p-[24px] shadow-sm">
              <h3 className="text-[14px] font-bold text-foreground mb-4">สถานะโปรเจกต์</h3>
              <div className="space-y-4">
                 {milestones.length > 0 ? milestones.map((m: any) => (
                    <div key={m.id} className="flex gap-3">
                       <div className="flex flex-col items-center mt-1">
                          <div className={`w-3 h-3 rounded-full flex-shrink-0 ${m.status === 'completed' ? phaseColors[0] : (m.status === 'in_progress' ? phaseColors[1] : phaseColors[2])}`} />
                          <div className="w-[1px] h-full bg-border mt-1"></div>
                       </div>
                       <div className="flex-1 pb-4">
                          <p className={`text-[13px] font-medium leading-snug ${m.status==='completed' ? 'text-primary' : 'text-foreground'}`}>
                             Phase {m.phase_no}: {m.title}
                          </p>
                          <p className="text-[12px] text-muted-foreground mt-1">
                             ฿{((inv.amount || 0) * m.percent_release / 100).toLocaleString()} ({m.percent_release}%)
                          </p>
                       </div>
                    </div>
                 )) : (
                    <p className="text-[13px] text-muted-foreground text-center py-4">โปรเจกต์นี้ยังไม่มีข้อมูล Milestone</p>
                 )}
              </div>
          </div>

        </div>
      </div>
    </div>
  );
};

export default InvestmentDetail;
