import { create } from 'zustand';

// ─── Types ───────────────────────────────────────────────────────────────────

export interface Milestone {
  phase: number;
  title: string;
  description: string;
  deadline: string;
  amount: number;
  status: "completed" | "pending";
  deliverables: string[];
}

export interface Update {
  date: string;
  title: string;
  description: string;
}

export interface Comment {
  id: number;
  user: string;
  badge: string;
  time: string;
  text: string;
}

export interface Question {
  id: number;
  question: string;
  answer: string;
}

export type Tab = "story" | "milestone" | "updates" | "comments" | "questions";

// ─── Store Interface ─────────────────────────────────────────────────────────

interface ProjectDetailState {
  // UI State
  activeTab: Tab;
  selectedImage: number;

  // User State
  isLoggedIn: boolean;
  hasInvested: boolean;

  // Funding State
  fundedPercent: number;
  fundedAmount: number;
  targetAmount: number;

  // Data
  projectImages: string[];
  milestones: Milestone[];
  updates: Update[];
  comments: Comment[];
  questions: Question[];

  // Actions
  setActiveTab: (tab: Tab) => void;
  setSelectedImage: (index: number) => void;
  setIsLoggedIn: (loggedIn: boolean) => void;
  setHasInvested: (invested: boolean) => void;
  updateFunding: (amount: number, percent: number) => void;
}

// ─── Mock Data ────────────────────────────────────────────────────────────────

const projectImages = [
  "https://images.unsplash.com/photo-1524661135-423995f22d0b?auto=format&fit=crop&q=80&w=1200",
  "https://images.unsplash.com/photo-1551288049-bebda4e38f71?auto=format&fit=crop&q=80&w=1200",
  "https://images.unsplash.com/photo-1526374965328-7f61d4dc18c5?auto=format&fit=crop&q=80&w=1200",
  "https://images.unsplash.com/photo-1569336415962-a4bd9f69cd83?auto=format&fit=crop&q=80&w=1200",
  "https://images.unsplash.com/photo-1498050108023-c5249f4df085?auto=format&fit=crop&q=80&w=1200",
];

const milestones: Milestone[] = [
  {
    phase: 1,
    title: "Phase 1: ต้นแบบ (Prototype)",
    description: "สร้าง MVP พร้อมระบบแผนที่พื้นฐาน",
    deadline: "15 ม.ค. 2026",
    amount: 10000,
    status: "completed",
    deliverables: ["Wireframe & UI Design", "ระบบแผนที่พื้นฐาน", "API Backend เบื้องต้น"],
  },
  {
    phase: 2,
    title: "Phase 2: เปิดตัว Beta",
    description: "พัฒนาฟีเจอร์หลักและทดสอบกับผู้ใช้จริง",
    deadline: "15 ก.พ. 2026",
    amount: 20000,
    status: "pending",
    deliverables: ["Indoor Navigation", "ปฏิทินกิจกรรม", "ระบบค้นหา", "Beta Testing กับ 50 คน"],
  },
  {
    phase: 3,
    title: "Phase 3: เปิดตัวเต็มรูปแบบ",
    description: "เปิดตัวแอปบน App Store และ Play Store",
    deadline: "15 มี.ค. 2026",
    amount: 10000,
    status: "pending",
    deliverables: ["แจ้งเตือนอัจฉริยะ", "AI Route Optimization", "เผยแพร่บน Store", "Marketing"],
  },
  {
    phase: 4,
    title: "Phase 4: ขยายผลและเติบโต",
    description: "ขยายฐานผู้ใช้และพัฒนาฟีเจอร์เพิ่มเติม",
    deadline: "15 เม.ย. 2026",
    amount: 10000,
    status: "pending",
    deliverables: ["ระบบแนะนำเส้นทาง AI", "รองรับหลายมหาวิทยาลัย", "ระบบ Analytics", "Community Features"],
  },
];

const updates: Update[] = [
  {
    date: "10 ก.พ. 2026",
    title: "Beta Version พร้อมแล้ว!",
    description: "เราเพิ่งปล่อย Beta version ให้นักศึกษา 50 คนทดสอบ Feedback เป็นบวกมาก!",
  },
  {
    date: "25 ม.ค. 2026",
    title: "ออกแบบ UI เสร็จสมบูรณ์",
    description: "ทีม UX ออกแบบเสร็จแล้ว ตอนนี้อยู่ระหว่างพัฒนา",
  },
];

const comments: Comment[] = [
  {
    id: 1,
    user: "วิชัย สนั่นสนุก",
    badge: "ผู้ลงทุน",
    time: "2 ชม. ที่แล้ว",
    text: "ผมมีคำถามครับ สำหรับว่า มีกีน Dev ออกมะจัดหาคนเพื่อทำให้กับเวลาส่งมอบอย่างไร?",
  },
  {
    id: 2,
    user: "วิชัย สนั่นสนุก",
    badge: "ผู้ลงทุน",
    time: "2 ชม. ที่แล้ว",
    text: "โปรเจคนี้น่าลงทุนมากครับ ผมลงทุนไป 2,000 บาท รอดู Phase 2 อยู่!",
  },
  {
    id: 3,
    user: "วิชัย สนั่นสนุก",
    badge: "ผู้ลงทุน",
    time: "2 ชม. ที่แล้ว",
    text: "โปรเจคนี้น่าลงทุนมากครับ ผมลงทุนไป 2,000 บาท รอดู Phase 2 อยู่!",
  },
];

const questions: Question[] = [
  {
    id: 1,
    question: "เงินลงทุนจะถูกใช้อย่างไร?",
    answer: "เงินจะถูกแบ่งตาม Milestone — ปล่อยเงินเมื่อผ่านการโหวตจาก Booster ในแต่ละ Phase",
  },
  {
    id: 2,
    question: "เงินลงทุนจะถูกใช้อย่างไร?",
    answer: "เงินจะถูกแบ่งตาม Milestone — ปล่อยเงินเมื่อผ่านการโหวตจาก Booster ในแต่ละ Phase",
  },
  {
    id: 3,
    question: "เงินลงทุนจะถูกใช้อย่างไร?",
    answer: "เงินจะถูกแบ่งตาม Milestone — ปล่อยเงินเมื่อผ่านการโหวตจาก Booster ในแต่ละ Phase",
  },
];

// ─── Store Implementation ────────────────────────────────────────────────────

export const useProjectDetailStore = create<ProjectDetailState>((set) => ({
  // Initial UI State
  activeTab: "story",
  selectedImage: 0,

  // Initial User State
  isLoggedIn: false,
  hasInvested: false,

  // Initial Funding State
  fundedPercent: 72,
  fundedAmount: 36000,
  targetAmount: 50000,

  // Data
  projectImages,
  milestones,
  updates,
  comments,
  questions,

  // Actions
  setActiveTab: (tab) => set({ activeTab: tab }),
  setSelectedImage: (index) => set({ selectedImage: index }),
  setIsLoggedIn: (loggedIn) => set({ isLoggedIn: loggedIn }),
  setHasInvested: (invested) => set({ hasInvested: invested }),
  updateFunding: (amount, percent) => set({
    fundedAmount: amount,
    fundedPercent: percent
  }),
}));