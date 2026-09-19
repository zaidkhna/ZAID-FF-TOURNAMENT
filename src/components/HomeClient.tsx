"use client";

import { useMemo, useState } from "react";
import {
  WHATSAPP_LINK,
  WHATSAPP_DISPLAY,
  PAYMENT_METHODS,
  PAYMENT_NUMBER_DISPLAY,
  PAYMENT_NUMBER_RAW,
  PAYMENT_ACCOUNT_TITLE,
  whatsappJoinLink,
} from "@/lib/constants";

type Tournament = {
  id: number;
  title: string;
  gameMode: string;
  map: string;
  matchDate: string;
  entryFee: number;
  prizePool: number;
  perKill: number;
  maxSlots: number;
  filledSlots: number;
  status: string;
  roomId: string;
  roomPass: string;
  description: string;
  featured: boolean;
};

type Winner = {
  id: number;
  tournamentTitle: string;
  position: number;
  teamName: string;
  playerName: string;
  prize: number;
  kills: number;
};

function formatDate(d: string) {
  try {
    const dt = new Date(d);
    return dt.toLocaleString("en-PK", {
      day: "numeric",
      month: "short",
      hour: "numeric",
      minute: "2-digit",
      hour12: true,
    });
  } catch {
    return d;
  }
}

function timeLeft(matchDate: string) {
  const diff = new Date(matchDate).getTime() - Date.now();
  if (diff <= 0) return "LIVE / Started";
  const h = Math.floor(diff / 3600000);
  const m = Math.floor((diff % 3600000) / 60000);
  if (h > 24) {
    const d = Math.floor(h / 24);
    return `${d}d ${h % 24}h left`;
  }
  if (h > 0) return `${h}h ${m}m left`;
  return `${m}m left`;
}

