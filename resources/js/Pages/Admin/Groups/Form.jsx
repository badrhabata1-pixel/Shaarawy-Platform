import React, { useState } from 'react';
import AdminForm, { AdminField } from '@/Components/Admin/AdminForm';
import { useForm } from '@inertiajs/react';

export default function Form({ item, academicYears, assistants }) {
    const { data, setData, post, put, processing, errors, transform } = useForm({
        name: item?.name || '',
        academic_year_id: item?.academic_year_id || '',
        description: item?.description || '',
        hour: item?.hour || '',
        attendance_type: item?.attendance_type || 'offline',
        start_date: item?.start_date || '',
        end_date: item?.end_date || '',
        assistant_id: item?.assistant_id || '',
        image: null,
    });

    const handleSubmit = (e) => {
        e.preventDefault();
        if (item) {
            // PHP never parses multipart bodies for PUT requests, so a real PUT here
            // would silently arrive empty server-side — spoof it via POST + _method instead.
            transform(d => ({ ...d, _method: 'PUT' }));
            post(`/admin/groups/${item.id}`, { forceFormData: true });
        } else {
            post('/admin/groups', { forceFormData: true });
        }
    };

    return (
        <AdminForm
            title={item ? 'تعديل المجموعة' : 'إضافة مجموعة جديدة'}
            layoutTitle="المجموعات"
            description={item ? 'تعديل بيانات المجموعة' : 'إضافة مجموعة دراسية جديدة'}
            cancelLink="/admin/groups"
            onSubmit={handleSubmit}
            processing={processing}
            submitLabel={item ? 'حفظ التعديلات' : 'إضافة المجموعة'}
        >
            <AdminField
                label="اسم المجموعة"
                name="name"
                type="text"
                value={data.name}
                onChange={e => setData('name', e.target.value)}
                error={errors.name}
                required
                placeholder="مثال: مجموعة الثلاثاء 5 مساءً"
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
                label="نوع الحضور"
                name="attendance_type"
                type="select"
                value={data.attendance_type}
                onChange={e => setData('attendance_type', e.target.value)}
                error={errors.attendance_type}
                options={[
                    { value: 'online', label: 'أونلاين' },
                    { value: 'offline', label: 'سنتر' },
                    { value: 'both', label: 'مختلط' },
                ]}
            />
            <AdminField
                label="وقت المجموعة"
                name="hour"
                type="text"
                value={data.hour}
                onChange={e => setData('hour', e.target.value)}
                error={errors.hour}
                placeholder="مثال: 5 مساءً"
            />
            <AdminField
                label="تاريخ البدء"
                name="start_date"
                type="date"
                value={data.start_date}
                onChange={e => setData('start_date', e.target.value)}
                error={errors.start_date}
            />
            <AdminField
                label="تاريخ الانتهاء"
                name="end_date"
                type="date"
                value={data.end_date}
                onChange={e => setData('end_date', e.target.value)}
                error={errors.end_date}
            />
            {assistants && assistants.length > 0 && (
                <AdminField
                    label="المساعد"
                    name="assistant_id"
                    type="select"
                    value={data.assistant_id}
                    onChange={e => setData('assistant_id', e.target.value)}
                    error={errors.assistant_id}
                    options={assistants.map(a => ({ value: a.id, label: a.name }))}
                />
            )}
            <AdminField
                label="الوصف"
                name="description"
                type="textarea"
                value={data.description}
                onChange={e => setData('description', e.target.value)}
                error={errors.description}
                rows={3}
                placeholder="وصف مختصر للمجموعة"
            />
            <AdminField
                label="الصورة"
                name="image"
                type="file"
                accept="image/*"
                onChange={e => setData('image', e.target.files[0])}
                error={errors.image}
            />
        </AdminForm>
    );
}
