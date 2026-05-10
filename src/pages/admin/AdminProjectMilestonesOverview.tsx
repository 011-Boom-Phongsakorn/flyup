import { useState, useEffect } from 'react'
import { useParams, useNavigate } from 'react-router'
import {
    ArrowLeft,
    Calendar,
    Clock,
    ChevronDown,
    ChevronUp,
    FileText,
    DollarSign,
    Target,
    Loader2,
    Milestone as MilestoneIcon,
} from 'lucide-react'
import toast from 'react-hot-toast'
import { useAdminStore } from '../../store/useAdminStore'

const thMonths = ['ม.ค.', 'ก.พ.', 'มี.ค.', 'เม.ย.', 'พ.ค.', 'มิ.ย.', 'ก.ค.', 'ส.ค.', 'ก.ย.', 'ต.ค.', 'พ.ย.', 'ธ.ค.']
const formatThDate = (d: Date) => `${d.getDate()} ${thMonths[d.getMonth()]} ${d.getFullYear() + 543}`
const fmtBaht = (n: number) => new Intl.NumberFormat('th-TH').format(n)

interface MilestoneCardProps {
    m: {
        id: number
        phase_no: number
        title: string
        description: string | null
        percent_release: number
        duration?: number
        acceptance_criteria?: string | null
    }
    index: number
    totalPhases: number
    fundingGoal: number
    estimatedDates: { start: Date; end: Date } | null
    defaultOpen: boolean
}

