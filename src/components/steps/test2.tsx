import { useState, useCallback, useEffect, useRef } from 'react'
import { useEditor, EditorContent, mergeAttributes } from '@tiptap/react'
import { BubbleMenu } from '@tiptap/react/menus'
import StarterKit from '@tiptap/starter-kit'
import Placeholder from '@tiptap/extension-placeholder'
import Image from '@tiptap/extension-image'
import Youtube from '@tiptap/extension-youtube'
import { SquarePlay, List, ImageIcon, Plus, ChevronDown, Check, X, Link as LinkIcon, Maximize, AlignLeft, AlignRight, Unlink } from 'lucide-react'
// import StepNavigation from "../StepNavigation"

// ✅ Custom Image Extension ที่รองรับการแนบลิงก์ (href) และจับรูปภาพจัด Align
const CustomImage = Image.extend({
  addAttributes() {
    return {
      ...this.parent?.(),
      href: {
        default: null,
        parseHTML: element => {
          // ถ้ามีลิงก์หุ้มอยู่ ให้ดึง href มา ถ้าไม่มีให้หาที่ data-href ของ span (ที่เราแอบสร้างไว้)
          const a = element.closest('a')
          const span = element.closest('span[data-href]')
          return a ? a.getAttribute('href') : (span ? span.getAttribute('data-href') : null)
        },
      },
      target: {
        default: '_blank',
      },
      align: {
        default: 'center',
      }
    }
  },
  renderHTML({ HTMLAttributes }) {
    const { href, target, align, ...imgAttributes } = HTMLAttributes

    let style = ''
    if (align === 'left') {
      style += 'float: left; margin: 0 1rem 1rem 0; width: 50%; max-width: 400px;'
    } else if (align === 'right') {
      style += 'float: right; margin: 0 0 1rem 1rem; width: 50%; max-width: 400px;'
    } else {
      style += 'display: block; margin: 0 auto; width: 100%;'
    }

    const img = ['img', mergeAttributes(this.options.HTMLAttributes, imgAttributes, { style })] as any

    if (href) {
      // ✅ ใช้ span ทรงเป็นลิงก์แทน a ตอนเรา render บน Editor จะได้ไม่ดื้อเด้งไปลิงก์จริงๆ
      return ['span', { 'data-href': href, class: 'cursor-pointer block relative' }, img] as any
    }

    return img
  },
})

