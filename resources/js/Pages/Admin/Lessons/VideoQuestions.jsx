import AdminLayout from '@/Layouts/AdminLayout';
import { Head, Link, useForm, router } from '@inertiajs/react';
import { useState } from 'react';

const O = '#2fbcd4';
const G = '#2fbcd4';
const OPTION_LABELS = { a: 'أ', b: 'ب', c: 'ج', d: 'د' };
const OPTION_KEYS   = ['a', 'b', 'c', 'd'];

/* ── Trigger minute for question at idx (0-based) out of n total ── */
function triggerMin(idx, total, durationMin) {
    if (!durationMin || !total) return null;
    return Math.round(durationMin * (idx + 1) / (total + 1));
}

/* ── Options grid ── */
function OptionsGrid({ options, correctAnswer, onOptionChange, onCorrectChange, errors }) {
    return (
        <div>
            <label style={{ display: 'block', color: 'var(--a-text-3)', fontSize: 12, fontWeight: 700, marginBottom: 8 }}>
                الخيارات — اضغط على رمز الخيار لتحديده كإجابة صحيحة ✅
            </label>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 10 }}>
                {OPTION_KEYS.map(k => {
                    const isCorrect = correctAnswer === k;
                    return (
                        <div key={k} style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                            <button
                                type="button"
                                onClick={() => onCorrectChange(k)}
                                style={{
                                    width: 32, height: 32, borderRadius: '50%', flexShrink: 0,
                                    background: isCorrect ? O : 'var(--a-card-2)',
                                    color: isCorrect ? '#fff' : 'var(--a-text-4)',
                                    border: `2px solid ${isCorrect ? O : 'var(--a-border)'}`,
                                    cursor: 'pointer', fontSize: 12, fontWeight: 900,
                                    transition: 'all .2s', display: 'flex', alignItems: 'center', justifyContent: 'center',
                                }}
                            >
                                {OPTION_LABELS[k]}
                            </button>
                            <input
                                type="text"
                                value={options[k]}
                                onChange={e => onOptionChange(k, e.target.value)}
                                placeholder={`الخيار ${OPTION_LABELS[k]}`}
                                required
                                style={{
                                    flex: 1, outline: 'none',
                                    background: 'var(--a-input)', color: 'var(--a-text)',
                                    border: '1.5px solid var(--a-input-b)', borderRadius: 10,
                                    padding: '8px 12px', fontSize: 13, fontFamily: 'Cairo',
                                    direction: 'rtl', transition: 'border-color .2s',
                                }}
                                onFocus={e => e.target.style.borderColor = O}
                                onBlur={e  => e.target.style.borderColor = 'var(--a-input-b)'}
                            />
                        </div>
                    );
                })}
            </div>
            {errors?.['options.a'] && (
                <p style={{ color: '#EF4444', fontSize: 11, marginTop: 4 }}>يجب ملء جميع الخيارات</p>
            )}
        </div>
    );
}

