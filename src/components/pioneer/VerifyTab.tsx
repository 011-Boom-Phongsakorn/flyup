import { useState } from "react";
import { Lock, Upload } from "lucide-react";
import { useAuthStore } from "../../store/useAuthStore";
import toast from "react-hot-toast";
import api from "../../services/api";

const VerifyTab = () => {
  const { authUser } = useAuthStore();
  const [studentForm, setStudentForm] = useState({
    university: (authUser?.university as string) ?? "",
    faculty: (authUser?.faculty as string) ?? "",
    student_id: (authUser?.student_id as string) ?? "",
  });
  const [studentFile, setStudentFile] = useState<File | null>(null);
  const [idCardFile, setIdCardFile] = useState<File | null>(null);
  const [bankForm, setBankForm] = useState({
    bank_name: (authUser?.bank_name as string) ?? "",
    account_name: (authUser?.bank_account_name as string) ?? "",
    account_number: (authUser?.bank_account_no as string) ?? "",
  });
  const [acceptTerms, setAcceptTerms] = useState(false);
  const [acceptAccuracy, setAcceptAccuracy] = useState(false);
  const [isSavingStudent, setIsSavingStudent] = useState(false);
  const [isSavingBank, setIsSavingBank] = useState(false);

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

      // 3) บันทึก faculty ที่ profile
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
        selfie_url: idCardUrl, // selfie แยกต่างหากถ้ามี
        declare_truth: acceptAccuracy,
      });

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
      await api.post("/user/add-bank", {
        bank_name: bankForm.bank_name || undefined,
        account_name: bankForm.account_name || undefined,
        account_number: bankForm.account_number || undefined,
      });
      toast.success("ส่งข้อมูลบัญชีแล้ว");
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

        {[
          { key: "university", label: "มหาวิทยาลัย" },
          { key: "faculty", label: "คณะ" },
          { key: "student_id", label: "รหัสนักศึกษา" },
        ].map(({ key, label }) => (
          <div key={key} className="flex flex-col gap-[6px]">
            <label className="text-[13px] font-medium text-foreground">{label}</label>
            <input
              value={studentForm[key as keyof typeof studentForm]}
              onChange={(e) => setStudentForm((prev) => ({ ...prev, [key]: e.target.value }))}
              className="border border-border rounded-[8px] px-[12px] py-[10px] text-[14px] outline-none focus:border-primary transition-colors"
            />
          </div>
        ))}

        <div className="flex flex-col gap-[6px]">
          <label className="text-[13px] font-medium text-foreground">อัปโหลดบัตรนักศึกษา <span className="text-error">*</span></label>
          <label className="border-2 border-dashed border-border rounded-xl p-8 flex flex-col items-center justify-center cursor-pointer hover:border-primary transition-colors">
            <Upload size={24} className="text-muted-foreground mb-2" />
            {studentFile ? (
              <span className="text-[13px] text-primary font-medium">{studentFile.name}</span>
            ) : (
              <span className="text-[13px] text-muted-foreground">คลิกเพื่ออัปโหลด</span>
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
          <label className="border-2 border-dashed border-border rounded-xl p-8 flex flex-col items-center justify-center cursor-pointer hover:border-primary transition-colors">
            <Upload size={24} className="text-muted-foreground mb-2" />
            {idCardFile ? (
              <span className="text-[13px] text-primary font-medium">{idCardFile.name}</span>
            ) : (
              <span className="text-[13px] text-muted-foreground">คลิกเพื่ออัปโหลด</span>
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
          className="w-full bg-primary hover:bg-primary-hover text-white py-[12px] rounded-[10px] text-[14px] font-medium transition-colors disabled:opacity-50"
        >
          {isSavingStudent ? "กำลังส่ง..." : "ยืนยันตัวตน"}
        </button>
      </div>

      {/* ยืนยันบัญชี */}
      <div className="bg-white border border-border rounded-[16px] p-[24px] flex flex-col gap-[20px]">
        <div className="flex items-center gap-[8px]">
          <Lock size={18} className="text-foreground" />
          <h2 className="font-semibold text-foreground">ยืนยันบัญชี</h2>
        </div>

        {[
          { key: "bank_name", label: "ธนาคาร" },
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
          className="w-full bg-primary hover:bg-primary-hover text-white py-[12px] rounded-[10px] text-[14px] font-medium transition-colors disabled:opacity-50"
        >
          {isSavingBank ? "กำลังส่ง..." : "ยืนยันตัวตน"}
        </button>
      </div>
    </div>
  );
};

export default VerifyTab;
