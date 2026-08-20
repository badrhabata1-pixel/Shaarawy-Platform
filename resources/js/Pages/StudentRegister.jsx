import React, { useState } from 'react';
import { useForm, Head, Link } from '@inertiajs/react';

const TEAL  = '#2fbcd4';
const TEAL2 = '#009688';
const NAVY  = '#1b3a60';
const INK   = '#0A1422';

const REGISTER_IMG = encodeURI('/images/انشاء او تسجيل.png');

export default function StudentRegister({ grades = [] }) {
    const { data, setData, post, processing, errors, reset } = useForm({
        first_name:       '',
        last_name:        '',
        email:            '',
        phone:            '',
        password:         '',
        type:             'online',
        academic_year_id: '',
    });
    const [success, setSuccess] = useState(false);

    const handleSubmit = (e) => {
        e.preventDefault();
        post(route('register.store'), {
            onSuccess: () => { setSuccess(true); reset(); },
            onError:   () => setSuccess(false),
        });
    };

    return (
        <div dir="rtl" style={{
            minHeight:  '100vh',
            background: `linear-gradient(135deg, #060B16 0%, #0D1829 45%, ${NAVY} 75%, ${INK} 100%)`,
            fontFamily: "'Cairo', sans-serif",
            position:   'relative',
            overflow:   'hidden',
            display:    'flex',
            flexDirection: 'column',
        }}>
            <Head title="تسجيل طالب جديد — منصة منصور" />
            <GoogleFonts />
            <BrandStyles />
            <StarPattern />
            <Particles />

            <div style={{ position: 'absolute', top: -80, right: -80, width: 360, height: 360, borderRadius: '50%', background: 'radial-gradient(circle, rgba(47,188,212,.18) 0%, transparent 70%)', pointerEvents: 'none' }} />
            <div style={{ position: 'absolute', bottom: -100, left: -100, width: 400, height: 400, borderRadius: '50%', background: `radial-gradient(circle, rgba(27,58,96,.8) 0%, transparent 70%)`, pointerEvents: 'none' }} />

            <span aria-hidden="true" style={{
                position: 'absolute', bottom: '3%', left: '50%', transform: 'translateX(-50%)',
                fontFamily: "'Rakkas',serif", fontSize: 'clamp(60px,10vw,110px)', lineHeight: 1,
                color: 'rgba(47,188,212,.06)', whiteSpace: 'nowrap', pointerEvents: 'none', userSelect: 'none',
            }}>منصة منصور</span>

            {/* NAV */}
            <nav style={{
                position: 'relative', zIndex: 10,
                background: 'rgba(6,11,22,.82)', backdropFilter: 'blur(24px) saturate(1.8)', WebkitBackdropFilter: 'blur(24px) saturate(1.8)',
                padding: '0 clamp(16px,4vw,2.5rem)', height: 80,
                display: 'flex', alignItems: 'center', justifyContent: 'space-between',
                boxShadow: '0 4px 32px rgba(0,0,0,.45), inset 0 -1px 0 rgba(47,188,212,.14)',
            }}>
                <div style={{ position: 'absolute', top: 0, left: 0, right: 0, height: 2, background: `linear-gradient(90deg,transparent 0%,rgba(47,188,212,.6) 30%,rgba(0,150,136,.8) 50%,rgba(47,188,212,.6) 70%,transparent 100%)` }} />

                <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                    <img src="/images/manasety.png.png" alt="منصتي" style={{ height: 46, width: 'auto', objectFit: 'contain', filter: 'drop-shadow(0 4px 14px rgba(47,188,212,.35))' }} />
                </div>

                <div className="reg-nav-links" style={{ display: 'flex', gap: 10, alignItems: 'center', flexWrap: 'wrap', justifyContent: 'flex-end' }}>
                    <Link href="/student/login" className="nav-pill" style={{ color: '#c7e9ef' }}>
                        عندك حساب؟ سجّل دخول ←
                    </Link>
                    <a href="/" className="nav-pill nav-pill-ghost" style={{ color: 'rgba(199,233,239,.55)' }}>
                        الرئيسية ←
                    </a>
                </div>
            </nav>

            {/* MAIN */}
            <div style={{
                display: 'flex', flex: 1, alignItems: 'flex-start', justifyContent: 'center',
                padding: 'clamp(16px,4vw,32px)', position: 'relative', zIndex: 2,
            }}>
                <div className="login-split" style={{
                    display: 'flex', direction: 'ltr', width: '94%', maxWidth: 1100,
                    borderRadius: 20, overflow: 'hidden', animation: 'riseUp .7s cubic-bezier(.22,1,.36,1)',
                    boxShadow: '0 40px 100px rgba(0,0,0,.5)',
                }}>
                    {/* PHOTO PANEL */}
                    <div className="login-photo" style={{
                        flex: '0 0 480px', position: 'relative',
                        background: `linear-gradient(160deg,${NAVY},${INK})`, overflow: 'hidden',
                    }}>
                        <img
                            src={REGISTER_IMG}
                            alt="إنشاء حساب جديد"
                            style={{ position: 'absolute', inset: 0, width: '100%', height: '100%', objectFit: 'cover', objectPosition: 'center 18%' }}
                        />
                        <div style={{ position: 'absolute', inset: 0, background: `linear-gradient(180deg, transparent 42%, ${NAVY} 94%)` }} />
                        <div style={{
                            position: 'absolute', bottom: 0, left: 0, right: 0, zIndex: 2,
                            display: 'flex', flexDirection: 'column', alignItems: 'center', textAlign: 'center',
                            padding: '1.5rem 1rem 1.25rem', direction: 'rtl',
                        }}>
                            <div style={{ color: '#fff', fontWeight: 800, fontSize: 15 }}>ابدأ رحلتك معنا 🚀</div>
                            <div style={{ color: TEAL, fontSize: 11, marginTop: 3, opacity: .9 }}>منصة منصور التعليمية</div>
                        </div>
                    </div>

                    {/* FORM PANEL */}
                    <div className="login-form-panel" style={{ background: '#fff', flex: 1, minWidth: 0, direction: 'rtl', overflowY: 'auto' }}>

                        {/* HEADER */}
                        <div style={{ background: NAVY, padding: '2rem', textAlign: 'center', position: 'relative', overflow: 'hidden' }}>
                            <div style={{ position: 'absolute', bottom: 0, left: 0, right: 0, height: 3, background: `linear-gradient(90deg, ${TEAL}, ${TEAL2})` }} />
                            <h1 style={{ color: '#fff', fontSize: 20, fontWeight: 900, margin: '0 0 4px', fontFamily: 'Cairo,sans-serif' }}>
                                تسجيل طالب جديد
                            </h1>
                            <p style={{ color: 'rgba(255,255,255,.6)', fontSize: 12, margin: 0 }}>
                                ابدأ رحلتك التعليمية مع منصة منصور
                            </p>
                            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8, marginTop: 10 }}>
                                <div style={{ width: 28, height: 1, background: `linear-gradient(90deg,transparent,${TEAL})` }} />
                                <svg width="10" height="10" viewBox="0 0 18 18" fill="none"><rect x="4" y="4" width="10" height="10" transform="rotate(45 9 9)" stroke={TEAL} strokeWidth="1.6" /></svg>
                                <div style={{ width: 28, height: 1, background: `linear-gradient(90deg,${TEAL},transparent)` }} />
                            </div>
                        </div>

                        {/* BODY */}
                        <form onSubmit={handleSubmit} className="reg-form-body" style={{ padding: '1.75rem 2rem' }}>

                            {success && (
                                <div style={{ background: '#d1fae5', border: '1px solid #6ee7b7', borderRadius: 10, padding: '10px 14px', color: '#065f46', fontSize: 13, marginBottom: 16, textAlign: 'center', fontWeight: 700 }}>
                                    🎉 تم تسجيل حسابك بنجاح! يمكنك الآن تسجيل الدخول.
                                </div>
                            )}

                            <div style={{
                                background: NAVY, borderRadius: 10, padding: '.7rem 1rem',
                                marginBottom: '1.25rem', textAlign: 'center',
                                color: TEAL, fontSize: 11, fontStyle: 'italic',
                                borderRight: `3px solid ${TEAL2}`, lineHeight: 1.7,
                            }}>
                                "ابدأ رحلتك نحو التميز والتفوق"
                            </div>

                            <div className="reg-grid" style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 14 }}>
                                <Field label="الاسم الأول" required error={errors.first_name}>
                                    <InputField
                                        value={data.first_name}
                                        onChange={e => setData('first_name', e.target.value)}
                                        placeholder="أحمد"
                                        hasError={!!errors.first_name}
                                        autoComplete="given-name"
                                    />
                                </Field>
                                <Field label="الاسم الأخير" required error={errors.last_name}>
                                    <InputField
                                        value={data.last_name}
                                        onChange={e => setData('last_name', e.target.value)}
                                        placeholder="محمد"
                                        hasError={!!errors.last_name}
                                        autoComplete="family-name"
                                    />
                                </Field>
                            </div>

                            <Field label="البريد الإلكتروني" required error={errors.email}>
                                <InputField
                                    type="email"
                                    value={data.email}
                                    onChange={e => setData('email', e.target.value)}
                                    placeholder="student@example.com"
                                    hasError={!!errors.email}
                                    ltr
                                    autoComplete="email"
                                />
                            </Field>

                            <div className="reg-grid" style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 14 }}>
                                <Field label="كلمة المرور (8 أحرف على الأقل)" required error={errors.password}>
                                    <InputField
                                        type="password"
                                        value={data.password}
                                        onChange={e => setData('password', e.target.value)}
                                        placeholder="••••••••"
                                        hasError={!!errors.password}
                                        autoComplete="new-password"
                                    />
                                </Field>
                                <Field label="رقم الهاتف" required error={errors.phone}>
                                    <InputField
                                        type="tel"
                                        value={data.phone}
                                        onChange={e => setData('phone', e.target.value)}
                                        placeholder="01xxxxxxxxx"
                                        hasError={!!errors.phone}
                                        ltr
                                        autoComplete="tel"
                                    />
                                </Field>
                            </div>

                            {grades.length > 0 && (
                                <Field label="الصف الدراسي" error={errors.academic_year_id}>
                                    <SelectField
                                        value={data.academic_year_id}
                                        onChange={e => setData('academic_year_id', e.target.value)}
                                        hasError={!!errors.academic_year_id}
                                    >
                                        <option value="">اختر الصف الدراسي</option>
                                        {grades.map(g => (
                                            <option key={g.id} value={g.id}>{g.name}</option>
                                        ))}
                                    </SelectField>
                                </Field>
                            )}

                            <div style={{ marginBottom: 14 }}>
                                <label style={{ display: 'block', fontSize: 12, fontWeight: 700, color: NAVY, marginBottom: 7, fontFamily: 'Cairo,sans-serif' }}>
                                    طريقة المتابعة <span style={{ color: TEAL2 }}>*</span>
                                </label>
                                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 10 }}>
                                    <TypeButton active={data.type === 'online'}  onClick={() => setData('type', 'online')}>أونلاين</TypeButton>
                                    <TypeButton active={data.type === 'offline'} onClick={() => setData('type', 'offline')}>أوفلاين</TypeButton>
                                </div>
                                {errors.type && <p style={{ color: '#ef4444', fontSize: 11, marginTop: 5 }}>{errors.type}</p>}
                            </div>

                            <button
                                type="submit"
                                disabled={processing}
                                className="brand-btn"
                                style={{
                                    width: '100%',
                                    background: processing ? '#94a3b8' : `linear-gradient(135deg, ${TEAL}, ${TEAL2})`,
                                    color: '#fff', border: 'none', borderRadius: 10, padding: '13px',
                                    fontSize: 15, fontWeight: 800, cursor: processing ? 'not-allowed' : 'pointer',
                                    marginTop: 6, fontFamily: "'Cairo', sans-serif",
                                    boxShadow: processing ? 'none' : `0 6px 20px rgba(47,188,212,.35)`,
                                    transition: 'all .2s ease',
                                }}
                            >
                                {processing ? 'جارٍ تسجيل البيانات...' : 'تسجيل الطالب'}
                            </button>

                            <div style={{ textAlign: 'center', padding: '.75rem 0 0', fontSize: 11, color: '#94a3b8', borderTop: '1px solid #E2E8F0', marginTop: '1rem' }}>
                                عندك حساب بالفعل؟{' '}
                                <Link href="/student/login" style={{ color: TEAL2, textDecoration: 'none', fontWeight: 700 }}>
                                    سجّل الدخول
                                </Link>
                            </div>
                        </form>
                    </div>
                </div>
            </div>
        </div>
    );
}

