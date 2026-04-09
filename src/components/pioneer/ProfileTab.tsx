import { useState, useRef, useEffect } from "react";
import { ShieldCheck, Camera, Phone, Briefcase, Link, FileBraces, Mail } from "lucide-react";
import { useAuthStore } from "../../store/useAuthStore";
import toast from "react-hot-toast";
import api from "../../services/api";

const ProfileTab = () => {
  const { authUser, checkAuth } = useAuthStore();
  const [form, setForm] = useState({
    first_name: (authUser?.first_name as string) ?? "",
    last_name: (authUser?.last_name as string) ?? "",
    phone: (authUser?.phone as string) ?? "",
    bio: authUser?.student_profile?.bio ?? "",
    portfolio: authUser?.student_profile?.portfolio ?? "",
    skills: authUser?.student_profile?.skills ?? "",
  });
  const [isSaving, setIsSaving] = useState(false);
  const [isUploadingPicture, setIsUploadingPicture] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  // sync form เมื่อ authUser เปลี่ยน (หลัง checkAuth)
  useEffect(() => {
    setForm({
      first_name: (authUser?.first_name as string) ?? "",
      last_name: (authUser?.last_name as string) ?? "",
      phone: (authUser?.phone as string) ?? "",
      bio: authUser?.student_profile?.bio ?? "",
      portfolio: authUser?.student_profile?.portfolio ?? "",
      skills: authUser?.student_profile?.skills ?? "",
    });
  }, [authUser]);

  const initials = `${form.first_name[0] ?? ""}${form.last_name[0] ?? ""}`.toUpperCase() || "?";

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setForm((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handlePictureChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setIsUploadingPicture(true);
    try {
      const formData = new FormData();
      formData.append("file", file);
      const uploadRes = await api.post("/upload", formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });
      const pictureUrl: string = uploadRes.data.data.url;
      await api.patch("/user/profile", { picture: pictureUrl });
      await checkAuth();
      toast.success("เปลี่ยนรูปโปรไฟล์สำเร็จ");
    } catch {
      toast.error("อัปโหลดรูปไม่สำเร็จ");
    } finally {
      setIsUploadingPicture(false);
      if (fileInputRef.current) fileInputRef.current.value = "";
    }
  };

  const handleSave = async () => {
    setIsSaving(true);
    try {
      await api.patch("/user/profile", {
        first_name: form.first_name,
        last_name: form.last_name,
        phone: form.phone,
        bio: form.bio || undefined,
        portfolio: form.portfolio || undefined,
        skills: form.skills || undefined,
      });
      await checkAuth();
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
          {authUser?.picture ? (
            <img src={authUser.picture} alt="avatar" className="w-[72px] h-[72px] rounded-full object-cover" />
          ) : (
            <div className="w-[72px] h-[72px] rounded-full bg-primary/20 flex items-center justify-center text-primary text-[22px] font-bold">
              {initials}
            </div>
          )}
          <button
            onClick={() => fileInputRef.current?.click()}
            disabled={isUploadingPicture}
            className="absolute bottom-0 right-0 w-[22px] h-[22px] bg-primary rounded-full flex items-center justify-center disabled:opacity-60 cursor-pointer"
          >
            <Camera size={12} className="text-white" />
          </button>
          <input
            ref={fileInputRef}
            type="file"
            accept="image/*"
            className="hidden"
            onChange={handlePictureChange}
          />
        </div>
        <div>
          <p className="font-semibold text-foreground">{authUser?.first_name as string} {authUser?.last_name as string}</p>
          <p className="text-[13px] text-muted-foreground">{authUser?.email as string}</p>
        </div>
      </div>

      {/* ข้อมูลส่วนตัว */}
      <div className="bg-white border border-border rounded-[16px] p-[24px] flex flex-col gap-[20px]">
        <h2 className="font-semibold text-foreground">ข้อมูลส่วนตัว</h2>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-[16px]">
          <div className="flex flex-col gap-[6px]">
            <label className="text-[13px] font-medium text-foreground">ชื่อ <span className="text-error">*</span></label>
            <input
              name="first_name"
              value={form.first_name}
              onChange={handleChange}
              className="border border-border rounded-[8px] px-[12px] py-[10px] text-[14px] outline-none focus:border-primary transition-colors"
            />
          </div>
          <div className="flex flex-col gap-[6px]">
            <label className="text-[13px] font-medium text-foreground">นามสกุล <span className="text-error">*</span></label>
            <input
              name="last_name"
              value={form.last_name}
              onChange={handleChange}
              className="border border-border rounded-[8px] px-[12px] py-[10px] text-[14px] outline-none focus:border-primary transition-colors"
            />
          </div>
        </div>

        <div className="flex flex-col gap-[6px]">
          <label className="text-[13px] font-medium text-foreground flex items-center gap-[6px]">
            <span><Mail size={14} /></span> อีเมล
          </label>
          <input
            value={(authUser?.email as string) ?? ""}
            disabled
            className="border border-border rounded-[8px] px-[12px] py-[10px] text-[14px] bg-[#F8F9FA] text-muted-foreground cursor-not-allowed"
          />
        </div>

        <div className="flex flex-col gap-[6px]">
          <label className="text-[13px] font-medium text-foreground flex items-center gap-[6px]">
            <span><Phone size={14} /></span> เบอร์โทรศัพท์
          </label>
          <input
            name="phone"
            value={form.phone}
            onChange={handleChange}
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
            <span><Briefcase size={14} /></span> ประวัติส่วนตัว (Bio)
          </label>
          <textarea
            name="bio"
            value={form.bio}
            onChange={handleChange}
            rows={4}
            className="border border-border rounded-[8px] px-[12px] py-[10px] text-[14px] outline-none focus:border-primary transition-colors resize-none"
          />
        </div>

        <div className="flex flex-col gap-[6px]">
          <label className="text-[13px] font-medium text-foreground flex items-center gap-[6px]">
            <span><Link size={14} /></span> ลิงก์พอร์ตโฟลิโอ
          </label>
          <input
            name="portfolio"
            value={form.portfolio}
            onChange={handleChange}
            className="border border-border rounded-[8px] px-[12px] py-[10px] text-[14px] outline-none focus:border-primary transition-colors"
          />
        </div>

        <div className="flex flex-col gap-[6px]">
          <label className="text-[13px] font-medium text-foreground flex items-center gap-[6px]">
            <span><FileBraces size={14} /></span> ทักษะ/ความชำนาญ
          </label>
          <input
            name="skills"
            value={form.skills}
            onChange={handleChange}
            className="border border-border rounded-[8px] px-[12px] py-[10px] text-[14px] outline-none focus:border-primary transition-colors"
          />
        </div>
      </div>

      <button
        onClick={handleSave}
        disabled={isSaving}
        className="w-full bg-primary hover:bg-primary-hover text-white py-[12px] rounded-[10px] text-[14px] font-medium transition-colors disabled:opacity-50 flex items-center justify-center gap-[8px] cursor-pointer"
      >
        <ShieldCheck size={16} />
        {isSaving ? "กำลังบันทึก..." : "บันทึกการเปลี่ยนแปลง"}
      </button>
    </div>
  );
};

export default ProfileTab;
