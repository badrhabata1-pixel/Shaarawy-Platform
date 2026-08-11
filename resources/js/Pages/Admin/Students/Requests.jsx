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

export default function Requests({ students }) {
    const dark = useAdminDark();

    return (
        <AdminLayout title="طلبات الانضمام">
            <div dir="rtl" style={{ fontFamily: 'Cairo, sans-serif' }}>
                {/* Header */}
                <div className="mb-8">
                    <h1
                        className="text-2xl font-bold"
                        style={{ color: 'var(--a-text)' }}
                    >
                        طلبات الانضمام
                    </h1>
                    <p style={{ color: 'var(--a-text-3)', fontSize: '0.875rem', marginTop: '0.25rem' }}>
                        مراجعة وقبول أو رفض طلبات الطلاب الجدد
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
                    <span>{students.length} طلب معلّق</span>
                </div>

                {students.length === 0 ? (
                    <div
                        className="rounded-2xl p-16 text-center"
                        style={{
                            background: dark ? 'var(--a-card-2)' : '#f4f6f9',
                            border: `2px dashed ${dark ? 'var(--a-border)' : '#94a3b8'}`,
                        }}
                    >
                        <div className="text-5xl mb-4">✅</div>
                        <p
                            className="text-lg font-bold"
                            style={{ color: 'var(--a-text)' }}
                        >
                            لا توجد طلبات معلّقة
                        </p>
                        <p style={{ color: 'var(--a-text-3)', fontSize: '0.875rem', marginTop: '0.25rem' }}>
                            جميع الطلبات تمت مراجعتها
                        </p>
                    </div>
                ) : (
                    <div className="grid gap-4">
                        {students.map(s => (
                            <div
                                key={s.id}
                                className="rounded-2xl p-6 flex items-center justify-between gap-4"
                                style={{
                                    background: 'var(--a-card)',
                                    boxShadow: dark
                                        ? '0 2px 12px rgba(0,0,0,0.3)'
                                        : '0 2px 12px rgba(27,58,96,0.07)',
                                    border: '1px solid var(--a-border)',
                                }}
                            >
                                {/* Student Info */}
                                <div className="flex items-center gap-4">
                                    <div
                                        className="w-12 h-12 rounded-full flex items-center justify-center text-xl font-bold flex-shrink-0"
                                        style={{
                                            background: dark ? 'rgba(226,232,240,0.15)' : '#1b3a60',
                                            color: '#94a3b8',
                                        }}
                                    >
                                        {s.name?.charAt(0) || '؟'}
                                    </div>
                                    <div>
                                        <p
                                            className="font-bold text-base"
                                            style={{ color: 'var(--a-text)' }}
                                        >
                                            {s.name}
                                        </p>
                                        <p style={{ color: 'var(--a-text-3)', fontSize: '0.875rem' }}>
                                            {s.email}
                                        </p>
                                        <div className="flex gap-2 mt-1 flex-wrap">
                                            {s.phone && (
                                                <span style={{ color: 'var(--a-text-4)', fontSize: '0.75rem' }}>
                                                    📞 {s.phone}
                                                </span>
                                            )}
                                            {s.academic_year?.name && (
                                                <span
                                                    className="text-xs px-2 py-0.5 rounded-full font-bold"
                                                    style={{
                                                        background: dark
                                                            ? 'rgba(226,232,240,0.12)'
                                                            : 'rgba(27,58,96,0.08)',
                                                        color: dark ? '#94a3b8' : '#1b3a60',
                                                    }}
                                                >
                                                    {s.academic_year.name}
                                                </span>
                                            )}
                                            {s.student_type && (
                                                <span
                                                    className="text-xs px-2 py-0.5 rounded-full font-bold"
                                                    style={{
                                                        background: dark
                                                            ? 'rgba(47,188,212,0.15)'
                                                            : 'rgba(47,188,212,0.1)',
                                                        color: '#2fbcd4',
                                                    }}
                                                >
                                                    {s.student_type === 'online' ? 'أونلاين' : 'سنتر'}
                                                </span>
                                            )}
                                            {s.created_at && (
                                                <span style={{ color: 'var(--a-text-4)', fontSize: '0.75rem' }}>
                                                    📅 {new Date(s.created_at).toLocaleDateString('ar-EG')}
                                                </span>
                                            )}
                                        </div>
                                    </div>
                                </div>

                                {/* Actions */}
                                <div className="flex gap-2 flex-shrink-0">
                                    <button
                                        onClick={() => router.post(`/admin/student-requests/${s.id}/approve`)}
                                        className="px-4 py-2 rounded-xl text-sm font-bold transition hover:opacity-90"
                                        style={{ background: '#10B981', color: '#fff' }}
                                    >
                                        ✓ قبول
                                    </button>
                                    <button
                                        onClick={() => router.post(`/admin/student-requests/${s.id}/reject`)}
                                        className="px-4 py-2 rounded-xl text-sm font-bold transition hover:opacity-90"
                                        style={{ background: '#EF4444', color: '#fff' }}
                                    >
                                        ✕ رفض
                                    </button>
                                </div>
                            </div>
                        ))}
                    </div>
                )}
            </div>
        </AdminLayout>
    );
}
