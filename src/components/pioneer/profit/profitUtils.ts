export interface MyProject {
  id: number
  title: string
  state: string
  allMilestonesPaid?: boolean
}

export const fmtBaht = (v: number) =>
  `฿${v.toLocaleString('th-TH', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`

export const fmtDate = (d: string) =>
  new Date(d).toLocaleDateString('th-TH', { day: 'numeric', month: 'short', year: 'numeric' })

export function isQuarterAvailable(q: number, submittedQuarters: number[]): boolean {
  if (submittedQuarters.includes(q)) return false
  if (q === 1) return true
  return submittedQuarters.includes(q - 1)
}
