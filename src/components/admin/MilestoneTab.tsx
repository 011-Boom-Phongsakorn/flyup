import { Calendar } from 'lucide-react'
import { Link } from 'react-router'

export interface MilestoneItem {
    id: number
    phase_no: number
    title: string
    description: string | null
    percent_release: number
    status: string
    duration?: number
    acceptance_criteria?: string | null
}

const thMonths = ['ม.ค.', 'ก.พ.', 'มี.ค.', 'เม.ย.', 'พ.ค.', 'มิ.ย.', 'ก.ค.', 'ส.ค.', 'ก.ย.', 'ต.ค.', 'พ.ย.', 'ธ.ค.']
const formatThDate = (d: Date) => `${d.getDate()} ${thMonths[d.getMonth()]} ${d.getFullYear() + 543}`

const MilestoneTab = ({
    milestones,
    fundingGoal,
    campaignDuration,
    projectId,
}: {
    milestones: MilestoneItem[]
    fundingGoal: number
    campaignDuration: number
    projectId: number | string
}) => {
    if (milestones.length === 0) {
        return (
            <div className="flex flex-col items-center justify-center gap-[12px] mt-[40px] p-[40px] border border-dashed border-border rounded-[16px] bg-white">
                <span className="text-muted-foreground text-[14px]">ยังไม่ได้กำหนด Milestone</span>
            </div>
        )
    }

    const sorted = milestones.slice().sort((a, b) => a.phase_no - b.phase_no)

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
                const criteria = (m.acceptance_criteria ?? '').split('\n').filter((c) => c.trim())

                return (
                    <div key={m.id} className="flex gap-[20px] relative z-10 w-full">
                        <div
                            className={`hidden md:flex shrink-0 w-[48px] h-[48px] rounded-full items-center justify-center font-bold text-[20px] shadow-sm ${
                                idx === 0 ? 'bg-primary text-white' : 'bg-white border border-border text-foreground'
                            }`}
                        >
                            {m.phase_no}
                        </div>
                        <div className="flex-1 bg-white border border-border rounded-[16px] p-[24px] shadow-sm flex flex-col gap-[20px]">
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
                                                {criteria.map((c, i) => (
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
                                        {amount > 0 ? `฿${new Intl.NumberFormat('th-TH').format(amount)}` : `${m.percent_release}%`}
                                    </span>
                                    <span className="px-[12px] py-[4px] rounded-full text-[12px] font-medium border bg-white text-foreground border-border">
                                        รอดำเนินการ
                                    </span>
                                </div>
                            </div>
                            <div className="flex justify-end">
                                <Link
                                    to={`/admin/projects/${projectId}/milestones-overview`}
                                    className="text-[12px] text-primary hover:text-primary/70 transition-colors"
                                >
                                    ดูรายละเอียดเพิ่มเติม
                                </Link>
                            </div>
                        </div>
                    </div>
                )
            })}
        </div>
    )
}

export default MilestoneTab
