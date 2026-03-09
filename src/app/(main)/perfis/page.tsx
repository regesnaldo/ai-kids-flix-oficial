"use client";
import { useEffect, useState } from "react";

interface Profile { id: number; name: string; avatar: string; ageGroup: string; isKids: boolean; }

const COLORS: Record<string, string> = { blue: "#3B82F6", red: "#E50914", green: "#10B981", purple: "#8B5CF6", yellow: "#F59E0B", pink: "#EC4899" };
const COLOR_KEYS = Object.keys(COLORS);

function ProfileCard({ profile, onClick }: { profile: Profile; onClick: () => void }) {
  const color = COLORS[profile.avatar] || COLORS.blue;
  return (
    <button onClick={onClick} style={{ background: "none", border: "none", cursor: "pointer", display: "flex", flexDirection: "column", alignItems: "center", gap: "0.75rem", transition: "transform 0.2s" }}
      onMouseEnter={(e) => e.currentTarget.style.transform = "scale(1.05)"}
      onMouseLeave={(e) => e.currentTarget.style.transform = "scale(1)"}>
      <div style={{ width: "120px", height: "120px", borderRadius: "12px", background: `linear-gradient(135deg, ${color}, ${color}88)`, display: "flex", alignItems: "center", justifyContent: "center", fontSize: "2.5rem", fontWeight: 800, color: "#fff", border: "3px solid transparent", transition: "border-color 0.2s" }}
        onMouseEnter={(e) => e.currentTarget.style.borderColor = "rgba(255,255,255,0.5)"}
        onMouseLeave={(e) => e.currentTarget.style.borderColor = "transparent"}>
        {profile.isKids ? "K" : profile.name[0].toUpperCase()}
      </div>
      <span style={{ color: "rgba(255,255,255,0.7)", fontSize: "1rem" }}>{profile.name}</span>
    </button>
  );
}

function AddProfileCard({ onClick }: { onClick: () => void }) {
  return (
    <button onClick={onClick} style={{ background: "none", border: "none", cursor: "pointer", display: "flex", flexDirection: "column", alignItems: "center", gap: "0.75rem", transition: "transform 0.2s" }}
      onMouseEnter={(e) => e.currentTarget.style.transform = "scale(1.05)"}
      onMouseLeave={(e) => e.currentTarget.style.transform = "scale(1)"}>
      <div style={{ width: "120px", height: "120px", borderRadius: "12px", background: "rgba(255,255,255,0.05)", display: "flex", alignItems: "center", justifyContent: "center", fontSize: "3rem", color: "rgba(255,255,255,0.3)", border: "3px solid rgba(255,255,255,0.1)" }}>+</div>
      <span style={{ color: "rgba(255,255,255,0.5)", fontSize: "1rem" }}>Adicionar perfil</span>
    </button>
  );
}

export default function ProfilePicker() {
  const [profiles, setProfiles] = useState<Profile[]>([]);
  const [loading, setLoading] = useState(true);
  const [adding, setAdding] = useState(false);
  const [newName, setNewName] = useState("");
  const [newColor, setNewColor] = useState("blue");
  const [newIsKids, setNewIsKids] = useState(false);

  useEffect(() => { loadProfiles(); }, []);

  async function loadProfiles() {
    try {
      const res = await fetch("/api/profiles");
      if (res.status === 401) { window.location.href = "/login"; return; }
      const data = await res.json();
      setProfiles(data);
    } catch {} finally { setLoading(false); }
  }

  async function createProfile() {
    if (!newName.trim()) return;
    await fetch("/api/profiles", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ name: newName.trim(), avatar: newColor, isKids: newIsKids, ageGroup: newIsKids ? "kids-7-9" : "adults-18" }) });
    setNewName(""); setAdding(false); setNewIsKids(false);
    loadProfiles();
  }

  function selectProfile(profile: Profile) {
    document.cookie = "profileId=" + profile.id + ";path=/;max-age=" + (60*60*24*30);
    document.cookie = "profileName=" + profile.name + ";path=/;max-age=" + (60*60*24*30);
    document.cookie = "profileAgeGroup=" + profile.ageGroup + ";path=/;max-age=" + (60*60*24*30);
    window.location.href = "/home";
  }

  if (loading) return (<main style={{ backgroundColor: "#141414", minHeight: "100vh", display: "flex", alignItems: "center", justifyContent: "center" }}><div style={{ color: "rgba(255,255,255,0.5)", fontSize: "0.9rem", textTransform: "uppercase", letterSpacing: "0.15em" }}>Carregando...</div></main>);

  return (
    <main style={{ backgroundColor: "#141414", minHeight: "100vh", display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", padding: "2rem" }}>
      <h1 style={{ color: "#fff", fontSize: "2.5rem", fontWeight: 400, marginBottom: "2.5rem" }}>Quem esta assistindo?</h1>
      <div style={{ display: "flex", gap: "2rem", flexWrap: "wrap", justifyContent: "center", marginBottom: "3rem" }}>
        {profiles.map((p) => (<ProfileCard key={p.id} profile={p} onClick={() => selectProfile(p)} />))}
        {profiles.length < 5 && <AddProfileCard onClick={() => setAdding(true)} />}
      </div>
      {adding && (
        <div style={{ background: "rgba(255,255,255,0.05)", borderRadius: "12px", padding: "2rem", border: "1px solid rgba(255,255,255,0.1)", maxWidth: "400px", width: "100%" }}>
          <h3 style={{ color: "#fff", margin: "0 0 1rem", fontSize: "1.1rem" }}>Novo perfil</h3>
          <input value={newName} onChange={(e) => setNewName(e.target.value)} placeholder="Nome do perfil" maxLength={20} style={{ width: "100%", padding: "0.75rem", borderRadius: "8px", border: "1px solid rgba(255,255,255,0.15)", background: "rgba(255,255,255,0.05)", color: "#fff", fontSize: "1rem", marginBottom: "1rem", boxSizing: "border-box" }} />
          <div style={{ display: "flex", gap: "0.5rem", marginBottom: "1rem" }}>
            {COLOR_KEYS.map((c) => (<button key={c} onClick={() => setNewColor(c)} style={{ width: "36px", height: "36px", borderRadius: "50%", border: newColor === c ? "3px solid #fff" : "2px solid transparent", backgroundColor: COLORS[c], cursor: "pointer" }} />))}
          </div>
          <label style={{ display: "flex", alignItems: "center", gap: "0.5rem", color: "rgba(255,255,255,0.7)", marginBottom: "1.5rem", cursor: "pointer" }}>
            <input type="checkbox" checked={newIsKids} onChange={(e) => setNewIsKids(e.target.checked)} /> Perfil infantil
          </label>
          <div style={{ display: "flex", gap: "0.75rem" }}>
            <button onClick={createProfile} style={{ flex: 1, padding: "0.75rem", borderRadius: "8px", border: "none", background: "#fff", color: "#141414", fontWeight: 700, cursor: "pointer", fontSize: "0.9rem" }}>Criar</button>
            <button onClick={() => setAdding(false)} style={{ flex: 1, padding: "0.75rem", borderRadius: "8px", border: "1px solid rgba(255,255,255,0.2)", background: "transparent", color: "rgba(255,255,255,0.6)", cursor: "pointer", fontSize: "0.9rem" }}>Cancelar</button>
          </div>
        </div>
      )}
    </main>
  );
}
