import React, { useState, useEffect } from 'react';
import AdminLayout from '@/Layouts/AdminLayout';
import { router } from '@inertiajs/react';

function useAdminDark() {
    const [dark, setDark] = useState(() => {
        try { return localStorage.getItem('adminTheme') === 'dark'; } catch { return false; }
    });
    useEffect(() => {
        const el = document.querySelector('[data-theme]');
        if (!el) return;
        const sync = () => setDark(el.getAttribute('data-theme') === 'dark');
        sync();
        const obs = new MutationObserver(sync);
        obs.observe(el, { attributes: true, attributeFilter: ['data-theme'] });
        return () => obs.disconnect();
    }, []);
    return dark;
}

const STATUS_UI = {
    pending:  { label: 'قيد المراجعة', bg: 'rgba(245,158,11,0.12)', bgLight: '#FEF3C7', fg: '#92400E', fgDark: '#FCD34D' },
    accepted: { label: 'مقبول',        bg: 'rgba(16,185,129,0.12)', bgLight: '#D1FAE5', fg: '#065F46', fgDark: '#34D399' },
    rejected: { label: 'مرفوض',        bg: 'rgba(239,68,68,0.12)',  bgLight: '#FEE2E2', fg: '#991B1B', fgDark: '#F87171' },
};

function StatusBadge({ status, dark }) {
    const s = STATUS_UI[status] || STATUS_UI.pending;
    return (
        <span
            className="text-xs px-2.5 py-1 rounded-full font-bold"
            style={{ background: dark ? s.bg : s.bgLight, color: dark ? s.fgDark : s.fg }}
        >
            {s.label}
        </span>
    );
}

function DetailRow({ label, value, dark }) {
    if (!value) return null;
    return (
        <div className="flex items-center justify-between gap-4 py-2.5" style={{ borderBottom: '1px solid var(--a-border)' }}>
            <span style={{ color: 'var(--a-text-3)', fontSize: '0.8rem', fontWeight: 700 }}>{label}</span>
            <span style={{ color: 'var(--a-text)', fontSize: '0.875rem', fontWeight: 700 }}>{value}</span>
        </div>
    );
}

function DetailSection({ icon, title, children, dark }) {
    return (
        <div className="mb-5">
            <div className="flex items-center gap-2 mb-1.5">
                <span style={{ fontSize: 15 }}>{icon}</span>
                <span style={{ color: dark ? '#94a3b8' : '#0E3A2E', fontSize: '0.8rem', fontWeight: 800, letterSpacing: '.02em' }}>{title}</span>
            </div>
            <div className="rounded-xl px-4" style={{ background: dark ? 'var(--a-card-2)' : '#f8fafc' }}>
                {children}
            </div>
        </div>
    );
}

