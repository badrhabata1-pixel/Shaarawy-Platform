import React, { useState } from 'react';
import AdminTable, { Badge, AvatarCell, imgUrl } from '@/Components/Admin/AdminTable';

export default function Index({ sheets, lessons }) {
    return (
        <AdminTable
            title="الشيتات"
            description="إدارة شيتات الأسئلة والملفات"
            createLink="/admin/sheets/create"
            createLabel="إضافة شيت جديد"
            rows={sheets}
            searchKeys={['title']}
            searchPlaceholder="بحث في الشيتات..."
            total={sheets.length}
            filters={[
                {
                    key: 'lesson_id',
                    label: 'الدرس',
                    options: lessons.map(l => ({ value: l.id, label: l.title })),
                },
            ]}
            columns={[
                {
                    key: 'title',
                    label: 'عنوان الشيت',
                    render: row => <span className="font-bold" style={{ color: '#1b3a60' }}>{row.title}</span>,
                },
                {
                    key: 'lesson',
                    label: 'الدرس',
                    render: row => row.lesson?.title
                        ? <Badge label={row.lesson.title} color="navy" />
                        : '—',
                },
                {
                    key: 'is_free',
                    label: 'النوع',
                    center: true,
                    render: row => row.is_free
                        ? <Badge label="مجاني" color="green" />
                        : <Badge label="مدفوع" color="orange" />,
                },
                {
                    key: 'pdf_file',
                    label: 'ملف PDF',
                    center: true,
                    render: row => row.pdf_file
                        ? (
                            <a
                                href={`/storage/${row.pdf_file}`}
                                target="_blank"
                                rel="noreferrer"
                                className="inline-flex items-center gap-1 px-3 py-1 rounded-lg text-xs font-bold"
                                style={{ background: '#2fbcd418', color: '#2fbcd4' }}
                            >
                                📄 عرض
                            </a>
                        )
                        : <span className="text-gray-300 text-xs">لا يوجد</span>,
                },
            ]}
            editRoute={row => `/admin/sheets/${row.id}/edit`}
            deleteRoute={row => `/admin/sheets/${row.id}`}
            deleteMessage="سيتم حذف هذا الشيت بشكل نهائي."
        />
    );
}