const MilestoneCard = ({ m, index, totalPhases, fundingGoal, estimatedDates, defaultOpen }: MilestoneCardProps) => {
    const [isOpen, setIsOpen] = useState(defaultOpen)
    const amount = fundingGoal > 0 ? (fundingGoal * m.percent_release) / 100 : 0
    const criteria = (m.acceptance_criteria ?? '').split('\n').filter((c) => c.trim())
    const hasDates = !!estimatedDates && (m.duration ?? 0) > 0

    return (
        <div className="flex gap-4 sm:gap-6 relative z-10">
            <div className="flex flex-col items-center shrink-0 z-10">
                <div className={`w-12 h-12 sm:w-14 sm:h-14 rounded-2xl flex items-center justify-center font-bold text-lg sm:text-xl shadow-sm transition-all duration-300 ${
                    index === 0
                        ? 'bg-primary text-white shadow-primary/30 ring-4 ring-primary/10'
                        : 'bg-white border-2 border-gray-200 text-gray-400'
                }`}>
                    {m.phase_no}
                </div>
                {index < totalPhases - 1 && (
                    <div className="w-[2px] flex-1 min-h-[24px] mt-2 rounded-full bg-gray-200" />
                )}
            </div>

            <div className="flex-1 mb-6 rounded-2xl border border-gray-200 bg-white hover:shadow-sm transition-all duration-300 overflow-hidden">
                <button onClick={() => setIsOpen(!isOpen)} className="w-full p-5 sm:p-6 text-left cursor-pointer focus:outline-none">
                    <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-3">
                        <div className="flex-1 min-w-0">
                            <div className="flex items-center gap-2 flex-wrap mb-1">
                                <h3 className="text-base sm:text-lg font-bold text-gray-900">Phase {m.phase_no}: {m.title}</h3>
                                <span className="inline-flex items-center gap-1 text-[11px] font-semibold px-2.5 py-0.5 rounded-full border bg-gray-50 text-gray-500 border-gray-200">
                                    รอดำเนินการ
                                </span>
                            </div>
                            {m.description && (
                                <p className={`text-sm text-gray-500 mt-1 ${!isOpen ? 'line-clamp-2' : ''}`}>{m.description}</p>
                            )}
                            <div className="flex flex-wrap items-center gap-3 mt-3 text-xs text-gray-400">
                                {(m.duration ?? 0) > 0 && (
                                    <span className="inline-flex items-center gap-1"><Clock size={12} /> {m.duration} วัน</span>
                                )}
                                {hasDates && estimatedDates && (
                                    <span className="inline-flex items-center gap-1">
                                        <Calendar size={12} /> กำหนดส่ง {formatThDate(estimatedDates.start)} — {formatThDate(estimatedDates.end)}
                                    </span>
                                )}
                            </div>
                        </div>
                        <div className="flex items-center gap-3 shrink-0">
                            <div className="text-right">
                                <span className="text-xl sm:text-2xl font-extrabold text-primary tracking-tight">
                                    {amount > 0 ? `฿${fmtBaht(amount)}` : `${m.percent_release}%`}
                                </span>
                                {amount > 0 && (
                                    <p className="text-[11px] text-gray-400 font-medium">{m.percent_release}% ของเป้าหมาย</p>
                                )}
                            </div>
                            <div className="p-1 text-gray-400">{isOpen ? <ChevronUp size={20} /> : <ChevronDown size={20} />}</div>
                        </div>
                    </div>
                </button>

                {isOpen && (
                    <div className="px-5 sm:px-6 pb-5 sm:pb-6 border-t border-gray-100">
                        {criteria.length > 0 && (
                            <div className="mt-5">
                                <h4 className="text-sm font-semibold text-gray-800 mb-3 flex items-center gap-2">
                                    <Target size={15} className="text-primary" /> สิ่งที่ส่งมอบ
                                </h4>
                                <div className="flex flex-wrap gap-2">
                                    {criteria.map((c, i) => (
                                        <span key={i} className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-medium border bg-gray-50 text-gray-700 border-gray-200">{c}</span>
                                    ))}
                                </div>
                            </div>
                        )}

                        {m.description && (
                            <div className="mt-5">
                                <h4 className="text-sm font-semibold text-gray-800 mb-2 flex items-center gap-2">
                                    <FileText size={15} className="text-primary" /> รายละเอียดเพิ่มเติม
                                </h4>
                                <p className="text-sm text-gray-600 leading-relaxed whitespace-pre-line">{m.description}</p>
                            </div>
                        )}

                        {amount > 0 && (
                            <div className="mt-5">
                                <h4 className="text-sm font-semibold text-gray-800 mb-2 flex items-center gap-2">
                                    <DollarSign size={15} className="text-primary" /> การปล่อยเงินทุน
                                </h4>
                                <div className="bg-gray-50 rounded-xl p-4 flex flex-col sm:flex-row sm:items-center gap-3 text-sm">
                                    <div className="flex-1">
                                        <div className="flex justify-between text-gray-500 mb-1.5">
                                            <span>สัดส่วนเงินทุน</span>
                                            <span className="font-semibold text-gray-800">{m.percent_release}%</span>
                                        </div>
                                        <div className="w-full h-2 bg-gray-200 rounded-full overflow-hidden">
                                            <div className="h-full rounded-full bg-primary transition-all duration-700" style={{ width: `${m.percent_release}%` }} />
                                        </div>
                                    </div>
                                    <div className="text-center sm:text-right sm:pl-4 sm:border-l sm:border-gray-200">
                                        <span className="text-2xl font-black text-primary">฿{fmtBaht(amount)}</span>
                                    </div>
                                </div>
                            </div>
                        )}
                    </div>
                )}
            </div>
        </div>
    )
}

