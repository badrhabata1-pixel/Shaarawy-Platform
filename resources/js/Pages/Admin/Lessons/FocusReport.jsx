import AdminLayout from '@/Layouts/AdminLayout';
import { Head, Link } from '@inertiajs/react';

const O = '#1F5A45';

const STATUS = {
    correct:     { label: '✅ صح',      bg: 'rgba(16,185,129,.15)',  color: '#10B981' },
    wrong:       { label: '❌ غلط',     bg: 'rgba(239,68,68,.15)',   color: '#EF4444' },
    unanswered:  { label: '⏭ لم يجب',  bg: 'rgba(245,158,11,.15)',  color: '#F59E0B' },
    not_reached: { label: '—',           bg: 'transparent',           color: 'var(--a-text-4)' },
};

function getStatus(answer) {
    if (!answer)             return STATUS.not_reached;
    if (!answer.is_answered) return STATUS.unanswered;
    return answer.is_correct ? STATUS.correct : STATUS.wrong;
}

export default function FocusReport({ lesson, byStudent, auth }) {
    const totalStudents = byStudent.length;
    const avgAnswered   = totalStudents
        ? (byStudent.reduce((sum, s) => sum + s.answers.filter(a => a.is_answered).length, 0) / totalStudents).toFixed(1)
        : 0;
    const allFour   = byStudent.filter(s => s.answers.filter(a => a.is_answered).length === 4).length;
    const nonAnswer = byStudent.filter(s => s.answers.every(a => !a.is_answered)).length;

    return (
        <AdminLayout auth={auth} title={`تقرير التركيز — ${lesson.title}`}>
            <Head title={`تقرير التركيز — ${lesson.title}`} />

            <div style={{ direction: 'rtl', fontFamily: 'Cairo, sans-serif' }}>

                {/* ── Header ── */}
                <div style={{ marginBottom: 28 }}>
                    <div style={{ fontSize: 12, color: 'var(--a-text-4)', marginBottom: 4 }}>
                        <Link href="/admin/video-questions" style={{ color: O, textDecoration: 'none' }}>
                            أسئلة التركيز
                        </Link>
                        {' / '}
                        <span style={{ color: 'var(--a-text-3)' }}>تقرير التركيز</span>
                    </div>
                    <h1 style={{ color: 'var(--a-text)', fontWeight: 900, fontSize: 20, marginBottom: 4 }}>
                        {lesson.title}
                    </h1>
                    <p style={{ color: 'var(--a-text-4)', fontSize: 13 }}>
                        تقرير أسئلة الفيديو التفاعلية — إجابة كل طالب على كل نقطة توقف
                    </p>
                </div>

                {/* ── Summary cards ── */}
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
                    {[
                        { label: 'إجمالي الطلاب',           value: totalStudents, icon: '👥' },
                        { label: 'متوسط الإجابات / طالب',   value: `${avgAnswered}/4`, icon: '📊' },
                        { label: 'أجابوا على كل الأسئلة',   value: allFour,       icon: '🎯' },
                        { label: 'لم يجيبوا على أي سؤال',   value: nonAnswer,     icon: '⚠️' },
                    ].map((c, i) => (
                        <div key={i} style={{
                            background: 'var(--a-card)',
                            border: '1px solid var(--a-border)',
                            borderRadius: 16, padding: '1.1rem',
                            boxShadow: '0 1px 6px var(--a-shadow)',
                            textAlign: 'center',
                        }}>
                            <div style={{ fontSize: 26, marginBottom: 6 }}>{c.icon}</div>
                            <div style={{ color: O, fontSize: 22, fontWeight: 900 }}>{c.value}</div>
                            <div style={{ color: 'var(--a-text-4)', fontSize: 11, marginTop: 4, lineHeight: 1.4 }}>{c.label}</div>
                        </div>
                    ))}
                </div>

                {/* ── Legend ── */}
                <div style={{ display: 'flex', flexWrap: 'wrap', gap: 10, marginBottom: 20 }}>
                    {Object.values(STATUS).map((s, i) => (
                        <span key={i} style={{
                            background: s.bg || 'var(--a-card-2)',
                            color: s.color,
                            border: '1px solid var(--a-border)',
                            padding: '3px 12px', borderRadius: 20,
                            fontSize: 11, fontWeight: 700,
                        }}>
                            {s.label || 'لم يصل بعد'}
                        </span>
                    ))}
                </div>

                {/* ── Table ── */}
                {byStudent.length === 0 ? (
                    <div style={{
                        background: 'var(--a-card)',
                        border: '1px solid var(--a-border)',
                        borderRadius: 18, padding: '4rem',
                        textAlign: 'center', boxShadow: '0 1px 6px var(--a-shadow)',
                    }}>
                        <div style={{ fontSize: 48, marginBottom: 12 }}>📭</div>
                        <p style={{ color: 'var(--a-text-4)', fontWeight: 600 }}>
                            لا توجد بيانات بعد — لم يشاهد أي طالب هذه المحاضرة حتى الآن
                        </p>
                    </div>
                ) : (
                    <div style={{
                        background: 'var(--a-card)',
                        border: '1px solid var(--a-border)',
                        borderRadius: 18,
                        boxShadow: '0 1px 6px var(--a-shadow)',
                        overflow: 'hidden',
                    }}>
                        <div style={{ overflowX: 'auto' }}>
                            <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: 13 }}>
                                <thead>
                                    <tr style={{ background: 'var(--a-thead)', color: 'var(--a-thead-text)' }}>
                                        <th style={{ padding: '12px 16px', textAlign: 'right', fontWeight: 700, fontSize: 12 }}>الطالب</th>
                                        <th style={{ padding: '12px 16px', textAlign: 'right', fontWeight: 700, fontSize: 12 }}>التليفون</th>
                                        {[1,2,3,4].map(n => (
                                            <th key={n} style={{ padding: '12px 16px', textAlign: 'center', fontWeight: 700, fontSize: 12 }}>
                                                سؤال {n}
                                                <div style={{ fontSize: 10, opacity: .6, fontWeight: 500 }}>
                                                    {['٢٥%','٥٠%','٧٥%','٩٠%'][n-1]}
                                                </div>
                                            </th>
                                        ))}
                                        <th style={{ padding: '12px 16px', textAlign: 'center', fontWeight: 700, fontSize: 12 }}>الإجمالي</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {byStudent.map(student => {
                                        const answeredCount = student.answers.filter(a => a.is_answered).length;
                                        const correctCount  = student.answers.filter(a => a.is_correct).length;
                                        const focusPct      = Math.round((answeredCount / 4) * 100);
                                        const pctColor      = focusPct >= 75 ? '#10B981' : focusPct >= 50 ? O : '#EF4444';

                                        return (
                                            <tr key={student.id} style={{ borderBottom: '1px solid var(--a-border-2)', transition: 'background .15s' }}
                                                onMouseEnter={e => e.currentTarget.style.background = 'var(--a-row-hover)'}
                                                onMouseLeave={e => e.currentTarget.style.background = 'transparent'}
                                            >
                                                <td style={{ padding: '12px 16px', color: 'var(--a-text)', fontWeight: 600 }}>
                                                    {student.name}
                                                </td>
                                                <td style={{ padding: '12px 16px', color: 'var(--a-text-4)', fontSize: 12, direction: 'ltr', textAlign: 'right' }}>
                                                    {student.phone}
                                                </td>

                                                {[1,2,3,4].map(pos => {
                                                    const ans = student.answers.find(a => a.position === pos);
                                                    const st  = getStatus(ans);
                                                    return (
                                                        <td key={pos} style={{ padding: '10px 14px', textAlign: 'center' }}>
                                                            <span style={{
                                                                display: 'inline-block',
                                                                padding: '3px 10px', borderRadius: 20,
                                                                background: st.bg, color: st.color,
                                                                fontSize: 11, fontWeight: 700,
                                                                whiteSpace: 'nowrap',
                                                            }}>
                                                                {st.label}
                                                            </span>
                                                            {ans?.answered && (
                                                                <div style={{ color: 'var(--a-text-4)', fontSize: 10, marginTop: 2 }}>
                                                                    {ans.answered}
                                                                </div>
                                                            )}
                                                        </td>
                                                    );
                                                })}

                                                <td style={{ padding: '12px 16px', textAlign: 'center' }}>
                                                    <div style={{ fontSize: 15, fontWeight: 900, color: pctColor }}>
                                                        {focusPct}%
                                                    </div>
                                                    <div style={{ color: 'var(--a-text-4)', fontSize: 11, marginTop: 2 }}>
                                                        {correctCount}/{answeredCount} صح
                                                    </div>
                                                </td>
                                            </tr>
                                        );
                                    })}
                                </tbody>
                            </table>
                        </div>
                    </div>
                )}
            </div>
        </AdminLayout>
    );
}
