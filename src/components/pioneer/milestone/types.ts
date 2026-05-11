export type MilestoneStatus =
  | 'pending'
  | 'in_progress'
  | 'submitted'
  | 'approved'
  | 'completed'
  | 'rejected'

export interface MilestoneData {
  id?: number
  phase_no: number
  title: string
  description: string
  duration: number
  startDate: Date | null
  endDate: Date | null
  amount: number
  criteria: string[]
  status: MilestoneStatus
  progress_pct: number
  admin_note?: string
  voting_open?: boolean
  meetings?: { id: number; date: string; time: string; status: string }[]
}

export interface EvidenceLink {
  name: string
  url: string
}

export const STATUS_CONFIG: Record<MilestoneStatus, { label: string; badgeCls: string; borderCls: string; barCls: string }> = {
  pending:     { label: 'รอดำเนินการ',                      badgeCls: 'bg-[#F1F3F5] text-[#6C757D]',   borderCls: 'border-border',       barCls: 'bg-primary' },
  in_progress: { label: 'กำลังดำเนินการ',                  badgeCls: 'bg-primary text-white',          borderCls: 'border-border',       barCls: 'bg-primary' },
  submitted:   { label: 'รอ Admin ตรวจสอบ',                badgeCls: 'bg-[#F5A623] text-white',        borderCls: 'border-border',       barCls: 'bg-primary' },
  approved:    { label: 'Admin อนุมัติแล้ว — รอปล่อยทุน', badgeCls: 'bg-[#F5A623] text-white',        borderCls: 'border-border',       barCls: 'bg-primary' },
  completed:   { label: 'สำเร็จ',                           badgeCls: 'bg-[#2BA88E] text-white',        borderCls: 'border-[#2BA88E]/40', barCls: 'bg-[#2BA88E]' },
  rejected:    { label: 'ถูกปฏิเสธ',                      badgeCls: 'bg-[#EF4444] text-white',        borderCls: 'border-border',       barCls: 'bg-primary' },
}

const MONTHS_TH = ['ม.ค.','ก.พ.','มี.ค.','เม.ย.','พ.ค.','มิ.ย.','ก.ค.','ส.ค.','ก.ย.','ต.ค.','พ.ย.','ธ.ค.']

export const fmtDate = (d: Date | null) => {
  if (!d) return ''
  return `${d.getDate()} ${MONTHS_TH[d.getMonth()]} ${d.getFullYear()}`
}

export const fmtDateRange = (start: Date | null, end: Date | null, duration: number) => {
  if (start && end) return `${fmtDate(start)} – ${fmtDate(end)} (${duration} วัน)`
  if (end) return `ถึง ${fmtDate(end)} (${duration} วัน)`
  if (duration > 0) return `ระยะ ${duration} วัน`
  return ''
}

export const addDays = (date: Date, days: number): Date => {
  const d = new Date(date)
  d.setDate(d.getDate() + days)
  return d
}

export const fmtBaht = (v: number) => `฿${v.toLocaleString('th-TH')}`
