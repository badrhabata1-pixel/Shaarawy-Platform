import React, { useState } from 'react';
import AdminForm, { AdminField } from '@/Components/Admin/AdminForm';
import { useForm } from '@inertiajs/react';

const O = '#2fbcd4';
const RED = '#ef4444';

/* ── helpers ─────────────────────────────────────── */
const blankQuestion = () => ({
    id:             null,
    question_text:  '',
    question_type:  'essay',
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
        id:             q.id,
        question_text:  q.question_text  || '',
        question_type:  q.question_type  || 'essay',
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

/* ══════════════════════════════════════════════════
   MAIN FORM
══════════════════════════════════════════════════ */
export default function Form({ item, lessons, academicYears }) {
    const [questions, setQuestions] = useState(parseExistingQuestions(item?.questions));

    /* figure out initial class from item's lesson */
    const initClass = item?.lesson_id
        ? (lessons.find(l => l.id === item.lesson_id)?.academic_year_id || '')
        : '';
    const [selectedClass, setSelectedClass] = useState(initClass);

    const { data, setData, post, put, processing, errors, transform } = useForm({
        title:        item?.title        || '',
        lesson_id:    item?.lesson_id    || '',
        description:  item?.description  || '',
        total_marks:  item?.total_marks  || 0,
        pdf_file:     null,
        questions_json: '',
    });

    const filteredLessons = selectedClass
        ? lessons.filter(l => String(l.academic_year_id) === String(selectedClass))
        : lessons;

    /* name of the class the currently chosen lesson actually belongs to */
    const activeLessonClass = data.lesson_id
        ? (() => {
            const l = lessons.find(x => String(x.id) === String(data.lesson_id));
            return l ? academicYears.find(y => String(y.id) === String(l.academic_year_id))?.name : null;
        })()
        : null;

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
        item ? post(`/admin/sheets/${item.id}`, { forceFormData: true }) : post('/admin/sheets', { forceFormData: true });
    };

    /* ── question mutators ── */
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

    const inp = {
        width: '100%', padding: '9px 12px', borderRadius: 10,
        fontSize: 13, fontFamily: 'Cairo, sans-serif',
        background: 'var(--a-input)', border: '1.5px solid var(--a-input-b)',
        color: 'var(--a-text)', outline: 'none',
    };

    return (
        <AdminForm
            title={item ? 'تعديل الشيت' : 'إضافة شيت جديد'}
            layoutTitle="الشيتات"
            description={item ? 'تعديل بيانات الشيت والأسئلة' : 'إضافة شيت جديد مع أسئلته'}
            cancelLink="/admin/sheets"
            onSubmit={handleSubmit}
            processing={processing}
            submitLabel={item ? 'حفظ التعديلات' : 'إضافة الشيت'}
        >
            {/* ── Basic fields ── */}
            <AdminField label="عنوان الشيت" name="title" type="text" required
                value={data.title} onChange={e => setData('title', e.target.value)}
                error={errors.title} placeholder="مثال: شيت الوحدة الأولى" />

            {/* Class filter → then lesson */}
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 14 }}>
                {/* Class selector — client-side filter only, not submitted */}
                <div style={{ marginBottom: 20, fontFamily: 'Cairo, sans-serif' }}>
                    <label className="block text-sm font-bold mb-1.5" style={{ color: 'var(--a-text)' }}>
                        الصف الدراسي
                        <span style={{ color: '#ef4444', marginRight: 4 }}>*</span>
                    </label>
                    <select
                        value={selectedClass}
                        onChange={e => {
                            const newClass = e.target.value;
                            setSelectedClass(newClass);
                            // reset lesson only when the new class actually has lessons
                            const hasLessons = newClass
                                ? lessons.some(l => String(l.academic_year_id) === String(newClass))
                                : true;
                            if (hasLessons) setData('lesson_id', '');
                        }}
                        style={{
                            width: '100%', padding: '10px 14px', borderRadius: 12,
                            fontSize: 14, fontFamily: 'Cairo, sans-serif', fontWeight: 500,
                            background: 'var(--a-input)', border: '1.5px solid var(--a-input-b)',
                            color: 'var(--a-text)', outline: 'none', cursor: 'pointer',
                        }}
                    >
                        <option value="">— اختر الصف أولاً —</option>
                        {academicYears.map(y => (
                            <option key={y.id} value={y.id}>{y.name}</option>
                        ))}
                    </select>
                </div>

                {/* Lesson select — custom to allow empty-class message */}
                <div style={{ marginBottom: 20, fontFamily: 'Cairo, sans-serif' }}>
                    <label className="block text-sm font-bold mb-1.5" style={{ color: 'var(--a-text)' }}>
                        الدرس
                        <span style={{ color: '#ef4444', marginRight: 4 }}>*</span>
                    </label>
                    {filteredLessons.length === 0 && selectedClass ? (
                        <div style={{
                            padding: '10px 14px', borderRadius: 12,
                            background: '#fef3c720', border: '1.5px solid #fcd34d',
                            color: '#d97706', fontSize: 13, fontWeight: 600,
                        }}>
                            ⚠️ لا توجد دروس لهذا الصف — أضف دروساً أولاً من إدارة الدروس
                        </div>
                    ) : (
                        <select
                            value={data.lesson_id}
                            onChange={e => setData('lesson_id', e.target.value)}
                            style={{
                                width: '100%', padding: '10px 14px', borderRadius: 12,
                                fontSize: 14, fontFamily: 'Cairo, sans-serif', fontWeight: 500,
                                background: 'var(--a-input)',
                                border: `1.5px solid ${errors.lesson_id ? '#ef4444' : 'var(--a-input-b)'}`,
                                color: 'var(--a-text)', outline: 'none', cursor: 'pointer',
                            }}
                        >
                            <option value="">— اختر الدرس —</option>
                            {filteredLessons.map(l => (
                                <option key={l.id} value={l.id}>{l.title}</option>
                            ))}
                        </select>
                    )}
                    {/* Effective class badge */}
                    {activeLessonClass && (
                        <div style={{
                            marginTop: 6, fontSize: 11, color: '#059669',
                            display: 'flex', alignItems: 'center', gap: 4,
                        }}>
                            <span style={{
                                background: '#d1fae5', border: '1px solid #6ee7b7',
                                borderRadius: 99, padding: '2px 10px', fontWeight: 700,
                            }}>
                                ✓ الصف الفعلي: {activeLessonClass}
                            </span>
                        </div>
                    )}
                    {errors.lesson_id && (
                        <div style={{ color: '#ef4444', fontSize: 12, marginTop: 4 }}>
                            {errors.lesson_id}
                        </div>
                    )}
                </div>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 14 }}>
                <AdminField label="الدرجة الكلية" name="total_marks" type="number" min={0}
                    value={data.total_marks} onChange={e => setData('total_marks', e.target.value)}
                    error={errors.total_marks} placeholder="0" />
                <div />{/* spacer */}
            </div>

            <AdminField label="الوصف" name="description" type="textarea" rows={2}
                value={data.description} onChange={e => setData('description', e.target.value)}
                error={errors.description} placeholder="وصف مختصر للشيت (اختياري)" />

            {item?.file_path && (
                <div style={{
                    fontSize: 12, color: '#059669', marginBottom: 6,
                    display: 'flex', alignItems: 'center', gap: 6, fontFamily: 'Cairo, sans-serif',
                }}>
                    <span>📎</span>
                    <a href={`/storage/${item.file_path}`} target="_blank" rel="noopener noreferrer"
                        style={{ color: '#059669', fontWeight: 700, textDecoration: 'underline' }}>
                        فيه ملف PDF مرفوع بالفعل — اضغط للمعاينة
                    </a>
                </div>
            )}
            <AdminField label="ملف PDF" name="pdf_file" type="file" accept=".pdf"
                onChange={e => setData('pdf_file', e.target.files[0])}
                error={errors.pdf_file}
                hint={item?.file_path ? 'اختر ملف جديد فقط لو عايز تستبدل الملف الحالي' : 'ملف PDF للشيت'} />

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
                            border: '1.5px solid var(--a-border)',
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
                                    <option value="essay">مقالي (تصحيح يدوي)</option>
                                    <option value="mcq">اختياري (تصحيح تلقائي)</option>
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
                                            الإجابة النموذجية (تظهر للمصحح فقط)
                                        </div>
                                        <textarea
                                            value={q.correct_answer}
                                            onChange={e => updateQ(qIdx, { correct_answer: e.target.value })}
                                            placeholder="اكتب عناصر الإجابة الصحيحة هنا..."
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
                        </strong> من {data.total_marks || 0}
                    </div>
                )}
            </div>
        </AdminForm>
    );
}
