import React, { useEffect, useRef, useState } from 'react';
import { Link } from '@inertiajs/react';
import AdminLayout from '@/Layouts/AdminLayout';
import gsap from 'gsap';
import ReceiptsReviewModal from '@/Components/ReceiptsReviewModal';
import PaymentNumbersEditor from '@/Components/PaymentNumbersEditor';

/* ═══════════════════════════════════════════════════
   هوية بصرية عربية — زخرفة هندسية إسلامية أصيلة
═══════════════════════════════════════════════════ */

function EightPointStar({ size = 16, color = '#2fbcd4', filled = false, opacity = 1 }) {
    return (
        <svg width={size} height={size} viewBox="0 0 20 20" style={{ flexShrink: 0, opacity }}>
            <g stroke={color} strokeWidth={filled ? 0 : 1.5} fill={filled ? color : 'none'} strokeLinejoin="round">
                <rect x="3.2" y="3.2" width="13.6" height="13.6" />
                <rect x="3.2" y="3.2" width="13.6" height="13.6" transform="rotate(45 10 10)" />
            </g>
        </svg>
    );
}

/** نسيج "النجمة والصليب" — تطعيم هندسي إسلامي أصيل بيتلاقى عند حواف كل بلاطة
    فيكوّن نجوم ثمانية متصلة ببعضها (مش مربعات منعزلة زي أي وقت فات) */
function IslamicPatternOverlay({ opacity = 0.12, color = '#c9a227', size = 56, style = {} }) {
    const patId = useRef(`ip-${Math.random().toString(36).slice(2)}`).current;
    return (
        <svg style={{ position: 'absolute', inset: 0, width: '100%', height: '100%', pointerEvents: 'none', ...style }}>
            <defs>
                <pattern id={patId} width={size} height={size} patternUnits="userSpaceOnUse">
                    <g stroke={color} fill="none" opacity={opacity}>
                        {/* شبكة الصليب الرابطة بين النجوم */}
                        <rect x="0" y="0" width={size} height={size} strokeWidth="1.1" />
                        {/* النجمة الثمانية — أطرافها بتلمس البلاطات المجاورة فتتصل بيها */}
                        <rect x={size * 0.12} y={size * 0.12} width={size * 0.76} height={size * 0.76}
                            transform={`rotate(45 ${size / 2} ${size / 2})`} strokeWidth="1.3" />
                        {/* نجمة داخلية أصغر لعمق زخرفي إضافي */}
                        <rect x={size * 0.30} y={size * 0.30} width={size * 0.40} height={size * 0.40}
                            transform={`rotate(45 ${size / 2} ${size / 2})`} strokeWidth="0.9" opacity="0.65" />
                    </g>
                </pattern>
            </defs>
            <rect width="100%" height="100%" fill={`url(#${patId})`} />
        </svg>
    );
}

function ManuscriptEdge({ position = 'top', color = '#c9a227' }) {
    return (
        <div style={{
            position: 'absolute', [position]: 10, left: 24, right: 24, height: 1,
            background: `repeating-linear-gradient(90deg, ${color}88 0 6px, transparent 6px 14px)`,
            pointerEvents: 'none',
        }} />
    );
}

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

function SectionHeading({ title, action, color = '#2fbcd4' }) {
    return (
        <div style={{ display: 'flex', alignItems: 'center', gap: 14, marginBottom: 13 }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 10, flex: 1, minWidth: 0 }}>
                <EightPointStar color={color} size={15} filled />
                <h2 style={{ color: 'var(--a-text)', fontWeight: 900, fontSize: 16, fontFamily: "'Cairo', sans-serif", whiteSpace: 'nowrap' }}>{title}</h2>
                <div style={{ flex: 1, height: 1, minWidth: 20, background: `linear-gradient(90deg, var(--a-border), rgba(201,162,39,0.35), transparent)` }} />
            </div>
            {action}
        </div>
    );
}

function PenFlourish({ width = 46, height = 12, color = '#2fbcd4', strokeWidth = 1.8 }) {
    return (
        <svg width={width} height={height} viewBox="0 0 46 12" fill="none">
            <path d="M2 9 C 10 2, 18 2, 24 6 S 38 10, 44 4" stroke={color} strokeWidth={strokeWidth} strokeLinecap="round" />
            <circle cx="44" cy="4" r={strokeWidth} fill={color} />
        </svg>
    );
}

