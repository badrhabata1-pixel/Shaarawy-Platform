import React, { useState } from 'react';
import AdminForm, { AdminField } from '@/Components/Admin/AdminForm';
import { useForm } from '@inertiajs/react';

export default function Form({ item, students, units, lessons }) {
    const { data, setData, post, put, processing, errors, transform } = useForm({
        student_id: item?.student_id || '',
        unit_id: item?.unit_id || '',
        lesson_id: item?.lesson_id || '',
        price: item?.price || '',
        status: item?.status || 'pending',
        payment_proof: null,
    });

    const handleSubmit = (e) => {
        e.preventDefault();
        const hasFile = !!data.payment_proof;
        const opts = hasFile ? { forceFormData: true } : {};
        if (item) {
            if (hasFile) {
                // PHP never parses multipart bodies for PUT requests, so a real PUT here
                // would silently arrive empty server-side — spoof it via POST + _method instead.
                transform(d => ({ ...d, _method: 'PUT' }));
                post(`/admin/subscriptions/${item.id}`, opts);
            } else {
                put(`/admin/subscriptions/${item.id}`, opts);
            }
        } else {
            post('/admin/subscriptions', opts);
        }
    };

    return (
        <AdminForm
            title={item ? 'تعديل الاشتراك' : 'إضافة اشتراك جديد'}
            layoutTitle="الاشتراكات"
            description={item ? 'تعديل بيانات الاشتراك' : 'إضافة اشتراك جديد لطالب'}
            cancelLink="/admin/subscriptions"
            onSubmit={handleSubmit}
            processing={processing}
            submitLabel={item ? 'حفظ التعديلات' : 'إضافة الاشتراك'}
        >
            <AdminField
                label="الطالب"
                name="student_id"
                type="select"
                value={data.student_id}
                onChange={e => setData('student_id', e.target.value)}
                error={errors.student_id}
                required
                options={students.map(s => ({ value: s.id, label: s.name }))}
            />
            <AdminField
                label="الوحدة"
                name="unit_id"
                type="select"
                value={data.unit_id}
                onChange={e => setData('unit_id', e.target.value)}
                error={errors.unit_id}
                options={units.map(u => ({ value: u.id, label: u.title }))}
            />
            <AdminField
                label="الدرس"
                name="lesson_id"
                type="select"
                value={data.lesson_id}
                onChange={e => setData('lesson_id', e.target.value)}
                error={errors.lesson_id}
                options={lessons.map(l => ({ value: l.id, label: l.title }))}
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
                label="الحالة"
                name="status"
                type="select"
                value={data.status}
                onChange={e => setData('status', e.target.value)}
                error={errors.status}
                required
                options={[
                    { value: 'pending', label: 'معلّق' },
                    { value: 'active', label: 'مفعّل' },
                    { value: 'rejected', label: 'مرفوض' },
                ]}
            />
            <AdminField
                label="إيصال الدفع"
                name="payment_proof"
                type="file"
                accept="image/*"
                onChange={e => setData('payment_proof', e.target.files[0])}
                error={errors.payment_proof}
            />
        </AdminForm>
    );
}
