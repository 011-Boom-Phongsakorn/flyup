import { useState, useRef, useEffect } from "react";
import { ChevronDown, X, ImageIcon, Upload, FileImage, Video } from "lucide-react";
import StepNavigation from "../StepNavigation";
import { useProjectStore } from "../../store/useProjectStore";
import toast from "react-hot-toast";

const categories = [
  'Web App', 'Mobile App', 'AI', 'Data Analytics', 'Cloud', 'DevOps', 'Blockchain', 'Fintech', 'Cybersecurity', 'Game', 'Business', 'Education', 'IOT'
];

const Step1Basics = () => {
  const { currentProject, updateProjectInfo } = useProjectStore()

  const [isOpen, setIsOpen] = useState(false)
  const [showSavedTick, setShowSavedTick] = useState(false)

  const [localData, setLocalData] = useState({
    title: '',
    description: '',
    category: '',
    fundingGoal: 0,
    projectDuration: 0,
    softCap: 0,
    campaignDuration: 0,
    revenueShare: 0,
  });

  const additionalImagesRef = useRef<HTMLInputElement>(null);
  const videoInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (currentProject) {
      setLocalData({
        title: currentProject.title || '',
        description: currentProject.description || '',
        category: currentProject.category || '',
        fundingGoal: currentProject.fundingGoal || 0,
        projectDuration: currentProject.projectDuration || 0,
        softCap: currentProject.softCap || 0,
        campaignDuration: currentProject.campaignDuration || 0,
        revenueShare: currentProject.revenueShare || 0,
      });
    }
  }, []);

  useEffect(() => {
    if (showSavedTick) {
      const timer = setTimeout(() => setShowSavedTick(false), 2000);
      toast.success('บันทึก')
      return () => clearTimeout(timer);
    }
  }, [showSavedTick]);

  const handleAutoSave = async (field: string, newValue: any) => {
    const oldValue = currentProject?.[field as keyof typeof currentProject];
    const isSame = typeof newValue === 'string'
      ? newValue.trim() === (oldValue as string || '')
      : newValue === oldValue;

    if (isSame) return;

    updateProjectInfo({ [field]: newValue });
    setShowSavedTick(true);
  };

  const handleMultipleFilesChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (files) {
      const currentImages = currentProject?.files || [];

      // ✅ 1. กรองเฉพาะไฟล์ที่เป็น image/png หรือ image/jpeg เท่านั้น
      const allowedTypes = ['image/png', 'image/jpeg', 'image/jpg'];
      const validFiles = Array.from(files).filter(file =>
        allowedTypes.includes(file.type)
      );

      // แจ้งเตือนถ้ามีบางไฟล์ถูกคัดออก
      if (validFiles.length !== files.length) {
        toast.error("อนุญาตเฉพาะไฟล์ PNG และ JPEG เท่านั้น");
      }

      if (validFiles.length === 0) return;

      // ✅ 2. เช็คจำนวนที่ว่าง (Limit 5 รูปเหมือนเดิม)
      const remainingSlots = 5 - currentImages.length;
      if (remainingSlots <= 0) {
        toast.error("คุณสามารถอัปโหลดได้สูงสุด 5 รูป");
        return;
      }

      const newFiles = validFiles
        .slice(0, remainingSlots)
        .map(file => ({
          name: file.name,
          url: URL.createObjectURL(file),
          file: file
        }));

      updateProjectInfo({ files: [...currentImages, ...newFiles] });
      setShowSavedTick(true);

      if (additionalImagesRef.current) additionalImagesRef.current.value = "";
    }
  };

  // ✅ จัดการวิดีโอ (คลิปเดียว)
  const handleVideoChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      // เช็คขนาดไฟล์วิดีโอ (ตัวอย่าง: ไม่เกิน 50MB)
      if (file.size > 50 * 1024 * 1024) {
        toast.error("วิดีโอต้องมีขนาดไม่เกิน 50MB");
        return;
      }
      const videoObj = { name: file.name, url: URL.createObjectURL(file), file };
      updateProjectInfo({ video: videoObj });
      setShowSavedTick(true);
    }
  };

  // ✅ แก้ไขฟังก์ชันลบรูปภาพ
  const removeImage = (index: number) => {
    const currentImages = currentProject?.files || [];

    const targetImage = currentImages[index];

    // คืนค่าหน่วยความจำ
    if (targetImage?.url) URL.revokeObjectURL(targetImage.url);

    const updatedImages = currentImages.filter((_, i) => i !== index);
    updateProjectInfo({ files: updatedImages });
    setShowSavedTick(true); // <--- เพิ่มบรรทัดนี้เพื่อให้ขึ้น "บันทึกแล้ว"
  };

  // ✅ เพิ่มฟังก์ชันลบวิดีโอ (เพื่อให้เรียกใช้ง่ายขึ้น)
  const removeVideo = () => {
    updateProjectInfo({ video: null });

    if (videoInputRef.current) {
      videoInputRef.current.value = "";
    }

    setShowSavedTick(true); // <--- เพิ่มบรรทัดนี้เพื่อให้ขึ้น "บันทึกแล้ว"
  };

  return (
    <div className="flex flex-col gap-[40px] p-[10px]">
      <div className="flex flex-col p-[30px] bg-white-foreground rounded-[12px] gap-[13px]">
        <h1 className="text-foreground text-[24px] font-semibold">ข้อมูลโปรเจกต์</h1>
        <form className="flex flex-col gap-[13px]">
          <div className="flex flex-col gap-[4px]">
            <label className="text-foreground text-[14px]">ชื่อโปรเจกต์</label>
            <input
              value={localData.title}
              onBlur={() => handleAutoSave('title', localData.title)}
              onChange={(e) => setLocalData({ ...localData, title: e.target.value })}
              type="text"
              className="border border-border bg-background h-[38px] px-[12px] rounded-[6px] focus:outline-none focus:border-primary transition-all duration-200 hover:border-primary/50" />
          </div>
          <p className="text-[12px] text-muted-foreground">*การตั้งชื่อโปรเจกต์ควรเน้นความสั้นและจดจำง่ายในทันที่ เพื่อให้ชื่อโปรเจกต์ของคุณดูโดดเด่นและค้นหาได้รวดเร็ว*</p>
          <div className="flex flex-col gap-[4px]">
            <label className="text-foreground text-[14px]">คำอธิบาย</label>
            <textarea
              value={localData.description}
              onBlur={() => handleAutoSave('description', localData.description)}
              onChange={(e) => setLocalData({ ...localData, description: e.target.value })}
              className="border border-border bg-background h-[100px] p-[12px] rounded-[8px] focus:outline-none focus:border-primary resize-none transition-all duration-200 hover:border-primary/50"
            />
          </div>
          <p className="text-[12px] text-muted-foreground">*ส่วนคำอธิบายคือพื้นที่สำหรับสรุปใจความสำคัญในประโยคเดียวว่าโปรเจกต์นี้ทำอะไร เพื่อให้ผู้ที่สนใจเข้าใจเป้าหมายหลักได้ทันทีโดยไม่ต้องอ่านยาว*</p>
          <div className="flex flex-col gap-[8px] relative">
            <label className="text-[14px] text-foreground">หมวดหมู่</label>
            <button
              type="button"
              onClick={() => setIsOpen(!isOpen)}
              className={`flex justify-between items-center w-full h-[38px] px-[12px] rounded-[6px] bg-background border transition-all duration-200 cursor-pointer ${isOpen ? 'border-primary' : 'border-border hover:border-primary/50'}`}>
              <span className={`text-[13px] ${localData.category ? 'text-foreground' : 'text-muted-foreground'}`}>{localData.category || 'เลือกหมวดหมู่'}</span>
              <ChevronDown size={16} className={`text-muted-foreground transition-transform duration-200 ${isOpen ? 'rotate-180' : ''}`} />
            </button>

            {isOpen && (
              <div className="absolute top-[70px] left-0 w-full bg-white border border-border rounded-[6px] shadow-lg z-10 overflow-hidden">
                <ul className="max-h-[240px] overflow-y-auto py-1">
                  {categories.map((category) => (
                    <li
                      key={category}
                      onClick={() => {
                        setLocalData({ ...localData, category: category });
                        handleAutoSave('category', category)
                        setIsOpen(false);
                      }}
                      className={`px-[12px] py-[8px] text-[14px] cursor-pointer transition-colors ${localData.category === category ? 'bg-primary/10 text-primary font-medium' : 'text-foreground hover:bg-[#F8F9FB]'}`}>
                      {category}
                    </li>
                  ))}
                </ul>
              </div>
            )}
          </div>
          <p className="text-[12px] text-muted-foreground">*เลือกหมวดหมู่ที่ตรงกับประเภทของโปรเจกต์เพื่อให้ระบบแสดงผลในกลุ่มที่ถูกต้องและช่วยให้ผู้คนค้นหาโปรเจกต์ของคุณได้รวดเร็วขึ้น*</p>
        </form>
      </div>

      <div className="flex flex-col bg-white-foreground rounded-[12px] p-[30px] gap-[13px]">
        <h1 className="text-foreground text-[24px] font-semibold">การระดมทุน</h1>
        <form className="flex flex-col gap-[20px]">
          <div className="flex flex-col gap-[4px]">
            <label className="text-foreground text-[14px]">เป้าหมายเงินทุน (บาท)</label>
            <input
              type="number"
              value={localData.fundingGoal || ''}
              onChange={(e) => setLocalData({ ...localData, fundingGoal: Number(e.target.value) })}
              onBlur={() => handleAutoSave('fundingGoal', localData.fundingGoal)}
              className="border border-border bg-background h-[38px] px-[12px] rounded-[6px] focus:outline-none focus:border-primary transition-all duration-200 hover:border-primary/50" />
          </div>
          <div className="flex flex-col gap-[4px]">
            <label className="text-foreground text-[14px]">ระยะเวลาโปรเจกต์  (เดือน)</label>
            <input
              type="number"
              value={localData.projectDuration || ''}
              onChange={(e) => setLocalData({ ...localData, projectDuration: Number(e.target.value) })}
              onBlur={() => handleAutoSave('projectDuration', localData.projectDuration)}
              className="border border-border bg-background h-[38px] px-[12px] rounded-[6px] focus:outline-none focus:border-primary transition-all duration-200 hover:border-primary/50" />
          </div>
          <div className="grid grid-cols-1 gap-[20px] md:grid-cols-3 md:gap-[20px]">
            <div className="flex flex-col gap-[4px]">
              <label className="text-foreground text-[14px]">Soft Cap (ได้รับทุนแม้ไม่ถึงเป้า)</label>
              <input
                type="number"
                value={localData.softCap || ''}
                onChange={(e) => setLocalData({ ...localData, softCap: Number(e.target.value) })}
                onBlur={() => handleAutoSave('softCap', localData.softCap)}
                className="border border-border bg-background h-[38px] px-[12px] rounded-[6px] focus:outline-none focus:border-primary transition-all duration-200 hover:border-primary/50" />
            </div>
            <div className="flex flex-col gap-[4px]">
              <label className="text-foreground text-[14px]">ระยะเวลาระดมทุน (วัน)</label>
              <input
                type="number"
                value={localData.campaignDuration || ''}
                onChange={(e) => setLocalData({ ...localData, campaignDuration: Number(e.target.value) })}
                onBlur={() => handleAutoSave('campaignDuration', localData.campaignDuration)}
                className="border border-border bg-background h-[38px] px-[12px] rounded-[6px] focus:outline-none focus:border-primary transition-all duration-200 hover:border-primary/50" />
            </div>
            <div className="flex flex-col gap-[4px]">
              <label className="text-foreground text-[14px]">ส่วนแบ่งกำไร (%)</label>
              <input
                type="number"
                value={localData.revenueShare || ''}
                onChange={(e) => setLocalData({ ...localData, revenueShare: Number(e.target.value) })}
                onBlur={() => handleAutoSave('revenueShare', localData.revenueShare)}
                className="border border-border bg-background h-[38px] px-[12px] rounded-[6px] focus:outline-none focus:border-primary transition-all duration-200 hover:border-primary/50" />
            </div>
          </div>
          <p className="text-[12px] text-muted-foreground">*ระบุเป้าหมายเงินทุนและระยะเวลา ให้ชัดเจน พร้อมกำหนดเงื่อนไขการรับเงินทั้งแบบ Soft Cap และ Hard Cap รวมถึงสัดส่วนผลตอบแทนที่แน่นอน เพื่อใช้เป็นข้อตกลงในการระดมทุน*</p>
        </form>
      </div>

      {/* upload images */}
      <div className="flex flex-col bg-white-foreground rounded-[12px] p-[30px] gap-[13px]">
        <div className="grid grid-cols-1 gap-8">
          <h1 className="text-[24px] text-foreground font-semibold">สื่อประกอบ</h1>
          {/* ไฟล์ประกอบ */}
          <div className="space-y-3">
            <label className="text-foreground text-[14px] flex items-center gap-[10px]"><FileImage size={16} />รูปภาพปก</label>
            <div
              onClick={() => additionalImagesRef.current?.click()}
              className="border-2 border-dashed border-purple-200 rounded-2xl p-10 flex flex-col items-center justify-center bg-primary/10 hover:bg-purple-50 transition-all cursor-pointer group"
            >
              <input
                type="file"
                multiple
                hidden
                ref={additionalImagesRef}
                onChange={handleMultipleFilesChange}
                accept="image/png, image/jpeg, image/jpg"
              />
              <div className="flex flex-col items-center gap-[14px] justify-center mb-3 text-primary text-[12px]">
                <Upload className="" size={24} />
                <p>อัปโหลดรูปโปรเจกต์</p>
                <p>JPG, PNG, JPEG (สูงสุด 5MB)</p>
              </div>
            </div>

            <p className="flex items-center gap-[10px] text-[14px] text-foreground"><ImageIcon size={14} /> รูปภาพเพิ่มเติม (สูงสุด 5 รูป)</p>
            {/* Chip แสดงไฟล์ */}
            <div className="flex flex-wrap gap-2">
              {currentProject?.files?.map((f, i) => (
                <div key={i} className="flex items-center gap-[10px] px-3 py-1.5 rounded-full text-xs">
                  <img src={f.url} alt={f.name} className="w-[50px] h-[50px] object-cover" />
                  <span className="max-w-[150px] truncate">{f.name}</span>
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      removeImage(i)
                    }}
                    className="ml-2 hover:text-error cursor-pointer">
                    <X size={14} />
                  </button>
                </div>
              ))}
            </div>
          </div>

          {/* วิดีโอ */}
          <div className="space-y-3">
            <label className="text-[14px] text-foreground flex items-center gap-[10px]">
              <Video size={16} /> ไฟล์วิดีโอ (ไม่บังคับ)
            </label>
            <div
              onClick={() => videoInputRef.current?.click()}
              className="border-2 border-dashed border-purple-200 rounded-2xl p-10 flex flex-col items-center justify-center bg-primary/10 hover:bg-purple-50 transition-all cursor-pointer group"
            >
              <input
                type="file"
                accept="video/*"
                hidden
                ref={videoInputRef}
                onChange={handleVideoChange} />
              <div className="flex flex-col items-center gap-[14px] justify-center mb-3 text-primary text-[12px]">
                <Upload className="" size={24} />
                <p>อัปโหลดวีดีโอโปรเจกต์</p>
                <p>MP4 (สูงสุด 50MB)</p>
              </div>
            </div>
            {currentProject.video && (
              <div className="flex items-center gap-[10px] text-foreground px-4 py-2 text-xs w-fit">
                <video
                  src={currentProject.video.url}
                  className="h-[50px] w-[50px] object-cover"
                  preload="metadata"
                  muted
                />
                <span>{currentProject.video.name}</span>
                <button
                  type="button"
                  onClick={(e) => {
                    e.stopPropagation();
                    removeVideo()
                  }}
                  className="ml-2 cursor-pointer hover:text-error">
                  <X size={14} />
                </button>
              </div>
            )}
          </div>
        </div>
      </div>

      <StepNavigation />
    </div>
  );
};

export default Step1Basics;