function MihrabMotif({ opacity = 0.13 }) {
    return (
        <svg style={{ position: 'absolute', left: 0, bottom: 0, height: '100%', width: 'auto', opacity, pointerEvents: 'none' }}
            viewBox="0 0 320 155" preserveAspectRatio="xMinYMax meet" xmlns="http://www.w3.org/2000/svg">
            <line x1="10" y1="153" x2="310" y2="153" stroke="white" strokeWidth="1" opacity="0.5" />
            <path d="M20 155 L20 95 Q20 25 90 25 Q160 25 160 95 L160 155" fill="none" stroke="white" strokeWidth="2" opacity="0.55" />
            <path d="M45 155 L45 98 Q45 45 90 45 Q135 45 135 98 L135 155" fill="none" stroke="white" strokeWidth="1.4" opacity="0.4" />
            <path d="M68 155 L68 100 Q68 62 90 62 Q112 62 112 100 L112 155" fill="none" stroke="white" strokeWidth="1" opacity="0.3" />
            <g transform="translate(90,38)" opacity="0.85">
                <rect x="-6" y="-6" width="12" height="12" transform="rotate(45 0 0)" fill="none" stroke="#c9a227" strokeWidth="1.2" />
                <rect x="-6" y="-6" width="12" height="12" fill="none" stroke="#c9a227" strokeWidth="1.2" />
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
   STAT CARD
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
            background: 'var(--a-card)', borderRadius: '26px 26px 18px 18px', padding: '22px 20px',
            position: 'relative', overflow: 'hidden', cursor: 'default',
            boxShadow: '0 2px 12px var(--a-shadow), 0 0 0 1px var(--a-border)',
            transition: 'box-shadow 0.22s ease',
        }}>
            <ArchAccent id={archId} accent={accent} />
            <IslamicPatternOverlay opacity={0.07} color={accent} size={36} />
            <div style={{ position: 'absolute', top: 12, left: 12, opacity: 0.14 }}>
                <EightPointStar color={accent} size={13} />
            </div>
            <div style={{ position: 'absolute', bottom: -20, left: -20, width: 90, height: 90, borderRadius: '50%', background: `radial-gradient(circle, ${accent}10, transparent)`, pointerEvents: 'none' }} />

            <div style={{ display: 'flex', alignItems: 'flex-start', gap: 14, position: 'relative' }}>
                <div style={{ width: 46, height: 46, borderRadius: 14, flexShrink: 0, display: 'flex', alignItems: 'center', justifyContent: 'center', background: `linear-gradient(135deg, ${accent}20, ${accent}0d)`, boxShadow: `0 0 0 1px ${accent}30, 0 4px 16px ${accent}18` }}>
                    <svg viewBox="0 0 24 24" fill="none" stroke={accent} strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" width={21} height={21}
                        dangerouslySetInnerHTML={{ __html: svgContent }} />
                </div>
                <div style={{ flex: 1 }}>
                    <p style={{ color: 'var(--a-text-4)', fontSize: 12, fontWeight: 600, fontFamily: "'Cairo', sans-serif" }}>{label}</p>
                    <div style={{ display: 'flex', alignItems: 'baseline', gap: 4, marginTop: 5 }}>
                        <span ref={numRef} style={{ color: 'var(--a-text)', fontSize: 28, fontWeight: 900, fontFamily: "'Cairo', sans-serif", lineHeight: 1 }}>0</span>
                        {suffix && <span style={{ color: 'var(--a-text-4)', fontSize: 12, fontWeight: 600, fontFamily: "'Cairo', sans-serif" }}>{suffix}</span>}
                    </div>
                    {sub && (
                        <p style={{ color: 'var(--a-text-4)', fontSize: 10.5, marginTop: 4, fontFamily: "'Cairo', sans-serif", display: 'flex', alignItems: 'center', gap: 3 }}>
                            <span style={{ color: accent, fontWeight: 800 }}>↑</span>{sub}
                        </p>
                    )}
                </div>
            </div>
        </div>
    );
}

