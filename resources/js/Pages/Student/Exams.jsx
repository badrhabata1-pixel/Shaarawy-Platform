import { Head, Link } from '@inertiajs/react';
import { useState, useEffect } from 'react';
import StudentLayout from '@/Layouts/StudentLayout';

const O = '#0D9488';
const N = '#14213D';
const G = '#2DD4BF';

function useStudentDark() {
    const [dark, setDark] = useState(() => {
        try { return localStorage.getItem('student-theme') === 'dark'; } catch { return false; }
    });
    useEffect(() => {
        const el = document.documentElement;
        const check = () => setDark(el.classList.contains('dark'));
        check();
        const obs = new MutationObserver(check);
        obs.observe(el, { attributes: true, attributeFilter: ['class'] });
        return () => obs.disconnect();
    }, []);
    return dark;
}

const STATUS_META = {
    active:   { label: 'جاري الآن', gradient: 'linear-gradient(135deg,#059669,#047857)', pulse: true },
    upcoming: { label: 'قادم',      gradient: 'linear-gradient(135deg,#4F46E5,#3730a3)', pulse: false },
    open:     { label: 'مفتوح',     gradient: 'linear-gradient(135deg,#D97706,#b45309)', pulse: false },
    ended:    { label: 'انتهى',     gradient: 'linear-gradient(135deg,#64748b,#475569)', pulse: false },
};

const GROUP_HEADERS = {
    active:   { icon: '⚡', title: 'جارية الآن',  color: '#059669', border: '#d1fae5', borderDark: 'rgba(52,211,153,.2)' },
    open:     { icon: '📜', title: 'مفتوحة',       color: '#D97706', border: '#fef3c7', borderDark: 'rgba(217,119,6,.2)'   },
    upcoming: { icon: '🕰️', title: 'قادمة',        color: '#4F46E5', border: '#ede9fe', borderDark: 'rgba(79,70,229,.2)'   },
    ended:    { icon: '📚', title: 'منتهية',        color: '#64748b', border: '#f1f5f9', borderDark: 'rgba(255,255,255,.08)' },
};

export default function Exams({ exams }) {
    const dark = useStudentDark();

    const groups = {
        active:   exams.filter(e => e.status === 'active'),
        open:     exams.filter(e => e.status === 'open'),
        upcoming: exams.filter(e => e.status === 'upcoming'),
        ended:    exams.filter(e => e.status === 'ended'),
    };

    return (
        <StudentLayout>
            <Head title="الامتحانات — منصة منصور" />

            <style>{`
                @keyframes fadeUp { from{opacity:0;transform:translateY(18px)} to{opacity:1;transform:translateY(0)} }
                @keyframes pulse  { 0%,100%{opacity:1} 50%{opacity:.5} }
                .eu { animation: fadeUp .45s both }
                .exam-card { transition: transform .2s, box-shadow .2s; }
                .exam-card:hover { transform: translateY(-4px); }
            `}</style>

            {/* Hero */}
            <div className="eu" style={{
                position: 'relative', overflow: 'hidden',
                background: `linear-gradient(135deg,${N} 0%,#1a2d52 55%,#0f1e3a 100%)`,
                borderRadius: 22, padding: '2rem 2.25rem',
                marginBottom: '1.75rem',
                boxShadow: `0 8px 40px rgba(20,33,61,.25), inset 0 0 0 1px rgba(201,161,74,.15)`,
            }}>
                <div style={{ position: 'absolute', inset: 0, opacity: .04, backgroundImage: 'repeating-linear-gradient(0deg,transparent,transparent 28px,rgba(201,161,74,1) 28px,rgba(201,161,74,1) 29px)', pointerEvents: 'none' }} />
                <div style={{ position: 'absolute', top: 14, left: 20, fontSize: 48, opacity: .08, userSelect: 'none' }}>📜</div>
                <div style={{ position: 'absolute', bottom: 10, right: 20, fontSize: 38, opacity: .06, userSelect: 'none' }}>⚖️</div>

                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: 14, position: 'relative' }}>
                    <div>
                        <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 8 }}>
                            <div style={{ width: 3, height: 18, borderRadius: 2, background: `linear-gradient(180deg,${G},${O})` }} />
                            <span style={{ color: G, fontSize: 11, fontWeight: 700, letterSpacing: '.18em', textTransform: 'uppercase' }}>امتحاناتك</span>
                        </div>
                        <h1 style={{ color: '#fff', fontSize: 24, fontWeight: 900, margin: 0, lineHeight: 1.2 }}>
                            📝 الامتحانات
                        </h1>
                        <p style={{ color: 'rgba(220,201,163,.6)', fontSize: 12, marginTop: 6, margin: 0 }}>
                            {exams.length} امتحان في سجلك الدراسي
                        </p>
                    </div>
                    <Link href={route('student.dashboard')} style={{
                        display: 'inline-flex', alignItems: 'center', gap: 6,
                        background: 'rgba(201,161,74,.12)', color: G,
                        borderRadius: 12, padding: '9px 20px',
                        fontSize: 13, fontWeight: 700, textDecoration: 'none',
                        border: `1px solid rgba(201,161,74,.25)`,
                    }}>
                        ← لوحة التحكم
                    </Link>
                </div>
            </div>

            {exams.length === 0 ? (
                <EmptyState dark={dark} />
            ) : (
                <div style={{ display: 'flex', flexDirection: 'column', gap: 32 }}>
                    {(['active','open','upcoming','ended']).map(key =>
                        groups[key].length > 0 && (
                            <ExamGroup key={key} groupKey={key} items={groups[key]} dark={dark} />
                        )
                    )}
                </div>
            )}
        </StudentLayout>
    );
}

