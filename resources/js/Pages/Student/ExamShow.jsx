import { Head, Link, useForm } from '@inertiajs/react';
import StudentLayout from '@/Layouts/StudentLayout';
import { useState, useEffect, useRef } from 'react';
import { teacherReactionImage } from '@/Utils/teacherReaction';

const O = '#0D9488';
const N = '#14213D';
const G = '#2DD4BF';

/* ═══════════════════════════════════════════════════════
   EXAM SHOW
═══════════════════════════════════════════════════════ */
export default function ExamShow({ exam, result }) {
    const alreadySubmitted = !!result;

    return (
        <StudentLayout>
            <Head title={`${exam.title} — منصة منصور`} />

            <style>{`
                @keyframes fadeUp  { from{opacity:0;transform:translateY(16px)} to{opacity:1;transform:translateY(0)} }
                @keyframes pulse   { 0%,100%{opacity:1} 50%{opacity:.45} }
                @keyframes spin360 { from{transform:rotate(0)} to{transform:rotate(360deg)} }
                @keyframes glow    { 0%,100%{box-shadow:0 0 0 0 rgba(5,150,105,.35)} 50%{box-shadow:0 0 0 12px rgba(5,150,105,0)} }
                @keyframes glowR   { 0%,100%{box-shadow:0 0 0 0 rgba(220,38,38,.3)} 50%{box-shadow:0 0 0 12px rgba(220,38,38,0)} }
                .eu  { animation: fadeUp .4s both }
                .ropt:hover { background:#f1f5f9!important }
                .ropt.sel   { background:#fff7ed!important; border-color:${O}!important }
            `}</style>

            {/* Back */}
            <Link href={route('student.exams')} style={{
                display: 'inline-flex', alignItems: 'center', gap: 6,
                color: '#64748b', fontSize: 13, fontWeight: 600,
                textDecoration: 'none', marginBottom: 18,
                padding: '6px 14px', background: '#fff',
                borderRadius: 10, border: '1px solid #e8e4dc',
                boxShadow: '0 1px 4px rgba(20,33,61,.06)',
                transition: 'all .2s',
            }}>
                ← الامتحانات
            </Link>

            {/* Exam header card */}
            <div className="eu" style={{
                position: 'relative', overflow: 'hidden',
                background: `linear-gradient(135deg,${N} 0%,#1a2d52 60%,#0f1e3a 100%)`,
                borderRadius: 20, padding: '1.75rem 2rem', marginBottom: '1.5rem',
                boxShadow: `0 8px 36px rgba(20,33,61,.22), inset 0 0 0 1px rgba(201,161,74,.12)`,
            }}>
                <div style={{ position: 'absolute', inset: 0, opacity: .035, backgroundImage: 'repeating-linear-gradient(0deg,transparent,transparent 28px,rgba(201,161,74,1) 28px,rgba(201,161,74,1) 29px)', pointerEvents: 'none' }} />
                <div style={{ position: 'absolute', bottom: 8, left: 16, fontSize: 48, opacity: .06, userSelect: 'none' }}>📜</div>

                <h1 style={{ color: '#fff', fontSize: 21, fontWeight: 900, margin: '0 0 6px', position: 'relative' }}>
                    {exam.title}
                </h1>
                {exam.description && (
                    <p style={{ color: 'rgba(220,201,163,.65)', fontSize: 13, margin: '0 0 14px', lineHeight: 1.7 }}>
                        {exam.description}
                    </p>
                )}
                <div style={{ display: 'flex', gap: 10, flexWrap: 'wrap', position: 'relative' }}>
                    <MetaBadge icon="⏱" label={`${exam.time_limit_minutes} دقيقة`} />
                    <MetaBadge icon="🏆" label={`${exam.total_marks} درجة`} />
                    <MetaBadge icon="📋" label={`${exam.questions?.length ?? 0} سؤال`} />
                </div>
            </div>

            {alreadySubmitted
                ? <ResultView exam={exam} result={result} />
                : <ExamForm  exam={exam} />
            }
        </StudentLayout>
    );
}

