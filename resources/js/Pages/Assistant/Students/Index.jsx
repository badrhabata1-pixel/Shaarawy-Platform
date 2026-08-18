import React, { useState } from 'react';
import { Head, Link, router } from '@inertiajs/react';
import AssistantLayout from '@/Layouts/AssistantLayout';

const O = '#208ef4';
const N = '#14213D';

export default function Index({ assistant, students = [], filters = {} }) {
    const [search, setSearch] = useState(filters.search || '');

    const handleSearchSubmit = (e) => {
        e.preventDefault();
        router.get(route('assistant.students.index'), { search }, {
            preserveState: true,
            preserveScroll: true
        });
    };

    const handleDelete = (id, name) => {
        if (confirm(`⚠️ هل أنت متأكد من حذف حساب الطالب "${name}" نهائياً؟ سيتم حذف جميع درجاته وسجله بالكامل من المنصة!`)) {
            router.delete(route('assistant.students.destroy', id), {
                onSuccess: () => alert('تم حذف حساب الطالب وسجله نهائياً بنجاح! 🗑️')
            });
        }
    };

    return (
        <AssistantLayout assistant={assistant} title="👥 دليل وقائمة طلاب المنصة">
            <Head title="قائمة الطلاب — بوابة السكرتارية" />

            <div className="max-w-6xl mx-auto space-y-6 text-right" dir="rtl" style={{ fontFamily: 'Cairo, sans-serif' }}>
                
                {/* مربع البحث التفاعلي الفخم */}
                <div className="bg-white dark:bg-[#152238] p-6 rounded-2xl shadow-md border border-gray-100 dark:border-gray-800 transition-colors duration-300">
                    <form onSubmit={handleSearchSubmit} className="flex flex-col md:flex-row items-center gap-4">
                        <div className="flex-1 space-y-2 w-full">
                            <label className="block text-sm font-black text-[#14213D] dark:text-[#f8f9fa]">بحث سريع ببيانات الطالب:</label>
                            <input 
                                type="text"
                                value={search}
                                onChange={e => setSearch(e.target.value)}
                                placeholder="ابحث باسم الطالب، البريد الإلكتروني، أو رقم الهاتف..."
                                className="w-full border border-gray-200 dark:border-gray-800 bg-white dark:bg-[#0e1726] text-[#14213D] dark:text-white rounded-lg p-3 text-sm focus:border-[#F47C20] focus:ring-0 outline-none transition"
                            />
                        </div>
                        <button 
                            type="submit"
                            className="brand-cta w-full md:w-auto px-8 py-3 text-sm self-end"
                        >
                            البحث الفوري 🔍
                        </button>
                    </form>
                </div>

                {/* جدول استعراض وتفاصيل وحذف الطلاب */}
                <div className="bg-white dark:bg-[#152238] rounded-2xl shadow-xl overflow-hidden border border-gray-100 dark:border-gray-800 transition-colors duration-300">
                    <div className="p-6 border-b dark:border-gray-800 bg-gray-50 dark:bg-gray-900/30 flex justify-between items-center">
                        <h3 className="text-base font-black text-[#14213D] dark:text-[#f8f9fa]">قائمة الطلاب المقيدين</h3>
                        <span className="bg-gray-100 dark:bg-gray-800 px-3 py-1 rounded-full text-xs font-bold text-gray-500 dark:text-gray-400">{students.length} طالب مقيد</span>
                    </div>

                    <div className="overflow-x-auto">
                        <table className="w-full text-center border-collapse text-xs">
                            <thead>
                                <tr className="bg-gray-100 dark:bg-gray-900 text-[#14213D] dark:text-[#f8f9fa] font-black border-b border-gray-200 dark:border-gray-800">
                                    <th className="p-4">#</th>
                                    <th className="p-4 text-right">بيانات الطالب</th>
                                    <th className="p-4">الصف الدراسي</th>
                                    <th className="p-4">المجموعة</th>
                                    <th className="p-4">نظام الحضور</th>
                                    <th className="p-4">أرقام الهواتف</th>
                                    <th className="p-4">تاريخ الانضمام</th>
                                    <th className="p-4">حذف الحساب</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-gray-100 dark:divide-gray-800 font-bold text-gray-700 dark:text-gray-300">
                                {students.length === 0 ? (
                                    <tr>
                                        <td colSpan="8" className="p-12 text-gray-400">
                                            <span className="text-4xl block mb-2">👤</span>
                                            لا يوجد طلاب مقيدون ببيانات البحث المدخلة.
                                        </td>
                                    </tr>
                                ) : (
                                    students.map((student, idx) => (
                                        <tr key={student.id} className="hover:bg-gray-50/50 dark:hover:bg-gray-900/30 transition">
                                            <td className="p-4 text-gray-400">{idx + 1}</td>
                                            <td className="p-4 text-right font-black text-sm text-[#14213D] dark:text-[#f8f9fa]">
                                                <div>{student.name}</div>
                                                <span className="text-[10px] text-gray-400 block font-normal mt-0.5" style={{ direction: 'ltr' }}>{student.email}</span>
                                            </td>
                                            <td className="p-4">
                                                <span className="bg-[#14213D]/10 text-[#14213D] dark:text-white px-3 py-1 rounded-full text-[10px]">
                                                    {student.academic_year}
                                                </span>
                                            </td>
                                            <td className="p-4">
                                                <span className="bg-[#F47C20]/15 text-[#F47C20] px-3 py-1 rounded-full text-[10px]">
                                                    {student.group_name}
                                                </span>
                                            </td>
                                            <td className="p-4">
                                                {student.student_type === 'online' ? (
                                                    <span className="bg-green-500/10 text-green-600 px-2.5 py-1 rounded-full text-[10px]">🌐 أونلاين</span>
                                                ) : (
                                                    <span className="bg-purple-500/10 text-purple-600 px-2.5 py-1 rounded-full text-[10px]">🏫 سنتر</span>
                                                )}
                                            </td>
                                            <td className="p-4">
                                                <div style={{ direction: 'ltr' }} className="text-[#14213D] dark:text-[#f8f9fa]">{student.phone}</div>
                                                <span className="text-[10px] text-orange-400 block font-normal mt-0.5" style={{ direction: 'ltr' }}>ولي الأمر: {student.parent_phone || '—'}</span>
                                            </td>
                                            <td className="p-4 text-gray-400">{student.created_at}</td>
                                            <td className="p-4">
                                                <button 
                                                    onClick={() => handleDelete(student.id, student.name)}
                                                    className="w-8 h-8 rounded-full bg-red-50 text-red-500 hover:bg-red-100 transition flex items-center justify-center mx-auto"
                                                    title="حذف حساب الطالب نهائياً"
                                                >
                                                    🗑️
                                                </button>
                                            </td>
                                        </tr>
                                    ))
                                )}
                            </tbody>
                        </table>
                    </div>
                </div>

            </div>
        </AssistantLayout>
    );
}

function GoogleFonts() {
    return (
        <link
            href="https://fonts.googleapis.com/css2?family=Cairo:wght@400;600;700;800;900&display=swap"
            rel="stylesheet"
        />
    );
}

