import { useState, useEffect } from 'react'
import { useParams } from 'react-router'
import { Megaphone, Plus, Trash2, Edit2, Check, X } from 'lucide-react'
import { useProjectStore } from '../../store/useProjectStore'
import StepNavigation from '../StepNavigation'

const Step5Updates = () => {
  const { projectId } = useParams()
  const {
    updates, isLoadingUpdates: isLoading, isSavingUpdate: isSaving,
    fetchProjectUpdates, addProjectUpdate, editProjectUpdate, deleteProjectUpdate,
  } = useProjectStore()
  const [form, setForm] = useState({ title: '', content: '' }) // ฟอร์มสร้างอัปเดตใหม่
  const [editingId, setEditingId] = useState<number | null>(null) // id ของอัปเดตที่กำลังแก้ไขอยู่ (null = ไม่มี)
  const [editForm, setEditForm] = useState({ title: '', content: '' }) // ฟอร์มแก้ไขอัปเดตที่เลือกไว้

  // โหลดรายการอัปเดตของโปรเจกต์นี้จาก API เมื่อมี projectId
  useEffect(() => {
    if (projectId) fetchProjectUpdates(projectId)
  }, [projectId, fetchProjectUpdates])

  // สร้างอัปเดตใหม่ แล้วเคลียร์ฟอร์มถ้าสำเร็จ
  const handleCreate = async () => {
    if (!projectId) return
    const ok = await addProjectUpdate(projectId, form)
    if (ok) setForm({ title: '', content: '' })
  }

  // บันทึกการแก้ไขอัปเดตตาม id แล้วปิดโหมดแก้ไขถ้าสำเร็จ
  const handleEdit = async (id: number) => {
    const ok = await editProjectUpdate(id, editForm)
    if (ok) setEditingId(null)
  }

  // ลบอัปเดตตาม id
  const handleDelete = async (id: number) => {
    await deleteProjectUpdate(id)
  }

  return (
    <div className="flex flex-col gap-[24px] p-[10px]">
      {/* ฟอร์มสร้างอัปเดตใหม่ */}
      <div className="flex flex-col p-[30px] bg-white-foreground rounded-[12px] gap-[16px]">
        <div className="flex items-center gap-[8px]">
          <Megaphone size={18} className="text-foreground" />
          <h2 className="text-[20px] font-semibold text-foreground">อัปเดตโปรเจกต์</h2>
        </div>
        <p className="text-[13px] text-muted-foreground -mt-[6px]">
          แจ้งข่าวสารความคืบหน้าให้ผู้สนับสนุนทราบระหว่างช่วง Funding
        </p>

        <div className="flex flex-col gap-[6px]">
          <label className="text-[13px] font-medium text-foreground">หัวข้อ <span className="text-error">*</span></label>
          <input
            data-testid="update-title-input"
            value={form.title}
            onChange={e => setForm(p => ({ ...p, title: e.target.value }))}
            placeholder="หัวข้ออัปเดต เช่น 'ความคืบหน้าสัปดาห์ที่ 1'"
            className="border border-border rounded-[8px] px-[12px] py-[10px] text-[14px] outline-none focus:border-primary transition-colors bg-background hover:border-primary/50"
          />
        </div>

        <div className="flex flex-col gap-[6px]">
          <label className="text-[13px] font-medium text-foreground">เนื้อหา <span className="text-error">*</span></label>
          <textarea
            data-testid="update-content-input"
            value={form.content}
            onChange={e => setForm(p => ({ ...p, content: e.target.value }))}
            onInput={e => { const t = e.currentTarget; t.style.height = 'auto'; t.style.height = t.scrollHeight + 'px'; }}
            placeholder="รายละเอียดอัปเดต..."
            rows={4}
            className="border border-border rounded-[8px] px-[12px] py-[10px] text-[14px] outline-none focus:border-primary transition-colors bg-background resize-none hover:border-primary/50 overflow-hidden"
          />
        </div>

        <button
          data-testid="update-add-btn"
          onClick={handleCreate}
          disabled={isSaving}
          className="self-start flex items-center gap-[6px] bg-primary hover:bg-primary-hover text-white px-[16px] py-[9px] rounded-[8px] text-[14px] font-medium transition-colors disabled:opacity-50"
        >
          <Plus size={16} />
          {isSaving ? 'กำลังบันทึก...' : 'เพิ่มอัปเดต'}
        </button>
      </div>

      {/* รายการอัปเดต */}
      <div className="flex flex-col gap-[12px]">
        <h3 className="text-[16px] font-semibold text-foreground px-[4px]">อัปเดตทั้งหมด</h3>

        {isLoading ? (
          <p className="text-muted-foreground text-[14px] text-center py-[24px]">กำลังโหลด...</p>
        ) : updates.length === 0 ? (
          <div className="bg-white-foreground border border-dashed border-border rounded-[12px] p-[32px] text-center text-muted-foreground text-[14px]">
            ยังไม่มีอัปเดต — เพิ่มอัปเดตแรกได้เลย
          </div>
        ) : (
          updates.map((u, idx) => (
            <div key={u.id} className="bg-white-foreground border border-border rounded-[12px] p-[20px] flex flex-col gap-[10px]">
              {editingId === u.id ? (
                <>
                  <input
                    value={editForm.title}
                    onChange={e => setEditForm(p => ({ ...p, title: e.target.value }))}
                    className="border border-border rounded-[8px] px-[12px] py-[8px] text-[14px] outline-none focus:border-primary bg-background"
                  />
                  <textarea
                    ref={el => { if (el) { el.style.height = 'auto'; el.style.height = el.scrollHeight + 'px'; } }}
                    value={editForm.content}
                    onChange={e => setEditForm(p => ({ ...p, content: e.target.value }))}
                    onInput={e => { const t = e.currentTarget; t.style.height = 'auto'; t.style.height = t.scrollHeight + 'px'; }}
                    rows={3}
                    className="border border-border rounded-[8px] px-[12px] py-[8px] text-[14px] outline-none focus:border-primary bg-background resize-none overflow-hidden"
                  />
                  <div className="flex gap-[10px]">
                    <button
                      data-testid={`update-edit-save-btn-${u.id}`}
                      onClick={() => handleEdit(u.id)}
                      className="flex items-center gap-[4px] text-[13px] text-green-600 hover:text-green-700 font-medium"
                    >
                      <Check size={14} /> บันทึก
                    </button>
                    <button
                      data-testid={`update-edit-cancel-btn-${u.id}`}
                      onClick={() => setEditingId(null)}
                      className="flex items-center gap-[4px] text-[13px] text-muted-foreground hover:text-foreground"
                    >
                      <X size={14} /> ยกเลิก
                    </button>
                  </div>
                </>
              ) : (
                <>
                  <span className="text-[12px] font-medium text-muted-foreground uppercase tracking-wide">
                    อัปเดต #{updates.length - idx}
                  </span>
                  <div className="flex items-start justify-between gap-[8px]">
                    <h4 className="font-semibold text-foreground text-[15px]">{u.title}</h4>
                    <div className="flex gap-[8px] shrink-0">
                      <button
                        data-testid={`update-edit-open-btn-${u.id}`}
                        onClick={() => { setEditingId(u.id); setEditForm({ title: u.title, content: u.body }) }}
                        className="text-muted-foreground hover:text-primary transition-colors"
                      >
                        <Edit2 size={15} />
                      </button>
                      <button
                        data-testid={`update-delete-btn-${u.id}`}
                        onClick={() => handleDelete(u.id)}
                        className="text-muted-foreground hover:text-error transition-colors"
                      >
                        <Trash2 size={15} />
                      </button>
                    </div>
                  </div>
                  <p className="text-[14px] text-muted-foreground whitespace-pre-wrap">{u.body}</p>
                  <p className="text-[12px] text-muted-foreground">
                    {new Date(u.created_at).toLocaleDateString('th-TH', { year: 'numeric', month: 'long', day: 'numeric' })}
                  </p>
                </>
              )}
            </div>
          ))
        )}
      </div>

      <StepNavigation />
    </div>
  )
}

export default Step5Updates
