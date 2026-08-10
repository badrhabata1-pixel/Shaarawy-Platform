import { useState, useEffect, useRef } from 'react';
import { Head, Link, router } from '@inertiajs/react';
import StudentLayout from '@/Layouts/StudentLayout';

/* ── Brand Palette ─────────────────────────────────────── */
const O = '#F47C20';
const N = '#14213D';
const B = '#DCC9A3';
const W = '#F7F3EB';
const G = '#C9A14A';

/* ── Stat-card dark gradients (brand) ──────────────────── */
const CARD_BGS = [
    `linear-gradient(145deg,#0A1220 0%,${N} 100%)`,
    `linear-gradient(145deg,#7A3208 0%,#B85610 100%)`,
    `linear-gradient(145deg,#5A3A08 0%,#9A6B18 100%)`,
    `linear-gradient(145deg,#2C1800 0%,#5A3410 100%)`,
];

/* ── Fixed particles ─────────────────────────────────────── */
const PARTICLES = [
    { l:'4%',  d:'0s',   dr:'9s',  s:2.5, o:.45 },
    { l:'14%', d:'2.2s', dr:'11s', s:1.5, o:.3  },
    { l:'24%', d:'1.1s', dr:'8s',  s:3,   o:.38 },
    { l:'34%', d:'3.8s', dr:'10s', s:2,   o:.28 },
    { l:'44%', d:'0.7s', dr:'7s',  s:1.5, o:.3  },
    { l:'54%', d:'4.2s', dr:'9s',  s:2.5, o:.42 },
    { l:'64%', d:'1.8s', dr:'11s', s:2,   o:.32 },
    { l:'74%', d:'2.9s', dr:'8s',  s:3,   o:.38 },
    { l:'84%', d:'0.3s', dr:'10s', s:1.5, o:.28 },
    { l:'94%', d:'3.2s', dr:'7s',  s:2,   o:.35 },
];

/* ── Realistic Pyramid SVG ───────────────────────────────── */
function PyramidSVG({ pid, accent }) {
    /* apex and base geometry */
    const ax = 40, ay = 4, baseY = 62, hb = 36; /* half-base width */
    const courses = [13, 22, 31, 40, 49, 58];   /* horizontal stone courses */

    return (
        <svg viewBox="0 0 80 70" fill="none" width="64" height="56">
            <defs>
                {/* Sunlit left face — warm sandy gold */}
                <linearGradient id={`pL${pid}`} x1="0%" y1="0%" x2="100%" y2="100%">
                    <stop offset="0%"   stopColor="#F3DB78"/>
                    <stop offset="45%"  stopColor="#C8941C"/>
                    <stop offset="100%" stopColor="#8E6410"/>
                </linearGradient>
                {/* Shadow right face */}
                <linearGradient id={`pR${pid}`} x1="100%" y1="0%" x2="0%" y2="100%">
                    <stop offset="0%"   stopColor="#6A4410"/>
                    <stop offset="100%" stopColor="#2E1800"/>
                </linearGradient>
                {/* Capstone glow filter */}
                <filter id={`gCap${pid}`} x="-100%" y="-100%" width="300%" height="300%">
                    <feGaussianBlur stdDeviation="2.8" result="b"/>
                    <feMerge><feMergeNode in="b"/><feMergeNode in="SourceGraphic"/></feMerge>
                </filter>
            </defs>

            {/* Ground shadow */}
            <ellipse cx={ax} cy="67" rx="29" ry="3.5" fill="rgba(0,0,0,.28)"/>

            {/* Pyramid faces */}
            <polygon points={`${ax},${ay} ${ax-hb},${baseY} ${ax},${baseY}`} fill={`url(#pL${pid})`}/>
            <polygon points={`${ax},${ay} ${ax+hb},${baseY} ${ax},${baseY}`} fill={`url(#pR${pid})`}/>

            {/* Stone course lines */}
            {courses.map((y, i) => {
                const t  = (y - ay) / (baseY - ay);
                const xl = ax - t * hb;
                const xr = ax + t * hb;
                return (
                    <g key={i}>
                        <line x1={xl} y1={y} x2={ax}  y2={y} stroke="rgba(0,0,0,.22)" strokeWidth=".85"/>
                        <line x1={ax} y1={y} x2={xr}  y2={y} stroke="rgba(255,255,255,.07)" strokeWidth=".85"/>
                    </g>
                );
            })}

            {/* Center ridge */}
            <line x1={ax} y1={ay} x2={ax} y2={baseY} stroke="rgba(0,0,0,.18)" strokeWidth=".9"/>

            {/* Entrance arch */}
            <path d={`M37,${baseY} L37,${baseY-9} Q${ax},${baseY-15} 43,${baseY-9} L43,${baseY}`}
                fill="rgba(12,6,0,.65)"/>

            {/* Subtle light spec on left face */}
            <polygon points={`${ax},${ay+8} ${ax-hb*.18},${ay+22} ${ax},${ay+22}`}
                fill="rgba(255,245,200,.10)"/>

            {/* Capstone accent glow */}
            <circle cx={ax} cy={ay} r="7" fill={accent} opacity=".22" filter={`url(#gCap${pid})`}/>
            {/* Capstone gold */}
            <circle cx={ax} cy={ay} r="3.2" fill="#F7E568"/>
            {/* Highlight dot */}
            <circle cx={ax-1} cy={ay-1} r="1.1" fill="rgba(255,255,255,.90)"/>

            {/* Sand dust at base */}
            <rect x={ax-hb} y={baseY} width={hb*2} height="2.5" rx="1.2"
                fill="rgba(185,140,50,.28)"/>
        </svg>
    );
}

const PYRAMID_ICONS = [
    <PyramidSVG key="p0" pid="n" accent={N}/>,
    <PyramidSVG key="p1" pid="o" accent={O}/>,
    <PyramidSVG key="p2" pid="g" accent={G}/>,
    <PyramidSVG key="p3" pid="b" accent={B}/>,
];

/* ── Animated counter ─────────────────────────────────────── */
function useCount(target, delay = 0) {
    const [v, setV] = useState(0);
    useEffect(() => {
        const isStr = typeof target === 'string';
        const raw   = parseFloat(String(target));
        if (!raw) { setV(target); return; }
        const tid = setTimeout(() => {
            const t0 = performance.now();
            const tick = ts => {
                const prog = Math.min((ts - t0) / 1400, 1);
                const ease = 1 - Math.pow(1 - prog, 4);
                const cur  = Math.round(raw * ease);
                setV(isStr && String(target).includes('%') ? `${cur}%` : cur);
                if (prog < 1) requestAnimationFrame(tick);
            };
            requestAnimationFrame(tick);
        }, delay);
        return () => clearTimeout(tid);
    }, [target]); // eslint-disable-line
    return v;
}

