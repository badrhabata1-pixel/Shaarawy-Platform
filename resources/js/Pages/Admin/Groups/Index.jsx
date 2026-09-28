import React, { useState } from 'react';
import AdminTable, { Badge, AvatarCell, imgUrl } from '@/Components/Admin/AdminTable';

export default function Index({ groups, academicYears }) {
    return (
        <AdminTable
            title="المجموعات"
            description="إدارة مجموعات الطلاب والجداول"
            createLink="/admin/groups/create"
            createLabel="إضافة مجموعة جديدة"
            rows={groups}
            searchKeys={['name', 'description']}
            searchPlaceholder="بحث في المجموعات..."
            total={groups.length}
            filters={[
                {
                    key: 'academic_year_id',
                    label: 'الصف',
                    options: academicYears.map(y => ({ value: y.id, label: y.name })),
                },
            ]}
            columns={[
                {
                    key: 'name',
                    label: 'اسم المجموعة',
                    render: row => <span className="font-bold" style={{ color: '#0E3A2E' }}>{row.name}</span>,
                },
                {
                    key: 'academic_year',
                    label: 'الصف',
                    render: row => row.academic_year?.name
                        ? <Badge label={row.academic_year.name} color="navy" />
                        : '—',
                },
                {
                    key: 'attendance_type',
                    label: 'النوع',
                    render: row => {
                        const typeMap = { online: 'أونلاين', offline: 'سنتر', both: 'مختلط' };
                        const colorMap = { online: 'orange', offline: 'navy', both: 'gold' };
                        return row.attendance_type
                            ? <Badge label={typeMap[row.attendance_type] || row.attendance_type} color={colorMap[row.attendance_type] || 'gray'} />
                            : '—';
                    },
                },
                {
                    key: 'hour',
                    label: 'الوقت',
                    render: row => row.hour
                        ? <span className="text-sm font-bold" style={{ color: '#1F5A45' }}>{row.hour}</span>
                        : '—',
                },
                {
                    key: 'start_date',
                    label: 'تاريخ البدء',
                    render: row => row.start_date
                        ? <span className="text-sm text-gray-600">{new Date(row.start_date).toLocaleDateString('ar-EG')}</span>
                        : '—',
                },
                {
                    key: 'end_date',
                    label: 'تاريخ الانتهاء',
                    render: row => row.end_date
                        ? <span className="text-sm text-gray-600">{new Date(row.end_date).toLocaleDateString('ar-EG')}</span>
                        : '—',
                },
            ]}
            editRoute={row => `/admin/groups/${row.id}/edit`}
            deleteRoute={row => `/admin/groups/${row.id}`}
            deleteMessage="سيتم حذف هذه المجموعة وجميع الحجوزات المرتبطة بها."
        />
    );
}
