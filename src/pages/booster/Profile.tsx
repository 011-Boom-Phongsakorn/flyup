import { useState } from "react";
import { Camera, Lock, Bell, Eye, EyeOff } from "lucide-react";
import { useAuthStore } from "../../store/useAuthStore";
import toast from "react-hot-toast";
import api from "../../services/api";

type Tab = "profile" | "notifications" | "password";

const tabs: { key: Tab; label: string }[] = [
  { key: "profile", label: "โปรไฟล์" },
  { key: "notifications", label: "การแจ้งเตือน" },
  { key: "password", label: "รหัสผ่าน" },
];

// ─── Profile Tab ────────────────────────────────────────────────────────────
const ProfileTab = ({ activeTab }: { activeTab: Tab }) => {
  const { authUser, checkAuth } = useAuthStore();
  const [form, setForm] = useState({
    first_name: (authUser?.first_name as string) ?? "",
    last_name: (authUser?.last_name as string) ?? "",
    phone: (authUser?.phone as string) ?? "",
    address: (authUser?.address as string) ?? "",
    university: (authUser?.university as string) ?? "",
    faculty: (authUser?.faculty as string) ?? "",
  });
  const [isSaving, setIsSaving] = useState(false);

  const displayName =
    [authUser?.first_name, authUser?.last_name].filter(Boolean).join(" ") ||
    authUser?.name ||
    "";
  const displayEmail = authUser?.email || "";
  const profileUrl = (authUser?.profile_url as string) || null;
  const initials = displayName
    ? (displayName.match(/\b\w/g) || []).join("").substring(0, 2).toUpperCase()
    : "?";

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    setForm((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleSave = async () => {
    setIsSaving(true);
    try {
      await api.patch("/user/profile", {
        first_name: form.first_name,
        last_name: form.last_name,
        phone: form.phone,
        address: form.address,
        university: form.university,
        faculty: form.faculty,
      });
      await checkAuth();
      toast.success("บันทึกข้อมูลเรียบร้อยแล้ว");
    } catch {
      toast.error("เกิดข้อผิดพลาดในการบันทึกข้อมูล");
    } finally {
      setIsSaving(false);
    }
  };

  if (activeTab !== "profile") return null;

  return (
    <div className="space-y-6 animate-in fade-in duration-300">
      {/* Header Profile Box */}
      <div className="bg-white border border-border rounded-2xl p-6 flex items-center gap-5">
        <div className="relative">
          <div className="w-16 h-16 rounded-full bg-primary/20 flex items-center justify-center overflow-hidden border-2 border-border font-bold text-xl text-primary">
            {profileUrl ? (
              <img
                src={profileUrl}
                alt="Profile"
                className="w-full h-full object-cover"
              />
            ) : (
              initials
            )}
          </div>
          <button className="absolute -bottom-1 -right-1 bg-primary text-white p-1.5 rounded-full border-2 border-white hover:bg-primary/90 transition-colors">
            <Camera size={12} />
          </button>
        </div>
        <div>
          <h3 className="font-bold text-foreground text-base">
            {displayName || "ไม่มีชื่อ"}
          </h3>
          <p className="text-sm text-muted-foreground">{displayEmail}</p>
        </div>
      </div>

      {/* Profile Form */}
      <div className="bg-white border border-border rounded-2xl p-6 space-y-6">
        <h3 className="font-bold text-foreground text-base">ข้อมูลส่วนตัว</h3>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="flex flex-col gap-2">
            <label className="text-sm font-semibold text-foreground">
              ชื่อ <span className="text-error">*</span>
            </label>
            <input
              name="first_name"
              value={form.first_name}
              onChange={handleChange}
              className="w-full bg-muted/50 border border-border px-4 py-2.5 rounded-xl text-sm focus:outline-none focus:border-primary transition-colors"
            />
          </div>

          <div className="flex flex-col gap-2">
            <label className="text-sm font-semibold text-foreground">
              นามสกุล <span className="text-error">*</span>
            </label>
            <input
              name="last_name"
              value={form.last_name}
              onChange={handleChange}
              className="w-full bg-muted/50 border border-border px-4 py-2.5 rounded-xl text-sm focus:outline-none focus:border-primary transition-colors"
            />
          </div>
        </div>

        <div className="flex flex-col gap-2">
          <label className="text-sm font-semibold text-foreground">อีเมล</label>
          <input
            type="email"
            value={displayEmail}
            disabled
            className="w-full bg-[#F8F9FA] border border-border px-4 py-2.5 rounded-xl text-sm text-muted-foreground cursor-not-allowed"
          />
        </div>

        <div className="flex flex-col gap-2">
          <label className="text-sm font-semibold text-foreground">
            เบอร์โทรศัพท์
          </label>
          <input
            name="phone"
            value={form.phone}
            onChange={handleChange}
            className="w-full bg-muted/50 border border-border px-4 py-2.5 rounded-xl text-sm focus:outline-none focus:border-primary transition-colors"
          />
        </div>

        <div className="flex flex-col gap-2">
          <label className="text-sm font-semibold text-foreground">ที่อยู่</label>
          <input
            name="address"
            value={form.address}
            onChange={handleChange}
            className="w-full bg-muted/50 border border-border px-4 py-2.5 rounded-xl text-sm focus:outline-none focus:border-primary transition-colors"
          />
        </div>

        <div className="flex flex-col gap-2">
          <label className="flex items-center justify-between text-sm font-semibold text-foreground">
            <span>มหาวิทยาลัย <span className="text-error">*</span></span>
          </label>
          <select
            name="university"
            value={form.university}
            onChange={handleChange}
            className="w-full bg-muted/50 border border-border px-4 py-2.5 rounded-xl text-sm focus:outline-none focus:border-primary transition-colors appearance-none"
          >
            <option value="">เลือกมหาวิทยาลัย</option>
            <option value="chula">จุฬาลงกรณ์มหาวิทยาลัย</option>
            <option value="tu">มหาวิทยาลัยธรรมศาสตร์</option>
            <option value="mahidol">มหาวิทยาลัยมหิดล</option>
            <option value="ku">มหาวิทยาลัยเกษตรศาสตร์</option>
            <option value="cmu">มหาวิทยาลัยเชียงใหม่</option>
            <option value="kku">มหาวิทยาลัยขอนแก่น</option>
            <option value="psu">มหาวิทยาลัยสงขลานครินทร์</option>
            <option value="bu">มหาวิทยาลัยกรุงเทพ</option>
          </select>
        </div>

        <div className="flex flex-col gap-2">
          <label className="text-sm font-semibold text-foreground">
            คณะ <span className="text-error">*</span>
          </label>
          <input
            name="faculty"
            value={form.faculty}
            onChange={handleChange}
            placeholder="เช่น คณะวิศวกรรมศาสตร์"
            className="w-full bg-muted/50 border border-border px-4 py-2.5 rounded-xl text-sm focus:outline-none focus:border-primary transition-colors"
          />
        </div>

        <button
          onClick={handleSave}
          disabled={isSaving}
          className="mt-8 w-full bg-primary hover:bg-primary-hover text-white font-bold text-sm py-3 rounded-xl transition-all disabled:opacity-50 flex justify-center items-center gap-2 cursor-pointer"
        >
          {isSaving ? "กำลังบันทึก..." : "บันทึกการเปลี่ยนแปลง"}
        </button>
      </div>
    </div>
  );
};

// ─── Notifications Tab ──────────────────────────────────────────────────────
const NotificationTab = ({ activeTab }: { activeTab: Tab }) => {
  const notifItems = [
    { key: "investment", title: "การลงทุน", desc: "แจ้งเมื่อมีการลงทุนใหม่", defaultOn: false },
    { key: "milestone", title: "Milestone", desc: "แจ้งเมื่อมีการส่งงานหรืออนุมัติ", defaultOn: false },
    { key: "meeting", title: "การประชุม", desc: "แจ้งเมื่อมีนัดหมายใหม่", defaultOn: false },
    { key: "vote", title: "การโหวต", desc: "แจ้งเมื่อเปิดหรือปิดการโหวต", defaultOn: true },
    { key: "profit", title: "กำไร", desc: "แจ้งเมื่อมีการแจกจ่ายกำไร", defaultOn: true },
    { key: "complaint", title: "การร้องเรียน", desc: "แจ้งเมื่อมีอัปเดตเรื่องร้องเรียน", defaultOn: true },
  ];

  const [toggles, setToggles] = useState<Record<string, boolean>>(
    Object.fromEntries(notifItems.map((n) => [n.key, n.defaultOn]))
  );

  const toggle = (key: string) =>
    setToggles((prev) => ({ ...prev, [key]: !prev[key] }));

  if (activeTab !== "notifications") return null;

  return (
    <div className="bg-white border border-border rounded-2xl p-6 animate-in fade-in duration-300">
      <h3 className="flex items-center gap-2 font-bold text-foreground text-base mb-6">
        <Bell size={18} /> ตั้งค่าการแจ้งเตือน
      </h3>

      <div className="space-y-2">
        {notifItems.map((item) => (
          <div
            key={item.key}
            className="flex items-center justify-between p-4 border border-border rounded-xl"
          >
            <div>
              <p className="text-sm font-semibold text-foreground">
                {item.title}
              </p>
              <p className="text-xs text-muted-foreground mt-0.5">
                {item.desc}
              </p>
            </div>
            {/* Toggle */}
            <button
              onClick={() => toggle(item.key)}
              className={`w-[48px] h-[26px] rounded-full transition-colors relative cursor-pointer ${toggles[item.key] ? "bg-primary" : "bg-[#E9ECEF]"
                }`}
            >
              <span
                className={`absolute top-[3px] w-[20px] h-[20px] rounded-full bg-white shadow transition-all ${toggles[item.key] ? "left-[25px]" : "left-[3px]"
                  }`}
              />
            </button>
          </div>
        ))}
      </div>
    </div>
  );
};

// ─── Password Tab ───────────────────────────────────────────────────────────
const PasswordTab = ({ activeTab }: { activeTab: Tab }) => {
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
    if (!form.current || !form.newPass) {
      toast.error("กรุณากรอกรหัสผ่านให้ครบถ้วน");
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
      toast.error("รหัสผ่านปัจจุบันไม่ถูกต้อง หรือเกิดข้อผิดพลาด");
    } finally {
      setIsSaving(false);
    }
  };

  const fields: { key: keyof typeof form; label: string }[] = [
    { key: "current", label: "รหัสผ่านปัจจุบัน" },
    { key: "newPass", label: "รหัสผ่านใหม่" },
    { key: "confirm", label: "ยืนยันรหัสผ่านใหม่" },
  ];

  if (activeTab !== "password") return null;

  return (
    <div className="bg-white border border-border rounded-2xl p-6 space-y-6 animate-in fade-in duration-300">
      <h3 className="flex items-center gap-2 font-bold text-foreground text-base mb-2">
        <Lock size={18} /> เปลี่ยนรหัสผ่าน
      </h3>

      <div className="space-y-4">
        {fields.map(({ key, label }) => (
          <div key={key} className="flex flex-col gap-2">
            <label className="text-sm font-semibold text-foreground">
              {label}
            </label>
            <div className="relative">
              <input
                name={key}
                type={show[key] ? "text" : "password"}
                value={form[key]}
                onChange={handleChange}
                className="w-full bg-muted/50 border border-border px-4 py-2.5 rounded-xl text-sm focus:outline-none focus:border-primary transition-colors pr-10"
              />
              <button
                type="button"
                onClick={() =>
                  setShow((prev) => ({ ...prev, [key]: !prev[key] }))
                }
                className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground cursor-pointer"
              >
                {show[key] ? <EyeOff size={16} /> : <Eye size={16} />}
              </button>
            </div>
          </div>
        ))}
      </div>

      <button
        onClick={handleSubmit}
        disabled={isSaving}
        className="mt-8 w-full bg-primary hover:bg-primary-hover text-white font-bold text-sm py-3 rounded-xl transition-all disabled:opacity-50 flex items-center justify-center gap-2 cursor-pointer"
      >
        <Lock size={16} />
        {isSaving ? "กำลังเปลี่ยน..." : "เปลี่ยนรหัสผ่าน"}
      </button>
    </div>
  );
};

// ─── Main Content ───────────────────────────────────────────────────────────
const Profile = () => {
  const [activeTab, setActiveTab] = useState<Tab>("profile");

  return (
    <div className="max-w-4xl mx-auto px-2">
      {/* Header */}
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-foreground">ตั้งค่าโปรไฟล์</h1>
      </div>

      <div className="space-y-6">
        {/* Tabs UI */}
        <div className="bg-muted p-1 rounded-xl inline-flex flex-wrap gap-1">
          {tabs.map((tab) => (
            <button
              key={tab.key}
              onClick={() => setActiveTab(tab.key)}
              className={`px-6 py-2 rounded-lg text-sm font-semibold transition-all cursor-pointer ${activeTab === tab.key
                  ? "bg-white text-foreground shadow-sm"
                  : "text-muted-foreground hover:text-foreground"
                }`}
            >
              {tab.label}
            </button>
          ))}
        </div>

        {/* Tab Sections */}
        <ProfileTab activeTab={activeTab} />
        <NotificationTab activeTab={activeTab} />
        <PasswordTab activeTab={activeTab} />
      </div>
    </div>
  );
};

export default Profile;
