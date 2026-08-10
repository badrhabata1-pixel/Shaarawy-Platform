import { Head, usePage } from '@inertiajs/react';
import { useState } from 'react';
import StudentLayout from '@/Layouts/StudentLayout';
import LockOverlay from '@/Components/LockOverlay';
import PromoModal from '@/Components/PromoModal';

const O  = '#F47C20';
const N  = '#14213D';
const G  = '#C9A14A';
const B  = '#DCC9A3';
const DK = '#050a16';

export default function Lessons({ student, unit, lessons }) {
    const [modalLesson, setModalLesson] = useState(null);
    const { props: { flash } } = usePage();

    const examLocked = lessons.filter(l => l.exam_locked).length;
    const payLocked  = lessons.filter(l => !l.exam_locked && l.is_locked && !l.is_unlocked).length;
    const locked     = examLocked + payLocked;
    const unlocked   = lessons.filter(l => !l.exam_locked && (!l.is_locked || l.is_unlocked)).length;
    const completed  = lessons.filter(l => l.is_completed).length;

    // أول محاضرة متاحة وغير مكتملة — "العرض القادم" على الملصق الزمني
    const currentId = lessons.find(l => !l.exam_locked && (!l.is_locked || l.is_unlocked) && !l.is_completed)?.id;

    return (
        <StudentLayout title="🎬 دار العرض">
            <Head title={`${unit?.title ?? 'المحاضرات'} — منصة الصيفي`} />

            <style>{`
                @keyframes bulbChase   { 0%,100%{opacity:.25} 50%{opacity:1} }
                @keyframes posterIn    { from{opacity:0;transform:translateY(26px) scale(.97)} to{opacity:1;transform:translateY(0) scale(1)} }
                @keyframes spotSweep   { 0%,100%{transform:translateX(-8%) rotate(0deg)} 50%{transform:translateX(8%) rotate(2deg)} }
                @keyframes beaconPulse {
                    0%,100% { box-shadow: 0 0 0 0 rgba(244,124,32,.5), 0 0 0 0 rgba(244,124,32,.25); }
                    50%     { box-shadow: 0 0 0 8px rgba(244,124,32,0), 0 0 0 16px rgba(244,124,32,0); }
                }
                .poster { transition: transform .3s cubic-bezier(.22,1,.36,1), box-shadow .3s; }
                .poster:hover { transform: translateY(-8px) rotate(-.4deg); }
                .poster:hover .poster-frame { border-color: ${O} !important; box-shadow: 0 24px 55px rgba(0,0,0,.6), 0 0 22px ${O}22 !important; }
                .poster:hover .poster-img  { transform: scale(1.09) !important; }
                .poster:hover .ticket-cta::after { transform: translateX(160%) !important; }

                .poster-wall { display:grid; grid-template-columns:repeat(auto-fill,minmax(286px,1fr)); gap:30px 24px; }
            `}</style>

            {/* Flash */}
            {flash?.success && (
                <div style={{
                    background: '#EDFAF4', border: '1px solid #7EDBB0',
                    borderRadius: 12, padding: '12px 18px', marginBottom: 20,
                    color: '#1A6B47', fontSize: 14, fontWeight: 700,
                    display: 'flex', alignItems: 'center', gap: 8,
                }}>
                    ✅ {flash.success}
                </div>
            )}

            {/* ── Hero: Cinema marquee ───────────────────────────── */}
            <div style={{
                position: 'relative', overflow: 'hidden',
                background: `radial-gradient(ellipse 80% 120% at 50% -20%, rgba(244,124,32,.12) 0%, transparent 55%), linear-gradient(135deg,${N} 0%,#1a2d52 55%,${DK} 100%)`,
                borderRadius: 24, padding: '2.2rem 2.25rem', marginBottom: '2.5rem',
                boxShadow: `0 10px 46px rgba(20,33,61,.3), inset 0 0 0 1px rgba(201,161,74,.18)`,
                border: '2px solid transparent',
                backgroundClip: 'padding-box',
            }}>
                {/* Marquee chasing bulbs border */}
                <div style={{ position: 'absolute', inset: 8, borderRadius: 18, pointerEvents: 'none', display: 'flex', flexWrap: 'wrap', justifyContent: 'space-between', overflow: 'hidden' }}>
                    {Array.from({ length: 46 }, (_, i) => (
                        <span key={i} style={{
                            position: 'absolute',
                            ...bulbPosition(i, 46),
                            width: 4, height: 4, borderRadius: '50%',
                            background: G, boxShadow: `0 0 6px ${G}`,
                            animation: `bulbChase 1.6s ${(i % 8) * 0.18}s ease-in-out infinite`,
                        }} />
                    ))}
                </div>

                {/* Spotlight beams */}
                <div style={{ position: 'absolute', top: -40, left: '18%', width: 220, height: 300, background: `linear-gradient(180deg, ${O}18, transparent 70%)`, filter: 'blur(6px)', animation: 'spotSweep 9s ease-in-out infinite', pointerEvents: 'none' }} />
                <div style={{ position: 'absolute', top: -40, right: '14%', width: 200, height: 280, background: `linear-gradient(180deg, ${G}14, transparent 70%)`, filter: 'blur(6px)', animation: 'spotSweep 11s ease-in-out infinite reverse', pointerEvents: 'none' }} />

                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: 14, position: 'relative' }}>
                    <div>
                        <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 8 }}>
                            <div style={{ width: 3, height: 18, borderRadius: 2, background: `linear-gradient(180deg,${G},${O})` }} />
                            {unit?.id ? (
                                <a
                                    href={route('student.lessons')}
                                    style={{ color: G, fontSize: 11, fontWeight: 700, letterSpacing: '.05em', textDecoration: 'none' }}
                                >
                                    ← رجوع للوحدات
                                </a>
                            ) : (
                                <span style={{ color: G, fontSize: 11, fontWeight: 700, letterSpacing: '.18em', textTransform: 'uppercase' }}>محاضراتك</span>
                            )}
                        </div>
                        <h1 style={{ color: '#fff', fontSize: 25, fontWeight: 900, margin: '0 0 6px', lineHeight: 1.2, fontFamily: "'Cinzel', serif", letterSpacing: '.02em' }}>
                            🎬 {unit?.title ?? 'دار العرض'}
                        </h1>
                        <p style={{ color: 'rgba(220,201,163,.6)', fontSize: 12, margin: 0 }}>
                            {student.grade} — {lessons.length} عرض على الملصق الزمني
                        </p>
                    </div>

                    {/* Ticket-stub stats */}
                    <div style={{ display: 'flex', gap: 10, flexWrap: 'wrap' }}>
                        <TicketStat icon="✅" label="انتهى عرضه" value={completed} />
                        <TicketStat icon="🎟️" label="يُعرض الآن" value={unlocked - completed} />
                        <TicketStat icon="🔒" label="قريباً" value={locked} />
                    </div>
                </div>
            </div>

            {/* ── Legend ─────────────────────────────────────── */}
            <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap', marginBottom: '2.25rem' }}>
                {[
                    { color: '#059669', label: 'انتهى عرضه', icon: '✅' },
                    { color: O,         label: 'العرض القادم', icon: '🎯' },
                    { color: '#CBD5E1', label: 'قريباً',   icon: '🔒' },
                    { color: '#818cf8', label: 'يتطلب تذكرة امتحان', icon: '✏️' },
                ].map(l => (
                    <div key={l.label} style={{
                        display: 'flex', alignItems: 'center', gap: 6,
                        background: '#fff', border: '1px solid #e8e4dc',
                        borderRadius: 99, padding: '4px 12px',
                        fontSize: 12, color: '#475569', fontWeight: 600,
                        boxShadow: '0 1px 4px rgba(20,33,61,.05)',
                    }}>
                        <div style={{ width: 8, height: 8, borderRadius: '50%', background: l.color }} />
                        {l.icon} {l.label}
                    </div>
                ))}
            </div>

            {/* ── Poster wall ───────────────────────────────────── */}
            {lessons.length === 0 ? (
                <EmptyState />
            ) : (
                <div className="poster-wall">
                    {lessons.map((lesson, i) => (
                        <PosterCard
                            key={lesson.id}
                            lesson={lesson}
                            index={i}
                            isCurrent={lesson.id === currentId}
                            onUnlock={() => setModalLesson(lesson)}
                            mode={student.mode}
                        />
                    ))}
                </div>
            )}

            {modalLesson && (
                <PromoModal
                    lessonId={modalLesson.id}
                    lessonTitle={modalLesson.title}
                    onClose={() => setModalLesson(null)}
                />
            )}
        </StudentLayout>
    );
}

