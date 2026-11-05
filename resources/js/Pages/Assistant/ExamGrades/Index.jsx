import React, { useState } from 'react';
import { Head, router } from '@inertiajs/react';
import AssistantLayout from '@/Layouts/AssistantLayout';

export default function ExamGradesIndex({ assistant, grades = [], filters = {} }) {
    const [search, setSearch] = useState(filters.search || '');

    const submitSearch = (event) => {
        event.preventDefault();
        router.get('/assistant/exam-grades', { search }, { preserveState: true, replace: true, preserveScroll: true });
    };

    return (
        <AssistantLayout assistant={assistant} title="درجات الامتحانات">
            <Head title="درجات الامتحانات — السكرتارية" />
            <div dir="rtl" style={{ fontFamily: 'Cairo, sans-serif', maxWidth: 1200, margin: '0 auto', padding: 24 }}>
                <div style={{ marginBottom: 22 }}>
                    <h1 style={{ color: '#0E3A2E', fontSize: 24, fontWeight: 900, margin: 0 }}>درجات الامتحانات</h1>
                    <p style={{ color: '#8b806c', marginTop: 6 }}>ابحث عن نتيجة الطالب بالاسم</p>
                </div>
                <form onSubmit={submitSearch} style={{ display: 'flex', gap: 10, marginBottom: 20 }}>
                    <input value={search} onChange={event => setSearch(event.target.value)} placeholder="اكتب اسم الطالب..." style={{ flex: 1, minWidth: 0, padding: '12px 16px', border: '1px solid #e4dccb', borderRadius: 12, background: '#fff', color: '#0E3A2E', outlineColor: '#1F5A45' }} />
                    <button type="submit" style={{ border: 0, borderRadius: 12, padding: '0 22px', background: '#1F5A45', color: '#fff', fontWeight: 800, cursor: 'pointer' }}>بحث</button>
                </form>
                <div style={{ overflowX: 'auto', background: '#fff', borderRadius: 16, border: '1px solid #eee5d5' }}>
                    <table style={{ width: '100%', borderCollapse: 'collapse', minWidth: 650 }}>
                        <thead><tr style={{ background: '#f8f4eb', color: '#8b806c', textAlign: 'right' }}>
                            {['الطالب', 'الامتحان', 'الدرجة', 'الحالة', 'تاريخ التسليم'].map(label => <th key={label} style={{ padding: 14 }}>{label}</th>)}
                        </tr></thead>
                        <tbody>
                            {grades.map(grade => <tr key={grade.id} style={{ borderTop: '1px solid #eee8dc', color: '#0E3A2E' }}>
                                <td style={{ padding: 14, fontWeight: 800 }}>{grade.student?.name || '—'}</td>
                                <td style={{ padding: 14 }}>{grade.exam?.title || '—'}</td>
                                <td style={{ padding: 14, fontWeight: 900 }}>{grade.score ?? 0} / {grade.exam?.total_marks ?? '—'}</td>
                                <td style={{ padding: 14 }}>{grade.status === 'pending' ? 'قيد المراجعة' : grade.status === 'passed' ? 'ناجح' : 'راسب'}</td>
                                <td style={{ padding: 14 }}>{grade.finished_at ? new Date(grade.finished_at).toLocaleString('ar-EG') : '—'}</td>
                            </tr>)}
                            {grades.length === 0 && <tr><td colSpan="5" style={{ padding: 30, textAlign: 'center', color: '#8b806c' }}>لا توجد نتائج مطابقة للبحث</td></tr>}
                        </tbody>
                    </table>
                </div>
            </div>
        </AssistantLayout>
    );
}
