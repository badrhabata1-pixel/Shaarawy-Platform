const O = '#F47C20';
const N = '#14213D';

export default function LockOverlay({ onUnlock, lessonTitle, paymentStatus, unitId, mode, examLocked, gateExamId }) {
    const payUrl = `/student/payment${unitId ? `?unit_id=${unitId}` : ''}`;

    if (examLocked) {
        const examUrl = gateExamId ? `/student/exams/${gateExamId}` : '/student/exams';
        return (
            <div style={{
                position: 'absolute', inset: 0,
                background: 'rgba(10,18,42,.92)',
                backdropFilter: 'blur(4px)',
                display: 'flex', flexDirection: 'column',
                alignItems: 'center', justifyContent: 'center',
                gap: 12, zIndex: 5, borderRadius: 'inherit',
            }}>
                <div style={{
                    width: 56, height: 56,
                    background: 'rgba(99,102,241,.15)',
                    border: '2px solid #818cf8',
                    borderRadius: '50%',
                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                    animation: 'examPulse 2.5s ease-in-out infinite',
                }}>
                    <span style={{ fontSize: 24 }}>✏️</span>
                </div>
                <p style={{ color: '#c7d2fe', fontSize: 12, fontWeight: 700, textAlign: 'center', margin: 0, maxWidth: 150, lineHeight: 1.55 }}>
                    {lessonTitle}
                </p>
                <a href={examUrl} style={{
                    background: '#6366f1', color: '#fff', border: 'none', borderRadius: 8,
                    padding: '8px 16px', fontSize: 12, fontWeight: 800,
                    cursor: 'pointer', fontFamily: "'Cairo', sans-serif", textDecoration: 'none',
                    display: 'flex', alignItems: 'center', gap: 6, transition: 'transform .15s, opacity .15s',
                }}
                onMouseEnter={e => e.currentTarget.style.transform = 'scale(1.05)'}
                onMouseLeave={e => e.currentTarget.style.transform = 'scale(1)'}
                >
                    ✏️ اذهب للامتحان
                </a>
                <style>{`
                    @keyframes examPulse {
                        0%, 100% { box-shadow: 0 0 0 0 rgba(99,102,241,.4); }
                        50%       { box-shadow: 0 0 0 10px rgba(99,102,241,0); }
                    }
                `}</style>
            </div>
        );
    }

    return (
        <div style={{
            position: 'absolute', inset: 0,
            background: 'rgba(20,33,61,.88)',
            backdropFilter: 'blur(4px)',
            display: 'flex', flexDirection: 'column',
            alignItems: 'center', justifyContent: 'center',
            gap: 12, zIndex: 5, borderRadius: 'inherit',
        }}>
            <div style={{
                width: 56, height: 56,
                background: 'rgba(244,124,32,.15)',
                border: `2px solid ${O}`,
                borderRadius: '50%',
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                animation: 'lockPulse 2.5s ease-in-out infinite',
            }}>
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
                    <rect x="4" y="11" width="16" height="11" rx="2" fill={O} opacity=".9" />
                    <path d="M8 11V7a4 4 0 0 1 8 0v4" stroke={O} strokeWidth="2" strokeLinecap="round" />
                    <circle cx="12" cy="16" r="1.5" fill={N} />
                </svg>
            </div>

            <p style={{ color: '#fff', fontSize: 12, fontWeight: 700, textAlign: 'center', margin: 0, maxWidth: 140, lineHeight: 1.5 }}>
                {lessonTitle}
            </p>

            {(paymentStatus === 'approved' || mode === 'offline') ? (
                <button onClick={onUnlock} style={{
                    background: O, color: '#fff', border: 'none', borderRadius: 8,
                    padding: '8px 16px', fontSize: 12, fontWeight: 800,
                    cursor: 'pointer', fontFamily: "'Cairo', sans-serif",
                    display: 'flex', alignItems: 'center', gap: 6, transition: 'transform .15s',
                }}
                onMouseEnter={e => e.currentTarget.style.transform = 'scale(1.05)'}
                onMouseLeave={e => e.currentTarget.style.transform = 'scale(1)'}
                >
                    🔑 أدخل كود التفعيل
                </button>
            ) : paymentStatus === 'pending' ? (
                <div style={{
                    background: 'rgba(217,119,6,.18)', border: '1px solid rgba(217,119,6,.4)',
                    borderRadius: 8, padding: '8px 14px',
                    fontSize: 11, fontWeight: 700, color: '#FCD34D',
                    display: 'flex', alignItems: 'center', gap: 5,
                }}>
                    ⏳ طلبك قيد المراجعة
                </div>
            ) : (
                <a href={payUrl} style={{
                    background: O, color: '#fff', border: 'none', borderRadius: 8,
                    padding: '8px 16px', fontSize: 12, fontWeight: 800,
                    cursor: 'pointer', fontFamily: "'Cairo', sans-serif", textDecoration: 'none',
                    display: 'flex', alignItems: 'center', gap: 6, transition: 'transform .15s',
                }}
                onMouseEnter={e => e.currentTarget.style.transform = 'scale(1.05)'}
                onMouseLeave={e => e.currentTarget.style.transform = 'scale(1)'}
                >
                    💳 ادفع لفتح الدرس
                </a>
            )}

            <style>{`
                @keyframes lockPulse {
                    0%, 100% { box-shadow: 0 0 0 0 rgba(244,124,32,.4); }
                    50%       { box-shadow: 0 0 0 10px rgba(244,124,32,0); }
                }
            `}</style>
        </div>
    );
}
