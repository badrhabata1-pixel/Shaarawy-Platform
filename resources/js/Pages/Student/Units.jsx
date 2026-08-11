import { Head } from '@inertiajs/react';
import { useMemo } from 'react';
import StudentLayout from '@/Layouts/StudentLayout';

<<<<<<< HEAD
const O  = '#0D9488';
const N  = '#14213D';
const G  = '#2DD4BF';
=======
const O  = '#F47C20';
const N  = '#14213D';
const G  = '#C9A14A';
>>>>>>> a7d621ecce9a27909d6163081c63c5e4d03bd594
const B  = '#DCC9A3';
const DK = '#050a16';

const ROMAN = [
    ['M', 1000], ['CM', 900], ['D', 500], ['CD', 400], ['C', 100], ['XC', 90],
    ['L', 50], ['XL', 40], ['X', 10], ['IX', 9], ['V', 5], ['IV', 4], ['I', 1],
];
function toRoman(num) {
    let n = num, out = '';
    for (const [sym, val] of ROMAN) {
        while (n >= val) { out += sym; n -= val; }
    }
    return out || 'I';
}

/* Deterministic starfield — generated once at module load (CSR only, no SSR) */
const STARS = Array.from({ length: 70 }, (_, i) => ({
    x: (i * 37 + (i % 7) * 13) % 100,
    y: (i * 53 + (i % 5) * 19) % 100,
    s: 1 + (i % 3),
    d: (i % 10) * 0.4,
    dur: 2.4 + (i % 5) * 0.6,
}));