/* ── SVG progress ring ─────────────────────────────────────── */
function Ring({ pct = 0, size = 88, stroke = 3, color }) {
    const r    = (size - stroke * 2) / 2;
    const circ = +(2 * Math.PI * r).toFixed(2);
    const [shown, setShown] = useState(0);
    useEffect(() => { const t = setTimeout(() => setShown(pct), 350); return () => clearTimeout(t); }, [pct]);
    return (
        <svg width={size} height={size} style={{ position:'absolute', inset:0, transform:'rotate(-90deg)' }}>
            <circle cx={size/2} cy={size/2} r={r} stroke="rgba(255,255,255,.1)" strokeWidth={stroke} fill="none"/>
            <circle cx={size/2} cy={size/2} r={r} stroke={color} strokeWidth={stroke} fill="none"
                strokeDasharray={circ}
                strokeDashoffset={+(circ - (shown/100)*circ).toFixed(2)}
                strokeLinecap="round"
                style={{ transition:'stroke-dashoffset 2s cubic-bezier(.4,0,.2,1)' }}/>
        </svg>
    );
}

/* ══════════════════════════════════════════════════════════
   DASHBOARD
══════════════════════════════════════════════════════════ */
export default function Dashboard({
    student,
    stats,
    lessons_progress = [],
    upcoming_exams   = [],
    recent_sheets    = [],
    subscription     = {},   // { package_name, price, currency, vodafone_number, instapay_number }
    payment          = null, // { status: 'pending' | 'accepted' | 'rejected' }
}) {
    const gradeColors = { 1: N, 2: G, 3: O };
    const gc = gradeColors[student.grade_level] ?? O;
    const [sidebarOpen, setSidebarOpen] = useState(false);
    const sidebarRef = useRef(null);

    useEffect(() => {
        function handleClickOutside(e) {
            if (sidebarRef.current && !sidebarRef.current.contains(e.target)) {
                setSidebarOpen(false);
            }
        }
        if (sidebarOpen) document.addEventListener('mousedown', handleClickOutside);
        return () => document.removeEventListener('mousedown', handleClickOutside);
    }, [sidebarOpen]);

    const sidebarLinks = [
        { icon: '🎬', label: 'المحاضرات',  href: route('student.lessons'),         accent: O },
        { icon: '📝', label: 'الامتحانات', href: route('student.exams'),           accent: G },
        { icon: '📄', label: 'الشيتات',    href: route('student.sheets'),          accent: N },
        { icon: '🧾', label: 'نظام الدفع', href: route('student.payment.create'),  accent: O },
        { icon: '📜', label: 'سجل الدفع',  href: route('student.payment.history'), accent: G },
    ];

    return (
        <StudentLayout>
            <Head title={`لوحة التحكم — ${student.full_name}`} />

            {/* ════════════════════════════════════════
                QUICK-NAV SIDEBAR (left edge)
            ════════════════════════════════════════ */}

            {/* Toggle button — fixed on LEFT edge */}
            <button
                onClick={() => setSidebarOpen(o => !o)}
                title="القائمة السريعة"
                style={{
                    position: 'fixed',
                    top: '50%',
                    left: sidebarOpen ? 'var(--qn-width, 320px)' : 0,
                    transform: 'translateY(-50%)',
                    zIndex: 1001,
                    background: `linear-gradient(135deg, ${O}, #c45e0a)`,
                    border: 'none',
                    borderRadius: '0 10px 10px 0',
                    width: 36,
                    height: 110,
                    cursor: 'pointer',
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: 'center',
                    justifyContent: 'center',
                    gap: 4,
                    boxShadow: '4px 0 20px rgba(244,124,32,0.4)',
                    transition: 'left 0.35s cubic-bezier(.4,0,.2,1)',
                    padding: 0,
                }}
            >
                <span style={{ fontSize: 20, lineHeight: 1, color: '#fff' }}>
                    {sidebarOpen ? '✕' : '☰'}
                </span>
                {!sidebarOpen && (
                    <span style={{
                        fontSize: 8,
                        fontFamily: "'Cairo',sans-serif",
                        fontWeight: 900,
                        color: 'rgba(255,255,255,0.85)',
                        letterSpacing: '.06em',
                        writingMode: 'vertical-rl',
                        textOrientation: 'mixed',
                        marginTop: 6,
                        lineHeight: 1.2,
                    }}>
                        القائمة
                    </span>
                )}
            </button>

            {/* Backdrop */}
            {sidebarOpen && (
                <div
                    onClick={() => setSidebarOpen(false)}
                    style={{
                        position: 'fixed',
                        inset: 0,
                        background: 'rgba(0,0,0,0.45)',
                        zIndex: 999,
                        backdropFilter: 'blur(2px)',
                        animation: 'sidebarFadeIn 0.25s ease both',
                    }}
                />
            )}

            {/* Sidebar panel — slides from LEFT */}
            <div
                ref={sidebarRef}
                style={{
                    position: 'fixed',
                    top: 0,
                    left: sidebarOpen ? 0 : 'calc(-1 * var(--qn-width, 320px))',
                    width: 'var(--qn-width, 320px)',
                    height: '100vh',
                    zIndex: 1000,
                    background: 'linear-gradient(180deg, #060D1E 0%, #0E1B30 40%, #14213D 100%)',
                    borderRight: `1px solid rgba(201,161,74,0.25)`,
                    boxShadow: '8px 0 40px rgba(0,0,0,0.5), inset -1px 0 0 rgba(201,161,74,0.1)',
                    transition: 'left 0.35s cubic-bezier(.4,0,.2,1)',
                    overflowY: 'auto',
                    display: 'flex',
                    flexDirection: 'column',
                }}
            >
                {/* Sidebar header */}
                <div style={{
                    padding: '24px 20px 16px',
                    borderBottom: 'rgba(201,161,74,0.15) solid 1px',
                    background: 'linear-gradient(135deg, rgba(201,161,74,0.08), transparent)',
                    flexShrink: 0,
                    marginTop: 80,
                }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 6 }}>
                        <div style={{ width: 4, height: 24, borderRadius: 2, background: `linear-gradient(180deg, ${G}, ${O})` }} />
                        <div style={{ color: G, fontSize: 11, fontWeight: 700, letterSpacing: '.14em' }}>القائمة السريعة</div>
                    </div>
                    <div style={{ color: '#fff', fontSize: 16, fontWeight: 900, fontFamily: "'Cairo',sans-serif" }}>
                        🏛️ لوحة الطالب
                    </div>
                    <div style={{ color: 'rgba(220,201,163,.45)', fontSize: 11, marginTop: 4 }}>
                        {student.full_name}
                    </div>
                </div>

                {/* Sidebar nav links */}
                <nav style={{ padding: '12px 0', flex: 1 }}>
                    {sidebarLinks.map((item, i) => (
                        <Link
                            key={item.label}
                            href={item.href}
                            onClick={() => setSidebarOpen(false)}
                            style={{
                                display: 'flex',
                                alignItems: 'center',
                                gap: 14,
                                padding: '14px 20px',
                                textDecoration: 'none',
                                borderBottom: '1px solid rgba(201,161,74,0.07)',
                                transition: 'all 0.2s ease',
                                animation: `sidebarSlideIn 0.35s ${i * 60}ms both`,
                                position: 'relative',
                            }}
                            onMouseEnter={e => { e.currentTarget.style.background = 'rgba(244,124,32,0.1)'; e.currentTarget.style.paddingLeft = '26px'; }}
                            onMouseLeave={e => { e.currentTarget.style.background = 'transparent'; e.currentTarget.style.paddingLeft = '20px'; }}
                        >
                            <div style={{
                                width: 42, height: 42, borderRadius: 12,
                                background: `${item.accent}18`, border: `1px solid ${item.accent}30`,
                                display: 'flex', alignItems: 'center', justifyContent: 'center',
                                fontSize: 18, flexShrink: 0,
                            }}>
                                {item.icon}
                            </div>
                            <div style={{ color: '#fff', fontSize: 14, fontWeight: 700, fontFamily: "'Cairo',sans-serif", flex: 1 }}>
                                {item.label}
                            </div>
                            <div style={{ color: `${item.accent}80`, fontSize: 12, flexShrink: 0 }}>←</div>
                        </Link>
                    ))}
                </nav>

                {/* Sidebar footer */}
                <div style={{
                    padding: '16px 20px',
                    borderTop: '1px solid rgba(201,161,74,0.12)',
                    background: 'rgba(0,0,0,0.2)',
                    flexShrink: 0,
                }}>
                    <div style={{ color: 'rgba(201,161,74,0.4)', fontSize: 10, textAlign: 'center', fontFamily: "'Cairo',sans-serif", letterSpacing: '.1em' }}>
                        🏛️ منصة الصيفي التعليمية
                    </div>
                </div>
            </div>

            {/* ── Keyframes ── */}
            <style>{`
                @keyframes floatDust {
                    0%        { transform:translateY(0) scale(1); opacity:0; }
                    15%,85%   { opacity:var(--op,.3); }
                    100%      { transform:translateY(-120px) scale(.4); opacity:0; }
                }
                @keyframes floatEmoji {
                    0%,100%   { transform:translateY(0) rotate(0deg); }
                    33%       { transform:translateY(-14px) rotate(4deg); }
                    66%       { transform:translateY(8px) rotate(-3deg); }
                }
                @keyframes db-up  { from{opacity:0;transform:translateY(22px)} to{opacity:1;transform:none} }
                @keyframes db-in  { from{opacity:0;transform:translateX(16px)} to{opacity:1;transform:none} }
                @keyframes db-pop {
                    0%  {transform:scale(0) rotate(-8deg);opacity:0}
                    65% {transform:scale(1.08) rotate(1deg)}
                    100%{transform:scale(1) rotate(0);opacity:1}
                }
                @keyframes db-pulse { 0%,100%{box-shadow:0 0 0 0 ${O}60} 50%{box-shadow:0 0 0 8px ${O}00} }
                @keyframes db-glow  {
                    0%,100%{filter:drop-shadow(0 0 6px ${G}50)}
                    50%    {filter:drop-shadow(0 0 18px ${G}99)}
                }
                @keyframes shimmer {
                    from{background-position:200% center}
                    to  {background-position:-200% center}
                }
                @keyframes borderPulse {
                    0%,100%{border-color:${G}35}
                    50%    {border-color:${G}80}
                }
                @keyframes sidebarFadeIn {
                    from{opacity:0}
                    to  {opacity:1}
                }
                @keyframes sidebarSlideIn {
                    from{opacity:0;transform:translateX(20px)}
                    to  {opacity:1;transform:none}
                }
                :root { --qn-width: min(33vw, 320px); }
                @media (max-width: 860px) {
                    :root { --qn-width: min(82vw, 300px); }
                }
                @media (max-width: 600px) {
                    .hero-teacher { width: 110px !important; }
                    .hero-content-inner { padding-right: max(clamp(1rem,4vw,1.5rem), 100px) !important; }
                    .hero-badges { align-items: flex-start !important; }
                    .hero-name { font-size: 1.15rem !important; }
                }

                /* ── Light/Dark theme tokens ── */
                :root {
                    --db-card:   #ffffff;
                    --db-border: rgba(220,201,163,.35);
                    --db-row:    #F8FAFC;
                    --db-rowbdr: #E2E8F0;
                    --db-text:   #14213D;
                    --db-muted:  #64748B;
                    --db-shadow: rgba(20,33,61,.07);
                    --db-sub:    rgba(20,33,61,.45);
                }
                .dark {
                    --db-card:   #0d1c30;
                    --db-border: rgba(201,161,74,.18);
                    --db-row:    rgba(255,255,255,.05);
                    --db-rowbdr: rgba(255,255,255,.08);
                    --db-text:   #e8dfc8;
                    --db-muted:  #8a96aa;
                    --db-shadow: rgba(0,0,0,.35);
                    --db-sub:    rgba(220,201,163,.5);
                }
            `}</style>

            {/* ════════════════════════════════════════
                HERO BANNER
            ════════════════════════════════════════ */}
            <div style={{
                position:'relative',
                background:`
                    radial-gradient(ellipse at 70% 50%, rgba(244,124,32,.12) 0%, transparent 55%),
                    radial-gradient(ellipse at 20% 30%, rgba(201,161,74,.08) 0%, transparent 50%),
                    linear-gradient(135deg, #060D1E 0%, #0E1B30 40%, ${N} 100%)
                `,
                borderRadius: 24,
                overflow: 'hidden',
                marginBottom: '1.75rem',
                boxShadow: `0 20px 60px rgba(0,0,0,.3), 0 0 0 1px ${G}25`,
                animation: 'db-up .55s ease both',
                minHeight: 190,
            }}>
                {/* dot grid */}
                <div style={{
                    position:'absolute', inset:0, pointerEvents:'none',
                    backgroundImage:`radial-gradient(circle,${G}09 1px,transparent 1px)`,
                    backgroundSize:'26px 26px',
                }}/>

                {/* gold dust particles */}
                {PARTICLES.map((p,i)=>(
                    <div key={i} style={{
                        position:'absolute', bottom:0, left:p.l,
                        width:p.s, height:p.s, borderRadius:'50%',
                        background:`radial-gradient(circle,#F0DC88,${G})`,
                        '--op':p.o,
                        animation:`floatDust ${p.dr} ${p.d} ease-in-out infinite`,
                        pointerEvents:'none',
                    }}/>
                ))}

                {/* Bottom gold line */}
                <div style={{
                    position:'absolute', bottom:0, left:0, right:0, height:1,
                    background:`linear-gradient(90deg,transparent,${G}80,transparent)`,
                }}/>

                {/* Teacher image — decorative, right side (RTL start) */}
                <div className="hero-teacher" style={{
                    position:'absolute', right:0, bottom:0, top:0,
                    width: 220,
                    overflow:'hidden', pointerEvents:'none',
                }}>
                    <div style={{
                        position:'absolute', inset:0,
                        background:`linear-gradient(to right, #060D1E 0%, transparent 40%)`,
                        zIndex:1,
                    }}/>
                    <img
                        src="/images/teacher-m.Ali.png"
                        alt="الأستاذ"
                        style={{
                            position:'absolute', bottom:0, right:0,
                            height:'100%', width:'100%',
                            objectFit:'contain', objectPosition:'bottom right',
                            opacity:.85,
                        }}
                    />
                </div>

                {/* Content */}
                <div className="hero-content-inner" style={{
                    position:'relative', zIndex:2,
                    padding:'clamp(1.4rem,3.5vw,2rem) clamp(1.4rem,4vw,2.25rem)',
                    display:'flex', alignItems:'center', justifyContent:'space-between',
                    flexWrap:'wrap', gap:16,
                    paddingRight: 'max(clamp(1.4rem,4vw,2.25rem), 200px)',
                }}>
                    {/* Avatar + name */}
                    <div style={{ display:'flex', alignItems:'center', gap:18 }}>
                        <div style={{
                            position:'relative', width:88, height:88, flexShrink:0,
                            animation:'db-glow 3.5s ease-in-out infinite',
                        }}>
                            <Ring pct={stats.completion_pct} size={88} stroke={3} color={G}/>
                            <div style={{
                                position:'absolute', inset:8, borderRadius:'50%',
                                background:`linear-gradient(135deg,${O},#C4600E)`,
                                display:'flex', alignItems:'center', justifyContent:'center',
                                fontSize:22, fontWeight:900, color:'#fff',
                                boxShadow:`0 0 22px ${O}55`,
                                overflow:'hidden',
                            }}>
                                {student.initials}
                            </div>
                        </div>

                        <div>
                            <div style={{ color:`${G}99`, fontSize:11, letterSpacing:'.06em', marginBottom:4 }}>
                                مرحباً بك مجدداً ✨
                            </div>
                            <div className="hero-name" style={{
                                color:'#fff',
                                fontSize:'clamp(1.1rem,3vw,1.5rem)',
                                fontWeight:900, lineHeight:1.2, marginBottom:4,
                            }}>
                                {student.full_name}
                            </div>
                            {student.last_login && (
                                <div style={{ color:'rgba(255,255,255,.3)', fontSize:11 }}>
                                    ⏱ آخر دخول: {student.last_login}
                                </div>
                            )}
                        </div>
                    </div>

                    {/* Badges */}
                    <div style={{ display:'flex', flexDirection:'column', gap:12, alignItems:'flex-end', animation:'db-in .7s .2s both' }}>
                        <div style={{ display:'flex', flexWrap:'wrap', gap:8, justifyContent:'flex-end' }}>
                            <GlowBadge label={student.grade}                                          color={gc}   delay=".2s"/>
                            <GlowBadge label={student.mode==='online'?'🌐 أونلاين':'🏫 أوفلاين'}   color={B}    delay=".3s"/>
                            <GlowBadge label={`🔥 ${stats.completion_pct}% مكتمل`}                  color={O}    delay=".4s" glow/>
                        </div>
                    </div>
                </div>
            </div>

            {/* ════════════════════════════════════════
                STAT CARDS
            ════════════════════════════════════════ */}
            <div style={{
                display:'grid',
                gridTemplateColumns:'repeat(auto-fit,minmax(170px,1fr))',
                gap:14, marginBottom:'2rem',
                paddingTop:28,  /* room for overhanging pyramids */
            }}>
                <AnimStatCard icon={PYRAMID_ICONS[0]} label="إجمالي المحاضرات"  value={stats.total_lessons}      color={G}   delay={100} idx={0}/>
                <AnimStatCard icon={PYRAMID_ICONS[1]} label="محاضرات مكتملة"    value={stats.completed}          color={O}   delay={200} idx={1}/>
                <AnimStatCard icon={PYRAMID_ICONS[2]} label="محاضرات مفتوحة"    value={stats.unlocked}           color={G}   delay={300} idx={2}/>
                <AnimStatCard icon={PYRAMID_ICONS[3]} label="متوسط الاختبارات"  value={`${stats.quiz_average}%`} color={O}   delay={400} idx={3}/>
            </div>

            {/* ════════════════════════════════════════
                TIMELINE
            ════════════════════════════════════════ */}
            {lessons_progress.length > 0 && (
                <CardSection
                    title="📜 رحلتك عبر التاريخ"
                    linkHref={route('student.lessons')}
                    style={{ marginBottom:'1.75rem', animation:'db-up .6s .3s both' }}
                >
                    <TimelineLessons lessons={lessons_progress.slice(0,8)}/>
                </CardSection>
            )}

            {/* ════════════════════════════════════════
                EXAMS + SHEETS
            ════════════════════════════════════════ */}
            <div style={{
                display:'grid',
                gridTemplateColumns:'repeat(auto-fit,minmax(290px,1fr))',
                gap:16, marginBottom:'2rem',
            }}>
                <CardSection title="📝 الامتحانات" linkHref={route('student.exams')} style={{animation:'db-up .6s .4s both'}}>
                    {upcoming_exams.length
                        ? upcoming_exams.map(e=><ExamRow key={e.id} exam={e}/>)
                        : <EmptyState msg="لا توجد امتحانات متاحة حالياً"/>}
                </CardSection>
                <CardSection title="📄 الشيتات" linkHref={route('student.sheets')} style={{animation:'db-up .6s .5s both'}}>
                    {recent_sheets.length
                        ? recent_sheets.map(s=><SheetRow key={s.id} sheet={s}/>)
                        : <EmptyState msg="لا توجد شيتات متاحة حالياً"/>}
                </CardSection>
            </div>

            {/* ════════════════════════════════════════
                QUICK ACTIONS
            ════════════════════════════════════════ */}
            <div style={{
                display:'grid',
                gridTemplateColumns:'repeat(auto-fit,minmax(240px,1fr))',
                gap:18,
                marginBottom:'1.75rem',
            }}>
                <QuickCard icon="🎬" title="جدار المحاضرات" desc="استعرض جميع المحاضرات وابدأ رحلتك التعليمية"
                    href={route('student.lessons')} accent={O} mark="🏛️" delay={0}/>
                <QuickCard icon="📝" title="الامتحانات"     desc="اطّلع على جميع امتحاناتك ونتائجك"
                    href={route('student.exams')}   accent={G} mark="⚔️" delay={100}/>
                <QuickCard icon="📄" title="الشيتات"        desc="حمّل شيتات الدروس وتابع نتائجك"
                    href={route('student.sheets')}  accent={B} mark="📜" delay={200}/>
                {student.mode === 'offline' ? (
                    <>
                        <LockedQuickCard icon="🧾" title="نظام الدفع"  desc="ارفع إيصال التحويل وتابع حالة اشتراكك"  accent={O} mark="💳" delay={300}/>
                        <LockedQuickCard icon="📜" title="سجل الدفع"   desc="راجع طلبات الدفع السابقة وحالتها"        accent={G} mark="🧾" delay={400}/>
                    </>
                ) : (
                    <>
                        <QuickCard icon="🧾" title="نظام الدفع"     desc="ارفع إيصال التحويل وتابع حالة اشتراكك"
                            href={route('student.payment.create')} accent={O} mark="💳" delay={300}/>
                        <QuickCard icon="📜" title="سجل الدفع"      desc="راجع طلبات الدفع السابقة وحالتها"
                            href={route('student.payment.history')} accent={G} mark="🧾" delay={400}/>
                    </>
                )}
            </div>

        </StudentLayout>
    );
}

