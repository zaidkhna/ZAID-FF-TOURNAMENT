import { NextResponse } from "next/server";
import { db } from "@/db";
import { registrations, tournaments } from "@/db/schema";
import { desc, eq } from "drizzle-orm";
import { isValidToken } from "@/lib/admin";

export async function GET(req: Request) {
  try {
    const { searchParams } = new URL(req.url);
    const tournamentId = searchParams.get("tournamentId");
    if (tournamentId) {
      const rows = await db
        .select()
        .from(registrations)
        .where(eq(registrations.tournamentId, Number(tournamentId)))
        .orderBy(desc(registrations.createdAt));
      return NextResponse.json(rows);
    }
    const rows = await db.select().from(registrations).orderBy(desc(registrations.createdAt)).limit(200);
    return NextResponse.json(rows);
  } catch (e) {
    console.error(e);
    return NextResponse.json({ error: "Failed to load registrations" }, { status: 500 });
  }
}

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const {
      tournamentId,
      teamName,
      captainName,
      whatsapp,
      ffUid,
      teamMembers,
      paymentMethod,
      senderNumber,
      trxId,
    } = body;

    if (!tournamentId || !teamName || !captainName || !whatsapp || !ffUid || !paymentMethod || !senderNumber || !trxId) {
      return NextResponse.json(
        { error: "Sab fields zaroori hain - Team, Captain, WhatsApp, FF UID, Payment aur TrxID" },
        { status: 400 }
      );
    }

    // check tournament exists & slots
    const t = await db.select().from(tournaments).where(eq(tournaments.id, Number(tournamentId))).limit(1);
    if (!t.length) return NextResponse.json({ error: "Tournament nahi mila" }, { status: 404 });
    if (t[0].status === "completed")
      return NextResponse.json({ error: "Ye match khatam ho chuka hai" }, { status: 400 });

    // duplicate trx check
    const existing = await db.select().from(registrations).where(eq(registrations.trxId, String(trxId).trim()));
    if (existing.length) {
      return NextResponse.json({ error: "Ye Transaction ID pehle use ho chuki hai!" }, { status: 400 });
    }

    const inserted = await db
      .insert(registrations)
      .values({
        tournamentId: Number(tournamentId),
        teamName: String(teamName).trim(),
        captainName: String(captainName).trim(),
        whatsapp: String(whatsapp).trim(),
        ffUid: String(ffUid).trim(),
        teamMembers: String(teamMembers || "").trim(),
        paymentMethod: String(paymentMethod),
        senderNumber: String(senderNumber).trim(),
        trxId: String(trxId).trim(),
        status: "pending",
      })
      .returning();

    return NextResponse.json(inserted[0]);
  } catch (e) {
    console.error(e);
    return NextResponse.json({ error: "Registration failed. Dobara try karein." }, { status: 500 });
  }
}

export async function PATCH(req: Request) {
  try {
    if (!isValidToken(req.headers.get("x-admin-token")))
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    const body = await req.json();
    const { id, status } = body;
    if (!id || !status) return NextResponse.json({ error: "ID + status required" }, { status: 400 });
    const updated = await db
      .update(registrations)
      .set({ status })
      .where(eq(registrations.id, Number(id)))
      .returning();
    return NextResponse.json(updated[0]);
  } catch (e) {
    console.error(e);
    return NextResponse.json({ error: "Update failed" }, { status: 500 });
  }
}
