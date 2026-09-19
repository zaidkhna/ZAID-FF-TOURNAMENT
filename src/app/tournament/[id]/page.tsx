import { db } from "@/db";
import { tournaments, registrations } from "@/db/schema";
import { eq, desc } from "drizzle-orm";
import DetailClient from "./DetailClient";

export const dynamic = "force-dynamic";

export default async function TournamentPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const tid = Number(id);

  let t: any = null;
  let regs: any[] = [];
  try {
    const rows = await db.select().from(tournaments).where(eq(tournaments.id, tid)).limit(1);
    if (rows.length) {
      const r = rows[0];
      t = {
        ...r,
        matchDate: r.matchDate?.toISOString(),
        createdAt: r.createdAt?.toISOString(),
      };
      regs = await db
        .select()
        .from(registrations)
        .where(eq(registrations.tournamentId, tid))
        .orderBy(desc(registrations.createdAt));
    }
  } catch (e) {
    console.error(e);
  }

  if (!t) {
    return (
      <div className="grid min-h-screen place-items-center bg-[#07090f] p-6 text-center">
        <div>
          <div className="text-6xl">😢</div>
          <h1 className="mt-4 text-2xl font-black text-white">Tournament nahi mila</h1>
          <a href="/" className="mt-4 inline-block rounded-xl bg-gradient-to-r from-orange-500 to-red-600 px-6 py-3 font-bold text-white">
            ← Wapas Home
          </a>
        </div>
      </div>
    );
  }

  return <DetailClient tournament={t} registrations={regs} />;
}
