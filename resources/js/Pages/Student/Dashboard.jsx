import { useState, useEffect, useRef } from 'react';
import { Head, Link, router } from '@inertiajs/react';
import StudentLayout from '@/Layouts/StudentLayout';

/* ── Brand Palette ─────────────────────────────────────── */
<<<<<<< HEAD
const O = '#0D9488';   
const N = '#14213D';
const B = '#DCC9A3';
const W = '#F7F3EB';
const G = '#2DD4BF';   // كان دهبي (C9A14A) → بقى تركواز فاتح (زي حلقة الـ 75% في لوحة الأدمن)
=======
const O = '#F47C20';
const N = '#14213D';
const B = '#DCC9A3';
const W = '#F7F3EB';
const G = '#C9A14A';
>>>>>>> a7d621ecce9a27909d6163081c63c5e4d03bd594

/* ── Stat-card dark gradients (brand) ──────────────────── */
const CARD_BGS = [
    `linear-gradient(145deg,#0A1220 0%,${N} 100%)`,
<<<<<<< HEAD
    `linear-gradient(145deg,#075E54 0%,#0D9488 100%)`,
    `linear-gradient(145deg,#0F766E 0%,#14B8A6 100%)`,
    `linear-gradient(145deg,#083344 0%,#0E7490 100%)`,
=======
    `linear-gradient(145deg,#7A3208 0%,#B85610 100%)`,
    `linear-gradient(145deg,#5A3A08 0%,#9A6B18 100%)`,
    `linear-gradient(145deg,#2C1800 0%,#5A3410 100%)`,
>>>>>>> a7d621ecce9a27909d6163081c63c5e4d03bd594
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

<<<<<<< HEAD
/* ── Twinkling white star particles for the stat cards ──── */
const CARD_PARTICLES = [
    { x: 8,  y: 24, s: 2.5, d: 0,    t: 5.5 },
    { x: 22, y: 66, s: 1.6, d: 900,  t: 6.8 },
    { x: 34, y: 14, s: 2,   d: 400,  t: 7.4 },
    { x: 47, y: 78, s: 1.4, d: 1500, t: 5.9 },
    { x: 58, y: 34, s: 2.8, d: 300,  t: 8.2 },
    { x: 66, y: 60, s: 1.7, d: 1900, t: 6.2 },
    { x: 74, y: 18, s: 2.1, d: 700,  t: 7.1 },
    { x: 83, y: 72, s: 1.5, d: 1200, t: 6.5 },
    { x: 90, y: 40, s: 2.4, d: 200,  t: 7.8 },
    { x: 95, y: 86, s: 1.3, d: 2200, t: 5.6 },
    { x: 15, y: 88, s: 1.9, d: 1700, t: 8.6 },
    { x: 52, y: 52, s: 1.2, d: 2600, t: 6.9 },
];

/* ── Scroll + Quill image icon (منظر الريشة والمخطوطة) ──── */
function QuillScroll() {
    return (
        <img
            src="/images/quill-scroll.png"
            alt=""
            width={104}
            height={104}
            draggable={false}
            style={{ display: 'block', width: 104, height: 104, objectFit: 'contain' }}
        />
    );
}

/* ── Flat (unfolded) paper icon — Payment card ───────────── */
function PaymentIconSVG({ pid, accent }) {
    return (
        <svg viewBox="0 0 56 56" width="30" height="30">
            <defs>
                <linearGradient id={`pf${pid}`} x1="0%" y1="0%" x2="100%" y2="100%">
                    <stop offset="0%"   stopColor="#FBF3DD"/>
                    <stop offset="100%" stopColor="#E4D6A8"/>
                </linearGradient>
                <radialGradient id={`coin${pid}`} cx="35%" cy="30%" r="75%">
                    <stop offset="0%"   stopColor="#F7E568"/>
                    <stop offset="100%" stopColor="#B8912C"/>
                </radialGradient>
            </defs>

            {/* fully flat, unfolded sheet — no dog-ear, no wrinkle */}
            <rect x="7" y="5" width="32" height="44" rx="3"
                fill={`url(#pf${pid})`} stroke="rgba(0,0,0,.1)" strokeWidth="1"/>

            {/* printed lines */}
            {[15, 21, 27, 33, 39].map((y, i) => (
                <line key={i} x1="13" y1={y} x2={i % 2 ? 33 : 29} y2={y}
                    stroke="rgba(80,64,34,.42)" strokeWidth="1.4"/>
            ))}

            {/* coin / payment badge */}
            <circle cx="41" cy="42" r="11" fill={`url(#coin${pid})`} stroke="#8E6410" strokeWidth="1"/>
            <text x="41" y="46" textAnchor="middle" fontSize="11" fontWeight="900" fill="#5b4409">$</text>
            <circle cx="41" cy="42" r="11" fill={accent} opacity=".16"/>
=======
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
>>>>>>> a7d621ecce9a27909d6163081c63c5e4d03bd594
        </svg>
    );
}

<<<<<<< HEAD
/* ── Flat (unfolded) paper + realistic mini quill — Sheets card ── */
function SheetIconSVG({ pid, accent }) {
    return (
        <svg viewBox="0 0 56 56" width="30" height="30">
            <defs>
                <linearGradient id={`sf${pid}`} x1="0%" y1="0%" x2="100%" y2="100%">
                    <stop offset="0%"   stopColor="#FBF3DD"/>
                    <stop offset="100%" stopColor="#E4D6A8"/>
                </linearGradient>
                <linearGradient id={`vaneMini${pid}`} x1="0%" y1="0%" x2="100%" y2="100%">
                    <stop offset="0%"   stopColor="#F7F3EB"/>
                    <stop offset="60%"  stopColor="#C9C2B4"/>
                    <stop offset="100%" stopColor="#8B8378"/>
                </linearGradient>
            </defs>

            {/* fully flat, unfolded sheet — no dog-ear, no wrinkle */}
            <rect x="6" y="5" width="34" height="44" rx="3"
                fill={`url(#sf${pid})`} stroke="rgba(0,0,0,.1)" strokeWidth="1"/>

            {/* printed lines */}
            {[13, 19, 25, 31, 37, 43].map((y, i) => (
                <line key={i} x1="12" y1={y} x2={i % 2 ? 34 : 30} y2={y}
                    stroke="rgba(80,64,34,.42)" strokeWidth="1.3"/>
            ))}

            {/* realistic mini feather resting diagonally, with barb texture */}
            <g transform="translate(30,2) rotate(28)">
                <line x1="14" y1="0" x2="0" y2="38" stroke="rgba(0,0,0,.3)" strokeWidth=".8"/>
                <path d="M14,0 C6,2 -2,9 -4,18 C-5,23 -2,27 3,28 C7,24 12,16 15,9 C16,6 15,2 14,0 Z"
                    fill={`url(#vaneMini${pid})`}/>
                {[0.25, 0.45, 0.65].map((t, i) => {
                    const x1 = 14 + (-4 - 14) * t, y1 = 0 + (18 - 0) * t;
                    return (
                        <line key={i} x1={x1} y1={y1} x2={x1 - 6} y2={y1 - 2}
                            stroke="rgba(255,255,255,.35)" strokeWidth=".5"/>
                    );
                })}
                <polygon points="3,28 0,33 -3,38" fill="#C9A24A"/>
            </g>
            <circle cx="10" cy="46" r="4" fill={accent} opacity=".18"/>
        </svg>
    );
}

/* ── Arabic reed-pen line-art watermark ──────────────────── */
function QuillWatermarkSVG() {
    return (
        <svg viewBox="0 0 200 200" width="130" height="130" fill="none"
            stroke="currentColor" strokeWidth="4" strokeLinecap="round" strokeLinejoin="round">
            {/* reed pen body */}
            <line x1="170" y1="20" x2="60" y2="130"/>
            <line x1="60" y1="130" x2="40" y2="150"/>
            <line x1="50" y1="140" x2="30" y2="160"/>
            {/* nib split */}
            <line x1="55" y1="125" x2="35" y2="155"/>
            {/* flowing calligraphic swirl beneath */}
            <path d="M20,175 C50,165 70,185 100,170 C130,155 150,175 180,160"/>
            <path d="M25,190 C55,180 80,195 110,182"/>
        </svg>
    );
}

const FEATHER_ICONS = [
    <QuillScroll key="f0"/>,
    <QuillScroll key="f1"/>,
    <QuillScroll key="f2"/>,
    <QuillScroll key="f3"/>,
=======
const PYRAMID_ICONS = [
    <PyramidSVG key="p0" pid="n" accent={N}/>,
    <PyramidSVG key="p1" pid="o" accent={O}/>,
    <PyramidSVG key="p2" pid="g" accent={G}/>,
    <PyramidSVG key="p3" pid="b" accent={B}/>,
>>>>>>> a7d621ecce9a27909d6163081c63c5e4d03bd594
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
<<<<<<< HEAD
                    background: `linear-gradient(135deg, ${O}, #0b6b62)`,
=======
                    background: `linear-gradient(135deg, ${O}, #c45e0a)`,
>>>>>>> a7d621ecce9a27909d6163081c63c5e4d03bd594
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
<<<<<<< HEAD
                    boxShadow: '4px 0 20px rgba(13,148,136,0.4)',
=======
                    boxShadow: '4px 0 20px rgba(244,124,32,0.4)',
>>>>>>> a7d621ecce9a27909d6163081c63c5e4d03bd594
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
<<<<<<< HEAD
                    borderRight: `1px solid rgba(45,212,191,0.25)`,
                    boxShadow: '8px 0 40px rgba(0,0,0,0.5), inset -1px 0 0 rgba(45,212,191,0.1)',
=======
                    borderRight: `1px solid rgba(201,161,74,0.25)`,
                    boxShadow: '8px 0 40px rgba(0,0,0,0.5), inset -1px 0 0 rgba(201,161,74,0.1)',
>>>>>>> a7d621ecce9a27909d6163081c63c5e4d03bd594
                    transition: 'left 0.35s cubic-bezier(.4,0,.2,1)',
                    overflowY: 'auto',
                    display: 'flex',
                    flexDirection: 'column',
                }}
            >
                {/* Sidebar header */}
                <div style={{
                    padding: '24px 20px 16px',
<<<<<<< HEAD
                    borderBottom: 'rgba(45,212,191,0.15) solid 1px',
                    background: 'linear-gradient(135deg, rgba(45,212,191,0.08), transparent)',
=======
                    borderBottom: 'rgba(201,161,74,0.15) solid 1px',
                    background: 'linear-gradient(135deg, rgba(201,161,74,0.08), transparent)',
>>>>>>> a7d621ecce9a27909d6163081c63c5e4d03bd594
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
<<<<<<< HEAD
                                borderBottom: '1px solid rgba(45,212,191,0.07)',
=======
                                borderBottom: '1px solid rgba(201,161,74,0.07)',
>>>>>>> a7d621ecce9a27909d6163081c63c5e4d03bd594
                                transition: 'all 0.2s ease',
                                animation: `sidebarSlideIn 0.35s ${i * 60}ms both`,
                                position: 'relative',
                            }}
<<<<<<< HEAD
                            onMouseEnter={e => { e.currentTarget.style.background = 'rgba(13,148,136,0.1)'; e.currentTarget.style.paddingLeft = '26px'; }}
=======
                            onMouseEnter={e => { e.currentTarget.style.background = 'rgba(244,124,32,0.1)'; e.currentTarget.style.paddingLeft = '26px'; }}
>>>>>>> a7d621ecce9a27909d6163081c63c5e4d03bd594
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
<<<<<<< HEAD
                    borderTop: '1px solid rgba(45,212,191,0.12)',
                    background: 'rgba(0,0,0,0.2)',
                    flexShrink: 0,
                }}>
                    <div style={{ color: 'rgba(45,212,191,0.4)', fontSize: 10, textAlign: 'center', fontFamily: "'Cairo',sans-serif", letterSpacing: '.1em' }}>