/* ── Helper sub-components ─────────────────────── */

function GoogleFonts() {
    return (
        <link
            href="https://fonts.googleapis.com/css2?family=Cairo:wght@400;600;700;900&family=Rakkas&display=swap"
            rel="stylesheet"
        />
    );
}

function StarPattern() {
    return (
        <svg style={{ position: 'absolute', inset: 0, width: '100%', height: '100%', opacity: .05, pointerEvents: 'none' }}>
            <defs>
                <pattern id="studentRegStarPat" width="52" height="52" patternUnits="userSpaceOnUse">
                    <g stroke={TEAL} fill="none" strokeWidth="1">
                        <rect x="6" y="6" width="40" height="40" />
                        <rect x="6" y="6" width="40" height="40" transform="rotate(45 26 26)" />
                    </g>
                </pattern>
            </defs>
            <rect width="100%" height="100%" fill="url(#studentRegStarPat)" />
        </svg>
    );
}

function Particles() {
    const items = Array.from({ length: 18 }, (_, i) => ({
        left:     `${(i * 5.6) % 100}%`,
        duration: `${4 + (i * 0.4) % 6}s`,
        delay:    `${(i * 0.3) % 5}s`,
        size:     `${1 + (i % 2)}px`,
    }));
    return (
        <div style={{ position: 'absolute', inset: 0, pointerEvents: 'none', zIndex: 1 }}>
            {items.map((p, i) => (
                <div key={i} style={{
                    position: 'absolute', left: p.left, bottom: 0,
                    width: p.size, height: p.size,
                    background: TEAL, borderRadius: '50%',
                    animation: `floatUp ${p.duration} ${p.delay} linear infinite`,
                    opacity: 0,
                }} />
            ))}
        </div>
    );
}

