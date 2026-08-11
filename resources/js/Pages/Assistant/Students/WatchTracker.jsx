import React, { useState, useEffect } from 'react';
import { Head, useForm, router } from '@inertiajs/react';
import AssistantLayout from '@/Layouts/AssistantLayout';

<<<<<<< HEAD
const O = '#208ef4'; // برتقالي
=======
const O = '#F47C20'; // برتقالي
>>>>>>> a7d621ecce9a27909d6163081c63c5e4d03bd594
const N = '#14213D'; // كحلي

export default function WatchTracker({ assistant, never_watched_students = [], partially_watched_students = [], filters = {} }) {
    const [search, setSearch] = useState(filters.search || '');
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
        router.get(route('assistant.watch-tracker'), { search }, {
            preserveState: true,
            preserveScroll: true
        });
    };

    const bgCard = darkMode ? '#152238' : '#ffffff';
    const borderCard = darkMode ? '1px solid rgba(220,201,163,0.15)' : '1px solid #e8edf5';
    const borderCell = darkMode ? '1px solid rgba(255,255,255,0.05)' : '1px solid #f1f5f9';
    const textMain = darkMode ? '#f8f9fa' : '#14213D';
    const textMuted = darkMode ? '#94a3b8' : '#64748b';
    const bgRowHover = darkMode ? 'rgba(255,255,255,0.02)' : '#fafbff';

    const theme = { darkMode, bgCard, borderCard, borderCell, textMain, textMuted, bgRowHover };

    return (
        <AssistantLayout assistant={assistant} title="🎬 تتبع نسب مشاهدات الطلاب">
            <Head title="تتبع المشاهدات — بوابة السكرتارية" />

            <div className="max-w-6xl mx-auto space-y-6 text-right" dir="rtl" style={{ fontFamily: 'Cairo, sans-serif' }}>
                
                {/* مربع البحث التفاعلي الفخم */}
                <div className="bg-white dark:bg-[#152238] p-6 rounded-2xl shadow-md border border-gray-100 dark:border-gray-800 transition-colors duration-300">
                    <form onSubmit={handleSearchSubmit} className="flex flex-col md:flex-row items-center gap-4">
                        <div className="flex-1 space-y-2 w-full">
                            <label className="block text-sm font-black text-[#14213D] dark:text-[#f8f9fa]">البحث باسم الطالب أو الهاتف المقصر:</label>
                            <input 
                                type="text"
                                value={search}
                                onChange={e => setSearch(e.target.value)}
                                placeholder="ابحث باسم الطالب، أو الهاتف لمتابعته هاتفياً..."
                                className="w-full border border-gray-200 dark:border-gray-800 bg-white dark:bg-[#0e1726] text-[#14213D] dark:text-white rounded-lg p-3 text-sm focus:border-[#F47C20] focus:ring-0 outline-none transition"
                            />
                        </div>
                        <button type="submit" className="w-full md:w-auto bg-[#14213D] text-white px-8 py-3 rounded-xl font-black text-sm hover:bg-[#F47C20] transition shadow-md self-end">
                            البحث الفوري 🔍
                        </button>
                    </form>
                </div>

                {/* ── 1. فئة: طلاب لم يفتحوا الفيديوهات نهائياً (0% مشاهدة) مع أزرار تواصل تفاعلية ── */}
                <div style={{ background: bgCard, borderRadius: 16, border: borderCard, boxShadow: '0 4px 20px rgba(0,0,0,.02)', overflow: 'hidden', transition: 'all 0.3s ease' }}>
                    <div style={{ padding: '18px 24px', borderBottom: borderCell, display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                        <h3 style={{ color: '#ef4444', fontSize: 16, fontWeight: 800, display: 'flex', alignItems: 'center', gap: 8 }}>
                            <span style={{ background: 'rgba(239,68,68,.1)', color: '#dc2626', borderRadius: 8, padding: '4px 8px', fontSize: 18 }}>🎬</span>
                            طلاب لم يفتحوا الفيديوهات نهائياً (0%) ⚠️
                            <span style={{ background: '#dc2626', color: '#fff', borderRadius: 20, padding: '2px 10px', fontSize: 12, fontWeight: 700 }}>
                                {never_watched_students.length}
                            </span>
                        </h3>
                    </div>

                    {never_watched_students.length === 0 ? (
                        <div style={{ padding: '48px 24px', textAlign: 'center' }}>
                            <div style={{ fontSize: 48, marginBottom: 12 }}>🎉</div>
                            <div style={{ color: '#16a34a', fontWeight: 700, fontSize: 16 }}>ممتاز! جميع الطلاب فتحوا الفيديوهات</div>
                        </div>
                    ) : (
                        <div style={{ overflowX: 'auto' }}>
                            <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: 14 }}>
                                <thead>
                                    <tr style={{ background: darkMode ? '#101c2c' : '#f8fafc' }}>
                                        <th style={{ padding: '12px 16px', color: '#64748b', fontWeight: 700, fontSize: 12, textAlign: 'center', width: 52 }}>الصورة</th>
                                        <th style={{ padding: '12px 8px', color: '#64748b', fontWeight: 700, fontSize: 12, textAlign: 'right' }}>اسم الطالب</th>
                                        <th style={{ padding: '12px 8px', color: '#64748b', fontWeight: 700, fontSize: 12 }}>المجموعة</th>
                                        <th style={{ padding: '12px 8px', color: '#64748b', fontWeight: 700, fontSize: 12 }}>حالة المشاهدة</th>
                                        <th style={{ padding: '12px 16px', color: '#64748b', fontWeight: 700, fontSize: 12 }}>متابعة سريعة (واتساب)</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {never_watched_students.map((student, i) => (
                                        <UnwatchedRow key={student.id} student={student} index={i} theme={theme} />
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    )}
                </div>

                {/* ── 2. فئة: طلاب شاهدوا أقل من 90% (مشاهدة ناقصة) مع أزرار تواصل تفاعلية ── */}
                <div style={{ background: bgCard, borderRadius: 16, border: borderCard, boxShadow: '0 4px 20px rgba(0,0,0,.02)', overflow: 'hidden', transition: 'all 0.3s ease' }}>
                    <div style={{ padding: '18px 24px', borderBottom: borderCell, display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                        <h3 style={{ color: '#f97316', fontSize: 16, fontWeight: 800, display: 'flex', alignItems: 'center', gap: 8 }}>
                            <span style={{ background: 'rgba(249,115,22,.1)', color: '#ea580c', borderRadius: 8, padding: '4px 8px', fontSize: 18 }}>🎬</span>
                            طلاب لم يكملوا مشاهدة الفيديوهات (أقل من 90%) ⏳
                            <span style={{ background: '#ea580c', color: '#fff', borderRadius: 20, padding: '2px 10px', fontSize: 12, fontWeight: 700 }}>
                                {partially_watched_students.length}
                            </span>
                        </h3>
                    </div>

                    {partially_watched_students.length === 0 ? (
                        <div style={{ padding: '48px 24px', textAlign: 'center' }}>
                            <div style={{ fontSize: 48, marginBottom: 12 }}>🎉</div>
                            <div style={{ color: '#16a34a', fontWeight: 700, fontSize: 16 }}>ممتاز! جميع الطلاب أكملوا المشاهدة</div>
                        </div>
                    ) : (
                        <div style={{ overflowX: 'auto' }}>
                            <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: 14 }}>
                                <thead>
                                    <tr style={{ background: darkMode ? '#101c2c' : '#f8fafc' }}>
                                        <th style={{ padding: '12px 16px', color: '#64748b', fontWeight: 700, fontSize: 12, textAlign: 'center', width: 52 }}>الصورة</th>
                                        <th style={{ padding: '12px 8px', color: '#64748b', fontWeight: 700, fontSize: 12, textAlign: 'right' }}>اسم الطالب</th>
                                        <th style={{ padding: '12px 8px', color: '#64748b', fontWeight: 700, fontSize: 12 }}>المجموعة</th>
                                        <th style={{ padding: '12px 16px', color: '#64748b', fontWeight: 700, fontSize: 12 }}>نسبة المشاهدة</th>
                                        <th style={{ padding: '12px 16px', color: '#64748b', fontWeight: 700, fontSize: 12 }}>متابعة سريعة (واتساب)</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {partially_watched_students.map((student, i) => (
                                        <UnwatchedRow key={student.id} student={student} index={i} theme={theme} />
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    )}
                </div>

            </div>
        </AssistantLayout>
    );
}

function UnwatchedRow({ student, index, theme }) {
    const pct = student.watch_percent ?? 0;
    const barColor = pct === 0 ? '#ef4444' : pct < 50 ? '#f97316' : '#eab308';
    const initials = student.name ? student.name.split(' ').map(w => w[0]).slice(0, 2).join('') : '?';

    const studentMsg = `أهلاً يا بطل 👋 بخصوص متابعتك مع منصة مستر محمد الصيفي في مادة التاريخ، يرجى شد حيلك وإنهاء مشاهدة المحاضرة الأخيرة وحل الاختبار الدوري المرفق بها لتجنب تراكم المنهج عليك. بالتوفيق! 🏛️`;
    const parentMsg = `السلام عليكم ورحمة الله وبركاته مع حضرتك سكرتارية منصة مستر محمد الصيفي لتدريس التاريخ. نود إحاطة علم سيادتكم بأن الطالب لم يكمل مشاهدة المحاضرة الأخيرة على المنصة حتى الآن. يرجى حثه ومتابعته لإنهاء المحاضرة وحل الاختبار المرفق بها لضمان استمرار تفوقه الدراسي. شكراً لتعاونكم! 🏛️`;

    return (
        <tr style={{ borderBottom: theme.borderCell, transition: 'background .15s', animation: `fadeInUp .3s ${index * 0.04}s both` }}
            onMouseEnter={e => e.currentTarget.style.background = theme.bgRowHover}
            onMouseLeave={e => e.currentTarget.style.background = 'transparent'}
        >
            <td style={{ padding: '12px 16px', textAlign: 'center' }}>
                <div style={{ width: 36, height: 36, borderRadius: '50%', background: `linear-gradient(135deg, ${O}, #e8641a)`, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 12, fontWeight: 900, color: '#fff', margin: '0 auto' }}>
                    {initials}
                </div>
            </td>
            <td style={{ padding: '12px 8px', fontWeight: 700, color: theme.textMain, fontSize: 13, textAlign: 'right' }}>
                <div>{student.name}</div>
                <div className="flex space-x-2 rtl:space-x-reverse text-[10px] text-gray-400 font-normal mt-1">
                    <span>📱 {student.phone}</span>
                    <span>• 🛡️ ولي الأمر: {student.parent_phone || '—'}</span>
                </div>
            </td>
            <td style={{ padding: '12px 8px', color: theme.textMain, fontSize: 12 }}>
                <span className="bg-[#14213D]/10 dark:bg-white/10 text-[#14213D] dark:text-white px-3 py-1 rounded-full text-[10px]">{student.group_name}</span>
            </td>
            <td style={{ padding: '12px 16px', minWidth: 140 }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                    <div style={{ height: 6, background: '#F1F5F9', borderRadius: 99, overflow: 'hidden', flex: 1 }}>
                        <div style={{ height: '100%', width: `${pct}%`, background: barColor, borderRadius: 99, transition: 'width 1s ease' }} />
                    </div>
                    <span style={{ fontSize: 11, color: barColor, fontWeight: 800, flexShrink: 0 }}>
                        {pct == 0 ? '❌ 0%' : `⏳ ${pct}%`}
                    </span>
                </div>
            </td>
            <td style={{ padding: '12px 16px', textAlign: 'center' }}>
                <div className="flex justify-center gap-2">
                    <a href={`https://wa.me/20${student.phone}?text=${encodeURIComponent(studentMsg)}`} target="_blank" rel="noopener noreferrer" className="px-3.5 py-1.5 bg-[#25D366] text-white rounded-lg font-bold text-[10px] hover:bg-green-600 transition flex items-center gap-1 shadow-sm">
                        💬 الطالب
                    </a>
                    {student.parent_phone && (
                        <a href={`https://wa.me/20${student.parent_phone}?text=${encodeURIComponent(parentMsg)}`} target="_blank" rel="noopener noreferrer" className="px-3.5 py-1.5 bg-[#F47C20] text-white rounded-lg font-bold text-[10px] hover:bg-[#d96a12] transition flex items-center gap-1 shadow-sm">
                            🛡️ ولي الأمر
                        </a>
                    )}
                </div>
            </td>
        </tr>
    );
}

function GoogleFonts() {
    return (
        <link href="https://fonts.googleapis.com/css2?family=Cairo:wght@400;600;700;800;900&display=swap" rel="stylesheet" />
    );
}