import { useState, useRef, useEffect } from 'react';
import { Head, useForm } from '@inertiajs/react';

export default function Login({ status, canResetPassword }) {
    const { data, setData, post, processing, errors, reset } = useForm({
        email: '',
        password: '',
        remember: false,
    });

    const [showPass, setShowPass] = useState(false);
    const cardRef = useRef(null);

    useEffect(() => {
        if (!cardRef.current) return;
        cardRef.current.style.opacity = '0';
        cardRef.current.style.transform = 'translateY(24px)';
        requestAnimationFrame(() => {
            cardRef.current.style.transition = 'opacity .5s ease, transform .5s ease';
            cardRef.current.style.opacity = '1';
            cardRef.current.style.transform = 'translateY(0)';
        });
    }, []);

    const submit = (e) => {
        e.preventDefault();
        post(route('login'), { onFinish: () => reset('password') });
    };

    const inputStyle = (hasError) => ({
        width: '100%', padding: '12px 16px', borderRadius: 12,
        border: `1.5px solid ${hasError ? '#ef4444' : '#E2E8F0'}`,
        background: '#F8FAFC', fontSize: 14, color: '#14213D',
        fontFamily: 'Cairo, sans-serif', outline: 'none',
        transition: 'border-color .2s, box-shadow .2s',
        boxSizing: 'border-box',
    });

    const onFocus = (e) => {
        e.target.style.borderColor = '#F47C20';
        e.target.style.boxShadow = '0 0 0 3px rgba(244,124,32,.12)';
        e.target.style.background = '#fff';
    };
    const onBlur = (e) => {
        e.target.style.borderColor = '#E2E8F0';
        e.target.style.boxShadow = 'none';
        e.target.style.background = '#F8FAFC';
    };

    return (
        <>
            <Head title="دخول الأستاذ" />

            <style>{`
                @import url('https://fonts.googleapis.com/css2?family=Cairo:wght@400;600;700;900&display=swap');
                * { box-sizing: border-box; }
                body { margin: 0; font-family: 'Cairo', sans-serif; }
                ::placeholder { color: #94a3b8; font-family: 'Cairo', sans-serif; }
                .sb-btn:hover { opacity: .92; transform: translateY(-1px); box-shadow: 0 8px 24px rgba(244,124,32,.4) !important; }
                .sb-btn:active { transform: translateY(0); }
                .pass-toggle:hover { color: #F47C20 !important; }
            `}</style>

            {/* Background */}
            <div dir="rtl" style={{
                minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center',
                background: 'linear-gradient(135deg, #060B16 0%, #0D1829 45%, #14213D 75%, #0A1422 100%)',
                padding: '24px',
                position: 'relative', overflow: 'hidden',
            }}>
                {/* Decorative orbs */}
                <div style={{ position: 'absolute', top: -80, right: -80, width: 360, height: 360, borderRadius: '50%', background: 'radial-gradient(circle, rgba(244,124,32,.18) 0%, transparent 70%)', pointerEvents: 'none' }} />
                <div style={{ position: 'absolute', bottom: -100, left: -100, width: 400, height: 400, borderRadius: '50%', background: 'radial-gradient(circle, rgba(20,33,61,.8) 0%, transparent 70%)', pointerEvents: 'none' }} />

                {/* Columns watermark */}
                <svg style={{ position: 'absolute', left: 0, bottom: 0, height: '55%', opacity: .04, pointerEvents: 'none' }}
                    viewBox="0 0 540 155" preserveAspectRatio="xMinYMax meet">
                    {[65,145,225,305,385,465].map((x,i) => (
                        <g key={i} transform={`translate(${x},0)`}>
                            <rect x="-15" y="8" width="30" height="8" rx="1.5" fill="white"/>
                            <rect x="-9" y="20" width="18" height="105" rx="2" fill="white"/>
                            <rect x="-15" y="129" width="30" height="8" rx="1.5" fill="white"/>
                        </g>
                    ))}
                    <rect x="36" y="2" width="478" height="9" rx="2" fill="white"/>
                    <rect x="36" y="137" width="478" height="5" rx="1" fill="white" opacity=".4"/>
                </svg>

                {/* Card */}
                <div ref={cardRef} style={{
                    width: '100%', maxWidth: 420,
                    background: '#fff', borderRadius: 24,
                    boxShadow: '0 24px 80px rgba(0,0,0,.45), 0 0 0 1px rgba(255,255,255,.08)',
                    overflow: 'hidden', position: 'relative', zIndex: 1,
                }}>
                    {/* Card top accent */}
                    <div style={{ height: 4, background: 'linear-gradient(90deg, #F47C20, #d96a12, #F47C20)' }} />

                    <div style={{ padding: '36px 36px 32px' }}>
                        {/* Logo + title */}
                        <div style={{ textAlign: 'center', marginBottom: 32 }}>
                            <div style={{
                                width: 60, height: 60, borderRadius: 18, margin: '0 auto 14px',
                                background: 'linear-gradient(135deg, #F47C20, #d96a12)',
                                boxShadow: '0 0 0 4px rgba(244,124,32,.15), 0 8px 24px rgba(244,124,32,.35)',
                                display: 'flex', alignItems: 'center', justifyContent: 'center',
                            }}>
                                <svg viewBox="0 0 32 32" width="28" height="28" fill="none">
                                    <path d="M16 4L20 12L28 13L22 19L24 27L16 23L8 27L10 19L4 13L12 12Z" fill="white" opacity=".95"/>
                                </svg>
                            </div>
                            <h1 style={{ color: '#14213D', fontSize: 22, fontWeight: 900, margin: '0 0 4px', fontFamily: 'Cairo,sans-serif' }}>
                                بوابة الأستاذ
                            </h1>
                            <p style={{ color: '#94a3b8', fontSize: 13, margin: 0, fontFamily: 'Cairo,sans-serif' }}>
                                منصة الصيفي التعليمية
                            </p>
                        </div>

                        {/* Status message */}
                        {status && (
                            <div style={{ background: '#d1fae5', border: '1px solid #6ee7b7', borderRadius: 10, padding: '10px 14px', marginBottom: 20, color: '#065f46', fontSize: 13, fontFamily: 'Cairo,sans-serif' }}>
                                {status}
                            </div>
                        )}

                        <form onSubmit={submit} style={{ display: 'flex', flexDirection: 'column', gap: 18 }}>
                            {/* Email */}
                            <div>
                                <label style={{ display: 'block', color: '#374151', fontSize: 13, fontWeight: 700, marginBottom: 7, fontFamily: 'Cairo,sans-serif' }}>
                                    البريد الإلكتروني
                                </label>
                                <div style={{ position: 'relative' }}>
                                    <span style={{ position: 'absolute', right: 13, top: '50%', transform: 'translateY(-50%)', color: '#94a3b8', pointerEvents: 'none', display: 'flex' }}>
                                        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" width={16} height={16}>
                                            <path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"/>
                                            <polyline points="22,6 12,13 2,6"/>
                                        </svg>
                                    </span>
                                    <input
                                        type="email"
                                        value={data.email}
                                        onChange={e => setData('email', e.target.value)}
                                        onFocus={onFocus}
                                        onBlur={onBlur}
                                        placeholder="example@email.com"
                                        autoFocus
                                        style={{ ...inputStyle(!!errors.email), paddingRight: 40 }}
                                        dir="ltr"
                                    />
                                </div>
                                {errors.email && (
                                    <p style={{ color: '#ef4444', fontSize: 12, marginTop: 5, fontFamily: 'Cairo,sans-serif' }}>{errors.email}</p>
                                )}
                            </div>

                            {/* Password */}
                            <div>
                                <label style={{ display: 'block', color: '#374151', fontSize: 13, fontWeight: 700, marginBottom: 7, fontFamily: 'Cairo,sans-serif' }}>
                                    كلمة المرور
                                </label>
                                <div style={{ position: 'relative' }}>
                                    <span style={{ position: 'absolute', right: 13, top: '50%', transform: 'translateY(-50%)', color: '#94a3b8', pointerEvents: 'none', display: 'flex' }}>
                                        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" width={16} height={16}>
                                            <rect x="3" y="11" width="18" height="11" rx="2" ry="2"/>
                                            <path d="M7 11V7a5 5 0 0 1 10 0v4"/>
                                        </svg>
                                    </span>
                                    <input
                                        type={showPass ? 'text' : 'password'}
                                        value={data.password}
                                        onChange={e => setData('password', e.target.value)}
                                        onFocus={onFocus}
                                        onBlur={e => { onBlur(e); }}
                                        placeholder="••••••••"
                                        style={{ ...inputStyle(!!errors.password), paddingRight: 40, paddingLeft: 40 }}
                                        dir="ltr"
                                    />
                                    <button
                                        type="button"
                                        onClick={() => setShowPass(v => !v)}
                                        className="pass-toggle"
                                        style={{ position: 'absolute', left: 12, top: '50%', transform: 'translateY(-50%)', background: 'none', border: 'none', cursor: 'pointer', color: '#94a3b8', display: 'flex', padding: 0, transition: 'color .15s' }}
                                    >
                                        {showPass ? (
                                            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" width={16} height={16}>
                                                <path d="M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-11-8-11-8a18.45 18.45 0 0 1 5.06-5.94M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19m-6.72-1.07a3 3 0 1 1-4.24-4.24"/>
                                                <line x1="1" y1="1" x2="23" y2="23"/>
                                            </svg>
                                        ) : (
                                            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" width={16} height={16}>
                                                <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"/>
                                                <circle cx="12" cy="12" r="3"/>
                                            </svg>
                                        )}
                                    </button>
                                </div>
                                {errors.password && (
                                    <p style={{ color: '#ef4444', fontSize: 12, marginTop: 5, fontFamily: 'Cairo,sans-serif' }}>{errors.password}</p>
                                )}
                            </div>

                            {/* Remember + Forgot */}
                            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                                <label style={{ display: 'flex', alignItems: 'center', gap: 8, cursor: 'pointer' }}>
                                    <input
                                        type="checkbox"
                                        checked={data.remember}
                                        onChange={e => setData('remember', e.target.checked)}
                                        style={{ width: 16, height: 16, accentColor: '#F47C20', cursor: 'pointer' }}
                                    />
                                    <span style={{ color: '#64748b', fontSize: 12, fontFamily: 'Cairo,sans-serif' }}>تذكرني</span>
                                </label>
                            </div>

                            {/* Submit */}
                            <button
                                type="submit"
                                disabled={processing}
                                className="sb-btn"
                                style={{
                                    width: '100%', padding: '13px',
                                    background: processing ? '#94a3b8' : 'linear-gradient(135deg, #F47C20, #d96a12)',
                                    color: '#fff', border: 'none', borderRadius: 12,
                                    fontSize: 15, fontWeight: 800, fontFamily: 'Cairo,sans-serif',
                                    cursor: processing ? 'not-allowed' : 'pointer',
                                    boxShadow: '0 4px 16px rgba(244,124,32,.35)',
                                    transition: 'all .2s ease', marginTop: 4,
                                }}
                            >
                                {processing ? '⏳ جاري الدخول...' : 'تسجيل الدخول'}
                            </button>
                        </form>

                        {/* Footer */}
                        <p style={{ textAlign: 'center', marginTop: 22, color: '#94a3b8', fontSize: 11, fontFamily: 'Cairo,sans-serif' }}>
                            منصة الصيفي © {new Date().getFullYear()} — جميع الحقوق محفوظة
                        </p>
                    </div>
                </div>
            </div>
        </>
    );
}
