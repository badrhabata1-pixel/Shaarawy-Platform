import React from 'react';
import AdminForm, { AdminField } from '@/Components/Admin/AdminForm';
import { useForm } from '@inertiajs/react';

export default function Form({ item, academicYears }) {
    const { data, setData, post, put, processing, errors, transform } = useForm({
        title:            item?.title            || '',
        academic_year_id: item?.academic_year_id || '',
        term:             item?.term             || '',
        price:            item?.price            || '',
        description:      item?.description      || '',
        image:            null,
        is_free:          item?.is_free          ?? false,
        is_visible:       item?.is_visible       ?? true,
    });

    const handleSubmit = (e) => {
        e.preventDefault();
        if (item) {
            // PHP never parses multipart bodies for PUT requests, so a real PUT here
            // would silently arrive empty server-side — spoof it via POST + _method instead.
            transform(d => ({ ...d, _method: 'PUT' }));
            post(`/admin/units/${item.id}`, { forceFormData: true });
        } else {
            post('/admin/units', { forceFormData: true });
        }
    };

    const termOptions = [
        { value: 'first', label: 'الفصل الأول' },
        { value: 'second', label: 'الفصل الثاني' },
        { value: 'summer', label: 'الصيف' },
    ];

    return (
        <AdminForm
            title={item ? 'تعديل الوحدة' : 'إضافة وحدة دراسية جديدة'}
            layoutTitle="الوحدات الدراسية"
            description={item ? 'تعديل بيانات الوحدة الدراسية' : 'إضافة وحدة دراسية جديدة'}
            cancelLink="/admin/units"
            onSubmit={handleSubmit}
            processing={processing}
            submitLabel={item ? 'حفظ التعديلات' : 'إضافة الوحدة'}
        >
            <AdminField
                label="عنوان الوحدة"
                name="title"
                type="text"
                value={data.title}
                onChange={e => setData('title', e.target.value)}
                error={errors.title}
                required
                placeholder="مثال: الوحدة الأولى - الكيمياء العضوية"
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
                label="الفصل الدراسي"
                name="term"
                type="select"
                value={data.term}
                onChange={e => setData('term', e.target.value)}
                error={errors.term}
                options={termOptions}
            />
            <AdminField
                label="السعر"
                name="price"
                type="number"
                value={data.price}
                onChange={e => setData('price', e.target.value)}
                error={errors.price}
                placeholder="السعر بالجنيه المصري"
            />
            <AdminField
                label="الوصف"
                name="description"
                type="textarea"
                value={data.description}
                onChange={e => setData('description', e.target.value)}
                error={errors.description}
                rows={4}
                placeholder="وصف مختصر للوحدة"
            />
            <AdminField
                label="الصورة"
                name="image"
                type="file"
                accept="image/*"
                onChange={e => setData('image', e.target.files[0])}
                error={errors.image}
            />
            <AdminField
                label="وحدة مجانية (لا تستلزم اشتراكاً)"
                name="is_free"
                type="toggle"
                value={data.is_free}
                onChange={checked => setData('is_free', checked)}
                error={errors.is_free}
            />
            <AdminField
                label="ظاهرة في الصفحة الرئيسية"
                name="is_visible"
                type="toggle"
                value={data.is_visible}
                onChange={checked => setData('is_visible', checked)}
                error={errors.is_visible}
            />
        </AdminForm>
    );
}