function BookingDetailModal({ booking, dark, onClose }) {
    if (!booking) return null;
    const b = booking;

    return (
        <div
            className="fixed inset-0 flex items-center justify-center p-4"
            style={{ background: 'rgba(5,10,20,.6)', backdropFilter: 'blur(4px)', zIndex: 100 }}
            onClick={onClose}
        >
            <div
                dir="rtl"
                className="w-full rounded-2xl overflow-hidden"
                style={{ maxWidth: 480, maxHeight: '88vh', background: 'var(--a-card)', border: '1px solid var(--a-border)', boxShadow: '0 30px 90px rgba(0,0,0,.5)', display: 'flex', flexDirection: 'column' }}
                onClick={e => e.stopPropagation()}
            >
                {/* Header */}
                <div className="flex items-center justify-between px-6 py-5 flex-shrink-0" style={{ borderBottom: '1px solid var(--a-border)' }}>
                    <div className="flex items-center gap-3">
                        <div
                            className="w-11 h-11 rounded-full flex items-center justify-center text-lg font-bold flex-shrink-0"
                            style={{ background: dark ? 'rgba(226,232,240,0.15)' : '#0E3A2E', color: '#94a3b8' }}
                        >
                            {b.name?.charAt(0) || '؟'}
                        </div>
                        <div>
                            <p className="font-bold text-base" style={{ color: 'var(--a-text)' }}>{b.name}</p>
                            <StatusBadge status={b.status} dark={dark} />
                        </div>
                    </div>
                    <button
                        onClick={onClose}
                        className="w-8 h-8 rounded-lg flex items-center justify-center flex-shrink-0 transition hover:opacity-80"
                        style={{ background: dark ? 'rgba(226,232,240,0.1)' : '#f1f5f9', color: 'var(--a-text-3)', fontSize: 16, border: 'none', cursor: 'pointer' }}
                    >✕</button>
                </div>

                {/* Body */}
                <div className="px-6 py-5 overflow-y-auto">
                    <DetailSection icon="🧑‍🎓" title="بيانات الطالب الأساسية" dark={dark}>
                        <DetailRow label="الاسم" value={b.name} dark={dark} />
                        <DetailRow label="رقم الهاتف" value={b.phone} dark={dark} />
                        <DetailRow label="المدرسة" value={b.school} dark={dark} />
                        <DetailRow label="العنوان" value={b.address} dark={dark} />
                    </DetailSection>

                    <DetailSection icon="👪" title="بيانات ولي الأمر" dark={dark}>
                        <DetailRow label="الاسم" value={b.parent_name} dark={dark} />
                        <DetailRow label="رقم الهاتف" value={b.parent_phone} dark={dark} />
                        <DetailRow label="الوظيفة" value={b.parent_job} dark={dark} />
                    </DetailSection>

                    <DetailSection icon="📋" title="بيانات الحجز" dark={dark}>
                        <DetailRow label="المجموعة الدراسية" value={b.group?.name} dark={dark} />
                        <DetailRow label="الجنس" value={b.gender === 'male' ? 'ذكر' : b.gender === 'female' ? 'أنثى' : null} dark={dark} />
                        <DetailRow label="تاريخ الطلب" value={b.created_at ? new Date(b.created_at).toLocaleDateString('ar-EG') : null} dark={dark} />
                    </DetailSection>
                </div>

                {/* Actions */}
                <div className="flex gap-3 px-6 py-4 flex-shrink-0" style={{ borderTop: '1px solid var(--a-border)' }}>
                    {b.status === 'pending' && (
                        <>
                            <button
                                onClick={() => { router.post(`/admin/booking-requests/${b.id}/accept`); onClose(); }}
                                className="flex-1 py-2.5 rounded-xl text-sm font-bold transition hover:opacity-90"
                                style={{ background: '#10B981', color: '#fff', border: 'none', cursor: 'pointer' }}
                            >✓ قبول الطلب</button>
                            <button
                                onClick={() => { router.post(`/admin/booking-requests/${b.id}/reject`); onClose(); }}
                                className="flex-1 py-2.5 rounded-xl text-sm font-bold transition hover:opacity-90"
                                style={{ background: '#EF4444', color: '#fff', border: 'none', cursor: 'pointer' }}
                            >✕ رفض الطلب</button>
                        </>
                    )}
                    <button
                        onClick={() => {
                            if (confirm(`متأكد إنك عايز تحذف طلب "${b.name}"؟ الإجراء ده مش هيتراجع.`)) {
                                router.delete(`/admin/booking-requests/${b.id}`);
                                onClose();
                            }
                        }}
                        className="py-2.5 px-4 rounded-xl text-sm font-bold transition hover:opacity-90"
                        style={{ background: dark ? 'rgba(239,68,68,0.14)' : '#FEE2E2', color: '#EF4444', border: 'none', cursor: 'pointer', flexShrink: 0 }}
                    >🗑 حذف</button>
                </div>
            </div>
        </div>
    );
}