function BrandStyles() {
    return (
        <style>{`
            * { box-sizing: border-box; }
            @keyframes riseUp {
                from { transform: translateY(24px); opacity: 0; }
                to   { transform: translateY(0);   opacity: 1; }
            }
            @keyframes floatUp {
                0%   { transform: translateY(0); opacity: 0; }
                15%  { opacity: .55; }
                85%  { opacity: .2; }
                100% { transform: translateY(-400px); opacity: 0; }
            }
            .nav-pill { display:inline-flex; align-items:center; gap:5px; font-size:12px; font-weight:600; text-decoration:none; padding:6px 14px; border-radius:99px; border:1px solid rgba(47,188,212,.2); background:rgba(47,188,212,.06); white-space:nowrap; transition:all .2s; }
            .nav-pill:hover { background:rgba(47,188,212,.16); border-color:rgba(47,188,212,.5); color:#2fbcd4 !important; }
            .nav-pill-ghost { border-color: transparent; background: transparent; }
            .nav-pill-ghost:hover { border-color: rgba(199,233,239,.18); background: transparent; }
            .brand-btn:hover { opacity:.92; transform: translateY(-1px); }
            .brand-btn:active { transform: translateY(0); }

            @media (max-width: 820px) {
                .login-split  { flex-direction: column !important; width: 96% !important; max-width: 540px !important; }
                .login-photo  { flex: 0 0 200px !important; min-height: 200px !important; }
            }
            @media (max-width: 600px) {
                .login-split  { width: 100% !important; max-width: 100% !important; border-radius: 12px !important; }
                .login-photo  { flex: 0 0 160px !important; min-height: 160px !important; }
                .login-form-panel { max-height: none !important; }
                .reg-grid     { grid-template-columns: 1fr !important; }
                .reg-form-body { padding: 1.25rem 1.1rem !important; }
            }
            @media (max-width: 420px) {
                .login-split  { border-radius: 0 !important; }
                .login-photo  { flex: 0 0 130px !important; min-height: 130px !important; }
                .reg-nav-links { gap: 8px !important; }
                .reg-nav-links a { font-size: 11px !important; }
            }
        `}</style>
    );
}

