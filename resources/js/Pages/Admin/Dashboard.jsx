import React, { useEffect, useRef, useState } from 'react';
import { Link } from '@inertiajs/react';
import AdminLayout from '@/Layouts/AdminLayout';
import gsap from 'gsap';
import ReceiptsReviewModal from '@/Components/ReceiptsReviewModal';
import PaymentNumbersEditor from '@/Components/PaymentNumbersEditor';

/* ═══════════════════════════════════════════════════
   زخارف عربية — هوية بصرية مستوحاة من فن العمارة
   والزخرفة الإسلامية (عِوَضًا عن الأعمدة اليونانية القديمة)
═══════════════════════════════════════════════════ */

/** قوس نصف دائري متدرّج — بديل الشريط المستقيم أعلى الكروت */
function ArchAccent({ id, accent, height = 16 }) {
    return (
        <svg viewBox="0 0 100 16" preserveAspectRatio="none"
            style={{ position: 'absolute', top: 0, left: 0, width: '100%', height, pointerEvents: 'none' }}>
            <defs>
                <linearGradient id={id} x1="0" y1="0" x2="1" y2="0">
                    <stop offset="0%" stopColor={accent} stopOpacity="0.85" />
                    <stop offset="100%" stopColor={accent} stopOpacity="0.15" />
                </linearGradient>
            </defs>
            <path d="M0,16 Q50,0 100,16 Z" fill={`url(#${id})`} opacity="0.55" />
        </svg>
    );
}

/** فاصلة زخرفية على هيئة معينة (فاصل الفصول في المخطوطات العربية) */
function SectionMark({ color = '#2fbcd4', size = 17 }) {
    return (
        <svg width={size} height={size} viewBox="0 0 18 18" fill="none" style={{ flexShrink: 0 }}>
            <rect x="4" y="4" width="10" height="10" transform="rotate(45 9 9)" stroke={color} strokeWidth="1.6" />
            <circle cx="9" cy="9" r="1.8" fill={color} />
        </svg>
    );
}

/** عنوان قسم بطراز "فاصل الفصول" — معينة + عنوان + خط ممتد */
function SectionHeading({ title, action, color = '#2fbcd4' }) {
    return (
        <div style={{ display: 'flex', alignItems: 'center', gap: 14, marginBottom: 13 }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 10, flex: 1, minWidth: 0 }}>
                <SectionMark color={color} />
                <h2 style={{ color: 'var(--a-text)', fontWeight: 900, fontSize: 16, fontFamily: 'Cairo, sans-serif', whiteSpace: 'nowrap' }}>{title}</h2>
                <div style={{ flex: 1, height: 1, minWidth: 20, background: 'linear-gradient(90deg, var(--a-border), transparent)' }} />
            </div>
            {action}
        </div>
    );
}

/** مسّة قلم — زخرفة خطّية مستوحاة من الخط العربي */
function PenFlourish({ width = 46, height = 12, color = '#2fbcd4', strokeWidth = 1.8 }) {
    return (
        <svg width={width} height={height} viewBox="0 0 46 12" fill="none">
            <path d="M2 9 C 10 2, 18 2, 24 6 S 38 10, 44 4" stroke={color} strokeWidth={strokeWidth} strokeLinecap="round" />
            <circle cx="44" cy="4" r={strokeWidth} fill={color} />
        </svg>
    );
}

/** أقواس متداخلة بطراز "المحراب" + نجمة ثمانية — واجهة الهيرو */
function MihrabMotif({ opacity = 0.1 }) {
    return (
        <svg style={{ position: 'absolute', left: 0, bottom: 0, height: '100%', width: 'auto', opacity, pointerEvents: 'none' }}
            viewBox="0 0 320 155" preserveAspectRatio="xMinYMax meet" xmlns="http://www.w3.org/2000/svg">
            <line x1="10" y1="153" x2="310" y2="153" stroke="white" strokeWidth="1" opacity="0.5" />
            <path d="M20 155 L20 95 Q20 25 90 25 Q160 25 160 95 L160 155" fill="none" stroke="white" strokeWidth="2" opacity="0.55" />
            <path d="M45 155 L45 98 Q45 45 90 45 Q135 45 135 98 L135 155" fill="none" stroke="white" strokeWidth="1.4" opacity="0.4" />
            <path d="M68 155 L68 100 Q68 62 90 62 Q112 62 112 100 L112 155" fill="none" stroke="white" strokeWidth="1" opacity="0.3" />
            <g transform="translate(90,38)" opacity="0.5">
                <rect x="-7" y="-7" width="14" height="14" transform="rotate(45 0 0)" fill="none" stroke="white" strokeWidth="1" />
                <rect x="-7" y="-7" width="14" height="14" fill="none" stroke="white" strokeWidth="1" />
            </g>
            <path d="M190 155 L190 115 Q190 75 225 75 Q260 75 260 115 L260 155" fill="none" stroke="white" strokeWidth="1.2" opacity="0.28" />
            <path d="M270 155 L270 120 Q270 90 295 90 Q320 90 320 120 L320 155" fill="none" stroke="white" strokeWidth="1" opacity="0.2" />
        </svg>
    );
}

