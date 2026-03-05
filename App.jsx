import { useState, useEffect, useRef, createContext, useContext } from "react";

// ═══════════════════════════════════════════════
//  CONTEXT
// ═══════════════════════════════════════════════
const AppCtx = createContext();
const useApp = () => useContext(AppCtx);

// ═══════════════════════════════════════════════
//  DATA
// ═══════════════════════════════════════════════
const REQUESTS = [
  { id: 1, name: "سارة العتيبي", category: "فكرة جديدة", type: "رائدة أعمال", time: "منذ دقيقتين", city: "جدة", desc: "أحتاج مساعدة في تطوير فكرة مشروع لتوثيق منتجات صديقة البيئة وتسويقها.", img: "👩‍💼", badge: "💡", color: "#e8f5e9" },
  { id: 2, name: "أم عبدالله", category: "مساعدة أسبوعية", type: "أسرة منتجة", time: "منذ ساعة", city: "الرياض", desc: "أحتاج مساعدة لمدة ساعتين أسبوعياً على تصوير منتجات الأسر المنتجة.", img: "👩‍🍳", badge: "⏰", color: "#f3e5f5" },
  { id: 3, name: "دار الرحمة", category: "جلسة تعليمية لأطفال يتامى", type: "أيتام", time: "منذ ساعتين", city: "الخبر", desc: "أحتاج متطوعاً أو جلسة تعليمية لمدة ساعة لأطفال الأيتام.", img: "🏠", badge: "📚", color: "#e3f2fd" },
  { id: 4, name: "نورة المالكي", category: "استشارة تسويقية", type: "رائدة أعمال", time: "منذ 3 ساعات", city: "مكة", desc: "أحتاج توجيهاً في استراتيجية التسويق الرقمي لمشروعي الناشئ.", img: "👩‍💻", badge: "📊", color: "#fff8e1" },
  { id: 5, name: "أسرة الزهراني", category: "دعم تقني", type: "أسرة منتجة", time: "منذ 5 ساعات", city: "الدمام", desc: "نحتاج مساعدة في إنشاء متجر إلكتروني بسيط لبيع المنتجات اليدوية.", img: "👨‍👩‍👧", badge: "🛒", color: "#e8f5e9" },
  { id: 6, name: "مركز الأمل", category: "برنامج إرشادي", type: "أيتام", time: "منذ يوم", city: "المدينة", desc: "نحتاج متطوعين لبرنامج إرشاد نفسي واجتماعي للأيتام مرتين أسبوعياً.", img: "🌙", badge: "💚", color: "#e8f5e9" },
];

const INITIATIVES = [
  { id: 1, title: "مشروع الكعك المنزلي", owner: "أم سلمى", target: 4500, current: 3200, type: "أسرة منتجة", desc: "دعم مستدام لمشروع الكعك المنزلي لتوفير معدات حديثة.", emoji: "🍪", supporters: 47 },
  { id: 2, title: "حقيبة اليتيم المدرسية", owner: "جمعية الرعاية", target: 150, current: 53, type: "أيتام", desc: "توفير لوازم مدرسية وإرشاد أكاديمي للأطفال الأيتام.", emoji: "🎒", supporters: 89 },
  { id: 3, title: "ورشة التصوير للأسر", owner: "نادي المهارات", target: 30, current: 18, type: "مهارة", desc: "تعليم أمهات الأسر المنتجة أساسيات التصوير الاحترافي.", emoji: "📸", supporters: 34 },
  { id: 4, title: "مشروع التطريز اليدوي", owner: "مريم الحربي", target: 2000, current: 1650, type: "رائدة أعمال", desc: "دعم مشروع التطريز اليدوي بخيوط وأدوات متخصصة.", emoji: "🧵", supporters: 62 },
];

const ROLES = [
  { id: "maker", title: "صانع الأثر", sub: "المستخدم المساهم", desc: "شارك مهارتك، وقتك، أو فكرتك لتحدث أثراً حقيقياً", emoji: "🌿", color: "#2d6a4f" },
  { id: "beneficiary", title: "المستفيد", sub: "رائدة أعمال / أسرة منتجة / يتيم", desc: "احصل على الدعم الذي تحتاجه من مجتمع يهتم", emoji: "🌱", color: "#40916c" },
  { id: "supervisor", title: "مدير المنصة / المشرف", sub: "دور الشرد المشرف", desc: "أشرف على الطلبات وتحقق من الأثر الحقيقي", emoji: "GREEN_SHIELD", color: "#1b4332" },
  { id: "sponsor", title: "الجهة الراعية / الشريكة", sub: "جمعية خيرية / مؤسسة تمكين", desc: "ادعم المبادرات وشاهد أثر شراكتك المستدام", emoji: "🏛️", color: "#52b788" },
];

const ATHAR_TYPES = [
  { id: "humanitarian", title: "أثر إنساني", desc: "دعم احتياجات ومساعدات عاجلة", features: ["الإغاثة الضرورية", "كفالة الحالات", "دعم احتياجات الأيتام"], emoji: "🧺", tag: "تمويل مالي" },
  { id: "empowerment", title: "أثر تمكيني", desc: "تمكين النساء والأسر مشاريع تنموية", features: ["تعليم وتدريب", "مشاريع صغيرة", "دعم الموارد وريادة الأعمال"], emoji: "📗", tag: "دعم تدريبي" },
  { id: "knowledge", title: "أثر معرفي", desc: "نشر المعرفة والمشاركة بالمهارات", features: ["مشاركة مهارة وخبرة", "إرشاد وتوجيه", "إتاحة محتوى ملهم"], emoji: "💡", tag: "وقت ومشاركة" },
  { id: "voice", title: "أثر صوتي", desc: "نشر قصة ودعم حملات هادفة", features: ["نشر ومشاركة القصص", "التصويت للمبادرات", "رفع الوعي المجتمعي"], emoji: "📢", tag: "مشاركة رقمية" },
];

// ═══════════════════════════════════════════════
//  STYLES
// ═══════════════════════════════════════════════
const G = {
  green: "#2d6a4f",
  greenMid: "#40916c",
  greenLight: "#52b788",
  greenPale: "#d8f3dc",
  greenUltra: "#f0faf3",
  cream: "#fefae0",
  sand: "#f5f0e8",
  text: "#1b1b1b",
  textLight: "#555",
  textMuted: "#999",
  white: "#ffffff",
  shadow: "0 4px 24px rgba(45,106,79,0.12)",
  shadowHover: "0 12px 40px rgba(45,106,79,0.22)",
  radius: "20px",
  radiusSm: "12px",
};

const css = `
  @import url('https://fonts.googleapis.com/css2?family=Tajawal:wght@300;400;500;700;800;900&family=Amiri:wght@400;700&display=swap');
  * { box-sizing: border-box; margin: 0; padding: 0; }
  body { font-family: 'Tajawal', sans-serif; direction: rtl; background: ${G.sand}; }
  ::-webkit-scrollbar { width: 4px; } ::-webkit-scrollbar-thumb { background: ${G.greenLight}; border-radius: 4px; }
  input, textarea, select { outline: none; font-family: 'Tajawal', sans-serif; }
  button { cursor: pointer; font-family: 'Tajawal', sans-serif; }
  @keyframes slideFromLeft { from { opacity:0; transform:translateX(-80px); } to { opacity:1; transform:translateX(0); } }
  @keyframes slideFromRight { from { opacity:0; transform:translateX(80px); } to { opacity:1; transform:translateX(0); } }
  @keyframes fadeUp { from { opacity:0; transform:translateY(30px); } to { opacity:1; transform:translateY(0); } }
  @keyframes fadeIn { from { opacity:0; } to { opacity:1; } }
  @keyframes scaleIn { from { opacity:0; transform:scale(0.85); } to { opacity:1; transform:scale(1); } }
  @keyframes float { 0%,100%{transform:translateY(0) rotate(0deg)} 33%{transform:translateY(-12px) rotate(2deg)} 66%{transform:translateY(-6px) rotate(-1deg)} }
  @keyframes pulse { 0%,100%{transform:scale(1)} 50%{transform:scale(1.06)} }
  @keyframes shimmer { 0%{background-position:200% center} 100%{background-position:-200% center} }
  @keyframes spin { from{transform:rotate(0deg)} to{transform:rotate(360deg)} }
  @keyframes progressFill { from{width:0%} to{width:var(--target-width)} }
  @keyframes bounce { 0%,100%{transform:translateY(0)} 50%{transform:translateY(-8px)} }
  @keyframes typewriter { from{width:0} to{width:100%} }
  @keyframes blink { 0%,100%{opacity:1} 50%{opacity:0} }
  @keyframes ripple { 0%{transform:scale(0);opacity:0.6} 100%{transform:scale(4);opacity:0} }
  @keyframes glow { 0%,100%{box-shadow:0 0 20px rgba(82,183,136,0.3)} 50%{box-shadow:0 0 40px rgba(82,183,136,0.6)} }
  .card-hover { transition: all 0.35s cubic-bezier(0.4,0,0.2,1); }
  .card-hover:hover { transform: translateY(-6px); box-shadow: ${G.shadowHover}; }
  .btn-press:active { transform: scale(0.96); }
  .nav-item:hover { color: ${G.green} !important; }
  .tag { display:inline-flex; align-items:center; gap:4px; padding:4px 12px; border-radius:20px; font-size:12px; font-weight:700; }
  .shimmer-text { background: linear-gradient(90deg, ${G.green}, ${G.greenLight}, #a8d5ba, ${G.green}); background-size: 200% auto; -webkit-background-clip: text; -webkit-text-fill-color: transparent; animation: shimmer 3s linear infinite; }
`;

