import { useState } from "react";
import { ChevronDown, X, FileVideo, ImageIcon, Upload, FileImage, Video } from "lucide-react";
import StepNavigation from "../StepNavigation";

const categories = [
    'Web App', 'Mobile App', 'AI', 'Data Analytics', 'Cloud', 'DevOps', 'Blockchain', 'Fintech', 'Cybersecurity', 'Game', 'Business', 'Education', 'IOT'
];

const Step1Basics = () => {
  const [isOpen, setIsOpen] = useState(false)
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);

  
  return (
    <div className="flex flex-col gap-[40px] px-[10px]">
      <div className="flex flex-col bg-white-foreground rounded-[12px] p-[30px] gap-[13px]">
        <h1 className="text-foreground text-[24px] font-semibold">ข้อมูลโปรเจกต์</h1>
        <form className="flex flex-col gap-[13px]">
          <div className="flex flex-col gap-[4px]">
            <label className="text-foreground text-[14px]">ชื่อโปรเจกต์</label>
            <input type="text" className="border border-border bg-background h-[38px] px-[12px] rounded-[6px] focus:outline-none focus:border-primary transition-all duration-200 hover:border-primary/50" />
          </div>
          <p className="text-[12px] text-muted-foreground">*การตั้งชื่อโปรเจกต์ควรเน้นความสั้นและจดจำง่ายในทันที่ เพื่อให้ชื่อโปรเจกต์ของคุณดูโดดเด่นและค้นหาได้รวดเร็ว*</p>
          <div className="flex flex-col gap-[4px]">
            <label className="text-foreground text-[14px]">คำอธิบาย</label>
            <input type="text" className="border border-border bg-background h-[105px] px-[12px] rounded-[6px] focus:outline-none focus:border-primary transition-all duration-200 hover:border-primary/50" />
          </div>
          <p className="text-[12px] text-muted-foreground">*ส่วนคำอธิบายคือพื้นที่สำหรับสรุปใจความสำคัญในประโยคเดียวว่าโปรเจกต์นี้ทำอะไร เพื่อให้ผู้ที่สนใจเข้าใจเป้าหมายหลักได้ทันทีโดยไม่ต้องอ่านยาว*</p>
          <div className="flex flex-col gap-[8px] relative">
              <label className="text-[14px] text-foreground">หมวดหมู่</label>
              <button type="button" onClick={() => setIsOpen(!isOpen)} className={`flex justify-between items-center w-full h-[38px] px-[12px] rounded-[6px] bg-background border transition-all duration-200 cursor-pointer ${isOpen ? 'border-primary' : 'border-border hover:border-primary/50'}`}>
                <span className={`text-[13px] ${selectedCategory ? 'text-foreground' : 'text-muted-foreground'}`}>{selectedCategory || 'เลือกหมวดหมู่'}</span>
                <ChevronDown size={16} className={`text-muted-foreground transition-transform duration-200 ${isOpen ? 'rotate-180' : ''}`} />
              </button>

              {isOpen && (
                <div className="absolute top-[70px] left-0 w-full bg-white border border-border rounded-[6px] shadow-lg z-10 overflow-hidden">
                  <ul className="max-h-[240px] overflow-y-auto py-1">
                    {categories.map((category, idx) => (
                      <li key={idx} onClick={() => {setSelectedCategory(category); setIsOpen(false);}} className={`px-[12px] py-[8px] text-[14px] cursor-pointer transition-colors ${selectedCategory === category ? 'bg-primary/10 text-primary font-medium' : 'text-foreground hover:bg-[#F8F9FB]'}`}>
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
            <input type="text" className="border border-border bg-background h-[38px] px-[12px] rounded-[6px] focus:outline-none focus:border-primary transition-all duration-200 hover:border-primary/50" />
          </div>
          <div className="flex flex-col gap-[4px]">
            <label className="text-foreground text-[14px]">ระยะเวลาโปรเจกต์  (เดือน)</label>
            <input type="text" className="border border-border bg-background h-[38px] px-[12px] rounded-[6px] focus:outline-none focus:border-primary transition-all duration-200 hover:border-primary/50" />
          </div>
          <div className="grid grid-cols-1 gap-[20px] md:grid-cols-3 md:gap-[20px]">
              <div className="flex flex-col gap-[4px]">
                <label className="text-foreground text-[14px]">Soft Cap (ได้รับทุนแม้ไม่ถึงเป้า)</label>
                <input type="text" className="border border-border bg-background h-[38px] px-[12px] rounded-[6px] focus:outline-none focus:border-primary transition-all duration-200 hover:border-primary/50" />
              </div>
              <div className="flex flex-col gap-[4px]">
                <label className="text-foreground text-[14px]">ระยะเวลาระดมทุน (วัน)</label>
                <input type="text" className="border border-border bg-background h-[38px] px-[12px] rounded-[6px] focus:outline-none focus:border-primary transition-all duration-200 hover:border-primary/50" />
              </div>
              <div className="flex flex-col gap-[4px]">
                <label className="text-foreground text-[14px]">ส่วนแบ่งกำไร (%)</label>
                <input type="text" className="border border-border bg-background h-[38px] px-[12px] rounded-[6px] focus:outline-none focus:border-primary transition-all duration-200 hover:border-primary/50" />
              </div>
          </div>
          <p className="text-[12px] text-muted-foreground">*ระบุเป้าหมายเงินทุนและระยะเวลา ให้ชัดเจน พร้อมกำหนดเงื่อนไขการรับเงินทั้งแบบ Soft Cap และ Hard Cap รวมถึงสัดส่วนผลตอบแทนที่แน่นอน เพื่อใช้เป็นข้อตกลงในการระดมทุน*</p>
        </form>
      </div>

      <div className="flex flex-col bg-white-foreground rounded-[12px] p-[30px] gap-[30px]">
      
        {/* หัวข้อหลัก */}
        <h1 className="text-foreground text-[24px] font-semibold">สื่อประกอบ</h1>

        {/* 1. ส่วนรูปภาพปก */}
        <div className="flex flex-col gap-[12px]">
          <div className="flex items-center gap-2 text-foreground text-[14px] font-medium">
            <ImageIcon size={18} />
            <span>รูปภาพปก</span>
          </div>
          
          {/* กล่องอัปโหลด (Dashed Box) */}
          <label className="flex flex-col items-center justify-center w-full h-[180px] border-2 border-dashed border-primary/40 bg-primary/5 hover:bg-primary/10 transition-colors duration-200 rounded-[12px] cursor-pointer">
            <Upload size={28} className="text-primary mb-2" />
            <span className="text-primary text-[14px] font-medium">อัปโหลดรูปโปรเจกต์</span>
            <span className="text-primary/60 text-[12px] mt-1">JPG, PNG (สูงสุด 5MB)</span>
            {/* input file ถูกซ่อนไว้ แต่ทำงานเมื่อคลิกที่ label */}
            <input type="file" className="hidden" accept="image/png, image/jpeg" />
          </label>
        </div>

        {/* 2. ส่วนรูปภาพเพิ่มเติม */}
        <div className="flex flex-col gap-[12px]">
          <div className="flex items-center gap-2 text-foreground text-[14px] font-medium">
            <ImageIcon size={18} />
            <span>รูปภาพเพิ่มเติม (สูงสุด 5 รูป)</span>
          </div>
          
          {/* รายการไฟล์ที่อัปโหลดแล้ว (จำลองข้อมูล) */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-2">
            {/* ไฟล์ที่ 1 */}
            <div className="flex items-center justify-between p-2 rounded-[8px] bg-background hover:bg-gray-50 transition-colors group">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-blue-50 rounded flex items-center justify-center text-blue-400">
                  <FileImage size={24} />
                </div>
                <span className="text-[13px] text-foreground truncate max-w-[200px]">Screenshot_2026_02-14...png</span>
              </div>
              <button type="button" className="p-1 text-muted-foreground hover:text-red-500 transition-colors">
                <X size={16} />
              </button>
            </div>

            {/* ไฟล์ที่ 2 */}
            <div className="flex items-center justify-between p-2 rounded-[8px] bg-background hover:bg-gray-50 transition-colors group">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-blue-50 rounded flex items-center justify-center text-blue-400">
                  <FileImage size={24} />
                </div>
                <span className="text-[13px] text-foreground truncate max-w-[200px]">Screenshot_2026_02-14...png</span>
              </div>
              <button type="button" className="p-1 text-muted-foreground hover:text-red-500 transition-colors">
                <X size={16} />
              </button>
            </div>
          </div>
        </div>

        {/* 3. ส่วนไฟล์วีดีโอ */}
        <div className="flex flex-col gap-[12px]">
          <div className="flex items-center gap-2 text-foreground text-[14px] font-medium">
            <Video size={18} />
            <span>ไฟล์วีดีโอ (ไม่บังคับ)</span>
          </div>

          {/* กล่องอัปโหลดวีดีโอ */}
          <label className="flex flex-col items-center justify-center w-full h-[180px] border-2 border-dashed border-primary/40 bg-primary/5 hover:bg-primary/10 transition-colors duration-200 rounded-[12px] cursor-pointer">
            <Upload size={28} className="text-primary mb-2" />
            <span className="text-primary text-[14px] font-medium">อัปโหลดวีดีโอโปรเจกต์</span>
            <span className="text-primary/60 text-[12px] mt-1">MOV, MP4 (สูงสุด 5MB)</span>
            <input type="file" className="hidden" accept="video/mp4, video/quicktime" />
          </label>

          {/* รายการไฟล์วีดีโอที่อัปโหลดแล้ว */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-2">
            {/* ไฟล์ที่ 1 */}
            <div className="flex items-center justify-between p-2 rounded-[8px] bg-background hover:bg-gray-50 transition-colors">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-gray-100 rounded flex items-center justify-center text-gray-600">
                  <FileVideo size={24} />
                </div>
                <span className="text-[13px] text-foreground truncate max-w-[200px]">present-video.mp4</span>
              </div>
              <button type="button" className="p-1 text-muted-foreground hover:text-red-500 transition-colors">
                <X size={16} />
              </button>
            </div>

            {/* ไฟล์ที่ 2 */}
            <div className="flex items-center justify-between p-2 rounded-[8px] bg-background hover:bg-gray-50 transition-colors">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-gray-100 rounded flex items-center justify-center text-gray-600">
                  <FileVideo size={24} />
                </div>
                <span className="text-[13px] text-foreground truncate max-w-[200px]">product.mp4</span>
              </div>
              <button type="button" className="p-1 text-muted-foreground hover:text-red-500 transition-colors">
                <X size={16} />
              </button>
            </div>
          </div>
        </div>

      </div>

      {/* <div className="flex justify-between items-center">
        <Link to={backUrl} className="w-[129px] h-[38px] bg-white-foreground text-foreground border border-muted flex items-center justify-center gap-[4px] rounded-[12px] hover:bg-white-foreground/50 transition-all duration-200">
          <ChevronLeft size={16} />
          <span className="text-[14px]">ย้อนกลับ</span>
        </Link>
        <Link to='/' className="w-[129px] h-[38px] bg-primary hover:bg-primary-hover text-white-foreground flex items-center justify-center gap-[4px] rounded-[12px] transition-all duration-200">
          <span className="text-[14px]">ถัดไป</span>
          <ChevronRight size={16} />
        </Link>
      </div> */}
      <StepNavigation />
    </div>
  );
};

export default Step1Basics;