/* ══════════════════════════════════════════════════════════
   SUB-COMPONENTS
══════════════════════════════════════════════════════════ */

function GlowBadge({ label, color, delay='0s', glow=false }) {
    return (
        <div style={{
            background:`${color}1A`,
            border:`1px solid ${color}55`,
            borderRadius:20, padding:'6px 16px',
            color, fontSize:12, fontWeight:800,
            boxShadow: glow ? `0 0 14px ${color}35` : 'none',
            animation:`db-pop .5s ${delay} both`,
        }}>
            {label}
        </div>
    );
}

function AnimStatCard({ icon, label, value, color, delay, idx = 0 }) {
    const [hov, setHov] = useState(false);
    const count = useCount(value, delay);
    const bg    = CARD_BGS[idx % 4];

    return (
        /* Outer wrapper — pyramid hangs from top-left, partly inside card */
        <div
            onMouseEnter={()=>setHov(true)}
            onMouseLeave={()=>setHov(false)}
            style={{
                position:'relative',
                animation:`db-up .6s ${delay}ms both`,
                paddingTop: 12,   /* small — most of pyramid is inside card */
                paddingLeft: 4,
                cursor:'default',
            }}
        >
            {/* ── Pyramid — top-left, most of it inside card ── */}
            <div style={{
                position:'absolute',
                top: 0, left: 0,
                zIndex: 4, pointerEvents:'none',
                opacity: hov ? 1 : 0.32,
                filter: hov
                    ? `drop-shadow(0 0 12px ${color}) drop-shadow(0 8px 22px ${color}90) drop-shadow(0 0 36px ${color}55)`
                    : `grayscale(.6) brightness(.45) drop-shadow(0 4px 10px rgba(0,0,0,.7))`,
                transform: hov
                    ? 'rotate(-7deg) scale(1.1) translate(-2px,-5px)'
                    : 'rotate(-10deg) scale(1)',
                transition:'opacity .4s ease, filter .45s ease, transform .42s cubic-bezier(.22,1,.36,1)',
            }}>
                {icon}
            </div>

            {/* ── Card body ── */}
            <div style={{
                background: bg,
                borderRadius: 18,
                padding: '1.25rem 1.3rem 1.15rem',
                border: `1px solid ${G}${hov ? '48' : '1C'}`,
                boxShadow: hov
                    ? `0 18px 46px rgba(0,0,0,.55), 0 0 0 1px ${color}32, inset 0 1px 0 ${G}1A`
                    : `0 4px 20px rgba(0,0,0,.38), inset 0 1px 0 ${G}0E`,
                transform: hov ? 'translateY(-5px)' : 'none',
                transition:'box-shadow .35s, transform .35s, border-color .35s',
                position:'relative', overflow:'hidden',
            }}>
                {/* shimmer */}
                <div style={{
                    position:'absolute', top:0, left:0, right:0, height:1,
                    background:`linear-gradient(90deg,transparent,${G}80,transparent)`,
                    animation:'shimmer 3.5s linear infinite',
                }}/>
                {/* hover glow */}
                <div style={{
                    position:'absolute', inset:0, pointerEvents:'none',
                    background: hov
                        ? `radial-gradient(ellipse 80% 65% at 55% 60%, ${color}16 0%, transparent 70%)`
                        : 'none',
                    transition:'background .4s ease',
                }}/>

                {/* Content — pushed right & down to clear pyramid overlap */}
                <div style={{ paddingTop:38, paddingLeft:8, position:'relative' }}>
                    <div style={{
                        color:'#fff',
                        fontSize:'clamp(1.65rem,2.8vw,2.1rem)',
                        fontWeight:900, lineHeight:1, marginBottom:6,
                        fontVariantNumeric:'tabular-nums',
                        letterSpacing:'-.02em',
                    }}>
                        {count}
                    </div>
                    <div style={{
                        color: hov ? `${G}E0` : `${G}88`,
                        fontSize:11, fontWeight:600,
                        letterSpacing:'.01em',
                        transition:'color .35s ease',
                    }}>
                        {label}
                    </div>
                </div>
            </div>
        </div>
    );
}

