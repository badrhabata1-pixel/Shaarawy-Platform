import { Head, Link, useForm } from '@inertiajs/react';
import StudentLayout from '@/Layouts/StudentLayout';
import { useState } from 'react';
import { teacherReactionImage } from '@/Utils/teacherReaction';

<<<<<<< HEAD
const O = '#0D9488';
=======
const O = '#F47C20';
>>>>>>> a7d621ecce9a27909d6163081c63c5e4d03bd594
const N = '#14213D';

export default function SheetShow({ sheet, existing_answer }) {
    const answered = !!existing_answer;

    const { data, setData, post, processing } = useForm({ answers: {} });

    const setAnswer = (qId, val) =>
        setData('answers', { ...data.answers, [qId]: val });

    const handleSubmit = (e) => {
        e.preventDefault();
        post(route('student.sheets.submit', sheet.id));
    };

    const totalEarned = answered
        ? Object.values(existing_answer.responses).reduce((s, r) => s + (r.marks_awarded || 0), 0)
        : 0;

    return (
        <StudentLayout>
            <Head title={sheet.title} />

            <style>{`
                @keyframes fadeUp{from{opacity:0;transform:translateY(14px)}to{opacity:1;transform:translateY(0)}}
                .fu{animation:fadeUp .4s both}
                .choice-card{cursor:pointer;transition:border-color .15s,background .15s}
                .choice-card:hover{border-color:${O}!important}
                .submit-btn:hover{opacity:.9}
            `}</style>

            {/* Header */}
            <div className="fu" style={{
                background: `linear-gradient(135deg,${N} 0%,#1e3a6e 100%)`,
                borderRadius: 20, padding: '1.75rem 2rem', marginBottom: '1.5rem',
                display: 'flex', alignItems: 'center', justifyContent: 'space-between',
                flexWrap: 'wrap', gap: 12,
            }}>
                <div>
                    {sheet.lesson_title && (
                        <div style={{ color: 'rgba(255,255,255,.5)', fontSize: 11, marginBottom: 4 }}>
                            📚 {sheet.lesson_title}
                        </div>
                    )}
                    <h1 style={{ color: '#fff', fontSize: 20, fontWeight: 900, margin: 0 }}>
                        📄 {sheet.title}
                    </h1>
                    {sheet.description && (
                        <p style={{ color: 'rgba(255,255,255,.6)', fontSize: 13, margin: '6px 0 0' }}>
                            {sheet.description}
                        </p>
                    )}
                </div>
                <div style={{ display: 'flex', gap: 10, flexWrap: 'wrap', alignItems: 'center' }}>
                    {sheet.total_marks > 0 && (
                        <MetaBadge icon="🏆" label={`${sheet.total_marks} درجة`} />
                    )}
                    {sheet.questions.length > 0 && (
                        <MetaBadge icon="📝" label={`${sheet.questions.length} سؤال`} />
                    )}
                    {sheet.has_pdf && (
                        <a href={sheet.pdf_url} target="_blank" rel="noreferrer" style={{
                            background: `linear-gradient(135deg,${O},#e8641a)`,
                            color: '#fff', borderRadius: 10, padding: '8px 18px',
                            fontSize: 12, fontWeight: 700, textDecoration: 'none',
                        }}>
                            تحميل PDF ↓
                        </a>
                    )}
                    <Link href={route('student.sheets')} style={{
                        background: 'rgba(255,255,255,.12)', color: '#fff',
                        borderRadius: 10, padding: '8px 18px', fontSize: 12,
                        fontWeight: 700, textDecoration: 'none',
                        border: '1px solid rgba(255,255,255,.2)',
                    }}>
                        ← الشيتات
                    </Link>
                </div>
            </div>

            {/* Result banner (if already answered) */}
            {answered && (
                <ResultBanner answer={existing_answer} totalEarned={totalEarned} totalMarks={sheet.total_marks} />
            )}

            {/* No questions */}
            {sheet.questions.length === 0 && (
                <div className="fu" style={{
                    textAlign: 'center', padding: '4rem 2rem',
                    background: '#fff', borderRadius: 20,
                    color: '#94A3B8', fontSize: 15,
                    boxShadow: '0 2px 20px rgba(20,33,61,.06)',
                }}>
                    <div style={{ fontSize: 40, marginBottom: 12 }}>📋</div>
                    هذا الشيت لا يحتوي على أسئلة بعد.
                    {sheet.has_pdf && (
                        <div style={{ marginTop: 12 }}>
                            <a href={sheet.pdf_url} target="_blank" rel="noreferrer" style={{
                                background: `linear-gradient(135deg,${O},#e8641a)`,
                                color: '#fff', borderRadius: 10, padding: '10px 24px',
                                fontSize: 14, fontWeight: 700, textDecoration: 'none', display: 'inline-block',
                            }}>
                                تحميل الشيت PDF ↓
                            </a>
                        </div>
                    )}
                </div>
            )}

            {/* Questions */}
            {sheet.questions.length > 0 && (
                <form onSubmit={handleSubmit}>
                    <div style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>
                        {sheet.questions.map((q, idx) => (
                            <QuestionCard
                                key={q.id}
                                question={q}
                                index={idx}
                                answered={answered}
                                studentAnswer={answered
                                    ? existing_answer.responses[q.id]?.student_answer
                                    : data.answers[q.id]}
                                marksAwarded={answered ? existing_answer.responses[q.id]?.marks_awarded : null}
                                teacherNote={answered ? existing_answer.responses[q.id]?.teacher_note : null}
                                onAnswer={(val) => setAnswer(q.id, val)}
                            />
                        ))}
                    </div>

                    {/* Submit button */}
                    {!answered && (
                        <div style={{ marginTop: 24, textAlign: 'center' }}>
                            <button
                                type="submit"
                                disabled={processing}
                                className="submit-btn"
                                style={{
                                    background: `linear-gradient(135deg,${O},#d96a12)`,
                                    color: '#fff', border: 'none', borderRadius: 14,
                                    padding: '14px 48px', fontSize: 16, fontWeight: 800,
                                    cursor: processing ? 'not-allowed' : 'pointer',
                                    opacity: processing ? 0.7 : 1,
                                    fontFamily: 'Cairo, sans-serif',
                                    boxShadow: `0 4px 20px ${O}40`,
                                }}
                            >
                                {processing ? '⏳ جاري الإرسال...' : '✅ تسليم الإجابات'}
                            </button>
                            <p style={{ color: '#94A3B8', fontSize: 12, marginTop: 10 }}>
                                بعد التسليم لن تتمكن من التعديل
                            </p>
                        </div>
                    )}
                </form>
            )}
        </StudentLayout>
    );
}

