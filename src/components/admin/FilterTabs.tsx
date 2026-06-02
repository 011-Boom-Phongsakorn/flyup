interface TabItem {
    key: string
    label: string
    count?: number
}

interface FilterTabsProps {
    tabs: TabItem[]
    active: string
    onChange: (key: string) => void
}

const FilterTabs = ({ tabs, active, onChange }: FilterTabsProps) => (
    <div className="flex items-center gap-2 flex-wrap">
        {tabs.map(t => (
            <button
                key={t.key}
                onClick={() => onChange(t.key)}
                className={`flex items-center gap-1.5 px-4 py-1.5 rounded-full text-[13px] font-medium transition-colors cursor-pointer ${
                    active === t.key
                        ? 'bg-primary text-white'
                        : 'bg-white border border-border text-foreground hover:bg-muted/60'
                }`}
            >
                {t.label}
                {t.count !== undefined && (
                    <span className={`text-[11px] font-bold px-1.5 py-0.5 rounded-full leading-none ${
                        active === t.key ? 'bg-white/20 text-white' : 'bg-muted text-muted-foreground'
                    }`}>
                        {t.count}
                    </span>
                )}
            </button>
        ))}
    </div>
)

export default FilterTabs
