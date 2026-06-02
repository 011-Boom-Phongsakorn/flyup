import { useEffect, useState } from 'react';
import { type LucideIcon, CircleCheckBig, Send, BookOpen } from 'lucide-react';
import { Link, useParams, useNavigate } from 'react-router'
import { useProjectStore, type Project } from '../../store/useProjectStore';
import api from '../../services/api';
import { AxiosError } from 'axios';
import toast from 'react-hot-toast';

interface StageItems {
  icon: LucideIcon;
  title: string;
  des: string;
  isComplete: (p: Project, projectId?: string) => boolean;
}

const step: StageItems[] = [
  {
    icon: CircleCheckBig,
    title: 'ข้อมูลพื้นฐาน',
    des: 'ตั้งชื่อโครงการของคุณ อัปโหลดรูปภาพหรือวิดีโอ และกำหนดรายละเอียดของโปรเจกต์',
    isComplete: (p) =>
      !!p.title && !!p.description && p.categoryId > 0 &&
      p.fundingGoal > 0 && p.projectDuration > 0 &&
      p.campaignDuration > 0 && p.revenueShare > 0 && p.files.length > 0,
  },
  {
    icon: CircleCheckBig,
    title: 'เรื่องราว',
    des: 'เพิ่มคำอธิบายโครงการโดยละเอียด พร้อมระบุถึงความเสี่ยงและความท้าทายที่อาจเกิดขึ้น',
    isComplete: (p) => !!p.story && p.story !== '<p></p>' && !!p.risks,
  },
  {
    icon: CircleCheckBig,
    title: 'Milestones',
    des: 'กำหนดช่วงเวลาและเป้าหมายหลักในแต่ละระยะของโครงการ เพื่อให้ผู้สนับสนุนเห็นแผนการดำเนินงานที่ชัดเจน (เช่น วันเริ่ม, วันเริ่มสิ้นสุด)',
    isComplete: (p) =>
      p.milestones?.length === 4 &&
      p.milestones.every(m => !!m.title && !!m.description && (m.duration ?? 0) > 0),
  },
  {
    icon: CircleCheckBig,
    title: 'ข้อตกลงและเงื่อนไข',
    des: 'ยอมรับข้อกำหนดในการให้บริการ นโยบายความเป็นส่วนตัว และยืนยันความรับผิดชอบในการดำเนินโครงการให้สำเร็จตามที่ระบุไว้',
    isComplete: (_, projectId) =>
      projectId ? localStorage.getItem(`agreed_${projectId}`) === 'true' : false,
  },
]

const ProjectOverview = () => {
  const { projectId } = useParams()
  const navigate = useNavigate()
  const { currentProject, loadCurrentProject } = useProjectStore()
  const [showModal, setShowModal] = useState(false)
  const [isSubmitting, setIsSubmitting] = useState(false)

  useEffect(() => {
    if (projectId) loadCurrentProject(Number(projectId));
  }, [projectId, loadCurrentProject]);

  const canSubmit = step.every(s => s.isComplete(currentProject, projectId))

  const handleSubmit = async () => {
    setIsSubmitting(true)
    try {
      await api.patch(`/pioneer/projects/${projectId}/submit`)
      navigate('/pioneer/dashboard/projects')
    } catch (error) {
      const msg = error instanceof AxiosError ? error.response?.data?.message : null;
      if (msg === 'you already have an active project') {
        toast.error('คุณมีโปรเจกต์ที่กำลังดำเนินอยู่แล้ว ไม่สามารถส่งโปรเจกต์ใหม่ได้ในขณะนี้');
      } else {
        toast.error(msg || 'เกิดข้อผิดพลาด กรุณาลองใหม่');
      }
    } finally {
      setIsSubmitting(false)
      setShowModal(false)
    }
  }

  return (
    <>
      <div className='w-full mx-auto max-w-[937px] py-[100px]'>
        <div className='flex items-center justify-between p-2.5'>
          <h1 className='text-[24px] font-semibold text-foreground'>ภาพรวมของโปรเจกต์</h1>
          <Link
            to='/project/guide'
            className='flex items-center gap-2 px-4 py-2 rounded-xl border border-primary/30 text-primary bg-primary/5 hover:bg-primary/10 transition-colors text-[13px] font-medium'
          >
            <BookOpen size={15} />
            อ่านคู่มือการสร้างโปรเจกต์
          </Link>
        </div>
        <div className='flex flex-col p-[10px] gap-[10px]'>
          <p className='text-[12px] text-primary'>กำลังสร้างโปรเจกต์</p>
          {step.map((s, idx) => {
            const Icon = s.icon;
            const done = s.isComplete(currentProject, projectId);
            return (
              <Link to={`/project/overview/${projectId}/step/${idx + 1}`} key={idx} className='flex border border-border bg-white-foreground px-[15px] py-[10px] gap-[5px] h-[90px] items-center rounded-[10px] cursor-pointer hover:bg-white-foreground/50 transition-all duration-200'>
                <Icon size={40} className={done ? 'text-green-500 shrink-0' : 'text-primary-light shrink-0'} strokeWidth={2} />
                <div className='flex flex-col p-[10px] gap-[4px]'>
                  <h2 className='text-foreground text-[18px] font-semibold'>{s.title}</h2>
                  <p className='text-muted-foreground text-[14px]'>{s.des}</p>
                </div>
              </Link>
            )
          })}
        </div>
        {currentProject.state === 'draft' && (
          <div className='flex justify-end p-[10px] mt-[10px]'>
            <button
              disabled={!canSubmit}
              onClick={() => setShowModal(true)}
              className='flex h-[38px] bg-primary text-white-foreground rounded-[12px] w-[190px] justify-center items-center gap-[10px] hover:bg-primary-hover transition-all duration-200 disabled:opacity-40 disabled:cursor-not-allowed disabled:hover:bg-primary cursor-pointer'>
              <Send size={16} strokeWidth={1} />
              <span className='text-[14px]'>ส่งคำขอสร้างโปรเจกต์</span>
            </button>
          </div>
        )}
      </div>

      {showModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm">
          <div className="bg-white rounded-[16px] p-[40px] w-[90%] max-w-[500px] shadow-2xl flex flex-col items-center">
            <h2 className="text-[24px] font-bold text-foreground mb-[24px]">ยืนยันส่งโปรเจกต์</h2>
            <div className="flex flex-col items-center gap-[8px] mb-[40px] text-[16px] text-muted-foreground text-center">
              <p>โปรเจกต์ <span className="font-semibold text-foreground">"{currentProject.title}"</span> จะถูกส่งไปยัง Admin เพื่อตรวจสอบ</p>
              <p>คุณจะได้รับแจ้งเตือนเมื่อได้รับการอนุมัติ</p>
            </div>
            <div className="grid grid-cols-2 gap-[16px] w-full">
              <button
                onClick={() => setShowModal(false)}
                className="h-[48px] rounded-[12px] border border-border text-foreground font-medium hover:bg-gray-50 transition-colors"
              >
                ยกเลิก
              </button>
              <button
                onClick={handleSubmit}
                disabled={isSubmitting}
                className="h-[48px] rounded-[12px] bg-primary text-white font-medium hover:bg-primary-hover flex items-center justify-center gap-[8px] transition-colors disabled:opacity-50"
              >
                <Send size={16} />
                {isSubmitting ? 'กำลังส่ง...' : 'ส่งคำขอ'}
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  )
}

export default ProjectOverview
