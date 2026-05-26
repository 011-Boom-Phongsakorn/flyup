import { useState, useEffect } from 'react';

export type ConsentStatus = 'accepted' | 'declined' | null;

const STORAGE_KEY = 'flyup_cookie_consent';
const CONSENT_VERSION = '1'; // เพิ่มเลขนี้เมื่อ policy เปลี่ยน เพื่อให้ user ต้องยืนยันใหม่

export interface CookieConsentState {
  status: ConsentStatus;
  /** true = ยังไม่ได้ตัดสินใจ → ต้องแสดง banner */
  isPending: boolean;
  accept: () => void;
  decline: () => void;
  /** เปิด banner อีกครั้ง (จาก footer "จัดการ Cookie") */
  reopen: () => void;
}

/** อ่าน localStorage และ validate version — คืน null ถ้ายังไม่มีหรือ version ไม่ตรง */
function readStoredConsent(): ConsentStatus | null {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return null;
    const saved = JSON.parse(raw) as { status: ConsentStatus; version: string };
    if (saved.version !== CONSENT_VERSION) {
      localStorage.removeItem(STORAGE_KEY);
      return null;
    }
    return saved.status;
  } catch {
    return null;
  }
}

export function useCookieConsent(): CookieConsentState {
  // Lazy initializer: อ่าน localStorage ตอน mount ครั้งแรกเลย ไม่ต้องผ่าน useEffect
  const [status, setStatus] = useState<ConsentStatus>(() => readStoredConsent());
  const [isPending, setIsPending] = useState(false);

  useEffect(() => {
    // ถ้าอ่านแล้วยังไม่มี consent → แสดง banner หลัง delay 800ms
    if (status === null) {
      const t = setTimeout(() => setIsPending(true), 800);
      return () => clearTimeout(t);
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []); // run once on mount เท่านั้น

  const save = (choice: ConsentStatus) => {
    try {
      localStorage.setItem(
        STORAGE_KEY,
        JSON.stringify({ status: choice, version: CONSENT_VERSION }),
      );
    } catch { /* storage full — ignore */ }
    setStatus(choice);
    setIsPending(false);
  };

  return {
    status,
    isPending,
    accept: () => save('accepted'),
    decline: () => save('declined'),
    reopen: () => setIsPending(true),
  };
}
