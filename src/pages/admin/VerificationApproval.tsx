import { useEffect, useState } from "react"
import { CheckCircle, XCircle, ExternalLink, Loader2 } from "lucide-react"
import api from "../../services/api"
import toast from "react-hot-toast"
import { AxiosError } from "axios"

interface StudentVerification {
    id: number
    user_id: number
    document: string
    status: string
    CreatedAt: string
}

interface IDCardVerification {
    id: number
    user_id: number
    document: string
    selfie_url: string | null
    status: string
    face_score: number | null
    CreatedAt: string
}

type Tab = "student" | "idcard"

const formatDate = (iso: string) => {
    const d = new Date(iso)
    return d.toLocaleDateString("th-TH", { day: "numeric", month: "short", year: "numeric" })
}

const VerificationApproval = () => {
    const [tab, setTab] = useState<Tab>("student")
    const [students, setStudents] = useState<StudentVerification[]>([])
    const [idCards, setIdCards] = useState<IDCardVerification[]>([])
    const [loading, setLoading] = useState(false)
    const [actionLoading, setActionLoading] = useState<number | null>(null)
    const [preview, setPreview] = useState<{ url: string; label: string } | null>(null)

    const fetchData = async () => {
        setLoading(true)
        try {
            const [sRes, iRes] = await Promise.all([
                api.get("/admin/student-verifications"),
                api.get("/admin/id-card-verifications"),
            ])
            setStudents(sRes.data?.data ?? [])
            setIdCards(iRes.data?.data ?? [])
        } catch {
            toast.error("โหลดข้อมูลไม่สำเร็จ")
        } finally {
            setLoading(false)
        }
    }

    useEffect(() => {
        fetchData()
    }, [])

    const handleStudentAction = async (id: number, action: "approve" | "reject") => {
        setActionLoading(id)
        try {
            if (action === "approve") {
                await api.patch(`/admin/approve-student-card/${id}`)
                toast.success("อนุมัติบัตรนักศึกษาสำเร็จ")
            } else {
                await api.patch(`/admin/reject-student-card/${id}`)
                toast.success("ปฏิเสธบัตรนักศึกษาแล้ว")
            }
            setStudents((prev) => prev.filter((s) => s.id !== id))
        } catch (error) {
            const msg = error instanceof AxiosError ? error.response?.data?.message : null
            toast.error(msg || "เกิดข้อผิดพลาด")
        } finally {
            setActionLoading(null)
        }
    }

    const handleIDCardAction = async (id: number, action: "approve" | "reject") => {
        setActionLoading(id)
        try {
            if (action === "approve") {
                await api.patch(`/admin/approve-id-card/${id}`)
                toast.success("อนุมัติบัตรประชาชนสำเร็จ")
            } else {
                await api.patch(`/admin/reject-id-card/${id}`)
                toast.success("ปฏิเสธบัตรประชาชนแล้ว")
            }
            setIdCards((prev) => prev.filter((c) => c.id !== id))
        } catch (error) {
            const msg = error instanceof AxiosError ? error.response?.data?.message : null
            toast.error(msg || "เกิดข้อผิดพลาด")
        } finally {
            setActionLoading(null)
        }
    }

    const pendingStudent = students.length
    const pendingID = idCards.length

    return (
        <div className="flex flex-col gap-[16px]">
            <div className="p-[10px]">
                <h1 className="font-semibold text-[24px]">ตรวจสอบใบสมัคร Pioneer</h1>
                <p className="text-[12px] text-muted-foreground">อนุมัติหรือปฏิเสธการยืนยันตัวตนของ Pioneer</p>
            </div>

            {/* Tabs */}
            <div className="flex gap-[8px]">
                <button
                    onClick={() => setTab("student")}
                    className={`flex items-center gap-[8px] px-[16px] py-[8px] rounded-[10px] text-[14px] font-medium transition-colors ${tab === "student" ? "bg-primary text-white" : "bg-white border border-border text-foreground hover:bg-muted"}`}
                >
                    บัตรนักศึกษา
                    {pendingStudent > 0 && (
                        <span className={`text-[11px] px-[6px] py-[1px] rounded-full font-semibold ${tab === "student" ? "bg-white text-primary" : "bg-primary text-white"}`}>
                            {pendingStudent}
                        </span>
                    )}
                </button>
                <button
                    onClick={() => setTab("idcard")}
                    className={`flex items-center gap-[8px] px-[16px] py-[8px] rounded-[10px] text-[14px] font-medium transition-colors ${tab === "idcard" ? "bg-primary text-white" : "bg-white border border-border text-foreground hover:bg-muted"}`}
                >
                    บัตรประชาชน
                    {pendingID > 0 && (
                        <span className={`text-[11px] px-[6px] py-[1px] rounded-full font-semibold ${tab === "idcard" ? "bg-white text-primary" : "bg-primary text-white"}`}>
                            {pendingID}
                        </span>
                    )}
                </button>
            </div>

            {/* Content */}
            <div className="bg-white rounded-xl border border-border overflow-hidden text-[14px]">
                {loading ? (
                    <div className="flex items-center justify-center py-[60px]">
                        <Loader2 size={28} className="animate-spin text-primary" />
                    </div>
                ) : tab === "student" ? (
                    <>
                        <div className="grid grid-cols-5 bg-[#f8f9fc] px-[16px] py-[12px] font-medium text-gray-500 border-b border-border">
                            <div>User ID</div>
                            <div>วันที่ส่ง</div>
                            <div>เอกสาร</div>
                            <div className="text-center">สถานะ</div>
                            <div className="text-center">จัดการ</div>
                        </div>
                        {students.length === 0 ? (
                            <div className="py-[60px] text-center text-muted-foreground">ไม่มีรายการรออนุมัติ</div>
                        ) : (
                            students.map((s) => (
                                <div key={s.id} className="grid grid-cols-5 px-[16px] items-center border-b border-border last:border-0">
                                    <div className="py-[14px] text-muted-foreground">#{s.user_id}</div>
                                    <div className="py-[14px]">{formatDate(s.CreatedAt)}</div>
                                    <div className="py-[14px]">
                                        <button
                                            onClick={() => setPreview({ url: s.document, label: "บัตรนักศึกษา" })}
                                            className="flex items-center gap-[4px] text-primary hover:underline"
                                        >
                                            <ExternalLink size={13} /> ดูบัตร
                                        </button>
                                    </div>
                                    <div className="py-[14px] flex justify-center">
                                        <span className="bg-amber-50 text-amber-600 border border-amber-200 text-[12px] px-[10px] py-[2px] rounded-full font-medium">
                                            รออนุมัติ
                                        </span>
                                    </div>
                                    <div className="py-[14px] flex justify-center gap-[8px]">
                                        <button
                                            onClick={() => handleStudentAction(s.id, "approve")}
                                            disabled={actionLoading === s.id}
                                            className="flex items-center gap-[4px] px-[12px] py-[6px] rounded-[8px] bg-green-50 text-green-600 border border-green-200 hover:bg-green-100 transition-colors disabled:opacity-50 text-[13px] font-medium"
                                        >
                                            {actionLoading === s.id ? <Loader2 size={13} className="animate-spin" /> : <CheckCircle size={13} />}
                                            อนุมัติ
                                        </button>
                                        <button
                                            onClick={() => handleStudentAction(s.id, "reject")}
                                            disabled={actionLoading === s.id}
                                            className="flex items-center gap-[4px] px-[12px] py-[6px] rounded-[8px] bg-red-50 text-red-600 border border-red-200 hover:bg-red-100 transition-colors disabled:opacity-50 text-[13px] font-medium"
                                        >
                                            {actionLoading === s.id ? <Loader2 size={13} className="animate-spin" /> : <XCircle size={13} />}
                                            ปฏิเสธ
                                        </button>
                                    </div>
                                </div>
                            ))
                        )}
                    </>
                ) : (
                    <>
                        <div className="grid grid-cols-6 bg-[#f8f9fc] px-[16px] py-[12px] font-medium text-gray-500 border-b border-border">
                            <div>User ID</div>
                            <div>วันที่ส่ง</div>
                            <div>บัตรประชาชน</div>
                            <div>เซลฟี่</div>
                            <div className="text-center">สถานะ</div>
                            <div className="text-center">จัดการ</div>
                        </div>
                        {idCards.length === 0 ? (
                            <div className="py-[60px] text-center text-muted-foreground">ไม่มีรายการรออนุมัติ</div>
                        ) : (
                            idCards.map((c) => (
                                <div key={c.id} className="grid grid-cols-6 px-[16px] items-center border-b border-border last:border-0">
                                    <div className="py-[14px] text-muted-foreground">#{c.user_id}</div>
                                    <div className="py-[14px]">{formatDate(c.CreatedAt)}</div>
                                    <div className="py-[14px]">
                                        <button
                                            onClick={() => setPreview({ url: c.document, label: "บัตรประชาชน" })}
                                            className="flex items-center gap-[4px] text-primary hover:underline"
                                        >
                                            <ExternalLink size={13} /> ดูบัตร
                                        </button>
                                    </div>
                                    <div className="py-[14px]">
                                        {c.selfie_url ? (
                                            <button
                                                onClick={() => setPreview({ url: c.selfie_url!, label: "เซลฟี่" })}
                                                className="flex items-center gap-[4px] text-primary hover:underline"
                                            >
                                                <ExternalLink size={13} /> ดูรูป
                                            </button>
                                        ) : (
                                            <span className="text-muted-foreground">-</span>
                                        )}
                                    </div>
                                    <div className="py-[14px] flex justify-center">
                                        <span className="bg-amber-50 text-amber-600 border border-amber-200 text-[12px] px-[10px] py-[2px] rounded-full font-medium">
                                            รออนุมัติ
                                        </span>
                                    </div>
                                    <div className="py-[14px] flex justify-center gap-[8px]">
                                        <button
                                            onClick={() => handleIDCardAction(c.id, "approve")}
                                            disabled={actionLoading === c.id}
                                            className="flex items-center gap-[4px] px-[12px] py-[6px] rounded-[8px] bg-green-50 text-green-600 border border-green-200 hover:bg-green-100 transition-colors disabled:opacity-50 text-[13px] font-medium"
                                        >
                                            {actionLoading === c.id ? <Loader2 size={13} className="animate-spin" /> : <CheckCircle size={13} />}
                                            อนุมัติ
                                        </button>
                                        <button
                                            onClick={() => handleIDCardAction(c.id, "reject")}
                                            disabled={actionLoading === c.id}
                                            className="flex items-center gap-[4px] px-[12px] py-[6px] rounded-[8px] bg-red-50 text-red-600 border border-red-200 hover:bg-red-100 transition-colors disabled:opacity-50 text-[13px] font-medium"
                                        >
                                            {actionLoading === c.id ? <Loader2 size={13} className="animate-spin" /> : <XCircle size={13} />}
                                            ปฏิเสธ
                                        </button>
                                    </div>
                                </div>
                            ))
                        )}
                    </>
                )}
            </div>

            {/* Image Preview Modal */}
            {preview && (
                <div
                    className="fixed inset-0 bg-black/60 flex items-center justify-center z-50"
                    onClick={() => setPreview(null)}
                >
                    <div
                        className="bg-white rounded-[16px] p-[16px] max-w-[600px] w-full mx-[16px] flex flex-col gap-[12px]"
                        onClick={(e) => e.stopPropagation()}
                    >
                        <div className="flex items-center justify-between">
                            <h3 className="font-semibold text-foreground">{preview.label}</h3>
                            <button onClick={() => setPreview(null)} className="text-muted-foreground hover:text-foreground text-[20px] leading-none">&times;</button>
                        </div>
                        <img
                            src={preview.url}
                            alt={preview.label}
                            className="w-full max-h-[500px] object-contain rounded-[8px] border border-border"
                        />
                    </div>
                </div>
            )}
        </div>
    )
}

export default VerificationApproval
