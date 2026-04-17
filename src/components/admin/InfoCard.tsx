interface InfoCardProps {
    label: string
    value: string
    icon?: React.ReactNode
}

const InfoCard = ({ label, value, icon }: InfoCardProps) => (
    <div className="bg-white border border-border rounded-[12px] p-[16px]">
        <p className="text-[11px] text-muted-foreground mb-[4px] flex items-center gap-1">
            {icon} {label}
        </p>
        <p className="text-[14px] font-semibold text-foreground">{value}</p>
    </div>
)

export default InfoCard
