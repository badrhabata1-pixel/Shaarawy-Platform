import React, { useState } from 'react';
import AdminForm, { AdminField } from '@/Components/Admin/AdminForm';
import { useForm } from '@inertiajs/react';

export default function Form({ item, academicYears, groups }) {
    const { data, setData, post, put, processing, errors, transform } = useForm({
        name: item?.name || '',
        email: item?.email || '',
        phone: item?.phone || '',
        parent_phone: item?.parent_phone || '',
        password: '',
        academic_year_id: item?.academic_year_id || '',
        group_id: item?.group_id || '',
        student_type: item?.student_type || 'online',
        governorate: item?.governorate || '',
        is_active: item?.is_active ?? true,
        image: null,
    });

    const handleSubmit = (e) => {
        e.preventDefault();
        if (item) {
            // PHP never parses multipart bodies for PUT requests, so a real PUT here
            // would silently arrive empty server-side — spoof it via POST + _method instead.
            transform(d => ({ ...d, _method: 'PUT' }));
            post(`/admin/students/${item.id}`, { forceFormData: true });
        } else {
            post('/admin/students', { forceFormData: true });
        }
    };

    return (
        <AdminForm
            title={item ? 'تعديل بيانات الطالب' : 'إضافة طالب جديد'}
            layoutTitle="الطلاب"
            description={item ? 'تعديل بيانات الطالب' : 'إضافة طالب جديد للمنصة'}
            cancelLink="/admin/students"
            onSubmit={handleSubmit}
            processing={processing}
            submitLabel={item ? 'حفظ التعديلات' : 'إضافة الطالب'}
        >
            <AdminField
                label="الاسم الكامل"
                name="name"
                type="text"
                value={data.name}
                onChange={e => setData('name', e.target.value)}
                error={errors.name}
                required
                placeholder="الاسم الكامل للطالب"
            />
            <AdminField
                label="البريد الإلكتروني"
                name="email"
                type="email"
                value={data.email}
                onChange={e => setData('email', e.target.value)}
                error={errors.email}
                required
                placeholder="example@email.com"
            />
            <AdminField
                label="رقم الهاتف"
                name="phone"
                type="text"
                value={data.phone}
                onChange={e => setData('phone', e.target.value)}
                error={errors.phone}
                placeholder="01xxxxxxxxx"
            />
            <AdminField
                label="هاتف ولي الأمر"
                name="parent_phone"
                type="text"
                value={data.parent_phone}
                onChange={e => setData('parent_phone', e.target.value)}
                error={errors.parent_phone}
                placeholder="01xxxxxxxxx"
            />
            <AdminField
                label="كلمة المرور"
                name="password"
                type="password"
                value={data.password}
                onChange={e => setData('password', e.target.value)}
                error={errors.password}
                hint="اتركه فارغاً إذا لم تريد تغييره"
                placeholder="كلمة المرور الجديدة"
            />
            <AdminField
                label="الصف الدراسي"
                name="academic_year_id"
                type="select"
                value={data.academic_year_id}
                onChange={e => setData('academic_year_id', e.target.value)}
                error={errors.academic_year_id}
                required
                options={academicYears.map(y => ({ value: y.id, label: y.name }))}
            />
            <AdminField
                label="المجموعة"
                name="group_id"
                type="select"
                value={data.group_id}
                onChange={e => setData('group_id', e.target.value)}
                error={errors.group_id}
                options={groups.map(g => ({ value: g.id, label: g.name }))}
            />
            <AdminField
                label="نوع الطالب"
                name="student_type"
                type="select"
                value={data.student_type}
                onChange={e => setData('student_type', e.target.value)}
                error={errors.student_type}
                required
                options={[
                    { value: 'online', label: 'أونلاين' },
                    { value: 'offline', label: 'سنتر' },
                ]}
            />
            <AdminField
                label="المحافظة"
                name="governorate"
                type="text"
                value={data.governorate}
                onChange={e => setData('governorate', e.target.value)}
                error={errors.governorate}
                placeholder="المحافظة"
            />
            <AdminField
                label="نشط"
                name="is_active"
                type="toggle"
                value={data.is_active}
                onChange={val => setData('is_active', val)}
                error={errors.is_active}
            />
            <AdminField
                label="الصورة الشخصية"
                name="image"
                type="file"
                accept="image/*"
                onChange={e => setData('image', e.target.files[0])}
                error={errors.image}
            />
        </AdminForm>
    );
}
