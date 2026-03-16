import { useState, useRef } from 'react'
import { useProjectStore } from '../../store/useProjectStore'
import { Plus, Trash2, Upload, Video, X } from 'lucide-react'
import StepNavigation from "../StepNavigation"
import toast from 'react-hot-toast'

const Step3Milestone = () => {
  const [activePhase, setActivePhase] = useState(0) // 0-3
  // ✅ ดึง currentProject มาก่อน แล้วค่อยเข้าถึง milestones
  const { currentProject, updateMilestone } = useProjectStore()
  
  const currentData = currentProject.milestones[activePhase]

  const fileInputRef = useRef<HTMLInputElement>(null)
  const videoInputRef = useRef<HTMLInputElement>(null)

  // ฟังก์ชันอัปเดตข้อมูล
  const handleChange = (field: string, value: any) => {
    updateMilestone(activePhase, { [field]: value })
  }

  // --- ระบบจัดการรูปภาพ (หลายรูป) ---
  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFiles = e.target.files
    if (selectedFiles) {
      const currentFiles = currentData.files || []
      const remainingSlots = 5 - currentFiles.length

      if (remainingSlots <= 0) {
        toast.error("อัปโหลดรูปภาพได้สูงสุด 5 รูปต่อ Milestone")
        return
      }

      const newFiles = Array.from(selectedFiles)
        .slice(0, remainingSlots)
        .map(file => ({
          name: file.name,
          url: URL.createObjectURL(file),
          file: file
        }))

      handleChange('files', [...currentFiles, ...newFiles])
      if (fileInputRef.current) fileInputRef.current.value = ""
    }
  }

  // --- ระบบจัดการวิดีโอ (คลิปเดียว) ---
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
    <div className="w-full max-w-4xl mx-auto p-4 md:p-8 space-y-10 bg-white rounded-2xl shadow-sm border border-border">
      
      {/* 1. Phase Navigation Tabs */}
      <div className="flex justify-center items-center space-x-2 md:space-x-12 border-b border-border">
        {[1, 2, 3, 4].map((phase, idx) => (
          <button
            key={phase}
            onClick={() => setActivePhase(idx)}
            className={`pb-4 px-2 md:px-6 text-sm md:text-base font-medium transition-all relative ${
              activePhase === idx ? 'text-primary font-bold' : 'text-muted-foreground hover:text-foreground'
            }`}
          >
            Phase {phase}
            {activePhase === idx && (
              <div className="absolute bottom-0 left-0 w-full h-1 bg-primary rounded-t-full" />
            )}
          </button>
        ))}
      </div>

      <div className="animate-in fade-in slide-in-from-bottom-4 duration-500 space-y-8">
        {/* 2. Milestone Header */}
        <div className="flex items-center space-x-3">
          <div className="w-10 h-10 bg-primary text-white rounded-full flex items-center justify-center font-bold shadow-md">
            {activePhase + 1}
          </div>
          <h2 className="text-xl font-bold text-foreground">รายละเอียด Milestone {activePhase + 1}</h2>
        </div>

        {/* 3. Form Section */}
        <div className="grid grid-cols-1 gap-6">
          <div className="space-y-2">
            <label className="text-sm font-bold text-foreground">ชื่อ Milestone</label>
            <input
              type="text"
              value={currentData.title}
              onChange={(e) => handleChange('title', e.target.value)}
              className="w-full p-3 bg-background border border-border rounded-lg focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none transition-all"
            />
          </div>

          <div className="space-y-2">
            <label className="text-sm font-bold text-foreground">คำอธิบาย</label>
            <textarea
              rows={3}
              value={currentData.description}
              onChange={(e) => handleChange('description', e.target.value)}
              className="w-full p-3 bg-background border border-border rounded-lg focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none transition-all resize-none"
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="space-y-2">
              <label className="text-sm font-bold text-foreground">งบประมาณ (บาท)</label>
              <input
                type="number"
                value={currentData.amount || ''}
                onChange={(e) => handleChange('amount', Number(e.target.value))}
                className="w-full p-3 bg-background border border-border rounded-lg outline-none"
              />
            </div>
            <div className="space-y-2">
              <label className="text-sm font-bold text-foreground">วันเริ่มต้น</label>
              <input 
                type="date" 
                value={currentData.startDate}
                onChange={(e) => handleChange('startDate', e.target.value)}
                className="w-full p-3 bg-background border border-border rounded-lg outline-none" 
              />
            </div>
            <div className="space-y-2">
              <label className="text-sm font-bold text-foreground">วันสิ้นสุด</label>
              <input 
                type="date" 
                value={currentData.endDate}
                onChange={(e) => handleChange('endDate', e.target.value)}
                className="w-full p-3 bg-background border border-border rounded-lg outline-none" 
              />
            </div>
          </div>

          {/* 4. Acceptance Criteria */}
          <div className="space-y-4 pt-4">
            <div className="flex justify-between items-center">
              <label className="text-sm font-bold text-foreground">เกณฑ์การยอมรับ (Acceptance Criteria)</label>
              <button 
                onClick={() => handleChange('criteria', [...currentData.criteria, ''])}
                className="flex items-center space-x-2 text-primary hover:bg-primary/10 px-3 py-1.5 rounded-lg text-sm font-bold transition-all"
              >
                <Plus size={16} />
                <span>เพิ่มเกณฑ์</span>
              </button>
            </div>
            <div className="space-y-3">
              {currentData.criteria.map((item, cIdx) => (
                <div key={cIdx} className="flex items-center gap-3">
                  <span className="text-sm font-bold text-muted-foreground w-4">{cIdx + 1}.</span>
                  <input
                    type="text"
                    value={item}
                    onChange={(e) => {
                      const newCriteria = [...currentData.criteria];
                      newCriteria[cIdx] = e.target.value;
                      handleChange('criteria', newCriteria);
                    }}
                    className="flex-grow p-3 bg-background border border-border rounded-lg outline-none focus:border-primary transition-all"
                  />
                  <button 
                    onClick={() => handleChange('criteria', currentData.criteria.filter((_, i) => i !== cIdx))}
                    className="p-2 text-muted-foreground hover:text-error transition-colors"
                  >
                    <Trash2 size={18} />
                  </button>
                </div>
              ))}
            </div>
          </div>

          {/* 5. Upload Media Section */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 pt-6">
            {/* รูปภาพประกอบ */}
            <div className="space-y-3">
              <label className="text-sm font-bold text-foreground">รูปภาพประกอบ (สูงสุด 5)</label>
              <div 
                onClick={() => fileInputRef.current?.click()}
                className="border-2 border-dashed border-purple-200 rounded-xl p-6 flex flex-col items-center justify-center bg-purple-50/20 hover:bg-purple-50 transition-all cursor-pointer group"
              >
                <input type="file" multiple hidden ref={fileInputRef} onChange={handleFileChange} accept="image/*" />
                <Upload className="text-purple-400 mb-2 group-hover:scale-110 transition-transform" size={24} />
                <span className="text-xs text-purple-600 font-medium">คลิกเพื่ออัปโหลดรูปภาพ</span>
              </div>
              
              <div className="flex flex-wrap gap-3">
                {currentData.files?.map((f, i) => (
                  <div key={i} className="relative w-16 h-16 rounded-lg overflow-hidden border border-border group shadow-sm">
                    <img src={f.url} className="w-full h-full object-cover" alt="preview" />
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

            {/* วิดีโอ */}
            <div className="space-y-3">
              <label className="text-sm font-bold text-foreground flex items-center">
                <Video size={16} className="mr-2" /> วิดีโอสาธิต
              </label>
              {!currentData.video ? (
                <div 
                  onClick={() => videoInputRef.current?.click()}
                  className="border-2 border-dashed border-purple-200 rounded-xl p-6 flex flex-col items-center justify-center bg-purple-50/20 hover:bg-purple-50 transition-all cursor-pointer group"
                >
                  <input type="file" accept="video/*" hidden ref={videoInputRef} onChange={handleVideoChange} />
                  <Upload className="text-purple-400 mb-2 group-hover:scale-110 transition-transform" size={24} />
                  <span className="text-xs text-purple-600 font-medium">อัปโหลดวิดีโอ</span>
                </div>
              ) : (
                <div className="relative aspect-video rounded-xl overflow-hidden border border-border group shadow-md">
                   <video src={currentData.video.url} className="w-full h-full object-cover" muted />
                   <div className="absolute inset-0 bg-black/20 flex items-center justify-center">
                      <button 
                        onClick={removeVideo}
                        className="p-2 bg-white/90 text-error rounded-full shadow-lg hover:scale-110 transition-transform"
                      >
                        <X size={16}/>
                      </button>
                   </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* 4. Footer */}
      <div className="pt-10 border-t border-border flex flex-col md:flex-row justify-between items-center gap-4">
         <p className="text-xs text-muted-foreground italic">ข้อมูลใน Milestone {activePhase + 1} จะถูกบันทึกชั่วคราวอัตโนมัติ</p>
         <StepNavigation />
      </div>

    </div>
  )
}

export default Step3Milestone