# คู่มือการเทสต์ FlyUp Frontend

โปรเจกต์นี้มีเทสต์ 2 แบบ แยกกันชัดเจน:

| แบบ | เครื่องมือ | อยู่ที่ | รันที่ไหน |
|-----|-----------|--------|-----------|
| Unit / Component | Vitest + React Testing Library | `src/**/*.test.ts(x)` | ในโปรเจกต์ `flyup` |
| End-to-End (E2E) | Playwright (TypeScript) | โฟลเดอร์แยก `e2e/` | มี `package.json` ของตัวเอง |

---

## 1. Unit Test (Vitest)

### ติดตั้ง (ครั้งแรก)

deps ถูกเพิ่มไว้ใน `package.json` แล้ว แค่รัน:

```bash
npm install
```

### รัน

```bash
npm run test          # watch mode (รันใหม่อัตโนมัติเวลาแก้ไฟล์)
npm run test:run      # รันครั้งเดียว (ใช้ใน CI)
npm run test:coverage # รัน + รายงาน coverage (โฟลเดอร์ coverage/)
```

### unit test "ทำยังไง" — แนวคิด

หลักคือ **แยกสิ่งที่จะเทสต์ออกจากของจริง (network, store)** ด้วยการ mock แล้วเช็คว่า
logic ทำงานถูกต้อง มี 3 ระดับที่ใช้ในโปรเจกต์นี้ (ดูเป็นตัวอย่างได้):

**1) ฟังก์ชันบริสุทธิ์ (pure function)** — ง่ายสุด ไม่ต้อง mock อะไร
ดู `src/lib/utils.test.ts`
```ts
import { cn } from './utils'
expect(cn('p-2', 'p-4')).toBe('p-4')
```

**2) Zustand store / logic ที่เรียก API** — mock `services/api` กับ `react-hot-toast`
ดู `src/store/useAuthStore.test.ts`
```ts
// ใช้ vi.hoisted เพราะ vi.mock ถูกยกขึ้นไปบนสุดของไฟล์
const { mockApi } = vi.hoisted(() => ({ mockApi: { get: vi.fn(), post: vi.fn() } }))
vi.mock('../services/api', () => ({ default: mockApi, setStoredToken: vi.fn(), clearStoredTokens: vi.fn() }))

mockApi.post.mockResolvedValueOnce({ data: { token: 'jwt' } })
await useAuthStore.getState().login({ email, password })
expect(useAuthStore.getState().authUser).toEqual(...)
```

**3) React component** — render ด้วย RTL แล้วจำลองผู้ใช้ด้วย `userEvent`
ดู `src/pages/public/Login.test.tsx`
```ts
render(<MemoryRouter><Login /></MemoryRouter>)
await user.type(screen.getByTestId('login-email'), 'user@flyup.dev')
await user.click(screen.getByTestId('login-submit'))
expect(mockLogin).toHaveBeenCalledWith({ email: 'user@flyup.dev', password: '...' })
```

### ข้อควรระวังที่เจอจริงในโปรเจกต์นี้
- `vi.mock(...)` ถูก hoist ขึ้นบนสุด ห้าม reference ตัวแปรข้างนอกโดยตรง — ใช้ `vi.hoisted()` ครอบ
- ช่อง `<input type="email">` มี **native validation ของ browser** ถ้าใส่ค่าที่ผิดรูปแบบสุด ๆ
  (เช่น `not-an-email`) browser จะบล็อกการ submit ก่อน โค้ด validate ของเราไม่ทำงาน
  → ถ้าจะเทสต์ regex ของแอป ให้ใช้ค่าที่ผ่าน native แต่ไม่ผ่าน regex เช่น `bad@x`

### ไฟล์ config + helper
- `vitest.config.ts` — environment `jsdom`, alias `@`, setup file
- `src/test/setup.ts` — โหลด jest-dom matchers, cleanup, stub `matchMedia`/`scrollTo`
- `src/test/storeKit.ts` — helper ใช้ร่วมกันใน store test: `makeApiMock()`, `makeToast()`,
  `res()` (ห่อ `{data:{data}}`), `resTop()` (ห่อ `{data}`), `apiError()` (สร้าง AxiosError)