/* ── Result View ─────────────────────────────────────── */
function ResultView({ exam, result }) {
    const responses = result.responses ?? [];
    const isPending = result.status === 'pending';
    const passed    = result.status === 'passed';
    const pct       = exam.total_marks > 0 ? Math.round((result.score / exam.total_marks) * 100) : 0;

    return (
        <div className="eu">
            {/* Score Banner — side by side, floating */}
            <div style={{ marginBottom: '2rem' }}>
                {isPending ? (
                    <div style={{ textAlign: 'center', padding: '2rem' }}>
                        <div style={{ fontSize: 52, marginBottom: 12 }}>⏳</div>
                        <div style={{ fontSize: 20, fontWeight: 900, color: '#b45309', marginBottom: 6 }}>قيد المراجعة</div>
                        <div style={{ fontSize: 13, color: '#92400e', lineHeight: 1.7 }}>
                            أجاباتك المقالية في انتظار التصحيح من المعلم.<br/>سيتم إشعارك فور الانتهاء.
                        </div>
                    </div>
                ) : (
                    <div style={{
                        display: 'flex', alignItems: 'stretch', justifyContent: 'center',
                        gap: 0, flexWrap: 'wrap',
                        borderRadius: 24,
                        overflow: 'hidden',
                        background: 'rgba(255,255,255,.04)',
                        border: `1px solid ${passed ? 'rgba(52,211,153,.2)' : 'rgba(248,113,113,.2)'}`,
                        boxShadow: `0 0 0 1px ${passed ? 'rgba(52,211,153,.06)' : 'rgba(248,113,113,.06)'}, 0 20px 60px rgba(0,0,0,.18)`,
                        backdropFilter: 'blur(12px)',
                        WebkitBackdropFilter: 'blur(12px)',
                    }}>
                        {/* Left — Score panel */}
                        <div style={{
                            flex: '1 1 260px', minWidth: 220,
                            display: 'flex', flexDirection: 'column',
                            alignItems: 'center', justifyContent: 'center',
                            gap: 18, padding: '2.5rem 2rem',
                            borderLeft: `1px solid ${passed ? 'rgba(52,211,153,.15)' : 'rgba(248,113,113,.15)'}`,
                            position: 'relative', overflow: 'hidden',
                        }}>
                            {/* Radial glow behind ring */}
                            <div style={{
                                position: 'absolute', top: '50%', left: '50%',
                                transform: 'translate(-50%,-50%)',
                                width: 220, height: 220, borderRadius: '50%',
                                background: passed
                                    ? 'radial-gradient(circle,rgba(52,211,153,.12) 0%,transparent 70%)'
                                    : 'radial-gradient(circle,rgba(248,113,113,.12) 0%,transparent 70%)',
                                pointerEvents: 'none',
                            }} />

                            <ScoreRing score={result.score} total={exam.total_marks} passed={passed} />

                            {/* Result badge */}
                            <div style={{
                                display: 'inline-flex', alignItems: 'center', gap: 10,
                                background: passed ? 'rgba(52,211,153,.14)' : 'rgba(248,113,113,.14)',
                                border: `1.5px solid ${passed ? 'rgba(52,211,153,.45)' : 'rgba(248,113,113,.45)'}`,
                                borderRadius: 16, padding: '10px 24px',
                                animation: passed ? 'glow 2.2s ease-in-out infinite' : 'glowR 2.2s ease-in-out infinite',
                            }}>
                                <span style={{ fontSize: 20 }}>{passed ? '✅' : '❌'}</span>
                                <span style={{ fontSize: 18, fontWeight: 900, color: passed ? '#34d399' : '#f87171', letterSpacing: '.02em' }}>
                                    {passed ? 'مبروك! ناجح' : 'للأسف راسب'}
                                </span>
                            </div>

                            {result.finished_at && (
                                <div style={{ fontSize: 11, color: '#94a3b8', display: 'flex', alignItems: 'center', gap: 5 }}>
                                    <span style={{ width: 5, height: 5, borderRadius: '50%', background: '#475569', display: 'inline-block' }} />
                                    سُلِّم في {result.finished_at}
                                </div>
                            )}
                        </div>

                        {/* Right — Teacher image */}
                        <div style={{
                            flex: '0 0 auto',
                            display: 'flex', alignItems: 'flex-end', justifyContent: 'center',
                            padding: '1rem 1.5rem 0',
                            minWidth: 180,
                            position: 'relative',
                        }}>
                            {/* Colored floor glow */}
                            <div style={{
                                position: 'absolute', bottom: 0, left: '50%',
                                transform: 'translateX(-50%)',
                                width: '80%', height: 40, borderRadius: '50%',
                                background: passed
                                    ? 'radial-gradient(ellipse,rgba(52,211,153,.25) 0%,transparent 70%)'
                                    : 'radial-gradient(ellipse,rgba(248,113,113,.25) 0%,transparent 70%)',
                                filter: 'blur(8px)',
                            }} />
                            <img
                                src={teacherReactionImage(pct)}
                                alt="رد فعل المدرس"
                                style={{
                                    height: 240, width: 'auto', objectFit: 'contain',
                                    filter: 'drop-shadow(0 16px 40px rgba(0,0,0,.35))',
                                    position: 'relative',
                                }}
                            />
                        </div>
                    </div>
                )}
            </div>

            {/* Questions review */}
            {exam.questions?.length > 0 && (
                <>
                    <div style={{
                        display: 'flex', alignItems: 'center', gap: 10, marginBottom: 16,
                    }}>
                        <div style={{ flex: 1, height: 1, background: '#e8e4dc' }} />
                        <span style={{ fontSize: 13, fontWeight: 800, color: '#64748b', display: 'flex', alignItems: 'center', gap: 6 }}>
                            📋 مراجعة الإجابات
                        </span>
                        <div style={{ flex: 1, height: 1, background: '#e8e4dc' }} />
                    </div>

                    <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
                        {exam.questions.map((q, i) => {
                            const resp = responses.find(r => r.question_id === q.id);
                            return <QuestionResult key={q.id} question={q} response={resp} index={i} />;
                        })}
                    </div>
                </>
            )}
        </div>
    );
}