export default function Units({ student, units }) {
    const unlockedCount = units.filter(u => u.is_unlocked).length;
    const inProgress    = units.filter(u => u.is_unlocked && u.completed_count > 0 && u.completed_count < u.lessons_count).length;
    const finished      = units.filter(u => u.is_unlocked && u.lessons_count > 0 && u.completed_count >= u.lessons_count).length;

    const starField = useMemo(() => STARS, []);

    return (
        <StudentLayout title="🌌 أطلس الوحدات">
            <Head title="الوحدات — منصة الصيفي" />

            <style>{`
                @keyframes twinkle       { 0%,100%{opacity:.15; transform:scale(1)} 50%{opacity:1; transform:scale(1.35)} }
                @keyframes atlasSpin     { from{transform:rotate(0deg)} to{transform:rotate(360deg)} }
                @keyframes atlasSpinRev  { from{transform:rotate(360deg)} to{transform:rotate(0deg)} }
                @keyframes portalRing    { from{transform:rotate(0deg)} to{transform:rotate(360deg)} }
                @keyframes nodeRise      { from{opacity:0; transform:translateY(30px) scale(.94)} to{opacity:1; transform:translateY(0) scale(1)} }
                @keyframes glowPulse     { 0%,100%{opacity:.5} 50%{opacity:1} }
                @keyframes shimmerSweep  { 0%{background-position:-200% 0} 100%{background-position:200% 0} }
                @keyframes driftSlow     { 0%,100%{transform:translateY(0)} 50%{transform:translateY(-6px)} }

                .portal-node { transition: transform .4s cubic-bezier(.22,1,.36,1); }
                .portal-node:hover { transform: translateY(-10px); }
                .portal-node:hover .portal-frame { border-color: rgba(201,161,74,.6) !important; box-shadow: 0 20px 55px rgba(0,0,0,.55), 0 0 40px rgba(244,124,32,.22) !important; }
                .portal-node:hover .portal-ring  { animation-duration: 5s !important; opacity: 1 !important; }
                .portal-node:hover .portal-img   { transform: scale(1.12) !important; filter: saturate(1.15) !important; }
                .portal-node:hover .sigil-btn::after { transform: translateX(180%) !important; }

                .atlas-grid {
                    display: grid;
                    grid-template-columns: repeat(auto-fill, minmax(272px, 1fr));
                    gap: 46px 26px;
                }
            `}</style>

            {/* ── Hero: Star Atlas / Time Gate ─────────────────────── */}
            <div style={{
                position: 'relative', overflow: 'hidden', textAlign: 'center',
                background: `radial-gradient(ellipse 70% 100% at 50% -10%, rgba(201,161,74,.18) 0%, transparent 55%), linear-gradient(175deg, ${DK} 0%, #0a1730 50%, #060c1c 100%)`,
                borderRadius: 28, padding: '3.4rem 2rem 2.8rem', marginBottom: '3.4rem',
                border: '1px solid rgba(201,161,74,.2)',
                boxShadow: `0 14px 60px rgba(0,0,0,.5), inset 0 1px 0 rgba(201,161,74,.14)`,
            }}>
                {/* Starfield */}
                <div style={{ position: 'absolute', inset: 0, pointerEvents: 'none' }}>
                    {starField.map((st, i) => (
                        <div key={i} style={{
                            position: 'absolute', left: `${st.x}%`, top: `${st.y}%`,
                            width: st.s, height: st.s, borderRadius: '50%',
                            background: i % 6 === 0 ? O : '#fff',
                            animation: `twinkle ${st.dur}s ${st.d}s ease-in-out infinite`,
                        }} />
                    ))}
                </div>

                {/* Astrolabe rings */}
                <div style={{ position: 'absolute', top: '50%', left: '50%', width: 620, height: 620, marginLeft: -310, marginTop: -360, pointerEvents: 'none', opacity: .35 }}>
                    <svg viewBox="0 0 200 200" style={{ width: '100%', height: '100%', animation: 'atlasSpin 90s linear infinite' }}>
                        <circle cx="100" cy="100" r="94" fill="none" stroke={G} strokeWidth="0.4" strokeDasharray="1 5" />
                        <circle cx="100" cy="100" r="80" fill="none" stroke={G} strokeWidth="0.3" opacity=".6" />
                    </svg>
                    <svg viewBox="0 0 200 200" style={{ width: '100%', height: '100%', position: 'absolute', inset: 0, animation: 'atlasSpinRev 70s linear infinite' }}>
                        <circle cx="100" cy="100" r="64" fill="none" stroke={O} strokeWidth="0.3" strokeDasharray="0.5 6" />
                    </svg>
                </div>

                <div style={{ position: 'relative' }}>
                    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 10, marginBottom: 16 }}>
                        <span style={{ width: 34, height: 1, background: `linear-gradient(90deg,transparent,${G})` }} />
                        <span style={{ color: G, fontSize: 11, fontWeight: 700, letterSpacing: '.34em', textTransform: 'uppercase', fontFamily: "'Cinzel', serif" }}>
                            ✦ بوابات المعرفة ✦
                        </span>
                        <span style={{ width: 34, height: 1, background: `linear-gradient(90deg,${G},transparent)` }} />
                    </div>

                    <h1 style={{
                        fontSize: 34, fontWeight: 900, margin: '0 0 12px', lineHeight: 1.25,
                        fontFamily: "'Cinzel', serif", letterSpacing: '.02em',
                        backgroundImage: `linear-gradient(90deg, ${B} 0%, #fff 35%, ${G} 60%, ${B} 100%)`,
                        backgroundSize: '200% auto',
                        WebkitBackgroundClip: 'text', backgroundClip: 'text', color: 'transparent',
                        animation: 'shimmerSweep 6s linear infinite',
                    }}>
                        🌌 أطلس الوحدات
                    </h1>
                    <p style={{ color: 'rgba(220,201,163,.65)', fontSize: 13, margin: '0 0 26px' }}>
                        {student.grade} — كل وحدة بوابة زمن قائمة بذاتها، اختر بوابتك وابدأ العبور
                    </p>

                    <div style={{ display: 'flex', gap: 12, justifyContent: 'center', flexWrap: 'wrap' }}>
                        <OrbitStat icon="📚" label="بوابة متاحة" value={units.length} />
                        <OrbitStat icon="🔓" label="مفتوحة" value={unlockedCount} accent={O} />
                        <OrbitStat icon="⏳" label="جارٍ العبور" value={inProgress} accent="#818cf8" />
                        <OrbitStat icon="🏆" label="مكتملة" value={finished} accent="#10b981" />
                    </div>
                </div>
            </div>

            {/* ── Atlas grid ───────────────────────────────────── */}
            {units.length === 0 ? (
                <EmptyState />
            ) : (
                <div className="atlas-grid">
                    {units.map((unit, i) => (
                        <PortalNode key={unit.id} unit={unit} index={i} roman={toRoman(i + 1)} />
                    ))}
                </div>
            )}
        </StudentLayout>
    );
}

