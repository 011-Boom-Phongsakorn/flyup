import { useState, useEffect, useMemo } from "react"
import { useParams, useNavigate } from "react-router"
import {
    ArrowLeft,
    CheckCircle,
    XCircle,
    Loader2,
    Users,
    Clock,
    Shield,
} from "lucide-react"
import api from "../../services/api"
import toast from "react-hot-toast"
import { AxiosError } from "axios"
import { PreviewUpdate, PreviewComment } from "../../components/preview/PreviewMisc"

// ── Types ─────────────────────────────────────────────────────────────────────
interface ProjectMedia {
    id: number
    type: string
    url: string
    sort_order: number
}

interface Milestone {
    id: number
    phase_no: number
    title: string
    description: string | null
    percent_release: number
    status: string
}

interface StorySection {
    id: number
    title: string
    body: string
    sort_order: number
}

interface ProjectFAQ {
    id: number
    question: string
    answer: string
}

interface ProjectOwner {
    first_name: string
    last_name: string
    email: string
}

interface AdminProjectDetail {
    id: number
    title: string
    description: string | null
    risk: string | null
    state: string
    funding_goal: number
    softcap: number
    current_funding: number
    profit_share_pct: number
    min_invest_amount: number
    max_invest_amount: number
    duration_days: number
    duration_months: number
    platform_fee: number
    CreatedAt: string
    owner: ProjectOwner | null
    media: ProjectMedia[]
    milestones: Milestone[]
    stories: StorySection[]
    faqs: ProjectFAQ[]
}

// ── Helpers ───────────────────────────────────────────────────────────────────
const fmt = (n: number) => new Intl.NumberFormat("th-TH").format(n)

type Tab = "story" | "milestone" | "update" | "comment" | "faq"

