import { db } from "@/db";
import { tournaments, winners, registrations } from "@/db/schema";
import { desc, sql } from "drizzle-orm";
import HomeClient from "@/components/HomeClient";

export const dynamic = "force-dynamic";

export default async function HomePage() {
  let list: any[] = [];
  let winList: any[] = [];
  try {
    const all = await db.select().from(tournaments).orderBy(desc(tournaments.matchDate));
    const counts = await db
      .select({
        tournamentId: registrations.tournamentId,
        count: sql<number>`count(*)::int`,
      })
      .from(registrations)
      .groupBy(registrations.tournamentId);
    const map: Record<number, number> = {};
    counts.forEach((c) => (map[c.tournamentId] = Number(c.count)));
    list = all.map((t) => ({
      ...t,
      matchDate: t.matchDate?.toISOString(),
      createdAt: t.createdAt?.toISOString(),
      filledSlots: map[t.id] ?? 0,
    }));
    // live first
    const order: Record<string, number> = { live: 0, upcoming: 1, full: 2, completed: 3 };
    list.sort((a, b) => (order[a.status] ?? 9) - (order[b.status] ?? 9));
    winList = await db.select().from(winners).orderBy(desc(winners.createdAt)).limit(12);
  } catch (e) {
    console.error("DB load failed", e);
  }

  return <HomeClient tournaments={list} winners={winList} />;
}