/* ── Orbit stat chip ─────────────────────────────────────── */
function OrbitStat({ icon, label, value, accent = G }) {
    return (
        <div style={{
            position: 'relative',
            background: 'rgba(255,255,255,.04)', border: `1px solid ${accent}38`,
            borderRadius: 14, padding: '11px 20px', minWidth: 98,
            display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 3,
            animation: 'driftSlow 5s ease-in-out infinite',
        }}>
            <div style={{ position: 'absolute', top: -3, right: -3, width: 7, height: 7, borderRadius: '50%', background: accent, boxShadow: `0 0 10px ${accent}`, animation: 'glowPulse 2s ease-in-out infinite' }} />
            <span style={{ fontSize: 15 }}>{icon}</span>
            <div style={{ fontSize: 19, fontWeight: 900, color: '#fff', lineHeight: 1.2 }}>{value}</div>
            <div style={{ fontSize: 10, color: 'rgba(220,201,163,.55)', fontWeight: 600 }}>{label}</div>
        </div>
    );
}

/* ── Progress orbit ring — thin ring hugging the portal circle ──── */
function ProgressOrbit({ pct, size = 168 }) {
    const stroke = 3;
    const r = (size - stroke) / 2;
    const c = 2 * Math.PI * r;
    const offset = c - (pct / 100) * c;
    return (
        <svg width={size} height={size} style={{ position: 'absolute', inset: 0, transform: 'rotate(-90deg)', pointerEvents: 'none' }}>
            <circle cx={size / 2} cy={size / 2} r={r} fill="none" stroke="rgba(255,255,255,.08)" strokeWidth={stroke} />
            <circle
                cx={size / 2} cy={size / 2} r={r} fill="none"
                stroke={pct >= 100 ? '#10b981' : O} strokeWidth={stroke} strokeLinecap="round"
                strokeDasharray={c} strokeDashoffset={offset}
                style={{ transition: 'stroke-dashoffset .7s ease' }}
            />
        </svg>
    );
}