function CardSection({ title, linkHref, children, style={} }) {
    return (
        <div style={{
            background: 'var(--db-card)',
            borderRadius: 20,
            padding: '1.75rem 2rem',
            boxShadow: '0 2px 20px var(--db-shadow)',
            border: '1px solid var(--db-border)',
            ...style,
        }}>
            <div style={{
                display:'flex', alignItems:'center',
                justifyContent:'space-between', marginBottom:'1.25rem',
            }}>
                <h2 style={{ color:'var(--db-text)', fontSize:16, fontWeight:800, margin:0 }}>{title}</h2>
                {linkHref && (
                    <Link href={linkHref} style={{
                        background:O, color:'#fff',
                        borderRadius:8, padding:'6px 14px',
                        fontSize:12, fontWeight:700, textDecoration:'none',
                        transition:'opacity .2s',
                    }}
                    onMouseEnter={e=>e.currentTarget.style.opacity='.82'}
                    onMouseLeave={e=>e.currentTarget.style.opacity='1'}
                    >عرض الكل ←</Link>
                )}
            </div>
            {children}
        </div>
    );
}

function TimelineLessons({ lessons }) {
    const [drawn, setDrawn] = useState(false);
    useEffect(()=>{ const t=setTimeout(()=>setDrawn(true),500); return ()=>clearTimeout(t); },[]);

    return (
        <div>
            {lessons.map((lesson, i) => {
                const done   = lesson.is_completed;
                const open   = !done && lesson.is_unlocked;
                const locked = !lesson.is_unlocked;
                const clr    = done ? '#059669' : open ? O : '#CBD5E1';
                const isLast = i === lessons.length - 1;

                return (
                    <div key={lesson.id} style={{ display:'flex', gap:14, animation:`db-up .4s ${i*55}ms both` }}>
                        <div style={{ display:'flex', flexDirection:'column', alignItems:'center', flexShrink:0, width:20 }}>
                            <div style={{
                                width:18, height:18, borderRadius:'50%',
                                background: done ? clr : 'transparent',
                                border:`2.5px solid ${clr}`,
                                display:'flex', alignItems:'center', justifyContent:'center',
                                fontSize:9, color:'#fff', fontWeight:900, flexShrink:0,
                                ...(open ? {animation:'db-pulse 2s infinite'} : {}),
                                ...(done ? {boxShadow:`0 0 10px ${clr}50`} : {}),
                            }}>
                                {done && '✓'}
                            </div>
                            {!isLast && (
                                <div style={{
                                    width:2, flex:1, minHeight:12, marginTop:2,
                                    background: drawn ? `linear-gradient(to bottom,${clr},#E2E8F0)` : 'transparent',
                                    transition:'background .8s ease',
                                }}/>
                            )}
                        </div>

                        <div style={{ flex:1, paddingBottom: isLast ? 0 : 14 }}>
                            <div style={{ fontSize:13, fontWeight:700, marginBottom:5, color: locked ? 'var(--db-muted)' : 'var(--db-text)' }}>
                                {locked ? `🔒 ${lesson.title}` : lesson.title}
                            </div>
                            <div style={{ display:'flex', alignItems:'center', gap:8 }}>
                                <div style={{ flex:1, maxWidth:200, height:5, background:'#F1F5F9', borderRadius:99, overflow:'hidden' }}>
                                    <div style={{
                                        height:'100%',
                                        width: done ? '100%' : open ? '50%' : '0%',
                                        background:`linear-gradient(90deg,${clr}AA,${clr})`,
                                        borderRadius:99, transition:'width 1.3s ease',
                                    }}/>
                                </div>
                                <span style={{ fontSize:10, fontWeight:700, color:clr, flexShrink:0 }}>
                                    {done ? '✅ مكتمل' : open ? '▶️ جارٍ' : '🔒 مغلق'}
                                    {lesson.quiz_score != null && ` · ${lesson.quiz_score}%`}
                                </span>
                            </div>
                        </div>
                    </div>
                );
            })}
        </div>
    );
}

