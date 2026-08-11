import React from 'react';

/* ── Brand palette (kept local — these icons are reused outside Welcome.jsx too) ── */
const GOLD  = '#C9A14A';
const AMBER = '#F47C20';
const STONE = '#DCC9A3';
const NAVY  = '#14213D';

/* ════════════════════════════════════════════════════════════════
   ORNATE GOLD NEOCLASSICAL FRAME
   Wraps any child (SVG figure / image) in a carved gold frame
   with corner flourishes — used by the portrait carousel.
════════════════════════════════════════════════════════════════ */
export function PortraitFrame({ children, size = 180, label, sublabel, empty = false, dark = true }) {
    return (
        <div style={{ display:'flex', flexDirection:'column', alignItems:'center', gap:14, flexShrink:0 }}>
            <div style={{
                position:'relative', width:size, height:size,
                borderRadius:'50%',
                background:`linear-gradient(155deg,#3a2f12,#1a1408)`,
                padding:8,
                boxShadow:`0 10px 30px rgba(0,0,0,.45), inset 0 0 0 1px rgba(201,161,74,.3)`,
            }}>
                {/* Outer carved ring */}
                <svg viewBox="0 0 100 100" style={{ position:'absolute', inset:0, width:'100%', height:'100%' }}>
                    <circle cx="50" cy="50" r="48" fill="none" stroke={GOLD} strokeWidth="1.4" opacity=".55"/>
                    <circle cx="50" cy="50" r="44" fill="none" stroke={GOLD} strokeWidth=".6" opacity=".35"/>
                    {/* Laurel-like corner ticks */}
                    {Array.from({ length: 24 }).map((_, i) => {
                        const a = (i / 24) * Math.PI * 2;
                        const x1 = 50 + Math.cos(a) * 46, y1 = 50 + Math.sin(a) * 46;
                        const x2 = 50 + Math.cos(a) * 49.5, y2 = 50 + Math.sin(a) * 49.5;
                        return <line key={i} x1={x1} y1={y1} x2={x2} y2={y2} stroke={GOLD} strokeWidth=".8" opacity=".5"/>;
                    })}
                </svg>

                {/* Inner portrait disc */}
                <div style={{
                    position:'relative', width:'100%', height:'100%', borderRadius:'50%',
                    background: empty
                        ? `linear-gradient(160deg,${NAVY},#0c1929)`
                        : `linear-gradient(160deg,#1c2a44,${NAVY})`,
                    border:`1.5px solid rgba(201,161,74,.45)`,
                    overflow:'hidden', display:'flex', alignItems:'center', justifyContent:'center',
                    filter: empty ? 'blur(.4px)' : 'none',
                }}>
                    {empty ? (
                        <div style={{ textAlign:'center', opacity:.55 }}>
                            <svg width="38" height="38" viewBox="0 0 32 32" fill="none" style={{ margin:'0 auto 6px', animation:'frame-pulse 2.6s ease-in-out infinite' }}>
                                <circle cx="16" cy="10" r="7" fill={GOLD} opacity=".5"/>
                                <path d="M3 30 Q3 19 16 19 Q29 19 29 30" fill={GOLD} opacity=".35"/>
                            </svg>
                            <span style={{ fontSize:9, color:STONE, fontFamily:'Cairo,sans-serif' }}>قريباً</span>
                        </div>
                    ) : children}
                </div>

                {/* Top gold ornament */}
                <svg width="26" height="20" viewBox="0 0 26 20" style={{ position:'absolute', top:-10, left:'50%', transform:'translateX(-50%)' }}>
                    <path d="M13,0 L18,8 L13,6 L8,8 Z" fill={GOLD}/>
                    <circle cx="13" cy="14" r="3" fill={GOLD} opacity=".85"/>
                </svg>
            </div>

            {label && (
                <div style={{ textAlign:'center' }}>
                    <div style={{ color: dark ? STONE : NAVY, fontWeight:800, fontSize:13, fontFamily:'Cairo,sans-serif' }}>{label}</div>
                    {sublabel && <div style={{ color: dark ? 'rgba(220,201,163,.55)' : 'rgba(20,33,61,.6)', fontSize:11, marginTop:2 }}>{sublabel}</div>}
                </div>
            )}
        </div>
    );
}

