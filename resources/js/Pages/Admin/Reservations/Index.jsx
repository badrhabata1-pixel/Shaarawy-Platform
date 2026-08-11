import AdminTable, { Badge, AvatarCell } from '@/Components/Admin/AdminTable';

export default function Index({ reservations }) {
    return (
        <AdminTable
            title="الحجوزات"
            description="إدارة حجوزات وطلبات التسجيل"
            createLink="/admin/reservations/create"
            createLabel="إضافة حجز جديد"
            rows={reservations}
            searchKeys={['name', 'phone', 'school', 'code']}
            searchPlaceholder="بحث بالاسم أو الهاتف أو المدرسة..."
            total={reservations.length}
            filters={[
                {
                    key: 'study_type',
                    label: 'نوع الدراسة',
                    options: [
                        { value: 'online',  label: 'أونلاين' },
                        { value: 'offline', label: 'حضوري' },
                    ],
                },
                {
                    key: 'gender',
                    label: 'الجنس',
                    options: [
                        { value: 'male',   label: 'ذكر' },
                        { value: 'female', label: 'أنثى' },
                    ],
                },
            ]}
            columns={[
                {
                    key: 'name',
                    label: 'الطالب',
                    render: row => <AvatarCell name={row.name} sub={row.phone} />,
                },
                {
                    key: 'group',
                    label: 'المجموعة',
                    render: row => row.group?.name
                        ? <Badge label={row.group.name} color="navy" />
                        : '—',
                },
                {
                    key: 'study_type',
                    label: 'النوع',
                    center: true,
                    render: row => row.study_type
                        ? <Badge label={row.study_type === 'online' ? 'أونلاين' : 'حضوري'} color={row.study_type === 'online' ? 'blue' : 'navy'} />
                        : '—',
                },
                {
                    key: 'gender',
                    label: 'الجنس',
                    center: true,
                    render: row => row.gender
                        ? <Badge label={row.gender === 'male' ? 'ذكر' : 'أنثى'} color={row.gender === 'male' ? 'blue' : 'pink'} />
                        : '—',
                },
                {
                    key: 'is_paid',
                    label: 'الدفع',
                    center: true,
                    render: row => <Badge label={row.is_paid ? 'مدفوع ✓' : 'لم يُدفع'} color={row.is_paid ? 'green' : 'yellow'} />,
                },
                {
                    key: 'school',
                    label: 'المدرسة',
                    render: row => row.school || '—',
                },
            ]}
            editRoute={row => `/admin/reservations/${row.id}/edit`}
            deleteRoute={row => `/admin/reservations/${row.id}`}
            deleteMessage="سيتم حذف هذا الحجز نهائياً."
        />
    );
}
