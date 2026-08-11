import React, { useState } from 'react';
import { PortraitFrame, KnightFigure, PashaFigure, CleopatraFigure, HopliteFigure } from '@/Components/HistoryIcons';

const GOLD  = '#C9A14A';
const AMBER = '#F47C20';
const STONE = '#DCC9A3';

const PRESETS = [
    { Figure: KnightFigure,    title: 'الفارس الإسلامي',  sub: 'بأسلوب صلاح الدين الأيوبي' },
    { Figure: PashaFigure,     title: 'الباشا العثماني',  sub: 'بأسلوب محمد علي'           },
    { Figure: CleopatraFigure, title: 'الملكة الفرعونية', sub: 'بأسلوب الأسرة البطلمية'    },
    { Figure: HopliteFigure,   title: 'المحارب اليوناني', sub: 'بأسلوب العصر الكلاسيكي'    },
];

/* ════════════════════════════════════════════════════════════════
   AI HISTORY PORTRAIT GENERATOR — UI mockup only.
   No real API call: result is a randomly-picked preset rendered
   with the student's name, after a short fake "generating" delay.
════════════════════════════════════════════════════════════════ */
export default function AIPortraitWidget() {
    const [name, setName]   = useState('');
    const [status, setStatus] = useState('idle'); // idle | loading | done
    const [result, setResult] = useState(null);

    const generate = (e) => {
        e.preventDefault();
        if (!name.trim() || status === 'loading') return;
        setStatus('loading');
        setResult(null);
        setTimeout(() => {
            setResult(PRESETS[Math.floor(Math.random() * PRESETS.length)]);
            setStatus('done');
        }, 1700);
    };

    return (
        <div style={{
            borderRadius: 24,
            border: `1px solid rgba(201,161,74,.28)`,
            background: 'linear-gradient(155deg, rgba(12,25,41,.85), rgba(8,17,28,.92))',
            backdropFilter: 'blur(16px)',
            padding: 'clamp(24px,4vw,40px)',
            display: 'grid',
            gridTemplateColumns: '1fr 1fr',
            gap: 36,
            alignItems: 'center',
        }}
        className="ai-widget-grid"
        >
            {/* Left: form */}
            <div>
                <div style={{ display:'inline-flex', alignItems:'center', gap:8, padding:'5px 14px', borderRadius:999, border:`1px solid rgba(201,161,74,.35)`, background:'rgba(201,161,74,.08)', marginBottom:18 }}>
                    <span style={{ fontSize:13 }}>✨</span>
                    <span style={{ fontSize:12, color:GOLD, letterSpacing:'.08em' }}>مولّد الصور بالذكاء الاصطناعي</span>
                </div>

                <h3 style={{ color:'#F5F0E8', fontSize:'clamp(20px,2.6vw,28px)', fontWeight:800, margin:'0 0 12px', lineHeight:1.4 }}>
                    اكتب اسمك.. وشوف نفسك في زمن التاريخ
                </h3>
                <p style={{ color:'rgba(245,240,232,.55)', fontSize:14, lineHeight:1.9, margin:'0 0 24px', maxWidth:420 }}>
                    جرّب أداة توليد الصور التاريخية — اكتب اسمك وهنحوّلك لشخصية من العصور القديمة بضغطة واحدة.
                </p>

                <form onSubmit={generate} style={{ display:'flex', gap:10, flexWrap:'wrap' }}>
                    <input
                        value={name}
                        onChange={e => setName(e.target.value)}
                        placeholder="اكتب اسمك هنا..."
                        style={{
                            flex:'1 1 200px', minWidth:0,
                            padding:'13px 18px', borderRadius:12,
                            border:`1.5px solid rgba(201,161,74,.3)`,
                            background:'rgba(255,255,255,.05)',
                            color:'#F5F0E8', fontSize:14, fontFamily:'Cairo,sans-serif',
                            outline:'none',
                        }}
                    />
                    <button
                        type="submit"
                        disabled={!name.trim() || status === 'loading'}
                        style={{
                            padding:'13px 26px', borderRadius:12, border:'none',
                            background: !name.trim() ? 'rgba(201,161,74,.25)' : `linear-gradient(135deg,${GOLD},${AMBER})`,
                            color:'#0c1929', fontWeight:800, fontSize:14, fontFamily:'Cairo,sans-serif',
                            cursor: !name.trim() ? 'not-allowed' : 'pointer',
                            opacity: status === 'loading' ? .75 : 1,
                            transition:'opacity .2s, transform .15s',
                            whiteSpace:'nowrap',
                        }}
                    >
                        {status === 'loading' ? '⏳ بنرسم...' : '🪄 ولّد صورتي'}
                    </button>
                </form>

                <p style={{ color:'rgba(245,240,232,.32)', fontSize:11, marginTop:14 }}>
                    تجربة توضيحية — النتيجة بصور جاهزة لأشهر شخصيات التاريخ
                </p>
            </div>

            {/* Right: result preview */}
            <div style={{
                display:'flex', flexDirection:'column', alignItems:'center', justifyContent:'center',
                minHeight: 260, position:'relative',
            }}>
                {status === 'idle' && (
                    <div style={{ textAlign:'center', opacity:.5 }}>
                        <div style={{ fontSize:40, marginBottom:10 }}>🏺</div>
                        <p style={{ color:STONE, fontSize:13 }}>النتيجة هتظهر هنا</p>
                    </div>
                )}

                {status === 'loading' && (
                    <div style={{ textAlign:'center' }}>
                        <div style={{
                            width:70, height:70, borderRadius:'50%',
                            border:`3px solid rgba(201,161,74,.2)`,
                            borderTopColor: GOLD,
                            margin:'0 auto 16px',
                            animation:'aiSpin 1s linear infinite',
                        }}/>
                        <p style={{ color:STONE, fontSize:13 }}>بنحوّلك لشخصية تاريخية...</p>
                    </div>
                )}

                {status === 'done' && result && (
                    <div style={{ animation:'aiPop .5s ease both' }}>
                        <PortraitFrame size={170} label={name} sublabel={`${result.title} — ${result.sub}`}>
                            <result.Figure/>
                        </PortraitFrame>
                    </div>
                )}
            </div>

            <style>{`
                @keyframes aiSpin { to { transform: rotate(360deg); } }
                @keyframes aiPop  { 0%{opacity:0;transform:scale(.85)} 100%{opacity:1;transform:scale(1)} }
                @keyframes frame-pulse { 0%,100%{opacity:.55} 50%{opacity:.9} }
                @media (max-width: 768px) {
                    .ai-widget-grid { grid-template-columns: 1fr !important; }
                }
            `}</style>
        </div>
    );
}