function ExamRow({ exam }) {
    const [hov, setHov] = useState(false);
    const cfg = ({
        active:   { label:'🟢 جارٍ الآن', bg:`${O}18`, c:O      },
        upcoming: { label:'🕐 قادم',       bg:`${N}12`, c:N      },
        open:     { label:'✅ مفتوح',      bg:`${G}18`, c:'#7A5A00' },
        ended:    { label:'⛔ انتهى',      bg:'#FEE2E2', c:'#DC2626' },
    })[exam.status] ?? { label:exam.status, bg:'#F1F5F9', c:'#64748B' };

    return (
        <Link href={route('student.exams.show', exam.id)} style={{ textDecoration:'none', display:'block', marginBottom:8 }}>
            <div
                onMouseEnter={()=>setHov(true)}
                onMouseLeave={()=>setHov(false)}
                style={{
                    display:'flex', alignItems:'center', gap:12,
                    padding:'11px 14px', borderRadius:12,
                    background: hov ? `${O}12` : 'var(--db-row)',
                    border:`1px solid ${hov ? O : 'var(--db-rowbdr)'}`,
                    transition:'border-color .2s, background .2s, transform .2s',
                    transform: hov ? 'translateX(-3px)' : 'none',
                }}
            >
                <div style={{ flex:1, minWidth:0 }}>
                    <div style={{ fontSize:13, fontWeight:700, color:'var(--db-text)', marginBottom:2,
                        overflow:'hidden', textOverflow:'ellipsis', whiteSpace:'nowrap' }}>
                        {exam.title}
                    </div>
                    <div style={{ fontSize:11, color:'var(--db-muted)' }}>
                        ⏱ {exam.time_limit} دقيقة{exam.start_time && ` · يبدأ ${exam.start_time}`}
                    </div>
                </div>
                <div style={{ background:cfg.bg, color:cfg.c, borderRadius:20, padding:'4px 10px', fontSize:11, fontWeight:700, flexShrink:0 }}>
                    {cfg.label}
                </div>
            </div>
        </Link>
    );
}

