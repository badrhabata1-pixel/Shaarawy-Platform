import React, { useState } from 'react';
import { useForm, Head, Link } from '@inertiajs/react';

const N = '#14213D';
const O = '#F47C20';
const B = '#DCC9A3';
const W = '#F7F3EB';

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
        <div style={{
            minHeight:     '100vh',
            display:       'flex',
            flexDirection: 'column',
            background:    N,
            fontFamily:    "'Cairo', sans-serif",
            direction:     'rtl',
            position:      'relative',
        }}>
            <Head title="تسجيل طالب جديد — منصة الصيفي" />
            <GoogleFonts />
            <Particles />
            <ColumnSide style={{ left: '1.5rem' }} />
            <ColumnSide style={{ right: '1.5rem' }} flip />

            {/* NAV */}
            <nav style={{
                position:       'relative',
                zIndex:         10,
                background:     'rgba(8,15,30,.82)',
                backdropFilter: 'blur(24px) saturate(1.8)',
                WebkitBackdropFilter: 'blur(24px) saturate(1.8)',
                padding:        '0 clamp(16px,4vw,2.5rem)',
                height:         80,
                display:        'flex',
                alignItems:     'center',
                justifyContent: 'space-between',
                boxShadow:      '0 4px 32px rgba(0,0,0,.45), inset 0 -1px 0 rgba(201,161,74,.18)',
            }}>
                {/* Gold top line */}
                <div style={{ position:'absolute', top:0, left:0, right:0, height:2, background:'linear-gradient(90deg,transparent 0%,rgba(201,161,74,.6) 30%,rgba(244,124,32,.8) 50%,rgba(201,161,74,.6) 70%,transparent 100%)' }} />

                {/* Decorative glyphs */}
                <div style={{ position:'absolute', right:'calc(50% - 180px)', top:'50%', transform:'translateY(-50%)', fontSize:28, opacity:.06, userSelect:'none', fontFamily:'serif' }}>𓃭</div>
                <div style={{ position:'absolute', left:'calc(50% - 180px)', top:'50%', transform:'translateY(-50%)', fontSize:28, opacity:.06, userSelect:'none', fontFamily:'serif' }}>𓅓</div>

                {/* Logo */}
                <div style={{ display: 'flex', alignItems: 'center' }}>
                    <LogoRing />
                </div>

                {/* Center ornament */}
                <div style={{ position:'absolute', left:'50%', top:'50%', transform:'translate(-50%,-50%)', display:'flex', alignItems:'center', gap:8, pointerEvents:'none' }}>
                    <div style={{ width:40, height:1, background:'linear-gradient(90deg,transparent,rgba(201,161,74,.25))' }} />
                    <div style={{ width:4, height:4, borderRadius:'50%', background:'rgba(201,161,74,.3)' }} />
                    <div style={{ width:40, height:1, background:'linear-gradient(90deg,rgba(201,161,74,.25),transparent)' }} />
                </div>

                {/* Nav links */}
                <div className="reg-nav-links" style={{ display:'flex', gap:10, alignItems:'center', flexWrap:'wrap', justifyContent:'flex-end' }}>
                    <Link href="/student/login"
                        style={{ display:'inline-flex', alignItems:'center', gap:5, color:B, fontSize:12, fontWeight:600, textDecoration:'none', padding:'6px 14px', borderRadius:99, border:`1px solid rgba(220,201,163,.18)`, background:'rgba(220,201,163,.05)', whiteSpace:'nowrap', transition:'all .2s' }}
                        onMouseEnter={e=>{ e.currentTarget.style.background='rgba(201,161,74,.12)'; e.currentTarget.style.borderColor='rgba(201,161,74,.4)'; e.currentTarget.style.color='#C9A14A'; }}
                        onMouseLeave={e=>{ e.currentTarget.style.background='rgba(220,201,163,.05)'; e.currentTarget.style.borderColor='rgba(220,201,163,.18)'; e.currentTarget.style.color=B; }}
                    >
                        عندك حساب؟ سجّل دخول ←
                    </Link>
                    <a href="/"
                        style={{ display:'inline-flex', alignItems:'center', gap:5, color:'rgba(220,201,163,.55)', fontSize:12, fontWeight:600, textDecoration:'none', padding:'6px 14px', borderRadius:99, border:'1px solid transparent', whiteSpace:'nowrap', transition:'all .2s' }}
                        onMouseEnter={e=>{ e.currentTarget.style.color=B; e.currentTarget.style.borderColor='rgba(220,201,163,.15)'; }}
                        onMouseLeave={e=>{ e.currentTarget.style.color='rgba(220,201,163,.55)'; e.currentTarget.style.borderColor='transparent'; }}
                    >
                        الرئيسية ←
                    </a>
                </div>
            </nav>

            {/* MAIN */}
            <div style={{
                display:        'flex',
                flex:           1,
                alignItems:     'flex-start',
                justifyContent: 'center',
                padding:        'clamp(16px,4vw,32px)',
                position:       'relative',
                zIndex:         2,
            }}>
                <div className="login-split" style={{
                    display:      'flex',
                    direction:    'ltr',
                    width:        '94%',
                    maxWidth:     1100,
                    borderRadius: 20,
                    overflow:     'hidden',
                    animation:    'rise .7s cubic-bezier(.22,1,.36,1)',
                    boxShadow:    '0 40px 100px rgba(0,0,0,.5)',
                }}>

                    {/* PHOTO PANEL */}
                    <div className="login-photo" style={{
                        flex:       '0 0 520px',
                        position:   'relative',
                        background: `linear-gradient(160deg,${N},#0a1422)`,
                        overflow:   'hidden',
                    }}>
                        <MiniCol style={{ left: 10, top: '14%', opacity: .12 }} />
                        <MiniCol style={{ right: 10, top: '14%', transform: 'scaleX(-1)', opacity: .12 }} />
                        <img
                            src="/images/teacher-register.png"
                            alt="الأستاذ محمد الصيفي"
                            style={{
                                position:       'absolute',
                                inset:          0,
                                width:          '100%',
                                height:         '100%',
                                objectFit:      'contain',
                                objectPosition: 'center bottom',
                                display:        'block',
                                filter:         'drop-shadow(0 18px 26px rgba(0,0,0,.5))',
                                zIndex:         1,
                            }}
                        />
                        <div style={{
                            position: 'absolute', inset: 0,
                            background: `linear-gradient(180deg, transparent 38%, ${N} 92%)`,
                        }} />
                        <div style={{
                            position: 'absolute', bottom: 0, left: 0, right: 0,
                            zIndex: 2, display: 'flex', flexDirection: 'column',
                            alignItems: 'center', textAlign: 'center',
                            padding: '1.5rem 1rem 1.25rem', direction: 'rtl',
                            background: `linear-gradient(transparent, ${N}ee)`,
                        }}>
                            <div style={{ color: '#fff', fontWeight: 800, fontSize: 15 }}>الأستاذ محمد الصيفي</div>
                            <div style={{ color: B, fontSize: 11, marginTop: 3, opacity: .85 }}>مؤسس منصة الصيفي التعليمية</div>
                        </div>
                    </div>

                    {/* FORM PANEL */}
                    <div className="login-form-panel" style={{ background: W, flex: 1, minWidth: 0, direction: 'rtl', overflowY: 'auto' }}>

                    {/* HEADER */}
                    <div style={{
                        background: N,
                        padding:    '2rem',
                        textAlign:  'center',
                        position:   'relative',
                        overflow:   'hidden',
                    }}>
                        <div style={{ position: 'absolute', bottom: 0, left: 0, right: 0, height: 3, background: O }} />
                        <MiniCol style={{ left: 16, top: '50%', transform: 'translateY(-50%)', opacity: .15 }} />
                        <MiniCol style={{ right: 16, top: '50%', transform: 'translateY(-50%) scaleX(-1)', opacity: .15 }} />

                        <LogoRing large />
                        <div style={{ fontFamily: "'Cinzel',serif", color: B, fontSize: 10, letterSpacing: 4, opacity: .65, margin: '.6rem 0 .4rem' }}>
                            HISTORIA • MAGISTRA VITAE
                        </div>
                        <h1 style={{ color: '#fff', fontSize: 20, fontWeight: 700, margin: '0 0 .3rem' }}>
                            تسجيل طالب جديد
                        </h1>
                        <p style={{ color: B, fontSize: 12, margin: 0, opacity: .75 }}>
                            ابدأ رحلتك في تعلّم التاريخ مع الأستاذ محمد الصيفي
                        </p>
                    </div>

                    {/* BODY */}
                    <form onSubmit={handleSubmit} className="reg-form-body" style={{ padding: '1.75rem 2rem' }}>

                        {success && (
                            <div style={{
                                background: '#EDFAF4', border: '1px solid #7EDBB0',
                                borderRadius: 10, padding: '10px 14px',
                                color: '#1A6B47', fontSize: 13, marginBottom: 16, textAlign: 'center', fontWeight: 700,
                            }}>
                                🎉 تم تسجيل حسابك بنجاح! يمكنك الآن تسجيل الدخول.
                            </div>
                        )}

                        {/* Quote */}
                        <div style={{
                            background: N, borderRadius: 10, padding: '.7rem 1rem',
                            marginBottom: '1.25rem', textAlign: 'center',
                            color: B, fontSize: 11, fontStyle: 'italic',
                            borderRight: `3px solid ${O}`, lineHeight: 1.7,
                        }}>
                            "نُعيد الماضي لنفهم الحاضر ونصنع المستقبل"
                        </div>

                        {/* Name */}
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

                        {/* Email */}
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

                        {/* Password / Phone */}
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

                        {/* Grade */}
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

                        {/* Follow-up type */}
                        <div style={{ marginBottom: 14 }}>
                            <label style={{ display: 'block', fontSize: 12, fontWeight: 700, color: N, marginBottom: 7 }}>
                                طريقة المتابعة <span style={{ color: O }}>*</span>
                            </label>
                            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 10 }}>
                                <TypeButton active={data.type === 'online'}  onClick={() => setData('type', 'online')}>أونلاين</TypeButton>
                                <TypeButton active={data.type === 'offline'} onClick={() => setData('type', 'offline')}>أوفلاين</TypeButton>
                            </div>
                            {errors.type && <p style={{ color: '#C0392B', fontSize: 11, marginTop: 5 }}>{errors.type}</p>}
                        </div>

                        {/* Submit */}
                        <button
                            type="submit"
                            disabled={processing}
                            style={{
                                width: '100%', background: processing ? '#ccc' : O, color: '#fff',
                                border: 'none', borderRadius: 10, padding: '13px', fontSize: 15,
                                fontWeight: 700, cursor: processing ? 'not-allowed' : 'pointer',
                                marginTop: 6, fontFamily: "'Cairo', sans-serif", transition: 'opacity .2s',
                            }}
                        >
                            {processing ? 'جارٍ تسجيل البيانات...' : 'تسجيل الطالب'}
                        </button>

                        {/* Footer */}
                        <div style={{ textAlign: 'center', padding: '.75rem 0 0', fontSize: 11, color: '#aaa', borderTop: `1px solid ${B}`, marginTop: '1rem' }}>
                            عندك حساب بالفعل؟{' '}
                            <Link href="/student/login" style={{ color: O, textDecoration: 'none', fontWeight: 700 }}>
                                سجّل الدخول
                            </Link>
                            <span style={{ display: 'block', fontFamily: "'Cinzel',serif", fontSize: 9, letterSpacing: 2, marginTop: 4, color: '#C9A14A' }}>
                                HISTORIA MAGISTRA VITAE
                            </span>
                        </div>
                    </form>
                    </div>
                </div>
            </div>

            <AnimStyles />
        </div>
    );
}

