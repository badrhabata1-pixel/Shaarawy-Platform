import React, { useState, useMemo, useEffect } from 'react';
import { Head, useForm, router, usePage } from '@inertiajs/react';
import AssistantLayout from '@/Layouts/AssistantLayout';

<<<<<<< HEAD
const O = '#208ef4';
=======
const O = '#F47C20';
>>>>>>> a7d621ecce9a27909d6163081c63c5e4d03bd594
const N = '#14213D';
const G = '#C9A14A';

function useDark() {
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

export default function Index({ assistant, notifications = [], academic_years = [], students = [] }) {
    const { props: { flash } } = usePage();
    const dark = useDark();

    /* ── tokens ── */
    const cardBg   = dark ? '#152238'                   : '#fff';
    const cardBd   = dark ? 'rgba(255,255,255,.07)'     : '#f1f5f9';
    const txtMain  = dark ? '#f0f4f8'                   : N;
    const txtSub   = dark ? 'rgba(220,201,163,.5)'      : '#64748b';
    const inputBg  = dark ? '#0d1826'                   : '#fff';
    const inputBd  = dark ? 'rgba(255,255,255,.12)'     : '#e2e8f0';
    const inputClr = dark ? '#f0f4f8'                   : N;
    const secBg    = dark ? 'rgba(255,255,255,.03)'     : '#f8fafc';
    const secBd    = dark ? 'rgba(255,255,255,.07)'     : '#e2e8f0';
    const divider  = dark ? 'rgba(255,255,255,.05)'     : '#f1f5f9';
    const hdrBg    = dark ? 'rgba(255,255,255,.02)'     : '#f8fafc';
    const delBg    = dark ? 'rgba(239,68,68,.12)'       : '#fef2f2';
    const delClr   = dark ? '#f87171'                   : '#ef4444';

    const inp = {
        width: '100%', boxSizing: 'border-box', direction: 'rtl',
        border: `1.5px solid ${inputBd}`, borderRadius: 10,
        padding: '11px 14px', fontSize: 14, color: inputClr,
        background: inputBg, outline: 'none',
        fontFamily: "'Cairo',sans-serif", transition: 'border-color .2s',
    };

    const { data, setData, post, processing, errors, reset } = useForm({
        text:             '',
        academic_year_id: '',
        student_id:       '',
        target:           'all',
    });

    const filteredStudents = useMemo(() => {
        if (!data.academic_year_id) return [];
        return students.filter(s => String(s.academic_year_id) === String(data.academic_year_id));
    }, [data.academic_year_id, students]);

    const handleYearChange = (yearId) => {
        setData(prev => ({ ...prev, academic_year_id: yearId, student_id: '', target: 'all' }));
    };

    const handleTargetChange = (t) => {
        setData(prev => ({ ...prev, target: t, student_id: '' }));
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        const payload = {
            text:             data.text,
            academic_year_id: data.academic_year_id || null,
            student_id:       data.target === 'student' ? data.student_id : null,
        };
        post(route('assistant.notifications.store'), {
            data: payload,
            onSuccess: () => reset(),
        });
    };

    const handleDelete = (id) => {
        if (confirm('هل أنت متأكد من حذف هذا التنبيه؟')) {
            router.delete(route('assistant.notifications.destroy', id));
        }
    };

    const targetLabel = () => {
        if (!data.academic_year_id) return 'جميع الطلاب 🌐';
        const yr = academic_years.find(y => String(y.id) === String(data.academic_year_id));
        if (data.target === 'all') return yr ? `كل طلاب ${yr.name}` : 'الكل';
        const st = students.find(s => String(s.id) === String(data.student_id));
        return st ? st.name : '—';
    };

    const isDisabled = processing || (data.target === 'student' && !data.student_id);

    return (
        <AssistantLayout assistant={assistant} title="📢 إرسال التنبيهات والإشعارات للطلاب">
            <Head title="إرسال الإشعارات — بوابة السكرتارية" />

            <div style={{ maxWidth: 720, margin: '0 auto', fontFamily: "'Cairo',sans-serif", direction: 'rtl' }}>

                {/* Flash */}
                {flash?.success && (
                    <div style={{
                        background: 'rgba(5,150,105,.12)', border: '1px solid rgba(52,211,153,.3)',
                        borderRadius: 12, padding: '12px 18px', marginBottom: 20,
                        color: '#34d399', fontSize: 14, fontWeight: 700,
                        display: 'flex', alignItems: 'center', gap: 8,
                    }}>
                        ✅ {flash.success}
                    </div>
                )}

                {/* ── لوحة كتابة الإشعار ── */}
                <div style={{
                    background: cardBg, borderRadius: 20,
                    borderTop: `6px solid ${O}`,
                    boxShadow: dark
                        ? '0 4px 28px rgba(0,0,0,.4), inset 0 0 0 1px rgba(220,201,163,.06)'
                        : '0 4px 24px rgba(20,33,61,.10)',
                    padding: '28px 32px', marginBottom: 24,
                }}>
                    <h3 style={{
                        color: txtMain, fontWeight: 900, fontSize: 17,
                        margin: '0 0 22px',
                        borderBottom: `1px solid ${divider}`, paddingBottom: 14,
                    }}>
                        📢 كتابة إشعار جديد
                    </h3>

                    <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: 18 }}>

                        {/* ── Step 1 ── */}
                        <div>
                            <Lbl dark={dark}>① الصف المستهدف</Lbl>
                            <select
                                value={data.academic_year_id}
                                onChange={e => handleYearChange(e.target.value)}
                                style={inp}
                            >
                                <option value="">— جميع الصفوف (كل الطلاب) 🌐 —</option>
                                {academic_years.map(y => (
                                    <option key={y.id} value={y.id}>{y.name}</option>
                                ))}
                            </select>
                        </div>

                        {/* ── Step 2 ── */}
                        {data.academic_year_id && (
                            <div style={{
                                background: secBg, borderRadius: 14,
                                border: `1px solid ${secBd}`,
                                padding: '16px 18px',
                                display: 'flex', flexDirection: 'column', gap: 14,
                            }}>
                                <Lbl dark={dark}>② اختر المستهدف</Lbl>

                                {/* Radio: الكل */}
                                <label
                                    style={radioWrap(data.target === 'all', dark)}
                                    onClick={() => handleTargetChange('all')}
                                >
                                    <span style={radioDot(data.target === 'all')} />
                                    <div>
                                        <div style={{ fontWeight: 800, fontSize: 14, color: data.target === 'all' ? O : txtMain }}>
                                            إرسال لكل طلاب الصف
                                        </div>
                                        <div style={{ fontSize: 12, color: txtSub, marginTop: 2 }}>
                                            {filteredStudents.length} طالب مسجّل في هذا الصف
                                        </div>
                                    </div>
                                </label>

                                {/* Radio: طالب محدد */}
                                <label
                                    style={radioWrap(data.target === 'student', dark)}
                                    onClick={() => handleTargetChange('student')}
                                >
                                    <span style={radioDot(data.target === 'student')} />
                                    <div style={{ flex: 1 }}>
                                        <div style={{ fontWeight: 800, fontSize: 14, color: data.target === 'student' ? O : txtMain, marginBottom: 6 }}>
                                            اختر طالب بعينه
                                        </div>

                                        {data.target === 'student' && (
                                            <StudentPicker
                                                students={filteredStudents}
                                                value={data.student_id}
                                                onChange={id => setData('student_id', id)}
                                                dark={dark}
                                                inp={inp}
                                            />
                                        )}
                                    </div>
                                </label>
                            </div>
                        )}

                        {/* ── Step 3 ── */}
                        <div>
                            <Lbl dark={dark}>③ نص الإشعار</Lbl>
                            <textarea
                                required
                                value={data.text}
                                onChange={e => setData('text', e.target.value)}
                                placeholder="اكتب نص التنبيه هنا، مثلاً: تذكير ببدء الحصة الجديدة..."
                                style={{ ...inp, minHeight: 110, resize: 'vertical' }}
                            />
                            {errors.text && (
                                <p style={{ color: '#f87171', fontSize: 12, marginTop: 4 }}>⚠ {errors.text}</p>
                            )}
                        </div>

                        {/* Preview strip */}
                        <div style={{
                            background: dark ? 'rgba(244,124,32,.08)' : 'rgba(244,124,32,.07)',
                            border: `1px solid rgba(244,124,32,.2)`,
                            borderRadius: 10, padding: '10px 14px',
                            fontSize: 12,
                            color: dark ? 'rgba(220,201,163,.7)' : '#92400e',
                            display: 'flex', alignItems: 'center', gap: 6,
                        }}>
                            📨 سيُرسَل إلى: <strong style={{ color: O }}>{targetLabel()}</strong>
                        </div>

                        <button
                            type="submit"
                            disabled={isDisabled}
                            style={{
                                background: isDisabled
                                    ? (dark ? 'rgba(255,255,255,.08)' : '#cbd5e1')
                                    : `linear-gradient(135deg,${N},#1e3a6e)`,
                                color: isDisabled ? txtSub : '#fff',
                                border: 'none', borderRadius: 12,
                                padding: '13px 28px', fontSize: 15, fontWeight: 900,
                                cursor: isDisabled ? 'not-allowed' : 'pointer',
                                fontFamily: "'Cairo',sans-serif",
                                boxShadow: isDisabled ? 'none' : '0 4px 16px rgba(20,33,61,.25)',
                                transition: 'all .2s', alignSelf: 'flex-start',
                            }}
                            onMouseEnter={e => { if (!isDisabled) e.currentTarget.style.background = `linear-gradient(135deg,${O},#d9620a)`; }}
                            onMouseLeave={e => { if (!isDisabled) e.currentTarget.style.background = `linear-gradient(135deg,${N},#1e3a6e)`; }}
                        >
                            {processing ? '⏳ جاري الإرسال...' : '📢 إرسال الإشعار فوراً'}
                        </button>
                    </form>
                </div>

                {/* ── سجل الإشعارات السابقة ── */}
                <div style={{
                    background: cardBg, borderRadius: 20,
                    boxShadow: dark ? '0 4px 28px rgba(0,0,0,.4)' : '0 4px 24px rgba(20,33,61,.08)',
                    overflow: 'hidden',
                    border: `1px solid ${cardBd}`,
                }}>
                    <div style={{
                        padding: '18px 28px',
                        borderBottom: `1px solid ${divider}`,
                        background: hdrBg,
                        display: 'flex', alignItems: 'center', justifyContent: 'space-between',
                    }}>
                        <h3 style={{ color: txtMain, fontWeight: 900, fontSize: 15, margin: 0 }}>
                            الإشعارات المرسلة سابقاً
                        </h3>
                        <span style={{
                            background: dark ? 'rgba(255,255,255,.06)' : '#e2e8f0',
                            borderRadius: 999, padding: '3px 12px',
                            fontSize: 12, fontWeight: 700, color: txtSub,
                        }}>
                            {notifications.length} إشعار
                        </span>
                    </div>

                    {notifications.length === 0 ? (
                        <div style={{ textAlign: 'center', padding: '40px 20px', color: txtSub, fontSize: 14 }}>
                            لا توجد إشعارات مرسلة بعد.
                        </div>
                    ) : (
                        notifications.map(n => (
                            <div key={n.id} style={{
                                padding: '16px 28px',
                                borderBottom: `1px solid ${divider}`,
                                display: 'flex', alignItems: 'flex-start',
                                gap: 14, justifyContent: 'space-between',
                            }}>
                                <div style={{ flex: 1 }}>
                                    <p style={{ color: txtMain, fontWeight: 700, fontSize: 14, margin: '0 0 8px' }}>
                                        {n.text}
                                    </p>
                                    <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap', alignItems: 'center' }}>
                                        <Chip
                                            text={`📌 ${n.academic_year}`}
                                            bg={dark ? 'rgba(14,165,233,.12)' : '#e0f2fe'}
                                            clr={dark ? '#7dd3fc' : '#0369a1'}
                                        />
                                        {n.student_name && (
                                            <Chip
                                                text={`👤 ${n.student_name}`}
                                                bg={dark ? 'rgba(217,119,6,.12)' : '#fef3c7'}
                                                clr={dark ? '#fbbf24' : '#92400e'}
                                            />
                                        )}
                                        <span style={{ fontSize: 11, color: txtSub }}>🕐 {n.created_at}</span>
                                    </div>
                                </div>
                                <button
                                    onClick={() => handleDelete(n.id)}
                                    style={{
                                        width: 32, height: 32, borderRadius: '50%',
                                        background: delBg, border: 'none',
                                        color: delClr, fontSize: 14, cursor: 'pointer',
                                        flexShrink: 0,
                                        display: 'flex', alignItems: 'center', justifyContent: 'center',
                                        transition: 'background .15s',
                                    }}
                                >
                                    🗑️
                                </button>
                            </div>
                        ))
                    )}
                </div>
            </div>
        </AssistantLayout>
    );
}

