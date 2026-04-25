import { FileText, AlertTriangle } from 'lucide-react'
import PageHeader from '../../components/admin/PageHeader'

const AdminAuditLogs = () => {
    return (
        <div className="flex flex-col gap-[16px]">
            <PageHeader title="บันทึกการตรวจสอบ" subtitle="ประวัติการกระทำของ admin (อนุมัติ/ระงับ/แก้ไข)" />

            <div className="bg-amber-50 border border-amber-200 rounded-xl p-4 flex items-start gap-3 mx-2.5">
                <AlertTriangle size={18} className="text-amber-600 shrink-0 mt-0.5" />
                <div className="flex flex-col gap-0.5">
                    <p className="text-[13px] font-semibold text-amber-800">รอ Backend</p>
                    <p className="text-[12px] text-amber-700">
                        ฟีเจอร์นี้ต้องการ audit log handler ที่ยังไม่ได้สร้าง — ขอ endpoint:
                        GET /admin/audit-logs (พร้อม filter: actor_id, action, target_type, date_range)
                        และ middleware ที่ log ทุก admin action ลงตารางใหม่
                    </p>
                </div>
            </div>

            <div className="bg-white rounded-xl border border-dashed border-border p-12 mx-2.5 flex flex-col items-center justify-center gap-3 text-muted-foreground">
                <FileText size={36} className="opacity-40" />
                <p className="text-sm">ยังไม่มีบันทึก</p>
                <p className="text-[12px]">หน้านี้พร้อมรอเชื่อม API เมื่อ backend สร้างเสร็จ</p>
            </div>
        </div>
    )
}

export default AdminAuditLogs
