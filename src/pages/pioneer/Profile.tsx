import { useState } from "react";
import { Bell, Lock, User, ShieldCheck, Upload, Eye, EyeOff } from "lucide-react";
import { useAuthStore } from "../../store/useAuthStore";
import toast from "react-hot-toast";
import api from "../../services/api";

type Tab = "profile" | "notification" | "password" | "verify";

const tabs: { key: Tab; label: string }[] = [
  { key: "profile", label: "โปรไฟล์" },
  { key: "notification", label: "การแจ้งเดือน" },
  { key: "password", label: "รหัสผ่าน" },
  { key: "verify", label: "ยืนยันตัวตน" },
];

// ─── Profile Tab ────────────────────────────────────────────────────────────
const ProfileTab = () => {
  const { authUser } = useAuthStore();
  const [form, setForm] = useState({
    first_name: authUser?.name?.split(" ")[0] ?? "",
    last_name: authUser?.name?.split(" ")[1] ?? "",
    phone: "",
    bio: "",
    portfolio_url: "",
    expertise: "",
  });
  const [isSaving, setIsSaving] = useState(false);

  const initials = `${form.first_name[0] ?? ""}${form.last_name[0] ?? ""}`.toUpperCase() || "?";

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setForm((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleSave = async () => {
    setIsSaving(true);
    try {
      await api.patch("/user/me", {
        first_name: form.first_name,
        last_name: form.last_name,
        phone: form.phone,
        bio: form.bio,
        portfolio_url: form.portfolio_url,
        expertise: form.expertise,
      });
      toast.success("บันทึกสำเร็จ");
    } catch {
      toast.error("บันทึกไม่สำเร็จ");
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <div className="flex flex-col gap-[16px]">
      {/* Avatar */}
      <div className="bg-white border border-border rounded-[16px] p-[24px] flex items-center gap-[16px]">
        <div className="relative">
          {authUser?.profile_url ? (
            <img src={authUser.profile_url} alt="avatar" className="w-[72px] h-[72px] rounded-full object-cover" />
          ) : (
            <div className="w-[72px] h-[72px] rounded-full bg-primary/20 flex items-center justify-center text-primary text-[22px] font-bold">
              {initials}
            </div>
          )}
          <button className="absolute bottom-0 right-0 w-[22px] h-[22px] bg-primary rounded-full flex items-center justify-center">
            <User size={12} className="text-white" />
          </button>
        </div>
        <div>
          <p className="font-semibold text-foreground">{authUser?.name ?? "—"}</p>
          <p className="text-[13px] text-muted-foreground">{authUser?.email ?? "—"}</p>
        </div>
      </div>

      {/* ข้อมูลส่วนตัว */}
      <div className="bg-white border border-border rounded-[16px] p-[24px] flex flex-col gap-[20px]">
        <h2 className="font-semibold text-foreground">ข้อมูลส่วนตัว</h2>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-[16px]">
          <div className="flex flex-col gap-[6px]">
            <label className="text-[13px] font-medium text-foreground">ชื่อ *</label>
            <input
              name="first_name"
              value={form.first_name}
              onChange={handleChange}
              placeholder="สบชาย"
              className="border border-border rounded-[8px] px-[12px] py-[10px] text-[14px] outline-none focus:border-primary transition-colors"
            />
          </div>
          <div className="flex flex-col gap-[6px]">
            <label className="text-[13px] font-medium text-foreground">นามสกุล *</label>
            <input
              name="last_name"
              value={form.last_name}
              onChange={handleChange}
              placeholder="สบชาย"
              className="border border-border rounded-[8px] px-[12px] py-[10px] text-[14px] outline-none focus:border-primary transition-colors"
            />
          </div>
        </div>

        <div className="flex flex-col gap-[6px]">
          <label className="text-[13px] font-medium text-foreground flex items-center gap-[6px]">
            <span>✉</span> อีเมล
          </label>
          <input
            value={authUser?.email ?? ""}
            disabled
            className="border border-border rounded-[8px] px-[12px] py-[10px] text-[14px] bg-[#F8F9FA] text-muted-foreground cursor-not-allowed"
          />
        </div>

        <div className="flex flex-col gap-[6px]">
          <label className="text-[13px] font-medium text-foreground flex items-center gap-[6px]">
            <span>📞</span> เบอร์โทรศัพท์
          </label>
          <input
            name="phone"
            value={form.phone}
            onChange={handleChange}
            placeholder="081-234-5678"
            className="border border-border rounded-[8px] px-[12px] py-[10px] text-[14px] outline-none focus:border-primary transition-colors"
          />
        </div>
      </div>

      {/* ข้อมูล Pioneer */}
      <div className="bg-white border border-border rounded-[16px] p-[24px] flex flex-col gap-[20px]">
        <div>
          <h2 className="font-semibold text-foreground">ข้อมูล Pioneer</h2>
          <p className="text-[12px] text-muted-foreground mt-[2px]">ข้อมูลเพิ่มเติมสำหรับนักพัฒนาโปรเจกต์</p>
        </div>

        <div className="flex flex-col gap-[6px]">
          <label className="text-[13px] font-medium text-foreground flex items-center gap-[6px]">
            <span>📋</span> ประวัติส่วนตัว (Bio)
          </label>
          <textarea
            name="bio"
            value={form.bio}
            onChange={handleChange}
            placeholder="เล่าเกี่ยวกับคุณ"
            rows={4}
            className="border border-border rounded-[8px] px-[12px] py-[10px] text-[14px] outline-none focus:border-primary transition-colors resize-none"
          />
        </div>

        <div className="flex flex-col gap-[6px]">
          <label className="text-[13px] font-medium text-foreground flex items-center gap-[6px]">
            <span>🔗</span> ลิงก์พอร์ตโฟลิโอ
          </label>
          <input
            name="portfolio_url"
            value={form.portfolio_url}
            onChange={handleChange}
            placeholder="https://portfolio.com"
            className="border border-border rounded-[8px] px-[12px] py-[10px] text-[14px] outline-none focus:border-primary transition-colors"
          />
        </div>

        <div className="flex flex-col gap-[6px]">
          <label className="text-[13px] font-medium text-foreground flex items-center gap-[6px]">
            <span>🎯</span> ทักษะ/ความชำนาญ
          </label>
          <input
            name="expertise"
            value={form.expertise}
            onChange={handleChange}
            placeholder="081-234-5678"
            className="border border-border rounded-[8px] px-[12px] py-[10px] text-[14px] outline-none focus:border-primary transition-colors"
          />
        </div>
      </div>

      <button
        onClick={handleSave}
        disabled={isSaving}
        className="w-full bg-primary hover:bg-primary-hover text-white py-[12px] rounded-[10px] text-[14px] font-medium transition-colors disabled:opacity-50 flex items-center justify-center gap-[8px]"
      >
        <ShieldCheck size={16} />
        {isSaving ? "กำลังบันทึก..." : "บันทึกการเปลี่ยนแปลง"}
      </button>
    </div>
  );
};

// ─── Notification Tab ────────────────────────────────────────────────────────
interface NotifItem {
  key: string;
  label: string;
  desc: string;
  defaultOn: boolean;
}

const notifItems: NotifItem[] = [
  { key: "new_investment", label: "การลงทุน", desc: "แจ้งเมื่อมีการลงทุนใหม่", defaultOn: false },
  { key: "milestone", label: "Milestone", desc: "แจ้งเมื่อมีการส่งงานหรืออนุมัติ", defaultOn: false },
  { key: "meeting", label: "การประชุม", desc: "แจ้งเมื่อมีนัดหมายใหม่", defaultOn: false },
  { key: "vote", label: "การลงทุน", desc: "แจ้งเมื่อมีเหตุหรือปิดการโหวต", defaultOn: true },
  { key: "profit", label: "กำไร", desc: "แจ้งเมื่อมีการแจกจ่ายกำไร", defaultOn: true },
  { key: "complaint", label: "การร้องเรียน", desc: "แจ้งเมื่อมีสิทธิพิเศษเรื่องร้องเรียน", defaultOn: true },
];

const NotificationTab = () => {
  const [toggles, setToggles] = useState<Record<string, boolean>>(
    Object.fromEntries(notifItems.map((n) => [n.key, n.defaultOn]))
  );

  const toggle = (key: string) => setToggles((prev) => ({ ...prev, [key]: !prev[key] }));

  return (
    <div className="bg-white border border-border rounded-[16px] p-[24px] flex flex-col gap-[4px]">
      <div className="flex items-center gap-[8px] mb-[16px]">
        <Bell size={18} className="text-foreground" />
        <h2 className="font-semibold text-foreground">ตั้งค่าการแจ้งเตือน</h2>
      </div>

      {notifItems.map((item, idx) => (
        <div
          key={item.key}
          className={`flex items-center justify-between py-[16px] ${idx < notifItems.length - 1 ? "border-b border-border" : ""}`}
        >
          <div>
            <p className="text-[14px] font-medium text-foreground">{item.label}</p>
            <p className="text-[12px] text-muted-foreground mt-[2px]">{item.desc}</p>
          </div>
          <button
            onClick={() => toggle(item.key)}
            className={`w-[48px] h-[26px] rounded-full transition-colors relative ${toggles[item.key] ? "bg-primary" : "bg-[#E9ECEF]"}`}
          >
            <span
              className={`absolute top-[3px] w-[20px] h-[20px] rounded-full bg-white shadow transition-all ${toggles[item.key] ? "left-[25px]" : "left-[3px]"}`}
            />
          </button>
        </div>
      ))}
    </div>
  );
};

// ─── Password Tab ────────────────────────────────────────────────────────────
const PasswordTab = () => {
  const [form, setForm] = useState({ current: "", newPass: "", confirm: "" });
  const [show, setShow] = useState({ current: false, newPass: false, confirm: false });
  const [isSaving, setIsSaving] = useState(false);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setForm((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleSubmit = async () => {
    if (form.newPass !== form.confirm) {
      toast.error("รหัสผ่านใหม่ไม่ตรงกัน");
      return;
    }
    setIsSaving(true);
    try {
      await api.patch("/user/me/password", {
        current_password: form.current,
        new_password: form.newPass,
      });
      toast.success("เปลี่ยนรหัสผ่านสำเร็จ");
      setForm({ current: "", newPass: "", confirm: "" });
    } catch {
      toast.error("รหัสผ่านปัจจุบันไม่ถูกต้อง");
    } finally {
      setIsSaving(false);
    }
  };

  const fields: { key: keyof typeof form; label: string }[] = [
    { key: "current", label: "รหัสผ่านปัจจุบัน" },
    { key: "newPass", label: "รหัสผ่านใหม่" },
    { key: "confirm", label: "ยืนยันรหัสผ่านใหม่" },
  ];

  return (
    <div className="bg-white border border-border rounded-[16px] p-[24px] flex flex-col gap-[20px]">
      <div className="flex items-center gap-[8px]">
        <Lock size={18} className="text-foreground" />
        <h2 className="font-semibold text-foreground">เปลี่ยนรหัสผ่าน</h2>
      </div>

      {fields.map(({ key, label }) => (
        <div key={key} className="flex flex-col gap-[6px]">
          <label className="text-[13px] font-medium text-foreground">{label}</label>
          <div className="relative">
            <input
              name={key}
              type={show[key] ? "text" : "password"}
              value={form[key]}
              onChange={handleChange}
              className="w-full border border-border rounded-[8px] px-[12px] py-[10px] text-[14px] outline-none focus:border-primary transition-colors pr-[40px]"
            />
            <button
              type="button"
              onClick={() => setShow((prev) => ({ ...prev, [key]: !prev[key] }))}
              className="absolute right-[12px] top-1/2 -translate-y-1/2 text-muted-foreground"
            >
              {show[key] ? <EyeOff size={16} /> : <Eye size={16} />}
            </button>
          </div>
        </div>
      ))}

      <button
        onClick={handleSubmit}
        disabled={isSaving}
        className="w-full bg-primary hover:bg-primary-hover text-white py-[12px] rounded-[10px] text-[14px] font-medium transition-colors disabled:opacity-50 flex items-center justify-center gap-[8px]"
      >
        <Lock size={16} />
        {isSaving ? "กำลังบันทึก..." : "เปลี่ยนรหัสผ่าน"}
      </button>
    </div>
  );
};

// ─── Verify Tab ──────────────────────────────────────────────────────────────
const VerifyTab = () => {
  const [studentForm, setStudentForm] = useState({
    university: "",
    faculty: "",
    student_id: "",
  });
  const [bankForm, setBankForm] = useState({
    bank_name: "",
    account_name: "",
    account_number: "",
  });
  const [studentFile, setStudentFile] = useState<File | null>(null);
  const [acceptTerms, setAcceptTerms] = useState(false);
  const [acceptAccuracy, setAcceptAccuracy] = useState(false);
  const [isSavingStudent, setIsSavingStudent] = useState(false);
  const [isSavingBank, setIsSavingBank] = useState(false);

  const handleStudentSubmit = async () => {
    if (!acceptTerms || !acceptAccuracy) {
      toast.error("กรุณายอมรับข้อตกลงก่อน");
      return;
    }
    setIsSavingStudent(true);
    try {
      const formData = new FormData();
      formData.append("university", studentForm.university);
      formData.append("faculty", studentForm.faculty);
      formData.append("student_id", studentForm.student_id);
      if (studentFile) formData.append("file", studentFile);
      await api.post("/user/me/verify/student", formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });
      toast.success("ส่งข้อมูลยืนยันตัวตนแล้ว");
    } catch {
      toast.error("เกิดข้อผิดพลาด");
    } finally {
      setIsSavingStudent(false);
    }
  };

  const handleBankSubmit = async () => {
    setIsSavingBank(true);
    try {
      await api.post("/user/me/verify/bank", bankForm);
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
          { key: "university", label: "มหาวิทยาลัย", placeholder: "มหาวิทยาลัยราชภัฏนครปฐม" },
          { key: "faculty", label: "คณะ", placeholder: "วิทยาศาสตร์เทคโนโลยี" },
          { key: "student_id", label: "รหัสนักศึกษา", placeholder: "66425901" },
        ].map(({ key, label, placeholder }) => (
          <div key={key} className="flex flex-col gap-[6px]">
            <label className="text-[13px] font-medium text-foreground">{label}</label>
            <input
              value={studentForm[key as keyof typeof studentForm]}
              onChange={(e) => setStudentForm((prev) => ({ ...prev, [key]: e.target.value }))}
              placeholder={placeholder}
              className="border border-border rounded-[8px] px-[12px] py-[10px] text-[14px] outline-none focus:border-primary transition-colors"
            />
          </div>
        ))}

        <div className="flex flex-col gap-[6px]">
          <label className="text-[13px] font-medium text-foreground">อัปโหลดบัตรนักศึกษา</label>
          <label className="border-2 border-dashed border-border rounded-[12px] p-[32px] flex flex-col items-center justify-center cursor-pointer hover:border-primary transition-colors">
            <Upload size={24} className="text-muted-foreground mb-[8px]" />
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
          { key: "bank_name", label: "ธนาคาร", placeholder: "" },
          { key: "account_name", label: "ชื่อบัญชี", placeholder: "" },
          { key: "account_number", label: "เลขบัญชี", placeholder: "" },
        ].map(({ key, label, placeholder }) => (
          <div key={key} className="flex flex-col gap-[6px]">
            <label className="text-[13px] font-medium text-foreground">{label}</label>
            <input
              value={bankForm[key as keyof typeof bankForm]}
              onChange={(e) => setBankForm((prev) => ({ ...prev, [key]: e.target.value }))}
              placeholder={placeholder}
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

// ─── Main Component ──────────────────────────────────────────────────────────
const Profile = () => {
  const [activeTab, setActiveTab] = useState<Tab>("profile");

  return (
    <div className="max-w-[670px] mx-auto">
      <h1 className="text-[24px] font-bold text-foreground mb-[24px]">ตั้งค่าโปรไฟล์</h1>

      {/* Tabs */}
      <div className="flex gap-[4px] bg-white border border-border rounded-[10px] p-[4px] w-fit mb-[24px]">
        {tabs.map((tab) => (
          <button
            key={tab.key}
            onClick={() => setActiveTab(tab.key)}
            className={`px-[16px] py-[8px] rounded-[8px] text-[14px] font-medium transition-colors ${
              activeTab === tab.key
                ? "bg-primary text-white"
                : "text-muted-foreground hover:text-foreground hover:bg-[#F1F3F5]"
            }`}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {/* Tab Content */}
      {activeTab === "profile"      && <ProfileTab />}
      {activeTab === "notification" && <NotificationTab />}
      {activeTab === "password"     && <PasswordTab />}
      {activeTab === "verify"       && <VerifyTab />}
    </div>
  );
};

export default Profile;