// ── Component ─────────────────────────────────────────────────────────────────
const AdminProjectDetail = () => {
    const { id } = useParams()
    const navigate = useNavigate()

    const [project, setProject] = useState<AdminProjectDetail | null>(null)
    const [updates, setUpdates] = useState<{ id: number; title: string; content: string; created_at: string }[]>([])
    const [threads, setThreads] = useState<{ id: number; title: string; body: string; user_name: string; created_at: string }[]>([])
    const [isLoading, setIsLoading] = useState(true)
    const [actionLoading, setActionLoading] = useState<"approve" | "reject" | null>(null)
    const [selectedMedia, setSelectedMedia] = useState(0)
    const [activeTab, setActiveTab] = useState<Tab>("story")

    useEffect(() => {
        if (!id) return
        setIsLoading(true)
        Promise.all([
            api.get(`/admin/projects/${id}/detail/pending-review`),
            api.get(`/projects/${id}/updates`).catch(() => ({ data: { data: [] } })),
            api.get(`/projects/${id}/threads`).catch(() => ({ data: { data: [] } })),
        ])
            .then(([projRes, updatesRes, threadsRes]) => {
                setProject(projRes.data?.data ?? null)
                setUpdates(updatesRes.data?.data ?? [])
                setThreads(threadsRes.data?.data ?? [])
            })
            .catch(() => toast.error("โหลดข้อมูลไม่สำเร็จ"))
            .finally(() => setIsLoading(false))
    }, [id])

    const handleAction = async (action: "approve" | "reject") => {
        if (!project) return
        setActionLoading(action)
        try {
            if (action === "approve") {
                await api.patch(`/admin/projects/${project.id}/approve`)
                toast.success("อนุมัติโปรเจกต์สำเร็จ")
            } else {
                await api.patch(`/admin/projects/${project.id}/reject`)
                toast.success("ปฏิเสธโปรเจกต์แล้ว")
            }
            navigate("/admin/projects-approval")
        } catch (error) {
            const msg = error instanceof AxiosError ? error.response?.data?.message : null
            toast.error(msg || "เกิดข้อผิดพลาด")
        } finally {
            setActionLoading(null)
        }
    }

    // ── Derived ────────────────────────────────────────────────────────────────
    const images = project?.media.filter((m) => m.type === "image").sort((a, b) => a.sort_order - b.sort_order) ?? []
    const displayImages = images.length > 0 ? images : null

    const storyHtml = useMemo(() => {
        if (!project?.stories?.length) return ""
        return project.stories
            .slice()
            .sort((a, b) => a.sort_order - b.sort_order)
            .map((s) => s.body)
            .join("")
    }, [project?.stories])

    const ownerName = project?.owner
        ? `${project.owner.first_name} ${project.owner.last_name}`.trim()
        : "-"

    const durationLabel =
        project?.duration_months && project.duration_months > 0
            ? `${project.duration_months} เดือน`
            : project?.duration_days && project.duration_days > 0
            ? `${project.duration_days} วัน`
            : "-"

    // ── Loading / Not found ────────────────────────────────────────────────────
    if (isLoading) {
        return (
            <div className="flex items-center justify-center min-h-[400px]">
                <Loader2 size={28} className="animate-spin text-primary" />
            </div>
        )
    }

    if (!project) {
        return (
            <div className="flex flex-col items-center justify-center min-h-[400px] gap-[12px] text-muted-foreground">
                <p className="text-[15px]">ไม่พบโปรเจกต์</p>
                <button
                    onClick={() => navigate(-1)}
                    className="text-[13px] text-primary hover:underline"
                >
                    กลับไปหน้าก่อน
                </button>
            </div>
        )
    }

    return (
        <div className="min-h-screen pb-[80px]">
            {/* Sticky top bar */}
            <div className="sticky top-0 z-[1] px-[24px] py-[12px] flex items-center justify-between">
                <button
                    onClick={() => navigate(-1)}
                    className="flex items-center gap-[6px] text-[13px] text-muted-foreground hover:text-foreground transition-colors cursor-pointer"
                >
                    <ArrowLeft size={16} />
                    กลับ
                </button>

                <div className="flex items-center gap-[8px]">
                    <button
                        onClick={() => handleAction("reject")}
                        disabled={!!actionLoading}
                        className="flex items-center gap-[6px] px-[16px] py-[8px] rounded-[10px] bg-red-50 text-red-600 border border-red-200 hover:bg-red-100 transition-colors disabled:opacity-50 text-[13px] font-medium cursor-pointer"
                    >
                        {actionLoading === "reject" ? (
                            <Loader2 size={14} className="animate-spin" />
                        ) : (
                            <XCircle size={14} />
                        )}
                        ปฏิเสธ
                    </button>
                    <button
                        onClick={() => handleAction("approve")}
                        disabled={!!actionLoading}
                        className="flex items-center gap-[6px] px-[16px] py-[8px] rounded-[10px] bg-green-600 text-white hover:bg-green-700 transition-colors disabled:opacity-50 text-[13px] font-medium cursor-pointer"
                    >
                        {actionLoading === "approve" ? (
                            <Loader2 size={14} className="animate-spin" />
                        ) : (
                            <CheckCircle size={14} />
                        )}
                        อนุมัติ
                    </button>
                </div>
            </div>

            <main className="max-w-7xl mx-auto px-[20px] pt-[32px]">
                {/* Project Header */}
                <div className="flex flex-col gap-[10px] mb-[30px]">
                    <span className="inline-flex w-fit items-center px-[12px] py-[4px] rounded-full border border-border bg-white text-[12px] font-medium text-foreground">
                        รอตรวจสอบ
                    </span>
                    <h1 className="text-[36px] font-bold text-foreground leading-tight">
                        {project.title}
                    </h1>
                    {project.description && (
                        <p className="text-[16px] text-muted-foreground max-w-[800px]">
                            {project.description}
                        </p>
                    )}
                </div>

                <div className="flex flex-col lg:flex-row gap-[30px]">
                    {/* ── Left Column ──────────────────────────────────────── */}
                    <div className="flex-1 flex flex-col gap-[20px]">
                        {/* Main Media */}
                        <div className="w-full aspect-[16/10] bg-white rounded-[16px] border border-border overflow-hidden">
                            {displayImages ? (
                                <img
                                    src={displayImages[selectedMedia]?.url}
                                    alt="project"
                                    className="w-full h-full object-cover"
                                />
                            ) : (
                                <div className="w-full h-full flex items-center justify-center bg-gray-100 text-muted-foreground text-[14px]">
                                    ไม่มีรูปภาพ
                                </div>
                            )}
                        </div>

                        {/* Thumbnails */}
                        {displayImages && displayImages.length > 1 && (
                            <div className="flex gap-[10px] overflow-x-auto pb-1">
                                {displayImages.map((m, i) => (
                                    <button
                                        key={m.id}
                                        onClick={() => setSelectedMedia(i)}
                                        className={`w-[80px] h-[60px] flex-shrink-0 border-2 rounded-[8px] overflow-hidden transition-colors ${
                                            selectedMedia === i
                                                ? "border-primary"
                                                : "border-border hover:border-primary/50"
                                        }`}
                                    >
                                        <img
                                            src={m.url}
                                            alt=""
                                            className="w-full h-full object-cover"
                                        />
                                    </button>
                                ))}
                            </div>
                        )}

                        {/* Tabs */}
                        <div className="flex bg-[#F1F3F5] rounded-[8px] p-[4px]">
                            {(
                                [
                                    { key: "story", label: "เรื่องราว" },
                                    { key: "milestone", label: `Milestone (${project.milestones.length})` },
                                    { key: "update", label: `อัปเดต (${updates.length})` },
                                    { key: "comment", label: `ความคิดเห็น (${threads.length})` },
                                    { key: "faq", label: `คำถาม (${project.faqs.length})` },
                                ] as { key: Tab; label: string }[]
                            ).map(({ key, label }) => (
                                <button
                                    key={key}
                                    onClick={() => setActiveTab(key)}
                                    className={`flex-1 py-[8px] px-[16px] rounded-[6px] text-[12px] transition-colors ${
                                        activeTab === key
                                            ? "bg-white text-foreground font-semibold shadow-sm"
                                            : "text-muted-foreground hover:text-foreground font-medium"
                                    }`}
                                >
                                    {label}
                                </button>
                            ))}
                        </div>

                        {/* Tab Content */}
                        <div className="w-full">
                            {activeTab === "story" && (
                                <StoryTab html={storyHtml} risk={project.risk} />
                            )}
                            {activeTab === "milestone" && (
                                <MilestoneTab
                                    milestones={project.milestones}
                                    fundingGoal={project.funding_goal}
                                />
                            )}
                            {activeTab === "update" && (
                                <PreviewUpdate updates={updates} />
                            )}
                            {activeTab === "comment" && (
                                <PreviewComment comments={threads} />
                            )}
                            {activeTab === "faq" && (
                                <FAQTab faqs={project.faqs} />
                            )}
                        </div>
                    </div>

                    {/* ── Right Column ─────────────────────────────────────── */}
                    <div className="w-full lg:w-[380px] flex flex-col gap-[20px]">
                        {/* Funding Card */}
                        <div className="bg-white border border-border rounded-[16px] p-[24px] flex flex-col shadow-sm relative overflow-hidden">
                            <div className="absolute top-0 left-0 w-full h-[4px] bg-gradient-to-r from-primary to-purple-300" />

                            <h2 className="text-[32px] font-bold text-primary tracking-tight">
                                ฿{fmt(project.funding_goal)}
                            </h2>
                            <p className="text-[13px] text-muted-foreground mt-[2px]">
                                เป้าหมายการระดมทุน
                            </p>

                            <div className="flex items-center justify-between border-y border-border py-[16px] mt-[24px]">
                                <div className="flex flex-col items-center flex-1 border-r border-border">
                                    <div className="flex items-center gap-[6px] text-foreground font-semibold text-[16px]">
                                        <Users size={16} />
                                        0
                                    </div>
                                    <span className="text-[12px] text-muted-foreground">ผู้สนับสนุน</span>
                                </div>
                                <div className="flex flex-col items-center flex-1 border-r border-border">
                                    <div className="flex items-center gap-[6px] text-foreground font-semibold text-[16px]">
                                        <Clock size={16} />
                                        {durationLabel}
                                    </div>
                                    <span className="text-[12px] text-muted-foreground">ระยะเวลา</span>
                                </div>
                                <div className="flex flex-col items-center flex-1">
                                    <div className="flex items-center gap-[6px] text-foreground font-semibold text-[16px]">
                                        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                            <path d="M12 2v20M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6" />
                                        </svg>
                                        {project.profit_share_pct}%
                                    </div>
                                    <span className="text-[12px] text-muted-foreground">ส่วนแบ่งกำไร</span>
                                </div>
                            </div>

                            <div className="flex flex-col gap-[12px] mt-[20px] mb-[24px]">
                                <InfoRow
                                    label="Softcap"
                                    value={`฿${fmt(project.softcap)}`}
                                />
                                <InfoRow
                                    label="ลงทุนขั้นต่ำ"
                                    value={project.min_invest_amount > 0 ? `฿${fmt(project.min_invest_amount)}` : "-"}
                                />
                                <InfoRow
                                    label="ลงทุนสูงสุด"
                                    value={project.max_invest_amount > 0 ? `฿${fmt(project.max_invest_amount)}` : "-"}
                                />
                                <InfoRow
                                    label="ค่าธรรมเนียม Platform"
                                    value={`${project.platform_fee}%`}
                                />
                            </div>

                        </div>

                        {/* Creator Profile */}
                        <div className="bg-white border border-border rounded-[16px] p-[20px] shadow-sm flex flex-col gap-[16px]">
                            <h3 className="text-[12px] text-muted-foreground font-medium">ผู้สร้างโปรเจกต์</h3>
                            <div className="flex items-center gap-[12px]">
                                <div className="w-[44px] h-[44px] rounded-full bg-primary/10 flex items-center justify-center text-primary font-bold text-[16px]">
                                    {project.owner?.first_name?.[0] ?? "?"}
                                </div>
                                <div className="flex flex-col">
                                    <span className="text-[14px] font-bold text-foreground">{ownerName}</span>
                                    <span className="text-[12px] text-muted-foreground">
                                        {project.owner?.email ?? ""}
                                    </span>
                                </div>
                            </div>
                        </div>

                        {/* Trust Banner */}
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
    )
}