/* ── Score Display ───────────────────────────────────── */
function ScoreRing({ score, total, passed }) {
    const pct    = total > 0 ? (score / total) * 100 : 0;
    const R      = 76;
    const stroke = 13;
    const circ   = 2 * Math.PI * R;
    const dash   = circ * (pct / 100);
    const size   = (R + stroke) * 2 + 4;
    const cx     = size / 2;

    const colorA = passed ? '#059669' : '#dc2626';
    const colorB = passed ? '#34d399' : '#f87171';
    const glowId = passed ? 'glowGreen' : 'glowRed';

    return (
        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 6 }}>
            <div style={{ position: 'relative', width: size, height: size }}>
                <svg width={size} height={size} style={{ transform: 'rotate(-90deg)', overflow: 'visible' }}>
                    <defs>
                        <linearGradient id="scoreGrad" x1="0%" y1="0%" x2="100%" y2="0%">
                            <stop offset="0%"   stopColor={colorA} />
                            <stop offset="100%" stopColor={colorB} />
                        </linearGradient>
                        <filter id={glowId} x="-30%" y="-30%" width="160%" height="160%">
                            <feGaussianBlur stdDeviation="4" result="blur" />
                            <feMerge><feMergeNode in="blur"/><feMergeNode in="SourceGraphic"/></feMerge>
                        </filter>
                    </defs>

                    {/* Track */}
                    <circle cx={cx} cy={cx} r={R} fill="none"
                        stroke={passed ? 'rgba(52,211,153,.15)' : 'rgba(248,113,113,.15)'}
                        strokeWidth={stroke} />

                    {/* Filled arc */}
                    <circle cx={cx} cy={cx} r={R} fill="none"
                        stroke="url(#scoreGrad)"
                        strokeWidth={stroke}
                        strokeLinecap="round"
                        strokeDasharray={`${dash} ${circ - dash}`}
                        filter={`url(#${glowId})`}
                        style={{ transition: 'stroke-dasharray 1.4s cubic-bezier(.22,1,.36,1)' }}
                    />

                    {/* Dot at end of arc */}
                    {pct > 3 && (() => {
                        const angle = (pct / 100) * 2 * Math.PI - Math.PI / 2;
                        const dx = cx + R * Math.cos(angle);
                        const dy = cx + R * Math.sin(angle);
                        return <circle cx={dx} cy={dy} r={stroke / 2 - 1} fill={colorB} filter={`url(#${glowId})`} />;
                    })()}
                </svg>

                {/* Center content */}
                <div style={{
                    position: 'absolute', inset: 0,
                    display: 'flex', flexDirection: 'column',
                    alignItems: 'center', justifyContent: 'center',
                }}>
                    <span style={{
                        fontSize: 42, fontWeight: 900, color: colorA,
                        lineHeight: 1, fontFamily: "'Cairo',sans-serif",
                        textShadow: `0 0 20px ${colorA}55`,
                    }}>
                        {score}
                    </span>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 3 }}>
                        <span style={{ fontSize: 11, color: '#94a3b8', fontWeight: 500 }}>من</span>
                        <span style={{ fontSize: 14, fontWeight: 800, color: '#64748b' }}>{total}</span>
                    </div>
                </div>
            </div>

            {/* Percentage bar */}
            <div style={{ textAlign: 'center' }}>
                <div style={{
                    display: 'inline-flex', alignItems: 'center', gap: 6,
                    background: passed ? 'rgba(52,211,153,.12)' : 'rgba(248,113,113,.12)',
                    borderRadius: 99, padding: '4px 14px',
                }}>
                    <span style={{ fontSize: 18, fontWeight: 900, color: colorA }}>{Math.round(pct)}%</span>
                    <span style={{ fontSize: 11, color: '#94a3b8' }}>من الدرجة الكلية</span>
                </div>
            </div>
        </div>
    );
}

