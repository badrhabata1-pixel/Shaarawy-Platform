import React, { useState } from 'react';
import AdminTable, { Badge, AvatarCell, imgUrl } from '@/Components/Admin/AdminTable';

export default function Index({ exams }) {
    return (
        <AdminTable
            title="الامتحانات"
            description="إدارة الامتحانات والأسئلة"
            createLink="/admin/exams/create"
            createLabel="إضافة امتحان جديد"
            rows={exams}
            searchKeys={['title']}
            searchPlaceholder="بحث في الامتحانات..."
            total={exams.length}
            columns={[
                {
                    key: 'title',
                    label: 'عنوان الامتحان',
                    render: row => <span className="font-bold" style={{ color: '#0E3A2E' }}>{row.title}</span>,
                },
                {
                    key: 'lesson',
                    label: 'الدرس',
                    render: row => row.lesson?.title
                        ? <Badge label={row.lesson.title} color="navy" />
                        : '—',
                },
                {
                    key: 'duration',
                    label: 'المدة',
                    center: true,
                    render: row => row.duration
                        ? (
                            <span className="text-sm font-bold" style={{ color: '#0E3A2E' }}>
                                {row.duration} دقيقة
                            </span>
                        )
                        : '—',
                },
                {
                    key: 'pass_score',
                    label: 'درجة النجاح',
                    center: true,
                    render: row => row.pass_score
                        ? <Badge label={`${row.pass_score}%`} color="orange" />
                        : '—',
                },
                {
                    key: 'questions_count',
                    label: 'عدد الأسئلة',
                    center: true,
                    render: row => (
                        <Badge
                            label={`${row.questions_count || 0} سؤال`}
                            color="gold"
                        />
                    ),
                },
            ]}
            editRoute={row => `/admin/exams/${row.id}/edit`}
            deleteRoute={row => `/admin/exams/${row.id}`}
            deleteMessage="سيتم حذف هذا الامتحان وجميع الأسئلة المرتبطة به."
        />
    );
}
