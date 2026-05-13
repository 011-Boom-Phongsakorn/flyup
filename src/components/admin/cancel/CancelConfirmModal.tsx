import { useState } from 'react'
import { Loader2, CheckCircle, XCircle, X } from 'lucide-react'
import type { CancelProject } from './cancelTypes'

interface Props {
  project: CancelProject
  mode: 'approve' | 'reject'
  onClose: () => void
  onConfirm: (note: string) => Promise<void>
  isSubmitting: boolean
}

export default function CancelConfirmModal({ project, mode, onClose, onConfirm, isSubmitting }: Props) {
  const [note, setNote] = useState('')
  const isApprove = mode === 'approve'

  return (
    <div className="fixed inset-0 z-[60] bg-black/40 flex items-center justify-center p-4" onClick={onClose}>
      <div className="bg-white rounded-2xl w-full max-w-[460px] p-6 shadow-xl" onClick={(e) => e.stopPropagation()}>
        <div className="flex items-start justify-between mb-3">
          <h2 className="text-lg font-bold text-foreground">
            {isApprove ? 'ยืนยันอนุมัติการยกเลิก' : 'ปฏิเสธคำขอยกเลิก'}
          </h2>
          <button onClick={onClose} className="text-muted-foreground hover:text-foreground cursor-pointer"><X size={18} /></button>
        </div>
        <p className="text-[13px] text-muted-foreground mb-1">
          โปรเจกต์: <span className="font-medium text-foreground">{project.title}</span>
        </p>
        {isApprove && (
          <p className="text-[12px] text-green-600 bg-green-50 rounded-lg px-3 py-2 mb-4">
            ระบบจะคืนเงินให้นักลงทุนทุกรายอัตโนมัติหลังอนุมัติ
          </p>
        )}
        <div className="flex flex-col gap-1 mb-5">
          <label className="text-[13px] font-medium">หมายเหตุจาก Admin <span className="text-error">*</span></label>
          <textarea
            value={note}
            onChange={(e) => setNote(e.target.value)}
            rows={4}
            placeholder={isApprove ? 'ยืนยันการอนุมัติและแจ้งขั้นตอนต่อไป' : 'เหตุผลที่ปฏิเสธคำขอยกเลิก'}
            className="border border-border rounded-lg px-3 py-2 text-[14px] outline-none focus:border-primary resize-none"
          />
        </div>
        <div className="flex gap-2 justify-end">
          <button onClick={onClose} className="px-4 py-2 text-[13px] rounded-lg border border-border hover:bg-gray-50 cursor-pointer">ยกเลิก</button>
          <button
            onClick={() => onConfirm(note)}
            disabled={isSubmitting}
            className={`px-4 py-2 text-[13px] rounded-lg text-white disabled:opacity-50 flex items-center gap-2 cursor-pointer ${
              isApprove ? 'bg-green-600 hover:bg-green-700' : 'bg-red-600 hover:bg-red-700'
            }`}
          >
            {isSubmitting ? <Loader2 size={14} className="animate-spin" /> : isApprove ? <CheckCircle size={14} /> : <XCircle size={14} />}
            {isApprove ? 'อนุมัติ' : 'ปฏิเสธ'}
          </button>
        </div>
      </div>
    </div>
  )
}