function Field({ label, required, error, children }) {
    return (
        <div style={{ marginBottom: 14 }}>
            <label style={{ display: 'block', fontSize: 12, fontWeight: 700, color: NAVY, marginBottom: 5, fontFamily: 'Cairo,sans-serif' }}>
                {label}{required && <span style={{ color: TEAL2 }}> *</span>}
            </label>
            {children}
            {error && <p style={{ color: '#ef4444', fontSize: 11, marginTop: 3 }}>{error}</p>}
        </div>
    );
}

function InputField({ type = 'text', value, onChange, placeholder, hasError, ltr, autoComplete }) {
    const [focused, setFocused] = useState(false);
    return (
        <input
            type={type}
            value={value}
            onChange={onChange}
            placeholder={placeholder}
            autoComplete={autoComplete}
            onFocus={() => setFocused(true)}
            onBlur={() => setFocused(false)}
            style={{
                width: '100%', boxSizing: 'border-box',
                border: `1.5px solid ${hasError ? '#ef4444' : focused ? TEAL : '#E2E8F0'}`,
                borderRadius: 10, padding: '11px 12px', fontSize: 13,
                background: focused ? '#fff' : '#F8FAFC',
                color: NAVY, outline: 'none',
                fontFamily: "'Cairo', sans-serif",
                direction: ltr ? 'ltr' : 'rtl',
                textAlign: ltr ? 'left' : 'right',
                boxShadow: focused ? '0 0 0 3px rgba(47,188,212,.12)' : 'none',
                transition: 'border-color .2s, box-shadow .2s, background .2s',
            }}
        />
    );
}

