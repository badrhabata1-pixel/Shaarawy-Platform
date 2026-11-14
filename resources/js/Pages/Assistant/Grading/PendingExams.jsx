import React, { useEffect, useRef, useState } from 'react';
import { Head, Link, router } from '@inertiajs/react';
import AssistantLayout from '@/Layouts/AssistantLayout';
import gsap from 'gsap';

const O = '#1F5A45'; // برتقالي
const N = '#0E3A2E'; // كحلي
const B = '#E8DCC1'; // ذهبي

export default function PendingExams({ assistant, pending = [], exams_list = [], exam_stats = [], counts = {}, filters = {} }) {
    const listRef = useRef(null);
    const [search, setSearch] = useState(filters.search || '');
    const [examId, setExamId] = useState(filters.exam_id || '');
    const [grading, setGrading] = useState(filters.grading || 'all');
    const [openMissing, setOpenMissing] = useState({});
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

    const go = (params) => {
        router.get(route('assistant.exams.pending'), { search, exam_id: examId, grading, ...params }, {
            preserveState: true,
            preserveScroll: true
        });
    };

    const handleSearchSubmit = (e) => {
        e.preventDefault();
        go({});
    };

    const handleExamChange = (selectedExam) => {
        setExamId(selectedExam);
        go({ exam_id: selectedExam });
    };

    const handleGradingChange = (value) => {
        setGrading(value);
        go({ grading: value });
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

                {/* فلتر حالة التصحيح */}
                <div className="flex flex-wrap items-center gap-3">
                    {[
                        { key: 'all',     label: 'كل الطلاب',          count: counts.all },
                        { key: 'pending', label: 'لسه متصححش',         count: counts.pending },
                        { key: 'graded',  label: 'اتصحح فقط',          count: counts.graded },
                    ].map(f => (
                        <button
                            key={f.key}
                            type="button"
                            onClick={() => handleGradingChange(f.key)}
                            className={`px-5 py-2.5 rounded-xl text-sm font-black border transition ${
                                grading === f.key
                                    ? 'bg-[#0E3A2E] text-[#E8DCC1] border-[#C9A96A] shadow-md'
                                    : 'bg-white dark:bg-[#1C1916] text-[#0E3A2E] dark:text-[#E8DCC1] border-gray-200 dark:border-gray-800 hover:border-[#C9A96A]'
                            }`}
                        >
                            {f.label} <span className="mr-1 opacity-70">({f.count ?? 0})</span>
                        </button>
                    ))}
                </div>

                {/* إحصائيات الدخول لكل امتحان */}
                {exam_stats.length > 0 && (
                    <div className="space-y-4">
                        <h3 className="text-sm font-black text-[#0E3A2E] dark:text-[#E8DCC1]">📊 إحصائيات دخول الامتحانات</h3>
                        {exam_stats.map(st => {
                            const open = !!openMissing[st.id];
                            return (
                                <div key={st.id} className="bg-white dark:bg-[#1C1916] rounded-2xl border border-gray-100 dark:border-gray-800 shadow-md p-5">
                                    <div className="flex flex-wrap items-center justify-between gap-3 mb-4">
                                        <h4 className="font-black text-sm text-[#0E3A2E] dark:text-[#E8DCC1]">{st.title}</h4>
                                        <div className="flex flex-wrap gap-3 text-center">
                                            <div className="px-4 py-2 rounded-xl bg-gray-50 dark:bg-gray-900/40 border border-gray-100 dark:border-gray-800">
                                                <div className="text-lg font-black text-[#0E3A2E] dark:text-[#E8DCC1]">{st.expected}</div>
                                                <div className="text-[10px] font-bold text-gray-400">المفروض يدخلوا</div>
                                            </div>
                                            <div className="px-4 py-2 rounded-xl bg-green-500/10 border border-green-500/20">
                                                <div className="text-lg font-black text-green-600">{st.entered}</div>
                                                <div className="text-[10px] font-bold text-green-600/70">دخلوا</div>
                                            </div>
                                            <div className="px-4 py-2 rounded-xl bg-red-500/10 border border-red-500/20">
                                                <div className="text-lg font-black text-red-600">{st.missing_count}</div>
                                                <div className="text-[10px] font-bold text-red-600/70">مدخلوش</div>
                                            </div>
                                        </div>
                                    </div>

                                    {st.expected > 0 && (
                                        <div className="h-2 rounded-full bg-gray-100 dark:bg-gray-800 overflow-hidden mb-4">
                                            <div className="h-full bg-gradient-to-l from-[#C9A96A] to-[#0E3A2E]" style={{ width: `${Math.round((st.entered / st.expected) * 100)}%` }} />
                                        </div>
                                    )}

                                    <button
                                        type="button"
                                        disabled={st.missing_count === 0}
                                        onClick={() => setOpenMissing(prev => ({ ...prev, [st.id]: !prev[st.id] }))}
                                        className={`px-5 py-2 rounded-lg text-xs font-black border transition ${
                                            st.missing_count === 0
                                                ? 'opacity-50 cursor-not-allowed border-gray-200 text-gray-400'
                                                : 'border-red-500/40 text-red-600 hover:bg-red-500/10'
                                        }`}
                                    >
                                        {st.missing_count === 0 ? 'كل الطلاب دخلوا ✅' : open ? 'إخفاء الطلاب اللي مدخلوش' : `👥 عرض الطلاب اللي مدخلوش (${st.missing_count})`}
                                    </button>

                                    {open && (
                                        <div className="mt-4 overflow-x-auto">
                                            <table className="w-full text-xs text-right">
                                                <thead>
                                                    <tr className="text-gray-400 font-bold border-b border-gray-100 dark:border-gray-800">
                                                        <th className="py-2 px-2">#</th>
                                                        <th className="py-2 px-2">الطالب</th>
                                                        <th className="py-2 px-2">الهاتف</th>
                                                        <th className="py-2 px-2">هاتف ولي الأمر</th>
                                                        <th className="py-2 px-2">المجموعة</th>
                                                    </tr>
                                                </thead>
                                                <tbody>
                                                    {st.missing.map((m, i) => (
                                                        <tr key={m.id} className="border-b border-gray-50 dark:border-gray-900 text-[#0E3A2E] dark:text-[#E8DCC1]">
                                                            <td className="py-2 px-2">{i + 1}</td>
                                                            <td className="py-2 px-2 font-black">{m.name}</td>
                                                            <td className="py-2 px-2" dir="ltr">{m.phone || '—'}</td>
                                                            <td className="py-2 px-2" dir="ltr">{m.parent_phone || '—'}</td>
                                                            <td className="py-2 px-2">{m.group || '—'}</td>
                                                        </tr>
                                                    ))}
                                                </tbody>
                                            </table>
                                        </div>
                                    )}
                                </div>
                            );
                        })}
                    </div>
                )}

                {/* قائمة كروت عرض نتائج الحل والدرجات */}
                {pending.length === 0 ? (
                    <div className="bg-white dark:bg-[#1C1916] rounded-2xl p-16 text-center border border-gray-100 dark:border-gray-800 shadow-md">
                        <span className="text-5xl block mb-4">🎉</span>
                        <h3 className="text-lg font-bold text-gray-500 mb-1">لا توجد إجابات مسلّمة مطابقة للبحث أو الامتحان المحدد</h3>
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
                                        <span className={`px-2 py-0.5 rounded font-black text-[10px] ${exam.status === 'passed' ? 'bg-green-500/10 text-green-600' : exam.status === 'pending' ? 'bg-amber-500/10 text-amber-600' : 'bg-red-500/10 text-red-600'}`}>
                                            {exam.score} / {exam.total_marks} ({exam.status === 'pending' ? 'قيد المراجعة' : exam.status === 'passed' ? 'ناجح ✅' : 'لم يجتز'})
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
