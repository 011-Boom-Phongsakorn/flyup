import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router";
import { useProjectStore } from "../../store/useProjectStore";
import { useProjectDetailStore } from "../../store/useProjectDetailStore";
import { useAuthStore } from "../../store/useAuthStore";
import { CheckCircle2, Users, Clock, Flag, Shield } from "lucide-react";
import PreviewStory from "../../components/preview/PreviewStory";
import PreviewMilestone from "../../components/preview/PreviewMilestone";
import { PreviewUpdate, PreviewQuestion, PreviewComment } from "../../components/preview/PreviewMisc";

const Preview = () => {
    const navigate = useNavigate();
    const { projectId } = useParams();
    const { currentProject, loadCurrentProject } = useProjectStore();
    const { updates, faqs, threads, investorCount, fetchAll } = useProjectDetailStore();
    const { authUser } = useAuthStore();
    const [activeTab, setActiveTab] = useState<'story' | 'milestone' | 'update' | 'comment' | 'question'>('story');

    useEffect(() => {
        if (projectId) {
            loadCurrentProject(Number(projectId));
            fetchAll(Number(projectId));
        }
    }, [projectId, loadCurrentProject, fetchAll]);

    const formatCurrency = (amount: number) => new Intl.NumberFormat("th-TH").format(amount);

    const targetGoal = currentProject.fundingGoal || 0;
    const profitShare = currentProject.revenueShare || 0;
    const activeMilestones = currentProject.milestones?.filter(m => m.title) ?? [];

    const thMonths = ['ม.ค.','ก.พ.','มี.ค.','เม.ย.','พ.ค.','มิ.ย.','ก.ค.','ส.ค.','ก.ย.','ต.ค.','พ.ย.','ธ.ค.'];
    const formatThDate = (d: Date) => `${d.getDate()} ${thMonths[d.getMonth()]} ${d.getFullYear()}`;
    const getProjectDateRange = () => {
        if (!currentProject.projectDuration) return 'ยังไม่ได้กำหนด';
        const start = new Date();
        const end = new Date(start);
        end.setMonth(end.getMonth() + currentProject.projectDuration);
        return `${formatThDate(start)} — ${formatThDate(end)}`;
    };

    // video นำหน้า แล้วตามด้วยรูปภาพ
    type MediaItem = { type: 'video' | 'image'; url: string; name: string };
    const mediaList: MediaItem[] = [
        ...(currentProject.video ? [{ type: 'video' as const, url: currentProject.video.url, name: currentProject.video.name }] : []),
        ...(currentProject.files ?? []).map(f => ({ type: 'image' as const, url: f.url, name: f.name })),
    ];
    const [selectedIndex, setSelectedIndex] = useState(0);
    const selected = mediaList[selectedIndex] ?? null;

    return (
        <div className="min-h-screen bg-[#F8F9FA] pb-[100px] pt-[100px]">
            {/* Header (Exit Preview Button) */}
            <div className="w-full flex justify-end p-[20px] max-w-7xl mx-auto">
                <button
                    onClick={() => navigate(-1)}
                    className="border border-border bg-white text-foreground px-[20px] py-[8px] rounded-[6px] text-[14px] font-medium hover:bg-gray-50 transition-colors"
                >
                    ออกจากดูตัวอย่าง
                </button>
            </div>

            <main className="max-w-7xl mx-auto px-[20px]">
                {/* Project Header Info */}
                <div className="flex flex-col gap-[10px] mb-[30px]">
                    <div className="inline-flex w-fit items-center px-[12px] py-[4px] rounded-full border border-border bg-white text-[12px] font-medium text-foreground">
                        {currentProject.category || "ไม่ได้ระบุหมวดหมู่"}
                    </div>
                    <h1 className="text-[36px] font-bold text-foreground leading-tight">
                        {currentProject.title || "ไม่ได้ระบุชื่อโปรเจกต์"}
                    </h1>
                    <p className="text-[16px] text-muted-foreground w-full max-w-[800px]">
                        {currentProject.description || "ไม่ได้ระบุคำอธิบายโปรเจกต์"}
                    </p>
                </div>

                <div className="flex flex-col lg:flex-row gap-[30px]">
                    {/* Left Column (Media & Tabs) */}
                    <div className="flex-1 flex flex-col gap-[20px]">
                        {/* Main Media */}
                        <div className="w-full aspect-[16/10] bg-white rounded-[16px] border border-border overflow-hidden">
                            {selected ? (
                                selected.type === 'video' ? (
                                    <video src={selected.url} controls className="w-full h-full object-cover" />
                                ) : (
                                    <img src={selected.url} alt={selected.name} className="w-full h-full object-cover" />
                                )
                            ) : (
                                <div className="w-full h-full flex items-center justify-center bg-gray-100 text-muted-foreground">
                                    ไม่มีรูปภาพ
                                </div>
                            )}
                        </div>

                        {/* Thumbnails */}
                        {mediaList.length > 0 ? (
                            <div className="flex gap-[10px] overflow-x-auto pb-2">
                                {mediaList.map((media, idx) => (
                                    <div
                                        key={idx}
                                        onClick={() => setSelectedIndex(idx)}
                                        className={`w-[80px] h-[60px] flex-shrink-0 border-2 rounded-[8px] overflow-hidden cursor-pointer transition-colors ${selectedIndex === idx ? 'border-primary' : 'border-border hover:border-primary/50'}`}
                                    >
                                        {media.type === 'video' ? (
                                            <video src={media.url} className="w-full h-full object-cover pointer-events-none" />
                                        ) : (
                                            <img src={media.url} alt={media.name} className="w-full h-full object-cover" />
                                        )}
                                    </div>
                                ))}
                            </div>
                        ) : (
                            <div className="flex gap-[10px]">
                                {[1, 2, 3, 4, 5].map((_, i) => (
                                    <div key={i} className="w-[80px] h-[60px] bg-white border border-border rounded-[8px]" />
                                ))}
                            </div>
                        )}

                        {/* Tabs Navigation */}
                        <div className="flex flex-wrap md:flex-nowrap bg-[#F1F3F5] rounded-[8px] p-[4px] mt-[10px] overflow-x-auto">
                            <button
                                onClick={() => setActiveTab('story')}
                                className={`flex-1 min-w-[100px] flex justify-center py-[8px] px-[16px] rounded-[6px] text-[12px] transition-colors ${activeTab === 'story' ? 'bg-white text-foreground font-semibold shadow-sm' : 'text-muted-foreground hover:text-foreground font-medium'}`}
                            >
                                เรื่องราว
                            </button>
                            <button
                                onClick={() => setActiveTab('milestone')}
                                className={`flex-1 min-w-[100px] flex justify-center py-[8px] px-[16px] rounded-[6px] text-[12px] transition-colors ${activeTab === 'milestone' ? 'bg-white text-foreground font-semibold shadow-sm' : 'text-muted-foreground hover:text-foreground font-medium'}`}
                            >
                                Milestone ({activeMilestones.length})
                            </button>
                            <button
                                onClick={() => setActiveTab('update')}
                                className={`flex-1 min-w-[100px] flex justify-center py-[8px] px-[16px] rounded-[6px] text-[12px] transition-colors ${activeTab === 'update' ? 'bg-white text-foreground font-semibold shadow-sm' : 'text-muted-foreground hover:text-foreground font-medium'}`}
                            >
                                อัปเดต ({updates.length})
                            </button>
                            <button
                                onClick={() => setActiveTab('comment')}
                                className={`flex-1 min-w-[100px] flex justify-center py-[8px] px-[16px] rounded-[6px] text-[12px] transition-colors ${activeTab === 'comment' ? 'bg-white text-foreground font-semibold shadow-sm' : 'text-muted-foreground hover:text-foreground font-medium'}`}
                            >
                                ความคิดเห็น ({threads.length})
                            </button>
                            <button
                                onClick={() => setActiveTab('question')}
                                className={`flex-1 min-w-[100px] flex justify-center py-[8px] px-[16px] rounded-[6px] text-[12px] transition-colors ${activeTab === 'question' ? 'bg-white text-foreground font-semibold shadow-sm' : 'text-muted-foreground hover:text-foreground font-medium'}`}
                            >
                                คำถาม ({faqs.length})
                            </button>
                        </div>

                        {/* Tab Content */}
                        <div className="w-full mt-[10px]">
                            {activeTab === 'story' && <PreviewStory story={currentProject.story} risks={currentProject.risks} />}
                            {activeTab === 'milestone' && <PreviewMilestone milestones={currentProject.milestones ?? []} />}
                            {activeTab === 'update' && <PreviewUpdate updates={updates} />}
                            {activeTab === 'comment' && <PreviewComment comments={threads} />}
                            {activeTab === 'question' && <PreviewQuestion questions={faqs} />}
                        </div>
                    </div>

                    {/* Right Column (Sidebar Funding Info) */}
                    <div className="w-full lg:w-[380px] flex flex-col gap-[20px]">
                        {/* Funding Card */}
                        <div className="bg-white border border-border rounded-[16px] p-[24px] flex flex-col shadow-sm relative overflow-hidden">
                            <div className="absolute top-0 left-0 w-full h-[4px] bg-gradient-to-r from-primary to-purple-300"></div>

                            <h2 className="text-[32px] font-bold text-primary tracking-tight">฿0</h2>
                            <p className="text-[13px] text-muted-foreground mt-[2px]">
                                {targetGoal > 0 ? `เป้าหมาย ฿${formatCurrency(targetGoal)} • 0%` : "ยังไม่ได้กำหนดเป้าหมาย • 0%"}
                            </p>

                            <div className="flex items-center justify-between border-y border-border py-[16px] mt-[24px]">
                                <div className="flex flex-col items-center flex-1 border-r border-border">
                                    <div className="flex items-center gap-[6px] text-foreground font-semibold text-[16px]">
                                        <Users size={16} /> {investorCount}
                                    </div>
                                    <span className="text-[12px] text-muted-foreground">ผู้สนับสนุน</span>
                                </div>
                                <div className="flex flex-col items-center flex-1 border-r border-border">
                                    <div className="flex items-center gap-[6px] text-foreground font-semibold text-[16px]">
                                        <Clock size={16} /> {currentProject.campaignDuration || 0}
                                    </div>
                                    <span className="text-[12px] text-muted-foreground">วันที่เหลือ</span>
                                </div>
                                <div className="flex flex-col items-center flex-1">
                                    <div className="flex items-center gap-[6px] text-foreground font-semibold text-[16px]">
                                        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M12 2v20M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6" /></svg>
                                        {profitShare} %
                                    </div>
                                    <span className="text-[12px] text-muted-foreground">ส่วนแบ่งกำไร</span>
                                </div>
                            </div>

                            <div className="flex flex-col gap-[12px] mt-[20px] mb-[24px]">
                                <div className="flex justify-between items-center text-[13px]">
                                    <span className="text-muted-foreground">ลงทุนขั้นต่ำ</span>
                                    <span className="font-semibold text-foreground">
                                        {currentProject.minInvestAmount > 0 ? `฿${formatCurrency(currentProject.minInvestAmount)}` : 'ยังไม่ได้กำหนด'}
                                    </span>
                                </div>
                                <div className="flex justify-between items-center text-[13px]">
                                    <span className="text-muted-foreground">ลงทุนได้สูงสุด</span>
                                    <span className="font-semibold text-foreground">
                                        {(() => {
                                            const remaining = targetGoal > 0 ? targetGoal : 0;
                                            const effectiveMax = currentProject.maxInvestAmount > 0
                                                ? Math.min(currentProject.maxInvestAmount, remaining)
                                                : remaining;
                                            return effectiveMax > 0 ? `฿${formatCurrency(effectiveMax)}` : 'ยังไม่ได้กำหนด';
                                        })()}
                                    </span>
                                </div>
                                <div className="flex justify-between items-center text-[13px]">
                                    <span className="text-muted-foreground">ระยะเวลา</span>
                                    <span className="font-semibold text-foreground text-right w-[150px] truncate">
                                        {getProjectDateRange()}
                                    </span>
                                </div>
                            </div>

                            <div className="w-full flex justify-center text-primary font-bold text-[14px] mb-[12px]">
                                กำลังสร้างโปรเจกต์
                            </div>

                            <div className="flex gap-[12px]">
                                <button className="flex-1 bg-primary hover:bg-primary-hover text-white h-[44px] rounded-[10px] flex justify-center items-center gap-[8px] font-medium transition-colors">
                                    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="m11 17 2 2a1 1 0 1 0 3-3" /><path d="m14 14 2.5 2.5a1 1 0 1 0 3-3l-3.88-3.88a3 3 0 0 0-4.24 0l-.88.88a1 1 0 1 1-3-3l2.81-2.81a5.79 5.79 0 0 1 7.06-.87l.47.28a2 2 0 0 0 1.42.25L21 4" /><path d="m21 3-6 11.5" /><path d="M3 21 16 8" /><path d="m3 21 8.5-6.5" /></svg>
                                    <span>ลงทุนโปรเจกต์นี้</span>
                                </button>
                                <button className="w-[44px] h-[44px] bg-secondary border border-border rounded-[10px] flex justify-center items-center text-foreground hover:bg-mute transition-colors">
                                    <Flag size={18} />
                                </button>
                            </div>
                        </div>

                        {/* Creator Profile */}
                        <div className="bg-white border border-border rounded-[16px] p-[20px] shadow-sm flex flex-col gap-[16px]">
                            <h3 className="text-[12px] text-muted-foreground font-medium">ผู้สร้างโปรเจกต์</h3>
                            <div className="flex items-center gap-[12px]">
                                <div className="w-[44px] h-[44px] rounded-full bg-gray-200 overflow-hidden border border-border">
                                    {authUser?.profile_url ? (
                                        <img src={authUser.profile_url as string} alt="Creator" className="w-full h-full object-cover" />
                                    ) : (
                                        <div className="w-full h-full flex items-center justify-center text-foreground font-bold text-[16px]">
                                            {(authUser?.name as string)?.[0] ?? '?'}
                                        </div>
                                    )}
                                </div>
                                <div className="flex flex-col">
                                    <span className="text-[14px] font-bold text-foreground">{(authUser?.name as string) || "ผู้สร้างโปรเจกต์"}</span>
                                    <span className="text-[12px] text-muted-foreground">{(authUser?.email as string) || ""}</span>
                                </div>
                            </div>
                            <div className="flex items-center gap-[12px]">
                                <span className="inline-flex items-center gap-[4px] border border-primary text-primary px-[8px] py-[2px] rounded-full text-[10px] font-medium">
                                    <CheckCircle2 size={12} /> ยืนยันแล้ว
                                </span>
                            </div>
                        </div>

                        {/* Trust & Safety Banner */}
                        <div className="bg-[#FAF8FF] border border-[#E9D5FF] rounded-[16px] p-[20px] flex flex-col items-center justify-center text-center gap-[8px]">
                            <Shield className="text-foreground" size={24} />
                            <h4 className="text-[13px] font-bold text-foreground">ปลอดภัยด้วยระบบ Milestone</h4>
                            <p className="text-[11px] text-muted-foreground leading-snug">
                                เงินลงทุนจะถูกปล่อยเป็นงวดตาม Milestone ที่ผ่านการโหวตจากผู้สนับสนุน
                            </p>
                        </div>
                    </div>
                </div>
            </main>
        </div>
    );
};

export default Preview;
