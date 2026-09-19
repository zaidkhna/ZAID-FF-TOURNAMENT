# 🔥 ZAID FF TOURNAMENT — Mukammal Setup Guide (Urdu)

## 1. Admin Login Kya Hai?
- Website: `https://aapki-website.com/` (sab players ke liye)
- Admin Panel: `https://aapki-website.com/admin` (sirf aap ke liye)
- Username: `zaidkhan_491`
- Password: `hindizone12`

Admin panel alag website NAHI hai — ye isi website ka ek hidden page hai.
Aap ko koi alag file upload nahi karni.

## 2. Files Kahan Hain? (Dono Files Isi Project Me Hain)

### Website ki files:
- `src/app/page.tsx` → Homepage (hero, matches, payment, winners)
- `src/components/HomeClient.tsx` → Homepage ka design + Join form
- `src/app/tournament/[id]/page.tsx` + `DetailClient.tsx` → Har match ka alag page
- `src/lib/constants.ts` → WhatsApp number (03390068468) + Easypaisa/JazzCash/Sadapay number (03302475360)
- `public/images/ff-hero.jpg` + `ff-squad.jpg` → Banner images

### Admin Panel ki files:
- `src/app/admin/page.tsx` → Admin login + Matches / Registrations / Winners manage
- `src/app/api/admin/login/route.ts` → Username/Password check (server side)
- `src/lib/admin.ts` → Admin username/password ka safe store
- `src/app/api/tournaments/route.ts` → Match banana / delete (sirf admin token se)
- `src/app/api/registrations/route.ts` → Slot approve/reject (sirf admin)
- `src/app/api/winners/route.ts` → Winner add/delete (sirf admin)

Matlab: Website + Admin ek hi project hai. Dono ek sath deploy honge.

## 3. Admin File Kahan Upload Karni Hai?
KAHIN NAHI — alag se upload nahi hoti. Poora project ek sath upload/deploy hota hai:

### Option A — Vercel (FREE + Easiest, Recommended):
1. https://github.com par free account banao
2. Is project ka code GitHub par push karo (saari files ek sath)
3. https://vercel.com par login → `Add New Project` → GitHub repo select → Deploy
4. Deploy ke baad milega: `https://zaid-ff-tournament.vercel.app`
   - Players: `...vercel.app/` kholenge
   - Aap: `...vercel.app/admin` khol kar `zaidkhan_491 / hindizone12` se login
5. Vercel → Project Settings → Environment Variables me ye add karo:
   - `DATABASE_URL` = apna Postgres connection (Neon / Supabase free)
   - `ADMIN_USERNAME` = zaidkhan_491
   - `ADMIN_PASSWORD` = hindizone12
   - `ADMIN_TOKEN` = koi lamba secret, e.g. `zaidff-secure-token-491-hindi12`
6. Redeploy karo. Bas!

### Option B — Apna Domain (e.g. zaidfftournament.pk):
1. Pehle Vercel par deploy karo (Option A)
2. Domain khareedo (Namecheap/PK-Domain ~ Rs 3000/saal)
3. Vercel → Domains → apna domain add karo → DNS me A/CNAME record lagao
4. 10 min me `zaidfftournament.pk/admin` live!

### Option C — cPanel Shared Hosting:
Next.js cPanel shared hosting par directly NAHI chalta.
Aap ko VPS lena parega (Hostinger VPS / Contabo ~ $5/month) ya Vercel use karo.
VPS par: Node.js 20 + `npm run build && npm start` + Nginx + Postgres.

## 4. Roz Ka Istemal (Aap Ka Kaam)
1. `/admin` login karo
2. `+ Naya Tournament` se match banao (title, date, entry, prize)
3. Players Join karenge → `Registrations` tab me `pending` ayega
4. WhatsApp par screenshot check kar ke `✅ Approve` dabao
5. Match se 15 min pehle `Matches` me status `live` karo + Room ID/Pass add karo (code me roomId/roomPass field hai)
6. Match ke baad `Winners` me winner add karo → homepage Hall of Fame par show hoga
7. Prize Easypaisa/JazzCash 03302475360 se bhejo

## 5. Username/Password Change Karna Ho To?
- `src/lib/admin.ts` kholo → `zaidkhan_491` / `hindizone12` badlo
- Ya hosting ke Environment Variables me `ADMIN_USERNAME` / `ADMIN_PASSWORD` badlo (code change ke baghair, zyada safe)

## 6. Files Download / Backup Kaise Lein?
- Agar code GitHub par hai → GitHub → `Code` → `Download ZIP` → poori website + admin ek zip me mil jayegi
- Is me upar wali saari files hongi — alag alag bhejne ki zaroorat nahi

## 7. Zaroori Numbers (Website Me Already Lage Hain)
- WhatsApp (slots/support): 0339 0068468 → wa.me/923390068468
- Easypaisa / JazzCash / Sadapay: 0330 2475360 (Title: Zaid)

Koi masla ho to `/admin` me login ke neeche guide bhi likhi hai.
— Made for ZAID FF TOURNAMENT 🇵🇰
