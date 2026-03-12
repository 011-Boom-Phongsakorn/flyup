import { type LucideIcon, CircleCheckBig, Send } from 'lucide-react';
import { Link, useParams } from 'react-router'

interface StageItems {
  icon: LucideIcon;
  title: string;
  des: string
}

const step: StageItems[] = [
  { icon: CircleCheckBig, title: 'ข้อมูลพื้นฐาน', des: 'ตั้งชื่อโครงการของคุณ อัปโหลดรูปภาพหรือวิดีโอ และกำหนดรายละเอียดของโปรเจกต์' },
  { icon: CircleCheckBig, title: 'เรื่องราว', des: 'เพิ่มคำอธิบายโครงการโดยละเอียด พร้อมระบุถึงความเสี่ยงและความท้าทายที่อาจเกิดขึ้น' },
  { icon: CircleCheckBig, title: 'Milestones', des: 'กำหนดช่วงเวลาและเป้าหมายหลักในแต่ละระยะของโครงการ เพื่อให้ผู้สนับสนุนเห็นแผนการดำเนินงานที่ชัดเจน (เช่น วันเริ่ม, วันเริ่มสิ้นสุด)' },
  { icon: CircleCheckBig, title: 'ข้อตกลงและเงื่อนไข', des: 'ยอมรับข้อกำหนดในการให้บริการ นโยบายความเป็นส่วนตัว และยืนยันความรับผิดชอบในการดำเนินโครงการให้สำเร็จตามที่ระบุไว้' },
]

const ProjectOverview = () => {
  const { projectId } = useParams()
  
  return (
    <div className='w-full mx-auto max-w-[937px] py-[100px]'>
      <h1 className='text-[24px] font-semibold text-foreground p-[10px]'>ภาพรวมของโปรเจกต์</h1>
      <div className='flex flex-col p-[10px] gap-[10px]'>
        <p className='text-[12px] text-primary'>กำลังสร้างโปรเจกต์</p>
        {
          step.map((s, idx) => {
            const Icon = s.icon;
            return (
              <Link to={`/project/overview/${projectId}/step/${idx + 1}`} key={idx} className='flex border border-border bg-white-foreground px-[15px] py-[10px] gap-[5px] h-[90px] items-center rounded-[10px] cursor-pointer hover:bg-white-foreground/50 transition-all duration-200'>
                <Icon size={40} className='text-primary-light shrink-0' strokeWidth={2} />
                <div className='flex flex-col p-[10px] gap-[4px]'>
                  <h2 className='text-foreground text-[18px] font-semibold'>{s.title}</h2>
                  <p className='text-muted-foreground text-[14px]'>{s.des}</p>
                </div>
              </Link>
            )
          })
        }
      </div>
      <div className='flex justify-end p-[10px] mt-[10px]'>
        <button className='flex h-[38px] bg-primary text-white-foreground rounded-[12px] w-[190px] justify-center items-center gap-[10px] cursor-pointer hover:bg-primary-hover transition-all duration-200'>
          <Send size={16} strokeWidth={1} />
          <span className='text-[14px]'>ส่งคำขอสร้างโปรเจกต์</span>
        </button>
      </div>
    </div>
  )
}

export default ProjectOverview