/* ── StudentPicker ── */
function StudentPicker({ students, value, onChange, dark, inp }) {
    const [query, setQuery] = useState('');

    const filtered = useMemo(() =>
        students.filter(s => s.name.includes(query)),
        [students, query]
    );

    const listBg  = dark ? '#0d1826'                : '#fff';
    const listBd  = dark ? 'rgba(255,255,255,.1)'   : '#e2e8f0';
    const rowBd   = dark ? 'rgba(255,255,255,.04)'  : '#f8fafc';
    const hoverBg = dark ? 'rgba(255,255,255,.04)'  : '#f8fafc';
    const txtBase = dark ? '#f0f4f8'                : N;

    return (
        <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
            <input
                type="text"
                placeholder="🔍 ابحث باسم الطالب..."
                value={query}
                onChange={e => setQuery(e.target.value)}
                onClick={e => e.stopPropagation()}
                style={{ ...inp, padding: '9px 12px', fontSize: 13 }}
            />
            {filtered.length === 0 ? (
                <p style={{ fontSize: 12, color: dark ? 'rgba(220,201,163,.4)' : '#94a3b8', margin: 0 }}>
                    لا يوجد طلاب مطابقون
                </p>
            ) : (
                <div style={{
                    maxHeight: 200, overflowY: 'auto',
                    border: `1px solid ${listBd}`, borderRadius: 10,
                    background: listBg,
                }}>
                    {filtered.map(s => {
                        const active = String(s.id) === String(value);
                        return (
                            <div
                                key={s.id}
                                onClick={e => { e.stopPropagation(); onChange(String(s.id)); }}
                                style={{
                                    padding: '10px 14px', cursor: 'pointer', fontSize: 13,
                                    fontWeight: active ? 800 : 600,
                                    color: active ? O : txtBase,
                                    background: active ? 'rgba(244,124,32,.08)' : 'transparent',
                                    borderBottom: `1px solid ${rowBd}`,
                                    display: 'flex', alignItems: 'center', justifyContent: 'space-between',
                                    transition: 'background .15s',
                                }}
                                onMouseEnter={e => { if (!active) e.currentTarget.style.background = hoverBg; }}
                                onMouseLeave={e => { if (!active) e.currentTarget.style.background = 'transparent'; }}
                            >
                                <span>👤 {s.name}</span>
                                {active && <span style={{ fontSize: 16, color: O }}>✓</span>}
                            </div>
                        );
                    })}
                </div>
            )}
        </div>
    );
}

