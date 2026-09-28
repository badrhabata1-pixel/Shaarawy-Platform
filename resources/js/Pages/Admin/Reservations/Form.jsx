import AdminForm, { AdminField } from '@/Components/Admin/AdminForm';
import { useForm } from '@inertiajs/react';

export default function Form({ item, groups }) {
    const { data, setData, post, put, processing, errors } = useForm({
        name:         item?.name         || '',
        phone:        item?.phone        || '',
        address:      item?.address      || '',
        school:       item?.school       || '',
        parent_name:  item?.parent_name  || '',
        parent_phone: item?.parent_phone || '',
        parent_job:   item?.parent_job   || '',
        code:         item?.code         || '',
        group_id:     item?.group_id     || '',
        study_type:   item?.study_type   || '',
        gender:       item?.gender       || '',
        is_paid:      item?.is_paid      ?? false,
    });

    const handleSubmit = (e) => {
        e.preventDefault();
        if (item) {
            put(`/admin/reservations/${item.id}`);
        } else {
            post('/admin/reservations');
        }
    };

    return (
        <AdminForm
            title={item ? 'تعديل الحجز' : 'إضافة حجز جديد'}
            layoutTitle="الحجوزات"
            description={item ? 'تعديل بيانات الحجز' : 'تسجيل حجز جديد لطالب'}
            cancelLink="/admin/reservations"
            onSubmit={handleSubmit}
            processing={processing}
            submitLabel={item ? 'حفظ التعديلات' : 'إضافة الحجز'}
        >
            {/* اسم الطالب + الهاتف */}
            <AdminField
                label="اسم الطالب"
                name="name"
                value={data.name}
                onChange={e => setData('name', e.target.value)}
                error={errors.name}
                required
                placeholder="الاسم الكامل"
            />
            <AdminField
                label="رقم الهاتف"
                name="phone"
                value={data.phone}
                onChange={e => setData('phone', e.target.value)}
                error={errors.phone}
                required
                placeholder="01XXXXXXXXX"
            />
            <AdminField
                label="العنوان"
                name="address"
                value={data.address}
                onChange={e => setData('address', e.target.value)}
                error={errors.address}
                placeholder="العنوان (اختياري)"
            />
            <AdminField
                label="المدرسة"
                name="school"
                value={data.school}
                onChange={e => setData('school', e.target.value)}
                error={errors.school}
                placeholder="اسم المدرسة (اختياري)"
            />

            {/* بيانات ولي الأمر */}
            <AdminField
                label="اسم ولي الأمر"
                name="parent_name"
                value={data.parent_name}
                onChange={e => setData('parent_name', e.target.value)}
                error={errors.parent_name}
                placeholder="اسم ولي الأمر (اختياري)"
            />
            <AdminField
                label="هاتف ولي الأمر"
                name="parent_phone"
                value={data.parent_phone}
                onChange={e => setData('parent_phone', e.target.value)}
                error={errors.parent_phone}
                placeholder="01XXXXXXXXX"
            />
            <AdminField
                label="وظيفة ولي الأمر"
                name="parent_job"
                value={data.parent_job}
                onChange={e => setData('parent_job', e.target.value)}
                error={errors.parent_job}
                placeholder="الوظيفة (اختياري)"
            />

            {/* المجموعة والنوع والجنس */}
            <AdminField
                label="المجموعة"
                name="group_id"
                type="select"
                value={data.group_id}
                onChange={e => setData('group_id', e.target.value)}
                error={errors.group_id}
                options={[
                    { value: '', label: '— اختر المجموعة —' },
                    ...groups.map(g => ({ value: g.id, label: g.name })),
                ]}
            />
            <AdminField
                label="نوع الدراسة"
                name="study_type"
                type="select"
                value={data.study_type}
                onChange={e => setData('study_type', e.target.value)}
                error={errors.study_type}
                options={[
                    { value: '',       label: '— اختر —' },
                    { value: 'online',  label: 'أونلاين' },
                    { value: 'offline', label: 'حضوري' },
                ]}
            />
            <AdminField
                label="الجنس"
                name="gender"
                type="select"
                value={data.gender}
                onChange={e => setData('gender', e.target.value)}
                error={errors.gender}
                options={[
                    { value: '',       label: '— اختر —' },
                    { value: 'male',   label: 'ذكر' },
                    { value: 'female', label: 'أنثى' },
                ]}
            />

            {/* كود + حالة الدفع */}
            <AdminField
                label="كود التحويل"
                name="code"
                value={data.code}
                onChange={e => setData('code', e.target.value)}
                error={errors.code}
                placeholder="كود التحويل البنكي (اختياري)"
            />
            <div style={{ display: 'flex', alignItems: 'center', gap: 10, padding: '4px 0' }}>
                <input
                    type="checkbox"
                    id="is_paid"
                    checked={data.is_paid}
                    onChange={e => setData('is_paid', e.target.checked)}
                    style={{ width: 18, height: 18, cursor: 'pointer', accentColor: '#1F5A45' }}
                />
                <label htmlFor="is_paid" style={{ fontSize: 14, fontFamily: 'Cairo,sans-serif', cursor: 'pointer', color: 'var(--a-text)' }}>
                    تم الدفع
                </label>
            </div>
        </AdminForm>
    );
}
