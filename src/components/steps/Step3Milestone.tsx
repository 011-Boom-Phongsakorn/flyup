import { useState, useRef, useMemo } from 'react'
import { useProjectStore, type Milestone } from '../../store/useProjectStore'
import { Plus, Trash2, Upload, Video, X } from 'lucide-react'
import StepNavigation from "../StepNavigation"
import toast from 'react-hot-toast'
import { useParams } from 'react-router'

const Step3Milestone = () => {
  const { projectId } = useParams()
  const [activePhase, setActivePhase] = useState(0) // 0-3
  // ✅ ดึง currentProject มาก่อน แล้วค่อยเข้าถึง milestones
  const { currentProject, updateMilestone, saveMilestonePhase } = useProjectStore()
  const fundingGoal = currentProject.fundingGoal || 0
  const phasePercents = [0.15, 0.20, 0.30, 0.35]

  const currentData = currentProject.milestones[activePhase]

  const projectMaxDateStr = useMemo(() => {
    if (!currentProject.projectDuration) return undefined
    const d = new Date()
    d.setMonth(d.getMonth() + currentProject.projectDuration)
    return d.toISOString().split('T')[0]
  }, [currentProject.projectDuration])

  const projectMaxDateDisplay = useMemo(() => {
    if (!currentProject.projectDuration) return ''
    const d = new Date()
    d.setMonth(d.getMonth() + currentProject.projectDuration)
    return d.toLocaleDateString('th-TH')
  }, [currentProject.projectDuration])

  const fileInputRef = useRef<HTMLInputElement>(null)
  const videoInputRef = useRef<HTMLInputElement>(null)

  // 1. ฟังก์ชันอัปเดตข้อมูลทั่วไปของ Milestone
  const handleChange = <K extends keyof Milestone>(field: K, value: Milestone[K]) => {
    updateMilestone(activePhase, { [field]: value })
  }

  // 2. ระบบจัดการรูปภาพ (จำกัดสูงสุด 5 รูป)
  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFiles = e.target.files
    if (selectedFiles) {
      const currentFiles = currentData.files || []
      const remainingSlots = 5 - currentFiles.length
      if (remainingSlots <= 0) {
        toast.error("อัปโหลดได้สูงสุด 5 ไฟล์ต่อ Milestone")
        return
      }
      const newFiles = Array.from(selectedFiles)
        .slice(0, remainingSlots)
        .map(file => ({
          name: file.name,
          url: file.type.startsWith('image/') ? URL.createObjectURL(file) : '',
          file: file
        }))
      handleChange('files', [...currentFiles, ...newFiles])
      if (fileInputRef.current) fileInputRef.current.value = ""
    }
  }

  // 3. ระบบจัดการวิดีโอ (จำกัดแค่ 1 คลิป)
  const handleVideoChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (file) {
      if (file.size > 50 * 1024 * 1024) {
        toast.error("วิดีโอต้องมีขนาดไม่เกิน 50MB")
        return
      }
      handleChange('video', {
        name: file.name,
        url: URL.createObjectURL(file),
        file: file
      })
    }
  }

  const removeImage = (index: number) => {
    const updatedFiles = currentData.files.filter((_, i) => i !== index)
    handleChange('files', updatedFiles)
  }

  const removeVideo = () => {
    handleChange('video', null)
    if (videoInputRef.current) videoInputRef.current.value = ""
  }

  return (
    <div className="flex flex-col gap-[40px] p-[10px]">
      
      {/* Container หลัก จัดเป็นรูปแบบการ์ดสีขาวแบบเต็มจอ มีขอบมน */}
      <div className="w-full flex flex-col bg-white-foreground rounded-[12px] p-[30px] gap-[30px] border border-border">
        
        {/* =========================================
            ส่วนที่ 1: เมนูนำทางเลือก Phase (Tabs)
            (ใช้วนลูปแสดง Phase 1 ถึง 4 เรียงต่อกันตรงกลางพร้อมเส้นใต้ตอน Active)
            ========================================= */}
        <div className="flex justify-center items-center space-x-6 md:space-x-10 border-b border-border pb-[10px]">
          {[1, 2, 3, 4].map((phase, idx) => (
            <button
              key={phase}
              onClick={() => setActivePhase(idx)}
              className={`pb-2 text-[14px] md:text-[15px] font-semibold transition-all relative ${
                activePhase === idx ? 'text-primary' : 'text-muted-foreground hover:text-foreground'
              }`}
            >
              Phase {phase}
              {/* แสดงเส้นใต้แถบสีม่วง (primary) เมื่อ Tab ถูกคลิก */}
              {activePhase === idx && (
                <div className="absolute -bottom-[11px] left-0 w-full h-[2px] bg-primary" />
              )}
            </button>
          ))}
        </div>

        {/* =========================================
            เนื้อหาฟอร์ม ที่สลับไปตาม Tab ที่ผู้ใช้เลือก
            มีการใส่ effect ค่อยๆ ปรากฏ (fade-in)
            ========================================= */}
        <div className="flex flex-col gap-[24px] animate-in fade-in slide-in-from-bottom-4 duration-500">
          
          {/* ส่วนที่ 2: หัวข้อ Milestone (วงกลมแสดงเลขและตามด้วยชื่อ) */}
          <div className="flex items-center space-x-3">
            <div className="w-8 h-8 bg-primary text-white rounded-full flex items-center justify-center font-semibold text-[14px]">
              {activePhase + 1}
            </div>
            <h2 className="text-[16px] font-bold text-foreground">Milestone {activePhase + 1}</h2>
          </div>

          {/* ส่วนที่ 3: ฟอร์มระบุข้อมูลทั่วไปของ Milestone นี้ */}
          <div className="flex flex-col gap-[20px]">
            {/* กล่อง input สำหรับ ชื่อ Milestone */}
            <div className="flex flex-col gap-[8px]">
              <label className="text-[14px] font-semibold text-foreground">ชื่อ Milestone</label>
              <input
                type="text"
                value={currentData.title}
                onChange={(e) => handleChange('title', e.target.value)}
                onBlur={() => { if (projectId) saveMilestonePhase(Number(projectId), activePhase) }}
                className="w-full h-[40px] px-3 bg-[#F8F9FB] border border-[#E5E7EB] rounded-[8px] focus:ring-1 focus:ring-primary focus:border-primary outline-none transition-all text-[14px]"
              />
            </div>

            {/* กล่อง textarea สำหรับ คำอธิบายของ Milestone */}
            <div className="flex flex-col gap-[8px]">
              <label className="text-[14px] font-semibold text-foreground">คำอธิบาย</label>
              <textarea
                rows={4}
                value={currentData.description}
                onChange={(e) => handleChange('description', e.target.value)}
                onBlur={() => { if (projectId) saveMilestonePhase(Number(projectId), activePhase) }}
                className="w-full p-3 bg-[#F8F9FB] border border-[#E5E7EB] rounded-[8px] focus:ring-1 focus:ring-primary focus:border-primary outline-none transition-all resize-none text-[14px]"
              />
            </div>

            {/* กล่อง input ป้อน จำนวนเงินงบประมาณ (auto-calculated, disabled) */}
            <div className="flex flex-col gap-[8px]">
              <div className="flex items-center justify-between">
                <label className="text-[14px] font-semibold text-foreground">จำนวนเงิน</label>
                <span className="text-[12px] text-primary font-medium bg-primary/10 px-[8px] py-[2px] rounded-full">
                  {(phasePercents[activePhase] * 100).toFixed(0)}% ของเป้าหมาย
                </span>
              </div>
              <input
                type="text"
                disabled
                value={fundingGoal > 0 ? `฿${(fundingGoal * phasePercents[activePhase]).toLocaleString('th-TH')}` : 'กรุณากำหนดเป้าหมายเงินทุนก่อน'}
                className="w-full h-[40px] px-3 bg-[#F3F4F6] border border-[#E5E7EB] rounded-[8px] outline-none text-[14px] text-muted-foreground cursor-not-allowed"
              />
            </div>

            {/* กล่อง input แบบ grid 2 ฝั่ง สำหรับเลือก วันเริ่มต้น และ วันสิ้นสุด */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-[20px]">
              <div className="flex flex-col gap-[8px]">
                <label className="text-[14px] font-semibold text-foreground">วันเริ่มต้น</label>
                <input
                  type="date"
                  value={currentData.startDate}
                  min={new Date().toISOString().split('T')[0]}
                  max={projectMaxDateStr}
                  onChange={(e) => handleChange('startDate', e.target.value)}
                  className="w-full h-[40px] px-3 bg-[#F8F9FB] border border-[#E5E7EB] rounded-[8px] focus:ring-1 focus:ring-primary focus:border-primary outline-none text-[14px] text-foreground"
                />
              </div>
              <div className="flex flex-col gap-[8px]">
                <label className="text-[14px] font-semibold text-foreground">วันสิ้นสุด</label>
                <input
                  type="date"
                  value={currentData.endDate}
                  min={currentData.startDate || new Date().toISOString().split('T')[0]}
                  max={projectMaxDateStr}
                  onChange={(e) => handleChange('endDate', e.target.value)}
                  className="w-full h-[40px] px-3 bg-[#F8F9FB] border border-[#E5E7EB] rounded-[8px] focus:ring-1 focus:ring-primary focus:border-primary outline-none text-[14px] text-foreground"
                />
              </div>
              {currentProject.projectDuration > 0 && (
                <p className="md:col-span-2 text-[12px] text-muted-foreground">
                  ระยะเวลาโปรเจกต์ทั้งหมด {currentProject.projectDuration} เดือน (วันสิ้นสุดไม่เกิน {projectMaxDateDisplay})
                </p>
              )}
            </div>
          </div>

          <hr className="border-border my-[10px]" />

          {/* =========================================
              ส่วนที่ 4: เกณฑ์การยอมรับ (Acceptance Criteria)
              เป็นรายการลิสต์ที่สามารถกดปุ่ม "เพิ่มเกณฑ์" ได้เรื่อยๆ สูงสุด 10 ข้อ
              ========================================= */}
          <div className="flex flex-col gap-[16px]">
            <div className="flex justify-between items-center">
              <div className="flex flex-col gap-[4px]">
                <label className="text-[14px] font-semibold text-foreground">เกณฑ์การยอมรับ</label>
                <span className="text-[12px] text-muted-foreground">ระบุสิ่งที่ต้องทำให้เสร็จใน Milestone นี้ (1-10 ข้อ)</span>
              </div>
              <button
                onClick={() => {
                   if (currentData.criteria.length < 10) {
                      handleChange('criteria', [...currentData.criteria, ''])
                   } else {
                      toast.error('คุณสามารถระบุเกณฑ์การยอมรับได้สูงสุด 10 ข้อ')
                   }
                }}
                className="flex items-center space-x-2 bg-[#F3F4F6] text-foreground hover:bg-[#E5E7EB] px-3 py-1.5 rounded-[8px] text-[13px] font-medium transition-all"
              >
                <Plus size={14} />
                <span>เพิ่มเกณฑ์</span>
              </button>
            </div>
            
            <div className="flex flex-col gap-[12px]">
              {/* รายการเกณฑ์ที่เพิ่มแสดงเป็น input หลายพารากราฟ */}
              {currentData.criteria.map((item, cIdx) => (
                <div key={cIdx} className="flex items-center gap-[12px]">
                  <span className="text-[14px] font-bold text-foreground w-[16px]">{cIdx + 1}.</span>
                  <input
                    type="text"
                    value={item}
                    onChange={(e) => {
                      const newCriteria = [...currentData.criteria];
                      newCriteria[cIdx] = e.target.value;
                      handleChange('criteria', newCriteria);
                    }}
                    className="flex-grow h-[40px] px-3 bg-[#F8F9FB] border border-[#E5E7EB] rounded-[8px] outline-none focus:ring-1 focus:ring-primary focus:border-primary transition-all text-[14px]"
                  />
                  {/* ปุ่มลบเกณฑ์ถังขยะ (แสดงเฉพาะเมื่อมีมากกว่า 1 ข้อ ไม่งั้นให้เหลือ 1 ไว้เสมอ) */}
                  {currentData.criteria.length > 1 && (
                    <button
                      onClick={() => handleChange('criteria', currentData.criteria.filter((_, i) => i !== cIdx))}
                      className="p-2 text-muted-foreground hover:text-error transition-colors"
                    >
                      <Trash2 size={18} />
                    </button>
                  )}
                </div>
              ))}
            </div>
          </div>

          <hr className="border-border my-[10px]" />

          {/* =========================================
              ส่วนที่ 5: ไฟล์ประกอบและวิดีโอ (สื่อประกอบ)
              นำพื้นที่อัปโหลดแบบลากวางมาเรียงซ้อนกันแนวตั้ง (Stacked)
              ========================================= */}
          <div className="flex flex-col gap-[24px]">
            {/* 5.1 พื้นที่อัปโหลดไฟล์/รูปภาพ (เส้นประสีม่วงจาง) */}
            <div className="flex flex-col gap-[8px]">
              <label className="text-[14px] font-semibold text-foreground">ไฟล์ประกอบ (ไม่บังคับ)</label>
              <div
                onClick={() => fileInputRef.current?.click()}
                className="border-[1.5px] border-dashed border-[#C084FC] rounded-[12px] p-[40px] flex flex-col items-center justify-center bg-[#F9F5FF] hover:bg-[#F3E8FF] transition-all cursor-pointer group"
              >
                <input type="file" multiple hidden ref={fileInputRef} onChange={handleFileChange} accept="image/*,.xlsx,.xls,.pdf" />
                <Upload className="text-muted-foreground mb-2 group-hover:-translate-y-1 transition-transform" size={24} />
                <span className="text-[13px] text-muted-foreground">รูปภาพ, PDF, Excel</span>
              </div>

              {/* วนลูปแสดงรูปภาพที่ผู้ใช้เลือก (Preview) พร้อมปุ่มลบ X */}
              <div className="flex flex-wrap gap-3 mt-2">
                {currentData.files?.map((f, i) => (
                  <div key={i} className="relative rounded-lg overflow-hidden border border-border group shadow-sm">
                    {f.url ? (
                      <div className="w-16 h-16">
                        <img src={f.url} className="w-full h-full object-cover" alt="preview" />
                      </div>
                    ) : (
                      <div className="w-16 h-16 flex flex-col items-center justify-center bg-[#F8F9FB] text-[10px] text-muted-foreground text-center px-1 gap-1">
                        <span className="text-[18px]">{f.name.endsWith('.pdf') ? '📄' : '📊'}</span>
                        <span className="truncate w-full text-center">{f.name}</span>
                      </div>
                    )}
                    <button
                      onClick={(e) => { e.stopPropagation(); removeImage(i); }}
                      className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 flex items-center justify-center text-white transition-opacity"
                    >
                      <X size={14} />
                    </button>
                  </div>
                ))}
              </div>
            </div>

            {/* 5.2 พื้นที่อัปโหลดวิดีโอสาธิต */}
            <div className="flex flex-col gap-[8px]">
              <label className="text-[14px] font-semibold text-foreground flex items-center">
                <Video size={16} className="mr-2" /> ไฟล์วิดีโอ (ไม่บังคับ)
              </label>
              {/* ถ้ายังไม่มีวิดีโอ ให้โชว์ปุ่มอัปโหลด */}
              {!currentData.video ? (
                <div
                  onClick={() => videoInputRef.current?.click()}
                  className="border-[1.5px] border-dashed border-[#C084FC] rounded-[12px] p-[40px] flex flex-col items-center justify-center bg-[#F9F5FF] hover:bg-[#F3E8FF] transition-all cursor-pointer group"
                >
                  <input type="file" accept="video/*" hidden ref={videoInputRef} onChange={handleVideoChange} />
                  <Upload className="text-muted-foreground mb-2 group-hover:-translate-y-1 transition-transform" size={24} />
                  <span className="text-[13px] text-muted-foreground">อัปโหลดวิดีโอ</span>
                </div>
              ) : (
                /* ถ้ามีวิดีโอแล้ว ให้เอาวิดีโอมาโชว์ พร้อมปุ่มลบ X */
                <div className="relative aspect-video max-w-sm rounded-[12px] overflow-hidden border border-border group shadow-sm mt-2">
                  <video src={currentData.video.url} className="w-full h-full object-cover" muted />
                  <div className="absolute inset-0 bg-black/20 flex items-center justify-center transition-opacity">
                    <button
                      onClick={removeVideo}
                      className="p-2 bg-white/90 text-error rounded-full shadow-lg hover:scale-110 transition-transform"
                    >
                      <X size={16} />
                    </button>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* ปุ่มถอยกลับ/จัดเก็บ/ถัดไป */}
      <StepNavigation />

    </div>
  )
}

export default Step3Milestone