/* ── Existing question card ── */
function QuestionCard({ question, index, total, durationMin }) {
    const [editing, setEditing] = useState(false);

    const { data, setData, put, processing, errors } = useForm({
        question_text:  question.question_text,
        options:        { ...question.options },
        correct_answer: question.correct_answer,
    });

    const handleSubmit = (e) => {
        e.preventDefault();
        put(`/admin/video-questions/${question.id}`, {
            onSuccess: () => setEditing(false),
        });
    };

    const handleDelete = () => {
        if (!confirm('هتحذف السؤال ده نهائياً؟')) return;
        router.delete(`/admin/video-questions/${question.id}`);
    };

    const min = triggerMin(index, total, durationMin);

    return (
        <div style={{
            background: 'var(--a-card)',
            border: '1px solid var(--a-border)',
            borderRadius: 16, overflow: 'hidden',
            boxShadow: '0 1px 6px var(--a-shadow)',
        }}>
            {/* Header */}
            <div style={{
                display: 'flex', alignItems: 'center', justifyContent: 'space-between',
                padding: '12px 16px', background: 'var(--a-card-2)',
                borderBottom: '1px solid var(--a-border)',
            }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
                    <div style={{
                        width: 34, height: 34, borderRadius: 10, flexShrink: 0,
                        background: O, color: '#fff',
                        fontSize: 14, fontWeight: 900,
                        display: 'flex', alignItems: 'center', justifyContent: 'center',
                    }}>
                        {index + 1}
                    </div>
                    <div>
                        <div style={{ color: 'var(--a-text)', fontWeight: 700, fontSize: 14 }}>
                            سؤال {index + 1}
                        </div>
                        {min !== null ? (
                            <div style={{ color: G, fontSize: 11, fontWeight: 600 }}>
                                ⏱ يظهر عند الدقيقة {min}
                            </div>
                        ) : (
                            <div style={{ color: 'var(--a-text-4)', fontSize: 11 }}>
                                حدد مدة الدرس لرؤية التوقيت
                            </div>
                        )}
                    </div>
                </div>
                <div style={{ display: 'flex', gap: 8 }}>
                    <button
                        type="button"
                        onClick={() => setEditing(v => !v)}
                        style={{
                            padding: '5px 14px', borderRadius: 8,
                            background: editing ? `rgba(47,188,212,.12)` : 'var(--a-card)',
                            border: `1px solid ${editing ? O : 'var(--a-border)'}`,
                            color: editing ? O : 'var(--a-text-3)',
                            fontSize: 12, fontWeight: 700, cursor: 'pointer', fontFamily: 'Cairo',
                        }}
                    >
                        {editing ? '✕ إلغاء' : '✏️ تعديل'}
                    </button>
                    <button
                        type="button"
                        onClick={handleDelete}
                        style={{
                            width: 34, height: 34, borderRadius: 8, flexShrink: 0,
                            background: 'rgba(239,68,68,.1)', border: '1px solid rgba(239,68,68,.2)',
                            color: '#EF4444', cursor: 'pointer', fontSize: 14,
                            display: 'flex', alignItems: 'center', justifyContent: 'center',
                        }}
                        title="حذف"
                    >🗑</button>
                </div>
            </div>

            {/* Preview */}
            {!editing && (
                <div style={{ padding: '14px 16px' }}>
                    <p style={{ color: 'var(--a-text)', fontSize: 13, fontWeight: 600, marginBottom: 12, lineHeight: 1.75 }}>
                        {question.question_text}
                    </p>
                    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 8 }}>
                        {OPTION_KEYS.map(k => (
                            <div key={k} style={{
                                display: 'flex', alignItems: 'center', gap: 8, fontSize: 12,
                                color: question.correct_answer === k ? '#10B981' : 'var(--a-text-4)',
                            }}>
                                <span style={{
                                    width: 22, height: 22, borderRadius: '50%', flexShrink: 0,
                                    background: question.correct_answer === k ? 'rgba(16,185,129,.2)' : 'var(--a-card-2)',
                                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                                    fontSize: 10, fontWeight: 900,
                                }}>
                                    {OPTION_LABELS[k]}
                                </span>
                                {question.options[k]}
                                {question.correct_answer === k && ' ✓'}
                            </div>
                        ))}
                    </div>
                </div>
            )}

            {/* Edit form */}
            {editing && (
                <form onSubmit={handleSubmit} style={{ padding: 16, display: 'flex', flexDirection: 'column', gap: 18 }}>
                    <div>
                        <label style={{ display: 'block', color: 'var(--a-text-3)', fontSize: 12, fontWeight: 700, marginBottom: 6 }}>
                            نص السؤال *
                        </label>
                        <textarea
                            value={data.question_text}
                            onChange={e => setData('question_text', e.target.value)}
                            rows={3}
                            required
                            style={{
                                width: '100%', resize: 'vertical', outline: 'none', boxSizing: 'border-box',
                                background: 'var(--a-input)', color: 'var(--a-text)',
                                border: '1.5px solid var(--a-input-b)', borderRadius: 12,
                                padding: '10px 14px', fontSize: 13, fontFamily: 'Cairo', direction: 'rtl',
                            }}
                            onFocus={e => e.target.style.borderColor = O}
                            onBlur={e  => e.target.style.borderColor = 'var(--a-input-b)'}
                        />
                        {errors.question_text && <p style={{ color: '#EF4444', fontSize: 11, marginTop: 4 }}>{errors.question_text}</p>}
                    </div>
                    <OptionsGrid
                        options={data.options}
                        correctAnswer={data.correct_answer}
                        onOptionChange={(k, v) => setData('options', { ...data.options, [k]: v })}
                        onCorrectChange={k => setData('correct_answer', k)}
                        errors={errors}
                    />
                    <div style={{ display: 'flex', gap: 10, paddingTop: 10, borderTop: '1px solid var(--a-border)' }}>
                        <button type="submit" disabled={processing}
                            style={{
                                padding: '9px 22px', borderRadius: 10, border: 'none',
                                background: O, color: '#fff',
                                fontSize: 13, fontWeight: 700, fontFamily: 'Cairo',
                                cursor: processing ? 'not-allowed' : 'pointer', opacity: processing ? .7 : 1,
                            }}
                        >
                            {processing ? 'جارٍ الحفظ...' : '💾 حفظ التعديل'}
                        </button>
                        <button type="button" onClick={() => setEditing(false)}
                            style={{
                                padding: '9px 18px', borderRadius: 10,
                                background: 'var(--a-cancel-bg)', color: 'var(--a-cancel-text)',
                                border: '1px solid var(--a-cancel-border)',
                                fontSize: 13, fontWeight: 600, fontFamily: 'Cairo', cursor: 'pointer',
                            }}
                        >
                            إلغاء
                        </button>
                    </div>
                </form>
            )}
        </div>
    );
}

