import { Head, useForm, router } from '@inertiajs/react';
import AssistantLayout from '@/Layouts/AssistantLayout';
import { useState, useEffect } from 'react';

const C = { navy: '#0E3A2E', orange: '#1F5A45', gold: '#E8DCC1', navyL: '#1e2e50' };

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

function StudentCard({ student, dark }) {
    const [showModal, setShowModal] = useState(false);
    const [centerCode, setCenterCode] = useState(student.center_code || '');
    const approveForm = useForm({ center_code: '' });
    const rejectForm  = useForm({});

    const handleApprove = () => {
        approveForm.setData('center_code', centerCode);
        approveForm.post(route('assistant.students.approve', student.id), {
            onSuccess: () => setShowModal(false),
        });
    };

    const handleReject = () => {
        if (confirm(`هل أنت متأكد من رفض وحذف طلب الطالب "${student.name}"؟`)) {
            rejectForm.post(route('assistant.students.reject', student.id));
        }
    };

    const isOffline = student.student_type === 'offline';
    const initials  = student.name ? student.name.split(' ').map(w => w[0]).slice(0, 2).join('') : '?';

    const card    = dark ? '#1C1916' : '#fff';
    const cardBd  = dark ? 'rgba(255,255,255,.07)' : '#E3D9C4';
    const detBg   = dark ? 'rgba(255,255,255,.04)' : '#f8fafc';
    const detBd   = dark ? 'rgba(255,255,255,.05)' : '#F7F3E9';
    const txtMain = dark ? '#E8DCC1' : C.navy;
    const txtSub  = dark ? 'rgba(220,201,163,.45)' : '#A89A78';

    return (
        <>
            <div style={{
                background: card, borderRadius: 16,
                border: `1px solid ${cardBd}`,
                boxShadow: dark ? '0 4px 20px rgba(0,0,0,.3)' : '0 4px 16px rgba(20,33,61,.06)',
                overflow: 'hidden', transition: 'box-shadow .2s, transform .2s',
            }}
                onMouseEnter={e => { e.currentTarget.style.boxShadow = dark ? '0 8px 32px rgba(0,0,0,.4)' : '0 8px 28px rgba(20,33,61,.1)'; e.currentTarget.style.transform = 'translateY(-2px)'; }}
                onMouseLeave={e => { e.currentTarget.style.boxShadow = dark ? '0 4px 20px rgba(0,0,0,.3)' : '0 4px 16px rgba(20,33,61,.06)'; e.currentTarget.style.transform = 'translateY(0)'; }}
            >
                <div style={{ height: 4, background: isOffline ? `linear-gradient(90deg,${C.navy},${C.navyL})` : `linear-gradient(90deg,${C.orange},#d96a12)` }} />

                <div style={{ padding: '20px 22px' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 14, marginBottom: 16 }}>
                        <div style={{
                            width: 52, height: 52, borderRadius: '50%',
                            background: `linear-gradient(135deg,${C.navy},${C.navyL})`,
                            display: 'flex', alignItems: 'center', justifyContent: 'center',
                            color: C.gold, fontSize: 18, fontWeight: 700, flexShrink: 0,
                        }}>{initials}</div>
                        <div>
                            <div style={{ fontWeight: 800, fontSize: 15, color: txtMain }}>{student.name}</div>
                            <div style={{ fontSize: 12, color: txtSub, marginTop: 2 }}>{student.email}</div>
                        </div>
                        <div style={{ marginRight: 'auto' }}>
                            <span style={{
                                padding: '4px 12px', borderRadius: 20, fontSize: 12, fontWeight: 700,
                                background: isOffline ? `${C.navy}22` : `${C.orange}22`,
                                color: isOffline ? (dark ? '#7ea8d4' : C.navy) : C.orange,
                                border: `1px solid ${isOffline ? C.navy : C.orange}33`,
                            }}>
                                {isOffline ? '🏫 سنتر' : '💻 أونلاين'}
                            </span>
                        </div>
                    </div>

                    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 8, marginBottom: 16 }}>
                        {[
                            { label: 'الصف الدراسي', value: student.academic_year || '—' },
                            { label: 'المجموعة',      value: student.group_name   || '—' },
                            { label: 'رقم الطالب',    value: student.phone        || '—' },
                            { label: 'ولي الأمر',     value: student.parent_phone || '—' },
                        ].map(item => (
                            <div key={item.label} style={{ background: detBg, borderRadius: 10, padding: '10px 14px', border: `1px solid ${detBd}` }}>
                                <div style={{ fontSize: 10, color: txtSub, fontWeight: 600, marginBottom: 2, textTransform: 'uppercase' }}>{item.label}</div>
                                <div style={{ fontSize: 13, color: txtMain, fontWeight: 700, direction: 'ltr' }}>{item.value}</div>
                            </div>
                        ))}
                    </div>

                    {isOffline && student.center_code && (
                        <div style={{ background: `${C.gold}20`, border: `1px solid ${C.gold}50`, borderRadius: 10, padding: '8px 14px', marginBottom: 14, display: 'flex', alignItems: 'center', gap: 8 }}>
                            <span>🏷️</span>
                            <span style={{ fontSize: 13, color: dark ? C.gold : C.navy, fontWeight: 700 }}>
                                كود السنتر: <span style={{ color: C.orange }}>{student.center_code}</span>
                            </span>
                        </div>
                    )}

                    <div style={{ fontSize: 11, color: txtSub, marginBottom: 14 }}>تسجيل: {student.created_at}</div>

                    <div style={{ display: 'flex', gap: 8 }}>
                        <button onClick={() => setShowModal(true)} disabled={approveForm.processing} style={{
                            flex: 1, padding: '10px 0',
                            background: `linear-gradient(135deg,${C.orange},#d96a12)`,
                            color: '#fff', border: 'none', borderRadius: 10,
                            fontFamily: 'Cairo,sans-serif', fontWeight: 700, fontSize: 13,
                            cursor: 'pointer', boxShadow: '0 4px 12px rgba(244,124,32,.3)',
                        }}>✅ تفعيل</button>
                        <button onClick={handleReject} disabled={rejectForm.processing} style={{
                            flex: 1, padding: '10px 0',
                            background: dark ? 'rgba(239,68,68,.12)' : 'rgba(239,68,68,.08)',
                            color: '#dc2626', border: '1px solid rgba(239,68,68,.2)',
                            borderRadius: 10, fontFamily: 'Cairo,sans-serif', fontWeight: 700, fontSize: 13,
                            cursor: 'pointer',
                        }}>🗑️ رفض وحذف</button>
                    </div>
                </div>
            </div>

            {showModal && (
                <div style={{
                    position: 'fixed', inset: 0, zIndex: 1000,
                    background: 'rgba(0,0,0,.6)', backdropFilter: 'blur(4px)',
                    display: 'flex', alignItems: 'center', justifyContent: 'center', padding: 20,
                }} onClick={() => setShowModal(false)}>
                    <div style={{
                        background: dark ? '#1C1916' : '#fff', borderRadius: 20,
                        border: dark ? '1px solid rgba(255,255,255,.08)' : 'none',
                        padding: '28px 30px', width: '100%', maxWidth: 400,
                        boxShadow: '0 24px 80px rgba(0,0,0,.4)',
                    }} onClick={e => e.stopPropagation()}>
                        <div style={{ height: 4, background: `linear-gradient(90deg,${C.orange},#d96a12)`, borderRadius: 4, marginBottom: 20 }} />
                        <h3 style={{ color: dark ? C.gold : C.navy, fontWeight: 800, marginBottom: 8 }}>تفعيل حساب: {student.name}</h3>
                        {isOffline && (
                            <div style={{ marginBottom: 16 }}>
                                <label style={{ display: 'block', color: dark ? 'rgba(220,201,163,.7)' : '#374151', fontSize: 13, fontWeight: 700, marginBottom: 8 }}>
                                    كود السنتر (اختياري للطالب المركزي)
                                </label>
                                <input
                                    type="text"
                                    value={centerCode}
                                    onChange={e => setCenterCode(e.target.value)}
                                    placeholder="e.g. CTR-00123"
                                    dir="ltr"
                                    style={{
                                        width: '100%', padding: '10px 14px',
                                        border: `1.5px solid ${dark ? 'rgba(255,255,255,.12)' : '#E3D9C4'}`,
                                        borderRadius: 10, background: dark ? '#1C1916' : '#fff',
                                        color: dark ? '#E8DCC1' : '#0E3A2E',
                                        fontFamily: 'Cairo,sans-serif', fontSize: 14,
                                        outline: 'none', boxSizing: 'border-box',
                                    }}
                                />
                            </div>
                        )}
                        <p style={{ color: dark ? 'rgba(220,201,163,.5)' : '#6B6255', fontSize: 13, marginBottom: 20 }}>
                            هل تريد تفعيل هذا الحساب؟ سيتمكن الطالب من الدخول للمنصة بعد التفعيل.
                        </p>
                        <div style={{ display: 'flex', gap: 10 }}>
                            <button onClick={handleApprove} disabled={approveForm.processing} style={{
                                flex: 1, padding: '11px 0',
                                background: `linear-gradient(135deg,${C.orange},#d96a12)`,
                                color: '#fff', border: 'none', borderRadius: 10,
                                fontFamily: 'Cairo,sans-serif', fontWeight: 800, fontSize: 14, cursor: 'pointer',
                            }}>
                                {approveForm.processing ? 'جاري التفعيل...' : '✅ تأكيد التفعيل'}
                            </button>
                            <button onClick={() => setShowModal(false)} style={{
                                padding: '11px 20px',
                                background: dark ? 'rgba(255,255,255,.06)' : '#F7F3E9',
                                color: dark ? 'rgba(220,201,163,.6)' : '#475569',
                                border: dark ? '1px solid rgba(255,255,255,.08)' : 'none',
                                borderRadius: 10, fontFamily: 'Cairo,sans-serif', fontWeight: 700, fontSize: 14, cursor: 'pointer',
                            }}>إلغاء</button>
                        </div>
                    </div>
                </div>
            )}
        </>
    );
}

