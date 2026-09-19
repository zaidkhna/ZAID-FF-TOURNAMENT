import { NextResponse } from "next/server";
import { db } from "@/db";
import { tournaments, registrations } from "@/db/schema";
import { desc, eq, sql } from "drizzle-orm";
import { isValidToken } from "@/lib/admin";

function checkAdmin(req: Request) {
  const token = req.headers.get("x-admin-token");
  return isValidToken(token);
}

export async function GET() {
  try {
    const all = await db.select().from(tournaments).orderBy(desc(tournaments.matchDate));
    // count approved regs per tournament
    const counts = await db
      .select({
        tournamentId: registrations.tournamentId,
        count: sql<number>`count(*)::int`,
      })
      .from(registrations)
      .groupBy(registrations.tournamentId);

    const countMap: Record<number, number> = {};
    counts.forEach((c) => {
      countMap[c.tournamentId] = Number(c.count);
    });

    const withCounts = all.map((t) => ({
      ...t,
      filledSlots: countMap[t.id] ?? 0,
    }));

    // sort: live first, then upcoming by date
    withCounts.sort((a, b) => {
      const order: Record<string, number> = { live: 0, upcoming: 1, full: 2, completed: 3 };
      return (order[a.status] ?? 9) - (order[b.status] ?? 9);
    });

    return NextResponse.json(withCounts);
  } catch (e) {
    console.error(e);
    return NextResponse.json({ error: "Failed to load tournaments" }, { status: 500 });
  }
}

export async function POST(req: Request) {
  try {
    if (!checkAdmin(req)) return NextResponse.json({ error: "Unauthorized — admin login karo" }, { status: 401 });
    const body = await req.json();
    const {
      title,
      gameMode,
      map,
      matchDate,
      entryFee,
      prizePool,
      perKill,
      maxSlots,
      status,
      roomId,
      roomPass,
      description,
      featured,
    } = body;

    if (!title || !matchDate) {
      return NextResponse.json({ error: "Title aur Match Date zaroori hai" }, { status: 400 });
    }

    const inserted = await db
      .insert(tournaments)
      .values({
        title,
        gameMode: gameMode || "Squad",
        map: map || "Bermuda",
        matchDate: new Date(matchDate),
        entryFee: Number(entryFee) || 0,
        prizePool: Number(prizePool) || 0,
        perKill: Number(perKill) || 0,
        maxSlots: Number(maxSlots) || 48,
        status: status || "upcoming",
        roomId: roomId || "",
        roomPass: roomPass || "",
        description: description || "",
        featured: Boolean(featured),
      })
      .returning();

    return NextResponse.json(inserted[0]);
  } catch (e) {
    console.error(e);
    return NextResponse.json({ error: "Failed to create tournament" }, { status: 500 });
  }
}

export async function DELETE(req: Request) {
  try {
    if (!checkAdmin(req)) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    const { searchParams } = new URL(req.url);
    const id = Number(searchParams.get("id"));
    if (!id) return NextResponse.json({ error: "ID required" }, { status: 400 });
    await db.delete(registrations).where(eq(registrations.tournamentId, id));
    await db.delete(tournaments).where(eq(tournaments.id, id));
    return NextResponse.json({ ok: true });
  } catch (e) {
    console.error(e);
    return NextResponse.json({ error: "Delete failed" }, { status: 500 });
  }
}

export async function PATCH(req: Request) {
  try {
    if (!checkAdmin(req)) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    const body = await req.json();
    const { id, ...fields } = body;
    if (!id) return NextResponse.json({ error: "ID required" }, { status: 400 });
    if (fields.matchDate) fields.matchDate = new Date(fields.matchDate);
    const updated = await db
      .update(tournaments)
      .set(fields)
      .where(eq(tournaments.id, Number(id)))
      .returning();
    return NextResponse.json(updated[0]);
  } catch (e) {
    console.error(e);
    return NextResponse.json({ error: "Update failed" }, { status: 500 });
  }
}
