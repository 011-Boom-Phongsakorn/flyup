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
} from "lucide-react";
import { useNavigate, Link } from "react-router";
import { useProjectDetailStore } from "../../store/useProjectDetailStore";

// ─── Component ────────────────────────────────────────────────────────────────

type Tab = "story" | "milestone" | "updates" | "comments" | "questions";

function ProjectDetail() {
  const navigate = useNavigate();
  const {
    activeTab,
    selectedImage,
    isLoggedIn,
    hasInvested,
    fundedPercent,
    fundedAmount,
    targetAmount,
    projectImages,
    milestones,
    updates,
    comments,
    questions,
    setActiveTab: setActiveTabStore,
    setSelectedImage: setSelectedImageStore,
  } = useProjectDetailStore();

  const handleInvest = () => {
    if (!isLoggedIn) {
      toast.error("กรุณาเข้าสู่ระบบก่อนลงทุน", {
        position: "top-right",
        duration: 3000,
        style: {
          borderRadius: "10px",
          background: "var(--color-navbar-2)", // ดึงสีจาก CSS variables
          color: "var(--color-white-foreground)",
          fontSize: "14px",
        },
        iconTheme: { primary: "var(--color-error)", secondary: "var(--color-white-foreground)" },
      });
      return;
    }
    navigate(`/projects/1/invest`);
  };

  const tabs = [
    { id: "story" as Tab, label: "เรื่องราว", count: undefined },
    { id: "milestone" as Tab, label: "Milestone", count: 4 },
    { id: "updates" as Tab, label: "อัปเดต", count: updates.length },
    { id: "comments" as Tab, label: "ความคิดเห็น", count: comments.length },
    { id: "questions" as Tab, label: "คำถาม", count: questions.length },
  ];

  return (
    <div className="min-h-screen bg-background overflow-x-hidden w-full">
      <Toaster />

      {/* ── Main Content ── */}
      <div className="max-w-[1340px] mx-auto px-4 sm:px-6 pt-6 md:pt-8 pb-16">
        {/* Tags */}
        <div className="flex flex-wrap items-center gap-2 mb-3">
          <Link to="/projects?category=Mobile App" className="text-xs px-3 py-1 rounded-full bg-muted text-muted-foreground hover:bg-primary/10 hover:text-primary transition-colors cursor-pointer">แอปมือถือ</Link>
          <Link to="/projects?category=Education" className="text-xs px-3 py-1 rounded-full bg-muted text-muted-foreground hover:bg-primary/10 hover:text-primary transition-colors cursor-pointer">Education Tech</Link>
          <span className="text-xs px-3 py-1 rounded-full text-white-foreground bg-[image:var(--gradient-primary)]">
            Funding
          </span>
        </div>

        <h1 className="text-2xl sm:text-3xl font-bold text-foreground mb-2 break-words">UniTrack</h1>
        <p className="text-sm text-muted-foreground mb-6 break-words">
          ช่วยนักศึกษาค้นหาห้องเรียน กิจกรรม และบริการต่างๆ ได้รวดเร็ว พร้อมแผนที่แบบเรียลไทม์
        </p>

        {/* Two-column layout */}
        <div className="flex flex-col lg:flex-row gap-6 items-start">
          {/* ── LEFT COLUMN ── */}
          <div className="flex-1 min-w-0 w-full lg:w-auto">
            {/* Main image */}
            <div
              className="rounded-2xl overflow-hidden mb-3 w-full bg-primary-light min-h-[280px] sm:min-h-[380px] max-h-[420px]"
            >
              <img
                src={projectImages[selectedImage]}
                alt="project"
                className="w-full h-full object-cover transition-all duration-300 ease-in-out"
              />
            </div>

            {/* Thumbnails */}
            <div className="flex gap-2 mb-8 overflow-x-auto scrollbar-hide">
              {projectImages.map((img, i) => (
                <button
                  key={i}
                  onClick={() => setSelectedImageStore(i)}
                  className={`rounded-xl overflow-hidden border-2 transition-all flex-shrink-0 w-20 h-14 sm:w-24 sm:h-16 ${selectedImage === i
                    ? "border-primary"
                    : "border-transparent opacity-70 hover:opacity-100"
                    }`}
                >
                  <img src={img} alt="" className="w-full h-full object-cover" />
                </button>
              ))}
            </div>

            {/* ── Tabs Content ── */}
            <div> {/* เอาขอบการ์ดขาวออก */}

              {/* ── Tabs Navigation: ปรับทำขอบแบบในรูป ── */}
              <div className="flex bg-[#f1f1f4] p-1.5 rounded-[10px] mb-8 border border-[#e4e4e7] w-full overflow-x-auto scrollbar-hide">
                {tabs.map((tab) => (
                  <button
                    key={tab.id}
                    onClick={() => setActiveTabStore(tab.id)}
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

              {/* ── Content Area: เอา Padding p-8 ออก ── */}
              <div className="min-h-[400px]">

                {/* ── Story Content ── */}
                {activeTab === "story" && (
                  <div className="space-y-6 sm:space-y-8 animate-in fade-in duration-300 w-full">
                    <section>
                      <h2 className="text-lg sm:text-xl font-bold text-foreground mb-4 break-words">ปัญหาที่เราแก้ไข</h2>
                      <p className="text-muted-foreground leading-relaxed text-sm sm:text-[15px] break-words">
                        นักศึกษาใหม่และแม้แต่นักศึกษาปัจจุบันมักจะหลงทางในมหาวิทยาลัยขนาดใหญ่
                        ไม่รู้ว่าห้องเรียนอยู่ตรงไหน กิจกรรมวันนี้มีอะไรบ้าง และจะไปใช้บริการต่างๆ ได้ที่ไหน
                      </p>
                    </section>

                    <section>
                      <h2 className="text-lg sm:text-xl font-bold text-foreground mb-4 break-words">วิธีแก้ปัญหาของเรา</h2>
                      <p className="text-muted-foreground mb-4 text-sm sm:text-[15px] break-words">
                        <span className="text-primary font-bold">UniTrack</span> เป็นแอปมือถือที่รวมทุกอย่างไว้ในที่เดียว:
                      </p>
                      <ul className="space-y-4">
                        {[
                          { b: "แผนที่แบบเรียลไทม์", t: "— นำทางไปห้องเรียน, ห้องสมุด, โรงอาหาร" },
                          { b: "ปฏิทินกิจกรรม", t: "— ดูกิจกรรมทั้งหมดในมหาวิทยาลัย" },
                          { b: "ระบบค้นหาบริการ", t: "— ค้นหาร้านอาหาร, ATM, จุดบริการ" },
                          { b: "แจ้งเตือนอัจฉริยะ", t: "— เตือนก่อนเรียน 15 นาที พร้อมเส้นทาง" },
                        ].map((item, idx) => (
                          <li key={idx} className="flex items-start gap-3">
                            <div className="w-1.5 h-1.5 rounded-full bg-foreground mt-[9px] flex-shrink-0" />
                            <span className="text-muted-foreground text-sm sm:text-[15px]">
                              <strong className="text-foreground font-bold">{item.b}</strong> {item.t}
                            </span>
                          </li>
                        ))}
                      </ul>
                    </section>

                    <section>
                      <h2 className="text-lg sm:text-xl font-bold text-foreground mb-4 break-words">เทคโนโลยีที่ใช้</h2>
                      <ul className="space-y-3">
                        {[
                          "React Native สำหรับ Cross-platform",
                          "Firebase สำหรับ Backend",
                          "Mapbox สำหรับ Indoor Mapping",
                          "AI สำหรับ Route Optimization",
                        ].map((tech, idx) => (
                          <li key={idx} className="flex items-center gap-3">
                            <div className="w-1.5 h-1.5 rounded-full bg-muted-foreground/40 flex-shrink-0" />
                            <span className="text-muted-foreground text-sm sm:text-[15px]">{tech}</span>
                          </li>
                        ))}
                      </ul>
                    </section>

                    {/* Risk Box */}
                    <div className="border border-orange-200 bg-orange-50/40 rounded-2xl p-4 sm:p-6 flex gap-4 mt-10">
                      <AlertTriangle className="text-orange-500 flex-shrink-0 mt-0.5" size={20} />
                      <div className="space-y-1">
                        <h4 className="font-bold text-foreground text-sm sm:text-[16px]">ความเสี่ยงและความท้าทาย</h4>
                        <p className="text-xs sm:text-[14px] text-muted-foreground leading-relaxed">
                          โปรเจกต์นี้เป็นผลงานนักศึกษา มีความเสี่ยงด้านการพัฒนาและการตลาด
                          ทีมงานจะรายงานความคืบหน้าอย่างสม่ำเสมอ
                        </p>
                      </div>
                    </div>
                  </div>
                )}

                {/* ── Milestone Content ── */}
                {activeTab === "milestone" && (
                  <div className="relative animate-in fade-in duration-500 py-6">

                    {/* 1. เส้น Timeline: ใช้สีจาก border หรือ placeholder */}
                    <div className="absolute left-6 sm:left-[46px] top-14 bottom-14 w-[1px] bg-border z-0 hidden sm:block" />

                    <div className="space-y-6 px-0 sm:px-6">
                      {milestones.map((m) => (
                        <div key={m.phase} className="flex gap-4 sm:gap-6 items-start relative z-10">

                          {/* 2. ตัวเลข Phase: พื้นหลังใช้สี background เพื่อตัดเส้น Timeline */}
                          <div className="w-10 h-10 sm:w-[44px] sm:h-[44px] mt-1 sm:mt-3 flex items-center justify-center flex-shrink-0 z-10 bg-background">
                            {m.phase === 1 ? (
                              <div className="w-full h-full rounded-full bg-primary text-white-foreground flex items-center justify-center text-lg sm:text-xl font-bold">
                                {m.phase}
                              </div>
                            ) : m.phase === 2 ? (
                              <div className="w-full h-full rounded-full bg-accent text-white-foreground flex items-center justify-center text-lg sm:text-xl font-bold">
                                {m.phase}
                              </div>
                            ) : (
                              <div className="text-xl sm:text-2xl font-medium text-foreground">
                                {m.phase}
                              </div>
                            )}
                          </div>

                          {/* 3. การ์ดรายละเอียด: ใช้ bg-card และ border-border */}
                          <div className="flex-1 bg-card border border-border rounded-2xl p-4 sm:p-6 shadow-sm">
                            <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-4">
                              <div className="space-y-1">
                                <h4 className="font-bold text-base sm:text-lg text-foreground">
                                  {m.title}
                                </h4>
                                <p className="text-sm text-muted-foreground">
                                  {m.description}
                                </p>
                              </div>

                              {/* 4. ส่วนราคาและ Badge สถานะ */}
                              <div className="flex flex-col items-start sm:items-end gap-2 flex-shrink-0">
                                <span className="text-primary font-bold text-lg sm:text-xl tracking-tight">
                                  {m.amount.toLocaleString()}฿
                                </span>
                                <span
                                  className={`text-xs font-medium px-3 sm:px-4 py-1 rounded-full border ${m.status === "completed"
                                    ? "bg-primary text-white-foreground border-primary"
                                    : "bg-card text-foreground border-border"
                                    }`}
                                >
                                  {m.status === "completed" ? "เสร็จสิ้น" : "รอดำเนินการ"}
                                </span>
                              </div>
                            </div>

                            {/* 5. ไอคอนปฏิทินและกำหนดส่ง */}
                            <div className="flex items-center gap-2 mt-4 text-xs sm:text-[13px] text-muted-foreground">
                              <Calendar size={14} className="text-placeholder" />
                              <span>กำหนดส่ง: {m.deadline}</span>
                            </div>

                            {/* 6. ส่วนสิ่งที่ส่งมอบ */}
                            <div className="mt-6">
                              <p className="text-xs sm:text-[13px] font-bold text-foreground mb-3">
                                สิ่งที่ส่งมอบ:
                              </p>
                              <div className="flex flex-wrap gap-2">
                                {m.deliverables.map((d) => (
                                  <span
                                    key={d}
                                    className="text-xs sm:text-[13px] px-3 sm:px-4 py-1.5 rounded-full border border-border text-foreground bg-card font-medium"
                                  >
                                    {d}
                                  </span>
                                ))}
                              </div>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {/* ── Updates ── */}
                {activeTab === "updates" && (
                  <div className="space-y-3 animate-in fade-in duration-300">
                    {updates.map((u, i) => (
                      <div key={i} className="border border-border rounded-xl p-3 sm:p-4">
                        <div className="flex items-center gap-1.5 text-xs text-muted-foreground mb-1.5">
                          <Calendar size={12} />
                          <span>{u.date}</span>
                        </div>
                        <h4 className="font-semibold text-sm text-foreground leading-snug">{u.title}</h4>
                        <p className="text-xs text-muted-foreground mt-1 leading-relaxed">{u.description}</p>
                      </div>
                    ))}
                  </div>
                )}

                {/* ── Comments ── */}
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
                      ความคิดเห็น ({comments.length})
                    </p>
                    <div className={`space-y-3 ${!hasInvested ? "blur-sm pointer-events-none select-none" : ""}`}>
                      {comments.map((c) => (
                        <div key={c.id} className="border border-border rounded-xl p-3 sm:p-4 flex gap-3">
                          <div className="w-8 h-8 sm:w-9 sm:h-9 rounded-full bg-gradient-to-br from-accent to-primary flex-shrink-0 flex items-center justify-center text-white-foreground text-xs font-bold shadow-md">
                            {c.user.charAt(0)}
                          </div>
                          <div className="flex-1 min-w-0">
                            <div className="flex items-center gap-2 flex-wrap">
                              <span className="text-sm font-medium text-foreground leading-snug">{c.user}</span>
                              <span className="text-[9px] font-black uppercase tracking-tight bg-primary-light text-primary px-2 py-0.5 rounded leading-none">{c.badge}</span>
                              <span className="text-xs text-placeholder ml-auto">{c.time}</span>
                            </div>
                            <p className="text-sm text-muted-foreground mt-1 leading-relaxed">{c.text}</p>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {/* ── Questions ── */}
                {activeTab === "questions" && (
                  <div className="space-y-3 animate-in fade-in duration-300">
                    {questions.map((q) => (
                      <div key={q.id} className="border border-border rounded-xl p-3 sm:p-4">
                        <div className="flex gap-2.5">
                          <MessageCircle size={16} className="text-primary flex-shrink-0 mt-0.5" />
                          <div>
                            <p className="font-medium text-sm text-foreground leading-snug">{q.question}</p>
                            <p className="text-xs text-muted-foreground mt-1 leading-relaxed">{q.answer}</p>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* ── RIGHT COLUMN ── */}
          <div className="lg:w-80 flex-shrink-0 space-y-4 w-full lg:w-auto">

            {/* ── Fund Card ── */}
            <div className="bg-card rounded-2xl border border-border shadow-sm overflow-hidden">
              {/* Progress bar at top */}
              <div className="h-2 w-full bg-muted relative">
                <div
                  className="h-full absolute left-0 top-0 transition-all duration-1000 ease-out bg-[image:var(--gradient-primary)]"
                  style={{ width: `${fundedPercent}%` }}
                />
              </div>

              <div className="p-4 sm:p-5">
                {/* Amount */}
                <p className="text-3xl sm:text-4xl font-black mb-0.5 text-primary">
                  ฿{fundedAmount.toLocaleString()}
                </p>
                <p className="text-sm text-muted-foreground mb-4">
                  เป้าหมาย ฿{targetAmount.toLocaleString()} · {fundedPercent}%
                </p>

                <div className="border-t border-muted pt-4 mb-4 leading-none">
                  {/* Stats row */}
                  <div className="grid grid-cols-3 gap-2 text-center">
                    <div>
                      <div className="flex items-center justify-center gap-1 text-muted-foreground mb-1">
                        <Users size={13} />
                        <span className="font-semibold text-base text-foreground">55</span>
                      </div>
                      <p className="text-[10px] text-muted-foreground font-bold uppercase tracking-wide">ผู้สนับสนุน</p>
                    </div>
                    <div>
                      <div className="flex items-center justify-center gap-1 text-muted-foreground mb-1">
                        <Clock size={13} />
                        <span className="font-semibold text-base text-foreground">6</span>
                      </div>
                      <p className="text-[10px] text-muted-foreground font-bold uppercase tracking-wide">วันที่เหลือ</p>
                    </div>
                    <div>
                      <div className="flex items-center justify-center gap-1 text-muted-foreground mb-1">
                        <BarChart2 size={13} />
                        <span className="font-semibold text-base text-foreground">15%</span>
                      </div>
                      <p className="text-[10px] text-muted-foreground font-bold uppercase tracking-wide">ส่วนแบ่งกำไร</p>
                    </div>
                  </div>
                </div>

                {/* Details */}
                <div className="text-[11px] space-y-1 mb-4 leading-snug">
                  <div className="flex justify-between">
                    <span className="text-muted-foreground font-bold">ลงทุนขั้นต่ำ</span>
                    <span className="text-foreground font-medium">1000฿</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground font-bold">ลงทุนได้สูงสุด</span>
                    <span className="text-foreground font-medium">14,000฿</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground font-bold">ระยะเวลา</span>
                    <span className="text-foreground font-medium text-right text-[10px]">15 ม.ค. 26 — 15 มี.ค. 26</span>
                  </div>
                </div>

                {/* Link */}
                <button className="w-full text-sm text-primary font-medium text-center mb-3 hover:underline">
                  กำลังระดมทุน
                </button>

                {/* CTA + Flag */}
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
                <img
                  src="https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&w=150&q=80"
                  alt="creator"
                  className="w-10 h-10 sm:w-11 sm:h-11 rounded-full object-cover flex-shrink-0 shadow-sm border border-background"
                />
                <div>
                  <p className="font-semibold text-sm text-foreground">ณัฐพล สุขใจ</p>
                  <p className="text-xs text-muted-foreground">มรภ.นครปฐม</p>
                </div>
              </div>
              <p className="text-xs text-muted-foreground leading-relaxed mb-3">
                นักศึกษาชั้นปี 3 สาขาวิทยาการคอมพิวเตอร์ มรภ.นครปฐม หลงใหลด้าน Mobile Development
              </p>
              <div className="flex items-center gap-2">
                <button
                  className="flex items-center gap-1.5 text-xs px-3 py-1.5 rounded-full border border-border text-muted-foreground hover:border-primary hover:text-primary transition-colors leading-none"
                >
                  <BadgeCheck size={13} className="text-primary" />
                  ยืนยันแล้ว
                </button>
                <span className="text-xs text-muted-foreground">1 โปรเจคต์</span>
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