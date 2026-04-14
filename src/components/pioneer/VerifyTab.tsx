import { useState, useEffect } from "react";
import { Lock, Upload, Clock, CheckCircle, XCircle } from "lucide-react";

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

  const studentCardVerify = authUser?.student_card_verification;
  const idCardVerify = authUser?.id_card_verification;

  const storedStudentCardUrl: string = studentCardVerify?.document ?? "";
  const storedIdCardUrl: string = idCardVerify?.document ?? "";
  const storedSelfieUrl: string = idCardVerify?.selfie_url ?? "";

  const studentCardStatus = studentCardVerify?.status ?? "";
  const idCardStatus = idCardVerify?.status ?? "";

  const studentCardApproved = studentCardStatus === "approved";
  const studentCardPending  = studentCardStatus === "pending";
  const studentCardRejected = studentCardStatus === "rejected";
  const studentCardLocked   = studentCardApproved || studentCardPending;

  const idCardApproved = idCardStatus === "approved";
  const idCardPending  = idCardStatus === "pending";
  const idCardRejected = idCardStatus === "rejected";
  const idCardLocked   = idCardApproved || idCardPending;

  const bothLocked  = studentCardLocked && idCardLocked;
  const allApproved = studentCardApproved && idCardApproved;
  const anyRejected = studentCardRejected || idCardRejected;

  const [studentForm, setStudentForm] = useState({
    student_code: derivedStudentCode,
  });
  const [studentFile, setStudentFile] = useState<File | null>(null);
  const [idCardFile, setIdCardFile] = useState<File | null>(null);
  const [selfieFile, setSelfieFile] = useState<File | null>(null);
  const [bankForm, setBankForm] = useState({
    bank_name: authUser?.bank_account?.bank_name ?? "",
    account_name: authUser?.bank_account?.account_name ?? "",
    account_number: authUser?.bank_account?.account_number ?? "",
  });
  const [acceptTerms, setAcceptTerms] = useState(studentCardLocked);
  const [acceptAccuracy, setAcceptAccuracy] = useState(studentCardLocked);
  const [isSavingStudent, setIsSavingStudent] = useState(false);
  const [isSavingBank, setIsSavingBank] = useState(false);

  useEffect(() => {
    checkAuth();
  }, [checkAuth]);

  useEffect(() => {
    const code =
      authUser?.student_profile?.student_code ??
      (authUser?.email as string)?.split("@")[0] ??
      "";
    setStudentForm({
      student_code: code,
    });
    setBankForm({
      bank_name: authUser?.bank_account?.bank_name ?? "",
      account_name: authUser?.bank_account?.account_name ?? "",
      account_number: authUser?.bank_account?.account_number ?? "",
    });
    const scStatus = authUser?.student_card_verification?.status ?? "";
    if (scStatus) {
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
      let studentCardUrl = storedStudentCardUrl;
      if (studentFile) {
        const fd = new FormData();
        fd.append("file", studentFile);
        const res = await api.post("/upload", fd, { headers: { "Content-Type": "multipart/form-data" } });
        studentCardUrl = res.data.data.url;
      }

      let idCardUrl = storedIdCardUrl;
      if (idCardFile) {
        const fd = new FormData();
        fd.append("file", idCardFile);
        const res = await api.post("/upload", fd, { headers: { "Content-Type": "multipart/form-data" } });
        idCardUrl = res.data.data.url;
      }

      let selfieUrl = storedSelfieUrl;
      if (selfieFile) {
        const fd = new FormData();
        fd.append("file", selfieFile);
        const res = await api.post("/upload", fd, { headers: { "Content-Type": "multipart/form-data" } });
        selfieUrl = res.data.data.url;
      }

      await api.patch("/user/profile", {
        student_code: studentForm.student_code || undefined,
      });

      if (!studentCardLocked) {
        await api.post("/user/student-verify", {
          student_card_url: studentCardUrl,
          declare_truth: acceptAccuracy,
          accept_pioneer_terms: acceptTerms,
        });
      }

      if (!idCardLocked) {
        await api.post("/user/id-verify", {
          id_card_url: idCardUrl,
          selfie_url: selfieUrl,
          declare_truth: acceptAccuracy,
        });
      }

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

  const uploadBorderClass = (approved: boolean, pending: boolean, rejected: boolean, locked: boolean) =>
    `border-2 border-dashed rounded-xl overflow-hidden transition-colors block
      ${approved ? "border-green-300" : pending ? "border-amber-300" : rejected ? "border-red-300" : "border-border"}
      ${locked ? "cursor-default" : "cursor-pointer hover:border-primary"}`;

  return (
    <div className="flex flex-col gap-[16px]">
      {/* ยืนยันตัวตนนักศึกษา */}
      <div className="bg-white border border-border rounded-[16px] p-[24px] flex flex-col gap-[20px]">
        <div className="flex items-center gap-[8px]">
          <Lock size={18} className="text-foreground" />
          <h2 className="font-semibold text-foreground">ยืนยันตัวตนนักศึกษา</h2>
          {allApproved && (
            <span className="ml-auto flex items-center gap-[4px] text-[12px] text-green-600 bg-green-50 border border-green-200 px-[10px] py-[2px] rounded-full font-medium">
              <CheckCircle size={12} />
              อนุมัติแล้ว
            </span>
          )}
          {anyRejected && (
            <span className="ml-auto flex items-center gap-[4px] text-[12px] text-red-600 bg-red-50 border border-red-200 px-[10px] py-[2px] rounded-full font-medium">
              <XCircle size={12} />
              มีรายการถูกปฏิเสธ
            </span>
          )}
          {!allApproved && !anyRejected && (studentCardPending || idCardPending) && (
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
            disabled
            className="border border-border rounded-[8px] px-[12px] py-[10px] text-[14px] bg-[#F8F9FA] text-muted-foreground cursor-not-allowed"
          />
        </div>

        {/* อัปโหลดบัตรนักศึกษา */}
        <div className="flex flex-col gap-[6px]">
          <label className="text-[13px] font-medium text-foreground">
            อัปโหลดบัตรนักศึกษา <span className="text-error">*</span>
          </label>
          <div className="relative">
            <label className={uploadBorderClass(studentCardApproved, studentCardPending, studentCardRejected, studentCardLocked)}>
              {studentCardPreview ? (
                <img src={studentCardPreview} alt="บัตรนักศึกษา" className="w-full max-h-[200px] object-contain" />
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
                disabled={studentCardLocked}
                onChange={(e) => setStudentFile(e.target.files?.[0] ?? null)}
              />
            </label>
            {studentCardApproved && (
              <div className="absolute inset-0 rounded-xl bg-green-50/80 flex flex-col items-center justify-center pointer-events-none">
                <CheckCircle size={32} className="text-green-500" />
                <span className="text-green-600 font-semibold text-[13px] mt-[6px]">อนุมัติแล้ว</span>
              </div>
            )}
            {studentCardPending && (
              <div className="absolute inset-0 rounded-xl bg-amber-50/70 flex flex-col items-center justify-center pointer-events-none">
                <Clock size={32} className="text-amber-500" />
                <span className="text-amber-600 font-semibold text-[13px] mt-[6px]">รออนุมัติ</span>
              </div>
            )}
            {studentCardRejected && (
              <div className="absolute top-[8px] right-[8px] pointer-events-none">
                <span className="flex items-center gap-[4px] text-[11px] bg-red-100 text-red-600 border border-red-200 px-[8px] py-[3px] rounded-full font-medium">
                  <XCircle size={11} /> ถูกปฏิเสธ — อัปโหลดใหม่
                </span>
              </div>
            )}
          </div>
        </div>

        {/* อัปโหลดบัตรประชาชน */}
        <div className="flex flex-col gap-[6px]">
          <label className="text-[13px] font-medium text-foreground">
            อัปโหลดบัตรประชาชน <span className="text-error">*</span>
          </label>
          <div className="relative">
            <label className={uploadBorderClass(idCardApproved, idCardPending, idCardRejected, idCardLocked)}>
              {idCardPreview ? (
                <img src={idCardPreview} alt="บัตรประชาชน" className="w-full max-h-[200px] object-contain" />
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
                disabled={idCardLocked}
                onChange={(e) => setIdCardFile(e.target.files?.[0] ?? null)}
              />
            </label>
            {idCardApproved && (
              <div className="absolute inset-0 rounded-xl bg-green-50/80 flex flex-col items-center justify-center pointer-events-none">
                <CheckCircle size={32} className="text-green-500" />
                <span className="text-green-600 font-semibold text-[13px] mt-[6px]">อนุมัติแล้ว</span>
              </div>
            )}
            {idCardPending && (
              <div className="absolute inset-0 rounded-xl bg-amber-50/70 flex flex-col items-center justify-center pointer-events-none">
                <Clock size={32} className="text-amber-500" />
                <span className="text-amber-600 font-semibold text-[13px] mt-[6px]">รออนุมัติ</span>
              </div>
            )}
            {idCardRejected && (
              <div className="absolute top-[8px] right-[8px] pointer-events-none">
                <span className="flex items-center gap-[4px] text-[11px] bg-red-100 text-red-600 border border-red-200 px-[8px] py-[3px] rounded-full font-medium">
                  <XCircle size={11} /> ถูกปฏิเสธ — อัปโหลดใหม่
                </span>
              </div>
            )}
          </div>
        </div>

        {/* อัปโหลดรูปเซลฟี่พร้อมบัตรประชาชน */}
        <div className="flex flex-col gap-[6px]">
          <label className="text-[13px] font-medium text-foreground">
            รูปเซลฟี่พร้อมบัตรประชาชน <span className="text-error">*</span>
          </label>
          <p className="text-[12px] text-muted-foreground">ถ่ายรูปหน้าตัวเองพร้อมถือบัตรประชาชนให้เห็นชัดเจน</p>
          <div className="relative">
            <label className={uploadBorderClass(idCardApproved, idCardPending, idCardRejected, idCardLocked)}>
              {selfiePreview ? (
                <img src={selfiePreview} alt="เซลฟี่พร้อมบัตรประชาชน" className="w-full max-h-[200px] object-contain" />
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
                disabled={idCardLocked}
                onChange={(e) => setSelfieFile(e.target.files?.[0] ?? null)}
              />
            </label>
            {idCardApproved && (
              <div className="absolute inset-0 rounded-xl bg-green-50/80 flex flex-col items-center justify-center pointer-events-none">
                <CheckCircle size={32} className="text-green-500" />
                <span className="text-green-600 font-semibold text-[13px] mt-[6px]">อนุมัติแล้ว</span>
              </div>
            )}
            {idCardPending && (
              <div className="absolute inset-0 rounded-xl bg-amber-50/70 flex flex-col items-center justify-center pointer-events-none">
                <Clock size={32} className="text-amber-500" />
                <span className="text-amber-600 font-semibold text-[13px] mt-[6px]">รออนุมัติ</span>
              </div>
            )}
            {idCardRejected && (
              <div className="absolute top-[8px] right-[8px] pointer-events-none">
                <span className="flex items-center gap-[4px] text-[11px] bg-red-100 text-red-600 border border-red-200 px-[8px] py-[3px] rounded-full font-medium">
                  <XCircle size={11} /> ถูกปฏิเสธ — อัปโหลดใหม่
                </span>
              </div>
            )}
          </div>
        </div>

        {/* checkboxes */}
        <div className="flex flex-col gap-[10px]">
          {[
            { state: acceptTerms, set: setAcceptTerms, label: <>ยอมรับข้อตกลงของ <span className="text-primary">FlyUp Pioneer</span></> },
            { state: acceptAccuracy, set: setAcceptAccuracy, label: "ข้าพเจ้ายืนยันว่าข้อมูลทั้งหมดเป็นความจริง" },
          ].map(({ state, set, label }, idx) => (
            <label key={idx} className={`flex items-center gap-[10px] ${bothLocked ? "cursor-default" : "cursor-pointer"}`}>
              <div
                onClick={() => !bothLocked && set(!state)}
                className={`w-[18px] h-[18px] rounded-[4px] border-2 flex items-center justify-center shrink-0 transition-colors ${state ? "bg-primary border-primary" : "border-border"} ${bothLocked ? "cursor-default" : "cursor-pointer"}`}
              >
                {state && <span className="text-white text-[10px] font-bold">✓</span>}
              </div>
              <span className="text-[13px] text-foreground">{label}</span>
            </label>
          ))}
        </div>

        {!bothLocked && (
          <button
            onClick={handleStudentSubmit}
            disabled={isSavingStudent}
            className="w-full bg-primary hover:bg-primary-hover text-white py-[12px] rounded-[10px] text-[14px] font-medium transition-colors disabled:opacity-50 cursor-pointer"
          >
            {isSavingStudent ? "กำลังส่ง..." : "ยืนยันตัวตน"}
          </button>
        )}

        {bothLocked && (
          <div className={`w-full py-[12px] rounded-[10px] text-[14px] font-medium text-center ${allApproved ? "bg-green-50 text-green-600 border border-green-200" : "bg-amber-50 text-amber-600 border border-amber-200"}`}>
            {allApproved ? "✓ ยืนยันตัวตนสำเร็จ" : "⏳ รอ admin อนุมัติ"}
          </div>
        )}
      </div>

      {/* ยืนยันบัญชี */}
      <div className="bg-white border border-border rounded-[16px] p-[24px] flex flex-col gap-[20px]">
        <div className="flex items-center gap-[8px]">
          <Lock size={18} className="text-foreground" />
          <h2 className="font-semibold text-foreground">ยืนยันบัญชี</h2>
          {authUser?.bank_account?.id && (
            <span className="ml-auto text-[12px] text-green-600 bg-green-50 border border-green-200 px-[8px] py-[2px] rounded-full">ผูกบัญชีแล้ว</span>
          )}
        </div>

        <div className="flex flex-col gap-[6px]">
          <label className="text-[13px] font-medium text-foreground">ธนาคาร <span className="text-error">*</span></label>
          <select
            value={bankForm.bank_name}
            onChange={(e) => setBankForm((prev) => ({ ...prev, bank_name: e.target.value }))}
            className="border border-border rounded-[8px] px-[12px] py-[10px] pr-[32px] text-[14px] outline-none focus:border-primary transition-colors bg-white cursor-pointer appearance-none bg-[url('data:image/svg+xml;charset=utf-8,%3Csvg xmlns=%22http://www.w3.org/2000/svg%22 width=%2216%22 height=%2216%22 viewBox=%220 0 24 24%22 fill=%22none%22 stroke=%22%236b7280%22 stroke-width=%222%22 stroke-linecap=%22round%22 stroke-linejoin=%22round%22%3E%3Cpolyline points=%226 9 12 15 18 9%22/%3E%3C/svg%3E')] bg-no-repeat bg-[right_10px_center]"
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
            <label className="text-[13px] font-medium text-foreground">{label} <span className="text-error">*</span></label>
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
