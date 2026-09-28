import React, { useEffect, useRef } from 'react';
import { Head, Link } from '@inertiajs/react';
import AssistantLayout from '@/Layouts/AssistantLayout';
import gsap from 'gsap';

const O = '#1F5A45';
const N = '#0E3A2E';
const B = '#E8DCC1';

export default function PendingSheets({ assistant, stats, pending_sheets = [] }) {
    const listRef = useRef(null);

    useEffect(() => {
        if (!listRef.current) return;
        const items = listRef.current.querySelectorAll('.card-item');
        gsap.from(items, { y: 20, opacity: 0, duration: 0.5, stagger: 0.08, ease: 'power3.out' });
    }, [pending_sheets]);

    const sheetsList = pending_sheets;

    return (
        <AssistantLayout assistant={assistant} title="📄 الواجبات والشيتات المعلقة">
            <Head title="تصحيح الشيتات — بوابة السكرتارية" />

            <div className="max-w-5xl mx-auto space-y-6 text-right" dir="rtl" style={{ fontFamily: 'Cairo, sans-serif' }}>

                <div className="flex justify-between items-center flex-wrap gap-4 pb-4 border-b border-gray-200 dark:border-gray-700">
                    <div>
                        <h2 className="text-xl font-black text-[#0E3A2E] dark:text-[#E8DCC1]">سجل واجبات الطلاب بانتظار المراجعة</h2>
                        <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">قم بمراجعة وتصحيح الأسئلة المقالية ورصد درجات الطلاب</p>
                    </div>
                    <div style={{
                        background: `${O}15`, border: `1.5px solid ${O}40`,
                        borderRadius: 20, padding: '6px 18px',
                        color: O, fontSize: 13, fontWeight: 800,
                    }}>
                        {sheetsList.length} شيت معلق
                    </div>
                </div>

                {sheetsList.length === 0 ? (
                    <div className="bg-white dark:bg-[#1C1916] rounded-2xl p-16 text-center border border-gray-100 dark:border-gray-700 shadow-md">
                        <span className="text-5xl block mb-4">🎉</span>
                        <h3 className="text-lg font-bold text-green-600 mb-1">عمل رائع! لا توجد شيتات معلقة</h3>
                        <p className="text-gray-400 dark:text-gray-500 text-sm">لقد قمت بتصحيح جميع واجبات وشيتات الطلاب بنجاح.</p>
                    </div>
                ) : (
                    <div ref={listRef} className="grid md:grid-cols-2 gap-6">
                        {sheetsList.map((sheet) => (
                            <div
                                key={sheet.id}
                                className="card-item bg-white dark:bg-[#1C1916] p-6 rounded-2xl border-t-4 border-[#C9A96A] shadow-md hover:shadow-lg dark:shadow-black/30 transition transform hover:-translate-y-1 duration-300 relative overflow-hidden border border-gray-100 dark:border-gray-700"
                            >
                                <div className="absolute -bottom-6 -left-6 text-7xl opacity-5 pointer-events-none">📜</div>

                                <div className="flex items-center space-x-4 rtl:space-x-reverse mb-4">
                                    <div className="w-12 h-12 rounded-full bg-[#0E3A2E] text-[#E8DCC1] flex items-center justify-center text-base font-black shadow-sm flex-shrink-0">
                                        {sheet.student_name ? sheet.student_name.charAt(0).toUpperCase() : 'ص'}
                                    </div>
                                    <div className="min-w-0 flex-1">
                                        <h4 className="font-black text-sm text-[#0E3A2E] dark:text-[#E8DCC1] truncate">{sheet.student_name}</h4>
                                        <span className="text-[10px] text-gray-400 dark:text-gray-500 font-bold block mt-1">📅 تاريخ التسليم: {sheet.submitted_at}</span>
                                    </div>
                                </div>

                                <div className="bg-gray-50/60 dark:bg-gray-900/30 p-4 rounded-xl border border-gray-100 dark:border-gray-700 mb-6 space-y-2">
                                    <div className="flex justify-between items-center text-xs">
                                        <span className="text-gray-400 dark:text-gray-500 font-bold">اسم الشيت:</span>
                                        <span className="text-[#0E3A2E] dark:text-[#E8DCC1] font-extrabold">{sheet.sheet_title}</span>
                                    </div>
                                    <div className="flex justify-between items-center text-xs">
                                        <span className="text-gray-400 dark:text-gray-500 font-bold">أسئلة مقالية متبقية:</span>
                                        <span className="bg-red-500/10 text-red-600 dark:text-red-400 px-2 py-0.5 rounded font-black text-[10px]">
                                            ⚠️ {sheet.essay_count} أسئلة مقالية
                                        </span>
                                    </div>
                                </div>

                                <Link
                                    href={route('assistant.sheets.grade.form', sheet.id)}
                                    className="brand-cta w-full py-3 text-xs"
                                >
                                    ✍️ ابدأ تصحيح ورصد الدرجات
                                </Link>
                            </div>
                        ))}
                    </div>
                )}
            </div>
        </AssistantLayout>
    );
}
