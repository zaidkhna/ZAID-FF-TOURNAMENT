"use client";

import { useEffect, useState } from "react";

type T = any;
type R = any;

export default function AdminPage() {
  const [authed, setAuthed] = useState(false);
  const [adminUser, setAdminUser] = useState("");
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [loginError, setLoginError] = useState("");
  const [loggingIn, setLoggingIn] = useState(false);

  const [tournaments, setTournaments] = useState<T[]>([]);
  const [regs, setRegs] = useState<R[]>([]);
  const [winners, setWinners] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [tab, setTab] = useState<"matches" | "regs" | "winners">("matches");

  const [form, setForm] = useState({
    title: "",
    gameMode: "Squad",
    map: "Bermuda",
    matchDate: "",
    entryFee: 100,
    prizePool: 1000,
    perKill: 20,
    maxSlots: 48,
    status: "upcoming",
    roomId: "",
    roomPass: "",
    description: "",
    featured: false,
  });
  const [winForm, setWinForm] = useState({ tournamentTitle: "", position: 1, teamName: "", playerName: "", prize: 0, kills: 0 });

  function getToken() {
    if (typeof window === "undefined") return "";
    return localStorage.getItem("zaid-admin-token") || "";
  }

  function authHeaders(): HeadersInit {
    return { "Content-Type": "application/json", "x-admin-token": getToken() };
  }

  useEffect(() => {
    const t = localStorage.getItem("zaid-admin-token");
    const u = localStorage.getItem("zaid-admin-user");
    if (t && u) {
      setAuthed(true);
      setAdminUser(u);
    }
  }, []);

  async function login(e: React.FormEvent) {
    e.preventDefault();
    setLoggingIn(true);
    setLoginError("");
    try {
      const res = await fetch("/api/admin/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ username, password }),
      });
      const data = await res.json();
      if (!res.ok) {
        setLoginError(data.error || "Login failed");
        setLoggingIn(false);
        return;
      }
      localStorage.setItem("zaid-admin-token", data.token);
      localStorage.setItem("zaid-admin-user", data.username);
      setAdminUser(data.username);
      setAuthed(true);
      setLoggingIn(false);
    } catch {
      setLoginError("Network error. Dobara try karo.");
      setLoggingIn(false);
    }
  }

  function logout() {
    localStorage.removeItem("zaid-admin-token");
    localStorage.removeItem("zaid-admin-user");
    localStorage.removeItem("zaid-admin"); // purana key bhi clear
    location.reload();
  }

  async function load() {
    setLoading(true);
    try {
      const [a, b, c] = await Promise.all([
        fetch("/api/tournaments").then((r) => r.json()),
        fetch("/api/registrations").then((r) => r.json()),
        fetch("/api/winners").then((r) => r.json()),
      ]);
      setTournaments(Array.isArray(a) ? a : []);
      setRegs(Array.isArray(b) ? b : []);
      setWinners(Array.isArray(c) ? c : []);
    } catch {}
    setLoading(false);
  }

  useEffect(() => {
    if (authed) load();
  }, [authed]);

  async function createTournament(e: React.FormEvent) {
    e.preventDefault();
    const res = await fetch("/api/tournaments", {
      method: "POST",
      headers: authHeaders(),
      body: JSON.stringify(form),
    });
    if (res.ok) {
      alert("Tournament ban gaya! 🔥");
      setForm({ ...form, title: "", roomId: "", roomPass: "", description: "" });
      load();
    } else if (res.status === 401) {
      alert("Session khatam — dobara login karo");
      logout();
    } else {
      const d = await res.json();
      alert(d.error || "Failed");
    }
  }

  async function updateStatus(id: number, status: string) {
    const res = await fetch("/api/tournaments", { method: "PATCH", headers: authHeaders(), body: JSON.stringify({ id, status }) });
    if (res.status === 401) { alert("Dobara login karo"); logout(); return; }
    load();
  }
  async function delTournament(id: number) {
    if (!confirm("Delete this tournament + its registrations?")) return;
    const res = await fetch(`/api/tournaments?id=${id}`, { method: "DELETE", headers: { "x-admin-token": getToken() } });
    if (res.status === 401) { alert("Dobara login karo"); logout(); return; }
    load();
  }
  async function setReg(id: number, status: string) {
    const res = await fetch("/api/registrations", { method: "PATCH", headers: authHeaders(), body: JSON.stringify({ id, status }) });
    if (res.status === 401) { alert("Dobara login karo"); logout(); return; }
    load();
  }
  async function addWinner(e: React.FormEvent) {
    e.preventDefault();
    const res = await fetch("/api/winners", { method: "POST", headers: authHeaders(), body: JSON.stringify(winForm) });
    if (res.status === 401) { alert("Dobara login karo"); logout(); return; }
    if (res.ok) {
      setWinForm({ tournamentTitle: "", position: 1, teamName: "", playerName: "", prize: 0, kills: 0 });
      load();
    }
  }
  async function delWinner(id: number) {
    const res = await fetch(`/api/winners?id=${id}`, { method: "DELETE", headers: { "x-admin-token": getToken() } });
    if (res.status === 401) { alert("Dobara login karo"); logout(); return; }
    load();
  }

  if (!authed) {
    return (
      <div className="grid min-h-screen place-items-center bg-[#07090f] p-6">
        <form onSubmit={login} className="card-glow w-full max-w-sm rounded-3xl p-8 text-center">
          <div className="mx-auto grid h-16 w-16 place-items-center rounded-2xl bg-gradient-to-br from-amber-400 via-orange-500 to-red-600 text-4xl shadow-xl">🔥</div>
          <h1 className="font-display mt-4 text-2xl font-black text-white">ZAID FF ADMIN</h1>
          <p className="mt-1 text-sm text-slate-400">Username + Password dalo — sirf Zaid ke liye 🔐</p>
          <div className="mt-5 space-y-3 text-left">
            <label className="block">
              <span className="text-xs font-bold text-slate-300">👤 Username</span>
              <input value={username} onChange={(e) => setUsername(e.target.value)} placeholder="zaidkhan_491" autoComplete="username" className="mt-1 w-full rounded-xl border border-white/10 bg-white/5 px-4 py-3 text-white outline-none focus:border-orange-500" />
            </label>
            <label className="block">
              <span className="text-xs font-bold text-slate-300">🔑 Password</span>
              <input type="password" value={password} onChange={(e) => setPassword(e.target.value)} placeholder="••••••••" autoComplete="current-password" className="mt-1 w-full rounded-xl border border-white/10 bg-white/5 px-4 py-3 text-white outline-none focus:border-orange-500" />
            </label>
          </div>
          {loginError && <div className="mt-3 rounded-xl bg-red-500/15 p-3 text-sm font-bold text-red-300">⚠️ {loginError}</div>}
          <button disabled={loggingIn} className="fire-btn mt-4 w-full rounded-xl py-3 font-black text-white disabled:opacity-60">
            {loggingIn ? "⏳ CHECKING..." : "LOGIN 🚀"}
          </button>
          <a href="/" className="mt-4 block text-xs text-slate-500">← Back to Home (Website)</a>
          <div className="mt-3 rounded-xl bg-white/5 p-3 text-left text-[11px] leading-relaxed text-slate-500">
            💡 <b className="text-slate-300">Login kaise karein:</b><br />
            1. Apni website kholo: <b className="text-slate-300">yoursite.com/admin</b><br />
            2. Username + Password likho<br />
            3. Login ke baad Matches / Slots / Winners manage karo
          </div>
        </form>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#07090f] p-4 md:p-8">
      <div className="mx-auto max-w-6xl">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <div>
            <h1 className="font-display text-2xl font-black text-white md:text-3xl">🔥 ZAID ADMIN PANEL</h1>
            <div className="mt-1 text-xs text-slate-400">Logged in as <b className="text-green-300">@{adminUser}</b> ✅</div>
          </div>
          <div className="flex gap-2">
            <a href="/" className="rounded-xl border border-white/15 px-4 py-2 text-sm font-bold text-white">🏠 Website</a>
            <button onClick={logout} className="rounded-xl bg-red-600 px-4 py-2 text-sm font-bold text-white">Logout</button>
          </div>
        </div>

        <div className="mt-4 flex flex-wrap gap-2">
          {(["matches", "regs", "winners"] as const).map((x) => (
            <button key={x} onClick={() => setTab(x)} className={`rounded-full px-5 py-2 text-sm font-bold ${tab === x ? "bg-gradient-to-r from-orange-500 to-red-600 text-white" : "bg-white/5 text-slate-300"}`}>
              {x === "matches" ? `🎮 Matches (${tournaments.length})` : x === "regs" ? `📝 Registrations (${regs.length})` : `🏆 Winners (${winners.length})`}
            </button>
          ))}
          <button onClick={load} className="rounded-full bg-white/10 px-4 py-2 text-sm font-bold text-white">↻ Refresh</button>
        </div>

        {loading ? (
          <div className="mt-8 text-center text-slate-400">Loading...</div>
        ) : tab === "matches" ? (
          <div className="mt-6 grid gap-6 lg:grid-cols-[380px_1fr]">
            <form onSubmit={createTournament} className="card-glow h-fit rounded-3xl p-6">
              <h2 className="font-black text-white">+ Naya Tournament</h2>
              <div className="mt-3 space-y-2.5 text-sm">
                <input required placeholder="Title e.g. Squad Showdown #12" value={form.title} onChange={(e) => setForm({ ...form, title: e.target.value })} className="w-full rounded-xl border border-white/10 bg-white/5 px-3 py-2.5 text-white outline-none" />
                <div className="grid grid-cols-2 gap-2">
                  <select value={form.gameMode} onChange={(e) => setForm({ ...form, gameMode: e.target.value })} className="rounded-xl border border-white/10 bg-[#1a2133] px-3 py-2.5 text-white">
                    <option>Solo</option><option>Duo</option><option>Squad</option><option>Lone Wolf</option>
                  </select>
                  <select value={form.map} onChange={(e) => setForm({ ...form, map: e.target.value })} className="rounded-xl border border-white/10 bg-[#1a2133] px-3 py-2.5 text-white">
                    <option>Bermuda</option><option>Purgatory</option><option>Kalahari</option><option>Alpine</option><option>NeXTerra</option>
                  </select>
                </div>
                <label className="block text-xs text-slate-400">Match Date & Time<input type="datetime-local" required value={form.matchDate} onChange={(e) => setForm({ ...form, matchDate: e.target.value })} className="mt-1 w-full rounded-xl border border-white/10 bg-white/5 px-3 py-2.5 text-white" /></label>
                <div className="grid grid-cols-3 gap-2">
                  <label className="text-xs text-slate-400">Entry<input type="number" value={form.entryFee} onChange={(e) => setForm({ ...form, entryFee: Number(e.target.value) })} className="mt-1 w-full rounded-xl border border-white/10 bg-white/5 px-3 py-2.5 text-white" /></label>
                  <label className="text-xs text-slate-400">Prize<input type="number" value={form.prizePool} onChange={(e) => setForm({ ...form, prizePool: Number(e.target.value) })} className="mt-1 w-full rounded-xl border border-white/10 bg-white/5 px-3 py-2.5 text-white" /></label>
                  <label className="text-xs text-slate-400">PerKill<input type="number" value={form.perKill} onChange={(e) => setForm({ ...form, perKill: Number(e.target.value) })} className="mt-1 w-full rounded-xl border border-white/10 bg-white/5 px-3 py-2.5 text-white" /></label>
                </div>
                <div className="grid grid-cols-2 gap-2">
                  <label className="text-xs text-slate-400">Max Slots<input type="number" value={form.maxSlots} onChange={(e) => setForm({ ...form, maxSlots: Number(e.target.value) })} className="mt-1 w-full rounded-xl border border-white/10 bg-white/5 px-3 py-2.5 text-white" /></label>
                  <label className="text-xs text-slate-400">Status<select value={form.status} onChange={(e) => setForm({ ...form, status: e.target.value })} className="mt-1 w-full rounded-xl border border-white/10 bg-[#1a2133] px-3 py-2.5 text-white"><option value="upcoming">upcoming</option><option value="live">live</option><option value="full">full</option><option value="completed">completed</option></select></label>
                </div>
                <div className="grid grid-cols-2 gap-2">
                  <input placeholder="Room ID" value={form.roomId} onChange={(e) => setForm({ ...form, roomId: e.target.value })} className="rounded-xl border border-white/10 bg-white/5 px-3 py-2.5 text-white outline-none" />
                  <input placeholder="Room Pass" value={form.roomPass} onChange={(e) => setForm({ ...form, roomPass: e.target.value })} className="rounded-xl border border-white/10 bg-white/5 px-3 py-2.5 text-white outline-none" />
                </div>
                <textarea placeholder="Description..." value={form.description} onChange={(e) => setForm({ ...form, description: e.target.value })} rows={2} className="w-full rounded-xl border border-white/10 bg-white/5 px-3 py-2.5 text-white outline-none" />
                <label className="flex items-center gap-2 text-xs text-slate-300"><input type="checkbox" checked={form.featured} onChange={(e) => setForm({ ...form, featured: e.target.checked })} /> ⭐ Featured (homepage top)</label>
                <button className="fire-btn w-full rounded-xl py-3 font-black text-white">CREATE MATCH 🔥</button>
              </div>
            </form>
            <div className="space-y-3">
              {tournaments.map((t) => (
                <div key={t.id} className="card-glow rounded-2xl p-4">
                  <div className="flex flex-wrap items-center gap-2">
                    <span className="font-black text-white">{t.title}</span>
                    <span className="rounded-full bg-white/10 px-2 py-0.5 text-xs text-slate-300">{t.gameMode} • Rs{t.entryFee} → Rs{t.prizePool}</span>
                    <span className="rounded-full bg-white/10 px-2 py-0.5 text-xs text-slate-300">{t.filledSlots}/{t.maxSlots}</span>
                  </div>
                  <div className="mt-2 flex flex-wrap gap-2 text-xs font-bold">
                    {(["upcoming", "live", "full", "completed"] as const).map((s) => (
                      <button key={s} onClick={() => updateStatus(t.id, s)} className={`rounded-full px-3 py-1 ${t.status === s ? "bg-green-600 text-white" : "bg-white/10 text-slate-300"}`}>{s}</button>
                    ))}
                    <a href={`/tournament/${t.id}`} target="_blank" className="rounded-full bg-blue-600 px-3 py-1 text-white">View</a>
                    <button onClick={() => delTournament(t.id)} className="rounded-full bg-red-600 px-3 py-1 text-white">Delete</button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        ) : tab === "regs" ? (
          <div className="mt-6 space-y-3">
            {regs.length === 0 && <div className="card-glow rounded-2xl p-6 text-center text-slate-400">Koi registration nahi abhi.</div>}
            {regs.map((r) => (
              <div key={r.id} className="card-glow rounded-2xl p-4 text-sm">
                <div className="flex flex-wrap items-center gap-2">
                  <b className="text-white">{r.teamName}</b>
                  <span className="text-slate-400">({r.captainName} • {r.whatsapp} • UID:{r.ffUid})</span>
                  <span className={`ml-auto rounded-full px-3 py-1 text-xs font-bold ${r.status === "approved" ? "bg-green-600 text-white" : r.status === "rejected" ? "bg-red-600 text-white" : "bg-amber-500 text-black"}`}>{r.status}</span>
                </div>
                <div className="mt-1 text-xs text-slate-400">T:{r.tournamentId} • {r.paymentMethod} • From:{r.senderNumber} • Trx:{r.trxId} • {r.teamMembers}</div>
                <div className="mt-2 flex flex-wrap gap-2">
                  <button onClick={() => setReg(r.id, "approved")} className="rounded-lg bg-green-600 px-4 py-1.5 text-xs font-bold text-white">✅ Approve</button>
                  <button onClick={() => setReg(r.id, "rejected")} className="rounded-lg bg-red-600 px-4 py-1.5 text-xs font-bold text-white">❌ Reject</button>
                  <button onClick={() => setReg(r.id, "pending")} className="rounded-lg bg-white/10 px-4 py-1.5 text-xs font-bold text-white">⏳ Pending</button>
                  <a href={`https://wa.me/92${String(r.whatsapp || "").replace(/\D/g, "").slice(-10)}`} target="_blank" className="rounded-lg bg-[#25D366] px-4 py-1.5 text-xs font-bold text-white">💬 WhatsApp</a>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="mt-6 grid gap-6 lg:grid-cols-[340px_1fr]">
            <form onSubmit={addWinner} className="card-glow h-fit rounded-3xl p-6">
              <h2 className="font-black text-white">+ Add Winner</h2>
              <div className="mt-3 space-y-2">
                <input required placeholder="Tournament e.g. Squad #12" value={winForm.tournamentTitle} onChange={(e) => setWinForm({ ...winForm, tournamentTitle: e.target.value })} className="w-full rounded-xl border border-white/10 bg-white/5 px-3 py-2.5 text-white outline-none" />
                <div className="grid grid-cols-2 gap-2">
                  <input type="number" placeholder="Position" value={winForm.position} onChange={(e) => setWinForm({ ...winForm, position: Number(e.target.value) })} className="rounded-xl border border-white/10 bg-white/5 px-3 py-2.5 text-white" />
                  <input type="number" placeholder="Prize Rs" value={winForm.prize} onChange={(e) => setWinForm({ ...winForm, prize: Number(e.target.value) })} className="rounded-xl border border-white/10 bg-white/5 px-3 py-2.5 text-white" />
                </div>
                <input required placeholder="Team Name" value={winForm.teamName} onChange={(e) => setWinForm({ ...winForm, teamName: e.target.value })} className="w-full rounded-xl border border-white/10 bg-white/5 px-3 py-2.5 text-white outline-none" />
                <div className="grid grid-cols-2 gap-2">
                  <input placeholder="Player" value={winForm.playerName} onChange={(e) => setWinForm({ ...winForm, playerName: e.target.value })} className="rounded-xl border border-white/10 bg-white/5 px-3 py-2.5 text-white" />
                  <input type="number" placeholder="Kills" value={winForm.kills} onChange={(e) => setWinForm({ ...winForm, kills: Number(e.target.value) })} className="rounded-xl border border-white/10 bg-white/5 px-3 py-2.5 text-white" />
                </div>
                <button className="fire-btn w-full rounded-xl py-3 font-black text-white">ADD 🏆</button>
              </div>
            </form>
            <div className="space-y-2">
              {winners.map((w) => (
                <div key={w.id} className="card-glow flex items-center gap-3 rounded-2xl p-3 text-sm">
                  <span className="font-black text-amber-300">#{w.position}</span>
                  <span className="font-bold text-white">{w.teamName}</span>
                  <span className="text-slate-400">{w.tournamentTitle} • Rs{w.prize}</span>
                  <button onClick={() => delWinner(w.id)} className="ml-auto rounded-lg bg-red-600 px-3 py-1 text-xs font-bold text-white">Del</button>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