function SheetRow({ sheet }) {
    const a = sheet.answer
        ? (sheet.answer.status === 'graded'
            ? { label:`مصحح ✅${sheet.answer.score!=null?` · ${sheet.answer.score}`:''}`, bg:`${G}18`, c:'#6B4E00' }
            : { label:'قيد المراجعة ⏳', bg:`${O}15`, c:O })
        : { label:'جديد 📄', bg:`${N}10`, c:N };

    return (
        <div style={{
            display:'flex', alignItems:'center', gap:12,
            padding:'11px 14px', borderRadius:12, marginBottom:8,
            background:'var(--db-row)', border:`1px solid var(--db-rowbdr)`,
        }}>
            <div style={{ flex:1, minWidth:0 }}>
                <div style={{ fontSize:13, fontWeight:700, color:'var(--db-text)', marginBottom:2,
                    overflow:'hidden', textOverflow:'ellipsis', whiteSpace:'nowrap' }}>
                    {sheet.title}
                </div>
                <div style={{ fontSize:11, color:'var(--db-muted)' }}>
                    {sheet.lesson_title && `📚 ${sheet.lesson_title}`}
                    {sheet.total_marks > 0 && ` · 🏆 ${sheet.total_marks} درجة`}
                </div>
            </div>
            <div style={{ background:a.bg, color:a.c, borderRadius:20, padding:'4px 10px', fontSize:11, fontWeight:700, flexShrink:0 }}>
                {a.label}
            </div>
        </div>
    );
}

