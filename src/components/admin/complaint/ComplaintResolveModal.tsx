import { useState } from 'react'
import { Loader2, CheckCircle, XCircle, X } from 'lucide-react'
import type { Complaint } from '../../../store/useComplaintStore'

interface Props {
  complaint: Complaint
  mode: 'resolve' | 'reject'
  onClose: () => void
  onConfirm: (note: string) => Promise<void>
  isSubmitting: boolean
}

export default function ComplaintResolveModal({ complaint, mode, onClose, onConfirm, isSubmitting }: Props) {
  const [note, setNote] = useState('')
  const isResolve = mode === 'resolve'
  return (
    <div className="fixed inset-0 z-[60] bg-black/40 flex items-center justify-center p-4" onClick={onClose}>
      <div className="bg-white rounded-2xl w-full max-w-[460px] p-6 shadow-xl" onClick={(e) => e.stopPropagation()}>
        <div className="flex items-start justify-between mb-3">
          <h2 className="text-lg font-bold text-foreground">
            {isResolve ? 'ปิดคำร้องเรียน' : 'ปฏิเสธคำร้องเรียน'}
          </h2>
          <button onClick={onClose} className="text-muted-foreground hover:text-foreground"><X size={18} /></button>
        </div>
        <p className="text-[13px] text-muted-foreground mb-4">เรื่อง: <span className="font-medium text-foreground">{complaint.subject}</span></p>
        <div className="flex flex-col gap-1 mb-5">
          <label className="text-[13px] font-medium">หมายเหตุจากผู้ตรวจ <span className="text-error">*</span></label>
          <textarea
            value={note}
            onChange={(e) => setNote(e.target.value)}
            rows={4}
            placeholder={isResolve ? 'อธิบายผลการตรวจสอบและการดำเนินการ' : 'เหตุผลที่ปฏิเสธคำร้องเรียนนี้'}
            className="border border-border rounded-lg px-3 py-2 text-[14px] outline-none focus:border-primary resize-none"
          />
        </div>
        <div className="flex gap-2 justify-end">
          <button onClick={onClose} className="px-4 py-2 text-[13px] rounded-lg border border-border hover:bg-gray-50">ยกเลิก</button>
          <button
            onClick={() => onConfirm(note)}
            disabled={!note.trim() || isSubmitting}
            className={`px-4 py-2 text-[13px] rounded-lg text-white disabled:opacity-50 flex items-center gap-2 ${
              isResolve ? 'bg-green-600 hover:bg-green-700' : 'bg-red-600 hover:bg-red-700'
            }`}
          >
            {isSubmitting ? <Loader2 size={14} className="animate-spin" /> : isResolve ? <CheckCircle size={14} /> : <XCircle size={14} />}
            {isResolve ? 'ปิดเรื่อง' : 'ปฏิเสธ'}
          </button>
        </div>
      </div>
    </div>
  )
}
