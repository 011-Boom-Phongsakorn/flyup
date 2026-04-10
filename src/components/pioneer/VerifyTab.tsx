import { useState, useEffect } from "react";
import { Lock, Upload, Clock, CheckCircle } from "lucide-react";

const THAI_BANKS = [
  "ธนาคารกรุงเทพ (BBL)",
  "ธนาคารกสิกรไทย (KBANK)",
  "ธนาคารกรุงไทย (KTB)",
  "ธนาคารไทยพาณิชย์ (SCB)",
  "ธนาคารกรุงศรีอยุธยา (BAY)",
  "ธนาคารทหารไทยธนชาต (TTB)",
  "ธนาคารออมสิน",
  "ธนาคารเพื่อการเกษตรและสหกรณ์การเกษตร (ธ.ก.ส.)",
  "ธนาคารอาคารสงเคราะห์ (GHB)",
  "ธนาคารซีไอเอ็มบีไทย (CIMB)",
  "ธนาคารแลนด์ แอนด์ เฮ้าส์ (LH Bank)",
  "ธนาคารยูโอบี (UOB)",
];
import { useAuthStore } from "../../store/useAuthStore";
import toast from "react-hot-toast";
import api from "../../services/api";

const VerifyTab = () => {
  const { authUser, checkAuth } = useAuthStore();

  const derivedStudentCode =
    authUser?.student_profile?.student_code ??
    (authUser?.email as string)?.split("@")[0] ??
    "";

  const universityName =
    authUser?.student_profile?.university?.name_th ??
    authUser?.student_profile?.university?.name_en ??
    "";

  const LS_KEY = `verify_${authUser?.email}`;

  const getLocalVerify = () => {
    try { return JSON.parse(localStorage.getItem(LS_KEY) ?? "{}"); } catch { return {}; }
  };

  // prefer backend data (after backend fix), fallback to localStorage
  const studentCardVerify = authUser?.student_card_verification;
  const idCardVerify = authUser?.id_card_verification;
  const local = getLocalVerify();

  const storedStudentCardUrl: string = studentCardVerify?.document ?? local.student_card_url ?? "";
  const storedIdCardUrl: string = idCardVerify?.document ?? local.id_card_url ?? "";
  const storedSelfieUrl: string = idCardVerify?.selfie_url ?? local.selfie_url ?? "";
  const verifyStatus = studentCardVerify?.status ?? local.verify_status ?? "";

  const isVerified = verifyStatus === "approved";
  const isPending = verifyStatus === "pending";
  const isSubmitted = isVerified || isPending;

  const [studentForm, setStudentForm] = useState({
    student_code: derivedStudentCode,
    faculty: authUser?.student_profile?.faculty ?? "",
    major: authUser?.student_profile?.major ?? "",
  });
  const [studentFile, setStudentFile] = useState<File | null>(null);
  const [idCardFile, setIdCardFile] = useState<File | null>(null);
  const [selfieFile, setSelfieFile] = useState<File | null>(null);
  const [bankForm, setBankForm] = useState({
    bank_name: authUser?.bank_account?.bank_name ?? "",
    account_name: authUser?.bank_account?.account_name ?? "",
    account_number: authUser?.bank_account?.account_number ?? "",
  });
  const [acceptTerms, setAcceptTerms] = useState(isSubmitted);
  const [acceptAccuracy, setAcceptAccuracy] = useState(isSubmitted);
  const [isSavingStudent, setIsSavingStudent] = useState(false);
  const [isSavingBank, setIsSavingBank] = useState(false);

  useEffect(() => {
    const code =
      authUser?.student_profile?.student_code ??
      (authUser?.email as string)?.split("@")[0] ??
      "";
    setStudentForm({
      student_code: code,
      faculty: authUser?.student_profile?.faculty ?? "",
      major: authUser?.student_profile?.major ?? "",
    });
    setBankForm({
      bank_name: authUser?.bank_account?.bank_name ?? "",
      account_name: authUser?.bank_account?.account_name ?? "",
      account_number: authUser?.bank_account?.account_number ?? "",
    });
    const lv = (() => { try { return JSON.parse(localStorage.getItem(`verify_${authUser?.email}`) ?? "{}"); } catch { return {}; } })();
    const submitted = !!authUser?.student_card_verification?.document || authUser?.student_card_verification?.status === "approved" || !!lv.student_card_url;
    if (submitted) {
      setAcceptTerms(true);
      setAcceptAccuracy(true);
    }
  }, [authUser]);

  const baseRequired = {
    first_name: (authUser?.first_name as string) ?? "",
    last_name: (authUser?.last_name as string) ?? "",
    phone: (authUser?.phone as string) ?? "",
  };

  const handleStudentSubmit = async () => {
    if (!baseRequired.first_name || !baseRequired.last_name || !baseRequired.phone) {
      toast.error("กรุณากรอกข้อมูลส่วนตัว (ชื่อ นามสกุล เบอร์โทร) ในแท็บโปรไฟล์ก่อน");
      return;
    }
    if (!studentFile && !storedStudentCardUrl) {
      toast.error("กรุณาอัปโหลดบัตรนักศึกษา");
      return;
    }
    if (!idCardFile && !storedIdCardUrl) {
      toast.error("กรุณาอัปโหลดบัตรประชาชน");
      return;
    }
    if (!selfieFile && !storedSelfieUrl) {
      toast.error("กรุณาอัปโหลดรูปเซลฟี่พร้อมบัตรประชาชน");
      return;
    }
    if (!acceptTerms || !acceptAccuracy) {
      toast.error("กรุณายอมรับข้อตกลงก่อน");
      return;
    }
    setIsSavingStudent(true);
    try {
      // 1) อัปโหลดบัตรนักศึกษา (ถ้ามีไฟล์ใหม่)
      let studentCardUrl = storedStudentCardUrl;
      if (studentFile) {
        const fd = new FormData();
        fd.append("file", studentFile);
        const res = await api.post("/upload", fd, { headers: { "Content-Type": "multipart/form-data" } });
        studentCardUrl = res.data.data.url;
      }

      // 2) อัปโหลดบัตรประชาชน (ถ้ามีไฟล์ใหม่)
      let idCardUrl = storedIdCardUrl;
      if (idCardFile) {
        const fd = new FormData();
        fd.append("file", idCardFile);
        const res = await api.post("/upload", fd, { headers: { "Content-Type": "multipart/form-data" } });
        idCardUrl = res.data.data.url;
      }

      // 3) อัปโหลดรูปเซลฟี่ (ถ้ามีไฟล์ใหม่)
      let selfieUrl = storedSelfieUrl;
      if (selfieFile) {
        const fd = new FormData();
        fd.append("file", selfieFile);
        const res = await api.post("/upload", fd, { headers: { "Content-Type": "multipart/form-data" } });
        selfieUrl = res.data.data.url;
      }

      // 5) บันทึก student_code, faculty, major
      await api.patch("/user/profile", {
        student_code: studentForm.student_code || undefined,
        faculty: studentForm.faculty || undefined,
        major: studentForm.major || undefined,
      });

      // 6) ส่งคำขอยืนยันตัวตนนักศึกษา
      await api.post("/user/student-verify", {
        student_card_url: studentCardUrl,
        declare_truth: acceptAccuracy,
        accept_pioneer_terms: acceptTerms,
      });

      // 7) ส่งคำขอยืนยันบัตรประชาชน
      await api.post("/user/id-verify", {
        id_card_url: idCardUrl,
        selfie_url: selfieUrl,
        declare_truth: acceptAccuracy,
      });

      // เก็บ URL และสถานะไว้ใน localStorage (fallback จนกว่า backend จะ preload verification records)
      localStorage.setItem(LS_KEY, JSON.stringify({
        student_card_url: studentCardUrl,
        id_card_url: idCardUrl,
        selfie_url: selfieUrl,
        verify_status: "pending",
      }));

      await checkAuth();
      toast.success("ส่งข้อมูลยืนยันตัวตนแล้ว รอ admin อนุมัติ");
    } catch {
      toast.error("เกิดข้อผิดพลาด");
    } finally {
      setIsSavingStudent(false);
    }
  };

  const handleBankSubmit = async () => {
    if (!baseRequired.first_name || !baseRequired.last_name || !baseRequired.phone) {
      toast.error("กรุณากรอกข้อมูลส่วนตัว (ชื่อ นามสกุล เบอร์โทร) ในแท็บโปรไฟล์ก่อน");
      return;
    }
    setIsSavingBank(true);
    try {
      if (authUser?.bank_account?.id) {
        await api.patch(`/user/update-bank/${authUser.bank_account.id}`, {
          bank_name: bankForm.bank_name || undefined,
          account_name: bankForm.account_name || undefined,
          account_number: bankForm.account_number || undefined,
        });
      } else {
        await api.post("/user/add-bank", {
          bank_name: bankForm.bank_name || undefined,
          account_name: bankForm.account_name || undefined,
          account_number: bankForm.account_number || undefined,
        });
      }
      await checkAuth();
      toast.success("บันทึกข้อมูลบัญชีสำเร็จ");
    } catch {
      toast.error("เกิดข้อผิดพลาด");
    } finally {
      setIsSavingBank(false);
    }
  };

  const studentCardPreview = studentFile
    ? URL.createObjectURL(studentFile)
    : storedStudentCardUrl || null;

  const idCardPreview = idCardFile
    ? URL.createObjectURL(idCardFile)
    : storedIdCardUrl || null;

  const selfiePreview = selfieFile
    ? URL.createObjectURL(selfieFile)
    : storedSelfieUrl || null;

  return (
    <div className="flex flex-col gap-[16px]">
      {/* ยืนยันตัวตนนักศึกษา */}
      <div className="bg-white border border-border rounded-[16px] p-[24px] flex flex-col gap-[20px]">
        <div className="flex items-center gap-[8px]">
          <Lock size={18} className="text-foreground" />
          <h2 className="font-semibold text-foreground">ยืนยันตัวตนนักศึกษา</h2>
          {isVerified && (
            <span className="ml-auto flex items-center gap-[4px] text-[12px] text-green-600 bg-green-50 border border-green-200 px-[10px] py-[2px] rounded-full font-medium">
              <CheckCircle size={12} />
              อนุมัติแล้ว
            </span>
          )}
          {isPending && !isVerified && (
            <span className="ml-auto flex items-center gap-[4px] text-[12px] text-amber-600 bg-amber-50 border border-amber-200 px-[10px] py-[2px] rounded-full font-medium">
              <Clock size={12} />
              รออนุมัติ
            </span>
          )}
        </div>

        {/* มหาวิทยาลัย — read-only */}
        <div className="flex flex-col gap-[6px]">
          <label className="text-[13px] font-medium text-foreground">มหาวิทยาลัย</label>
          <input
            value={universityName}
            disabled
            className="border border-border rounded-[8px] px-[12px] py-[10px] text-[14px] bg-[#F8F9FA] text-muted-foreground cursor-not-allowed"
          />
        </div>

        {/* รหัสนักศึกษา */}
        <div className="flex flex-col gap-[6px]">
          <label className="text-[13px] font-medium text-foreground">รหัสนักศึกษา</label>
          <input
            value={studentForm.student_code}
            disabled={isSubmitted}
            onChange={(e) => setStudentForm((prev) => ({ ...prev, student_code: e.target.value }))}
            placeholder="เช่น 664259011"
            className={`border border-border rounded-[8px] px-[12px] py-[10px] text-[14px] outline-none transition-colors ${isSubmitted ? "bg-[#F8F9FA] text-muted-foreground cursor-not-allowed" : "focus:border-primary"}`}
          />
        </div>

        {/* คณะ */}
        <div className="flex flex-col gap-[6px]">
          <label className="text-[13px] font-medium text-foreground">คณะ</label>
          <input
            value={studentForm.faculty}
            disabled={isSubmitted}
            onChange={(e) => setStudentForm((prev) => ({ ...prev, faculty: e.target.value }))}
            placeholder="เช่น คณะวิทยาศาสตร์และเทคโนโลยี"
            className={`border border-border rounded-[8px] px-[12px] py-[10px] text-[14px] outline-none transition-colors ${isSubmitted ? "bg-[#F8F9FA] text-muted-foreground cursor-not-allowed" : "focus:border-primary"}`}
          />
        </div>

        {/* สาขา */}
        <div className="flex flex-col gap-[6px]">
          <label className="text-[13px] font-medium text-foreground">สาขา</label>
          <input
            value={studentForm.major}
            disabled={isSubmitted}
            onChange={(e) => setStudentForm((prev) => ({ ...prev, major: e.target.value }))}
            placeholder="เช่น วิทยาการคอมพิวเตอร์"
            className={`border border-border rounded-[8px] px-[12px] py-[10px] text-[14px] outline-none transition-colors ${isSubmitted ? "bg-[#F8F9FA] text-muted-foreground cursor-not-allowed" : "focus:border-primary"}`}
          />
        </div>

        {/* อัปโหลดบัตรนักศึกษา */}
        <div className="flex flex-col gap-[6px]">
          <label className="text-[13px] font-medium text-foreground">
            อัปโหลดบัตรนักศึกษา <span className="text-error">*</span>
          </label>
          <label className={`border-2 border-dashed border-border rounded-xl overflow-hidden transition-colors ${isSubmitted ? "cursor-default" : "cursor-pointer hover:border-primary"}`}>
            {studentCardPreview ? (
              <img
                src={studentCardPreview}
                alt="บัตรนักศึกษา"
                className="w-full max-h-[200px] object-contain"
              />
            ) : (
              <div className="p-8 flex flex-col items-center justify-center">
                <Upload size={24} className="text-muted-foreground mb-2" />
                <span className="text-[13px] text-muted-foreground">คลิกเพื่ออัปโหลด</span>
              </div>
            )}
            <input
              type="file"
              accept="image/*,.pdf"
              className="hidden"
              disabled={isSubmitted}
              onChange={(e) => setStudentFile(e.target.files?.[0] ?? null)}
            />
          </label>
        </div>

        {/* อัปโหลดบัตรประชาชน */}
        <div className="flex flex-col gap-[6px]">
          <label className="text-[13px] font-medium text-foreground">
            อัปโหลดบัตรประชาชน <span className="text-error">*</span>
          </label>
          <label className={`border-2 border-dashed border-border rounded-xl overflow-hidden transition-colors ${isSubmitted ? "cursor-default" : "cursor-pointer hover:border-primary"}`}>
            {idCardPreview ? (
              <img
                src={idCardPreview}
                alt="บัตรประชาชน"
                className="w-full max-h-[200px] object-contain"
              />
            ) : (
              <div className="p-8 flex flex-col items-center justify-center">
                <Upload size={24} className="text-muted-foreground mb-2" />
                <span className="text-[13px] text-muted-foreground">คลิกเพื่ออัปโหลด</span>
              </div>
            )}
            <input
              type="file"
              accept="image/*,.pdf"
              className="hidden"
              disabled={isSubmitted}
              onChange={(e) => setIdCardFile(e.target.files?.[0] ?? null)}
            />
          </label>
        </div>

        {/* อัปโหลดรูปเซลฟี่พร้อมบัตรประชาชน */}
        <div className="flex flex-col gap-[6px]">
          <label className="text-[13px] font-medium text-foreground">
            รูปเซลฟี่พร้อมบัตรประชาชน <span className="text-error">*</span>
          </label>
          <p className="text-[12px] text-muted-foreground">ถ่ายรูปหน้าตัวเองพร้อมถือบัตรประชาชนให้เห็นชัดเจน</p>
          <label className={`border-2 border-dashed border-border rounded-xl overflow-hidden transition-colors ${isSubmitted ? "cursor-default" : "cursor-pointer hover:border-primary"}`}>
            {selfiePreview ? (
              <img
                src={selfiePreview}
                alt="เซลฟี่พร้อมบัตรประชาชน"
                className="w-full max-h-[200px] object-contain"
              />
            ) : (
              <div className="p-8 flex flex-col items-center justify-center">
                <Upload size={24} className="text-muted-foreground mb-2" />
                <span className="text-[13px] text-muted-foreground">คลิกเพื่ออัปโหลด</span>
              </div>
            )}
            <input
              type="file"
              accept="image/*"
              className="hidden"
              disabled={isSubmitted}
              onChange={(e) => setSelfieFile(e.target.files?.[0] ?? null)}
            />
          </label>
        </div>

        {/* checkboxes */}
        <div className="flex flex-col gap-[10px]">
          {[
            { state: acceptTerms, set: setAcceptTerms, label: <>ยอมรับข้อตกลงของ <span className="text-primary">FlyUp Pioneer</span></> },
            { state: acceptAccuracy, set: setAcceptAccuracy, label: "ข้าพเจ้ายืนยันว่าข้อมูลทั้งหมดเป็นความจริง" },
          ].map(({ state, set, label }, idx) => (
            <label key={idx} className={`flex items-center gap-[10px] ${isSubmitted ? "cursor-default" : "cursor-pointer"}`}>
              <div
                onClick={() => !isSubmitted && set(!state)}
                className={`w-[18px] h-[18px] rounded-[4px] border-2 flex items-center justify-center shrink-0 transition-colors ${state ? "bg-primary border-primary" : "border-border"} ${isSubmitted ? "cursor-default" : "cursor-pointer"}`}
              >
                {state && <span className="text-white text-[10px] font-bold">✓</span>}
              </div>
              <span className="text-[13px] text-foreground">{label}</span>
            </label>
          ))}
        </div>

        {!isSubmitted && (
          <button
            onClick={handleStudentSubmit}
            disabled={isSavingStudent}
            className="w-full bg-primary hover:bg-primary-hover text-white py-[12px] rounded-[10px] text-[14px] font-medium transition-colors disabled:opacity-50 cursor-pointer"
          >
            {isSavingStudent ? "กำลังส่ง..." : "ยืนยันตัวตน"}
          </button>
        )}

        {isSubmitted && (
          <div className={`w-full py-[12px] rounded-[10px] text-[14px] font-medium text-center ${isVerified ? "bg-green-50 text-green-600 border border-green-200" : "bg-amber-50 text-amber-600 border border-amber-200"}`}>
            {isVerified ? "✓ ยืนยันตัวตนสำเร็จ" : "⏳ รอ admin อนุมัติ"}
          </div>
        )}
      </div>

      {/* ยืนยันบัญชี */}
      <div className="bg-white border border-border rounded-[16px] p-[24px] flex flex-col gap-[20px]">
        <div className="flex items-center gap-[8px]">
          <Lock size={18} className="text-foreground" />
          <h2 className="font-semibold text-foreground">ยืนยันบัญชี</h2>
          {authUser?.bank_account?.id && (
            <span className="ml-auto text-[12px] text-muted-foreground bg-muted px-[8px] py-[2px] rounded-full">มีบัญชีอยู่แล้ว</span>
          )}
        </div>

        <div className="flex flex-col gap-[6px]">
          <label className="text-[13px] font-medium text-foreground">ธนาคาร</label>
          <select
            value={bankForm.bank_name}
            onChange={(e) => setBankForm((prev) => ({ ...prev, bank_name: e.target.value }))}
            className="border border-border rounded-[8px] px-[12px] py-[10px] text-[14px] outline-none focus:border-primary transition-colors bg-white cursor-pointer"
          >
            <option value="">-- เลือกธนาคาร --</option>
            {THAI_BANKS.map((bank) => (
              <option key={bank} value={bank}>{bank}</option>
            ))}
          </select>
        </div>

        {[
          { key: "account_name", label: "ชื่อบัญชี" },
          { key: "account_number", label: "เลขบัญชี" },
        ].map(({ key, label }) => (
          <div key={key} className="flex flex-col gap-[6px]">
            <label className="text-[13px] font-medium text-foreground">{label}</label>
            <input
              value={bankForm[key as keyof typeof bankForm]}
              onChange={(e) => setBankForm((prev) => ({ ...prev, [key]: e.target.value }))}
              className="border border-border rounded-[8px] px-[12px] py-[10px] text-[14px] outline-none focus:border-primary transition-colors"
            />
          </div>
        ))}

        <button
          onClick={handleBankSubmit}
          disabled={isSavingBank}
          className="w-full bg-primary hover:bg-primary-hover text-white py-[12px] rounded-[10px] text-[14px] font-medium transition-colors disabled:opacity-50 cursor-pointer"
        >
          {isSavingBank ? "กำลังบันทึก..." : authUser?.bank_account?.id ? "อัปเดตบัญชี" : "เพิ่มบัญชี"}
        </button>
      </div>
    </div>
  );
};

export default VerifyTab;
