import image_pastor_3 from '@/imports/pastor-3.jpg'
import image_pastor_2 from '@/imports/pastor-2.jpg'
import { useState } from "react"
import lunaImg from "@/imports/pastor-1.jpg"
import loginImg from "@/imports/pastor-1.jpg"
import grupoMascotasImg from "@/imports/grupo_mascotas.jpg"
import logoBlanco from "@/imports/LOGO_BLANCO_CON_A_EN_VERDE.png"
import splashImg from "@/imports/grok-image-b5f773cf-102a-429c-b720-dc9bf49f576e.jpg"
import {
  MapPin, Battery, Wifi, Bell, Heart, Home, ChevronRight,
  Activity, Clock, Navigation, Utensils, User, Plus,
  CheckCircle2, Share2, TrendingUp, Settings, ChevronLeft,
  Eye, EyeOff, ArrowRight, Mail, Lock, Phone, Globe,
  UserCircle2, Send, Layers, ChevronDown
} from "lucide-react"
import { AreaChart, Area, XAxis, YAxis, ResponsiveContainer, BarChart, Bar } from "recharts"

/* ─────────────────── IMAGES ─────────────────────────────── */
const SPLASH_IMG   = splashImg
const LOGIN_IMG    = loginImg
const LUNA_HERO    = lunaImg
const LUNA_THUMB   = "https://images.unsplash.com/photo-1633722715463-d30f4f325e24?w=200&h=200&fit=crop&auto=format"
const MOCHI_HERO   = "https://images.unsplash.com/photo-1570723649488-f5cc599360ac?w=800&h=1000&fit=crop&crop=top&auto=format"
const MOCHI_THUMB  = "https://images.unsplash.com/photo-1515002246390-7bf7e8f87b54?w=200&h=200&fit=crop&auto=format"

/* ─────────────────── DATA ───────────────────────────────── */
const PETS = [
  {
    id: 1, name: "Luna", species: "dog", breed: "Pastor Alemán",
    age: "3 años 2 meses", weight: 28.4, hero: LUNA_HERO, thumb: LUNA_THUMB,
    battery: 78, connected: true,
    address: "Jr. Los Pinos 142, Miraflores", lastSeen: "hace 2 min",
    sex: "Hembra", sterilized: true, microchip: "985141004123456", steps: 8450,
    nextVaccine: { name: "Antirrábica", date: "15 Ago 2025", daysLeft: 26 },
    nextMed:     { name: "Antiparasitario", date: "28 Jul 2025", daysLeft: 8 },
    activity: { distance: 3.2, activeMin: 87, restMin: 891, walks: 3 },
    calories: 1420, caloriesConsumed: 890, meals: 2, totalMeals: 3,
    weightData: [
      { m: "Feb", w: 27.1 }, { m: "Mar", w: 27.5 }, { m: "Abr", w: 27.8 },
      { m: "May", w: 28.1 }, { m: "Jun", w: 28.4 }, { m: "Jul", w: 28.4 },
    ],
    weekData: [
      { d: "L", v: 2.1 }, { d: "M", v: 3.5 }, { d: "X", v: 1.8 },
      { d: "J", v: 4.2 }, { d: "V", v: 3.8 }, { d: "S", v: 5.1 }, { d: "D", v: 3.2 },
    ],
  },
  {
    id: 2, name: "Mochi", species: "cat", breed: "Siamés",
    age: "2 años", weight: 4.2, hero: MOCHI_HERO, thumb: MOCHI_THUMB,
    battery: 45, connected: true,
    address: "Jr. Los Pinos 142, Miraflores", lastSeen: "hace 8 min",
    sex: "Macho", sterilized: true, microchip: null, steps: 3210,
    nextVaccine: { name: "Triple Felina", date: "3 Sep 2025", daysLeft: 45 },
    nextMed: null,
    activity: { distance: 0.8, activeMin: 42, restMin: 936, walks: 5 },
    calories: 320, caloriesConsumed: 240, meals: 3, totalMeals: 4,
    weightData: [
      { m: "Feb", w: 4.0 }, { m: "Mar", w: 4.1 }, { m: "Abr", w: 4.0 },
      { m: "May", w: 4.2 }, { m: "Jun", w: 4.3 }, { m: "Jul", w: 4.2 },
    ],
    weekData: [
      { d: "L", v: 0.5 }, { d: "M", v: 0.8 }, { d: "X", v: 0.6 },
      { d: "J", v: 1.1 }, { d: "V", v: 0.9 }, { d: "S", v: 0.7 }, { d: "D", v: 0.8 },
    ],
  },
]

/* ─────────────────── HELPERS ────────────────────────────── */
const SF = { fontFamily: "'Inter', sans-serif" }

function Pill({ children, green }: { children: React.ReactNode; green?: boolean }) {
  return (
    <span
      className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[11px] font-semibold"
      style={green
        ? { background: "#E3F9EE", color: "#0F9B5A" }
        : { background: "rgba(0,0,0,0.06)", color: "#6B7280" }}
    >
      {children}
    </span>
  )
}

function Field({
  label, type = "text", placeholder, icon: Icon, value, onChange, right,
}: {
  label: string; type?: string; placeholder: string; icon: any;
  value: string; onChange: (v: string) => void; right?: React.ReactNode;
}) {
  return (
    <div>
      <p className="text-xs font-semibold text-foreground mb-1.5">{label}</p>
      <div className="relative">
        <div className="absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none">
          <Icon size={16} className="text-muted-foreground" />
        </div>
        <input
          type={type}
          placeholder={placeholder}
          value={value}
          onChange={e => onChange(e.target.value)}
          className="w-full rounded-xl pl-10 pr-10 py-1.5 text-[11px] text-foreground placeholder:text-muted-foreground outline-none"
          style={{ background: "#F5F6F8" }}
        />
        {right && <div className="absolute right-3.5 top-1/2 -translate-y-1/2">{right}</div>}
      </div>
    </div>
  )
}

function GreenBtn({ label, onClick, disabled }: { label: string; onClick?: () => void; disabled?: boolean }) {
  return (
    <button
      onClick={onClick}
      disabled={disabled}
      className="w-full py-1.5 rounded-2xl text-white font-bold flex items-center justify-center gap-2 transition-opacity text-[12px]"
      style={{ background: disabled ? "#D1D5DB" : "linear-gradient(135deg,#1DA868,#2AB87C)" }}
    >
      {label}
      {!disabled && <ArrowRight size={16} />}
    </button>
  )
}

function OutlineBtn({ label, onClick }: { label: string; onClick?: () => void }) {
  return (
    <button
      onClick={onClick}
      className="w-full py-1.5 rounded-2xl font-bold flex items-center justify-center gap-2 border-2 text-[12px]"
      style={{ borderColor: "#2AB87C", color: "#2AB87C" }}
    >
      {label}
    </button>
  )
}

/* ─────────────────── STATUS BAR ─────────────────────────── */
function StatusBar({ light }: { light?: boolean }) {
  const c = light ? "white" : "#0D1117"
  return (
    <div className="absolute top-0 left-0 right-0 z-30 flex justify-between items-center px-6 pt-3 pb-1 pointer-events-none">
      <span className="text-xs font-black" style={{ color: c }}>9:41</span>
      <div className="flex items-center gap-1.5">
        <div className="flex items-end gap-px">
          {[6, 9, 12, 15].map((h, i) => <div key={i} className="w-1 rounded-sm" style={{ height: h, background: c }} />)}
        </div>
        <Wifi size={12} style={{ color: c }} />
        <div className="w-6 h-3 rounded-sm relative" style={{ border: `1.5px solid ${c}` }}>
          <div className="absolute rounded-sm" style={{ inset: 1.5, width: "75%", background: c }} />
        </div>
      </div>
    </div>
  )
}

/* ══════════════════════════════════════════════════════════
   SCREENS
══════════════════════════════════════════════════════════ */

function SplashScreen() {
  return (
    <div className="h-full flex flex-col" style={SF}>
      <div className="flex-1 relative overflow-hidden">
        <img src={SPLASH_IMG} alt="Mascotas" className="w-full h-full object-cover" />
        <div className="absolute inset-0 pointer-events-none" style={{
          background: "linear-gradient(180deg, rgba(0,0,0,0.38) 0%, transparent 22%, transparent 70%, rgba(0,0,0,0.35) 100%)",
        }} />
        <div className="absolute bottom-0 left-0 right-0 flex flex-col items-center pb-8 gap-1.5">
          <div className="flex flex-col items-center gap-1 px-6 py-3 rounded-2xl" style={{ background: "rgba(0,0,0,0.35)", backdropFilter: "blur(6px)" }}>
            <div className="flex items-center gap-2">
              
              <span className="font-black text-white text-xl tracking-tight" style={{ textShadow: "0 1px 8px rgba(0,0,0,0.4)" }}>PET TRACKER</span>
              <div className="px-2.5 py-0.5 rounded-full" style={{ background: "#2AB87C" }}>
                <span className="text-white text-[10px] font-black tracking-[0.18em]">PRO</span>
              </div>
            </div>
            <div className="flex items-center gap-1">
              <span className="text-white text-[9px] font-semibold opacity-80">By</span>
              <img src={logoBlanco} alt="TrackerMexico GPS" style={{ height: 22, opacity: 0.9 }} />
            </div>
          </div>
        </div>
      </div>
      <div className="shrink-0 px-6 pb-8 bg-white" style={{ borderRadius: "28px 28px 0 0", marginTop: -32, paddingTop: 24 }}>
        <div className="flex justify-center gap-1.5 mb-4" style={{ marginTop: -14 }}>
          {["📍 GPS", "❤️ Salud", "🍽️ Nutrición"].map(f => (
            <div key={f} className="px-2 py-0.5 rounded-full font-semibold text-[9px] flex items-center gap-0.5"
              style={{ background: "#F0FBF6", color: "#0F9B5A", border: "1px solid #BBF7D0" }}>
              <span>{f.split(" ")[0]}</span>
              <span>{f.split(" ").slice(1).join(" ")}</span>
            </div>
          ))}
        </div>
        <p className="text-center text-muted-foreground mb-5 leading-tight text-[11px] mt-6">Tu centro inteligente de bienestar, rastreo y nutrición canina profesional</p>
        <GreenBtn label="Comenzar ahora" />
        <div className="mt-3"><OutlineBtn label="Ya tengo una cuenta" /></div>
        <p className="text-center text-muted-foreground mt-4 text-[9px]">
          Al continuar aceptas nuestros{" "}
          <span className="font-semibold" style={{ color: "#2AB87C" }}>Términos</span> y{" "}
          <span className="font-semibold" style={{ color: "#2AB87C" }}>Política de privacidad</span>
        </p>
      </div>
    </div>
  )
}

function LoginScreen() {
  const [showPw, setShowPw] = useState(false)
  return (
    <div className="h-full flex flex-col overflow-hidden" style={SF}>
      <div className="shrink-0 relative" style={{ height: 280 }}>
        <img src={LOGIN_IMG} alt="Mascotas" className="w-full h-full object-cover" style={{ objectPosition: "center 40%" }} />
        <div className="absolute inset-0" style={{ background: "linear-gradient(180deg, rgba(0,20,12,0.78) 0%, rgba(0,40,22,0.65) 60%, rgba(255,255,255,0) 100%)" }} />
        <div className="absolute bottom-0 left-0 right-0 flex items-center justify-center gap-2 pb-6">
          <span style={{ fontSize: 18 }}>🐾</span>
          <span className="font-black text-white text-xl tracking-tight" style={{ textShadow: "0 1px 8px rgba(0,0,0,0.4)" }}>PET TRACKER</span>
          <div className="px-2.5 py-0.5 rounded-full" style={{ background: "#2AB87C" }}>
            <span className="text-white text-[10px] font-black tracking-[0.18em]">PRO</span>
          </div>
        </div>
        <div className="absolute bottom-0 left-0 right-0 h-8 pointer-events-none" style={{ background: "linear-gradient(transparent, white)" }} />
      </div>
      <div className="flex-1 overflow-y-auto px-6 py-5 bg-white" style={{ scrollbarWidth: "none" }}>
        <h2 className="text-xl font-black text-foreground text-center mb-6">Iniciar sesión</h2>
        <div className="space-y-4">
          <Field label="Usuario" placeholder="Tu nombre de usuario o correo" icon={UserCircle2} value="" onChange={() => {}} />
          <Field label="Contraseña" type={showPw ? "text" : "password"} placeholder="Tu contraseña" icon={Lock} value="" onChange={() => {}}
            right={<button onClick={() => setShowPw(s => !s)} className="text-muted-foreground p-1">{showPw ? <EyeOff size={15} /> : <Eye size={15} />}</button>} />
        </div>
        <div className="flex justify-end mt-3 mb-6">
          <button className="text-xs font-semibold" style={{ color: "#2AB87C" }}>¿Olvidaste tu contraseña?</button>
        </div>
        <GreenBtn label="Iniciar sesión" />
        <div className="flex items-center gap-3 my-5">
          <div className="flex-1 h-px bg-border" /><span className="text-xs text-muted-foreground font-medium">o</span><div className="flex-1 h-px bg-border" />
        </div>
        <OutlineBtn label="Crear cuenta nueva" />
        <p className="text-center text-xs text-muted-foreground mt-6">
          ¿Problemas para ingresar?{" "}
          <span className="font-semibold" style={{ color: "#2AB87C" }}>Contactar soporte</span>
        </p>
      </div>
    </div>
  )
}

