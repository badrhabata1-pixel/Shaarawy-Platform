import React, { useState } from 'react';
import AdminTable, { Badge, AvatarCell, imgUrl } from '@/Components/Admin/AdminTable';

export default function Index({ lessons, units }) {
    return (
        <AdminTable
            title="الدروس"
            description="إدارة الدروس لكل وحدة دراسية"
            createLink="/admin/lessons/create"
            createLabel="إضافة درس جديد"
            rows={lessons}
            searchKeys={['title']}
            searchPlaceholder="بحث في الدروس..."
            total={lessons.length}
            filters={[
                {
                    key: 'unit_id',
                    label: 'الوحدة',
                    options: units.map(u => ({ value: u.id, label: u.title })),
                },
            ]}
            columns={[
                {
                    key: 'title',
                    label: 'عنوان الدرس',
                    render: row => (
                        <AvatarCell name={row.title} image={row.image} />
                    ),
                },
                {
                    key: 'unit',
                    label: 'الوحدة',
                    render: row => row.unit?.title
                        ? <Badge label={row.unit.title} color="navy" />
                        : '—',
                },
                {
                    key: 'class',
                    label: 'الصف',
                    render: row => row.unit?.academic_year?.name
                        ? <span className="text-sm text-[#475569] dark:text-[#CBD5E1]">{row.unit.academic_year.name}</span>
                        : '—',
                },
                {
                    key: 'lesson_number',
                    label: 'رقم الدرس',
                    center: true,
                    render: row => row.lesson_number
                        ? <Badge label={`#${row.lesson_number}`} color="gold" />
                        : '—',
                },
                {
                    key: 'duration_minutes',
                    label: 'المدة',
                    center: true,
                    render: row => row.duration_minutes
                        ? <span className="text-sm text-gray-600">{row.duration_minutes} دقيقة</span>
                        : '—',
                },
                {
                    key: 'is_published',
                    label: 'منشور',
                    center: true,
                    render: row => row.is_published
                        ? <Badge label="منشور" color="green" />
                        : <Badge label="مسودة" color="gray" />,
                },
                {
                    key: 'is_locked',
                    label: 'مقفل',
                    center: true,
                    render: row => row.is_locked
                        ? <Badge label="مقفل" color="red" />
                        : <Badge label="مفتوح" color="green" />,
                },
            ]}
            editRoute={row => `/admin/lessons/${row.id}/edit`}
            deleteRoute={row => `/admin/lessons/${row.id}`}
            deleteMessage="سيتم حذف هذا الدرس وجميع محتوياته."
        />
    );
}
