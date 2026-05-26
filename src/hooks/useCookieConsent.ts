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

export function useCookieConsent(): CookieConsentState {
  const [status, setStatus] = useState<ConsentStatus>(null);
  const [isPending, setIsPending] = useState(false);

  useEffect(() => {
    try {
      const raw = localStorage.getItem(STORAGE_KEY);
      if (!raw) {
        // ยังไม่เคยเลือก → แสดง banner หลังจาก delay เล็กน้อย
        const t = setTimeout(() => setIsPending(true), 800);
        return () => clearTimeout(t);
      }
      const saved = JSON.parse(raw) as { status: ConsentStatus; version: string };
      if (saved.version !== CONSENT_VERSION) {
        // policy เปลี่ยน → ขอ consent ใหม่
        localStorage.removeItem(STORAGE_KEY);
        const t = setTimeout(() => setIsPending(true), 800);
        return () => clearTimeout(t);
      }
      setStatus(saved.status);
      setIsPending(false);
    } catch {
      setIsPending(true);
    }
  }, []);

  const save = (choice: ConsentStatus) => {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify({ status: choice, version: CONSENT_VERSION }));
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
