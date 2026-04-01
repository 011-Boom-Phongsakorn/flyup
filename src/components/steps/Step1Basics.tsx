import { useState, useRef, useEffect } from "react";
import { useParams } from "react-router";
import { ChevronDown, X, ImageIcon, Upload, FileImage, Video } from "lucide-react";
import StepNavigation from "../StepNavigation";
import { useProjectStore, type Project } from "../../store/useProjectStore";
import toast from "react-hot-toast";
import api from "../../services/api";

const Step1Basics = () => {
  const { projectId } = useParams();
  const { currentProject, updateProjectInfo, updateProject, setSaveStatus } = useProjectStore()

  const [isOpen, setIsOpen] = useState(false)

  const formatNum = (n: number) => n > 0 ? n.toLocaleString('th-TH') : '';
  const parseNum = (s: string) => Number(s.replace(/,/g, '')) || 0;

  const [allCategories, setAllCategories] = useState<{ id: number; name: string }[]>([]);

  const [localData, setLocalData] = useState(() => ({
    title: currentProject.title || '',
    description: currentProject.description || '',
    category: currentProject.category || '',
    categoryId: currentProject.categoryId || 0,
    fundingGoal: currentProject.fundingGoal || 0,
    projectDuration: currentProject.projectDuration || 0,
    softCap: currentProject.softCap || 0,
    campaignDuration: currentProject.campaignDuration || 0,
    revenueShare: currentProject.revenueShare || 0,
    minInvestAmount: currentProject.minInvestAmount || 0,
    maxInvestAmount: currentProject.maxInvestAmount || 0,
  }));

  // Sync localData เมื่อ store โหลดข้อมูลจาก API เสร็จ (เช่น เปิดหน้าใหม่หลัง refresh)
  const hasInitializedRef = useRef(false);
  useEffect(() => {
    if (!hasInitializedRef.current && currentProject.title) {
      hasInitializedRef.current = true;
      setTimeout(() => {
        setLocalData({
          title: currentProject.title,
          description: currentProject.description || '',
          category: currentProject.category || '',
          categoryId: currentProject.categoryId || 0,
          fundingGoal: currentProject.fundingGoal || 0,
          projectDuration: currentProject.projectDuration || 0,
          softCap: currentProject.softCap || 0,
          campaignDuration: currentProject.campaignDuration || 0,
          revenueShare: currentProject.revenueShare || 0,
          minInvestAmount: currentProject.minInvestAmount || 0,
          maxInvestAmount: currentProject.maxInvestAmount || 0,
        });
      }, 0);
    }
  }, [currentProject]);

  useEffect(() => {
    setLocalData(prev => ({ ...prev, minInvestAmount: currentProject.minInvestAmount }));
  }, [currentProject.minInvestAmount]);

  useEffect(() => {
    api.get('/categories').then(res => {
      setAllCategories(res.data?.data ?? []);
    }).catch(() => {});
  }, []);

  const additionalImagesRef = useRef<HTMLInputElement>(null);
  const videoInputRef = useRef<HTMLInputElement>(null);

  const triggerSaved = () => {
    setSaveStatus('saved');
    setTimeout(() => setSaveStatus('idle'), 2500);
  };

  const handleAutoSave = async (field: keyof Project, newValue: string | number) => {
    const oldValue = currentProject?.[field as keyof typeof currentProject];
    const isSame = typeof newValue === 'string'
      ? newValue.trim() === (oldValue as string || '')
      : newValue === oldValue;

    if (isSame) return;

    setSaveStatus('saving');
    updateProjectInfo({ [field]: newValue });

    if (projectId) {
      await updateProject(Number(projectId), { [field]: newValue });
    }

    triggerSaved();
  };

  const uploadMediaToServer = async (file: File): Promise<{ url: string; mediaId?: number } | null> => {
    if (!projectId) return null;
    try {
      // Step 1: upload file to Cloudinary via /upload
      const formData = new FormData();
      formData.append('file', file);
      const uploadRes = await api.post('/upload', formData, {
        headers: { 'Content-Type': 'multipart/form-data' },
      });
      const { url, type } = uploadRes.data?.data ?? {};
      if (!url || !type) return null;

      // Step 2: attach uploaded URL to project
      await api.post(`/pioneer/projects/${projectId}/media`, { url, type });

      // Step 3: fetch media list to get the DB id of the newly attached item
      const mediaRes = await api.get(`/pioneer/projects/${projectId}/media`);
      const mediaList: { id: number; url: string }[] = mediaRes.data?.data ?? [];
      const matched = mediaList.find((m) => m.url === url);
      return { url, mediaId: matched?.id };
    } catch (error) {
      console.error('upload media failed:', error);
      return null;
    }
  };

  const handleMultipleFilesChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files) return;

    const currentImages = currentProject?.files || [];
    const allowedTypes = ['image/png', 'image/jpeg', 'image/jpg'];
    const validFiles = Array.from(files).filter(file => allowedTypes.includes(file.type));

    if (validFiles.length !== files.length) {
      toast.error("อนุญาตเฉพาะไฟล์ PNG และ JPEG เท่านั้น");
    }
    if (validFiles.length === 0) return;

    const remainingSlots = 5 - currentImages.length;
    if (remainingSlots <= 0) {
      toast.error("คุณสามารถอัปโหลดได้สูงสุด 5 รูป");
      return;
    }

    const filesToUpload = validFiles.slice(0, remainingSlots);

    // แสดง blob preview ก่อนทันที แล้ว upload ใน background
    const previews = filesToUpload.map(file => ({
      name: file.name,
      url: URL.createObjectURL(file),
      file,
    }));
    updateProjectInfo({ files: [...currentImages, ...previews] });

    // Upload ทีละไฟล์แล้วแทนที่ blob URL ด้วย server URL
    for (let i = 0; i < filesToUpload.length; i++) {
      const result = await uploadMediaToServer(filesToUpload[i]);
      if (result) {
        set_replaceFileUrl(previews[i].url, result.url, filesToUpload[i].name, result.mediaId);
      }
    }

    triggerSaved();
    if (additionalImagesRef.current) additionalImagesRef.current.value = "";
  };

  const set_replaceFileUrl = (blobUrl: string, serverUrl: string, name: string, mediaId?: number) => {
    URL.revokeObjectURL(blobUrl);
    useProjectStore.setState((state) => ({
      currentProject: {
        ...state.currentProject,
        files: state.currentProject.files.map(f =>
          f.url === blobUrl ? { id: mediaId, name, url: serverUrl } : f
        ),
      },
    }));
  };

  // ✅ จัดการวิดีโอ (คลิปเดียว)
  const handleVideoChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const supportedVideoTypes = ['video/mp4', 'video/webm', 'video/ogg', 'video/quicktime'];
    if (!supportedVideoTypes.includes(file.type)) {
      toast.error("รองรับเฉพาะไฟล์ MP4, WebM, OGG, MOV เท่านั้น");
      if (videoInputRef.current) videoInputRef.current.value = "";
      return;
    }

    if (file.size > 50 * 1024 * 1024) {
      toast.error("วิดีโอต้องมีขนาดไม่เกิน 50MB");
      return;
    }

    const blobUrl = URL.createObjectURL(file);
    updateProjectInfo({ video: { name: file.name, url: blobUrl, file } });

    const result = await uploadMediaToServer(file);
    if (result) {
      URL.revokeObjectURL(blobUrl);
      useProjectStore.setState((state) => ({
        currentProject: { ...state.currentProject, video: { id: result.mediaId, name: file.name, url: result.url } },
      }));
      triggerSaved();
    } else {
      // upload failed — remove local preview
      URL.revokeObjectURL(blobUrl);
      updateProjectInfo({ video: null });
      if (videoInputRef.current) videoInputRef.current.value = "";
      toast.error("อัปโหลดวิดีโอไม่สำเร็จ กรุณาลองใหม่");
    }
  };

  const removeImage = async (index: number) => {
    const currentImages = currentProject?.files || [];
    const targetImage = currentImages[index];
    if (!targetImage) return;

    if (targetImage.url) URL.revokeObjectURL(targetImage.url);
    updateProjectInfo({ files: currentImages.filter((_, i) => i !== index) });

    if (targetImage.id) {
      await api.delete(`/pioneer/projects/media/${targetImage.id}`).catch(console.error);
    }
    triggerSaved();
  };

  const removeVideo = async () => {
    const vid = currentProject?.video;
    updateProjectInfo({ video: null });
    if (videoInputRef.current) videoInputRef.current.value = "";

    if (vid?.id) {
      await api.delete(`/pioneer/projects/media/${vid.id}`).catch(console.error);
    }
    triggerSaved();
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
                  {allCategories.length === 0 ? (
                    <li className="px-[12px] py-[8px] text-[13px] text-muted-foreground">กำลังโหลด...</li>
                  ) : null}
                  {allCategories.map((cat) => (
                    <li
                      key={cat.id}
                      onClick={() => {
                        setLocalData({ ...localData, category: cat.name, categoryId: cat.id });
                        updateProjectInfo({ category: cat.name, categoryId: cat.id });
                        if (projectId) {
                          updateProject(Number(projectId), { categoryId: cat.id });
                        }
                        setIsOpen(false);
                      }}
                      className={`px-[12px] py-[8px] text-[14px] cursor-pointer transition-colors ${localData.category === cat.name ? 'bg-primary/10 text-primary font-medium' : 'text-foreground hover:bg-[#F8F9FB]'}`}>
                      {cat.name}
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
              type="text"
              value={formatNum(localData.fundingGoal)}
              onChange={(e) => {
                const newGoal = parseNum(e.target.value);
                const autoSoftCap = Math.ceil(newGoal * 0.7);
                const autoMinInvest = Math.ceil(newGoal * 0.01);
                setLocalData({ ...localData, fundingGoal: newGoal, softCap: autoSoftCap, minInvestAmount: autoMinInvest });
              }}
              onBlur={() => {
                handleAutoSave('fundingGoal', localData.fundingGoal);
                handleAutoSave('softCap', localData.softCap);
                handleAutoSave('minInvestAmount', localData.minInvestAmount);
              }}
              className="border border-border bg-background h-[38px] px-[12px] rounded-[6px] focus:outline-none focus:border-primary transition-all duration-200 hover:border-primary/50" />
          </div>
          <div className="flex flex-col gap-[4px]">
            <label className="text-foreground text-[14px]">ระยะเวลาโปรเจกต์  (เดือน)</label>
            <input
              type="text"
              value={formatNum(localData.projectDuration)}
              onChange={(e) => setLocalData({ ...localData, projectDuration: parseNum(e.target.value) })}
              onBlur={() => handleAutoSave('projectDuration', localData.projectDuration)}
              className="border border-border bg-background h-[38px] px-[12px] rounded-[6px] focus:outline-none focus:border-primary transition-all duration-200 hover:border-primary/50" />
          </div>
          <div className="grid grid-cols-1 gap-[20px] md:grid-cols-3 md:gap-[20px]">
            <div className="flex flex-col gap-[4px]">
              <label className="text-foreground text-[14px]">Soft Cap (ได้รับทุนแม้ไม่ถึงเป้า)</label>
              <input
                type="text"
                value={formatNum(localData.softCap)}
                onChange={(e) => setLocalData({ ...localData, softCap: parseNum(e.target.value) })}
                onBlur={() => {
                  const minSoftCap = Math.ceil(localData.fundingGoal * 0.7);
                  if (localData.softCap > 0 && localData.softCap < minSoftCap) {
                    toast.error(`Soft Cap ต้องไม่ต่ำกว่า 70% ของเป้าหมาย (${formatNum(minSoftCap)} บาท)`);
                    setLocalData({ ...localData, softCap: minSoftCap });
                    handleAutoSave('softCap', minSoftCap);
                    return;
                  }
                  handleAutoSave('softCap', localData.softCap);
                }}
                className="border border-border bg-background h-[38px] px-[12px] rounded-[6px] focus:outline-none focus:border-primary transition-all duration-200 hover:border-primary/50" />
            </div>
            <div className="flex flex-col gap-[4px]">
              <label className="text-foreground text-[14px]">ระยะเวลาระดมทุน (วัน)</label>
              <input
                type="text"
                value={formatNum(localData.campaignDuration)}
                onChange={(e) => setLocalData({ ...localData, campaignDuration: parseNum(e.target.value) })}
                onBlur={() => handleAutoSave('campaignDuration', localData.campaignDuration)}
                className="border border-border bg-background h-[38px] px-[12px] rounded-[6px] focus:outline-none focus:border-primary transition-all duration-200 hover:border-primary/50" />
            </div>
            <div className="flex flex-col gap-[4px]">
              <label className="text-foreground text-[14px]">ส่วนแบ่งกำไร (%)</label>
              <input
                type="text"
                value={formatNum(localData.revenueShare)}
                onChange={(e) => setLocalData({ ...localData, revenueShare: parseNum(e.target.value) })}
                onBlur={() => handleAutoSave('revenueShare', localData.revenueShare)}
                className="border border-border bg-background h-[38px] px-[12px] rounded-[6px] focus:outline-none focus:border-primary transition-all duration-200 hover:border-primary/50" />
            </div>
          </div>
          <div className="grid grid-cols-1 gap-[20px] md:grid-cols-2 md:gap-[20px]">
            <div className="flex flex-col gap-[4px]">
              <label className="text-foreground text-[14px]">ลงทุนขั้นต่ำ (บาท)</label>
              <input
                type="text"
                value={formatNum(localData.minInvestAmount)}
                disabled
                className="border border-border bg-background h-[38px] px-[12px] rounded-[6px] text-muted-foreground cursor-not-allowed opacity-60"
              />
            </div>
          </div>
          <p className="text-[12px] text-muted-foreground"><span className="text-error">*</span> ระบุเป้าหมายเงินทุนและระยะเวลา ให้ชัดเจน พร้อมกำหนดเงื่อนไขการรับเงินทั้งแบบ Soft Cap รวมถึงสัดส่วนผลตอบแทนที่แน่นอน เพื่อใช้เป็นข้อตกลงในการระดมทุน*</p>
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