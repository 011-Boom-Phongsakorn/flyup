import { useEffect } from 'react';

const SITE_NAME = 'FlyUp';
const BASE_URL = 'https://www.fly-up.app';
const DEFAULT_IMAGE = `${BASE_URL}/og-image.png`;
const DEFAULT_DESCRIPTION =
  'FlyUp คือแพลตฟอร์มระดมทุนสำหรับโปรเจกต์ซอฟต์แวร์ของนักศึกษาไทย เปิดโอกาสให้นักลงทุนสนับสนุนไอเดียที่มีศักยภาพ';

interface SEOOptions {
  title?: string;
  description?: string;
  image?: string | null;
  url?: string;
  type?: 'website' | 'article';
  /** ถ้า true → title จะใช้แค่ title เลย ไม่ต่อท้าย " — FlyUp" */
  exactTitle?: boolean;
}

/**
 * useSEO — อัปเดต <title> และ <meta> tags แบบ dynamic สำหรับแต่ละหน้า
 *
 * @example
 * useSEO({ title: 'UniTrack V.2', description: project.description, image: project.cover_image })
 */
export function useSEO({
  title,
  description = DEFAULT_DESCRIPTION,
  image,
  url,
  type = 'website',
  exactTitle = false,
}: SEOOptions = {}) {
  const fullTitle = title
    ? exactTitle
      ? title
      : `${title} — ${SITE_NAME}`
    : `${SITE_NAME} — แพลตฟอร์มระดมทุนโปรเจกต์ซอฟต์แวร์นักศึกษา`;

  const ogImage = image
    ? image.startsWith('http')
      ? image
      : `${BASE_URL}${image}`
    : DEFAULT_IMAGE;

  const canonicalUrl = url
    ? url.startsWith('http')
      ? url
      : `${BASE_URL}${url}`
    : typeof window !== 'undefined'
    ? window.location.href
    : BASE_URL;

  useEffect(() => {
    // <title>
    document.title = fullTitle;

    // helper: upsert <meta> tag
    const setMeta = (selector: string, attr: string, value: string) => {
      let el = document.querySelector<HTMLMetaElement>(selector);
      if (!el) {
        el = document.createElement('meta');
        if (selector.includes('property=')) {
          el.setAttribute('property', selector.match(/property="([^"]+)"/)?.[1] ?? '');
        } else {
          el.setAttribute('name', selector.match(/name="([^"]+)"/)?.[1] ?? '');
        }
        document.head.appendChild(el);
      }
      el.setAttribute(attr, value);
    };

    // helper: upsert <link> tag
    const setLink = (rel: string, value: string) => {
      let el = document.querySelector<HTMLLinkElement>(`link[rel="${rel}"]`);
      if (!el) {
        el = document.createElement('link');
        el.setAttribute('rel', rel);
        document.head.appendChild(el);
      }
      el.setAttribute('href', value);
    };

    // standard meta
    setMeta('meta[name="description"]', 'content', description);

    // Open Graph
    setMeta('meta[property="og:title"]', 'content', fullTitle);
    setMeta('meta[property="og:description"]', 'content', description);
    setMeta('meta[property="og:image"]', 'content', ogImage);
    setMeta('meta[property="og:url"]', 'content', canonicalUrl);
    setMeta('meta[property="og:type"]', 'content', type);

    // Twitter
    setMeta('meta[name="twitter:title"]', 'content', fullTitle);
    setMeta('meta[name="twitter:description"]', 'content', description);
    setMeta('meta[name="twitter:image"]', 'content', ogImage);

    // Canonical
    setLink('canonical', canonicalUrl);
  }, [fullTitle, description, ogImage, canonicalUrl, type]);
}

export default useSEO;
