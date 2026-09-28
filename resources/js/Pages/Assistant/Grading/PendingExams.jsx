import React, { useEffect, useRef, useState } from 'react';
import { Head, Link, router } from '@inertiajs/react';
import AssistantLayout from '@/Layouts/AssistantLayout';
import gsap from 'gsap';

const O = '#1F5A45'; // برتقالي
const N = '#0E3A2E'; // كحلي
const B = '#E8DCC1'; // ذهبي

export default function PendingExams({ assistant, pending = [], exams_list = [], filters = {} }) {
    const listRef = useRef(null);
    const [search, setSearch] = useState(filters.search || '');
    const [examId, setExamId] = useState(filters.exam_id || '');
    const [darkMode, setDarkMode] = useState(false);

    useEffect(() => {
        setDarkMode(document.documentElement.classList.contains('dark'));
        const observer = new MutationObserver((mutations) => {
            mutations.forEach((mutation) => {
                if (mutation.attributeName === 'class') {
                    setDarkMode(document.documentElement.classList.contains('dark'));
                }
            });
        });
        observer.observe(document.documentElement, { attributes: true, attributeFilter: ['class'] });
        return () => observer.disconnect();
    }, []);

    const handleSearchSubmit = (e) => {
        e.preventDefault();
        router.get(route('assistant.exams.pending'), { search, exam_id: examId }, {
            preserveState: true,
            preserveScroll: true
        });
    };

    const handleExamChange = (selectedExam) => {
        setExamId(selectedExam);
        router.get(route('assistant.exams.pending'), { search, exam_id: selectedExam }, {
            preserveState: true,
            preserveScroll: true
        });
    };

    useEffect(() => {
        if (!listRef.current) return;
        const items = listRef.current.querySelectorAll('.card-item');
        gsap.from(items, { y: 20, opacity: 0, duration: 0.5, stagger: 0.08, ease: 'power3.out' });
    }, [pending]);

    return (
        <AssistantLayout assistant={assistant} title="📝 امتحانات الطلاب">
            <Head title="سجل الامتحانات — بوابة السكرتارية" />

            <div className="max-w-5xl mx-auto space-y-6 text-right" dir="rtl" style={{ fontFamily: 'Cairo, sans-serif' }}>

                {/* مربع البحث والفلترة المتقدم مع زر البحث الفوري المضاء وتنسيق الحروف السوداء */}
                <div className="bg-white dark:bg-[#1C1916] p-6 rounded-2xl shadow-md border border-gray-100 dark:border-gray-800 transition-colors duration-300">
                    <form onSubmit={handleSearchSubmit} className="flex flex-col md:flex-row items-end gap-4">
                        <div className="flex-1 space-y-2 w-full">
                            <label className="block text-sm font-black text-[#0E3A2E] dark:text-[#E8DCC1]">بحث باسم الطالب المقصر:</label>
                            <input
                                type="text"
                                value={search}
                                onChange={e => setSearch(e.target.value)}
                                placeholder="اكتب اسم الطالب للبحث عن امتحاناته..."
                                className="w-full border border-gray-200 dark:border-gray-800 bg-white dark:bg-[#141210] text-gray-900 dark:text-white rounded-lg p-3 text-sm focus:border-[#C9A96A] focus:ring-0 outline-none transition font-bold"
                            />
                        </div>

                        <div className="flex-1 space-y-2 w-full">
                            <label className="block text-sm font-black text-[#0E3A2E] dark:text-[#E8DCC1]">اختر التصفية حسب الامتحان:</label>
                            <select
                                value={examId}
                                onChange={e => handleExamChange(e.target.value)}
                                className="w-full border border-gray-200 dark:border-gray-800 bg-white dark:bg-[#141210] text-gray-900 dark:text-white rounded-lg p-3 text-sm focus:border-[#C9A96A] focus:ring-0 outline-none transition font-bold"
                            >
                                <option value="" className="text-gray-500">-- كل امتحانات المنصة --</option>
                                {exams_list.map(e => (
                                    <option key={e.id} value={e.id} className="text-gray-900 dark:text-white bg-white dark:bg-[#141210] font-bold">{e.title}</option>
                                ))}
                            </select>
                        </div>

                        {/* زر البحث الفوري المضاء والمستقل المكتوب بطلبك */}
                        <button
                            type="submit"
                            className="brand-cta w-full md:w-auto px-8 py-3 text-sm self-end"
                        >
                            البحث الفوري 🔍
                        </button>
                    </form>
                </div>

                {/* قائمة كروت عرض نتائج الحل والدرجات */}
                {pending.length === 0 ? (
                    <div className="bg-white dark:bg-[#1C1916] rounded-2xl p-16 text-center border border-gray-100 dark:border-gray-800 shadow-md">
                        <span className="text-5xl block mb-4">🎉</span>
                        <h3 className="text-lg font-bold text-gray-500 mb-1">لا توجد نتائج مطابقة لفلترة البحث</h3>
                    </div>
                ) : (
                    <div ref={listRef} className="grid md:grid-cols-2 gap-6">
                        {pending.map((exam) => (
                            <div
                                key={exam.id}
                                className="card-item bg-white dark:bg-[#1C1916] p-6 rounded-2xl border-t-4 border-[#C9A96A] shadow-md hover:shadow-lg transition transform hover:-translate-y-1 duration-300 relative overflow-hidden"
                            >
                                <div className="absolute -bottom-6 -left-6 text-7xl opacity-5 pointer-events-none">🏛️</div>

                                <div className="flex items-center space-x-4 rtl:space-x-reverse mb-4">
                                    <div className="w-12 h-12 rounded-full bg-[#0E3A2E] text-[#E8DCC1] flex items-center justify-center text-base font-black shadow-sm flex-shrink-0">
                                        {exam.student_name ? exam.student_name.charAt(0).toUpperCase() : 'ص'}
                                    </div>
                                    <div className="min-w-0 flex-1">
                                        <h4 className="font-black text-sm text-[#0E3A2E] dark:text-[#E8DCC1] truncate">{exam.student_name}</h4>
                                        <span className="text-[10px] text-gray-400 font-bold block mt-1">📅 تاريخ التسليم: {exam.finished_at}</span>
                                    </div>
                                </div>

                                <div className="bg-gray-50/60 dark:bg-gray-900/30 p-4 rounded-xl border border-gray-100 dark:border-gray-800 mb-6 space-y-2">
                                    <div className="flex justify-between items-center text-xs">
                                        <span className="text-gray-400 font-bold">اسم الامتحان:</span>
                                        <span className="text-[#0E3A2E] dark:text-[#E8DCC1] font-extrabold truncate max-w-[200px]">{exam.exam_title}</span>
                                    </div>
                                    <div className="flex justify-between items-center text-xs">
                                        <span className="text-gray-400 font-bold">الدرجة المرصودة حالياً:</span>
                                        <span className={`px-2 py-0.5 rounded font-black text-[10px] ${exam.status === 'passed' ? 'bg-green-500/10 text-green-600' : 'bg-red-500/10 text-red-600'}`}>
                                            {exam.score} / {exam.total_marks} ({exam.status === 'passed' ? 'ناجح ✅' : 'لم يجتز'})
                                        </span>
                                    </div>
                                </div>

                                <Link
                                    href={route('assistant.exams.grade.form', exam.id)}
                                    className="brand-cta w-full py-3 text-xs"
                                >
                                    👀 عرض ورقة الإجابة وتعديل الدرجة
                                </Link>
                            </div>
                        ))}
                    </div>
                )}

            </div>
        </AssistantLayout>
    );
}

function GoogleFonts() {
    return (
        <link href="https://fonts.googleapis.com/css2?family=Cairo:wght@400;600;700;800;900&display=swap" rel="stylesheet" />
    );
}
