import React, { useState } from 'react';
import { Head, useForm } from '@inertiajs/react';
import AssistantLayout from '@/Layouts/AssistantLayout';

const O = '#1F5A45'; // برتقالي
const N = '#0E3A2E'; // كحلي
const B = '#E8DCC1'; // ذهبي

export default function PromoCodes({ assistant, promo_codes = [], lessons = [] }) {
    const [amount, setAmount] = useState(10);
    const [selectedLesson, setSelectedGroup] = useState('');

    const { data, setData, post, processing, errors, reset } = useForm({
        amount: 10,
        lesson_id: '',
    });

    const handleSubmit = (e) => {
        e.preventDefault();
        post(route('admin.promo.generate'), {
            onSuccess: () => {
                alert('🎉 تم توليد أكواد الشحن بنجاح!');
                reset();
            }
        });
    };

    const handleDelete = (id) => {
        if (confirm('🚨 هل أنت متأكد من حذف هذا الكود نهائياً؟ لن يتمكن الطالب من شحن المحاضرة به.')) {
            // إرسال طلب حذف الكود
            router.delete(route('admin.promo.destroy', id));
        }
    };

    return (
        <AssistantLayout assistant={assistant} title="🎫 أكواد شحن وتفعيل المحاضرات">
            <Head title="أكواد الشحن — بوابة السكرتارية" />

            <div className="max-w-5xl mx-auto space-y-6 text-right" dir="rtl" style={{ fontFamily: 'Cairo, sans-serif' }}>

                {/* 1. لوحة توليد أكواد جديدة (Generate Panel) */}
                <div className="bg-white p-6 md:p-8 rounded-2xl shadow-xl border-t-8 border-[#C9A96A] relative overflow-hidden">
                    <div className="absolute -bottom-6 -left-6 text-8xl opacity-5 pointer-events-none">🎫</div>

                    <h3 className="text-lg font-black text-[#0E3A2E] mb-6 border-b pb-3">توليد أكواد شحن جديدة لطلاب السناتر</h3>

                    <form onSubmit={handleSubmit} className="grid md:grid-cols-3 gap-6 items-end">
                        <div className="space-y-2">
                            <label className="block text-sm font-black text-[#0E3A2E]">عدد الأكواد المطلوبة:</label>
                            <input
                                type="number"
                                min="1"
                                max="100"
                                value={data.amount}
                                onChange={e => setData('amount', e.target.value)}
                                className="w-full border border-gray-200 rounded-lg p-3 text-sm focus:border-[#C9A96A] focus:ring-0 text-center font-bold"
                            />
                            {errors.amount && <p className="text-red-500 text-xs mt-1">⚠️ {errors.amount}</p>}
                        </div>

                        <div className="space-y-2">
                            <label className="block text-sm font-black text-[#0E3A2E]">المحاضرة المراد ربط الكود بها:</label>
                            <select
                                value={data.lesson_id}
                                onChange={e => setData('lesson_id', e.target.value)}
                                className="w-full border border-gray-200 rounded-lg p-3 text-sm focus:border-[#C9A96A] focus:ring-0"
                            >
                                <option value="">-- كود عام (يشحن أي كورس) --</option>
                                {lessons.map(lesson => (
                                    <option key={lesson.id} value={lesson.id}>{lesson.title}</option>
                                ))}
                            </select>
                            {errors.lesson_id && <p className="text-red-500 text-xs mt-1">⚠️ {errors.lesson_id}</p>}
                        </div>

                        <button
                            type="submit"
                            disabled={processing}
                            className="brand-cta py-4 text-sm disabled:opacity-50"
                        >
                            {processing ? 'جاري توليد الأكواد...' : 'توليد الأكواد العشوائية ⚡'}
                        </button>
                    </form>
                </div>

                {/* 2. جدول استعراض وحذف الأكواد (Promo Codes List) */}
                <div className="bg-white rounded-2xl shadow-xl overflow-hidden border border-gray-100">
                    <div className="p-6 border-b border-gray-100 flex justify-between items-center bg-gray-50 flex-wrap gap-4">
                        <div>
                            <h3 className="text-base font-black text-[#0E3A2E]">أكواد الشحن النشطة بالمنصة</h3>
                            <p className="text-xs text-gray-500 mt-1">يمكن للطلاب استخدام هذه الأكواد لتفعيل محاضراتهم المغلقة يدوياً</p>
                        </div>
                        <div style={{
                            background: `${O}15`, border: `1.5px solid ${O}40`,
                            borderRadius: 20, padding: '6px 18px',
                            color: O, fontSize: 13, fontWeight: 800,
                        }}>
                            {promo_codes.length} كود تفعيل متاح
                        </div>
                    </div>

                    <div className="overflow-x-auto">
                        <table className="w-full text-center border-collapse text-xs">
                            <thead>
                                <tr className="bg-gray-100 text-[#0E3A2E] font-black border-b border-gray-100">
                                    <th className="p-4">#</th>
                                    <th className="p-4">كود التفعيل (Promo Code)</th>
                                    <th className="p-4">المحاضرة المرتبطة</th>
                                    <th className="p-4">حالة الاستخدام</th>
                                    <th className="p-4">الإجراء</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-gray-100 font-medium">
                                {promo_codes.length === 0 ? (
                                    <tr>
                                        <td colSpan="5" className="p-12 text-gray-400">
                                            <span className="text-4xl block mb-2">🎫</span>
                                            لا توجد أكواد تفعيل نشطة حالياً. قم بتوليد أكواد من الأعلى.
                                        </td>
                                    </tr>
                                ) : (
                                    promo_codes.map((promo, idx) => (
                                        <tr key={promo.id} className="hover:bg-gray-50/50 transition">
                                            <td className="p-4 text-gray-400">{idx + 1}</td>
                                            <td className="p-4 font-black text-sm tracking-wider text-[#0E3A2E]" style={{ direction: 'ltr' }}>
                                                {promo.code}
                                            </td>
                                            <td className="p-4 text-[#0E3A2E] font-bold">
                                                {promo.lesson_title || '🏷️ كود عام لمشاهدة أي مقرر'}
                                            </td>
                                            <td className="p-4">
                                                {promo.is_used ? (
                                                    <span className="bg-red-500/10 text-red-600 px-3 py-1 rounded-full font-bold">✕ تم الشحن</span>
                                                ) : (
                                                    <span className="bg-green-500/10 text-green-600 px-3 py-1 rounded-full font-bold">✓ متاح للشحن</span>
                                                )}
                                            </td>
                                            <td className="p-4">
                                                <button
                                                    onClick={() => handleDelete(promo.id)}
                                                    className="w-8 h-8 rounded-full bg-red-50 text-red-500 hover:bg-red-100 transition flex items-center justify-center mx-auto"
                                                    title="حذف الكود نهائياً"
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