// ── Sub-components ────────────────────────────────────────────────────────────

const StoryTab = ({ html, risk }: { html: string; risk: string | null }) => {
    const { processedHtml, toc } = useMemo(() => {
        if (!html || typeof window === "undefined") return { processedHtml: "", toc: [] }
        const doc = new DOMParser().parseFromString(html, "text/html")
        const headings = Array.from(doc.querySelectorAll("h1, h2, h3"))
        const tocList = headings.map((h, i) => {
            const headingId = h.id || `heading-${i}`
            h.id = headingId
            return { id: headingId, text: h.textContent || "", level: Number(h.tagName.replace("H", "")) }
        })
        return { processedHtml: doc.body.innerHTML, toc: tocList }
    }, [html])

    if (!html && !risk) {
        return (
            <div className="flex items-center justify-center py-[60px] text-muted-foreground text-[14px]">
                ไม่มีเรื่องราว
            </div>
        )
    }

    return (
        <div className="flex flex-col md:flex-row gap-[40px] mt-[20px] items-start">
            {toc.length > 0 && (
                <div className="hidden md:block w-[200px] shrink-0 sticky top-[72px]">
                    <div className="flex flex-col gap-[10px] border-l-2 border-border pl-[14px]">
                        <p className="text-[13px] font-bold text-foreground">สารบัญ</p>
                        {toc.map((item) => (
                            <a
                                key={item.id}
                                href={`#${item.id}`}
                                onClick={(e) => {
                                    e.preventDefault()
                                    document.getElementById(item.id)?.scrollIntoView({ behavior: "smooth", block: "start" })
                                }}
                                className="text-[12px] text-muted-foreground hover:text-primary transition-colors"
                                style={{ marginLeft: `${(item.level - 1) * 8}px` }}
                            >
                                {item.text}
                            </a>
                        ))}
                    </div>
                </div>
            )}
            <div className="flex-1 flex flex-col gap-[20px] min-w-0">
                {html && (
                    <div
                        className="prose prose-slate max-w-[800px] text-foreground text-[15px] leading-relaxed [&_h1]:text-[24px] [&_h1]:font-bold [&_h2]:text-[20px] [&_h2]:font-bold [&_h3]:text-[18px] [&_h3]:font-bold [&_h1]:mb-[12px] [&_h2]:mb-[12px] [&_h3]:mb-[12px] [&_p]:mb-[12px] [&_ul]:mb-[12px] [&_li]:mb-[4px] [&_img]:rounded-[12px] [&_img]:my-[20px]"
                        dangerouslySetInnerHTML={{ __html: processedHtml }}
                    />
                )}
                {risk && (
                    <div className="border border-[#FCD34D] bg-[#FEF3C7]/40 rounded-[12px] p-[20px] flex gap-[16px] max-w-[800px]">
                        <div className="text-[#D97706] mt-1 shrink-0">
                            <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                <path d="m21.73 18-8-14a2 2 0 0 0-3.48 0l-8 14A2 2 0 0 0 4 21h16a2 2 0 0 0 1.73-3Z" />
                                <line x1="12" y1="9" x2="12" y2="13" />
                                <line x1="12" y1="17" x2="12.01" y2="17" />
                            </svg>
                        </div>
                        <div className="flex flex-col gap-[4px]">
                            <h3 className="text-[14px] font-bold text-foreground">ความเสี่ยงและความท้าทาย</h3>
                            <div
                                className="text-[13px] text-muted-foreground leading-relaxed"
                                dangerouslySetInnerHTML={{ __html: risk }}
                            />
                        </div>
                    </div>
                )}
            </div>
        </div>
    )
}