/* ── Portal node (unit) ──────────────────────────────────────── */
function PortalNode({ unit, index, roman }) {
    const pct = unit.lessons_count > 0 ? Math.round((unit.completed_count / unit.lessons_count) * 100) : 0;
    const size = 168;

    return (
        <div className="portal-node" style={{ animation: `nodeRise .55s ${index * 0.07}s both`, position: 'relative' }}>
            <div
                className="portal-frame"
                style={{
                    position: 'relative', borderRadius: 22, overflow: 'visible',
                    background: 'rgba(10,18,36,.72)', backdropFilter: 'blur(20px) saturate(1.6)',
                    border: '1px solid rgba(201,161,74,.22)',
                    boxShadow: '0 12px 36px rgba(0,0,0,.4)',
                    transition: 'border-color .35s, box-shadow .35s',
                    paddingTop: size / 2 + 26,
                }}
            >
                {/* Circular portal — floats above the card top edge */}
                <div style={{
                    position: 'absolute', top: -size / 2, left: '50%', transform: 'translateX(-50%)',
                    width: size, height: size,
                }}>
                    {/* Rotating conic swirl ring */}
                    <div className="portal-ring" style={{
                        position: 'absolute', inset: -6, borderRadius: '50%',
                        background: `conic-gradient(from 0deg, ${O}, ${G}, transparent 40%, ${O})`,
                        opacity: unit.is_unlocked ? .8 : .3,
                        animation: 'portalRing 8s linear infinite',
                        transition: 'opacity .3s, animation-duration .3s',
                    }} />
                    <div style={{ position: 'absolute', inset: 4, borderRadius: '50%', background: DK }} />

                    {/* Progress orbit */}
                    {unit.is_unlocked && unit.lessons_count > 0 && <ProgressOrbit pct={pct} size={size} />}

                    {/* Image disc */}
                    <div style={{
                        position: 'absolute', inset: 12, borderRadius: '50%', overflow: 'hidden',
                        background: `radial-gradient(circle at 35% 30%, #1c2f57, #060c1c)`,
                    }}>
                        {unit.image ? (
                            <img
                                className="portal-img"
                                src={unit.image.startsWith('/storage') ? unit.image : `/storage${unit.image.startsWith('/') ? '' : '/'}${unit.image}`}
                                alt={unit.title}
                                style={{
                                    width: '100%', height: '100%', objectFit: 'cover',
                                    filter: unit.is_unlocked ? 'none' : 'grayscale(.6) brightness(.45)',
                                    transition: 'transform .6s cubic-bezier(.22,1,.36,1), filter .4s',
                                }}
                            />
                        ) : (
                            <div style={{ width: '100%', height: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 40, opacity: .5 }}>📖</div>
                        )}
                        {!unit.is_unlocked && (
                            <div style={{ position: 'absolute', inset: 0, background: 'rgba(4,9,20,.4)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                                <div style={{
                                    width: 40, height: 40, borderRadius: '50%', background: 'rgba(7,13,26,.8)',
                                    border: `1.5px solid ${O}`, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 16,
                                    boxShadow: `0 0 20px rgba(244,124,32,.35)`,
                                }}>🔒</div>
                            </div>
                        )}
                    </div>

                    {/* Roman numeral rune tag */}
                    <div style={{
                        position: 'absolute', bottom: -6, left: '50%', transform: 'translateX(-50%)',
                        background: `linear-gradient(135deg,#2a3f6b,${N})`, border: `1.5px solid ${G}`,
                        borderRadius: 8, padding: '2px 10px', fontFamily: "'Cinzel', serif", fontWeight: 700,
                        fontSize: 12.5, color: G, boxShadow: '0 4px 12px rgba(0,0,0,.5)', whiteSpace: 'nowrap',
                    }}>
                        {roman}
                    </div>

                    {unit.term && (
                        <div style={{
                            position: 'absolute', top: 2, right: -6,
                            background: 'rgba(7,13,26,.85)', color: B,
                            borderRadius: 20, padding: '3px 10px', fontSize: 9.5, fontWeight: 700,
                            border: `1px solid ${G}4d`, whiteSpace: 'nowrap',
                        }}>{unit.term}</div>
                    )}
                </div>

                {/* Content */}
                <div style={{ padding: '18px 20px 22px', textAlign: 'center' }}>
                    <h3 style={{
                        color: '#F5F0E8', fontSize: 15.5, fontWeight: 800, margin: '0 0 8px', lineHeight: 1.5,
                        fontFamily: 'Cairo, sans-serif',
                    }}>
                        {unit.title}
                    </h3>

                    {unit.description && (
                        <p style={{
                            color: 'rgba(220,201,163,.6)', fontSize: 11.5, lineHeight: 1.7,
                            margin: '0 0 14px', overflow: 'hidden', display: '-webkit-box',
                            WebkitLineClamp: 2, WebkitBoxOrient: 'vertical',
                        }}>
                            {unit.description}
                        </p>
                    )}

                    <div style={{
                        display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8,
                        fontSize: 10.5, color: 'rgba(220,201,163,.5)', fontWeight: 600, marginBottom: 16,
                    }}>
                        <span>🎬 {unit.lessons_count} محاضرة</span>
                        {unit.is_unlocked && unit.lessons_count > 0 && (
                            <>
                                <ConstellationDot />
                                <span>{pct}% مكتملة</span>
                            </>
                        )}
                    </div>

                    <UnitCTA unit={unit} />
                </div>
            </div>
        </div>
    );
}

