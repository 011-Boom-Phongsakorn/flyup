import { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router";
import toast, { Toaster } from "react-hot-toast";
import {
  ArrowLeft,
  FileText,
  AlertTriangle,
  QrCode,
  ShieldCheck,
  CheckCircle2,
  X,
} from "lucide-react";

type Step = 1 | 2 | 3 | 4;

const ContractModal = ({ isOpen, onClose }: { isOpen: boolean; onClose: () => void }) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="bg-card w-full max-w-2xl rounded-2xl shadow-xl overflow-hidden flex flex-col max-h-[90vh]">
        <div className="p-4 sm:p-6 border-b border-border flex justify-between items-center bg-background/50">
          <div className="flex items-center gap-2">
            <FileText className="text-primary" size={20} />
            <h3 className="font-bold text-lg text-foreground">สัญญาการลงทุน</h3>
          </div>
          <button onClick={onClose} className="p-1 hover:bg-muted rounded-full transition-colors">
            <X size={20} className="text-muted-foreground" />
          </button>
        </div>
        <div className="p-6 overflow-y-auto flex-1 space-y-4 text-sm text-foreground">
          <h4 className="font-bold text-primary mb-2">สัญญาการสนับสนุนโครงการผ่านแพลตฟอร์ม FlyUp (ฉบับเพิ่มเติม)</h4>
          <p>สัญญารับบนี้ทำขึ้นระหว่าง:</p>
          <ol className="list-decimal pl-5 space-y-1">
            <li>ผู้สนับสนุน (Investor/Backer) ซึ่งต่อไปเรียกว่า "ผู้สนับสนุน"</li>
            <li>ผู้พัฒนาโครงการ (Project Owner) ซึ่งต่อไปเรียกว่า "ผู้พัฒนาโครงการ"</li>
          </ol>
          <p>โดยมีแพลตฟอร์ม FlyUp ทำหน้าที่เป็นผู้ให้บริการระบบตัวกลาง</p>

          <h5 className="font-bold text-primary mt-4">ข้อ 1 วัตถุประสงค์ของสัญญา</h5>
          <p>ผู้สนับสนุนตกลงให้การสนับสนุนทางการเงินแก่ผู้พัฒนาโครงการผ่านระบบ FlyUp ตามรายละเอียดที่ระบุไว้ในหน้าโครงการ</p>

          <h5 className="font-bold text-primary mt-4">ข้อ 2 การรับทราบความเสี่ยง</h5>
          <ul className="list-none space-y-1">
            <li>2.1 ผู้สนับสนุนทราบว่าการลงทุนมีความเสี่ยง และอาจสูญเสียเงินลงทุนทั้งหมดหรือบางส่วน</li>
            <li>2.2 ไม่มีการรับประกันผลตอบแทนจากผู้พัฒนาโครงการหรือแพลตฟอร์ม</li>
            <li>2.3 ผู้สนับสนุนตัดสินใจลงทุนด้วยความสมัครใจและศึกษาข้อมูลอย่างเพียงพอแล้ว</li>
          </ul>

          <h5 className="font-bold text-primary mt-4">ข้อ 3 บทบาทของแพลตฟอร์ม FlyUp</h5>
          <ul className="list-none space-y-1">
            <li>3.1 FlyUp เป็นเพียงผู้ให้บริการระบบเทคโนโลยี</li>
            <li>3.2 ไม่เป็นคู่สัญญาในการลงทุน</li>
            <li>3.3 ไม่รับผิดชอบต่อความล้มเหลวของโครงการ</li>
            <li>3.4 ไม่มีหน้าที่รับประกันผลตอบแทน</li>
          </ul>

          <h5 className="font-bold text-primary mt-4">ข้อ 4 การบริหารเงินลงทุนและ Milestone</h5>
          <ul className="list-none space-y-1">
            <li>4.1 เงินลงทุนจะถูกเก็บรักษาไว้ในระบบตามเงื่อนไขที่กำหนด</li>
            <li>4.2 การปล่อยเงินจะดำเนินการตาม Milestone ที่ระบุในโครงการ</li>
            <li>4.3 Milestone ต้องผ่านการตรวจสอบก่อนปล่อยเงิน</li>
            <li>4.4 หากไม่ผ่านการตรวจสอบ สามารถชะลอหรือระงับการจ่ายเงินได้</li>
          </ul>

          <h5 className="font-bold text-primary mt-4">ข้อ 5 ค่าธรรมเนียมแพลตฟอร์ม</h5>
          <ul className="list-none space-y-1">
            <li>5.1 FlyUp มีสิทธิเรียกเก็บค่าธรรมเนียมการให้บริการจากผู้พัฒนาโครงการในอัตรา 5% ของยอดเงินที่ระดมทุนได้สำเร็จ</li>
            <li>5.2 ค่าธรรมเนียมอาจรวมถึงค่าดำเนินการระบบ, ค่าธรรมเนียมการชำระเงิน และค่าบริหารจัดการ Milestone</li>
            <li>5.3 ค่าธรรมเนียมดังกล่าวจะถูกหักออกก่อนการโอนเงินให้ผู้พัฒนาโครงการ</li>
          </ul>
        </div>
        <div className="p-4 border-t border-border bg-background/50 flex justify-end">
          <button onClick={onClose} className="px-6 py-2 bg-primary text-white-foreground rounded-xl font-bold hover:opacity-90 transition-opacity">
            ปิด
          </button>
        </div>
      </div>
    </div>
  );
};

