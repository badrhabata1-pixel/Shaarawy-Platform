import { useState } from 'react';

const GOLD  = '#2fbcd4';
const AMBER = '#8dc63f';
const NAVY  = '#1b3a60';
const EASE  = 'cubic-bezier(.22,1,.36,1)';

export default function PopOutCard({ hero, icon, title, text, zoom = 1, num = '01', featured = false, dark = true, screenBlend = false }) {
    const [hovered, setHovered] = useState(false);
    const imgH = hero ? 500 : (featured ? 240 : 210);

    /* ── Theme-aware tokens ── */
    const card = {
        bg:     dark ? (hovered ? 'rgba(10,18,40,.95)'       : 'rgba(6,12,28,.78)')        : (hovered ? 'rgba(255,251,240,.96)' : 'rgba(255,248,232,.82)'),
        border: dark ? (hovered ? (featured ? 'rgba(244,124,32,.65)' : 'rgba(201,161,74,.55)') : 'rgba(201,161,74,.12)') : (hovered ? (featured ? 'rgba(244,124,32,.6)' : 'rgba(201,161,74,.55)') : 'rgba(201,161,74,.25)'),
        shadow: dark
            ? (hovered ? `0 16px 56px rgba(0,0,0,.6), inset 0 1px 0 rgba(201,161,74,.3)${featured ? ', 0 0 32px rgba(244,124,32,.12)' : ''}` : `0 6px 24px rgba(0,0,0,.4)`)
            : (hovered ? `0 16px 48px rgba(100,70,10,.18), inset 0 1px 0 rgba(201,161,74,.35)` : `0 4px 20px rgba(100,70,10,.1)`),
        titleColor:   dark  ? (hovered ? '#f5d96a' : '#dbb84a')              : (hovered ? '#9a6f1a' : GOLD),
        titleShadow:  dark  ? (hovered ? '0 0 22px rgba(201,161,74,.5)' : 'none') : (hovered ? '0 0 18px rgba(201,161,74,.25)' : 'none'),
        bodyColor:    dark  ? (hovered ? 'rgba(245,240,232,.85)' : 'rgba(210,190,155,.5)') : (hovered ? `rgba(${NAVY.replace('#','').match(/.{2}/g).map(h=>parseInt(h,16)).join(',')},0.85)` : 'rgba(20,33,61,.55)'),
        numColor:     dark  ? (hovered ? (featured ? AMBER : GOLD) : 'rgba(201,161,74,.7)') : (hovered ? (featured ? AMBER : '#7a5210') : 'rgba(100,70,10,.55)'),
        numBorder:    dark  ? (hovered ? (featured ? 'rgba(244,124,32,.45)' : 'rgba(201,161,74,.4)') : 'rgba(201,161,74,.18)') : (hovered ? 'rgba(201,161,74,.5)' : 'rgba(201,161,74,.25)'),
        numBg:        dark  ? (hovered ? 'rgba(201,161,74,.06)' : 'transparent') : (hovered ? 'rgba(201,161,74,.1)' : 'transparent'),
        divider:      featured ? AMBER : GOLD,
        glowColor:    hovered ? `rgba(244,124,32,.${dark?'42':'28'})` : `rgba(201,161,74,.${dark?'18':'14'})`,
    };

    return (
        <div
            onMouseEnter={() => setHovered(true)}
            onMouseLeave={() => setHovered(false)}
            style={{ display:'flex', flexDirection:'column', alignItems:'center', userSelect:'none', cursor:'default', width:'100%' }}
        >
            {/* ── Image + ground glow ── */}
            <div style={{ position:'relative', height:imgH, width:'100%', display:'flex', alignItems:'flex-end', justifyContent:'center' }}>

                {/* Ground glow */}
                <div style={{
                    position:'absolute', bottom:0, left:'10%', right:'10%', height:90,
                    background:`radial-gradient(ellipse at center bottom, ${card.glowColor} 0%, transparent 70%)`,
                    filter:'blur(18px)',
                    transition:`all 0.55s ${EASE}`,
                    pointerEvents:'none',
                }}/>

                {/* Side rim lights on hover */}
                {hovered && <>
                    <div style={{ position:'absolute', left:0, top:'20%', width:2, height:'60%', background:`linear-gradient(180deg,transparent,${featured ? AMBER : GOLD},transparent)`, opacity: dark ? .35 : .2, borderRadius:2 }}/>
                    <div style={{ position:'absolute', right:0, top:'20%', width:2, height:'60%', background:`linear-gradient(180deg,transparent,${featured ? AMBER : GOLD},transparent)`, opacity: dark ? .35 : .2, borderRadius:2 }}/>
                </>}

                {hero ? (
                    <img
                        src={hero}
                        alt={title}
                        style={{
                            width:'100%', height:'100%',
                            objectFit:'contain', objectPosition:'bottom center',
                            transform:`scale(${hovered ? zoom * 1.06 : zoom}) translateY(${hovered ? -14 : 0}px)`,
                            transformOrigin:'bottom center',
                            transition:`transform 0.65s ${EASE}, filter 0.5s ease`,
                            filter: hovered
                                ? `drop-shadow(0 34px 65px rgba(0,0,0,${dark?.9:.55})) drop-shadow(0 0 48px rgba(47,188,212,.28)) brightness(1.09)`
                                : `drop-shadow(0 20px 44px rgba(0,0,0,${dark?.75:.35})) brightness(1.0)`,
                            mixBlendMode: screenBlend ? 'screen' : undefined,
                            pointerEvents:'none', willChange:'transform',
                        }}
                    />
                ) : icon && (
                    <div style={{
                        position:'relative', margin:'auto',
                        transform:`scale(${hovered ? 1.08 : 1}) translateY(${hovered ? -10 : 0}px)`,
                        transition:`transform 0.65s ${EASE}`,
                    }}>
                        {/* حلقة زخرفية */}
                        <svg width="150" height="150" viewBox="0 0 150 150" style={{ position:'absolute', inset:0 }}>
                            <circle cx="75" cy="75" r="70" fill="none" stroke={featured ? AMBER : GOLD} strokeWidth="1.4" opacity={hovered ? .7 : .4}/>
                            <circle cx="75" cy="75" r="60" fill="none" stroke={featured ? AMBER : GOLD} strokeWidth=".7" opacity={hovered ? .4 : .22}/>
                            <rect x="55" y="55" width="40" height="40" transform="rotate(45 75 75)" fill="none" stroke={featured ? AMBER : GOLD} strokeWidth="1" opacity={hovered ? .55 : .3}/>
                        </svg>
                        <div style={{
                            width:150, height:150, borderRadius:'50%',
                            display:'flex', alignItems:'center', justifyContent:'center',
                            fontSize:56,
                            filter: hovered ? `drop-shadow(0 0 26px rgba(47,188,212,.5))` : `drop-shadow(0 0 14px rgba(47,188,212,.25))`,
                            transition:`filter 0.5s ease`,
                        }}>{icon}</div>
                    </div>
                )}
            </div>

            {/* ── Info card — هوية الموقع: ذهبي على داكن، نسيج نجمة ثمانية، أركان مزخرفة ── */}
            {(() => {
                const acc   = featured ? '#E8C784' : '#C9A96A';
                const deep  = featured ? '#B98A4B' : '#8B5E3C';
                const ar    = { '01':'١', '02':'٢', '03':'٣', '04':'٤' }[num] ?? num;
                const patId = `popPat-${num}`;
                const bgCard = dark
                    ? (hovered ? 'linear-gradient(160deg,#1E2A22 0%,#16120E 70%)' : 'linear-gradient(160deg,#1A1714 0%,#100D0A 75%)')
                    : (hovered ? 'linear-gradient(160deg,#FBF6E8,#F1E6C8)' : 'linear-gradient(160deg,#FFFDF6,#F6EEDA)');
                return (
                    <div style={{
                        position:'relative', width:'100%', marginTop:30,
                        transform: hovered ? 'translateY(-4px)' : 'none',
                        transition:`transform .5s ${EASE}`,
                    }}>
                        {/* ختم الرقم — معين ذهبي يعلو حافة الكارت */}
                        <div style={{
                            position:'absolute', top:-21, left:'50%', transform:'translateX(-50%)',
                            width:42, height:42, zIndex:4,
                        }}>
                            <div style={{
                                position:'absolute', inset:0, transform:`rotate(${hovered ? 135 : 45}deg)`, borderRadius:8,
                                background:`linear-gradient(145deg,#F0DDA8,${acc} 55%,${deep})`,
                                boxShadow:`0 8px 20px rgba(0,0,0,.45), 0 0 ${hovered ? 22 : 8}px ${acc}66, inset 0 1px 0 rgba(255,255,255,.5)`,
                                transition:`transform .6s ${EASE}, box-shadow .4s ease`,
                            }}/>
                        </div>
                        <div style={{
                            position:'absolute', top:-21, left:'50%', transform:'translateX(-50%)', width:42, height:42, zIndex:5,
                            display:'flex', alignItems:'center', justifyContent:'center',
                            fontFamily:"'Amiri','Cairo',serif", fontWeight:800, fontSize:17, color:'#2A1A0A',
                        }}>{ar}</div>

                        {/* جسم الكارت */}
                        <div style={{
                            position:'relative', overflow:'hidden', textAlign:'center',
                            padding: featured ? '44px 30px 34px' : '40px 26px 30px',
                            borderRadius:20,
                            background: bgCard,
                            border:`1px solid ${hovered ? acc + (featured ? 'CC' : '99') : (dark ? 'rgba(201,169,106,.22)' : 'rgba(139,94,60,.25)')}`,
                            boxShadow: hovered
                                ? `0 26px 60px rgba(0,0,0,${dark?.6:.18}), 0 0 ${featured ? 46 : 30}px ${acc}${featured ? '33' : '1F'}, inset 0 1px 0 ${acc}40`
                                : `0 10px 30px rgba(0,0,0,${dark?.42:.1}), inset 0 1px 0 ${acc}1F`,
                            transition:`background .5s ease, border-color .4s ease, box-shadow .5s ease`,
                        }}>
                            {/* نسيج نجمة ثمانية */}
                            <svg style={{ position:'absolute', inset:0, width:'100%', height:'100%', opacity: hovered ? .12 : .06, transition:'opacity .5s ease', pointerEvents:'none' }}>
                                <defs>
                                    <pattern id={patId} width="34" height="34" patternUnits="userSpaceOnUse">
                                        <g stroke={acc} fill="none" strokeWidth="1">
                                            <rect x="4" y="4" width="26" height="26"/>
                                            <rect x="4" y="4" width="26" height="26" transform="rotate(45 17 17)"/>
                                        </g>
                                    </pattern>
                                </defs>
                                <rect width="100%" height="100%" fill={`url(#${patId})`}/>
                            </svg>

                            {/* توهج علوي */}
                            <div style={{ position:'absolute', top:-60, left:'50%', transform:'translateX(-50%)', width:'70%', height:120, background:`radial-gradient(ellipse,${acc}${hovered?'3A':'1A'} 0%,transparent 70%)`, transition:'background .5s ease', pointerEvents:'none' }}/>

                            {/* إطار داخلي */}
                            <div style={{ position:'absolute', inset:8, borderRadius:13, border:`1px solid ${acc}`, opacity: hovered ? .45 : .18, transition:'opacity .5s ease', pointerEvents:'none' }}/>

                            {/* أركان مزخرفة */}
                            {['tl','tr','bl','br'].map(pos => (
                                <svg key={pos} viewBox="0 0 30 30" width="20" height="20" style={{
                                    position:'absolute', color:acc, opacity: hovered ? 1 : .5, transition:'opacity .4s ease', pointerEvents:'none',
                                    top: pos[0]==='t' ? 12 : 'auto', bottom: pos[0]==='b' ? 12 : 'auto',
                                    right: pos[1]==='r' ? 12 : 'auto', left: pos[1]==='l' ? 12 : 'auto',
                                    transform:`scale(${pos[1]==='r'?-1:1},${pos[0]==='b'?-1:1})`,
                                }}>
                                    <path d="M3,19 L3,3 L19,3" stroke="currentColor" strokeWidth="1.4" fill="none" strokeLinecap="round"/>
                                    <rect x="0" y="0" width="7" height="7" transform="rotate(45 3.2 3.2)" fill="currentColor"/>
                                </svg>
                            ))}

                            {/* العنوان */}
                            <div style={{
                                position:'relative', zIndex:2,
                                fontFamily:"'Amiri','Cairo',serif", fontWeight:700,
                                fontSize: featured ? 24 : 21, lineHeight:1.45, marginBottom:14,
                                color: dark ? (hovered ? '#F3D98F' : '#E8C784') : (hovered ? '#7A4E1F' : '#8B5E3C'),
                                textShadow: dark && hovered ? '0 0 22px rgba(232,199,132,.45)' : 'none',
                                transition:'color .3s ease, text-shadow .3s ease',
                            }}>{title}</div>

                            {/* فاصل ماسي */}
                            <div style={{ position:'relative', zIndex:2, display:'flex', alignItems:'center', justifyContent:'center', gap:8, marginBottom:16 }}>
                                <div style={{ width: hovered ? 46 : 26, height:1, background:`linear-gradient(90deg,transparent,${acc})`, transition:`width .5s ${EASE}` }}/>
                                <svg width="8" height="8" viewBox="0 0 18 18"><rect x="4" y="4" width="10" height="10" transform="rotate(45 9 9)" fill={acc}/></svg>
                                <div style={{ width: hovered ? 46 : 26, height:1, background:`linear-gradient(90deg,${acc},transparent)`, transition:`width .5s ${EASE}` }}/>
                            </div>

                            {/* النص */}
                            <div style={{
                                position:'relative', zIndex:2,
                                fontSize:14, lineHeight:2, maxWidth:300, margin:'0 auto',
                                color: dark ? (hovered ? 'rgba(245,239,223,.92)' : 'rgba(232,220,193,.72)') : 'rgba(42,26,10,.78)',
                                transition:'color .4s ease',
                            }}>{text}</div>
                        </div>
                    </div>
                );
            })()}
        </div>
    );
}
