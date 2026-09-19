import { NextResponse } from "next/server";
import { db } from "@/db";
import { winners } from "@/db/schema";
import { desc, eq } from "drizzle-orm";
import { isValidToken } from "@/lib/admin";

function checkAdmin(req: Request) {
  return isValidToken(req.headers.get("x-admin-token"));
}

export async function GET() {
  try {
    const rows = await db.select().from(winners).orderBy(desc(winners.createdAt)).limit(30);
    return NextResponse.json(rows);
  } catch (e) {
    console.error(e);
    return NextResponse.json({ error: "Failed" }, { status: 500 });
  }
}

export async function POST(req: Request) {
  try {
    if (!checkAdmin(req)) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    const body = await req.json();
    const { tournamentTitle, position, teamName, playerName, prize, kills } = body;
    if (!tournamentTitle || !teamName)
      return NextResponse.json({ error: "Tournament + Team required" }, { status: 400 });
    const inserted = await db
      .insert(winners)
      .values({
        tournamentTitle,
        position: Number(position) || 1,
        teamName,
        playerName: playerName || "",
        prize: Number(prize) || 0,
        kills: Number(kills) || 0,
      })
      .returning();
    return NextResponse.json(inserted[0]);
  } catch (e) {
    console.error(e);
    return NextResponse.json({ error: "Failed" }, { status: 500 });
  }
}

export async function DELETE(req: Request) {
  try {
    if (!checkAdmin(req)) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    const { searchParams } = new URL(req.url);
    const id = Number(searchParams.get("id"));
    if (!id) return NextResponse.json({ error: "ID required" }, { status: 400 });
    await db.delete(winners).where(eq(winners.id, id));
    return NextResponse.json({ ok: true });
  } catch {
    return NextResponse.json({ error: "Failed" }, { status: 500 });
  }
}
