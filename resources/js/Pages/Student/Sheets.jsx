import { Head, Link } from '@inertiajs/react';
import { useState, useEffect } from 'react';
import StudentLayout from '@/Layouts/StudentLayout';

const O = '#F47C20';
const N = '#14213D';

function useStudentDark() {
    const [dark, setDark] = useState(() => {
        try { return localStorage.getItem('student-theme') === 'dark'; } catch { return false; }
    });
    useEffect(() => {
        const el = document.documentElement;
        const check = () => setDark(el.classList.contains('dark'));
        check();
        const obs = new MutationObserver(check);
        obs.observe(el, { attributes: true, attributeFilter: ['class'] });
        return () => obs.disconnect();
    }, []);
    return dark;
}

const ANSWER_STATUS = {
    graded:  { label: 'مصحح ✅',        color: '#059669', bg: '#d1fae5', bgDark: 'rgba(5,150,105,.15)',  border: '#6ee7b7', borderDark: 'rgba(52,211,153,.3)' },
    pending: { label: 'قيد المراجعة ⏳', color: '#d97706', bg: '#fef3c7', bgDark: 'rgba(217,119,6,.15)',  border: '#fcd34d', borderDark: 'rgba(251,191,36,.3)' },
};

export default function Sheets({ sheets }) {
    const dark      = useStudentDark();
    const answered  = sheets.filter(s => s.answer).length;
    const unanswered = sheets.filter(s => !s.answer && s.questions_count > 0).length;

    const cardBg  = dark ? '#152238' : '#fff';
    const cardBd  = dark ? 'rgba(255,255,255,.07)' : '#E2E8F0';

    return (
        <StudentLayout>
            <Head title="الشيتات" />

            <style>{`
                @keyframes fadeUp{from{opacity:0;transform:translateY(14px)}to{opacity:1;transform:translateY(0)}}
                .sh{animation:fadeUp .4s both}
                .sh-card{transition:transform .2s,box-shadow .2s}
                .sh-card:hover{transform:translateY(-3px);box-shadow:0 10px 32px rgba(20,33,61,.18)!important}
                .pdf-btn:hover{background:#e8641a!important;color:#fff!important;border-color:#e8641a!important}
            `}</style>

            {/* Header */}
            <div className="sh" style={{
                background: `linear-gradient(135deg,${N} 0%,#1e3a6e 100%)`,
                borderRadius: 20, padding: '1.75rem 2rem', marginBottom: '1.5rem',
                display: 'flex', alignItems: 'center', justifyContent: 'space-between',
                flexWrap: 'wrap', gap: 12,
            }}>
                <div>
                    <div style={{ color: 'rgba(255,255,255,.6)', fontSize: 12, marginBottom: 4 }}>📄 شيتاتك</div>
                    <h1 style={{ color: '#fff', fontSize: 22, fontWeight: 900, margin: 0 }}>الشيتات</h1>
                </div>
                <div style={{ display: 'flex', gap: 10, flexWrap: 'wrap' }}>
                    <MetaBadge icon="📋" label={`${sheets.length} شيت`} />
                    {answered > 0   && <MetaBadge icon="✅" label={`${answered} مسلّم`}  color="#10b981" />}
                    {unanswered > 0 && <MetaBadge icon="📝" label={`${unanswered} ينتظر`} color={O}       />}
                </div>
                <Link href={route('student.dashboard')} style={{
                    background: 'rgba(255,255,255,.12)', color: '#fff',
                    borderRadius: 10, padding: '8px 18px',
                    fontSize: 13, fontWeight: 700, textDecoration: 'none',
                    border: '1px solid rgba(255,255,255,.2)',
                }}>
                    ← لوحة التحكم
                </Link>
            </div>

            {sheets.length === 0 ? (
                <div className="sh" style={{
                    textAlign: 'center', padding: '4rem 2rem',
                    background: cardBg,
                    borderRadius: 20,
                    color: dark ? 'rgba(220,201,163,.45)' : '#94A3B8',
                    fontSize: 15,
                    border: `1px solid ${cardBd}`,
                    boxShadow: dark ? '0 4px 20px rgba(0,0,0,.25)' : '0 2px 20px rgba(20,33,61,.06)',
                }}>
                    <div style={{ fontSize: 48, marginBottom: 16 }}>📭</div>
                    لا توجد شيتات متاحة لصفك حالياً.
                </div>
            ) : (
                <div style={{
                    display: 'grid',
                    gridTemplateColumns: 'repeat(auto-fill,minmax(300px,1fr))',
                    gap: 16,
                }}>
                    {sheets.map((sheet, i) => (
                        <SheetCard key={sheet.id} sheet={sheet} delay={i * 0.05} dark={dark} />
                    ))}
                </div>
            )}
        </StudentLayout>
    );
}