/* ════════════════════════════════════════════════════════════════
   FLAT SILHOUETTE FIGURES — simple, stylised, no photo assets needed
════════════════════════════════════════════════════════════════ */
export function HopliteFigure() {
    return (
        <svg width="74" height="74" viewBox="0 0 64 64" fill="none">
            <circle cx="32" cy="20" r="9" fill={GOLD} opacity=".85"/>
            {/* Corinthian helmet crest */}
            <path d="M22,15 Q32,2 42,15 L40,18 Q32,10 24,18 Z" fill={STONE}/>
            <rect x="29" y="11" width="6" height="4" rx="1" fill={NAVY}/>
            <path d="M16,58 Q16,34 32,32 Q48,34 48,58 Z" fill={GOLD} opacity=".7"/>
            {/* shield */}
            <ellipse cx="14" cy="42" rx="7" ry="11" fill={STONE} opacity=".8" stroke={GOLD} strokeWidth="1"/>
            {/* spear */}
            <line x1="50" y1="6" x2="50" y2="58" stroke={STONE} strokeWidth="1.6"/>
            <path d="M50,6 L46,14 L54,14 Z" fill={STONE}/>
        </svg>
    );
}

export function CleopatraFigure() {
    return (
        <svg width="74" height="74" viewBox="0 0 64 64" fill="none">
            <circle cx="32" cy="22" r="9" fill={GOLD} opacity=".85"/>
            {/* Nemes headdress stripes */}
            <path d="M21,15 Q32,6 43,15 L43,28 Q40,24 38,28 L34,22 L30,28 L26,24 Q24,28 21,28 Z" fill={AMBER} opacity=".9"/>
            {/* cobra */}
            <path d="M32,8 Q35,2 39,5" stroke={GOLD} strokeWidth="1.6" fill="none"/>
            <circle cx="39" cy="5" r="1.6" fill={GOLD}/>
            <path d="M14,58 Q14,32 32,30 Q50,32 50,58 Z" fill={STONE} opacity=".75"/>
            {/* collar */}
            <path d="M22,32 Q32,38 42,32" stroke={GOLD} strokeWidth="2.2" fill="none"/>
        </svg>
    );
}

export function KnightFigure() {
    return (
        <svg width="74" height="74" viewBox="0 0 64 64" fill="none">
            {/* Helmet with nasal guard */}
            <path d="M22,22 Q22,10 32,9 Q42,10 42,22 L42,26 L36,26 L34,34 L30,26 L22,26 Z" fill={STONE} opacity=".9"/>
            <circle cx="32" cy="18" r="2" fill={NAVY}/>
            <path d="M16,58 Q16,33 32,31 Q48,33 48,58 Z" fill={GOLD} opacity=".75"/>
            {/* crescent emblem */}
            <path d="M28,42 a6,6 0 1 0 8,0 a4.6,4.6 0 1 1 -8,0" fill={AMBER} opacity=".9"/>
            {/* sword */}
            <line x1="50" y1="14" x2="50" y2="50" stroke={STONE} strokeWidth="1.8"/>
            <line x1="45" y1="20" x2="55" y2="20" stroke={STONE} strokeWidth="1.8"/>
        </svg>
    );
}

export function PashaFigure() {
    return (
        <svg width="74" height="74" viewBox="0 0 64 64" fill="none">
            {/* fez */}
            <path d="M23,18 Q23,8 32,7 Q41,8 41,18 Z" fill={AMBER} opacity=".9"/>
            <line x1="32" y1="7" x2="32" y2="2" stroke={GOLD} strokeWidth="1.4"/>
            <circle cx="32" cy="2" r="1.6" fill={GOLD}/>
            <circle cx="32" cy="24" r="8" fill={GOLD} opacity=".85"/>
            <path d="M16,58 Q16,35 32,33 Q48,35 48,58 Z" fill={NAVY} opacity=".82"/>
            {/* sash + medal */}
            <line x1="24" y1="36" x2="40" y2="52" stroke={STONE} strokeWidth="3" opacity=".6"/>
            <circle cx="38" cy="49" r="2.6" fill={GOLD}/>
        </svg>
    );
}

