interface ImagePreviewModalProps {
    url: string
    label: string
    onClose: () => void
}

const ImagePreviewModal = ({ url, label, onClose }: ImagePreviewModalProps) => (
    <div
        className="fixed inset-0 bg-black/60 flex items-center justify-center z-50"
        onClick={onClose}
    >
        <div
            className="bg-white rounded-[16px] p-[16px] max-w-[600px] w-full mx-[16px] flex flex-col gap-[12px]"
            onClick={(e) => e.stopPropagation()}
        >
            <div className="flex items-center justify-between">
                <h3 className="font-semibold text-foreground">{label}</h3>
                <button onClick={onClose} className="text-muted-foreground hover:text-foreground text-[20px] leading-none">&times;</button>
            </div>
            <img
                src={url}
                alt={label}
                className="w-full max-h-[500px] object-contain rounded-[8px] border border-border"
            />
        </div>
    </div>
)

export default ImagePreviewModal
