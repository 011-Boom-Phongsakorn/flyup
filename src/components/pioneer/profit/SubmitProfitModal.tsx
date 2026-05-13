import { useState, useRef } from 'react'
import { Loader2, Lock, X, SendHorizonal, CheckCircle2, ImagePlus, XCircle } from 'lucide-react'
import toast from 'react-hot-toast'
import { usePioneerProfitStore } from '../../../store/usePioneerProfitStore'
import { useProfileStore } from '../../../store/useProfileStore'
import BankAccountCard from './BankAccountCard'
import { isQuarterAvailable, type MyProject } from './profitUtils'

interface Props {
  projects: MyProject[]
  submittedMap: Record<number, number[]>
  onClose: () => void
  onSubmitted: () => void
}

export default function SubmitProfitModal({ projects, submittedMap, onClose, onSubmitted }: Props) {
  const { isSubmitting, submitProfit } = usePioneerProfitStore()
  const { uploadFile } = useProfileStore()
  const eligible = projects.filter(p =>
    (p.state === 'executing' || p.state === 'closed') && p.allMilestonesPaid === true
  )
  const [projectId, setProjectId]     = useState<number | ''>(eligible[0]?.id ?? '')
  const [quarterNo, setQuarterNo]     = useState<number | ''>('')
  const [amount, setAmount]           = useState('')
  const [transferRef, setTransferRef] = useState('')
  const [slipImage, setSlipImage]     = useState<string>('')
  const [slipPreview, setSlipPreview] = useState<string>('')
  const [isUploading, setIsUploading] = useState(false)
  const fileInputRef = useRef<HTMLInputElement>(null)

  const submittedQs  = projectId ? (submittedMap[Number(projectId)] ?? []) : []
  const hasAvailable = [1, 2, 3, 4].some(q => isQuarterAvailable(q, submittedQs))
  const valid = projectId && quarterNo && Number(amount) > 0 && transferRef.trim()

  const handleSlipChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return
    setSlipPreview(URL.createObjectURL(file))
    setIsUploading(true)
    const url = await uploadFile(file)
    if (url) setSlipImage(url)
    else { toast.error('อัปโหลดสลิปไม่สำเร็จ'); setSlipPreview('') }
    setIsUploading(false)
    if (fileInputRef.current) fileInputRef.current.value = ''
  }

  const handleSubmit = async () => {
    if (!projectId || !quarterNo) return
    const ok = await submitProfit(Number(projectId), Number(quarterNo), Number(amount), transferRef.trim(), slipImage || undefined)
    if (ok) { onSubmitted(); onClose() }
  }

  return (
    <div className="fixed inset-0 z-50 bg-black/40 flex items-center justify-center p-4" onClick={onClose}>
      <div className="bg-white rounded-2xl w-full max-w-[460px] p-6 shadow-xl" onClick={e => e.stopPropagation()}>
        <div className="flex items-start justify-between mb-5">
          <div>
            <h2 className="text-[16px] font-bold text-foreground">แจ้งโอนกำไรนักลงทุน</h2>
            <p className="text-[12px] text-muted-foreground mt-0.5">ระบบจะแบ่งตามสัดส่วนทุนอัตโนมัติ</p>
          </div>
          <button onClick={onClose} className="text-muted-foreground hover:text-foreground cursor-pointer"><X size={18} /></button>
        </div>

        {eligible.length === 0 ? (
          <div className="flex flex-col items-center gap-2 py-6 text-center">
            <Lock size={28} className="text-muted-foreground opacity-40" />
            <p className="text-[13px] font-semibold text-foreground">ยังไม่มีโปรเจกต์ที่พร้อมจ่ายปันผล</p>
            <p className="text-[12px] text-muted-foreground max-w-[280px]">
              โปรเจกต์ต้องผ่านครบทุก Phase Milestone (สถานะ paid) ก่อนจึงจะจ่ายปันผลได้
            </p>
          </div>
        ) : (
          <div className="flex flex-col gap-3">
            <div className="flex flex-col gap-1">
              <label className="text-[13px] font-medium">โปรเจกต์ <span className="text-red-500">*</span></label>
              <select
                value={projectId}
                onChange={e => { setProjectId(Number(e.target.value)); setQuarterNo('') }}
                className="border border-border rounded-lg px-3 py-2 text-[14px] outline-none focus:border-primary cursor-pointer"
              >
                {eligible.map(p => <option key={p.id} value={p.id}>{p.title}</option>)}
              </select>
            </div>

            <div className="flex flex-col gap-1">
              <label className="text-[13px] font-medium">ไตรมาส <span className="text-red-500">*</span></label>
              {!hasAvailable ? (
                <p className="text-[13px] text-green-600 font-medium">ส่งครบ 4 ไตรมาสแล้ว</p>
              ) : (
                <div className="flex gap-2">
                  {[1, 2, 3, 4].map(q => {
                    const isSubmitted = submittedQs.includes(q)
                    const isAvail = isQuarterAvailable(q, submittedQs)
                    const isSelected = quarterNo === q
                    return (
                      <button key={q} onClick={() => isAvail && setQuarterNo(q)} disabled={!isAvail}
                        className={`flex-1 py-2 rounded-lg border text-[13px] font-semibold transition-colors flex flex-col items-center gap-0.5
                          ${isSubmitted ? 'bg-green-50 border-green-200 text-green-600 cursor-not-allowed'
                          : isAvail ? isSelected
                            ? 'bg-primary text-white border-primary cursor-pointer'
                            : 'border-border text-foreground hover:border-primary hover:text-primary cursor-pointer'
                          : 'bg-gray-50 border-gray-200 text-gray-300 cursor-not-allowed'}`}
                      >
                        {isSubmitted ? <CheckCircle2 size={12} /> : !isAvail ? <Lock size={12} /> : null}
                        Q{q}
                      </button>
                    )
                  })}
                </div>
              )}
            </div>

            <BankAccountCard compact />

            <div className="flex flex-col gap-1">
              <label className="text-[13px] font-medium">ยอดโอน (บาท) <span className="text-red-500">*</span></label>
              <input type="number" value={amount} onChange={e => setAmount(e.target.value)}
                placeholder="0.00" className="border border-border rounded-lg px-3 py-2 text-[14px] outline-none focus:border-primary" />
            </div>

            <div className="flex flex-col gap-1">
              <label className="text-[13px] font-medium">เลขอ้างอิงการโอน <span className="text-red-500">*</span></label>
              <input value={transferRef} onChange={e => setTransferRef(e.target.value)}
                placeholder="เช่น TXN-20260630-001"
                className="border border-border rounded-lg px-3 py-2 text-[14px] outline-none focus:border-primary" />
            </div>

            <div className="flex flex-col gap-1">
              <label className="text-[13px] font-medium">สลิปการโอน</label>
              <input ref={fileInputRef} type="file" accept="image/*" className="hidden" onChange={handleSlipChange} />
              {slipPreview ? (
                <div className="relative w-full rounded-xl overflow-hidden border border-border">
                  <img src={slipPreview} alt="slip" className="w-full max-h-45 object-contain bg-gray-50" />
                  {isUploading && (
                    <div className="absolute inset-0 bg-white/70 flex items-center justify-center">
                      <Loader2 size={20} className="animate-spin text-primary" />
                    </div>
                  )}
                  <button
                    type="button"
                    onClick={() => { setSlipPreview(''); setSlipImage(''); if (fileInputRef.current) fileInputRef.current.value = '' }}
                    className="absolute top-2 right-2 bg-white rounded-full shadow p-0.5 hover:bg-red-50 cursor-pointer"
                  >
                    <XCircle size={18} className="text-red-500" />
                  </button>
                </div>
              ) : (
                <button
                  type="button"
                  onClick={() => fileInputRef.current?.click()}
                  className="flex items-center justify-center gap-2 border border-dashed border-border rounded-xl py-4 text-[13px] text-muted-foreground hover:border-primary hover:text-primary transition-colors cursor-pointer"
                >
                  <ImagePlus size={16} /> แนบสลิปการโอน
                </button>
              )}
            </div>
          </div>
        )}

        <div className="flex gap-2 mt-5 justify-end">
          <button onClick={onClose} className="px-4 py-2 text-[13px] rounded-lg border border-border hover:bg-gray-50 cursor-pointer">ยกเลิก</button>
          {hasAvailable && (
            <button onClick={handleSubmit} disabled={!valid || isSubmitting}
              className="px-4 py-2 text-[13px] rounded-lg bg-primary hover:bg-primary/90 text-white disabled:opacity-50 flex items-center gap-2 cursor-pointer">
              {isSubmitting ? <Loader2 size={14} className="animate-spin" /> : <SendHorizonal size={14} />}
              แจ้งโอน
            </button>
          )}
        </div>
      </div>
    </div>
  )
}
