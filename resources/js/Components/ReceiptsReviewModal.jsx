import { useEffect, useState } from 'react';
import { router } from '@inertiajs/react';

const O = '#2fbcd4';
const N = '#1b3a60';
const G = '#2fbcd4';

const STATUS_UI = {
    pending: { label: 'قيد المراجعة', c: O, bg: `${O}18` },
    accepted: { label: 'مقبول', c: '#059669', bg: '#05966918' },
    approved: { label: 'مقبول', c: '#059669', bg: '#05966918' },
    rejected: { label: 'مرفوض', c: '#DC2626', bg: '#DC262618' },
};

export function ReceiptsButton({ onClick, count = 0 }) {
    return (
        <button
            onClick={onClick}
            style={{
                position: 'relative',
                display: 'inline-flex',
                alignItems: 'center',
                gap: 8,
                background: N,
                color: '#fff',
                border: `1px solid ${G}40`,
                borderRadius: 12,
                padding: '10px 18px',
                fontSize: 13,
                fontWeight: 800,
                fontFamily: "'Cairo',sans-serif",
                cursor: 'pointer',
            }}
        >
            إيصالات الدفع
            {count > 0 && (
                <span style={{
                    background: O,
                    color: '#fff',
                    borderRadius: 99,
                    minWidth: 20,
                    height: 20,
                    display: 'inline-flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    fontSize: 11,
                    fontWeight: 900,
                    padding: '0 5px',
                }}>
                    {count}
                </span>
            )}
        </button>
    );
}

