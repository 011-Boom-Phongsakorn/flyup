import { useState } from 'react'
import { Loader2, Flag, X } from 'lucide-react'
import { useComplaintStore } from '../store/useComplaintStore'

interface ComplaintModalProps {
    projectId: number
    projectTitle: string
    onClose: () => void
    onSuccess?: () => void
}

const ComplaintModal = ({ projectId, projectTitle, onClose, onSuccess }: ComplaintModalProps) => {
    const { fileComplaint, isSubmitting } = useComplaintStore()
    const [subject, setSubject] = useState('')
    const [body, setBody] = useState('')

    const handleSubmit = async () => {
        if (!subject.trim() || body.trim().length < 10) return
        const ok = await fileComplaint(projectId, subject.trim(), body.trim())
        if (ok) {
            onSuccess?.()
            onClose()
        }
    }

    const subjectValid = subject.trim().length >= 3
    const bodyValid = body.trim().length >= 10
    const canSubmit = subjectValid && bodyValid && !isSubmitting

    return (
        <div className="fixed inset-0 z-[60] bg-black/40 flex items-center justify-center p-4" onClick={onClose}>
            <div className="bg-white rounded-2xl w-full max-w-[520px] p-6 shadow-xl" onClick={(e) => e.stopPropagation()}>
                <div className="flex items-start justify-between mb-2">
                    <div className="flex items-center gap-2">
                        <div className="w-9 h-9 rounded-full bg-red-50 text-red-600 flex items-center justify-center">
                            <Flag size={16} />
                        </div>
                        <h2 className="text-lg font-bold text-foreground">ร้องเรียนโปรเจกต์</h2>
                    </div>
                    <button onClick={onClose} className="text-muted-foreground hover:text-foreground"><X size={18} /></button>
                </div>
                <p className="text-[12px] text-muted-foreground mb-4 ml-11">
                    โปรเจกต์: <span className="font-medium text-foreground">{projectTitle}</span>
                </p>

                <div className="bg-amber-50 border border-amber-200 rounded-lg p-3 mb-4 text-[12px] text-amber-800">
                    คำร้องเรียนจะถูกส่งไปยังทีมงาน FlyUp เพื่อตรวจสอบ — คุณสามารถร้องเรียนโปรเจกต์นี้ได้เพียงครั้งเดียว
                </div>

                <div className="flex flex-col gap-3 mb-5">
                    <div className="flex flex-col gap-1">
                        <label className="text-[13px] font-medium">หัวข้อ <span className="text-error">*</span></label>
                        <input
                            value={subject}
                            onChange={(e) => setSubject(e.target.value)}
                            placeholder="เช่น ข้อมูลโปรเจกต์ไม่ตรงกับความเป็นจริง"
                            maxLength={200}
                            className="border border-border rounded-lg px-3 py-2 text-[14px] outline-none focus:border-primary"
                        />
                        <span className="text-[11px] text-muted-foreground">{subject.length}/200</span>
                    </div>
                    <div className="flex flex-col gap-1">
                        <label className="text-[13px] font-medium">รายละเอียด <span className="text-error">*</span></label>
                        <textarea
                            value={body}
                            onChange={(e) => setBody(e.target.value)}
                            rows={6}
                            placeholder="อธิบายสิ่งที่ต้องการรายงานให้ละเอียด (อย่างน้อย 10 ตัวอักษร)"
                            maxLength={5000}
                            className="border border-border rounded-lg px-3 py-2 text-[14px] outline-none focus:border-primary resize-none"
                        />
                        <span className="text-[11px] text-muted-foreground">{body.length}/5000</span>
                    </div>
                </div>

                <div className="flex gap-2 justify-end">
                    <button onClick={onClose} className="px-4 py-2 text-[13px] rounded-lg border border-border hover:bg-gray-50">ยกเลิก</button>
                    <button
                        onClick={handleSubmit}
                        disabled={!canSubmit}
                        className="px-4 py-2 text-[13px] rounded-lg bg-red-600 hover:bg-red-700 text-white disabled:opacity-50 flex items-center gap-2"
                    >
                        {isSubmitting ? <Loader2 size={14} className="animate-spin" /> : <Flag size={14} />}
                        ส่งคำร้องเรียน
                    </button>
                </div>
            </div>
        </div>
    )
}

export default ComplaintModal
