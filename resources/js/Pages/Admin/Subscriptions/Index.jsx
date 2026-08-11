import React, { useState } from 'react';
import AdminTable, { Badge, AvatarCell, imgUrl } from '@/Components/Admin/AdminTable';
import { router } from '@inertiajs/react';

export default function Index({ subscriptions }) {
    return (
        <AdminTable
            title="الاشتراكات"
            description="إدارة اشتراكات الطلاب في الوحدات والدروس"
            createLink="/admin/subscriptions/create"
            createLabel="إضافة اشتراك"
            rows={subscriptions}
            searchKeys={['student.name']}
            searchPlaceholder="بحث في الاشتراكات..."
            total={subscriptions.length}
            filters={[
                {
                    key: 'status',
                    label: 'الحالة',
                    options: [
                        { value: 'pending', label: 'معلّق' },
                        { value: 'active', label: 'مفعّل' },
                        { value: 'rejected', label: 'مرفوض' },
                    ],
                },
            ]}
            columns={[
                {
                    key: 'student',
                    label: 'الطالب',
                    render: row => row.student?.name
                        ? <AvatarCell name={row.student.name} />
                        : '—',
                },
                {
                    key: 'type',
                    label: 'النوع',
                    render: row => {
                        if (row.unit_id) return <Badge label="وحدة" color="navy" />;
                        if (row.lesson_id) return <Badge label="درس" color="gold" />;
                        return '—';
                    },
                },
                {
                    key: 'price',
                    label: 'السعر',
                    render: row => <Badge label={`${Number(row.price || 0).toLocaleString('ar-EG')} ج.م`} color="orange" />,
                },
                {
                    key: 'status',
                    label: 'الحالة',
                    center: true,
                    render: row => {
                        const statusMap = {
                            active: { label: 'مفعّل', color: 'green' },
                            pending: { label: 'معلّق', color: 'yellow' },
                            rejected: { label: 'مرفوض', color: 'red' },
                        };
                        const s = statusMap[row.status] || { label: row.status, color: 'gray' };
                        return <Badge label={s.label} color={s.color} />;
                    },
                },
                {
                    key: 'payment_proof',
                    label: 'إيصال الدفع',
                    center: true,
                    render: row => row.payment_proof
                        ? (
                            <a href={`/storage/${row.payment_proof}`} target="_blank" rel="noreferrer">
                                <img
                                    src={`/storage/${row.payment_proof}`}
                                    alt="إيصال"
                                    className="w-10 h-10 rounded-lg object-cover border cursor-pointer hover:opacity-80"
                                    style={{ borderColor: '#94a3b8' }}
                                />
                            </a>
                        )
                        : <span className="text-gray-300 text-xs">لا يوجد</span>,
                },
            ]}
            editRoute={row => `/admin/subscriptions/${row.id}/edit`}
            deleteRoute={row => `/admin/subscriptions/${row.id}`}
            deleteMessage="سيتم حذف هذا الاشتراك."
            extraActions={row => row.status === 'pending' ? (
                <div className="flex gap-1">
                    <button
                        onClick={() => router.post(`/admin/subscriptions/${row.id}/approve`)}
                        className="px-3 py-1 rounded-lg text-xs font-bold"
                        style={{ background: '#10B981', color: '#fff' }}
                    >
                        قبول
                    </button>
                    <button
                        onClick={() => router.post(`/admin/subscriptions/${row.id}/reject`)}
                        className="px-3 py-1 rounded-lg text-xs font-bold"
                        style={{ background: '#EF4444', color: '#fff' }}
                    >
                        رفض
                    </button>
                </div>
            ) : null}
        />
    );
}