// ═══════════════════════════════════════════════
//  APP PROVIDER
// ═══════════════════════════════════════════════
function AppProvider({ children }) {
  const [screen, setScreen] = useState("splash");
  const [user, setUser] = useState(null);
  const [role, setRole] = useState(null);
  const [toast, setToast] = useState(null);
  const [supportedIds, setSupportedIds] = useState([]);
  const [likedIds, setLikedIds] = useState([]);

  const showToast = (msg, type = "success") => {
    setToast({ msg, type });
    setTimeout(() => setToast(null), 3500);
  };

  const support = (id) => {
    setSupportedIds(p => p.includes(id) ? p.filter(x => x !== id) : [...p, id]);
    showToast("تم تقديم دعمك! جزاك الله خيراً 🌿");
  };

  const like = (id) => {
    setLikedIds(p => p.includes(id) ? p.filter(x => x !== id) : [...p, id]);
  };

  return (
    <AppCtx.Provider value={{ screen, setScreen, user, setUser, role, setRole, showToast, support, supportedIds, likedIds, like }}>
      <style>{css}</style>
      {children}
      {toast && <Toast msg={toast.msg} type={toast.type} />}
    </AppCtx.Provider>
  );
}

// ═══════════════════════════════════════════════
//  TOAST
// ═══════════════════════════════════════════════
function Toast({ msg, type }) {
  return (
    <div style={{
      position: "fixed", bottom: 32, left: "50%", transform: "translateX(-50%)",
      background: type === "success" ? G.green : type === "error" ? "#c62828" : "#1565c0",
      color: "#fff", padding: "14px 28px", borderRadius: 50, fontSize: 14, fontWeight: 700,
      boxShadow: "0 8px 32px rgba(0,0,0,0.25)", zIndex: 9999,
      animation: "fadeUp 0.4s ease", whiteSpace: "nowrap", maxWidth: "90vw",
      textAlign: "center"
    }}>
      {msg}
    </div>
  );
}

// ═══════════════════════════════════════════════
//  LOGO
// ═══════════════════════════════════════════════



function GreenShield({ size = 40 }) {
  return (
    <svg width={size} height={size} viewBox="0 0 100 100" xmlns="http://www.w3.org/2000/svg"
      style={{ display: "block", margin: "0 auto" }}>
      <path d="M50 8 L88 22 L88 52 C88 72 70 88 50 95 C30 88 12 72 12 52 L12 22 Z"
        fill="#1b6b2e" stroke="#0d4a1e" strokeWidth="2"/>
      <path d="M50 16 L82 28 L82 52 C82 69 66 83 50 89 C34 83 18 69 18 52 L18 28 Z"
        fill="#2d8a3e"/>
      <line x1="50" y1="72" x2="50" y2="82" stroke="white" strokeWidth="2.5" strokeLinecap="round" opacity="0.9"/>
      <path d="M50 72 C46 67 40 65 38 67 C42 67 46 70 50 72 Z" fill="white" opacity="0.9"/>
      <path d="M50 72 C54 67 60 65 62 67 C58 67 54 70 50 72 Z" fill="white" opacity="0.9"/>
      <path d="M50 72 C48 66 45 62 42 62 C45 65 48 69 50 72 Z" fill="white" opacity="0.85"/>
      <path d="M50 72 C52 66 55 62 58 62 C55 65 52 69 50 72 Z" fill="white" opacity="0.85"/>
      <path d="M50 72 C49.5 64 50 60 50 60 C50.5 64 50 72 50 72 Z" fill="white" opacity="0.9"/>
      <rect x="34" y="35" width="32" height="4" rx="2" fill="white" opacity="0.95"/>
      <rect x="46" y="28" width="8" height="18" rx="3" fill="white" opacity="0.95"/>
    </svg>
  );
}

function AtharLogo({ size = 40, showText = true, light = false }) {
  return (
    <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 3 }}>
      <img
        src={"data:image/png;base64,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lnavYnn3RSzqXILRTQBZi6pTpTAJ8UESAGdwzpEmKWEUMj7ZS71ep6OtizRVKOUTd61NiELFib4jlEpNtJa6fTt9Y6Rq4BSmmss6P2ksjssMDh/n+IkjjEycYGh0gFq1QqU6Sa1WQylFVIhoKrRgTMCCee10LuimrW0RHe2LmNfagXN+RKhzWZt7ZbLqE/nrLE6fBMAZXFYZ4BOb/QwI69KpcjaHmkpI86s9NzV4BmbW7Yq5+NkUfnjS7GPlgJjE1rPHOLQJCHWEv02tZz02SRppNb7FfiMfUIiPSgLgqUwlMMN0wnIjwVhP5ajl517fX8uBSqb/ZBsfKL6JGNqi3xcTbZbA7YfX1/x9wqyBqx9OPyMwTiUwyypcnD4JgKc087A0zszsBJ66zHLgZIfx9Lk5/r3R0n26lG36+2rG1/v+mrr3ffioT765gjj7SAD8WOYKjkKIz5rc5wF+PBL0hDgbyPWCECK3JAAKIXJLAqAQIrckAAohcksCoBAityQACiFySwKgECK3JAAKIXJLAqAQIrckAAohcksCoBAityQACiFySwKgECK3JAAKIXJLAqAQIrckAAohcksCoBAityQACiFySwKgECK3JAAKIXJLAqAQIrckAAohcksCoBAityQACiFySwKgECK3JAAKIXJLAqAQIrckAAohcksCoBAityQACiFySwKgECK3JAAKIXJLAqAQIrckAAohcksCoBAityQACiFySwKgECK3JAAKIXJLAqAQIrckAAohcksCoBAityQACiFySwKgECK3JAAKIXJLAqAQIrckAAohcksCoBAityQACiFySwKgECK3JAAKIXJLAqAQIrckAAohcksCoBAityQACiFySwKgECK3JAAKIXJLAqAQIrckAAohcksCoBAityQACiFySwKgECK3JAAKIXJLAqAQIrckAAohcksCoBAit4I0TT/t1yCEEJ8K5Zxzn/aLEEKIT0Owffv2T/s1CCHEp+L/AH0xjsDqrvWAAAAAAElFTkSuQmCC"}
        alt="أثر"
        style={{
          width: size,
          height: size,
          objectFit: "contain",
          animation: "float 3s ease-in-out infinite",
          filter: light ? "brightness(10) saturate(0)" : "none",
        }}
      />
      {showText && (
        <span style={{
          fontFamily: "'Amiri', serif",
          fontSize: size * 0.6,
          fontWeight: 700,
          color: light ? "#fff" : "#2d6a4f",
          letterSpacing: 1,
          lineHeight: 1,
        }}>أثر</span>
      )}
    </div>
  );
}

function BottomNav({ active, setActive }) {
  const items = [
    { key: "home", icon: "🏠", label: "الرئيسية" },
    { key: "submit", icon: "🌿", label: "قدّم أثر" },
    { key: "requests", icon: "📋", label: "الطلبات" },
    { key: "impact", icon: "✨", label: "الأثر" },
    { key: "profile", icon: "👤", label: "حسابي" },
  ];
  return (
    <div style={{
      position: "fixed", bottom: 0, left: 0, right: 0,
      background: "#fff", borderTop: `2px solid ${G.greenPale}`,
      display: "flex", justifyContent: "space-around", alignItems: "center",
      padding: "10px 0 16px", zIndex: 200,
      boxShadow: "0 -4px 20px rgba(45,106,79,0.08)"
    }}>
      {items.map(item => (
        <button key={item.key} onClick={() => setActive(item.key)} className="nav-item" style={{
          display: "flex", flexDirection: "column", alignItems: "center", gap: 3,
          background: "none", border: "none", padding: "4px 12px",
          color: active === item.key ? G.green : G.textMuted,
          fontWeight: active === item.key ? 700 : 400, fontSize: 11,
          transition: "all 0.2s", transform: active === item.key ? "translateY(-2px)" : "none"
        }}>
          <span style={{ fontSize: 22 }}>{item.icon}</span>
          <span>{item.label}</span>
          {active === item.key && <div style={{ width: 4, height: 4, borderRadius: "50%", background: G.green }} />}
        </button>
      ))}
    </div>
  );
}

// ═══════════════════════════════════════════════
//  SPLASH SCREEN
// ═══════════════════════════════════════════════
function SplashScreen() {
  const { setScreen } = useApp();
  const [phase, setPhase] = useState(0);

  useEffect(() => {
    const t1 = setTimeout(() => setPhase(1), 400);
    const t2 = setTimeout(() => setPhase(2), 1200);
    const t3 = setTimeout(() => setPhase(3), 2200);
    const t4 = setTimeout(() => setScreen("onboarding"), 3600);
    return () => [t1, t2, t3, t4].forEach(clearTimeout);
  }, []);

  return (
    <div style={{
      minHeight: "100vh", background: "#fff", display: "flex", flexDirection: "column",
      alignItems: "center", justifyContent: "center", direction: "rtl", position: "relative", overflow: "hidden"
    }}>
      {/* Background circles */}
      <div style={{ position: "absolute", top: -100, right: -100, width: 300, height: 300, borderRadius: "50%", background: "radial-gradient(circle, rgba(82,183,136,0.08) 0%, transparent 70%)" }} />
      <div style={{ position: "absolute", bottom: -80, left: -80, width: 250, height: 250, borderRadius: "50%", background: "radial-gradient(circle, rgba(45,106,79,0.06) 0%, transparent 70%)" }} />

      {/* Floating particles */}
      {[...Array(8)].map((_, i) => (
        <div key={i} style={{
          position: "absolute", width: 6 + (i % 3) * 4, height: 6 + (i % 3) * 4,
          borderRadius: "50%", background: `rgba(82,183,136,${0.2 + i * 0.05})`,
          top: `${10 + i * 11}%`, left: `${5 + i * 12}%`,
          animation: `float ${2 + i * 0.4}s infinite ${i * 0.3}s`,
          opacity: phase >= 1 ? 1 : 0, transition: "opacity 0.5s"
        }} />
      ))}

      {/* Main logo area */}
      <div style={{
        display: "flex", flexDirection: "column", alignItems: "center", gap: 20,
        animation: phase >= 1 ? "scaleIn 0.8s cubic-bezier(0.34,1.56,0.64,1)" : "none",
        opacity: phase >= 1 ? 1 : 0
      }}>
        <AtharLogo size={120} showText={false} />

        {/* Animated title */}
        <div style={{ textAlign: "center" }}>
          <div style={{
            fontFamily: "'Amiri', serif", fontSize: 72, fontWeight: 700, color: G.green,
            animation: phase >= 1 ? "slideFromLeft 0.8s cubic-bezier(0.34,1.56,0.64,1)" : "none",
            lineHeight: 1, marginBottom: 4,
            textShadow: "0 4px 20px rgba(45,106,79,0.2)"
          }}>
            أثر
          </div>
          {phase >= 2 && (
            <div style={{
              color: G.textLight, fontSize: 16, fontWeight: 500,
              animation: "slideFromRight 0.6s ease",
              letterSpacing: 1
            }}>
              كل إنسان مؤثر
            </div>
          )}
        </div>

        {/* Tagline */}
        {phase >= 3 && (
          <div style={{
            background: `linear-gradient(135deg, ${G.greenUltra}, ${G.greenPale})`,
            border: `1px solid ${G.greenPale}`,
            borderRadius: 50, padding: "10px 28px",
            animation: "fadeUp 0.6s ease",
            color: G.green, fontSize: 13, fontWeight: 600
          }}>
            ✨ النية → الفعل → النتيجة → الأثر المستمر
          </div>
        )}
      </div>

      {/* Loading bar */}
      <div style={{ position: "absolute", bottom: 60, width: "60%", maxWidth: 200 }}>
        <div style={{ height: 3, background: G.greenPale, borderRadius: 10, overflow: "hidden" }}>
          <div style={{
            height: "100%", background: `linear-gradient(90deg, ${G.greenLight}, ${G.green})`,
            borderRadius: 10, width: `${phase * 33}%`, transition: "width 1s ease"
          }} />
        </div>
      </div>
    </div>
  );
}

