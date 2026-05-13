import { Link } from 'react-router'
import { Flame, Sparkles } from 'lucide-react'
import type { PublicProject } from '../../store/usePublicProjectStore'

const PLACEHOLDER_IMG = 'https://images.unsplash.com/photo-1498050108023-c5249f4df085?auto=format&fit=crop&q=80&w=800'

const getProgress = (p: PublicProject) => {
  if (!p.funding_goal || p.funding_goal === 0) return 0
  return Math.min(Math.round((p.current_funding / p.funding_goal) * 100), 100)
}

const getDaysLeft = (p: PublicProject) => {
  if (!p.end_date) return p.duration_days || 0
  const diff = new Date(p.end_date).getTime() - Date.now()
  return Math.max(0, Math.ceil(diff / (1000 * 60 * 60 * 24)))
}

type Props = { project: PublicProject & { isHot?: boolean; isNew?: boolean } }

export default function ProjectCard({ project }: Props) {
  const progress = getProgress(project)
  const daysLeft = getDaysLeft(project)

  return (
    <Link
      to={`/projects/${project.slug || project.id}`}
      className="bg-white rounded-2xl overflow-hidden shadow-sm border border-gray-100 hover:shadow-lg transition-all cursor-pointer group flex flex-col"
    >
      <div className="relative h-48 w-full overflow-hidden bg-gray-100">
        <img src={project.thumbnail_url || PLACEHOLDER_IMG} alt={project.title} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
        <div className="absolute top-3 right-3 flex gap-2">
          {project.isHot && (
            <div className="bg-red-500 text-white px-2.5 py-1 rounded-full text-xs font-bold flex items-center gap-1 shadow-md">
              <Flame size={14} fill="currentColor" /> {progress}%
            </div>
          )}
          {project.isNew && !project.isHot && (
            <div className="bg-purple-500 text-white px-2.5 py-1 rounded-full text-xs font-bold flex items-center gap-1 shadow-md">
              <Sparkles size={14} fill="currentColor" /> ใหม่
            </div>
          )}
        </div>
      </div>
      <div className="p-4 flex flex-col flex-1">
        <div className="flex justify-between items-start gap-2 mb-1">
          <h3 className="text-lg font-bold line-clamp-1 flex-1">{project.title}</h3>
          {project.category && (
            <span className="text-[10px] font-medium px-2.5 py-0.5 bg-white border border-gray-200 rounded-full text-gray-400 whitespace-nowrap">
              {project.category}
            </span>
          )}
        </div>
        <p className="text-xs text-gray-500 line-clamp-1 mb-4">{project.description || 'ยังไม่มีรายละเอียด'}</p>
        <div className="w-full h-1.5 bg-gray-100 rounded-full mb-3 overflow-hidden mt-auto">
          <div className="h-full bg-gradient-to-r from-pink-500 to-purple-600 rounded-full" style={{ width: `${progress}%` }} />
        </div>
        <div className="flex justify-between items-center pt-1">
          <span className="text-sm font-bold">{(project.current_funding ?? 0).toLocaleString()} ฿</span>
          <span className="text-xs text-gray-500">{daysLeft} วัน</span>
        </div>
      </div>
    </Link>
  )
}