/* ── Add new question card ── */
function AddQuestionCard({ lesson, videoIndex, newIndex, newTotal }) {
    const [open, setOpen] = useState(false);

    const { data, setData, post, processing, errors, reset } = useForm({
        question_text:  '',
        options:        { a: '', b: '', c: '', d: '' },
        correct_answer: 'a',
        video_index:    videoIndex,
    });

    // Keep video_index in sync if the parent tab changes
    const handleOpen = () => {
        setData('video_index', videoIndex);
        setOpen(true);
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        post(`/admin/lessons/${lesson.id}/video-questions`, {
            onSuccess: () => { reset(); setOpen(false); },
        });
    };

    const min = triggerMin(newIndex, newTotal, lesson.duration_minutes);

    return (
        <div style={{
            border: `2px dashed ${open ? O : 'var(--a-border)'}`,
            borderRadius: 16, overflow: 'hidden', transition: 'border-color .2s',
        }}>
            {!open ? (
                <button
                    type="button"
                    onClick={handleOpen}
                    style={{
                        width: '100%', padding: '16px',
                        background: 'transparent', border: 'none',
                        color: O, fontSize: 14, fontWeight: 700,
                        cursor: 'pointer', fontFamily: 'Cairo',
                        display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8,
                    }}
                >
                    <span style={{ fontSize: 22, lineHeight: 1 }}>+</span>
                    إضافة سؤال جديد
                    {min !== null && (
                        <span style={{ fontSize: 12, fontWeight: 600, opacity: .7 }}>
                            (سيظهر عند الدقيقة {min})
                        </span>
                    )}
                </button>
            ) : (
                <div style={{ background: 'var(--a-card)', padding: 16 }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 16 }}>
                        <div style={{
                            width: 34, height: 34, borderRadius: 10, flexShrink: 0,
                            background: `rgba(47,188,212,.12)`, border: `1.5px solid ${O}`,
                            color: O, fontSize: 15, fontWeight: 900,
                            display: 'flex', alignItems: 'center', justifyContent: 'center',
                        }}>
                            {newIndex + 1}
                        </div>
                        <div>
                            <div style={{ color: 'var(--a-text)', fontWeight: 700, fontSize: 14 }}>
                                سؤال {newIndex + 1} — جديد
                            </div>
                            {min !== null && (
                                <div style={{ color: G, fontSize: 11 }}>
                                    ⏱ سيظهر عند الدقيقة {min} من {lesson.duration_minutes} دقيقة
                                </div>
                            )}
                        </div>
                    </div>

                    <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: 18 }}>
                        <div>
                            <label style={{ display: 'block', color: 'var(--a-text-3)', fontSize: 12, fontWeight: 700, marginBottom: 6 }}>
                                نص السؤال *
                            </label>
                            <textarea
                                value={data.question_text}
                                onChange={e => setData('question_text', e.target.value)}
                                rows={3}
                                placeholder="اكتب السؤال هنا..."
                                required
                                style={{
                                    width: '100%', resize: 'vertical', outline: 'none', boxSizing: 'border-box',
                                    background: 'var(--a-input)', color: 'var(--a-text)',
                                    border: '1.5px solid var(--a-input-b)', borderRadius: 12,
                                    padding: '10px 14px', fontSize: 13, fontFamily: 'Cairo', direction: 'rtl',
                                }}
                                onFocus={e => e.target.style.borderColor = O}
                                onBlur={e  => e.target.style.borderColor = 'var(--a-input-b)'}
                            />
                            {errors.question_text && <p style={{ color: '#EF4444', fontSize: 11, marginTop: 4 }}>{errors.question_text}</p>}
                        </div>

                        <OptionsGrid
                            options={data.options}
                            correctAnswer={data.correct_answer}
                            onOptionChange={(k, v) => setData('options', { ...data.options, [k]: v })}
                            onCorrectChange={k => setData('correct_answer', k)}
                            errors={errors}
                        />

                        <div style={{ display: 'flex', gap: 10, paddingTop: 10, borderTop: '1px solid var(--a-border)' }}>
                            <button type="submit" disabled={processing}
                                style={{
                                    padding: '9px 22px', borderRadius: 10, border: 'none',
                                    background: O, color: '#fff',
                                    fontSize: 13, fontWeight: 700, fontFamily: 'Cairo',
                                    cursor: processing ? 'not-allowed' : 'pointer', opacity: processing ? .7 : 1,
                                }}
                            >
                                {processing ? 'جارٍ الإضافة...' : '➕ إضافة السؤال'}
                            </button>
                            <button type="button" onClick={() => { reset(); setOpen(false); }}
                                style={{
                                    padding: '9px 18px', borderRadius: 10,
                                    background: 'var(--a-cancel-bg)', color: 'var(--a-cancel-text)',
                                    border: '1px solid var(--a-cancel-border)',
                                    fontSize: 13, fontWeight: 600, fontFamily: 'Cairo', cursor: 'pointer',
                                }}
                            >
                                إلغاء
                            </button>
                        </div>
                    </form>
                </div>
            )}
        </div>
    );
}