const MilestoneTab = ({
    milestones,
    fundingGoal,
}: {
    milestones: Milestone[]
    fundingGoal: number
}) => {
    if (milestones.length === 0) {
        return (
            <div className="flex items-center justify-center py-[60px] border border-dashed border-border rounded-[16px] text-muted-foreground text-[14px] mt-[20px]">
                ยังไม่ได้กำหนด Milestone
            </div>
        )
    }

    return (
        <div className="flex flex-col gap-[24px] mt-[20px] relative">
            <div className="absolute left-[24px] top-[24px] bottom-[24px] w-[1px] bg-border hidden md:block" />
            {milestones
                .slice()
                .sort((a, b) => a.phase_no - b.phase_no)
                .map((m, idx) => {
                    const amount = fundingGoal > 0 ? (fundingGoal * m.percent_release) / 100 : 0
                    return (
                        <div key={m.id} className="flex gap-[20px] relative z-10">
                            <div
                                className={`hidden md:flex shrink-0 w-[48px] h-[48px] rounded-full items-center justify-center font-bold text-[20px] shadow-sm ${
                                    idx === 0 ? "bg-primary text-white" : "bg-white border border-border text-foreground"
                                }`}
                            >
                                {m.phase_no}
                            </div>
                            <div className="flex-1 bg-white border border-border rounded-[16px] p-[24px] shadow-sm flex flex-col xl:flex-row justify-between xl:items-start gap-[20px]">
                                <div className="flex flex-col gap-[8px] flex-1">
                                    <h3 className="text-[16px] font-bold text-foreground">{m.title}</h3>
                                    {m.description && (
                                        <p className="text-[14px] text-muted-foreground">{m.description}</p>
                                    )}
                                </div>
                                <div className="flex flex-row xl:flex-col items-center xl:items-end justify-between gap-[12px] shrink-0">
                                    <span className="text-[20px] font-bold text-primary">
                                        {amount > 0 ? `฿${new Intl.NumberFormat("th-TH").format(amount)}` : `${m.percent_release}%`}
                                    </span>
                                    <span className="px-[12px] py-[4px] rounded-full text-[12px] font-medium border bg-white text-foreground border-border">
                                        รอดำเนินการ
                                    </span>
                                </div>
                            </div>
                        </div>
                    )
                })}
        </div>
    )
}

