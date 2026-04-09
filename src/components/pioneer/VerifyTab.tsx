import { useState, useEffect } from "react";
import { Lock, Upload } from "lucide-react";

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

  // ดึง student_code จาก student_profile หรือ derive จาก email prefix
  const derivedStudentCode =
    authUser?.student_profile?.student_code ??
    (authUser?.email as string)?.split("@")[0] ??
    "";

  const universityName =
    authUser?.student_profile?.university?.name_th ??
    authUser?.student_profile?.university?.name_en ??
    "";

  const [studentForm, setStudentForm] = useState({
    faculty: authUser?.student_profile?.faculty ?? "",
  });
  const [studentFile, setStudentFile] = useState<File | null>(null);
  const [idCardFile, setIdCardFile] = useState<File | null>(null);
  const [bankForm, setBankForm] = useState({
    bank_name: authUser?.bank_account?.bank_name ?? "",
    account_name: authUser?.bank_account?.account_name ?? "",
    account_number: authUser?.bank_account?.account_number ?? "",
  });
  const [acceptTerms, setAcceptTerms] = useState(false);
  const [acceptAccuracy, setAcceptAccuracy] = useState(false);
  const [isSavingStudent, setIsSavingStudent] = useState(false);
  const [isSavingBank, setIsSavingBank] = useState(false);

  // sync เมื่อ authUser เปลี่ยน (หลัง checkAuth)
  useEffect(() => {
    setStudentForm({
      faculty: authUser?.student_profile?.faculty ?? "",
    });
    setBankForm({
      bank_name: authUser?.bank_account?.bank_name ?? "",
      account_name: authUser?.bank_account?.account_name ?? "",
      account_number: authUser?.bank_account?.account_number ?? "",
    });
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
    if (!studentFile) {
      toast.error("กรุณาอัปโหลดบัตรนักศึกษา");
      return;
    }
    if (!idCardFile) {
      toast.error("กรุณาอัปโหลดบัตรประชาชน");
      return;
    }
    if (!acceptTerms || !acceptAccuracy) {
      toast.error("กรุณายอมรับข้อตกลงก่อน");
      return;
    }
    setIsSavingStudent(true);
    try {
      // 1) อัปโหลดบัตรนักศึกษา
      const studentFormData = new FormData();
      studentFormData.append("file", studentFile);
      const studentUploadRes = await api.post("/upload", studentFormData, {
        headers: { "Content-Type": "multipart/form-data" },
      });
      const studentCardUrl: string = studentUploadRes.data.data.url;

      // 2) อัปโหลดบัตรประชาชน
      const idFormData = new FormData();
      idFormData.append("file", idCardFile!);
      const idUploadRes = await api.post("/upload", idFormData, {
        headers: { "Content-Type": "multipart/form-data" },
      });
      const idCardUrl: string = idUploadRes.data.data.url;

      // 3) บันทึก faculty ถ้ากรอก
      if (studentForm.faculty) {
        await api.patch("/user/profile", { faculty: studentForm.faculty });
      }

      // 4) ส่งคำขอยืนยันตัวตนนักศึกษา
      await api.post("/user/student-verify", {
        student_card_url: studentCardUrl,
        declare_truth: acceptAccuracy,
        accept_pioneer_terms: acceptTerms,
      });

      // 5) ส่งคำขอยืนยันบัตรประชาชน
      await api.post("/user/id-verify", {
        id_card_url: idCardUrl,
        selfie_url: idCardUrl,
        declare_truth: acceptAccuracy,
      });

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
        // มีบัญชีแล้ว → update
        await api.patch(`/user/update-bank/${authUser.bank_account.id}`, {
          bank_name: bankForm.bank_name || undefined,
          account_name: bankForm.account_name || undefined,
          account_number: bankForm.account_number || undefined,
        });
      } else {
        // ยังไม่มีบัญชี → add
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

  return (
    <div className="flex flex-col gap-[16px]">
      {/* ยืนยันตัวตนนักศึกษา */}
      <div className="bg-white border border-border rounded-[16px] p-[24px] flex flex-col gap-[20px]">
        <div className="flex items-center gap-[8px]">
          <Lock size={18} className="text-foreground" />
          <h2 className="font-semibold text-foreground">ยืนยันตัวตนนักศึกษา</h2>
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

        {/* รหัสนักศึกษา — read-only */}
        <div className="flex flex-col gap-[6px]">
          <label className="text-[13px] font-medium text-foreground">รหัสนักศึกษา</label>
          <input
            value={derivedStudentCode}
            disabled
            className="border border-border rounded-[8px] px-[12px] py-[10px] text-[14px] bg-[#F8F9FA] text-muted-foreground cursor-not-allowed"
          />
        </div>

        {/* คณะ — แก้ไขได้ */}
        <div className="flex flex-col gap-[6px]">
          <label className="text-[13px] font-medium text-foreground">คณะ</label>
          <input
            value={studentForm.faculty}
            onChange={(e) => setStudentForm((prev) => ({ ...prev, faculty: e.target.value }))}
            placeholder="เช่น คณะวิทยาศาสตร์และเทคโนโลยี"
            className="border border-border rounded-[8px] px-[12px] py-[10px] text-[14px] outline-none focus:border-primary transition-colors"
          />
        </div>

        <div className="flex flex-col gap-[6px]">
          <label className="text-[13px] font-medium text-foreground">อัปโหลดบัตรนักศึกษา <span className="text-error">*</span></label>
          <label className="border-2 border-dashed border-border rounded-xl overflow-hidden cursor-pointer hover:border-primary transition-colors">
            {studentFile ? (
              <img
                src={URL.createObjectURL(studentFile)}
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
              onChange={(e) => setStudentFile(e.target.files?.[0] ?? null)}
            />
          </label>
        </div>

        <div className="flex flex-col gap-[6px]">
          <label className="text-[13px] font-medium text-foreground">อัปโหลดบัตรประชาชน <span className="text-error">*</span></label>
          <label className="border-2 border-dashed border-border rounded-xl overflow-hidden cursor-pointer hover:border-primary transition-colors">
            {idCardFile ? (
              <img
                src={URL.createObjectURL(idCardFile)}
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
              onChange={(e) => setIdCardFile(e.target.files?.[0] ?? null)}
            />
          </label>
        </div>

        <div className="flex flex-col gap-[10px]">
          {[
            { state: acceptTerms, set: setAcceptTerms, label: <>ยอมรับข้อตกลงของ <span className="text-primary">FlyUp Pioneer</span></> },
            { state: acceptAccuracy, set: setAcceptAccuracy, label: "ข้าพเจ้ายืนยันว่าข้อมูลทั้งหมดเป็นความจริง" },
          ].map(({ state, set, label }, idx) => (
            <label key={idx} className="flex items-center gap-[10px] cursor-pointer">
              <div
                onClick={() => set(!state)}
                className={`w-[18px] h-[18px] rounded-[4px] border-2 flex items-center justify-center shrink-0 transition-colors ${state ? "bg-primary border-primary" : "border-border"}`}
              >
                {state && <span className="text-white text-[10px] font-bold">✓</span>}
              </div>
              <span className="text-[13px] text-foreground">{label}</span>
            </label>
          ))}
        </div>

        <button
          onClick={handleStudentSubmit}
          disabled={isSavingStudent}
          className="w-full bg-primary hover:bg-primary-hover text-white py-[12px] rounded-[10px] text-[14px] font-medium transition-colors disabled:opacity-50 cursor-pointer"
        >
          {isSavingStudent ? "กำลังส่ง..." : "ยืนยันตัวตน"}
        </button>
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