/* ═══════════════════════════════════════════════════
   COUNT-UP HOOK
═══════════════════════════════════════════════════ */
function useCountUp(target, duration = 1.6, delay = 0) {
    const ref = useRef(null);
    useEffect(() => {
        const el = ref.current;
        if (!el || typeof target !== 'number') return;
        const obj = { val: 0 };
        gsap.to(obj, {
            val: target, duration, delay, ease: 'power2.out',
            onUpdate() { if (el) el.textContent = Math.round(obj.val).toLocaleString('ar-EG'); },
        });
    }, [target, duration, delay]);
    return ref;
}

/* ═══════════════════════════════════════════════════
   STAT CARD  — white in light / dark card in dark
═══════════════════════════════════════════════════ */
function StatCard({ svgContent, label, value, sub, accent, delay = 0, suffix = '' }) {
    const numRef  = useCountUp(value, 1.6, delay);
    const cardRef = useRef(null);
    const archId  = useRef(`sc-arch-${Math.random().toString(36).slice(2)}`).current;

    const onEnter = () => {
        if (!cardRef.current) return;
        gsap.to(cardRef.current, { y: -5, duration: 0.22, ease: 'power2.out' });
        cardRef.current.style.boxShadow = `0 16px 40px var(--a-shadow-lg), 0 0 0 1.5px ${accent}40`;
    };
    const onLeave = () => {
        if (!cardRef.current) return;
        gsap.to(cardRef.current, { y: 0, duration: 0.22, ease: 'power2.out' });
        cardRef.current.style.boxShadow = '0 2px 12px var(--a-shadow), 0 0 0 1px var(--a-border)';
    };

    return (
        <div ref={cardRef} onMouseEnter={onEnter} onMouseLeave={onLeave} style={{
            background: 'var(--a-card)', borderRadius: 20, padding: '22px 20px',
            position: 'relative', overflow: 'hidden', cursor: 'default',
            boxShadow: '0 2px 12px var(--a-shadow), 0 0 0 1px var(--a-border)',
            transition: 'box-shadow 0.22s ease',
        }}>
            {/* قوس زخرفي أعلى الكرت — بديل الشريط المستقيم */}
            <ArchAccent id={archId} accent={accent} />
            {/* BG orb */}
            <div style={{ position: 'absolute', bottom: -20, left: -20, width: 90, height: 90, borderRadius: '50%', background: `radial-gradient(circle, ${accent}10, transparent)`, pointerEvents: 'none' }} />

            <div style={{ display: 'flex', alignItems: 'flex-start', gap: 14, position: 'relative' }}>
                {/* Icon */}
                <div style={{ width: 46, height: 46, borderRadius: 14, flexShrink: 0, display: 'flex', alignItems: 'center', justifyContent: 'center', background: `linear-gradient(135deg, ${accent}20, ${accent}0d)`, boxShadow: `0 0 0 1px ${accent}30, 0 4px 16px ${accent}18` }}>
                    <svg viewBox="0 0 24 24" fill="none" stroke={accent} strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" width={21} height={21}
                        dangerouslySetInnerHTML={{ __html: svgContent }} />
                </div>
                <div style={{ flex: 1 }}>
                    <p style={{ color: 'var(--a-text-4)', fontSize: 12, fontWeight: 600, fontFamily: 'Cairo, sans-serif' }}>{label}</p>
                    <div style={{ display: 'flex', alignItems: 'baseline', gap: 4, marginTop: 5 }}>
                        <span ref={numRef} style={{ color: 'var(--a-text)', fontSize: 28, fontWeight: 900, fontFamily: 'Cairo, sans-serif', lineHeight: 1 }}>0</span>
                        {suffix && <span style={{ color: 'var(--a-text-4)', fontSize: 12, fontWeight: 600, fontFamily: 'Cairo, sans-serif' }}>{suffix}</span>}
                    </div>
                    {sub && (
                        <p style={{ color: 'var(--a-text-4)', fontSize: 10.5, marginTop: 4, fontFamily: 'Cairo, sans-serif', display: 'flex', alignItems: 'center', gap: 3 }}>
                            <span style={{ color: accent, fontWeight: 800 }}>↑</span>{sub}
                        </p>
                    )}
                </div>
            </div>
        </div>
    );
}