/* ── Question Result ─────────────────────────────────── */
function QuestionResult({ question, response, index }) {
    const answered  = response?.selected_answer;
    const isCorrect = response?.is_correct;
    const isMcq     = question.question_type === 'mcq';

    const headerBg = isMcq && answered
        ? (isCorrect ? '#f0fdf4' : '#fef2f2')
        : '#f8f7f4';
    const borderColor = isMcq && answered
        ? (isCorrect ? '#86efac' : '#fca5a5')
        : '#e8e4dc';

    return (
        <div style={{
            background: '#fff', borderRadius: 16, overflow: 'hidden',
            border: `1.5px solid ${borderColor}`,
            boxShadow: '0 2px 14px rgba(20,33,61,.05)',
        }}>
            {/* Header */}
            <div style={{
                padding: '10px 18px', background: headerBg,
                borderBottom: `1px solid ${borderColor}`,
                display: 'flex', alignItems: 'center', justifyContent: 'space-between',
            }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                    <div style={{
                        width: 28, height: 28, borderRadius: '50%', flexShrink: 0,
                        background: isMcq && answered
                            ? (isCorrect ? '#059669' : '#dc2626')
                            : '#e2e8f0',
                        color: isMcq && answered ? '#fff' : '#94a3b8',
                        display: 'flex', alignItems: 'center', justifyContent: 'center',
                        fontSize: 11, fontWeight: 900,
                    }}>
                        {isMcq && answered ? (isCorrect ? '✓' : '✗') : index + 1}
                    </div>
                    <span style={{ fontSize: 13, fontWeight: 800, color: N }}>
                        سؤال {index + 1} · {question.marks} درجة
                    </span>
                </div>
                {isMcq && answered && (
                    <span style={{
                        fontSize: 12, fontWeight: 800,
                        color: isCorrect ? '#059669' : '#dc2626',
                        background: isCorrect ? '#f0fdf4' : '#fef2f2',
                        border: `1px solid ${isCorrect ? '#86efac' : '#fca5a5'}`,
                        borderRadius: 8, padding: '2px 10px',
                    }}>
                        {isCorrect ? '✓ إجابة صحيحة' : '✗ إجابة خاطئة'}
                    </span>
                )}
            </div>

            {/* Body */}
            <div style={{ padding: '14px 18px' }}>
                <p style={{ fontSize: 14, fontWeight: 700, color: N, lineHeight: 1.8, margin: '0 0 14px' }}>
                    {question.question_text}
                </p>

                {question.image_path && (
                    <img
                        src={`/storage/${question.image_path}`}
                        alt="صورة السؤال"
                        style={{ maxWidth: '100%', maxHeight: 320, borderRadius: 12, marginBottom: 14, display: 'block' }}
                    />
                )}

                {isMcq && question.choices?.map((c, ci) => {
                    const isSelected = answered === c.choice_text;
                    const isRight    = question.correct_answer === c.choice_text;
                    let bg = '#f8f7f4', border = '#e8e4dc', clr = '#475569';
                    if (isRight)                { bg = '#f0fdf4'; border = '#86efac'; clr = '#059669'; }
                    if (isSelected && !isRight) { bg = '#fef2f2'; border = '#fca5a5'; clr = '#dc2626'; }
                    return (
                        <div key={ci} style={{
                            display: 'flex', alignItems: 'center', gap: 10,
                            background: bg, border: `1.5px solid ${border}`,
                            borderRadius: 10, padding: '9px 14px', marginBottom: 6,
                        }}>
                            <div style={{
                                width: 18, height: 18, borderRadius: '50%', flexShrink: 0,
                                border: `2px solid ${border}`,
                                background: isRight ? '#059669' : isSelected ? '#dc2626' : '#fff',
                                display: 'flex', alignItems: 'center', justifyContent: 'center',
                            }}>
                                {(isRight || (isSelected && !isRight)) && (
                                    <span style={{ fontSize: 9, color: '#fff', fontWeight: 900 }}>
                                        {isRight ? '✓' : '✗'}
                                    </span>
                                )}
                            </div>
                            <span style={{ fontSize: 13, fontWeight: isRight ? 700 : 400, color: clr, flex: 1 }}>
                                {c.choice_text}
                            </span>
                            {isSelected && !isRight && <span style={{ fontSize: 11, color: '#dc2626', fontWeight: 700 }}>إجابتك</span>}
                            {isRight && !isSelected && <span style={{ fontSize: 11, color: '#059669', fontWeight: 700 }}>✓ الصحيحة</span>}
                            {isRight && isSelected   && <span style={{ fontSize: 11, color: '#059669', fontWeight: 700 }}>✓ إجابتك</span>}
                        </div>
                    );
                })}

                {!isMcq && (
                    <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
                        <div>
                            <div style={{ fontSize: 11, color: '#64748b', fontWeight: 700, marginBottom: 6 }}>إجابتك:</div>
                            <div style={{
                                background: '#f8f7f4', border: '1.5px solid #e8e4dc',
                                borderRadius: 10, padding: '10px 14px',
                                fontSize: 13, color: N, lineHeight: 1.8, whiteSpace: 'pre-wrap', minHeight: 44,
                            }}>
                                {answered || <span style={{ color: '#94a3b8' }}>لم تتم الإجابة</span>}
                            </div>
                        </div>
                        {question.correct_answer && (
                            <div>
                                <div style={{ fontSize: 11, color: '#059669', fontWeight: 700, marginBottom: 6 }}>الإجابة النموذجية:</div>
                                <div style={{
                                    background: '#f0fdf4', border: '1.5px solid #86efac',
                                    borderRadius: 10, padding: '10px 14px',
                                    fontSize: 13, color: '#14532d', lineHeight: 1.8, whiteSpace: 'pre-wrap',
                                }}>
                                    {question.correct_answer}
                                </div>
                            </div>
                        )}
                    </div>
                )}
            </div>
        </div>
    );
}

/* ── Active Exam Form ────────────────────────────────── */
function ExamForm({ exam }) {
    const { data, setData, post, processing } = useForm({ answers: {} });
    const [timeLeft, setTimeLeft]             = useState(exam.time_limit_minutes * 60);
    const timerRef                            = useRef(null);
    const [submitted, setSubmitted]           = useState(false);

    useEffect(() => {
        timerRef.current = setInterval(() => {
            setTimeLeft(t => {
                if (t <= 1) { clearInterval(timerRef.current); handleSubmit(); return 0; }
                return t - 1;
            });
        }, 1000);
        return () => clearInterval(timerRef.current);
    }, []);

    const fmt = (s) => `${Math.floor(s/60).toString().padStart(2,'0')}:${(s%60).toString().padStart(2,'0')}`;

    const handleSubmit = () => {
        if (submitted) return;
        setSubmitted(true);
        clearInterval(timerRef.current);
        post(route('student.exams.submit', exam.id));
    };

    const answered = Object.values(data.answers).filter(a => a && a.trim() !== '').length;
    const total    = exam.questions?.length ?? 0;
    const urgent   = timeLeft <= 60;
    const warning  = timeLeft <= 300;
    const timerColor = urgent ? '#dc2626' : warning ? '#d97706' : '#059669';
    const timerBg    = urgent ? '#fef2f2' : warning ? '#fffbeb' : '#f0fdf4';

    return (
        <div>
            {/* Sticky timer */}
            <div style={{
                position: 'sticky', top: 0, zIndex: 50,
                background: '#fff',
                borderRadius: 14, margin: '0 0 20px',
                boxShadow: '0 4px 24px rgba(20,33,61,.10)',
                border: `2px solid ${timerColor}`,
                overflow: 'hidden',
                animation: urgent ? 'pulse .8s ease-in-out infinite' : 'none',
            }}>
                <div style={{ height: 3, background: timerColor, transition: 'width 1s linear', width: `${(timeLeft / (exam.time_limit_minutes * 60)) * 100}%` }} />
                <div style={{ padding: '10px 20px', display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: 12 }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
                        <div style={{
                            background: timerBg, border: `1px solid ${timerColor}30`,
                            borderRadius: 10, padding: '4px 14px',
                            fontSize: 22, fontFamily: 'monospace', fontWeight: 900, color: timerColor,
                        }}>
                            ⏱ {fmt(timeLeft)}
                        </div>
                        {urgent && (
                            <span style={{ background: '#fef2f2', color: '#dc2626', borderRadius: 8, padding: '3px 12px', fontSize: 12, fontWeight: 700 }}>
                                ⚠️ الوقت ينفد!
                            </span>
                        )}
                    </div>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 8, fontSize: 13, color: '#64748b' }}>
                        <div style={{ display: 'flex', gap: 4 }}>
                            {Array.from({ length: total }).map((_, i) => (
                                <div key={i} style={{
                                    width: 8, height: 8, borderRadius: '50%',
                                    background: i < answered ? O : '#e2e8f0',
                                    transition: 'background .2s',
                                }} />
                            ))}
                        </div>
                        <span><strong style={{ color: N }}>{answered}</strong> / {total}</span>
                    </div>
                </div>
            </div>

            {/* Questions */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: 14, marginBottom: 24 }}>
                {exam.questions?.map((q, i) => (
                    <QuestionCard
                        key={q.id}
                        question={q}
                        index={i}
                        answer={data.answers[q.id] ?? ''}
                        onChange={val => setData('answers', { ...data.answers, [q.id]: val })}
                    />
                ))}
            </div>

            {/* Submit footer */}
            <div style={{
                background: '#fff', borderRadius: 18, padding: '1.25rem 1.5rem',
                boxShadow: '0 4px 24px rgba(20,33,61,.08)',
                border: '1px solid #e8e4dc',
                display: 'flex', alignItems: 'center', justifyContent: 'space-between',
                flexWrap: 'wrap', gap: 12,
            }}>
                <div style={{ fontSize: 13, color: '#64748b' }}>
                    {answered < total
                        ? <span style={{ color: '#d97706' }}>⚠️ لديك <strong>{total - answered}</strong> سؤال غير مجاب</span>
                        : <span style={{ color: '#059669' }}>✅ أجبت على جميع الأسئلة</span>
                    }
                </div>
                <button
                    type="button"
                    onClick={handleSubmit}
                    disabled={processing || submitted}
                    style={{
                        background: processing || submitted ? '#94a3b8' : `linear-gradient(135deg,${O},#d96a12)`,
                        color: '#fff', border: 'none', borderRadius: 12,
                        padding: '12px 32px', fontSize: 14, fontWeight: 800,
                        cursor: processing || submitted ? 'not-allowed' : 'pointer',
                        boxShadow: processing || submitted ? 'none' : `0 6px 20px rgba(244,124,32,.35)`,
                        fontFamily: 'Cairo,sans-serif', transition: 'all .2s',
                    }}
                >
                    {processing || submitted ? '⏳ جارٍ التسليم...' : '✓ تسليم الامتحان'}
                </button>
            </div>
        </div>
    );
}

