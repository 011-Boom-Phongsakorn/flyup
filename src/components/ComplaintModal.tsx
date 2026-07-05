import { useState, useRef } from 'react'
import { Loader2, Flag, X, Link2, Plus, Paperclip, Trash2 } from 'lucide-react'
import { useComplaintStore } from '../store/useComplaintStore'
import api from '../services/api'
import toast from 'react-hot-toast'

interface EvidenceFile {
    id: string
    name: string
    url: string
    uploading: boolean
}

interface ComplaintModalProps {
    projectId: number
    projectTitle: string
    onClose: () => void
    onSuccess?: () => void
}

const ALLOWED_TYPES = ['image/png', 'image/jpeg', 'image/jpg', 'image/webp', 'application/pdf']
const MAX_FILE_SIZE = 10 * 1024 * 1024 // 10MB
const MAX_FILES = 5
const MAX_LINKS = 5

async function uploadToServer(file: File): Promise<string | null> {
    try {
        const formData = new FormData()
        formData.append('file', file)
        const res = await api.post('/upload', formData, {
            headers: { 'Content-Type': 'multipart/form-data' },
            timeout: 120000,
        })
        return res.data?.data?.url ?? null
    } catch {
        return null
    }
}

const ComplaintModal = ({ projectId, projectTitle, onClose, onSuccess }: ComplaintModalProps) => {
    const { fileComplaint, isSubmitting } = useComplaintStore()
    const [subject, setSubject] = useState('')
    const [body, setBody] = useState('')
    const [evidenceFiles, setEvidenceFiles] = useState<EvidenceFile[]>([])
    const [links, setLinks] = useState<string[]>([])
    const [linkInput, setLinkInput] = useState('')
    const [isUploading, setIsUploading] = useState(false)
    const fileInputRef = useRef<HTMLInputElement>(null)

    const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
        const selected = Array.from(e.target.files ?? [])
        if (fileInputRef.current) fileInputRef.current.value = ''
        if (!selected.length) return

        const valid = selected.filter(f => ALLOWED_TYPES.includes(f.type) && f.size <= MAX_FILE_SIZE)
        if (valid.length !== selected.length) {
            toast.error('รองรับเฉพาะ PNG, JPG, WEBP, PDF และขนาดไม่เกิน 10MB')
        }

        const slots = MAX_FILES - evidenceFiles.length
        if (slots <= 0) {
            toast.error(`อัปโหลดหลักฐานได้สูงสุด ${MAX_FILES} ไฟล์`)
            return
        }

        const toUpload = valid.slice(0, slots)
        if (!toUpload.length) return

        const pending: EvidenceFile[] = toUpload.map((f, i) => ({
            id: `pending-${Date.now()}-${i}`,
            name: f.name,
            url: '',
            uploading: true,
        }))
        setEvidenceFiles(prev => [...prev, ...pending])
        setIsUploading(true)

        for (let i = 0; i < toUpload.length; i++) {
            const url = await uploadToServer(toUpload[i])
            const pid = pending[i].id
            if (url) {
                setEvidenceFiles(prev =>
                    prev.map(ef => ef.id === pid ? { ...ef, url, uploading: false } : ef)
                )
            } else {
                setEvidenceFiles(prev => prev.filter(ef => ef.id !== pid))
                toast.error(`อัปโหลด ${toUpload[i].name} ไม่สำเร็จ`)
            }
        }
        setIsUploading(false)
    }

    const removeFile = (id: string) => setEvidenceFiles(prev => prev.filter(ef => ef.id !== id))

    const addLink = () => {
        const trimmed = linkInput.trim()
        if (!trimmed) return
        if (!/^https?:\/\//i.test(trimmed)) {
            toast.error('ลิงก์ต้องเริ่มต้นด้วย http:// หรือ https://')
            return
        }
        if (links.length >= MAX_LINKS) {
            toast.error(`เพิ่มลิงก์ได้สูงสุด ${MAX_LINKS} ลิงก์`)
            return
        }
        setLinks(prev => [...prev, trimmed])
        setLinkInput('')
    }

    const removeLink = (idx: number) => setLinks(prev => prev.filter((_, i) => i !== idx))

    const handleSubmit = async () => {
        if (!subject.trim() || body.trim().length < 10) return
        const uploadedUrls = evidenceFiles.filter(ef => ef.url).map(ef => ef.url)
        const allEvidence = [...uploadedUrls, ...links]
        const ok = await fileComplaint(
            projectId,
            subject.trim(),
            body.trim(),
            allEvidence.length > 0 ? allEvidence : undefined
        )
        if (ok) {
            onSuccess?.()
            onClose()
        }
    }

    const subjectValid = subject.trim().length >= 3
    const bodyValid = body.trim().length >= 10
    const canSubmit = subjectValid && bodyValid && !isSubmitting && !isUploading

    return (
        <div className="fixed inset-0 z-[60] bg-black/40 flex items-center justify-center p-4" onClick={onClose}>
            <div
                className="bg-white rounded-2xl w-full max-w-[520px] max-h-[90vh] overflow-y-auto p-6 shadow-xl"
                onClick={(e) => e.stopPropagation()}
            >
                {/* Header */}
                <div className="flex items-start justify-between mb-2">
                    <div className="flex items-center gap-2">
                        <div className="w-9 h-9 rounded-full bg-red-50 text-red-600 flex items-center justify-center shrink-0">
                            <Flag size={16} />
                        </div>
                        <h2 className="text-lg font-bold text-foreground">ร้องเรียนโปรเจกต์</h2>
                    </div>
                    <button onClick={onClose} className="text-muted-foreground hover:text-foreground cursor-pointer">
                        <X size={18} />
                    </button>
                </div>
                <p className="text-[12px] text-muted-foreground mb-4 ml-11">
                    โปรเจกต์: <span className="font-medium text-foreground">{projectTitle}</span>
                </p>

                {/* Warning */}
                <div className="bg-amber-50 border border-amber-200 rounded-lg p-3 mb-4 text-[12px] text-amber-800">
                    คำร้องเรียนจะถูกส่งไปยังทีมงาน FlyUp เพื่อตรวจสอบ — คุณสามารถร้องเรียนโปรเจกต์นี้ได้เพียงครั้งเดียว
                </div>

                {/* Form */}
                <div className="flex flex-col gap-4 mb-5">
                    {/* Subject */}
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

                    {/* Body */}
                    <div className="flex flex-col gap-1">
                        <label className="text-[13px] font-medium">รายละเอียด <span className="text-error">*</span></label>
                        <textarea
                            value={body}
                            onChange={(e) => setBody(e.target.value)}
                            rows={5}
                            placeholder="อธิบายสิ่งที่ต้องการรายงานให้ละเอียด (อย่างน้อย 10 ตัวอักษร)"
                            maxLength={5000}
                            className="border border-border rounded-lg px-3 py-2 text-[14px] outline-none focus:border-primary resize-none"
                        />
                        <span className="text-[11px] text-muted-foreground">{body.length}/5000</span>
                    </div>

                    {/* Evidence */}
                    <div className="flex flex-col gap-3">
                        <label className="text-[13px] font-medium">หลักฐานประกอบ <span className="text-[11px] text-muted-foreground font-normal">(ไม่บังคับ)</span></label>

                        {/* File Upload */}
                        <div className="flex flex-col gap-2">
                            <div className="flex items-center gap-2">
                                <button
                                    type="button"
                                    onClick={() => fileInputRef.current?.click()}
                                    disabled={evidenceFiles.length >= MAX_FILES || isUploading}
                                    className="flex items-center gap-1.5 px-3 py-1.5 text-[12px] border border-border rounded-lg hover:bg-muted/40 disabled:opacity-50 disabled:cursor-not-allowed transition-colors cursor-pointer"
                                >
                                    {isUploading
                                        ? <Loader2 size={13} className="animate-spin" />
                                        : <Paperclip size={13} />
                                    }
                                    แนบไฟล์
                                </button>
                                <span className="text-[11px] text-muted-foreground">
                                    PNG, JPG, WEBP, PDF · สูงสุด 10MB · {evidenceFiles.length}/{MAX_FILES} ไฟล์
                                </span>
                            </div>
                            <input
                                ref={fileInputRef}
                                type="file"
                                multiple
                                accept="image/png,image/jpeg,image/jpg,image/webp,application/pdf"
                                className="hidden"
                                onChange={handleFileChange}
                            />

                            {/* File list */}
                            {evidenceFiles.length > 0 && (
                                <div className="flex flex-col gap-1.5">
                                    {evidenceFiles.map(ef => (
                                        <div key={ef.id} className="flex items-center gap-2 bg-muted/30 border border-border rounded-lg px-3 py-2">
                                            <Paperclip size={12} className="text-muted-foreground shrink-0" />
                                            <span className="text-[12px] text-foreground flex-1 truncate">{ef.name}</span>
                                            {ef.uploading
                                                ? <Loader2 size={13} className="animate-spin text-muted-foreground shrink-0" />
                                                : <button
                                                    type="button"
                                                    onClick={() => removeFile(ef.id)}
                                                    className="text-muted-foreground hover:text-error transition-colors shrink-0 cursor-pointer"
                                                >
                                                    <Trash2 size={13} />
                                                </button>
                                            }
                                        </div>
                                    ))}
                                </div>
                            )}
                        </div>

                        {/* Link Input */}
                        <div className="flex flex-col gap-2">
                            <div className="flex gap-2">
                                <div className="relative flex-1">
                                    <Link2 size={13} className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" />
                                    <input
                                        value={linkInput}
                                        onChange={(e) => setLinkInput(e.target.value)}
                                        onKeyDown={(e) => e.key === 'Enter' && (e.preventDefault(), addLink())}
                                        placeholder="https://example.com/evidence"
                                        className="w-full border border-border rounded-lg pl-8 pr-3 py-1.5 text-[13px] outline-none focus:border-primary"
                                    />
                                </div>
                                <button
                                    type="button"
                                    onClick={addLink}
                                    disabled={!linkInput.trim() || links.length >= MAX_LINKS}
                                    className="flex items-center gap-1 px-3 py-1.5 text-[12px] border border-border rounded-lg hover:bg-muted/40 disabled:opacity-50 disabled:cursor-not-allowed transition-colors cursor-pointer"
                                >
                                    <Plus size={13} /> เพิ่ม
                                </button>
                            </div>

                            {/* Link list */}
                            {links.length > 0 && (
                                <div className="flex flex-col gap-1.5">
                                    {links.map((link, idx) => (
                                        <div key={idx} className="flex items-center gap-2 bg-muted/30 border border-border rounded-lg px-3 py-2">
                                            <Link2 size={12} className="text-muted-foreground shrink-0" />
                                            <a
                                                href={link}
                                                target="_blank"
                                                rel="noopener noreferrer"
                                                className="text-[12px] text-primary hover:underline flex-1 truncate"
                                            >
                                                {link}
                                            </a>
                                            <button
                                                type="button"
                                                onClick={() => removeLink(idx)}
                                                className="text-muted-foreground hover:text-error transition-colors shrink-0 cursor-pointer"
                                            >
                                                <Trash2 size={13} />
                                            </button>
                                        </div>
                                    ))}
                                </div>
                            )}
                        </div>
                    </div>
                </div>

                {/* Actions */}
                <div className="flex gap-2 justify-end">
                    <button
                        onClick={onClose}
                        className="px-4 py-2 text-[13px] rounded-lg border border-border hover:bg-gray-50 cursor-pointer"
                    >
                        ยกเลิก
                    </button>
                    <button
                        onClick={handleSubmit}
                        disabled={!canSubmit}
                        className="px-4 py-2 text-[13px] rounded-lg bg-red-600 hover:bg-red-700 text-white disabled:opacity-50 flex items-center gap-2 cursor-pointer"
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