/* ═══════════════════════════════════════════════════
   AREA CHART
═══════════════════════════════════════════════════ */
function AreaChart({ data }) {
    const [tooltip, setTooltip] = useState(null);
    const pathRef = useRef(null);
    const W = 780, H = 180, pad = { t: 18, r: 16, b: 28, l: 8 };

    const vals = data.map(d => d.revenue ?? 0);
    const maxV = Math.max(...vals, 1);
    const pts  = vals.map((v, i) => ({
        x: pad.l + (i / (Math.max(vals.length - 1, 1))) * (W - pad.l - pad.r),
        y: pad.t + (1 - v / maxV) * (H - pad.t - pad.b),
    }));

    const curve = (ps) => {
        if (!ps.length) return '';
        let d = `M ${ps[0].x} ${ps[0].y}`;
        for (let i = 0; i < ps.length - 1; i++) {
            const mx = (ps[i].x + ps[i + 1].x) / 2;
            d += ` C ${mx} ${ps[i].y} ${mx} ${ps[i + 1].y} ${ps[i + 1].x} ${ps[i + 1].y}`;
        }
        return d;
    };

    const line = curve(pts);
    const area = line + ` L ${pts[pts.length - 1]?.x ?? W} ${H - pad.b} L ${pts[0]?.x ?? 0} ${H - pad.b} Z`;

    useEffect(() => {
        if (!pathRef.current) return;
        const len = pathRef.current.getTotalLength?.() || 900;
        gsap.fromTo(pathRef.current,
            { strokeDasharray: len, strokeDashoffset: len },
            { strokeDashoffset: 0, duration: 1.6, delay: 0.4, ease: 'power2.out' }
        );
    }, [data]);

    return (
        <div style={{ position: 'relative' }}>
            <svg viewBox={`0 0 ${W} ${H}`} preserveAspectRatio="none"
                style={{ width: '100%', height: 180, display: 'block', overflow: 'visible' }}>
                <defs>
                    <linearGradient id="ag" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="0%"   stopColor="#2fbcd4" stopOpacity="0.28" />
                        <stop offset="65%"  stopColor="#2fbcd4" stopOpacity="0.06" />
                        <stop offset="100%" stopColor="#2fbcd4" stopOpacity="0" />
                    </linearGradient>
                    <filter id="glow">
                        <feGaussianBlur stdDeviation="2.5" result="b"/>
                        <feMerge><feMergeNode in="b"/><feMergeNode in="SourceGraphic"/></feMerge>
                    </filter>
                </defs>

                {[0.25, 0.5, 0.75].map(f => {
                    const y = pad.t + (1 - f) * (H - pad.t - pad.b);
                    return <line key={f} x1={pad.l} y1={y} x2={W - pad.r} y2={y}
                        stroke="var(--a-chart-grid)" strokeWidth="0.5" strokeDasharray="5 5" />;
                })}

                <path d={area} fill="url(#ag)" />
                <path ref={pathRef} d={line} fill="none" stroke="#2fbcd4" strokeWidth="2.5"
                    strokeLinecap="round" filter="url(#glow)" />

                {data.map((d, i) => (
                    <text key={i} x={pts[i]?.x ?? 0} y={H - 5}
                        textAnchor="middle" fontSize="9" fill="var(--a-chart-label)"
                        fontFamily="Cairo, sans-serif">{d.month}</text>
                ))}

                {pts.map((pt, i) => (
                    <g key={i} onMouseEnter={() => setTooltip({ ...data[i], x: pt.x, y: pt.y })}
                        onMouseLeave={() => setTooltip(null)} style={{ cursor: 'crosshair' }}>
                        <circle cx={pt.x} cy={pt.y} r={14} fill="transparent" />
                        <rect x={pt.x - 4.2} y={pt.y - 4.2} width={8.4} height={8.4}
                            transform={`rotate(45 ${pt.x} ${pt.y})`}
                            fill="var(--a-card)" stroke="#2fbcd4" strokeWidth="2.2"
                            style={{ filter: 'drop-shadow(0 0 5px rgba(47,188,212,0.7))' }} />
                    </g>
                ))}
            </svg>

            {tooltip && (
                <div style={{
                    position: 'absolute',
                    left: `${(tooltip.x / W) * 100}%`, top: `${(tooltip.y / H) * 100}%`,
                    transform: 'translate(-50%, -130%)',
                    background: '#0d1829', color: '#fff',
                    padding: '7px 13px', borderRadius: 11, fontSize: 12, fontWeight: 700,
                    fontFamily: 'Cairo, sans-serif', whiteSpace: 'nowrap', pointerEvents: 'none', zIndex: 10,
                    boxShadow: '0 6px 20px rgba(0,0,0,0.4)', border: '1px solid rgba(47,188,212,0.4)',
                }}>
                    <div style={{ color: '#2fbcd4', marginBottom: 2 }}>{tooltip.month}</div>
                    <div>{(tooltip.revenue ?? 0).toLocaleString('ar-EG')} ج.م</div>
                    <div style={{ position: 'absolute', bottom: -5, left: '50%', transform: 'translateX(-50%)', borderLeft: '5px solid transparent', borderRight: '5px solid transparent', borderTop: '5px solid #0d1829' }} />
                </div>
            )}
        </div>
    );
}

