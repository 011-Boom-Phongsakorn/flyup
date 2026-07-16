import { useNavigate } from 'react-router'
import { ArrowLeft, BookOpen } from 'lucide-react'

// รายการหัวข้อของสารบัญ (sidebar TOC) — id ต้องตรงกับ id ของแต่ละ <section> ด้านล่างเพื่อให้ scrollTo ทำงานได้
const SECTIONS = [
  { id: 'intro',      label: 'เริ่มต้นสร้างโปรเจกต์' },
  { id: 'basics',     label: '1. ข้อมูลพื้นฐาน' },
  { id: 'story',      label: '2. เรื่องราว' },
  { id: 'milestones', label: '3. Milestones' },
  { id: 'terms',      label: '4. ข้อตกลงและเงื่อนไข' },
  { id: 'after',      label: 'หลังส่งคำขอ' },
  { id: 'tips',       label: 'เคล็ดลับจากผู้สำเร็จ' },
]

// เลื่อนหน้าไปยัง section ที่ระบุแบบ smooth scroll (ใช้เมื่อคลิกหัวข้อในสารบัญ)
const scrollTo = (id: string) => {
  document.getElementById(id)?.scrollIntoView({ behavior: 'smooth', block: 'start' })
}

// ด้านล่างเป็น presentational components ล้วนๆ (ไม่มี state/logic) สำหรับจัดรูปแบบเนื้อหาคู่มือให้เขียนซ้ำน้อยลง:
// H2/H3/P = หัวข้อ/พารากราฟมาตรฐาน, Callout = คำคมแบบมีเส้นคั่นซ้าย, TipBox/WarnBox = กล่องเคล็ดลับ/คำเตือนสีเขียว/เหลือง,
// Checklist = รายการลิสต์มีเลขวงกลม, Divider = เส้นคั่นระหว่าง section

const H2 = ({ id, children }: { id: string; children: React.ReactNode }) => (
  <h2 id={id} className="text-[26px] font-black text-foreground leading-tight scroll-mt-24">{children}</h2>
)

const H3 = ({ children }: { children: React.ReactNode }) => (
  <h3 className="text-[17px] font-bold text-foreground mt-6 mb-2">{children}</h3>
)

const P = ({ children }: { children: React.ReactNode }) => (
  <p className="text-[15px] text-foreground/80 leading-[1.8]">{children}</p>
)

const Callout = ({ children }: { children: React.ReactNode }) => (
  <div className="border-l-4 border-primary pl-5 py-1 my-4">
    <p className="text-[15px] text-foreground/70 leading-[1.8] italic">{children}</p>
  </div>
)

const TipBox = ({ children }: { children: React.ReactNode }) => (
  <div className="bg-green-50 border border-green-200 rounded-xl px-5 py-4 my-4">
    <p className="text-[13px] font-semibold text-green-800 mb-1">💡 เคล็ดลับ</p>
    <p className="text-[14px] text-green-900 leading-relaxed">{children}</p>
  </div>
)

const WarnBox = ({ children }: { children: React.ReactNode }) => (
  <div className="bg-amber-50 border border-amber-200 rounded-xl px-5 py-4 my-4">
    <p className="text-[13px] font-semibold text-amber-800 mb-1">⚠️ สิ่งที่ควรระวัง</p>
    <p className="text-[14px] text-amber-900 leading-relaxed">{children}</p>
  </div>
)

const Checklist = ({ items }: { items: string[] }) => (
  <ul className="flex flex-col gap-2.5 my-3">
    {items.map((item, i) => (
      <li key={i} className="flex items-start gap-3">
        <span className="w-5 h-5 rounded-full bg-primary/10 text-primary text-[11px] font-bold flex items-center justify-center shrink-0 mt-0.5">{i + 1}</span>
        <span className="text-[14px] text-foreground/80 leading-relaxed" dangerouslySetInnerHTML={{ __html: item }} />
      </li>
    ))}
  </ul>
)

const Divider = () => <hr className="border-border my-10" />