=======
                    borderTop: '1px solid rgba(201,161,74,0.12)',
                    background: 'rgba(0,0,0,0.2)',
                    flexShrink: 0,
                }}>
                    <div style={{ color: 'rgba(201,161,74,0.4)', fontSize: 10, textAlign: 'center', fontFamily: "'Cairo',sans-serif", letterSpacing: '.1em' }}>
>>>>>>> a7d621ecce9a27909d6163081c63c5e4d03bd594
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
<<<<<<< HEAD
                @keyframes dust {
                    0%   { transform: translate(0,0) }
                    25%  { transform: translate(6px,-10px) }
                    50%  { transform: translate(-4px,-18px) }
                    75%  { transform: translate(-8px,-8px) }
                    100% { transform: translate(0,0) }
                }
                @keyframes twinkle {
                    0%,100% { opacity:.15 }
                    50%     { opacity:1 }
                }
=======
>>>>>>> a7d621ecce9a27909d6163081c63c5e4d03bd594
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
<<<<<<< HEAD
                    --db-border: rgba(45,212,191,.35);
=======
                    --db-border: rgba(220,201,163,.35);
>>>>>>> a7d621ecce9a27909d6163081c63c5e4d03bd594
                    --db-row:    #F8FAFC;
                    --db-rowbdr: #E2E8F0;
                    --db-text:   #14213D;
                    --db-muted:  #64748B;
                    --db-shadow: rgba(20,33,61,.07);
                    --db-sub:    rgba(20,33,61,.45);
                }
                .dark {
                    --db-card:   #0d1c30;
<<<<<<< HEAD
                    --db-border: rgba(45,212,191,.18);
=======
                    --db-border: rgba(201,161,74,.18);
>>>>>>> a7d621ecce9a27909d6163081c63c5e4d03bd594
                    --db-row:    rgba(255,255,255,.05);
                    --db-rowbdr: rgba(255,255,255,.08);
                    --db-text:   #e8dfc8;
                    --db-muted:  #8a96aa;
                    --db-shadow: rgba(0,0,0,.35);
<<<<<<< HEAD
                    --db-sub:    rgba(45,212,191,.5);
=======
                    --db-sub:    rgba(220,201,163,.5);
>>>>>>> a7d621ecce9a27909d6163081c63c5e4d03bd594
                }
            `}</style>

            {/* ════════════════════════════════════════
                HERO BANNER
            ════════════════════════════════════════ */}
            <div style={{
                position:'relative',
                background:`
