import { useState } from 'react';

const GOLD  = '#C9A14A';
const AMBER = '#F47C20';
const NAVY  = '#14213D';
const EASE  = 'cubic-bezier(.22,1,.36,1)';

export default function PopOutCard({ hero, title, text, zoom = 1, num = '01', featured = false, dark = true, screenBlend = false }) {
    const [hovered, setHovered] = useState(false);
    const imgH = featured ? 540 : 460;

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
                            ? `drop-shadow(0 34px 65px rgba(0,0,0,${dark?.9:.55})) drop-shadow(0 0 48px rgba(201,161,74,.28)) brightness(1.09)`
                            : `drop-shadow(0 20px 44px rgba(0,0,0,${dark?.75:.35})) brightness(1.0)`,
                        mixBlendMode: screenBlend ? 'screen' : undefined,
                        pointerEvents:'none', willChange:'transform',
                    }}
                />
            </div>

            {/* ── Glass info card ── */}
            <div style={{
                width:'100%', marginTop:18,
                padding: featured ? '26px 28px 30px' : '20px 22px 24px',
                borderRadius:20,
                background: card.bg,
                backdropFilter:'blur(24px)',
                border:`1px solid ${card.border}`,
                boxShadow: card.shadow,
                transition:`all 0.5s ${EASE}`,
                textAlign:'center', position:'relative', overflow:'hidden',
            }}>
                {/* Top shimmer */}
                <div style={{
                    position:'absolute', top:0, left:'20%', right:'20%', height:1,
                    background:`linear-gradient(90deg,transparent,${card.divider},transparent)`,
                    opacity: hovered ? 1 : 0.25,
                    transition:'opacity 0.4s ease',
                }}/>

                {/* Number badge */}
                <div style={{
                    display:'inline-block', marginBottom:14,
                    fontSize:10, fontWeight:900, letterSpacing:'.3em',
                    color: card.numColor,
                    padding:'5px 14px', borderRadius:99,
                    border:`1px solid ${card.numBorder}`,
                    background: card.numBg,
                    transition:`all 0.35s ease`,
                }}>{num}</div>

                {/* Title */}
                <div style={{
                    fontSize: featured ? 19 : 16, fontWeight:800,
                    color: card.titleColor,
                    marginBottom:12, lineHeight:1.5,
                    transition:'color 0.3s ease, text-shadow 0.3s ease',
                    textShadow: card.titleShadow,
                    letterSpacing:'.02em',
                }}>{title}</div>

                {/* Divider */}
                <div style={{
                    height:1, borderRadius:1, margin:'0 auto 14px',
                    width: hovered ? 52 : 26,
                    background:`linear-gradient(90deg,transparent,${card.divider},transparent)`,
                    transition:`width 0.5s ${EASE}`,
                }}/>

                {/* Body text */}
                <div style={{
                    fontSize:13, lineHeight:2,
                    color: card.bodyColor,
                    maxWidth:290, margin:'0 auto',
                    transition:'color 0.4s ease',
                }}>{text}</div>
            </div>
        </div>
    );
}
