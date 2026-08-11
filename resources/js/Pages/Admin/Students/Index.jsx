import React, { useState } from 'react';
import AdminTable, { Badge, AvatarCell, imgUrl } from '@/Components/Admin/AdminTable';
import { router } from '@inertiajs/react';

export default function Index({ students }) {
    return (
        <AdminTable
            title="الطلاب"
            description="إدارة حسابات الطلاب والاشتراكات"
            createLink="/admin/students/create"
            createLabel="إضافة طالب جديد"
            rows={students}
            searchKeys={['name', 'email', 'phone', 'governorate']}
            searchPlaceholder="بحث في الطلاب..."
            total={students.length}
            filters={[
                {
                    key: 'student_type',
                    label: 'النوع',
                    options: [
                        { value: 'online', label: 'أونلاين' },
                        { value: 'offline', label: 'سنتر' },
                    ],
                },
                {
                    key: 'is_active',
                    label: 'الحالة',
                    options: [
                        { value: '1', label: 'نشط' },
                        { value: '0', label: 'غير نشط' },
                    ],
                },
            ]}
            columns={[
                {
                    key: 'name',
                    label: 'الطالب',
                    render: row => (
                        <AvatarCell
                            name={row.name}
                            sub={row.email}
                            image={row.image ? `/storage/${row.image}` : null}
                        />
                    ),
                },
                {
                    key: 'academic_year',
                    label: 'الصف',
                    render: row => row.academic_year?.name
                        ? <Badge label={row.academic_year.name} color="navy" />
                        : '—',
                },
                {
                    key: 'group',
                    label: 'المجموعة',
                    render: row => row.group?.name
                        ? <Badge label={row.group.name} color="gold" />
                        : '—',
                },
                {
                    key: 'student_type',
                    label: 'النوع',
                    render: row => row.student_type === 'online'
                        ? <Badge label="أونلاين" color="orange" />
                        : <Badge label="سنتر" color="navy" />,
                },
                {
                    key: 'governorate',
                    label: 'المحافظة',
                    render: row => <span className="text-sm text-gray-600">{row.governorate || '—'}</span>,
                },
                {
                    key: 'is_active',
                    label: 'الحالة',
                    center: true,
                    render: row => row.is_active
                        ? <Badge label="نشط" color="green" />
                        : <Badge label="معلّق" color="yellow" />,
                },
            ]}
            editRoute={row => `/admin/students/${row.id}/edit`}
            deleteRoute={row => `/admin/students/${row.id}`}
            deleteMessage="سيتم حذف هذا الطالب وجميع بياناته."
            extraActions={row => (
                <button
                    onClick={() => router.post(`/admin/students/${row.id}/toggle-active`)}
                    className="px-3 py-1 rounded-lg text-xs font-bold transition"
                    style={{
                        background: row.is_active ? '#FEF3C7' : '#D1FAE5',
                        color: row.is_active ? '#92400E' : '#065F46',
                        border: `1px solid ${row.is_active ? '#F59E0B' : '#10B981'}`,
                    }}
                >
                    {row.is_active ? 'تعليق' : 'تفعيل'}
                </button>
            )}
        />
    );
}