const FAQTab = ({ faqs }: { faqs: ProjectFAQ[] }) => {
    const [openId, setOpenId] = useState<number | null>(null)

    if (faqs.length === 0) {
        return (
            <div className="flex items-center justify-center py-[60px] text-muted-foreground text-[14px] mt-[20px]">
                ไม่มีคำถาม
            </div>
        )
    }

    return (
        <div className="flex flex-col gap-[12px] mt-[20px]">
            {faqs.map((faq) => (
                <div key={faq.id} className="bg-white border border-border rounded-[12px] overflow-hidden">
                    <button
                        onClick={() => setOpenId(openId === faq.id ? null : faq.id)}
                        className="w-full flex items-center justify-between px-[20px] py-[16px] text-left"
                    >
                        <span className="text-[14px] font-semibold text-foreground">{faq.question}</span>
                        <span className="text-muted-foreground text-[18px] leading-none ml-[12px]">
                            {openId === faq.id ? "−" : "+"}
                        </span>
                    </button>
                    {openId === faq.id && (
                        <div className="px-[20px] pb-[16px] text-[14px] text-muted-foreground leading-relaxed border-t border-border pt-[12px]">
                            {faq.answer}
                        </div>
                    )}
                </div>
            ))}
        </div>
    )
}

const InfoRow = ({ label, value }: { label: string; value: string }) => (
    <div className="flex items-center justify-between text-[13px]">
        <span className="text-muted-foreground">{label}</span>
        <span className="font-semibold text-foreground">{value}</span>
    </div>
)

export default AdminProjectDetail
