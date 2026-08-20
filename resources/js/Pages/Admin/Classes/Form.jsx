import React, { useState } from 'react';
import AdminForm, { AdminField } from '@/Components/Admin/AdminForm';
import { useForm } from '@inertiajs/react';

export default function Form({ item }) {
    const { data, setData, post, put, processing, errors, transform } = useForm({
        name: item?.name || '',
        price: item?.price || '',
        description: item?.description || '',
        image: null,
        level: item?.level || '',
    });

    const handleSubmit = (e) => {
        e.preventDefault();
        if (item) {
            // PHP never parses multipart bodies for PUT requests, so a real PUT here
            // would silently arrive empty server-side — spoof it via POST + _method instead.
            transform(d => ({ ...d, _method: 'PUT' }));
            post(`/admin/classes/${item.id}`, { forceFormData: true });
        } else {
            post('/admin/classes', { forceFormData: true });
        }
    };

    return (
        <AdminForm
            title={item ? 'تعديل الصف' : 'إضافة صف دراسي جديد'}
            layoutTitle="الصفوف الدراسية"
            description={item ? 'تعديل بيانات الصف الدراسي' : 'إضافة صف دراسي جديد للمنصة'}
            cancelLink="/admin/classes"
            onSubmit={handleSubmit}
            processing={processing}
            submitLabel={item ? 'حفظ التعديلات' : 'إضافة الصف'}
        >
            <AdminField
                label="اسم الصف"
                name="name"
                type="text"
                value={data.name}
                onChange={e => setData('name', e.target.value)}
                error={errors.name}
                required
                placeholder="مثال: الصف الثالث الثانوي"
            />
            <AdminField
                label="السعر"
                name="price"
                type="number"
                value={data.price}
                onChange={e => setData('price', e.target.value)}
                error={errors.price}
                required
                placeholder="السعر بالجنيه المصري"
            />
            <AdminField
                label="ترتيب الصف"
                name="level"
                type="number"
                value={data.level}
                onChange={e => setData('level', e.target.value)}
                error={errors.level}
                placeholder="مثال: 0، 1، 2 ... (الأصغر يظهر أولاً في بوابة الطالب)"
            />
            <AdminField
                label="الوصف"
                name="description"
                type="textarea"
                value={data.description}
                onChange={e => setData('description', e.target.value)}
                error={errors.description}
                rows={4}
                placeholder="وصف مختصر للصف الدراسي"
            />
            <AdminField
                label="الصورة"
                name="image"
                type="file"
                accept="image/*"
                onChange={e => setData('image', e.target.files[0])}
                error={errors.image}
                hint="يُفضَّل صورة بنسبة 1:1 (مربعة)"
            />
        </AdminForm>
    );
}
