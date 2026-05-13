export type CancelProject = {
  id: number
  title: string
  cancel_reason: string
  cancel_description: string
  state: string
  owner_user_id: number
  owner?: { first_name: string; last_name: string }
  UpdatedAt: string
}

export type PreviewMilestone = {
  phase_no: number
  title: string
  percent_release: number
  disbursed_amount: number
  is_confirmed: boolean
}

export type PreviewInvestor = {
  user_id: number
  first_name: string
  last_name: string
  email: string
  total_amount: number
  refund_amount: number
}

export type CancelPreview = {
  project_id: number
  title: string
  total_funding: number
  total_disbursed: number
  refundable_amount: number
  milestones: PreviewMilestone[]
  investors: PreviewInvestor[]
}

export const STATE_CONFIG: Record<string, { label: string; className: string; icon: React.ReactNode }> = {
  pending_cancel:  { label: 'รอดำเนินการ', className: 'bg-amber-50 text-amber-600 border border-amber-200', icon: null },
  cancelled:       { label: 'อนุมัติแล้ว',  className: 'bg-green-50 text-green-600 border border-green-200',  icon: null },
  cancel_rejected: { label: 'ปฏิเสธแล้ว',  className: 'bg-red-50 text-red-600 border border-red-200',         icon: null },
}

export const FALLBACK_BADGE = { label: 'ไม่ทราบสถานะ', className: 'bg-gray-50 text-gray-500 border border-gray-200', icon: null }

export const fmt = (n: number) => n.toLocaleString('th-TH', { minimumFractionDigits: 2, maximumFractionDigits: 2 })
export const fmtDate = (d?: string | null) =>
  d ? new Date(d).toLocaleDateString('th-TH', { day: 'numeric', month: 'short', year: 'numeric' }) : '-'