/* ═══════════════════════════════════════════════════
   REVENUE BARS — أعمدة ذهبية-فيروزية داخل لوحة ليلية
   (بديل جذري لمخطط الخط الرفيع القديم)
═══════════════════════════════════════════════════ */
function RevenueBars({ data }) {
    const [hover, setHover] = useState(null);
    const barsRef = useRef(null);
    const vals  = data.map(d => d.revenue ?? 0);
    const maxV  = Math.max(...vals, 1);
    const total = vals.reduce((a, b) => a + b, 0);

    useEffect(() => {
        if (!barsRef.current) return;
        const bars = barsRef.current.querySelectorAll('.rb-bar');
        gsap.from(bars, { scaleY: 0, transformOrigin: 'bottom', duration: 0.9, stagger: 0.08, delay: 0.3, ease: 'power3.out' });
    }, [data]);

    return (
        <div>
            <div style={{ display: 'flex', alignItems: 'baseline', gap: 8, marginBottom: 20 }}>
                <span style={{ fontSize: 30, fontWeight: 900, color: '#fff', fontFamily: "'Cairo', sans-serif" }}>{total.toLocaleString('ar-EG')}</span>
                <span style={{ fontSize: 12, fontWeight: 700, color: '#c9a227' }}>ج.م — إجمالي آخر {data.length} أشهر</span>
            </div>
            <div ref={barsRef} style={{ display: 'flex', alignItems: 'flex-end', gap: 12, height: 150, position: 'relative' }}>
                {data.map((d, i) => {
                    const h = Math.max(6, ((d.revenue ?? 0) / maxV) * 100);
                    const isLast = i === data.length - 1;
                    return (
                        <div key={i}
                            style={{ flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 7, height: '100%', justifyContent: 'flex-end', position: 'relative', cursor: 'pointer' }}
                            onMouseEnter={() => setHover(i)} onMouseLeave={() => setHover(null)}>
                            {hover === i && (
                                <div style={{
                                    position: 'absolute', bottom: `calc(${h}% + 16px)`, background: '#0d1829', color: '#fff',
                                    fontSize: 11, fontWeight: 700, padding: '5px 11px', borderRadius: 9, whiteSpace: 'nowrap',
                                    border: '1px solid rgba(201,162,39,0.45)', zIndex: 5, fontFamily: "'Cairo', sans-serif",
                                }}>
                                    {(d.revenue ?? 0).toLocaleString('ar-EG')} ج.م
                                </div>
                            )}
                            <EightPointStar color={isLast ? '#c9a227' : '#2fbcd4'} size={9} filled opacity={isLast ? 1 : 0.5} />
                            <div className="rb-bar" style={{
                                width: '100%', maxWidth: 30, height: `${h}%`, borderRadius: '9px 9px 3px 3px',
                                background: isLast ? 'linear-gradient(180deg,#e2c25a,#c9a227 55%,#8a6d1a)' : 'linear-gradient(180deg,#4fd8ec,#2fbcd4 55%,#0f6e7c)',
                                boxShadow: isLast ? '0 0 16px rgba(201,162,39,0.4)' : '0 0 10px rgba(47,188,212,0.22)',
                            }} />
                            <span style={{ fontSize: 10, color: 'rgba(226,232,240,0.55)', fontWeight: 700, fontFamily: "'Cairo', sans-serif" }}>{d.month}</span>
                        </div>
                    );
                })}
            </div>
        </div>
    );
}

/* ═══════════════════════════════════════════════════
   ATTENDANCE GAUGE — مقياس نصف-دائري (بديل جذري للدونات)
═══════════════════════════════════════════════════ */
function AttendanceGauge({ online, offline }) {
    const total  = (online || 0) + (offline || 0) || 1;
    const pct    = online / total;
    const r = 58, cx = 70, cy = 68;
    const circ   = Math.PI * r;
    const dash   = pct * circ;
    const arcRef = useRef(null);
    const gradId = useRef(`gg-${Math.random().toString(36).slice(2)}`).current;

    useEffect(() => {
        if (!arcRef.current) return;
        gsap.fromTo(arcRef.current,
            { strokeDashoffset: circ },
            { strokeDashoffset: circ - dash, duration: 1.4, delay: 0.5, ease: 'power2.out' }
        );
    }, [online, offline]);

    const path = `M 10 ${cy} A ${r} ${r} 0 0 1 ${cx * 2 - 10} ${cy}`;

    return (
        <div>
            <div style={{ position: 'relative', width: 140, margin: '0 auto' }}>
                <svg width={140} height={78} viewBox="0 0 140 78">
                    <defs>
                        <linearGradient id={gradId} x1="0%" y1="0%" x2="100%" y2="0%">
                            <stop offset="0%" stopColor="#2fbcd4" /><stop offset="100%" stopColor="#c9a227" />
                        </linearGradient>
                    </defs>
                    <path d={path} fill="none" stroke="var(--a-donut-track)" strokeWidth={13} strokeLinecap="round" />
                    <path ref={arcRef} d={path} fill="none" stroke={`url(#${gradId})`} strokeWidth={13} strokeLinecap="round"
                        strokeDasharray={`${circ} ${circ}`} strokeDashoffset={circ}
                        style={{ filter: 'drop-shadow(0 0 6px rgba(47,188,212,0.4))' }} />
                </svg>
                <div style={{ position: 'absolute', bottom: -4, left: 0, right: 0, textAlign: 'center' }}>
                    <p style={{ fontSize: 25, fontWeight: 900, color: 'var(--a-text)', fontFamily: "'Cairo', sans-serif", lineHeight: 1 }}>{Math.round(pct * 100)}%</p>
                    <p style={{ fontSize: 9.5, color: 'var(--a-text-4)', fontWeight: 700, marginTop: 3, fontFamily: "'Cairo', sans-serif" }}>حضور اليوم</p>
                </div>
            </div>
            <div style={{ display: 'flex', justifyContent: 'center', gap: 8, marginTop: 12, flexWrap: 'wrap' }}>
                <span style={{ display: 'inline-flex', alignItems: 'center', gap: 6, background: 'rgba(47,188,212,0.1)', padding: '5px 12px', borderRadius: 20, fontSize: 11, fontWeight: 800, color: '#2fbcd4', fontFamily: "'Cairo', sans-serif" }}>
                    <span style={{ width: 7, height: 7, borderRadius: '50%', background: '#2fbcd4' }} /> {online ?? 0} حاضر
                </span>
                <span style={{ display: 'inline-flex', alignItems: 'center', gap: 6, background: 'var(--a-card-2)', padding: '5px 12px', borderRadius: 20, fontSize: 11, fontWeight: 800, color: 'var(--a-text-4)', fontFamily: "'Cairo', sans-serif" }}>
                    <span style={{ width: 7, height: 7, borderRadius: '50%', background: 'var(--a-border)' }} /> {offline ?? 0} غائب
                </span>
            </div>
        </div>
    );
}

