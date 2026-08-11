import React, { useState } from 'react';
import AdminForm, { AdminField } from '@/Components/Admin/AdminForm';
import { useForm } from '@inertiajs/react';

export default function Form({ item }) {
    const { data, setData, post, put, processing, errors, transform } = useForm({
        name: item?.name || '',
        email: item?.email || '',
        phone: item?.phone || '',
        salary: item?.salary || '',
        role: item?.role || 'assistant',
        password: '',
        image: null,
    });

    const handleSubmit = (e) => {
        e.preventDefault();
        if (item) {
            // PHP never parses multipart bodies for PUT requests, so a real PUT here
            // would silently arrive empty server-side — spoof it via POST + _method instead.
            transform(d => ({ ...d, _method: 'PUT' }));
            post(`/admin/assistants/${item.id}`, { forceFormData: true });
        } else {
            post('/admin/assistants', { forceFormData: true });
        }
    };

    return (
        <AdminForm
            title={item ? 'تعديل المساعد' : 'إضافة مساعد جديد'}
            layoutTitle="المساعدون"
            description={item ? 'تعديل بيانات المساعد' : 'إضافة مساعد جديد للمنصة'}
            cancelLink="/admin/assistants"
            onSubmit={handleSubmit}
            processing={processing}
            submitLabel={item ? 'حفظ التعديلات' : 'إضافة المساعد'}
        >
            <AdminField
                label="الاسم الكامل"
                name="name"
                type="text"
                value={data.name}
                onChange={e => setData('name', e.target.value)}
                error={errors.name}
                required
                placeholder="الاسم الكامل"
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
                label="الراتب"
                name="salary"
                type="number"
                value={data.salary}
                onChange={e => setData('salary', e.target.value)}
                error={errors.salary}
                placeholder="الراتب الشهري بالجنيه"
            />
            <AdminField
                label="الدور"
                name="role"
                type="select"
                value={data.role}
                onChange={e => setData('role', e.target.value)}
                error={errors.role}
                options={[
                    { value: 'assistant', label: 'مساعد' },
                    { value: 'teacher', label: 'معلم' },
                ]}
            />
            <AdminField
                label="كلمة المرور"
                name="password"
                type="password"
                value={data.password}
                onChange={e => setData('password', e.target.value)}
                error={errors.password}
                hint="اتركه فارغاً عند التعديل"
                placeholder="كلمة المرور"
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