export default function StudentRequests({ assistant, students }) {
    const dark = useAssistantDark();

    return (
        <AssistantLayout assistant={assistant} title="طلبات التفعيل">
            <Head title="طلبات التفعيل" />

            <div style={{ marginBottom: 24, display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: 12 }}>
                <div>
                    <h2 style={{ color: dark ? C.gold : C.navy, fontSize: 20, fontWeight: 900, margin: 0 }}>طلبات التفعيل والتسجيل</h2>
                    <p style={{ color: dark ? 'rgba(220,201,163,.45)' : '#6B6255', fontSize: 14, margin: '4px 0 0' }}>
                        طلاب جدد ينتظرون مراجعتك وتفعيل حساباتهم
                    </p>
                </div>
                <div style={{
                    background: `${C.orange}18`, color: C.orange,
                    borderRadius: 20, padding: '6px 18px', fontSize: 14, fontWeight: 700,
                    border: `1px solid ${C.orange}33`,
                }}>
                    {students.length} طلب معلق
                </div>
            </div>

            {students.length === 0 ? (
                <div style={{
                    background: dark ? '#1C1916' : '#fff', borderRadius: 20, padding: '60px 40px',
                    textAlign: 'center',
                    border: `1px solid ${dark ? 'rgba(255,255,255,.07)' : '#E3D9C4'}`,
                    boxShadow: dark ? '0 4px 20px rgba(0,0,0,.25)' : '0 4px 20px rgba(20,33,61,.04)',
                }}>
                    <div style={{ fontSize: 56, marginBottom: 16 }}>🎉</div>
                    <div style={{ fontWeight: 700, fontSize: 18, color: '#16a34a', marginBottom: 6 }}>لا توجد طلبات معلقة</div>
                    <div style={{ color: dark ? 'rgba(220,201,163,.4)' : '#A89A78', fontSize: 14 }}>جميع الطلاب تم مراجعة طلباتهم</div>
                </div>
            ) : (
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill,minmax(320px,1fr))', gap: 20 }}>
                    {students.map(student => (
                        <StudentCard key={student.id} student={student} dark={dark} />
                    ))}
                </div>
            )}
        </AssistantLayout>
    );
}