/* ═══════════════════════════════════════════════════
   DONUT CHART
═══════════════════════════════════════════════════ */
function DonutChart({ online, offline }) {
    const total  = (online || 0) + (offline || 0) || 1;
    const pct    = online / total;
    const r = 52, cx = 68, cy = 68, circ = 2 * Math.PI * r;
    const dash   = pct * circ;
    const arcRef = useRef(null);

    useEffect(() => {
        if (!arcRef.current) return;
        gsap.fromTo(arcRef.current,
            { strokeDashoffset: circ },
            { strokeDashoffset: circ - dash, duration: 1.4, delay: 0.5, ease: 'power2.out' }
        );
    }, [online, offline]);

    return (
        <div style={{ display: 'flex', alignItems: 'center', gap: 18 }}>
            <svg width={136} height={136} viewBox="0 0 136 136" style={{ flexShrink: 0 }}>
                <defs>
                    <linearGradient id="dg" x1="0%" y1="0%" x2="100%" y2="100%">
                        <stop offset="0%" stopColor="#2fbcd4" /><stop offset="100%" stopColor="#009688" />
                    </linearGradient>
                </defs>
                <circle cx={cx} cy={cy} r={r} fill="none" stroke="var(--a-donut-track)" strokeWidth={15} />
                <circle ref={arcRef} cx={cx} cy={cy} r={r} fill="none" stroke="url(#dg)" strokeWidth={15}
                    strokeLinecap="round" strokeDasharray={`${dash} ${circ - dash}`} strokeDashoffset={circ}
                    transform={`rotate(-90 ${cx} ${cy})`}
                    style={{ filter: 'drop-shadow(0 0 6px rgba(47,188,212,0.45))' }} />
                <text x={cx} y={cy - 5} textAnchor="middle" fontSize="17" fontWeight="900"
                    fill="var(--a-text)" fontFamily="Cairo, sans-serif">{Math.round(pct * 100)}%</text>
                <text x={cx} y={cy + 12} textAnchor="middle" fontSize="8.5" fill="var(--a-text-4)"
                    fontFamily="Cairo, sans-serif">متصل الآن</text>
            </svg>

            <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
                {[
                    { label: 'متصلون',      val: online  ?? 0, color: '#2fbcd4', glow: true  },
                    { label: 'غير متصلين',  val: offline ?? 0, color: 'var(--a-border)', glow: false },
                ].map(item => (
                    <div key={item.label} style={{ display: 'flex', alignItems: 'center', gap: 9 }}>
                        <div style={{ width: 9, height: 9, borderRadius: '50%', flexShrink: 0, background: item.color, boxShadow: item.glow ? `0 0 8px ${item.color}` : 'none' }} />
                        <div>
                            <p style={{ color: 'var(--a-text-4)', fontSize: 10.5, fontFamily: 'Cairo, sans-serif' }}>{item.label}</p>
                            <p style={{ color: 'var(--a-text)', fontSize: 17, fontWeight: 900, lineHeight: 1, fontFamily: 'Cairo, sans-serif' }}>{item.val}</p>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
}

/* ═══════════════════════════════════════════════════
   MINI BARS
═══════════════════════════════════════════════════ */
function MiniBars({ data }) {
    const vals = data.map(d => d.students ?? 0);
    const maxV = Math.max(...vals, 1);
    return (
        <div style={{ display: 'flex', alignItems: 'flex-end', gap: 5, height: 52 }}>
            {vals.map((v, i) => (
                <div key={i} title={`${data[i].month}: ${v}`} style={{
                    flex: 1, borderRadius: '4px 4px 0 0', cursor: 'pointer',
                    height: `${Math.max(12, (v / maxV) * 100)}%`,
                    background: i === vals.length - 1 ? 'linear-gradient(180deg, #2fbcd4, #009688)' : 'var(--a-border)',
                    transition: 'background 0.2s',
                }}
                    onMouseEnter={e => { if (i !== vals.length - 1) e.currentTarget.style.background = 'rgba(47,188,212,0.3)'; }}
                    onMouseLeave={e => { if (i !== vals.length - 1) e.currentTarget.style.background = 'var(--a-border)'; }}
                />
            ))}
        </div>
    );
}

/* ═══════════════════════════════════════════════════
   QUICK ACTIONS
═══════════════════════════════════════════════════ */
const ACTIONS = [
    { svg: '<path d="M12 20h9"/><path d="M16.5 3.5a2.121 2.121 0 0 1 3 3L7 19l-4 1 1-4L16.5 3.5z"/>',                                                                                                          label: 'إضافة درس',       sub: 'رفع محتوى جديد',  href: '/admin/lessons/create', accent: '#2fbcd4' },
    { svg: '<path d="M9 5H7a2 2 0 0 0-2 2v12a2 2 0 0 0 2 2h10a2 2 0 0 0 2-2V7a2 2 0 0 0-2-2h-2"/><rect x="9" y="3" width="6" height="4" rx="2"/><path d="M9 12h6"/><path d="M9 16h4"/>',                   label: 'إنشاء امتحان',    sub: 'بنك الأسئلة',      href: '/admin/exams/create',   accent: '#1b3a60' },
    { svg: '<path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/><polyline points="14 2 14 8 20 8"/><line x1="16" y1="13" x2="8" y2="13"/><line x1="16" y1="17" x2="8" y2="17"/>',        label: 'رفع شيت',         sub: 'ملفات PDF',        href: '/admin/sheets/create',  accent: '#009688' },
    { svg: '<line x1="12" y1="1" x2="12" y2="23"/><path d="M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6"/>',                                                                                           label: 'الاشتراكات',      sub: 'اشتراكات معلّقة',  href: '/admin/subscriptions',  accent: '#8dc63f' },
    { svg: '<polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"/>',                                                                              label: 'الطلاب الأوائل',  sub: 'نتائج ودرجات',     href: '/admin/top-students',   accent: '#a4db32' },
    { svg: '<path d="M20.59 13.41l-7.17 7.17a2 2 0 0 1-2.83 0L2 12V2h10l8.59 8.59a2 2 0 0 1 0 2.82z"/><line x1="7" y1="7" x2="7.01" y2="7"/>',                                                             label: 'أكواد التفعيل',   sub: 'إنشاء وتفعيل',     href: '/admin/promo-codes',    accent: '#204080' },
];

/* ═══════════════════════════════════════════════════
   STUDENTS TABLE
═══════════════════════════════════════════════════ */
function StudentsTable({ students }) {
    return (
        <div style={{ overflowX: 'auto' }}>
            <table style={{ width: '100%', borderCollapse: 'collapse', fontFamily: 'Cairo, sans-serif' }}>
                <thead>
                    <tr style={{ background: 'var(--a-card-2)' }}>
                        {['الطالب', 'الصف', 'المجموعة', 'تاريخ التسجيل'].map(h => (
                            <th key={h} style={{ padding: '10px 16px', textAlign: 'right', fontSize: 11, fontWeight: 700, color: 'var(--a-text-4)', borderBottom: '1px solid var(--a-border)' }}>{h}</th>
                        ))}
                    </tr>
                </thead>
                <tbody>
                    {!students?.length && (
                        <tr><td colSpan={4} style={{ textAlign: 'center', padding: 36, color: 'var(--a-text-4)', fontSize: 13 }}>لا يوجد طلاب مسجلون حتى الآن</td></tr>
                    )}
                    {students?.map((s) => (
                        <tr key={s.id} style={{ borderBottom: '1px solid var(--a-border-2)', transition: 'background 0.12s' }}
                            onMouseEnter={e => e.currentTarget.style.background = 'var(--a-row-hover)'}
                            onMouseLeave={e => e.currentTarget.style.background = ''}>
                            <td style={{ padding: '11px 16px' }}>
                                <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                                    <div style={{ width: 34, height: 34, borderRadius: 10, flexShrink: 0, background: 'linear-gradient(135deg, #2fbcd4, #009688)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#fff', fontWeight: 900, fontSize: 13, boxShadow: '0 2px 8px rgba(47,188,212,0.3)' }}>{s.name?.charAt(0)}</div>
                                    <div>
                                        <p style={{ color: 'var(--a-text)', fontWeight: 700, fontSize: 13, lineHeight: 1.2 }}>{s.name}</p>
                                        <p style={{ color: 'var(--a-text-4)', fontSize: 11 }}>{s.phone ?? '—'}</p>
                                    </div>
                                </div>
                            </td>
                            <td style={{ padding: '11px 16px' }}>
                                {s.school_class?.name
                                    ? <span style={{ background: 'var(--a-badge-navy-bg)', color: 'var(--a-text)', padding: '3px 10px', borderRadius: 20, fontSize: 11, fontWeight: 700 }}>{s.school_class.name}</span>
                                    : <span style={{ color: 'var(--a-text-4)', fontSize: 12 }}>—</span>}
                            </td>
                            <td style={{ padding: '11px 16px' }}>
                                {s.group?.name
                                    ? <span style={{ background: 'rgba(47,188,212,0.1)', color: '#2fbcd4', padding: '3px 10px', borderRadius: 20, fontSize: 11, fontWeight: 700 }}>{s.group.name}</span>
                                    : <span style={{ color: 'var(--a-text-4)', fontSize: 12 }}>—</span>}
                            </td>
                            <td style={{ padding: '11px 16px', color: 'var(--a-text-4)', fontSize: 11 }}>
                                {s.created_at ? new Date(s.created_at).toLocaleDateString('ar-EG') : '—'}
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    );
}

/* ═══════════════════════════════════════════════════
   DASHBOARD PAGE
═══════════════════════════════════════════════════ */
export default function Dashboard({ stats, latestStudents, monthlyData, adminName, receipts = [], paymentNumbers = {} }) {
    const pageRef = useRef(null);
    const [showReceipts, setShowReceipts] = useState(false);
    const pendingReceiptsCount = receipts.filter(r => r.status === 'pending').length;

    useEffect(() => {
        if (!pageRef.current) return;
        const items = pageRef.current.querySelectorAll('.da');
        gsap.from(items, { y: 22, opacity: 0, duration: 0.5, stagger: 0.07, ease: 'power3.out', delay: 0.1 });
    }, []);

    const s   = stats          || {};
    const mo  = monthlyData?.length ? monthlyData : Array.from({ length: 6 }, (_, i) => ({ month: `ش${i + 1}`, revenue: 0, students: 0 }));
    const stu = latestStudents || [];
    const nm  = adminName      || 'الأستاذ [اسم المدرس]';

    const cards = [
        { svgContent: '<path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/><path d="M23 21v-2a4 4 0 0 0-3-3.87"/><path d="M16 3.13a4 4 0 0 1 0 7.75"/>', label: 'إجمالي الطلاب',   value: s.students    ?? 0, sub: 'طالب مسجل',           accent: '#2fbcd4', delay: 0.1 },
        { svgContent: '<path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/><path d="M23 21v-2a4 4 0 0 0-3-3.87"/><path d="M16 3.13a4 4 0 0 1 0 7.75"/>', label: 'المجموعات',        value: s.groups      ?? 0, sub: 'مجموعة نشطة',          accent: '#1b3a60', delay: 0.2 },
        { svgContent: '<path d="M4 19.5A2.5 2.5 0 0 1 6.5 17H20"/><path d="M6.5 2H20v20H6.5A2.5 2.5 0 0 1 4 19.5v-15A2.5 2.5 0 0 1 6.5 2z"/>',                                          label: 'الدروس المنشورة', value: s.lessons     ?? 0, sub: 'درس متاح',             accent: '#204080', delay: 0.3 },
        { svgContent: '<line x1="12" y1="1" x2="12" y2="23"/><path d="M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6"/>',                                                             label: 'الإيرادات',        value: s.revenue     ?? 0, sub: 'إجمالي الاشتراكات',    accent: '#009688', delay: 0.4, suffix: 'ج.م' },
        { svgContent: '<path d="M2 9a3 3 0 0 1 0 6v2a2 2 0 0 0 2 2h16a2 2 0 0 0 2-2v-2a3 3 0 0 1 0-6V7a2 2 0 0 0-2-2H4a2 2 0 0 0-2 2Z"/>',                                             label: 'اشتراكات معلّقة',  value: s.pendingSubs ?? 0, sub: 'بانتظار المراجعة',     accent: '#8dc63f', delay: 0.5 },
        { svgContent: '<polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"/>',                                               label: 'الطلاب الأوائل',  value: s.topStudents ?? 0, sub: 'في قوائم الشرف',        accent: '#a4db32', delay: 0.6 },
    ];

    return (
        <AdminLayout title="لوحة التحكم">
            <div ref={pageRef} dir="rtl" style={{ fontFamily: 'Cairo, sans-serif', display: 'flex', flexDirection: 'column', gap: 22 }}>

                {/* ═══ HERO BANNER — intentionally dark in both modes ══ */}
                <div className="da" style={{
                    borderRadius: 24, overflow: 'hidden', position: 'relative',
                    background: 'linear-gradient(135deg, #060D1E 0%, #1b3a60 45%, #1c2f50 75%, #0d1828 100%)',
                    padding: '30px 34px', minHeight: 155,
                    boxShadow: '0 8px 40px rgba(27,58,96,0.22)',
                }}>
                    <div style={{ position: 'absolute', inset: 0, pointerEvents: 'none', background: 'linear-gradient(100deg, transparent 30%, rgba(47,188,212,0.065) 50%, transparent 70%)' }} />

                    {/* أقواس المحراب — الهوية البصرية العربية بديل الأعمدة اليونانية */}
                    <MihrabMotif opacity={0.13} />

                    {/* بصمة "لغة الضاد" — توقيع مائي يوضّح هوية المنصة كمنصة لغة عربية */}
                    <div aria-hidden="true" style={{
                        position: 'absolute', inset: 0, display: 'flex', alignItems: 'center', justifyContent: 'center',
                        pointerEvents: 'none', overflow: 'hidden', zIndex: 0,
                    }}>
                        <span style={{
                            fontSize: 74, fontWeight: 900, fontFamily: 'Cairo, sans-serif',
                            color: 'rgba(47,188,212,0.09)', whiteSpace: 'nowrap', letterSpacing: '0.01em',
                        }}>لغة الضاد</span>
                    </div>

                    <div style={{ position: 'absolute', top: -50, right: -50, width: 250, height: 250, borderRadius: '50%', pointerEvents: 'none', background: 'radial-gradient(circle, rgba(47,188,212,0.18) 0%, transparent 70%)' }} />

                    <div style={{ position: 'relative', zIndex: 2, display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: 14 }}>
                        <div>
                            <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 9 }}>
                                <PenFlourish width={26} height={10} color="#2fbcd4" strokeWidth={1.6} />
                                <p style={{ color: '#2fbcd4', fontSize: 10.5, fontWeight: 700, letterSpacing: '0.2em' }}>DASHBOARD — لوحة التحكم</p>
                            </div>
                            <h1 style={{ color: '#fff', fontSize: 24, fontWeight: 900, lineHeight: 1.25, fontFamily: 'Cairo, sans-serif' }}>أهلاً بك، {nm}</h1>
                            <div style={{ margin: '8px 0 2px' }}>
                                <PenFlourish width={70} height={12} color="#8dc63f" strokeWidth={1.8} />
                            </div>
                            <p style={{ color: 'rgba(226,232,240,0.65)', fontSize: 12.5, marginTop: 5, fontFamily: 'Cairo, sans-serif' }}>
                                {new Date().toLocaleDateString('ar-EG', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}
                            </p>
                        </div>
                        <div style={{ display: 'flex', gap: 9, flexWrap: 'wrap', alignItems: 'center' }}>
                            {[
                                { label: `${s.online ?? 0} متصل`,             dot: '#22c55e' },
                                { label: `${s.pendingSubs ?? 0} اشتراك معلق`, dot: '#2fbcd4' },
                            ].map(p => (
                                <div key={p.label} style={{ display: 'flex', alignItems: 'center', gap: 7, background: 'rgba(255,255,255,0.08)', border: '1px dashed rgba(255,255,255,0.22)', borderRadius: 30, padding: '5px 13px', backdropFilter: 'blur(8px)' }}>
                                    <span style={{ width: 7, height: 7, borderRadius: '50%', background: p.dot, boxShadow: `0 0 7px ${p.dot}` }} />
                                    <span style={{ color: '#fff', fontSize: 12, fontWeight: 700, fontFamily: 'Cairo, sans-serif' }}>{p.label}</span>
                                </div>
                            ))}

                            {/* زرار إيصالات الدفع */}
                            <button
                                onClick={() => setShowReceipts(true)}
                                style={{
                                    position: 'relative',
                                    display: 'flex', alignItems: 'center', gap: 7,
                                    background: 'rgba(47,188,212,0.16)',
                                    border: '1px solid rgba(47,188,212,0.4)',
                                    borderRadius: 30, padding: '5px 13px',
                                    color: '#fff', fontSize: 12, fontWeight: 700,
                                    fontFamily: 'Cairo, sans-serif', cursor: 'pointer',
                                    backdropFilter: 'blur(8px)',
                                    transition: 'background 0.15s',
                                }}
                                onMouseEnter={e => e.currentTarget.style.background = 'rgba(47,188,212,0.28)'}
                                onMouseLeave={e => e.currentTarget.style.background = 'rgba(47,188,212,0.16)'}
                            >
                                🧾 إيصالات الدفع
                                {pendingReceiptsCount > 0 && (
                                    <span style={{
                                        background: '#2fbcd4', color: '#fff', borderRadius: 99,
                                        minWidth: 18, height: 18, display: 'inline-flex',
                                        alignItems: 'center', justifyContent: 'center',
                                        fontSize: 10.5, fontWeight: 900, padding: '0 5px',
                                    }}>
                                        {pendingReceiptsCount}
                                    </span>
                                )}
                            </button>
                        </div>
                    </div>
                </div>

                {/* ═══ STAT CARDS ═══ */}
                <div className="da" style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(195px, 1fr))', gap: 14 }}>
                    {cards.map((c, i) => <StatCard key={i} {...c} />)}
                </div>

                {/* ═══ CHARTS ROW ═══ */}
                <div className="da grid grid-cols-1 lg:grid-cols-3 gap-5">
                    {/* Area chart */}
                    <div style={{ background: 'var(--a-card)', borderRadius: 22, overflow: 'hidden', position: 'relative', boxShadow: '0 2px 12px var(--a-shadow)', border: '1px solid var(--a-border)' }}
                        className="lg:col-span-2">
                        <ArchAccent id="chart-arch-1" accent="#2fbcd4" />
                        <div style={{ padding: '18px 22px 6px', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                            <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                                <SectionMark color="#2fbcd4" size={14} />
                                <div>
                                    <p style={{ color: 'var(--a-text)', fontWeight: 900, fontSize: 15, fontFamily: 'Cairo, sans-serif' }}>الإيرادات الشهرية</p>
                                    <p style={{ color: 'var(--a-text-4)', fontSize: 10.5, marginTop: 2, fontFamily: 'Cairo, sans-serif' }}>آخر {mo.length} أشهر</p>
                                </div>
                            </div>
                            <div style={{ display: 'flex', alignItems: 'center', gap: 5, background: 'rgba(47,188,212,0.1)', borderRadius: 20, padding: '4px 11px' }}>
                                <span style={{ width: 7, height: 7, borderRadius: '50%', background: '#2fbcd4' }} />
                                <span style={{ color: '#2fbcd4', fontSize: 10.5, fontWeight: 700, fontFamily: 'Cairo, sans-serif' }}>ج.م</span>
                            </div>
                        </div>
                        <div style={{ padding: '4px 14px 14px' }}>
                            <AreaChart data={mo} />
                        </div>
                    </div>

                    {/* Donut + Mini bars */}
                    <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
                        <div style={{ background: 'var(--a-card)', borderRadius: 22, padding: 20, flex: 1, position: 'relative', overflow: 'hidden', boxShadow: '0 2px 12px var(--a-shadow)', border: '1px solid var(--a-border)' }}>
                            <ArchAccent id="chart-arch-2" accent="#8dc63f" />
                            <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 14 }}>
                                <SectionMark color="#8dc63f" size={14} />
                                <p style={{ color: 'var(--a-text)', fontWeight: 900, fontSize: 14, fontFamily: 'Cairo, sans-serif' }}>حضور الطلاب</p>
                            </div>
                            <DonutChart online={s.online ?? 0} offline={s.offline ?? 0} />
                        </div>
                        <div style={{ background: 'var(--a-card)', borderRadius: 22, padding: '14px 18px', position: 'relative', overflow: 'hidden', boxShadow: '0 2px 12px var(--a-shadow)', border: '1px solid var(--a-border)' }}>
                            <ArchAccent id="chart-arch-3" accent="#1b3a60" height={12} />
                            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 10 }}>
                                <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                                    <SectionMark color="#1b3a60" size={14} />
                                    <p style={{ color: 'var(--a-text)', fontWeight: 900, fontSize: 13, fontFamily: 'Cairo, sans-serif' }}>تسجيل الطلاب</p>
                                </div>
                                <span style={{ color: 'var(--a-text-4)', fontSize: 10, fontFamily: 'Cairo, sans-serif' }}>شهرياً</span>
                            </div>
                            <MiniBars data={mo} />
                        </div>
                    </div>
                </div>

                {/* ═══ QUICK ACTIONS ═══ */}
                <div className="da">
                    <SectionHeading title="إجراءات سريعة" color="#2fbcd4" />
                    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(155px, 1fr))', gap: 12 }}>
                        {ACTIONS.map((a, i) => (
                            <Link key={i} href={a.href} style={{
                                display: 'flex', flexDirection: 'column', alignItems: 'flex-start', gap: 10,
                                background: 'var(--a-card)', borderRadius: 18, padding: '17px 15px',
                                boxShadow: '0 2px 10px var(--a-shadow)', border: '1px solid var(--a-border)',
                                textDecoration: 'none', cursor: 'pointer', position: 'relative', overflow: 'hidden',
                                transition: 'transform 0.22s ease, box-shadow 0.22s ease',
                            }}
                                onMouseEnter={e => { e.currentTarget.style.transform = 'translateY(-4px)'; e.currentTarget.style.boxShadow = `0 12px 30px var(--a-shadow-lg), 0 0 0 1.5px ${a.accent}35`; }}
                                onMouseLeave={e => { e.currentTarget.style.transform = 'translateY(0)'; e.currentTarget.style.boxShadow = '0 2px 10px var(--a-shadow)'; }}>
                                <ArchAccent id={`act-arch-${i}`} accent={a.accent} height={12} />
                                <div style={{ width: 38, height: 38, borderRadius: 11, flexShrink: 0, display: 'flex', alignItems: 'center', justifyContent: 'center', background: `${a.accent}14`, boxShadow: `0 0 0 1px ${a.accent}28` }}>
                                    <svg viewBox="0 0 24 24" fill="none" stroke={a.accent} strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" width={18} height={18}
                                        dangerouslySetInnerHTML={{ __html: a.svg }} />
                                </div>
                                <div>
                                    <p style={{ color: 'var(--a-text)', fontWeight: 800, fontSize: 12.5, fontFamily: 'Cairo, sans-serif', lineHeight: 1.2 }}>{a.label}</p>
                                    <p style={{ color: 'var(--a-text-4)', fontSize: 10, marginTop: 3, fontFamily: 'Cairo, sans-serif' }}>{a.sub}</p>
                                </div>
                            </Link>
                        ))}
                    </div>
                </div>

                {/* ═══ PAYMENT NUMBERS — المدرس فقط ═══ */}
                <div className="da">
                    <SectionHeading title="إعدادات الدفع" color="#8dc63f" />
                    <PaymentNumbersEditor numbers={paymentNumbers} />
                </div>

                {/* ═══ LATEST STUDENTS ═══ */}
                <div className="da">
                    <SectionHeading title="آخر الطلاب المسجلين" color="#2fbcd4" action={
                        <Link href="/admin/students" style={{ color: '#2fbcd4', fontSize: 11.5, fontWeight: 700, fontFamily: 'Cairo, sans-serif', textDecoration: 'none', display: 'flex', alignItems: 'center', gap: 3, padding: '4px 11px', borderRadius: 20, background: 'rgba(47,188,212,0.08)', transition: 'background 0.15s' }}
                            onMouseEnter={e => e.currentTarget.style.background = 'rgba(47,188,212,0.15)'}
                            onMouseLeave={e => e.currentTarget.style.background = 'rgba(47,188,212,0.08)'}>
                            عرض الكل
                            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" width={12} height={12}><polyline points="15 18 9 12 15 6" /></svg>
                        </Link>
                    } />
                    <div style={{ background: 'var(--a-card)', borderRadius: 22, boxShadow: '0 2px 12px var(--a-shadow)', border: '1px solid var(--a-border)', overflow: 'hidden' }}>
                        <StudentsTable students={stu} />
                    </div>
                </div>

            </div>

            {/* ═══ RECEIPTS MODAL ═══ */}
            <ReceiptsReviewModal
                open={showReceipts}
                onClose={() => setShowReceipts(false)}
                receipts={receipts}
                routePrefix="admin"
            />
        </AdminLayout>
    );
}
