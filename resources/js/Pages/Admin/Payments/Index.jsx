import { useState, useEffect } from 'react';
import { Head, router, usePage } from '@inertiajs/react';
import AdminLayout from '@/Layouts/AdminLayout';
const BRAND_GRAD = 'linear-gradient(135deg,#0D9488 0%,#d9620a 100%)';

/* ── detect dark/light from AdminLayout's data-theme attr ── */
function useAdminDark() {
    const [dark, setDark] = useState(() => {
        try { return localStorage.getItem('adminTheme') === 'dark'; } catch { return false; }
    });
    useEffect(() => {
        const el = document.querySelector('[data-theme]');
        if (!el) return;
        setDark(el.dataset.theme === 'dark');
        const obs = new MutationObserver(() => setDark(el.dataset.theme === 'dark'));
        obs.observe(el, { attributes: true, attributeFilter: ['data-theme'] });
        return () => obs.disconnect();
    }, []);
    return dark;
}

export default function PaymentsIndex({ requests = [], statusFilter = 'all' }) {
    const { props } = usePage();
    const flash = props.flash ?? {};
    const dark  = useAdminDark();

    const [activeFilter, setActiveFilter] = useState(statusFilter);
    const [reviewModal,  setReviewModal]  = useState(null);
    const [note,         setNote]         = useState('');
    const [submitting,   setSubmitting]   = useState(false);

    const filtered = activeFilter === 'all'
        ? requests
        : requests.filter(r => r.status === activeFilter);

    const STATUS = {
        pending:  { label: 'قيد المراجعة', color: '#D97706', bg: dark ? 'rgba(217,119,6,.18)'  : '#FEF3C7' },
        approved: { label: 'تمت الموافقة', color: '#059669', bg: dark ? 'rgba(5,150,105,.18)' : '#D1FAE5' },
        rejected: { label: 'مرفوض',        color: '#DC2626', bg: dark ? 'rgba(220,38,38,.18)'  : '#FEE2E2' },
    };
    const METHOD = {
        vodafone: { label: 'فودافون كاش', icon: '📱' },
        instapay: { label: 'إنستا باي',   icon: '⚡' },
    };

    const counts = {
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
        const { req, action } = reviewModal;
        router.post(
            route(`admin.payments.${action}`, req.id),
            { note },
            { onFinish: () => { setSubmitting(false); closeModal(); }, preserveScroll: true }
        );
    };

    return (
        <AdminLayout title="طلبات الدفع">
            <Head title="طلبات الدفع — لوحة التحكم" />

            <div style={{ padding: '28px 32px', fontFamily: "'Cairo',sans-serif", direction: 'rtl' }}>

                {/* Header */}
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 24, flexWrap: 'wrap', gap: 12 }}>
                    <div>
                        <h1 style={{ fontSize: 22, fontWeight: 800, margin: 0, color: 'var(--a-text)' }}>طلبات الدفع</h1>
                        <p style={{ fontSize: 13, color: 'var(--a-text-4)', marginTop: 4 }}>{requests.length} طلب إجمالي</p>
                    </div>
                    <a href={route('admin.payment-settings')} style={{
                        padding: '9px 20px', borderRadius: 10,
                        border: '1.5px solid #2fbcd4',
                        color: '#2fbcd4', fontSize: 13, fontWeight: 700, textDecoration: 'none',
                        background: dark ? 'rgba(47,188,212,.08)' : 'transparent',
                    }}>
                        ⚙️ إعدادات أرقام الدفع
                    </a>
                </div>

                {flash.success && (
                    <div style={{
                        background: dark ? 'rgba(5,150,105,.18)' : '#D1FAE5',
                        border: `1px solid ${dark ? 'rgba(52,211,153,.25)' : '#6EE7B7'}`,
                        borderRadius: 10, padding: '10px 16px',
                        color: dark ? '#34d399' : '#065F46',
                        fontSize: 13, marginBottom: 18, fontWeight: 600,
                    }}>
                        ✓ {flash.success}
                    </div>
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
                                padding: '7px 18px', borderRadius: 10, cursor: 'pointer',
                                fontFamily: "'Cairo',sans-serif", fontSize: 13, fontWeight: 700,
                                border: '1.5px solid',
                                borderColor: isActive ? '#0D9488' : 'var(--a-border)',
                                background:  isActive ? BRAND_GRAD : 'var(--a-card)',
                                color:       isActive ? '#fff'    : 'var(--a-text-3)',
                                transition: 'all .2s',
                            }}>
                                {f.label} <span style={{ opacity: .65, fontSize: 11 }}>({counts[f.key]})</span>
                            </button>
                        );
                    })}
                </div>

                {/* Table */}
                {filtered.length === 0 ? (
                    <div style={{
                        textAlign: 'center', padding: '60px',
                        background: 'var(--a-card)', borderRadius: 14,
                        border: '1px solid var(--a-border)', color: 'var(--a-text-4)',
                        fontFamily: "'Cairo',sans-serif",
                    }}>
                        لا توجد طلبات
                    </div>
                ) : (
                    <div style={{ background: 'var(--a-card)', borderRadius: 14, border: '1px solid var(--a-border)', overflow: 'hidden' }}>
                        <div style={{ overflowX: 'auto' }}>
                            <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: 13 }}>
                                <thead>
                                    <tr style={{ background: 'var(--a-thead)', borderBottom: '1px solid var(--a-border)' }}>
                                        {['الطالب','الهاتف','الوحدة','الطريقة','الاسم في الدفع','المبلغ','السكريم شت','الحالة','التاريخ','إجراء'].map(h => (
                                            <th key={h} style={{
                                                padding: '13px 14px', textAlign: 'right',
                                                fontWeight: 700, color: 'var(--a-thead-text)',
                                                whiteSpace: 'nowrap', fontSize: 12.5,
                                                letterSpacing: '.02em',
                                            }}>{h}</th>
                                        ))}
                                    </tr>
                                </thead>
                                <tbody>
                                    {filtered.map((req, i) => {
                                        const st  = STATUS[req.status] ?? STATUS.pending;
                                        const mth = METHOD[req.method] ?? { label: req.method, icon: '💳' };
                                        return (
                                            <tr key={req.id} style={{
                                                borderBottom: '1px solid var(--a-border)',
                                                background: i % 2 === 0 ? 'var(--a-card)' : 'var(--a-card-2)',
                                                transition: 'background .12s',
                                            }}
                                            onMouseEnter={e => e.currentTarget.style.background = 'var(--a-row-hover)'}
                                            onMouseLeave={e => e.currentTarget.style.background = i % 2 === 0 ? 'var(--a-card)' : 'var(--a-card-2)'}
                                            >
                                                <td style={{ padding: '12px 14px', fontWeight: 700, color: 'var(--a-text)', whiteSpace: 'nowrap' }}>{req.student?.name ?? '—'}</td>
                                                <td style={{ padding: '12px 14px', direction: 'ltr', color: 'var(--a-text-3)', whiteSpace: 'nowrap' }}>{req.student?.phone ?? '—'}</td>
                                                <td style={{ padding: '12px 14px', color: 'var(--a-text-2)', maxWidth: 120 }}>{req.unit?.title ?? '—'}</td>
                                                <td style={{ padding: '12px 14px', color: 'var(--a-text)', whiteSpace: 'nowrap' }}>{mth.icon} {mth.label}</td>
                                                <td style={{ padding: '12px 14px', color: 'var(--a-text-3)' }}>{req.account_name}</td>
                                                <td style={{ padding: '12px 14px', fontWeight: 700, color: '#2fbcd4', whiteSpace: 'nowrap' }}>{req.amount ? `${req.amount} ج` : '—'}</td>
                                                <td style={{ padding: '12px 14px' }}>
                                                    {req.screenshot ? (
                                                        <a href={req.screenshot.startsWith('uploads/') ? `/${req.screenshot}` : `/storage/${req.screenshot}`} target="_blank" rel="noreferrer">
                                                            <img
                                                                src={req.screenshot.startsWith('uploads/') ? `/${req.screenshot}` : `/storage/${req.screenshot}`}
                                                                alt="إيصال"
                                                                style={{ width: 52, height: 52, objectFit: 'cover', borderRadius: 8, border: '1px solid var(--a-border)', cursor: 'pointer', display: 'block' }}
                                                            />
                                                        </a>
                                                    ) : <span style={{ color: 'var(--a-text-4)', fontSize: 12 }}>—</span>}
                                                </td>
                                                <td style={{ padding: '12px 14px' }}>
                                                    <span style={{ padding: '4px 10px', borderRadius: 999, fontSize: 11, fontWeight: 700, color: st.color, background: st.bg, whiteSpace: 'nowrap' }}>
                                                        {st.label}
                                                    </span>
                                                    {req.admin_note && (
                                                        <div style={{ fontSize: 11, color: 'var(--a-text-4)', marginTop: 4, maxWidth: 140 }} title={req.admin_note}>
                                                            📝 {req.admin_note.slice(0, 30)}{req.admin_note.length > 30 ? '…' : ''}
                                                        </div>
                                                    )}
                                                </td>
                                                <td style={{ padding: '12px 14px', color: 'var(--a-text-4)', whiteSpace: 'nowrap', fontSize: 11 }}>
                                                    {new Date(req.created_at).toLocaleDateString('ar-EG')}
                                                </td>
                                                <td style={{ padding: '12px 14px' }}>
                                                    {req.status === 'pending' ? (
                                                        <div style={{ display: 'flex', gap: 6 }}>
                                                            <ActionBtn color="#059669" onClick={() => openModal(req, 'approve')}>✓ قبول</ActionBtn>
                                                            <ActionBtn color="#DC2626" onClick={() => openModal(req, 'reject')}>✕ رفض</ActionBtn>
                                                        </div>
                                                    ) : (
                                                        <span style={{ color: 'var(--a-text-4)', fontSize: 12 }}>تمت المراجعة</span>
                                                    )}
                                                </td>
                                            </tr>
                                        );
                                    })}
                                </tbody>
                            </table>
                        </div>
                    </div>
                )}
            </div>

            {/* Review Modal */}
            {reviewModal && (
                <div style={{
                    position: 'fixed', inset: 0,
                    background: dark ? 'rgba(0,0,0,.7)' : 'rgba(0,0,0,.55)',
                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                    zIndex: 9999, padding: 20,
                }} onClick={closeModal}>
                    <div style={{
                        background: 'var(--a-card)',
                        border: '1px solid var(--a-border)',
                        borderRadius: 16, padding: '28px 28px 24px',
                        width: '100%', maxWidth: 440, direction: 'rtl',
                        fontFamily: "'Cairo',sans-serif",
                        boxShadow: dark ? '0 24px 80px rgba(0,0,0,.6)' : '0 24px 80px rgba(0,0,0,.2)',
                    }} onClick={e => e.stopPropagation()}>
                        <h3 style={{ fontSize: 17, fontWeight: 800, marginBottom: 6, color: 'var(--a-text)' }}>
                            {reviewModal.action === 'approve' ? '✅ تأكيد الموافقة' : '❌ تأكيد الرفض'}
                        </h3>
                        <p style={{ fontSize: 13, color: 'var(--a-text-3)', marginBottom: 18 }}>
                            الطالب: <strong style={{ color: 'var(--a-text)' }}>{reviewModal.req.student?.name}</strong>
                            {' — '}الوحدة: <strong style={{ color: 'var(--a-text)' }}>{reviewModal.req.unit?.title}</strong>
                        </p>
                        <label style={{ display: 'block', fontSize: 13, fontWeight: 700, marginBottom: 6, color: 'var(--a-text-2)' }}>
                            ملاحظة (اختياري)
                        </label>
                        <textarea
                            value={note}
                            onChange={e => setNote(e.target.value)}
                            rows={3}
                            placeholder="سبب الرفض أو أي ملاحظة للطالب..."
                            style={{
                                width: '100%', boxSizing: 'border-box',
                                border: '1.5px solid var(--a-input-b)',
                                borderRadius: 8, padding: '10px 12px', fontSize: 13,
                                fontFamily: "'Cairo',sans-serif", resize: 'vertical', outline: 'none',
                                background: 'var(--a-input)', color: 'var(--a-text)',
                            }}
                            onFocus={e => e.target.style.borderColor = '#2fbcd4'}
                            onBlur={e  => e.target.style.borderColor = 'var(--a-input-b)'}
                        />
                        <div style={{ display: 'flex', gap: 10, marginTop: 18, justifyContent: 'flex-end' }}>
                            <button onClick={closeModal} style={{
                                padding: '9px 20px', borderRadius: 8,
                                border: '1px solid var(--a-cancel-border)',
                                background: 'var(--a-cancel-bg)',
                                color: 'var(--a-cancel-text)',
                                cursor: 'pointer', fontFamily: "'Cairo',sans-serif", fontWeight: 700,
                            }}>
                                إلغاء
                            </button>
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
        </AdminLayout>
    );
}

function ActionBtn({ color, onClick, children }) {
    return (
        <button onClick={onClick}
            style={{
                padding: '7px 14px', borderRadius: 999, border: 'none',
                background: BRAND_GRAD, color: '#fff', fontWeight: 700, fontSize: 12,
                cursor: 'pointer', fontFamily: "'Cairo',sans-serif", transition: 'all .15s',
                whiteSpace: 'nowrap', boxShadow: 'var(--brand-cta-shadow)',
            }}
            onMouseEnter={e => { e.currentTarget.style.transform = 'translateY(-1px)'; }}
            onMouseLeave={e => { e.currentTarget.style.transform = 'translateY(0)'; }}
        >
            {children}
        </button>
    );
}
