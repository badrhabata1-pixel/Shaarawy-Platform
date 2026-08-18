import { useState, useEffect } from 'react';
import { Head, useForm } from '@inertiajs/react';
import StudentLayout from '@/Layouts/StudentLayout';

const O = '#0D9488';
const BRAND_GRAD = 'linear-gradient(135deg,#0D9488 0%,#d9620a 100%)';
const N = '#14213D';
const G = '#C9A14A';
const B = '#DCC9A3';

export default function PaymentCreate({ units = [], settings = {}, preUnit = null }) {
    const [method, setMethod]   = useState('');
    const [preview, setPreview] = useState(null);
    const [dark, setDark]       = useState(() => {
        try { return localStorage.getItem('student-theme') === 'dark'; } catch { return false; }
    });
    const [copied, setCopied]   = useState(false);

    useEffect(() => {
        const el = document.documentElement;
        const check = () => setDark(el.classList.contains('dark'));
        check();
        const obs = new MutationObserver(check);
        obs.observe(el, { attributes: true, attributeFilter: ['class'] });
        return () => obs.disconnect();
    }, []);

    const { data, setData, post, processing, errors } = useForm({
        unit_id:      preUnit || '',
        method:       '',
        account_name: '',
        amount:       '',
        screenshot:   null,
    });

    const paymentInfo = {
        vodafone: { label: 'فودافون كاش', number: settings.vodafone_number, name: settings.vodafone_name, color: O, grad: BRAND_GRAD, icon: '📱' },
        instapay: { label: 'إنستا باي',   number: settings.instapay_number, name: settings.instapay_name, color: O, grad: BRAND_GRAD, icon: '⚡' },
    };

    const selectMethod = (m) => { setMethod(m); setData('method', m); };

    const handleFile = (e) => {
        const file = e.target.files[0];
        if (!file) return;
        setData('screenshot', file);
        const reader = new FileReader();
        reader.onload = (ev) => setPreview(ev.target.result);
        reader.readAsDataURL(file);
    };

    const copyNumber = () => {
        if (!selectedInfo?.number) return;
        navigator.clipboard.writeText(selectedInfo.number);
        setCopied(true);
        setTimeout(() => setCopied(false), 2000);
    };

    const submit = (e) => {
        e.preventDefault();
        post(route('student.payment.store'), { forceFormData: true });
    };

    const selectedInfo = method ? paymentInfo[method] : null;
    const stepCount    = selectedInfo ? 4 : 3;
    const currentStep  = !data.unit_id ? 1 : !method ? 2 : !data.account_name ? 3 : 4;

    /* ── tokens ──────────────────────────────────────── */
    const bg      = dark ? '#090f1d'            : '#f4ede0';
    const cardBg  = dark ? 'rgba(14,24,46,.85)' : 'rgba(255,252,245,.95)';
    const cardBdr = dark ? 'rgba(201,161,74,.14)': 'rgba(201,161,74,.22)';
    const txt     = dark ? '#f0e8d5'            : N;
    const txtDim  = dark ? 'rgba(220,201,163,.55)': 'rgba(20,33,61,.5)';
    const inputBg = dark ? 'rgba(255,255,255,.05)': '#fff';
    const inputBdr= dark ? 'rgba(220,201,163,.18)': '#d4c9b0';
    const inputClr= dark ? B                    : N;

    return (
        <StudentLayout>
            <Head title="طلب دفع — منصة منصور" />

            <style>{`
                @keyframes fadeUp   { from{opacity:0;transform:translateY(20px)} to{opacity:1;transform:translateY(0)} }
                select option { background: ${dark ? '#090f1d' : '#fff'}; color: ${dark ? '#f0e8d5' : N}; }
                @keyframes shimmer  { 0%{background-position:200% center} 100%{background-position:-200% center} }
                @keyframes glyph    { 0%,100%{opacity:.035} 50%{opacity:.06} }
                .pu { animation: fadeUp .45s both }
                .pay-method:hover { transform: translateY(-3px); }
                .pay-upload:hover { border-color: ${G} !important; background: ${dark ? 'rgba(201,161,74,.06)' : 'rgba(201,161,74,.04)'} !important; }
                .pay-submit:hover:not(:disabled) { transform: translateY(-2px); box-shadow: var(--brand-cta-shadow) !important; }
                .pay-copy:hover  { background: rgba(201,161,74,.22) !important; }
                select option { background: ${dark ? '#0e1a2e' : '#fff'}; color: ${txt}; }
            `}</style>

            {/* ── Page wrapper ──────────────────────────────── */}
            <div style={{ position:'relative', minHeight:'80vh', fontFamily:"'Cairo',sans-serif", direction:'rtl' }}>

                {/* Floating glyphs */}
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

                <div style={{ maxWidth:700, margin:'0 auto', padding:'0 20px 40px', position:'relative', zIndex:1 }}>

                    {/* ── Hero header ───────────────────────── */}
                    <div className="pu" style={{
                        position:'relative', overflow:'hidden',
                        background: dark
                            ? 'linear-gradient(135deg,#0a1628 0%,#0f2040 55%,#07111f 100%)'
                            : 'linear-gradient(135deg,#14213D 0%,#1a2d52 55%,#0f1e3a 100%)',
                        borderRadius:22,
                        padding:'2rem 2.25rem',
                        marginBottom:28,
                        boxShadow: dark
                            ? '0 8px 48px rgba(0,0,0,.6), inset 0 0 0 1px rgba(201,161,74,.15)'
                            : '0 8px 40px rgba(20,33,61,.3), inset 0 0 0 1px rgba(201,161,74,.2)',
                    }}>
                        {/* Paper lines */}
                        <div style={{ position:'absolute', inset:0, opacity:.035, backgroundImage:'repeating-linear-gradient(0deg,transparent,transparent 26px,rgba(201,161,74,1) 26px,rgba(201,161,74,1) 27px)', pointerEvents:'none' }}/>
                        {/* Glyph decoration */}
                        <div style={{ position:'absolute', top:14, left:22, fontSize:52, opacity:.07, userSelect:'none', fontFamily:'serif' }}>𓊹</div>
                        <div style={{ position:'absolute', bottom:10, right:24, fontSize:40, opacity:.05, userSelect:'none', fontFamily:'serif' }}>𓂀</div>

                        {/* Gold accent line */}
                        <div style={{ display:'flex', alignItems:'center', gap:8, marginBottom:10 }}>
                            <div style={{ width:3, height:18, borderRadius:2, background:`linear-gradient(180deg,${G},${O})` }}/>
                            <span style={{ color:G, fontSize:11, fontWeight:700, letterSpacing:'.2em' }}>الاشتراك والدفع</span>
                        </div>
                        <h1 style={{ color:'#fff', fontSize:26, fontWeight:900, margin:'0 0 6px', lineHeight:1.2 }}>
                            💳 طلب دفع اشتراك
                        </h1>
                        <p style={{ color:'rgba(220,201,163,.6)', fontSize:13, margin:0 }}>
                            أرسل إيصال الدفع وسيتم تفعيل اشتراكك خلال دقائق
                        </p>

                        {/* Step pills */}
                        <div style={{ display:'flex', gap:8, marginTop:18, flexWrap:'wrap' }}>
                            {['اختر الوحدة','طريقة الدفع', ...(selectedInfo ? ['ابعت المبلغ'] : []), 'إيصال وإرسال'].map((lbl,i) => {
                                const step = i+1;
                                const done = step < currentStep;
                                const active = step === currentStep;
                                return (
                                    <div key={i} style={{
                                        display:'flex', alignItems:'center', gap:6,
                                        padding:'5px 12px', borderRadius:99,
                                        background: done ? `rgba(52,211,153,.15)` : active ? `rgba(201,161,74,.18)` : 'rgba(255,255,255,.06)',
                                        border: `1px solid ${done ? 'rgba(52,211,153,.3)' : active ? `rgba(201,161,74,.4)` : 'rgba(255,255,255,.1)'}`,
                                        fontSize:11, fontWeight:700,
                                        color: done ? '#34d399' : active ? G : 'rgba(255,255,255,.4)',
                                    }}>
                                        <span>{done ? '✓' : step}</span>
                                        <span>{lbl}</span>
                                    </div>
                                );
                            })}
                        </div>
                    </div>

                    <form onSubmit={submit}>

                        {/* ── Step 1: Unit ──────────────────── */}
                        <StepCard step={1} title="اختر الوحدة الدراسية" dark={dark} cardBg={cardBg} cardBdr={cardBdr} txt={txt}>
                            <select
                                value={data.unit_id}
                                onChange={e => setData('unit_id', e.target.value)}
                                style={{
                                    width:'100%', boxSizing:'border-box', direction:'rtl',
                                    border:`1.5px solid ${errors.unit_id ? '#f87171' : data.unit_id ? G : inputBdr}`,
                                    borderRadius:10, padding:'12px 14px', fontSize:13,
                                    color:inputClr, background:inputBg, outline:'none',
                                    colorScheme: dark ? 'dark' : 'light',
                                    fontFamily:"'Cairo',sans-serif", cursor:'pointer',
                                    transition:'border-color .2s',
                                }}
                            >
                                <option value="">— اختر الوحدة —</option>
                                {units.map(u => (
                                    <option key={u.id} value={u.id}>
                                        {u.title} {u.academic_year?.name ? `(${u.academic_year.name})` : ''} — {u.price} جنيه
                                    </option>
                                ))}
                            </select>
                            {errors.unit_id && <ErrMsg>{errors.unit_id}</ErrMsg>}
                        </StepCard>

                        {/* ── Step 2: Method ────────────────── */}
                        <StepCard step={2} title="اختر طريقة الدفع" dark={dark} cardBg={cardBg} cardBdr={cardBdr} txt={txt}>
                            <div style={{ display:'grid', gridTemplateColumns:'1fr 1fr', gap:14 }}>
                                {Object.entries(paymentInfo).map(([key, info]) => {
                                    const sel = method === key;
                                    return (
                                        <button key={key} type="button" onClick={() => selectMethod(key)} className="pay-method"
                                            style={{
                                                padding:'22px 14px', borderRadius:14,
                                                border:`2px solid ${sel ? info.color : dark ? 'rgba(220,201,163,.12)' : '#e5ddd0'}`,
                                                background: sel
                                                    ? dark ? `${info.color}18` : `${info.color}0e`
                                                    : dark ? 'rgba(255,255,255,.03)' : 'rgba(255,255,255,.7)',
                                                cursor:'pointer', transition:'all .2s',
                                                display:'flex', flexDirection:'column', alignItems:'center', gap:10,
                                                fontFamily:"'Cairo',sans-serif",
                                                boxShadow: sel ? `0 4px 20px ${info.color}25` : 'none',
                                            }}
                                        >
                                            <div style={{
                                                width:52, height:52, borderRadius:'50%',
                                                background: sel ? info.grad : dark ? 'rgba(220,201,163,.08)' : 'rgba(20,33,61,.06)',
                                                display:'flex', alignItems:'center', justifyContent:'center',
                                                fontSize:26, transition:'all .2s',
                                                boxShadow: sel ? `0 4px 16px ${info.color}40` : 'none',
                                            }}>{info.icon}</div>
                                            <span style={{ fontWeight:800, fontSize:14, color: sel ? info.color : txt }}>{info.label}</span>
                                            {sel && (
                                                <div style={{ width:24, height:24, borderRadius:'50%', background:info.grad, display:'flex', alignItems:'center', justifyContent:'center', color:'#fff', fontSize:13 }}>✓</div>
                                            )}
                                        </button>
                                    );
                                })}
                            </div>
                            {errors.method && <ErrMsg>{errors.method}</ErrMsg>}
                        </StepCard>

                        {/* ── Step 3: Payment number ─────────── */}
                        {selectedInfo && (
                            <StepCard step={3} title="ابعت المبلغ على الرقم ده" dark={dark} cardBg={cardBg} cardBdr={cardBdr} txt={txt}>
                                <div style={{
                                    position:'relative', overflow:'hidden',
                                    background:'linear-gradient(135deg,#0a1628 0%,#0f2040 60%,#07111f 100%)',
                                    borderRadius:16, padding:'28px 24px', textAlign:'center',
                                    border:`1px solid ${G}33`,
                                    boxShadow:`0 4px 32px rgba(0,0,0,.35), inset 0 0 0 1px rgba(201,161,74,.08)`,
                                }}>
                                    {/* Paper lines */}
                                    <div style={{ position:'absolute', inset:0, opacity:.03, backgroundImage:'repeating-linear-gradient(0deg,transparent,transparent 24px,rgba(201,161,74,1) 24px,rgba(201,161,74,1) 25px)', pointerEvents:'none' }}/>

                                    {/* Method badge */}
                                    <div style={{ display:'inline-flex', alignItems:'center', gap:8, padding:'6px 16px', borderRadius:99, background:`${selectedInfo.color}20`, border:`1px solid ${selectedInfo.color}40`, marginBottom:16 }}>
                                        <span style={{ fontSize:16 }}>{selectedInfo.icon}</span>
                                        <span style={{ fontSize:12, fontWeight:700, color:selectedInfo.color }}>{selectedInfo.label}</span>
                                    </div>

                                    <div style={{ fontSize:12, color:'rgba(220,201,163,.55)', marginBottom:8, letterSpacing:'.06em' }}>ابعت المبلغ على الرقم</div>

                                    <div style={{
                                        fontSize:32, fontWeight:900, color:G,
                                        letterSpacing:'.1em', fontFamily:'monospace',
                                        direction:'ltr', textAlign:'center',
                                        textShadow:`0 0 20px rgba(201,161,74,.4)`,
                                    }}>
                                        {selectedInfo.number || '—'}
                                    </div>

                                    <div style={{ fontSize:13, color:'rgba(255,255,255,.6)', marginTop:10 }}>
                                        باسم: <strong style={{ color:B }}>{selectedInfo.name || '—'}</strong>
                                    </div>

                                    <button type="button" onClick={copyNumber} className="pay-copy"
                                        style={{
                                            marginTop:16, padding:'9px 24px', borderRadius:10,
                                            background: copied ? 'rgba(52,211,153,.18)' : `rgba(201,161,74,.12)`,
                                            border:`1px solid ${copied ? 'rgba(52,211,153,.4)' : `rgba(201,161,74,.3)`}`,
                                            color: copied ? '#34d399' : G,
                                            fontSize:12, fontWeight:700, cursor:'pointer',
                                            fontFamily:"'Cairo',sans-serif", transition:'all .2s',
                                        }}
                                    >
                                        {copied ? '✓ تم النسخ!' : '📋 نسخ الرقم'}
                                    </button>
                                </div>
                            </StepCard>
                        )}

                        {/* ── Step 4: Screenshot + info ──────── */}
                        <StepCard step={selectedInfo ? 4 : 3} title="ارفع الإيصال وبيانات الدفع" dark={dark} cardBg={cardBg} cardBdr={cardBdr} txt={txt}>

                            {/* Account name */}
                            <FieldLabel dark={dark} txt={txt}>
                                اسم الحساب على منصة الدفع <span style={{ color:O }}>*</span>
                            </FieldLabel>
                            <input
                                type="text"
                                value={data.account_name}
                                onChange={e => setData('account_name', e.target.value)}
                                placeholder="الاسم الظاهر على فودافون / إنستا باي"
                                style={inputStyle(!!errors.account_name, dark, inputBg, inputBdr, inputClr)}
                            />
                            {errors.account_name && <ErrMsg>{errors.account_name}</ErrMsg>}

                            {/* Amount */}
                            <FieldLabel dark={dark} txt={txt} style={{ marginTop:16 }}>
                                المبلغ المدفوع <span style={{ color:txtDim, fontWeight:500 }}>(اختياري)</span>
                            </FieldLabel>
                            <input
                                type="number"
                                value={data.amount}
                                onChange={e => setData('amount', e.target.value)}
                                placeholder="المبلغ بالجنيه"
                                style={inputStyle(false, dark, inputBg, inputBdr, inputClr)}
                            />

                            {/* Upload zone */}
                            <FieldLabel dark={dark} txt={txt} style={{ marginTop:16 }}>
                                صورة إيصال الدفع <span style={{ color:O }}>*</span>
                            </FieldLabel>

                            <label className="pay-upload" style={{
                                display:'flex', flexDirection:'column', alignItems:'center', justifyContent:'center',
                                gap:12, padding: preview ? '16px' : '36px 20px',
                                border:`2px dashed ${errors.screenshot ? '#f87171' : preview ? G : dark ? 'rgba(201,161,74,.22)' : '#d4c9b0'}`,
                                borderRadius:14, cursor:'pointer',
                                background: preview
                                    ? dark ? 'rgba(201,161,74,.06)' : 'rgba(255,248,240,.8)'
                                    : dark ? 'rgba(255,255,255,.025)' : 'rgba(244,237,225,.6)',
                                transition:'all .2s',
                            }}>
                                {preview ? (
                                    <img src={preview} alt="preview" style={{ maxHeight:240, maxWidth:'100%', borderRadius:10, objectFit:'contain', boxShadow:'0 4px 24px rgba(0,0,0,.18)' }} />
                                ) : (
                                    <>
                                        <div style={{ width:64, height:64, borderRadius:'50%', background: dark ? 'rgba(201,161,74,.1)' : 'rgba(201,161,74,.08)', display:'flex', alignItems:'center', justifyContent:'center', fontSize:30 }}>📸</div>
                                        <div style={{ textAlign:'center' }}>
                                            <div style={{ fontSize:14, fontWeight:700, color:txt, marginBottom:4 }}>اضغط لرفع صورة الإيصال</div>
                                            <div style={{ fontSize:11, color:txtDim }}>JPG / PNG / WEBP — حد أقصى 5MB</div>
                                        </div>
                                    </>
                                )}
                                <input type="file" accept="image/*" onChange={handleFile} style={{ display:'none' }} />
                            </label>

                            {errors.screenshot && <ErrMsg>{errors.screenshot}</ErrMsg>}

                            {preview && (
                                <button type="button"
                                    onClick={() => { setPreview(null); setData('screenshot', null); }}
                                    style={{ fontSize:12, color:'#f87171', background:'none', border:'none', cursor:'pointer', marginTop:8, fontFamily:"'Cairo',sans-serif" }}
                                >
                                    ✕ إزالة الصورة
                                </button>
                            )}
                        </StepCard>

                        {/* ── Submit ────────────────────────── */}
                        <button type="submit" disabled={processing} className="pay-submit"
                            style={{
                                width:'100%', padding:'16px', borderRadius:14,
                                background: processing ? (dark ? 'rgba(255,255,255,.1)' : '#d4c9b0') : BRAND_GRAD,
                                color: processing ? txtDim : '#fff',
                                border:'none', fontSize:16, fontWeight:800,
                                cursor: processing ? 'not-allowed' : 'pointer',
                                fontFamily:"'Cairo',sans-serif",
                                boxShadow: processing ? 'none' : 'var(--brand-cta-shadow)',
                                transition:'all .2s',
                                letterSpacing:'.04em',
                            }}
                        >
                            {processing ? '⏳ جارٍ الإرسال...' : '✉️ إرسال طلب الدفع'}
                        </button>

                        {/* Trust note */}
                        <div style={{ display:'flex', alignItems:'center', justifyContent:'center', gap:8, marginTop:14 }}>
                            <span style={{ fontSize:14, opacity:.5 }}>🔒</span>
                            <span style={{ fontSize:12, color:txtDim, textAlign:'center' }}>
                                سيتم مراجعة طلبك وتفعيل الاشتراك خلال دقائق
                            </span>
                        </div>

                    </form>
                </div>
            </div>
        </StudentLayout>
    );
}

