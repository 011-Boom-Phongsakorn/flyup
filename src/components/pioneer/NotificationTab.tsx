import { useState } from "react";
import { Bell } from "lucide-react";

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

export default NotificationTab;
