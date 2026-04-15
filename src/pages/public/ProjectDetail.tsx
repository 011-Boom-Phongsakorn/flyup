import { useState, useEffect } from "react";
import toast, { Toaster } from "react-hot-toast";
import {
  Calendar,
  Users,
  Clock,
  TrendingUp,
  Lock,
  MessageCircle,
  Flag,
  AlertTriangle,
  ShieldCheck,
  BadgeCheck,
  BarChart2,
  Loader2,
} from "lucide-react";
import { useNavigate, Link, useParams } from "react-router";
import { usePublicProjectStore } from "../../store/usePublicProjectStore";
import { useProjectDetailStore } from "../../store/useProjectDetailStore";
import { useAuthStore } from "../../store/useAuthStore";

// ─── Component ────────────────────────────────────────────────────────────────

type Tab = "story" | "milestone" | "updates" | "comments" | "questions";

const PLACEHOLDER_IMG = "https://images.unsplash.com/photo-1498050108023-c5249f4df085?auto=format&fit=crop&q=80&w=800";

const NOW = Date.now();

function ProjectDetail() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState<Tab>("story");
  const [selectedImage, setSelectedImage] = useState(0);

  const { currentPublicProject, isDetailLoading, fetchPublicProjectById } = usePublicProjectStore();
  const { updates, threads, faqs, investorCount: actualInvestorCount, fetchAll } = useProjectDetailStore();
  const { authUser } = useAuthStore();

  const isLoggedIn = !!authUser;
  const project = currentPublicProject;

  useEffect(() => {
    if (id) {
      fetchPublicProjectById(Number(id));
      fetchAll(Number(id));
      window.scrollTo(0, 0);
    }
  }, [id, fetchPublicProjectById, fetchAll]);

  // ─── Derived data ──────────────────────────────────────────────────────────

  type MediaItem = { type: 'video' | 'image'; url: string; };

  const mediaList: MediaItem[] = project?.media
    ? project.media
        .sort((a, b) => a.sort_order - b.sort_order)
        .map(m => {
          const typeStr = Array.isArray(m.type) ? m.type[0] : m.type;
          return { type: typeStr as 'video' | 'image', url: m.url };
        })
    : [];

  const displayMedia = mediaList.length > 0 ? mediaList : [{ type: 'image' as const, url: PLACEHOLDER_IMG }];
  const selectedMedia = displayMedia[selectedImage] || displayMedia[0];

  const milestones = project?.milestones ?? [];
  const hasMilestones = milestones.length > 0;

  const storyHtml = project?.stories
    ? project.stories.sort((a, b) => a.sort_order - b.sort_order).map(s => s.body).join('')
    : '';

  const fundedAmount = project?.current_funding ?? 0;
  const targetAmount = project?.funding_goal ?? 0;
  const fundedPercent = targetAmount > 0 ? Math.min(Math.round((fundedAmount / targetAmount) * 100), 100) : 0;

  const daysLeft = (() => {
    if (!project?.end_date) return project?.duration_days ?? 0;
    const diff = new Date(project.end_date).getTime() - NOW;
    return Math.max(0, Math.ceil(diff / (1000 * 60 * 60 * 24)));
  })();

  const hasInvested = false; // TODO: check from investments API

  const handleInvest = () => {
    if (!isLoggedIn) {
      toast.error("กรุณาเข้าสู่ระบบก่อนลงทุน", {
        id: "login-required",
        position: "top-right",
        duration: 3000,
        style: {
          borderRadius: "10px",
          background: "var(--color-card)",
          color: "var(--color-foreground)",
          fontSize: "14px",
          border: "1px solid var(--color-border)",
        },
        iconTheme: { primary: "var(--color-error)", secondary: "var(--color-white-foreground)" },
      });
      return;
    }
    navigate(`/projects/${id}/invest`);
  };

  const tabs = [
    { id: "story" as Tab, label: "เรื่องราว", count: undefined },
    { id: "milestone" as Tab, label: "Milestone", count: milestones.length || undefined },
    { id: "updates" as Tab, label: "อัปเดต", count: updates.length || undefined },
    { id: "comments" as Tab, label: "ความคิดเห็น", count: threads.length || undefined },
    { id: "questions" as Tab, label: "คำถาม", count: faqs.length || undefined },
  ];

  if (isDetailLoading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center mt-[100px]">
        <Loader2 size={40} className="animate-spin text-primary" />
      </div>
    );
  }

  const investorCount = actualInvestorCount;

  return (
    <div className="min-h-screen bg-background overflow-x-hidden w-full mt-[100px]">
      <Toaster
        toastOptions={{ duration: 3000 }}
        containerStyle={{ top: 20 }}
      />

      {/* ── Main Content ── */}
      <div className="max-w-[1340px] mx-auto px-4 sm:px-6 pt-6 md:pt-8 pb-16">
        {/* Tags */}
        <div className="flex flex-wrap items-center gap-2 mb-3">
          {project?.category && (
            <Link to={`/projects?category=${project.category}`} className="text-xs px-3 py-1 rounded-full bg-muted text-muted-foreground hover:bg-primary/10 hover:text-primary transition-colors cursor-pointer">
              {project.category}
            </Link>
          )}
          {project?.state === 'funding' && (
            <span className="text-xs px-3 py-1 rounded-full text-white-foreground bg-[image:var(--gradient-primary)]">
              Funding
            </span>
          )}
        </div>

        <h1 className="text-2xl sm:text-3xl font-bold text-foreground mb-2 break-words">
          {project?.title || "กำลังโหลด..."}
        </h1>
        <p className="text-sm text-muted-foreground mb-6 break-words">
          {project?.description || "รายละเอียดโปรเจกต์จะแสดงที่นี่เมื่อข้อมูลมาถึง"}
        </p>

        {/* Two-column layout */}
        <div className="flex flex-col lg:flex-row gap-6 items-start">
          {/* ── LEFT COLUMN ── */}
          <div className="flex-1 min-w-0 w-full lg:w-auto">
            {/* Main image */}
            <div className="rounded-2xl overflow-hidden mb-3 w-full bg-primary-light min-h-[280px] sm:min-h-[380px] max-h-[420px]">
              {selectedMedia.type === 'video' ? (
                <video
                  src={selectedMedia.url}
                  controls
                  className="w-full h-full object-cover"
                />
              ) : (
                <img
                  src={selectedMedia.url}
                  alt="project media"
                  className="w-full h-full object-cover transition-all duration-300 ease-in-out"
                />
              )}
            </div>

            {/* Thumbnails */}
            {displayMedia.length > 1 && (
              <div className="flex gap-2 mb-8 overflow-x-auto scrollbar-hide">
                {displayMedia.map((img, i) => (
                  <button
                    key={i}
                    onClick={() => setSelectedImage(i)}
                    className={`rounded-xl overflow-hidden border-2 transition-all flex-shrink-0 w-20 h-14 sm:w-24 sm:h-16 ${selectedImage === i
                      ? "border-primary"
                      : "border-transparent opacity-70 hover:opacity-100"
                      }`}
                  >
                    {img.type === 'video' ? (
                      <video src={img.url} className="w-full h-full object-cover pointer-events-none" />
                    ) : (
                      <img src={img.url} alt="thumbnail" className="w-full h-full object-cover" />
                    )}
                  </button>
                ))}
              </div>
            )}

            {/* ── Tabs Content ── */}
            <div>
              <div className="flex bg-[#f1f1f4] p-1.5 rounded-[10px] mb-8 border border-[#e4e4e7] w-full overflow-x-auto scrollbar-hide">
                {tabs.map((tab) => (
                  <button
                    key={tab.id}
                    onClick={() => setActiveTab(tab.id)}
                    className={`flex-shrink-0 py-2 px-3 sm:py-2.5 sm:px-6 text-xs sm:text-[13px] font-medium transition-all rounded-[8px] whitespace-nowrap ${activeTab === tab.id
                      ? "bg-white text-foreground shadow-sm"
                      : "text-muted-foreground hover:text-foreground"
                      }`}
                  >
                    {tab.label}
                    {tab.count !== undefined && (
                      <span className="ml-1 opacity-60 text-[10px] sm:text-[11px]">({tab.count})</span>
                    )}
                  </button>
                ))}
              </div>

              <div className="min-h-[400px]">

                {/* ── Story Content ── */}
                {activeTab === "story" && (
                  <div className="space-y-6 sm:space-y-8 animate-in fade-in duration-300 w-full">
                    <section>
                      {storyHtml ? (
                        <div
                          className="prose prose-sm sm:prose-base max-w-none text-muted-foreground"
                          dangerouslySetInnerHTML={{ __html: storyHtml }}
                        />
                      ) : (
                        <div className="space-y-6">
                          <h2 className="text-lg sm:text-xl font-bold text-foreground mb-4 break-words">โปรเจกต์นี้ยังไม่ได้เขียนบรรยาย Story</h2>
                        </div>
                      )}
                    </section>

                    {project?.risk && (
                      <div className="border border-orange-200 bg-orange-50/40 rounded-2xl p-4 sm:p-6 flex gap-4 mt-10">
                        <AlertTriangle className="text-orange-500 flex-shrink-0 mt-0.5" size={20} />
                        <div className="space-y-1">
                          <h4 className="font-bold text-foreground text-sm sm:text-[16px]">ความเสี่ยงและความท้าทาย</h4>
                          <p className="text-xs sm:text-[14px] text-muted-foreground leading-relaxed">
                            {project.risk}
                          </p>
                        </div>
                      </div>
                    )}
                  </div>
                )}

                {/* ── Milestone Content ── */}
                {activeTab === "milestone" && (
                  <div className="relative animate-in fade-in duration-500 py-6">
                    <div className="absolute left-6 sm:left-[46px] top-14 bottom-14 w-[1px] bg-border z-0 hidden sm:block" />
                    <div className="space-y-6 px-0 sm:px-6">
                      {hasMilestones ? milestones.map((m, index) => {
                        const phaseNumber = m.phase_no || (index + 1);
                        return (
                          <div key={m.id || index} className="flex gap-4 sm:gap-6 items-start relative z-10">
                            <div className="w-10 h-10 sm:w-[44px] sm:h-[44px] mt-1 sm:mt-3 flex items-center justify-center flex-shrink-0 z-10 bg-background">
                              {phaseNumber <= 2 ? (
                                <div className={`w-full h-full rounded-full ${phaseNumber === 1 ? 'bg-primary' : 'bg-accent'} text-white-foreground flex items-center justify-center text-lg sm:text-xl font-bold`}>
                                  {phaseNumber}
                                </div>
                              ) : (
                                <div className="text-xl sm:text-2xl font-medium text-foreground">{phaseNumber}</div>
                              )}
                            </div>
                            <div className="flex-1 bg-card border border-border rounded-2xl p-4 sm:p-6 shadow-sm">
                              <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-4">
                                <div className="space-y-1">
                                  <h4 className="font-bold text-base sm:text-lg text-foreground">{m.title}</h4>
                                  <p className="text-sm text-muted-foreground whitespace-pre-line">{m.description}</p>
                                </div>
                                <div className="flex flex-col items-start sm:items-end gap-2 flex-shrink-0">
                                  <span className="text-primary font-bold text-lg sm:text-xl tracking-tight">
                                    {m.percent_release}%
                                  </span>
                                  <span className={`text-xs font-medium px-3 sm:px-4 py-1 rounded-full border ${m.status === "completed"
                                    ? "bg-primary text-white-foreground border-primary"
                                    : "bg-card text-foreground border-border"
                                    }`}>
                                    {m.status === "completed" ? "เสร็จสิ้น" : "รอดำเนินการ"}
                                  </span>
                                </div>
                              </div>
                            </div>
                          </div>
                        );
                      }) : (
                        <p className="text-center text-muted-foreground py-8">ยังไม่มี Milestone</p>
                      )}
                    </div>
                  </div>
                )}

                {/* ── Updates ── */}
                {activeTab === "updates" && (
                  <div className="space-y-3 animate-in fade-in duration-300">
                    {updates.length > 0 ? updates.map((u) => (
                      <div key={u.id} className="border border-border rounded-xl p-3 sm:p-4">
                        <div className="flex items-center gap-1.5 text-xs text-muted-foreground mb-1.5">
                          <Calendar size={12} />
                          <span>{new Date(u.created_at).toLocaleDateString('th-TH')}</span>
                        </div>
                        <h4 className="font-semibold text-sm text-foreground leading-snug">{u.title}</h4>
                        <p className="text-xs text-muted-foreground mt-1 leading-relaxed">{u.content}</p>
                      </div>
                    )) : (
                      <p className="text-center text-muted-foreground py-8">ยังไม่มีอัปเดต</p>
                    )}
                  </div>
                )}

                {/* ── Comments (Threads) ── */}
                {activeTab === "comments" && (
                  <div className="space-y-4 animate-in fade-in duration-300">
                    {!hasInvested && (
                      <div className="border-2 border-dashed border-border rounded-3xl p-8 sm:p-12 flex flex-col items-center gap-2 text-center bg-background">
                        <Lock size={24} className="text-placeholder mb-3" strokeWidth={1.5} />
                        <p className="font-medium text-sm text-foreground">เฉพาะผู้ลงทุนเท่านั้นที่สามารถดูและแสดงความคิดเห็นได้</p>
                        <p className="text-xs text-muted-foreground max-w-xs leading-relaxed">เข้าสู่ระบบ แล้วลงทุนในโปรเจคต์นี้เพื่อร่วมแสดงความคิดเห็น</p>
                      </div>
                    )}
                    <p className="text-sm font-medium text-foreground flex items-center gap-1.5">
                      <MessageCircle size={15} className="text-primary" />
                      ความคิดเห็น ({threads.length})
                    </p>
                    <div className={`space-y-3 ${!hasInvested ? "blur-sm pointer-events-none select-none" : ""}`}>
                      {threads.map((t) => (
                        <div key={t.id} className="border border-border rounded-xl p-3 sm:p-4 flex gap-3">
                          <div className="w-8 h-8 sm:w-9 sm:h-9 rounded-full bg-gradient-to-br from-accent to-primary flex-shrink-0 flex items-center justify-center text-white-foreground text-xs font-bold shadow-md">
                            {(t.user_name || '?').charAt(0)}
                          </div>
                          <div className="flex-1 min-w-0">
                            <div className="flex items-center gap-2 flex-wrap">
                              <span className="text-sm font-medium text-foreground leading-snug">{t.user_name || 'ผู้ใช้'}</span>
                              <span className="text-xs text-placeholder ml-auto">{new Date(t.created_at).toLocaleDateString('th-TH')}</span>
                            </div>
                            <p className="text-sm text-muted-foreground mt-1 leading-relaxed">{t.body}</p>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {/* ── Questions (FAQs) ── */}
                {activeTab === "questions" && (
                  <div className="space-y-3 animate-in fade-in duration-300">
                    {faqs.length > 0 ? faqs.map((q) => (
                      <div key={q.id} className="border border-border rounded-xl p-3 sm:p-4">
                        <div className="flex gap-2.5">
                          <MessageCircle size={16} className="text-primary flex-shrink-0 mt-0.5" />
                          <div>
                            <p className="font-medium text-sm text-foreground leading-snug">{q.question}</p>
                            <p className="text-xs text-muted-foreground mt-1 leading-relaxed">{q.answer}</p>
                          </div>
                        </div>
                      </div>
                    )) : (
                      <p className="text-center text-muted-foreground py-8">ยังไม่มีคำถาม</p>
                    )}
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* ── RIGHT COLUMN ── */}
          <div className="lg:w-80 flex-shrink-0 space-y-4 w-full lg:w-auto">

            {/* ── Fund Card ── */}
            <div className="bg-card rounded-2xl border border-border shadow-sm overflow-hidden">
              <div className="h-2 w-full bg-muted relative">
                <div
                  className="h-full absolute left-0 top-0 transition-all duration-1000 ease-out bg-[image:var(--gradient-primary)]"
                  style={{ width: `${fundedPercent}%` }}
                />
              </div>

              <div className="p-4 sm:p-5">
                <p className="text-3xl sm:text-4xl font-black mb-0.5 text-primary">
                  ฿{fundedAmount.toLocaleString()}
                </p>
                <p className="text-sm text-muted-foreground mb-4">
                  {targetAmount > 0 ? `เป้าหมาย ฿${targetAmount.toLocaleString()} · ${fundedPercent}%` : 'ยังไม่ตั้งเป้าหมาย'}
                </p>

                <div className="border-t border-muted pt-4 mb-4 leading-none">
                  <div className="grid grid-cols-3 gap-2 text-center">
                    <div>
                      <div className="flex items-center justify-center gap-1 text-muted-foreground mb-1">
                        <Users size={13} />
                        <span className="font-semibold text-base text-foreground">{investorCount > 0 ? investorCount : '—'}</span>
                      </div>
                      <p className="text-[10px] text-muted-foreground font-bold uppercase tracking-wide">ผู้สนับสนุน</p>
                    </div>
                    <div>
                      <div className="flex items-center justify-center gap-1 text-muted-foreground mb-1">
                        <Clock size={13} />
                        <span className="font-semibold text-base text-foreground">{daysLeft}</span>
                      </div>
                      <p className="text-[10px] text-muted-foreground font-bold uppercase tracking-wide">วันที่เหลือ</p>
                    </div>
                    <div>
                      <div className="flex items-center justify-center gap-1 text-muted-foreground mb-1">
                        <BarChart2 size={13} />
                        <span className="font-semibold text-base text-foreground">{project?.profit_share_pct || 0}%</span>
                      </div>
                      <p className="text-[10px] text-muted-foreground font-bold uppercase tracking-wide">ส่วนแบ่งกำไร</p>
                    </div>
                  </div>
                </div>

                <div className="text-[11px] space-y-1 mb-4 leading-snug">
                  <div className="flex justify-between">
                    <span className="text-muted-foreground font-bold">ลงทุนขั้นต่ำ</span>
                    <span className="text-foreground font-medium">{project?.min_invest_amount ? `${project.min_invest_amount.toLocaleString()}฿` : '—'}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground font-bold">ลงทุนได้สูงสุด</span>
                    <span className="text-foreground font-medium">{project?.max_invest_amount ? `${project.max_invest_amount.toLocaleString()}฿` : '—'}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground font-bold">ค่าธรรมเนียม</span>
                    <span className="text-foreground font-medium">{project?.platform_fee || 5}%</span>
                  </div>
                </div>

                <button className="w-full text-sm text-primary font-medium text-center mb-3 hover:underline">
                  กำลังระดมทุน
                </button>

                <div className="flex gap-2">
                  <button
                    onClick={handleInvest}
                    className="flex-1 py-3 rounded-xl text-white-foreground bg-primary font-bold text-sm flex items-center justify-center gap-2 hover:opacity-90 transition-opacity uppercase tracking-wider"
                  >
                    <TrendingUp size={16} />
                    ลงทุนโปรเจคต์นี้
                  </button>
                  <button className="w-11 h-11 rounded-xl border border-border flex items-center justify-center text-placeholder hover:text-muted-foreground transition-colors flex-shrink-0">
                    <Flag size={16} />
                  </button>
                </div>
              </div>
            </div>

            {/* ── Creator Card ── */}
            <div className="bg-card rounded-2xl border border-border shadow-sm p-4 sm:p-5 leading-snug">
              <p className="text-xs text-muted-foreground mb-3 uppercase font-bold text-[10px] tracking-wide">ผู้สร้างโปรเจคต์</p>
              <div className="flex items-center gap-3 mb-3 leading-none">
                <div className="w-10 h-10 sm:w-11 sm:h-11 rounded-full bg-gradient-to-br from-accent to-primary flex items-center justify-center text-white-foreground text-lg font-bold shadow-sm border border-background flex-shrink-0">
                  {(project?.owner_profile?.first_name || '?').charAt(0)}
                </div>
                <div>
                  <p className="font-semibold text-sm text-foreground">
                    {project?.owner_profile ? `${project.owner_profile.first_name} ${project.owner_profile.last_name}` : '—'}
                  </p>
                  <p className="text-xs text-muted-foreground">{project?.owner_profile?.university || '—'}</p>
                </div>
              </div>
              {project?.owner_profile?.bio && (
                <p className="text-xs text-muted-foreground leading-relaxed mb-3">{project.owner_profile.bio}</p>
              )}
              <div className="flex items-center gap-2">
                <button className="flex items-center gap-1.5 text-xs px-3 py-1.5 rounded-full border border-border text-muted-foreground hover:border-primary hover:text-primary transition-colors leading-none">
                  <BadgeCheck size={13} className="text-primary" />
                  {project?.owner_profile?.verify_status === 'verified' ? 'ยืนยันแล้ว' : 'รอยืนยัน'}
                </button>
                <span className="text-xs text-muted-foreground">{project?.owner_profile?.project_count || 0} โปรเจคต์</span>
              </div>
            </div>

            {/* ── Milestone Safety Card ── */}
            <div className="bg-card rounded-2xl border border-border shadow-sm p-4 sm:p-5 flex flex-col items-center text-center">
              <ShieldCheck size={24} className="text-foreground mb-2" strokeWidth={1.5} />
              <p className="font-semibold text-sm text-foreground mb-1">ปลอดภัยด้วยระบบ Milestone</p>
              <p className="text-xs text-muted-foreground leading-relaxed max-w-xs mx-auto">
                เงินลงทุนจะถูกปล่อยเป็นงวดตาม Milestone ที่ผ่านการโหวตจากผู้สนับสนุน
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default ProjectDetail;