function QuickCard({ icon, title, desc, href, accent, mark, delay }) {
    const [hov, setHov] = useState(false);
    return (
        <Link href={href} style={{ textDecoration:'none', display:'block' }}>
            <div
                onMouseEnter={()=>setHov(true)}
                onMouseLeave={()=>setHov(false)}
                style={{
                    background:`linear-gradient(150deg,#070F1C 0%,${N} 100%)`,
                    borderRadius:20, padding:'2rem 1.75rem 1.75rem',
                    border:`1px solid ${accent}28`,
                    borderTop:`3px solid ${accent}`,
                    boxShadow: hov
                        ? `0 22px 55px rgba(0,0,0,.55), 0 0 0 1px ${accent}38, inset 0 1px 0 ${accent}18`
                        : `0 6px 24px rgba(0,0,0,.38), inset 0 1px 0 ${accent}0C`,
                    transition:'transform .32s cubic-bezier(.22,1,.36,1), box-shadow .32s ease, border-color .32s ease',
                    transform: hov ? 'translateY(-9px)' : 'none',
                    animation:`db-up .6s ${delay}ms both`,
                    position:'relative', overflow:'hidden', cursor:'pointer',
                }}
            >
                {/* Watermark emoji */}
                <div style={{
                    position:'absolute', bottom:-24, left:-12, fontSize:130, lineHeight:1,
                    opacity: hov ? 0.07 : 0.035,
                    transform: hov ? 'scale(1.08) rotate(-6deg)' : 'rotate(-10deg)',
                    transition:'opacity .35s, transform .35s',
                    pointerEvents:'none', userSelect:'none',
                    filter:'grayscale(1) sepia(.4)',
                }}>{mark}</div>

                {/* Top shimmer */}
                <div style={{
                    position:'absolute', top:0, left:0, right:0, height:1,
                    background:`linear-gradient(90deg,transparent,${accent}70,transparent)`,
                }}/>

                {/* Icon box */}
                <div style={{
                    width:54, height:54, borderRadius:14,
                    background:`${accent}15`, border:`1.5px solid ${accent}30`,
                    display:'flex', alignItems:'center', justifyContent:'center',
                    fontSize:24, marginBottom:20,
                    transition:'transform .3s, box-shadow .3s, background .3s',
                    transform: hov ? 'scale(1.1) rotate(-4deg)' : 'none',
                    boxShadow: hov ? `0 8px 22px ${accent}40` : 'none',
                    position:'relative',
                }}>{icon}</div>

                {/* Title */}
                <div style={{
                    color:'#fff', fontSize:16, fontWeight:900,
                    marginBottom:10, position:'relative',
                    fontFamily:"'Cairo',sans-serif",
                }}>{title}</div>

                {/* Expanding accent divider */}
                <div style={{
                    width: hov ? 52 : 26, height:2,
                    background:`linear-gradient(90deg,${accent},transparent)`,
                    borderRadius:2, marginBottom:12,
                    transition:'width .35s ease',
                }}/>

                {/* Description */}
                <div style={{
                    color:`${B}99`, fontSize:12.5,
                    lineHeight:1.8, position:'relative',
                    paddingBottom: 28,
                }}>{desc}</div>

                {/* Enter arrow — slides in on hover */}
                <div style={{
                    position:'absolute', bottom:18, left:20,
                    display:'flex', alignItems:'center', gap:6,
                    color:accent, fontSize:12, fontWeight:800,
                    opacity: hov ? 1 : 0,
                    transform: hov ? 'translateX(0)' : 'translateX(10px)',
                    transition:'opacity .3s, transform .3s',
                }}>
                    ← ادخل الآن
                </div>
            </div>
        </Link>
    );
}

function LockedQuickCard({ icon, title, desc, mark, delay }) {
    return (
        <div style={{
            background:`linear-gradient(150deg,#070F1C 0%,${N} 100%)`,
            borderRadius:20, padding:'2rem 1.75rem 1.75rem',
            border:`1px solid rgba(255,255,255,.06)`,
            borderTop:`3px solid rgba(255,255,255,.1)`,
            boxShadow:`0 6px 24px rgba(0,0,0,.38)`,
            animation:`db-up .6s ${delay}ms both`,
            position:'relative', overflow:'hidden',
            cursor:'not-allowed',
            opacity: 0.52,
            filter: 'grayscale(0.6)',
        }}>
            {/* Watermark */}
            <div style={{
                position:'absolute', bottom:-24, left:-12, fontSize:130, lineHeight:1,
                opacity:0.035, transform:'rotate(-10deg)',
                pointerEvents:'none', userSelect:'none',
                filter:'grayscale(1) sepia(.4)',
            }}>{mark}</div>

            {/* Lock badge */}
            <div style={{
                position:'absolute', top:14, left:14,
                background:'rgba(148,163,184,.18)', border:'1px solid rgba(148,163,184,.25)',
                borderRadius:999, padding:'3px 10px',
                fontSize:11, fontWeight:800, color:'#94a3b8',
                display:'flex', alignItems:'center', gap:5,
            }}>
                🔒 غير متاح
            </div>

            {/* Top shimmer */}
            <div style={{
                position:'absolute', top:0, left:0, right:0, height:1,
                background:`linear-gradient(90deg,transparent,rgba(255,255,255,.12),transparent)`,
            }}/>

            {/* Icon box */}
            <div style={{
                width:54, height:54, borderRadius:14,
                background:'rgba(148,163,184,.08)', border:'1.5px solid rgba(148,163,184,.15)',
                display:'flex', alignItems:'center', justifyContent:'center',
                fontSize:24, marginBottom:20,
            }}>{icon}</div>

            {/* Title */}
            <div style={{
                color:'rgba(255,255,255,.45)', fontSize:16, fontWeight:900,
                marginBottom:10, fontFamily:"'Cairo',sans-serif",
            }}>{title}</div>

            {/* Divider */}
            <div style={{ width:26, height:2, background:'rgba(255,255,255,.1)', borderRadius:2, marginBottom:12 }}/>

            {/* Description */}
            <div style={{
                color:`rgba(220,201,163,.35)`, fontSize:12.5,
                lineHeight:1.8, paddingBottom:28,
            }}>{desc}</div>

            {/* Offline note */}
            <div style={{
                position:'absolute', bottom:18, right:18,
                fontSize:11, fontWeight:800, color:'#64748b',
            }}>
                متاح للطلاب الأونلاين فقط
            </div>
        </div>
    );
}

function EmptyState({ msg }) {
    return (
        <div style={{ textAlign:'center', color:'var(--db-muted)', padding:'2.5rem 0', fontSize:13 }}>
            <div style={{ fontSize:34, marginBottom:8, opacity:.3 }}>📭</div>
            {msg}
        </div>
    );
}