const Investment = () => {
  const navigate = useNavigate();
  const { id } = useParams();

  const [step, setStep] = useState<Step>(1);
  const [agreed, setAgreed] = useState(false);
  const [amount, setAmount] = useState<string>("5000");
  const [showContract, setShowContract] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);
  const [timeLeft, setTimeLeft] = useState(15 * 60); // 15 minutes in seconds

  // Format time left
  useEffect(() => {
    if (step === 3 && timeLeft > 0) {
      const timer = setInterval(() => setTimeLeft((prev) => prev - 1), 1000);
      return () => clearInterval(timer);
    } else if (step === 3 && timeLeft === 0) {
      toast.error('หมดเวลาทำรายการ');
      navigate(-1);
    }
  }, [step, timeLeft, navigate]);

  const minAmount = 1000;
  const maxAmount = 14000;
  const platformFeeRate = 0.05;
  const vatRate = 0.07;

  // Amount parsing
  const parsedAmount = parseInt(amount.replace(/,/g, "")) || 0;
  const fee = parsedAmount * platformFeeRate;
  const vat = fee * vatRate;
  const investedValue = parsedAmount - fee - vat;

  const handleNextStep1 = () => {
    if (!agreed) {
      toast.error("กรุณากด ยอมรับสัญญาการลงทุนและเงื่อนไข", {
        style: {
          borderRadius: "10px",
          background: "var(--color-navbar-2)",
          color: "var(--color-white-foreground)",
          fontSize: "14px",
        },
      });
      return;
    }
    setStep(2);
  };

  const handleNextStep2 = () => {
    if (parsedAmount < minAmount) {
      toast.error(`จำนวนเงินขั้นต่ำคือ ฿${minAmount.toLocaleString()}`);
      return;
    }
    if (parsedAmount > maxAmount) {
      toast.error(`จำนวนเงินสูงสุดคือ ฿${maxAmount.toLocaleString()}`);
      return;
    }
    setShowConfirm(true);
  };

  const handleConfirmInvestment = () => {
    setShowConfirm(false);
    setStep(3);
  };

  const formatTime = (seconds: number) => {
    const m = Math.floor(seconds / 60).toString().padStart(2, "0");
    const s = (seconds % 60).toString().padStart(2, "0");
    return `${m}:${s}`;
  };

  return (
    <div className="h-full min-h-[calc(100vh-200px)] w-full flex-1 bg-[url('/bg-investment.png')] bg-cover bg-center bg-no-repeat bg-fixed flex flex-col pt-24 relative before:absolute before:inset-0 before:bg-white/40 before:pointer-events-none">
      <Toaster position="top-right" />
      <ContractModal isOpen={showContract} onClose={() => setShowContract(false)} />

      {/* Confirmation Modal */}
      {showConfirm && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/40 backdrop-blur-sm animate-in fade-in duration-200">
          <div className="bg-card w-full max-w-md rounded-2xl shadow-xl overflow-hidden flex flex-col">
            <div className="p-6 text-center space-y-1">
              <h3 className="font-bold text-xl text-foreground">ยืนยันการลงทุน</h3>
            </div>

            <div className="px-6 py-4 space-y-4">
              <div className="bg-background rounded-xl p-4 border border-border space-y-3">
                <div className="flex justify-between items-center">
                  <span className="text-sm text-muted-foreground">โปรเจกต์</span>
                  <span className="font-semibold text-sm">UniTrack</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-sm text-muted-foreground">ชื่อผู้สนับสนุน</span>
                  <span className="font-semibold text-sm">Phongsakorn</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-sm text-muted-foreground">ยอดลงทุน</span>
                  <span className="font-semibold text-sm">฿{parsedAmount.toLocaleString()}</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-sm text-muted-foreground">ส่วนแบ่งกำไร</span>
                  <span className="font-semibold text-primary text-sm">15%</span>
                </div>
              </div>

              <div className="bg-primary/5 rounded-xl p-4 border border-primary/20 flex justify-between items-center">
                <span className="font-bold text-foreground">ยอดชำระรวม</span>
                <span className="font-bold text-primary text-lg">฿{parsedAmount.toLocaleString()}</span>
              </div>

              <div className="text-center space-y-2 py-2">
                <p className="text-xs text-muted-foreground">เมื่อยืนยันแล้ว ระบบจะออกสัญญายืนยันการลงทุนให้อัตโนมัติ</p>
                <p className="text-[11px] font-bold text-error">**กรุณาเปิดแอปพลิเคชั่นธนาคารของท่านก่อนยืนยันการลงทุน เพื่อความรวดเร็ว**</p>
              </div>
            </div>

            <div className="p-4 border-t border-border bg-background/50 flex gap-3">
              <button
                onClick={() => setShowConfirm(false)}
                className="flex-1 py-3 rounded-xl border border-border bg-card text-foreground font-semibold hover:bg-muted transition-colors"
              >
                ยกเลิก
              </button>
              <button
                onClick={handleConfirmInvestment}
                className="flex-1 py-3 bg-primary text-white-foreground rounded-xl font-bold hover:opacity-90 transition-opacity"
              >
                ยืนยันการลงทุน
              </button>
            </div>
          </div>
        </div>
      )}

      <div className="relative z-10 max-w-3xl mx-auto w-full px-4 py-8 flex-1 flex flex-col">
        {step < 4 ? (
          <>
            {/* Header */}
            <div className="mb-8">
              <button
                onClick={() => navigate(-1)}
                className="flex items-center gap-2 text-sm font-medium text-foreground hover:text-primary transition-colors mb-6"
              >
                <ArrowLeft size={18} /> กลับ
              </button>
              <div className="flex flex-col items-center text-center">
                <h1 className="text-2xl sm:text-3xl font-bold text-foreground">ลงทุนใน UniTrack</h1>
                <p className="text-muted-foreground text-sm mt-1">กรุณาทำตามขั้นตอนเพื่อดำเนินการลงทุน</p>
              </div>
            </div>

            {/* Stepper */}
            <div className="mb-10 relative px-4 max-w-xl mx-auto w-full">
              <div className="absolute top-1/2 left-0 right-0 h-[2px] bg-border -z-10 -translate-y-1/2 rounded-full" />
              {/* Progress line */}
              <div
                className="absolute top-1/2 left-0 h-[2px] bg-primary -z-10 -translate-y-1/2 transition-all duration-300 rounded-full"
                style={{ width: step === 1 ? '10%' : step === 2 ? '50%' : '100%' }}
              />

              <div className="flex justify-between text-xs sm:text-sm font-medium">
                <div className="flex flex-col items-center gap-2">
                  <div className={`w-8 h-8 sm:w-10 sm:h-10 rounded-full flex items-center justify-center transition-colors ${step >= 1 ? 'bg-primary text-white-foreground shadow-md' : 'bg-background text-muted-foreground border-2 border-border'}`}>
                    <FileText size={16} />
                  </div>
                  <span className={step >= 1 ? 'text-foreground' : 'text-muted-foreground'}>เงื่อนไข</span>
                </div>
                <div className="flex flex-col items-center gap-2">
                  <div className={`w-8 h-8 sm:w-10 sm:h-10 rounded-full flex items-center justify-center transition-colors ${step >= 2 ? 'bg-primary text-white-foreground shadow-md' : 'bg-background text-muted-foreground border-2 border-border'}`}>
                    <CheckCircle2 size={16} />
                  </div>
                  <span className={step >= 2 ? 'text-foreground' : 'text-muted-foreground'}>จำนวนเงิน</span>
                </div>
                <div className="flex flex-col items-center gap-2">
                  <div className={`w-8 h-8 sm:w-10 sm:h-10 rounded-full flex items-center justify-center transition-colors ${step >= 3 ? 'bg-primary text-white-foreground shadow-md' : 'bg-background text-muted-foreground border-2 border-border'}`}>
                    <QrCode size={16} />
                  </div>
                  <span className={step >= 3 ? 'text-foreground' : 'text-muted-foreground'}>ชำระเงิน</span>
                </div>
              </div>
            </div>

            {/* Content Cards */}
            <div className="bg-card w-full rounded-[24px] rounded-tl-[24px] p-5 sm:p-8 shadow-xl border border-white/50 relative overflow-hidden backdrop-blur-sm bg-white/90">

              {/* Fake aesthetic gradient border top */}
              <div className="absolute top-0 left-0 right-0 h-1 bg-[image:var(--gradient-primary)]" />

              {/* Step 1: Conditions */}
              {step === 1 && (
                <div className="animate-in fade-in slide-in-from-bottom-4 duration-500">
                  <div className="flex items-center gap-2 mb-6 text-primary">
                    <FileText size={24} />
                    <h2 className="text-xl font-bold text-foreground">เงื่อนไขการลงทุน</h2>
                  </div>

                  <div className="bg-background rounded-2xl p-5 sm:p-6 mb-6">
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-4 border-b border-border mb-4">
                      <span className="font-bold text-foreground">สัญญาการลงทุน</span>
                      <span className="hidden sm:block text-muted-foreground">—</span>
                      <span className="font-bold text-foreground mt-1 sm:mt-0">โปรเจกต์ UniTrack</span>
                    </div>

                    <div className="space-y-4 text-sm">
                      <div className="flex justify-between items-center">
                        <span className="text-muted-foreground">สัดส่วนกำไรที่จะได้รับ</span>
                        <span className="font-bold text-primary text-base">15%</span>
                      </div>
                      <div className="flex justify-between items-center">
                        <span className="text-muted-foreground">จำนวนเงินลงทุนขั้นต่ำ</span>
                        <span className="font-medium text-foreground">฿{minAmount.toLocaleString()}</span>
                      </div>
                      <div className="flex justify-between items-center">
                        <span className="text-muted-foreground">จำนวนเงินลงทุนสูงสุด</span>
                        <span className="font-medium text-foreground">฿{maxAmount.toLocaleString()}</span>
                      </div>
                      <div className="flex justify-between items-center">
                        <span className="text-muted-foreground">ค่าธรรมเนียมแพลตฟอร์ม</span>
                        <span className="font-medium text-foreground">{(platformFeeRate * 100).toFixed(0)}%</span>
                      </div>
                    </div>
                  </div>

                  <div className="border border-border rounded-2xl p-4 mb-6 shadow-sm">
                    <div className="flex items-start gap-3">
                      <AlertTriangle className="text-muted-foreground flex-shrink-0 mt-0.5 opacity-60" size={18} />
                      <div className="text-[13px] text-muted-foreground leading-relaxed">
                        <p>ผู้สนับสนุนทราบว่าการลงทุนมีความเสี่ยง และอาจสูญเสียเงินลงทุนทั้งหมด</p>
                        <p>แพลตฟอร์ม FlyUp ทำหน้าที่เป็นเพียงตัวกลางในการจัดการระบบและ</p>
                        <p>ไม่รับประกันผลตอบแทน และไม่เป็นคู่สัญญาในการลงทุน</p>
                        <p>เงินลงทุนจะถูกปล่อยตาม Milestone ที่ผ่านการตรวจสอบตามเงื่อนไขของโปรเจคต์เท่านั้น</p>
                        <button
                          onClick={() => setShowContract(true)}
                          className="mt-2 text-primary hover:underline font-medium flex items-center gap-1"
                        >
                          <FileText size={14} /> อ่านสัญญาเพิ่มเติม &gt;
                        </button>
                      </div>
                    </div>
                  </div>

                  <label className="flex items-center gap-3 p-4 border border-border rounded-xl cursor-pointer hover:bg-background transition-colors mb-6 group">
                    <input
                      type="checkbox"
                      className="w-5 h-5 rounded border-border text-primary focus:ring-primary cursor-pointer accent-primary"
                      checked={agreed}
                      onChange={(e) => setAgreed(e.target.checked)}
                    />
                    <span className="text-sm text-foreground font-medium select-none group-hover:text-primary transition-colors">
                      ข้าพเจ้าได้อ่านและ<span className="underline decoration-primary underline-offset-4">ยอมรับสัญญาการลงทุนและเงื่อนไข</span>ข้างต้นแล้ว
                    </span>
                  </label>

                  <button
                    onClick={handleNextStep1}
                    className="w-full py-3.5 bg-primary text-white-foreground rounded-xl font-bold hover:opacity-90 transition-opacity shadow-lg shadow-primary/20"
                  >
                    ยอมรับและดำเนินการต่อ
                  </button>
                </div>
              )}

              {/* Step 2: AmountInput */}
              {step === 2 && (
                <div className="animate-in fade-in slide-in-from-right-8 duration-500">
                  <h2 className="text-xl font-bold text-foreground mb-6">ระบุจำนวนเงินลงทุน</h2>

                  <div className="space-y-6">
                    <div>
                      <label className="block text-sm font-medium text-foreground mb-2">จำนวนเงิน (บาท)</label>
                      <div className="relative">
                        <span className="absolute left-4 top-1/2 -translate-y-1/2 font-medium text-foreground">฿</span>
                        <input
                          type="text"
                          value={amount}
                          onChange={(e) => {
                            const val = e.target.value.replace(/[^0-9]/g, "");
                            setAmount(val ? Number(val).toLocaleString() : "");
                          }}
                          placeholder={`ขั้นต่ำ ${minAmount.toLocaleString()}`}
                          className="w-full pl-8 pr-4 py-3.5 rounded-xl border border-border focus:border-primary focus:ring-1 focus:ring-primary outline-none transition-all placeholder:text-placeholder font-medium text-foreground"
                        />
                      </div>
                    </div>

                    <div className="flex flex-wrap gap-2">
                      {[1000, 5000, 10000, 50000].map(val => (
                        <button
                          key={val}
                          onClick={() => setAmount(val.toLocaleString())}
                          className="px-4 py-2 text-xs sm:text-sm border border-border rounded-xl font-medium text-foreground bg-background hover:border-primary hover:text-primary transition-all shadow-sm"
                        >
                          ฿{val.toLocaleString()}
                        </button>
                      ))}
                      <button
                        onClick={() => setAmount(maxAmount.toLocaleString())}
                        className="px-4 py-2 text-xs sm:text-sm border border-border rounded-xl font-medium text-foreground bg-background hover:border-primary hover:text-primary transition-all shadow-sm"
                      >
                        สูงสุด
                      </button>
                    </div>

                    <div className="bg-primary-light/40 rounded-2xl p-5 border border-primary/10">
                      <h4 className="font-bold text-foreground mb-4">สรุปรายการ</h4>
                      <div className="space-y-3 text-sm">
                        <div className="flex justify-between items-center text-muted-foreground">
                          <span>ลงทุน</span>
                          <span className="font-medium text-foreground">฿{(parsedAmount || 0).toLocaleString()}</span>
                        </div>
                        <div className="flex justify-between items-center text-muted-foreground">
                          <span>ค่าธรรมเนียม</span>
                          <span className="font-medium text-foreground">฿{fee.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</span>
                        </div>
                        <div className="flex justify-between items-center text-muted-foreground">
                          <span>ภาษีมูลค่าเพิ่ม {(vatRate * 100).toFixed(0)}%(VAT)</span>
                          <span className="font-medium text-foreground">฿{vat.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</span>
                        </div>
                        <div className="flex justify-between items-center text-muted-foreground">
                          <span>มูลค่าที่ลงทุน</span>
                          <span className="font-medium text-foreground">฿{investedValue.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</span>
                        </div>
                      </div>
                    </div>

                    <div className="flex justify-between items-center pt-2 px-1">
                      <span className="font-bold text-foreground">ยอดรวมทั้งหมด</span>
                      <span className="font-bold text-primary text-xl">฿{(parsedAmount || 0).toLocaleString()}</span>
                    </div>

                    <button
                      onClick={handleNextStep2}
                      className="w-full py-3.5 bg-primary text-white-foreground rounded-xl font-bold hover:opacity-90 transition-opacity shadow-lg shadow-primary/20 mt-4"
                    >
                      ดำเนินการชำระเงิน
                    </button>
                  </div>
                </div>
              )}

              {/* Step 3: Payment UI */}
              {step === 3 && (
                <div className="animate-in fade-in slide-in-from-right-8 duration-500">
                  <div className="flex flex-col items-center py-4">
                    <div className="w-full max-w-sm border-2 border-dashed border-primary/20 rounded-3xl p-6 sm:p-8 bg-background flex flex-col items-center shadow-sm text-center">
                      <div className="mb-4 text-center w-full">
                        <img src="/img-payment-qr.png" alt="QR Code" className="w-[80%] mx-auto object-contain rounded-lg aspect-square mb-2 bg-white"
                          onError={(e) => {
                            (e.target as HTMLImageElement).src = 'data:image/svg+xml;charset=UTF-8,%3Csvg%20width%3D%22200%22%20height%3D%22200%22%20xmlns%3D%22http%3A%2F%2Fwww.w3.org%2F2000%2Fsvg%22%20viewBox%3D%220%200%2024%2024%22%20fill%3D%22none%22%20stroke%3D%22%237C4DDB%22%20stroke-width%3D%221%22%20stroke-linecap%3D%22round%22%20stroke-linejoin%3D%22round%22%3E%3Crect%20x%3D%223%22%20y%3D%223%22%20width%3D%2218%22%20height%3D%2218%22%20rx%3D%222%22%20ry%3D%222%22%3E%3C%2Frect%3E%3Crect%20x%3D%227%22%20y%3D%227%22%20width%3D%223%22%20height%3D%223%22%3E%3C%2Frect%3E%3Crect%20x%3D%2214%22%20y%3D%227%22%20width%3D%223%22%20height%3D%223%22%3E%3C%2Frect%3E%3Crect%20x%3D%227%22%20y%3D%2214%22%20width%3D%223%22%20height%3D%223%22%3E%3C%2Frect%3E%3Crect%20x%3D%2214%22%20y%3D%2214%22%20width%3D%223%22%20height%3D%223%22%3E%3C%2Frect%3E%3C%2Fsvg%3E';
                          }}
                        />
                        <h3 className="font-bold text-sm text-foreground mb-1">สแกน QR Code เพื่อชำระเงิน</h3>
                        <p className="font-black text-2xl text-primary font-mono tracking-tight">฿{parsedAmount.toLocaleString()}</p>
                        <p className="text-xs text-muted-foreground mt-2 font-medium">ใช้งานได้ภายใน <span className="text-error">{formatTime(timeLeft)}</span> นาที</p>
                      </div>

                      <div className="w-full bg-muted/50 rounded-xl p-4 text-xs space-y-2.5 mb-4 text-left border border-border/50">
                        <div className="flex justify-between">
                          <span className="text-muted-foreground">ชื่อโปรเจกต์</span>
                          <span className="font-semibold text-foreground">UniTrack</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-muted-foreground">ผู้สนับสนุน</span>
                          <span className="font-semibold text-foreground">Phongsakorn</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-muted-foreground">รับเงินโดย</span>
                          <span className="font-semibold text-foreground text-right leading-tight">FlyUp<br /><span className="text-[10px] text-muted-foreground font-normal">ธนาคารกสิกรไทย</span></span>
                        </div>
                      </div>

                      <div className="flex items-center gap-1.5 text-xs text-primary bg-primary/10 px-3 py-1.5 rounded-full font-semibold mb-6">
                        <ShieldCheck size={14} /> ปลอดภัยด้วยระบบ Escrow
                      </div>

                      <button
                        onClick={() => setStep(4)}
                        className="w-full py-3 bg-primary text-white-foreground rounded-xl font-bold hover:opacity-90 transition-opacity shadow-lg shadow-primary/20 text-sm"
                      >
                        (จำลองสแกนจ่ายสำเร็จ)
                      </button>
                    </div>
                  </div>
                </div>
              )}
            </div>
          </>
        ) : (
          /* Step 4: Success Fullscreen */
          <div className="flex-1 flex flex-col items-center justify-center animate-in zoom-in-95 duration-700">
            <div className="bg-card w-full max-w-lg rounded-[32px] p-8 sm:p-12 shadow-2xl border border-white/50 text-center relative overflow-hidden backdrop-blur-sm bg-white/95">
              <div className="w-24 h-24 bg-success/10 text-success rounded-full flex items-center justify-center mx-auto mb-6">
                <CheckCircle2 size={50} strokeWidth={2.5} />
              </div>
              <h1 className="text-2xl sm:text-3xl font-black text-foreground mb-2 text-transparent bg-clip-text bg-[image:var(--gradient-primary)]">การลงทุนสำเร็จ!</h1>
              <p className="text-muted-foreground text-sm leading-relaxed mb-8 px-4">
                ขอบคุณที่ร่วมสนับสนุนโปรเจกต์ของนักศึกษา ระบบได้ส่งหลักฐานการยืนยันไปยังอีเมล์ของคุณเรียบร้อยแล้ว
              </p>

              <div className="bg-muted/50 rounded-2xl p-4 border border-border/50 text-left mb-8 space-y-2.5 text-sm mx-auto max-w-sm">
                <div className="flex justify-between">
                  <span className="text-muted-foreground">ยอดลงทุน</span>
                  <span className="font-bold text-foreground">฿{parsedAmount.toLocaleString()}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">โปรเจกต์</span>
                  <span className="font-bold text-primary">UniTrack</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">ส่วนแบ่งกำไร</span>
                  <span className="font-bold text-foreground">15%</span>
                </div>
              </div>

              <button
                onClick={() => navigate(`/projects/${id}`)}
                className="w-full py-4 bg-primary text-white-foreground rounded-xl font-bold hover:opacity-90 transition-all shadow-lg shadow-primary/30 uppercase tracking-widest text-sm"
              >
                กลับสู่หน้าโปรเจกต์
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default Investment;
