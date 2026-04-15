import { useState, useEffect, useMemo } from "react"
import { useParams, useNavigate } from "react-router"
import {
    ArrowLeft,
    CheckCircle,
    CheckCircle2,
    XCircle,
    Loader2,
    Users,
    Clock,
    Shield,
    Calendar,
} from "lucide-react"
import api from "../../services/api"
import toast from "react-hot-toast"
import { AxiosError } from "axios"
import PreviewStory from "../../components/preview/PreviewStory"
import { PreviewUpdate, PreviewQuestion, PreviewComment } from "../../components/preview/PreviewMisc"

// ── Types ─────────────────────────────────────────────────────────────────────
interface ProjectMedia {
    id: number
    type: string | string[]
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
    duration?: number
    acceptance_criteria?: string | null
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
    picture?: string | null
    student_profile?: {
        bio?: string | null
        university?: {
            name_th?: string | null
        } | null
    } | null
    student_card_verification?: {
        status?: string | null
    } | null
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
    const getMediaType = (t: string | string[]) => (Array.isArray(t) ? t[0] ?? "" : t)
    type MediaItem = { type: "video" | "image"; url: string; id: number }
    const mediaList: MediaItem[] = project
        ? [
              ...project.media
                  .filter((m) => getMediaType(m.type) === "video")
                  .map((m) => ({ type: "video" as const, url: m.url, id: m.id })),
              ...project.media
                  .filter((m) => getMediaType(m.type) === "image")
                  .sort((a, b) => a.sort_order - b.sort_order)
                  .map((m) => ({ type: "image" as const, url: m.url, id: m.id })),
          ]
        : []
    const selectedItem = mediaList[selectedMedia] ?? null

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
                            {selectedItem ? (
                                selectedItem.type === "video" ? (
                                    <video src={selectedItem.url} controls className="w-full h-full object-cover" />
                                ) : (
                                    <img src={selectedItem.url} alt="project" className="w-full h-full object-cover" />
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
                                {mediaList.map((m, i) => (
                                    <div
                                        key={m.id}
                                        onClick={() => setSelectedMedia(i)}
                                        className={`w-[80px] h-[60px] flex-shrink-0 border-2 rounded-[8px] overflow-hidden cursor-pointer transition-colors ${
                                            selectedMedia === i
                                                ? "border-primary"
                                                : "border-border hover:border-primary/50"
                                        }`}
                                    >
                                        {m.type === "video" ? (
                                            <video src={m.url} className="w-full h-full object-cover pointer-events-none" />
                                        ) : (
                                            <img src={m.url} alt="" className="w-full h-full object-cover" />
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

                        {/* Tabs */}
                        <div className="flex flex-wrap md:flex-nowrap bg-[#F1F3F5] rounded-[8px] p-[4px] mt-[10px] overflow-x-auto">
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
                                    className={`flex-1 min-w-[100px] flex justify-center py-[8px] px-[16px] rounded-[6px] text-[12px] transition-colors cursor-pointer ${
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
                        <div className="w-full mt-[10px]">
                            {activeTab === "story" && (
                                <PreviewStory story={storyHtml} risks={project.risk ?? undefined} />
                            )}
                            {activeTab === "milestone" && (
                                <MilestoneTab
                                    milestones={project.milestones}
                                    fundingGoal={project.funding_goal}
                                    campaignDuration={project.duration_days || (project.duration_months * 30)}
                                />
                            )}
                            {activeTab === "update" && (
                                <PreviewUpdate updates={updates} />
                            )}
                            {activeTab === "comment" && (
                                <PreviewComment comments={threads} />
                            )}
                            {activeTab === "faq" && (
                                <PreviewQuestion questions={project.faqs} />
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
                                <div className="flex justify-between items-center text-[13px]">
                                    <span className="text-muted-foreground">Softcap</span>
                                    <span className="font-semibold text-foreground">฿{fmt(project.softcap)}</span>
                                </div>
                                <div className="flex justify-between items-center text-[13px]">
                                    <span className="text-muted-foreground">ลงทุนขั้นต่ำ</span>
                                    <span className="font-semibold text-foreground">
                                        {project.min_invest_amount > 0 ? `฿${fmt(project.min_invest_amount)}` : "ยังไม่ได้กำหนด"}
                                    </span>
                                </div>
                                <div className="flex justify-between items-center text-[13px]">
                                    <span className="text-muted-foreground">ลงทุนสูงสุด</span>
                                    <span className="font-semibold text-foreground">
                                        {project.max_invest_amount > 0 ? `฿${fmt(project.max_invest_amount)}` : "ยังไม่ได้กำหนด"}
                                    </span>
                                </div>
                                <div className="flex justify-between items-center text-[13px]">
                                    <span className="text-muted-foreground">ค่าธรรมเนียม Platform</span>
                                    <span className="font-semibold text-foreground">{project.platform_fee}%</span>
                                </div>
                            </div>
                        </div>

                        {/* Creator Profile */}
                        <div className="bg-white border border-border rounded-[16px] p-[20px] shadow-sm flex flex-col gap-[14px]">
                            <h3 className="text-[13px] text-foreground font-semibold">ผู้สร้างโปรเจกต์</h3>
                            <div className="flex items-center gap-[14px]">
                                <div className="w-[48px] h-[48px] rounded-full bg-gray-200 overflow-hidden border border-border flex-shrink-0">
                                    {project.owner?.picture ? (
                                        <img src={project.owner.picture} alt="Creator" className="w-full h-full object-cover" />
                                    ) : (
                                        <div className="w-full h-full flex items-center justify-center text-foreground font-bold text-[18px]">
                                            {project.owner?.first_name?.[0] ?? "?"}
                                        </div>
                                    )}
                                </div>
                                <div className="flex flex-col gap-[2px]">
                                    <span className="text-[14px] font-bold text-foreground leading-tight">{ownerName}</span>
                                    <span className="text-[12px] text-muted-foreground">
                                        {project.owner?.student_profile?.university?.name_th ?? project.owner?.email ?? ""}
                                    </span>
                                </div>
                            </div>
                            {project.owner?.student_profile?.bio && (
                                <div>
                                    <p className="text-[12px] text-muted-foreground">{project.owner.student_profile.bio}</p>
                                </div>
                            )}
                            <div className="flex gap-[20px]">
                                {project.owner?.student_card_verification?.status === "approved" && (
                                    <span className="inline-flex items-center gap-[5px] border border-primary text-primary px-[10px] py-[4px] rounded-full text-[11px] font-medium">
                                        <CheckCircle2 size={13} /> ยืนยันแล้ว
                                    </span>
                                )}
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

// ── MilestoneTab ──────────────────────────────────────────────────────────────
// (ใช้ component นี้แทน PreviewMilestone เพราะ PreviewMilestone อ่านจาก useProjectStore โดยตรง)

const thMonths = ['ม.ค.', 'ก.พ.', 'มี.ค.', 'เม.ย.', 'พ.ค.', 'มิ.ย.', 'ก.ค.', 'ส.ค.', 'ก.ย.', 'ต.ค.', 'พ.ย.', 'ธ.ค.']
const formatThDate = (d: Date) => `${d.getDate()} ${thMonths[d.getMonth()]} ${d.getFullYear() + 543}`

const MilestoneTab = ({
    milestones,
    fundingGoal,
    campaignDuration,
}: {
    milestones: Milestone[]
    fundingGoal: number
    campaignDuration: number
}) => {
    if (milestones.length === 0) {
        return (
            <div className="flex flex-col items-center justify-center gap-[12px] mt-[40px] p-[40px] border border-dashed border-border rounded-[16px] bg-white">
                <span className="text-muted-foreground text-[14px]">ยังไม่ได้กำหนด Milestone</span>
            </div>
        )
    }

    const sorted = milestones.slice().sort((a, b) => a.phase_no - b.phase_no)

    // คำนวณวันเริ่ม/สิ้นสุดของแต่ละ phase เหมือน PreviewMilestone
    const phaseDates = (() => {
        const result: { start: Date; end: Date }[] = []
        let cursor = new Date()
        cursor.setDate(cursor.getDate() + campaignDuration)
        for (const m of sorted) {
            const duration = m.duration ?? 0
            const start = new Date(cursor)
            const end = new Date(cursor)
            end.setDate(end.getDate() + duration)
            result.push({ start, end })
            cursor = new Date(end)
        }
        return result
    })()

    return (
        <div className="flex flex-col gap-[24px] mt-[20px] relative isolate w-full overflow-hidden">
            <div className="absolute left-[24px] top-[24px] bottom-[24px] w-[1px] bg-border z-0 hidden md:block" />
            {sorted.map((m, idx) => {
                const amount = fundingGoal > 0 ? (fundingGoal * m.percent_release) / 100 : 0
                const dates = phaseDates[idx]
                const hasDates = dates && (m.duration ?? 0) > 0 && campaignDuration > 0
                const criteria = (m.acceptance_criteria ?? "").split("\n").filter((c: string) => c.trim())

                return (
                    <div key={m.id} className="flex gap-[20px] relative z-10 w-full">
                        <div
                            className={`hidden md:flex shrink-0 w-[48px] h-[48px] rounded-full items-center justify-center font-bold text-[20px] shadow-sm ${
                                idx === 0 ? "bg-primary text-white" : "bg-white border border-border text-foreground"
                            }`}
                        >
                            {m.phase_no}
                        </div>
                        <div className="flex-1 bg-white border border-border rounded-[16px] p-[24px] shadow-sm flex flex-col gap-[20px]">
                            {/* Top row */}
                            <div className="flex flex-col xl:flex-row justify-between xl:items-start gap-[20px]">
                                <div className="flex flex-col gap-[12px] flex-1">
                                    <div>
                                        <h3 className="text-[16px] font-bold text-foreground">Phase {m.phase_no}: {m.title}</h3>
                                        {m.description && (
                                            <p className="text-[14px] text-muted-foreground mt-[4px]">{m.description}</p>
                                        )}
                                        {hasDates && (
                                            <p className="inline-flex items-center gap-[5px] text-[12px] text-muted-foreground mt-[6px]">
                                                <Calendar size={12} />
                                                <span>กำหนดส่ง: {formatThDate(dates.start)} — {formatThDate(dates.end)}</span>
                                            </p>
                                        )}
                                    </div>
                                    {criteria.length > 0 && (
                                        <div className="flex flex-col gap-[8px] mt-[8px]">
                                            <span className="text-[12px] font-bold text-foreground">สิ่งที่ส่งมอบ:</span>
                                            <div className="flex flex-wrap gap-[8px]">
                                                {criteria.map((c: string, i: number) => (
                                                    <span key={i} className="px-[12px] py-[4px] border border-border rounded-full text-[12px] text-foreground bg-white whitespace-nowrap">
                                                        {c}
                                                    </span>
                                                ))}
                                            </div>
                                        </div>
                                    )}
                                </div>
                                <div className="flex flex-row xl:flex-col items-center xl:items-end justify-between xl:justify-start gap-[12px] shrink-0 mt-[10px] xl:mt-0">
                                    <span className="text-[20px] font-bold text-primary">
                                        {amount > 0 ? `฿${new Intl.NumberFormat("th-TH").format(amount)}` : `${m.percent_release}%`}
                                    </span>
                                    <span className="px-[12px] py-[4px] rounded-full text-[12px] font-medium border bg-white text-foreground border-border">
                                        รอดำเนินการ
                                    </span>
                                </div>
                            </div>
                            {/* Bottom row */}
                            <div className="flex justify-end">
                                <a href="#" className="text-[12px] text-primary hover:text-primary/70 transition-colors">
                                    ดูรายละเอียดเพิ่มเติม
                                </a>
                            </div>
                        </div>
                    </div>
                )
            })}
        </div>
    )
}

export default AdminProjectDetail
