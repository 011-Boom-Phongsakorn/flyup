import { Link } from 'react-router'

export interface VoteMilestone {
  id: number
  project_id: number
  projectTitle: string
  phase_no: number
  title: string
  voting_open: boolean
  voting_opened_at: string | null
  voting_closed_at: string | null
  status: string
  percent_release: number
}

interface Props {
  vote: VoteMilestone
  isOpen: boolean
}

const fmtDate = (d?: string | null) =>
  d ? new Date(d).toLocaleDateString('th-TH', { day: 'numeric', month: 'short', year: 'numeric' }) : '-'

export default function VoteRow({ vote, isOpen }: Props) {
  return (
    <div className="bg-card border border-border rounded-xl p-5 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
      <div className="flex-1 min-w-0">
        <div className="flex items-center gap-3 mb-1 flex-wrap">
          <h3 className="font-bold text-foreground text-base leading-tight">{vote.projectTitle}</h3>
          {isOpen ? (
            <span className="text-xs font-semibold px-2.5 py-0.5 rounded-full border bg-primary/5 text-primary border-primary/20">เปิดโหวต</span>
          ) : (
            <span className="text-xs font-semibold px-2.5 py-0.5 rounded-full bg-muted text-muted-foreground">ปิดแล้ว</span>
          )}
        </div>
        <p className="text-sm text-foreground mb-2">Phase {vote.phase_no}: {vote.title}</p>
        <div className="flex flex-wrap items-center gap-4 text-xs text-muted-foreground font-medium">
          {isOpen && vote.voting_opened_at && <span>เปิดโหวตเมื่อ {fmtDate(vote.voting_opened_at)}</span>}
          {!isOpen && vote.voting_closed_at && <span>ปิดเมื่อ {fmtDate(vote.voting_closed_at)}</span>}
          {!isOpen && (
            <span className={`font-semibold ${
              vote.status === 'approved' || vote.status === 'paid' ? 'text-green-600' :
              vote.status === 'rejected' ? 'text-red-500' : 'text-muted-foreground'
            }`}>
              ผลโหวต: {
                vote.status === 'approved' || vote.status === 'paid' ? 'อนุมัติ' :
                vote.status === 'rejected' ? 'ไม่อนุมัติ' : vote.status
              }
            </span>
          )}
          <span className="text-muted-foreground">ปล่อยเงิน {vote.percent_release}%</span>
        </div>
      </div>

      {isOpen ? (
        <Link to={`/booster/votes/${vote.id}`}
          className="shrink-0 px-6 py-2.5 rounded-xl text-sm font-semibold bg-primary text-white hover:opacity-90 transition-opacity">
          โหวตเลย
        </Link>
      ) : (
        <Link to={`/booster/votes/${vote.id}`}
          className="shrink-0 px-6 py-2 rounded-xl text-sm font-semibold border border-border text-muted-foreground hover:bg-muted transition-colors">
          ดูรายละเอียด
        </Link>
      )}
    </div>
  )
}