const FILTERS = [
    { key: 'all',      label: 'الكل' },
    { key: 'pending',  label: 'قيد المراجعة' },
    { key: 'accepted', label: 'مقبولة' },
    { key: 'rejected', label: 'مرفوضة' },
];

export default function Index({ bookings }) {
    const dark = useAdminDark();
    const pendingCount = bookings.filter(b => b.status === 'pending').length;
    const [selected, setSelected] = useState(null);
    const [activeFilter, setActiveFilter] = useState('all');

    const filteredBookings = activeFilter === 'all'
        ? bookings
        : bookings.filter(b => b.status === activeFilter);

    const handleDelete = (b) => {
        if (confirm(`متأكد إنك عايز تحذف طلب "${b.name}"؟ الإجراء ده مش هيتراجع.`)) {
            router.delete(`/admin/booking-requests/${b.id}`);
        }
    };

    return (
        <AdminLayout title="طلبات الحجز">
            <div dir="rtl" style={{ fontFamily: 'Cairo, sans-serif' }}>
                {/* Header */}
                <div className="mb-8">
                    <h1 className="text-2xl font-bold" style={{ color: 'var(--a-text)' }}>
                        طلبات الحجز
                    </h1>
                    <p style={{ color: 'var(--a-text-3)', fontSize: '0.875rem', marginTop: '0.25rem' }}>
                        الطلبات الواردة من صفحة حجز المقاعد العامة — اضغط "عرض التفاصيل" لمراجعة بيانات الطالب كاملة
                    </p>
                </div>

                {/* Stats badge */}
                <div
                    className="inline-flex items-center gap-2 px-4 py-2 rounded-xl mb-6 text-sm font-bold"
                    style={{
                        background: dark ? 'rgba(245,158,11,0.12)' : '#FEF3C7',
                        color: dark ? '#FCD34D' : '#92400E',
                        border: `1px solid ${dark ? 'rgba(245,158,11,0.3)' : '#F59E0B'}`,
                    }}
                >
                    <span>⏳</span>
                    <span>{pendingCount} طلب قيد المراجعة</span>
                </div>

                {/* Filter tabs */}
                <div className="flex gap-2 flex-wrap mb-6">
                    {FILTERS.map(f => {
                        const count = f.key === 'all' ? bookings.length : bookings.filter(b => b.status === f.key).length;
                        const active = activeFilter === f.key;
                        return (
                            <button
                                key={f.key}
                                onClick={() => setActiveFilter(f.key)}
                                className="px-4 py-2 rounded-xl text-sm font-bold transition"
                                style={{
                                    background: active ? '#1F5A45' : (dark ? 'var(--a-card-2)' : '#f1f5f9'),
                                    color: active ? '#1A1A1A' : 'var(--a-text-3)',
                                    border: `1px solid ${active ? '#1F5A45' : 'var(--a-border)'}`,
                                    cursor: 'pointer',
                                }}
                            >
                                {f.label} <span style={{ opacity: .75 }}>({count})</span>
                            </button>
                        );
                    })}
                </div>

                {filteredBookings.length === 0 ? (
                    <div
                        className="rounded-2xl p-16 text-center"
                        style={{
                            background: dark ? 'var(--a-card-2)' : '#f4f6f9',
                            border: `2px dashed ${dark ? 'var(--a-border)' : '#94a3b8'}`,
                        }}
                    >
                        <div className="text-5xl mb-4">📭</div>
                        <p className="text-lg font-bold" style={{ color: 'var(--a-text)' }}>
                            {activeFilter === 'all' ? 'لا توجد طلبات حجز حتى الآن' : 'لا توجد طلبات بهذه الحالة'}
                        </p>
                        <p style={{ color: 'var(--a-text-3)', fontSize: '0.875rem', marginTop: '0.25rem' }}>
                            {activeFilter === 'all' ? 'هتظهر هنا أي طلبات جديدة تتبعت من صفحة الحجز العامة' : 'جرب فلتر تاني من فوق'}
                        </p>
                    </div>
                ) : (
                    <div className="grid gap-3">
                        {filteredBookings.map(b => (
                            <div
                                key={b.id}
                                className="rounded-2xl px-5 py-4 flex items-center justify-between gap-4 flex-wrap"
                                style={{
                                    background: 'var(--a-card)',
                                    boxShadow: dark ? '0 2px 12px rgba(0,0,0,0.3)' : '0 2px 12px rgba(14,58,46,0.07)',
                                    border: '1px solid var(--a-border)',
                                }}
                            >
                                {/* Summary */}
                                <div className="flex items-center gap-4 min-w-0">
                                    <div
                                        className="w-11 h-11 rounded-full flex items-center justify-center text-lg font-bold flex-shrink-0"
                                        style={{ background: dark ? 'rgba(226,232,240,0.15)' : '#0E3A2E', color: '#94a3b8' }}
                                    >
                                        {b.name?.charAt(0) || '؟'}
                                    </div>
                                    <div className="min-w-0">
                                        <div className="flex items-center gap-2 flex-wrap">
                                            <p className="font-bold text-base truncate" style={{ color: 'var(--a-text)' }}>
                                                {b.name}
                                            </p>
                                            <StatusBadge status={b.status} dark={dark} />
                                        </div>
                                        <div className="flex gap-3 mt-1 flex-wrap items-center">
                                            {b.phone && (
                                                <span style={{ color: 'var(--a-text-3)', fontSize: '0.8rem' }}>📞 {b.phone}</span>
                                            )}
                                            {b.group?.name && (
                                                <span style={{ color: 'var(--a-text-4)', fontSize: '0.75rem' }}>{b.group.name}</span>
                                            )}
                                            {b.created_at && (
                                                <span style={{ color: 'var(--a-text-4)', fontSize: '0.75rem' }}>
                                                    📅 {new Date(b.created_at).toLocaleDateString('ar-EG')}
                                                </span>
                                            )}
                                        </div>
                                    </div>
                                </div>

                                {/* Actions */}
                                <div className="flex gap-2 flex-shrink-0">
                                    <button
                                        onClick={() => setSelected(b)}
                                        className="px-4 py-2 rounded-xl text-sm font-bold transition hover:opacity-80 flex items-center gap-1.5"
                                        style={{ background: dark ? 'rgba(31,90,69,0.14)' : 'rgba(31,90,69,0.1)', color: '#1F5A45', border: 'none', cursor: 'pointer' }}
                                    >
                                        👁 عرض التفاصيل
                                    </button>
                                    {b.status === 'pending' && (
                                        <>
                                            <button
                                                onClick={() => router.post(`/admin/booking-requests/${b.id}/accept`)}
                                                className="px-4 py-2 rounded-xl text-sm font-bold transition hover:opacity-90"
                                                style={{ background: '#10B981', color: '#fff', border: 'none', cursor: 'pointer' }}
                                            >
                                                ✓ قبول
                                            </button>
                                            <button
                                                onClick={() => router.post(`/admin/booking-requests/${b.id}/reject`)}
                                                className="px-4 py-2 rounded-xl text-sm font-bold transition hover:opacity-90"
                                                style={{ background: '#EF4444', color: '#fff', border: 'none', cursor: 'pointer' }}
                                            >
                                                ✕ رفض
                                            </button>
                                        </>
                                    )}
                                    <button
                                        onClick={() => handleDelete(b)}
                                        className="px-4 py-2 rounded-xl text-sm font-bold transition hover:opacity-90"
                                        style={{ background: dark ? 'rgba(239,68,68,0.14)' : '#FEE2E2', color: '#EF4444', border: 'none', cursor: 'pointer' }}
                                    >
                                        🗑 حذف
                                    </button>
                                </div>
                            </div>
                        ))}
                    </div>
                )}
            </div>

            <BookingDetailModal booking={selected} dark={dark} onClose={() => setSelected(null)} />
        </AdminLayout>
    );
}