export default function ReceiptsReviewModal({ open, onClose, receipts = [], routePrefix = 'admin' }) {
    const [busyId, setBusyId] = useState(null);
    const [localReceipts, setLocalReceipts] = useState(receipts);

    useEffect(() => {
        setLocalReceipts(receipts);
    }, [receipts]);

    if (!open) return null;

    const act = (id, action) => {
        setBusyId(id);
        const routeName = `${routePrefix}.receipts.${action}`;

        router.post(route(routeName, id), {}, {
            preserveScroll: true,
            onSuccess: () => {
                setLocalReceipts(prev => prev.map(r =>
                    r.id === id ? { ...r, status: action === 'approve' ? 'approved' : 'rejected' } : r
                ));
                setBusyId(null);
            },
            onError: () => setBusyId(null),
        });
    };

    return (
        <div
            onClick={onClose}
            style={{
                position: 'fixed',
                inset: 0,
                zIndex: 1000,
                background: 'rgba(10,15,25,.6)',
                backdropFilter: 'blur(3px)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                padding: '2rem 1rem',
            }}
        >
            <div
                onClick={e => e.stopPropagation()}
                style={{
                    background: 'var(--a-card, var(--db-card, #fff))',
                    borderRadius: 20,
                    width: '100%',
                    maxWidth: 640,
                    maxHeight: '85vh',
                    overflow: 'hidden',
                    display: 'flex',
                    flexDirection: 'column',
                    border: `1px solid ${G}30`,
                    boxShadow: '0 30px 80px rgba(0,0,0,.4)',
                    direction: 'rtl',
                    fontFamily: "'Cairo',sans-serif",
                }}
            >
                <div style={{
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    padding: '1.25rem 1.5rem',
                    borderBottom: '1px solid var(--a-border, var(--db-rowbdr, #E2E8F0))',
                }}>
                    <h2 style={{ margin: 0, fontSize: 16, fontWeight: 900, color: 'var(--a-text, var(--db-text, #1b3a60))' }}>
                        إيصالات الدفع
                    </h2>
                    <button
                        onClick={onClose}
                        style={{
                            background: 'transparent',
                            border: 'none',
                            cursor: 'pointer',
                            fontSize: 18,
                            color: 'var(--a-text-4, var(--db-muted, #64748B))',
                        }}
                        aria-label="إغلاق"
                    >
                        ×
                    </button>
                </div>

                <div style={{ overflowY: 'auto', padding: '1.25rem 1.5rem', display: 'flex', flexDirection: 'column', gap: 12 }}>
                    {localReceipts.length === 0 && (
                        <div style={{ textAlign: 'center', color: 'var(--a-text-4, var(--db-muted, #64748B))', padding: '2.5rem 0', fontSize: 13 }}>
                            لا توجد إيصالات حالياً
                        </div>
                    )}

                    {localReceipts.map(r => {
                        const s = STATUS_UI[r.status] || STATUS_UI.pending;
                        const isBusy = busyId === r.id;

                        return (
                            <div key={r.id} style={{
                                border: '1px solid var(--a-border, var(--db-rowbdr, #E2E8F0))',
                                borderRadius: 14,
                                padding: '14px 16px',
                                background: 'var(--a-card-2, var(--db-row, #F8FAFC))',
                            }}>
                                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 10, marginBottom: 10 }}>
                                    <div style={{ minWidth: 0 }}>
                                        <div style={{ fontSize: 13.5, fontWeight: 800, color: 'var(--a-text, var(--db-text, #1b3a60))' }}>
                                            {r.student?.name || r.student_name || 'طالب غير معروف'}
                                        </div>
                                        <div style={{ fontSize: 12, color: 'var(--a-text-4, var(--db-muted, #64748B))', marginTop: 2 }}>
                                            {r.student?.phone || r.student_phone || '-'}
                                            {r.payment_method && (
                                                <> · {r.payment_method === 'vodafone_cash' ? 'فودافون كاش' : 'انستاباي'}</>
                                            )}
                                        </div>
                                    </div>
                                    <span style={{
                                        background: s.bg,
                                        color: s.c,
                                        borderRadius: 20,
                                        padding: '4px 12px',
                                        fontSize: 11,
                                        fontWeight: 800,
                                        whiteSpace: 'nowrap',
                                    }}>
                                        {s.label}
                                    </span>
                                </div>

                                {r.image_url && (
                                    <a href={r.image_url} target="_blank" rel="noreferrer" style={{ display: 'block', marginBottom: 10 }}>
                                        <img
                                            src={r.image_url}
                                            alt="إيصال التحويل"
                                            style={{
                                                width: '100%',
                                                maxHeight: 220,
                                                objectFit: 'cover',
                                                borderRadius: 10,
                                                border: '1px solid var(--a-border, var(--db-rowbdr, #E2E8F0))',
                                            }}
                                        />
                                    </a>
                                )}

                                {(r.submitted_at || r.created_at) && (
                                    <div style={{ fontSize: 11, color: 'var(--a-text-4, var(--db-muted, #64748B))', marginBottom: r.status === 'pending' ? 10 : 0 }}>
                                        {r.submitted_at || r.created_at}
                                    </div>
                                )}

                                {r.status === 'pending' && (
                                    <div style={{ display: 'flex', gap: 10 }}>
                                        <button
                                            disabled={isBusy}
                                            onClick={() => act(r.id, 'approve')}
                                            style={actionButtonStyle('#059669', isBusy)}
                                        >
                                            قبول
                                        </button>
                                        <button
                                            disabled={isBusy}
                                            onClick={() => act(r.id, 'reject')}
                                            style={actionButtonStyle('#DC2626', isBusy)}
                                        >
                                            رفض
                                        </button>
                                    </div>
                                )}
                            </div>
                        );
                    })}
                </div>
            </div>
        </div>
    );
}

function actionButtonStyle(background, isBusy) {
    return {
        flex: 1,
        padding: '9px 0',
        borderRadius: 9,
        border: 'none',
        cursor: isBusy ? 'default' : 'pointer',
        background,
        color: '#fff',
        fontSize: 12.5,
        fontWeight: 800,
        fontFamily: "'Cairo',sans-serif",
        opacity: isBusy ? .6 : 1,
    };
}