// ═══════════════════════════════════════════════
//  ONBOARDING (Role Selection)
// ═══════════════════════════════════════════════
function OnboardingScreen() {
  const { setScreen, setRole } = useApp();
  const [selected, setSelected] = useState(null);
  const [hovered, setHovered] = useState(null);

  const choose = (r) => {
    setRole(r);
    setTimeout(() => setScreen("login"), 300);
  };

  return (
    <div style={{ minHeight: "100vh", background: G.sand, direction: "rtl", fontFamily: "'Tajawal', sans-serif", paddingBottom: 40 }}>
      {/* Header */}
      <div style={{
        background: `linear-gradient(160deg, ${G.green} 0%, ${G.greenMid} 100%)`,
        padding: "60px 24px 40px", textAlign: "center", borderRadius: "0 0 40px 40px",
        position: "relative", overflow: "hidden"
      }}>
        <div style={{ position: "absolute", top: -30, left: -30, width: 120, height: 120, borderRadius: "50%", background: "rgba(255,255,255,0.06)" }} />
        <div style={{ position: "absolute", bottom: -40, right: -20, width: 160, height: 160, borderRadius: "50%", background: "rgba(255,255,255,0.04)" }} />
        <AtharLogo size={50} />
        <h1 style={{ color: "#fff", fontSize: 26, fontWeight: 800, marginTop: 16, marginBottom: 8 }}>
          أهلاً بك في أثر
        </h1>
        <p style={{ color: "rgba(255,255,255,0.85)", fontSize: 14 }}>اختر دورك لنبدأ رحلة الأثر معاً</p>
      </div>

      {/* Roles */}
      <div style={{ padding: "28px 20px", display: "grid", gridTemplateColumns: "1fr 1fr", gap: 14 }}>
        {ROLES.map((r, i) => (
          <div key={r.id}
            className="card-hover"
            onClick={() => { setSelected(r.id); choose(r.id); }}
            onMouseEnter={() => setHovered(r.id)}
            onMouseLeave={() => setHovered(null)}
            style={{
              background: selected === r.id ? `linear-gradient(135deg, ${G.green}, ${G.greenMid})` : "#fff",
              borderRadius: G.radius, padding: "22px 16px", textAlign: "center", cursor: "pointer",
              border: `2px solid ${selected === r.id ? G.green : hovered === r.id ? G.greenLight : G.greenPale}`,
              boxShadow: G.shadow,
              animation: `fadeUp 0.5s ease ${i * 0.1}s both`,
              transition: "all 0.3s"
            }}>
            <div style={{ fontSize: 40, marginBottom: 10, animation: "float 3s infinite", display: "flex", justifyContent: "center" }}>
              {r.emoji === "GREEN_SHIELD" ? <GreenShield size={44}/> : r.emoji}
            </div>
            <h3 style={{ fontSize: 15, fontWeight: 800, color: selected === r.id ? "#fff" : G.green, marginBottom: 4 }}>{r.title}</h3>
            <p style={{ fontSize: 11, color: selected === r.id ? "rgba(255,255,255,0.85)" : G.textMuted, lineHeight: 1.5 }}>{r.sub}</p>
          </div>
        ))}
      </div>

      {/* Impact flow */}
      <div style={{ margin: "0 20px", background: "#fff", borderRadius: G.radius, padding: 20, boxShadow: G.shadow }}>
        <p style={{ textAlign: "center", color: G.green, fontWeight: 800, fontSize: 14, marginBottom: 14 }}>🌿 خريطة الأثر المستدام</p>
        <div style={{ display: "flex", alignItems: "center", justifyContent: "center", gap: 8, flexWrap: "wrap" }}>
          {["🏛️ الجهة الراعية", "→", "قدّم", "→", "👥 حدث التقدم", "→", "💚 الأثر"].map((item, i) => (
            <span key={i} style={{ fontSize: item === "→" ? 16 : 12, color: item === "→" ? G.greenLight : G.text, fontWeight: item === "→" ? 400 : 600, background: item === "→" ? "none" : G.greenUltra, padding: item === "→" ? 0 : "4px 10px", borderRadius: 20 }}>
              {item}
            </span>
          ))}
        </div>
      </div>
    </div>
  );
}

