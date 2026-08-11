import { Head, useForm, router } from '@inertiajs/react';
import { useState, useEffect } from 'react';
import AssistantLayout from '@/Layouts/AssistantLayout';

const O = '#208ef4';
const G = '#059669';
const R = '#DC2626';

function useAssistantDark() {
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

export default function PromoCodes({ assistant, promoCodes, academicYears = [], lessons = [] }) {
    const dark = useAssistantDark();
    const codes = promoCodes?.data ?? promoCodes ?? [];
    const available = codes.filter(c => !c.is_used).length;

    const { data, setData, post, processing, errors, reset } = useForm({
        academic_year_id: '',
        lesson_id: '',
        count: 10,
    });

    const [deleteId, setDeleteId] = useState(null);

    const generate = (e) => {
        e.preventDefault();
        post(route('assistant.promo.generate'), { onSuccess: () => reset('academic_year_id', 'lesson_id', 'count') });
    };

    const destroy = (id) => {
        router.delete(route('assistant.promo.destroy', id), { preserveScroll: true });
        setDeleteId(null);
    };

    const card   = dark ? '#152238' : '#fff';
    const cardBd = dark ? 'rgba(255,255,255,.07)' : '#e8edf5';
    const secBg  = dark ? 'rgba(255,255,255,.03)' : '#f8fafc';
    const txtMain= dark ? '#f0f4f8' : '#14213D';
    const txtSub = dark ? 'rgba(220,201,163,.45)' : '#64748b';
    const inputBg= dark ? '#0d1826' : '#fff';
    const inputBd= dark ? 'rgba(255,255,255,.12)' : '#e2e8f0';

    const sel = (err) => ({
        width: '100%', padding: '10px 12px', borderRadius: 8,
        border: `1.5px solid ${err ? R : inputBd}`,
        fontSize: 13, color: txtMain, background: inputBg,
        fontFamily: "'Cairo',sans-serif", outline: 'none',
        height: 42, boxSizing: 'border-box',
    });

    return (
        <AssistantLayout assistant={assistant} title="أكواد الشحن والتفعيل">
            <Head title="أكواد الشحن والتفعيل" />

            <div style={{ fontFamily: "'Cairo',sans-serif", direction: 'rtl', maxWidth: 960, margin: '0 auto' }}>

                <div style={{ marginBottom: 28 }}>
                    <h1 style={{ fontSize: 22, fontWeight: 800, color: dark ? '#DCC9A3' : '#14213D', margin: 0 }}>🎟️ أكواد شحن وتفعيل المحاضرات</h1>
                    <p style={{ fontSize: 13, color: txtSub, marginTop: 6 }}>توليد أكواد تفعيل للطلاب وإدارة الأكواد النشطة</p>
                </div>

                {/* Generate Form */}
                <div style={{
                    background: card, borderRadius: 16, padding: '24px 28px',
                    border: `1px solid ${cardBd}`,
                    boxShadow: dark ? '0 4px 20px rgba(0,0,0,.3)' : '0 2px 12px rgba(20,33,61,.06)',
                    marginBottom: 28,
                }}>
                    <h2 style={{ fontSize: 16, fontWeight: 800, color: dark ? '#DCC9A3' : '#14213D', marginBottom: 18, display: 'flex', alignItems: 'center', gap: 8 }}>
                        <span style={{ color: O }}>⚡</span> توليد أكواد شحن جديدة لطلاب الساتر
                    </h2>

                    <form onSubmit={generate}>
                        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr auto auto', gap: 12, alignItems: 'flex-end' }}>

                            <div>
                                <label style={{ display: 'block', fontSize: 12, fontWeight: 700, color: txtSub, marginBottom: 6 }}>الصف الدراسي:</label>
                                <select value={data.academic_year_id} onChange={e => setData('academic_year_id', e.target.value)} style={sel(!!errors.academic_year_id)} required>
                                    <option value="">-- اختر الصف الدراسي --</option>
                                    {academicYears.map(y => <option key={y.id} value={y.id}>{y.name}</option>)}
                                </select>
                                {errors.academic_year_id && <p style={{ color: R, fontSize: 11, marginTop: 4 }}>{errors.academic_year_id}</p>}
                            </div>

                            <div>
                                <label style={{ display: 'block', fontSize: 12, fontWeight: 700, color: txtSub, marginBottom: 6 }}>المحاضرة (اختياري):</label>
                                <select value={data.lesson_id} onChange={e => setData('lesson_id', e.target.value)} style={sel(false)}>
                                    <option value="">-- شحن عام للصف --</option>
                                    {lessons.map(l => <option key={l.id} value={l.id}>{l.title}</option>)}
                                </select>
                            </div>

                            <div>
                                <label style={{ display: 'block', fontSize: 12, fontWeight: 700, color: txtSub, marginBottom: 6 }}>عدد الأكواد المطلوبة:</label>
                                <input
                                    type="number" min={1} max={200}
                                    value={data.count}
                                    onChange={e => setData('count', e.target.value)}
                                    style={{ ...sel(!!errors.count), width: 120 }}
                                    required
                                />
                            </div>

                            <div>
                                <button type="submit" disabled={processing} style={{
                                    padding: '10px 22px', borderRadius: 10, border: 'none',
                                    background: processing ? (dark ? 'rgba(255,255,255,.1)' : '#94a3b8') : `linear-gradient(135deg,${O},#d9620a)`,
                                    color: processing ? txtSub : '#fff',
                                    fontSize: 14, fontWeight: 800,
                                    cursor: processing ? 'not-allowed' : 'pointer',
                                    fontFamily: "'Cairo',sans-serif",
                                    boxShadow: processing ? 'none' : '0 4px 16px rgba(244,124,32,.35)',
                                    whiteSpace: 'nowrap', height: 42,
                                }}>
                                    {processing ? 'جارٍ التوليد...' : '⚡ توليد الأكواد'}
                                </button>
                            </div>
                        </div>
                    </form>
                </div>

                {/* Table */}
                <div style={{
                    background: card, borderRadius: 16,
                    border: `1px solid ${cardBd}`,
                    boxShadow: dark ? '0 4px 20px rgba(0,0,0,.3)' : '0 2px 12px rgba(20,33,61,.06)',
                    overflow: 'hidden',
                }}>
                    <div style={{
                        padding: '18px 24px', borderBottom: `1px solid ${cardBd}`,
                        display: 'flex', alignItems: 'center', justifyContent: 'space-between',
                    }}>
                        <h2 style={{ fontSize: 15, fontWeight: 800, color: dark ? '#DCC9A3' : '#14213D', margin: 0 }}>🎟️ أكواد الشحن النشطة بالمنصة</h2>
                        <span style={{
                            padding: '4px 12px', borderRadius: 999,
                            background: available > 0 ? 'rgba(5,150,105,.15)' : (dark ? 'rgba(255,255,255,.06)' : 'rgba(100,116,139,.1)'),
                            color: available > 0 ? G : txtSub,
                            fontSize: 12, fontWeight: 700,
                        }}>
                            {available} كود متاح
                        </span>
                    </div>

                    {codes.length === 0 ? (
                        <div style={{ textAlign: 'center', padding: '60px', color: txtSub, fontSize: 15 }}>
                            لا توجد أكواد حتى الآن
                        </div>
                    ) : (
                        <div style={{ overflowX: 'auto' }}>
                            <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: 13 }}>
                                <thead>
                                    <tr style={{ background: dark ? 'rgba(255,255,255,.03)' : '#f8fafc', borderBottom: `1px solid ${cardBd}` }}>
                                        {['#', 'كود التفعيل (Promo Code)', 'الصف الدراسي', 'المحاضرة', 'حالة الاستخدام', 'شحن بواسطة', 'الإجراء'].map(h => (
                                            <th key={h} style={{ padding: '12px 16px', textAlign: 'right', fontWeight: 700, color: txtSub, whiteSpace: 'nowrap', fontSize: 12 }}>{h}</th>
                                        ))}
                                    </tr>
                                </thead>
                                <tbody>
                                    {codes.map((code, i) => (
                                        <tr key={code.id} style={{
                                            borderBottom: `1px solid ${dark ? 'rgba(255,255,255,.04)' : '#f1f5f9'}`,
                                            background: i % 2 === 0 ? card : (dark ? 'rgba(255,255,255,.02)' : '#fafbfd'),
                                        }}>
                                            <td style={{ padding: '11px 16px', color: txtSub, fontWeight: 600 }}>{i + 1}</td>
                                            <td style={{ padding: '11px 16px', fontWeight: 800, color: dark ? '#DCC9A3' : '#14213D', fontFamily: 'monospace', fontSize: 14, direction: 'ltr' }}>
                                                {code.code}
                                            </td>
                                            <td style={{ padding: '11px 16px', color: txtMain }}>
                                                {code.academic_year?.name ?? '—'}
                                            </td>
                                            <td style={{ padding: '11px 16px', color: txtSub, maxWidth: 160 }}>
                                                {code.lesson?.title ?? <span style={{ opacity: .5 }}>عام</span>}
                                            </td>
                                            <td style={{ padding: '11px 16px' }}>
                                                <span style={{
                                                    padding: '3px 10px', borderRadius: 999, fontSize: 11, fontWeight: 700,
                                                    background: code.is_used ? 'rgba(220,38,38,.12)' : 'rgba(5,150,105,.12)',
                                                    color: code.is_used ? R : G,
                                                }}>
                                                    {code.is_used ? '✕ تم الشحن' : '✓ متاح للشحن'}
                                                </span>
                                            </td>
                                            <td style={{ padding: '11px 16px', color: txtSub }}>
                                                {code.used_by?.name ?? <span style={{ opacity: .5 }}>—</span>}
                                            </td>
                                            <td style={{ padding: '11px 16px' }}>
                                                {!code.is_used ? (
                                                    <button onClick={() => setDeleteId(code.id)} style={{
                                                        padding: '5px 12px', borderRadius: 6,
                                                        border: `1.5px solid ${R}`,
                                                        background: 'rgba(220,38,38,.1)', color: R,
                                                        fontWeight: 700, fontSize: 12, cursor: 'pointer',
                                                        fontFamily: "'Cairo',sans-serif", transition: 'all .15s',
                                                    }}
                                                        onMouseEnter={e => { e.currentTarget.style.background = R; e.currentTarget.style.color = '#fff'; }}
                                                        onMouseLeave={e => { e.currentTarget.style.background = 'rgba(220,38,38,.1)'; e.currentTarget.style.color = R; }}
                                                    >🗑 حذف</button>
                                                ) : (
                                                    <span style={{ color: txtSub, fontSize: 12 }}>—</span>
                                                )}
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    )}
                </div>
            </div>

            {/* Delete Modal */}
            {deleteId && (
                <div style={{
                    position: 'fixed', inset: 0, background: 'rgba(0,0,0,.6)',
                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                    zIndex: 9999, padding: 20,
                }} onClick={() => setDeleteId(null)}>
                    <div style={{
                        background: card, borderRadius: 16, padding: '28px',
                        border: `1px solid ${cardBd}`,
                        maxWidth: 380, width: '100%', direction: 'rtl',
                        fontFamily: "'Cairo',sans-serif",
                        boxShadow: dark ? '0 24px 80px rgba(0,0,0,.5)' : '0 24px 80px rgba(0,0,0,.2)',
                    }} onClick={e => e.stopPropagation()}>
                        <h3 style={{ fontSize: 17, fontWeight: 800, color: txtMain, marginBottom: 10 }}>🗑 تأكيد الحذف</h3>
                        <p style={{ fontSize: 13, color: txtSub, marginBottom: 22 }}>هل أنت متأكد من حذف هذا الكود؟ لا يمكن التراجع.</p>
                        <div style={{ display: 'flex', gap: 10, justifyContent: 'flex-end' }}>
                            <button onClick={() => setDeleteId(null)} style={{
                                padding: '9px 20px', borderRadius: 8,
                                border: `1px solid ${cardBd}`,
                                background: dark ? 'rgba(255,255,255,.05)' : '#f8fafc',
                                color: txtSub, cursor: 'pointer',
                                fontFamily: "'Cairo',sans-serif", fontWeight: 700,
                            }}>إلغاء</button>
                            <button onClick={() => destroy(deleteId)} style={{
                                padding: '9px 24px', borderRadius: 8, border: 'none',
                                background: R, color: '#fff', cursor: 'pointer',
                                fontFamily: "'Cairo',sans-serif", fontWeight: 700,
                            }}>تأكيد الحذف</button>
                        </div>
                    </div>
                </div>
            )}
        </AssistantLayout>
    );
}


