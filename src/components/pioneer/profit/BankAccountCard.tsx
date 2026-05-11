import { Landmark, Copy } from 'lucide-react'
import toast from 'react-hot-toast'

const PLATFORM_BANK_NAME      = import.meta.env.VITE_PLATFORM_BANK_NAME     ?? 'ธนาคารกสิกรไทย (KBANK)'
const PLATFORM_ACCOUNT_NAME   = import.meta.env.VITE_PLATFORM_ACCOUNT_NAME  ?? 'บริษัท ฟลายอัพ จำกัด'
const PLATFORM_ACCOUNT_NUMBER = import.meta.env.VITE_PLATFORM_ACCOUNT_NUMBER ?? 'xxx-x-xxxxx-x'

interface Props { compact?: boolean }

export default function BankAccountCard({ compact = false }: Props) {
  const copy = () => { navigator.clipboard.writeText(PLATFORM_ACCOUNT_NUMBER); toast.success('คัดลอกเลขบัญชีแล้ว') }

  if (compact) {
    return (
      <div className="bg-blue-50 border border-blue-200 rounded-xl p-3 flex items-center gap-3">
        <Landmark size={16} className="text-blue-600 shrink-0" />
        <div className="flex-1 min-w-0">
          <p className="text-[11px] text-blue-600 font-semibold">โอนกำไรมาที่บัญชี FlyUp</p>
          <p className="text-[12px] font-bold text-blue-800">{PLATFORM_ACCOUNT_NAME}</p>
          <p className="text-[11px] text-blue-700">{PLATFORM_BANK_NAME}</p>
        </div>
        <div className="flex items-center gap-1">
          <span className="font-mono text-[13px] font-bold text-blue-800">{PLATFORM_ACCOUNT_NUMBER}</span>
          <button onClick={copy} className="p-1 hover:bg-blue-100 rounded cursor-pointer">
            <Copy size={13} className="text-blue-600" />
          </button>
        </div>
      </div>
    )
  }

  return (
    <div className="bg-blue-50 border border-blue-200 rounded-2xl p-4 flex items-center gap-4">
      <div className="w-10 h-10 bg-blue-100 rounded-xl flex items-center justify-center shrink-0">
        <Landmark size={20} className="text-blue-600" />
      </div>
      <div className="flex-1">
        <p className="text-[12px] text-blue-600 font-semibold mb-0.5">โอนกำไรมาที่บัญชีนี้ แล้วนำเลขอ้างอิงมากรอกด้านล่าง</p>
        <p className="text-[14px] font-bold text-blue-900">{PLATFORM_ACCOUNT_NAME}</p>
        <p className="text-[12px] text-blue-700">{PLATFORM_BANK_NAME}</p>
      </div>
      <div className="flex items-center gap-2 shrink-0">
        <span className="font-mono text-[15px] font-bold text-blue-800">{PLATFORM_ACCOUNT_NUMBER}</span>
        <button onClick={copy} className="p-1.5 hover:bg-blue-100 rounded-lg transition-colors cursor-pointer">
          <Copy size={15} className="text-blue-600" />
        </button>
      </div>
    </div>
  )
}
