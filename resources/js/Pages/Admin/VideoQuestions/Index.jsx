import AdminLayout from '@/Layouts/AdminLayout';
import { Head, Link } from '@inertiajs/react';

const O = '#2fbcd4';

/* Badge styles that read well in both light and dark */
const BADGE = {
    green:  { background: 'rgba(16,185,129,.15)',  color: '#10B981' },
    purple: { background: 'rgba(124,58,237,.15)',  color: '#8B5CF6' },
    amber:  { background: 'rgba(245,158,11,.15)',  color: '#F59E0B' },
    gray:   { background: 'rgba(156,163,175,.12)', color: 'var(--a-text-4)' },
};

export default function VideoQuestionsIndex({ lessons, auth }) {
    const totalWithQuestions = lessons.filter(l => l.question_count > 0).length;
    const totalWithReports   = lessons.filter(l => l.student_count > 0).length;

    return (
        <AdminLayout auth={auth} title="أسئلة التركيز">
            <Head title="أسئلة التركيز" />

            <div style={{ direction: 'rtl', fontFamily: 'Cairo, sans-serif' }}>

                {/* ── Header ── */}
                <div className="mb-8">
                    <h1 style={{ color: 'var(--a-text)', fontWeight: 900, fontSize: 22, marginBottom: 4 }}>
                        🎯 أسئلة التركيز
                    </h1>
                    <p style={{ color: 'var(--a-text-4)', fontSize: 13 }}>
                        تحكم في الأسئلة التي تظهر داخل الفيديو — وشوف تقرير تركيز كل طالب لكل محاضرة
                    </p>
                </div>

                {/* ── Summary cards ── */}
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
                    {[
                        { label: 'إجمالي المحاضرات',       value: lessons.length,                           icon: '📚' },
                        { label: 'محاضرات بأسئلة مخصصة',   value: totalWithQuestions,                       icon: '✏️' },
                        { label: 'محاضرات باستخدام البول',  value: lessons.length - totalWithQuestions,      icon: '🎲' },
                        { label: 'محاضرات بتقارير طلاب',    value: totalWithReports,                         icon: '📊' },
                    ].map((c, i) => (
                        <div key={i} style={{
                            background: 'var(--a-card)',
                            border: '1px solid var(--a-border)',
                            borderRadius: 16,
                            boxShadow: '0 1px 6px var(--a-shadow)',
                            padding: '1.25rem',
                            textAlign: 'center',
                        }}>
                            <div style={{ fontSize: 28, marginBottom: 8 }}>{c.icon}</div>
                            <div style={{ color: O, fontSize: 22, fontWeight: 900 }}>{c.value}</div>
                            <div style={{ color: 'var(--a-text-4)', fontSize: 11, marginTop: 4, lineHeight: 1.4 }}>
                                {c.label}
                            </div>
                        </div>
                    ))}
                </div>

                {/* ── Info box ── */}
                <div style={{
                    background: 'rgba(47,188,212,.08)',
                    border: '1px solid rgba(47,188,212,.2)',
                    borderRadius: 14,
                    padding: '1rem 1.2rem',
                    display: 'flex', gap: 12, alignItems: 'flex-start',
                    marginBottom: 24,
                }}>
                    <span style={{ fontSize: 20, flexShrink: 0 }}>💡</span>
                    <div style={{ color: 'var(--a-text-2)', fontSize: 13, lineHeight: 1.7 }}>
                        <strong style={{ color: 'var(--a-text)' }}>ازاي بيشتغل؟</strong> — لو محاضرة ملهاش أسئلة مخصصة،
                        النظام بيستخدم بول الأسئلة العامة (16 سؤال تاريخ). لو حبيت أسئلة مخصصة
                        لمحاضرة معينة، افتح "إدارة الأسئلة" وضيف 4 أسئلة.
                    </div>
                </div>

                {/* ── Lessons table ── */}
                <div style={{
                    background: 'var(--a-card)',
                    border: '1px solid var(--a-border)',
                    borderRadius: 18,
                    boxShadow: '0 1px 6px var(--a-shadow)',
                    overflow: 'hidden',
                }}>
                    {/* Table header bar */}
                    <div style={{
                        padding: '1rem 1.25rem',
                        borderBottom: '1px solid var(--a-border)',
                        display: 'flex', alignItems: 'center', justifyContent: 'space-between',
                    }}>
                        <h2 style={{ color: 'var(--a-text)', fontWeight: 700, fontSize: 14 }}>
                            كل المحاضرات
                        </h2>
                        <span style={{ color: 'var(--a-text-4)', fontSize: 12 }}>
                            {lessons.length} محاضرة
                        </span>
                    </div>

                    {lessons.length === 0 ? (
                        <div style={{ padding: '4rem', textAlign: 'center' }}>
                            <div style={{ fontSize: 48, marginBottom: 12 }}>📭</div>
                            <p style={{ color: 'var(--a-text-4)', fontWeight: 600 }}>لا توجد محاضرات بعد</p>
                        </div>
                    ) : (
                        <div style={{ overflowX: 'auto' }}>
                            <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: 13 }}>
                                <thead>
                                    <tr style={{
                                        background: 'var(--a-thead)',
                                        color: 'var(--a-thead-text)',
                                    }}>
                                        {['#', 'المحاضرة', 'المدة', 'الأسئلة', 'الطلاب', 'الإجراءات'].map((h, i) => (
                                            <th key={i} style={{
                                                padding: '12px 16px',
                                                textAlign: i === 0 || i >= 2 ? 'center' : 'right',
                                                fontWeight: 700,
                                                fontSize: 12,
                                            }}>
                                                {h}
                                            </th>
                                        ))}
                                    </tr>
                                </thead>
                                <tbody>
                                    {lessons.map((lesson, idx) => (
                                        <tr key={lesson.id} style={{
                                            borderBottom: '1px solid var(--a-border-2)',
                                            transition: 'background .15s',
                                        }}
                                            onMouseEnter={e => e.currentTarget.style.background = 'var(--a-row-hover)'}
                                            onMouseLeave={e => e.currentTarget.style.background = 'transparent'}
                                        >
                                            {/* # */}
                                            <td style={{ padding: '12px 16px', textAlign: 'center', color: 'var(--a-text-4)', fontSize: 12 }}>
                                                {idx + 1}
                                            </td>

                                            {/* Title */}
                                            <td style={{ padding: '12px 16px' }}>
                                                <span style={{ color: 'var(--a-text)', fontWeight: 600 }}>
                                                    {lesson.title}
                                                </span>
                                            </td>

                                            {/* Duration */}
                                            <td style={{ padding: '12px 16px', textAlign: 'center', color: 'var(--a-text-4)', fontSize: 12 }}>
                                                {lesson.duration} دقيقة
                                            </td>

                                            {/* Questions badge */}
                                            <td style={{ padding: '12px 16px', textAlign: 'center' }}>
                                                <span style={{
                                                    ...(lesson.question_count > 0 ? BADGE.green : BADGE.purple),
                                                    padding: '3px 12px', borderRadius: 20,
                                                    fontSize: 11, fontWeight: 700, whiteSpace: 'nowrap',
                                                }}>
                                                    {lesson.question_count > 0
                                                        ? `✅ ${lesson.question_count} مخصصة`
                                                        : '🎲 بول عام'}
                                                </span>
                                            </td>

                                            {/* Students badge */}
                                            <td style={{ padding: '12px 16px', textAlign: 'center' }}>
                                                {lesson.student_count > 0 ? (
                                                    <span style={{
                                                        ...BADGE.amber,
                                                        padding: '3px 12px', borderRadius: 20,
                                                        fontSize: 11, fontWeight: 700,
                                                    }}>
                                                        👥 {lesson.student_count} طالب
                                                    </span>
                                                ) : (
                                                    <span style={{ color: 'var(--a-text-4)', fontSize: 12 }}>
                                                        —
                                                    </span>
                                                )}
                                            </td>

                                            {/* Actions */}
                                            <td style={{ padding: '12px 16px' }}>
                                                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8, flexWrap: 'wrap' }}>
                                                    <Link
                                                        href={`/admin/lessons/${lesson.id}/video-questions`}
                                                        style={{
                                                            display: 'inline-flex', alignItems: 'center', gap: 4,
                                                            padding: '5px 12px', borderRadius: 8,
                                                            fontSize: 11, fontWeight: 700,
                                                            background: 'var(--a-badge-navy-bg)',
                                                            color: 'var(--a-badge-navy-text)',
                                                            textDecoration: 'none',
                                                            border: '1px solid var(--a-border)',
                                                            transition: 'all .15s',
                                                            whiteSpace: 'nowrap',
                                                        }}
                                                        onMouseEnter={e => { e.currentTarget.style.background = 'var(--a-thead)'; e.currentTarget.style.color = 'var(--a-thead-text)'; }}
                                                        onMouseLeave={e => { e.currentTarget.style.background = 'var(--a-badge-navy-bg)'; e.currentTarget.style.color = 'var(--a-badge-navy-text)'; }}
                                                    >
                                                        ✏️ إدارة الأسئلة
                                                    </Link>

                                                    <Link
                                                        href={`/admin/lessons/${lesson.id}/focus-report`}
                                                        style={{
                                                            display: 'inline-flex', alignItems: 'center', gap: 4,
                                                            padding: '5px 12px', borderRadius: 8,
                                                            fontSize: 11, fontWeight: 700,
                                                            background: lesson.student_count > 0 ? O : 'rgba(156,163,175,.12)',
                                                            color: lesson.student_count > 0 ? '#fff' : 'var(--a-text-4)',
                                                            textDecoration: 'none',
                                                            transition: 'opacity .15s',
                                                            whiteSpace: 'nowrap',
                                                        }}
                                                        onMouseEnter={e => { if (lesson.student_count > 0) e.currentTarget.style.opacity = '.85'; }}
                                                        onMouseLeave={e => { e.currentTarget.style.opacity = '1'; }}
                                                    >
                                                        📊 تقرير التركيز
                                                        {lesson.student_count > 0 && (
                                                            <span style={{
                                                                background: 'rgba(255,255,255,.2)',
                                                                borderRadius: 10, padding: '0 6px',
                                                                fontSize: 10,
                                                            }}>
                                                                {lesson.student_count}
                                                            </span>
                                                        )}
                                                    </Link>
                                                </div>
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    )}
                </div>
            </div>
        </AdminLayout>
    );
}