/* ── Question Card (active) ──────────────────────────── */
function QuestionCard({ question, index, answer, onChange }) {
    const isMcq = question.question_type === 'mcq';

    return (
        <div style={{
            background: '#fff', borderRadius: 16,
            border: answer ? `1.5px solid ${O}50` : '1.5px solid #e8e4dc',
            boxShadow: answer ? `0 4px 18px rgba(244,124,32,.08)` : '0 2px 12px rgba(20,33,61,.05)',
            overflow: 'hidden',
            transition: 'border-color .2s, box-shadow .2s',
        }}>
            {/* Header */}
            <div style={{
                background: answer ? `${O}0D` : '#f8f7f4',
                borderBottom: `1px solid ${answer ? `${O}30` : '#e8e4dc'}`,
                padding: '10px 18px',
                display: 'flex', alignItems: 'center', gap: 12,
                transition: 'background .2s',
            }}>
                <div style={{
                    width: 30, height: 30, borderRadius: '50%', flexShrink: 0,
                    background: answer ? O : '#e2e8f0',
                    color: answer ? '#fff' : '#94a3b8',
                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                    fontSize: answer ? 14 : 12, fontWeight: 900,
                    transition: 'background .2s',
                }}>
                    {answer ? '✓' : index + 1}
                </div>
                <span style={{ fontSize: 13, fontWeight: 800, color: N, flex: 1 }}>
                    سؤال {index + 1}
                </span>
                <span style={{
                    background: `${O}18`, color: O,
                    borderRadius: 99, padding: '2px 10px', fontSize: 11, fontWeight: 700,
                }}>
                    {question.marks} درجة
                </span>
                <span style={{
                    background: isMcq ? '#eff6ff' : '#fefce8',
                    color: isMcq ? '#3b82f6' : '#ca8a04',
                    borderRadius: 99, padding: '2px 10px', fontSize: 11, fontWeight: 600,
                }}>
                    {isMcq ? 'اختياري' : 'مقالي'}
                </span>
            </div>

            {/* Body */}
            <div style={{ padding: '16px 18px' }}>
                <p style={{ fontSize: 14, fontWeight: 600, color: N, lineHeight: 1.8, margin: '0 0 14px' }}>
                    {question.question_text}
                </p>

                {question.image_path && (
                    <img
                        src={`/storage/${question.image_path}`}
                        alt="صورة السؤال"
                        style={{ maxWidth: '100%', maxHeight: 320, borderRadius: 12, marginBottom: 14, display: 'block' }}
                    />
                )}

                {isMcq && question.choices?.map((c, ci) => {
                    const isSelected = answer === c.choice_text;
                    return (
                        <div
                            key={ci}
                            className={`ropt${isSelected ? ' sel' : ''}`}
                            onClick={() => onChange(c.choice_text)}
                            style={{
                                display: 'flex', alignItems: 'center', gap: 10,
                                background: isSelected ? '#fff7ed' : '#f8f7f4',
                                border: `1.5px solid ${isSelected ? O : '#e8e4dc'}`,
                                borderRadius: 10, padding: '10px 14px',
                                marginBottom: 8, cursor: 'pointer',
                                transition: 'border-color .15s, background .15s',
                            }}
                        >
                            <div style={{
                                width: 20, height: 20, borderRadius: '50%', flexShrink: 0,
                                border: `2px solid ${isSelected ? O : '#cbd5e1'}`,
                                background: isSelected ? O : '#fff',
                                display: 'flex', alignItems: 'center', justifyContent: 'center',
                                transition: 'all .15s',
                            }}>
                                {isSelected && <div style={{ width: 7, height: 7, borderRadius: '50%', background: '#fff' }} />}
                            </div>
                            <span style={{ fontSize: 13, color: isSelected ? N : '#475569', fontWeight: isSelected ? 700 : 400, flex: 1 }}>
                                {c.choice_text}
                            </span>
                        </div>
                    );
                })}

                {!isMcq && (
                    <textarea
                        value={answer}
                        onChange={e => onChange(e.target.value)}
                        placeholder="اكتب إجابتك هنا..."
                        rows={4}
                        style={{
                            width: '100%', padding: '11px 14px', boxSizing: 'border-box',
                            borderRadius: 10, resize: 'vertical', lineHeight: 1.8,
                            background: '#f8f7f4',
                            border: `1.5px solid ${answer ? `${O}60` : '#e8e4dc'}`,
                            color: N, fontSize: 13, fontFamily: 'Cairo, sans-serif',
                            outline: 'none', transition: 'border-color .15s',
                        }}
                        onFocus={e  => e.target.style.borderColor = O}
                        onBlur={e   => e.target.style.borderColor = answer ? `${O}60` : '#e8e4dc'}
                    />
                )}
            </div>
        </div>
    );
}

/* ── Meta Badge ──────────────────────────────────────── */
function MetaBadge({ icon, label }) {
    return (
        <div style={{
            background: 'rgba(255,255,255,.1)', border: '1px solid rgba(255,255,255,.18)',
            borderRadius: 99, padding: '5px 14px',
            fontSize: 12, fontWeight: 600, color: 'rgba(255,255,255,.85)',
            display: 'inline-flex', alignItems: 'center', gap: 6,
        }}>
            {icon} {label}
        </div>
    );
}


