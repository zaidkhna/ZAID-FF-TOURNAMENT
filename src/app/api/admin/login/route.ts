import { NextResponse } from "next/server";
import { ADMIN_TOKEN, isValidAdmin } from "@/lib/admin";

export async function POST(req: Request) {
  try {
    const { username, password } = await req.json();
    if (!username || !password) {
      return NextResponse.json({ error: "Username aur Password dono likho" }, { status: 400 });
    }
    if (isValidAdmin(String(username).trim(), String(password))) {
      return NextResponse.json({ ok: true, token: ADMIN_TOKEN, username: String(username).trim() });
    }
    return NextResponse.json({ error: "Ghalat Username ya Password!" }, { status: 401 });
  } catch {
    return NextResponse.json({ error: "Login failed" }, { status: 500 });
  }
}
