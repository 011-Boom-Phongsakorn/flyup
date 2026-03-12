import { Link, useParams, useLocation } from "react-router"
import { ChevronRight, Eye } from 'lucide-react'

interface BreadcrumbItems {
    title: string;
}

const stepItems: BreadcrumbItems[] = [
    { title: 'ภาพรวมโปรเจกต์' },
    { title: 'ข้อมูลพื้นฐาน' },
    { title: 'เรื่องราว' },
    { title: 'ไมล์สโตน' },
    { title: 'ข้อตกลง' },
]

const Breadcrumb = () => {

    const { projectId } = useParams()
    const location = useLocation()

    const currentStepNum = location.pathname.includes('/step/') ? Number(location.pathname.split('/').pop()) : 0;

    // 2. กรองข้อมูล: เอาตั้งแต่ index 0 จนถึง index ปัจจุบัน
    // เช่น ถ้า current = 3, มันจะดึง 0, 1, 2, 3 มาทั้งหมด
    const activeStepItems = stepItems.filter((_, i) => i <= currentStepNum);

    return (
        <div className="flex justify-between p-[10px]">
            <ul className="flex">
                {
                    activeStepItems.map((item, idx) => {
                        const isLastItem = idx === activeStepItems.length - 1;
                        return (
                            <li key={idx} className="flex text-[14px] text-muted-foreground items-center">
                                {
                                    !isLastItem ? (
                                        <Link to={idx === 0 ? `/project/overview/${projectId}` : `/project/overview/${projectId}/step/${idx}`} className="hover:text-foreground transition-all duration-200">
                                            {item.title}
                                        </Link>
                                    ) : (
                                        <span>
                                            {item.title}
                                        </span>
                                    )
                                }
                                {!isLastItem && <ChevronRight className="text-foreground mx-[4px]" size={16} />}
                            </li>
                        )
                    })
                }
            </ul>
            <Link to='/preview' className="border border-border bg-white-foreground text-foreground rounded-[4px] flex gap-[10px] p-[8px] w-[165px] h-[38px] items-center justify-center hover:bg-white-foreground/50 transition-all duration-200">
                <Eye size={16} />
                <span className="text-[14px] font-medium">ดูตัวอย่าง</span>
            </Link>
        </div>
    )
}

export default Breadcrumb