import { useState } from "react";
import { Lock, Eye, EyeOff } from "lucide-react";
import toast from "react-hot-toast";
import api from "../../services/api";
import { AxiosError } from "axios";
import { useAuthStore } from "../../store/useAuthStore";

const PasswordTab = () => {
  const { authUser, checkAuth } = useAuthStore();
  const hasPassword = authUser?.has_password ?? true;
  const hasGoogleSub = !!authUser?.google_sub;
  const isSettingPassword = !hasPassword && hasGoogleSub;

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
    if (form.newPass.length < 8) {
      toast.error("รหัสผ่านใหม่ต้องมีอย่างน้อย 8 ตัวอักษร");
      return;
    }
    setIsSaving(true);
    try {
      if (isSettingPassword) {
        await api.put("/user/add-password", { new_password: form.newPass });
        toast.success("ตั้งรหัสผ่านสำเร็จ");
        await checkAuth();
      } else {
        await api.put("/user/change-password", {
          old_password: form.current,
          new_password: form.newPass,
        });
        toast.success("เปลี่ยนรหัสผ่านสำเร็จ");
      }
      setForm({ current: "", newPass: "", confirm: "" });
    } catch (error) {
      const msg = error instanceof AxiosError ? error.response?.data?.message : null;
      if (msg === "can't not use old password as new password") {
        toast.error("ไม่สามารถใช้รหัสผ่านเดิมได้");
      } else if (msg === "password is incorrect") {
        toast.error("รหัสผ่านปัจจุบันไม่ถูกต้อง");
      } else {
        toast.error("เกิดข้อผิดพลาด กรุณาลองใหม่");
      }
    } finally {
      setIsSaving(false);
    }
  };

  const fields: { key: keyof typeof form; label: string }[] = isSettingPassword
    ? [
        { key: "newPass", label: "รหัสผ่านใหม่" },
        { key: "confirm", label: "ยืนยันรหัสผ่านใหม่" },
      ]
    : [
        { key: "current", label: "รหัสผ่านปัจจุบัน" },
        { key: "newPass", label: "รหัสผ่านใหม่" },
        { key: "confirm", label: "ยืนยันรหัสผ่านใหม่" },
      ];

  const title = isSettingPassword ? "ตั้งรหัสผ่าน" : "เปลี่ยนรหัสผ่าน";

  return (
    <div className="bg-white border border-border rounded-[16px] p-[24px] flex flex-col gap-[20px]">
      <div className="flex items-center gap-[8px]">
        <Lock size={18} className="text-foreground" />
        <h2 className="font-semibold text-foreground">{title}</h2>
      </div>

      {isSettingPassword && (
        <p className="text-[13px] text-muted-foreground -mt-[8px]">
          บัญชีของคุณใช้ Google เข้าสู่ระบบ คุณสามารถตั้งรหัสผ่านเพื่อใช้เข้าสู่ระบบด้วยอีเมลได้
        </p>
      )}

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
        {isSaving ? "กำลังบันทึก..." : title}
      </button>
    </div>
  );
};

export default PasswordTab;
