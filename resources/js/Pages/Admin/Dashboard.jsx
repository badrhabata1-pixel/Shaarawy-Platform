import React, { useEffect, useRef, useState } from 'react';
import { Link } from '@inertiajs/react';
import AdminLayout from '@/Layouts/AdminLayout';
import gsap from 'gsap';
import ReceiptsReviewModal from '@/Components/ReceiptsReviewModal';
import PaymentNumbersEditor from '@/Components/PaymentNumbersEditor';

/* ═══════════════════════════════════════════════════
   هوية بصرية تاريخية — زخرفة أثرية مصرية قديمة أصيلة
═══════════════════════════════════════════════════ */

function EightPointStar({ size = 16, color = '#1F5A45', filled = false, opacity = 1 }) {
    return (
        <svg width={size} height={size} viewBox="0 0 20 20" style={{ flexShrink: 0, opacity }}>
            <g stroke={color} strokeWidth={filled ? 0 : 1.5} fill={filled ? color : 'none'} strokeLinejoin="round">
                <rect x="3.2" y="3.2" width="13.6" height="13.6" />
                <rect x="3.2" y="3.2" width="13.6" height="13.6" transform="rotate(45 10 10)" />
            </g>
        </svg>
    );
}

function ManuscriptEdge({ position = 'top', color = '#C9A96A' }) {
    return (
        <div style={{
            position: 'absolute', [position]: 10, left: 24, right: 24, height: 1,
            background: `repeating-linear-gradient(90deg, ${color}88 0 6px, transparent 6px 14px)`,
            pointerEvents: 'none',
        }} />
    );
}

/** رموز إيموجي تاريخية خفيفة — لمسة تزيينية بشرية دافئة تكمّل الزخرفة الهندسية
    بدون ما تتزاحم مع المحتوى؛ موضوعة بعناية في زوايا اللوحات الخضراء الكبيرة */
