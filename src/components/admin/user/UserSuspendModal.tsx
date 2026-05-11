import { useState } from 'react'
import { Loader2, UserX, X } from 'lucide-react'

interface Props {
  userId: number
  onClose: () => void
  onConfirm: (reason: string) => Promise<void>
  isSubmitting: boolean
}

export default function UserSuspendModal({ userId, onClose, onConfirm, isSubmitting }: Props) {
  const [reason, setReason] = useState('')
  return (
    <div className="fixed inset-0 z-50 bg-black/40 flex items-center justify-center p-4" onClick={onClose}>
      <div className="bg-white rounded-2xl w-full max-w-[420px] p-6 shadow-xl" onClick={(e) => e.stopPropagation()}>
        <div className="flex items-start justify-between mb-3">
          <h2 className="text-lg font-bold text-foreground">ระงับผู้ใช้ ID #{userId}</h2>
          <button onClick={onClose} className="text-muted-foreground hover:text-foreground"><X size={18} /></button>
        </div>
        <div className="flex flex-col gap-1 mb-5">
          <label className="text-[13px] font-medium">เหตุผล <span className="text-error">*</span></label>
          <textarea
            value={reason}
            onChange={(e) => setReason(e.target.value)}
            rows={4}
            placeholder="ระบุเหตุผลในการระงับบัญชีผู้ใช้นี้"
            className="border border-border rounded-lg px-3 py-2 text-[14px] outline-none focus:border-primary resize-none"
          />
        </div>
        <div className="flex gap-2 justify-end">
          <button onClick={onClose} className="px-4 py-2 text-[13px] rounded-lg border border-border hover:bg-gray-50">ยกเลิก</button>
          <button
            onClick={() => onConfirm(reason)}
            disabled={!reason.trim() || isSubmitting}
            className="px-4 py-2 text-[13px] rounded-lg bg-red-600 hover:bg-red-700 text-white disabled:opacity-50 flex items-center gap-2"
          >
            {isSubmitting ? <Loader2 size={14} className="animate-spin" /> : <UserX size={14} />}
            ระงับ
          </button>
        </div>
      </div>
    </div>
  )
}