/* Places a bulb evenly around the marquee frame perimeter */
function bulbPosition(i, total) {
    const perSide = total / 4;
    const side = Math.floor(i / perSide);
    const t = (i % perSide) / perSide;
    if (side === 0) return { top: 0, left: `${t * 100}%` };
    if (side === 1) return { top: `${t * 100}%`, right: 0 };
    if (side === 2) return { bottom: 0, right: `${(1 - t) * 100}%` };
    return { bottom: `${(1 - t) * 100}%`, left: 0 };
}

/* ── Ticket-stub stat chip ─────────────────────────────────── */
function TicketStat({ icon, label, value }) {
    return (
        <div style={{
            position: 'relative',
            background: 'rgba(255,255,255,.08)', border: '1px dashed rgba(255,255,255,.22)',
            borderRadius: 10, padding: '7px 14px',
            display: 'flex', alignItems: 'center', gap: 8,
        }}>
            <span style={{ fontSize: 14 }}>{icon}</span>
            <div>
                <div style={{ fontSize: 16, fontWeight: 900, color: '#fff', lineHeight: 1 }}>{value}</div>
                <div style={{ fontSize: 10, color: 'rgba(220,201,163,.6)', fontWeight: 500 }}>{label}</div>
            </div>
        </div>
    );
}

