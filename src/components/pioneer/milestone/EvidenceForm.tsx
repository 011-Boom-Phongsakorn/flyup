import { useState, useRef } from 'react'
import { Upload, X, Plus, CheckCircle2, Circle, ExternalLink, Loader2, Send } from 'lucide-react'
import type { EvidenceLink, MilestoneData } from './types'

interface EvidenceFormProps {
  criteria: MilestoneData['criteria']
  isSubmitting: boolean
  onCancel: () => void
  onSubmit: (files: File[], links: EvidenceLink[], checkedCriteria: string[]) => Promise<void>
}

const EvidenceForm = ({ criteria, isSubmitting, onCancel, onSubmit }: EvidenceFormProps) => {
  const [files, setFiles] = useState<File[]>([])
  const [links, setLinks] = useState<EvidenceLink[]>([{ name: '', url: '' }])
  const [checkedCriteria, setCheckedCriteria] = useState<boolean[]>(criteria.map(() => false))
  const fileInputRef = useRef<HTMLInputElement>(null)

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!e.target.files) return
    setFiles(prev => [...prev, ...Array.from(e.target.files!)])
  }
  const removeFile = (i: number) => setFiles(prev => prev.filter((_, idx) => idx !== i))

  const addLink = () => setLinks(prev => [...prev, { name: '', url: '' }])
  const removeLink = (i: number) => setLinks(prev => prev.filter((_, idx) => idx !== i))
  const updateLink = (i: number, field: 'name' | 'url', val: string) =>
    setLinks(prev => prev.map((l, idx) => idx === i ? { ...l, [field]: val } : l))

  const toggleCriteria = (i: number) =>
    setCheckedCriteria(prev => prev.map((v, idx) => idx === i ? !v : v))

  const handleSubmit = async () => {
    const validLinks = links.filter(l => l.url.trim())
    const checkedTexts = criteria.filter((_, i) => checkedCriteria[i])
    await onSubmit(files, validLinks, checkedTexts)
  }

  return (
    <div className="border-t border-border px-[20px] py-[20px] flex flex-col gap-[20px]">

      {/* Criteria */}
      {criteria.length > 0 && (
        <div>
          <p className="text-[13px] font-semibold text-foreground mb-[4px]">
            เกณฑ์การยอมรับ <span className="text-[#EF4444]">*</span>
          </p>
          <p className="text-[12px] text-muted-foreground mb-[10px]">ติ๊กทุกข้อที่ทำเสร็จเรียบร้อยแล้ว</p>
          <div className="flex flex-col gap-[8px]">
            {criteria.map((c, i) => (
              <button
                key={i}
                onClick={() => toggleCriteria(i)}
                className="flex items-center gap-[10px] p-[12px] rounded-[10px] border border-border hover:bg-[#F8F9FA] transition-colors cursor-pointer text-left w-full"
              >
                {checkedCriteria[i]
                  ? <CheckCircle2 size={18} className="text-primary shrink-0" />
                  : <Circle size={18} className="text-muted-foreground shrink-0" />
                }
                <span className="text-[13px] text-foreground">{c}</span>
              </button>
            ))}
          </div>
        </div>
      )}

      {/* File upload */}
      <div>
        <p className="text-[13px] font-semibold text-foreground mb-[4px]">
          ไฟล์แนบ <span className="text-[#EF4444]">*</span>
        </p>
        <p className="text-[12px] text-muted-foreground mb-[10px]">รูปภาพ (≤10MB) หรือ PDF (≤50MB)</p>
        <button
          type="button"
          onClick={() => fileInputRef.current?.click()}
          className="w-full flex items-center justify-center gap-[8px] p-[20px] border-2 border-dashed border-border rounded-[12px] cursor-pointer hover:border-primary/50 hover:bg-[#F8F9FA] transition-colors"
        >
          <Upload size={16} className="text-muted-foreground" />
          <span className="text-[13px] text-muted-foreground">อัปโหลดไฟล์</span>
        </button>
        <input ref={fileInputRef} type="file" multiple className="hidden" onChange={handleFileChange} accept="image/*,.pdf" />
        {files.length > 0 && (
          <div className="flex flex-col gap-[6px] mt-[10px]">
            {files.map((f, i) => (
              <div key={i} className="flex items-center justify-between px-[12px] py-[8px] rounded-[8px] bg-[#F8F9FA] border border-border">
                <span className="text-[12px] text-foreground truncate max-w-[80%]">{f.name}</span>
                <button onClick={() => removeFile(i)} className="text-muted-foreground hover:text-[#EF4444] transition-colors cursor-pointer">
                  <X size={14} />
                </button>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* External links */}
      <div>
        <p className="text-[13px] font-semibold text-foreground mb-[4px]">
          ลิงก์ภายนอก <span className="text-[#EF4444]">*</span>
        </p>
        <p className="text-[12px] text-muted-foreground mb-[10px]">GitHub, Figma, วิดีโอ หรือลิงก์อื่นๆ</p>
        <div className="flex flex-col gap-[8px]">
          {links.map((link, i) => (
            <div key={i} className="flex items-center gap-[8px]">
              <input
                type="text"
                placeholder="ชื่อ (เช่น GitHub)"
                value={link.name}
                onChange={e => updateLink(i, 'name', e.target.value)}
                className="w-[140px] shrink-0 px-[10px] py-[8px] rounded-[8px] border border-border text-[13px] outline-none focus:border-primary"
              />
              <div className="flex-1 flex items-center gap-[6px] px-[10px] py-[8px] rounded-[8px] border border-border focus-within:border-primary">
                <ExternalLink size={14} className="text-muted-foreground shrink-0" />
                <input
                  type="url"
                  placeholder="https://..."
                  value={link.url}
                  onChange={e => updateLink(i, 'url', e.target.value)}
                  className="flex-1 text-[13px] outline-none bg-transparent"
                />
              </div>
              {links.length > 1 && (
                <button onClick={() => removeLink(i)} className="text-muted-foreground hover:text-[#EF4444] transition-colors cursor-pointer">
                  <X size={16} />
                </button>
              )}
            </div>
          ))}
          <button
            onClick={addLink}
            className="flex items-center gap-[6px] text-[13px] text-primary hover:underline w-fit mt-[2px] cursor-pointer"
          >
            <Plus size={14} /> เพิ่มลิงก์
          </button>
        </div>
      </div>

      {/* Actions */}
      <div className="flex justify-end gap-[10px] pt-[4px]">
        <button
          onClick={onCancel}
          className="px-[20px] py-[9px] rounded-[10px] border border-border text-[13px] font-medium text-foreground hover:bg-[#F8F9FA] transition-colors cursor-pointer"
        >
          ยกเลิก
        </button>
        <button
          onClick={handleSubmit}
          disabled={isSubmitting}
          className="flex items-center gap-[6px] px-[20px] py-[9px] rounded-[10px] bg-primary text-white text-[13px] font-medium hover:bg-primary/90 transition-colors disabled:opacity-60 cursor-pointer disabled:cursor-not-allowed"
        >
          {isSubmitting ? <Loader2 size={14} className="animate-spin" /> : <Send size={14} />}
          ส่งหลักฐาน
        </button>
      </div>
    </div>
  )
}

export default EvidenceForm