/* ── Sub-components ─────────────────────────────────── */

function StepCard({ step, title, dark, cardBg, cardBdr, txt, children }) {
    return (
        <div className="pu" style={{
            background: cardBg,
            backdropFilter:'blur(12px)',
            WebkitBackdropFilter:'blur(12px)',
            borderRadius:18,
            padding:'22px 24px',
            marginBottom:18,
            border:`1px solid ${cardBdr}`,
            boxShadow: dark
                ? '0 4px 32px rgba(0,0,0,.35)'
                : '0 2px 20px rgba(20,33,61,.07)',
        }}>
            <div style={{ display:'flex', alignItems:'center', gap:12, marginBottom:18, paddingBottom:14, borderBottom:`1px solid ${dark ? 'rgba(201,161,74,.1)' : 'rgba(201,161,74,.15)'}` }}>
                <div style={{
                    width:32, height:32, borderRadius:'50%', flexShrink:0,
                    background:`linear-gradient(135deg,${G},${O})`,
                    display:'flex', alignItems:'center', justifyContent:'center',
                    fontSize:13, fontWeight:900, color:'#fff',
                    boxShadow:`0 2px 10px rgba(201,161,74,.35)`,
                }}>{step}</div>
                <h3 style={{ fontSize:14, fontWeight:800, color:txt, margin:0 }}>{title}</h3>
            </div>
            {children}
        </div>
    );
}

function FieldLabel({ dark, txt, children, style = {} }) {
    return (
        <label style={{ display:'block', fontSize:13, fontWeight:700, color:txt, marginBottom:7, ...style }}>
            {children}
        </label>
    );
}

function ErrMsg({ children }) {
    return <p style={{ color:'#f87171', fontSize:12, marginTop:5, display:'flex', alignItems:'center', gap:4 }}>⚠ {children}</p>;
}

const inputStyle = (hasError, dark, bg, bdr, clr) => ({
    width:'100%', boxSizing:'border-box', direction:'rtl',
    border:`1.5px solid ${hasError ? '#f87171' : bdr}`,
    borderRadius:10, padding:'12px 14px', fontSize:13,
    color:clr, outline:'none', fontFamily:"'Cairo',sans-serif",
    background:bg, transition:'border-color .2s',
});
