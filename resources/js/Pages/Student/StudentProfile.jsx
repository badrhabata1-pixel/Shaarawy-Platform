import { useState, useEffect } from 'react';
import { useForm, Head, usePage } from '@inertiajs/react';
import StudentLayout from '@/Layouts/StudentLayout';

const O  = '#0D9488';
const N  = '#14213D';
const G  = '#2DD4BF';

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

export default function StudentProfile({ student }) {
    const dark  = useStudentDark();
    const { props } = usePage();
    const flash = props.flash ?? {};

    const { data, setData, post, processing, errors } = useForm({
        first_name: student.first_name ?? '',
        last_name:  student.last_name  ?? '',
        phone:      student.phone      ?? '',
    });

    const handleSubmit = (e) => {
        e.preventDefault();
        post(route('student.profile.update'));
    };

    /* ── tokens ── */
    const cardBg  = dark ? '#152238'                    : '#fff';
    const cardBd  = dark ? 'rgba(255,255,255,.07)'      : '#e8edf5';
    const txtMain = dark ? '#f0f4f8'                    : N;
    const txtSub  = dark ? 'rgba(220,201,163,.5)'       : '#64748b';
    const inputBg = dark ? '#0d1826'                    : '#fff';
    const inputBd = dark ? 'rgba(255,255,255,.12)'      : '#d1d5db';
    const inputClr= dark ? '#f0f4f8'                    : N;
    const disabledBg = dark ? 'rgba(255,255,255,.04)'   : '#f8fafc';
    const divider = dark ? 'rgba(255,255,255,.07)'      : '#f1f5f9';

    const inp = (hasErr) => ({
        width: '100%', boxSizing: 'border-box', direction: 'rtl',
        border: `1.5px solid ${hasErr ? '#f87171' : inputBd}`,
        borderRadius: 10, padding: '11px 14px', fontSize: 14,
        color: inputClr, background: inputBg, outline: 'none',
        fontFamily: "'Cairo',sans-serif", transition: 'border-color .2s',
    });

    const initials = ((student.first_name?.[0] ?? '') + (student.last_name?.[0] ?? '')).toUpperCase() || 'ط';

    return (
        <StudentLayout title="👤 ملفي الشخصي">
            <Head title="تعديل حسابي — منصة الصيفي" />

            <style>{`
                @keyframes fadeUp { from{opacity:0;transform:translateY(14px)} to{opacity:1;transform:translateY(0)} }
                .sp { animation: fadeUp .4s both }
                .sp-input:focus { border-color: ${O} !important; }
                .sp-btn:hover:not(:disabled) { opacity: .9; transform: translateY(-1px); }
            `}</style>

            <div style={{ maxWidth: 560, margin: '0 auto', padding: '0 20px 40px', fontFamily: "'Cairo',sans-serif", direction: 'rtl' }}>

                {/* Flash success */}
                {flash.success && (
                    <div className="sp" style={{
                        background: dark ? 'rgba(5,150,105,.18)' : '#d1fae5',
                        border: `1px solid ${dark ? 'rgba(52,211,153,.3)' : '#6ee7b7'}`,
                        borderRadius: 12, padding: '12px 16px',
                        color: dark ? '#34d399' : '#065F46',
                        fontSize: 14, fontWeight: 700, marginBottom: 20,
                        display: 'flex', alignItems: 'center', gap: 8,
                    }}>
                        ✅ {flash.success}
                    </div>
                )}

                <div className="sp" style={{
                    background: cardBg,
                    borderRadius: 20,
                    border: `1px solid ${cardBd}`,
                    boxShadow: dark ? '0 4px 24px rgba(0,0,0,.3)' : '0 4px 24px rgba(20,33,61,.08)',
                    overflow: 'hidden',
                }}>
                    {/* Avatar header */}
                    <div style={{
                        padding: '32px 28px 24px',
                        borderBottom: `1px solid ${divider}`,
                        display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 12,
                    }}>
                        <div style={{
                            width: 76, height: 76, borderRadius: '50%',
                            background: `linear-gradient(135deg,${O},#d9620a)`,
                            border: `3px solid ${dark ? 'rgba(220,201,163,.35)' : '#DCC9A3'}`,
                            display: 'flex', alignItems: 'center', justifyContent: 'center',
                            fontSize: 26, fontWeight: 900, color: '#fff',
                            boxShadow: '0 4px 16px rgba(244,124,32,.35)',
                            flexShrink: 0,
                        }}>
                            {initials}
                        </div>
                        <div>
                            <div style={{ fontWeight: 800, fontSize: 16, color: txtMain, textAlign: 'center' }}>
                                {student.first_name} {student.last_name}
                            </div>
                            <div style={{ fontSize: 12, color: txtSub, textAlign: 'center', marginTop: 2 }}>
                                الملف الأكاديمي المعتمد للطالب
                            </div>
                        </div>
                    </div>

                    {/* Form */}
                    <form onSubmit={handleSubmit} style={{ padding: '28px' }}>

                        {/* Name row */}
                        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 14, marginBottom: 18 }}>
                            <div>
                                <label style={{ display: 'block', fontSize: 13, fontWeight: 700, color: txtSub, marginBottom: 7 }}>
                                    الاسم الأول <span style={{ color: O }}>*</span>
                                </label>
                                <input
                                    type="text"
                                    className="sp-input"
                                    value={data.first_name}
                                    onChange={e => setData('first_name', e.target.value)}
                                    placeholder="الاسم الأول"
                                    style={inp(!!errors.first_name)}
                                />
                                {errors.first_name && <Err>{errors.first_name}</Err>}
                            </div>
                            <div>
                                <label style={{ display: 'block', fontSize: 13, fontWeight: 700, color: txtSub, marginBottom: 7 }}>
                                    الاسم الأخير <span style={{ color: O }}>*</span>
                                </label>
                                <input
                                    type="text"
                                    className="sp-input"
                                    value={data.last_name}
                                    onChange={e => setData('last_name', e.target.value)}
                                    placeholder="الاسم الأخير"
                                    style={inp(!!errors.last_name)}
                                />
                                {errors.last_name && <Err>{errors.last_name}</Err>}
                            </div>
                        </div>

                        {/* Email (readonly) */}
                        <div style={{ marginBottom: 18 }}>
                            <label style={{ display: 'block', fontSize: 13, fontWeight: 700, color: txtSub, marginBottom: 7 }}>
                                البريد الإلكتروني <span style={{ fontSize: 11, fontWeight: 500, opacity: .7 }}>(غير قابل للتعديل)</span>
                            </label>
                            <input
                                type="email"
                                disabled
                                value={student.email ?? ''}
                                style={{
                                    ...inp(false),
                                    background: disabledBg,
                                    color: txtSub,
                                    cursor: 'not-allowed',
                                    border: `1.5px solid ${inputBd}`,
                                    opacity: .7,
                                }}
                            />
                        </div>

                        {/* Phone */}
                        <div style={{ marginBottom: 28 }}>
                            <label style={{ display: 'block', fontSize: 13, fontWeight: 700, color: txtSub, marginBottom: 7 }}>
                                رقم الهاتف <span style={{ color: O }}>*</span>
                            </label>
                            <input
                                type="text"
                                className="sp-input"
                                value={data.phone}
                                onChange={e => setData('phone', e.target.value)}
                                placeholder="01xxxxxxxxx"
                                style={{ ...inp(!!errors.phone), direction: 'ltr', textAlign: 'right' }}
                            />
                            {errors.phone && <Err>{errors.phone}</Err>}
                        </div>

                        {/* Submit */}
                        <button
                            type="submit"
                            disabled={processing}
                            className="sp-btn"
                            style={{
                                width: '100%', padding: '13px', borderRadius: 12, border: 'none',
                                background: processing
                                    ? (dark ? 'rgba(255,255,255,.1)' : '#d1d5db')
                                    : `linear-gradient(135deg,${O},#d9620a)`,
                                color: processing ? txtSub : '#fff',
                                fontSize: 15, fontWeight: 800,
                                cursor: processing ? 'not-allowed' : 'pointer',
                                fontFamily: "'Cairo',sans-serif",
                                boxShadow: processing ? 'none' : '0 4px 20px rgba(244,124,32,.4)',
                                transition: 'all .2s',
                            }}
                        >
                            {processing ? '⏳ جارٍ الحفظ...' : '💾 حفظ التعديلات'}
                        </button>

                    </form>
                </div>
            </div>
        </StudentLayout>
    );
}

function Err({ children }) {
    return <p style={{ color: '#f87171', fontSize: 12, marginTop: 5 }}>⚠ {children}</p>;
}