function ForgotScreen() {
  return (
    <div className="h-full flex flex-col bg-white" style={SF}>
      <div className="shrink-0 flex items-center gap-3 px-5 pt-4 pb-4 border-b border-border">
        <button className="w-9 h-9 rounded-full bg-muted flex items-center justify-center"><ChevronLeft size={18} /></button>
        <div className="flex items-center gap-2"><span className="text-lg">🐾</span><span className="font-black text-foreground text-sm">PET TRACKER PRO</span></div>
      </div>
      <div className="flex-1 flex flex-col items-center px-6 pt-8 pb-6">
        <div className="w-16 h-16 rounded-2xl flex items-center justify-center mb-5" style={{ background: "#E3F9EE" }}>
          <Lock size={28} style={{ color: "#2AB87C" }} />
        </div>
        <h2 className="text-2xl font-black text-foreground leading-tight text-center">Recuperar contraseña</h2>
        <p className="text-sm text-muted-foreground mt-2 mb-8 leading-relaxed text-center">
          Ingresa el correo electrónico asociado a tu cuenta y te enviaremos las instrucciones.
        </p>
        <Field label="Correo electrónico" type="email" placeholder="correo@ejemplo.com" icon={Mail} value="" onChange={() => {}} />
        <div className="mt-6 w-full">
          <button className="w-full py-1.5 rounded-2xl text-white font-bold flex items-center justify-center gap-2 transition-opacity text-[10px]"
            style={{ background: "linear-gradient(135deg,#1DA868,#2AB87C)" }}>
            Enviar instrucciones
            <ArrowRight size={14} />
          </button>
        </div>
        <button className="mt-4 text-center text-sm font-semibold text-muted-foreground">← Volver al inicio de sesión</button>
      </div>
    </div>
  )
}

function RegisterScreen() {
  const [step] = useState(1)
  const PAISES = [
    { value: "PE", label: "🇵🇪 Perú" }, { value: "MX", label: "🇲🇽 México" },
    { value: "CO", label: "🇨🇴 Colombia" },
  ]
  return (
    <div className="h-full flex flex-col bg-white" style={SF}>
      <div className="shrink-0 border-b border-border bg-white">
        <div className="flex items-center gap-3 px-5 pt-4 pb-3">
          <button className="w-9 h-9 rounded-full bg-muted flex items-center justify-center"><ChevronLeft size={18} /></button>
          <div className="flex items-center gap-2"><span className="text-lg">🐾</span><span className="font-black text-sm">PET TRACKER PRO</span></div>
        </div>
        <div className="px-5 pb-4">
          <h2 className="text-2xl font-black leading-tight text-center w-full">Crear cuenta</h2>
          <p className="text-sm text-muted-foreground mt-0.5">Regístrate gratis en 2 pasos</p>
          <div className="flex items-center gap-3 mt-4">
            {[1, 2].map(s => (
              <div key={s} className="flex items-center gap-2">
                <div className="flex items-center justify-center w-7 h-7 rounded-full text-xs font-black"
                  style={s < step ? { background: "#2AB87C", color: "white" } : s === step ? { background: "#0D1117", color: "white" } : { background: "#F5F6F8", color: "#9CA3AF" }}>
                  {s < step ? "✓" : s}
                </div>
                <span className="text-xs font-semibold" style={{ color: s <= step ? "#0D1117" : "#9CA3AF" }}>
                  {s === 1 ? "Datos personales" : "Cuenta y acceso"}
                </span>
                {s < 2 && <div className="w-8 h-px" style={{ background: s < step ? "#2AB87C" : "#E5E7EB" }} />}
              </div>
            ))}
          </div>
        </div>
      </div>
      <div className="flex-1 overflow-y-auto px-5 py-5 space-y-4" style={{ scrollbarWidth: "none" }}>
        <Field label="Nombres" placeholder="Ej. María" icon={UserCircle2} value="" onChange={() => {}} />
        <Field label="Apellidos" placeholder="Ej. González Torres" icon={UserCircle2} value="" onChange={() => {}} />
        <Field label="Correo electrónico" type="email" placeholder="correo@ejemplo.com" icon={Mail} value="" onChange={() => {}} />
        <div>
          <p className="text-xs font-semibold text-foreground mb-1.5">País</p>
          <div className="relative">
            <div className="absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none"><Globe size={16} className="text-muted-foreground" /></div>
            <select className="w-full rounded-xl pl-10 pr-4 py-3.5 text-sm text-foreground outline-none appearance-none" style={{ background: "#F5F6F8" }}>
              {PAISES.map(p => <option key={p.value} value={p.value}>{p.label}</option>)}
            </select>
          </div>
        </div>
        <div className="relative rounded-2xl overflow-hidden" style={{ height: 100 }}>
          <img src={grupoMascotasImg} alt="Mascotas" className="w-full h-full object-cover" style={{ objectPosition: "center 40%" }} />
        </div>
      </div>
      <div className="shrink-0 px-5 pb-6 pt-3 bg-white border-t border-border">
        <GreenBtn label="Continuar" />
      </div>
    </div>
  )
}

