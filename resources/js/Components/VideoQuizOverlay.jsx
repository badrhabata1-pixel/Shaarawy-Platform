import { useState, useEffect, useRef } from 'react';
import axios from 'axios';

const O  = '#F47C20';
const BG = '#060E1C';
const TIMEOUT_SECS = 45;
const LABELS = { a: 'أ', b: 'ب', c: 'ج', d: 'د' };

export default function VideoQuizOverlay({ lessonId, question, onDone }) {
    const [selected,  setSelected]  = useState(null);
    const [submitted, setSubmitted] = useState(false);
    const [result,    setResult]    = useState(null);
    const [seconds,   setSeconds]   = useState(TIMEOUT_SECS);
    const [loading,   setLoading]   = useState(false);
    const timerRef = useRef(null);

    /* Countdown — if time expires, call onDone (logs as "seen but not answered") */
    useEffect(() => {
        if (submitted) return;
        timerRef.current = setInterval(() => {
            setSeconds(s => {
                if (s <= 1) {
                    clearInterval(timerRef.current);
                    onDone(null); // null = timed out / skipped
                    return 0;
                }
                return s - 1;
            });
        }, 1000);
        return () => clearInterval(timerRef.current);
    }, [submitted]);

    const submit = async () => {
        if (!selected || loading) return;
        clearInterval(timerRef.current);
        setLoading(true);
        try {
            const { data } = await axios.post(
                `/student/lessons/${lessonId}/video-questions/${question.id}/answer`,
                { option: selected }
            );
            setResult(data);
            setSubmitted(true);
            setTimeout(() => onDone(data.is_correct), 2200);
        } catch {
            setLoading(false);
        }
    };

    const dashArray = 2 * Math.PI * 17;
    const dashOffset = dashArray * (1 - seconds / TIMEOUT_SECS);

    return (
        <>
            <style>{`
                @keyframes vq-slide-up {
                    from { opacity: 0; transform: translateY(18px) scale(.96); }
                    to   { opacity: 1; transform: none; }
                }
            `}</style>

            {/* Dark backdrop */}
            <div style={{
                position: 'absolute', inset: 0, zIndex: 40,
                background: 'rgba(2,6,14,.82)',
                backdropFilter: 'blur(7px)',
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                fontFamily: 'Cairo, sans-serif', direction: 'rtl',
            }}>
                {/* Quiz card */}
                <div style={{
                    background: BG,
                    border: '1px solid rgba(244,124,32,.22)',
                    borderRadius: 20,
                    padding: '1.7rem 1.5rem',
                    width: '90%', maxWidth: 460,
                    boxShadow: '0 32px 80px rgba(0,0,0,.7), 0 0 0 1px rgba(244,124,32,.06)',
                    animation: 'vq-slide-up .32s ease',
                }}>

                    {/* ── Header ── */}
                    <div style={{ display:'flex', alignItems:'center', gap:12, marginBottom:'1.3rem' }}>
                        {/* Pause icon badge */}
                        <div style={{
                            width: 44, height: 44, borderRadius: '50%', flexShrink: 0,
                            background: `${O}18`, border: `1.5px solid ${O}55`,
                            display: 'flex', alignItems: 'center', justifyContent: 'center',
                            fontSize: 18,
                        }}>⏸️</div>

                        <div>
                            <div style={{ color: O, fontWeight: 800, fontSize: 14 }}>
                                تم إيقاف الفيديو
                            </div>
                            <div style={{ color: 'rgba(255,255,255,.38)', fontSize: 12 }}>
                                أجب عشان تكمل المحاضرة
                            </div>
                        </div>

                        {/* SVG countdown ring */}
                        {!submitted && (
                            <div style={{ marginRight: 'auto', position:'relative', width:40, height:40, flexShrink:0 }}>
                                <svg width="40" height="40" style={{ transform:'rotate(-90deg)' }}>
                                    <circle cx="20" cy="20" r="17" fill="none"
                                        stroke="rgba(255,255,255,.1)" strokeWidth="2.5"/>
                                    <circle cx="20" cy="20" r="17" fill="none"
                                        stroke={seconds <= 10 ? '#EF4444' : O}
                                        strokeWidth="2.5"
                                        strokeDasharray={dashArray}
                                        strokeDashoffset={dashOffset}
                                        strokeLinecap="round"
                                        style={{ transition:'stroke-dashoffset .9s linear, stroke .3s' }}
                                    />
                                </svg>
                                <span style={{
                                    position:'absolute', inset:0,
                                    display:'flex', alignItems:'center', justifyContent:'center',
                                    color: seconds <= 10 ? '#EF4444' : 'rgba(255,255,255,.75)',
                                    fontSize: 12, fontWeight: 900,
                                }}>
                                    {seconds}
                                </span>
                            </div>
                        )}
                    </div>

                    {/* Thin divider */}
                    <div style={{ height:1, background:'rgba(255,255,255,.07)', marginBottom:'1.1rem' }}/>

                    {/* ── Question text ── */}
                    <p style={{
                        color: '#fff', fontSize: 15, fontWeight: 700,
                        lineHeight: 1.75, marginBottom: '1.1rem',
                    }}>
                        {question.question_text}
                    </p>

                    {/* ── Options or Result ── */}
                    {!submitted ? (
                        <>
                            <div style={{ display:'flex', flexDirection:'column', gap:8, marginBottom:'1.3rem' }}>
                                {Object.entries(question.options).map(([key, text]) => {
                                    const isSel = selected === key;
                                    return (
                                        <button
                                            key={key}
                                            onClick={() => setSelected(key)}
                                            style={{
                                                display: 'flex', alignItems: 'center', gap: 12,
                                                padding: '11px 14px', borderRadius: 10, cursor: 'pointer',
                                                background: isSel ? `${O}1A` : 'rgba(255,255,255,.04)',
                                                border: `1.5px solid ${isSel ? O : 'rgba(255,255,255,.1)'}`,
                                                color: isSel ? O : 'rgba(255,255,255,.75)',
                                                textAlign: 'right', fontFamily: 'Cairo',
                                                fontSize: 13, fontWeight: 600,
                                                transition: 'all .18s',
                                            }}
                                        >
                                            <span style={{
                                                width: 28, height: 28, borderRadius: '50%', flexShrink: 0,
                                                background: isSel ? O : 'rgba(255,255,255,.08)',
                                                color: isSel ? '#fff' : 'rgba(255,255,255,.4)',
                                                display: 'flex', alignItems: 'center', justifyContent: 'center',
                                                fontSize: 11, fontWeight: 900,
                                            }}>
                                                {LABELS[key]}
                                            </span>
                                            {text}
                                        </button>
                                    );
                                })}
                            </div>

                            <button
                                onClick={submit}
                                disabled={!selected || loading}
                                style={{
                                    width: '100%', padding: '13px', borderRadius: 10, border: 'none',
                                    background: selected ? O : 'rgba(255,255,255,.08)',
                                    color: '#fff', fontSize: 14, fontWeight: 800,
                                    fontFamily: 'Cairo', cursor: selected ? 'pointer' : 'not-allowed',
                                    transition: 'background .2s', opacity: loading ? .7 : 1,
                                }}
                            >
                                {loading ? 'جاري الإرسال...' : 'إرسال الإجابة'}
                            </button>
                        </>
                    ) : (
                        /* Result screen */
                        <div style={{
                            padding: '1.4rem', borderRadius: 12, textAlign: 'center',
                            background: result?.is_correct ? '#05966918' : '#DC262618',
                            border: `1px solid ${result?.is_correct ? '#05966940' : '#DC262640'}`,
                        }}>
                            <div style={{ fontSize: 34, marginBottom: 8 }}>
                                {result?.is_correct ? '🎉' : '❌'}
                            </div>
                            <div style={{ color: '#fff', fontWeight: 800, fontSize: 15, marginBottom: 6 }}>
                                {result?.is_correct ? 'إجابة صحيحة! ممتاز 👏' : 'إجابة خاطئة'}
                            </div>
                            {!result?.is_correct && result?.correct_answer && (
                                <div style={{ color: 'rgba(255,255,255,.5)', fontSize: 12, marginTop: 4 }}>
                                    الإجابة الصحيحة: {question.options[result.correct_answer]}
                                </div>
                            )}
                            <div style={{ color: 'rgba(255,255,255,.28)', fontSize: 11, marginTop: 10 }}>
                                يستأنف الفيديو خلال ثانيتين...
                            </div>
                        </div>
                    )}
                </div>
            </div>
        </>
    );
}