/* ── Status ribbon — diagonal banner across the poster corner ──── */
function StatusRibbon({ isExamLocked, isLocked, isCompleted, isCurrent }) {
    let label, bg;
    if (isExamLocked)      { label = 'يتطلب تذكرة'; bg = 'linear-gradient(135deg,#6366f1,#4f46e5)'; }
    else if (isLocked)     { label = 'قريباً';        bg = 'linear-gradient(135deg,#64748b,#475569)'; }
    else if (isCompleted)  { label = 'انتهى عرضه';    bg = 'linear-gradient(135deg,#059669,#047857)'; }
    else if (isCurrent)    { label = 'يُعرض الآن';     bg = `linear-gradient(135deg,${O},#d9620a)`; }
    else return null;

    return (
        <div style={{
            position: 'absolute', top: 14, insetInlineEnd: -34, zIndex: 4,
            background: bg, color: '#fff', fontSize: 10.5, fontWeight: 800,
            padding: '4px 38px', transform: 'rotate(40deg)',
            boxShadow: '0 3px 10px rgba(0,0,0,.35)', whiteSpace: 'nowrap',
        }}>
            {label}
        </div>
    );
}

/* ── Reel sprocket number badge ──────────────────────────────── */
function ReelBadge({ lesson, isLocked, isExamLocked, isCompleted, isCurrent }) {
    const icon = isExamLocked ? '✏️' : isLocked ? '🔒' : isCompleted ? '✓' : (lesson.order || lesson.lesson_number);
    const ring = isExamLocked ? '#818cf8' : isCompleted ? '#059669' : isCurrent ? O : (isLocked ? '#94a3b8' : G);

    return (
        <div style={{
            position: 'absolute', top: 12, insetInlineStart: 12, zIndex: 4,
            width: 34, height: 34, borderRadius: '50%',
            background: 'rgba(5,10,22,.85)', border: `2px solid ${ring}`,
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            fontSize: typeof icon === 'number' ? 13 : 14, fontWeight: 900, color: '#fff',
            backdropFilter: 'blur(6px)',
            animation: isCurrent ? 'beaconPulse 2.2s ease-in-out infinite' : 'none',
        }}>
            {icon}
        </div>
    );
}

