import { useState, useRef } from 'react'
import { useProjectStore, type Milestone } from '../../store/useProjectStore'
import { Plus, Trash2, Upload, Video, X, Loader2 } from 'lucide-react'
import StepNavigation from "../StepNavigation"
import toast from 'react-hot-toast'
import { useParams } from 'react-router'
import api from '../../services/api'

const Step3Milestone = () => {
  const { projectId } = useParams()
  const [activePhase, setActivePhase] = useState(0) // 0-3
  const fileInputRef = useRef<HTMLInputElement>(null)
  const videoInputRef = useRef<HTMLInputElement>(null)
  // ✅ ดึง currentProject มาก่อน แล้วค่อยเข้าถึง milestones
  const { currentProject, updateMilestone, saveMilestonePhase, setSaveStatus } = useProjectStore()

  const triggerSaved = () => {
    setSaveStatus('saved');
    setTimeout(() => setSaveStatus('idle'), 2500);
  };

  const savePhase = async (phaseIndex: number) => {
    if (!projectId) return;
    setSaveStatus('saving');
    await saveMilestonePhase(Number(projectId), phaseIndex);
    triggerSaved();
  };
  const fundingGoal = currentProject.fundingGoal || 0
  const phasePercents = [0.15, 0.20, 0.30, 0.35]

  const currentData = currentProject.milestones[activePhase]


  // 1. ฟังก์ชันอัปเดตข้อมูลทั่วไปของ Milestone
  const handleChange = <K extends keyof Milestone>(field: K, value: Milestone[K]) => {
    updateMilestone(activePhase, { [field]: value })
  }

  // อัปโหลดไฟล์เดียวผ่าน /upload (key: file) — คืน server URL
  const uploadOneFile = async (file: File): Promise<string | null> => {
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

  // แทนที่ blob URL ด้วย server URL ใน milestone files
  const replaceFileBlobUrl = (blobUrl: string, serverUrl: string, name: string, phase: number) => {
    URL.revokeObjectURL(blobUrl)
    useProjectStore.setState(state => ({
      currentProject: {
        ...state.currentProject,
        milestones: state.currentProject.milestones.map((m, idx) =>
          idx !== phase ? m : {
            ...m,
            files: (m.files || []).map(f => f.url === blobUrl ? { name, url: serverUrl } : f),
          }
        ),
      },
    }))
  }

  const removeFileBlobUrl = (blobUrl: string, phase: number) => {
    URL.revokeObjectURL(blobUrl)
    useProjectStore.setState(state => ({
      currentProject: {
        ...state.currentProject,
        milestones: state.currentProject.milestones.map((m, idx) =>
          idx !== phase ? m : { ...m, files: (m.files || []).filter(f => f.url !== blobUrl) }
        ),
      },
    }))
  }

  const replaceVideoBlobUrl = (blobUrl: string, serverUrl: string, name: string, phase: number) => {
    URL.revokeObjectURL(blobUrl)
    useProjectStore.setState(state => ({
      currentProject: {
        ...state.currentProject,
        milestones: state.currentProject.milestones.map((m, idx) =>
          idx !== phase ? m : {
            ...m,
            videos: (m.videos || []).map(v => v.url === blobUrl ? { name, url: serverUrl } : v),
          }
        ),
      },
    }))
  }

  const removeVideoBlobUrl = (blobUrl: string, phase: number) => {
    URL.revokeObjectURL(blobUrl)
    useProjectStore.setState(state => ({
      currentProject: {
        ...state.currentProject,
        milestones: state.currentProject.milestones.map((m, idx) =>
          idx !== phase ? m : { ...m, videos: (m.videos || []).filter(v => v.url !== blobUrl) }
        ),
      },
    }))
  }

  // 2. อัปโหลดหลายไฟล์ (append ต่อไฟล์เดิม)
  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const fileList = e.target.files
    if (!fileList || fileList.length === 0) return
    const phase = activePhase

    // ต้อง convert ก่อน clear — FileList เป็น live reference ถูกล้างเมื่อ value = ""
    const files = Array.from(fileList)
    e.target.value = ""
    const previews = files.map(file => ({ name: file.name, url: URL.createObjectURL(file) }))

    // append blob previews ต่อรายการปัจจุบัน (อ่านจาก store ผ่าน setState เพื่อหลีกเลี่ยง stale closure)
    useProjectStore.setState(state => ({
      currentProject: {
        ...state.currentProject,
        milestones: state.currentProject.milestones.map((m, idx) =>
          idx !== phase ? m : { ...m, files: [...(m.files || []), ...previews] }
        ),
      },
    }))

    // upload ทีละไฟล์แล้วแทนที่ blob URL
    for (let i = 0; i < files.length; i++) {
      const serverUrl = await uploadOneFile(files[i])
      if (serverUrl) {
        replaceFileBlobUrl(previews[i].url, serverUrl, files[i].name, phase)
      } else {
        removeFileBlobUrl(previews[i].url, phase)
        toast.error(`อัปโหลด ${files[i].name} ไม่สำเร็จ`)
      }
    }
    await savePhase(phase)
  }

  // 3. อัปโหลดวิดีโอ (append ต่อรายการเดิม)
  const handleVideoChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return
    const phase = activePhase
    const supportedVideoTypes = ['video/mp4', 'video/webm', 'video/ogg', 'video/quicktime']
    if (!supportedVideoTypes.includes(file.type)) {
      toast.error(`ไม่รองรับไฟล์นี้ (รองรับ MP4, WebM, OGG, MOV)`)
      e.target.value = ""
      return
    }
    if (file.size > 50 * 1024 * 1024) {
      toast.error(`วิดีโอต้องมีขนาดไม่เกิน 50MB`)
      e.target.value = ""
      return
    }
    e.target.value = ""

    const blobUrl = URL.createObjectURL(file)
    useProjectStore.setState(state => ({
      currentProject: {
        ...state.currentProject,
        milestones: state.currentProject.milestones.map((m, idx) =>
          idx !== phase ? m : { ...m, videos: [...(m.videos || []), { name: file.name, url: blobUrl }] }
        ),
      },
    }))

    const serverUrl = await uploadOneFile(file)
    if (serverUrl) {
      replaceVideoBlobUrl(blobUrl, serverUrl, file.name, phase)
      await savePhase(phase)
    } else {
      removeVideoBlobUrl(blobUrl, phase)
      toast.error(`อัปโหลด ${file.name} ไม่สำเร็จ`)
    }
  }

  // ลบไฟล์ แล้ว save เพื่ออัปเดต url ใน backend
  const removeImage = async (index: number) => {
    const files = currentData.files || []
    const f = files[index]
    if (!f) return
    if (f.url?.startsWith('blob:')) URL.revokeObjectURL(f.url)
    updateMilestone(activePhase, { files: files.filter((_, i) => i !== index) })
    await savePhase(activePhase)
  }

  // ลบวิดีโอ แล้ว save เพื่ออัปเดต url ใน backend
  const removeVideo = async (index: number) => {
    const videos = currentData.videos || []
    const v = videos[index]
    if (!v) return
    if (v.url?.startsWith('blob:')) URL.revokeObjectURL(v.url)
    updateMilestone(activePhase, { videos: videos.filter((_, i) => i !== index) })
    await savePhase(activePhase)
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
              className={`pb-2 text-[14px] md:text-[15px] font-semibold transition-all relative ${activePhase === idx ? 'text-primary' : 'text-muted-foreground hover:text-foreground'
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
              <label className="text-[14px] font-semibold text-foreground">ชื่อ Milestone <span className="text-error">*</span></label>
              <input
                type="text"
                value={currentData.title}
                onChange={(e) => handleChange('title', e.target.value)}
                onBlur={() => { savePhase(activePhase) }}
                className="w-full h-[40px] px-3 bg-[#F8F9FB] border border-[#E5E7EB] rounded-[8px] focus:ring-1 focus:ring-primary focus:border-primary outline-none transition-all text-[14px]"
              />
            </div>

            {/* กล่อง textarea สำหรับ คำอธิบายของ Milestone */}
            <div className="flex flex-col gap-[8px]">
              <label className="text-[14px] font-semibold text-foreground">คำอธิบาย <span className="text-error">*</span></label>
              <textarea
                rows={4}
                value={currentData.description}
                onChange={(e) => handleChange('description', e.target.value)}
                onBlur={() => { savePhase(activePhase) }}
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

            {/* ระยะเวลา (วัน) */}
            <div className="flex flex-col gap-[8px]">
              <label className="text-[14px] font-semibold text-foreground">ระยะเวลา (วัน) <span className="text-error">*</span></label>
              <input
                type="number"
                min={1}
                value={currentData.duration || ''}
                onChange={(e) => handleChange('duration', Number(e.target.value))}
                onBlur={() => { savePhase(activePhase) }}
                className="w-full h-[40px] px-3 bg-[#F8F9FB] border border-[#E5E7EB] rounded-[8px] focus:ring-1 focus:ring-primary focus:border-primary outline-none text-[14px]"
              />
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
                <label className="text-[14px] font-semibold text-foreground">เกณฑ์การยอมรับ <span className="text-error">*</span></label>
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
                    onBlur={() => { savePhase(activePhase) }}
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
            {/* 5.1 ไฟล์ประกอบ — เพิ่มไฟล์จะล้าง video อัตโนมัติ (backend รองรับ type เดียวต่อ milestone) */}
            <div className="flex flex-col gap-[8px]">
              <label className="text-[14px] font-semibold text-foreground">ไฟล์ประกอบ (ไม่บังคับ)</label>
              <input type="file" multiple hidden ref={fileInputRef} onChange={handleFileChange} accept="image/*,.xlsx,.xls,.pdf,.doc,.docx" />
              <div
                onClick={() => fileInputRef.current?.click()}
                className="border-[1.5px] border-dashed border-[#C084FC] rounded-[12px] p-[40px] flex flex-col items-center justify-center bg-[#F9F5FF] hover:bg-[#F3E8FF] transition-all cursor-pointer group"
              >
                <Upload className="text-muted-foreground mb-2 group-hover:-translate-y-1 transition-transform" size={24} />
                <span className="text-[13px] text-muted-foreground">รูปภาพ, Excel, เอกสาร (สูงสุด 5MB ต่อไฟล์)</span>
              </div>
              <div className="flex flex-wrap gap-2">
                {currentData.files?.map((f, i) => {
                  const uploading = f.url?.startsWith('blob:');
                  return (
                    <div key={i} className="flex items-center gap-[10px] px-3 py-1.5 rounded-full text-xs">
                      <div className="relative w-[50px] h-[50px]">
                        {f.url ? (
                          <img src={f.url} className="w-[50px] h-[50px] object-cover rounded" alt="preview" />
                        ) : (
                          <div className="w-[50px] h-[50px] flex items-center justify-center bg-[#F8F9FB] rounded text-[20px]">📊</div>
                        )}
                        {uploading && (
                          <div className="absolute inset-0 bg-black/40 flex items-center justify-center rounded">
                            <Loader2 size={18} className="text-white animate-spin" />
                          </div>
                        )}
                      </div>
                      <span className={`max-w-[150px] truncate ${uploading ? 'text-muted-foreground' : ''}`}>{f.name}</span>
                      {!uploading && (
                        <button type="button" onClick={() => removeImage(i)} className="ml-2 hover:text-error cursor-pointer">
                          <X size={14} />
                        </button>
                      )}
                    </div>
                  );
                })}
              </div>
            </div>

            {/* 5.2 วิดีโอ — แสดงเฉพาะเมื่อไม่มีไฟล์ประกอบ */}
            <div className="flex flex-col gap-[8px]">
              <label className="text-[14px] font-semibold text-foreground flex items-center">
                <Video size={16} className="mr-2" /> ไฟล์วิดีโอ (ไม่บังคับ)
              </label>
              <input type="file" accept="video/*" hidden ref={videoInputRef} onChange={handleVideoChange} />
              <div
                onClick={() => videoInputRef.current?.click()}
                className="border-[1.5px] border-dashed border-[#C084FC] rounded-[12px] p-[40px] flex flex-col items-center justify-center bg-[#F9F5FF] hover:bg-[#F3E8FF] transition-all cursor-pointer group"
              >
                <Upload className="text-muted-foreground mb-2 group-hover:-translate-y-1 transition-transform" size={24} />
                <span className="text-[13px] text-muted-foreground">อัปโหลดวิดีโอ (สูงสุด 50MB)</span>
              </div>
              <div className="flex flex-wrap gap-2">
                {(currentData.videos || []).map((vid, i) => {
                  const uploading = vid.url?.startsWith('blob:');
                  return (
                    <div key={i} className="flex items-center gap-[10px] px-3 py-1.5 rounded-full text-xs">
                      <div className="relative w-[50px] h-[50px]">
                        <video src={vid.url} className="w-[50px] h-[50px] object-cover rounded" muted preload="metadata" />
                        {uploading && (
                          <div className="absolute inset-0 bg-black/40 flex items-center justify-center rounded">
                            <Loader2 size={18} className="text-white animate-spin" />
                          </div>
                        )}
                      </div>
                      <span className={`max-w-[150px] truncate ${uploading ? 'text-muted-foreground' : ''}`}>{vid.name}</span>
                      {!uploading && (
                        <button type="button" onClick={() => removeVideo(i)} className="ml-2 hover:text-error cursor-pointer">
                          <X size={14} />
                        </button>
                      )}
                    </div>
                  );
                })}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* ปุ่มถอยกลับ/จัดเก็บ/ถัดไป */}
      <StepNavigation disableNext={
        currentProject.milestones.some(m =>
          m.files?.some(f => f.url?.startsWith('blob:')) ||
          m.videos?.some(v => v.url?.startsWith('blob:'))
        )
      } />

    </div>
  )
}

export default Step3Milestone