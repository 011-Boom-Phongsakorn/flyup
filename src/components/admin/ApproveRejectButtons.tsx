import { CheckCircle, XCircle, Loader2 } from 'lucide-react'

interface ApproveRejectButtonsProps {
    isLoading: boolean
    onApprove: () => void
    onReject: () => void
}

const ApproveRejectButtons = ({ isLoading, onApprove, onReject }: ApproveRejectButtonsProps) => (
    <div className="flex justify-center gap-[8px]">
        <button
            onClick={onApprove}
            disabled={isLoading}
            className="flex items-center gap-1 px-[12px] py-[6px] rounded-[8px] bg-green-50 text-green-600 border border-green-200 hover:bg-green-100 transition-colors disabled:opacity-50 text-[13px] font-medium"
        >
            {isLoading ? <Loader2 size={13} className="animate-spin" /> : <CheckCircle size={13} />}
            อนุมัติ
        </button>
        <button
            onClick={onReject}
            disabled={isLoading}
            className="flex items-center gap-1 px-[12px] py-[6px] rounded-[8px] bg-red-50 text-red-600 border border-red-200 hover:bg-red-100 transition-colors disabled:opacity-50 text-[13px] font-medium"
        >
            {isLoading ? <Loader2 size={13} className="animate-spin" /> : <XCircle size={13} />}
            ปฏิเสธ
        </button>
    </div>
)

export default ApproveRejectButtons
