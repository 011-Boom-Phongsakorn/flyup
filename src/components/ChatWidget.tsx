import { useEffect, useRef, useState } from 'react'
import { MessageCircle, X, SquarePen, Clock, Send, Loader2, Check, XCircle, Bot } from 'lucide-react'
import { Link } from 'react-router'
import { useChatStore } from '../store/useChatStore'
import { useAuthStore } from '../store/useAuthStore'

const ACTION_LABELS: Record<string, string> = {
  refund_transaction: 'ขอคืนเงิน',
  cancel_transaction: 'ยกเลิกการลงทุน',
  vote_milestone: 'โหวต Milestone',
  file_complaint: 'ร้องเรียน',
  mark_notifications_read: 'อ่านการแจ้งเตือนทั้งหมด',
}

export default function ChatWidget() {
  const { isOpen, messages, pendingAction, isSending, toggle, close, clearSession, sendMessage, confirmAction } =
    useChatStore()
  const { authUser } = useAuthStore()
  const [input, setInput] = useState('')
  const bottomRef = useRef<HTMLDivElement>(null)
  const inputRef = useRef<HTMLInputElement>(null)

  useEffect(() => {
    if (isOpen) {
      bottomRef.current?.scrollIntoView({ behavior: 'smooth' })
      inputRef.current?.focus()
    }
  }, [isOpen, messages])

  const handleSend = async () => {
    const text = input.trim()
    if (!text || isSending) return
    setInput('')
    await sendMessage(text)
  }

  const handleKey = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault()
      handleSend()
    }
  }

  return (
    <div className="fixed bottom-6 right-6 z-50 flex flex-col items-end gap-3">
      {isOpen && (
        <div className="w-[360px] h-[520px] bg-white rounded-2xl shadow-2xl border border-gray-100 flex flex-col overflow-hidden">
          {/* Header */}
          <div className="flex items-center justify-end gap-2 px-4 py-3 border-b border-gray-100">
            <button
              onClick={() => { clearSession(); inputRef.current?.focus() }}
              className="w-8 h-8 flex items-center justify-center rounded-lg text-gray-400 hover:text-gray-700 hover:bg-gray-100 transition-colors cursor-pointer"
              title="เริ่มแชทใหม่"
            >
              <SquarePen size={16} />
            </button>
            <button
              className="w-8 h-8 flex items-center justify-center rounded-lg text-gray-400 hover:text-gray-700 hover:bg-gray-100 transition-colors cursor-pointer"
              title="ประวัติ"
            >
              <Clock size={16} />
            </button>
            <button
              onClick={close}
              className="w-8 h-8 flex items-center justify-center rounded-lg text-gray-400 hover:text-gray-700 hover:bg-gray-100 transition-colors cursor-pointer"
            >
              <X size={16} />
            </button>
          </div>

          {/* Body */}
          <div className="flex-1 overflow-y-auto px-4 py-4 flex flex-col gap-3">
            {!authUser ? (
              <div className="flex-1 flex flex-col items-center justify-center text-center gap-3 text-gray-400">
                <MessageCircle size={40} strokeWidth={1.2} />
                <p className="text-sm">กรุณา<Link to="/login" onClick={close} className="text-primary font-medium">เข้าสู่ระบบ</Link>เพื่อใช้งาน AI Support</p>
              </div>
            ) : messages.length === 0 && !isSending ? (
              <div className="flex-1 flex flex-col items-center justify-center gap-2 text-gray-300">
                <Bot size={36} strokeWidth={1} />
                <p className="text-xs text-gray-400">ถามอะไรก็ได้เกี่ยวกับ FlyUp</p>
              </div>
            ) : (
              <>
                {messages.map(msg => (
                  <div key={msg.id} className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}>
                    <div
                      className={`max-w-[80%] rounded-2xl px-4 py-2.5 text-sm leading-relaxed whitespace-pre-wrap ${
                        msg.role === 'user'
                          ? 'bg-[#1a1a1a] text-white rounded-br-sm'
                          : 'bg-gray-100 text-gray-800 rounded-bl-sm'
                      }`}
                    >
                      {msg.content}
                    </div>
                  </div>
                ))}

                {isSending && (
                  <div className="flex justify-start">
                    <div className="bg-gray-100 rounded-2xl rounded-bl-sm px-4 py-3">
                      <div className="flex gap-1.5 items-center">
                        <span className="w-1.5 h-1.5 bg-gray-400 rounded-full animate-bounce [animation-delay:0ms]" />
                        <span className="w-1.5 h-1.5 bg-gray-400 rounded-full animate-bounce [animation-delay:150ms]" />
                        <span className="w-1.5 h-1.5 bg-gray-400 rounded-full animate-bounce [animation-delay:300ms]" />
                      </div>
                    </div>
                  </div>
                )}

                {pendingAction && !isSending && (
                  <div className="flex justify-start">
                    <div className="bg-amber-50 border border-amber-200 rounded-2xl rounded-bl-sm px-4 py-3 max-w-[80%]">
                      <p className="text-xs text-amber-700 font-medium mb-2">
                        ยืนยัน: {ACTION_LABELS[pendingAction.type] ?? pendingAction.type}?
                      </p>
                      <div className="flex gap-2">
                        <button
                          onClick={() => confirmAction(pendingAction.id, true)}
                          className="flex items-center gap-1.5 px-3 py-1.5 bg-[#1a1a1a] text-white rounded-lg text-xs font-medium hover:bg-black transition-colors cursor-pointer"
                        >
                          <Check size={12} /> ยืนยัน
                        </button>
                        <button
                          onClick={() => confirmAction(pendingAction.id, false)}
                          className="flex items-center gap-1.5 px-3 py-1.5 bg-white border border-gray-200 text-gray-600 rounded-lg text-xs font-medium hover:bg-gray-50 transition-colors cursor-pointer"
                        >
                          <XCircle size={12} /> ปฏิเสธ
                        </button>
                      </div>
                    </div>
                  </div>
                )}

                <div ref={bottomRef} />
              </>
            )}
          </div>

          {/* Input */}
          <div className="px-4 pb-2 pt-2 border-t border-gray-100">
            <div className="flex items-center gap-2 bg-gray-50 rounded-xl px-3 py-2">
              <input
                ref={inputRef}
                value={input}
                onChange={e => setInput(e.target.value)}
                onKeyDown={handleKey}
                disabled={!authUser || isSending}
                placeholder="พิมพ์ข้อความ..."
                className="flex-1 bg-transparent text-sm outline-none placeholder:text-gray-400 disabled:opacity-50"
              />
              <button
                onClick={handleSend}
                disabled={!input.trim() || isSending || !authUser}
                className="w-8 h-8 flex-shrink-0 bg-[#1a1a1a] text-white rounded-full flex items-center justify-center disabled:opacity-30 disabled:cursor-not-allowed hover:bg-black transition-colors cursor-pointer"
              >
                {isSending ? <Loader2 size={14} className="animate-spin" /> : <Send size={14} />}
              </button>
            </div>
            <p className="text-center text-[10px] text-gray-400 mt-1.5">AI support อาจมีข้อผิดพลาด</p>
          </div>
        </div>
      )}

      {/* Toggle button */}
      <button
        onClick={toggle}
        className="w-12 h-12 bg-[#1a1a1a] text-white rounded-full flex items-center justify-center shadow-lg hover:bg-black transition-all hover:scale-105 active:scale-95 cursor-pointer"
      >
        {isOpen ? <X size={20} /> : <MessageCircle size={20} />}
      </button>
    </div>
  )
}