/* ══════════════════════════════════════════════════════════════════════ */
export default function VideoQuestionsManage({ lesson, videos, questions_by_video, auth }) {
    const [activeVideoIdx, setActiveVideoIdx] = useState(videos[0]?.index ?? 0);

    // Questions for the currently selected video tab
    const videoQuestions = questions_by_video[activeVideoIdx] ?? [];
    const n   = videoQuestions.length;
    const dur = lesson.duration_minutes;
    const intervalMin = (n > 0 && dur) ? Math.round(dur / (n + 1)) : null;

    return (
        <AdminLayout auth={auth} title={`أسئلة الفيديو — ${lesson.title}`}>
            <Head title={`أسئلة الفيديو — ${lesson.title}`} />

            <div style={{ direction: 'rtl', fontFamily: 'Cairo, sans-serif' }} className="max-w-3xl">

                {/* ── Header ── */}
                <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', marginBottom: 24, flexWrap: 'wrap', gap: 12 }}>
                    <div>
                        <div style={{ fontSize: 12, color: 'var(--a-text-4)', marginBottom: 4 }}>
                            <Link href="/admin/video-questions" style={{ color: O, textDecoration: 'none' }}>
                                أسئلة التركيز
                            </Link>
                            {' / '}
                            <span>{lesson.title}</span>
                        </div>
                        <h1 style={{ color: 'var(--a-text)', fontWeight: 900, fontSize: 20, margin: 0 }}>
                            إدارة أسئلة التركيز
                        </h1>
                        <p style={{ color: 'var(--a-text-4)', fontSize: 12, margin: '4px 0 0' }}>
                            كل فيديو في المحاضرة له أسئلة تركيز خاصة به تظهر أثناء المشاهدة
                        </p>
                    </div>
                    <Link
                        href={`/admin/lessons/${lesson.id}/focus-report`}
                        style={{
                            padding: '8px 18px', borderRadius: 10,
                            background: O, color: '#fff',
                            fontSize: 13, fontWeight: 700, textDecoration: 'none',
                            display: 'flex', alignItems: 'center', gap: 6,
                        }}
                    >
                        📊 تقرير التركيز
                    </Link>
                </div>

                {/* ── Video Tabs ── */}
                <div style={{
                    display: 'flex', gap: 8, marginBottom: 20, flexWrap: 'wrap',
                    padding: '4px 0',
                }}>
                    {videos.map(v => {
                        const isActive = v.index === activeVideoIdx;
                        const qCount   = (questions_by_video[v.index] ?? []).length;
                        return (
                            <button
                                key={v.index}
                                type="button"
                                onClick={() => setActiveVideoIdx(v.index)}
                                style={{
                                    display: 'flex', alignItems: 'center', gap: 8,
                                    padding: '8px 16px', borderRadius: 12, cursor: 'pointer',
                                    fontFamily: 'Cairo', fontSize: 13, fontWeight: 700,
                                    transition: 'all .2s',
                                    background: isActive ? O : 'var(--a-card)',
                                    color: isActive ? '#fff' : 'var(--a-text-3)',
                                    border: `1.5px solid ${isActive ? O : 'var(--a-border)'}`,
                                    boxShadow: isActive ? `0 4px 14px rgba(47,188,212,.3)` : 'none',
                                }}
                            >
                                <span style={{ fontSize: 15 }}>🎬</span>
                                {v.label}
                                <span style={{
                                    padding: '2px 7px', borderRadius: 20, fontSize: 11, fontWeight: 900,
                                    background: isActive ? 'rgba(255,255,255,.2)' : 'var(--a-card-2)',
                                    color: isActive ? '#fff' : 'var(--a-text-4)',
                                }}>
                                    {qCount}
                                </span>
                            </button>
                        );
                    })}
                </div>

                {/* ── No videos warning ── */}
                {videos.length === 1 && !videos[0].url && (
                    <div style={{
                        padding: '12px 16px', borderRadius: 12, marginBottom: 20,
                        background: 'rgba(245,158,11,.07)', border: '1px solid rgba(245,158,11,.2)',
                        color: '#F59E0B', fontSize: 12, fontWeight: 600,
                    }}>
                        ⚠️ لم تُضف روابط فيديو للمحاضرة بعد —{' '}
                        <Link href={`/admin/lessons/${lesson.id}/edit`} style={{ color: '#F59E0B', fontWeight: 800 }}>
                            اذهب لتعديل الدرس
                        </Link>
                        {' '}وأضف روابط الفيديوهات أولاً.
                    </div>
                )}

                {/* ── Summary banner for selected video ── */}
                <div style={{
                    background: 'var(--a-card)',
                    border: '1px solid var(--a-border)',
                    borderRadius: 16, padding: '14px 18px', marginBottom: 24,
                    boxShadow: '0 1px 6px var(--a-shadow)',
                }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 14, flexWrap: 'wrap' }}>
                        <div style={{
                            width: 44, height: 44, borderRadius: '50%', flexShrink: 0,
                            background: n === 0 ? 'var(--a-card-2)' : 'rgba(16,185,129,.15)',
                            display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 20,
                        }}>
                            {n === 0 ? '📝' : '✅'}
                        </div>
                        <div style={{ flex: 1 }}>
                            <div style={{ color: 'var(--a-text)', fontWeight: 700, fontSize: 14 }}>
                                {n === 0
                                    ? `لا توجد أسئلة للـ ${videos.find(v => v.index === activeVideoIdx)?.label}`
                                    : `${n} ${n === 1 ? 'سؤال' : 'أسئلة'} لهذا الفيديو`
                                }
                            </div>
                            <div style={{ color: 'var(--a-text-4)', fontSize: 12, marginTop: 3 }}>
                                {n === 0
                                    ? 'أضف أسئلة وستُوزَّع تلقائياً على مدة هذا الفيديو'
                                    : intervalMin
                                        ? `الأسئلة تظهر كل ~${intervalMin} دقيقة (مدة الدرس ${dur} دقيقة)`
                                        : 'الأسئلة ستُوزَّع بالتساوي — حدد مدة الدرس لرؤية التوقيت'
                                }
                            </div>
                        </div>

                        {/* Timing pills */}
                        {n > 0 && dur && (
                            <div style={{ display: 'flex', gap: 6, flexWrap: 'wrap' }}>
                                {videoQuestions.map((_, i) => (
                                    <span key={i} style={{
                                        padding: '3px 10px', borderRadius: 20, fontSize: 11, fontWeight: 700,
                                        background: `rgba(47,188,212,.12)`,
                                        border: `1px solid rgba(47,188,212,.25)`,
                                        color: O,
                                    }}>
                                        س{i + 1} → د{triggerMin(i, n, dur)}
                                    </span>
                                ))}
                            </div>
                        )}
                    </div>

                    {/* No duration warning */}
                    {!dur && (
                        <div style={{
                            marginTop: 12, padding: '8px 12px', borderRadius: 10,
                            background: 'rgba(245,158,11,.08)', border: '1px solid rgba(245,158,11,.2)',
                            color: '#F59E0B', fontSize: 11, fontWeight: 600,
                        }}>
                            ⚠️ لم تحدد مدة الدرس —{' '}
                            <Link href={`/admin/lessons/${lesson.id}/edit`} style={{ color: '#F59E0B', fontWeight: 800 }}>
                                تعديل الدرس
                            </Link>
                            {' '}لإدخال مدة الفيديو وتفعيل عرض التوقيت الدقيق
                        </div>
                    )}
                </div>

                {/* ── Question list for selected video ── */}
                <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
                    {videoQuestions.map((q, i) => (
                        <QuestionCard
                            key={q.id}
                            question={q}
                            index={i}
                            total={n}
                            durationMin={dur}
                        />
                    ))}

                    <AddQuestionCard
                        key={`add-${activeVideoIdx}`}
                        lesson={lesson}
                        videoIndex={activeVideoIdx}
                        newIndex={n}
                        newTotal={n + 1}
                    />
                </div>
            </div>
        </AdminLayout>
    );
}