const ProjectGuide = () => {
  const navigate = useNavigate()

  return (
    <div className="min-h-screen bg-white mt-25">

      {/* Top nav */}
      <div className="sticky top-0 z-20 bg-white border-b border-border">
        <div className="max-w-6xl mx-auto px-6 h-14 flex items-center gap-4">
          <button
            onClick={() => navigate(-1)}
            className="flex items-center gap-1.5 text-[13px] text-muted-foreground hover:text-foreground transition-colors cursor-pointer"
          >
            <ArrowLeft size={15} />
            กลับ
          </button>
          <div className="h-4 w-px bg-border" />
          <div className="flex items-center gap-2 text-[13px] font-medium text-foreground">
            <BookOpen size={15} className="text-primary" />
            คู่มือการสร้างโปรเจกต์
          </div>
        </div>
      </div>

      {/* Hero */}
      <div className="bg-[#F0EDFF] border-b border-border">
        <div className="max-w-6xl mx-auto px-6 py-16">
          <p className="text-[13px] font-semibold text-primary uppercase tracking-widest mb-3">FlyUp Creator Handbook</p>
          <h1 className="text-[40px] md:text-[52px] font-black text-foreground leading-[1.1] mb-4">
            คู่มือสำหรับ<br />Pioneer
          </h1>
          <p className="text-[16px] text-foreground/60 max-w-xl leading-relaxed">
            ทุกสิ่งที่คุณต้องรู้ในการสร้างโปรเจกต์บน FlyUp ตั้งแต่ไอเดียแรกจนถึงการได้รับทุน
          </p>
        </div>
      </div>

      {/* Body: sidebar + content */}
      <div className="max-w-6xl mx-auto px-6 py-12 flex gap-12">

        {/* Sidebar TOC */}
        <aside className="hidden lg:block w-56 shrink-0">
          <div className="sticky top-20 flex flex-col gap-1">
            <p className="text-[11px] font-bold text-muted-foreground uppercase tracking-widest mb-3">เนื้อหา</p>
            {SECTIONS.map(s => (
              <button
                key={s.id}
                onClick={() => scrollTo(s.id)}
                className="text-left text-[13px] text-muted-foreground hover:text-primary transition-colors py-1 cursor-pointer"
              >
                {s.label}
              </button>
            ))}
            <div className="mt-6 pt-6 border-t border-border">
              <button
                onClick={() => navigate(-1)}
                className="flex items-center gap-1.5 text-[13px] font-semibold text-primary hover:opacity-75 transition-opacity cursor-pointer"
              >
                <ArrowLeft size={13} />
                เริ่มสร้างเลย
              </button>
            </div>
          </div>
        </aside>

        {/* Main content */}
        <main className="flex-1 min-w-0 max-w-2xl flex flex-col gap-0">

          {/* Intro */}
          <section id="intro" className="scroll-mt-24">
            <H2 id="intro">เริ่มต้นสร้างโปรเจกต์</H2>
            <div className="mt-4 flex flex-col gap-4">
              <P>
                FlyUp คือแพลตฟอร์ม Crowdfunding สำหรับนักศึกษาที่ต้องการระดมทุนพัฒนาโปรเจกต์ซอฟต์แวร์
                นักลงทุนจะได้รับส่วนแบ่งกำไรจากรายได้ของโปรเจกต์ และเงินจะถูกปล่อยเป็นงวดตาม Milestone
                ที่ผ่านการตรวจสอบ
              </P>
              <Callout>
                "โปรเจกต์ที่ดีไม่ใช่แค่ไอเดียที่ดี แต่คือแผนที่ชัดเจนพอให้คนอื่นเชื่อและลงทุนด้วยได้"
              </Callout>
              <P>
                กระบวนการสร้างโปรเจกต์มี 4 ขั้นตอนหลัก ซึ่งต้องกรอกให้ครบทุกขั้นตอนก่อนส่งให้ Admin ตรวจสอบ
              </P>
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mt-2">
                {[
                  { n: '1', title: 'ข้อมูลพื้นฐาน', sub: 'ชื่อ รูป เป้าหมาย' },
                  { n: '2', title: 'เรื่องราว', sub: 'อธิบายโปรเจกต์' },
                  { n: '3', title: 'Milestones', sub: '4 Phase แผนงาน' },
                  { n: '4', title: 'ข้อตกลง', sub: 'ยืนยันเงื่อนไข' },
                ].map(card => (
                  <div key={card.n} className="border border-border rounded-xl p-3 flex flex-col gap-1">
                    <span className="text-[11px] font-bold text-primary">Step {card.n}</span>
                    <span className="text-[13px] font-semibold text-foreground">{card.title}</span>
                    <span className="text-[12px] text-muted-foreground">{card.sub}</span>
                  </div>
                ))}
              </div>
            </div>
          </section>

          <Divider />

          {/* Step 1 */}
          <section id="basics" className="scroll-mt-24 flex flex-col gap-4">
            <div className="flex items-center gap-3">
              <span className="text-[12px] font-bold text-primary bg-primary/10 px-3 py-1 rounded-full">Step 1</span>
              <H2 id="basics">ข้อมูลพื้นฐาน</H2>
            </div>
            <P>ข้อมูลพื้นฐานคือสิ่งแรกที่นักลงทุนเห็น ต้องน่าสนใจ ชัดเจน และสะท้อนตัวตนของโปรเจกต์ได้ตั้งแต่นาทีแรก</P>

            <H3>ชื่อโปรเจกต์</H3>
            <P>ควรกระชับ จำง่าย และสื่อถึงสิ่งที่โปรเจกต์ทำได้ทันที แนะนำไม่เกิน 60 ตัวอักษร หลีกเลี่ยงชื่อที่คลุมเครือหรือยาวเกินไป</P>
            <TipBox>ลองถามตัวเองว่า "ถ้าบอกชื่อโปรเจกต์นี้กับเพื่อนใน 5 วินาที เขาจะเข้าใจว่ามันทำอะไรไหม?" ถ้ายัง แสดงว่าชื่อยังไม่ดีพอ</TipBox>

            <H3>รูปภาพปก / วิดีโอ</H3>
            <P>รูปหรือวิดีโอคือส่วนที่ดึงดูดสายตามากที่สุด โปรเจกต์ที่มีรูปภาพคุณภาพสูงได้รับความสนใจมากกว่าอย่างมีนัยสำคัญ</P>
            <Checklist items={[
              'ขนาดรูปแนะนำ <strong>1280 × 720px</strong> ขึ้นไป (อัตราส่วน 16:9)',
              'ใช้รูปที่แสดงให้เห็นตัวโปรดักต์หรือทีมจริงๆ ไม่ใช่ stock photo',
              'วิดีโอความยาว <strong>1-3 นาที</strong> ที่บอกเล่าเรื่องราวได้ครบ',
            ]} />

            <H3>เป้าหมายเงินทุนและระยะเวลา</H3>
            <P>ตัวเลขเหล่านี้ต้องมาจากการคำนวณจริง ไม่ใช่การเดา นักลงทุนจะมองดูความสมเหตุสมผลของตัวเลขเหล่านี้เสมอ</P>
            <Checklist items={[
              '<strong>เป้าหมายเงินทุน</strong> — รวมค่าใช้จ่ายทุกอย่างจริงๆ (ค่าพัฒนา ค่า server ค่าทีม)',
              '<strong>ระยะเวลาโปรเจกต์</strong> — ระบุเป็นเดือน ต้องครอบคลุมทุก Milestone',
              '<strong>ระยะเวลาระดมทุน</strong> — แนะนำ 30-60 วัน',
              '<strong>ส่วนแบ่งกำไร</strong> — ยิ่งให้มาก ยิ่งดึงดูดนักลงทุน แต่ต้องสมเหตุสมผล',
            ]} />
            <WarnBox>ถ้าตั้งเป้าหมายเงินทุนสูงเกินไปโดยไม่มีเหตุผลรองรับ Admin จะปฏิเสธโปรเจกต์</WarnBox>
          </section>

          <Divider />

          {/* Step 2 */}
          <section id="story" className="scroll-mt-24 flex flex-col gap-4">
            <div className="flex items-center gap-3">
              <span className="text-[12px] font-bold text-primary bg-primary/10 px-3 py-1 rounded-full">Step 2</span>
              <H2 id="story">เรื่องราว</H2>
            </div>
            <P>นี่คือโอกาสของคุณในการเล่าว่าทำไมโปรเจกต์นี้ถึงสำคัญ และทำไมคุณถึงเป็นคนที่เหมาะสมที่สุดในการทำให้มันสำเร็จ</P>
            <Callout>
              "นักลงทุนไม่ได้ลงทุนในไอเดีย — พวกเขาลงทุนในคนและแผนการที่น่าเชื่อถือ"
            </Callout>

            <H3>โครงสร้างเรื่องราวที่ดี</H3>
            <Checklist items={[
              '<strong>ปัญหา</strong> — ปัญหาอะไรที่คุณกำลังแก้? มันส่งผลกระทบกับใครอย่างไร?',
              '<strong>วิธีแก้</strong> — โปรเจกต์ของคุณแก้ปัญหานั้นอย่างไร? แตกต่างจากที่มีอยู่อย่างไร?',
              '<strong>กลุ่มเป้าหมาย</strong> — ใครคือผู้ใช้ของคุณ? มีตลาดใหญ่แค่ไหน?',
              '<strong>แผนรายได้</strong> — จะสร้างรายได้อย่างไร? (subscription, ขายสิทธิ์, โฆษณา ฯลฯ)',
              '<strong>ทีม</strong> — แต่ละคนมีความเชี่ยวชาญอะไร? ทำไมถึงทำสำเร็จได้?',
              '<strong>ความเสี่ยง</strong> — ระบุความเสี่ยงที่อาจเกิดขึ้นและวิธีที่คุณจะรับมือ',
            ]} />

            <H3>ความเสี่ยงและความท้าทาย</H3>
            <P>หลายคนกลัวที่จะพูดถึงความเสี่ยง แต่การพูดตรงๆ กลับสร้างความน่าเชื่อถือมากกว่า นักลงทุนรู้อยู่แล้วว่าทุกโปรเจกต์มีความเสี่ยง สิ่งสำคัญคือคุณรู้และมีแผนรับมือ</P>
            <TipBox>เขียนให้คนที่ไม่รู้เรื่องเทคโนโลยีอ่านแล้วเข้าใจได้ หลีกเลี่ยงศัพท์เทคนิคที่ไม่จำเป็น ถ้าต้องใช้ก็อธิบายด้วย</TipBox>
          </section>

          <Divider />

          {/* Step 3 */}
          <section id="milestones" className="scroll-mt-24 flex flex-col gap-4">
            <div className="flex items-center gap-3">
              <span className="text-[12px] font-bold text-primary bg-primary/10 px-3 py-1 rounded-full">Step 3</span>
              <H2 id="milestones">Milestones</H2>
            </div>
            <P>
              Milestone คือแผนการทำงานที่แบ่งออกเป็น 4 Phase ระบบ Escrow จะปล่อยเงินให้ทีละ Phase
              เมื่อผู้สนับสนุนโหวตยืนยันว่าคุณทำตามเกณฑ์ครบแล้ว
            </P>

            <H3>สัดส่วนเงินของแต่ละ Phase</H3>
            <div className="flex flex-col gap-2 my-2">
              {[
                { phase: 'Phase 1', pct: 15, desc: 'เตรียมทีม ทรัพยากร และ setup โครงสร้างพื้นฐาน' },
                { phase: 'Phase 2', pct: 20, desc: 'พัฒนาและทดสอบ prototype เบื้องต้น' },
                { phase: 'Phase 3', pct: 30, desc: 'พัฒนาฟีเจอร์หลักและ launch' },
                { phase: 'Phase 4', pct: 35, desc: 'ปรับปรุง ทดสอบครบถ้วน และส่งมอบ' },
              ].map(row => (
                <div key={row.phase} className="flex items-center gap-4 py-3 border-b border-border last:border-0">
                  <span className="text-[13px] font-bold text-foreground w-20 shrink-0">{row.phase}</span>
                  <div className="flex-1 h-2 bg-muted rounded-full overflow-hidden">
                    <div className="h-full bg-primary rounded-full" style={{ width: `${row.pct * 2}%` }} />
                  </div>
                  <span className="text-[14px] font-black text-primary w-10 shrink-0 text-right">{row.pct}%</span>
                  <span className="text-[13px] text-muted-foreground hidden sm:block">{row.desc}</span>
                </div>
              ))}
            </div>

            <H3>สิ่งที่ต้องกรอกในแต่ละ Phase</H3>
            <Checklist items={[
              '<strong>ชื่อ Milestone</strong> — บอกชัดว่า Phase นี้จะทำอะไรให้สำเร็จ เช่น "พัฒนา MVP และทดสอบกับผู้ใช้จริง"',
              '<strong>คำอธิบาย</strong> — อธิบายรายละเอียดว่าจะดำเนินการอย่างไร ใช้เทคโนโลยีอะไร',
              '<strong>ระยะเวลา (วัน)</strong> — จำนวนวันจริงๆ ที่ต้องใช้ รวมทุก Phase ต้องไม่เกินระยะเวลาโปรเจกต์',
              '<strong>เกณฑ์การยอมรับ</strong> — ระบุ 1-10 ข้อที่วัดได้จริง เป็นเกณฑ์ที่ผู้สนับสนุนจะโหวตยืนยัน',
              '<strong>ไฟล์ประกอบ (ถ้ามี)</strong> — wireframe, แผนผัง, เอกสาร spec ยิ่งมียิ่งน่าเชื่อถือ',
            ]} />

            <H3>เกณฑ์การยอมรับที่ดี</H3>
            <P>เกณฑ์ต้องวัดได้จริงและตรวจสอบได้ ไม่คลุมเครือ</P>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 my-2">
              <div className="border border-red-200 rounded-xl p-4 bg-red-50">
                <p className="text-[12px] font-bold text-red-600 mb-2">❌ ไม่ดี</p>
                <ul className="flex flex-col gap-1 text-[13px] text-red-800">
                  <li>• "พัฒนาระบบให้ดี"</li>
                  <li>• "ทำให้แอปเร็วขึ้น"</li>
                  <li>• "ปรับปรุง UI"</li>
                </ul>
              </div>
              <div className="border border-green-200 rounded-xl p-4 bg-green-50">
                <p className="text-[12px] font-bold text-green-600 mb-2">✅ ดี</p>
                <ul className="flex flex-col gap-1 text-[13px] text-green-800">
                  <li>• "จดทะเบียนบริษัทเสร็จสิ้น"</li>
                  <li>• "มีผู้ทดสอบ beta ≥ 50 คน"</li>
                  <li>• "ส่ง prototype ที่ login ได้"</li>
                </ul>
              </div>
            </div>
            <WarnBox>รวมวันทุก Phase ต้องไม่เกินระยะเวลาโปรเจกต์ (เดือน × 30 วัน) ที่กำหนดใน Step 1</WarnBox>
          </section>

          <Divider />

          {/* Step 4 */}
          <section id="terms" className="scroll-mt-24 flex flex-col gap-4">
            <div className="flex items-center gap-3">
              <span className="text-[12px] font-bold text-primary bg-primary/10 px-3 py-1 rounded-full">Step 4</span>
              <H2 id="terms">ข้อตกลงและเงื่อนไข</H2>
            </div>
            <P>ขั้นตอนสุดท้ายก่อนส่งโปรเจกต์ คุณต้องอ่านและยืนยันว่ายอมรับข้อตกลงของ FlyUp ทั้งหมด</P>
            <Checklist items={[
              'ยอมรับ <strong>Terms of Service</strong> — ข้อกำหนดในการใช้แพลตฟอร์ม',
              'ยอมรับ <strong>Privacy Policy</strong> — นโยบายการเก็บข้อมูลส่วนตัว',
              'รับผิดชอบในการดำเนินโปรเจกต์ตาม Milestone ที่กำหนด',
              'ยืนยันว่าข้อมูลทั้งหมดเป็นความจริง ไม่มีการปลอมแปลง',
            ]} />
            <WarnBox>หากโปรเจกต์ไม่สามารถดำเนินการตาม Milestone ได้ เงินที่เหลืออยู่จะถูกคืนให้นักลงทุนตามสัดส่วน</WarnBox>
          </section>

          <Divider />

          {/* After submit */}
          <section id="after" className="scroll-mt-24 flex flex-col gap-4">
            <H2 id="after">หลังส่งคำขอ</H2>
            <P>หลังจากกด "ส่งคำขอสร้างโปรเจกต์" โปรเจกต์จะเข้าสู่กระบวนการตรวจสอบ</P>
            <div className="flex flex-col gap-0 my-2">
              {[
                { step: '01', title: 'Admin ตรวจสอบ', body: 'ใช้เวลา 1-3 วันทำการ Admin จะตรวจสอบความถูกต้อง ครบถ้วน และความสมเหตุสมผลของข้อมูล' },
                { step: '02', title: 'อนุมัติหรือปฏิเสธ', body: 'คุณจะได้รับการแจ้งเตือนทันที ถ้าถูกปฏิเสธจะมีเหตุผลให้แก้ไขและส่งใหม่ได้' },
                { step: '03', title: 'เปิดระดมทุน', body: 'โปรเจกต์จะถูกเผยแพร่บนแพลตฟอร์ม นักลงทุนสามารถเข้ามาดูและลงทุนได้' },
                { step: '04', title: 'เริ่มดำเนินการ', body: 'เมื่อระดมทุนครบตามเป้าหมาย โปรเจกต์เข้าสู่ระยะดำเนินการ เงิน Phase 1 จะถูกปล่อยทันที' },
              ].map((row, i, arr) => (
                <div key={row.step} className="flex gap-4">
                  <div className="flex flex-col items-center">
                    <div className="w-10 h-10 rounded-full bg-primary text-white text-[13px] font-black flex items-center justify-center shrink-0">{row.step}</div>
                    {i < arr.length - 1 && <div className="w-px flex-1 bg-border my-1" />}
                  </div>
                  <div className="pb-8">
                    <p className="text-[15px] font-bold text-foreground mb-1">{row.title}</p>
                    <p className="text-[14px] text-muted-foreground leading-relaxed">{row.body}</p>
                  </div>
                </div>
              ))}
            </div>
          </section>

          <Divider />

          {/* Tips */}
          <section id="tips" className="scroll-mt-24 flex flex-col gap-4">
            <H2 id="tips">เคล็ดลับจากผู้สำเร็จ</H2>
            <P>รวบรวมจากโปรเจกต์ที่ได้รับการอนุมัติและระดมทุนสำเร็จบน FlyUp</P>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 my-2">
              {[
                { emoji: '📸', title: 'ลงทุนกับรูปและวิดีโอ', body: 'โปรเจกต์ที่มีรูปคมชัดและวิดีโออธิบายระดมทุนได้เร็วกว่าเฉลี่ย 3 เท่า' },
                { emoji: '🎯', title: 'เป้าหมายที่สมเหตุสมผล', body: 'เริ่มจากเป้าหมายที่ achieve ได้จริงก่อน อย่า overestimate ค่าใช้จ่าย' },
                { emoji: '📋', title: 'Milestone ที่ชัดเจน', body: 'Milestone ที่มีเกณฑ์วัดได้ชัดทำให้นักลงทุนมั่นใจและโหวตผ่านง่ายขึ้น' },
                { emoji: '✍️', title: 'เรื่องราวที่จริงใจ', body: 'พูดถึงความท้าทายและวิธีรับมือตรงๆ น่าเชื่อถือกว่าการทำให้ดูสมบูรณ์แบบ' },
                { emoji: '⏰', title: 'ระยะเวลาที่ realistic', body: 'ให้เวลา buffer สำหรับแต่ละ Phase เผื่อปัญหาที่ไม่คาดคิด' },
                { emoji: '🤝', title: 'ทีมที่แน่นแฟ้น', body: 'บอกให้ชัดว่าแต่ละคนในทีมรับผิดชอบอะไร ทักษะอะไรที่มี' },
              ].map(card => (
                <div key={card.title} className="border border-border rounded-xl p-4 flex flex-col gap-2 hover:border-primary/30 hover:bg-primary/5 transition-colors">
                  <span className="text-2xl">{card.emoji}</span>
                  <p className="text-[14px] font-bold text-foreground">{card.title}</p>
                  <p className="text-[13px] text-muted-foreground leading-relaxed">{card.body}</p>
                </div>
              ))}
            </div>
          </section>

          <Divider />

          {/* CTA */}
          <div className="bg-[#F0EDFF] rounded-2xl p-8 flex flex-col items-center text-center gap-4">
            <p className="text-[22px] font-black text-foreground">พร้อมสร้างโปรเจกต์แล้วหรือยัง?</p>
            <p className="text-[14px] text-foreground/60 max-w-sm">กลับไปกรอกข้อมูลทีละ Step ตามคู่มือนี้ แล้วส่งโปรเจกต์เพื่อรับทุน</p>
            <button
              onClick={() => navigate(-1)}
              className="px-8 py-3 bg-primary text-white rounded-xl font-bold text-[14px] hover:bg-primary/90 transition-colors cursor-pointer"
            >
              เริ่มสร้างโปรเจกต์
            </button>
          </div>

        </main>
      </div>
    </div>
  )
}

export default ProjectGuide