/* ══════════════════════════════════════════════════════════
   PAYMENT — الباقة/السعر + حالة الدفع + اختيار الوسيلة + رفع الإيصال
   (فودافون كاش / انستاباي فقط — بدون فيزا)
══════════════════════════════════════════════════════════ */
function PaymentCard({ subscription = {}, payment = null, style = {} }) {
    const PAYMENT_METHODS = [
        { key: 'vodafone_cash', label: '📱 فودافون كاش', number: subscription.vodafone_number || '01000000000' },
        { key: 'instapay',      label: '💳 انستاباي',    number: subscription.instapay_number || subscription.instapay_handle || 'yourname@instapay' },
    ];
    const [selectedMethod, setSelectedMethod] = useState(PAYMENT_METHODS[0].key);
    const activeMethod = PAYMENT_METHODS.find(m => m.key === selectedMethod) || PAYMENT_METHODS[0];

    const STATUS_UI = {
        pending:  { label: '⏳ قيد المراجعة', c: O,         bg: `${O}18` },
        accepted: { label: '✅ تم القبول',     c: '#059669', bg: '#05966918' },
        approved: { label: '✅ تم القبول',     c: '#059669', bg: '#05966918' },
        rejected: { label: '❌ مرفوض',         c: '#DC2626', bg: '#DC262618' },
    };
    const statusUI = payment?.status ? STATUS_UI[payment.status] : null;

    return (
        <div style={{
            background: 'var(--db-card)',
            borderRadius: 20,
            padding: '1.75rem 2rem',
            boxShadow: '0 2px 20px var(--db-shadow)',
            border: '1px solid var(--db-border)',
            textAlign: 'right',
            ...style,
        }}>
            <div style={{
                display: 'flex', alignItems: 'center', justifyContent: 'space-between',
                flexWrap: 'wrap', gap: 10, marginBottom: '1rem',
            }}>
                <h2 style={{ color: 'var(--db-text)', fontSize: 16, fontWeight: 800, margin: 0 }}>
                    🧾 تأكيد الاشتراك وإرسال إيصال الدفع
                </h2>
                {statusUI && (
                    <span style={{
                        background: statusUI.bg, color: statusUI.c,
                        borderRadius: 20, padding: '4px 12px',
                        fontSize: 11, fontWeight: 700,
                    }}>
                        {statusUI.label}
                    </span>
                )}
            </div>

            {(subscription.package_name || subscription.price != null) && (
                <div style={{
                    display: 'flex', alignItems: 'center', justifyContent: 'space-between',
                    flexWrap: 'wrap', gap: 10,
                    background: 'var(--db-row)', border: '1px solid var(--db-rowbdr)',
                    borderRadius: 12, padding: '12px 16px', marginBottom: '1.1rem',
                }}>
                    <span style={{ color: 'var(--db-text)', fontSize: 13.5, fontWeight: 700 }}>
                        📦 {subscription.package_name || 'الباقة الحالية'}
                    </span>
                    {subscription.price != null && (
                        <span style={{ color: O, fontSize: 15, fontWeight: 900 }}>
                            {subscription.price} {subscription.currency || 'جنيه'}
                        </span>
                    )}
                </div>
            )}

            <p style={{ color: 'var(--db-muted)', fontSize: 12.5, lineHeight: 1.7, marginBottom: '1rem' }}>
                هل قمت بالتحويل عبر Vodafone Cash أو Instapay؟ يرجى إرفاق صورة إيصال التحويل لتفعيل محاضراتك المشتركة فوراً.
            </p>

            <div style={{ display: 'flex', flexWrap: 'wrap', gap: 10, marginBottom: '1.1rem' }}>
                {PAYMENT_METHODS.map(m => (
                    <button
                        key={m.key}
                        type="button"
                        onClick={() => setSelectedMethod(m.key)}
                        style={{
                            flex: '1 1 160px', textAlign: 'center',
                            padding: '10px 14px', borderRadius: 10,
                            fontSize: 12.5, fontWeight: 700,
                            fontFamily: "'Cairo',sans-serif", cursor: 'pointer',
                            border: `1.5px solid ${selectedMethod === m.key ? O : 'var(--db-rowbdr)'}`,
                            background: selectedMethod === m.key ? `${O}1a` : 'var(--db-row)',
                            color: selectedMethod === m.key ? O : 'var(--db-text)',
                            transition: 'all .2s ease',
                        }}
                    >
                        {m.label}
                    </button>
                ))}
            </div>

            <div style={{
                background: 'var(--db-row)', border: '1px dashed var(--db-rowbdr)',
                borderRadius: 10, padding: '10px 14px', marginBottom: '1.25rem',
                color: 'var(--db-text)', fontSize: 12.5, fontWeight: 700, textAlign: 'center',
            }}>
                حوّل على: <span style={{ color: O, fontWeight: 900 }}>{activeMethod.number}</span>
            </div>

            <form onSubmit={(e) => {
                e.preventDefault();
                const fileInput = document.getElementById('receiptFile');
                if (fileInput.files[0]) {
                    router.post(route('student.receipts.store'), {
                        receipt_image: fileInput.files[0],
                        payment_method: selectedMethod,
                    }, {
                        forceFormData: true,
                        onSuccess: () => {
                            alert('🎉 تم إرسال إيصال التحويل بنجاح! سيتم مراجعته وتفعيل المحاضرات فوراً.');
                            fileInput.value = '';
                        }
                    });
                } else {
                    alert('⚠️ يرجى إرفاق صورة الإيصال أولاً.');
                }
            }} style={{ display: 'flex', flexDirection: 'column', mdDirection: 'row', alignItems: 'center', gap: 16 }}>
                <input
                    type="file"
                    id="receiptFile"
                    accept="image/*"
                    required
                    style={{
                        width: '100%',
                        border: '1px solid var(--db-rowbdr)',
                        borderRadius: 10,
                        padding: '10px 14px',
                        fontSize: 13,
                        background: 'var(--db-row)',
                        color: 'var(--db-text)',
                        fontFamily: 'Cairo, sans-serif'
                    }}
                />
                <button
                    type="submit"
                    style={{
                        width: '100%',
                        background: O,
                        color: '#fff',
                        padding: '12px 24px',
                        borderRadius: 10,
                        fontSize: 13,
                        fontWeight: 800,
                        fontFamily: 'Cairo, sans-serif',
                        border: 'none',
                        cursor: 'pointer',
                        transition: 'opacity 0.2s',
                        whiteSpace: 'nowrap'
                    }}
                    onMouseEnter={e => e.currentTarget.style.opacity = '0.9'}
                    onMouseLeave={e => e.currentTarget.style.opacity = '1'}
                >
                    إرسال الإيصال للإدارة 📤
                </button>
            </form>
        </div>
    );
}
