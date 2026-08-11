import React, { useState } from 'react';
import AdminTable, { Badge, AvatarCell, imgUrl } from '@/Components/Admin/AdminTable';

export default function Index({ assistants }) {
    return (
        <AdminTable
            title="المساعدون"
            description="إدارة حسابات المساعدين والمعلمين"
            createLink="/admin/assistants/create"
            createLabel="إضافة مساعد جديد"
            rows={assistants}
            searchKeys={['name', 'email', 'phone']}
            searchPlaceholder="بحث في المساعدين..."
            total={assistants.length}
            columns={[
                {
                    key: 'name',
                    label: 'المساعد',
                    render: row => (
                        <AvatarCell
                            name={row.name}
                            image={row.image ? `/storage/${row.image}` : null}
                        />
                    ),
                },
                {
                    key: 'email',
                    label: 'البريد الإلكتروني',
                    render: row => <span className="text-sm text-gray-600">{row.email || '—'}</span>,
                },
                {
                    key: 'phone',
                    label: 'رقم الهاتف',
                    render: row => <span className="text-sm text-gray-600">{row.phone || '—'}</span>,
                },
                {
                    key: 'salary',
                    label: 'الراتب',
                    render: row => row.salary
                        ? <Badge label={`${Number(row.salary).toLocaleString('ar-EG')} ج.م`} color="orange" />
                        : '—',
                },
                {
                    key: 'role',
                    label: 'الدور',
                    render: row => {
                        const roleMap = { assistant: 'مساعد', teacher: 'معلم' };
                        return <Badge label={roleMap[row.role] || row.role || '—'} color="navy" />;
                    },
                },
            ]}
            editRoute={row => `/admin/assistants/${row.id}/edit`}
            deleteRoute={row => `/admin/assistants/${row.id}`}
            deleteMessage="سيتم حذف هذا المساعد من المنصة."
        />
    );
}
