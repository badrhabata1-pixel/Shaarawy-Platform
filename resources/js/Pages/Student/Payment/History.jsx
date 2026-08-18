import { Head, Link } from '@inertiajs/react';
import { useState, useEffect } from 'react';
import StudentLayout from '@/Layouts/StudentLayout';

const O = '#0D9488';
const BRAND_GRAD = 'linear-gradient(135deg,#0D9488 0%,#d9620a 100%)';
const N = '#14213D';
const G = '#C9A14A';

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

function screenshotUrl(path) {
    if (!path) return null;
    return path.startsWith('uploads/') ? `/${path}` : `/storage/${path}`;
}

const STATUS = {
    pending:  { label: 'قيد المراجعة', color: '#D97706', bg: '#FEF3C7', bgDark: 'rgba(217,119,6,.15)',  bd: '#fcd34d', bdDark: 'rgba(251,191,36,.3)' },
    approved: { label: 'تمت الموافقة', color: '#059669', bg: '#D1FAE5', bgDark: 'rgba(5,150,105,.15)', bd: '#6ee7b7', bdDark: 'rgba(52,211,153,.3)'  },
    rejected: { label: 'مرفوض',        color: '#DC2626', bg: '#FEE2E2', bgDark: 'rgba(220,38,38,.15)',  bd: '#fca5a5', bdDark: 'rgba(252,165,165,.3)' },
};

const METHOD = {
    vodafone: { label: 'فودافون كاش', icon: '📱' },
    instapay: { label: 'إنستا باي',   icon: '⚡' },
};

export default function PaymentHistory({ requests = [] }) {
    const dark = useStudentDark();
    const [zoom, setZoom] = useState(null);

    const cardBg  = dark ? '#152238' : '#fff';
    const cardBd  = dark ? 'rgba(255,255,255,.07)' : '#eee';
    const txtMain = dark ? '#f0f4f8' : N;
    const txtSub  = dark ? 'rgba(220,201,163,.5)'  : '#555';
    const txtDim  = dark ? 'rgba(220,201,163,.3)'  : '#aaa';

    return (
        <StudentLayout>
            <Head title="سجل الدفع — منصة منصور" />

            <div style={{ maxWidth: 720, margin: '0 auto', padding: '32px 20px', fontFamily: "'Cairo',sans-serif", direction: 'rtl' }}>

                {/* Header */}
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 28, flexWrap: 'wrap', gap: 12 }}>
                    <div>
                        <p style={{ fontSize: 12, color: G, letterSpacing: '.18em', fontWeight: 600, marginBottom: 4 }}>💳 الاشتراكات</p>
                        <h1 style={{ fontSize: 24, fontWeight: 800, color: txtMain, margin: 0 }}>سجل طلبات الدفع</h1>
                    </div>
                    <Link href={route('student.payment.create')} style={{
                        padding: '10px 22px', borderRadius: 10,
                        background: BRAND_GRAD,
                        color: '#fff', fontWeight: 700, fontSize: 13,
                        textDecoration: 'none', boxShadow: 'var(--brand-cta-shadow)',
                    }}>
                        + طلب دفع جديد
                    </Link>
                </div>

                {requests.length === 0 ? (
                    <div style={{
                        textAlign: 'center', padding: '60px 20px',
                        background: cardBg, borderRadius: 14, border: `1px solid ${cardBd}`,
                        boxShadow: dark ? '0 4px 20px rgba(0,0,0,.25)' : '0 2px 10px rgba(0,0,0,.04)',
                    }}>
                        <div style={{ fontSize: 48, marginBottom: 14 }}>💳</div>
                        <p style={{ color: txtSub, fontSize: 14, marginBottom: 10 }}>لا يوجد طلبات دفع بعد</p>
                        <Link href={route('student.payment.create')} style={{ color: O, fontWeight: 700, textDecoration: 'none' }}>
                            ابدأ طلب دفع الآن ←
                        </Link>
                    </div>
                ) : (
                    <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
                        {requests.map(req => {
                            const st    = STATUS[req.status] ?? STATUS.pending;
                            const mth   = METHOD[req.method] ?? { label: req.method, icon: '💳' };
                            const imgUrl = screenshotUrl(req.screenshot);
                            return (
                                <div key={req.id} style={{
                                    background: cardBg, borderRadius: 14, padding: '18px 20px',
                                    border: `1px solid ${cardBd}`,
                                    boxShadow: dark ? '0 4px 16px rgba(0,0,0,.3)' : '0 2px 10px rgba(0,0,0,.04)',
                                    display: 'flex', gap: 16, alignItems: 'flex-start', flexWrap: 'wrap',
                                }}>
                                    {/* Screenshot thumbnail */}
                                    {imgUrl && (
                                        <img
                                            src={imgUrl}
                                            alt="إيصال"
                                            onClick={() => setZoom(imgUrl)}
                                            style={{
                                                width: 72, height: 72, objectFit: 'cover',
                                                borderRadius: 10, flexShrink: 0,
                                                border: `1px solid ${cardBd}`,
                                                cursor: 'zoom-in',
                                            }}
                                        />
                                    )}

                                    <div style={{ flex: 1, minWidth: 0 }}>
                                        <div style={{ display: 'flex', alignItems: 'center', gap: 10, flexWrap: 'wrap', marginBottom: 6 }}>
                                            <span style={{ fontWeight: 800, fontSize: 15, color: txtMain }}>{req.unit?.title ?? '—'}</span>
                                            <span style={{
                                                padding: '3px 10px', borderRadius: 999, fontSize: 11, fontWeight: 700,
                                                color: st.color,
                                                background: dark ? st.bgDark : st.bg,
                                            }}>{st.label}</span>
                                        </div>

                                        <div style={{ fontSize: 13, color: txtSub, display: 'flex', gap: 16, flexWrap: 'wrap' }}>
                                            <span>{mth.icon} {mth.label}</span>
                                            {req.amount && <span>💰 {req.amount} جنيه</span>}
                                            <span>👤 {req.account_name}</span>
                                        </div>

                                        {req.admin_note && (
                                            <div style={{
                                                marginTop: 8, padding: '8px 12px',
                                                background: dark ? 'rgba(217,119,6,.12)' : '#fef9f0',
                                                borderRadius: 8, fontSize: 12,
                                                color: dark ? '#fbbf24' : '#92400e',
                                                borderRight: '3px solid #D97706',
                                            }}>
                                                📝 {req.admin_note}
                                            </div>
                                        )}

                                        <div style={{ fontSize: 11, color: txtDim, marginTop: 8 }}>
                                            {new Date(req.created_at).toLocaleDateString('ar-EG', { year:'numeric', month:'long', day:'numeric' })}
                                        </div>
                                    </div>
                                </div>
                            );
                        })}
                    </div>
                )}
            </div>

            {/* Lightbox */}
            {zoom && (
                <div onClick={() => setZoom(null)} style={{
                    position: 'fixed', inset: 0, background: 'rgba(0,0,0,.88)',
                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                    zIndex: 9999, cursor: 'zoom-out', padding: 20,
                }}>
                    <img src={zoom} alt="إيصال" style={{ maxWidth: '90vw', maxHeight: '90vh', borderRadius: 12, boxShadow: '0 24px 80px rgba(0,0,0,.5)' }} />
                </div>
            )}
        </StudentLayout>
    );
}
