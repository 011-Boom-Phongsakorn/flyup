interface StatusBadgeProps {
    label: string
    className: string
    icon?: React.ReactNode
}

const StatusBadge = ({ label, className, icon }: StatusBadgeProps) => (
    <span className={`inline-flex items-center gap-1 rounded-full px-2.5 py-0.5 text-[12px] font-medium whitespace-nowrap ${className}`}>
        {icon}{label}
    </span>
)

export default StatusBadge
