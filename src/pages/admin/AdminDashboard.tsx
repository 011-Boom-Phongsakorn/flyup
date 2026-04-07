import { UserRoundCheck, MailSearch, Milestone, MessageSquareWarning, ShieldBan, Users } from 'lucide-react'

const card = [
  { icon: <UserRoundCheck size={20} />, title: 'Pioneer รอตรวจสอบ', amount: '฿3,434' },
  { icon: <MailSearch size={20} />, title: 'โปรเจกต์รอตรวจสอบ', amount: '3' },
  { icon: <Milestone size={20} />, title: 'Milestone รอตรวจสอบ', amount: '฿1,200' },
  { icon: <MessageSquareWarning size={20} />, title: 'คำร้องเรียนเปิดอยู่', amount: '฿3,434' },
  { icon: <ShieldBan size={20} />, title: 'โปรเจกต์ถูกระงับ', amount: '3' },
  { icon: <Users size={20} />, title: 'ผู้ใช้ทั้งหมด', amount: '฿1,200' },
]

const activities = [
  { title: 'Pioneer "ณัฐพล สุขใจ" ส่งใบสมัครใหม่', time: '12 นาทีที่แล้ว' },
  { title: 'โปรเจกต์ "CampusEats" ส่งให้ตรวจสอบ', time: '1 ชั่วโมงที่แล้ว' },
  { title: 'Milestone Phase 2 ของ "UniTrack" โหวตผ่าน 78%', time: '2 ชั่วโมงที่แล้ว' },
  { title: 'คำร้องเรียนใหม่จาก Booster "สมศักดิ์"', time: '7 ชั่วโมงที่แล้ว' },
  { title: 'โอนเงิน ฿15,000 ให้โปรเจกต์ "GreenRoute" Phase 1', time: '3 ชั่วโมงที่แล้ว' },
]

const Dashboard = () => {
  return (
    <div className='text-foreground flex flex-col gap-[50px]'>
      <div>
        <h1 className='font-semibold text-[24px] p-[10px]'>แดชบอร์ด</h1>
        <div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-[10px]'>
          {
            card.map((c, idx) => (
              <div key={idx} className='bg-card border border-border h-[110px] w-full rounded-[10px] p-[10px]'>
                <div className='flex p-[10px] justify-between'>
                  <span className='text-[14px]'>{c.title}</span>
                  <span>{c.icon}</span>
                </div>
                <div className='p-[10px] text-[24px] font-semibold'>
                  {c.amount}
                </div>
              </div>
            ))
          }
        </div>
      </div>
      <div>
        <h1 className='font-semibold text-[18px] p-[10px]'>กิจกรรมล่าสุด</h1>
        <div className='flex flex-col justify-between gap-[24px]'>
          {
            activities.map((act, idx) => (
              <div className='h-[52px] bg-card flex justify-between items-center rounded-[12px] px-[10px] w-full'>
                <span>{act.title}</span>
                <span>{act.time}</span>
              </div>
            ))
          }
        </div>
      </div>
    </div>
  )
}

export default Dashboard