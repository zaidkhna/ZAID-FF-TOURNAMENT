"use client";

import { useState } from "react";
import {
  WHATSAPP_LINK,
  WHATSAPP_DISPLAY,
  PAYMENT_METHODS,
  PAYMENT_NUMBER_DISPLAY,
  PAYMENT_NUMBER_RAW,
  whatsappJoinLink,
} from "@/lib/constants";

export default function DetailClient({ tournament: t, registrations }: { tournament: any; registrations: any[] }) {
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
  const [sending, setSending] = useState(false);
  const [err, setErr] = useState("");
  const [ok, setOk] = useState<null | { team: string; trx: string }>(null);
  const [copied, setCopied] = useState(false);

  function copy() {
    navigator.clipboard?.writeText(PAYMENT_NUMBER_RAW).catch(() => {});
    setCopied(true);
    setTimeout(() => setCopied(false), 1500);
  }

  async function submit(e: React.FormEvent) {
    e.preventDefault();
    setSending(true);
    setErr("");
    try {
      const res = await fetch("/api/registrations", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ tournamentId: t.id, ...form }),
      });
      const data = await res.json();
      if (!res.ok) {
        setErr(data.error || "Failed");
        setSending(false);
        return;
      }
      setOk({ team: form.teamName, trx: form.trxId });
      setSending(false);
    } catch {
      setErr("Network error");
      setSending(false);
    }
  }

  const approved = registrations.filter((r) => r.status === "approved");
  const pending = registrations.filter((r) => r.status !== "approved").length;
  const pct = Math.min(100, Math.round((registrations.length / Math.max(1, t.maxSlots)) * 100));

  return (
    <div className="min-h-screen bg-[#07090f]">
      <nav className="sticky top-0 z-40 border-b border-white/10 bg-[#07090f]/90 backdrop-blur-xl">
        <div className="mx-auto flex max-w-6xl items-center justify-between px-4 py-3">
          <a href="/" className="flex items-center gap-2">
            <div className="grid h-9 w-9 place-items-center rounded-xl bg-gradient-to-br from-amber-400 via-orange-500 to-red-600 text-xl">🔥</div>
            <div className="font-display text-[15px] font-black text-white">ZAID <span className="fire-text">FF</span> TOURNAMENT</div>
          </a>
          <div className="flex gap-2">
            <a href="/" className="rounded-full border border-white/15 px-4 py-2 text-sm font-bold text-slate-200">← All Matches</a>
            <a href={WHATSAPP_LINK} target="_blank" className="rounded-full bg-[#25D366] px-4 py-2 text-sm font-bold text-white">💬 WhatsApp</a>
          </div>
        </div>
      </nav>

      <div className="mx-auto max-w-6xl px-4 py-8">
        {/* HEADER CARD */}
        <div className="card-glow overflow-hidden rounded-3xl">
          <div className="bg-gradient-to-r from-orange-600 via-red-600 to-orange-600 px-6 py-8 md:px-10">
            <div className="flex flex-wrap items-center gap-2 text-xs font-bold">
              <span className="rounded-full bg-black/40 px-3 py-1 text-white">👥 {t.gameMode}</span>
              <span className="rounded-full bg-black/40 px-3 py-1 text-white">🗺️ {t.map}</span>
              <span className="rounded-full bg-black/40 px-3 py-1 text-white">📌 {t.status.toUpperCase()}</span>
            </div>
            <h1 className="font-display mt-3 text-3xl font-black text-white md:text-5xl">{t.title}</h1>
            <div className="mt-2 font-bold text-white/90">
              🕒 {new Date(t.matchDate).toLocaleString("en-PK", { day: "numeric", month: "long", hour: "numeric", minute: "2-digit", hour12: true })} • Room match se 15 min pehle
            </div>
            {t.description && <p className="mt-3 max-w-2xl text-sm text-white/85">{t.description}</p>}
          </div>
          <div className="grid gap-4 p-6 md:grid-cols-4 md:p-8">
            {[
              ["🎟️ ENTRY FEE", `Rs ${t.entryFee}`, "text-white"],
              ["🏆 WINNER PRIZE", `Rs ${t.prizePool}`, "text-amber-300"],
              ["🔫 PER KILL", `Rs ${t.perKill}`, "text-white"],
              ["🔥 SLOTS", `${registrations.length}/${t.maxSlots} (${pct}%)`, "text-green-300"],
            ].map(([l, v, c]) => (
              <div key={l as string} className="rounded-2xl bg-black/40 p-4 text-center ring-1 ring-white/10">
                <div className="text-[11px] font-bold tracking-widest text-slate-400">{l}</div>
                <div className={`font-display mt-1 text-2xl font-black ${c}`}>{v}</div>
              </div>
            ))}
          </div>
          {(t.roomId || t.status === "live") && (
            <div className="mx-6 mb-6 rounded-2xl border border-green-500/30 bg-green-500/10 p-4 text-center md:mx-8">
              <div className="text-xs font-black tracking-widest text-green-300">🔴 LIVE ROOM DETAILS (sirf approved slots ke liye)</div>
              <div className="mt-2 flex flex-wrap justify-center gap-4 font-black text-white">
                <span>🆔 Room ID: <b className="text-amber-300">{t.roomId || "WhatsApp par milega"}</b></span>
                <span>🔑 Password: <b className="text-amber-300">{t.roomPass || "WhatsApp par milega"}</b></span>
              </div>
            </div>
          )}
        </div>

        <div className="mt-6 grid gap-6 lg:grid-cols-[1fr_380px]">
          {/* FORM */}
          <div className="card-glow rounded-3xl p-6">
            {!ok ? (
              <>
                <h2 className="font-display text-2xl font-black text-white">📝 SLOT BOOKING FORM</h2>
                <div className="mt-3 rounded-2xl bg-amber-400/10 p-4 text-sm text-amber-100 ring-1 ring-amber-400/30">
                  Pehle <b>Rs {t.entryFee}</b> → <b>{PAYMENT_NUMBER_DISPLAY}</b> (Easypaisa / JazzCash / Sadapay) par bhejo, phir TrxID neeche likho.
                  <button onClick={copy} className="ml-2 rounded-lg bg-amber-400 px-3 py-1 text-xs font-black text-black">{copied ? "✅ Copied" : "📋 Copy Number"}</button>
                </div>
                <div className="mt-4 grid grid-cols-3 gap-2">
                  {PAYMENT_METHODS.map((m) => (
                    <button
                      type="button"
                      key={m.id}
                      onClick={() => setForm({ ...form, paymentMethod: m.name })}
                      className={`rounded-xl border p-3 text-center text-sm font-bold ${form.paymentMethod === m.name ? "border-orange-500 bg-orange-500/15 text-white" : "border-white/10 bg-white/5 text-slate-300"}`}
                    >
                      <div className="text-xl">{m.icon}</div>{m.name}
                    </button>
                  ))}
                </div>
                <form onSubmit={submit} className="mt-4 space-y-3">
                  <div className="grid gap-3 sm:grid-cols-2">
                    <input required placeholder="Team Name *" value={form.teamName} onChange={(e) => setForm({ ...form, teamName: e.target.value })} className="rounded-xl border border-white/10 bg-white/5 px-4 py-3 text-sm text-white outline-none focus:border-orange-500" />
                    <input required placeholder="Captain Name *" value={form.captainName} onChange={(e) => setForm({ ...form, captainName: e.target.value })} className="rounded-xl border border-white/10 bg-white/5 px-4 py-3 text-sm text-white outline-none focus:border-orange-500" />
                  </div>
                  <div className="grid gap-3 sm:grid-cols-2">
                    <input required placeholder="WhatsApp Number *" value={form.whatsapp} onChange={(e) => setForm({ ...form, whatsapp: e.target.value })} className="rounded-xl border border-white/10 bg-white/5 px-4 py-3 text-sm text-white outline-none focus:border-orange-500" />
                    <input required placeholder="FF UID *" value={form.ffUid} onChange={(e) => setForm({ ...form, ffUid: e.target.value })} className="rounded-xl border border-white/10 bg-white/5 px-4 py-3 text-sm text-white outline-none focus:border-orange-500" />
                  </div>
                  <textarea placeholder="Team Members (name - UID) ..." value={form.teamMembers} onChange={(e) => setForm({ ...form, teamMembers: e.target.value })} rows={3} className="w-full rounded-xl border border-white/10 bg-white/5 px-4 py-3 text-sm text-white outline-none focus:border-orange-500" />
                  <div className="grid gap-3 sm:grid-cols-2">
                    <input required placeholder="Fee bhejne wala number *" value={form.senderNumber} onChange={(e) => setForm({ ...form, senderNumber: e.target.value })} className="rounded-xl border border-white/10 bg-white/5 px-4 py-3 text-sm text-white outline-none focus:border-orange-500" />
                    <input required placeholder="Transaction ID (TrxID) *" value={form.trxId} onChange={(e) => setForm({ ...form, trxId: e.target.value })} className="rounded-xl border border-amber-400/30 bg-amber-400/5 px-4 py-3 text-sm text-white outline-none focus:border-amber-400" />
                  </div>
                  {err && <div className="rounded-xl bg-red-500/15 p-3 text-sm font-bold text-red-300">⚠️ {err}</div>}
                  <button disabled={sending} className="fire-btn w-full rounded-2xl py-4 font-black text-white">
                    {sending ? "⏳ SUBMIT..." : `✅ CONFIRM SLOT — Rs ${t.entryFee}`}
                  </button>
                </form>
              </>
            ) : (
              <div className="py-6 text-center">
                <div className="mx-auto grid h-16 w-16 place-items-center rounded-full bg-green-500/20 text-4xl">✅</div>
                <h3 className="font-display mt-3 text-2xl font-black text-white">MUBARAK! SLOT MIL GAYI 🎉</h3>
                <p className="mx-auto mt-2 max-w-md text-sm text-slate-300">Team <b className="text-white">{ok.team}</b> ki request save ho gayi (TrxID: {ok.trx}). Screenshot WhatsApp karo taake instant approve ho!</p>
                <a href={whatsappJoinLink(ok.team, t.title, ok.trx)} target="_blank" className="mt-4 block rounded-2xl bg-[#25D366] py-4 font-black text-white">📤 SCREENSHOT WHATSAPP KARO</a>
                <a href="/" className="mt-2 block rounded-2xl border border-white/15 py-3 text-sm font-bold text-white">← Aur matches dekho</a>
              </div>
            )}
          </div>

          {/* SIDE */}
          <div className="space-y-4">
            <div className="card-glow rounded-3xl p-5">
              <div className="text-xs font-black tracking-widest text-orange-300">💳 PAYMENT NUMBERS</div>
              {PAYMENT_METHODS.map((m) => (
                <div key={m.id} className="mt-3 flex items-center justify-between rounded-2xl bg-black/40 p-3 ring-1 ring-white/10">
                  <div className="flex items-center gap-2 text-sm font-bold text-white"><span className="text-xl">{m.icon}</span>{m.name}<span className="text-xs font-normal text-slate-400">• {PAYMENT_NUMBER_DISPLAY}</span></div>
                </div>
              ))}
              <div className="mt-3 text-xs text-slate-400">Account Title: <b className="text-white">Zaid</b> • Teenon same number par</div>
              <a href={WHATSAPP_LINK} target="_blank" className="mt-3 block rounded-xl bg-[#25D366] py-3 text-center text-sm font-black text-white">💬 {WHATSAPP_DISPLAY}</a>
            </div>

            <div className="card-glow rounded-3xl p-5">
              <div className="flex items-center justify-between">
                <div className="text-xs font-black tracking-widest text-green-300">✅ APPROVED TEAMS ({approved.length})</div>
                {pending > 0 && <div className="text-xs text-slate-400">⏳ {pending} pending</div>}
              </div>
              <div className="mt-3 max-h-80 space-y-2 overflow-y-auto">
                {approved.length === 0 && <div className="rounded-xl bg-white/5 p-4 text-center text-xs text-slate-400">Abhi koi team approve nahi — tum pehle ban sakte ho! 🔥</div>}
                {approved.map((r: any, i: number) => (
                  <div key={r.id} className="flex items-center gap-2 rounded-xl bg-white/5 px-3 py-2 text-sm">
                    <span className="grid h-7 w-7 shrink-0 place-items-center rounded-lg bg-green-500/20 text-xs font-black text-green-300">{i + 1}</span>
                    <span className="truncate font-bold text-white">{r.teamName}</span>
                    <span className="ml-auto text-[11px] text-green-300">✔</span>
                  </div>
                ))}
                {registrations.filter((r) => r.status === "pending").slice(0, 8).map((r: any) => (
                  <div key={r.id} className="flex items-center gap-2 rounded-xl bg-white/[0.02] px-3 py-2 text-sm opacity-60">
                    <span className="grid h-7 w-7 shrink-0 place-items-center rounded-lg bg-amber-400/20 text-xs">⏳</span>
                    <span className="truncate text-slate-300">{r.teamName}</span>
                    <span className="ml-auto text-[11px] text-amber-300">pending</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>

      <a href={WHATSAPP_LINK} target="_blank" className="fixed bottom-5 right-5 z-40 grid h-14 w-14 place-items-center rounded-full bg-[#25D366] text-3xl shadow-xl">💬</a>
    </div>
  );
}
