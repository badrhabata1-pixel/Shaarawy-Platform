import React, { useState } from 'react';
import AdminLayout from '@/Layouts/AdminLayout';
import { useForm, router } from '@inertiajs/react';

export default function Index({ topStudents, students }) {
    const { data, setData, post, processing, errors, reset } = useForm({
        student_id: '',
        rank: '',
        notes: '',
    });

    const handleSubmit = (e) => {
        e.preventDefault();
        post('/admin/top-students', {
            onSuccess: () => reset(),
        });
    };

    const handleDelete = (id) => {
        if (confirm('هل أنت متأكد من الحذف؟')) {
            router.delete(`/admin/top-students/${id}`);
        }
    };

    return (
        <AdminLayout title="أوائل الطلاب">
            <div dir="rtl" style={{ fontFamily: 'Cairo, sans-serif' }}>
                {/* Header */}
                <div className="mb-8">
                    <h1 className="text-2xl font-bold" style={{ color: 'var(--a-text)' }}>أوائل الطلاب</h1>
                    <p className="text-sm mt-1" style={{ color: 'var(--a-text-3)' }}>إدارة قائمة أوائل الطلاب</p>
                </div>

                {/* Add Form */}
                <div
                    className="rounded-2xl p-6 mb-8"
                    style={{ background: 'var(--a-card)', boxShadow: '0 2px 12px var(--a-shadow)', border: '1px solid var(--a-border)' }}
                >
                    <h2 className="text-lg font-bold mb-4" style={{ color: 'var(--a-text)' }}>إضافة طالب متميز</h2>
                    <form onSubmit={handleSubmit}>
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
                            {/* Student Select */}
                            <div>
                                <label className="block text-sm font-bold mb-1" style={{ color: 'var(--a-text)' }}>
                                    الطالب <span style={{ color: '#1F5A45' }}>*</span>
                                </label>
                                <select
                                    value={data.student_id}
                                    onChange={e => setData('student_id', e.target.value)}
                                    required
                                    className="w-full px-4 py-2 rounded-xl border text-sm outline-none"
                                    style={{
                                        borderColor: errors.student_id ? '#EF4444' : 'var(--a-input-b)',
                                        background: 'var(--a-input)',
                                        color: 'var(--a-text)',
                                    }}
                                >
                                    <option value="">اختر الطالب</option>
                                    {students.map(s => (
                                        <option key={s.id} value={s.id}>{s.name}</option>
                                    ))}
                                </select>
                                {errors.student_id && (
                                    <p className="text-xs mt-1" style={{ color: '#EF4444' }}>{errors.student_id}</p>
                                )}
                            </div>

                            {/* Rank */}
                            <div>
                                <label className="block text-sm font-bold mb-1" style={{ color: 'var(--a-text)' }}>
                                    الترتيب <span style={{ color: '#1F5A45' }}>*</span>
                                </label>
                                <input
                                    type="number"
                                    value={data.rank}
                                    onChange={e => setData('rank', e.target.value)}
                                    required
                                    placeholder="1"
                                    min="1"
                                    className="w-full px-4 py-2 rounded-xl border text-sm outline-none"
                                    style={{
                                        borderColor: errors.rank ? '#EF4444' : 'var(--a-input-b)',
                                        background: 'var(--a-input)',
                                        color: 'var(--a-text)',
                                    }}
                                />
                                {errors.rank && (
                                    <p className="text-xs mt-1" style={{ color: '#EF4444' }}>{errors.rank}</p>
                                )}
                            </div>

                            {/* Notes */}
                            <div>
                                <label className="block text-sm font-bold mb-1" style={{ color: 'var(--a-text)' }}>
                                    ملاحظات
                                </label>
                                <input
                                    type="text"
                                    value={data.notes}
                                    onChange={e => setData('notes', e.target.value)}
                                    placeholder="مثال: الأول على الصف"
                                    className="w-full px-4 py-2 rounded-xl border text-sm outline-none"
                                    style={{
                                        borderColor: errors.notes ? '#EF4444' : 'var(--a-input-b)',
                                        background: 'var(--a-input)',
                                        color: 'var(--a-text)',
                                    }}
                                />
                            </div>
                        </div>

                        <button
                            type="submit"
                            disabled={processing}
                            className="px-6 py-2 rounded-xl text-sm font-bold transition"
                            style={{ background: '#1F5A45', color: '#fff', opacity: processing ? 0.7 : 1 }}
                        >
                            {processing ? 'جاري الإضافة...' : '+ إضافة'}
                        </button>
                    </form>
                </div>

                {/* Top Students Table */}
                <div
                    className="rounded-2xl overflow-hidden"
                    style={{ background: 'var(--a-card)', boxShadow: '0 2px 12px var(--a-shadow)', border: '1px solid var(--a-border)' }}
                >
                    <div className="px-6 py-4" style={{ borderBottom: '1px solid var(--a-border)' }}>
                        <h2 className="font-bold" style={{ color: 'var(--a-text)' }}>
                            قائمة الأوائل ({topStudents.length})
                        </h2>
                    </div>

                    {topStudents.length === 0 ? (
                        <div className="p-12 text-center">
                            <div className="text-4xl mb-3" style={{ opacity: 'var(--a-empty-opacity)' }}>🏆</div>
                            <p style={{ color: 'var(--a-text-4)' }}>لا يوجد أوائل مضافون بعد</p>
                        </div>
                    ) : (
                        <table className="w-full">
                            <thead>
                                <tr style={{ background: 'var(--a-card-2)' }}>
                                    <th className="px-6 py-3 text-right text-xs font-bold" style={{ color: 'var(--a-text)' }}>الترتيب</th>
                                    <th className="px-6 py-3 text-right text-xs font-bold" style={{ color: 'var(--a-text)' }}>الطالب</th>
                                    <th className="px-6 py-3 text-right text-xs font-bold" style={{ color: 'var(--a-text)' }}>ملاحظات</th>
                                    <th className="px-6 py-3 text-center text-xs font-bold" style={{ color: 'var(--a-text)' }}>حذف</th>
                                </tr>
                            </thead>
                            <tbody>
                                {topStudents.map((ts, idx) => (
                                    <tr
                                        key={ts.id}
                                        style={{
                                            borderBottom: '1px solid var(--a-border)',
                                            background: idx % 2 === 0 ? 'var(--a-card)' : 'var(--a-card-2)',
                                        }}
                                    >
                                        <td className="px-6 py-4">
                                            <span
                                                className="w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold inline-flex"
                                                style={{ background: '#1F5A4518', color: '#1F5A45' }}
                                            >
                                                {ts.rank}
                                            </span>
                                        </td>
                                        <td className="px-6 py-4">
                                            <div className="flex items-center gap-3">
                                                <div
                                                    className="w-9 h-9 rounded-full flex items-center justify-center text-sm font-bold"
                                                    style={{ background: '#0E3A2E', color: '#94a3b8' }}
                                                >
                                                    {ts.student?.name?.charAt(0) || '؟'}
                                                </div>
                                                <span className="font-bold text-sm" style={{ color: 'var(--a-text)' }}>
                                                    {ts.student?.name || '—'}
                                                </span>
                                            </div>
                                        </td>
                                        <td className="px-6 py-4 text-sm" style={{ color: 'var(--a-text-3)' }}>
                                            {ts.notes || '—'}
                                        </td>
                                        <td className="px-6 py-4 text-center">
                                            <button
                                                onClick={() => handleDelete(ts.id)}
                                                className="px-3 py-1 rounded-lg text-xs font-bold"
                                                style={{ background: '#ef444418', color: '#ef4444' }}
                                            >
                                                حذف
                                            </button>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    )}
                </div>
            </div>
        </AdminLayout>
    );
}