export function TeacherFigurePlaceholder() {
    return (
        <svg width="38" height="38" viewBox="0 0 32 32" fill="none">
            <circle cx="16" cy="10" r="7.5" fill={GOLD} opacity=".55"/>
            <path d="M2 32 Q2 21 16 21 Q30 21 30 32" fill={GOLD} opacity=".4"/>
        </svg>
    );
}

/* ════════════════════════════════════════════════════════════════
   CLASS-BANNER ICONS — pharaoh mask / Atlas globe / Napoleon bust
════════════════════════════════════════════════════════════════ */
export function PharaohMaskIcon({ size = 64 }) {
    return (
        <svg width={size} height={size} viewBox="0 0 64 64" fill="none">
            <defs>
                <linearGradient id="maskGold" x1="0%" y1="0%" x2="100%" y2="100%">
                    <stop offset="0%" stopColor="#F5DD8A"/>
                    <stop offset="100%" stopColor="#C9A14A"/>
                </linearGradient>
            </defs>
            {/* Nemes striped headdress */}
            <path d="M14,20 Q32,4 50,20 L50,44 Q44,38 41,46 L36,36 L32,48 L28,36 L23,46 Q20,38 14,44 Z" fill="url(#maskGold)"/>
            <path d="M14,20 Q32,4 50,20" stroke="#14213D" strokeWidth="1" opacity=".25" fill="none"/>
            {/* face */}
            <ellipse cx="32" cy="26" rx="9" ry="11" fill="#E8C870"/>
            {/* cobra + vulture */}
            <path d="M32,8 Q36,2 41,6" stroke="#0E7490" strokeWidth="2" fill="none"/>
            <ellipse cx="41" cy="6" rx="2" ry="1.6" fill="#0E7490"/>
            {/* false beard */}
            <rect x="29" y="36" width="6" height="12" rx="2" fill="#0E7490"/>
            {/* eyes */}
            <path d="M27,25 q2,-2 5,0" stroke="#14213D" strokeWidth="1.4" fill="none"/>
            <path d="M32,25 q3,-2 5,0" stroke="#14213D" strokeWidth="1.4" fill="none"/>
        </svg>
    );
}

export function AtlasGlobeIcon({ size = 64 }) {
    return (
        <svg width={size} height={size} viewBox="0 0 64 64" fill="none">
            {/* Atlas figure (simplified, kneeling, arms raised) */}
            <path d="M20,58 Q20,40 32,38 Q44,40 44,58 Z" fill={STONE} opacity=".85"/>
            <circle cx="32" cy="32" r="6" fill={STONE} opacity=".9"/>
            <path d="M24,30 Q18,22 22,14" stroke={STONE} strokeWidth="3" fill="none" strokeLinecap="round"/>
            <path d="M40,30 Q46,22 42,14" stroke={STONE} strokeWidth="3" fill="none" strokeLinecap="round"/>
            {/* celestial globe */}
            <circle cx="32" cy="11" r="10" fill="none" stroke={GOLD} strokeWidth="1.6"/>
            <ellipse cx="32" cy="11" rx="10" ry="4" stroke={GOLD} strokeWidth="1" fill="none" opacity=".7"/>
            <ellipse cx="32" cy="11" rx="4" ry="10" stroke={GOLD} strokeWidth="1" fill="none" opacity=".7"/>
            <circle cx="32" cy="11" r="2" fill={AMBER}/>
        </svg>
    );
}

export function NapoleonBustIcon({ size = 64 }) {
    return (
        <svg width={size} height={size} viewBox="0 0 64 64" fill="none">
            {/* bicorne hat */}
            <path d="M16,18 Q32,6 48,18 Q40,22 32,18 Q24,22 16,18 Z" fill={NAVY}/>
            <path d="M30,9 L34,9 L34,4 L30,4 Z" fill={AMBER}/>
            {/* head */}
            <ellipse cx="32" cy="26" rx="8" ry="9" fill="#E8C870"/>
            {/* uniform collar + epaulettes */}
            <path d="M16,58 Q16,38 32,36 Q48,38 48,58 Z" fill={NAVY} opacity=".88"/>
            <path d="M22,40 L42,40 L40,46 L24,46 Z" fill={GOLD} opacity=".85"/>
            <circle cx="20" cy="40" r="3" fill={GOLD}/>
            <circle cx="44" cy="40" r="3" fill={GOLD}/>
        </svg>
    );
}