<<<<<<< HEAD
                    radial-gradient(ellipse at 70% 50%, rgba(13,148,136,.12) 0%, transparent 55%),
                    radial-gradient(ellipse at 20% 30%, rgba(45,212,191,.08) 0%, transparent 50%),
=======
                    radial-gradient(ellipse at 70% 50%, rgba(244,124,32,.12) 0%, transparent 55%),
                    radial-gradient(ellipse at 20% 30%, rgba(201,161,74,.08) 0%, transparent 50%),
>>>>>>> a7d621ecce9a27909d6163081c63c5e4d03bd594
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
<<<<<<< HEAD
                        background:`radial-gradient(circle,#8CF0DC,${G})`,
=======
                        background:`radial-gradient(circle,#F0DC88,${G})`,
>>>>>>> a7d621ecce9a27909d6163081c63c5e4d03bd594
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
<<<<<<< HEAD
                                background:`linear-gradient(135deg,${O},#0b6b62)`,
=======
                                background:`linear-gradient(135deg,${O},#C4600E)`,
>>>>>>> a7d621ecce9a27909d6163081c63c5e4d03bd594
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
<<<<<<< HEAD
                paddingTop:28,  /* room for overhanging feather icon */
            }}>
                <AnimStatCard icon={FEATHER_ICONS[0]} label="إجمالي المحاضرات"  value={stats.total_lessons}      color={G}   delay={100} idx={0}/>
                <AnimStatCard icon={FEATHER_ICONS[1]} label="محاضرات مكتملة"    value={stats.completed}          color={O}   delay={200} idx={1}/>
                <AnimStatCard icon={FEATHER_ICONS[2]} label="محاضرات مفتوحة"    value={stats.unlocked}           color={G}   delay={300} idx={2}/>
                <AnimStatCard icon={FEATHER_ICONS[3]} label="متوسط الاختبارات"  value={`${stats.quiz_average}%`} color={O}   delay={400} idx={3}/>
