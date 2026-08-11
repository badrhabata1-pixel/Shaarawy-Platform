import React, { useState } from 'react';
import AdminForm, { AdminField } from '@/Components/Admin/AdminForm';
import { useForm } from '@inertiajs/react';

const O = '#2fbcd4';
const N = 'var(--a-text)';
const RED = '#ef4444';

/* ── helpers ────────────────────────────────────────── */
const blankQuestion = () => ({
    question_text:  '',
    question_type:  'mcq',
    marks:          1,
    correct_answer: '',
    choices:        ['', '', '', ''],
    image:               null,
    image_preview:       null,
    existing_image_path: null,
    remove_image:        false,
});

const parseExistingQuestions = (questions = []) =>
    questions.map(q => ({
        question_text:  q.question_text  || '',
        question_type:  q.question_type  || 'mcq',
        marks:          q.marks          || 1,
        correct_answer: q.correct_answer || '',
        choices: q.choices?.length
            ? q.choices.map(c => c.choice_text)
            : ['', '', '', ''],
        image:               null,
        image_preview:       null,
        existing_image_path: q.image_path || null,
        remove_image:        false,
    }));

/* ═══════════════════════════════════════════════════
   MAIN FORM
═══════════════════════════════════════════════════ */
export default function Form({ item, lessons, academicYears }) {
    /* questions live in local state — sent as JSON string to avoid FormData nesting issues */
    const [questions, setQuestions] = useState(parseExistingQuestions(item?.questions));

    const { data, setData, post, put, processing, errors, transform } = useForm({
        title:              item?.title              || '',
        class_id:           item?.class_id           || '',
        lesson_id:          item?.lesson_id          || '',
        description:        item?.description        || '',
        time_limit_minutes: item?.time_limit_minutes || 60,
        total_marks:        item?.total_marks        || 100,
        exam_type:          item?.exam_type          || 'open',
        exam_mode:          item?.exam_mode          || 'final',
        start_time:         item?.start_time         || '',
        end_time:           item?.end_time           || '',
        image:              null,
        questions_json:     '',
    });

    /* Serialize questions into questions_json right before submit; images go in parallel to questions_json */
    transform(d => ({
        ...d,
        // PHP never parses multipart bodies for PUT requests, so a real PUT here would
        // silently arrive empty server-side — spoof it via POST + _method instead.
        ...(item ? { _method: 'PUT' } : {}),
        questions_json: JSON.stringify(questions.map(({ image, image_preview, ...rest }) => rest)),
        question_images: questions.map(q => q.image || null),
    }));

    const handleSubmit = (e) => {
        e.preventDefault();
        item ? post(`/admin/exams/${item.id}`, { forceFormData: true }) : post('/admin/exams', { forceFormData: true });
    };

    /* ── question mutators (operate on local `questions` state) ── */
    const updateQ = (idx, patch) =>
        setQuestions(qs => qs.map((q, i) => i === idx ? { ...q, ...patch } : q));

    const addQuestion = () =>
        setQuestions(qs => [...qs, blankQuestion()]);

    const removeQuestion = (idx) =>
        setQuestions(qs => qs.filter((_, i) => i !== idx));

    const updateChoice = (qIdx, cIdx, text) => {
        setQuestions(qs => qs.map((q, i) => {
            if (i !== qIdx) return q;
            const old     = q.choices[cIdx];
            const choices = q.choices.map((c, ci) => ci === cIdx ? text : c);
            return { ...q, choices, correct_answer: q.correct_answer === old ? text : q.correct_answer };
        }));
    };

    const addChoice = (qIdx) =>
        setQuestions(qs => qs.map((q, i) => i === qIdx ? { ...q, choices: [...q.choices, ''] } : q));

    const removeChoice = (qIdx, cIdx) => {
        setQuestions(qs => qs.map((q, i) => {
            if (i !== qIdx || q.choices.length <= 2) return q;
            const removed = q.choices[cIdx];
            const choices = q.choices.filter((_, ci) => ci !== cIdx);
            return { ...q, choices, correct_answer: q.correct_answer === removed ? '' : q.correct_answer };
        }));
    };

    const setQuestionImage = (qIdx, file) =>
        setQuestions(qs => qs.map((q, i) => i === qIdx
            ? { ...q, image: file, image_preview: file ? URL.createObjectURL(file) : null, remove_image: false }
            : q));

    const clearQuestionImage = (qIdx) =>
        setQuestions(qs => qs.map((q, i) => i === qIdx
            ? { ...q, image: null, image_preview: null, remove_image: true }
            : q));

    /* ── shared input style ── */
    const inp = {
        width: '100%', padding: '9px 12px', borderRadius: 10,
        fontSize: 13, fontFamily: 'Cairo, sans-serif',
        background: 'var(--a-input)', border: '1.5px solid var(--a-input-b)',
        color: 'var(--a-text)', outline: 'none',
    };

    return (
        <AdminForm
            title={item ? 'تعديل الامتحان' : 'إضافة امتحان جديد'}
            layoutTitle="الامتحانات"
            description={item ? 'تعديل بيانات الامتحان والأسئلة' : 'إضافة امتحان جديد مع أسئلته'}
            cancelLink="/admin/exams"
            onSubmit={handleSubmit}
            processing={processing}
            submitLabel={item ? 'حفظ التعديلات' : 'إضافة الامتحان'}
        >
            {/* ── Basic fields ── */}
            {/* ── Exam mode selector ── */}
            <div style={{ marginBottom: 8 }}>
                <div style={{ fontSize: 13, fontWeight: 700, color: 'var(--a-text-4)', marginBottom: 10 }}>
                    نوع الامتحان
                </div>
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12 }}>
                    {[
                        {
                            value: 'final',
                            icon: '📋',
                            title: 'امتحان شامل',
                            desc: 'مرة واحدة فقط • نجاح 70%',
                            color: '#D97706',
                            bg: 'rgba(217,119,6,.08)',
                            border: 'rgba(217,119,6,.35)',
                        },
                        {
                            value: 'gate',
                            icon: '🔐',
                            title: 'امتحان بوابة',
                            desc: 'قابل للتكرار • نجاح 50% • يفتح الدرس التالي',
                            color: '#6366f1',
                            bg: 'rgba(99,102,241,.08)',
                            border: 'rgba(99,102,241,.35)',
                        },
                    ].map(opt => {
                        const active = data.exam_mode === opt.value;
                        return (
                            <button
                                key={opt.value}
                                type="button"
                                onClick={() => setData('exam_mode', opt.value)}
                                style={{
                                    display: 'flex', flexDirection: 'column', alignItems: 'flex-start',
                                    gap: 4, padding: '14px 16px', borderRadius: 14, cursor: 'pointer',
                                    fontFamily: 'Cairo, sans-serif', textAlign: 'right',
                                    background: active ? opt.bg : 'var(--a-input)',
                                    border: `2px solid ${active ? opt.color : 'var(--a-input-b)'}`,
                                    transition: 'all .15s',
                                    boxShadow: active ? `0 0 0 3px ${opt.border}` : 'none',
                                }}
                            >
                                <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                                    <span style={{ fontSize: 20 }}>{opt.icon}</span>
                                    <span style={{ fontSize: 14, fontWeight: 800, color: active ? opt.color : 'var(--a-text)' }}>
                                        {opt.title}
                                    </span>
                                </div>
                                <span style={{ fontSize: 11, color: active ? opt.color : 'var(--a-text-4)', opacity: active ? 1 : 0.8, paddingRight: 4 }}>
                                    {opt.desc}
                                </span>
                            </button>
                        );
                    })}
                </div>
            </div>

            <AdminField label="عنوان الامتحان" name="title" type="text" required
                value={data.title} onChange={e => setData('title', e.target.value)} error={errors.title}
                placeholder="مثال: امتحان الوحدة الأولى" />

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 14 }}>
                <AdminField label="الصف الدراسي" name="class_id" type="select" required
                    value={data.class_id} onChange={e => setData('class_id', e.target.value)} error={errors.class_id}
                    options={academicYears.map(y => ({ value: y.id, label: y.name }))} />
                <AdminField label="الدرس (اختياري)" name="lesson_id" type="select"
                    value={data.lesson_id} onChange={e => setData('lesson_id', e.target.value)} error={errors.lesson_id}
                    options={[{ value: '', label: 'امتحان عام (غير مرتبط)' }, ...lessons.map(l => ({ value: l.id, label: l.title }))]} />
            </div>

            <AdminField label="الوصف" name="description" type="textarea" rows={2}
                value={data.description} onChange={e => setData('description', e.target.value)} error={errors.description}
                placeholder="وصف مختصر للامتحان" />

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: 14 }}>
                <AdminField label="مدة الامتحان (دقائق)" name="time_limit_minutes" type="number" min={1}
                    value={data.time_limit_minutes} onChange={e => setData('time_limit_minutes', e.target.value)} error={errors.time_limit_minutes} placeholder="60" />
                <AdminField label="الدرجة الكلية" name="total_marks" type="number" min={1}
                    value={data.total_marks} onChange={e => setData('total_marks', e.target.value)} error={errors.total_marks} placeholder="100" />
                <AdminField label="نوع الامتحان" name="exam_type" type="select"
                    value={data.exam_type} onChange={e => setData('exam_type', e.target.value)} error={errors.exam_type}
                    options={[{ value: 'open', label: 'مفتوح (بدون وقت محدد)' }, { value: 'closed', label: 'مغلق (بوقت ومهلة)' }]} />
            </div>

            {data.exam_type === 'closed' && (
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 14 }}>
                    <AdminField label="تاريخ البداية" name="start_time" type="datetime-local"
                        value={data.start_time} onChange={e => setData('start_time', e.target.value)} error={errors.start_time} />
                    <AdminField label="تاريخ النهاية" name="end_time" type="datetime-local"
                        value={data.end_time} onChange={e => setData('end_time', e.target.value)} error={errors.end_time} />
                </div>
            )}

            <AdminField label="صورة الامتحان" name="image" type="file" accept="image/*"
                onChange={e => setData('image', e.target.files[0])} error={errors.image} />

            {/* ════════════════════════════════
                QUESTION BUILDER
            ════════════════════════════════ */}
            <div style={{ marginTop: 28, paddingTop: 24, borderTop: '1.5px solid var(--a-border)' }}>
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 16 }}>
                    <div>
                        <span style={{ fontSize: 15, fontWeight: 800, color: 'var(--a-text)' }}>
                            📝 الأسئلة
                        </span>
                        <span style={{
                            marginRight: 10, background: `${O}20`, color: O,
                            borderRadius: 99, padding: '2px 10px', fontSize: 12, fontWeight: 700,
                        }}>
                            {questions.length} سؤال
                        </span>
                    </div>
                    <button type="button" onClick={addQuestion} style={{
                        background: `linear-gradient(135deg,${O},#009688)`,
                        color: '#fff', border: 'none', borderRadius: 10,
                        padding: '8px 18px', fontSize: 13, fontWeight: 700, cursor: 'pointer',
                    }}>
                        + إضافة سؤال
                    </button>
                </div>

                {questions.length === 0 && (
                    <div style={{
                        textAlign: 'center', padding: '2rem',
                        borderRadius: 14, border: '2px dashed var(--a-border)',
                        color: 'var(--a-text-4)', fontSize: 14,
                    }}>
                        لا توجد أسئلة بعد — اضغط "إضافة سؤال" للبدء
                    </div>
                )}

                <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
                    {questions.map((q, qIdx) => (
                        <div key={qIdx} style={{
                            borderRadius: 14,
                            border: `1.5px solid var(--a-border)`,
                            borderRight: `4px solid ${O}`,
                            overflow: 'hidden',
                            background: 'var(--a-input)',
                        }}>
                            {/* Question header */}
                            <div style={{
                                display: 'flex', alignItems: 'center', gap: 10,
                                padding: '10px 16px',
                                background: `${O}10`,
                                borderBottom: '1px solid var(--a-border)',
                            }}>
                                <span style={{
                                    width: 28, height: 28, borderRadius: '50%',
                                    background: O, color: '#fff',
                                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                                    fontSize: 12, fontWeight: 900, flexShrink: 0,
                                }}>{qIdx + 1}</span>

                                <span style={{ fontSize: 13, fontWeight: 800, color: 'var(--a-text)', flex: 1 }}>
                                    سؤال {qIdx + 1}
                                </span>

                                {/* Type toggle */}
                                <select
                                    value={q.question_type}
                                    onChange={e => updateQ(qIdx, { question_type: e.target.value, correct_answer: '' })}
                                    style={{ ...inp, width: 'auto', padding: '5px 10px' }}
                                >
                                    <option value="mcq">اختياري (MCQ)</option>
                                    <option value="essay">مقالي</option>
                                </select>

                                {/* Marks */}
                                <input
                                    type="number" min={1} value={q.marks}
                                    onChange={e => updateQ(qIdx, { marks: e.target.value })}
                                    style={{ ...inp, width: 80, textAlign: 'center' }}
                                    title="الدرجة"
                                />
                                <span style={{ fontSize: 11, color: 'var(--a-text-4)', flexShrink: 0 }}>درجة</span>

                                <button type="button" onClick={() => removeQuestion(qIdx)}
                                    style={{
                                        background: '#fee2e2', color: RED, border: 'none',
                                        borderRadius: 8, padding: '5px 10px', cursor: 'pointer',
                                        fontSize: 13, fontWeight: 700,
                                    }}>
                                    ✕
                                </button>
                            </div>

                            {/* Question body */}
                            <div style={{ padding: '14px 16px' }}>
                                {/* Question text */}
                                <textarea
                                    value={q.question_text}
                                    onChange={e => updateQ(qIdx, { question_text: e.target.value })}
                                    placeholder={`نص السؤال ${qIdx + 1}...`}
                                    rows={2}
                                    style={{ ...inp, resize: 'vertical', lineHeight: 1.7, marginBottom: 12 }}
                                />

                                {/* Question image */}
                                <div style={{ marginBottom: 12 }}>
                                    {(q.image_preview || (q.existing_image_path && !q.remove_image)) ? (
                                        <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                                            <img
                                                src={q.image_preview || `/storage/${q.existing_image_path}`}
                                                alt={`صورة السؤال ${qIdx + 1}`}
                                                style={{
                                                    width: 90, height: 90, objectFit: 'cover',
                                                    borderRadius: 10, border: '1.5px solid var(--a-border)',
                                                }}
                                            />
                                            <button type="button" onClick={() => clearQuestionImage(qIdx)}
                                                style={{
                                                    background: '#fee2e2', color: RED, border: 'none',
                                                    borderRadius: 8, padding: '6px 12px', cursor: 'pointer',
                                                    fontSize: 12, fontWeight: 700, fontFamily: 'Cairo, sans-serif',
                                                }}>
                                                🗑 إزالة الصورة
                                            </button>
                                        </div>
                                    ) : (
                                        <label style={{
                                            display: 'inline-flex', alignItems: 'center', gap: 6,
                                            border: '1.5px dashed var(--a-border)', borderRadius: 10,
                                            padding: '8px 14px', cursor: 'pointer',
                                            fontSize: 12, color: 'var(--a-text-4)', fontFamily: 'Cairo, sans-serif',
                                        }}>
                                            🖼 إضافة صورة للسؤال (اختياري)
                                            <input
                                                type="file" accept="image/*" style={{ display: 'none' }}
                                                onChange={e => setQuestionImage(qIdx, e.target.files[0] || null)}
                                            />
                                        </label>
                                    )}
                                </div>

                                {/* MCQ choices */}
                                {q.question_type === 'mcq' && (
                                    <div>
                                        <div style={{ fontSize: 12, fontWeight: 700, color: 'var(--a-text-4)', marginBottom: 8 }}>
                                            الاختيارات — اضغط الدائرة لتحديد الإجابة الصحيحة ✓
                                        </div>

                                        <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
                                            {q.choices.map((choice, cIdx) => {
                                                const isCorrect = q.correct_answer !== '' && q.correct_answer === choice;
                                                return (
                                                    <div key={cIdx} style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                                                        {/* Correct radio */}
                                                        <button
                                                            type="button"
                                                            onClick={() => updateQ(qIdx, { correct_answer: choice || '' })}
                                                            title="اجعلها الإجابة الصحيحة"
                                                            style={{
                                                                width: 22, height: 22, borderRadius: '50%', flexShrink: 0,
                                                                border: `2px solid ${isCorrect ? '#059669' : 'var(--a-border)'}`,
                                                                background: isCorrect ? '#059669' : 'transparent',
                                                                cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center',
                                                            }}
                                                        >
                                                            {isCorrect && <span style={{ color: '#fff', fontSize: 11, fontWeight: 900 }}>✓</span>}
                                                        </button>

                                                        <input
                                                            type="text"
                                                            value={choice}
                                                            onChange={e => updateChoice(qIdx, cIdx, e.target.value)}
                                                            placeholder={`الاختيار ${cIdx + 1}`}
                                                            style={{ ...inp, flex: 1 }}
                                                        />

                                                        {q.choices.length > 2 && (
                                                            <button type="button" onClick={() => removeChoice(qIdx, cIdx)}
                                                                style={{
                                                                    background: 'transparent', border: 'none',
                                                                    color: '#94a3b8', cursor: 'pointer', fontSize: 16, flexShrink: 0,
                                                                }}>✕</button>
                                                        )}
                                                    </div>
                                                );
                                            })}
                                        </div>

                                        {q.choices.length < 6 && (
                                            <button type="button" onClick={() => addChoice(qIdx)}
                                                style={{
                                                    marginTop: 8, background: 'transparent',
                                                    border: '1.5px dashed var(--a-border)', borderRadius: 8,
                                                    padding: '6px 14px', color: 'var(--a-text-4)',
                                                    fontSize: 12, cursor: 'pointer', fontFamily: 'Cairo,sans-serif',
                                                }}>
                                                + إضافة اختيار
                                            </button>
                                        )}

                                        {q.correct_answer && (
                                            <div style={{
                                                marginTop: 8, fontSize: 12, color: '#059669',
                                                background: '#d1fae530', border: '1px solid #10b98140',
                                                borderRadius: 8, padding: '5px 12px',
                                            }}>
                                                ✓ الإجابة الصحيحة: <strong>{q.correct_answer}</strong>
                                            </div>
                                        )}
                                    </div>
                                )}

                                {/* Essay model answer */}
                                {q.question_type === 'essay' && (
                                    <div>
                                        <div style={{ fontSize: 12, fontWeight: 700, color: 'var(--a-text-4)', marginBottom: 6 }}>
                                            الإجابة النموذجية (للمراجعة)
                                        </div>
                                        <textarea
                                            value={q.correct_answer}
                                            onChange={e => updateQ(qIdx, { correct_answer: e.target.value })}
                                            placeholder="اكتب الإجابة النموذجية هنا..."
                                            rows={3}
                                            style={{
                                                ...inp, resize: 'vertical', lineHeight: 1.7,
                                                borderColor: '#fbbf24', background: '#fef9c320',
                                            }}
                                        />
                                    </div>
                                )}
                            </div>
                        </div>
                    ))}
                </div>

                {questions.length > 0 && (
                    <div style={{ marginTop: 12, fontSize: 12, color: 'var(--a-text-4)', textAlign: 'center' }}>
                        مجموع درجات الأسئلة: <strong style={{ color: O }}>
                            {questions.reduce((s, q) => s + (+q.marks || 0), 0)}
                        </strong> من {data.total_marks}
                    </div>
                )}
            </div>
        </AdminForm>
    );
}