function HomeScreen({ pet, petIdx, setPetIdx }: { pet: any; petIdx: number; setPetIdx: (i: number) => void }) {
  return (
    <div style={SF}>
      <div className="relative" style={{ height: 340, background: "#3D5C2E" }}>
        <img src={pet.hero} alt={pet.name} className="w-full h-full object-cover object-top" />
        <div className="absolute inset-0 pointer-events-none" style={{ background: "linear-gradient(180deg,rgba(0,0,0,0.28) 0%,transparent 38%,rgba(255,255,255,0) 60%,#fff 100%)" }} />
        <div className="absolute top-0 left-0 right-0 flex items-center justify-between px-5 pt-10">
          <div className="flex gap-2 items-center">
            {PETS.map((p, i) => (
              <button key={p.id} onClick={() => setPetIdx(i)} className="relative">
                <img src={p.id === 1 ? lunaImg : p.thumb} alt={p.name} className="rounded-full object-cover"
                  style={{ width: i === petIdx ? 44 : 34, height: i === petIdx ? 44 : 34, border: i === petIdx ? "3px solid #2AB87C" : "2px solid rgba(255,255,255,0.6)" }} />
                {i === petIdx && <div className="absolute -bottom-0.5 -right-0.5 w-3 h-3 rounded-full border-2 border-white" style={{ background: "#2AB87C" }} />}
              </button>
            ))}
            <button className="w-8 h-8 rounded-full border-2 border-white/60 bg-white/20 backdrop-blur-sm flex items-center justify-center" style={{ alignSelf: "flex-end" }}>
              <Plus size={14} className="text-white" />
            </button>
          </div>
          <button className="relative w-10 h-10 rounded-full bg-white/90 backdrop-blur-sm flex items-center justify-center shadow">
            <Bell size={17} style={{ color: "#0D1117" }} />
            <span className="absolute top-1 right-1.5 w-2 h-2 rounded-full" style={{ background: "#EF4444" }} />
          </button>
        </div>
        <div className="absolute bottom-0 left-0 right-0 px-5 pb-4 flex items-end justify-between">
          <div>
            <div className="mb-1.5"><Pill green><span className="w-1.5 h-1.5 rounded-full bg-[#2AB87C] animate-pulse inline-block" />En línea</Pill></div>
            <h1 className="text-3xl font-black text-foreground leading-none">{pet.name}</h1>
            <p className="text-sm text-muted-foreground mt-0.5">{pet.id === 1 ? "Pastor Alemán" : pet.breed}</p>
          </div>
          <div className="text-right">
            <p className="text-3xl font-black text-foreground leading-none">{pet.steps.toLocaleString()}</p>
            <p className="text-xs text-muted-foreground font-medium">pasos hoy</p>
          </div>
        </div>
      </div>
      <div className="mx-4 -mt-1 mb-5">
        <div className="bg-white rounded-2xl border border-border shadow-sm flex overflow-hidden">
          {[
            { icon: "⚖️", label: "Peso", value: `${pet.weight} kg` },
            { icon: "⚡", label: "Activo", value: `${pet.activity.activeMin} min` },
            { icon: "🦮", label: "Paseos", value: `${pet.activity.walks}` },
            { icon: "📍", label: "Distancia", value: `${pet.activity.distance} km` },
          ].map(({ icon, label, value }, i, arr) => (
            <div key={label} className={`flex-1 flex flex-col items-center py-3 ${i < arr.length - 1 ? "border-r border-border" : ""}`}>
              <span className="text-lg leading-none">{icon}</span>
              <span className="text-sm font-bold text-foreground mt-1">{value}</span>
              <span className="text-[10px] text-muted-foreground mt-0.5">{label}</span>
            </div>
          ))}
        </div>
      </div>
      <div className="mx-4 mb-5 flex items-center gap-3 py-3 px-4 bg-muted rounded-2xl">
        <div className="w-8 h-8 rounded-full flex items-center justify-center" style={{ background: "#E3F9EE" }}>
          <MapPin size={15} style={{ color: "#2AB87C" }} />
        </div>
        <div className="flex-1 min-w-0">
          <p className="text-xs font-semibold text-foreground truncate">{pet.address}</p>
          <p className="text-[10px] text-muted-foreground">{pet.lastSeen}</p>
        </div>
        <Battery size={15} style={{ color: pet.battery > 60 ? "#2AB87C" : "#F59E0B" }} />
        <span className="text-xs font-semibold" style={{ color: pet.battery > 60 ? "#2AB87C" : "#F59E0B" }}>{pet.battery}%</span>
      </div>
      <div className="px-4 mb-5">
        <p className="text-xs font-semibold text-muted-foreground uppercase tracking-widest mb-3">Accesos rápidos</p>
        <div className="grid grid-cols-4 gap-2.5">
          {[
            { emoji: "🗺️", label: "Mapa", bg: "#EEF4FF" },
            { emoji: "🏃", label: "Actividad", bg: "#FFF7ED" },
            { emoji: "💉", label: "Vacunas", bg: "#FFF0F3" },
            { emoji: "🍽️", label: "Comidas", bg: "#F0FBF6" },
          ].map(({ emoji, label, bg }) => (
            <button key={label} className="flex flex-col items-center gap-1.5 py-3 rounded-2xl" style={{ background: bg }}>
              <span className="text-2xl">{emoji}</span>
              <span className="text-[10px] font-semibold text-foreground">{label}</span>
            </button>
          ))}
        </div>
      </div>
      <div className="px-4 mb-5">
        <div className="flex items-center justify-between mb-3">
          <p className="text-sm font-bold text-foreground">Actividad semanal</p>
          <span className="text-xs text-muted-foreground">últimos 7 días</span>
        </div>
        <div className="h-20">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={pet.weekData} barSize={22}>
              <Bar dataKey="v" fill="#2AB87C" radius={[5, 5, 0, 0]} />
              <XAxis dataKey="d" tick={{ fontSize: 10, fill: "#9CA3AF", fontFamily: "Inter", fontWeight: 600 }} axisLine={false} tickLine={false} />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>
      <div className="px-4 mb-6">
        <div className="flex items-center justify-between mb-3">
          <p className="text-sm font-bold text-foreground">Recordatorios</p>
          <button className="text-xs font-semibold" style={{ color: "#2AB87C" }}>Ver todos</button>
        </div>
        <div className="space-y-2">
          {pet.nextVaccine && (
            <div className="flex items-center gap-3 p-3.5 bg-white border border-border rounded-2xl shadow-sm">
              <div className="text-xl">💉</div>
              <div className="flex-1 min-w-0"><p className="text-sm font-semibold text-foreground">{pet.nextVaccine.name}</p><p className="text-xs text-muted-foreground">{pet.nextVaccine.date}</p></div>
              <span className="text-xs font-bold px-2.5 py-1 rounded-full" style={{ background: "#FFF7ED", color: "#C2410C" }}>{pet.nextVaccine.daysLeft}d</span>
            </div>
          )}
          <div className="flex items-center gap-3 p-3.5 bg-white border border-border rounded-2xl shadow-sm">
            <div className="text-xl">🍽️</div>
            <div className="flex-1 min-w-0">
              <div className="flex justify-between mb-1.5"><p className="text-sm font-semibold text-foreground">Alimentación</p><span className="text-xs text-muted-foreground">{pet.meals}/{pet.totalMeals}</span></div>
              <div className="h-1.5 bg-muted rounded-full overflow-hidden">
                <div className="h-full rounded-full" style={{ width: `${(pet.meals / pet.totalMeals) * 100}%`, background: "#2AB87C" }} />
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

function MapScreen({ pet }: { pet: any }) {
  return (
    <div style={SF} className="flex flex-col">
      <div className="relative" style={{ height: 340 }}>
        <svg viewBox="0 0 390 340" className="w-full h-full" preserveAspectRatio="xMidYMid slice">
          <rect width="390" height="340" fill="#EDF0E8" />
          <rect x="0" y="90" width="390" height="20" fill="#FFFFFF" opacity="0.95" />
          <rect x="0" y="168" width="390" height="22" fill="#FFFFFF" opacity="0.95" />
          <rect x="0" y="262" width="390" height="16" fill="#FFFFFF" opacity="0.95" />
          <rect x="88" y="0" width="20" height="340" fill="#FFFFFF" opacity="0.95" />
          <rect x="202" y="0" width="22" height="340" fill="#FFFFFF" opacity="0.95" />
          <rect x="318" y="0" width="16" height="340" fill="#FFFFFF" opacity="0.95" />
          <rect x="0" y="0" width="88" height="90" fill="#D4D9CA" rx="2" />
          <rect x="108" y="0" width="94" height="90" fill="#D4D9CA" rx="2" />
          <rect x="108" y="110" width="94" height="58" fill="#85C47A" rx="6" />
          <text x="155" y="135" textAnchor="middle" fontSize="9" fill="#245C20" fontWeight="700" fontFamily="Inter">Parque Central</text>
          <circle cx="265" cy="190" r="68" fill="rgba(42,184,124,0.08)" stroke="#2AB87C" strokeWidth="2" strokeDasharray="10 5" />
          <circle cx="265" cy="190" r="11" fill="white" stroke="#2AB87C" strokeWidth="2" />
          <text x="265" y="194" textAnchor="middle" fontSize="11">🏠</text>
          <circle cx="265" cy="140" r="22" fill="rgba(42,184,124,0.15)" />
          <circle cx="265" cy="140" r="14" fill="#2AB87C" />
          <circle cx="265" cy="140" r="8" fill="white" />
          <circle cx="265" cy="140" r="4" fill="#2AB87C" />
          <rect x="194" y="84" width="86" height="19" rx="9.5" fill="#2AB87C" />
          <text x="237" y="97" textAnchor="middle" fontSize="9" fill="white" fontWeight="700" fontFamily="Inter">✓ Zona Segura</text>
        </svg>
        <div className="absolute top-10 left-4">
          <div className="flex items-center gap-2 px-3 py-2 rounded-full shadow-md" style={{ background: "rgba(255,255,255,0.95)" }}>
            <img src={image_pastor_3} alt={pet.name} className="w-6 h-6 rounded-full object-cover" />
            <span className="text-xs font-bold text-foreground">{pet.name}</span>
            <span className="w-2 h-2 rounded-full animate-pulse" style={{ background: "#2AB87C" }} />
            <span className="text-[10px] font-semibold" style={{ color: "#2AB87C" }}>GPS activo</span>
          </div>
        </div>
        <div className="absolute bottom-0 left-0 right-0 h-12 pointer-events-none" style={{ background: "linear-gradient(transparent,white)" }} />
      </div>
      <div className="px-4 pt-3 pb-4 space-y-3">
        <div>
          <p className="text-[11px] text-muted-foreground font-medium uppercase tracking-widest mb-1">Ubicación actual</p>
          <div className="flex items-center gap-2"><MapPin size={16} style={{ color: "#2AB87C" }} /><p className="text-sm font-semibold text-foreground">{pet.address}</p></div>
          <p className="text-xs text-muted-foreground ml-6">{pet.lastSeen}</p>
        </div>
        <div className="grid grid-cols-3 gap-2">
          {[
            { label: "Batería", value: `${pet.battery}%`, color: pet.battery > 60 ? "#2AB87C" : "#F59E0B" },
            { label: "Recorrido", value: `${pet.activity.distance} km`, color: "#2AB87C" },
            { label: "Tiempo activo", value: `${pet.activity.activeMin} min`, color: "#6B7280" },
          ].map(({ label, value, color }) => (
            <div key={label} className="bg-muted rounded-xl p-3 text-center">
              <p className="text-base font-black leading-none" style={{ color }}>{value}</p>
              <p className="text-[10px] text-muted-foreground mt-1">{label}</p>
            </div>
          ))}
        </div>
        <div className="flex gap-2">
          <button className="flex-1 flex items-center justify-center gap-2 py-3 rounded-xl text-sm font-semibold border border-border bg-white"><Share2 size={14} />Compartir</button>
          <button className="flex-1 flex items-center justify-center gap-2 py-3 rounded-xl text-sm font-semibold border border-border bg-white"><TrendingUp size={14} />Recorrido</button>
        </div>
        <button className="w-full py-3.5 rounded-xl text-sm font-bold flex items-center justify-center gap-2" style={{ background: "#FEF2F2", color: "#EF4444", border: "1.5px solid #FECACA" }}>
          🔴 Activar Modo Mascota Perdida
        </button>
      </div>
    </div>
  )
}

function HealthScreen({ pet }: { pet: any }) {
  return (
    <div style={SF}>
      <div className="relative" style={{ height: 280, background: "#3D5C2E" }}>
        <img src={pet.hero} alt={pet.name} className="w-full h-full object-cover object-top" />
        <div className="absolute inset-0 pointer-events-none" style={{ background: "linear-gradient(180deg,rgba(0,0,0,0.1) 0%,transparent 40%,white 100%)" }} />
        <div className="absolute bottom-0 left-5 pb-4">
          <p className="text-[10px] font-semibold uppercase tracking-widest text-muted-foreground">Salud de</p>
          <h2 className="text-2xl font-black text-foreground leading-none">{pet.name}</h2>
        </div>
      </div>
      <div className="px-4 space-y-4 pb-6">
        <p className="text-xs font-semibold text-muted-foreground uppercase tracking-widest">Próximos eventos</p>
        <div className="flex items-center gap-3 p-4 bg-white border border-border rounded-2xl shadow-sm">
          <div className="w-11 h-11 rounded-xl flex items-center justify-center text-xl shrink-0" style={{ background: "#FEF3C7" }}>💉</div>
          <div className="flex-1"><p className="text-sm font-bold text-foreground">{pet.nextVaccine.name}</p><p className="text-xs text-muted-foreground">{pet.nextVaccine.date}</p></div>
          <div className="text-right"><p className="text-lg font-black" style={{ color: "#D97706" }}>{pet.nextVaccine.daysLeft}</p><p className="text-[10px] text-muted-foreground">días</p></div>
        </div>
        <div className="bg-white border border-border rounded-2xl p-4 shadow-sm">
          <div className="flex items-center justify-between mb-3">
            <p className="text-sm font-bold text-foreground">Evolución de peso</p>
            <span className="text-sm font-black" style={{ color: "#2AB87C" }}>{pet.weight} kg</span>
          </div>
          <div className="h-28">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={pet.weightData} margin={{ top: 5, right: 5, bottom: 0, left: 0 }}>
                <defs>
                  <linearGradient id={`wg-${pet.id}`} x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#2AB87C" stopOpacity={0.2} />
                    <stop offset="95%" stopColor="#2AB87C" stopOpacity={0} />
                  </linearGradient>
                </defs>
                <Area type="monotone" dataKey="w" stroke="#2AB87C" strokeWidth={2.5} fill={`url(#wg-${pet.id})`} dot={{ fill: "#2AB87C", r: 3 }} />
                <XAxis dataKey="m" tick={{ fontSize: 10, fill: "#9CA3AF", fontFamily: "Inter", fontWeight: 600 }} axisLine={false} tickLine={false} />
                <YAxis domain={["dataMin - 0.5", "dataMax + 0.5"]} hide />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>
        <div className="bg-white border border-border rounded-2xl p-4 shadow-sm">
          <div className="flex items-center justify-between mb-4">
            <p className="text-sm font-bold text-foreground">Expediente médico</p>
            <button className="text-xs font-semibold" style={{ color: "#2AB87C" }}>Ver todo</button>
          </div>
          {[
            { date: "12 Jul 2025", type: "Consulta", note: "Control de rutina · Dr. García", color: "#2AB87C" },
            { date: "3 Jun 2025", type: "Vacunación", note: "Polivalente · Clínica Mascotas", color: "#60A5FA" },
            { date: "15 May 2025", type: "Desparasitación", note: "Interna y externa · Dr. García", color: "#F59E0B" },
          ].map((ev, i, arr) => (
            <div key={i} className="flex gap-3">
              <div className="flex flex-col items-center">
                <div className="w-2.5 h-2.5 rounded-full mt-1 shrink-0" style={{ background: ev.color }} />
                {i < arr.length - 1 && <div className="w-px flex-1 mt-1 mb-1" style={{ background: "rgba(0,0,0,0.07)", minHeight: 28 }} />}
              </div>
              <div className="pb-4">
                <p className="text-[10px] text-muted-foreground font-medium">{ev.date}</p>
                <p className="text-sm font-bold text-foreground">{ev.type}</p>
                <p className="text-xs text-muted-foreground">{ev.note}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}

function FoodScreen({ pet }: { pet: any }) {
  const pct = Math.round((pet.caloriesConsumed / pet.calories) * 100)
  const meals = [
    { time: "7:00 am", name: "Desayuno", portion: pet.species === "dog" ? "200 g" : "60 g", done: true },
    { time: "12:00 pm", name: "Almuerzo", portion: pet.species === "dog" ? "200 g" : "60 g", done: pet.meals >= 2 },
    { time: "6:00 pm", name: "Cena", portion: pet.species === "dog" ? "180 g" : "55 g", done: pet.meals >= 3 },
    ...(pet.totalMeals >= 4 ? [{ time: "9:00 pm", name: "Snack", portion: "25 g", done: pet.meals >= 4 }] : []),
  ]
  return (
    <div style={SF}>
      <div className="relative" style={{ height: 280, background: "#3D5C2E" }}>
        <img src={pet.hero} alt={pet.name} className="w-full h-full object-cover object-top" />
        <div className="absolute inset-0 pointer-events-none" style={{ background: "linear-gradient(180deg,rgba(0,0,0,0.1) 0%,transparent 40%,white 100%)" }} />
        <div className="absolute bottom-0 left-5 pb-4">
          <p className="text-[10px] font-semibold uppercase tracking-widest text-muted-foreground">Nutrición de</p>
          <h2 className="text-2xl font-black text-foreground leading-none">{pet.name}</h2>
        </div>
      </div>
      <div className="px-4 space-y-4 pb-6">
        <div className="rounded-2xl p-5 text-white flex items-center justify-between" style={{ background: "linear-gradient(135deg,#1DA868,#2AB87C)" }}>
          <div>
            <p className="text-white/70 text-xs font-medium mb-1">Objetivo diario</p>
            <p className="text-4xl font-black leading-none">{pet.calories}</p>
            <p className="text-white/70 text-sm mt-0.5">kcal / día</p>
            <div className="mt-3">
              <div className="flex justify-between text-xs text-white/70 mb-1.5"><span>{pet.caloriesConsumed} kcal</span><span>{pct}%</span></div>
              <div className="h-2 rounded-full overflow-hidden" style={{ background: "rgba(255,255,255,0.2)" }}>
                <div className="h-full rounded-full bg-white" style={{ width: `${pct}%` }} />
              </div>
            </div>
          </div>
          <svg width="76" height="76" viewBox="0 0 76 76">
            <circle cx="38" cy="38" r="29" fill="none" stroke="rgba(255,255,255,0.2)" strokeWidth="8" />
            <circle cx="38" cy="38" r="29" fill="none" stroke="white" strokeWidth="8" strokeLinecap="round"
              strokeDasharray={`${2 * Math.PI * 29 * pct / 100} 999`} transform="rotate(-90 38 38)" />
            <text x="38" y="43" textAnchor="middle" fontSize="14" fill="white" fontWeight="800" fontFamily="Inter">{pct}%</text>
          </svg>
        </div>
        <div className="bg-white border border-border rounded-2xl p-4 shadow-sm">
          <div className="flex items-center justify-between mb-3">
            <p className="text-sm font-bold text-foreground">Comidas hoy</p>
            <span className="text-xs text-muted-foreground">{pet.meals}/{pet.totalMeals} completadas</span>
          </div>
          <div className="space-y-2">
            {meals.map((meal, i) => (
              <div key={i} className="flex items-center gap-3 p-3 rounded-xl" style={{ background: meal.done ? "#F0FBF6" : "#F9FAFB" }}>
                <div className="w-8 h-8 rounded-full flex items-center justify-center shrink-0" style={{ background: meal.done ? "#2AB87C" : "#E5E7EB" }}>
                  {meal.done ? <CheckCircle2 size={15} className="text-white" /> : <Clock size={13} className="text-muted-foreground" />}
                </div>
                <div className="flex-1">
                  <p className="text-sm font-semibold text-foreground">{meal.name === "Almuerzo" ? "Comida" : meal.name}</p>
                  <p className="text-xs text-muted-foreground">{meal.time} · {meal.portion}</p>
                </div>
                {meal.done && <span className="text-[10px] font-bold px-2 py-0.5 rounded-full" style={{ background: "white", color: "#2AB87C", border: "1px solid #BBF7D0" }}>✓ Servido</span>}
              </div>
            ))}
          </div>
        </div>
        <div className="rounded-2xl p-4 border" style={{ background: "#F8FFF8", borderColor: "#BBF7D0" }}>
          <div className="flex items-center gap-2 mb-2"><span>✨</span><p className="text-sm font-bold text-foreground">Recomendación IA</p></div>
          <p className="text-sm text-muted-foreground leading-relaxed">
            {pet.species === "dog"
              ? `${pet.name} necesita ${pet.calories} kcal/día. Distribuir en ${pet.totalMeals} comidas previene la distensión gástrica.`
              : `${pet.name} necesita ${pet.calories} kcal/día. Horarios regulares reducen la ansiedad en gatos Siameses.`}
          </p>
        </div>
      </div>
    </div>
  )
}

function ProfileScreen({ pet, petIdx, setPetIdx }: { pet: any; petIdx: number; setPetIdx: (i: number) => void }) {
  return (
    <div style={SF}>
      <div className="relative" style={{ height: 340, background: "#3D5C2E" }}>
        <img src={pet.hero} alt={pet.name} className="w-full h-full object-cover object-top" />
        <div className="absolute inset-0 pointer-events-none" style={{ background: "linear-gradient(180deg,rgba(0,0,0,0.15) 0%,transparent 35%,rgba(0,0,0,0) 60%,white 100%)" }} />
        <div className="absolute top-10 left-4 flex gap-2">
          {PETS.map((p, i) => (
            <button key={p.id} onClick={() => setPetIdx(i)}>
              <img src={p.id === 1 ? lunaImg : p.thumb} alt={p.name} className="rounded-full object-cover"
                style={{ width: i === petIdx ? 42 : 32, height: i === petIdx ? 42 : 32, border: i === petIdx ? "3px solid #2AB87C" : "2px solid rgba(255,255,255,0.7)" }} />
            </button>
          ))}
        </div>
        <div className="absolute bottom-0 left-5 pb-5">
          <div className="flex items-center gap-2 mb-1"><Pill green><span className="w-1.5 h-1.5 rounded-full bg-[#2AB87C] animate-pulse inline-block" />Collar activo</Pill></div>
          <h1 className="text-3xl font-black text-foreground">{pet.name}</h1>
          <p className="text-sm text-muted-foreground">{pet.breed}</p>
        </div>
        {/* Botón editar foto */}
        <button className="absolute bottom-5 right-4 flex items-center gap-1.5 px-3 py-1.5 rounded-full shadow-lg"
          style={{ background: "rgba(255,255,255,0.92)", backdropFilter: "blur(8px)", border: "1px solid rgba(255,255,255,0.6)" }}>
          <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="#2AB87C" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
            <path d="M23 19a2 2 0 0 1-2 2H3a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h4l2-3h6l2 3h4a2 2 0 0 1 2 2z"/>
            <circle cx="12" cy="13" r="4"/>
          </svg>
          <span className="text-[10px] font-bold" style={{ color: "#2AB87C" }}>Cambiar foto</span>
        </button>
      </div>
      <div className="px-4 space-y-4 pb-6">
        {/* Campo de carga de foto */}
        <div className="bg-white border border-border rounded-2xl p-4 shadow-sm">
          <p className="text-xs font-semibold uppercase tracking-widest text-muted-foreground mb-3">Foto de la mascota</p>
          <div className="flex items-center gap-3">
            <img src={pet.id === 1 ? lunaImg : pet.thumb} alt={pet.name}
              className="w-16 h-16 rounded-2xl object-cover shrink-0" style={{ border: "2px solid #BBF7D0" }} />
            <div className="flex-1 space-y-2">
              <button className="w-full py-2 rounded-xl text-[11px] font-bold flex items-center justify-center gap-1.5"
                style={{ background: "#F0FBF6", color: "#2AB87C", border: "1.5px dashed #2AB87C" }}>
                <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/><polyline points="17 8 12 3 7 8"/><line x1="12" y1="3" x2="12" y2="15"/>
                </svg>
                Subir nueva foto
              </button>
              <button className="w-full py-2 rounded-xl text-[11px] font-semibold flex items-center justify-center gap-1.5"
                style={{ background: "#F9FAFB", color: "#6B7280", border: "1px solid #E5E7EB" }}>
                <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M23 19a2 2 0 0 1-2 2H3a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h4l2-3h6l2 3h4a2 2 0 0 1 2 2z"/>
                  <circle cx="12" cy="13" r="4"/>
                </svg>
                Tomar foto
              </button>
            </div>
          </div>
          <p className="text-[9px] text-muted-foreground mt-2.5 text-center">JPG, PNG o HEIC · Máx. 10 MB</p>
        </div>
        <div className="flex flex-wrap gap-2">
          <Pill>{pet.sex}</Pill>
          {pet.sterilized && <Pill>Esterilizado ✓</Pill>}
          <Pill>{pet.age}</Pill>
          <Pill>{pet.weight} kg</Pill>
        </div>
        <div className="bg-white border border-border rounded-2xl p-4 shadow-sm">
          <p className="text-xs font-semibold uppercase tracking-widest text-muted-foreground mb-3">Información</p>
          {[
            { label: "Raza", value: pet.breed },
            { label: "Microchip", value: pet.microchip || "No registrado" },
            { label: "Collar GPS", value: "DOG 6 XL · Activo" },
            { label: "Última señal", value: pet.lastSeen },
          ].map(({ label, value }) => (
            <div key={label} className="flex justify-between items-center py-2.5 border-b border-border last:border-0">
              <span className="text-sm text-muted-foreground">{label === "Collar GPS" ? "Dispositivo GPS" : label}</span>
              <span className="text-sm font-semibold text-foreground text-right max-w-[55%] truncate">{label === "Raza" && pet.id === 1 ? "Pastor Alemán" : value}</span>
            </div>
          ))}
        </div>
        <div className="space-y-2">
          {[
            { emoji: "📁", label: "Documentos médicos", sub: "3 archivos", bg: "#F0F7FF" },
            { emoji: "🔔", label: "Recordatorios", sub: "5 activos esta semana", bg: "#FFFBEB" },
            { emoji: "📍", label: "Geocercas configuradas", sub: "Casa · Parque · Veterinaria", bg: "#F5F3FF" },
            { emoji: "⚙️", label: "Configuración del collar", sub: "DOG 6 XL · Firmware v2.1", bg: "#F9FAFB" },
          ].map(({ emoji, label, sub, bg }) => (
            <button key={label} className="w-full rounded-2xl p-3.5 flex items-center gap-3 border border-border text-left" style={{ background: bg }}>
              <span className="text-xl shrink-0">{emoji}</span>
              <div className="flex-1 min-w-0"><p className="text-sm font-semibold text-foreground">{label === "Configuración del collar" ? "Configuración del Dispositivo GPS" : label}</p><p className="text-xs text-muted-foreground truncate">{sub}</p></div>
              <ChevronRight size={15} className="text-muted-foreground shrink-0" />
            </button>
          ))}
        </div>
      </div>
    </div>
  )
}

/* ─────────────────── BOTTOM NAV ─────────────────────────── */
function BottomNav({ active }: { active: string }) {
  const items = [
    { id: "home", icon: Home, label: "Inicio" },
    { id: "map", icon: MapPin, label: "Mapa" },
    { id: "health", icon: Heart, label: "Salud" },
    { id: "food", icon: Utensils, label: "Nutrición" },
    { id: "profile", icon: User, label: "Perfil" },
  ]
  return (
    <nav className="flex shrink-0 border-t border-border bg-white pb-2">
      {items.map(({ id, icon: Icon, label }) => {
        const isActive = id === active
        return (
          <div key={id} className="flex-1 flex flex-col items-center pt-2 pb-1 gap-0.5"
            style={{ color: isActive ? "#2AB87C" : "#9CA3AF" }}>
            <Icon size={21} strokeWidth={isActive ? 2.5 : 1.7} />
            <span className="text-[10px] font-semibold">{label}</span>
            {isActive && <div className="w-4 h-0.5 rounded-full" style={{ background: "#2AB87C" }} />}
          </div>
        )
      })}
    </nav>
  )
}

/* ──────────────────── PHONE FRAME ──────────────────────── */
function PhoneFrame({
  label,
  children,
  lightStatus = false,
  showNav = false,
  activeTab = "home",
  selected,
  onClick,
  noPad = false,
}: {
  label: string;
  children: React.ReactNode;
  lightStatus?: boolean;
  showNav?: boolean;
  activeTab?: string;
  selected?: boolean;
  onClick?: () => void;
  noPad?: boolean;
}) {
  return (
    <div className="flex flex-col items-center gap-3 cursor-pointer group" onClick={onClick}>
      {/* Frame label */}
      <p className="text-xs font-semibold tracking-wide" style={{ color: selected ? "#2AB87C" : "#9CA3AF", fontFamily: "'Inter', sans-serif" }}>
        {label}
      </p>
      {/* Phone shell */}
      <div
        className="relative flex flex-col overflow-hidden transition-all duration-200"
        style={{
          width: 260,
          height: 530,
          borderRadius: 36,
          background: "#fff",
          border: selected ? "2.5px solid #2AB87C" : "2px solid rgba(0,0,0,0.10)",
          boxShadow: selected
            ? "0 0 0 4px rgba(42,184,124,0.15), 0 24px 60px rgba(0,0,0,0.18)"
            : "0 8px 32px rgba(0,0,0,0.10)",
          transform: selected ? "translateY(-4px)" : "none",
        }}
      >
        {/* Notch */}
        <div className="absolute top-0 left-1/2 -translate-x-1/2 z-40 flex justify-center">
          <div className="w-20 h-5 rounded-b-2xl" style={{ background: "#000" }} />
        </div>
        {/* Status bar */}
        <StatusBar light={lightStatus} />
        {/* Screen content — scrollable */}
        <div className={`flex-1 overflow-y-auto min-h-0 ${noPad ? "" : "pt-5"}`} style={{ scrollbarWidth: "none" }}>
          {children}
        </div>
        {showNav && <BottomNav active={activeTab} />}
      </div>
    </div>
  )
}

/* ══════════════════════════════════════════════════════════
   DOCUMENTOS MÉDICOS
══════════════════════════════════════════════════════════ */
function DocsScreen({ pet }: { pet: any }) {
  const docs = [
    { id: 1, type: "Vacunación", name: "Antirrábica", date: "12 Jul 2025", vet: "Dr. García", color: "#60A5FA", bg: "#EFF6FF", emoji: "💉" },
    { id: 2, type: "Vacunación", name: "Polivalente", date: "3 Jun 2025", vet: "Clínica Mascotas", color: "#60A5FA", bg: "#EFF6FF", emoji: "💉" },
    { id: 3, type: "Consulta", name: "Control de rutina", date: "12 Jul 2025", vet: "Dr. García", color: "#2AB87C", bg: "#F0FBF6", emoji: "🩺" },
    { id: 4, type: "Desparasitación", name: "Interna y externa", date: "15 May 2025", vet: "Dr. García", color: "#F59E0B", bg: "#FFFBEB", emoji: "💊" },
    { id: 5, type: "Análisis", name: "Sangre completa", date: "2 Abr 2025", vet: "Lab. VetSalud", color: "#A78BFA", bg: "#F5F3FF", emoji: "🔬" },
  ]
  const filters = ["Todos", "Vacunas", "Consultas", "Análisis"]
  return (
    <div style={{ fontFamily: "'Inter', sans-serif" }}>
      {/* Hero */}
      <div className="relative" style={{ height: 160, background: "#1a2e1a" }}>
        <img src={pet.hero} alt={pet.name} className="w-full h-full object-cover object-top" style={{ opacity: 0.6 }} />
        <div className="absolute inset-0" style={{ background: "linear-gradient(180deg,rgba(0,0,0,0.2) 0%,rgba(0,0,0,0.5) 100%)" }} />
        <div className="absolute bottom-0 left-5 pb-4 flex items-end justify-between right-5">
          <div>
            <p className="text-[10px] font-semibold uppercase tracking-widest text-white/60">Documentos de</p>
            <h2 className="text-xl font-black text-white leading-tight">{pet.name}</h2>
          </div>
          <button className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-white text-[11px] font-bold mb-1"
            style={{ background: "#2AB87C" }}>
            <Plus size={13} /> Nuevo
          </button>
        </div>
      </div>
      {/* Filters */}
      <div className="flex gap-2 px-4 pt-4 pb-2 overflow-x-auto" style={{ scrollbarWidth: "none" }}>
        {filters.map((f, i) => (
          <button key={f} className="shrink-0 px-3 py-1 rounded-full text-[11px] font-semibold"
            style={i === 0 ? { background: "#2AB87C", color: "white" } : { background: "#F5F6F8", color: "#6B7280" }}>
            {f}
          </button>
        ))}
      </div>
      {/* Docs list */}
      <div className="px-4 pb-6 space-y-3 mt-1">
        {docs.map(doc => (
          <div key={doc.id} className="flex items-center gap-3 p-3.5 rounded-2xl border border-border bg-white shadow-sm">
            <div className="w-10 h-10 rounded-xl flex items-center justify-center text-lg shrink-0" style={{ background: doc.bg }}>
              {doc.emoji}
            </div>
            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-2 mb-0.5">
                <span className="text-[10px] font-bold px-2 py-0.5 rounded-full" style={{ background: doc.bg, color: doc.color }}>{doc.type}</span>
              </div>
              <p className="text-sm font-semibold text-foreground truncate">{doc.name}</p>
              <p className="text-[10px] text-muted-foreground">{doc.vet} · {doc.date}</p>
            </div>
            <div className="flex flex-col items-end gap-1.5 shrink-0">
              <button className="w-7 h-7 rounded-lg flex items-center justify-center" style={{ background: "#F0FBF6" }}>
                <Eye size={13} style={{ color: "#2AB87C" }} />
              </button>
              <button className="w-7 h-7 rounded-lg flex items-center justify-center" style={{ background: "#F5F6F8" }}>
                <Share2 size={12} style={{ color: "#9CA3AF" }} />
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}

/* ══════════════════════════════════════════════════════════
   RECORDATORIOS
══════════════════════════════════════════════════════════ */
function RemindersScreen({ pet }: { pet: any }) {
  const reminders = [
    { id: 1, category: "Vacuna", name: "Antirrábica", date: "15 Ago 2025", daysLeft: 26, active: true, color: "#60A5FA", bg: "#EFF6FF", emoji: "💉" },
    { id: 2, category: "Medicamento", name: "Antiparasitario", date: "28 Jul 2025", daysLeft: 8, active: true, color: "#F59E0B", bg: "#FFFBEB", emoji: "💊" },
    { id: 3, category: "Consulta", name: "Revisión anual", date: "5 Sep 2025", daysLeft: 47, active: true, color: "#2AB87C", bg: "#F0FBF6", emoji: "🩺" },
    { id: 4, category: "Baño", name: "Baño y grooming", date: "20 Jul 2025", daysLeft: 2, active: true, color: "#A78BFA", bg: "#F5F3FF", emoji: "🛁" },
    { id: 5, category: "Vacuna", name: "Triple Felina", date: "3 Oct 2025", daysLeft: 75, active: false, color: "#60A5FA", bg: "#EFF6FF", emoji: "💉" },
  ]
  return (
    <div style={{ fontFamily: "'Inter', sans-serif" }}>
      {/* Hero */}
      <div className="relative" style={{ height: 140, background: "#1a2e1a" }}>
        <img src={pet.hero} alt={pet.name} className="w-full h-full object-cover object-top" style={{ opacity: 0.55 }} />
        <div className="absolute inset-0" style={{ background: "linear-gradient(180deg,rgba(0,0,0,0.15) 0%,rgba(0,0,0,0.55) 100%)" }} />
        <div className="absolute bottom-0 left-5 pb-4 flex items-end justify-between right-5">
          <div>
            <p className="text-[10px] font-semibold uppercase tracking-widest text-white/60">Recordatorios de</p>
            <h2 className="text-xl font-black text-white">{pet.name}</h2>
          </div>
          <button className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-white text-[11px] font-bold mb-1"
            style={{ background: "#2AB87C" }}>
            <Plus size={13} /> Nuevo
          </button>
        </div>
      </div>
      {/* Summary pills */}
      <div className="flex gap-2 px-4 pt-4 pb-2">
        {[
          { label: "Activos", value: reminders.filter(r => r.active).length, color: "#2AB87C", bg: "#F0FBF6" },
          { label: "Esta semana", value: 2, color: "#F59E0B", bg: "#FFFBEB" },
          { label: "Inactivos", value: reminders.filter(r => !r.active).length, color: "#9CA3AF", bg: "#F5F6F8" },
        ].map(({ label, value, color, bg }) => (
          <div key={label} className="flex-1 rounded-xl p-2 text-center" style={{ background: bg }}>
            <p className="text-base font-black" style={{ color }}>{value}</p>
            <p className="text-[9px] text-muted-foreground font-medium">{label}</p>
          </div>
        ))}
      </div>
      {/* List */}
      <div className="px-4 pb-6 space-y-2.5 mt-2">
        {reminders.map(rem => (
          <div key={rem.id} className="flex items-center gap-3 p-3.5 rounded-2xl border border-border bg-white shadow-sm"
            style={{ opacity: rem.active ? 1 : 0.5 }}>
            <div className="w-10 h-10 rounded-xl flex items-center justify-center text-lg shrink-0" style={{ background: rem.bg }}>
              {rem.emoji}
            </div>
            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-1.5 mb-0.5">
                <span className="text-[9px] font-bold px-1.5 py-0.5 rounded-full" style={{ background: rem.bg, color: rem.color }}>{rem.category}</span>
                {rem.daysLeft <= 10 && rem.active && (
                  <span className="text-[9px] font-bold px-1.5 py-0.5 rounded-full" style={{ background: "#FEF2F2", color: "#EF4444" }}>¡Próximo!</span>
                )}
              </div>
              <p className="text-sm font-semibold text-foreground">{rem.name}</p>
              <p className="text-[10px] text-muted-foreground">{rem.date} · en {rem.daysLeft} días</p>
            </div>
            <div className="w-10 h-5 rounded-full relative shrink-0 transition-all"
              style={{ background: rem.active ? "#2AB87C" : "#E5E7EB" }}>
              <div className="absolute top-0.5 w-4 h-4 rounded-full bg-white shadow-sm transition-all"
                style={{ left: rem.active ? "calc(100% - 18px)" : 2 }} />
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}

/* ══════════════════════════════════════════════════════════
   AGREGAR RECORDATORIO
══════════════════════════════════════════════════════════ */
function AddReminderScreen({ pet }: { pet: any }) {
  const [category, setCategory] = useState("Vacuna")
  const categories = [
    { label: "Vacuna", emoji: "💉", color: "#60A5FA", bg: "#EFF6FF" },
    { label: "Medicamento", emoji: "💊", color: "#F59E0B", bg: "#FFFBEB" },
    { label: "Consulta", emoji: "🩺", color: "#2AB87C", bg: "#F0FBF6" },
    { label: "Baño", emoji: "🛁", color: "#A78BFA", bg: "#F5F3FF" },
    { label: "Otro", emoji: "📌", color: "#6B7280", bg: "#F5F6F8" },
  ]
  const alerts = ["El mismo día", "1 día antes", "3 días antes", "7 días antes"]
  const [alertSel, setAlertSel] = useState("7 días antes")

  const SmallInput = ({ label, placeholder, icon: Icon, type = "text" }: { label: string; placeholder: string; icon: any; type?: string }) => (
    <div>
      <p className="text-[11px] font-semibold text-foreground mb-1">{label}</p>
      <div className="relative">
        <div className="absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none">
          <Icon size={13} className="text-muted-foreground" />
        </div>
        <input type={type} placeholder={placeholder}
          className="w-full rounded-xl pl-8 pr-3 py-2 text-[11px] text-foreground placeholder:text-muted-foreground outline-none"
          style={{ background: "#F5F6F8" }} />
      </div>
    </div>
  )

  const sel = categories.find(c => c.label === category)!

  return (
    <div style={{ fontFamily: "'Inter', sans-serif" }} className="h-full flex flex-col bg-white">
      {/* Header */}
      <div className="shrink-0 relative" style={{ height: 110 }}>
        <img src={pet.hero} alt={pet.name} className="w-full h-full object-cover object-top" style={{ opacity: 0.5 }} />
        <div className="absolute inset-0" style={{ background: "linear-gradient(180deg,rgba(0,0,0,0.15) 0%,rgba(0,0,0,0.65) 100%)" }} />
        <div className="absolute bottom-0 left-0 right-0 px-5 pb-3 flex items-end justify-between">
          <div>
            <p className="text-[9px] font-semibold uppercase tracking-widest text-white/60">Nuevo recordatorio · {pet.name}</p>
            <h2 className="text-lg font-black text-white leading-tight">Agregar recordatorio</h2>
          </div>
          <button className="w-7 h-7 rounded-full bg-white/20 flex items-center justify-center">
            <ChevronLeft size={15} className="text-white" />
          </button>
        </div>
      </div>

      <div className="flex-1 overflow-y-auto px-4 pt-4 pb-4 space-y-4" style={{ scrollbarWidth: "none" }}>
        {/* Categoría */}
        <div>
          <p className="text-[11px] font-semibold text-foreground mb-2">Tipo de recordatorio</p>
          <div className="flex gap-2 flex-wrap">
            {categories.map(c => (
              <button key={c.label} onClick={() => setCategory(c.label)}
                className="flex items-center gap-1.5 px-3 py-1.5 rounded-full text-[11px] font-semibold border transition-all"
                style={category === c.label
                  ? { background: c.bg, color: c.color, borderColor: c.color }
                  : { background: "#F5F6F8", color: "#9CA3AF", borderColor: "transparent" }}>
                <span>{c.emoji}</span>{c.label}
              </button>
            ))}
          </div>
        </div>

        {/* Preview badge */}
        <div className="flex items-center gap-3 p-3 rounded-xl border" style={{ background: sel.bg, borderColor: sel.color + "40" }}>
          <span className="text-2xl">{sel.emoji}</span>
          <div>
            <p className="text-[10px] font-bold" style={{ color: sel.color }}>{sel.label}</p>
            <p className="text-xs text-muted-foreground">Completa los campos para guardar</p>
          </div>
        </div>

        {/* Campos */}
        <SmallInput label="Nombre del recordatorio" placeholder={`Ej. ${category === "Vacuna" ? "Antirrábica" : category === "Medicamento" ? "Antiparasitario oral" : category === "Consulta" ? "Revisión anual" : "Baño completo"}`} icon={Activity} />
        {(category === "Vacuna" || category === "Consulta") && (
          <>
            <SmallInput label="Nombre del veterinario" placeholder="Ej. Dr. García" icon={UserCircle2} />
            <SmallInput label="Nombre de la clínica" placeholder="Ej. VetSalud Miraflores" icon={MapPin} />
            <SmallInput label="Número de emergencia" placeholder="Ej. +52 55 1234 5678" icon={Phone} type="tel" />
          </>
        )}
        {category === "Medicamento" && (
          <SmallInput label="Medicamento / Dosis" placeholder="Ej. 1 tableta cada 6 meses" icon={Activity} />
        )}
        <SmallInput label="Fecha programada" placeholder="DD / MM / AAAA" icon={Clock} type="date" />

        {/* Repetición */}
        <div>
          <p className="text-[11px] font-semibold text-foreground mb-2">Repetición</p>
          <div className="grid grid-cols-2 gap-2">
            {["Una vez", "Mensual", "Semestral", "Anual"].map(r => (
              <button key={r} className="py-2 rounded-xl text-[11px] font-semibold border border-border text-muted-foreground"
                style={r === "Anual" ? { background: "#F0FBF6", color: "#2AB87C", borderColor: "#BBF7D0" } : { background: "#F9FAFB" }}>
                {r}
              </button>
            ))}
          </div>
        </div>

        {/* Alerta */}
        <div>
          <p className="text-[11px] font-semibold text-foreground mb-2">Enviar alerta</p>
          <div className="flex flex-wrap gap-2">
            {alerts.map(a => (
              <button key={a} onClick={() => setAlertSel(a)}
                className="px-3 py-1.5 rounded-full text-[10px] font-semibold border transition-all"
                style={alertSel === a
                  ? { background: "#2AB87C", color: "white", borderColor: "#2AB87C" }
                  : { background: "#F5F6F8", color: "#9CA3AF", borderColor: "transparent" }}>
                <Bell size={10} className="inline mr-1" />{a}
              </button>
            ))}
          </div>
        </div>

        {/* Notas */}
        <div>
          <p className="text-[11px] font-semibold text-foreground mb-1">Notas</p>
          <textarea placeholder="Instrucciones adicionales..." rows={2}
            className="w-full rounded-xl px-3 py-2 text-[11px] text-foreground placeholder:text-muted-foreground outline-none resize-none"
            style={{ background: "#F5F6F8" }} />
        </div>
      </div>

      {/* Guardar */}
      <div className="shrink-0 px-4 pb-5 pt-2 border-t border-border">
        <button className="w-full py-2.5 rounded-2xl text-white font-bold text-[12px] flex items-center justify-center gap-2"
          style={{ background: "linear-gradient(135deg,#1DA868,#2AB87C)" }}>
          <Bell size={14} /> Guardar recordatorio
        </button>
      </div>
    </div>
  )
}

/* ══════════════════════════════════════════════════════════
   AGREGAR MASCOTA
══════════════════════════════════════════════════════════ */
function AddPetScreen() {
  const [tipo, setTipo] = useState<"perro" | "gato">("perro")
  const [sexo, setSexo] = useState<"macho" | "hembra">("macho")
  const [tamanio, setTamanio] = useState("mediano")
  const [esterilizado, setEsterilizado] = useState(false)
  const [step, setStep] = useState(1)

  const razasPerro = ["Pastor Alemán", "Golden Retriever", "Labrador", "Bulldog", "Poodle", "Chihuahua", "Otro"]
  const razasGato  = ["Siamés", "Persa", "Ragdoll", "Maine Coon", "Bengalí", "Otro"]
  const razas = tipo === "perro" ? razasPerro : razasGato

  const F = ({ label, placeholder, icon: Icon, type = "text" }: { label: string; placeholder: string; icon: any; type?: string }) => (
    <div>
      <p className="text-[11px] font-semibold text-foreground mb-1">{label}</p>
      <div className="relative">
        <div className="absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none"><Icon size={13} className="text-muted-foreground" /></div>
        <input type={type} placeholder={placeholder}
          className="w-full rounded-xl pl-8 pr-3 py-2 text-[11px] text-foreground placeholder:text-muted-foreground outline-none"
          style={{ background: "#F5F6F8" }} />
      </div>
    </div>
  )

  return (
    <div style={{ fontFamily: "'Inter', sans-serif" }} className="h-full flex flex-col bg-white">
      {/* Header */}
      <div className="shrink-0 px-5 pt-12 pb-4 border-b border-border" style={{ background: "linear-gradient(135deg,#0d1f0d,#1a3a1a)" }}>
        <div className="flex items-center justify-between mb-3">
          <button className="w-8 h-8 rounded-full bg-white/15 flex items-center justify-center">
            <ChevronLeft size={16} className="text-white" />
          </button>
          <div className="flex items-center gap-2">
            <span className="text-white font-black text-sm">Nueva mascota</span>
          </div>
          <div className="w-8" />
        </div>
        {/* Steps */}
        <div className="flex items-center gap-2 mt-1">
          {[1, 2].map(s => (
            <div key={s} className="flex items-center gap-2 flex-1">
              <div className="w-6 h-6 rounded-full flex items-center justify-center text-[10px] font-black shrink-0"
                style={s <= step ? { background: "#2AB87C", color: "white" } : { background: "rgba(255,255,255,0.15)", color: "rgba(255,255,255,0.5)" }}>
                {s < step ? "✓" : s}
              </div>
              <span className="text-[10px] font-semibold" style={{ color: s <= step ? "white" : "rgba(255,255,255,0.4)" }}>
                {s === 1 ? "Datos básicos" : "Datos médicos"}
              </span>
              {s < 2 && <div className="flex-1 h-px mx-1" style={{ background: step > 1 ? "#2AB87C" : "rgba(255,255,255,0.15)" }} />}
            </div>
          ))}
        </div>
      </div>

      <div className="flex-1 overflow-y-auto px-4 pt-4 pb-4 space-y-4" style={{ scrollbarWidth: "none" }}>

        {step === 1 ? (
          <>
            {/* Foto */}
            <div>
              <p className="text-[11px] font-semibold text-foreground mb-2">Foto de la mascota</p>
              <div className="flex items-center gap-3">
                <div className="w-16 h-16 rounded-2xl flex items-center justify-center shrink-0"
                  style={{ background: "#F0FBF6", border: "2px dashed #2AB87C" }}>
                  <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="#2AB87C" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M23 19a2 2 0 0 1-2 2H3a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h4l2-3h6l2 3h4a2 2 0 0 1 2 2z"/>
                    <circle cx="12" cy="13" r="4"/>
                  </svg>
                </div>
                <div className="flex-1 space-y-1.5">
                  <button className="w-full py-1.5 rounded-xl text-[10px] font-bold" style={{ background: "#F0FBF6", color: "#2AB87C", border: "1px dashed #2AB87C" }}>
                    📁 Subir desde galería
                  </button>
                  <button className="w-full py-1.5 rounded-xl text-[10px] font-semibold border border-border" style={{ background: "#F9FAFB", color: "#6B7280" }}>
                    📷 Tomar foto
                  </button>
                </div>
              </div>
            </div>

            {/* Tipo */}
            <div>
              <p className="text-[11px] font-semibold text-foreground mb-2">Tipo de mascota</p>
              <div className="flex gap-2">
                {([["perro", "🐕", "Perro"], ["gato", "🐈", "Gato"]] as const).map(([key, emoji, label]) => (
                  <button key={key} onClick={() => setTipo(key)}
                    className="flex-1 flex items-center justify-center gap-2 py-3 rounded-xl border-2 font-semibold text-sm transition-all"
                    style={tipo === key ? { background: "#F0FBF6", borderColor: "#2AB87C", color: "#2AB87C" } : { background: "#F9FAFB", borderColor: "#E5E7EB", color: "#9CA3AF" }}>
                    <span className="text-xl">{emoji}</span> {label}
                  </button>
                ))}
              </div>
            </div>

            <F label="Nombre de la mascota" placeholder="Ej. Luna" icon={UserCircle2} />

            {/* Raza */}
            <div>
              <p className="text-[11px] font-semibold text-foreground mb-1">Raza</p>
              <div className="relative">
                <div className="absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none"><Activity size={13} className="text-muted-foreground" /></div>
                <select className="w-full rounded-xl pl-8 pr-4 py-2 text-[11px] text-foreground outline-none appearance-none" style={{ background: "#F5F6F8" }}>
                  <option value="">Seleccionar raza...</option>
                  {razas.map(r => <option key={r}>{r}</option>)}
                </select>
              </div>
            </div>

            {/* Sexo */}
            <div>
              <p className="text-[11px] font-semibold text-foreground mb-2">Sexo</p>
              <div className="flex gap-2">
                {([["macho", "♂️ Macho"], ["hembra", "♀️ Hembra"]] as const).map(([key, label]) => (
                  <button key={key} onClick={() => setSexo(key)}
                    className="flex-1 py-2 rounded-xl border-2 text-[11px] font-semibold transition-all"
                    style={sexo === key ? { background: "#F0FBF6", borderColor: "#2AB87C", color: "#2AB87C" } : { background: "#F9FAFB", borderColor: "#E5E7EB", color: "#9CA3AF" }}>
                    {label}
                  </button>
                ))}
              </div>
            </div>

            <F label="Fecha de nacimiento" placeholder="DD / MM / AAAA" icon={Clock} type="date" />

            {/* Tamaño */}
            <div>
              <p className="text-[11px] font-semibold text-foreground mb-2">Tamaño</p>
              <div className="flex gap-1.5">
                {[["pequeño", "XS · < 5 kg"], ["mediano", "M · 5–25 kg"], ["grande", "XL · > 25 kg"]].map(([key, label]) => (
                  <button key={key} onClick={() => setTamanio(key)}
                    className="flex-1 py-2 rounded-xl border-2 text-[9px] font-semibold transition-all leading-tight"
                    style={tamanio === key ? { background: "#F0FBF6", borderColor: "#2AB87C", color: "#2AB87C" } : { background: "#F9FAFB", borderColor: "#E5E7EB", color: "#9CA3AF" }}>
                    {label}
                  </button>
                ))}
              </div>
            </div>

            <F label="Color / pelaje" placeholder="Ej. Negro y café, pelo corto" icon={Layers} />
          </>
        ) : (
          <>
            <F label="Peso actual (kg)" placeholder="Ej. 28.4" icon={TrendingUp} type="number" />
            <F label="Número de microchip" placeholder="Ej. 985141004123456" icon={Navigation} />

            {/* Esterilizado */}
            <div className="flex items-center justify-between p-3.5 rounded-2xl border border-border bg-white">
              <div className="flex items-center gap-2.5">
                <span className="text-lg">✂️</span>
                <div>
                  <p className="text-sm font-semibold text-foreground">Esterilizado/a</p>
                  <p className="text-[10px] text-muted-foreground">Castrado o esterilizado</p>
                </div>
              </div>
              <button onClick={() => setEsterilizado(e => !e)}
                className="w-11 h-6 rounded-full relative transition-all shrink-0"
                style={{ background: esterilizado ? "#2AB87C" : "#E5E7EB" }}>
                <div className="absolute top-1 w-4 h-4 rounded-full bg-white shadow transition-all"
                  style={{ left: esterilizado ? "calc(100% - 18px)" : 4 }} />
              </button>
            </div>

            <F label="Nombre del veterinario" placeholder="Ej. Dr. García" icon={UserCircle2} />
            <F label="Clínica veterinaria" placeholder="Ej. VetSalud Miraflores" icon={MapPin} />
            <F label="Teléfono de emergencia" placeholder="Ej. +52 55 1234 5678" icon={Phone} type="tel" />

            {/* Alergias/condiciones */}
            <div>
              <p className="text-[11px] font-semibold text-foreground mb-1">Alergias / condiciones especiales</p>
              <textarea placeholder="Ej. Alergia a pollo, displasia de cadera..." rows={2}
                className="w-full rounded-xl px-3 py-2 text-[11px] text-foreground placeholder:text-muted-foreground outline-none resize-none"
                style={{ background: "#F5F6F8" }} />
            </div>

            <div className="rounded-2xl p-3.5 border" style={{ background: "#F0FBF6", borderColor: "#BBF7D0" }}>
              <div className="flex items-center gap-2 mb-1"><CheckCircle2 size={13} style={{ color: "#2AB87C" }} /><p className="text-[11px] font-bold text-foreground">¡Casi listo!</p></div>
              <p className="text-[10px] text-muted-foreground leading-relaxed">Después de guardar podrás agregar vacunas, recordatorios y vincular tu dispositivo GPS.</p>
            </div>
          </>
        )}
      </div>

      {/* Footer */}
      <div className="shrink-0 px-4 pb-5 pt-2 border-t border-border flex gap-2">
        {step === 2 && (
          <button onClick={() => setStep(1)} className="px-4 py-2.5 rounded-2xl font-bold text-[11px] border border-border text-muted-foreground" style={{ background: "#F9FAFB" }}>
            ← Atrás
          </button>
        )}
        <button onClick={() => step === 1 ? setStep(2) : undefined}
          className="flex-1 py-2.5 rounded-2xl text-white font-bold text-[12px] flex items-center justify-center gap-2"
          style={{ background: "linear-gradient(135deg,#1DA868,#2AB87C)" }}>
          {step === 1 ? <>Continuar <ArrowRight size={14} /></> : <><CheckCircle2 size={14} /> Guardar mascota</>}
        </button>
      </div>
    </div>
  )
}

/* ══════════════════════════════════════════════════════════
   GEOCERCAS
══════════════════════════════════════════════════════════ */
function GeofencesScreen({ pet }: { pet: any }) {
  const zones = [
    { name: "Casa", radius: 200, active: true, color: "#2AB87C", icon: "🏠" },
    { name: "Parque", radius: 150, active: true, color: "#60A5FA", icon: "🌳" },
    { name: "Veterinaria", radius: 100, active: true, color: "#F59E0B", icon: "🏥" },
  ]
  return (
    <div style={{ fontFamily: "'Inter', sans-serif" }} className="flex flex-col">
      {/* Mapa interactivo */}
      <div className="relative shrink-0" style={{ height: 260 }}>
        <svg viewBox="0 0 260 260" className="w-full h-full" preserveAspectRatio="xMidYMid slice">
          <rect width="260" height="260" fill="#E8EDE3" />
          {/* Calles */}
          <rect x="0" y="60" width="260" height="14" fill="#fff" opacity="0.9" />
          <rect x="0" y="170" width="260" height="12" fill="#fff" opacity="0.9" />
          <rect x="55" y="0" width="14" height="260" fill="#fff" opacity="0.9" />
          <rect x="190" y="0" width="12" height="260" fill="#fff" opacity="0.9" />
          {/* Manzanas */}
          <rect x="0" y="0" width="55" height="60" fill="#D4D9CA" rx="2" />
          <rect x="69" y="0" width="121" height="60" fill="#D4D9CA" rx="2" />
          <rect x="0" y="74" width="55" height="96" fill="#D4D9CA" rx="2" />
          {/* Parque */}
          <rect x="69" y="74" width="121" height="96" fill="#85C47A" rx="6" />
          <text x="129" y="125" textAnchor="middle" fontSize="7" fill="#245C20" fontWeight="700" fontFamily="Inter">Parque Central</text>
          {/* Geocerca parque */}
          <circle cx="129" cy="122" r="38" fill="rgba(96,165,250,0.1)" stroke="#60A5FA" strokeWidth="1.5" strokeDasharray="6 3" />
          {/* Geocerca casa */}
          <circle cx="200" cy="210" r="48" fill="rgba(42,184,124,0.1)" stroke="#2AB87C" strokeWidth="1.5" strokeDasharray="6 3" />
          {/* Casa pin */}
          <circle cx="200" cy="210" r="10" fill="white" stroke="#2AB87C" strokeWidth="1.5" />
          <text x="200" y="214" textAnchor="middle" fontSize="10">🏠</text>
          {/* Geocerca vet */}
          <circle cx="40" cy="180" r="28" fill="rgba(245,158,11,0.1)" stroke="#F59E0B" strokeWidth="1.5" strokeDasharray="6 3" />
          <text x="40" y="184" textAnchor="middle" fontSize="10">🏥</text>
          {/* Luna pin */}
          <circle cx="185" cy="195" r="16" fill="rgba(42,184,124,0.2)" />
          <circle cx="185" cy="195" r="10" fill="#2AB87C" />
          <circle cx="185" cy="195" r="5" fill="white" />
        </svg>
        {/* Overlay top */}
        <div className="absolute top-3 left-3 right-3 flex items-center justify-between">
          <div className="flex items-center gap-1.5 px-2.5 py-1.5 rounded-xl" style={{ background: "rgba(255,255,255,0.92)", backdropFilter: "blur(6px)" }}>
            <span className="w-2 h-2 rounded-full bg-[#2AB87C] animate-pulse inline-block" />
            <span className="text-[10px] font-bold text-foreground">{pet.name} · En zona segura</span>
          </div>
          <button className="flex items-center gap-1 px-2.5 py-1.5 rounded-xl text-[10px] font-bold text-white" style={{ background: "#2AB87C" }}>
            <Plus size={11} /> Nueva zona
          </button>
        </div>
      </div>

      {/* Zonas */}
      <div className="px-4 pt-4 pb-6 space-y-3">
        <p className="text-xs font-black uppercase tracking-widest text-muted-foreground">Zonas configuradas</p>
        {zones.map(z => (
          <div key={z.name} className="bg-white border border-border rounded-2xl p-3.5 shadow-sm">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl flex items-center justify-center text-lg shrink-0"
                style={{ background: z.color + "18" }}>{z.icon}</div>
              <div className="flex-1 min-w-0">
                <p className="text-sm font-bold text-foreground">{z.name}</p>
                <p className="text-[10px] text-muted-foreground">Radio: {z.radius} m</p>
              </div>
              <div className="w-10 h-5 rounded-full relative shrink-0" style={{ background: z.active ? z.color : "#E5E7EB" }}>
                <div className="absolute top-0.5 w-4 h-4 rounded-full bg-white shadow-sm"
                  style={{ left: z.active ? "calc(100% - 18px)" : 2 }} />
              </div>
            </div>
            {/* Radio slider */}
            <div className="mt-3">
              <div className="flex justify-between text-[9px] text-muted-foreground mb-1">
                <span>50 m</span><span className="font-semibold" style={{ color: z.color }}>{z.radius} m</span><span>500 m</span>
              </div>
              <div className="h-1.5 rounded-full bg-muted relative">
                <div className="h-full rounded-full" style={{ width: `${(z.radius / 500) * 100}%`, background: z.color }} />
                <div className="absolute top-1/2 -translate-y-1/2 w-3.5 h-3.5 rounded-full bg-white border-2 shadow"
                  style={{ left: `calc(${(z.radius / 500) * 100}% - 7px)`, borderColor: z.color }} />
              </div>
            </div>
            <div className="flex gap-2 mt-3">
              <button className="flex-1 py-1.5 rounded-xl text-[10px] font-semibold border border-border text-muted-foreground" style={{ background: "#F9FAFB" }}>
                ✏️ Editar
              </button>
              <button className="flex-1 py-1.5 rounded-xl text-[10px] font-semibold" style={{ background: "#FEF2F2", color: "#EF4444" }}>
                🗑️ Eliminar
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}

/* ══════════════════════════════════════════════════════════
   HORARIOS DE COMIDA
══════════════════════════════════════════════════════════ */
function MealScheduleScreen({ pet }: { pet: any }) {
  const meals = [
    { name: "Desayuno", time: "07:00", portion: "200", unit: "g", done: true, color: "#F59E0B" },
    { name: "Comida", time: "12:00", portion: "200", unit: "g", done: true, color: "#2AB87C" },
    { name: "Cena", time: "18:00", portion: "180", unit: "g", done: false, color: "#A78BFA" },
  ]
  const foods = ["Royal Canin Adult", "Pedigree Pro", "Hills Science", "Purina Pro Plan"]
  return (
    <div style={{ fontFamily: "'Inter', sans-serif" }} className="flex flex-col">
      {/* Header image */}
      <div className="relative shrink-0" style={{ height: 130 }}>
        <img src={pet.hero} alt={pet.name} className="w-full h-full object-cover object-top" style={{ opacity: 0.55 }} />
        <div className="absolute inset-0" style={{ background: "linear-gradient(180deg,rgba(0,0,0,0.1) 0%,rgba(0,0,0,0.6) 100%)" }} />
        <div className="absolute bottom-0 left-5 pb-3 right-5 flex items-end justify-between">
          <div>
            <p className="text-[9px] font-semibold uppercase tracking-widest text-white/60">Plan alimenticio de</p>
            <h2 className="text-lg font-black text-white">{pet.name}</h2>
          </div>
          <button className="flex items-center gap-1 px-2.5 py-1.5 rounded-xl text-[10px] font-bold text-white mb-1" style={{ background: "#2AB87C" }}>
            <Plus size={11} /> Añadir comida
          </button>
        </div>
      </div>

      <div className="px-4 pt-4 pb-6 space-y-4">
        {/* Resumen calórico */}
        <div className="rounded-2xl p-4 text-white" style={{ background: "linear-gradient(135deg,#1DA868,#2AB87C)" }}>
          <div className="flex items-center justify-between">
            <div>
              <p className="text-white/70 text-[10px] font-medium">Objetivo diario · {pet.name}</p>
              <p className="text-3xl font-black leading-none mt-0.5">{pet.calories} <span className="text-base font-semibold text-white/70">kcal</span></p>
              <p className="text-white/70 text-[10px] mt-1">{pet.weight} kg · {pet.breed}</p>
            </div>
            <div className="text-right">
              <p className="text-white/70 text-[10px]">Raciones</p>
              <p className="text-2xl font-black">{meals.length}</p>
              <p className="text-white/70 text-[10px]">comidas/día</p>
            </div>
          </div>
        </div>

        {/* Tipo de alimento */}
        <div>
          <p className="text-[11px] font-semibold text-foreground mb-2">Alimento principal</p>
          <div className="relative">
            <div className="absolute left-3 top-1/2 -translate-y-1/2"><Utensils size={13} className="text-muted-foreground" /></div>
            <select className="w-full rounded-xl pl-8 pr-4 py-2 text-[11px] text-foreground outline-none appearance-none" style={{ background: "#F5F6F8" }}>
              {foods.map(f => <option key={f}>{f}</option>)}
            </select>
          </div>
        </div>

        {/* Horarios */}
        <div>
          <p className="text-[11px] font-semibold text-foreground mb-2">Horarios y porciones</p>
          <div className="space-y-2.5">
            {meals.map((meal, i) => (
              <div key={i} className="bg-white border border-border rounded-2xl p-3.5 shadow-sm">
                <div className="flex items-center gap-3">
                  <div className="w-9 h-9 rounded-xl flex items-center justify-center shrink-0"
                    style={{ background: meal.color + "18" }}>
                    <span className="text-base">🍽️</span>
                  </div>
                  <div className="flex-1">
                    <div className="flex items-center justify-between mb-1">
                      <p className="text-sm font-bold text-foreground">{meal.name}</p>
                      <span className="text-[10px] font-bold px-2 py-0.5 rounded-full"
                        style={{ background: meal.done ? "#F0FBF6" : "#F9FAFB", color: meal.done ? "#2AB87C" : "#9CA3AF" }}>
                        {meal.done ? "✓ Servido" : "Pendiente"}
                      </span>
                    </div>
                    <div className="flex items-center gap-3">
                      <div className="flex items-center gap-1 px-2 py-1 rounded-lg" style={{ background: "#F5F6F8" }}>
                        <Clock size={11} className="text-muted-foreground" />
                        <span className="text-[11px] font-semibold text-foreground">{meal.time}</span>
                      </div>
                      <div className="flex items-center gap-1 px-2 py-1 rounded-lg" style={{ background: "#F5F6F8" }}>
                        <span className="text-[11px] font-semibold text-foreground">{meal.portion} {meal.unit}</span>
                      </div>
                    </div>
                  </div>
                </div>
                <div className="flex gap-2 mt-2.5">
                  <button className="flex-1 py-1.5 rounded-xl text-[10px] font-semibold border border-border" style={{ background: "#F9FAFB", color: "#6B7280" }}>✏️ Editar horario</button>
                  <button className="flex-1 py-1.5 rounded-xl text-[10px] font-semibold" style={{ background: "#F0FBF6", color: "#2AB87C" }}>✓ Marcar servido</button>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Alerta recordatorio */}
        <div className="rounded-2xl p-3.5 border" style={{ background: "#FFFBEB", borderColor: "#FDE68A" }}>
          <div className="flex items-center gap-2 mb-1"><Bell size={13} style={{ color: "#F59E0B" }} /><p className="text-[11px] font-bold text-foreground">Recordatorios activos</p></div>
          <p className="text-[10px] text-muted-foreground">Recibirás una notificación 15 min antes de cada hora de comida.</p>
        </div>
      </div>
    </div>
  )
}

/* ══════════════════════════════════════════════════════════
   REGISTRO DE PESO
══════════════════════════════════════════════════════════ */
function WeightLogScreen({ pet }: { pet: any }) {
  const history = [
    { date: "20 Jul 2025", weight: 28.4, note: "Control rutina · Dr. García", delta: 0 },
    { date: "15 Jun 2025", weight: 28.4, note: "Pesaje en clínica", delta: 0 },
    { date: "10 May 2025", weight: 28.1, note: "Control mensual", delta: -0.3 },
    { date: "8 Abr 2025", weight: 27.8, note: "Pesaje en casa", delta: -0.3 },
    { date: "5 Mar 2025", weight: 27.5, note: "Control rutina · Dr. García", delta: -0.3 },
  ]
  return (
    <div style={{ fontFamily: "'Inter', sans-serif" }} className="flex flex-col">
      {/* Header */}
      <div className="relative shrink-0" style={{ height: 130 }}>
        <img src={pet.hero} alt={pet.name} className="w-full h-full object-cover object-top" style={{ opacity: 0.55 }} />
        <div className="absolute inset-0" style={{ background: "linear-gradient(180deg,rgba(0,0,0,0.1) 0%,rgba(0,0,0,0.6) 100%)" }} />
        <div className="absolute bottom-0 left-5 pb-3 right-5 flex items-end justify-between">
          <div>
            <p className="text-[9px] font-semibold uppercase tracking-widest text-white/60">Peso de</p>
            <h2 className="text-lg font-black text-white">{pet.name}</h2>
          </div>
          <div className="text-right mb-1">
            <p className="text-2xl font-black text-white leading-none">{pet.weight} kg</p>
            <p className="text-[9px] text-white/60">peso actual</p>
          </div>
        </div>
      </div>

      <div className="px-4 pt-4 pb-6 space-y-4">
        {/* Gráfico */}
        <div className="bg-white border border-border rounded-2xl p-4 shadow-sm">
          <div className="flex items-center justify-between mb-3">
            <p className="text-sm font-bold text-foreground">Evolución de peso</p>
            <span className="text-sm font-black" style={{ color: "#2AB87C" }}>{pet.weight} kg</span>
          </div>
          <div className="h-24">
            <svg viewBox="0 0 220 80" className="w-full h-full">
              <defs>
                <linearGradient id="wgrad" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor="#2AB87C" stopOpacity="0.2" />
                  <stop offset="100%" stopColor="#2AB87C" stopOpacity="0" />
                </linearGradient>
              </defs>
              <path d="M10,65 L54,55 L98,48 L142,35 L186,35 L210,35" fill="none" stroke="#2AB87C" strokeWidth="2.5" strokeLinecap="round" />
              <path d="M10,65 L54,55 L98,48 L142,35 L186,35 L210,35 L210,80 L10,80 Z" fill="url(#wgrad)" />
              {[10,54,98,142,186,210].map((x, i) => (
                <circle key={i} cx={x} cy={[65,55,48,35,35,35][i]} r="3" fill="#2AB87C" />
              ))}
              {["Feb","Mar","Abr","May","Jun","Jul"].map((m, i) => (
                <text key={m} x={[10,54,98,142,186,210][i]} y="78" textAnchor="middle" fontSize="7" fill="#9CA3AF" fontFamily="Inter" fontWeight="600">{m}</text>
              ))}
            </svg>
          </div>
        </div>

        {/* Nuevo registro */}
        <div className="bg-white border border-border rounded-2xl p-4 shadow-sm">
          <p className="text-sm font-bold text-foreground mb-3">Registrar nuevo peso</p>
          <div className="flex gap-2 mb-3">
            <div className="flex-1">
              <p className="text-[10px] font-semibold text-foreground mb-1">Peso (kg)</p>
              <div className="relative">
                <div className="absolute left-3 top-1/2 -translate-y-1/2"><TrendingUp size={13} className="text-muted-foreground" /></div>
                <input type="number" placeholder="Ej. 28.6" step="0.1"
                  className="w-full rounded-xl pl-8 pr-3 py-2 text-[11px] text-foreground placeholder:text-muted-foreground outline-none"
                  style={{ background: "#F5F6F8" }} />
              </div>
            </div>
            <div className="flex-1">
              <p className="text-[10px] font-semibold text-foreground mb-1">Fecha</p>
              <div className="relative">
                <div className="absolute left-3 top-1/2 -translate-y-1/2"><Clock size={13} className="text-muted-foreground" /></div>
                <input type="date"
                  className="w-full rounded-xl pl-8 pr-3 py-2 text-[11px] text-foreground outline-none"
                  style={{ background: "#F5F6F8" }} />
              </div>
            </div>
          </div>
          <div className="mb-3">
            <p className="text-[10px] font-semibold text-foreground mb-1">Nota (opcional)</p>
            <input type="text" placeholder="Ej. Control rutina · Dr. García"
              className="w-full rounded-xl px-3 py-2 text-[11px] text-foreground placeholder:text-muted-foreground outline-none"
              style={{ background: "#F5F6F8" }} />
          </div>
          <button className="w-full py-2.5 rounded-xl text-white font-bold text-[11px] flex items-center justify-center gap-2"
            style={{ background: "linear-gradient(135deg,#1DA868,#2AB87C)" }}>
            <CheckCircle2 size={14} /> Guardar peso
          </button>
        </div>

        {/* Historial */}
        <div>
          <p className="text-[11px] font-semibold text-muted-foreground uppercase tracking-widest mb-2">Historial</p>
          <div className="space-y-2">
            {history.map((h, i) => (
              <div key={i} className="flex items-center gap-3 bg-white border border-border rounded-xl px-3.5 py-3 shadow-sm">
                <div className="w-8 h-8 rounded-lg flex items-center justify-center shrink-0"
                  style={{ background: h.delta > 0 ? "#FEF2F2" : h.delta < 0 ? "#F0FBF6" : "#F5F6F8" }}>
                  <span className="text-sm">{h.delta > 0 ? "📈" : h.delta < 0 ? "📉" : "➖"}</span>
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-[11px] font-bold text-foreground">{h.weight} kg
                    {h.delta !== 0 && <span className="ml-1.5 text-[9px] font-semibold" style={{ color: h.delta > 0 ? "#EF4444" : "#2AB87C" }}>
                      {h.delta > 0 ? "+" : ""}{h.delta} kg
                    </span>}
                  </p>
                  <p className="text-[9px] text-muted-foreground truncate">{h.note}</p>
                </div>
                <p className="text-[9px] text-muted-foreground shrink-0">{h.date}</p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}

/* ══════════════════════════════════════════════════════════
   CONFIGURACIÓN GPS
══════════════════════════════════════════════════════════ */
function GpsConfigScreen({ pet }: { pet: any }) {
  const sections = [
    {
      title: "Estado del dispositivo",
      items: [
        { label: "Batería", value: `${pet.battery}%`, icon: "🔋", accent: pet.battery > 60 ? "#2AB87C" : "#F59E0B" },
        { label: "Conexión", value: "Activa · 4G", icon: "📶", accent: "#2AB87C" },
      ],
    },
    {
      title: "Geocercas",
      items: [
        { label: "Casa", value: "Activa · 200 m", icon: "🏠", accent: "#2AB87C" },
        { label: "Parque", value: "Activa · 150 m", icon: "🌳", accent: "#2AB87C" },
        { label: "Veterinaria", value: "Activa · 100 m", icon: "🏥", accent: "#2AB87C" },
      ],
    },
    {
      title: "Alertas",
      items: [
        { label: "Salida de zona", value: "Activada", icon: "🔔", accent: "#2AB87C" },
        { label: "Batería baja", value: "Activada", icon: "🪫", accent: "#2AB87C" },
        { label: "Sin señal", value: "Activada", icon: "📵", accent: "#2AB87C" },
      ],
    },
  ]
  return (
    <div style={{ fontFamily: "'Inter', sans-serif" }}>
      {/* Header */}
      <div className="relative" style={{ height: 140, background: "#0d1f0d" }}>
        <img src={pet.hero} alt={pet.name} className="w-full h-full object-cover object-top" style={{ opacity: 0.5 }} />
        <div className="absolute inset-0" style={{ background: "linear-gradient(180deg,rgba(0,0,0,0.2) 0%,rgba(0,0,0,0.65) 100%)" }} />
        <div className="absolute bottom-0 left-5 pb-4">
          <p className="text-[10px] font-semibold uppercase tracking-widest text-white/60">Dispositivo GPS de</p>
          <h2 className="text-xl font-black text-white">{pet.name}</h2>
        </div>
        {/* Live indicator */}
        <div className="absolute top-4 right-4 flex items-center gap-1.5 px-2.5 py-1 rounded-full" style={{ background: "rgba(42,184,124,0.2)", border: "1px solid rgba(42,184,124,0.4)" }}>
          <span className="w-1.5 h-1.5 rounded-full bg-[#2AB87C] animate-pulse inline-block" />
          <span className="text-[9px] font-bold text-[#2AB87C]">GPS activo</span>
        </div>
      </div>
      {/* Sections */}
      <div className="px-4 pt-4 pb-6 space-y-4">
        {sections.map(({ title, items }) => (
          <div key={title} className="bg-white border border-border rounded-2xl shadow-sm overflow-hidden">
            <div className="px-4 py-2.5 border-b border-border" style={{ background: "#F9FAFB" }}>
              <p className="text-[10px] font-black uppercase tracking-widest text-muted-foreground">{title}</p>
            </div>
            {items.map(({ label, value, icon, accent }, i, arr) => (
              <div key={label} className={`flex items-center gap-3 px-4 py-3 ${i < arr.length - 1 ? "border-b border-border" : ""}`}>
                <span className="text-base w-6 text-center shrink-0">{icon}</span>
                <span className="flex-1 text-sm text-muted-foreground">{label}</span>
                <span className="text-sm font-semibold" style={{ color: accent || "#0D1117" }}>{value}</span>
                <ChevronRight size={13} className="text-muted-foreground shrink-0" />
              </div>
            ))}
          </div>
        ))}
        <button className="w-full py-3 rounded-xl text-sm font-bold flex items-center justify-center gap-2"
          style={{ background: "#FEF2F2", color: "#EF4444", border: "1.5px solid #FECACA" }}>
          🔴 Apagar dispositivo GPS
        </button>
      </div>
    </div>
  )
}

/* ══════════════════════════════════════════════════════════
   ROOT APP — FRAMES CANVAS
══════════════════════════════════════════════════════════ */
type FrameId = "splash" | "login" | "forgot" | "register" | "home" | "map" | "health" | "food" | "profile" | "docs" | "addmedical" | "reminders" | "addreminder" | "gpsconfig" | "geofences" | "mealschedule" | "weightlog" | "addpet"

const FRAME_GROUPS = [
  {
    group: "Autenticación",
    frames: [
      { id: "splash" as FrameId, label: "Splash" },
      { id: "login" as FrameId, label: "Login" },
      { id: "forgot" as FrameId, label: "Recuperar contraseña" },
      { id: "register" as FrameId, label: "Registro" },
    ],
  },
  {
    group: "App principal",
    frames: [
      { id: "home" as FrameId, label: "Inicio" },
      { id: "map" as FrameId, label: "Mapa" },
      { id: "health" as FrameId, label: "Salud" },
      { id: "food" as FrameId, label: "Nutrición" },
      { id: "profile" as FrameId, label: "Perfil" },
    ],
  },
  {
    group: "Perfil · Detalle",
    frames: [
      { id: "docs" as FrameId, label: "Documentos Médicos" },
      { id: "reminders" as FrameId, label: "Recordatorios" },
      { id: "addreminder" as FrameId, label: "Agregar Recordatorio" },
      { id: "gpsconfig" as FrameId, label: "Config. Dispositivo GPS" },
      { id: "geofences" as FrameId, label: "Configurar Geocercas" },
      { id: "mealschedule" as FrameId, label: "Horarios de Comida" },
      { id: "weightlog" as FrameId, label: "Registro de Peso" },
      { id: "addpet" as FrameId, label: "Agregar Mascota" },
    ],
  },
]

export default function App() {
  const [petIdx, setPetIdx] = useState(0)
  const [selected, setSelected] = useState<FrameId | null>(null)
  const [zoom, setZoom] = useState(1)
  const pet = PETS[petIdx]

  const lightIds: FrameId[] = ["splash", "login", "home", "profile"]

  function renderScreen(id: FrameId) {
    switch (id) {
      case "splash":   return <SplashScreen />
      case "login":    return <LoginScreen />
      case "forgot":   return <ForgotScreen />
      case "register": return <RegisterScreen />
      case "home":     return <HomeScreen pet={pet} petIdx={petIdx} setPetIdx={setPetIdx} />
      case "map":      return <MapScreen pet={pet} />
      case "health":   return <HealthScreen pet={pet} />
      case "food":     return <FoodScreen pet={pet} />
      case "profile":   return <ProfileScreen pet={pet} petIdx={petIdx} setPetIdx={setPetIdx} />
      case "docs":      return <DocsScreen pet={pet} />
      case "reminders":   return <RemindersScreen pet={pet} />
      case "addreminder": return <AddReminderScreen pet={pet} />
      case "gpsconfig":    return <GpsConfigScreen pet={pet} />
      case "geofences":    return <GeofencesScreen pet={pet} />
      case "mealschedule": return <MealScheduleScreen pet={pet} />
      case "weightlog":    return <WeightLogScreen pet={pet} />
      case "addpet":       return <AddPetScreen />
    }
  }

  const appTabs: FrameId[] = ["home", "map", "health", "food", "profile"]
  const isAppTab = (id: FrameId) => appTabs.includes(id)

  return (
    <div className="min-h-screen flex flex-col" style={{ background: "#0E1117", fontFamily: "'Inter', sans-serif" }}>
      {/* ── Toolbar ── */}
      <div className="sticky top-0 z-50 flex items-center gap-4 px-6 py-3 border-b" style={{ background: "#161B22", borderColor: "rgba(255,255,255,0.07)" }}>
        <div className="flex items-center gap-2">
          <Layers size={16} style={{ color: "#2AB87C" }} />
          <span className="text-white font-black text-sm tracking-tight">PET TRACKER PRO</span>
          <span className="text-[10px] font-black px-2 py-0.5 rounded-full ml-1" style={{ background: "#2AB87C", color: "white" }}>FRAMES</span>
        </div>
        <div className="flex-1" />
        {/* Zoom */}
        <div className="flex items-center gap-2">
          <button onClick={() => setZoom(z => Math.max(0.6, z - 0.1))} className="w-7 h-7 rounded-lg text-white text-sm font-bold flex items-center justify-center" style={{ background: "rgba(255,255,255,0.06)" }}>−</button>
          <span className="text-xs text-white/50 font-semibold w-10 text-center">{Math.round(zoom * 100)}%</span>
          <button onClick={() => setZoom(z => Math.min(1.4, z + 0.1))} className="w-7 h-7 rounded-lg text-white text-sm font-bold flex items-center justify-center" style={{ background: "rgba(255,255,255,0.06)" }}>+</button>
        </div>
        {/* Pet selector */}
        <div className="flex items-center gap-2 px-3 py-1.5 rounded-xl" style={{ background: "rgba(255,255,255,0.06)" }}>
          {PETS.map((p, i) => (
            <button key={p.id} onClick={() => setPetIdx(i)} className="flex items-center gap-1.5 transition-all">
              <img src={p.thumb} alt={p.name} className="w-5 h-5 rounded-full object-cover"
                style={{ border: i === petIdx ? "1.5px solid #2AB87C" : "1.5px solid transparent", opacity: i === petIdx ? 1 : 0.5 }} />
              <span className="text-xs font-semibold" style={{ color: i === petIdx ? "#2AB87C" : "rgba(255,255,255,0.4)" }}>{p.name}</span>
            </button>
          ))}
        </div>
        {selected && (
          <button onClick={() => setSelected(null)} className="text-xs font-semibold px-3 py-1.5 rounded-xl" style={{ background: "rgba(42,184,124,0.12)", color: "#2AB87C" }}>
            ✕ Deseleccionar
          </button>
        )}
      </div>

      {/* ── Canvas ── */}
      <div className="flex-1 overflow-auto p-10" style={{ background: "repeating-linear-gradient(0deg, transparent, transparent 23px, rgba(255,255,255,0.02) 24px), repeating-linear-gradient(90deg, transparent, transparent 23px, rgba(255,255,255,0.02) 24px)" }}>
        <div style={{ transform: `scale(${zoom})`, transformOrigin: "top left", transition: "transform 0.15s ease" }}>
          {FRAME_GROUPS.map(({ group, frames }) => (
            <div key={group} className="mb-16">
              {/* Group label */}
              <div className="flex items-center gap-3 mb-8">
                <span className="text-xs font-black uppercase tracking-[0.2em]" style={{ color: "rgba(255,255,255,0.2)" }}>{group}</span>
                <div className="flex-1 h-px" style={{ background: "rgba(255,255,255,0.05)" }} />
                <span className="text-xs font-semibold" style={{ color: "rgba(255,255,255,0.15)" }}>{frames.length} pantallas</span>
              </div>
              {/* Frames row */}
              <div className="flex flex-wrap gap-8">
                {frames.map(({ id, label }) => (
                  <PhoneFrame
                    key={id}
                    label={label}
                    lightStatus={lightIds.includes(id)}
                    showNav={isAppTab(id)}
                    activeTab={isAppTab(id) ? id : "home"}
                    selected={selected === id}
                    onClick={() => setSelected(s => s === id ? null : id)}
                    noPad={id === "splash" || id === "home" || id === "login" || id === "health" || id === "food" || id === "profile" || id === "docs" || id === "reminders" || id === "addreminder" || id === "gpsconfig" || id === "geofences" || id === "mealschedule" || id === "weightlog" || id === "addmedical" || id === "addpet"}
                  >
                    {renderScreen(id)}
                  </PhoneFrame>
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* ── Bottom info bar ── */}
      <div className="sticky bottom-0 flex items-center justify-between px-6 py-2 text-xs border-t" style={{ background: "#161B22", borderColor: "rgba(255,255,255,0.07)", color: "rgba(255,255,255,0.3)", fontFamily: "'Inter', sans-serif" }}>
        <span>9 pantallas · 2 grupos</span>
        <span>{selected ? `Seleccionado: ${selected}` : "Haz clic en un frame para seleccionarlo"}</span>
        <span>PET TRACKER PRO · v1.0</span>
      </div>
    </div>
  )
}