/* ── Result Banner ───────────────────────────────── */
function ResultBanner({ answer, totalEarned, totalMarks }) {
    const isPending = answer.status === 'pending';
    const pct = totalMarks > 0 ? Math.round((totalEarned / totalMarks) * 100) : 0;

    return (
        <div className="fu" style={{
            borderRadius: 18, padding: '1.25rem 1.75rem', marginBottom: '1.5rem',
            background: isPending ? '#fef3c7' : (pct >= 50 ? '#d1fae5' : '#fee2e2'),
            border: `2px solid ${isPending ? '#fcd34d' : (pct >= 50 ? '#6ee7b7' : '#fca5a5')}`,
            display: 'flex', alignItems: 'center', justifyContent: 'space-between',
            flexWrap: 'wrap', gap: 12,
        }}>
            <div>
                <div style={{
                    fontSize: 15, fontWeight: 800,
                    color: isPending ? '#d97706' : (pct >= 50 ? '#059669' : '#dc2626'),
                }}>
                    {isPending ? '⏳ في انتظار التصحيح' : (pct >= 50 ? '✅ أجبت على الشيت' : '📝 تم التسليم')}
                </div>
                {answer.feedback && (
                    <div style={{ fontSize: 13, color: '#475569', marginTop: 4 }}>
                        💬 {answer.feedback}
                    </div>
                )}
            </div>
            {totalMarks > 0 && (
                <div style={{ textAlign: 'center' }}>
                    {!isPending && (
                        <img
                            src={teacherReactionImage(pct)}
                            alt="رد فعل المدرس"
                            style={{ height: 190, width: 'auto', objectFit: 'contain', margin: '0 auto 6px', display: 'block' }}
                        />
                    )}
                    <div style={{ fontSize: 28, fontWeight: 900, color: isPending ? '#d97706' : (pct >= 50 ? '#059669' : '#dc2626') }}>
                        {totalEarned} / {totalMarks}
                    </div>
                    <div style={{ fontSize: 12, color: '#64748b' }}>الدرجة</div>
                </div>
            )}
        </div>
    );
}