/* ═══════════════════════════════════════════════════
   REGISTRATION SPARK — عمود تسجيل الطلاب المصغّر
═══════════════════════════════════════════════════ */
function RegistrationSpark({ data }) {
    const vals = data.map(d => d.students ?? 0);
    const maxV = Math.max(...vals, 1);
    return (
        <div style={{ display: 'flex', alignItems: 'flex-end', gap: 6, height: 52 }}>
            {vals.map((v, i) => {
                const isLast = i === vals.length - 1;
                return (
                    <div key={i} title={`${data[i].month}: ${v}`} style={{ flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', height: '100%', justifyContent: 'flex-end' }}>
                        <div style={{
                            width: '100%', borderRadius: '7px 7px 2px 2px', cursor: 'pointer',
                            height: `${Math.max(14, (v / maxV) * 100)}%`,
                            background: isLast ? 'linear-gradient(180deg,#e2c25a,#c9a227)' : 'rgba(47,188,212,0.32)',
                            boxShadow: isLast ? '0 0 10px rgba(201,162,39,0.35)' : 'none',
                            transition: 'opacity .2s',
                        }} />
                    </div>
                );
            })}
        </div>
    );
}

/* ═══════════════════════════════════════════════════
   QUICK ACTIONS — بطاقات ميدالية دائرية (بديل جذري للتخطيط القديم)
═══════════════════════════════════════════════════ */
const ACTIONS = [
    { svg: '<path d="M12 20h9"/><path d="M16.5 3.5a2.121 2.121 0 0 1 3 3L7 19l-4 1 1-4L16.5 3.5z"/>',                                                                                                          label: 'إضافة درس',       sub: 'رفع محتوى جديد',  href: '/admin/lessons/create', accent: '#2fbcd4' },
    { svg: '<path d="M9 5H7a2 2 0 0 0-2 2v12a2 2 0 0 0 2 2h10a2 2 0 0 0 2-2V7a2 2 0 0 0-2-2h-2"/><rect x="9" y="3" width="6" height="4" rx="2"/><path d="M9 12h6"/><path d="M9 16h4"/>',                   label: 'إنشاء امتحان',    sub: 'بنك الأسئلة',      href: '/admin/exams/create',   accent: '#1b3a60' },
    { svg: '<path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/><polyline points="14 2 14 8 20 8"/><line x1="16" y1="13" x2="8" y2="13"/><line x1="16" y1="17" x2="8" y2="17"/>',        label: 'رفع شيت',         sub: 'ملفات PDF',        href: '/admin/sheets/create',  accent: '#009688' },
    { svg: '<line x1="12" y1="1" x2="12" y2="23"/><path d="M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6"/>',                                                                                           label: 'الاشتراكات',      sub: 'اشتراكات معلّقة',  href: '/admin/subscriptions',  accent: '#c9a227' },
    { svg: '<polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"/>',                                                                              label: 'الطلاب الأوائل',  sub: 'نتائج ودرجات',     href: '/admin/top-students',   accent: '#a4db32' },
    { svg: '<path d="M20.59 13.41l-7.17 7.17a2 2 0 0 1-2.83 0L2 12V2h10l8.59 8.59a2 2 0 0 1 0 2.82z"/><line x1="7" y1="7" x2="7.01" y2="7"/>',                                                             label: 'أكواد التفعيل',   sub: 'إنشاء وتفعيل',     href: '/admin/promo-codes',    accent: '#204080' },
];

function QuickActionCard({ a }) {
    return (
        <Link href={a.href} style={{
            display: 'flex', flexDirection: 'column', alignItems: 'center', textAlign: 'center', gap: 11,
            background: `linear-gradient(165deg, ${a.accent}14, transparent 65%)`,
            borderRadius: 24, padding: '24px 12px', border: `1px solid ${a.accent}28`,
            textDecoration: 'none', position: 'relative', overflow: 'hidden', cursor: 'pointer',
            transition: 'transform 0.22s ease, box-shadow 0.22s ease',
        }}
            onMouseEnter={e => { e.currentTarget.style.transform = 'translateY(-5px)'; e.currentTarget.style.boxShadow = `0 14px 30px ${a.accent}22`; }}
            onMouseLeave={e => { e.currentTarget.style.transform = 'translateY(0)'; e.currentTarget.style.boxShadow = 'none'; }}>
            <IslamicPatternOverlay opacity={0.12} color={a.accent} size={34} />
            <div style={{ position: 'absolute', top: 10, left: 12, opacity: 0.16 }}>
                <EightPointStar color={a.accent} size={11} />
            </div>
            <div style={{
                width: 58, height: 58, borderRadius: '50%', flexShrink: 0, display: 'flex', alignItems: 'center', justifyContent: 'center',
                background: 'var(--a-card)', boxShadow: `0 0 0 3px ${a.accent}22, 0 0 0 7px ${a.accent}0d`, position: 'relative',
            }}>
                <svg viewBox="0 0 24 24" fill="none" stroke={a.accent} strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" width={22} height={22}
                    dangerouslySetInnerHTML={{ __html: a.svg }} />
            </div>
            <div style={{ position: 'relative' }}>
                <p style={{ color: 'var(--a-text)', fontWeight: 800, fontSize: 12.5, fontFamily: "'Cairo', sans-serif", lineHeight: 1.3 }}>{a.label}</p>
                <p style={{ color: 'var(--a-text-4)', fontSize: 10, marginTop: 3, fontFamily: "'Cairo', sans-serif" }}>{a.sub}</p>
            </div>
        </Link>
    );
}

/* ═══════════════════════════════════════════════════
   STUDENTS LIST — بطاقات أفقية (بديل جذري للجدول القديم)
═══════════════════════════════════════════════════ */
function StudentsList({ students }) {
    if (!students?.length) {
        return (
            <div style={{ textAlign: 'center', padding: '42px 16px', color: 'var(--a-text-4)', fontSize: 13, fontFamily: "'Cairo', sans-serif" }}>
                لا يوجد طلاب مسجلون حتى الآن
            </div>
        );
    }
    return (
        <div>
            {students.map((s, i) => (
                <div key={s.id} style={{
                    display: 'flex', alignItems: 'center', gap: 14, padding: '14px 20px',
                    borderBottom: i !== students.length - 1 ? '1px dashed var(--a-border-2)' : 'none',
                    transition: 'background 0.15s', fontFamily: "'Cairo', sans-serif",
                }}
                    onMouseEnter={e => e.currentTarget.style.background = 'var(--a-row-hover)'}
                    onMouseLeave={e => e.currentTarget.style.background = ''}>

                    <div style={{
                        width: 40, height: 40, borderRadius: '50%', flexShrink: 0,
                        background: 'linear-gradient(135deg, #2fbcd4, #c9a227)',
                        display: 'flex', alignItems: 'center', justifyContent: 'center',
                        color: '#fff', fontWeight: 900, fontSize: 14,
                        boxShadow: '0 0 0 3px var(--a-card), 0 0 0 4.5px rgba(47,188,212,0.22)',
                    }}>
                        {s.name?.charAt(0)}
                    </div>

                    <div style={{ flex: 1, minWidth: 0 }}>
                        <p style={{ color: 'var(--a-text)', fontWeight: 800, fontSize: 13, lineHeight: 1.2 }}>{s.name}</p>
                        <p style={{ color: 'var(--a-text-4)', fontSize: 10.5, marginTop: 2 }}>{s.phone ?? '—'}</p>
                    </div>

                    <div style={{ display: 'flex', gap: 6, flexWrap: 'wrap', justifyContent: 'flex-end', flexShrink: 0 }}>
                        {s.school_class?.name && (
                            <span style={{ background: 'var(--a-badge-navy-bg)', color: 'var(--a-text)', padding: '3px 11px', borderRadius: 20, fontSize: 10.5, fontWeight: 700, whiteSpace: 'nowrap' }}>{s.school_class.name}</span>
                        )}
                        {s.group?.name && (
                            <span style={{ background: 'rgba(201,162,39,0.12)', color: '#c9a227', padding: '3px 11px', borderRadius: 20, fontSize: 10.5, fontWeight: 700, whiteSpace: 'nowrap' }}>{s.group.name}</span>
                        )}
                    </div>

                    <span style={{ color: 'var(--a-text-4)', fontSize: 10.5, minWidth: 66, textAlign: 'left', flexShrink: 0 }}>
                        {s.created_at ? new Date(s.created_at).toLocaleDateString('ar-EG') : '—'}
                    </span>
                </div>
            ))}
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
    const nm  = adminName      || 'الأستاذ محمد منصور';

    const cards = [
        { svgContent: '<path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/><path d="M23 21v-2a4 4 0 0 0-3-3.87"/><path d="M16 3.13a4 4 0 0 1 0 7.75"/>', label: 'إجمالي الطلاب',   value: s.students    ?? 0, sub: 'طالب مسجل',           accent: '#2fbcd4', delay: 0.1 },
        { svgContent: '<path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/><path d="M23 21v-2a4 4 0 0 0-3-3.87"/><path d="M16 3.13a4 4 0 0 1 0 7.75"/>', label: 'المجموعات',        value: s.groups      ?? 0, sub: 'مجموعة نشطة',          accent: '#1b3a60', delay: 0.2 },
        { svgContent: '<path d="M4 19.5A2.5 2.5 0 0 1 6.5 17H20"/><path d="M6.5 2H20v20H6.5A2.5 2.5 0 0 1 4 19.5v-15A2.5 2.5 0 0 1 6.5 2z"/>',                                          label: 'الدروس المنشورة', value: s.lessons     ?? 0, sub: 'درس متاح',             accent: '#204080', delay: 0.3 },
        { svgContent: '<line x1="12" y1="1" x2="12" y2="23"/><path d="M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6"/>',                                                             label: 'الإيرادات',        value: s.revenue     ?? 0, sub: 'إجمالي الاشتراكات',    accent: '#009688', delay: 0.4, suffix: 'ج.م' },
        { svgContent: '<path d="M2 9a3 3 0 0 1 0 6v2a2 2 0 0 0 2 2h16a2 2 0 0 0 2-2v-2a3 3 0 0 1 0-6V7a2 2 0 0 0-2-2H4a2 2 0 0 0-2 2Z"/>',                                             label: 'اشتراكات معلّقة',  value: s.pendingSubs ?? 0, sub: 'بانتظار المراجعة',     accent: '#c9a227', delay: 0.5 },
        { svgContent: '<polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"/>',                                               label: 'الطلاب الأوائل',  value: s.topStudents ?? 0, sub: 'في قوائم الشرف',        accent: '#a4db32', delay: 0.6 },
    ];

    return (
        <AdminLayout title="لوحة التحكم">
            <div ref={pageRef} dir="rtl" style={{ fontFamily: "'Cairo', sans-serif", display: 'flex', flexDirection: 'column', gap: 22, position: 'relative' }}>

                <IslamicPatternOverlay opacity={0.03} color="#2fbcd4" size={64} style={{ position: 'fixed' }} />

                {/* ═══ HERO BANNER ══ */}
                <div className="da" style={{
                    borderRadius: 24, overflow: 'hidden', position: 'relative',
                    background: 'linear-gradient(135deg, #060D1E 0%, #1b3a60 45%, #1c2f50 75%, #0d1828 100%)',
                    padding: '32px 34px', minHeight: 160,
                    boxShadow: '0 8px 40px rgba(27,58,96,0.22)',
                    border: '1px solid rgba(201,162,39,0.18)',
                }}>
                    <div style={{ position: 'absolute', inset: 0, pointerEvents: 'none', background: 'linear-gradient(100deg, transparent 30%, rgba(47,188,212,0.065) 50%, transparent 70%)' }} />
                    <ManuscriptEdge position="top" />
                    <ManuscriptEdge position="bottom" />
                    <IslamicPatternOverlay opacity={0.16} color="#c9a227" size={62} />
                    <MihrabMotif opacity={0.14} />

                    <div aria-hidden="true" style={{
                        position: 'absolute', inset: 0, display: 'flex', alignItems: 'center', justifyContent: 'center',
                        pointerEvents: 'none', overflow: 'hidden', zIndex: 0,
                    }}>
                        <span style={{
                            fontSize: 76, fontWeight: 900, fontFamily: "'Cairo', sans-serif",
                            background: 'linear-gradient(120deg, rgba(47,188,212,0.16), rgba(201,162,39,0.13))',
                            WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent', backgroundClip: 'text',
                            whiteSpace: 'nowrap', letterSpacing: '0.02em',
                        }}>لغة الضاد</span>
                    </div>

                    <div style={{ position: 'absolute', top: -50, right: -50, width: 250, height: 250, borderRadius: '50%', pointerEvents: 'none', background: 'radial-gradient(circle, rgba(47,188,212,0.18) 0%, transparent 70%)' }} />

                    <div style={{ position: 'relative', zIndex: 2, display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: 14 }}>
                        <div>
                            <div style={{ display: 'flex', alignItems: 'center', gap: 9, marginBottom: 9 }}>
                                <EightPointStar color="#c9a227" size={13} filled />
                                <p style={{ color: '#c9a227', fontSize: 10.5, fontWeight: 700, letterSpacing: '0.2em' }}>DASHBOARD — لوحة التحكم</p>
                            </div>
                            <h1 style={{ color: '#fff', fontSize: 25, fontWeight: 900, lineHeight: 1.25, fontFamily: "'Cairo', sans-serif" }}>أهلاً بك، {nm}</h1>
                            <div style={{ margin: '9px 0 2px', display: 'flex', alignItems: 'center', gap: 8 }}>
                                <PenFlourish width={56} height={12} color="#8dc63f" strokeWidth={1.8} />
                                <EightPointStar color="#c9a227" size={9} filled opacity={0.85} />
                            </div>
                            <p style={{ color: 'rgba(226,232,240,0.65)', fontSize: 12.5, marginTop: 5, fontFamily: "'Cairo', sans-serif" }}>
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
                                    <span style={{ color: '#fff', fontSize: 12, fontWeight: 700, fontFamily: "'Cairo', sans-serif" }}>{p.label}</span>
                                </div>
                            ))}
                            <button
                                onClick={() => setShowReceipts(true)}
                                style={{
                                    position: 'relative', display: 'flex', alignItems: 'center', gap: 7,
                                    background: 'rgba(201,162,39,0.16)', border: '1px solid rgba(201,162,39,0.4)',
                                    borderRadius: 30, padding: '5px 13px', color: '#fff', fontSize: 12, fontWeight: 700,
                                    fontFamily: "'Cairo', sans-serif", cursor: 'pointer', backdropFilter: 'blur(8px)',
                                    transition: 'background 0.15s',
                                }}
                                onMouseEnter={e => e.currentTarget.style.background = 'rgba(201,162,39,0.28)'}
                                onMouseLeave={e => e.currentTarget.style.background = 'rgba(201,162,39,0.16)'}
                            >
                                🧾 إيصالات الدفع
                                {pendingReceiptsCount > 0 && (
                                    <span style={{
                                        background: '#c9a227', color: '#fff', borderRadius: 99,
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

                {/* ═══ CHARTS ROW — إعادة تصميم جذرية ═══ */}
                <div className="da grid grid-cols-1 lg:grid-cols-3 gap-5">

                    {/* لوحة الإيرادات — أعمدة داخل لوحة ليلية (بديل خط الرسم البياني الرفيع) */}
                    <div className="lg:col-span-2" style={{
                        background: 'linear-gradient(135deg, #0d1828 0%, #1b3a60 55%, #14243f 100%)',
                        borderRadius: '28px 28px 18px 18px', padding: '22px 24px', position: 'relative',
                        overflow: 'hidden', border: '1px solid rgba(201,162,39,0.18)',
                        boxShadow: '0 8px 30px rgba(13,24,40,0.35)',
                    }}>
                        <IslamicPatternOverlay opacity={0.15} color="#c9a227" size={54} />
                        <ManuscriptEdge position="top" />
                        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', position: 'relative', zIndex: 1 }}>
                            <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                                <EightPointStar color="#c9a227" size={14} filled />
                                <p style={{ color: '#fff', fontWeight: 900, fontSize: 15, fontFamily: "'Cairo', sans-serif" }}>الإيرادات الشهرية</p>
                            </div>
                            <span style={{ color: 'rgba(226,232,240,0.5)', fontSize: 10.5, fontWeight: 700, fontFamily: "'Cairo', sans-serif" }}>آخر {mo.length} أشهر</span>
                        </div>
                        <div style={{ position: 'relative', zIndex: 1, marginTop: 16 }}>
                            <RevenueBars data={mo} />
                        </div>
                    </div>

                    {/* حضور + تسجيل — لوحتان بخلفية دافئة خفيفة (بديل الكروت البيضاء المسطّحة) */}
                    <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
                        <div style={{
                            background: 'linear-gradient(160deg, rgba(47,188,212,0.07), rgba(201,162,39,0.05))',
                            borderRadius: '26px 26px 18px 18px', padding: 20, flex: 1, position: 'relative', overflow: 'hidden',
                            boxShadow: '0 2px 12px var(--a-shadow)', border: '1px solid var(--a-border)',
                        }}>
                            <IslamicPatternOverlay opacity={0.11} color="#2fbcd4" size={40} />
                            <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 6, position: 'relative' }}>
                                <EightPointStar color="#2fbcd4" size={13} />
                                <p style={{ color: 'var(--a-text)', fontWeight: 900, fontSize: 14, fontFamily: "'Cairo', sans-serif" }}>حضور الطلاب</p>
                            </div>
                            <div style={{ position: 'relative' }}>
                                <AttendanceGauge online={s.online ?? 0} offline={s.offline ?? 0} />
                            </div>
                        </div>
                        <div style={{
                            background: 'linear-gradient(160deg, rgba(201,162,39,0.06), rgba(47,188,212,0.04))',
                            borderRadius: '20px 20px 16px 16px', padding: '14px 18px', position: 'relative', overflow: 'hidden',
                            boxShadow: '0 2px 12px var(--a-shadow)', border: '1px solid var(--a-border)',
                        }}>
                            <IslamicPatternOverlay opacity={0.1} color="#c9a227" size={36} />
                            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 10, position: 'relative' }}>
                                <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                                    <EightPointStar color="#c9a227" size={13} />
                                    <p style={{ color: 'var(--a-text)', fontWeight: 900, fontSize: 13, fontFamily: "'Cairo', sans-serif" }}>تسجيل الطلاب</p>
                                </div>
                                <span style={{ color: 'var(--a-text-4)', fontSize: 10, fontFamily: "'Cairo', sans-serif" }}>شهرياً</span>
                            </div>
                            <div style={{ position: 'relative' }}>
                                <RegistrationSpark data={mo} />
                            </div>
                        </div>
                    </div>
                </div>

                {/* ═══ QUICK ACTIONS — بطاقات ميدالية دائرية ═══ */}
                <div className="da">
                    <SectionHeading title="إجراءات سريعة" color="#2fbcd4" />
                    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(155px, 1fr))', gap: 12 }}>
                        {ACTIONS.map((a, i) => <QuickActionCard key={i} a={a} />)}
                    </div>
                </div>

                {/* ═══ PAYMENT NUMBERS ═══ */}
                <div className="da">
                    <SectionHeading title="إعدادات الدفع" color="#c9a227" />
                    <PaymentNumbersEditor numbers={paymentNumbers} />
                </div>

                {/* ═══ LATEST STUDENTS — بطاقات أفقية بدل الجدول ═══ */}
                <div className="da">
                    <SectionHeading title="آخر الطلاب المسجلين" color="#2fbcd4" action={
                        <Link href="/admin/students" style={{ color: '#2fbcd4', fontSize: 11.5, fontWeight: 700, fontFamily: "'Cairo', sans-serif", textDecoration: 'none', display: 'flex', alignItems: 'center', gap: 3, padding: '4px 11px', borderRadius: 20, background: 'rgba(47,188,212,0.08)', transition: 'background 0.15s' }}
                            onMouseEnter={e => e.currentTarget.style.background = 'rgba(47,188,212,0.15)'}
                            onMouseLeave={e => e.currentTarget.style.background = 'rgba(47,188,212,0.08)'}>
                            عرض الكل
                            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" width={12} height={12}><polyline points="15 18 9 12 15 6" /></svg>
                        </Link>
                    } />
                    <div style={{ background: 'var(--a-card)', borderRadius: '26px 26px 18px 18px', boxShadow: '0 2px 12px var(--a-shadow)', border: '1px solid var(--a-border)', overflow: 'hidden' }}>
                        <StudentsList students={stu} />
                    </div>
                </div>

            </div>

            <ReceiptsReviewModal
                open={showReceipts}
                onClose={() => setShowReceipts(false)}
                receipts={receipts}
                routePrefix="admin"
            />
        </AdminLayout>
    );
}