function SheetCard({ sheet, delay, dark }) {
    const ans        = sheet.answer;
    const statusInfo = ans ? (ANSWER_STATUS[ans.status] || ANSWER_STATUS.pending) : null;
    const hasPdf      = sheet.has_pdf;
    const hasQuestions = sheet.questions_count > 0;

    const cardBg  = dark ? '#152238' : '#fff';
    const cardBd  = dark ? 'rgba(255,255,255,.07)' : '#E2E8F0';
    const txtMain = dark ? '#f0f4f8' : N;
    const txtSub  = dark ? 'rgba(220,201,163,.5)' : '#64748B';
    const metaBg  = dark ? 'rgba(255,255,255,.05)' : '#F1F5F9';
    const metaBd  = dark ? 'rgba(255,255,255,.1)'  : '#E2E8F0';

    return (
        <div className="sh sh-card" style={{
            animationDelay: `${delay}s`,
            background: cardBg,
            borderRadius: 18,
            border: `1px solid ${cardBd}`,
            boxShadow: dark ? '0 4px 20px rgba(0,0,0,.3)' : '0 2px 16px rgba(20,33,61,.06)',
            overflow: 'hidden',
        }}>
            {/* Top accent */}
            <div style={{
                height: 4,
                background: ans
                    ? (ans.status === 'graded' ? '#059669' : '#d97706')
                    : `linear-gradient(90deg,${O},#e8641a)`,
            }} />

            <div style={{ padding: '1.25rem 1.5rem' }}>
                {(sheet.unit_title || sheet.lesson_title) && (
                    <div style={{ fontSize: 11, color: txtSub, marginBottom: 6 }}>
                        {sheet.unit_title && <span>{sheet.unit_title}</span>}
                        {sheet.unit_title && sheet.lesson_title && <span> / </span>}
                        {sheet.lesson_title && <span>{sheet.lesson_title}</span>}
                    </div>
                )}

                <h3 style={{ fontSize: 15, fontWeight: 800, color: txtMain, margin: '0 0 8px', lineHeight: 1.4 }}>
                    {sheet.title}
                </h3>

                {sheet.description && (
                    <p style={{ fontSize: 12, color: txtSub, lineHeight: 1.7, margin: '0 0 10px' }}>
                        {sheet.description}
                    </p>
                )}

                <div style={{ display: 'flex', gap: 12, flexWrap: 'wrap', fontSize: 12, color: txtSub, marginBottom: 14 }}>
                    {sheet.total_marks > 0 && <span>🏆 {sheet.total_marks} درجة</span>}
                    {hasQuestions && <span>📝 {sheet.questions_count} سؤال</span>}
                    {hasPdf && <span>📄 ملف PDF</span>}
                </div>

                {ans && statusInfo && (
                    <div style={{
                        display: 'flex', alignItems: 'center', justifyContent: 'space-between',
                        background: dark ? statusInfo.bgDark : statusInfo.bg,
                        border: `1px solid ${dark ? statusInfo.borderDark : statusInfo.border}`,
                        borderRadius: 10, padding: '8px 14px',
                        marginBottom: 14,
                    }}>
                        <span style={{ fontSize: 12, fontWeight: 700, color: statusInfo.color }}>
                            {statusInfo.label}
                        </span>
                        {ans.score != null && (
                            <span style={{ fontSize: 13, fontWeight: 900, color: statusInfo.color }}>
                                {ans.score} / {sheet.total_marks}
                            </span>
                        )}
                    </div>
                )}

                <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap' }}>
                    {hasQuestions && (
                        <Link
                            href={route('student.sheets.show', sheet.id)}
                            style={{
                                flex: 1, textAlign: 'center',
                                background: ans
                                    ? (ans.status === 'graded' ? 'linear-gradient(135deg,#059669,#047857)' : 'linear-gradient(135deg,#d97706,#b45309)')
                                    : `linear-gradient(135deg,${O},#e8641a)`,
                                color: '#fff', borderRadius: 10,
                                padding: '10px 0', fontSize: 13, fontWeight: 800,
                                textDecoration: 'none', display: 'block',
                            }}
                        >
                            {ans ? '👁 عرض إجاباتي' : '✏️ حل الشيت'}
                        </Link>
                    )}

                    {hasPdf && (
                        <a
                            href={sheet.pdf_url}
                            target="_blank"
                            rel="noreferrer"
                            className="pdf-btn"
                            style={{
                                flex: hasQuestions ? '0 0 auto' : 1,
                                textAlign: 'center',
                                background: metaBg,
                                color: txtMain, borderRadius: 10,
                                padding: '10px 14px', fontSize: 13, fontWeight: 700,
                                textDecoration: 'none', transition: 'background .15s, color .15s',
                                display: 'block', border: `1px solid ${metaBd}`,
                            }}
                        >
                            PDF ↓
                        </a>
                    )}

                    {!hasPdf && !hasQuestions && (
                        <div style={{
                            flex: 1, textAlign: 'center', padding: '10px 0',
                            background: metaBg, borderRadius: 10,
                            fontSize: 12, color: txtSub,
                            border: `1px solid ${metaBd}`,
                        }}>
                            لا يوجد محتوى بعد
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}

function MetaBadge({ icon, label, color }) {
    return (
        <div style={{
            background: color ? `${color}20` : 'rgba(255,255,255,.12)',
            border: `1px solid ${color ? `${color}40` : 'rgba(255,255,255,.2)'}`,
            borderRadius: 99, padding: '4px 12px',
            fontSize: 12, fontWeight: 600,
            color: color || 'rgba(255,255,255,.85)',
            display: 'inline-flex', alignItems: 'center', gap: 6,
        }}>
            {icon} {label}
        </div>
    );
}