### Coverage ปัจจุบัน (logic layer ครบ)
- **Stores (26/26)** — มี `.test.ts` ครบทุก store ทดสอบ action หลัก (success + failure):
  auth, project, publicProject, projectDetail, booster, investment, meeting, milestone,
  notification, chat, complaint, refund, disbursement, finance, verification,
  selfVerification, pioneerProfit, pioneerPayout, adminStore, adminCategory, adminLog,
  adminProfitPool, + badge stores (pioneer/booster/admin)
- **Hooks (4/4)** — useCookieConsent, useSEO, useCreateProjectGuard, useNotificationSSE
- **Pure helpers** — `lib/utils.ts` (`cn`), `lib/project.ts` (`getProgress`, `getDaysLeft`)
- **Component** — `pages/public/Login.tsx`

รวม ~124 unit tests / ~31 ไฟล์ รันผ่านทั้งหมด

### แพตเทิร์น mock ที่ใช้ (กันปัญหา hoisting ของ vi.mock)
```ts
import { makeApiMock, makeToast, type ApiMock, res } from '../test/storeKit'
vi.mock('../services/api', () => ({ default: makeApiMock() }))
vi.mock('react-hot-toast', () => { const t = makeToast(); return { default: t, toast: t } })
import api from '../services/api'
import { useXStore } from './useXStore'
const apiMock = api as unknown as ApiMock     // จับ spy ผ่าน import ที่ถูก mock แล้ว

apiMock.get.mockResolvedValueOnce(res([{ id: 1 }]))
await useXStore.getState().fetchThings()
expect(apiMock.get).toHaveBeenCalledWith('/things')
```
สร้าง spy *ข้างใน* factory แล้วดึงผ่าน import ที่ mock แล้ว — ไม่ต้องใช้ตัวแปร module-level
ใน factory (ซึ่งจะ error เพราะ vi.mock ถูก hoist ขึ้นบนสุด)

---

## 2. E2E Test (Playwright)

อยู่ในโฟลเดอร์ **`e2e/`** ที่ **root ของโปรเจกต์** (ระดับเดียวกับ `flyup/` ไม่ได้อยู่ข้างใน)
มี `package.json` เอง ไม่ปนกับ deps ของแอป
**ไม่ต้องมี backend จริง** — ทุก API call ถูก mock ไว้ใน `e2e/fixtures/auth.ts`

```
flyupdiwa/
├── flyup/          # แอป React
├── FlyUps-backend/
└── e2e/            # ← Playwright tests
```

```bash
cd ../e2e            # จาก flyup ขึ้นไป root แล้วเข้า e2e
npm install
npm run install:browsers   # โหลด Chromium (ครั้งแรก)
npm test                   # รัน headless
npm run test:ui            # โหมด UI แบบ interactive
```

config จะ start `npm run dev` (Vite ใน `../flyup`) ให้อัตโนมัติก่อนรัน

ครอบคลุม:
- หน้า public (Home/Projects) + ฟอร์ม login/register + login flow
- routing guard ของทั้ง 3 role (pioneer / booster / admin)
- **`pages.spec.ts` — smoke test ทุก route** (public + pioneer + booster + admin)
  เช็คว่าแต่ละหน้าเข้าได้ตาม role และ render ขึ้นจริง (ไม่ crash เป็นจอว่าง)

ดูรายละเอียดเพิ่มใน `e2e/README.md`

---

## 3. สถานะ data-testid (สำหรับเขียนเทสต์)

เพิ่ม `data-testid` ในหน้า public หลักให้แล้วในรอบนี้:

- **Login**: `login-form`, `login-email`, `login-password`, `login-submit`, `login-google`
- **Register**: `register-form`, `register-role-pioneer`, `register-role-booster`,
  `register-first-name`, `register-last-name`, `register-email`, `register-phone`,
  `register-password`, `register-confirm-password`, `register-accept-terms`, `register-submit`
- **Home**: `home-hero`, `home-browse-projects`, `project-card`
- **Projects**: `projects-search`, `project-card`

หน้าอื่น (admin tabs, verify, step forms ฯลฯ) มี `data-testid` อยู่บางส่วนแล้ว
เวลาจะเขียนเทสต์หน้าใหม่ ถ้า element ยังไม่มี id ให้เพิ่ม `data-testid="ชื่อ-แบบ-kebab"`
ในคอมโพเนนต์ แล้วเลือกด้วย `getByTestId(...)` (เสถียรกว่าการพึ่ง text หรือ CSS class)