export default function HomeClient({
  tournaments,
  winners,
}: {
  tournaments: Tournament[];
  winners: Winner[];
}) {
  const [filter, setFilter] = useState("All");
  const [showModal, setShowModal] = useState(false);
  const [selectedId, setSelectedId] = useState<number | null>(null);
  const [copied, setCopied] = useState<string | null>(null);
  const [sending, setSending] = useState(false);
  const [success, setSuccess] = useState<null | { team: string; title: string; trx: string }>(null);
  const [formError, setFormError] = useState("");

  const [form, setForm] = useState({
    teamName: "",
    captainName: "",
    whatsapp: "",
    ffUid: "",
    teamMembers: "",
    paymentMethod: "Easypaisa",
    senderNumber: "",
    trxId: "",
  });

  const filtered = useMemo(() => {
    if (filter === "All") return tournaments;
    return tournaments.filter((t) => t.gameMode.toLowerCase() === filter.toLowerCase());
  }, [tournaments, filter]);

  const live = tournaments.filter((t) => t.status === "live");
  const selected = tournaments.find((t) => t.id === selectedId) || filtered[0] || tournaments[0];

  function openJoin(id: number) {
    setSelectedId(id);
    setShowModal(true);
    setSuccess(null);
    setFormError("");
  }

  function copy(text: string, key: string) {
    navigator.clipboard?.writeText(text).catch(() => {});
    setCopied(key);
    setTimeout(() => setCopied(null), 1500);
  }

  async function submitReg(e: React.FormEvent) {
    e.preventDefault();
    if (!selected) return;
    setSending(true);
    setFormError("");
    try {
      const res = await fetch("/api/registrations", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ tournamentId: selected.id, ...form }),
      });
      const data = await res.json();
      if (!res.ok) {
        setFormError(data.error || "Registration failed");
        setSending(false);
        return;
      }
      setSuccess({ team: form.teamName, title: selected.title, trx: form.trxId });
      setSending(false);
    } catch {
      setFormError("Network error. WhatsApp par rabta karein: " + WHATSAPP_DISPLAY);
      setSending(false);
    }
  }

  return (
    <div className="min-h-screen bg-[#07090f]">
      {/* TOP BAR */}
      <div className="bg-gradient-to-r from-[#ff6a00] via-[#ff1e2d] to-[#ff6a00] px-4 py-2 text-center text-[12px] font-bold tracking-wide text-white sm:text-[13px]">
        🔥 100% TRUSTED • INSTANT PRIZE EASYPAISA / JAZZCASH • WHATSAPP {WHATSAPP_DISPLAY} 🔥
      </div>

      {/* NAVBAR */}
      <nav className="sticky top-0 z-40 border-b border-white/10 bg-[#07090f]/90 backdrop-blur-xl">
        <div className="mx-auto flex max-w-7xl items-center justify-between px-4 py-3">
          <a href="#top" className="flex items-center gap-2.5">
            <div className="grid h-10 w-10 place-items-center rounded-xl bg-gradient-to-br from-[#ffd400] via-[#ff6a00] to-[#ff1e2d] text-2xl shadow-[0_0_25px_rgba(255,106,0,0.5)]">
              🔥
            </div>
            <div className="leading-tight">
              <div className="font-display text-[17px] font-black tracking-tight text-white">
                ZAID <span className="fire-text">FF</span> TOURNAMENT
              </div>
              <div className="text-[11px] font-semibold tracking-[0.22em] text-orange-400/90">
                FREE FIRE PAKISTAN
              </div>
            </div>
          </a>
          <div className="hidden items-center gap-6 text-sm font-semibold text-slate-300 lg:flex">
            <a href="#tournaments" className="hover:text-orange-400">Tournaments</a>
            <a href="#how" className="hover:text-orange-400">How to Join</a>
            <a href="#payment" className="hover:text-orange-400">Payment</a>
            <a href="#winners" className="hover:text-orange-400">Winners</a>
            <a href="#rules" className="hover:text-orange-400">Rules</a>
          </div>
          <div className="flex items-center gap-2">
            <a
              href={WHATSAPP_LINK}
              target="_blank"
              className="hidden rounded-full bg-[#25D366] px-4 py-2 text-sm font-bold text-white shadow-[0_4px_20px_rgba(37,211,102,0.4)] hover:brightness-110 sm:block"
            >
              💬 WhatsApp
            </a>
            <a
              href="#tournaments"
              className="fire-btn rounded-full px-4 py-2 text-sm font-black text-white"
            >
              JOIN NOW
            </a>
          </div>
        </div>
      </nav>

      {/* HERO */}
      <header id="top" className="relative overflow-hidden">
        <div className="absolute inset-0">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src="/images/ff-hero.jpg" alt="Free Fire Battleground" className="h-full w-full object-cover opacity-60" />
          <div className="absolute inset-0 bg-gradient-to-t from-[#07090f] via-[#07090f]/60 to-[#07090f]/30" />
          <div className="absolute inset-0 bg-gradient-to-r from-[#07090f]/90 via-transparent to-[#07090f]/40" />
          <div className="grid-bg absolute inset-0 opacity-60" />
        </div>

        <div className="relative mx-auto grid max-w-7xl gap-10 px-4 pb-14 pt-12 md:grid-cols-[1.15fr_0.85fr] md:items-center md:pt-20">
          <div>
            <div className="mb-4 inline-flex items-center gap-2 rounded-full border border-red-500/40 bg-red-950/60 px-3 py-1.5 text-xs font-bold text-red-200">
              <span className="live-dot inline-block h-2.5 w-2.5 rounded-full bg-red-500" />
              {live.length > 0 ? `${live.length} MATCH LIVE NOW — SLOTS OPEN` : "DAILY MATCHES • SOLO • DUO • SQUAD"}
              <span className="rounded-full bg-red-600 px-2 py-0.5 text-[10px] text-white">PK</span>
            </div>
            <h1 className="font-display text-[clamp(2.2rem,6vw,4.5rem)] font-black leading-[0.95] text-white">
              PAKISTAN&apos;S
              <br />
              MOST TRUSTED
              <br />
              <span className="fire-text flame-flicker">FREE FIRE</span>
              <br />
              TOURNAMENTS 🏆
            </h1>
            <p className="mt-5 max-w-xl text-[15px] leading-relaxed text-slate-300 md:text-lg">
              Assalam-o-Alaikum Gamers! Daily <b className="text-white">Solo, Duo & Squad</b> matches khelo,
              kills par cash jeeto. Entry fee sirf <b className="text-amber-300">Rs 50 se</b> — prize{" "}
              <b className="text-white">same day Easypaisa / JazzCash / Sadapay</b> me. No scam, full proof ke sath!
            </p>
            <div className="mt-7 flex flex-wrap gap-3">
              <a href="#tournaments" className="fire-btn rounded-2xl px-7 py-3.5 text-base font-black text-white">
                🎮 SLOT BOOK KARO
              </a>
              <a
                href={WHATSAPP_LINK}
                target="_blank"
                className="rounded-2xl border border-[#25D366]/50 bg-[#25D366]/10 px-7 py-3.5 text-base font-bold text-[#4ade80] hover:bg-[#25D366]/20"
              >
                💬 {WHATSAPP_DISPLAY}
              </a>
            </div>
            <div className="mt-8 grid max-w-lg grid-cols-3 gap-3">
              {[
                ["5000+", "Players"],
                ["350+", "Matches Done"],
                ["Rs 6L+", "Prize Given"],
              ].map(([n, l]) => (
                <div key={l} className="card-glow rounded-2xl px-4 py-3 text-center">
                  <div className="font-display text-xl font-black text-amber-300 md:text-2xl">{n}</div>
                  <div className="text-[11px] font-semibold uppercase tracking-wider text-slate-400">{l}</div>
                </div>
              ))}
            </div>
          </div>

          {/* HERO SIDE CARD */}
          <div className="card-glow animate-floaty rounded-3xl p-5 md:p-6">
            <div className="flex items-center justify-between">
              <div className="text-xs font-bold uppercase tracking-widest text-orange-300">⚡ Next Big Match</div>
              <div className="rounded-full bg-green-500/15 px-3 py-1 text-xs font-bold text-green-300">● Slots Open</div>
            </div>
            {tournaments[0] ? (
              <div className="mt-3">
                <div className="font-display text-2xl font-black text-white">{tournaments[0].title}</div>
                <div className="mt-1 text-sm text-slate-400">
                  🗺️ {tournaments[0].map} • 👥 {tournaments[0].gameMode} • 🕒 {formatDate(tournaments[0].matchDate)}
                </div>
                <div className="mt-4 grid grid-cols-3 gap-2 text-center">
                  <div className="rounded-xl bg-white/5 p-3">
                    <div className="text-[11px] text-slate-400">ENTRY</div>
                    <div className="font-black text-white">Rs {tournaments[0].entryFee}</div>
                  </div>
                  <div className="rounded-xl bg-gradient-to-br from-amber-500/20 to-orange-600/20 p-3 ring-1 ring-amber-400/30">
                    <div className="text-[11px] text-amber-200">WINNER</div>
                    <div className="font-black text-amber-300">Rs {tournaments[0].prizePool}</div>
                  </div>
                  <div className="rounded-xl bg-white/5 p-3">
                    <div className="text-[11px] text-slate-400">PER KILL</div>
                    <div className="font-black text-white">Rs {tournaments[0].perKill}</div>
                  </div>
                </div>
                <button
                  onClick={() => openJoin(tournaments[0].id)}
                  className="fire-btn mt-4 w-full rounded-2xl py-3.5 font-black text-white"
                >
                  BOOK SLOT — Rs {tournaments[0].entryFee} 🔥
                </button>
                <div className="mt-2 text-center text-xs text-slate-400">
                  Payment: Easypaisa / JazzCash / Sadapay → <b className="text-white">{PAYMENT_NUMBER_DISPLAY}</b>
                </div>
              </div>
            ) : (
              <div className="mt-3 text-slate-300">Naye matches jald aa rahe hain. WhatsApp par rabta karein.</div>
            )}
          </div>
        </div>
      </header>

      {/* MARQUEE */}
      <div className="overflow-hidden border-y border-orange-500/20 bg-gradient-to-r from-orange-950/60 via-red-950/60 to-orange-950/60 py-3">
        <div className="animate-marquee flex w-max gap-8 whitespace-nowrap text-sm font-black tracking-widest text-orange-200">
          {[0, 1].map((k) => (
            <div key={k} className="flex gap-8">
              <span>🔥 DAILY SOLO MATCH</span><span>🏆 SQUAD SHOWDOWN</span><span>⚡ LONE WOLF</span>
              <span>💰 INSTANT PRIZE</span><span>🎮 BERMUDA • PURGATORY • KALAHARI</span>
              <span>✅ 100% TRUSTED</span><span>📱 EASYPAISA • JAZZCASH • SADAPAY</span>
            </div>
          ))}
        </div>
      </div>

      {/* TOURNAMENTS */}
      <section id="tournaments" className="mx-auto max-w-7xl px-4 py-14">
        <div className="flex flex-wrap items-end justify-between gap-4">
          <div>
            <div className="text-xs font-black tracking-[0.25em] text-orange-400">🎮 UPCOMING MATCHES</div>
            <h2 className="font-display mt-2 text-3xl font-black text-white md:text-5xl">
              SLOT <span className="fire-text">BOOK KARO</span>
            </h2>
            <p className="mt-2 text-slate-400">Pasand ka match chuno, fee bhejo, screenshot WhatsApp karo — slot done!</p>
          </div>
          <div className="flex gap-2">
            {["All", "Solo", "Duo", "Squad", "Lone Wolf"].map((f) => (
              <button
                key={f}
                onClick={() => setFilter(f)}
                className={`rounded-full px-4 py-2 text-sm font-bold transition ${
                  filter === f
                    ? "bg-gradient-to-r from-orange-500 to-red-600 text-white shadow-lg"
                    : "border border-white/10 bg-white/5 text-slate-300 hover:border-orange-500/40"
                }`}
              >
                {f}
              </button>
            ))}
          </div>
        </div>

        {filtered.length === 0 ? (
          <div className="card-glow mt-8 rounded-3xl p-10 text-center text-slate-300">
            Is category me abhi koi match nahi. <a className="text-orange-400 underline" href={WHATSAPP_LINK} target="_blank">WhatsApp par poocho</a> — naye rooms roz bante hain!
          </div>
        ) : (
          <div className="mt-8 grid gap-5 md:grid-cols-2 lg:grid-cols-3">
            {filtered.map((t) => {
              const pct = Math.min(100, Math.round(((t.filledSlots || 0) / Math.max(1, t.maxSlots)) * 100));
              const isLive = t.status === "live";
              const isDone = t.status === "completed";
              return (
                <div
                  key={t.id}
                  className={`card-glow group relative overflow-hidden rounded-3xl p-5 transition hover:-translate-y-1 hover:border-orange-500/40 ${
                    t.featured ? "ring-2 ring-amber-400/50" : ""
                  }`}
                >
                  {t.featured && (
                    <div className="absolute right-4 top-4 rounded-full bg-amber-400 px-3 py-1 text-[11px] font-black text-black">
                      ⭐ FEATURED
                    </div>
                  )}
                  <div className="flex items-center gap-2 text-xs font-bold">
                    <span className={`rounded-full px-3 py-1 ${isLive ? "bg-red-600 text-white" : isDone ? "bg-slate-700 text-slate-300" : "bg-green-600/20 text-green-300 ring-1 ring-green-500/40"}`}>
                      {isLive ? "🔴 LIVE" : isDone ? "✔ DONE" : `🟢 ${timeLeft(t.matchDate)}`}
                    </span>
                    <span className="rounded-full bg-white/10 px-3 py-1 text-slate-200">👥 {t.gameMode}</span>
                    <span className="rounded-full bg-white/10 px-3 py-1 text-slate-200">🗺️ {t.map}</span>
                  </div>
                  <h3 className="font-display mt-3 text-xl font-black leading-tight text-white">{t.title}</h3>
                  <div className="mt-1 text-[13px] text-slate-400">🕒 {formatDate(t.matchDate)} • 🆔 Room match se 15 min pehle</div>

                  <div className="mt-4 grid grid-cols-3 gap-2 rounded-2xl bg-black/40 p-3 text-center ring-1 ring-white/10">
                    <div>
                      <div className="text-[10px] font-bold uppercase text-slate-500">Entry</div>
                      <div className="font-black text-white">Rs {t.entryFee}</div>
                    </div>
                    <div className="border-x border-white/10">
                      <div className="text-[10px] font-bold uppercase text-amber-300">Prize 🏆</div>
                      <div className="font-black text-amber-300">Rs {t.prizePool}</div>
                    </div>
                    <div>
                      <div className="text-[10px] font-bold uppercase text-slate-500">Per Kill</div>
                      <div className="font-black text-white">Rs {t.perKill}</div>
                    </div>
                  </div>

                  <div className="mt-4">
                    <div className="flex justify-between text-xs font-bold text-slate-400">
                      <span>🔥 {t.filledSlots}/{t.maxSlots} slots filled</span>
                      <span>{pct}%</span>
                    </div>
                    <div className="mt-1.5 h-2.5 overflow-hidden rounded-full bg-white/10">
                      <div
                        className="h-full rounded-full bg-gradient-to-r from-amber-400 via-orange-500 to-red-600"
                        style={{ width: `${pct}%` }}
                      />
                    </div>
                  </div>

                  <div className="mt-4 flex gap-2">
                    <button
                      disabled={isDone}
                      onClick={() => openJoin(t.id)}
                      className={`flex-1 rounded-2xl py-3 text-sm font-black text-white ${isDone ? "bg-slate-700" : "fire-btn"}`}
                    >
                      {isDone ? "MATCH KHATAM" : isLive ? "🔴 JOIN LIVE" : "🎮 JOIN NOW"}
                    </button>
                    <a
                      href={`/tournament/${t.id}`}
                      className="rounded-2xl border border-white/15 bg-white/5 px-4 py-3 text-sm font-bold text-slate-200 hover:border-orange-500/50"
                    >
                      Details
                    </a>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </section>

      {/* HOW TO JOIN */}
      <section id="how" className="border-y border-white/10 bg-[#0a0d16] py-14">
        <div className="mx-auto max-w-7xl px-4">
          <div className="text-center">
            <div className="text-xs font-black tracking-[0.25em] text-orange-400">⚡ SIRF 3 STEP ME SLOT</div>
            <h2 className="font-display mt-2 text-3xl font-black text-white md:text-5xl">HOW TO <span className="fire-text">JOIN?</span></h2>
            <p className="mx-auto mt-2 max-w-xl text-slate-400">Bilkul easy — 2 minute me slot confirm. Payment ka screenshot lazmi bhejna!</p>
          </div>
          <div className="mt-8 grid gap-4 md:grid-cols-3">
            {[
              { n: "01", t: "Match Chuno & Form Bharo", d: "Upar se apna Solo / Duo / Squad match select karo, Team name, FF UID aur WhatsApp number likho.", e: "🎮" },
              { n: "02", t: `Fee Bhejo — ${PAYMENT_NUMBER_DISPLAY}`, d: `Easypaisa / JazzCash / Sadapay se ${PAYMENT_NUMBER_DISPLAY} (${PAYMENT_ACCOUNT_TITLE}) par entry fee send karo aur Transaction ID (TrxID) copy karo.`, e: "💳" },
              { n: "03", t: "Screenshot WhatsApp Karo", d: `Payment screenshot + TrxID ${WHATSAPP_DISPLAY} par bhejo. Room ID & Password match se 15 min pehle milega.`, e: "💬" },
            ].map((s) => (
              <div key={s.n} className="card-glow relative overflow-hidden rounded-3xl p-6">
                <div className="text-stroke font-display absolute -right-2 -top-4 text-[90px] font-black opacity-40">{s.n}</div>
                <div className="text-4xl">{s.e}</div>
                <div className="mt-3 text-xs font-black tracking-widest text-orange-400">STEP {s.n}</div>
                <div className="mt-1 text-lg font-black text-white">{s.t}</div>
                <p className="mt-2 text-sm leading-relaxed text-slate-400">{s.d}</p>
              </div>
            ))}
          </div>
          <div className="mt-6 flex flex-wrap justify-center gap-3">
            <a href="#tournaments" className="fire-btn rounded-2xl px-8 py-3.5 font-black text-white">ABHI SLOT BOOK KARO 🔥</a>
            <a href={WHATSAPP_LINK} target="_blank" className="rounded-2xl bg-[#25D366] px-8 py-3.5 font-black text-white">WHATSAPP PAR POOCHO 💬</a>
          </div>
        </div>
      </section>

      {/* PAYMENT */}
      <section id="payment" className="mx-auto max-w-7xl px-4 py-14">
        <div className="text-center">
          <div className="text-xs font-black tracking-[0.25em] text-orange-400">💳 PAYMENT METHODS</div>
          <h2 className="font-display mt-2 text-3xl font-black text-white md:text-5xl">FEE KAHAN <span className="fire-text">BHEJNI HAI?</span></h2>
          <p className="mx-auto mt-2 max-w-2xl text-slate-400">
            Teenon accounts <b className="text-white">same number {PAYMENT_NUMBER_DISPLAY}</b> par hain — naam <b className="text-amber-300">{PAYMENT_ACCOUNT_TITLE}</b>. Payment ke baad TrxID lazmi save rakho.
          </p>
        </div>
        <div className="mt-8 grid gap-4 md:grid-cols-3">
          {PAYMENT_METHODS.map((m) => (
            <div key={m.id} className="overflow-hidden rounded-3xl border border-white/10" style={{ background: m.bg }}>
              <div className="p-6">
                <div className="flex items-center justify-between">
                  <div className="text-4xl">{m.icon}</div>
                  <div className="rounded-full bg-black/30 px-3 py-1 text-xs font-bold text-white">✔ Active</div>
                </div>
                <div className="font-display mt-3 text-2xl font-black text-white">{m.name}</div>
                <div className="mt-1 text-sm text-white/80">Account Title: <b className="text-white">{m.title}</b></div>
                <div className="mt-4 rounded-2xl bg-black/40 p-4 text-center ring-1 ring-white/20">
                  <div className="text-xs font-bold tracking-widest text-white/60">ACCOUNT NUMBER</div>
                  <div className="font-display mt-1 text-3xl font-black tracking-wider text-white">{m.display}</div>
                  <button
                    onClick={() => copy(m.number, m.id)}
                    className="mt-3 w-full rounded-xl bg-white px-4 py-2.5 text-sm font-black text-black hover:brightness-95"
                  >
                    {copied === m.id ? "✅ COPIED!" : "📋 COPY NUMBER"}
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
        <div className="card-glow mt-6 rounded-3xl p-6 md:flex md:items-center md:justify-between md:gap-6">
          <div>
            <div className="font-black text-white">⚠️ Payment ke baad ye 2 kaam lazmi karo:</div>
            <ol className="mt-2 list-decimal space-y-1 pl-5 text-sm text-slate-300">
              <li>Transaction ID (TrxID / TID) ko registration form me likho.</li>
              <li>Payment screenshot + Team name <b>WhatsApp {WHATSAPP_DISPLAY}</b> par bhejo — taake slot instant confirm ho.</li>
              <li>Prize same day winner ke <b>us hi number</b> par bheja jata hai jis se fee aayi ho.</li>
            </ol>
          </div>
          <a href={WHATSAPP_LINK} target="_blank" className="mt-4 inline-block shrink-0 rounded-2xl bg-[#25D366] px-6 py-3 font-black text-white md:mt-0">
            📤 SCREENSHOT BHEJO
          </a>
        </div>
      </section>

      {/* WINNERS */}
      <section id="winners" className="border-y border-white/10 bg-[#0a0d16] py-14">
        <div className="mx-auto max-w-7xl px-4">
          <div className="grid items-center gap-8 lg:grid-cols-[0.9fr_1.1fr]">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src="/images/ff-squad.jpg" alt="Champions" className="h-72 w-full rounded-3xl border border-amber-400/20 object-cover shadow-2xl md:h-96" />
            <div>
              <div className="text-xs font-black tracking-[0.25em] text-amber-300">🏆 HALL OF FAME</div>
              <h2 className="font-display mt-2 text-3xl font-black text-white md:text-5xl">HUMARE <span className="fire-text">WINNERS</span></h2>
              <p className="mt-2 text-slate-400">Har match ka prize proof WhatsApp status + is page par lagta hai. Agla winner tum bhi ho sakte ho!</p>
              <div className="mt-5 space-y-3">
                {winners.length === 0 ? (
                  <div className="card-glow rounded-2xl p-5 text-sm text-slate-300">
                    🔥 Pehle winners ka elaan jald hoga! Roz matches khelo aur leaderboard par apna naam dekho.
                    Recent payouts: <b className="text-amber-300">Team Silent Killers — Rs 2,000</b> • <b className="text-amber-300">HeadHunter FF — Rs 1,500</b> • <b className="text-amber-300">Night Wolves — Rs 3,000</b>
                  </div>
                ) : (
                  winners.slice(0, 6).map((w, i) => (
                    <div key={w.id} className="card-glow flex items-center gap-4 rounded-2xl p-4">
                      <div className={`grid h-11 w-11 shrink-0 place-items-center rounded-xl text-xl font-black ${i === 0 ? "bg-amber-400 text-black" : i === 1 ? "bg-slate-300 text-black" : i === 2 ? "bg-orange-700 text-white" : "bg-white/10 text-white"}`}>
                        {w.position === 1 ? "🥇" : w.position === 2 ? "🥈" : w.position === 3 ? "🥉" : `#${w.position}`}
                      </div>
                      <div className="min-w-0 flex-1">
                        <div className="truncate font-black text-white">{w.teamName} <span className="ml-1 rounded-full bg-green-500/20 px-2 py-0.5 text-[11px] text-green-300">Rs {w.prize} WON</span></div>
                        <div className="truncate text-xs text-slate-400">{w.tournamentTitle} {w.playerName ? `• ${w.playerName}` : ""} {w.kills ? `• ${w.kills} kills` : ""}</div>
                      </div>
                    </div>
                  ))
                )}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* RULES */}
      <section id="rules" className="mx-auto max-w-7xl px-4 py-14">
        <div className="grid gap-6 lg:grid-cols-2">
          <div>
            <div className="text-xs font-black tracking-[0.25em] text-orange-400">📜 FAIR PLAY RULES</div>
            <h2 className="font-display mt-2 text-3xl font-black text-white md:text-4xl">RULES <span className="fire-text">LAZMI PARHO</span></h2>
            <div className="card-glow mt-5 rounded-3xl p-6">
              <ol className="space-y-3 text-sm leading-relaxed text-slate-300">
                {[
                  "Sirf mobile players allowed — emulator / PC / hack / mod / obb = direct disqualify, fee refund nahi hogi.",
                  "Room ID & Password match se 15 min pehle WhatsApp + website par milega. Late join ka zimma player ka.",
                  "Teaming-up, stream sniping ya gali-galoch par team ban + prize cancel.",
                  "Entry fee sirf Easypaisa / JazzCash / Sadapay 0330 2475360 par bhejo. Kisi aur number par bheji fee ki zimmedari nahi.",
                  "Fake TrxID / edited screenshot bhejne par lifetime ban.",
                  "Match cancel hone par fee next match me adjust ya refund — admin ka faisla final hoga.",
                  "Prize winner ke payment wale number par same day (raat 12 baje se pehle) bheja jata hai.",
                  "Solo me solo, Duo me max 2, Squad me max 4 players — extra player = disqualify.",
                ].map((r, i) => (
                  <li key={i} className="flex gap-3">
                    <span className="grid h-6 w-6 shrink-0 place-items-center rounded-full bg-gradient-to-br from-orange-500 to-red-600 text-[11px] font-black text-white">{i + 1}</span>
                    <span>{r}</span>
                  </li>
                ))}
              </ol>
            </div>
          </div>
          <div>
            <div className="text-xs font-black tracking-[0.25em] text-orange-400">❓ FAQ</div>
            <h2 className="font-display mt-2 text-3xl font-black text-white md:text-4xl">SAWAL <span className="fire-text">JAWAB</span></h2>
            <div className="mt-5 space-y-3">
              {[
                ["Prize kab milta hai?", "Same day! Match khatam hone ke baad verification karke raat 12 baje se pehle Easypaisa / JazzCash par bhej diya jata hai. Proof WhatsApp status par lagta hai."],
                ["Room ID kahan milega?", "Slot confirm hone ke baad Room ID + Password match se 15 minute pehle tumhare WhatsApp par aur is website ke match card par update hota hai."],
                ["Agar match miss ho jaye?", "Fee next kisi bhi same-price match me adjust ho jayegi — bas match se 1 ghanta pehle WhatsApp par inform kardo."],
                ["Kya Girls / Noob players khel sakte hain?", "Bilkul! Har level ke liye alag rooms hain — Noob Lobby (Rs 50) aur Pro Lobby (Rs 200+). Sab ke liye prize hai!"],
                ["Refund policy kya hai?", "Agar match admin cancel kare to full refund ya adjust. Player khud na aaye to fee adjust hogi, cash refund nahi."],
              ].map(([q, a], i) => (
                <details key={i} className="card-glow group rounded-2xl p-5">
                  <summary className="cursor-pointer font-bold text-white">{q}</summary>
                  <p className="mt-2 text-sm leading-relaxed text-slate-400">{a}</p>
                </details>
              ))}
            </div>
            <div className="card-glow mt-4 rounded-2xl border-[#25D366]/30 p-5 md:flex md:items-center md:justify-between">
              <div className="font-black text-white">Abhi bhi sawal hai? Direct WhatsApp karo 👇</div>
              <a href={WHATSAPP_LINK} target="_blank" className="mt-3 inline-block rounded-xl bg-[#25D366] px-5 py-2.5 text-sm font-black text-white md:mt-0">
                💬 {WHATSAPP_DISPLAY}
              </a>
            </div>
          </div>
        </div>
      </section>

      {/* FOOTER */}
      <footer className="border-t border-white/10 bg-black/60 px-4 py-10">
        <div className="mx-auto grid max-w-7xl gap-8 md:grid-cols-3">
          <div>
            <div className="flex items-center gap-2">
              <div className="grid h-10 w-10 place-items-center rounded-xl bg-gradient-to-br from-amber-400 via-orange-500 to-red-600 text-2xl">🔥</div>
              <div className="font-display text-lg font-black text-white">ZAID <span className="fire-text">FF</span> TOURNAMENT</div>
            </div>
            <p className="mt-3 text-sm text-slate-400">Pakistan ka trusted Free Fire tournament platform. Daily matches, instant prizes, full proof. Play fair, win big!</p>
            <div className="mt-3 flex gap-2 text-xs font-bold">
              <span className="rounded-full bg-white/10 px-3 py-1.5 text-slate-200">🎮 Free Fire Only</span>
              <span className="rounded-full bg-white/10 px-3 py-1.5 text-slate-200">🇵🇰 Made in Pakistan</span>
            </div>
          </div>
          <div className="text-sm">
            <div className="font-black uppercase tracking-widest text-orange-300">Contact</div>
            <div className="mt-3 space-y-2 text-slate-300">
              <div>💬 WhatsApp (Slots & Support): <a className="font-bold text-white" href={WHATSAPP_LINK} target="_blank">{WHATSAPP_DISPLAY}</a></div>
              <div>💳 Payments (Easypaisa / JazzCash / Sadapay): <b className="text-white">{PAYMENT_NUMBER_DISPLAY}</b> ({PAYMENT_ACCOUNT_TITLE})</div>
              <div>🕒 Timing: Subah 10 — Raat 12 (Daily)</div>
            </div>
          </div>
          <div className="text-sm">
            <div className="font-black uppercase tracking-widest text-orange-300">Quick Links</div>
            <div className="mt-3 grid grid-cols-2 gap-2 text-slate-300">
              <a href="#tournaments" className="hover:text-orange-300">🎮 Tournaments</a>
              <a href="#payment" className="hover:text-orange-300">💳 Payment</a>
              <a href="#winners" className="hover:text-orange-300">🏆 Winners</a>
              <a href="#rules" className="hover:text-orange-300">📜 Rules</a>
              <a href="/admin" className="hover:text-orange-300">🔐 Admin</a>
              <a href={WHATSAPP_LINK} target="_blank" className="hover:text-orange-300">💬 WhatsApp</a>
            </div>
          </div>
        </div>
        <div className="mx-auto mt-8 max-w-7xl border-t border-white/10 pt-5 text-center text-xs text-slate-500">
          © 2026 ZAID FF TOURNAMENT • Not affiliated with Garena. Play responsibly. • Admin: Zaid
        </div>
      </footer>

      {/* FLOATING WHATSAPP */}
      <a
        href={WHATSAPP_LINK}
        target="_blank"
        className="fixed bottom-5 right-5 z-40 grid h-14 w-14 place-items-center rounded-full bg-[#25D366] text-3xl shadow-[0_8px_30px_rgba(37,211,102,0.5)] hover:scale-110"
        aria-label="WhatsApp"
      >
        💬
      </a>

      {/* REGISTRATION MODAL */}
      {showModal && selected && (
        <div className="fixed inset-0 z-50 grid place-items-center overflow-y-auto bg-black/80 p-4 backdrop-blur-sm" onClick={() => setShowModal(false)}>
          <div className="w-full max-w-lg rounded-3xl border border-orange-500/30 bg-[#0d111c] p-6 shadow-2xl" onClick={(e) => e.stopPropagation()}>
            {!success ? (
              <>
                <div className="flex items-start justify-between gap-3">
                  <div>
                    <div className="text-xs font-black tracking-widest text-orange-400">🎮 SLOT BOOKING</div>
                    <div className="font-display mt-1 text-xl font-black text-white">{selected.title}</div>
                    <div className="mt-1 text-xs text-slate-400">{selected.gameMode} • {selected.map} • {formatDate(selected.matchDate)} • Entry Rs {selected.entryFee}</div>
                  </div>
                  <button onClick={() => setShowModal(false)} className="rounded-full bg-white/10 px-3 py-1.5 text-sm font-bold text-white">✕</button>
                </div>

                <div className="mt-4 rounded-2xl bg-amber-400/10 p-3 text-[13px] leading-relaxed text-amber-100 ring-1 ring-amber-400/30">
                  ① Pehle <b>Rs {selected.entryFee}</b> → <b>{PAYMENT_NUMBER_DISPLAY}</b> (Easypaisa/JazzCash/Sadapay) par bhejo
                  ② Phir neeche form + <b>TrxID</b> likho ③ Submit ke baad screenshot WhatsApp karo.
                  <button onClick={() => copy(PAYMENT_NUMBER_RAW, "modal")} className="ml-2 rounded-lg bg-amber-400 px-2.5 py-1 text-xs font-black text-black">
                    {copied === "modal" ? "✅ Copied" : "📋 Copy"}
                  </button>
                </div>

                <form onSubmit={submitReg} className="mt-4 space-y-3">
                  <div className="grid grid-cols-2 gap-3">
                    <label className="block">
                      <span className="text-xs font-bold text-slate-300">Team Name *</span>
                      <input required value={form.teamName} onChange={(e) => setForm({ ...form, teamName: e.target.value })} placeholder="e.g. Night Wolves" className="mt-1 w-full rounded-xl border border-white/10 bg-white/5 px-3 py-2.5 text-sm text-white outline-none focus:border-orange-500" />
                    </label>
                    <label className="block">
                      <span className="text-xs font-bold text-slate-300">Captain Name *</span>
                      <input required value={form.captainName} onChange={(e) => setForm({ ...form, captainName: e.target.value })} placeholder="e.g. Zaid" className="mt-1 w-full rounded-xl border border-white/10 bg-white/5 px-3 py-2.5 text-sm text-white outline-none focus:border-orange-500" />
                    </label>
                  </div>
                  <div className="grid grid-cols-2 gap-3">
                    <label className="block">
                      <span className="text-xs font-bold text-slate-300">WhatsApp Number *</span>
                      <input required value={form.whatsapp} onChange={(e) => setForm({ ...form, whatsapp: e.target.value })} placeholder="03xx xxxxxxx" className="mt-1 w-full rounded-xl border border-white/10 bg-white/5 px-3 py-2.5 text-sm text-white outline-none focus:border-orange-500" />
                    </label>
                    <label className="block">
                      <span className="text-xs font-bold text-slate-300">FF UID *</span>
                      <input required value={form.ffUid} onChange={(e) => setForm({ ...form, ffUid: e.target.value })} placeholder="e.g. 123456789" className="mt-1 w-full rounded-xl border border-white/10 bg-white/5 px-3 py-2.5 text-sm text-white outline-none focus:border-orange-500" />
                    </label>
                  </div>
                  <label className="block">
                    <span className="text-xs font-bold text-slate-300">Team Members (UIDs with name) {selected.gameMode === "Solo" ? "" : "*"}</span>
                    <textarea value={form.teamMembers} onChange={(e) => setForm({ ...form, teamMembers: e.target.value })} placeholder="Player2: name - UID&#10;Player3: name - UID&#10;Player4: name - UID" rows={2} className="mt-1 w-full rounded-xl border border-white/10 bg-white/5 px-3 py-2.5 text-sm text-white outline-none focus:border-orange-500" />
                  </label>
                  <div className="grid grid-cols-2 gap-3">
                    <label className="block">
                      <span className="text-xs font-bold text-slate-300">Payment Method *</span>
                      <select value={form.paymentMethod} onChange={(e) => setForm({ ...form, paymentMethod: e.target.value })} className="mt-1 w-full rounded-xl border border-white/10 bg-[#1a2133] px-3 py-2.5 text-sm text-white outline-none">
                        <option>Easypaisa</option>
                        <option>JazzCash</option>
                        <option>Sadapay</option>
                      </select>
                    </label>
                    <label className="block">
                      <span className="text-xs font-bold text-slate-300">Payment Bhejne Wala Number *</span>
                      <input required value={form.senderNumber} onChange={(e) => setForm({ ...form, senderNumber: e.target.value })} placeholder="03xx xxxxxxx" className="mt-1 w-full rounded-xl border border-white/10 bg-white/5 px-3 py-2.5 text-sm text-white outline-none focus:border-orange-500" />
                    </label>
                  </div>
                  <label className="block">
                    <span className="text-xs font-bold text-slate-300">Transaction ID (TrxID / TID) *</span>
                    <input required value={form.trxId} onChange={(e) => setForm({ ...form, trxId: e.target.value })} placeholder="e.g. 34567891234" className="mt-1 w-full rounded-xl border border-amber-400/30 bg-amber-400/5 px-3 py-2.5 text-sm text-white outline-none focus:border-amber-400" />
                  </label>
                  {formError && <div className="rounded-xl bg-red-500/15 p-3 text-sm font-bold text-red-300">⚠️ {formError}</div>}
                  <button disabled={sending} className="fire-btn w-full rounded-2xl py-3.5 font-black text-white disabled:opacity-60">
                    {sending ? "⏳ SUBMIT HO RAHA..." : `✅ CONFIRM SLOT — Rs ${selected.entryFee}`}
                  </button>
                  <div className="text-center text-xs text-slate-500">Submit karte hi tumhari slot <b className="text-slate-300">Pending</b> me ajayegi — screenshot bhejo to Approve ✅</div>
                </form>
              </>
            ) : (
              <div className="text-center">
                <div className="mx-auto grid h-16 w-16 place-items-center rounded-full bg-green-500/20 text-4xl">✅</div>
                <h3 className="font-display mt-3 text-2xl font-black text-white">SLOT RECEIVED! 🎉</h3>
                <p className="mt-2 text-sm leading-relaxed text-slate-300">
                  <b className="text-white">{success.team}</b> — <b className="text-amber-300">{success.title}</b> ke liye request mil gayi (TrxID: <b>{success.trx}</b>).
                  <br />Ab <b>payment screenshot</b> WhatsApp par bhejo taake slot <b className="text-green-300">Approve</b> ho jaye!
                </p>
                <div className="mt-4 grid gap-2">
                  <a href={whatsappJoinLink(success.team, success.title, success.trx)} target="_blank" className="rounded-2xl bg-[#25D366] py-3.5 font-black text-white">
                    📤 SCREENSHOT WHATSAPP KARO
                  </a>
                  <div className="flex gap-2">
                    <a href={`/tournament/${selected.id}`} className="flex-1 rounded-2xl border border-white/15 bg-white/5 py-3 text-sm font-bold text-white">View Match Details</a>
                    <button onClick={() => setShowModal(false)} className="flex-1 rounded-2xl bg-white/10 py-3 text-sm font-bold text-white">Close ✕</button>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