// ═══════════════════════════════════════════════
//  LOGIN SCREEN
// ═══════════════════════════════════════════════
function LoginScreen() {
  const { setScreen, setUser, showToast, role } = useApp();
  const [isRegister, setIsRegister] = useState(false);
  const [form, setForm] = useState({ name: "", email: "", phone: "", password: "" });
  const [loading, setLoading] = useState(false);
  const [showPrivacy, setShowPrivacy] = useState(false);

  const submit = (e) => {
    e.preventDefault();
    if (!form.email || !form.password) { showToast("يرجى تعبئة جميع الحقول", "error"); return; }
    setLoading(true);
    setTimeout(() => {
      setUser({ name: form.name || "مستخدم أثر", email: form.email, phone: form.phone, role: role?.id || "maker", joined: "مارس 2026", athar: 0, volunteered: 0 });
      setLoading(false);
      setScreen("main");
      showToast(`أهلاً بك في أثر! ${form.name ? form.name : ""} 🌿`);
    }, 1200);
  };

  if (showPrivacy) return <PrivacyScreen onBack={() => setShowPrivacy(false)} />;

  return (
    <div style={{ minHeight: "100vh", background: G.sand, direction: "rtl", fontFamily: "'Tajawal', sans-serif" }}>
      {/* Header */}
      <div style={{
        background: `linear-gradient(160deg, ${G.green} 0%, ${G.greenMid} 100%)`,
        padding: "56px 24px 50px", textAlign: "center",
        borderRadius: "0 0 50px 50px", position: "relative", overflow: "hidden"
      }}>
        <div style={{ position: "absolute", inset: 0, backgroundImage: "radial-gradient(circle at 30% 50%, rgba(255,255,255,0.05) 0%, transparent 60%), radial-gradient(circle at 80% 20%, rgba(255,255,255,0.04) 0%, transparent 50%)" }} />
        <button onClick={() => setScreen("onboarding")} style={{ position: "absolute", top: 20, right: 20, background: "rgba(255,255,255,0.15)", border: "none", color: "#fff", width: 36, height: 36, borderRadius: "50%", fontSize: 16 }}>←</button>
        <AtharLogo size={52} />
        <h1 style={{ color: "#fff", fontSize: 24, fontWeight: 800, marginTop: 16, marginBottom: 6 }}>
          {isRegister ? "إنشاء حساب جديد" : "مرحباً بعودتك"}
        </h1>
        <p style={{ color: "rgba(255,255,255,0.8)", fontSize: 13 }}>
          {role ? `دورك: ${ROLES.find(r => r.id === role)?.title}` : ""}
        </p>
      </div>

      {/* Form */}
      <div style={{ padding: "28px 24px" }}>
        <div style={{ background: "#fff", borderRadius: 24, padding: 28, boxShadow: G.shadow, animation: "fadeUp 0.5s ease" }}>
          <form onSubmit={submit} style={{ display: "flex", flexDirection: "column", gap: 16 }}>
            {isRegister && (
              <div>
                <label style={{ fontSize: 13, color: G.green, fontWeight: 700, marginBottom: 6, display: "block" }}>الاسم الكامل</label>
                <input value={form.name} onChange={e => setForm({ ...form, name: e.target.value })} placeholder="مثال: سارة المطيري" style={{ width: "100%", padding: "14px 16px", borderRadius: 14, border: `2px solid ${G.greenPale}`, fontSize: 15, background: G.greenUltra, transition: "all 0.3s" }} />
              </div>
            )}
            <div>
              <label style={{ fontSize: 13, color: G.green, fontWeight: 700, marginBottom: 6, display: "block" }}>البريد الإلكتروني</label>
              <input type="email" value={form.email} onChange={e => setForm({ ...form, email: e.target.value })} placeholder="example@email.com" style={{ width: "100%", padding: "14px 16px", borderRadius: 14, border: `2px solid ${G.greenPale}`, fontSize: 15, background: G.greenUltra, direction: "ltr", textAlign: "right" }} />
            </div>
            {isRegister && (
              <div>
                <label style={{ fontSize: 13, color: G.green, fontWeight: 700, marginBottom: 6, display: "block" }}>رقم الهاتف</label>
                <input type="tel" value={form.phone} onChange={e => setForm({ ...form, phone: e.target.value })} placeholder="+966 5X XXX XXXX" style={{ width: "100%", padding: "14px 16px", borderRadius: 14, border: `2px solid ${G.greenPale}`, fontSize: 15, background: G.greenUltra, direction: "ltr", textAlign: "right" }} />
              </div>
            )}
            <div>
              <label style={{ fontSize: 13, color: G.green, fontWeight: 700, marginBottom: 6, display: "block" }}>كلمة المرور</label>
              <input type="password" value={form.password} onChange={e => setForm({ ...form, password: e.target.value })} placeholder="••••••••" style={{ width: "100%", padding: "14px 16px", borderRadius: 14, border: `2px solid ${G.greenPale}`, fontSize: 15, background: G.greenUltra }} />
            </div>

            <button type="submit" className="btn-press" disabled={loading} style={{
              width: "100%", padding: "16px", borderRadius: 50,
              background: loading ? G.greenPale : `linear-gradient(135deg, ${G.green}, ${G.greenMid})`,
              border: "none", color: loading ? G.green : "#fff", fontSize: 16, fontWeight: 800,
              boxShadow: loading ? "none" : `0 6px 20px rgba(45,106,79,0.35)`,
              transition: "all 0.3s", marginTop: 8
            }}>
              {loading ? "⏳ جارٍ التحقق..." : isRegister ? "إنشاء حساب" : "تسجيل الدخول"}
            </button>
          </form>

          <div style={{ textAlign: "center", marginTop: 20, color: G.textMuted, fontSize: 14 }}>
            {isRegister ? "لديك حساب؟ " : "ليس لديك حساب؟ "}
            <span onClick={() => setIsRegister(!isRegister)} style={{ color: G.green, fontWeight: 700, cursor: "pointer" }}>
              {isRegister ? "تسجيل الدخول" : "إنشاء حساب"}
            </span>
          </div>

          <div onClick={() => setShowPrivacy(true)} style={{ marginTop: 16, textAlign: "center", color: G.textMuted, fontSize: 12, cursor: "pointer" }}>
            🔒 نخصصيتك وأمانك أولاً — اقرأ سياسة الخصوصية
          </div>
        </div>

        {/* Social login */}
        <div style={{ marginTop: 20, textAlign: "center", color: G.textMuted, fontSize: 13 }}>أو</div>
        <div style={{ display: "flex", gap: 12, marginTop: 16 }}>
          {[{ icon: "📱", label: "Apple" }, { icon: "🔍", label: "Google" }].map(s => (
            <button key={s.label} onClick={() => { setUser({ name: "مستخدم أثر", email: "user@athar.app", role: "maker", joined: "مارس 2026", athar: 12, volunteered: 5 }); setScreen("main"); }} className="btn-press" style={{ flex: 1, padding: "14px", borderRadius: 50, background: "#fff", border: `2px solid ${G.greenPale}`, fontSize: 14, fontWeight: 700, color: G.text, boxShadow: G.shadow, display: "flex", alignItems: "center", justifyContent: "center", gap: 8 }}>
              <span>{s.icon}</span><span>متابعة بـ{s.label}</span>
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}

// ═══════════════════════════════════════════════
//  PRIVACY SCREEN
// ═══════════════════════════════════════════════
function PrivacyScreen({ onBack }) {
  const sections = [
    {
      icon: "🔒", title: "كيف نحمي بياناتك",
      items: ["تشفير المعلومات الحساسة", "استخدام بياناتك فقط لتحسين تجربة أثر", "مراجعة أمنية دورية من جهات معتمدة"]
    },
    {
      icon: "✅", title: "ما الذي نشاركه وما لا نشاركه",
      items: [
        "✔️ لا نشارك معلوماتك الشخصية مع أطراف غير معتمدة",
        "✔️ يمكن إخفاء اسمك عند تقديم الأثر",
        "✖️ لا نبيع البيانات ولا نستخدمها للإعلانات"
      ]
    },
    {
      icon: "⚙️", title: "تحكمك ببياناتك",
      items: null,
      buttons: [
        { label: "عرض بياناتي", icon: "👁️" },
        { label: "تحميل نسخة احتياطية", icon: "⬇️" },
        { label: "حذف الحساب", icon: "🗑️", danger: true }
      ]
    },
    {
      icon: "💬", title: "الإبلاغ والدعم",
      items: null,
      buttons: [
        { label: "تواصل مع الدعم", icon: "💬" },
        { label: "أبلغ عن إساءة", icon: "⚠️", danger: true }
      ]
    },
  ];

  return (
    <div style={{ minHeight: "100vh", background: G.sand, direction: "rtl", fontFamily: "'Tajawal', sans-serif" }}>
      <div style={{ background: `linear-gradient(135deg, #3d2b1f, #6b4c35)`, padding: "56px 24px 40px", textAlign: "center", borderRadius: "0 0 40px 40px" }}>
        <button onClick={onBack} style={{ position: "absolute", top: 20, right: 20, background: "rgba(255,255,255,0.15)", border: "none", color: "#fff", width: 36, height: 36, borderRadius: "50%", fontSize: 16 }}>←</button>
        <div style={{ fontSize: 56, marginBottom: 12, animation: "float 3s infinite" }}>🛡️</div>
        <h1 style={{ color: "#fff", fontSize: 26, fontWeight: 900, marginBottom: 6, fontFamily: "'Amiri', serif" }}>خصوصيتك وأمانك أولاً</h1>
        <p style={{ color: "rgba(255,255,255,0.8)", fontSize: 14 }}>نحمي بياناتك كما تجمّي نيّتك</p>
      </div>

      <div style={{ padding: "24px 20px", display: "flex", flexDirection: "column", gap: 16 }}>
        {sections.map((s, i) => (
          <div key={i} style={{ background: "#fff", borderRadius: 20, padding: 22, boxShadow: G.shadow, animation: `fadeUp 0.5s ease ${i * 0.1}s both` }}>
            <h3 style={{ fontSize: 16, fontWeight: 800, color: "#3d2b1f", marginBottom: 14, display: "flex", alignItems: "center", gap: 8 }}>
              <span>{s.icon}</span><span>{s.title}</span>
            </h3>
            {s.items && s.items.map((item, j) => (
              <div key={j} style={{ display: "flex", alignItems: "flex-start", gap: 10, marginBottom: 10 }}>
                {!item.startsWith("✔") && !item.startsWith("✖") && <span style={{ color: "#6b4c35", fontWeight: 700 }}>✔</span>}
                <span style={{ fontSize: 14, color: G.textLight, lineHeight: 1.6 }}>{item}</span>
              </div>
            ))}
            {s.buttons && (
              <div style={{ display: "flex", flexWrap: "wrap", gap: 10 }}>
                {s.buttons.map((btn, j) => (
                  <button key={j} className="btn-press card-hover" style={{
                    flex: btn.label === "حذف الحساب" ? "1 0 100%" : 1, padding: "12px 16px",
                    borderRadius: 14, border: `2px solid ${btn.danger ? "#ffcdd2" : "#e8d5c0"}`,
                    background: btn.danger ? "#fff5f5" : "#faf6f0", color: btn.danger ? "#c62828" : "#3d2b1f",
                    fontSize: 13, fontWeight: 700, display: "flex", alignItems: "center", justifyContent: "center", gap: 6
                  }}>
                    <span>{btn.icon}</span><span>{btn.label}</span>
                  </button>
                ))}
              </div>
            )}
          </div>
        ))}

        <div style={{ textAlign: "center", padding: 16, color: G.textMuted, fontSize: 12, display: "flex", alignItems: "center", justifyContent: "center", gap: 8 }}>
          <span>✅</span>
          <span>وجود جهات راعية مُوثّقة تضمن سلامة المستفيدين والمساهمين</span>
        </div>
      </div>
    </div>
  );
}

// ═══════════════════════════════════════════════
//  HOME SCREEN
// ═══════════════════════════════════════════════
function HomeScreen({ setPage }) {
  const { user, showToast, like, likedIds } = useApp();
  const [activeCategory, setActiveCategory] = useState("الكل");
  const categories = ["الكل", "رائدات الأعمال", "الأسر المنتجة", "الأيتام"];

  const quickActions = [
    { label: "قدّم أثر", sublabel: "(وقت – مهارة – دعم)", icon: "⏰", color: "#e8f5e9", border: "#b7dfbe", page: "submit" },
    { label: "اطلب دعماً", sublabel: "(رائدات – أسر – أيتام)", icon: "🌿", color: "#fff8e1", border: "#f0d890", page: "requests" },
    { label: "مبادرات الأعمال", sublabel: "", icon: "📈", color: "#e8f5e9", border: "#b7dfbe", page: "impact" },
    { label: "أثر الأيتام", sublabel: "", icon: "👶", color: "#f3f0ff", border: "#c5b8f5", page: "requests" },
  ];

  const nearbyInitiatives = INITIATIVES.slice(0, 2);

  return (
    <div style={{ minHeight: "100vh", background: `linear-gradient(180deg, ${G.greenUltra} 0%, ${G.sand} 100%)`, direction: "rtl", fontFamily: "'Tajawal', sans-serif", paddingBottom: 90 }}>
      {/* Header */}
      <div style={{ padding: "20px 20px 0", background: `linear-gradient(135deg, ${G.greenUltra}, #fff)` }}>
        <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 20 }}>
          <button style={{ background: "none", border: "none", fontSize: 22 }}>🔔</button>
          <AtharLogo size={38} />
          <div style={{ position: "relative" }}>
            <button style={{ background: "none", border: "none", fontSize: 22 }}>🔔</button>
            <div style={{ position: "absolute", top: -4, left: -4, width: 16, height: 16, background: "#ef5350", borderRadius: "50%", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 9, color: "#fff", fontWeight: 700 }}>2</div>
          </div>
        </div>

        {/* Greeting */}
        <div style={{ textAlign: "center", marginBottom: 20 }}>
          <p style={{ fontSize: 20, color: G.text }}>أهلاً بك</p>
          <h1 style={{ fontSize: 26, fontWeight: 900, color: G.green, marginBottom: 6 }}>كيف تحب تترك أثرك اليوم؟</h1>
          <p style={{ fontSize: 13, color: G.textMuted }}>تطبيق يربطك بالعطاء الحقيقي في مجتمعنا</p>
        </div>

        {/* Quick Actions */}
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12, marginBottom: 24 }}>
          {quickActions.map((a, i) => (
            <div key={i} onClick={() => setPage(a.page)} className="card-hover btn-press" style={{
              background: a.color, borderRadius: 20, padding: "18px 14px", cursor: "pointer",
              border: `2px solid ${a.border}`, animation: `fadeUp 0.5s ease ${i * 0.1}s both`,
              boxShadow: "0 2px 12px rgba(45,106,79,0.08)"
            }}>
              <div style={{ fontSize: 28, marginBottom: 8 }}>{a.icon}</div>
              <div style={{ fontWeight: 800, fontSize: 15, color: G.text, marginBottom: 2 }}>{a.label}</div>
              {a.sublabel && <div style={{ fontSize: 11, color: G.textMuted }}>{a.sublabel}</div>}
            </div>
          ))}
        </div>
      </div>

      {/* Impact banner */}
      <div style={{ margin: "0 20px 20px" }}>
        <div style={{
          background: `linear-gradient(135deg, ${G.green}, ${G.greenMid})`,
          borderRadius: 20, padding: "20px 20px",
          boxShadow: `0 8px 24px rgba(45,106,79,0.3)`,
          animation: "glow 3s infinite"
        }}>
          <p style={{ color: "rgba(255,255,255,0.85)", fontSize: 13, marginBottom: 4 }}>🌿 بفضل دعمكم</p>
          <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
            <div>
              <span style={{ color: "#fff", fontSize: 32, fontWeight: 900 }}>120</span>
              <span style={{ color: "rgba(255,255,255,0.85)", fontSize: 14 }}> مبادرة دُعمت حتى الآن</span>
            </div>
            <div style={{ fontSize: 32 }}>›</div>
          </div>
          {/* dots */}
          <div style={{ display: "flex", gap: 6, marginTop: 14 }}>
            {[1,0,0].map((a,i) => <div key={i} style={{ width: a ? 20 : 8, height: 8, borderRadius: 4, background: a ? "#fff" : "rgba(255,255,255,0.4)" }} />)}
          </div>
        </div>
      </div>

      {/* Nearby initiatives */}
      <div style={{ padding: "0 20px" }}>
        <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 16 }}>
          <h2 style={{ fontSize: 17, fontWeight: 800, color: G.text }}>🌿 مبادرات قريبة منك</h2>
          <span onClick={() => setPage("impact")} style={{ color: G.green, fontSize: 13, fontWeight: 700, cursor: "pointer" }}>شاهد أكثر ›</span>
        </div>
        <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
          {nearbyInitiatives.map((init, i) => (
            <InitiativeCard key={init.id} initiative={init} index={i} />
          ))}
        </div>
      </div>

      {/* Stats row */}
      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: 10, margin: "20px 20px 0" }}>
        {[
          { icon: "🌿", val: "1,240", label: "صانع أثر" },
          { icon: "💚", val: "320", label: "مستفيد" },
          { icon: "⭐", val: "98%", label: "رضا المستفيدين" },
        ].map((s, i) => (
          <div key={i} style={{ background: "#fff", borderRadius: 16, padding: "16px 10px", textAlign: "center", boxShadow: G.shadow, animation: `fadeUp 0.5s ease ${i * 0.15}s both` }}>
            <div style={{ fontSize: 24, marginBottom: 4 }}>{s.icon}</div>
            <div style={{ fontSize: 18, fontWeight: 900, color: G.green }}>{s.val}</div>
            <div style={{ fontSize: 11, color: G.textMuted }}>{s.label}</div>
          </div>
        ))}
      </div>
    </div>
  );
}

