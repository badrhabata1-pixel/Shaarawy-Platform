import React, { useState } from 'react';
import AdminTable, { Badge, AvatarCell, imgUrl } from '@/Components/Admin/AdminTable';

export default function Index({ units, academicYears }) {
    return (
        <AdminTable
            title="الوحدات الدراسية"
            description="إدارة الوحدات الدراسية لكل صف"
            createLink="/admin/units/create"
            createLabel="إضافة وحدة جديدة"
            rows={units}
            searchKeys={['title', 'description']}
            searchPlaceholder="بحث في الوحدات..."
            total={units.length}
            filters={[
                {
                    key: 'academic_year_id',
                    label: 'الصف',
                    options: academicYears.map(y => ({ value: y.id, label: y.name })),
                },
            ]}
            columns={[
                {
                    key: 'title',
                    label: 'عنوان الوحدة',
                    render: row => <span className="font-bold" style={{ color: '#0E3A2E' }}>{row.title}</span>,
                },
                {
                    key: 'academic_year',
                    label: 'الصف الدراسي',
                    render: row => row.academic_year?.name
                        ? <Badge label={row.academic_year.name} color="navy" />
                        : '—',
                },
                {
                    key: 'term',
                    label: 'الفصل',
                    render: row => {
                        const termMap = { first: 'الفصل الأول', second: 'الفصل الثاني', summer: 'الصيف' };
                        return row.term ? <Badge label={termMap[row.term] || row.term} color="gold" /> : '—';
                    },
                },
                {
                    key: 'price',
                    label: 'السعر',
                    render: row => <Badge label={`${Number(row.price || 0).toLocaleString('ar-EG')} ج.م`} color="orange" />,
                },
                {
                    key: 'description',
                    label: 'الوصف',
                    render: row => (
                        <span className="text-gray-400 text-xs line-clamp-2" style={{ maxWidth: 200 }}>
                            {row.description || '—'}
                        </span>
                    ),
                },
            ]}
            editRoute={row => `/admin/units/${row.id}/edit`}
            deleteRoute={row => `/admin/units/${row.id}`}
            deleteMessage="سيتم حذف هذه الوحدة وجميع الدروس المرتبطة بها."
        />
    );
}
