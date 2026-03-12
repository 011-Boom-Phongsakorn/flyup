import { useNavigate } from "react-router"
import { Plus, Loader2 } from 'lucide-react'
import { useProjectStore } from "../../store/useProjectStore"

const Dashboard = () => {
  const navigate = useNavigate()
  const { createProject, isCreating, currentProject } = useProjectStore();

  const handleCreateProject = async () => {
    const newProjectId = await createProject()
    newProjectId && navigate(`/project/overview/${newProjectId}`)
  }

  return (
    <div>
      <div className="flex justify-between">
        <h1 className="text-[24px] text-foreground font-semibold">แดชบอร์ด Pioneer</h1>
        <button 
            onClick={handleCreateProject}
            disabled={isCreating}
            className="bg-primary h-[38px] flex justify-center items-center gap-[10px] p-[10px] rounded-[10px] text-white-foreground hover:bg-primary/90 transition-all disabled:opacity-50 cursor-pointer text-[14px] font-medium"
        >
            {isCreating ? (
                <Loader2 size={20} className="animate-spin" />
            ) : (
                <>
                    <Plus size={20} /> 
                    <span>สร้างโปรเจกต์ใหม่</span>
                </>
            )}
        </button>
      </div>
    </div>
  )
}

export default Dashboard