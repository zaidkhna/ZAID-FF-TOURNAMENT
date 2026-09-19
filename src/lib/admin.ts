// Admin credentials — Zaid bhai ka login
// Production me Vercel/Hosting ke Environment Variables me bhi ye set karna:
// ADMIN_USERNAME=zaidkhan_491 , ADMIN_PASSWORD=hindizone12

export const ADMIN_USERNAME = process.env.ADMIN_USERNAME || "zaidkhan_491";
export const ADMIN_PASSWORD = process.env.ADMIN_PASSWORD || "hindizone12";

// Ye secret token login ke baad browser ko milta hai.
// Har Add/Edit/Delete request isi token se verify hoti hai.
export const ADMIN_TOKEN =
  process.env.ADMIN_TOKEN || "zaidff-secure-token-491-hindi12";

export function isValidAdmin(username: string, password: string) {
  return username === ADMIN_USERNAME && password === ADMIN_PASSWORD;
}

export function isValidToken(token: string | null) {
  if (!token) return false;
  return token === ADMIN_TOKEN;
}
