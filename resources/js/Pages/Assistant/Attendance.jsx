import React, { useState, useEffect } from 'react';
import { Head, useForm, router } from '@inertiajs/react';
import AssistantLayout from '@/Layouts/AssistantLayout';

<<<<<<< HEAD
const O = '#208ef4'; // برتقالي
const N = '#152c5f'; // كحلي
=======
const O = '#F47C20'; // برتقالي
const N = '#14213D'; // كحلي
>>>>>>> a7d621ecce9a27909d6163081c63c5e4d03bd594
const B = '#DCC9A3'; // ذهبي
const G = '#E5E5E5';

export default function Attendance({ assistant, my_groups = [], students = [], attendance = {}, selected_group, lesson_date }) {
    const [selectedGroup, setSelectedGroup] = useState(selected_group || '');
    const [selectedDate, setSelectedDate] = useState(lesson_date || new Date().toISOString().slice(0, 10));
    
    // خريطة لتخزين حالة حضور الطلاب محلياً لتسريع عملية الرصد التفاعلية
    const [localAttendance, setLocalAttendance] = useState({});

    // تهيئة حالة الحضور عند تحميل الطلاب أو البيانات الجديدة من السيرفر
    useEffect(() => {
        const temp = {};
        students.forEach(student => {
            const record = attendance[student.id];
            temp[student.id] = {
                student_id: student.id,
                status: record?.status || 'absent',
                note: record?.note || '',
            };
        });
        setLocalAttendance(temp);
    }, [students, attendance]);

    const { data, setData, post, processing } = useForm({
        group_id: selected_group,
        lesson_date: lesson_date,
        attendance: []
    });

    // إرسال طلب تصفية البيانات تلقائياً عند تغيير المجموعة أو التاريخ
    const handleFilterChange = (groupId, date) => {
        router.get(route('assistant.attendance'), { group_id: groupId, lesson_date: date }, {
            preserveState: true,
            preserveScroll: true
        });
    };

    const handleStatusToggle = (studentId) => {
        setLocalAttendance(prev => {
            const current = prev[studentId];
            const nextStatus = current.status === 'present' ? 'absent' : 'present';
            return {
                ...prev,
                [studentId]: { ...current, status: nextStatus }
            };
        });
    };

    // رصد وتحديد الكل كـ حاضر أو غائب دفعة واحدة لتسريع عملية السجل
    const handleSelectAll = (status) => {
        setLocalAttendance(prev => {
            const updated = {};
            Object.keys(prev).forEach(id => {
                updated[id] = { ...prev[id], status };
            });
            return updated;
        });
    };

    const handleNoteChange = (studentId, note) => {
        setLocalAttendance(prev => ({
            ...prev,
            [studentId]: { ...prev[studentId], note }
        }));
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        
        // تجهيز مصفوفة البيانات لإرسالها بالـ Form
        const attendanceArray = Object.values(localAttendance);
        
        router.post(route('assistant.attendance.store'), {
            group_id: selectedGroup,
            lesson_date: selectedDate,
            attendance: attendanceArray
        }, {
            onSuccess: () => alert('تم رصد وحفظ سجل الحضور والغياب بنجاح! ✅')
        });
    };

    return (
        <AssistantLayout assistant={assistant} title="📅 تسجيل الحضور والغياب">
            <Head title="تسجيل الحضور — بوابة السكرتارية" />

            <div className="max-w-5xl mx-auto space-y-6 text-right" dir="rtl">
                
                {/* الجزء العلوي: فلاتر المجموعة والتاريخ */}
                <div className="bg-white p-6 rounded-2xl shadow-md border border-gray-100 flex flex-col md:flex-row md:items-end gap-4">
                    <div className="flex-1 space-y-2">
                        <label className="block text-sm font-black text-[#14213D]">اختر المجموعة للتسجيل:</label>
                        <select 
                            value={selectedGroup}
                            onChange={e => { setSelectedGroup(e.target.value); handleFilterChange(e.target.value, selectedDate); }}
                            className="w-full border border-gray-200 rounded-lg p-3 text-sm focus:border-[#F47C20] focus:ring-0"
                        >
                            <option value="" disabled>-- حدد المجموعة --</option>
                            {my_groups.map(group => (
                                <option key={group.id} value={group.id}>{group.name}</option>
                            ))}
                        </select>
                    </div>

                    <div className="flex-1 space-y-2">
                        <label className="block text-sm font-black text-[#14213D]">تاريخ الحصة:</label>
                        <input 
                            type="date"
                            value={selectedDate}
                            onChange={e => { setSelectedDate(e.target.value); handleFilterChange(selectedGroup, e.target.value); }}
                            className="w-full border border-gray-200 rounded-lg p-3 text-sm focus:border-[#F47C20] focus:ring-0 text-center"
                        />
                    </div>
                </div>

                {/* قائمة الطلاب وتفعيل الحضور */}
                {selectedGroup ? (
                    students.length === 0 ? (
                        <div className="bg-white rounded-2xl p-12 text-center border border-gray-100 shadow-md">
                            <span className="text-4xl block mb-2">📭</span>
                            <h3 className="text-lg font-bold text-[#14213D]">لا يوجد طلاب في هذه المجموعة</h3>
                            <p className="text-gray-400 text-sm">تأكد من تفعيل الطلاب الجدد وإضافتهم للمجموعة أولاً.</p>
                        </div>
                    ) : (
                        <form onSubmit={handleSubmit} className="space-y-6">
                            <div className="bg-white rounded-2xl shadow-xl overflow-hidden border border-gray-100">
                                <div className="p-6 border-b border-gray-100 flex justify-between items-center bg-gray-50 flex-wrap gap-4">
                                    <h3 className="text-lg font-black text-[#14213D]">قائمة رصد الغياب والحضور</h3>
                                    <div className="flex space-x-2 rtl:space-x-reverse">
                                        <button 
                                            type="button" 
                                            onClick={() => handleSelectAll('present')}
                                            className="px-4 py-2 border border-green-500 text-green-600 rounded-lg text-xs font-bold hover:bg-green-50 transition"
                                        >
                                            تحديد الكل حاضر ✓
                                        </button>
                                        <button 
                                            type="button" 
                                            onClick={() => handleSelectAll('absent')}
                                            className="px-4 py-2 border border-red-500 text-red-600 rounded-lg text-xs font-bold hover:bg-red-50 transition"
                                        >
                                            تحديد الكل غائب ✕
                                        </button>
                                    </div>
                                </div>

                                <div className="divide-y divide-gray-100">
                                    {students.map((student, idx) => {
                                        const status = localAttendance[student.id]?.status || 'absent';
                                        const isPresent = status === 'present';
                                        
                                        return (
                                            <div 
                                                key={student.id} 
                                                className={`p-6 flex flex-col md:flex-row justify-between items-center gap-4 transition-colors duration-200 ${isPresent ? 'bg-green-50/40' : 'bg-red-50/20'}`}
                                            >
                                                <div className="flex items-center space-x-4 rtl:space-x-reverse">
                                                    <span className="w-8 h-8 rounded-full bg-gray-100 flex items-center justify-center text-xs font-bold text-gray-500">{idx + 1}</span>
                                                    <div>
                                                        <h4 className="text-sm font-black text-[#14213D]">{student.name}</h4>
                                                        <div className="flex space-x-2 rtl:space-x-reverse mt-1">
                                                            <span className="bg-[#DCC9A3] text-[#14213D] text-[10px] font-bold px-2 py-0.5 rounded">كود: {student.center_code || '---'}</span>
                                                            <span className="text-[10px] text-gray-400 font-bold">هاتف: {student.phone}</span>
                                                        </div>
                                                    </div>
                                                </div>

                                                <div className="flex items-center space-x-4 rtl:space-x-reverse w-full md:w-auto">
                                                    <input 
                                                        type="text" 
                                                        placeholder="إضافة ملاحظة عن الطالب..."
                                                        value={localAttendance[student.id]?.note || ''}
                                                        onChange={e => handleNoteChange(student.id, e.target.value)}
                                                        className="flex-1 md:w-60 border border-gray-200 rounded-lg p-2 text-xs focus:border-[#F47C20]"
                                                    />

                                                    {/* زر التبديل التفاعلي الملون (حاضر / غائب) */}
                                                    <button
                                                        type="button"
                                                        onClick={() => handleStatusToggle(student.id)}
                                                        className="px-6 py-2 rounded-full font-black text-xs transition duration-300 w-24 text-center border-2"
                                                        style={{
                                                            backgroundColor: isPresent ? '#059669' : 'transparent',
                                                            borderColor: isPresent ? '#059669' : '#EF4444',
                                                            color: isPresent ? '#fff' : '#EF4444'
                                                        }}
                                                    >
                                                        {isPresent ? '✓ حاضر' : '✕ غائب'}
                                                    </button>
                                                </div>
                                            </div>
                                        );
                                    })}
                                </div>

                                {/* زر الحفظ النهائي */}
                                <div className="p-6 bg-gray-50 border-t border-gray-100 text-center">
                                    <button 
                                        type="submit"
                                        disabled={processing}
                                        className="bg-green-600 text-white px-10 py-4 rounded-xl font-black text-sm hover:bg-green-700 transition shadow-lg inline-block"
                                    >
                                        {processing ? 'جاري رصد السجل...' : 'حفظ سجل حضور الحصة 💾'}
                                    </button>
                                </div>
                            </div>
                        </form>
                    )
                ) : (
                    <div className="text-center py-20 text-gray-300">
                        <span className="text-6xl block mb-4">📅</span>
                        <h3 className="text-lg font-bold text-gray-400">يرجى اختيار المجموعة أولاً لعرض الحضور</h3>
                    </div>
                )}

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