// ═══════════════════════════════════════════════
//  INITIATIVE CARD
// ═══════════════════════════════════════════════
function InitiativeCard({ initiative: init, index }) {
  const { support, supportedIds, showToast } = useApp();
  const pct = Math.round((init.current / init.target) * 100);
  const isSupported = supportedIds.includes(init.id);

  return (
    <div className="card-hover" style={{
      background: "#fff", borderRadius: 20, overflow: "hidden",
      boxShadow: G.shadow, animation: `fadeUp 0.5s ease ${index * 0.15}s both`
    }}>
      <div style={{ display: "flex", gap: 0 }}>
        <div style={{ width: 100, background: `linear-gradient(135deg, ${G.greenUltra}, ${G.greenPale})`, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 52 }}>
          {init.emoji}
        </div>
        <div style={{ flex: 1, padding: "16px 14px" }}>
          <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 6 }}>
            <h3 style={{ fontSize: 15, fontWeight: 800, color: G.text }}>{init.title}</h3>
            <span className="tag" style={{ background: G.greenUltra, color: G.green, fontSize: 10 }}>{init.type}</span>
          </div>
          <p style={{ fontSize: 12, color: G.textMuted, marginBottom: 10, lineHeight: 1.5 }}>{init.desc}</p>
          <div style={{ marginBottom: 10 }}>
            <div style={{ height: 6, background: G.greenPale, borderRadius: 6, overflow: "hidden" }}>
              <div style={{
                height: "100%", background: `linear-gradient(90deg, ${G.greenLight}, ${G.green})`,
                borderRadius: 6, width: `${pct}%`,
                animation: "progressFill 1.5s ease",
                "--target-width": `${pct}%`
              }} />
            </div>
            <div style={{ display: "flex", justifyContent: "space-between", marginTop: 4, fontSize: 11, color: G.textMuted }}>
              <span>{init.current.toLocaleString()} من {init.target.toLocaleString()}</span>
              <span style={{ color: G.green, fontWeight: 700 }}>{pct}%</span>
            </div>
          </div>
          <div style={{ display: "flex", gap: 8 }}>
            <button onClick={() => support(init.id)} className="btn-press" style={{
              flex: 1, padding: "10px", borderRadius: 50,
              background: isSupported ? G.greenPale : `linear-gradient(135deg, ${G.green}, ${G.greenMid})`,
              border: "none", color: isSupported ? G.green : "#fff", fontSize: 13, fontWeight: 700,
              transition: "all 0.3s"
            }}>
              {isSupported ? "✅ تم الدعم" : "اترك أثراً"}
            </button>
            <button style={{ width: 40, height: 40, borderRadius: "50%", background: G.greenUltra, border: `1px solid ${G.greenPale}`, fontSize: 16 }}>
              👥 {init.supporters}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