/* ── Helpers ── */
function Lbl({ dark, children }) {
    return (
        <label style={{
            display: 'block', fontSize: 13, fontWeight: 800, marginBottom: 8,
            color: dark ? 'rgba(220,201,163,.6)' : '#475569',
        }}>
            {children}
        </label>
    );
}

function Chip({ text, bg, clr }) {
    return (
        <span style={{
            background: bg, borderRadius: 999,
            padding: '2px 10px', fontSize: 11, fontWeight: 700, color: clr,
        }}>
            {text}
        </span>
    );
}

function radioWrap(active, dark) {
    return {
        display: 'flex', alignItems: 'flex-start', gap: 12,
        padding: '12px 14px', borderRadius: 12, cursor: 'pointer',
        border: `2px solid ${active ? O : (dark ? 'rgba(255,255,255,.1)' : '#e2e8f0')}`,
        background: active
            ? 'rgba(244,124,32,.06)'
            : (dark ? 'rgba(255,255,255,.02)' : '#fff'),
        transition: 'all .15s',
    };
}

function radioDot(active) {
    return {
        width: 18, height: 18, borderRadius: '50%', flexShrink: 0, marginTop: 2,
        border: `2px solid ${active ? O : '#94a3b8'}`,
        background: active ? O : 'transparent',
        transition: 'all .15s',
    };
}
