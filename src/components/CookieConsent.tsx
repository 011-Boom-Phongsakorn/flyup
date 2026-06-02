import { useState } from 'react';
import { Cookie, ChevronDown, ChevronUp, ShieldCheck, BarChart2, Megaphone } from 'lucide-react';
import { Link } from 'react-router';
import { useCookieConsent } from '../hooks/useCookieConsent';

// ─── Component ────────────────────────────────────────────────────────────────

const CookieConsent = () => {
  const { isPending, accept, decline } = useCookieConsent();
  const [showDetails, setShowDetails] = useState(false);

  if (!isPending) return null;

  return (
    <>
      {/* Backdrop overlay (mobile) */}
      <div className="fixed inset-0 bg-black/20 backdrop-blur-[2px] z-[998] md:hidden" />

      {/* Banner */}
      <div
        role="dialog"
        aria-modal="false"
        aria-label="การตั้งค่า Cookie"
        className="fixed bottom-0 left-0 right-0 z-[999] md:bottom-6 animate-in slide-in-from-bottom-4 duration-500"
      >
        {/* Card */}
        <div className="bg-card border-t border-border shadow-2xl rounded-t-3xl md:rounded-3xl md:max-w-lg md:mx-auto overflow-hidden">

          {/* Top accent bar */}
          <div className="h-1 bg-gradient-to-r from-primary via-purple-400 to-pink-400" />

          <div className="px-5 pt-5 pb-4 space-y-4">

            {/* Header */}
            <div className="flex items-start gap-3">
              <div className="bg-primary/10 rounded-xl p-2 flex-shrink-0 mt-0.5">
                <Cookie size={20} className="text-primary" />
              </div>
              <div className="flex-1">
                <h3 className="font-bold text-foreground text-[15px] leading-snug">
                  เราใช้ Cookie เพื่อปรับปรุงประสบการณ์ของคุณ
                </h3>
                <p className="text-muted-foreground text-[12px] mt-1 leading-relaxed">
                  FlyUp ใช้ Cookie ที่จำเป็นสำหรับการทำงานของระบบ และ Cookie เพิ่มเติมเพื่อวิเคราะห์การใช้งาน
                  คุณสามารถเลือกยอมรับหรือปฏิเสธ Cookie ที่ไม่จำเป็นได้{' '}
                  <Link to="/legal/terms" className="text-primary underline underline-offset-2 hover:opacity-80">
                    นโยบายความเป็นส่วนตัว
                  </Link>
                </p>
              </div>
            </div>

            {/* Details toggle */}
            <button
              onClick={() => setShowDetails(v => !v)}
              className="w-full flex items-center justify-between text-[12px] text-muted-foreground hover:text-foreground transition-colors px-3 py-2 rounded-xl hover:bg-muted/50 cursor-pointer"
            >
              <span className="font-medium">รายละเอียด Cookie ที่ใช้</span>
              {showDetails ? <ChevronUp size={14} /> : <ChevronDown size={14} />}
            </button>

            {/* Cookie category breakdown */}
            {showDetails && (
              <div className="space-y-2 animate-in fade-in slide-in-from-top-2 duration-200">
                {/* จำเป็น */}
                <div className="flex items-start gap-3 bg-muted/40 rounded-2xl p-3">
                  <div className="bg-green-100 rounded-lg p-1.5 flex-shrink-0 mt-0.5">
                    <ShieldCheck size={13} className="text-green-600" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between gap-2">
                      <p className="font-semibold text-foreground text-[12px]">จำเป็น (Necessary)</p>
                      <span className="text-[10px] text-green-600 font-semibold bg-green-50 px-2 py-0.5 rounded-full flex-shrink-0">
                        เปิดเสมอ
                      </span>
                    </div>
                    <p className="text-muted-foreground text-[11px] mt-0.5">
                      Login, Session, Stripe Payment — ระบบทำงานไม่ได้หากปิด
                    </p>
                  </div>
                </div>

                {/* Analytics */}
                <div className="flex items-start gap-3 bg-muted/40 rounded-2xl p-3">
                  <div className="bg-blue-100 rounded-lg p-1.5 flex-shrink-0 mt-0.5">
                    <BarChart2 size={13} className="text-blue-600" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between gap-2">
                      <p className="font-semibold text-foreground text-[12px]">วิเคราะห์ (Analytics)</p>
                      <span className="text-[10px] text-muted-foreground bg-muted px-2 py-0.5 rounded-full flex-shrink-0">
                        ต้องขออนุญาต
                      </span>
                    </div>
                    <p className="text-muted-foreground text-[11px] mt-0.5">
                      Google Analytics — วิเคราะห์ว่าผู้ใช้เข้าถึงหน้าไหนบ้าง ไม่มีข้อมูลส่วนตัว
                    </p>
                  </div>
                </div>

                {/* Marketing */}
                <div className="flex items-start gap-3 bg-muted/40 rounded-2xl p-3">
                  <div className="bg-purple-100 rounded-lg p-1.5 flex-shrink-0 mt-0.5">
                    <Megaphone size={13} className="text-purple-600" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between gap-2">
                      <p className="font-semibold text-foreground text-[12px]">การตลาด (Marketing)</p>
                      <span className="text-[10px] text-muted-foreground bg-muted px-2 py-0.5 rounded-full flex-shrink-0">
                        ต้องขออนุญาต
                      </span>
                    </div>
                    <p className="text-muted-foreground text-[11px] mt-0.5">
                      Facebook Pixel — ใช้วัดผลโฆษณาและแสดงเนื้อหาที่เกี่ยวข้อง
                    </p>
                  </div>
                </div>
              </div>
            )}

            {/* Action buttons */}
            <div className="flex gap-2.5 pt-1">
              <button
                onClick={decline}
                className="flex-1 py-2.5 rounded-xl border border-border text-foreground text-[13px] font-semibold hover:bg-muted transition-colors cursor-pointer"
              >
                ปฏิเสธที่ไม่จำเป็น
              </button>
              <button
                onClick={accept}
                className="flex-1 py-2.5 rounded-xl bg-primary text-white-foreground text-[13px] font-bold hover:opacity-90 transition-opacity shadow-md shadow-primary/20 cursor-pointer"
              >
                ยอมรับทั้งหมด
              </button>
            </div>

            {/* PDPA note */}
            <p className="text-center text-[10px] text-muted-foreground/60 pb-1">
              FlyUp ปฏิบัติตาม พ.ร.บ. คุ้มครองข้อมูลส่วนบุคคล (PDPA) พ.ศ. 2562
            </p>
          </div>
        </div>
      </div>
    </>
  );
};

export default CookieConsent;