/* ── Poster card ─────────────────────────────────────────── */
function PosterCard({ lesson, index, isCurrent, onUnlock, mode }) {
    const isExamLocked = lesson.exam_locked;
    const isPayLocked  = !isExamLocked && lesson.is_locked && !lesson.is_unlocked;
    const isLocked     = isExamLocked || isPayLocked;
    const isCompleted  = lesson.is_completed;
    const [isHovered, setIsHovered] = useState(false);

    return (
        <div
            className="poster"
            style={{ animation: `posterIn .45s ${index * 0.05}s both` }}
            onMouseEnter={() => setIsHovered(true)}
            onMouseLeave={() => setIsHovered(false)}
        >
            <div
                className="poster-frame"
                style={{
                    background: 'rgba(10, 20, 38, 0.68)',
                    backdropFilter: 'blur(24px) saturate(1.7)',
                    WebkitBackdropFilter: 'blur(24px) saturate(1.7)',
                    borderRadius: 18,
                    overflow: 'hidden',
                    border: isCurrent ? `1px solid ${O}80` : '1px solid rgba(244, 124, 32, 0.15)',
                    boxShadow: isCurrent
                        ? `0 16px 40px rgba(0,0,0,.5), 0 0 22px ${O}25`
                        : '0 10px 32px rgba(0, 0, 0, 0.35), inset 0 1px 0 rgba(255, 255, 255, 0.05)',
                    position: 'relative',
                    display: 'flex',
                    flexDirection: 'column',
                    transition: 'border-color .3s, box-shadow .3s',
                }}
            >
                {/* الملصق (poster) */}
                <div style={{
                    position: 'relative', aspectRatio: '16/9', background: '#040914',
                    overflow: 'hidden', flexShrink: 0,
                }}>
                    <ReelBadge lesson={lesson} isLocked={isLocked} isExamLocked={isExamLocked} isCompleted={isCompleted} isCurrent={isCurrent} />
                    <StatusRibbon isExamLocked={isExamLocked} isLocked={isPayLocked} isCompleted={isCompleted} isCurrent={isCurrent} />

                    {lesson.thumbnail_url ? (
                        <img
                            className="poster-img"
                            src={lesson.thumbnail_url.startsWith('/storage') ? lesson.thumbnail_url : `/storage${lesson.thumbnail_url.startsWith('/') ? '' : '/'}${lesson.thumbnail_url}`}
                            alt={lesson.title}
                            style={{
                                width: '100%', height: '100%', objectFit: 'cover', objectPosition: 'top center',
                                opacity: isLocked ? 0.3 : 1,
                                transition: 'all 0.6s cubic-bezier(0.22, 1, 0.36, 1)',
                            }}
                        />
                    ) : (
                        <DefaultPoster isLocked={isLocked} isParentHovered={isHovered} />
                    )}

                    {lesson.duration > 0 && (
                        <div style={{
                            position: 'absolute', bottom: 12, insetInlineEnd: 12,
                            background: 'rgba(5, 11, 21, 0.72)', color: '#fff',
                            borderRadius: 20, padding: '4px 12px', fontSize: 10, fontWeight: 700,
                            backdropFilter: 'blur(8px)', border: '1px solid rgba(255,255,255,0.1)',
                        }}>⏱ {lesson.duration_fmt || `${lesson.duration} دقيقة`}</div>
                    )}

                    {isLocked && (
                        <LockOverlay
                            lessonTitle={lesson.title}
                            onUnlock={onUnlock}
                            paymentStatus={lesson.payment_status}
                            unitId={lesson.unit_id}
                            mode={mode}
                            examLocked={isExamLocked}
                            gateExamId={lesson.gate_exam_id}
                        />
                    )}
                </div>

                {/* شريط تذكرة مثقّب — فاصل بصري بين الملصق والمحتوى */}
                <TicketTear />

                {/* المحتوى */}
                <div style={{ padding: '0.9rem 1.3rem 1.2rem', flex: 1, display: 'flex', flexDirection: 'column' }}>
                    <h3 style={{
                        color: '#F5F0E8', fontSize: 15, fontWeight: 800, margin: '0 0 8px', lineHeight: 1.5,
                        fontFamily: 'Cairo, sans-serif',
                    }}>
                        {lesson.title}
                    </h3>

                    {lesson.description && (
                        <p style={{
                            color: 'rgba(220, 201, 163, 0.7)', fontSize: 12.5, lineHeight: 1.7,
                            margin: '0 0 16px', overflow: 'hidden', display: '-webkit-box',
                            WebkitLineClamp: 2, WebkitBoxOrient: 'vertical',
                        }}>
                            {lesson.description}
                        </p>
                    )}

                    {lesson.quiz_score != null && (
                        <div style={{
                            background: lesson.quiz_passed ? 'rgba(5, 150, 105, 0.08)' : 'rgba(217, 119, 6, 0.08)',
                            border: `1px solid ${lesson.quiz_passed ? 'rgba(5, 150, 105, 0.3)' : 'rgba(217, 119, 6, 0.3)'}`,
                            borderRadius: 10, padding: '6px 12px', fontSize: 11.5, fontWeight: 700, marginBottom: 14,
                            color: lesson.quiz_passed ? '#34d399' : '#fbbf24',
                            display: 'flex', alignItems: 'center', gap: 6,
                        }}>
                            📊 <span>درجة الاختبار: {lesson.quiz_score}% {lesson.quiz_passed ? '— ناجح ✅' : '— لم تنجح بعد'}</span>
                        </div>
                    )}

                    <div style={{ marginTop: 'auto', paddingTop: 4 }}>
                        {isExamLocked ? (
                            <ExamTicketCTA gateExamId={lesson.gate_exam_id} gateExamTitle={lesson.gate_exam_title} />
                        ) : isPayLocked ? (
                            <LockedTicketCTA paymentStatus={lesson.payment_status} unitId={lesson.unit_id} onUnlock={onUnlock} mode={mode} />
                        ) : (
                            <a
                                href={route('student.lessons.show', lesson.id)}
                                className="ticket-cta"
                                style={{
                                    position: 'relative', overflow: 'hidden',
                                    display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8,
                                    width: '100%',
                                    background: isCompleted ? 'linear-gradient(135deg,#059669,#047857)' : `linear-gradient(135deg, ${O} 0%, #d9620a 100%)`,
                                    color: '#fff', borderRadius: 12, padding: '12px',
                                    fontSize: 13.5, fontWeight: 800, textDecoration: 'none',
                                    boxShadow: isHovered ? (isCompleted ? '0 12px 28px rgba(5,150,105,0.45)' : `0 12px 28px rgba(244,124,32,0.45)`) : 'none',
                                    transform: isHovered ? 'translateY(-2px)' : 'none',
                                    transition: 'all 0.3s cubic-bezier(0.22, 1, 0.36, 1)',
                                }}
                            >
                                <span style={{ position: 'relative', zIndex: 1 }}>{isCompleted ? '🔄 مشاهدة مجدداً' : '🎟️ ادخل القاعة الآن'}</span>
                                <span style={{
                                    position: 'absolute', inset: 0, transform: 'translateX(-160%)',
                                    background: 'linear-gradient(115deg,transparent 30%,rgba(255,255,255,.35) 50%,transparent 70%)',
                                    transition: 'transform .55s ease',
                                }} />
                            </a>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
}

/* ── Perforated ticket-tear divider ──────────────────────────── */
function TicketTear() {
    return (
        <div style={{ position: 'relative', height: 0 }}>
            <div style={{
                position: 'absolute', top: -1, left: 0, right: 0,
                borderTop: '2px dashed rgba(220,201,163,.22)',
            }} />
            <div style={{ position: 'absolute', top: -7, left: -7, width: 14, height: 14, borderRadius: '50%', background: DK }} />
            <div style={{ position: 'absolute', top: -7, right: -7, width: 14, height: 14, borderRadius: '50%', background: DK }} />
        </div>
    );
}

/* ── الملصق الافتراضي بنقوش يونانية كلاسيكية ── */
function DefaultPoster({ isLocked, isParentHovered }) {
    return (
        <div style={{
            width: '100%', height: '100%',
            background: `radial-gradient(circle at center, #142544 0%, #060e1c 100%)`,
            display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center',
            gap: 12, position: 'relative',
        }}>
            <div style={{
                position: 'absolute', inset: 0, opacity: isParentHovered ? 0.08 : 0.04,
                backgroundImage: 'repeating-linear-gradient(0deg,transparent,transparent 18px,rgba(201,161,74,1) 18px,rgba(201,161,74,1) 19px), repeating-linear-gradient(90deg,transparent,transparent 18px,rgba(201,161,74,1) 18px,rgba(201,161,74,1) 19px)',
                transition: 'opacity 0.4s ease',
            }} />
            <div style={{
                width: 48, height: 48, borderRadius: '50%',
                background: isLocked ? 'rgba(255,255,255,0.02)' : isParentHovered ? `rgba(244,124,32,0.2)` : `rgba(201,161,74,0.08)`,
                border: `1.5px solid ${isLocked ? 'rgba(148,163,184,.2)' : isParentHovered ? O : G}`,
                display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 18,
                boxShadow: isLocked ? 'none' : isParentHovered ? `0 0 25px ${O}50` : `0 0 12px ${G}20`,
                transform: isParentHovered ? 'scale(1.1) rotate(-4deg)' : 'none',
                transition: 'all 0.4s cubic-bezier(0.22, 1, 0.36, 1)',
            }}>
                {isLocked ? '🔒' : '🎬'}
            </div>
            <div style={{
                color: B, fontSize: 10, letterSpacing: 4, fontFamily: "'Cinzel', serif",
                opacity: isParentHovered ? 0.9 : 0.5, fontWeight: 700, transition: 'opacity 0.3s ease',
            }}>
                HISTORIA MAGISTRA
            </div>
        </div>
    );
}

/* ── Exam ticket CTA ─────────────────────────────────────── */
function ExamTicketCTA({ gateExamId, gateExamTitle }) {
    const examUrl = gateExamId ? `/student/exams/${gateExamId}` : '/student/exams';
    return (
        <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
            <div style={{
                background: 'rgba(99,102,241,.1)', border: '1px solid rgba(99,102,241,.3)',
                borderRadius: 10, padding: '7px 12px', fontSize: 11.5, fontWeight: 700, color: '#a5b4fc',
                display: 'flex', alignItems: 'center', gap: 6,
            }}>
                ✏️ <span>مطلوب اجتياز {gateExamTitle ? `"${gateExamTitle}"` : 'الامتحان'} بـ 50% أولاً</span>
            </div>
            <a
                href={examUrl}
                style={{
                    width: '100%', boxSizing: 'border-box',
                    background: 'linear-gradient(135deg,#6366f1,#4f46e5)',
                    color: '#fff', borderRadius: 12, padding: '10px', fontSize: 13, fontWeight: 800, textDecoration: 'none',
                    display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 6,
                    boxShadow: '0 4px 16px rgba(99,102,241,.35)', transition: 'opacity .2s',
                }}
                onMouseEnter={e => e.currentTarget.style.opacity = '.88'}
                onMouseLeave={e => e.currentTarget.style.opacity = '1'}
            >
                ✏️ اذهب للامتحان الآن
            </a>
        </div>
    );
}

/* ── Locked ticket CTA ──────────────────────────────────────── */
function LockedTicketCTA({ paymentStatus, unitId, onUnlock, mode }) {
    if (paymentStatus === 'approved' || mode === 'offline') {
        return (
            <button
                onClick={onUnlock}
                style={{
                    width: '100%', background: 'transparent', border: `2px solid ${O}`, color: O,
                    borderRadius: 12, padding: '10px', fontSize: 13, fontWeight: 800, cursor: 'pointer',
                    fontFamily: "'Cairo', sans-serif", transition: 'background .2s, color .2s',
                    display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 6,
                }}
                onMouseEnter={e => { e.currentTarget.style.background = O; e.currentTarget.style.color = '#fff'; }}
                onMouseLeave={e => { e.currentTarget.style.background = 'transparent'; e.currentTarget.style.color = O; }}
            >
                🔑 فتح الدرس بكود التفعيل
            </button>
        );
    }

    if (paymentStatus === 'pending') {
        return (
            <div style={{
                width: '100%', boxSizing: 'border-box',
                background: 'rgba(217,119,6,.08)', border: '2px solid rgba(217,119,6,.3)',
                borderRadius: 12, padding: '10px', fontSize: 12, fontWeight: 700, color: '#D97706',
                display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 6, cursor: 'default',
            }}>
                ⏳ طلبك قيد المراجعة
            </div>
        );
    }

    const payUrl = `/student/payment${unitId ? `?unit_id=${unitId}` : ''}`;
    return (
        <a
            href={payUrl}
            style={{
                width: '100%', boxSizing: 'border-box',
                background: `linear-gradient(135deg,${O},#d96a12)`,
                color: '#fff', borderRadius: 12, padding: '10px', fontSize: 13, fontWeight: 800, textDecoration: 'none',
                display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 6,
                boxShadow: `0 4px 16px rgba(244,124,32,.3)`, transition: 'opacity .2s',
            }}
            onMouseEnter={e => e.currentTarget.style.opacity = '.88'}
            onMouseLeave={e => e.currentTarget.style.opacity = '1'}
        >
            🎟️ اشترِ تذكرة الدخول
        </a>
    );
}

/* ── Empty State ───────────────────────────────────────── */
function EmptyState() {
    return (
        <div style={{
            background: '#fff', borderRadius: 24, padding: '4rem 2rem', textAlign: 'center',
            boxShadow: '0 2px 20px rgba(20,33,61,.06)', border: '1px solid #f0ede8',
            position: 'relative', overflow: 'hidden',
        }}>
            <div style={{ position: 'absolute', top: 20, right: 30, fontSize: 60, opacity: .05 }}>🎬</div>
            <div style={{ position: 'absolute', bottom: 20, left: 30, fontSize: 50, opacity: .05 }}>🎟️</div>
            <div style={{ fontSize: 56, marginBottom: 16 }}>📭</div>
            <h3 style={{ color: N, fontSize: 18, fontWeight: 900, margin: '0 0 10px' }}>
                لا توجد محاضرات بعد
            </h3>
            <p style={{ color: '#94a3b8', fontSize: 13, maxWidth: 320, margin: '0 auto' }}>
                سيتم إضافة محاضرات لصفك قريباً. ترقّبها!
            </p>
        </div>
    );
}