function ExamGroup({ groupKey, items, dark }) {
    const h      = GROUP_HEADERS[groupKey];
    const labelBg = dark ? 'rgba(255,255,255,.04)' : '#fff';
    const labelBd = dark ? h.borderDark : h.border;

    return (
        <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 16 }}>
                <div style={{
                    display: 'flex', alignItems: 'center', gap: 8,
                    background: labelBg,
                    border: `1.5px solid ${labelBd}`,
                    borderRadius: 10, padding: '6px 16px',
                    boxShadow: dark ? 'none' : '0 2px 8px rgba(20,33,61,.05)',
                }}>
                    <span style={{ fontSize: 16 }}>{h.icon}</span>
                    <span style={{ fontSize: 13, fontWeight: 800, color: h.color }}>{h.title}</span>
                    <span style={{
                        background: labelBd, color: h.color,
                        borderRadius: 99, padding: '1px 9px', fontSize: 11, fontWeight: 700,
                    }}>{items.length}</span>
                </div>
                <div style={{ flex: 1, height: 1, background: `linear-gradient(90deg,${labelBd},transparent)` }} />
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill,minmax(290px,1fr))', gap: 16 }}>
                {items.map((exam, i) => (
                    <ExamCard key={exam.id} exam={exam} delay={i * 0.07} dark={dark} />
                ))}
            </div>
        </div>
    );
}