function ConstellationDot() {
    return (
        <span style={{ position: 'relative', width: 14, display: 'inline-flex', alignItems: 'center', justifyContent: 'center' }}>
            <span style={{ width: 22, height: 1, background: `linear-gradient(90deg,transparent,${G}80,transparent)`, position: 'absolute' }} />
            <span style={{ width: 3, height: 3, borderRadius: '50%', background: G, position: 'relative' }} />
        </span>
    );
}

/* ── CTA — sigil pill button ──────────────────────────────────── */
function UnitCTA({ unit }) {
    if (unit.is_unlocked) {
        return (
            <a
                href={route('student.lessons.unit', unit.id)}
                className="sigil-btn"
                style={{
                    position: 'relative', overflow: 'hidden',
                    display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8,
                    width: '100%', background: `linear-gradient(135deg, ${O} 0%, #d9620a 100%)`,
                    color: '#fff', borderRadius: 999, padding: '11px', boxSizing: 'border-box',
                    fontSize: 13, fontWeight: 800, textDecoration: 'none',
                    boxShadow: `0 8px 22px rgba(244,124,32,.3)`, transition: 'opacity .2s, transform .2s',
                }}
                onMouseEnter={e => { e.currentTarget.style.opacity = '.92'; e.currentTarget.style.transform = 'translateY(-2px)'; }}
                onMouseLeave={e => { e.currentTarget.style.opacity = '1'; e.currentTarget.style.transform = 'none'; }}
            >
                <span style={{ position: 'relative', zIndex: 1 }}>✦ اعبر البوابة</span>
                <span style={{
                    position: 'absolute', inset: 0, transform: 'translateX(-180%)',
                    background: 'linear-gradient(115deg,transparent 30%,rgba(255,255,255,.35) 50%,transparent 70%)',
                    transition: 'transform .6s ease',
                }} />
            </a>
        );
    }

    if (unit.payment_status === 'pending') {
        return (
            <div style={{
                width: '100%', boxSizing: 'border-box',
                background: 'rgba(217,119,6,.08)', border: '2px solid rgba(217,119,6,.3)',
                borderRadius: 999, padding: '9px', fontSize: 11.5, fontWeight: 700, color: '#D97706',
                display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 6,
            }}>
                ⏳ طلبك قيد المراجعة
            </div>
        );
    }

    return (
        <a
            href={`/student/payment?unit_id=${unit.id}`}
            style={{
                width: '100%', boxSizing: 'border-box',
                background: 'transparent', border: `2px solid ${O}`, color: O,
                borderRadius: 999, padding: '9px', fontSize: 12.5, fontWeight: 800, textDecoration: 'none',
                display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 6,
                transition: 'background .2s, color .2s',
            }}
            onMouseEnter={e => { e.currentTarget.style.background = O; e.currentTarget.style.color = '#fff'; }}
            onMouseLeave={e => { e.currentTarget.style.background = 'transparent'; e.currentTarget.style.color = O; }}
        >
            🔮 افتح البوابة بـ {unit.price} ج.م
        </a>
    );
}

/* ── Empty state ──────────────────────────────────────────────── */
function EmptyState() {
    return (
        <div style={{
            background: 'rgba(10,20,38,.6)', borderRadius: 24, padding: '4rem 2rem', textAlign: 'center',
            border: '1px solid rgba(201,161,74,.2)', position: 'relative', overflow: 'hidden',
        }}>
            <div style={{ fontSize: 56, marginBottom: 16 }}>🌑</div>
            <h3 style={{ color: '#F5F0E8', fontSize: 18, fontWeight: 900, margin: '0 0 10px', fontFamily: "'Cinzel', serif" }}>
                لا توجد بوابات مفتوحة بعد
            </h3>
            <p style={{ color: 'rgba(220,201,163,.55)', fontSize: 13, maxWidth: 320, margin: '0 auto' }}>
                سيتم إضافة وحدات لصفك قريباً. ترقّبها!
            </p>
        </div>
    );
}
