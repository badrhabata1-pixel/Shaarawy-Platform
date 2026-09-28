import React, { useState } from 'react';
import AdminTable, { Badge, AvatarCell, imgUrl } from '@/Components/Admin/AdminTable';

export default function Index({ classes }) {
    return (
        <AdminTable
            title="الصفوف الدراسية"
            description="إدارة الصفوف الدراسية والسنوات الأكاديمية"
            createLink="/admin/classes/create"
            createLabel="إضافة صف جديد"
            rows={classes}
            searchKeys={['name', 'description']}
            searchPlaceholder="بحث في الصفوف..."
            total={classes.length}
            columns={[
                {
                    key: 'image',
                    label: 'الصورة',
                    render: row =>
                        row.image
                            ? <img src={`/storage/${row.image}`} className="w-12 h-12 rounded-xl object-cover" alt={row.name} />
                            : <div className="w-12 h-12 rounded-xl flex items-center justify-center text-2xl" style={{ background: '#1F5A4518' }}>📚</div>,
                },
                {
                    key: 'name',
                    label: 'اسم الصف',
                    render: row => <span className="font-bold" style={{ color: '#0E3A2E' }}>{row.name}</span>,
                },
                {
                    key: 'price',
                    label: 'السعر',
                    render: row => <Badge label={`${Number(row.price).toLocaleString('ar-EG')} ج.م`} color="orange" />,
                },
                {
                    key: 'level',
                    label: 'المستوى',
                    render: row => row.level ? <Badge label={row.level} color="navy" /> : '—',
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
            editRoute={row => `/admin/classes/${row.id}/edit`}
            deleteRoute={row => `/admin/classes/${row.id}`}
            deleteMessage="سيتم حذف هذا الصف وجميع الوحدات والدروس المرتبطة به."
        />
    );
}
