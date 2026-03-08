import { useEffect } from "react";
import { Link } from "react-router";
import { useProjectStore } from "../../store/useProjectStore";
import { Loader2, Plus } from "lucide-react";

const MyProjects = () => {
  const { projects, getProjects, isLoading } = useProjectStore();

  // ดึงข้อมูลเมื่อเข้าหน้าจอ
  useEffect(() => {
    getProjects();
  }, [getProjects]);

  return (
    <div className="max-w-6xl mx-auto p-6 font-kanit">
      {/* Header Section */}
      <div className="flex justify-between items-center mb-8">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">โปรเจกต์ของฉัน</h1>
          <p className="text-gray-500 text-sm">จัดการและติดตามสถานะโปรเจกต์ทั้งหมดของคุณ</p>
        </div>
        
        {/* ปุ่มสร้างโปรเจกต์ใหม่ (Link ไปหน้าที่จะสร้าง ID) */}
        <Link 
          to="/pioneer/dashboard" // หรือหน้าที่มีปุ่ม handleCreateProject ที่เราทำไว้
          className="bg-sidebar-primary text-white px-4 py-2 rounded-lg flex items-center gap-2 text-sm hover:opacity-90 transition-all"
        >
          <Plus size={18} /> สร้างโปรเจกต์
        </Link>
      </div>

      {/* Loading State */}
      {isLoading ? (
        <div className="flex flex-col items-center justify-center py-20 text-gray-400">
          <Loader2 className="animate-spin mb-2" size={32} />
          <p>กำลังโหลดโปรเจกต์ของคุณ...</p>
        </div>
      ) : projects.length === 0 ? (
        /* Empty State */
        <div className="text-center py-20 bg-gray-50 rounded-3xl border-2 border-dashed border-gray-200">
          <p className="text-gray-500 mb-4">คุณยังไม่มีโปรเจกต์ในขณะนี้</p>
        </div>
      ) : (
        /* Project List Grid */
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {projects.map((project) => (
            <Link 
              key={project.id}
              to={`/project/overview/${project.id}`}
              className="bg-white p-5 rounded-2xl border border-gray-100 hover:shadow-xl hover:shadow-indigo-500/5 transition-all group"
            >
              <div className="flex justify-between items-start mb-4">
                <span className={`px-3 py-1 rounded-full text-xs font-medium ${
                  project.status === 'draft' ? 'bg-amber-100 text-amber-600' : 'bg-green-100 text-green-600'
                }`}>
                  {project.status === 'draft' ? 'รอกรอกข้อมูล' : 'สมบูรณ์'}
                </span>
                <span className="text-gray-300 text-xs">ID: #{project.id}</span>
              </div>

              <h3 className="font-bold text-lg mb-2 group-hover:text-sidebar-primary transition-colors">
                {project.title || "ไม่ได้ระบุชื่อโปรเจกต์"}
              </h3>
              
              <p className="text-gray-500 text-sm line-clamp-2 mb-4">
                {project.description || "ยังไม่มีรายละเอียด..."}
              </p>

              <div className="pt-4 border-t border-gray-50 flex justify-between items-center">
                <span className="text-xs text-gray-400">แก้ไขล่าสุด: {new Date(project.createdAt).toLocaleDateString('th-TH')}</span>
                <div className="text-sidebar-primary text-sm font-medium flex items-center gap-1 group-hover:underline">
                  จัดการต่อ
                </div>
              </div>
            </Link>
          ))}
        </div>
      )}
    </div>
  );
};

export default MyProjects;