function SelectField({ value, onChange, hasError, children }) {
    const [focused, setFocused] = useState(false);
    return (
        <select
            value={value}
            onChange={onChange}
            onFocus={() => setFocused(true)}
            onBlur={() => setFocused(false)}
            style={{
                width: '100%', boxSizing: 'border-box',
                border: `1.5px solid ${hasError ? '#ef4444' : focused ? TEAL : '#E2E8F0'}`,
                borderRadius: 10, padding: '11px 12px', fontSize: 13,
                background: focused ? '#fff' : '#F8FAFC',
                color: NAVY, outline: 'none',
                fontFamily: "'Cairo', sans-serif",
                textAlign: 'right', cursor: 'pointer',
                boxShadow: focused ? '0 0 0 3px rgba(47,188,212,.12)' : 'none',
                transition: 'border-color .2s, box-shadow .2s, background .2s',
            }}
        >
            {children}
        </select>
    );
}

function TypeButton({ active, onClick, children }) {
    return (
        <button
            type="button"
            onClick={onClick}
            style={{
                padding: '11px', borderRadius: 10, fontSize: 13, fontWeight: 700,
                fontFamily: "'Cairo', sans-serif", cursor: 'pointer',
                border: `1.5px solid ${active ? TEAL : '#E2E8F0'}`,
                background: active ? `linear-gradient(135deg, ${TEAL}, ${TEAL2})` : '#fff',
                color: active ? '#fff' : NAVY,
                transition: 'all .2s',
            }}
        >
            {children}
        </button>
    );
}