function EmojiAccent({ emoji, size = 20, opacity = 0.32, rotate = 0, style = {} }) {
    return (
        <span aria-hidden="true" style={{
            position: 'absolute', fontSize: size, opacity, lineHeight: 1,
            pointerEvents: 'none', userSelect: 'none',
            filter: 'grayscale(0.1) saturate(0.9)',
            transform: `rotate(${rotate}deg)`,
            ...style,
        }}>{emoji}</span>
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

function SectionHeading({ title, action, color = '#1F5A45' }) {
    return (
        <div style={{ display: 'flex', alignItems: 'center', gap: 14, marginBottom: 13 }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 10, flex: 1, minWidth: 0 }}>
                <EightPointStar color={color} size={15} filled />
                <h2 style={{ color: 'var(--a-text)', fontWeight: 900, fontSize: 16, fontFamily: "'Cairo', sans-serif", whiteSpace: 'nowrap' }}>{title}</h2>
                <div style={{ flex: 1, height: 1, minWidth: 20, background: `linear-gradient(90deg, var(--a-border), rgba(201,169,106,0.35), transparent)` }} />
            </div>
            {action}
        </div>
    );
}

function PenFlourish({ width = 46, height = 12, color = '#1F5A45', strokeWidth = 1.8 }) {
    return (
        <svg width={width} height={height} viewBox="0 0 46 12" fill="none">
            <path d="M2 9 C 10 2, 18 2, 24 6 S 38 10, 44 4" stroke={color} strokeWidth={strokeWidth} strokeLinecap="round" />
            <circle cx="44" cy="4" r={strokeWidth} fill={color} />
        </svg>
    );
}

function PyramidMotif({ opacity = 0.13 }) {
    return (
        <svg style={{ position: 'absolute', left: 0, bottom: 0, height: '100%', width: 'auto', opacity, pointerEvents: 'none' }}
            viewBox="0 0 320 155" preserveAspectRatio="xMinYMax meet" xmlns="http://www.w3.org/2000/svg">
            <line x1="10" y1="153" x2="310" y2="153" stroke="white" strokeWidth="1" opacity="0.5" />
            {/* الهرم الأكبر */}
            <path d="M55 153 L140 38 L225 153 Z" fill="none" stroke="white" strokeWidth="2" opacity="0.55" />
            <path d="M140 38 L140 153" stroke="white" strokeWidth="1" opacity="0.25" />
            <path d="M100 153 L140 88 L180 153" fill="none" stroke="white" strokeWidth="1" opacity="0.3" />
            {/* هرمان أصغر في الخلفية */}
            <path d="M175 153 L218 82 L261 153 Z" fill="none" stroke="white" strokeWidth="1.3" opacity="0.35" />
            <path d="M-20 153 L18 92 L56 153 Z" fill="none" stroke="white" strokeWidth="1" opacity="0.22" />
            {/* قرص الشمس الذهبي */}
            <g opacity="0.85">
                <circle cx="238" cy="42" r="15" fill="none" stroke="#C9A96A" strokeWidth="1.2" />
                <circle cx="238" cy="42" r="8" fill="none" stroke="#C9A96A" strokeWidth="1" opacity="0.7" />
            </g>
            {/* مسلة (أوبليسك) */}
            <path d="M282 153 L282 96 L287.5 82 L293 96 L293 153" fill="none" stroke="white" strokeWidth="1" opacity="0.28" />
        </svg>
    );
}

/** الهرم الأكبر — رمز واحد جريء ونظيف بلا أي دوائر، بطبقات حجرية توحي بالعظمة
    والرسوخ. أنسب لملء بطاقة مربّعة كبيرة بشكل مبهر ومباشر */
function GrandPyramidMotif({ opacity = 0.1, color = '#C9A96A', style = {} }) {
    return (
        <svg viewBox="0 0 200 160" preserveAspectRatio="xMidYMax meet"
            style={{ position: 'absolute', opacity, pointerEvents: 'none', ...style }}>
            <g fill="none" stroke={color} strokeLinecap="round" strokeLinejoin="round">
                <path d="M100 12 L182 150 L18 150 Z" strokeWidth="2.6" />
                <path d="M100 12 L100 150" strokeWidth="1" opacity="0.45" />
                <path d="M60 150 L100 76 L140 150" strokeWidth="1.3" opacity="0.55" />
                <path d="M36 150 L100 40 L164 150" strokeWidth="1" opacity="0.32" />
                <line x1="6" y1="150" x2="194" y2="150" strokeWidth="1.4" opacity="0.4" />
            </g>
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
   STAT CARD — بنتو غير متماثل (feature / wide / compact)
   كل نوع بتصميم داخلي مختلف تمامًا مش مجرد لون مختلف
═══════════════════════════════════════════════════ */
function StatCard({ variant = 'compact', svgContent, label, value, sub, accent, delay = 0, suffix = '' }) {
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

    /* ── البطاقة الكبيرة المميزة (2×2) ── */
    if (variant === 'feature') {
        return (
            <div ref={cardRef} className="stat-feature" onMouseEnter={onEnter} onMouseLeave={onLeave} style={{ position: 'relative' }}>
                {/* رمز الهرم الأكبر — بيطلّ عمدًا فوق حافة البوكس، إحساس "أثر بيكسر الإطار" */}
                <GrandPyramidMotif opacity={0.17} color="#C9A96A"
                    style={{ left: '50%', bottom: 0, height: 'calc(100% + 18px)', width: 'auto', maxWidth: '68%', transform: 'translateX(-50%)', zIndex: 0 }} />

                <div style={{
                    background: `linear-gradient(165deg, var(--a-card) 45%, ${accent}16)`,
                    borderRadius: 28, padding: '26px 26px 22px',
                    position: 'absolute', inset: 0, overflow: 'hidden', cursor: 'default', zIndex: 1,
                    boxShadow: '0 2px 12px var(--a-shadow), 0 0 0 1px var(--a-border)',
                    display: 'flex', flexDirection: 'column', justifyContent: 'space-between',
                    transition: 'box-shadow 0.22s ease',
                }}>
                    <div style={{ position: 'absolute', top: 0, insetInline: 0, height: 3, background: `linear-gradient(90deg, transparent, ${accent}, #C9A96A, transparent)`, opacity: 0.55 }} />

                    <div style={{ position: 'relative', display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between' }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                            <EightPointStar color={accent} size={13} filled />
                            <p style={{ color: 'var(--a-text-4)', fontSize: 12.5, fontWeight: 700, fontFamily: "'Cairo', sans-serif", letterSpacing: '0.02em' }}>{label}</p>
                        </div>
                        <div style={{ width: 54, height: 54, borderRadius: 17, flexShrink: 0, display: 'flex', alignItems: 'center', justifyContent: 'center', background: `linear-gradient(135deg, ${accent}30, ${accent}10)`, boxShadow: `0 0 0 1px ${accent}38, 0 8px 20px ${accent}22` }}>
                            <svg viewBox="0 0 24 24" fill="none" stroke={accent} strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round" width={26} height={26}
                                dangerouslySetInnerHTML={{ __html: svgContent }} />
                        </div>
                    </div>

                    <div style={{ position: 'relative', marginTop: 16 }}>
                        <div style={{ display: 'flex', alignItems: 'baseline', gap: 7 }}>
                            <span ref={numRef} style={{ color: 'var(--a-text)', fontSize: 50, fontWeight: 900, fontFamily: "'Cairo', sans-serif", lineHeight: 1, letterSpacing: '-0.01em' }}>0</span>
                            {suffix && <span style={{ color: 'var(--a-text-4)', fontSize: 15, fontWeight: 700, fontFamily: "'Cairo', sans-serif" }}>{suffix}</span>}
                        </div>
                        {sub && (
                            <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginTop: 11 }}>
                                <div style={{ height: 1, width: 22, background: `linear-gradient(90deg, ${accent}, transparent)` }} />
                                <p style={{ color: accent, fontSize: 11.5, fontWeight: 800, fontFamily: "'Cairo', sans-serif" }}>{sub}</p>
                            </div>
                        )}
                    </div>
                </div>
            </div>
        );
    }

    /* ── البطاقة العريضة (2×1) — تخطيط أفقي ── */
    if (variant === 'wide') {
        return (
            <div ref={cardRef} className="stat-wide" onMouseEnter={onEnter} onMouseLeave={onLeave} style={{
                background: 'var(--a-card)', borderRadius: 22, padding: '16px 20px',
                position: 'relative', overflow: 'hidden', cursor: 'default',
                boxShadow: '0 2px 12px var(--a-shadow), 0 0 0 1px var(--a-border)',
                display: 'flex', alignItems: 'center', gap: 16,
                transition: 'box-shadow 0.22s ease',
            }}>
                <div style={{ width: 50, height: 50, borderRadius: 15, flexShrink: 0, display: 'flex', alignItems: 'center', justifyContent: 'center', position: 'relative', background: `linear-gradient(135deg, ${accent}24, ${accent}0c)`, boxShadow: `0 0 0 1px ${accent}32` }}>
                    <svg viewBox="0 0 24 24" fill="none" stroke={accent} strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" width={22} height={22}
                        dangerouslySetInnerHTML={{ __html: svgContent }} />
                </div>
                <div style={{ flex: 1, minWidth: 0, position: 'relative' }}>
                    <p style={{ color: 'var(--a-text-4)', fontSize: 11.5, fontWeight: 600, fontFamily: "'Cairo', sans-serif" }}>{label}</p>
                    <div style={{ display: 'flex', alignItems: 'baseline', gap: 5, marginTop: 3 }}>
                        <span ref={numRef} style={{ color: 'var(--a-text)', fontSize: 25, fontWeight: 900, fontFamily: "'Cairo', sans-serif", lineHeight: 1 }}>0</span>
                        {suffix && <span style={{ color: 'var(--a-text-4)', fontSize: 11, fontWeight: 600, fontFamily: "'Cairo', sans-serif" }}>{suffix}</span>}
                    </div>
                </div>
                {sub && (
                    <span style={{ position: 'relative', color: accent, fontSize: 10, fontWeight: 800, background: `${accent}16`, padding: '5px 10px', borderRadius: 20, whiteSpace: 'nowrap', flexShrink: 0, fontFamily: "'Cairo', sans-serif" }}>
                        {sub}
                    </span>
                )}
            </div>
        );
    }

    /* ── البطاقة المدمجة (1×1) — التصميم الأصلي الرأسي ── */
    return (
        <div ref={cardRef} className="stat-compact" onMouseEnter={onEnter} onMouseLeave={onLeave} style={{
            background: 'var(--a-card)', borderRadius: '22px 22px 16px 16px', padding: '18px 16px',
            position: 'relative', overflow: 'hidden', cursor: 'default',
            boxShadow: '0 2px 12px var(--a-shadow), 0 0 0 1px var(--a-border)',
            transition: 'box-shadow 0.22s ease',
        }}>
            <ArchAccent id={archId} accent={accent} />
            <div style={{ position: 'absolute', top: 10, left: 10, opacity: 0.14 }}>
                <EightPointStar color={accent} size={12} />
            </div>

            <div style={{ position: 'relative' }}>
                <div style={{ width: 38, height: 38, borderRadius: 12, display: 'flex', alignItems: 'center', justifyContent: 'center', background: `linear-gradient(135deg, ${accent}20, ${accent}0d)`, boxShadow: `0 0 0 1px ${accent}30` }}>
                    <svg viewBox="0 0 24 24" fill="none" stroke={accent} strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" width={18} height={18}
                        dangerouslySetInnerHTML={{ __html: svgContent }} />
                </div>
                <p style={{ color: 'var(--a-text-4)', fontSize: 11, fontWeight: 600, fontFamily: "'Cairo', sans-serif", marginTop: 10 }}>{label}</p>
                <div style={{ display: 'flex', alignItems: 'baseline', gap: 4, marginTop: 3 }}>
                    <span ref={numRef} style={{ color: 'var(--a-text)', fontSize: 24, fontWeight: 900, fontFamily: "'Cairo', sans-serif", lineHeight: 1 }}>0</span>
                    {suffix && <span style={{ color: 'var(--a-text-4)', fontSize: 11, fontWeight: 600, fontFamily: "'Cairo', sans-serif" }}>{suffix}</span>}
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
                <span style={{ fontSize: 12, fontWeight: 700, color: '#C9A96A' }}>ج.م — إجمالي آخر {data.length} أشهر</span>
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
                                    position: 'absolute', bottom: `calc(${h}% + 16px)`, background: '#1C1916', color: '#fff',
                                    fontSize: 11, fontWeight: 700, padding: '5px 11px', borderRadius: 9, whiteSpace: 'nowrap',
                                    border: '1px solid rgba(201,169,106,0.45)', zIndex: 5, fontFamily: "'Cairo', sans-serif",
                                }}>
                                    {(d.revenue ?? 0).toLocaleString('ar-EG')} ج.م
                                </div>
                            )}
                            <EightPointStar color={isLast ? '#C9A96A' : '#1F5A45'} size={9} filled opacity={isLast ? 1 : 0.5} />
                            <div className="rb-bar" style={{
                                width: '100%', maxWidth: 30, height: `${h}%`, borderRadius: '9px 9px 3px 3px',
                                background: isLast ? 'linear-gradient(180deg,#D8B978,#C9A96A 55%,#8B5E3C)' : 'linear-gradient(180deg,#6FA98A,#1F5A45 55%,#123D2D)',
                                boxShadow: isLast ? '0 0 16px rgba(201,169,106,0.4)' : '0 0 10px rgba(31,90,69,0.22)',
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
                            <stop offset="0%" stopColor="#1F5A45" /><stop offset="100%" stopColor="#C9A96A" />
                        </linearGradient>
                    </defs>
                    <path d={path} fill="none" stroke="var(--a-donut-track)" strokeWidth={13} strokeLinecap="round" />
                    <path ref={arcRef} d={path} fill="none" stroke={`url(#${gradId})`} strokeWidth={13} strokeLinecap="round"
                        strokeDasharray={`${circ} ${circ}`} strokeDashoffset={circ}
                        style={{ filter: 'drop-shadow(0 0 6px rgba(31,90,69,0.4))' }} />
                </svg>
                <div style={{ position: 'absolute', bottom: -4, left: 0, right: 0, textAlign: 'center' }}>
                    <p style={{ fontSize: 25, fontWeight: 900, color: 'var(--a-text)', fontFamily: "'Cairo', sans-serif", lineHeight: 1 }}>{Math.round(pct * 100)}%</p>
                    <p style={{ fontSize: 9.5, color: 'var(--a-text-4)', fontWeight: 700, marginTop: 3, fontFamily: "'Cairo', sans-serif" }}>حضور اليوم</p>
                </div>
            </div>
            <div style={{ display: 'flex', justifyContent: 'center', gap: 8, marginTop: 12, flexWrap: 'wrap' }}>
                <span style={{ display: 'inline-flex', alignItems: 'center', gap: 6, background: 'rgba(31,90,69,0.1)', padding: '5px 12px', borderRadius: 20, fontSize: 11, fontWeight: 800, color: '#1F5A45', fontFamily: "'Cairo', sans-serif" }}>
                    <span style={{ width: 7, height: 7, borderRadius: '50%', background: '#1F5A45' }} /> {online ?? 0} حاضر
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
                            background: isLast ? 'linear-gradient(180deg,#D8B978,#C9A96A)' : 'rgba(31,90,69,0.32)',
                            boxShadow: isLast ? '0 0 10px rgba(201,169,106,0.35)' : 'none',
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
    { svg: '<path d="M12 20h9"/><path d="M16.5 3.5a2.121 2.121 0 0 1 3 3L7 19l-4 1 1-4L16.5 3.5z"/>',                                                                                                          label: 'إضافة درس',       sub: 'رفع محتوى جديد',  href: '/admin/lessons/create', accent: '#1F5A45' },
    { svg: '<path d="M9 5H7a2 2 0 0 0-2 2v12a2 2 0 0 0 2 2h10a2 2 0 0 0 2-2V7a2 2 0 0 0-2-2h-2"/><rect x="9" y="3" width="6" height="4" rx="2"/><path d="M9 12h6"/><path d="M9 16h4"/>',                   label: 'إنشاء امتحان',    sub: 'بنك الأسئلة',      href: '/admin/exams/create',   accent: '#0E3A2E' },
    { svg: '<path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/><polyline points="14 2 14 8 20 8"/><line x1="16" y1="13" x2="8" y2="13"/><line x1="16" y1="17" x2="8" y2="17"/>',        label: 'رفع شيت',         sub: 'ملفات PDF',        href: '/admin/sheets/create',  accent: '#8B5E3C' },
    { svg: '<line x1="12" y1="1" x2="12" y2="23"/><path d="M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6"/>',                                                                                           label: 'الاشتراكات',      sub: 'اشتراكات معلّقة',  href: '/admin/subscriptions',  accent: '#C9A96A' },
    { svg: '<polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"/>',                                                                              label: 'الطلاب الأوائل',  sub: 'نتائج ودرجات',     href: '/admin/top-students',   accent: '#D8B978' },
    { svg: '<path d="M20.59 13.41l-7.17 7.17a2 2 0 0 1-2.83 0L2 12V2h10l8.59 8.59a2 2 0 0 1 0 2.82z"/><line x1="7" y1="7" x2="7.01" y2="7"/>',                                                             label: 'أكواد التفعيل',   sub: 'إنشاء وتفعيل',     href: '/admin/promo-codes',    accent: '#2D6B52' },
];

function QuickActionRow({ a }) {
    return (
        <Link href={a.href} className="qa-row" style={{
            display: 'flex', alignItems: 'center', gap: 13,
            flex: '1 1 230px', padding: '13px 14px', borderRadius: 16,
            textDecoration: 'none', position: 'relative', cursor: 'pointer',
            transition: 'background 0.18s ease',
        }}
            onMouseEnter={e => { e.currentTarget.style.background = `${a.accent}12`; }}
            onMouseLeave={e => { e.currentTarget.style.background = 'transparent'; }}>
            <div style={{
                width: 44, height: 44, borderRadius: 13, flexShrink: 0, display: 'flex', alignItems: 'center', justifyContent: 'center',
                background: `linear-gradient(135deg, ${a.accent}26, ${a.accent}0c)`, boxShadow: `0 0 0 1px ${a.accent}32`,
            }}>
                <svg viewBox="0 0 24 24" fill="none" stroke={a.accent} strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" width={20} height={20}
                    dangerouslySetInnerHTML={{ __html: a.svg }} />
            </div>
            <div style={{ flex: 1, minWidth: 0 }}>
                <p style={{ color: 'var(--a-text)', fontWeight: 800, fontSize: 12.5, fontFamily: "'Cairo', sans-serif", lineHeight: 1.3 }}>{a.label}</p>
                <p style={{ color: 'var(--a-text-4)', fontSize: 10.5, marginTop: 2, fontFamily: "'Cairo', sans-serif" }}>{a.sub}</p>
            </div>
            <svg viewBox="0 0 24 24" fill="none" stroke={a.accent} strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" width={12} height={12} style={{ flexShrink: 0, opacity: 0.55 }}>
                <polyline points="15 18 9 12 15 6" />
            </svg>
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
                        background: 'linear-gradient(135deg, #1F5A45, #C9A96A)',
                        display: 'flex', alignItems: 'center', justifyContent: 'center',
                        color: '#fff', fontWeight: 900, fontSize: 14,
                        boxShadow: '0 0 0 3px var(--a-card), 0 0 0 4.5px rgba(31,90,69,0.22)',
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
                            <span style={{ background: 'rgba(201,169,106,0.12)', color: '#C9A96A', padding: '3px 11px', borderRadius: 20, fontSize: 10.5, fontWeight: 700, whiteSpace: 'nowrap' }}>{s.group.name}</span>
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
        { variant: 'feature', svgContent: '<path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/><path d="M23 21v-2a4 4 0 0 0-3-3.87"/><path d="M16 3.13a4 4 0 0 1 0 7.75"/>', label: 'إجمالي الطلاب',   value: s.students    ?? 0, sub: 'طالب مسجل في المنصة',   accent: '#1F5A45', delay: 0.1 },
        { variant: 'wide',    svgContent: '<line x1="12" y1="1" x2="12" y2="23"/><path d="M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6"/>',                                                             label: 'الإيرادات',        value: s.revenue     ?? 0, sub: 'اشتراكات',              accent: '#8B5E3C', delay: 0.2, suffix: 'ج.م' },
        { variant: 'compact', svgContent: '<path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/><path d="M23 21v-2a4 4 0 0 0-3-3.87"/><path d="M16 3.13a4 4 0 0 1 0 7.75"/>', label: 'المجموعات',        value: s.groups      ?? 0, sub: 'مجموعة نشطة',          accent: '#0E3A2E', delay: 0.3 },
        { variant: 'compact', svgContent: '<path d="M4 19.5A2.5 2.5 0 0 1 6.5 17H20"/><path d="M6.5 2H20v20H6.5A2.5 2.5 0 0 1 4 19.5v-15A2.5 2.5 0 0 1 6.5 2z"/>',                                          label: 'الدروس المنشورة', value: s.lessons     ?? 0, sub: 'درس متاح',             accent: '#2D6B52', delay: 0.4 },
        { variant: 'wide',    svgContent: '<path d="M2 9a3 3 0 0 1 0 6v2a2 2 0 0 0 2 2h16a2 2 0 0 0 2-2v-2a3 3 0 0 1 0-6V7a2 2 0 0 0-2-2H4a2 2 0 0 0-2 2Z"/>',                                             label: 'اشتراكات معلّقة',  value: s.pendingSubs ?? 0, sub: 'بانتظار',              accent: '#C9A96A', delay: 0.5 },
        { variant: 'wide',    svgContent: '<polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"/>',                                               label: 'الطلاب الأوائل',  value: s.topStudents ?? 0, sub: 'قوائم الشرف',           accent: '#D8B978', delay: 0.6 },
    ];

    return (
        <AdminLayout title="لوحة التحكم">
            <div ref={pageRef} dir="rtl" style={{ fontFamily: "'Cairo', sans-serif", display: 'flex', flexDirection: 'column', gap: 22, position: 'relative' }}>

                <style>{`
                    .stat-bento {
                        display: grid;
                        grid-template-columns: repeat(4, 1fr);
                        grid-auto-rows: minmax(92px, auto);
                        gap: 14px;
                    }
                    .stat-feature { grid-column: span 2; grid-row: span 2; }
                    .stat-wide    { grid-column: span 2; grid-row: span 1; }
                    .stat-compact { grid-column: span 1; grid-row: span 1; }
                    @media (max-width: 900px) {
                        .stat-bento    { grid-template-columns: repeat(2, 1fr); }
                        .stat-feature  { grid-row: span 1; }
                    }
                    @media (max-width: 560px) {
                        .stat-bento    { grid-template-columns: 1fr; }
                        .stat-feature, .stat-wide, .stat-compact { grid-column: span 1 !important; }
                    }
                    .qa-row { flex: 1 1 230px; }
                    @media (max-width: 560px) { .qa-row { flex-basis: 100%; } }
                    .glow-panel {
                        transition: box-shadow .35s ease, transform .35s ease, border-color .35s ease;
                    }
                    .glow-panel:hover {
                        transform: translateY(-3px);
                        border-color: rgba(201,169,106,0.55) !important;
                        box-shadow: 0 0 0 1px rgba(201,169,106,0.5), 0 0 55px rgba(201,169,106,0.32), 0 16px 40px rgba(0,0,0,0.4) !important;
                    }
                `}</style>


                {/* ═══ HERO BANNER ══ */}
                <div className="da glow-panel" style={{
                    borderRadius: 24, overflow: 'hidden', position: 'relative',
                    background: 'linear-gradient(135deg, #141210 0%, #0E3A2E 45%, #1A3D2E 75%, #1C1916 100%)',
                    padding: '32px 34px', minHeight: 160,
                    boxShadow: '0 8px 40px rgba(14,58,46,0.22)',
                    border: '1px solid rgba(201,169,106,0.18)',
                }}>
                    <div style={{ position: 'absolute', inset: 0, pointerEvents: 'none', background: 'linear-gradient(100deg, transparent 30%, rgba(31,90,69,0.065) 50%, transparent 70%)' }} />
                    <ManuscriptEdge position="top" />
                    <ManuscriptEdge position="bottom" />
                    <PyramidMotif opacity={0.14} />

                    {/* لمسات إيموجي تاريخية خفيفة — موزّعة بعناية في الزوايا الفاضية */}
                    <EmojiAccent emoji="📜" size={19} opacity={0.28} rotate={-12} style={{ top: 16, left: '40%' }} />
                    <EmojiAccent emoji="👑" size={20} opacity={0.3}  rotate={8}   style={{ top: 14, right: 18 }} />
                    <EmojiAccent emoji="🏺" size={22} opacity={0.26} rotate={-6}  style={{ bottom: 16, right: 26 }} />
                    <EmojiAccent emoji="🏛️" size={18} opacity={0.2}  rotate={10}  style={{ bottom: 44, left: '47%' }} />

                    <div aria-hidden="true" style={{
                        position: 'absolute', inset: 0, display: 'flex', alignItems: 'center', justifyContent: 'center',
                        pointerEvents: 'none', overflow: 'hidden', zIndex: 0,
                    }}>
                        <span style={{
                            fontSize: 58, fontWeight: 900, fontFamily: "'Cairo', sans-serif",
                            color: 'rgba(201,169,106,0.4)',
                            whiteSpace: 'nowrap', letterSpacing: '0.02em',
                        }}>رحلة في التاريخ</span>
                    </div>

                    <div style={{ position: 'absolute', top: -50, right: -50, width: 250, height: 250, borderRadius: '50%', pointerEvents: 'none', background: 'radial-gradient(circle, rgba(31,90,69,0.18) 0%, transparent 70%)' }} />

                    <div style={{ position: 'relative', zIndex: 2, display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: 14 }}>
                        <div>
                            <div style={{ display: 'flex', alignItems: 'center', gap: 9, marginBottom: 9 }}>
                                <EightPointStar color="#C9A96A" size={13} filled />
                                <p style={{ color: '#C9A96A', fontSize: 10.5, fontWeight: 700, letterSpacing: '0.2em' }}>DASHBOARD — لوحة التحكم</p>
                            </div>
                            <h1 style={{ color: '#fff', fontSize: 25, fontWeight: 900, lineHeight: 1.25, fontFamily: "'Cairo', sans-serif" }}>أهلاً بك، {nm}</h1>
                            <div style={{ margin: '9px 0 2px', display: 'flex', alignItems: 'center', gap: 8 }}>
                                <PenFlourish width={56} height={12} color="#8B5E3C" strokeWidth={1.8} />
                                <EightPointStar color="#C9A96A" size={9} filled opacity={0.85} />
                            </div>
                            <p style={{ color: 'rgba(226,232,240,0.65)', fontSize: 12.5, marginTop: 5, fontFamily: "'Cairo', sans-serif" }}>
                                {new Date().toLocaleDateString('ar-EG', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}
                            </p>
                        </div>
                        <div style={{ display: 'flex', gap: 9, flexWrap: 'wrap', alignItems: 'center' }}>
                            {[
                                { label: `${s.online ?? 0} متصل`,             dot: '#22c55e' },
                                { label: `${s.pendingSubs ?? 0} اشتراك معلق`, dot: '#1F5A45' },
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
                                    background: 'rgba(201,169,106,0.16)', border: '1px solid rgba(201,169,106,0.4)',
                                    borderRadius: 30, padding: '5px 13px', color: '#fff', fontSize: 12, fontWeight: 700,
                                    fontFamily: "'Cairo', sans-serif", cursor: 'pointer', backdropFilter: 'blur(8px)',
                                    transition: 'background 0.15s',
                                }}
                                onMouseEnter={e => e.currentTarget.style.background = 'rgba(201,169,106,0.28)'}
                                onMouseLeave={e => e.currentTarget.style.background = 'rgba(201,169,106,0.16)'}
                            >
                                🧾 إيصالات الدفع
                                {pendingReceiptsCount > 0 && (
                                    <span style={{
                                        background: '#C9A96A', color: '#fff', borderRadius: 99,
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

                {/* ═══ STAT CARDS — شبكة بنتو غير متماثلة ═══ */}
                <div className="da stat-bento">
                    {cards.map((c, i) => <StatCard key={i} {...c} />)}
                </div>

                {/* ═══ CHARTS ROW — إعادة تصميم جذرية ═══ */}
                <div className="da grid grid-cols-1 lg:grid-cols-3 gap-5">

                    {/* لوحة الإيرادات — أعمدة داخل لوحة ليلية (بديل خط الرسم البياني الرفيع) */}
                    <div className="lg:col-span-2 glow-panel" style={{
                        background: 'linear-gradient(135deg, #1C1916 0%, #0E3A2E 55%, #163024 100%)',
                        borderRadius: '28px 28px 18px 18px', padding: '22px 24px', position: 'relative',
                        overflow: 'hidden', border: '1px solid rgba(201,169,106,0.18)',
                        boxShadow: '0 8px 30px rgba(13,24,40,0.35)',
                    }}>
                        <PyramidMotif opacity={0.09} />
                        <ManuscriptEdge position="top" />
                        <EmojiAccent emoji="🪙" size={19} opacity={0.25} rotate={-10} style={{ top: 16, left: '50%', transform: 'translateX(-50%) rotate(-10deg)' }} />
                        <EmojiAccent emoji="📜" size={17} opacity={0.18} rotate={9}   style={{ bottom: 18, right: 22 }} />
                        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', position: 'relative', zIndex: 1 }}>
                            <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                                <EightPointStar color="#C9A96A" size={14} filled />
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
                            background: 'linear-gradient(160deg, rgba(31,90,69,0.07), rgba(201,169,106,0.05))',
                            borderRadius: '26px 26px 18px 18px', padding: 20, flex: 1, position: 'relative', overflow: 'hidden',
                            boxShadow: '0 2px 12px var(--a-shadow)', border: '1px solid var(--a-border)',
                        }}>
                            <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 6, position: 'relative' }}>
                                <EightPointStar color="#1F5A45" size={13} />
                                <p style={{ color: 'var(--a-text)', fontWeight: 900, fontSize: 14, fontFamily: "'Cairo', sans-serif" }}>حضور الطلاب</p>
                            </div>
                            <div style={{ position: 'relative' }}>
                                <AttendanceGauge online={s.online ?? 0} offline={s.offline ?? 0} />
                            </div>
                        </div>
                        <div style={{
                            background: 'linear-gradient(160deg, rgba(201,169,106,0.06), rgba(31,90,69,0.04))',
                            borderRadius: '20px 20px 16px 16px', padding: '14px 18px', position: 'relative', overflow: 'hidden',
                            boxShadow: '0 2px 12px var(--a-shadow)', border: '1px solid var(--a-border)',
                        }}>
                            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 10, position: 'relative' }}>
                                <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                                    <EightPointStar color="#C9A96A" size={13} />
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

                {/* ═══ QUICK ACTIONS — لوحة واحدة بصفوف أفقية (بديل شبكة الدوائر المكررة) ═══ */}
                <div className="da" style={{
                    background: 'var(--a-card)', borderRadius: '24px 24px 16px 16px', padding: '18px 12px 14px',
                    position: 'relative', overflow: 'hidden',
                    boxShadow: '0 2px 12px var(--a-shadow)', border: '1px solid var(--a-border)',
                }}>
                    <div style={{ position: 'relative', padding: '0 8px' }}>
                        <SectionHeading title="إجراءات سريعة" color="#1F5A45" />
                    </div>
                    <div style={{ position: 'relative', display: 'flex', flexWrap: 'wrap' }}>
                        {ACTIONS.map((a, i) => <QuickActionRow key={i} a={a} />)}
                    </div>
                </div>

                {/* ═══ PAYMENT NUMBERS ═══ */}
                <div className="da">
                    <SectionHeading title="إعدادات الدفع" color="#C9A96A" />
                    <PaymentNumbersEditor numbers={paymentNumbers} />
                </div>

                {/* ═══ LATEST STUDENTS — بطاقات أفقية بدل الجدول ═══ */}
                <div className="da">
                    <SectionHeading title="آخر الطلاب المسجلين" color="#1F5A45" action={
                        <Link href="/admin/students" style={{ color: '#1F5A45', fontSize: 11.5, fontWeight: 700, fontFamily: "'Cairo', sans-serif", textDecoration: 'none', display: 'flex', alignItems: 'center', gap: 3, padding: '4px 11px', borderRadius: 20, background: 'rgba(31,90,69,0.08)', transition: 'background 0.15s' }}
                            onMouseEnter={e => e.currentTarget.style.background = 'rgba(31,90,69,0.15)'}
                            onMouseLeave={e => e.currentTarget.style.background = 'rgba(31,90,69,0.08)'}>
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