const Step2Story = () => {
  const [isMenuExpanded, setIsMenuExpanded] = useState(false)
  const [dropdownOpen, setDropdownOpen] = useState(false)
  const [mediaUrlInputOpen, setMediaUrlInputOpen] = useState(false)
  const [mediaUrl, setMediaUrl] = useState('')

  // ✅ State สำหรับลิงก์บนรูปภาพ
  const [imageLinkInputOpen, setImageLinkInputOpen] = useState(false)
  const [imageLinkUrl, setImageLinkUrl] = useState('')

  // ✅ State สำหรับ custom floating menu
  const [showFloatingMenu, setShowFloatingMenu] = useState(false)
  const [menuPosition, setMenuPosition] = useState<{ top: number; left: number }>({ top: 0, left: 0 })
  const editorContainerRef = useRef<HTMLDivElement>(null)
  const fileInputRef = useRef<HTMLInputElement>(null)

  const editor = useEditor({
    extensions: [
      StarterKit,
      CustomImage.configure({
        HTMLAttributes: {
          class: 'rounded-lg max-w-full',
        },
      }),
      Youtube.configure({
        inline: false,
        HTMLAttributes: {
          class: 'w-full aspect-video rounded-lg',
        },
      }),
      Placeholder.configure({
        placeholder: 'Use text, images, videos, and audio to craft a compelling story.',
        emptyEditorClass: 'is-editor-empty',
      }),
    ],
    onUpdate: () => {
      setIsMenuExpanded(false)
      setDropdownOpen(false)
    },
    onSelectionUpdate: () => {
      setIsMenuExpanded(false)
      setDropdownOpen(false)
      setMediaUrlInputOpen(false)
    },
    content: '',
    editorProps: {
      attributes: {
        class: 'prose prose-slate max-w-none focus:outline-none min-h-[400px] p-4 [&_img.ProseMirror-selectednode]:outline [&_img.ProseMirror-selectednode]:outline-4 [&_img.ProseMirror-selectednode]:outline-blue-500 [&_img.ProseMirror-selectednode]:outline-offset-2',
      },
    },
  })

  // ✅ ฟังก์ชันเช็คว่า cursor อยู่บนบรรทัดว่างหรือไม่ + คำนวณตำแหน่ง
  const updateFloatingMenu = useCallback(() => {
    if (!editor || editor.isDestroyed) {
      setShowFloatingMenu(false)
      return
    }

    const { state, view } = editor
    const { selection } = state
    const { $anchor, empty } = selection

    // ต้องเป็น empty selection และอยู่ root depth (ไม่เอาเงื่อนไข block ต้องว่างออก เพื่อให้โชว์ทุกบรรทัด)
    const isRootDepth = $anchor.depth === 1

    // ✅ อนุญาตให้โชว์เมนูต่อถ้า focus อยู่ใน editor หรือในเมนู (เช่นคลิกช่อง URL)
    const isFocusInside = view.hasFocus() || editorContainerRef.current?.contains(document.activeElement)

    if (!isFocusInside || !empty || !isRootDepth) {
      setShowFloatingMenu(false)
      return
    }

    // คำนวณตำแหน่งของ cursor relative กับ editor container
    try {
      const coords = view.coordsAtPos(selection.from)
      const containerRect = editorContainerRef.current?.getBoundingClientRect()
      if (containerRect) {
        setMenuPosition({
          top: coords.top - containerRect.top,
          left: -40, // ✅ เลื่อนไปทางซ้ายสุด ให้อยู่นอก text area
        })
        setShowFloatingMenu(true)
      }
    } catch {
      setShowFloatingMenu(false)
    }
  }, [editor])

  // ✅ ลงทะเบียน listener สำหรับ update/selection/focus/blur
  useEffect(() => {
    if (!editor || editor.isDestroyed) return

    const handleUpdate = () => setTimeout(updateFloatingMenu, 0)
    const handleSelectionUpdate = () => setTimeout(updateFloatingMenu, 0)
    const handleFocus = () => setTimeout(updateFloatingMenu, 50)
    const handleBlur = () => {
      setTimeout(() => {
        // ✅ ไม่ปิดเมนูถ้า focus ย้ายมาอยู่ที่ input ภายใน editorContainer
        if (editorContainerRef.current?.contains(document.activeElement)) {
          return
        }
        setShowFloatingMenu(false)
        setIsMenuExpanded(false)
        setDropdownOpen(false)
      }, 200)
    }

    editor.on('update', handleUpdate)
    editor.on('selectionUpdate', handleSelectionUpdate)
    editor.on('focus', handleFocus)
    editor.on('blur', handleBlur)

    // เรียกครั้งแรก
    updateFloatingMenu()

    return () => {
      editor.off('update', handleUpdate)
      editor.off('selectionUpdate', handleSelectionUpdate)
      editor.off('focus', handleFocus)
      editor.off('blur', handleBlur)
    }
  }, [editor, updateFloatingMenu])

  // ✅ ฟังก์ชันช่วยเช็คประเภท Block ปัจจุบัน
  const getCurrentBlockLabel = () => {
    if (editor?.isActive('heading', { level: 1 })) return 'Heading'
    if (editor?.isActive('heading', { level: 2 })) return 'Subheading'
    return 'Paragraph'
  }

  // ✅ ฟังก์ชันเพิ่มรูปภาพจากไฟล์
  const handleImageUpload = useCallback(() => {
    fileInputRef.current?.click()
  }, [])

  const handleFileChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file || !editor) return

    // สร้าง URL ชั่วคราวจากไฟล์ (ใน production ควรอัพโหลดไป server)
    const url = URL.createObjectURL(file)
    editor.chain().focus().setImage({ src: url, alt: file.name }).run()

    // รีเซ็ต input เพื่อให้เลือกไฟล์เดิมซ้ำได้
    e.target.value = ''
    setIsMenuExpanded(false)
  }, [editor])

  // ✅ ฟังก์ชันเพิ่ม media จาก URL
  const handleAddMediaUrl = useCallback(() => {
    const trimmedUrl = mediaUrl.trim()
    if (!trimmedUrl || !editor) return

    // ตรวจสอบว่าเป็น URL ของ Youtube หรือไม่
    const youtubeRegex = /^(https?:\/\/)?(www\.)?(youtube\.com|youtu\.?be)\/.+$/

    if (youtubeRegex.test(trimmedUrl)) {
      editor.chain().focus().setYoutubeVideo({ src: trimmedUrl }).run()
    } else {
      // ถ้าไม่ใช่ Youtube อนุมานว่าเป็นรูปภาพ
      editor.chain().focus().setImage({ src: trimmedUrl }).run()
    }

    setMediaUrl('')
    setMediaUrlInputOpen(false)
    setIsMenuExpanded(false)
  }, [editor, mediaUrl])

  return (
    <div className="w-full max-w-4xl mx-auto p-4 md:p-6 space-y-6 font-sans">
      <h1 className="text-2xl md:text-3xl font-bold text-gray-900 mb-8">เรื่องราวของโปรเจกต์</h1>

      <div className="space-y-3">
        {/* ✅ Container หลักต้องเป็น overflow-visible เพื่อให้เมนูเด้งออกมาได้ */}
        <div
          ref={editorContainerRef}
          className="relative border border-gray-200 rounded-lg bg-white min-h-[450px] overflow-visible shadow-sm ml-12" // ✅ เพิ่ม margin left เพื่อเผื่อพื้นที่ให้ปุ่ม + ทางซ้าย
        >

          {/* ✅ Custom Floating Menu — แสดงเฉพาะบรรทัดว่างเท่านั้น */}
          {editor && showFloatingMenu && (
            <div
              className="absolute flex items-center space-x-2 z-50"
              style={{ top: menuPosition.top, left: menuPosition.left }} // ✅ ใช้ left ที่เซ็ตไว้เป็นติดลบ
            >
              {/* 1. ปุ่มบวก */}
              <button
                onMouseDown={(e) => {
                  e.preventDefault()
                  e.stopPropagation()
                  setIsMenuExpanded(!isMenuExpanded)
                  if (!isMenuExpanded) { // ✅ ถ้ายำลังจะเปิดเมนู ให้รีเซ็ต state อื่นๆ
                    setDropdownOpen(false)
                    setMediaUrlInputOpen(false)
                    setMediaUrl('')
                  }
                }}
                className={`flex items-center justify-center w-8 h-8 rounded-full transition-all border border-gray-200 shadow-sm ${isMenuExpanded
                  ? 'bg-gray-100 text-gray-500' // ✅ สีเทาเมื่อเปิดเมนูแบบในรูป
                  : 'bg-[#e6fff5] text-[#00b374] hover:bg-[#cdffec] border-transparent'
                  }`}
              >
                {isMenuExpanded ? <X size={18} strokeWidth={2.5} /> : <Plus size={20} />}
              </button>

              {/* 2. เมนูเครื่องมือ */}
              {isMenuExpanded && (
                <div className="absolute top-full left-0 mt-2 flex items-center bg-white shadow-xl border border-gray-200 rounded-lg overflow-visible animate-in fade-in slide-in-from-top-2 duration-200">

                  {/* Dropdown Paragraph/Heading */}
                  <div className="relative flex border-r border-gray-100">
                    <button
                      onMouseDown={(e) => { e.preventDefault(); e.stopPropagation(); setDropdownOpen(!dropdownOpen); }}
                      className="flex items-center space-x-2 px-3 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50 min-w-[120px]"
                    >
                      <List size={16} className="text-gray-400" />
                      <span>{getCurrentBlockLabel()}</span>
                      <ChevronDown size={14} className="ml-auto text-gray-400" />
                    </button>

                    {dropdownOpen && (
                      <div className="absolute top-full left-0 mt-1 w-44 bg-white shadow-2xl border border-gray-200 rounded-lg z-100 overflow-hidden">
                        <button
                          onMouseDown={(e) => { e.preventDefault(); e.stopPropagation(); editor.chain().focus().setParagraph().run(); setDropdownOpen(false); setIsMenuExpanded(false); }}
                          className="flex items-center w-full px-4 py-2.5 text-sm text-gray-700 hover:bg-gray-50 border-b border-gray-50"
                        >
                          Paragraph
                        </button>
                        <button
                          onMouseDown={(e) => { e.preventDefault(); e.stopPropagation(); editor.chain().focus().toggleHeading({ level: 1 }).run(); setDropdownOpen(false); setIsMenuExpanded(false); }}
                          className="flex items-center w-full px-4 py-2.5 text-sm font-bold text-gray-900 hover:bg-gray-50 border-b border-gray-50"
                        >
                          Heading
                        </button>
                        <button
                          onMouseDown={(e) => { e.preventDefault(); e.stopPropagation(); editor.chain().focus().toggleHeading({ level: 2 }).run(); setDropdownOpen(false); setIsMenuExpanded(false); }}
                          className="flex items-center w-full px-4 py-2.5 text-sm font-semibold text-gray-800 hover:bg-gray-50"
                        >
                          Subheading
                        </button>
                      </div>
                    )}
                  </div>

                  {/* Media & List Buttons */}
                  <div className="flex items-center">
                    <button
                      onMouseDown={(e) => { e.preventDefault(); e.stopPropagation(); handleImageUpload(); }}
                      className="p-2.5 text-gray-500 hover:bg-gray-50 hover:text-gray-900 border-r border-gray-100 transition-colors"
                    >
                      <ImageIcon size={18} />
                    </button>
                    <button
                      onMouseDown={(e) => { e.preventDefault(); e.stopPropagation(); setMediaUrlInputOpen(true); }}
                      className="p-2.5 text-gray-500 hover:bg-gray-50 hover:text-gray-900 border-r border-gray-100 transition-colors"
                    >
                      <SquarePlay size={18} />
                    </button>
                    <button
                      onMouseDown={(e) => { e.preventDefault(); e.stopPropagation(); editor.chain().focus().toggleBulletList().run(); setIsMenuExpanded(false); }}
                      className={`p-2.5 hover:bg-gray-50 transition-colors ${editor.isActive('bulletList') ? 'text-blue-600' : 'text-gray-500'}`}
                    >
                      <List size={18} />
                    </button>
                  </div>

                  {/* Input สำหรับ Media URL */}
                  {mediaUrlInputOpen && (
                    <div className="absolute inset-0 bg-white flex items-center px-2 z-110 rounded-lg">
                      <div className="flex items-center w-full bg-gray-50 rounded-md px-3 py-1 border border-gray-200">
                        <span className="text-xs font-semibold text-gray-400 mr-2 uppercase">Media URL</span>
                        <input
                          autoFocus
                          className="grow bg-transparent border-none outline-none text-sm text-gray-700 h-8"
                          placeholder="Paste the media URL in the input."
                          value={mediaUrl}
                          onChange={(e) => setMediaUrl(e.target.value)}
                          onKeyDown={(e) => {
                            if (e.key === 'Enter') {
                              e.preventDefault()
                              e.stopPropagation()
                              handleAddMediaUrl()
                            }
                          }}
                          // ✅ stop propagation ทั้ง click และ mousedown เพื่อไม่ให้ editor ถือว่าโดน blur หรือ event ตีกัน
                          onClick={(e) => e.stopPropagation()}
                          onMouseDown={(e) => e.stopPropagation()}
                        />
                        <button onMouseDown={(e) => { e.preventDefault(); e.stopPropagation(); handleAddMediaUrl(); }} className="p-1 text-gray-400 hover:text-green-600"><Check size={18} /></button>
                        <button onMouseDown={(e) => { e.preventDefault(); e.stopPropagation(); setMediaUrlInputOpen(false); }} className="p-1 text-gray-400 hover:text-red-500"><X size={18} /></button>
                      </div>
                    </div>
                  )}
                </div>
              )}
            </div>
          )}

          {/* ✅ Hidden file input สำหรับ upload รูปภาพ */}
          <input
            ref={fileInputRef}
            type="file"
            accept="image/*"
            className="hidden"
            onChange={handleFileChange}
          />

          {/* ✅ BubbleMenu จะปรากฏเมื่อคลิกที่รูปภาพเท่านั้น */}
          {editor && (
            <BubbleMenu
              pluginKey="imageBubbleMenu"
              editor={editor}
              shouldShow={(props: any) => {
                const { state, editor } = props;
                const isImage = state.selection.node?.type.name === 'image' || editor.isActive('image')
                return isImage
              }}
            >
              <div className="flex items-center bg-white shadow-xl border border-gray-200 rounded-lg overflow-hidden animate-in fade-in slide-in-from-bottom-2 duration-200 px-1 py-1 space-x-1 z-50">
                {!imageLinkInputOpen ? (
                  // แถบไอคอนปกติ
                  <div className="flex items-center">
                    <button
                      onMouseDown={(e) => {
                        e.preventDefault()
                        e.stopPropagation()
                        const attrs = editor.getAttributes('image')
                        setImageLinkUrl(attrs.href || '')
                        setImageLinkInputOpen(true)
                      }}
                      className={`p-1.5 rounded-md hover:bg-gray-100 transition-colors ${editor.getAttributes('image').href ? 'text-blue-600 bg-blue-50' : 'text-gray-600'}`}
                      title="Add or edit link"
                    >
                      <LinkIcon size={18} />
                    </button>

                    {editor.getAttributes('image').href && (
                      <button
                        onMouseDown={(e) => {
                          e.preventDefault()
                          e.stopPropagation()
                          editor.chain().focus().updateAttributes('image', { href: null }).run()
                        }}
                        className="p-1.5 rounded-md hover:bg-red-50 text-red-500 transition-colors"
                        title="Remove link"
                      >
                        <Unlink size={18} />
                      </button>
                    )}

                    <div className="w-px h-5 bg-gray-200 mx-1"></div>

                    <button
                      onMouseDown={(e) => {
                        e.preventDefault()
                        e.stopPropagation()
                        editor.chain().focus().updateAttributes('image', { align: 'center' }).run()
                      }}
                      className={`p-1.5 rounded-md hover:bg-gray-100 transition-colors ${editor.getAttributes('image').align === 'center' || !editor.getAttributes('image').align ? 'bg-gray-100 text-gray-900' : 'text-gray-500'}`}
                      title="Center & Full Width"
                    >
                      <Maximize size={18} />
                    </button>
                    <button
                      onMouseDown={(e) => {
                        e.preventDefault()
                        e.stopPropagation()
                        editor.chain().focus().updateAttributes('image', { align: 'left' }).run()
                      }}
                      className={`p-1.5 rounded-md hover:bg-gray-100 transition-colors ${editor.getAttributes('image').align === 'left' ? 'bg-gray-100 text-gray-900' : 'text-gray-500'}`}
                      title="Align Left"
                    >
                      <AlignLeft size={18} />
                    </button>
                    <button
                      onMouseDown={(e) => {
                        e.preventDefault()
                        e.stopPropagation()
                        editor.chain().focus().updateAttributes('image', { align: 'right' }).run()
                      }}
                      className={`p-1.5 rounded-md hover:bg-gray-100 transition-colors ${editor.getAttributes('image').align === 'right' ? 'bg-gray-100 text-gray-900' : 'text-gray-500'}`}
                      title="Align Right"
                    >
                      <AlignRight size={18} />
                    </button>
                  </div>
                ) : (
                  // ช่องกรอก URL สำหรับรูปภาพ
                  <div className="flex items-center bg-white px-2 py-1">
                    <LinkIcon size={14} className="text-gray-400 mr-2" />
                    <input
                      autoFocus
                      className="w-48 bg-transparent border-none outline-none text-sm text-gray-700 h-8"
                      placeholder="Paste link here..."
                      value={imageLinkUrl}
                      onChange={(e) => setImageLinkUrl(e.target.value)}
                      onKeyDown={(e) => {
                        if (e.key === 'Enter') {
                          e.preventDefault()
                          editor.chain().focus().updateAttributes('image', { href: imageLinkUrl }).run()
                          setImageLinkInputOpen(false)
                        }
                      }}
                    />
                    <button
                      onMouseDown={(e) => {
                        e.preventDefault()
                        editor.chain().focus().updateAttributes('image', { href: imageLinkUrl }).run()
                        setImageLinkInputOpen(false)
                      }}
                      className="p-1 px-2 text-green-600 hover:bg-green-50 rounded"
                    >
                      <Check size={16} />
                    </button>
                    <button
                      onMouseDown={(e) => {
                        e.preventDefault()
                        setImageLinkInputOpen(false)
                      }}
                      className="p-1 px-2 text-red-500 hover:bg-red-50 rounded"
                    >
                      <X size={16} />
                    </button>
                  </div>
                )}
              </div>
            </BubbleMenu>
          )}
          <div
            onClickCapture={(e) => {
              // ✅ ดัก Event เพื่อป้องกันไม่ให้คลิกลิงก์แล้วหน้าเปลี่ยนขณะกำลังแก้ไข
              if ((e.target as Element).closest('a')) {
                e.preventDefault()
              }
            }}
          >
            <EditorContent editor={editor} />
          </div>

        </div>
      </div>
    </div>
  )
}

export default Step2Story