function ExamCard({ exam, delay, dark }) {
    const s  = STATUS_META[exam.status] || STATUS_META.open;
    const rs = exam.result_status;

    const cardBg  = dark ? '#152238' : '#fff';
    const cardBd  = dark ? 'rgba(255,255,255,.07)' : '#f0ede8';
    const txtMain = dark ? '#f0f4f8' : N;
    const txtSub  = dark ? 'rgba(220,201,163,.5)' : '#64748b';
    const metaBg  = dark ? 'rgba(255,255,255,.05)' : '#f8f7f4';
    const metaBd  = dark ? 'rgba(255,255,255,.09)' : '#ede9e0';

    const resultColor  = rs === 'passed' ? '#059669' : rs === 'failed' ? '#dc2626' : '#d97706';
    const resultBg     = dark
        ? (rs === 'passed' ? 'rgba(5,150,105,.15)'  : rs === 'failed' ? 'rgba(220,38,38,.15)'  : 'rgba(217,119,6,.15)')
        : (rs === 'passed' ? '#f0fdf4'               : rs === 'failed' ? '#fef2f2'               : '#fffbeb');
    const resultBorder = dark
        ? (rs === 'passed' ? 'rgba(52,211,153,.3)'  : rs === 'failed' ? 'rgba(252,165,165,.3)' : 'rgba(251,191,36,.3)')
        : (rs === 'passed' ? '#86efac'               : rs === 'failed' ? '#fca5a5'               : '#fcd34d');
    const resultIcon  = rs === 'passed' ? '✅' : rs === 'failed' ? '❌' : '⏳';
    const resultLabel = rs === 'passed' ? 'ناجح' : rs === 'failed' ? 'راسب' : 'قيد المراجعة';

    return (
        <div className="eu exam-card" style={{
            animationDelay: `${delay}s`,
            background: cardBg,
            borderRadius: 18,
            overflow: 'hidden',
            boxShadow: dark ? '0 4px 20px rgba(0,0,0,.3)' : '0 2px 20px rgba(20,33,61,.07)',
            border: `1px solid ${cardBd}`,
            display: 'flex', flexDirection: 'column',
        }}>
            <div style={{ height: 4, background: s.gradient }} />

            <div style={{ padding: '14px 18px 0', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
                    {s.pulse && (
                        <span style={{ width: 7, height: 7, borderRadius: '50%', background: '#059669', display: 'inline-block', animation: 'pulse 1.4s ease-in-out infinite' }} />
                    )}
                    <span style={{
                        background: s.gradient, color: '#fff',
                        borderRadius: 99, padding: '3px 12px',
                        fontSize: 11, fontWeight: 700,
                    }}>{s.label}</span>
                    {/* Exam mode badge */}
                    <span style={{
                        background: exam.exam_mode === 'gate' ? 'rgba(99,102,241,.15)' : 'rgba(217,119,6,.15)',
                        color:      exam.exam_mode === 'gate' ? '#818cf8' : '#D97706',
                        border:     `1px solid ${exam.exam_mode === 'gate' ? 'rgba(99,102,241,.3)' : 'rgba(217,119,6,.3)'}`,
                        borderRadius: 99, padding: '2px 9px',
                        fontSize: 10, fontWeight: 700,
                    }}>
                        {exam.exam_mode === 'gate' ? '🔐 بوابة' : '📋 شامل'}
                    </span>
                </div>
                <span style={{ fontSize: 11, color: txtSub, fontWeight: 500 }}>
                    {exam.start_time ?? ''}
                </span>
            </div>

            <div style={{ padding: '12px 18px 18px', flex: 1, display: 'flex', flexDirection: 'column' }}>
                <h3 style={{ fontSize: 15, fontWeight: 900, color: txtMain, margin: '0 0 6px', lineHeight: 1.4 }}>
                    {exam.title}
                </h3>

                {exam.lesson_title && (
                    <div style={{ display: 'flex', alignItems: 'center', gap: 5, marginBottom: 10 }}>
                        <span style={{ fontSize: 13 }}>📚</span>
                        <span style={{ fontSize: 12, color: txtSub, fontWeight: 500 }}>{exam.lesson_title}</span>
                    </div>
                )}

                {exam.description && (
                    <p style={{
                        fontSize: 12, color: txtSub, lineHeight: 1.7,
                        margin: '0 0 12px',
                        overflow: 'hidden', display: '-webkit-box',
                        WebkitLineClamp: 2, WebkitBoxOrient: 'vertical',
                    }}>
                        {exam.description}
                    </p>
                )}

                <div style={{ display: 'flex', gap: 6, flexWrap: 'wrap', marginBottom: 14 }}>
                    {[
                        { icon: '⏱', val: `${exam.time_limit} د` },
                        { icon: '🏆', val: `${exam.total_marks} درجة` },
                        exam.end_time && { icon: '⏰', val: `ينتهي ${exam.end_time}` },
                    ].filter(Boolean).map((m, i) => (
                        <span key={i} style={{
                            display: 'inline-flex', alignItems: 'center', gap: 4,
                            background: metaBg, border: `1px solid ${metaBd}`,
                            borderRadius: 8, padding: '3px 10px',
                            fontSize: 11, color: txtSub, fontWeight: 600,
                        }}>
                            {m.icon} {m.val}
                        </span>
                    ))}
                </div>

                {rs && (
                    <div style={{
                        background: resultBg, border: `1.5px solid ${resultBorder}`,
                        borderRadius: 10, padding: '8px 14px',
                        display: 'flex', alignItems: 'center', justifyContent: 'space-between',
                        marginBottom: 14,
                    }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
                            <span style={{ fontSize: 14 }}>{resultIcon}</span>
                            <span style={{ fontSize: 13, fontWeight: 800, color: resultColor }}>{resultLabel}</span>
                        </div>
                        {exam.result_score != null && (
                            <span style={{ fontSize: 14, fontWeight: 900, color: resultColor, fontFamily: 'monospace' }}>
                                {exam.result_score} / {exam.total_marks}
                            </span>
                        )}
                    </div>
                )}

                <div style={{ marginTop: 'auto', display: 'flex', flexDirection: 'column', gap: 8 }}>
                    {/* Gate exam: can retake (failed and accessible) */}
                    {exam.can_retake && (exam.status === 'active' || exam.status === 'open') && (
                        <Link href={route('student.exams.show', exam.id)} style={{
                            display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 6,
                            background: 'linear-gradient(135deg,#6366f1,#4338ca)',
                            color: '#fff', borderRadius: 12,
                            padding: '11px 0', fontSize: 13, fontWeight: 800,
                            textDecoration: 'none',
                            boxShadow: '0 4px 18px rgba(99,102,241,.35)',
                        }}>
                            🔄 أعد المحاولة
                        </Link>
                    )}

                    {/* Start exam (no result yet, accessible) */}
                    {(exam.status === 'active' || exam.status === 'open') && !rs && (
                        <Link href={route('student.exams.show', exam.id)} style={{
                            display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 6,
                            background: `linear-gradient(135deg,${O},#d96a12)`,
                            color: '#fff', borderRadius: 12,
                            padding: '11px 0', fontSize: 13, fontWeight: 800,
                            textDecoration: 'none',
                            boxShadow: `0 4px 18px rgba(244,124,32,.3)`,
                        }}>
                            ✍️ ابدأ الامتحان
                        </Link>
                    )}

                    {/* View result (always when there's a result) */}
                    {rs && (
                        <Link href={route('student.exams.show', exam.id)} style={{
                            display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 6,
                            background: metaBg, color: txtMain,
                            border: `1.5px solid ${metaBd}`,
                            borderRadius: 12, padding: '10px 0',
                            fontSize: 13, fontWeight: 700, textDecoration: 'none',
                        }}>
                            📊 عرض النتيجة
                        </Link>
                    )}

                    {/* Not accessible yet */}
                    {exam.status !== 'active' && exam.status !== 'open' && !rs && (
                        <div style={{
                            display: 'flex', alignItems: 'center', justifyContent: 'center',
                            background: metaBg, borderRadius: 12, padding: '10px 0',
                            color: txtSub, fontSize: 12, fontWeight: 600,
                            border: `1.5px dashed ${metaBd}`,
                        }}>
                            🔒 غير متاح بعد
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}

function EmptyState({ dark }) {
    const cardBg = dark ? '#152238' : '#fff';
    const cardBd = dark ? 'rgba(255,255,255,.07)' : '#f0ede8';
    const txtSub = dark ? 'rgba(220,201,163,.45)' : '#94a3b8';

    return (
        <div className="eu" style={{
            background: cardBg, borderRadius: 24,
            padding: '4rem 2rem', textAlign: 'center',
            boxShadow: dark ? '0 4px 20px rgba(0,0,0,.3)' : '0 2px 20px rgba(20,33,61,.06)',
            border: `1px solid ${cardBd}`,
            position: 'relative', overflow: 'hidden',
        }}>
            <div style={{ position: 'absolute', top: 20, right: 30, fontSize: 60, opacity: .05 }}>📜</div>
            <div style={{ position: 'absolute', bottom: 20, left: 30, fontSize: 50, opacity: .05 }}>⚖️</div>

            <div style={{ fontSize: 56, marginBottom: 16 }}>📭</div>
            <h3 style={{ color: dark ? '#DCC9A3' : N, fontSize: 18, fontWeight: 900, margin: '0 0 10px' }}>
                لا توجد امتحانات بعد
            </h3>
            <p style={{ color: txtSub, fontSize: 13, maxWidth: 320, margin: '0 auto' }}>
                لم يتم إضافة أي امتحانات لصفك الدراسي حتى الآن. ترقّب الإشعارات!
            </p>
        </div>
    );
}