/* ── Helper sub-components ─────────────────────── */

function GoogleFonts() {
    return (
        <link
            href="https://fonts.googleapis.com/css2?family=Cinzel:wght@400;700&family=Cairo:wght@400;600;700&display=swap"
            rel="stylesheet"
        />
    );
}

function AnimStyles() {
    return (
        <style>{`
            @keyframes rise {
                from { transform: translateY(24px); opacity: 0; }
                to   { transform: translateY(0);   opacity: 1; }
            }
            @keyframes floatUp {
                0%   { transform: translateY(0); opacity: 0; }
                15%  { opacity: .55; }
                85%  { opacity: .2; }
                100% { transform: translateY(-400px); opacity: 0; }
            }
            @keyframes pulse {
                0%,100% { box-shadow: 0 0 0 0   rgba(244,124,32,.35); }
                50%      { box-shadow: 0 0 0 8px rgba(244,124,32,0);   }
            }

            /* ── TABLET ── */
            @media (max-width: 820px) {
                .login-split  { flex-direction: column !important; width: 96% !important; max-width: 540px !important; }
                .login-photo  { flex: 0 0 200px !important; min-height: 200px !important; }
            }

            /* ── MOBILE ── */
            @media (max-width: 600px) {
                .login-split  { width: 100% !important; max-width: 100% !important; border-radius: 12px !important; }
                .login-photo  { flex: 0 0 160px !important; min-height: 160px !important; }
                .login-form-panel { max-height: none !important; }
                .reg-grid     { grid-template-columns: 1fr !important; }
                .reg-home-link { display: none !important; }
                .reg-form-body { padding: 1.25rem 1.1rem !important; }
            }

            /* ── SMALL MOBILE ── */
            @media (max-width: 420px) {
                .login-split  { border-radius: 0 !important; }
                .login-photo  { flex: 0 0 130px !important; min-height: 130px !important; }
                .reg-nav-links { gap: 8px !important; }
                .reg-nav-links a { font-size: 11px !important; }
            }
        `}</style>
    );
}

