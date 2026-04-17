const PageHeader = ({ title, subtitle }: { title: string; subtitle?: string }) => (
    <div className="p-2.5">
        <h1 className="font-semibold text-[24px]">{title}</h1>
        {subtitle && <p className="text-[12px] text-muted-foreground">{subtitle}</p>}
    </div>
)

export default PageHeader