const AdminProjectMilestonesOverview = () => {
    const { id } = useParams()
    const navigate = useNavigate()

    const {
        projectDetail: project,
        isProjectDetailLoading: isLoading,
        fetchAdminProjectDetail,
    } = useAdminStore()

    useEffect(() => {
        if (!id) return
        fetchAdminProjectDetail(id).catch(() => toast.error('โหลดข้อมูลไม่สำเร็จ'))
        window.scrollTo(0, 0)
    }, [id, fetchAdminProjectDetail])

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
                <button onClick={() => navigate(-1)} className="text-[13px] text-primary hover:underline">
                    กลับไปหน้าก่อน
                </button>
            </div>
        )
    }

    const sorted = project.milestones.slice().sort((a, b) => a.phase_no - b.phase_no)
    const totalPhases = sorted.length
    const fundingGoal = project.funding_goal || 0
    const campaignDuration = project.duration_days || (project.duration_months * 30) || 0

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
        <div className="min-h-screen bg-background">
            <div className="max-w-[900px] mx-auto px-4 sm:px-6 pt-6 pb-16">
                <button
                    onClick={() => navigate(`/admin/projects/${id}`)}
                    className="inline-flex items-center gap-1.5 text-sm text-primary hover:text-primary/80 font-medium mb-6 group transition-colors cursor-pointer"
                >
                    <ArrowLeft size={16} className="group-hover:-translate-x-0.5 transition-transform" />
                    กลับไปหน้าตรวจสอบโปรเจกต์
                </button>

                <div className="mb-8">
                    <div className="flex items-center gap-2 mb-2">
                        <MilestoneIcon size={20} className="text-primary" />
                        <span className="text-xs font-semibold text-primary uppercase tracking-wider">แผนงาน Milestone</span>
                    </div>
                    <h1 className="text-2xl sm:text-3xl font-extrabold text-gray-900 mb-2">
                        {project.title || 'ไม่ได้ระบุชื่อโปรเจกต์'}
                    </h1>
                    {project.description && (
                        <p className="text-sm text-gray-500 max-w-2xl">{project.description}</p>
                    )}
                </div>

                <div className="bg-white rounded-2xl border border-gray-200 p-5 sm:p-6 mb-8 shadow-sm">
                    <div className="flex flex-col sm:flex-row justify-between gap-4">
                        <div className="flex-1">
                            <div className="flex items-center gap-3 mb-3">
                                <h2 className="text-sm font-bold text-gray-800">ความคืบหน้าโดยรวม</h2>
                                <span className="text-xs font-semibold text-primary bg-primary/5 px-2 py-0.5 rounded-full">
                                    0/{totalPhases} Phase
                                </span>
                            </div>
                            <div className="w-full h-3 bg-gray-100 rounded-full overflow-hidden">
                                <div className="h-full bg-gradient-to-r from-primary to-emerald-500 rounded-full" style={{ width: '0%' }} />
                            </div>
                            <p className="text-xs text-gray-400 mt-2">0% เสร็จสมบูรณ์ (ตัวอย่าง)</p>
                        </div>
                        <div className="grid grid-cols-3 gap-4 sm:gap-6 text-center">
                            <div>
                                <p className="text-2xl font-black text-primary">{totalPhases}</p>
                                <p className="text-[10px] text-gray-400 font-bold uppercase tracking-wider">Phase ทั้งหมด</p>
                            </div>
                            <div>
                                <p className="text-2xl font-black text-emerald-600">0</p>
                                <p className="text-[10px] text-gray-400 font-bold uppercase tracking-wider">เสร็จแล้ว</p>
                            </div>
                            <div>
                                <p className="text-2xl font-black text-gray-800">
                                    ฿{fundingGoal > 0 ? fmtBaht(fundingGoal) : '—'}
                                </p>
                                <p className="text-[10px] text-gray-400 font-bold uppercase tracking-wider">เงินทุนรวม</p>
                            </div>
                        </div>
                    </div>
                </div>

                <div className="relative">
                    {totalPhases > 0 ? (
                        sorted.map((m, idx) => (
                            <MilestoneCard
                                key={m.id}
                                m={m}
                                index={idx}
                                totalPhases={totalPhases}
                                fundingGoal={fundingGoal}
                                estimatedDates={phaseDates[idx] ?? null}
                                defaultOpen={false}
                            />
                        ))
                    ) : (
                        <div className="flex flex-col items-center justify-center py-16 text-center">
                            <MilestoneIcon size={48} className="text-gray-300 mb-3" />
                            <p className="text-gray-500 text-sm">ยังไม่มีข้อมูล Milestone สำหรับโปรเจกต์นี้</p>
                        </div>
                    )}
                </div>

                <div className="mt-8 flex justify-start">
                    <button
                        onClick={() => navigate(`/admin/projects/${id}`)}
                        className="inline-flex items-center gap-2 px-6 py-3 bg-primary text-white rounded-xl font-semibold text-sm hover:bg-primary/90 transition-colors shadow-md shadow-primary/10 cursor-pointer"
                    >
                        <ArrowLeft size={16} />
                        กลับไปหน้าตรวจสอบโปรเจกต์
                    </button>
                </div>
            </div>
        </div>
    )
}

export default AdminProjectMilestonesOverview