function LogoRing({ large }) {
    return (
        <img
            src="/images/logo-sify.png"
            alt="شعار منصة الصيفي"
            style={{
                height: large ? 80 : 100,
                width: 'auto',
                objectFit: 'contain',
                display: 'block',
                margin: large ? '0 auto .6rem' : 0,
                flexShrink: 0,
                filter: 'invert(1) brightness(2) contrast(1.1) drop-shadow(0 0 8px rgba(201,161,74,.4))',
                transition: 'filter .3s ease',
            }}
        />
    );
}

function MiniCol({ style }) {
    return (
        <svg style={{ position: 'absolute', ...style }} width="30" height="160" viewBox="0 0 30 160">
            <rect x="8"  y="0"   width="14" height="12" fill="#DCC9A3"/>
            <rect x="5"  y="12"  width="20" height="6"  fill="#DCC9A3"/>
            <rect x="10" y="18"  width="10" height="124" fill="#DCC9A3"/>
            <rect x="5"  y="142" width="20" height="6"  fill="#DCC9A3"/>
            <rect x="2"  y="148" width="26" height="12" fill="#DCC9A3"/>
        </svg>
    );
}

function ColumnSide({ style, flip }) {
    return (
        <svg style={{
            position: 'absolute', top: '50%',
            transform: `translateY(-50%)${flip ? ' scaleX(-1)' : ''}`,
            opacity: .07, zIndex: 1, ...style,
        }} width="60" height="320" viewBox="0 0 60 320">
            <rect x="20" y="0"   width="20" height="20" fill="#DCC9A3"/>
            <rect x="14" y="20"  width="32" height="10" fill="#DCC9A3"/>
            <rect x="22" y="30"  width="16" height="258" fill="#DCC9A3"/>
            <rect x="14" y="288" width="32" height="10" fill="#DCC9A3"/>
            <rect x="8"  y="298" width="44" height="22" fill="#DCC9A3"/>
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
                    background: O, borderRadius: '50%',
                    animation: `floatUp ${p.duration} ${p.delay} linear infinite`,
                    opacity: 0,
                }} />
            ))}
        </div>
    );
}

