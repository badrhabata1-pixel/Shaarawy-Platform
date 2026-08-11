import React, { useState, useEffect } from 'react';
import { Head, useForm, Link, router } from '@inertiajs/react';
import AssistantLayout from '@/Layouts/AssistantLayout';

const O = '#208ef4';
const N = '#14213D';

export default function GradeExamForm({ assistant, examResult, responses = [] }) {
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

    const [localGrades, setLocalGrades] = useState(() => {
        const temp = {};
        responses.forEach(r => {
            temp[r.id] = {
                response_id: r.id,
                is_correct: r.is_correct,
                teacher_note: r.teacher_note || '',
                max_marks: r.max_marks
            };
        });
        return temp;
    });

    const [manualScore, setManualScore] = useState(examResult.current_score || 0);
    const { processing } = useForm();

    const handleStatusChange = (responseId, isCorrect) => {
        setLocalGrades(prev => {
            const current = prev[responseId];
            return {
                ...prev,
                [responseId]: { ...current, is_correct: isCorrect }
            };
        });

        let tempScore = 0;
        Object.keys(localGrades).forEach(id => {
            const gradeItem = localGrades[id];
            const isItemCorrect = id == responseId ? isCorrect : gradeItem.is_correct;
            if (isItemCorrect) {
                tempScore += gradeItem.max_marks;
            }
        });
        setManualScore(tempScore);
    };

    const handleNoteChange = (responseId, note) => {
        setLocalGrades(prev => ({
            ...prev,
            [responseId]: { ...prev[responseId], teacher_note: note }
        }));
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        
        const gradesArray = Object.values(localGrades);
        
        router.post(route('assistant.exams.grade.save', examResult.id), {
            grades: gradesArray,
            manual_total_score: parseInt(manualScore),
        }, {
            onSuccess: () => alert('تم تعديل وحفظ ورقة إجابة ورصد درجات الطالب بنجاح! ✅')
        });
    };

    return (
        <AssistantLayout assistant={assistant} title="📝 مراجعة ورصد درجات الامتحان">
            <Head title="رصد درجات الامتحان الدوري — بوابة السكرتارية" />

            <div className="max-w-4xl mx-auto space-y-6 text-right" dir="rtl" style={{ fontFamily: 'Cairo, sans-serif' }}>
                
                {/* ترويسة تفاصيل ورقة الطالب */}
                <div className="bg-white p-6 rounded-2xl shadow-md border border-gray-100 flex justify-between items-center flex-wrap gap-4">
                    <div>
                        <span className="text-xs text-gray-400 font-bold block mb-1">تفاصيل ورقة إجابة الطالب المقيد</span>
                        <h2 className="text-xl font-black text-[#14213D]">{examResult.student_name}</h2>
                        <span className="text-xs font-bold text-gray-500 mt-1 block">الامتحان: {examResult.exam_title}</span>
                    </div>
                    <div className="text-left">
                        <span className="text-xs text-gray-400 font-bold block mb-1">درجة الطالب الحالية:</span>
                        <span className="text-2xl font-black text-[#F47C20]">{examResult.current_score} / {examResult.total_marks}</span>
                    </div>
                </div>

                <form onSubmit={handleSubmit} className="space-y-6">
                    {responses.map((q, idx) => {
                        const gradeItem = localGrades[q.id] || { is_correct: false, teacher_note: '' };
                        const isCorrect = gradeItem.is_correct;

                        return (
                            <div key={q.id} className="bg-white p-6 rounded-2xl shadow-md border border-gray-100 space-y-4">
                                <div className="flex justify-between items-center border-b pb-3 flex-wrap gap-3">
                                    <h3 className="font-black text-sm text-[#14213D] flex items-center gap-2">
                                        <span className="w-6 h-6 rounded-full bg-[#14213D] text-[#DCC9A3] text-xs font-bold flex items-center justify-center">{idx + 1}</span>
                                        {q.question_text}
                                    </h3>
                                    <span className="text-xs font-black text-red-600">درجة السؤال: {q.max_marks}</span>
                                </div>

                                <div className="grid md:grid-cols-2 gap-4">
                                    <div className="space-y-1">
                                        <span className="text-xs font-bold text-gray-400">إجابة الطالب المدخلة:</span>
                                        <div className="p-3 border rounded-lg bg-gray-50 font-bold text-xs text-gray-900" style={{ minHeight: 60 }}>
                                            {q.student_answer}
                                        </div>
                                    </div>
                                    <div className="space-y-1">
                                        <span className="text-xs font-bold text-gray-400">الإجابة النموذجية المعتمدة:</span>
                                        <div className="p-3 border border-green-200 rounded-lg bg-green-50/50 text-green-700 font-bold text-xs" style={{ minHeight: 60 }}>
                                            {q.model_answer}
                                        </div>
                                    </div>
                                </div>

                                {/* أزرار التعديل الفورية على تصحيح السؤال مع توحيد لون الخط الأسود */}
                                <div className="flex flex-col md:flex-row items-center gap-4 bg-gray-50/60 p-4 rounded-xl border border-gray-100">
                                    <span className="text-xs font-bold text-gray-500">تعديل التقييم:</span>
                                    <div className="flex space-x-2 rtl:space-x-reverse">
                                        <button 
                                            type="button"
                                            onClick={() => handleStatusChange(q.id, true)}
                                            className={`px-4 py-2 rounded-lg font-bold text-xs transition ${isCorrect ? 'bg-green-600 text-white' : 'border border-green-500 text-green-600'}`}
                                        >
                                            إجابة صحيحة (✓)
                                        </button>
                                        <button 
                                            type="button"
                                            onClick={() => handleStatusChange(q.id, false)}
                                            className={`px-4 py-2 rounded-lg font-bold text-xs transition ${!isCorrect ? 'bg-red-600 text-white' : 'border border-red-500 text-red-500'}`}
                                        >
                                            إجابة خاطئة (✕)
                                        </button>
                                    </div>

                                    {/* حقل التعليق بلون خط أسود داكن وواضح جداً في النهار وأبيض في المظهر الليلي */}
                                    <input 
                                        type="text" 
                                        placeholder="إضافة تعليق مخصص على هذا السؤال..."
                                        value={gradeItem.teacher_note}
                                        onChange={e => handleNoteChange(q.id, e.target.value)}
                                        className="flex-1 border border-gray-200 bg-white dark:bg-[#0e1726] text-gray-900 dark:text-white rounded-lg p-2 text-xs focus:border-[#F47C20] focus:ring-0 outline-none transition font-bold"
                                    />
                                </div>
                            </div>
                        );
                    })}

                    {/* لوحة التحكم وإعادة رصد الدرجة الكلية يدوياً كلياً مع توحيد لون الخط الأسود */}
                    <div className="bg-white p-6 rounded-2xl shadow-xl border-t-8 border-green-500 flex flex-col md:flex-row justify-between items-center gap-6">
                        <div className="space-y-1">
                            <h3 className="font-black text-sm text-[#14213D]">الالدرجة الكلية النهائية المرصودة يدوياً:</h3>
                            <p className="text-xs text-gray-400">يمكنك تعديل هذه الخانة وكتابة الدرجة التي تراها مناسبة مباشرة بيدك.</p>
                        </div>
                        <div className="flex items-center gap-3">
                            <span className="text-xs font-bold text-gray-400">درجة الطالب:</span>
                            <input 
                                type="number" 
                                min="0"
                                max={examResult.total_marks}
                                value={manualScore}
                                onChange={e => setManualScore(e.target.value)}
                                className="w-24 text-center border-2 border-green-500 bg-white dark:bg-[#0e1726] text-gray-900 dark:text-white rounded-xl p-3 text-lg font-black focus:ring-0 focus:border-green-600 transition"
                            />
                            <span className="text-lg font-black text-gray-400">من {examResult.total_marks}</span>
                        </div>
                    </div>

                    {/* زر الحفظ النهائي */}
                    <div className="pt-2">
                        <button 
                            type="submit"
                            disabled={processing}
                            className="w-full bg-[#14213D] text-white py-4 rounded-xl font-black text-sm hover:bg-[#F47C20] transition duration-300 shadow-md"
                        >
                            {processing ? 'جاري حفظ ورصد الدرجات يدوياً...' : 'حفظ التعديلات ورصد الدرجة الكلية بنجاح 💾'}
                        </button>
                    </div>
                </form>
            </div>
        </AssistantLayout>
    );
}

function GoogleFonts() {
    return (
        <link href="https://fonts.googleapis.com/css2?family=Cairo:wght@400;600;700;800;900&display=swap" rel="stylesheet" />
    );
}