=======
                paddingTop:28,  /* room for overhanging pyramids */
            }}>
                <AnimStatCard icon={PYRAMID_ICONS[0]} label="إجمالي المحاضرات"  value={stats.total_lessons}      color={G}   delay={100} idx={0}/>
                <AnimStatCard icon={PYRAMID_ICONS[1]} label="محاضرات مكتملة"    value={stats.completed}          color={O}   delay={200} idx={1}/>
                <AnimStatCard icon={PYRAMID_ICONS[2]} label="محاضرات مفتوحة"    value={stats.unlocked}           color={G}   delay={300} idx={2}/>
                <AnimStatCard icon={PYRAMID_ICONS[3]} label="متوسط الاختبارات"  value={`${stats.quiz_average}%`} color={O}   delay={400} idx={3}/>
>>>>>>> a7d621ecce9a27909d6163081c63c5e4d03bd594
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
<<<<<<< HEAD
                    href={route('student.lessons')} accent={O} mark={<QuillWatermarkSVG/>} delay={0}/>
                <QuickCard icon="📝" title="الامتحانات"     desc="اطّلع على جميع امتحاناتك ونتائجك"
                    href={route('student.exams')}   accent={G} mark="⚔️" delay={100}/>
                <QuickCard icon={<SheetIconSVG pid="qs" accent={G}/>} title="الشيتات"        desc="حمّل شيتات الدروس وتابع نتائجك"
                    href={route('student.sheets')}  accent={G} mark="📜" delay={200}/>
                {student.mode === 'offline' ? (
                    <>
                        <LockedQuickCard icon={<PaymentIconSVG pid="qpl" accent={O}/>} title="نظام الدفع"  desc="ارفع إيصال التحويل وتابع حالة اشتراكك"  accent={O} mark="💳" delay={300}/>
=======
                    href={route('student.lessons')} accent={O} mark="🏛️" delay={0}/>
                <QuickCard icon="📝" title="الامتحانات"     desc="اطّلع على جميع امتحاناتك ونتائجك"
                    href={route('student.exams')}   accent={G} mark="⚔️" delay={100}/>
                <QuickCard icon="📄" title="الشيتات"        desc="حمّل شيتات الدروس وتابع نتائجك"
                    href={route('student.sheets')}  accent={B} mark="📜" delay={200}/>
                {student.mode === 'offline' ? (
                    <>
                        <LockedQuickCard icon="🧾" title="نظام الدفع"  desc="ارفع إيصال التحويل وتابع حالة اشتراكك"  accent={O} mark="💳" delay={300}/>
>>>>>>> a7d621ecce9a27909d6163081c63c5e4d03bd594
                        <LockedQuickCard icon="📜" title="سجل الدفع"   desc="راجع طلبات الدفع السابقة وحالتها"        accent={G} mark="🧾" delay={400}/>
                    </>
                ) : (
                    <>
<<<<<<< HEAD
                        <QuickCard icon={<PaymentIconSVG pid="qp" accent={O}/>} title="نظام الدفع"     desc="ارفع إيصال التحويل وتابع حالة اشتراكك"
=======
                        <QuickCard icon="🧾" title="نظام الدفع"     desc="ارفع إيصال التحويل وتابع حالة اشتراكك"
>>>>>>> a7d621ecce9a27909d6163081c63c5e4d03bd594
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

<<<<<<< HEAD
/* ── Floating white star particles (نقط بيضاء متحركة ومتلألئة) ── */
function TwinkleParticles({ hov }) {
    return (
        <div style={{ position: 'absolute', inset: 0, pointerEvents: 'none', overflow: 'hidden' }}>
            {CARD_PARTICLES.map((p, i) => (
                <span
                    key={i}
                    style={{
                        position: 'absolute',
                        left: `${p.x}%`,
                        top: `${p.y}%`,
                        width: p.s,
                        height: p.s,
                        borderRadius: '50%',
                        background: '#fff',
                        opacity: 0,
                        boxShadow: `0 0 ${p.s * 3}px ${p.s}px rgba(255,255,255,${hov ? 0.8 : 0.5})`,
                        animation: `dust ${p.t}s ease-in-out ${p.d}ms infinite, twinkle ${(p.t / 2.4).toFixed(2)}s ease-in-out ${p.d}ms infinite`,
                    }}
                />
            ))}
        </div>
    );
}

=======
>>>>>>> a7d621ecce9a27909d6163081c63c5e4d03bd594
function AnimStatCard({ icon, label, value, color, delay, idx = 0 }) {
    const [hov, setHov] = useState(false);
    const count = useCount(value, delay);
    const bg    = CARD_BGS[idx % 4];

    return (
<<<<<<< HEAD
        /* Outer wrapper — feather hangs from top-left, partly inside card */
=======
        /* Outer wrapper — pyramid hangs from top-left, partly inside card */
>>>>>>> a7d621ecce9a27909d6163081c63c5e4d03bd594
        <div
            onMouseEnter={()=>setHov(true)}
            onMouseLeave={()=>setHov(false)}
            style={{
                position:'relative',
                animation:`db-up .6s ${delay}ms both`,
<<<<<<< HEAD
                paddingTop: 12,   /* small — most of icon is inside card */
=======
                paddingTop: 12,   /* small — most of pyramid is inside card */
>>>>>>> a7d621ecce9a27909d6163081c63c5e4d03bd594
                paddingLeft: 4,
                cursor:'default',
            }}
        >
<<<<<<< HEAD
            {/* ── Icon — top-left, most of it inside card, overhanging slightly ── */}
            <div style={{
                position:'absolute',
                top: -14, left: -10,
                zIndex: 4, pointerEvents:'none',
                opacity: hov ? 1 : 0.92,
                filter: hov
                    ? `drop-shadow(0 0 14px ${color}) drop-shadow(0 10px 24px rgba(0,0,0,.6))`
                    : `drop-shadow(0 6px 14px rgba(0,0,0,.55))`,
                transform: hov
                    ? 'rotate(-4deg) scale(1.07) translate(-2px,-5px)'
                    : 'rotate(-6deg) scale(1)',
=======
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
>>>>>>> a7d621ecce9a27909d6163081c63c5e4d03bd594
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
<<<<<<< HEAD
                {/* floating white twinkling particles */}
                <TwinkleParticles hov={hov}/>
=======
>>>>>>> a7d621ecce9a27909d6163081c63c5e4d03bd594
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

<<<<<<< HEAD
                {/* Content — pushed right & down to clear icon overlap */}
=======
                {/* Content — pushed right & down to clear pyramid overlap */}
>>>>>>> a7d621ecce9a27909d6163081c63c5e4d03bd594
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
<<<<<<< HEAD
        open:     { label:'✅ مفتوح',      bg:`${G}18`, c:'#0f766e' },
=======
        open:     { label:'✅ مفتوح',      bg:`${G}18`, c:'#7A5A00' },
>>>>>>> a7d621ecce9a27909d6163081c63c5e4d03bd594
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
<<<<<<< HEAD
            ? { label:`مصحح ✅${sheet.answer.score!=null?` · ${sheet.answer.score}`:''}`, bg:`${G}18`, c:'#0f766e' }
=======
            ? { label:`مصحح ✅${sheet.answer.score!=null?` · ${sheet.answer.score}`:''}`, bg:`${G}18`, c:'#6B4E00' }
>>>>>>> a7d621ecce9a27909d6163081c63c5e4d03bd594
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
<<<<<<< HEAD
                color:`rgba(45,212,191,.35)`, fontSize:12.5,
=======
                color:`rgba(220,201,163,.35)`, fontSize:12.5,
>>>>>>> a7d621ecce9a27909d6163081c63c5e4d03bd594
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
<<<<<<< HEAD
}
=======
}
>>>>>>> a7d621ecce9a27909d6163081c63c5e4d03bd594