function Field({ label, required, error, children }) {
    return (
        <div style={{ marginBottom: 14 }}>
            <label style={{ display: 'block', fontSize: 12, fontWeight: 700, color: N, marginBottom: 5 }}>
                {label}{required && <span style={{ color: O }}> *</span>}
            </label>
            {children}
            {error && <p style={{ color: '#C0392B', fontSize: 11, marginTop: 3 }}>{error}</p>}
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
                border: `1.5px solid ${hasError ? '#C0392B' : focused ? O : B}`,
                borderRadius: 8, padding: '11px 12px',
                fontSize: 13,
                background: focused ? '#fff' : W,
                color: N, outline: 'none',
                fontFamily: "'Cairo', sans-serif",
                direction: ltr ? 'ltr' : 'rtl',
                textAlign: ltr ? 'left' : 'right',
                transition: 'border-color .2s, background .2s',
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
                border: `1.5px solid ${hasError ? '#C0392B' : focused ? O : B}`,
                borderRadius: 8, padding: '11px 12px',
                fontSize: 13,
                background: focused ? '#fff' : W,
                color: N, outline: 'none',
                fontFamily: "'Cairo', sans-serif",
                textAlign: 'right',
                cursor: 'pointer',
                transition: 'border-color .2s, background .2s',
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
                padding: '11px', borderRadius: 8, fontSize: 13, fontWeight: 700,
                fontFamily: "'Cairo', sans-serif", cursor: 'pointer',
                border: `1.5px solid ${active ? N : B}`,
                background: active ? N : '#fff',
                color: active ? '#fff' : N,
                transition: 'all .2s',
            }}
        >
            {children}
        </button>
    );
}
