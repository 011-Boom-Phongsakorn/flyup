import { Link } from "react-router"

const projects = [
    { id: 1, title: 'CampusEats แอปมือถือ', fullname: 'วิชัย รักเรียน', goal: '฿80,000', date: '12 ก.พ. 2026', status: 'รอตรวจสอบ' },
    { id: 2, title: 'EcoTracker เว็บแอป', fullname: 'สุดา สิ่งแวดล้อม', goal: '฿45,000', date: '10 ก.พ. 2026', status: 'รอตรวจสอบ' },
    { id: 3, title: 'FitBuddy IoT', fullname: 'ชัยวัฒน์ สุขภาพ', goal: '฿120,000', date: '8 ก.พ. 2026', status: 'รอตรวจสอบ' },
    { id: 4, title: 'UniTrack แอปมือถือ', fullname: 'ณัฐพล สุขใจ', goal: '฿50,000', date: '5 ก.พ. 2026', status: 'อนุมัติ' },
    { id: 5, title: 'LabConnect เว็บแอป', fullname: 'จิรา เจริญ', goal: '฿60,000', date: '1 ก.พ. 2026', status: 'ปฏิเสธ' },
]

const ProjectApproval = () => {
  return (
    <div>
        <div className="text-foreground">
            <div className="p-[10px]">
                <h1 className="font-semibold text-[24px]">ตรวจสอบโปรเจกต์</h1>
                <p className="text-[12px] text-muted-foreground">ตรวจสอบและอนุมัติโปรเจกต์ใหม่ที่ส่งเข้ามา</p>
            </div>

            {/* Table Section */}
            <div className="bg-white rounded-xl border border-border overflow-hidden text-[14px]">
                {/* Table Header */}
                <div className="grid grid-cols-6 bg-[#f8f9fc] p-4 font-medium text-gray-500 border-b border-border">
                    <div className="text-center">โปรเจกต์</div>
                    <div className="text-center">Pioneer</div>
                    <div className="text-center">เป้าหมาย</div>
                    <div className="text-center">วันที่ส่ง</div>
                    <div className="text-center">สถานะ</div>
                </div>

                {/* Table Body */}
                {
                    projects.map((p, idx) => (
                        <div key={idx} className="grid grid-cols-6">
                            <div className="h-[60px] flex justify-center items-center">{p.title}</div>
                            <div className="h-[60px] flex justify-center items-center">{p.fullname}</div>
                            <div className="h-[60px] flex justify-center items-center">{p.goal}</div>
                            <div className="h-[60px] flex justify-center items-center">{p.date}</div>
                            <div className="h-[60px] flex justify-center items-center"><span className={`rounded-[12px] px-[10px] py-[2px] ${p.status === 'รอตรวจสอบ' ? 'bg-gray-100 text-gray-600' : p.status === 'อนุมัติ' ? 'bg-primary text-white' : 'bg-error text-white'}`}>{p.status}</span></div>
                            <div className="h-[60px] flex justify-center items-center">
                                <Link to={`/admin/projects/${p.id}`} className="px-[16px] py-[8px] rounded-[2px] bg-gray-100 hover:bg-gray-200 transition-all duration-200">รายละเอียด</Link>
                            </div>
                        </div>
                    ))
                }
            </div>
        </div>
    </div>
  )
}

export default ProjectApproval