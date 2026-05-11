import { Loader2, ShieldBan, ShieldCheck, X } from 'lucide-react'

export interface ProjectRow {
  id: number
  title: string
  state: string
  status: string
  funding_goal: number
  current_funding: number
  category?: string | null
}

interface BaseProps {
  project: ProjectRow
  onClose: () => void
  onConfirm: () => Promise<void>
  isSubmitting: boolean
}

export function SuspendModal({ project, onClose, onConfirm, isSubmitting }: BaseProps) {
  return (
    <div className="fixed inset-0 z-50 bg-black/40 flex items-center justify-center p-4" onClick={onClose}>
      <div className="bg-white rounded-2xl w-full max-w-[420px] p-6 shadow-xl" onClick={(e) => e.stopPropagation()}>
        <div className="flex items-start justify-between mb-3">
          <h2 className="text-lg font-bold text-foreground">ระงับโปรเจกต์?</h2>
          <button onClick={onClose} className="text-muted-foreground hover:text-foreground"><X size={18} /></button>
        </div>
        <p className="text-[13px] text-muted-foreground mb-1">โปรเจกต์ <span className="font-semibold text-foreground">{project.title}</span> จะถูกระงับ</p>
        <p className="text-[12px] text-muted-foreground mb-5">การระงับจะเปลี่ยนสถานะเป็น "ถูกระงับ" และผู้ใช้ทั่วไปจะไม่สามารถลงทุนเพิ่มได้</p>
        <div className="flex gap-2 justify-end">
          <button onClick={onClose} className="px-4 py-2 text-[13px] rounded-lg border border-border hover:bg-gray-50">ยกเลิก</button>
          <button onClick={onConfirm} disabled={isSubmitting}
            className="px-4 py-2 text-[13px] rounded-lg bg-red-600 hover:bg-red-700 text-white disabled:opacity-50 flex items-center gap-2">
            {isSubmitting ? <Loader2 size={14} className="animate-spin" /> : <ShieldBan size={14} />}
            ระงับ
          </button>
        </div>
      </div>
    </div>
  )
}

export function UnsuspendModal({ project, onClose, onConfirm, isSubmitting }: BaseProps) {
  return (
    <div className="fixed inset-0 z-50 bg-black/40 flex items-center justify-center p-4" onClick={onClose}>
      <div className="bg-white rounded-2xl w-full max-w-[420px] p-6 shadow-xl" onClick={(e) => e.stopPropagation()}>
        <div className="flex items-start justify-between mb-3">
          <h2 className="text-lg font-bold text-foreground">ยกเลิกการระงับ?</h2>
          <button onClick={onClose} className="text-muted-foreground hover:text-foreground"><X size={18} /></button>
        </div>
        <p className="text-[13px] text-muted-foreground mb-1">โปรเจกต์ <span className="font-semibold text-foreground">{project.title}</span> จะถูกยกเลิกการระงับ</p>
        <p className="text-[12px] text-muted-foreground mb-5">สถานะจะเปลี่ยนกลับเป็น "กำลังดำเนินการ" และโปรเจกต์จะกลับมาทำงานตามปกติ</p>
        <div className="flex gap-2 justify-end">
          <button onClick={onClose} className="px-4 py-2 text-[13px] rounded-lg border border-border hover:bg-gray-50">ยกเลิก</button>
          <button onClick={onConfirm} disabled={isSubmitting}
            className="px-4 py-2 text-[13px] rounded-lg bg-green-600 hover:bg-green-700 text-white disabled:opacity-50 flex items-center gap-2">
            {isSubmitting ? <Loader2 size={14} className="animate-spin" /> : <ShieldCheck size={14} />}
            ยกเลิกระงับ
          </button>
        </div>
      </div>
    </div>
  )
}
