import { useState, useEffect } from 'react';
import { Head, useForm, usePage } from '@inertiajs/react';
import StudentLayout from '@/Layouts/StudentLayout';

const O = '#0D9488';
const BRAND_GRAD = 'linear-gradient(135deg,#0D9488 0%,#d9620a 100%)';
const N = '#14213D';
const G = '#C9A14A';
const B = '#DCC9A3';

export default function PaymentActivate() {
    const { flash } = usePage().props;
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

    const { data, setData, post, processing, errors, reset } = useForm({ code: '' });

    const submit = (e) => {
        e.preventDefault();
        post(route('student.payment.activate'), { onSuccess: () => reset() });
    };

    const bg      = dark ? '#090f1d'             : '#f4ede0';
    const cardBg  = dark ? 'rgba(14,24,46,.85)'  : 'rgba(255,252,245,.95)';
    const cardBdr = dark ? 'rgba(201,161,74,.14)': 'rgba(201,161,74,.22)';
    const txt     = dark ? '#f0e8d5'             : N;
    const txtDim  = dark ? 'rgba(220,201,163,.55)': 'rgba(20,33,61,.5)';
    const inputBg = dark ? 'rgba(255,255,255,.05)': '#fff';
    const inputBdr= dark ? 'rgba(220,201,163,.18)': '#d4c9b0';
    const inputClr= dark ? B                     : N;

    return (
        <StudentLayout>
            <Head title="تفعيل الاشتراك — منصة منصور" />

            <style>{`
                @keyframes fadeUp { from{opacity:0;transform:translateY(20px)} to{opacity:1;transform:translateY(0)} }
                @keyframes glyph  { 0%,100%{opacity:.035} 50%{opacity:.06} }
                .pa { animation: fadeUp .45s both }
                .pa-submit:hover:not(:disabled) { transform: translateY(-2px); box-shadow: var(--brand-cta-shadow) !important; }
            `}</style>

            <div style={{ position:'relative', minHeight:'70vh', fontFamily:"'Cairo',sans-serif", direction:'rtl' }}>

                {['𓂀','𓃭','𓅓','𓊹','𓆑'].map((g,i) => (
                    <div key={i} style={{
                        position:'absolute', pointerEvents:'none', userSelect:'none',
                        fontSize: 48+i*8, opacity:.04,
                        top:`${[5,20,55,75,40][i]}%`, left:`${[3,88,5,85,45][i]}%`,
                        animation:`glyph ${3+i}s ease-in-out infinite`,
                        animationDelay:`${i*.7}s`, fontFamily:'serif',
                        color: G,
                    }}>{g}</div>
                ))}

                <div style={{ maxWidth:520, margin:'0 auto', padding:'0 20px 40px', position:'relative', zIndex:1 }}>

                    {/* ── Hero header ───────────────────────── */}
                    <div className="pa" style={{
                        position:'relative', overflow:'hidden',
                        background: dark
                            ? 'linear-gradient(135deg,#0a1628 0%,#0f2040 55%,#07111f 100%)'
                            : 'linear-gradient(135deg,#14213D 0%,#1a2d52 55%,#0f1e3a 100%)',
                        borderRadius:22, padding:'2rem 2.25rem', marginBottom:28,
                        boxShadow: dark
                            ? '0 8px 48px rgba(0,0,0,.6), inset 0 0 0 1px rgba(201,161,74,.15)'
                            : '0 8px 40px rgba(20,33,61,.3), inset 0 0 0 1px rgba(201,161,74,.2)',
                    }}>
                        <div style={{ position:'absolute', inset:0, opacity:.035, backgroundImage:'repeating-linear-gradient(0deg,transparent,transparent 26px,rgba(201,161,74,1) 26px,rgba(201,161,74,1) 27px)', pointerEvents:'none' }}/>
                        <div style={{ position:'absolute', top:14, left:22, fontSize:52, opacity:.07, userSelect:'none', fontFamily:'serif' }}>𓊹</div>
                        <div style={{ position:'absolute', bottom:10, right:24, fontSize:40, opacity:.05, userSelect:'none', fontFamily:'serif' }}>𓂀</div>

                        <div style={{ display:'flex', alignItems:'center', gap:8, marginBottom:10 }}>
                            <div style={{ width:3, height:18, borderRadius:2, background:`linear-gradient(180deg,${G},${O})` }}/>
                            <span style={{ color:G, fontSize:11, fontWeight:700, letterSpacing:'.2em' }}>تفعيل الاشتراك</span>
                        </div>
                        <h1 style={{ color:'#fff', fontSize:26, fontWeight:900, margin:'0 0 6px', lineHeight:1.2 }}>
                            🔑 كود التفعيل
                        </h1>
                        <p style={{ color:'rgba(220,201,163,.6)', fontSize:13, margin:0 }}>
                            إنت طالب أوفلاين — هتفعّل اشتراكك بكود التفعيل اللي معاك مباشرة، من غير دفع إلكتروني
                        </p>
                    </div>

                    {flash?.success && (
                        <div className="pa" style={{
                            background: dark ? 'rgba(52,211,153,.12)' : 'rgba(52,211,153,.1)',
                            border: '1px solid rgba(52,211,153,.35)', borderRadius:14,
                            padding:'14px 18px', marginBottom:20, color:'#34d399', fontSize:13, fontWeight:700, textAlign:'center',
                        }}>
                            ✓ {flash.success}
                        </div>
                    )}

                    <form onSubmit={submit} className="pa" style={{
                        background: cardBg, backdropFilter:'blur(12px)', WebkitBackdropFilter:'blur(12px)',
                        borderRadius:18, padding:'26px 24px', border:`1px solid ${cardBdr}`,
                        boxShadow: dark ? '0 4px 32px rgba(0,0,0,.35)' : '0 2px 20px rgba(20,33,61,.07)',
                    }}>
                        <label style={{ display:'block', fontSize:13, fontWeight:700, color:txt, marginBottom:9 }}>
                            اكتب كود التفعيل هنا <span style={{ color:O }}>*</span>
                        </label>
                        <input
                            type="text"
                            value={data.code}
                            onChange={e => setData('code', e.target.value)}
                            placeholder="مثال: 1234567890"
                            dir="ltr"
                            autoFocus
                            style={{
                                width:'100%', boxSizing:'border-box', textAlign:'center', direction:'ltr',
                                border:`1.5px solid ${errors.code ? '#f87171' : inputBdr}`,
                                borderRadius:12, padding:'16px 14px', fontSize:20, fontWeight:800,
                                letterSpacing:'.12em', color:inputClr, outline:'none',
                                fontFamily:'monospace', background:inputBg, transition:'border-color .2s',
                            }}
                        />
                        {errors.code && (
                            <p style={{ color:'#f87171', fontSize:12, marginTop:8, display:'flex', alignItems:'center', gap:4 }}>⚠ {errors.code}</p>
                        )}

                        <button type="submit" disabled={processing} className="pa-submit"
                            style={{
                                width:'100%', padding:'15px', borderRadius:14, marginTop:20,
                                background: processing ? (dark ? 'rgba(255,255,255,.1)' : '#d4c9b0') : BRAND_GRAD,
                                color: processing ? txtDim : '#fff',
                                border:'none', fontSize:15, fontWeight:800,
                                cursor: processing ? 'not-allowed' : 'pointer',
                                fontFamily:"'Cairo',sans-serif",
                                boxShadow: processing ? 'none' : 'var(--brand-cta-shadow)',
                                transition:'all .2s', letterSpacing:'.04em',
                            }}
                        >
                            {processing ? '⏳ جارٍ التفعيل...' : '✓ فعّل الاشتراك'}
                        </button>

                        <div style={{ display:'flex', alignItems:'center', justifyContent:'center', gap:8, marginTop:16 }}>
                            <span style={{ fontSize:14, opacity:.5 }}>💬</span>
                            <span style={{ fontSize:12, color:txtDim, textAlign:'center' }}>
                                مش لاقي الكود؟ تواصل مع السكرتارية للحصول عليه
                            </span>
                        </div>
                    </form>
                </div>
            </div>
        </StudentLayout>
    );
}