/* ── Question Card ───────────────────────────────── */
function QuestionCard({ question, index, answered, studentAnswer, marksAwarded, teacherNote, onAnswer }) {
    const isMcq = question.question_type === 'mcq';

    return (
        <div className="fu" style={{
            background: '#fff', borderRadius: 18,
            border: '1px solid #E2E8F0',
            borderRight: `4px solid ${O}`,
            boxShadow: '0 2px 16px rgba(20,33,61,.05)',
            overflow: 'hidden',
            animationDelay: `${index * 0.06}s`,
        }}>
            {/* Q header */}
            <div style={{
                display: 'flex', alignItems: 'center', gap: 12,
                padding: '12px 20px',
                background: `${O}08`,
                borderBottom: '1px solid #F1F5F9',
            }}>
                <span style={{
                    width: 30, height: 30, borderRadius: '50%',
                    background: O, color: '#fff',
                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                    fontSize: 13, fontWeight: 900, flexShrink: 0,
                }}>{index + 1}</span>
                <span style={{ fontSize: 13, fontWeight: 700, color: '#64748b', flex: 1 }}>
                    {isMcq ? '🔵 اختياري' : '✏️ مقالي'}
                    {' · '}
                    <span style={{ color: O }}>({question.marks} {question.marks === 1 ? 'درجة' : 'درجات'})</span>
                </span>
                {answered && marksAwarded !== null && (
                    <span style={{
                        background: marksAwarded > 0 ? '#d1fae5' : '#fee2e2',
                        color: marksAwarded > 0 ? '#059669' : '#dc2626',
                        borderRadius: 99, padding: '3px 12px',
                        fontSize: 12, fontWeight: 700,
                    }}>
                        {marksAwarded}/{question.marks}
                    </span>
                )}
                {answered && marksAwarded === null && (
                    <span style={{
                        background: '#fef3c7', color: '#d97706',
                        borderRadius: 99, padding: '3px 12px',
                        fontSize: 12, fontWeight: 700,
                    }}>
                        ينتظر التصحيح
                    </span>
                )}
            </div>

            <div style={{ padding: '16px 20px' }}>
                {/* Question text */}
                <div style={{
                    fontSize: 15, fontWeight: 700, color: N,
                    lineHeight: 1.7, marginBottom: 16,
                }}>
                    {question.question_text}
                </div>

                {question.image_path && (
                    <img
                        src={`/storage/${question.image_path}`}
                        alt="صورة السؤال"
                        style={{ maxWidth: '100%', maxHeight: 320, borderRadius: 12, marginBottom: 16, display: 'block' }}
                    />
                )}

                {/* MCQ choices */}
                {isMcq && (
                    <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
                        {question.choices.map((choice, ci) => {
                            const isSelected = studentAnswer === choice;
                            const isCorrect  = answered && question.correct_answer === choice;
                            const isWrong    = answered && isSelected && !isCorrect;

                            let borderColor = '#E2E8F0';
                            let bg = '#F8FAFC';
                            let textColor = '#334155';

                            if (answered) {
                                if (isCorrect) { borderColor = '#059669'; bg = '#d1fae5'; textColor = '#065f46'; }
                                else if (isWrong) { borderColor = '#dc2626'; bg = '#fee2e2'; textColor = '#991b1b'; }
                            } else if (isSelected) {
                                borderColor = O; bg = `${O}15`;
                            }

                            return (
                                <div
                                    key={ci}
                                    className={answered ? '' : 'choice-card'}
                                    onClick={() => !answered && onAnswer(choice)}
                                    style={{
                                        display: 'flex', alignItems: 'center', gap: 12,
                                        padding: '11px 16px', borderRadius: 12,
                                        border: `2px solid ${borderColor}`,
                                        background: bg, color: textColor,
                                        fontWeight: isSelected || isCorrect ? 700 : 500,
                                        fontSize: 14,
                                        userSelect: 'none',
                                    }}
                                >
                                    <span style={{
                                        width: 20, height: 20, borderRadius: '50%', flexShrink: 0,
                                        border: `2px solid ${isSelected || isCorrect ? borderColor : '#CBD5E1'}`,
                                        background: isSelected || isCorrect ? borderColor : 'transparent',
                                        display: 'flex', alignItems: 'center', justifyContent: 'center',
                                    }}>
                                        {(isSelected || isCorrect) && (
                                            <span style={{ width: 8, height: 8, borderRadius: '50%', background: '#fff', display: 'block' }} />
                                        )}
                                    </span>
                                    {choice}
                                    {answered && isCorrect && <span style={{ marginRight: 'auto', fontSize: 13 }}>✓ صحيح</span>}
                                    {answered && isWrong && <span style={{ marginRight: 'auto', fontSize: 13 }}>✗</span>}
                                </div>
                            );
                        })}
                    </div>
                )}

                {/* Essay */}
                {!isMcq && (
                    <div>
                        {answered ? (
                            <div style={{
                                background: '#F8FAFC', borderRadius: 12,
                                border: '1.5px solid #E2E8F0',
                                padding: '12px 16px', fontSize: 14,
                                color: studentAnswer ? N : '#94A3B8',
                                lineHeight: 1.7, minHeight: 60,
                                whiteSpace: 'pre-wrap',
                            }}>
                                {studentAnswer || 'لم تكتب إجابة'}
                            </div>
                        ) : (
                            <textarea
                                value={studentAnswer || ''}
                                onChange={e => onAnswer(e.target.value)}
                                placeholder="اكتب إجابتك هنا..."
                                rows={4}
                                style={{
                                    width: '100%', padding: '12px 16px', borderRadius: 12,
                                    border: '1.5px solid #E2E8F0', background: '#F8FAFC',
                                    fontSize: 14, color: N, lineHeight: 1.7,
                                    resize: 'vertical', outline: 'none',
                                    fontFamily: 'Cairo, sans-serif', boxSizing: 'border-box',
                                }}
                            />
                        )}

                        {/* Teacher note */}
                        {answered && teacherNote && (
                            <div style={{
                                marginTop: 10, background: '#fef3c7',
                                border: '1px solid #fcd34d', borderRadius: 10,
                                padding: '8px 14px', fontSize: 13, color: '#92400e',
                            }}>
                                💬 ملاحظة المصحح: {teacherNote}
                            </div>
                        )}
                    </div>
                )}
            </div>
        </div>
    );
}

/* ── Meta Badge ──────────────────────────────────── */
function MetaBadge({ icon, label }) {
    return (
        <div style={{
            background: 'rgba(255,255,255,.12)',
            border: '1px solid rgba(255,255,255,.2)',
            borderRadius: 99, padding: '4px 12px',
            fontSize: 12, fontWeight: 600,
            color: 'rgba(255,255,255,.85)',
            display: 'inline-flex', alignItems: 'center', gap: 6,
        }}>
            {icon} {label}
        </div>
    );
}