// ═══════════════════════════════════════════════
//  SUBMIT ATHAR SCREEN
// ═══════════════════════════════════════════════
function SubmitAtharScreen() {
  const { showToast } = useApp();
  const [step, setStep] = useState(1);
  const [selectedCategory, setSelectedCategory] = useState(null);
  const [selectedType, setSelectedType] = useState(null);
  const [form, setForm] = useState({ title: "", desc: "", time: "", skills: "" });
  const [submitted, setSubmitted] = useState(false);

  const categories = [
    { id: "business", label: "رائدات الأعمال", emoji: "👩‍💼", color: "#e8f5e9", desc: "دعم مسارع المبادرات نحو النجاح" },
    { id: "families", label: "الأسر المنتجة", emoji: "🧺", color: "#fff8e1", desc: "مساعدة الأسر في كسب الرزق الكريم" },
    { id: "orphans", label: "الأيتام", emoji: "👦", color: "#e3f2fd", desc: "رعاية وتعليم الأيتام المستقبل" },
  ];

  const submitFinal = () => {
    if (!form.title) { showToast("يرجى إدخال عنوان الأثر", "error"); return; }
    setSubmitted(true);
    showToast("تم تقديم أثرك بنجاح! جزاك الله خيراً 🌿");
  };

  if (submitted) return (
    <div style={{ minHeight: "100vh", background: G.sand, display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", padding: 32, direction: "rtl", fontFamily: "'Tajawal', sans-serif", textAlign: "center" }}>
      <div style={{ fontSize: 80, marginBottom: 20, animation: "bounce 1s 3" }}>🎉</div>
      <h1 style={{ fontSize: 28, fontWeight: 900, color: G.green, marginBottom: 10 }}>تم تقديم أثرك!</h1>
      <p style={{ color: G.textLight, fontSize: 15, marginBottom: 30, lineHeight: 1.7 }}>
        أثرك في طريقه ليُحدث تغييراً حقيقياً.<br />جزاك الله خيراً على عطائك.
      </p>
      <div style={{ background: "#fff", borderRadius: 20, padding: 24, marginBottom: 24, boxShadow: G.shadow, width: "100%", maxWidth: 360 }}>
        <div style={{ display: "flex", justifyContent: "space-around" }}>
          {[{ icon: "✨", val: "+1", label: "أثر جديد" }, { icon: "🌿", val: "مراجعة", label: "الحالة" }, { icon: "💚", val: "قريباً", label: "التواصل" }].map((s, i) => (
            <div key={i} style={{ textAlign: "center" }}>
              <div style={{ fontSize: 28 }}>{s.icon}</div>
              <div style={{ fontWeight: 800, color: G.green, fontSize: 16 }}>{s.val}</div>
              <div style={{ fontSize: 11, color: G.textMuted }}>{s.label}</div>
            </div>
          ))}
        </div>
      </div>
      <button onClick={() => { setSubmitted(false); setStep(1); setSelectedCategory(null); setSelectedType(null); setForm({ title: "", desc: "", time: "", skills: "" }); }} className="btn-press" style={{ padding: "14px 40px", borderRadius: 50, background: `linear-gradient(135deg, ${G.green}, ${G.greenMid})`, border: "none", color: "#fff", fontSize: 16, fontWeight: 800, boxShadow: `0 6px 20px rgba(45,106,79,0.3)` }}>
        قدّم أثراً آخر
      </button>
    </div>
  );

  return (
    <div style={{ minHeight: "100vh", background: G.sand, direction: "rtl", fontFamily: "'Tajawal', sans-serif", paddingBottom: 100 }}>
      {/* Header */}
      <div style={{ background: `linear-gradient(135deg, ${G.green}, ${G.greenMid})`, padding: "40px 24px 30px", textAlign: "center", borderRadius: "0 0 36px 36px" }}>
        <h1 style={{ fontFamily: "'Amiri', serif", fontSize: 36, color: "#fff", marginBottom: 6 }}>قدّم أثراً</h1>
        <p style={{ color: "rgba(255,255,255,0.85)", fontSize: 14 }}>خطوة بسيطة أثرها جميل</p>
        {/* Steps indicator */}
        <div style={{ display: "flex", alignItems: "center", justifyContent: "center", gap: 8, marginTop: 20 }}>
          {[1, 2, 3].map(s => (
            <>
              <div key={s} style={{ width: step >= s ? 28 : 10, height: 10, borderRadius: 5, background: step >= s ? "#fff" : "rgba(255,255,255,0.4)", transition: "all 0.4s" }} />
            </>
          ))}
        </div>
      </div>

      <div style={{ padding: "24px 20px" }}>
        {/* Step 1: Choose category */}
        {step === 1 && (
          <div style={{ animation: "fadeUp 0.4s ease" }}>
            <h2 style={{ fontSize: 18, fontWeight: 800, color: G.text, marginBottom: 6 }}>اختر الفئة التي تريد أن تترك فيها أثرك اليوم</h2>
            <p style={{ color: G.textMuted, fontSize: 13, marginBottom: 20 }}>يمكنك دعم أكثر من فئة في رحلتك</p>
            <div style={{ display: "flex", flexDirection: "column", gap: 14 }}>
              {categories.map((cat, i) => (
                <div key={cat.id} onClick={() => { setSelectedCategory(cat.id); setStep(2); }} className="card-hover btn-press" style={{
                  background: selectedCategory === cat.id ? `linear-gradient(135deg, ${G.greenPale}, ${G.greenUltra})` : "#fff",
                  borderRadius: 20, padding: "20px 18px", cursor: "pointer",
                  border: `2px solid ${selectedCategory === cat.id ? G.green : G.greenPale}`,
                  boxShadow: G.shadow, display: "flex", alignItems: "center", gap: 16,
                  animation: `fadeUp 0.5s ease ${i * 0.1}s both`
                }}>
                  <div style={{ width: 60, height: 60, borderRadius: 16, background: cat.color, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 32, flexShrink: 0 }}>{cat.emoji}</div>
                  <div style={{ flex: 1 }}>
                    <h3 style={{ fontSize: 17, fontWeight: 800, color: G.green, marginBottom: 4 }}>{cat.label}</h3>
                    <p style={{ fontSize: 12, color: G.textMuted }}>{cat.desc}</p>
                  </div>
                  <button style={{ background: `linear-gradient(135deg, ${G.green}, ${G.greenMid})`, border: "none", color: "#fff", padding: "8px 16px", borderRadius: 50, fontSize: 12, fontWeight: 700 }}>اختر المسار</button>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Step 2: Choose type */}
        {step === 2 && (
          <div style={{ animation: "fadeUp 0.4s ease" }}>
            <button onClick={() => setStep(1)} style={{ background: "none", border: "none", color: G.green, fontWeight: 700, fontSize: 14, marginBottom: 16, display: "flex", alignItems: "center", gap: 6 }}>← رجوع</button>
            <h2 style={{ fontSize: 18, fontWeight: 800, color: G.text, marginBottom: 6 }}>كيف تحب أن تدعم اليوم؟</h2>
            <div style={{ display: "flex", gap: 10, marginBottom: 20, flexWrap: "wrap" }}>
              {["وقت ومشاركة", "الأسر المنتجة", "رائدات الأعمال"].map(tag => (
                <span key={tag} className="tag" style={{ background: G.greenUltra, color: G.green, border: `1px solid ${G.greenPale}`, cursor: "pointer" }}>{tag}</span>
              ))}
            </div>
            <div style={{ display: "flex", flexDirection: "column", gap: 14 }}>
              {ATHAR_TYPES.map((type, i) => (
                <div key={type.id} onClick={() => { setSelectedType(type.id); setStep(3); }} className="card-hover btn-press" style={{
                  background: selectedType === type.id ? `linear-gradient(135deg, ${G.green}, ${G.greenMid})` : "#fff",
                  borderRadius: 20, padding: "20px 18px", cursor: "pointer",
                  border: `2px solid ${selectedType === type.id ? G.green : G.greenPale}`,
                  boxShadow: G.shadow, display: "flex", alignItems: "center", gap: 14,
                  animation: `fadeUp 0.4s ease ${i * 0.1}s both`
                }}>
                  <div style={{ width: 56, height: 56, borderRadius: 14, background: selectedType === type.id ? "rgba(255,255,255,0.2)" : G.greenUltra, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 28, flexShrink: 0 }}>{type.emoji}</div>
                  <div style={{ flex: 1 }}>
                    <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 4 }}>
                      <h3 style={{ fontSize: 16, fontWeight: 800, color: selectedType === type.id ? "#fff" : G.text }}>{type.title}</h3>
                      <input type="checkbox" checked={selectedType === type.id} readOnly style={{ accentColor: G.green }} />
                    </div>
                    <p style={{ fontSize: 12, color: selectedType === type.id ? "rgba(255,255,255,0.85)" : G.textMuted, marginBottom: 8 }}>{type.desc}</p>
                    {type.features.map((f, j) => (
                      <div key={j} style={{ display: "flex", alignItems: "center", gap: 6, marginBottom: 3 }}>
                        <span style={{ color: selectedType === type.id ? "#a8e6cf" : G.greenLight, fontSize: 12 }}>✔</span>
                        <span style={{ fontSize: 12, color: selectedType === type.id ? "rgba(255,255,255,0.85)" : G.textLight }}>{f}</span>
                      </div>
                    ))}
                    <span className="tag" style={{ marginTop: 8, background: selectedType === type.id ? "rgba(255,255,255,0.2)" : G.greenPale, color: selectedType === type.id ? "#fff" : G.green, fontSize: 11 }}>{type.tag}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Step 3: Fill form */}
        {step === 3 && (
          <div style={{ animation: "fadeUp 0.4s ease" }}>
            <button onClick={() => setStep(2)} style={{ background: "none", border: "none", color: G.green, fontWeight: 700, fontSize: 14, marginBottom: 16, display: "flex", alignItems: "center", gap: 6 }}>← رجوع</button>
            <h2 style={{ fontSize: 18, fontWeight: 800, color: G.text, marginBottom: 20 }}>أخبرنا عن أثرك</h2>
            <div style={{ background: "#fff", borderRadius: 20, padding: 22, boxShadow: G.shadow, display: "flex", flexDirection: "column", gap: 18 }}>
              {[
                { label: "عنوان الأثر", key: "title", placeholder: "مثال: جلسة توجيه لرائدة أعمال", multiline: false },
                { label: "وصف الأثر", key: "desc", placeholder: "اشرح كيف ستساهم وما الذي يمكنك تقديمه...", multiline: true },
                { label: "الوقت المتاح", key: "time", placeholder: "مثال: ساعتان أسبوعياً", multiline: false },
                { label: "المهارات التي ستقدمها", key: "skills", placeholder: "مثال: تصميم، تصوير، تسويق، إرشاد...", multiline: false },
              ].map((field) => (
                <div key={field.key}>
                  <label style={{ fontSize: 13, color: G.green, fontWeight: 700, marginBottom: 8, display: "block" }}>{field.label}</label>
                  {field.multiline ? (
                    <textarea value={form[field.key]} onChange={e => setForm({ ...form, [field.key]: e.target.value })} placeholder={field.placeholder} rows={3} style={{ width: "100%", padding: "14px 16px", borderRadius: 14, border: `2px solid ${G.greenPale}`, fontSize: 14, background: G.greenUltra, resize: "none", lineHeight: 1.6, fontFamily: "'Tajawal', sans-serif" }} />
                  ) : (
                    <input value={form[field.key]} onChange={e => setForm({ ...form, [field.key]: e.target.value })} placeholder={field.placeholder} style={{ width: "100%", padding: "14px 16px", borderRadius: 14, border: `2px solid ${G.greenPale}`, fontSize: 14, background: G.greenUltra }} />
                  )}
                </div>
              ))}
              <button onClick={submitFinal} className="btn-press" style={{
                width: "100%", padding: "16px", borderRadius: 50,
                background: `linear-gradient(135deg, ${G.green}, ${G.greenMid})`,
                border: "none", color: "#fff", fontSize: 16, fontWeight: 800,
                boxShadow: `0 6px 20px rgba(45,106,79,0.35)`
              }}>
                اترك أثرك الآن 🌿
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

// ═══════════════════════════════════════════════
//  REQUESTS SCREEN
// ═══════════════════════════════════════════════
function RequestsScreen() {
  const { support, supportedIds, showToast } = useApp();
  const [activeFilter, setActiveFilter] = useState("الكل");
  const filters = ["الكل", "فكرة", "وقت", "مهارة", "دعم مالي"];

  const filtered = activeFilter === "الكل" ? REQUESTS : REQUESTS.filter(r => r.category.includes(activeFilter) || r.type.includes(activeFilter));

  return (
    <div style={{ minHeight: "100vh", background: `linear-gradient(180deg, ${G.greenUltra} 0%, ${G.sand} 100%)`, direction: "rtl", fontFamily: "'Tajawal', sans-serif", paddingBottom: 100 }}>
      {/* Header */}
      <div style={{ background: `linear-gradient(135deg, ${G.green}, ${G.greenMid})`, padding: "44px 24px 28px", borderRadius: "0 0 32px 32px", textAlign: "center" }}>
        <AtharLogo size={34} />
        <h1 style={{ color: "#fff", fontSize: 22, fontWeight: 800, marginTop: 10, marginBottom: 4 }}>الطلبات</h1>
        <div style={{ position: "absolute", top: 16, left: 16 }}>
          <div style={{ position: "relative" }}>
            <button style={{ background: "rgba(255,255,255,0.15)", border: "none", color: "#fff", width: 36, height: 36, borderRadius: "50%", fontSize: 18 }}>🔔</button>
            <div style={{ position: "absolute", top: -3, left: -3, width: 14, height: 14, background: "#ef5350", borderRadius: "50%", fontSize: 8, display: "flex", alignItems: "center", justifyContent: "center", color: "#fff", fontWeight: 700 }}>3</div>
          </div>
        </div>
      </div>

      {/* Filters */}
      <div style={{ padding: "16px 20px 0", display: "flex", gap: 10, overflowX: "auto", paddingBottom: 4 }}>
        {filters.map(f => (
          <button key={f} onClick={() => setActiveFilter(f)} className="btn-press" style={{
            padding: "8px 18px", borderRadius: 50, whiteSpace: "nowrap", flexShrink: 0,
            border: `2px solid ${activeFilter === f ? G.green : G.greenPale}`,
            background: activeFilter === f ? G.green : "#fff",
            color: activeFilter === f ? "#fff" : G.text, fontSize: 13, fontWeight: 700,
            transition: "all 0.3s"
          }}>
            {f}
          </button>
        ))}
      </div>

      {/* Requests list */}
      <div style={{ padding: "16px 20px", display: "flex", flexDirection: "column", gap: 16 }}>
        {filtered.map((req, i) => {
          const isSupported = supportedIds.includes(req.id);
          return (
            <div key={req.id} className="card-hover" style={{
              background: "#fff", borderRadius: 20, overflow: "hidden",
              boxShadow: G.shadow, animation: `fadeUp 0.5s ease ${i * 0.1}s both`
            }}>
              <div style={{ display: "flex", alignItems: "flex-start", gap: 0 }}>
                <div style={{ width: 90, background: req.color, display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", padding: "20px 10px", gap: 6 }}>
                  <span style={{ fontSize: 36 }}>{req.img}</span>
                  <span style={{ fontSize: 20 }}>{req.badge}</span>
                </div>
                <div style={{ flex: 1, padding: "16px 14px" }}>
                  <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 4 }}>
                    <span className="tag" style={{ background: G.greenUltra, color: G.green, fontSize: 11 }}>💡 {req.category}</span>
                    <span style={{ color: G.textMuted, fontSize: 11 }}>{req.time}</span>
                  </div>
                  <h3 style={{ fontSize: 15, fontWeight: 800, color: G.text, marginBottom: 4 }}>{req.name}</h3>
                  <p style={{ fontSize: 12, color: G.textLight, lineHeight: 1.6, marginBottom: 10 }}>{req.desc}</p>
                  <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
                    <span style={{ color: G.textMuted, fontSize: 12 }}>📍 {req.city}</span>
                    <button onClick={() => support(req.id)} className="btn-press" style={{
                      padding: "9px 20px", borderRadius: 50,
                      background: isSupported ? G.greenPale : `linear-gradient(135deg, ${G.green}, ${G.greenMid})`,
                      border: "none", color: isSupported ? G.green : "#fff",
                      fontSize: 13, fontWeight: 700, transition: "all 0.3s"
                    }}>
                      {isSupported ? "✅ قدّمت دعم" : "قدّم دعماً"}
                    </button>
                  </div>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}

// ═══════════════════════════════════════════════
//  IMPACT SCREEN
// ═══════════════════════════════════════════════
function ImpactScreen() {
  const { support, supportedIds } = useApp();
  const [activeTab, setActiveTab] = useState("initiatives");

  const tabs = [
    { key: "initiatives", label: "المبادرات" },
    { key: "stories", label: "قصص الأثر" },
    { key: "roles", label: "أدوار المستخدمين" },
  ];

  const stories = [
    { name: "سارة العتيبي", story: "بعد انضمامي لأثر، حصلت على استشارات تسويقية غيّرت مسار مشروعي تماماً. الآن مبيعاتي ضاعفت 3 مرات!", emoji: "👩‍💼", tag: "رائدة أعمال", city: "جدة" },
    { name: "أم خالد", story: "الأسرة كانت تحتاج دعماً. أثر ربطنا بمتطوعة علّمتنا التصوير الاحترافي. الآن ننشر منتجاتنا يومياً.", emoji: "👩‍🍳", tag: "أسرة منتجة", city: "الرياض" },
    { name: "أحمد - 14 سنة", story: "دخلت لبرنامج الإرشاد وقابلت معلماً متطوعاً ساعدني في فهم الرياضيات. نجحت في امتحاناتي!", emoji: "👦", tag: "يتيم", city: "الخبر" },
  ];

  return (
    <div style={{ minHeight: "100vh", background: `linear-gradient(180deg, ${G.greenUltra} 0%, ${G.sand} 100%)`, direction: "rtl", fontFamily: "'Tajawal', sans-serif", paddingBottom: 100 }}>
      {/* Header */}
      <div style={{ background: `linear-gradient(135deg, ${G.green}, ${G.greenMid})`, padding: "44px 24px 24px", borderRadius: "0 0 32px 32px", textAlign: "center" }}>
        <AtharLogo size={34} />
        <h1 style={{ color: "#fff", fontSize: 22, fontWeight: 800, marginTop: 10 }}>صفحة الأثر ✨</h1>
      </div>

      {/* Tabs */}
      <div style={{ display: "flex", gap: 8, padding: "16px 20px 0", overflowX: "auto" }}>
        {tabs.map(tab => (
          <button key={tab.key} onClick={() => setActiveTab(tab.key)} style={{
            padding: "10px 20px", borderRadius: 50, whiteSpace: "nowrap", flexShrink: 0,
            border: `2px solid ${activeTab === tab.key ? G.green : G.greenPale}`,
            background: activeTab === tab.key ? G.green : "#fff",
            color: activeTab === tab.key ? "#fff" : G.text, fontSize: 13, fontWeight: 700, transition: "all 0.3s"
          }}>{tab.label}</button>
        ))}
      </div>

      <div style={{ padding: "16px 20px" }}>
        {activeTab === "initiatives" && (
          <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
            {INITIATIVES.map((init, i) => <InitiativeCard key={init.id} initiative={init} index={i} />)}
          </div>
        )}

        {activeTab === "stories" && (
          <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
            {stories.map((s, i) => (
              <div key={i} className="card-hover" style={{
                background: "#fff", borderRadius: 20, padding: 22, boxShadow: G.shadow,
                animation: `fadeUp 0.5s ease ${i * 0.15}s both`
              }}>
                <div style={{ display: "flex", alignItems: "center", gap: 12, marginBottom: 14 }}>
                  <div style={{ width: 52, height: 52, borderRadius: "50%", background: G.greenUltra, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 28 }}>{s.emoji}</div>
                  <div>
                    <h3 style={{ fontSize: 15, fontWeight: 800, color: G.text }}>{s.name}</h3>
                    <div style={{ display: "flex", gap: 8 }}>
                      <span className="tag" style={{ background: G.greenUltra, color: G.green, fontSize: 10 }}>{s.tag}</span>
                      <span style={{ color: G.textMuted, fontSize: 11 }}>📍 {s.city}</span>
                    </div>
                  </div>
                </div>
                <div style={{ position: "relative", padding: "14px 16px", background: G.greenUltra, borderRadius: 14, borderRight: `4px solid ${G.green}` }}>
                  <span style={{ position: "absolute", top: -8, right: 12, fontSize: 28, color: G.greenPale }}>❝</span>
                  <p style={{ fontSize: 14, color: G.textLight, lineHeight: 1.7 }}>{s.story}</p>
                </div>
              </div>
            ))}
          </div>
        )}

        {activeTab === "roles" && (
          <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
            <div style={{ background: "#fff", borderRadius: 20, padding: 22, boxShadow: G.shadow, textAlign: "center", marginBottom: 8 }}>
              <h2 style={{ fontSize: 20, fontWeight: 900, color: G.green, marginBottom: 6 }}>أدوار المستخدمين في أثر</h2>
              <p style={{ color: G.textMuted, fontSize: 13 }}>كل شخص له دور في بناء الأثر المستدام</p>
            </div>
            {/* Flow diagram */}
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 14 }}>
              {[
                { emoji: "🌿", title: "صانع الأثر", sub: "المستخدم المساهم", desc: "شارك وقتك ومهارتك", num: "1" },
                { emoji: "🌱", title: "المستفيد", sub: "رائدة / أسرة / يتيم", desc: "احصل على الدعم الذي تحتاجه", num: "2" },
                { emoji: "GREEN_SHIELD", title: "مدير المنصة", sub: "دور المشرف", desc: "وافق على الطلبات وتحقق", num: "3" },
                { emoji: "🏛️", title: "الجهة الراعية", sub: "جمعية / مؤسسة", desc: "وثّق وتحقق من الأثر", num: "4" },
              ].map((role, i) => (
                <div key={i} className="card-hover" style={{ background: "#fff", borderRadius: 18, padding: 18, textAlign: "center", boxShadow: G.shadow, border: `2px solid ${G.greenPale}`, animation: `scaleIn 0.5s ease ${i * 0.1}s both` }}>
                  <div style={{ width: 36, height: 36, borderRadius: "50%", background: `linear-gradient(135deg, ${G.green}, ${G.greenMid})`, color: "#fff", fontWeight: 900, fontSize: 16, display: "flex", alignItems: "center", justifyContent: "center", margin: "0 auto 10px" }}>{role.num}</div>
                  <div style={{ fontSize: 36, marginBottom: 8, display: "flex", justifyContent: "center" }}>
                    {role.emoji === "GREEN_SHIELD" ? <GreenShield size={40}/> : role.emoji}
                  </div>
                  <h3 style={{ fontSize: 14, fontWeight: 800, color: G.green, marginBottom: 3 }}>{role.title}</h3>
                  <p style={{ fontSize: 11, color: G.textMuted, marginBottom: 6 }}>{role.sub}</p>
                  <p style={{ fontSize: 12, color: G.textLight }}>{role.desc}</p>
                  <button style={{ marginTop: 10, padding: "8px 16px", borderRadius: 50, background: `linear-gradient(135deg, ${G.green}, ${G.greenMid})`, border: "none", color: "#fff", fontSize: 11, fontWeight: 700 }}>اختر هذا المسار</button>
                </div>
              ))}
            </div>
            {/* Sustainable impact */}
            <div style={{ background: `linear-gradient(135deg, ${G.green}, ${G.greenMid})`, borderRadius: 20, padding: 20, color: "#fff" }}>
              <h3 style={{ fontWeight: 800, marginBottom: 12, textAlign: "center" }}>خريطة الأثر المستدام</h3>
              <div style={{ display: "flex", alignItems: "center", justifyContent: "center", gap: 6, flexWrap: "wrap" }}>
                {["🏛️ الجهة الراعية", "→ قدّم →", "👥 حدث التقدم", "→", "💚 الأثر"].map((item, i) => (
                  <span key={i} style={{ fontSize: 12, background: "rgba(255,255,255,0.15)", padding: "6px 12px", borderRadius: 20 }}>{item}</span>
                ))}
              </div>
              <div style={{ textAlign: "center", marginTop: 12, fontSize: 13, opacity: 0.85 }}>← دورة الأثر المستدام →</div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

// ═══════════════════════════════════════════════
//  PROFILE SCREEN
// ═══════════════════════════════════════════════
function ProfileScreen({ setScreen }) {
  const { user, setUser, showToast, supportedIds, setScreen: setAppScreen } = useApp();
  const [editing, setEditing] = useState(false);
  const [form, setForm] = useState({ name: user?.name || "", email: user?.email || "", phone: user?.phone || "" });
  const [activeSection, setActiveSection] = useState("main");

  const save = () => {
    setUser({ ...user, ...form });
    setEditing(false);
    showToast("تم حفظ التغييرات بنجاح ✅");
  };

  const logout = () => {
    setAppScreen("splash");
    setUser(null);
  };

  const stats = [
    { icon: "🌿", val: supportedIds.length, label: "أثر قدّمته" },
    { icon: "⏰", val: user?.volunteered || 0, label: "ساعة تطوع" },
    { icon: "💚", val: user?.athar || 0, label: "نقطة أثر" },
    { icon: "⭐", val: "جديد", label: "مستوى التأثير" },
  ];

  const menuItems = [
    { icon: "🌿", label: "أثري ومساهماتي", action: () => {} },
    { icon: "🔔", label: "الإشعارات", action: () => {} },
    { icon: "🛡️", label: "الخصوصية والأمان", action: () => setActiveSection("privacy") },
    { icon: "❓", label: "المساعدة والدعم", action: () => {} },
    { icon: "ℹ️", label: "عن تطبيق أثر", action: () => {} },
  ];

  if (activeSection === "privacy") return <PrivacyScreen onBack={() => setActiveSection("main")} />;

  return (
    <div style={{ minHeight: "100vh", background: G.sand, direction: "rtl", fontFamily: "'Tajawal', sans-serif", paddingBottom: 100 }}>
      {/* Profile Header */}
      <div style={{ background: `linear-gradient(160deg, ${G.green} 0%, ${G.greenMid} 100%)`, padding: "44px 24px 36px", textAlign: "center", position: "relative", borderRadius: "0 0 40px 40px", overflow: "hidden" }}>
        <div style={{ position: "absolute", inset: 0, backgroundImage: "radial-gradient(circle at 20% 50%, rgba(255,255,255,0.06) 0%, transparent 60%)" }} />
        <div style={{ width: 90, height: 90, borderRadius: "50%", background: "rgba(255,255,255,0.2)", border: "3px solid rgba(255,255,255,0.5)", display: "flex", alignItems: "center", justifyContent: "center", margin: "0 auto 14px", backdropFilter: "blur(10px)" }}>
          <AtharLogo size={58} showText={false} light={true} />
        </div>
        {editing ? (
          <div style={{ display: "flex", flexDirection: "column", gap: 10, alignItems: "center" }}>
            <input value={form.name} onChange={e => setForm({ ...form, name: e.target.value })} style={{ padding: "10px 16px", borderRadius: 14, border: "none", fontSize: 16, fontWeight: 700, background: "rgba(255,255,255,0.2)", color: "#fff", textAlign: "center", width: "80%" }} />
            <input value={form.email} onChange={e => setForm({ ...form, email: e.target.value })} style={{ padding: "10px 16px", borderRadius: 14, border: "none", fontSize: 13, background: "rgba(255,255,255,0.15)", color: "#fff", textAlign: "center", width: "80%", direction: "ltr" }} />
            <div style={{ display: "flex", gap: 10 }}>
              <button onClick={save} style={{ padding: "10px 24px", borderRadius: 50, background: "#fff", border: "none", color: G.green, fontWeight: 800, fontSize: 14 }}>حفظ</button>
              <button onClick={() => setEditing(false)} style={{ padding: "10px 24px", borderRadius: 50, background: "rgba(255,255,255,0.2)", border: "none", color: "#fff", fontSize: 14 }}>إلغاء</button>
            </div>
          </div>
        ) : (
          <>
            <h1 style={{ color: "#fff", fontSize: 22, fontWeight: 800, marginBottom: 4 }}>{user?.name}</h1>
            <p style={{ color: "rgba(255,255,255,0.8)", fontSize: 13, marginBottom: 4 }}>{user?.email}</p>
            <span className="tag" style={{ background: "rgba(255,255,255,0.2)", color: "#fff", border: "none" }}>
              {ROLES.find(r => r.id === user?.role)?.title || "صانع الأثر"} • عضو منذ {user?.joined}
            </span>
            <button onClick={() => setEditing(true)} style={{ display: "block", margin: "14px auto 0", padding: "8px 22px", borderRadius: 50, background: "rgba(255,255,255,0.2)", border: "1px solid rgba(255,255,255,0.4)", color: "#fff", fontSize: 13, fontWeight: 700 }}>
              ✏️ تعديل الملف الشخصي
            </button>
          </>
        )}
      </div>

      {/* Stats */}
      <div style={{ display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gap: 8, padding: "20px 16px 0" }}>
        {stats.map((s, i) => (
          <div key={i} style={{ background: "#fff", borderRadius: 14, padding: "12px 8px", textAlign: "center", boxShadow: G.shadow, animation: `fadeUp 0.5s ease ${i * 0.1}s both` }}>
            <div style={{ fontSize: 20 }}>{s.icon}</div>
            <div style={{ fontSize: 18, fontWeight: 900, color: G.green }}>{s.val}</div>
            <div style={{ fontSize: 9, color: G.textMuted, lineHeight: 1.3 }}>{s.label}</div>
          </div>
        ))}
      </div>

      {/* Athar progress */}
      <div style={{ margin: "16px 16px 0", background: `linear-gradient(135deg, ${G.greenUltra}, #fff)`, borderRadius: 20, padding: 20, border: `2px solid ${G.greenPale}`, boxShadow: G.shadow }}>
        <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 10 }}>
          <span style={{ fontWeight: 800, color: G.green }}>🌱 رحلة الأثر</span>
          <span style={{ color: G.textMuted, fontSize: 13 }}>{supportedIds.length} / 10 أثر</span>
        </div>
        <div style={{ height: 10, background: G.greenPale, borderRadius: 10, overflow: "hidden", marginBottom: 8 }}>
          <div style={{ height: "100%", width: `${Math.min((supportedIds.length / 10) * 100, 100)}%`, background: `linear-gradient(90deg, ${G.greenLight}, ${G.green})`, borderRadius: 10, transition: "width 1s ease" }} />
        </div>
        <p style={{ fontSize: 12, color: G.textMuted }}>اترك {Math.max(10 - supportedIds.length, 0)} أثراً أخرى لتنتقل للمستوى التالي</p>
      </div>

      {/* Menu */}
      <div style={{ margin: "16px 16px 0", background: "#fff", borderRadius: 20, overflow: "hidden", boxShadow: G.shadow }}>
        {menuItems.map((item, i) => (
          <div key={i} onClick={item.action} className="btn-press" style={{
            display: "flex", alignItems: "center", gap: 14, padding: "16px 20px",
            borderBottom: i < menuItems.length - 1 ? `1px solid ${G.greenPale}` : "none",
            cursor: "pointer", transition: "background 0.2s"
          }}
          onMouseEnter={e => e.currentTarget.style.background = G.greenUltra}
          onMouseLeave={e => e.currentTarget.style.background = "#fff"}>
            <span style={{ fontSize: 22 }}>{item.icon}</span>
            <span style={{ flex: 1, fontSize: 15, fontWeight: 600, color: G.text }}>{item.label}</span>
            <span style={{ color: G.textMuted, fontSize: 18 }}>›</span>
          </div>
        ))}
      </div>

      {/* Logout */}
      <div style={{ margin: "16px 16px 0" }}>
        <button onClick={logout} className="btn-press card-hover" style={{ width: "100%", padding: "16px", borderRadius: 20, background: "#fff5f5", border: "2px solid #ffcdd2", color: "#c62828", fontSize: 15, fontWeight: 800, boxShadow: G.shadow }}>
          🚪 تسجيل الخروج
        </button>
      </div>

      <div style={{ textAlign: "center", padding: "20px 0 8px", color: G.textMuted, fontSize: 12 }}>
        أثر v1.0 • مشروع تخرج • 2026 🌿
      </div>
    </div>
  );
}

// ═══════════════════════════════════════════════
//  MAIN APP (after login)
// ═══════════════════════════════════════════════
function MainApp() {
  const { setScreen } = useApp();
  const [page, setPage] = useState("home");

  const renderPage = () => {
    switch (page) {
      case "home": return <HomeScreen setPage={setPage} />;
      case "submit": return <SubmitAtharScreen />;
      case "requests": return <RequestsScreen />;
      case "impact": return <ImpactScreen />;
      case "profile": return <ProfileScreen setScreen={setScreen} />;
      default: return <HomeScreen setPage={setPage} />;
    }
  };

  return (
    <div style={{ position: "relative", maxWidth: 480, margin: "0 auto", minHeight: "100vh", background: G.sand }}>
      {renderPage()}
      <BottomNav active={page} setActive={setPage} />
    </div>
  );
}

// ═══════════════════════════════════════════════
//  ROOT
// ═══════════════════════════════════════════════
function AtharApp() {
  const { screen } = useApp();
  switch (screen) {
    case "splash": return <SplashScreen />;
    case "onboarding": return <OnboardingScreen />;
    case "login": return <LoginScreen />;
    case "main": return <MainApp />;
    default: return <SplashScreen />;
  }
}

export default function App() {
  return (
    <AppProvider>
      <div style={{ maxWidth: 480, margin: "0 auto", boxShadow: "0 0 60px rgba(0,0,0,0.15)", minHeight: "100vh" }}>
        <AtharApp />
      </div>
    </AppProvider>
  );
}

export default App;
