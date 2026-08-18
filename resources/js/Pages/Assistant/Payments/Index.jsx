import { useState, useEffect } from 'react';
import { Head, router, usePage } from '@inertiajs/react';
import AssistantLayout from '@/Layouts/AssistantLayout';

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

const METHOD = {
    vodafone: { label: 'فودافون كاش', icon: '📱' },
    instapay: { label: 'إنستا باي',   icon: '⚡' },
};
const BRAND_GRAD = 'linear-gradient(135deg,#0D9488 0%,#d9620a 100%)';

function screenshotUrl(path) {
    if (!path) return null;
    return path.startsWith('uploads/') ? `/${path}` : `/storage/${path}`;
}

export default function AssistantPaymentsIndex({ assistant, requests = [] }) {
    const dark = useAssistantDark();
    const { props } = usePage();
    const flash = props.flash ?? {};

    const [activeFilter, setActiveFilter] = useState('pending');
    const [zoom,         setZoom]         = useState(null);
    const [reviewModal,  setReviewModal]  = useState(null);
    const [note,         setNote]         = useState('');
    const [submitting,   setSubmitting]   = useState(false);

    const STATUS = {
        pending:  { label: 'قيد المراجعة', color: '#D97706', bg: dark ? 'rgba(217,119,6,.18)'  : '#FEF3C7' },
        approved: { label: 'تمت الموافقة', color: '#059669', bg: dark ? 'rgba(5,150,105,.18)' : '#D1FAE5' },
        rejected: { label: 'مرفوض',        color: '#DC2626', bg: dark ? 'rgba(220,38,38,.18)'  : '#FEE2E2' },
    };

    const filtered = activeFilter === 'all' ? requests : requests.filter(r => r.status === activeFilter);
    const counts   = {
        all:      requests.length,
        pending:  requests.filter(r => r.status === 'pending').length,
        approved: requests.filter(r => r.status === 'approved').length,
        rejected: requests.filter(r => r.status === 'rejected').length,
    };

    const openModal  = (req, action) => { setReviewModal({ req, action }); setNote(''); };
    const closeModal = () => setReviewModal(null);

    const submitReview = () => {
        if (!reviewModal) return;
        setSubmitting(true);
        router.post(
            route(`assistant.payments.${reviewModal.action}`, reviewModal.req.id),
            { note },
            { preserveScroll: true, onFinish: () => { setSubmitting(false); closeModal(); } }
        );
    };

    const card   = dark ? '#152238' : '#fff';
    const cardBd = dark ? 'rgba(255,255,255,.07)' : '#eee';
    const txtMain= dark ? '#f0f4f8' : '#111';
    const txtSub = dark ? 'rgba(220,201,163,.45)' : '#666';
    const inputBg= dark ? '#0d1826' : '#fff';
    const inputBd= dark ? 'rgba(255,255,255,.12)' : '#ddd';

    return (
        <AssistantLayout assistant={assistant} title="طلبات الدفع">
            <Head title="طلبات الدفع — السكرتارية" />

            <div style={{ fontFamily: "'Cairo',sans-serif", direction: 'rtl' }}>

                <div style={{ marginBottom: 24 }}>
                    <h1 style={{ fontSize: 22, fontWeight: 800, margin: 0, color: dark ? '#DCC9A3' : '#14213D' }}>💳 طلبات الدفع</h1>
                    <p style={{ fontSize: 13, color: txtSub, marginTop: 4 }}>
                        {counts.pending > 0 ? `${counts.pending} طلب قيد المراجعة` : 'لا توجد طلبات معلقة'} — إجمالي {counts.all} طلب
                    </p>
                </div>

                {flash.success && (
                    <div style={{
                        background: dark ? 'rgba(5,150,105,.18)' : '#D1FAE5',
                        border: `1px solid ${dark ? 'rgba(52,211,153,.25)' : '#6EE7B7'}`,
                        borderRadius: 10, padding: '10px 16px',
                        color: dark ? '#34d399' : '#065F46',
                        fontSize: 13, marginBottom: 18, fontWeight: 600,
                    }}>✓ {flash.success}</div>
                )}

                {/* Filter tabs */}
                <div style={{ display: 'flex', gap: 8, marginBottom: 20, flexWrap: 'wrap' }}>
                    {[
                        { key: 'all',      label: 'الكل' },
                        { key: 'pending',  label: 'قيد المراجعة' },
                        { key: 'approved', label: 'موافق عليها' },
                        { key: 'rejected', label: 'مرفوضة' },
                    ].map(f => {
                        const isActive = activeFilter === f.key;
                        return (
                            <button key={f.key} onClick={() => setActiveFilter(f.key)} style={{
                                padding: '7px 18px', borderRadius: 8, cursor: 'pointer',
                                fontFamily: "'Cairo',sans-serif", fontSize: 13, fontWeight: 700,
                                border: '1.5px solid',
                                borderColor: isActive ? '#0D9488' : cardBd,
                                background:  isActive ? BRAND_GRAD : card,
                                color:       isActive ? '#fff'    : txtSub,
                                transition: 'all .2s',
                            }}>
                                {f.label} <span style={{ opacity: .6, fontSize: 11 }}>({counts[f.key]})</span>
                            </button>
                        );
                    })}
                </div>

                {filtered.length === 0 ? (
                    <div style={{ textAlign: 'center', padding: '60px', background: card, borderRadius: 14, border: `1px solid ${cardBd}`, color: txtSub }}>
                        لا توجد طلبات
                    </div>
                ) : (
                    <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
                        {filtered.map(req => {
                            const st  = STATUS[req.status] ?? STATUS.pending;
                            const mth = METHOD[req.method] ?? { label: req.method, icon: '💳' };
                            const imgUrl = screenshotUrl(req.screenshot);
                            return (
                                <div key={req.id} style={{
                                    background: card, borderRadius: 14, padding: '18px 20px',
                                    border: `1px solid ${cardBd}`,
                                    boxShadow: dark ? '0 2px 12px rgba(0,0,0,.25)' : '0 2px 10px rgba(0,0,0,.04)',
                                    display: 'flex', gap: 18, alignItems: 'flex-start', flexWrap: 'wrap',
                                }}>
                                    {imgUrl && (
                                        <img
                                            src={imgUrl} alt="إيصال"
                                            onClick={() => setZoom(imgUrl)}
                                            style={{ width: 80, height: 80, objectFit: 'cover', borderRadius: 10, flexShrink: 0, border: `1px solid ${cardBd}`, cursor: 'zoom-in' }}
                                        />
                                    )}

                                    <div style={{ flex: 1, minWidth: 200 }}>
                                        <div style={{ display: 'flex', alignItems: 'center', gap: 10, flexWrap: 'wrap', marginBottom: 8 }}>
                                            <span style={{ fontWeight: 800, fontSize: 16, color: txtMain }}>{req.student?.name ?? '—'}</span>
                                            <span style={{ padding: '3px 10px', borderRadius: 999, fontSize: 11, fontWeight: 700, color: st.color, background: st.bg }}>{st.label}</span>
                                        </div>

                                        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill,minmax(160px,1fr))', gap: '4px 20px', fontSize: 13 }}>
                                            <Info label="📞 الهاتف"      value={req.student?.phone ?? '—'} ltr txtSub={txtSub} txtMain={txtMain} />
                                            <Info label="📚 الوحدة"      value={req.unit?.title ?? '—'}   txtSub={txtSub} txtMain={txtMain} />
                                            <Info label="💳 طريقة الدفع" value={`${mth.icon} ${mth.label}`} txtSub={txtSub} txtMain={txtMain} />
                                            <Info label="👤 اسم الحساب"  value={req.account_name}          txtSub={txtSub} txtMain={txtMain} />
                                            {req.amount && <Info label="💰 المبلغ" value={`${req.amount} جنيه`} txtSub={txtSub} txtMain={txtMain} />}
                                            <Info label="📅 التاريخ" value={new Date(req.created_at).toLocaleDateString('ar-EG')} txtSub={txtSub} txtMain={txtMain} />
                                        </div>

                                        {req.admin_note && (
                                            <div style={{ marginTop: 10, padding: '8px 12px', background: dark ? 'rgba(217,119,6,.12)' : '#fef9f0', borderRadius: 8, fontSize: 12, color: dark ? '#fbbf24' : '#92400e', borderRight: '3px solid #D97706' }}>
                                                📝 ملاحظة: {req.admin_note}
                                            </div>
                                        )}

                                        {req.status === 'pending' && (
                                            <div style={{ display: 'flex', gap: 8, marginTop: 14 }}>
                                                <ActionBtn color="#059669" onClick={() => openModal(req, 'approve')}>✓ قبول</ActionBtn>
                                                <ActionBtn color="#DC2626" onClick={() => openModal(req, 'reject')}>✕ رفض</ActionBtn>
                                            </div>
                                        )}
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

            {/* Review Modal */}
            {reviewModal && (
                <div style={{
                    position: 'fixed', inset: 0, background: dark ? 'rgba(0,0,0,.75)' : 'rgba(0,0,0,.55)',
                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                    zIndex: 9999, padding: 20,
                }} onClick={closeModal}>
                    <div style={{
                        background: card, borderRadius: 16, padding: '28px 28px 24px',
                        border: `1px solid ${cardBd}`,
                        width: '100%', maxWidth: 440, direction: 'rtl',
                        fontFamily: "'Cairo',sans-serif",
                        boxShadow: dark ? '0 24px 80px rgba(0,0,0,.6)' : '0 24px 80px rgba(0,0,0,.3)',
                    }} onClick={e => e.stopPropagation()}>
                        <h3 style={{ fontSize: 17, fontWeight: 800, marginBottom: 6, color: txtMain }}>
                            {reviewModal.action === 'approve' ? '✅ تأكيد الموافقة' : '❌ تأكيد الرفض'}
                        </h3>
                        <p style={{ fontSize: 13, color: txtSub, marginBottom: 18 }}>
                            الطالب: <strong style={{ color: txtMain }}>{reviewModal.req.student?.name}</strong>
                            {' — '}الوحدة: <strong style={{ color: txtMain }}>{reviewModal.req.unit?.title}</strong>
                        </p>
                        <label style={{ display: 'block', fontSize: 13, fontWeight: 700, marginBottom: 6, color: dark ? 'rgba(220,201,163,.7)' : '#374151' }}>
                            ملاحظة للطالب (اختياري)
                        </label>
                        <textarea
                            value={note}
                            onChange={e => setNote(e.target.value)}
                            rows={3}
                            placeholder="اكتب سبب الرفض أو أي ملاحظة..."
                            style={{
                                width: '100%', boxSizing: 'border-box',
                                border: `1.5px solid ${inputBd}`, borderRadius: 8, padding: '10px 12px', fontSize: 13,
                                fontFamily: "'Cairo',sans-serif", resize: 'vertical', outline: 'none',
                                background: inputBg, color: txtMain,
                            }}
                            onFocus={e => e.target.style.borderColor = '#F47C20'}
                            onBlur={e  => e.target.style.borderColor = inputBd}
                        />
                        <div style={{ display: 'flex', gap: 10, marginTop: 18, justifyContent: 'flex-end' }}>
                            <button onClick={closeModal} style={{
                                padding: '9px 20px', borderRadius: 8,
                                border: `1px solid ${cardBd}`,
                                background: dark ? 'rgba(255,255,255,.05)' : '#fff',
                                color: dark ? 'rgba(220,201,163,.6)' : '#555',
                                cursor: 'pointer', fontFamily: "'Cairo',sans-serif", fontWeight: 700,
                            }}>إلغاء</button>
                            <button onClick={submitReview} disabled={submitting} style={{
                                padding: '9px 24px', borderRadius: 999, border: 'none', cursor: 'pointer',
                                fontFamily: "'Cairo',sans-serif", fontWeight: 700, color: '#fff',
                                background: BRAND_GRAD,
                                opacity: submitting ? .6 : 1,
                                boxShadow: submitting ? 'none' : 'var(--brand-cta-shadow)',
                            }}>
                                {submitting ? 'جارٍ...' : reviewModal.action === 'approve' ? 'تأكيد الموافقة' : 'تأكيد الرفض'}
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </AssistantLayout>
    );
}

function Info({ label, value, ltr, txtSub, txtMain }) {
    return (
        <div style={{ paddingBottom: 2 }}>
            <span style={{ color: txtSub, fontSize: 11 }}>{label}: </span>
            <span style={{ fontWeight: 600, color: txtMain, direction: ltr ? 'ltr' : 'inherit' }}>{value}</span>
        </div>
    );
}

function ActionBtn({ color, onClick, children }) {
    return (
        <button onClick={onClick} style={{
            padding: '8px 16px', borderRadius: 999, border: 'none',
            background: BRAND_GRAD, color: '#fff', fontWeight: 800, fontSize: 12,
            cursor: 'pointer', fontFamily: "'Cairo',sans-serif", transition: 'all .15s',
            boxShadow: 'var(--brand-cta-shadow)',
        }}
            onMouseEnter={e => { e.currentTarget.style.transform = 'translateY(-1px)'; }}
            onMouseLeave={e => { e.currentTarget.style.transform = 'translateY(0)'; }}
        >
            {children}
        </button>
    );
}
