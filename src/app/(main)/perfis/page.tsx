"use client";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";

interface Profile { id: number; name: string; avatar: string; ageGroup: string; isKids: boolean; }

const COLORS: Record<string, string> = { blue: "#3B82F6", red: "#E50914", green: "#10B981", purple: "#8B5CF6", yellow: "#F59E0B", pink: "#EC4899" };
const COLOR_KEYS = Object.keys(COLORS);

function ProfileCard({ profile, onClick }: { profile: Profile; onClick: () => void }) {
  const color = COLORS[profile.avatar] || COLORS.blue;
  return (
    <button onClick={onClick} className="group bg-none border-none cursor-pointer flex flex-col items-center gap-3 transition-transform duration-200 hover:scale-105">
      <div className="w-[120px] h-[120px] rounded-xl flex items-center justify-center text-4xl font-extrabold text-white border-[3px] border-transparent transition-colors duration-200 group-hover:border-white/50"
        style={{ background: `linear-gradient(135deg, ${color}, ${color}88)` }}>
        {profile.isKids ? "K" : profile.name[0].toUpperCase()}
      </div>
      <span className="text-white/70 text-base">{profile.name}</span>
    </button>
  );
}

function AddProfileCard({ onClick }: { onClick: () => void }) {
  return (
    <button onClick={onClick} className="group bg-none border-none cursor-pointer flex flex-col items-center gap-3 transition-transform duration-200 hover:scale-105">
      <div className="w-[120px] h-[120px] rounded-xl bg-white/5 flex items-center justify-center text-5xl text-white/30 border-[3px] border-white/10 group-hover:border-white/30 group-hover:bg-white/10 transition">
        +
      </div>
      <span className="text-white/50 text-base">Adicionar perfil</span>
    </button>
  );
}

export default function ProfilePicker() {
  const router = useRouter();
  useEffect(() => { router.replace('/home'); }, [router]);
  const [profiles, setProfiles] = useState<Profile[]>([]);
  const [loading, setLoading] = useState(true);
  const [adding, setAdding] = useState(false);
  const [newName, setNewName] = useState("");
  const [newColor, setNewColor] = useState("blue");
  const [newIsKids, setNewIsKids] = useState(false);

  useEffect(() => { loadProfiles(); }, []);

  async function loadProfiles() {
    try {
      const res = await fetch("/api/profiles", { credentials: 'include' });
      if (res.status === 401) { window.location.href = "/login"; return; }
      const data = await res.json();
      setProfiles(data);
    } catch { } finally { setLoading(false); }
  }

  async function createProfile() {
    if (!newName.trim()) return;
    await fetch("/api/profiles", { method: "POST", credentials: 'include', headers: { "Content-Type": "application/json" }, body: JSON.stringify({ name: newName.trim(), avatar: newColor, isKids: newIsKids, ageGroup: newIsKids ? "kids-7-9" : "adults-18" }) });
    setNewName(""); setAdding(false); setNewIsKids(false);
    loadProfiles();
  }

  function selectProfile(profile: Profile) {
    document.cookie = "profileId=" + profile.id + ";path=/;max-age=" + (60*60*24*30);
    document.cookie = "profileName=" + profile.name + ";path=/;max-age=" + (60*60*24*30);
    document.cookie = "profileAgeGroup=" + profile.ageGroup + ";path=/;max-age=" + (60*60*24*30);
    window.location.href = "/home";
  }

  if (loading) return (
    <main className="min-h-screen flex items-center justify-center bg-[#0a0a1a]">
      <div className="text-white/50 text-xs uppercase tracking-widest">Carregando...</div>
    </main>
  );

  return (
    <main className="min-h-screen flex flex-col items-center justify-center p-8 bg-[#0a0a1a]">
      <h1 className="text-white text-3xl md:text-4xl font-normal mb-10">Quem esta assistindo?</h1>
      <div className="flex gap-8 flex-wrap justify-center mb-12">
        {profiles.map((p) => (<ProfileCard key={p.id} profile={p} onClick={() => selectProfile(p)} />))}
        {profiles.length < 5 && <AddProfileCard onClick={() => setAdding(true)} />}
      </div>

      {adding && (
        <div className="bg-white/5 rounded-xl p-8 border border-white/10 max-w-[400px] w-full">
          <h3 className="text-white text-lg mb-4">Novo perfil</h3>
          <input value={newName} onChange={(e) => setNewName(e.target.value)} placeholder="Nome do perfil" maxLength={20}
            className="w-full px-3 py-3 rounded-lg border border-white/15 bg-white/5 text-white text-base mb-4 box-border outline-none placeholder:text-white/30" />
          <div className="flex gap-2 mb-4">
            {COLOR_KEYS.map((c) => (
              <button key={c} onClick={() => setNewColor(c)}
                className="w-9 h-9 rounded-full cursor-pointer transition-all"
                style={{ background: COLORS[c], border: newColor === c ? "3px solid #fff" : "2px solid transparent" }} />
            ))}
          </div>
          <label className="flex items-center gap-2 text-white/70 mb-6 cursor-pointer text-sm">
            <input type="checkbox" checked={newIsKids} onChange={(e) => setNewIsKids(e.target.checked)} className="accent-white" />
            Perfil infantil
          </label>
          <div className="flex gap-3">
            <button onClick={createProfile}
              className="flex-1 py-3 rounded-lg border-none bg-white text-[#0a0a1a] font-bold cursor-pointer text-sm hover:bg-white/90 transition">
              Criar
            </button>
            <button onClick={() => setAdding(false)}
              className="flex-1 py-3 rounded-lg border border-white/20 bg-transparent text-white/60 cursor-pointer text-sm hover:text-white hover:bg-white/5 transition">
              Cancelar
            </button>
          </div>
        </div>
      )}
    </main>
  );
}