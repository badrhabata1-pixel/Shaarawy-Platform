import React, { Component, useState, useRef, useEffect } from 'react';
import { Head, Link } from '@inertiajs/react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import PopOutCard from '@/Components/PopOutCard';

gsap.registerPlugin(ScrollTrigger);

/* ── Brand palette ───────────────────────────────────────────── */
const C = {
    gold:   '#C9A96A',
    amber:  '#8B5E3C',
    dark:   '#141210',
    mid:    '#1C1916',
    navy:   '#0E3A2E',
    stone:  '#E3D9C4',
    white:  '#F3ECDA',
};

/* ── "ليه تشترك معانا؟" — الأستاذ في النص وأربع بطاقات حواليه ─── */
const WHY_FEATURES = {
    center: {
        img:   'ChatGPT Image Sep 28, 2026, 03_10_40 PM.png',
        title: 'شرح بسيط ومفهوم',
        text:  'الأستاذ أحمد الشعراوي بيشرح الأحداث والموضوعات بأسلوب سهل ومنظم يخليك تفهم بسرعة وتثبت المعلومة من أول مرة.',
    },
    around: [
        { img:'ChatGPT Image Sep 28, 2026, 03_05_45 PM.png',  title:'أسئلة بعد كل جزء وتقسيم فكري',      text:'تدريب مستمر وأسئلة مركزة بعد كل جزء تساعدك تفكر وتحلل وتراجع أول بأول.' },
        { img:'label_top_right_transparent.png', aspect:'1405/593', title:'فيديوهات وخرائط ورسومات توضيحية',   text:'شرح بصري يساعدك تربط بين الأحداث والزمن والمكان بشكل أوضح وأسهل.' },
        { img:'ChatGPT Image Sep 28, 2026, 03_14_09 PM.png',  title:'اختبارات بنظام الوزارة',            text:'نماذج واختبارات بنفس شكل الامتحان تقيس مستواك وتتعود على الأسئلة الفعلية.' },
        { img:'ChatGPT Image Sep 28, 2026, 03_21_04 PM.png',  title:'متابعة مستمرة وتقييم الأداء',       text:'تتابع تقدمك بسهولة وتعرف نقاط القوة والجزء اللي محتاج مراجعة أكتر.' },
    ],
};

/* COURSES: populated dynamically from DB (passed as Inertia prop) */

/* فروع التاريخ — بيانات البطاقات المتمددة */
const BRANCHES = [
    {
        title: 'مصر القديمة',
        icon: (<><path d="M3 21h18"/><path d="M12 3 3 19h18z"/></>),
        desc: 'حضارة مصر الفرعونية هي أصل الحكاية — بندرس فيها الدول القديمة والوسطى والحديثة وأعظم ملوكها وإنجازاتهم الخالدة.',
        points: [
            'عصور ما قبل الأسرات وتوحيد القطرين',
            'الدولة القديمة وعصر بناء الأهرامات',
            'الدولة الوسطى والحديثة وأشهر ملوكها',
            'الديانة والفكر والفنون عند المصري القديم',
            'الكتابة الهيروغليفية ومنجزات الحضارة',
            'العلاقات الخارجية والحروب في العصر الفرعوني',
        ],
    },
    {
        title: 'التاريخ الإسلامي',
        icon: (<><path d="M12 2a10 10 0 1 0 10 10 8 8 0 1 1-10-10z"/></>),
        desc: 'من البعثة النبوية لقيام الدول الإسلامية الكبرى — بندرس فيها أهم الأحداث والشخصيات اللي شكّلت التاريخ الإسلامي.',
        points: [
            'العصر النبوي والخلافة الراشدة',
            'الدولتان الأموية والعباسية',
            'الفتوحات الإسلامية وأثرها الحضاري',
            'الحروب الصليبية ودور صلاح الدين',
            'الدولة العثمانية ومصر الإسلامية',
            'التطبيق على نماذج امتحانات الوزارة',
        ],
    },
    {
        title: 'الحضارات القديمة',
        icon: (<><path d="M3 21V9l9-6 9 6v12"/><path d="M9 21v-8h6v8"/></>),
        desc: 'رحلة عبر أعظم حضارات العالم القديم — بندرس فيها بلاد الرافدين واليونان والرومان وتأثيرهم على مسار التاريخ الإنساني.',
        points: [
            'حضارة بلاد الرافدين (سومر وبابل وآشور)',
            'الحضارة الفينيقية والكنعانية',
            'الحضارة اليونانية ودويلات المدن',
            'الحضارة الرومانية وامتدادها',
            'التبادل الحضاري بين الشرق والغرب',
        ],
    },
    {
        title: 'التاريخ الحديث',
        icon: (<><rect x="3" y="4" width="18" height="16" rx="2"/><path d="M3 10h18"/><path d="M8 2v4"/><path d="M16 2v4"/></>),
        desc: 'من الحملة الفرنسية لمصر الحديثة — بندرس فيها نهضة محمد علي والاحتلال البريطاني وثورات مصر عبر القرنين الأخيرين.',
        points: [
            'الحملة الفرنسية على مصر وآثارها',
            'عصر محمد علي وبناء الدولة الحديثة',
            'الاحتلال البريطاني والحركة الوطنية',
            'ثورة ١٩١٩ وثورة ٢٣ يوليو',
            'مصر في العصر الحديث والمعاصر',
        ],
    },
    {
        title: 'تاريخ أوروبا',
        icon: (<><circle cx="12" cy="12" r="9"/><path d="M12 3v18"/><path d="M3 12h18"/></>),
        desc: 'أهم محطات التاريخ الأوروبي وتأثيرها على العالم — من عصر النهضة للحربين العالميتين وتشكّل النظام العالمي الحديث.',
        points: [
            'عصر النهضة الأوروبية والاكتشافات الجغرافية',
            'الثورة الصناعية وأثرها الاقتصادي',
            'الحرب العالمية الأولى والثانية',
            'الاستعمار الأوروبي للعالم العربي',
            'نشأة المنظمات الدولية الحديثة',
        ],
    },
];

/* FILTERS: built dynamically inside the component from live units */

const PORTALS = [
    { hero: encodeURI('/images/منصور ( نجيب ).png'),    title:'تنظيم الدروس والكورسات',      text:'المنهج كله مرتب قدامك — عصور ودول وأحداث في مكان واحد ومترتبة زمنيًا. مش هتضيع في الكتاب تاني' },
    { hero: encodeURI('/images/منصور (طه حسين ).png'),  title:'دروس بالفيديو والخرائط التوضيحية', text:'مش هتحفظ التاريخ، هتفهمه — خرائط وجداول زمنية وشواهد حية بتخليك حاسس بالحدث مش بس عارفه'    },
    { hero: encodeURI('/images/طربوش احمر.png'),         title:'تطبيقات وتمارين تفاعلية',       text:'ذاكر وجرّب دماغك — أسئلة بعد كل درس عشان المعلومة تتثبّت وتلاقي نفسك جاهز لأي سؤال'  },
];

/* ── History particles config — رموز أثرية عائمة بديلة عن الحروف العربية ── */
const PARTICLES = [
    { sym:'✦',   l:5,  d:14, dl:0,   s:13 },
    { sym:'⟡',   l:18, d:17, dl:1,   s:10 },
    { sym:'✧',   l:32, d:12, dl:4,   s:12 },
    { sym:'◆',   l:47, d:18, dl:1.5, s:9  },
    { sym:'⬩',   l:61, d:13, dl:5,   s:12 },
    { sym:'❖',   l:74, d:16, dl:3.5, s:11 },
    { sym:'✥',   l:86, d:14, dl:3.8, s:13 },
    { sym:'✺',   l:93, d:9,  dl:5.5, s:10 },
];

/* ── Global styles ───────────────────────────────────────────── */
function PageStyles() {
    return (
        <style>{`
            @import url('https://fonts.googleapis.com/css2?family=Cinzel:wght@400;700&family=Cairo:wght@400;600;700;800;900&family=Ruwudu:wght@400;700&family=Aref+Ruqaa:wght@400;700&display=swap');
            *, *::before, *::after { box-sizing: border-box; }
            h1, h2, h3 { font-family: 'Ruwudu', serif !important; letter-spacing: .04em; }
            .hero-welcome-img { font-family: 'Aref Ruqaa', serif !important; letter-spacing: .01em; }
            ::-webkit-scrollbar { width:6px; }
            ::-webkit-scrollbar-track { background:#141210; }
            ::-webkit-scrollbar-thumb { background:rgba(201,169,106,.35); border-radius:3px; }

            @keyframes pingRing  { 0%{transform:scale(1);opacity:.7} 100%{transform:scale(2.4);opacity:0} }
            @keyframes float     { 0%,100%{transform:translateY(0)} 50%{transform:translateY(-8px)} }
            @keyframes shimmer   { 0%,100%{opacity:.5} 50%{opacity:.9} }
            @keyframes orbPulse1 { 0%,100%{transform:translate(0,0) scale(1)} 50%{transform:translate(50px,-35px) scale(1.1)} }
            @keyframes orbPulse2 { 0%,100%{transform:translate(0,0) scale(1)} 50%{transform:translate(-40px,45px) scale(.9)} }
            @keyframes orbPulse3 { 0%,100%{transform:translate(0,0) scale(1)} 33%{transform:translate(35px,25px) scale(1.08)} 66%{transform:translate(-25px,-18px) scale(.94)} }

            /* History particle float */
            @keyframes histRise {
                0%   { transform: translateY(0) rotate(0deg)   scale(.7); opacity:0; }
                8%   { opacity:1; }
                92%  { opacity:1; }
                100% { transform: translateY(-105vh) rotate(180deg) scale(1); opacity:0; }
            }
            @keyframes teacherFloat  { 0%,100%{transform:translateY(0)} 50%{transform:translateY(-14px)} }
            @keyframes teacherGlow   { 0%,100%{opacity:.55;transform:translateX(-50%) scale(1)} 50%{opacity:.82;transform:translateX(-50%) scale(1.09)} }
            @keyframes rayRotate     { to{transform:rotate(360deg)} }
            @keyframes orbitBob      { 0%,100%{transform:translateY(0) scale(1)} 50%{transform:translateY(-10px) scale(1.06)} }
            @keyframes badgeShimmer  { 0%,100%{box-shadow:0 6px 24px rgba(0,0,0,.35),0 0 0 1px rgba(201,169,106,.14),inset 0 1px 0 rgba(201,169,106,.2)} 50%{box-shadow:0 8px 32px rgba(0,0,0,.45),0 0 16px rgba(201,169,106,.18),0 0 0 1px rgba(201,169,106,.22),inset 0 1px 0 rgba(201,169,106,.28)} }
            @keyframes waveGlowPulse { 0%,100%{filter:drop-shadow(0 0 5px rgba(201,169,106,.65))} 50%{filter:drop-shadow(0 0 18px rgba(201,169,106,1))} }

            /* Navbar border glow pulse */
            @keyframes navGlow { 0%,100%{opacity:.6} 50%{opacity:1} }

            /* Toggle slide */
            @keyframes toggleSlide { from{transform:translateX(4px)} to{transform:translateX(0)} }

            /* Hieroglyph → Arabic morph */
            @keyframes hieroOut { 0%{opacity:1;transform:translateY(0) scale(1);filter:blur(0)} 100%{opacity:0;transform:translateY(-10px) scale(.94);filter:blur(4px)} }
            @keyframes arabicIn { 0%{opacity:0;transform:translateY(10px)} 100%{opacity:1;transform:translateY(0)} }

            /* فروع اللغة العربية */
            @keyframes branchIn {
                from { opacity:0; transform:translateY(10px); }
                to   { opacity:1; transform:translateY(0);    }
            }

            /* أسباب الاختيار — شبكة "بينتو" متفاوتة الأحجام بدل الشبكة المتساوية المملة */
            .feat-grid      { display:grid; grid-template-columns:repeat(4,1fr); grid-auto-rows:1fr; gap:24px; max-width:1180px; margin:0 auto;
                              grid-template-areas:
                                "a0 a0 a1 a2"
                                "a0 a0 a3 a4"
                                "a5 a6 a6 a7"; }
            .feat-item      { position:relative; height:100%; }
            .feat-item-0 { grid-area:a0; } .feat-item-1 { grid-area:a1; } .feat-item-2 { grid-area:a2; }
            .feat-item-3 { grid-area:a3; } .feat-item-4 { grid-area:a4; } .feat-item-5 { grid-area:a5; }
            .feat-item-6 { grid-area:a6; } .feat-item-7 { grid-area:a7; }
            @media(max-width:1180px){
                .feat-grid { grid-template-columns:repeat(2,1fr); grid-template-areas:none; grid-auto-rows:auto; max-width:640px; }
                .feat-item-0,.feat-item-1,.feat-item-2,.feat-item-3,.feat-item-4,.feat-item-5,.feat-item-6,.feat-item-7 { grid-area:auto; }
                .feat-item-0 { grid-column:span 2; }
                .feat-item-6 { grid-column:span 2; }
            }
            @media(max-width:600px) {
                .feat-grid { grid-template-columns:1fr; max-width:380px; gap:20px; }
                .feat-item-0,.feat-item-6 { grid-column:span 1; }
            }
            .feat-num-outside { position:absolute; top:-16px; right:-6px; z-index:4;
                                 font-family:'Ruwudu',serif; font-size:26px; line-height:1;
                                 user-select:none; opacity:.45; transition:opacity .4s ease, filter .4s ease; pointer-events:none; }
            .feat-item:hover .feat-num-outside { opacity:1; filter:drop-shadow(0 0 8px currentColor); }

            /* بطاقة على طراز تذهيب المخطوطات — إطار مزدوج، شمسة نجمية، زخارف أركان رفيعة */
            .feat-card  { position:relative; direction:rtl; cursor:default; height:100%;
                          transition:transform .45s cubic-bezier(.22,1,.36,1); }
            .feat-card:hover { transform:translateY(-8px); }
            .feat-card-inner { position:relative; overflow:hidden; border-radius:16px; padding:40px 26px 26px;
                                height:100%; display:flex; flex-direction:column; justify-content:center;
                                border:1px solid var(--frame-c, rgba(201,169,106,.4)); }
            .feat-card-wide .feat-card-inner { flex-direction:row; align-items:center; gap:22px; padding:26px 30px; text-align:right; }
            .feat-card-wide .feat-medal-wrap { margin-bottom:0; flex-shrink:0; }
            .feat-card-wide .feat-body-wrap  { text-align:right; }
            .feat-card-wide .feat-div        { justify-content:flex-start; }
            .feat-card-big .feat-medal       { width:96px; height:96px; }
            .feat-card-big .feat-medal svg.feat-icon-svg { width:30px; height:30px; }
            .feat-card-big .feat-medal-deco  { width:96px !important; height:96px !important; }
            .feat-card-big .feat-title       { font-size:20px; }
            .feat-card-big .feat-body        { font-size:14px; }
            .feat-card-inner::before {
                content:''; position:absolute; inset:7px; border-radius:9px;
                border:1px solid var(--frame-c, rgba(201,169,106,.4)); opacity:.55;
                pointer-events:none; z-index:1; transition:opacity .5s ease;
            }
            .feat-card:hover .feat-card-inner::before { opacity:1; }
            .feat-pattern { opacity:.08; transition:opacity .5s ease; pointer-events:none; }
            .feat-card:hover .feat-pattern { opacity:.2; }

            .feat-corner    { position:absolute; width:30px; height:30px; z-index:3; pointer-events:none;
                              opacity:.75; transition:opacity .4s ease, filter .4s ease; }
            .feat-corner-tl { top:6px;    left:6px; }
            .feat-corner-tr { top:6px;    right:6px; transform:scaleX(-1); }
            .feat-corner-bl { bottom:6px; left:6px;  transform:scaleY(-1); }
            .feat-corner-br { bottom:6px; right:6px; transform:scale(-1,-1); }
            .feat-card:hover .feat-corner { opacity:1; filter:drop-shadow(0 0 4px currentColor); }

            .feat-medal-wrap { position:relative; display:flex; justify-content:center; margin-bottom:20px; z-index:2; }
            .feat-medal { position:relative; width:76px; height:76px; flex-shrink:0;
                          display:flex; align-items:center; justify-content:center;
                          transition:transform .4s cubic-bezier(.22,1,.36,1); }
            .feat-medal svg.feat-icon-svg { position:relative; z-index:1; width:23px; height:23px; }
            .feat-medal-deco { opacity:.6; transition:opacity .5s ease, filter .5s ease; }
            .feat-card:hover .feat-medal { transform:scale(1.08); }
            .feat-card:hover .feat-medal-deco { opacity:1; filter:brightness(1.3); }

            .feat-body-wrap { position:relative; z-index:2; text-align:center; }
            .feat-title { font-size:16px; font-weight:800; margin-bottom:9px; line-height:1.5; }
            .feat-body  { font-size:13px; line-height:1.9; }
            .feat-div   { display:flex; align-items:center; gap:8px; margin-top:18px; }
            .feat-div-line { flex:1; height:1px; background:linear-gradient(90deg, currentColor, transparent); opacity:.35; transition:opacity .5s ease; }
            .feat-card:hover .feat-div-line { opacity:.8; }
            .port-grid  { display:grid; grid-template-columns:repeat(3,1fr); gap:32px; align-items:end; }
            .about-grid { display:grid; grid-template-columns:1fr 1fr; gap:32px; align-items:start; }
            .foot-grid  { display:grid; grid-template-columns:1.6fr 1fr 1fr 1fr; gap:40px; }
            .nav-links  { display:flex; }
            .hero-right { flex:0 0 60%; max-width:60%; }
            .teacher-fixed-ring {
                max-width: min(72vw, 620px);
                max-height: min(72vw, 620px);
            }
            .teacher-hero-wrap,
            .teacher-hero-img,
            .teacher-hero-img img {
                background: transparent !important;
                border: 0 !important;
                box-shadow: none !important;
                outline: 0 !important;
            }

            /* روابط الناف بار — خط سفلي متحرك عند المرور */
            .nav-link-item { position:relative; }
            .nav-link-item::after {
                content:''; position:absolute; bottom:3px; right:14px; left:14px; height:2px; border-radius:2px;
                background:linear-gradient(90deg,#C9A96A,#8B5E3C); transform:scaleX(0); transform-origin:center;
                transition:transform .35s cubic-bezier(.22,1,.36,1);
            }
            .nav-link-item:hover::after { transform:scaleX(1); }

            /* زر تسجيل الدخول — إطار شفاف يمتلئ بلطف عند المرور */
            .nav-login-btn { position:relative; overflow:hidden; }
            .nav-login-btn:hover {
                color:#C9A96A !important; border-color:#C9A96A !important;
                background:rgba(201,169,106,.1) !important; transform:translateY(-1px);
                box-shadow:0 4px 16px rgba(201,169,106,.18);
            }
            .nav-login-btn:active { transform:translateY(0) scale(.97); }

            /* زر حساب جديد / لوحة التحكم — بريق متحرك عند المرور */
            .nav-cta-btn { position:relative; overflow:hidden; }
            .nav-cta-btn::after {
                content:''; position:absolute; inset:0;
                background:linear-gradient(115deg,transparent 35%,rgba(255,255,255,.55) 50%,transparent 65%);
                transform:translateX(-120%); transition:transform .7s ease;
            }
            .nav-cta-btn:hover::after { transform:translateX(120%); }
            .nav-cta-btn:hover {
                transform:translateY(-2px) scale(1.025) !important;
                box-shadow:0 10px 30px rgba(201,169,106,.55), 0 0 0 1px rgba(255,255,255,.12), inset 0 1px 0 rgba(255,255,255,.4) !important;
            }
            .nav-cta-btn:active { transform:translateY(0) scale(.98) !important; }
            @media(max-width:1024px){
                .foot-grid { grid-template-columns:repeat(2,1fr); }
            }

            /* ══ TABLET ══ */
            @media(max-width:900px){
                .hero-section { flex-direction:column-reverse !important; padding-top:0 !important; padding-left:clamp(16px,5vw,40px) !important; padding-right:clamp(16px,5vw,40px) !important; padding-bottom:48px !important; gap:0 !important; min-height:auto !important; }
                .hero-right   { flex:0 0 100% !important; max-width:100% !important; }
                .teacher-hero-wrap { flex:0 0 100% !important; max-width:100% !important; min-height:56vw !important; max-height:72vw !important; overflow:hidden !important; }
                .about-full-grid  { grid-template-columns:1fr !important; min-height:auto !important; max-height:none !important; }
                .about-photo-side { height:60vw !important; min-height:260px !important; }
                .about-text-side  { padding:clamp(32px,6vw,56px) clamp(24px,5vw,48px) !important; }
                .nav-logo-box     { height:76px !important; width:66px !important; }
            }

            /* ══ MOBILE ══ */
            @media(max-width:768px){
                .port-grid      { grid-template-columns:1fr; gap:20px; }
                .about-grid     { grid-template-columns:1fr; }
                .foot-grid      { grid-template-columns:1fr 1fr; }
                .nav-links      { display:none; }
                .hero-right     { flex:0 0 100%; max-width:100%; }
                .site-nav          { padding:0 clamp(10px,3vw,20px) !important; width:90% !important; }
                .nav-right-group   { gap:8px !important; }
                .nav-logo-box      { height:58px !important; width:50px !important; }
                .theme-toggle-btn  { transform:scale(.8); transform-origin:center; }
                .hero-section   { flex-direction:column-reverse !important; padding-top:0 !important; padding-left:20px !important; padding-right:20px !important; padding-bottom:40px !important; gap:0 !important; min-height:auto !important; }
                .teacher-hero-wrap { flex:0 0 100% !important; max-width:100% !important; min-height:55vw !important; max-height:70vw !important; height:65vw !important; overflow:hidden !important; }
                .teacher-hero-wrap .th-deco:nth-child(n+4) { display:none !important; }
                .teacher-hero-img  { max-width:72vw !important; }
                .teacher-fixed-ring { width:74vw !important; height:74vw !important; top:50% !important; left:50% !important; }
                .about-full-grid   { grid-template-columns:1fr !important; min-height:auto !important; max-height:none !important; }
                .about-photo-side  { height:62vw !important; min-height:220px !important; }
                .about-text-side   { padding:clamp(28px,6vw,48px) clamp(20px,5vw,40px) !important; }
                .ts-rank-num       { display:none !important; }
                .hero-stats        { gap:20px !important; flex-wrap:wrap; }
                .port-grid > div   { max-width:100%; margin:0 auto; width:100%; }
                .hero-welcome-img  { max-width:100% !important; margin-bottom:20px !important; }
                .branches-necklace { gap:16px !important; }
                .about-text-side .about-stats-grid { grid-template-columns:repeat(2,1fr) !important; max-width:280px !important; }
                .about-feats-grid  { grid-template-columns:1fr !important; }
                .foot-social-grid { grid-template-columns:1fr 1fr !important; }
            }

            /* ══ SMALL MOBILE ══ */
            @media(max-width:480px){
                .foot-grid  { grid-template-columns:1fr; }
                .foot-social-grid { grid-template-columns:1fr !important; }
                .nav-ctas   { gap:6px !important; }
                .nav-ctas a,
                .nav-ctas button { padding:8px 12px !important; font-size:12px !important; }
                .nav-ctas svg     { display:none !important; }
                .nav-right-group  { gap:6px !important; }
                .nav-logo-box     { height:46px !important; width:40px !important; }
                .theme-toggle-btn { transform:scale(.68); transform-origin:center; }
                /* شبكة أمان: لو المساحة لسه ضيقة، اترك العناصر تلف لسطر تاني بدل ما تتلزق */
                .site-nav { flex-wrap:wrap !important; height:auto !important; min-height:64px !important; row-gap:8px !important; padding-top:8px !important; padding-bottom:8px !important; width:94% !important; }
                .hero-right p  { font-size:14px !important; }
                .teacher-hero-wrap { height:70vw !important; max-height:70vw !important; }
                .hero-stats > div { flex:1 0 auto; min-width:80px; }
            }

            /* بطاقات الكورسات — شبكة متجاوبة بدل التمرير الأفقي */
            .courses-grid { display:grid; grid-template-columns:repeat(auto-fill,minmax(300px,1fr)); gap:30px; max-width:1200px; margin:0 auto; }

            /* ليه تشترك معانا — الأستاذ في النص والبطاقات حواليه */
            .why-grid {
                display:grid; grid-template-columns:1.35fr 1fr 1.35fr; grid-template-areas:"left center right";
                gap:28px; align-items:center; max-width:1320px; margin:0 auto;
            }
            .why-grid .why-center { grid-area:center; }
            .why-grid .why-left   { grid-area:left;  display:flex; flex-direction:column; gap:22px; }
            .why-grid .why-right  { grid-area:right; display:flex; flex-direction:column; gap:22px; }
            .why-side-card { transition:transform .4s cubic-bezier(.22,1,.36,1), box-shadow .4s ease; }
            .why-side-card:hover { transform:translateY(-4px); }

            /* لوحة المعبد — إضاءة ذهبية عند المرور بالماوس */
            .branch-temple-panel { transition:box-shadow .4s ease, border-color .4s ease; }
            .branch-temple-panel:hover {
                border-color:rgba(201,169,106,.6) !important;
                box-shadow:0 0 0 1px rgba(201,169,106,.4), 0 0 60px rgba(201,169,106,.22), 0 20px 50px rgba(0,0,0,.4);
            }
            .branch-temple-panel:hover .temple-watermark {
                opacity:.16;
                filter:drop-shadow(0 0 26px rgba(201,169,106,.5));
            }
            @media(max-width:1080px){
                .why-grid { grid-template-columns:1fr; grid-template-areas:"center" "left" "right"; max-width:520px; }
            }
            .course-desc-clamp {
                display:-webkit-box; -webkit-line-clamp:2; -webkit-box-orient:vertical;
                overflow:hidden; text-overflow:ellipsis;
            }
            @media(max-width:520px){ .courses-grid { grid-template-columns:1fr; } }
        `}</style>
    );
}

/* ── Animated history background ────────────────────────────── */
function HistoryBackground({ dark = true }) {
    return (
        <div style={{ position:'fixed', inset:0, zIndex:0, overflow:'hidden', pointerEvents:'none' }}>

            {/* Color gradient orbs — navy in dark mode, warm gold-tinted in light mode */}
            <div style={{ position:'absolute', width:900, height:900, right:'-10%', top:'0%',    borderRadius:'50%', background: dark ? 'radial-gradient(circle, rgba(14,58,46,.9) 0%, transparent 70%)'  : 'radial-gradient(circle, rgba(201,169,106,.16) 0%, transparent 70%)', animation:'orbPulse1 18s ease-in-out infinite' }}/>
            <div style={{ position:'absolute', width:700, height:700, left:'0%',   bottom:'5%',  borderRadius:'50%', background: dark ? 'radial-gradient(circle, rgba(139,94,60,.06) 0%, transparent 70%)' : 'radial-gradient(circle, rgba(139,94,60,.10) 0%, transparent 70%)', animation:'orbPulse2 22s ease-in-out infinite' }}/>
            <div style={{ position:'absolute', width:500, height:500, left:'38%',  top:'30%',    borderRadius:'50%', background: dark ? 'radial-gradient(circle, rgba(201,169,106,.07) 0%, transparent 70%)' : 'radial-gradient(circle, rgba(201,169,106,.12) 0%, transparent 70%)', animation:'orbPulse3 26s ease-in-out infinite' }}/>
            <div style={{ position:'absolute', width:400, height:400, right:'20%', bottom:'20%', borderRadius:'50%', background: dark ? 'radial-gradient(circle, rgba(28,25,22,.8) 0%, transparent 70%)'  : 'radial-gradient(circle, rgba(226,232,240,.4) 0%, transparent 70%)' }}/>

            {/* Subtle grid lines (papyrus texture feel) */}
            <svg style={{ position:'absolute', inset:0, width:'100%', height:'100%', opacity: dark ? .025 : .05 }}>
                <defs>
                    <pattern id="gridPat" x="0" y="0" width="80" height="80" patternUnits="userSpaceOnUse">
                        <path d="M 80 0 L 0 0 0 80" fill="none" stroke={C.gold} strokeWidth=".5"/>
                    </pattern>
                </defs>
                <rect width="100%" height="100%" fill="url(#gridPat)"/>
            </svg>

            {/* Floating history symbols */}
            {PARTICLES.map(({ sym, l, d, dl, s }, i) => (
                <div key={i} style={{
                    position:   'absolute',
                    left:       `${l}%`,
                    bottom:     '-5%',
                    fontSize:   s,
                    color:      dark ? C.gold : C.navy,
                    opacity:    (dark ? 0.055 : 0.07) + (i % 4) * 0.012,
                    fontFamily: "'Ruwudu', serif",
                    fontWeight: 400,
                    letterSpacing: 1,
                    willChange: 'transform',
                    animation:  `histRise ${d}s ${dl}s linear infinite`,
                }}>{sym}</div>
            ))}
        </div>
    );
}

/* ═══════════════════════════════════════════════════════════════
   LOCATION CARD — center branch
═══════════════════════════════════════════════════════════════ */
function LocationCard({ name, num, icon, address, detail, featured, dark }) {
    const [hovered, setHovered] = useState(false);
    const active  = hovered || featured;
    const accent  = featured ? C.amber : C.gold;
    const arNum   = { '01':'١', '02':'٢', '03':'٣', '04':'٤' }[num] ?? num;
    const patId   = `locPat-${num}`;

    return (
        <div
            onMouseEnter={() => setHovered(true)}
            onMouseLeave={() => setHovered(false)}
            style={{ position:'relative', direction:'rtl', cursor:'default', transform: active ? 'translateY(-6px)' : 'none', transition:'transform .45s cubic-bezier(.22,1,.36,1)' }}
        >
            {/* زخارف أركان رفيعة بجوهرة صغيرة — طراز تذهيب المخطوطات */}
            {['tl','tr','bl','br'].map(pos => {
                const hFlip = pos[1] === 'r', vFlip = pos[0] === 'b';
                return (
                    <div key={pos} style={{
                        position:'absolute', width:24, height:24, zIndex:3, color:accent,
                        opacity: active ? 1 : .55, transition:'opacity .4s ease',
                        top: pos[0]==='t' ? 6 : 'auto', bottom: pos[0]==='b' ? 6 : 'auto',
                        right: pos[1]==='r' ? 6 : 'auto', left: pos[1]==='l' ? 6 : 'auto',
                        transform:`scale(${hFlip?-1:1},${vFlip?-1:1})`,
                    }}>
                        <svg viewBox="0 0 30 30" width="24" height="24">
                            <path d="M3,19 L3,3 L19,3" stroke="currentColor" strokeWidth="1.4" fill="none" strokeLinecap="round"/>
                            <rect x="0" y="0" width="7" height="7" transform="rotate(45 3.2 3.2)" fill="currentColor"/>
                        </svg>
                    </div>
                );
            })}

            <div style={{
                position:'relative', overflow:'hidden', borderRadius:18, textAlign:'center',
                padding: featured ? '36px 26px 30px' : '30px 24px 26px',
                background: dark
                    ? (active ? 'linear-gradient(155deg,#1A2A20,#171310)' : 'linear-gradient(155deg,#1C1916,#120F0B)')
                    : (active ? 'linear-gradient(155deg,#F7F3E9,#F3ECDA)' : '#ffffff'),
                border:`1px solid ${active ? accent+'99' : dark ? 'rgba(201,169,106,.16)' : 'rgba(201,169,106,.25)'}`,
                boxShadow: active
                    ? `0 18px 48px rgba(0,0,0,${dark?'.5':'.1'}), inset 0 1px 0 ${accent}22`
                    : dark ? '0 4px 20px rgba(0,0,0,.3)' : '0 2px 16px rgba(14,58,46,.06)',
                transition:'all .45s cubic-bezier(.22,1,.36,1)',
            }}>
                {/* إطار داخلي مزدوج */}
                <div style={{ position:'absolute', inset:7, borderRadius:11, border:`1px solid ${accent}`, opacity: active?.5:.2, pointerEvents:'none', transition:'opacity .5s ease' }}/>

                {/* نسيج نجمة ثمانية */}
                <svg style={{ position:'absolute', inset:0, width:'100%', height:'100%', opacity: active?.14:.05, transition:'opacity .5s ease', pointerEvents:'none' }}>
                    <defs>
                        <pattern id={patId} width="30" height="30" patternUnits="userSpaceOnUse">
                            <g stroke={accent} fill="none" strokeWidth="1">
                                <rect x="3" y="3" width="24" height="24"/>
                                <rect x="3" y="3" width="24" height="24" transform="rotate(45 15 15)"/>
                            </g>
                        </pattern>
                    </defs>
                    <rect width="100%" height="100%" fill={`url(#${patId})`}/>
                </svg>

                {/* رقم عربي صغير */}
                <div style={{ position:'relative', zIndex:2, fontSize:11, fontWeight:800, color:accent, opacity:.65, letterSpacing:'.14em', marginBottom:14 }}>{arNum}</div>

                {/* شمسة الأيقونة */}
                <div style={{ position:'relative', width:66, height:66, margin:'0 auto 18px', display:'flex', alignItems:'center', justifyContent:'center', transform: active?'scale(1.06)':'scale(1)', transition:'transform .4s cubic-bezier(.22,1,.36,1)', zIndex:2 }}>
                    <svg width="66" height="66" viewBox="0 0 66 66" style={{ position:'absolute', inset:0 }}>
                        <circle cx="33" cy="33" r="30" fill="none" stroke={accent} strokeWidth=".7" opacity={active?.7:.4}/>
                        <g stroke={accent} strokeWidth="1" fill="none" opacity={active?.9:.5}>
                            <rect x="14" y="14" width="38" height="38"/>
                            <rect x="14" y="14" width="38" height="38" transform="rotate(45 33 33)"/>
                        </g>
                        <circle cx="33" cy="33" r="20" fill={dark ? '#1C1916' : '#ffffff'} stroke={accent} strokeWidth="1.3"/>
                    </svg>
                    <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke={accent} strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" style={{ position:'relative', zIndex:1 }}>
                        <path d={icon}/>
                    </svg>
                </div>

                {/* الاسم */}
                <div style={{
                    fontSize: featured ? 20 : 17, fontWeight:800, position:'relative', zIndex:2,
                    color: active ? accent : (dark ? 'rgba(226,232,240,.8)' : C.navy),
                    marginBottom:10, transition:'color .3s ease',
                }}>{name}</div>

                {/* فاصل ماسي */}
                <div style={{ display:'flex', alignItems:'center', justifyContent:'center', gap:7, marginBottom:12, position:'relative', zIndex:2 }}>
                    <div style={{ width: active?30:18, height:1, background:`linear-gradient(90deg,transparent,${accent})`, transition:'width .4s ease' }}/>
                    <svg width="8" height="8" viewBox="0 0 18 18"><rect x="4" y="4" width="10" height="10" transform="rotate(45 9 9)" fill={accent}/></svg>
                    <div style={{ width: active?30:18, height:1, background:`linear-gradient(90deg,${accent},transparent)`, transition:'width .4s ease' }}/>
                </div>

                {/* العنوان والتفاصيل */}
                <div style={{ fontSize:13, fontWeight:700, color: dark ? 'rgba(226,232,240,.75)' : C.navy, marginBottom:5, lineHeight:1.55, position:'relative', zIndex:2 }}>{address}</div>
                <div style={{ fontSize:12, color: dark ? 'rgba(226,232,240,.44)' : 'rgba(14,58,46,.55)', lineHeight:1.8, position:'relative', zIndex:2 }}>{detail}</div>
            </div>
        </div>
    );
}

/* ═══════════════════════════════════════════════════════════════
   SOCIAL CARD — footer platform link
═══════════════════════════════════════════════════════════════ */
function SocialCard({ href, label, handle, glow, borderHover, icon, dark = true }) {
    const [hovered, setHovered] = useState(false);
    const accent = borderHover;

    const cardBg = dark
        ? (hovered ? 'linear-gradient(155deg,#1A2A20,#171310)' : 'linear-gradient(155deg,#1C1916,#120F0B)')
        : (hovered ? 'linear-gradient(155deg,#F7F3E9,#F3ECDA)' : '#ffffff');
    const cardBorder  = hovered ? accent : (dark ? 'rgba(201,169,106,.16)' : 'rgba(14,58,46,.13)');
    const cardShadow  = hovered
        ? `0 16px 44px rgba(0,0,0,${dark?'.5':'.1'}), 0 0 30px ${glow}`
        : (dark ? '0 4px 20px rgba(0,0,0,.3)' : '0 2px 16px rgba(14,58,46,.06)');
    const labelColor  = hovered ? '#8B5E3C' : (dark ? 'rgba(226,232,240,.85)' : C.navy);
    const handleColor = dark ? 'rgba(226,232,240,.35)' : 'rgba(14,58,46,.4)';
    const ctaColor    = hovered ? '#8B5E3C' : (dark ? 'rgba(201,169,106,.42)' : 'rgba(14,58,46,.38)');

    return (
        <a
            href={href}
            target="_blank"
            rel="noopener noreferrer"
            onMouseEnter={() => setHovered(true)}
            onMouseLeave={() => setHovered(false)}
            style={{
                display:'flex', flexDirection:'column', alignItems:'center', gap:12,
                padding:'30px 20px 24px',
                borderRadius:18,
                background: cardBg,
                border:`1px solid ${cardBorder}`,
                boxShadow: cardShadow,
                textDecoration:'none',
                transform: hovered ? 'translateY(-6px)' : 'translateY(0)',
                transition:'all 0.4s cubic-bezier(.22,1,.36,1)',
                cursor:'pointer', position:'relative', overflow:'hidden',
            }}
        >
            {/* إطار داخلي مزدوج */}
            <div style={{ position:'absolute', inset:6, borderRadius:12, border:`1px solid ${accent}`, opacity: hovered?.5:.16, transition:'opacity .5s ease', pointerEvents:'none' }}/>

            {/* توهج */}
            <div style={{
                position:'absolute', bottom:-30, left:'50%', transform:'translateX(-50%)',
                width:160, height:90,
                background:`radial-gradient(ellipse, ${glow} 0%, transparent 70%)`,
                filter:'blur(18px)',
                opacity: hovered ? 1 : 0,
                transition:'opacity 0.4s ease',
                pointerEvents:'none',
            }}/>

            {/* شمسة الأيقونة */}
            <div style={{ position:'relative', width:64, height:64, display:'flex', alignItems:'center', justifyContent:'center', transform: hovered?'scale(1.07)':'scale(1)', transition:'transform .4s cubic-bezier(.22,1,.36,1)', zIndex:1 }}>
                <svg width="64" height="64" viewBox="0 0 64 64" style={{ position:'absolute', inset:0 }}>
                    <circle cx="32" cy="32" r="29" fill="none" stroke={accent} strokeWidth=".7" opacity={hovered?.75:.35}/>
                    <g stroke={accent} strokeWidth="1" fill="none" opacity={hovered?.9:.4}>
                        <rect x="13" y="13" width="38" height="38"/>
                        <rect x="13" y="13" width="38" height="38" transform="rotate(45 32 32)"/>
                    </g>
                    <circle cx="32" cy="32" r="19" fill={dark?'rgba(201,169,106,.06)':'rgba(14,58,46,.04)'} stroke={accent} strokeWidth="1.2"/>
                </svg>
                <div style={{ position:'relative', zIndex:1, color: hovered ? '#8B5E3C' : '#C9A96A', display:'flex', transition:'color .3s ease' }}>
                    {icon}
                </div>
            </div>

            {/* Label */}
            <div style={{ textAlign:'center', position:'relative', zIndex:1 }}>
                <div style={{
                    fontSize:16, fontWeight:800,
                    color: labelColor,
                    marginBottom:4,
                    transition:'color 0.3s ease',
                }}>{label}</div>
                <div style={{
                    fontSize:11, color: handleColor,
                    letterSpacing:'.02em',
                    direction:'ltr',
                }}>{handle}</div>
            </div>

            {/* فاصل ماسي + CTA */}
            <div style={{ display:'flex', alignItems:'center', gap:7, marginTop:2, position:'relative', zIndex:1 }}>
                <div style={{ width:16, height:1, background:`linear-gradient(90deg,transparent,${ctaColor})` }}/>
                <span style={{ fontSize:11, fontWeight:700, color: ctaColor, letterSpacing:'.03em', transition:'color 0.3s ease' }}>
                    {hovered ? 'زوروا الصفحة ←' : 'تابعنا'}
                </span>
                <div style={{ width:16, height:1, background:`linear-gradient(90deg,${ctaColor},transparent)` }}/>
            </div>
        </a>
    );
}

/* ═══════════════════════════════════════════════════════════════
   HISTORY FLOATING ICONS — decorative background elements
═══════════════════════════════════════════════════════════════ */
const HIST_ICONS = [
    { x:'4%',  y:'8%',  rot:-14, sz:50, d:'4.2s', dl:'0s',   type:'book'    },
    { x:'89%', y:'42%', rot:12,  sz:42, d:'3.9s', dl:'0.4s', type:'inkwell' },
    { x:'10%', y:'72%', rot:7,   sz:40, d:'4.4s', dl:'0.9s', type:'star'    },
    { x:'44%', y:'3%',  rot:0,   sz:36, d:'3.4s', dl:'1.9s', type:'quill'   },
    { x:'82%', y:'6%',  rot:10,  sz:40, d:'3.7s', dl:'0.6s', type:'scroll'  },
    { x:'6%',  y:'88%', rot:5,   sz:34, d:'4.3s', dl:'1.2s', type:'book'    },
];

/* رموز أثرية عائمة — نجوم ومعينات هندسية بطراز زخرفة المخطوطات القديمة */
const ARABIC_GLYPHS = [
    { ch:'✦', x:'2%',  y:'20%', rot:-8,  sz:38, d:'4.6s', dl:'.2s' },
    { ch:'◆', x:'90%', y:'16%', rot:9,   sz:32, d:'4.1s', dl:'.7s' },
    { ch:'❖', x:'0%',  y:'66%', rot:6,   sz:34, d:'5.0s', dl:'1.1s' },
    { ch:'✺', x:'92%', y:'62%', rot:-10, sz:30, d:'3.8s', dl:'.4s' },
    { ch:'✧', x:'46%', y:'0%',  rot:0,   sz:28, d:'4.4s', dl:'1.5s' },
];

/* نقاط الحروف العائمة — زخرفة مستوحاة من نقطة الحروف العربية */
const DOT_ACCENTS = [
    { x:'16%', y:'32%', sz:6,  amber:false },
    { x:'80%', y:'28%', sz:5,  amber:true  },
    { x:'12%', y:'80%', sz:5,  amber:false },
    { x:'84%', y:'78%', sz:7,  amber:true  },
    { x:'50%', y:'6%',  sz:4,  amber:false },
    { x:'96%', y:'46%', sz:5,  amber:true  },
];

function HistIcon({ type, sz, color }) {
    const p = { stroke:color, fill:'none', strokeWidth:1.6, strokeLinecap:'round', strokeLinejoin:'round' };
    if (type === 'book') return (
        <svg width={sz} height={Math.round(sz*.75)} viewBox="0 0 52 40" fill="none">
            <path d="M26,8 Q14,2 4,6 L4,34 Q14,30 26,36 Q38,30 48,34 L48,6 Q38,2 26,8 Z" {...p}/>
            <line x1="26" y1="8" x2="26" y2="36" {...p} opacity=".4"/>
            <line x1="10" y1="12" x2="20" y2="10" {...p} opacity=".35"/>
            <line x1="10" y1="20" x2="20" y2="18" {...p} opacity=".35"/>
            <line x1="32" y1="10" x2="42" y2="12" {...p} opacity=".35"/>
            <line x1="32" y1="18" x2="42" y2="20" {...p} opacity=".35"/>
        </svg>
    );
    if (type === 'scroll') return (
        <svg width={Math.round(sz*1.25)} height={Math.round(sz*.7)} viewBox="0 0 52 36" fill="none">
            <rect x="9" y="5" width="34" height="26" rx="2" {...p}/>
            <ellipse cx="9"  cy="18" rx="6" ry="13" {...p}/>
            <ellipse cx="43" cy="18" rx="6" ry="13" {...p}/>
            <line x1="15" y1="13" x2="37" y2="13" {...p} opacity=".45"/>
            <line x1="15" y1="18" x2="37" y2="18" {...p} opacity=".45"/>
            <line x1="15" y1="23" x2="37" y2="23" {...p} opacity=".45"/>
        </svg>
    );
    if (type === 'star') return (
        <svg width={sz} height={sz} viewBox="0 0 40 40" fill="none">
            <rect x="8" y="8" width="24" height="24" {...p}/>
            <rect x="8" y="8" width="24" height="24" transform="rotate(45 20 20)" {...p}/>
        </svg>
    );
    if (type === 'quill') return (
        <svg width={sz} height={Math.round(sz*1.4)} viewBox="0 0 36 52" fill="none">
            <path d="M32,3 Q37,1 34,7 Q26,18 18,30 Q10,43 6,52" {...p}/>
            <path d="M32,3 Q28,12 22,24" {...p} opacity=".4"/>
            <path d="M32,3 Q30,16 20,28 Q12,40 7,52" {...p} opacity=".25"/>
        </svg>
    );
    if (type === 'inkwell') return (
        <svg width={Math.round(sz*.8)} height={Math.round(sz*.8)} viewBox="0 0 32 32" fill="none">
            <path d="M6,10 L26,10 L23,28 Q16,32 9,28 Z" {...p}/>
            <ellipse cx="16" cy="10" rx="10" ry="4" {...p}/>
            <ellipse cx="16" cy="10" rx="5"  ry="2" {...p} opacity=".5"/>
        </svg>
    );
    return null;
}

/* ═══════════════════════════════════════════════════════════════
   COURSE CARD — بطاقة وحدة دراسية بطراز شمسة/مخطوطة موحّد مع باقي الموقع
═══════════════════════════════════════════════════════════════ */
function CourseCard({ unit, dark, auth }) {
    const [hovered, setHovered]   = useState(false);
    const [imgError, setImgError] = useState(false);

    const imgSrc     = unit.image && !imgError
        ? (unit.image.startsWith('http') || unit.image.startsWith('/') ? unit.image : `/storage/${unit.image}`)
        : null;
    const gradeName  = unit.academic_year?.name ?? '';
    const isFree     = Boolean(unit.is_free) || !unit.price || Number(unit.price) === 0;
    const priceLabel = isFree ? 'مجاني' : `${unit.price} جنيه`;
    const accent     = isFree ? '#22c55e' : C.gold;
    const ctaHref    = isFree
        ? (auth?.user ? '/student/dashboard' : '/student/login')
        : (auth?.user ? '/student/dashboard' : '/register');
    const ctaLabel   = isFree ? 'شوف الوحدة مجاناً' : (auth?.user ? 'الدخول للوحدة' : 'اشترك للدخول');

    return (
        <div
            data-reveal
            onMouseEnter={() => setHovered(true)}
            onMouseLeave={() => setHovered(false)}
            style={{
                position:'relative', direction:'rtl', display:'flex', flexDirection:'column',
                borderRadius:22, overflow:'hidden',
                background: dark ? 'linear-gradient(165deg,#1A2A20 0%,#171310 60%,#120F0B 100%)' : '#ffffff',
                border:`1px solid ${hovered ? accent+'88' : dark ? 'rgba(201,169,106,.16)' : 'rgba(14,58,46,.12)'}`,
                boxShadow: hovered
                    ? `0 22px 50px rgba(0,0,0,${dark?'.55':'.14'}), 0 0 30px ${accent}26`
                    : dark ? '0 6px 24px rgba(0,0,0,.35)' : '0 3px 18px rgba(14,58,46,.08)',
                transform: hovered ? 'translateY(-8px)' : 'translateY(0)',
                transition:'all .45s cubic-bezier(.22,1,.36,1)',
            }}
        >
            {/* ── الوسائط / الشمسة الزخرفية ── */}
            <div style={{ position:'relative', height:190, overflow:'hidden', flexShrink:0 }}>
                {imgSrc ? (
                    <img src={imgSrc} alt={unit.title} onError={() => setImgError(true)} style={{
                        width:'100%', height:'100%', objectFit:'cover', objectPosition:'center',
                        transform: hovered ? 'scale(1.07)' : 'scale(1)',
                        transition:'transform .6s cubic-bezier(.22,1,.36,1)',
                    }}/>
                ) : (
                    <div style={{
                        position:'absolute', inset:0,
                        background:'linear-gradient(160deg,#1F5A45 0%,#1C1916 60%,#141210 100%)',
                        display:'flex', alignItems:'center', justifyContent:'center',
                    }}>
                        {/* نسيج نجمة ثمانية */}
                        <svg style={{ position:'absolute', inset:0, width:'100%', height:'100%', opacity:.08 }}>
                            <defs>
                                <pattern id={`courseStarPat-${unit.id}`} width="30" height="30" patternUnits="userSpaceOnUse">
                                    <g stroke="#C9A96A" fill="none" strokeWidth="1">
                                        <rect x="3" y="3" width="24" height="24"/>
                                        <rect x="3" y="3" width="24" height="24" transform="rotate(45 15 15)"/>
                                    </g>
                                </pattern>
                            </defs>
                            <rect width="100%" height="100%" fill={`url(#courseStarPat-${unit.id})`}/>
                        </svg>

                        {/* شمسة الأيقونة المركزية */}
                        <div style={{ position:'relative', width:78, height:78, display:'flex', alignItems:'center', justifyContent:'center', transform: hovered?'scale(1.08)':'scale(1)', transition:'transform .4s cubic-bezier(.22,1,.36,1)' }}>
                            <svg width="78" height="78" viewBox="0 0 78 78" style={{ position:'absolute', inset:0 }}>
                                <circle cx="39" cy="39" r="35" fill="none" stroke="#C9A96A" strokeWidth=".8" opacity={hovered?.75:.45}/>
                                <g stroke="#C9A96A" strokeWidth="1" fill="none" opacity={hovered?.9:.5}>
                                    <rect x="16" y="16" width="46" height="46"/>
                                    <rect x="16" y="16" width="46" height="46" transform="rotate(45 39 39)"/>
                                </g>
                                <circle cx="39" cy="39" r="24" fill="#1C1916" stroke="#C9A96A" strokeWidth="1.3"/>
                            </svg>
                            <div style={{ position:'relative', zIndex:1 }}>
                                <HistIcon type="book" sz={30} color="#C9A96A"/>
                            </div>
                        </div>
                    </div>
                )}

                {/* تدرّج سفلي لدمج الصورة بالبطاقة */}
                <div style={{ position:'absolute', inset:0, background:'linear-gradient(180deg,transparent 45%, rgba(20,18,16,.88) 100%)', pointerEvents:'none' }}/>

                {/* شارة الصف */}
                {gradeName && (
                    <span style={{
                        position:'absolute', top:14, insetInlineStart:14,
                        fontSize:11, fontWeight:700, color:'#F5EFDF',
                        background:'rgba(20,18,16,.55)', backdropFilter:'blur(6px)',
                        border:'1px solid rgba(201,169,106,.35)', borderRadius:999,
                        padding:'5px 12px',
                    }}>{gradeName}</span>
                )}

                {/* شارة السعر */}
                <span style={{
                    position:'absolute', top:14, insetInlineEnd:14,
                    fontSize:11, fontWeight:800,
                    color: isFree ? '#eafff2' : C.dark,
                    background: isFree ? 'linear-gradient(135deg,#22c55e,#16a34a)' : `linear-gradient(135deg,${C.amber},${C.gold})`,
                    borderRadius:999, padding:'5px 14px', boxShadow:'0 4px 14px rgba(0,0,0,.3)',
                }}>{priceLabel}</span>

                {/* عنوان الوحدة فوق الصورة */}
                <div style={{ position:'absolute', bottom:14, insetInlineStart:18, insetInlineEnd:18 }}>
                    <div style={{ fontSize:17, fontWeight:800, color:'#F5EFDF', lineHeight:1.4 }}>{unit.title}</div>
                </div>
            </div>

            {/* ── الجسم ── */}
            <div style={{ padding:'18px 20px 20px', display:'flex', flexDirection:'column', flex:1 }}>
                <p className="course-desc-clamp" style={{
                    fontSize:13, lineHeight:1.85, margin:'0 0 18px',
                    color: dark ? 'rgba(245,240,232,.56)' : 'rgba(14,58,46,.6)',
                    minHeight: unit.description ? 'auto' : 0,
                }}>{unit.description || 'وحدة دراسية كاملة — شرح، تمارين، ومراجعات.'}</p>

                <Link href={ctaHref} style={{
                    marginTop:'auto', position:'relative', overflow:'hidden',
                    display:'flex', alignItems:'center', justifyContent:'center', gap:8,
                    padding:'12px', borderRadius:11, textAlign:'center', textDecoration:'none',
                    background: isFree ? 'linear-gradient(135deg,#22c55e,#16a34a)' : `linear-gradient(135deg,${C.amber},${C.gold})`,
                    color: isFree ? '#fff' : C.dark, fontWeight:800, fontSize:14,
                    boxShadow: hovered ? `0 10px 26px ${accent}40` : 'none',
                    transition:'box-shadow .35s ease',
                }}>
                    {ctaLabel}
                    <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.4" strokeLinecap="round" strokeLinejoin="round" style={{ transform: hovered ? 'translateX(-3px)' : 'none', transition:'transform .3s ease' }}>
                        <line x1="19" y1="12" x2="5" y2="12"/><polyline points="12 19 5 12 12 5"/>
                    </svg>
                </Link>
            </div>

            {/* زخارف أركان رفيعة */}
            {['tl','tr'].map(pos => {
                const hFlip = pos[1] === 'r';
                return (
                    <div key={pos} style={{
                        position:'absolute', width:22, height:22, zIndex:2, color:accent,
                        opacity: hovered ? .9 : 0, transition:'opacity .4s ease',
                        top:6, right: pos[1]==='r' ? 6 : 'auto', left: pos[1]==='l' ? 6 : 'auto',
                        transform:`scale(${hFlip?-1:1},1)`, pointerEvents:'none',
                    }}>
                        <svg viewBox="0 0 30 30" width="22" height="22">
                            <path d="M3,19 L3,3 L19,3" stroke="currentColor" strokeWidth="1.4" fill="none" strokeLinecap="round"/>
                            <rect x="0" y="0" width="7" height="7" transform="rotate(45 3.2 3.2)" fill="currentColor"/>
                        </svg>
                    </div>
                );
            })}
        </div>
    );
}

/* ═══════════════════════════════════════════════════════════════
   TEACHER HERO — cinematic photo presentation
═══════════════════════════════════════════════════════════════ */
const ORBIT_PARTICLES = [
    { sym:'✦', x:'10%', y:'28%', d:'3.2s', dl:'0s',   sz:11, amber:false },
    { sym:'◆', x:'84%', y:'26%', d:'4.1s', dl:'0.8s', sz:13, amber:true  },
    { sym:'✧', x:'6%',  y:'60%', d:'3.6s', dl:'1.2s', sz:10, amber:false },
    { sym:'❖', x:'88%', y:'57%', d:'2.9s', dl:'0.4s', sz:12, amber:true  },
    { sym:'✺', x:'74%', y:'16%', d:'4.5s', dl:'1.8s', sz:14, amber:false },
    { sym:'✦', x:'18%', y:'14%', d:'3.8s', dl:'0.6s', sz:11, amber:true  },
];

function TeacherHero({ dark }) {
    const wrapRef = useRef();

    /* GSAP entrance */
    useEffect(() => {
        if (!wrapRef.current) return;
        const img   = wrapRef.current.querySelector('.th-img');
        const decos = wrapRef.current.querySelectorAll('.th-deco');
        gsap.fromTo(img,  { y:70, opacity:0, scale:.96 }, { y:0, opacity:1, scale:1, duration:1.4, ease:'power3.out', delay:.5 });
        gsap.fromTo(decos, { opacity:0, scale:.82 },      { opacity:1, scale:1, duration:1.1, ease:'back.out(1.4)', delay:.85, stagger:.08 });
    }, []);

    return (
        <div ref={wrapRef} className="teacher-hero-wrap" style={{
            flex:'0 0 56%', maxWidth:880, position:'relative',
            display:'flex', alignItems:'center', justifyContent:'center',
            minHeight:'60vh', flexShrink:0,
        }}>
            {/* لمسات زخرفية خفيفة في أركان اللوحة — بدل الحلقة المدارية والرموز المبعثرة */}
            <div className="th-deco" style={{
                position:'absolute', top:'-4%', right:'2%', width:38, height:38, borderRadius:11,
                border:`1.5px solid ${dark ? 'rgba(201,169,106,.5)' : 'rgba(14,58,46,.3)'}`,
                transform:'rotate(45deg)', pointerEvents:'none',
            }}/>
            <div className="th-deco" style={{
                position:'absolute', bottom:'-4%', left:'2%', width:26, height:26, borderRadius:8,
                background: dark ? 'rgba(139,94,60,.18)' : 'rgba(139,94,60,.14)',
                border:`1.5px solid ${dark ? 'rgba(139,94,60,.55)' : 'rgba(139,94,60,.4)'}`,
                transform:'rotate(45deg)', pointerEvents:'none',
            }}/>

            {/* مكان اللوحة الرئيسية — هتتحط لاحقًا */}
            <div className="th-img" style={{
                position:'relative', zIndex:5, width:'100%',
                display:'flex', flexDirection:'column', justifyContent:'center', alignItems:'center',
            }}/>
        </div>
    );
}

/* ── Preloader ───────────────────────────────────────────────── */
function Preloader({ visible }) {
    return (
        <div style={{
            position:'fixed', inset:0, zIndex:1000,
            background: C.dark,
            display:'flex', alignItems:'center', justifyContent:'center',
            transition:'opacity .7s ease, visibility .7s ease',
            opacity: visible ? 1 : 0,
            visibility: visible ? 'visible' : 'hidden',
            pointerEvents: visible ? 'auto' : 'none',
        }}>
            {[0,1,2].map(i=>(
                <div key={i} style={{
                    position:'absolute', width:100, height:100, borderRadius:'50%',
                    border:`1.5px solid ${C.gold}`,
                    animation:`pingRing 2s ease-out ${i*.5}s infinite`,
                }}/>
            ))}
            <span style={{ fontFamily:'Ruwudu,serif', fontSize:'clamp(22px,4vw,36px)', color:C.gold, letterSpacing:'.1em' }}>
                الشعراوي
            </span>
        </div>
    );
}

/* ── Theme toggle — ONE sliding switch, click anywhere to flip ── */
function ThemeToggle({ dark, setDark }) {
    return (
        <button
            className="theme-toggle-btn"
            onClick={() => setDark(!dark)}
            title={dark ? 'بدّل للوضع النهاري' : 'بدّل للوضع الليلي'}
            style={{
                width:64, height:34, borderRadius:999, position:'relative',
                border:'none', cursor:'pointer', padding:0, outline:'none', flexShrink:0,
                background: dark
                    ? 'linear-gradient(135deg,#120F0B 0%,#17251C 60%,#2D6B52 100%)'
                    : 'linear-gradient(135deg,#FFD27A 0%,#F4A23C 55%,#E08A2A 100%)',
                boxShadow: dark
                    ? 'inset 0 0 0 1px rgba(150,170,255,.4), 0 0 14px rgba(100,130,255,.35)'
                    : 'inset 0 0 0 1px rgba(255,210,120,.6), 0 0 14px rgba(244,162,60,.4)',
                transition:'background .4s ease, box-shadow .4s ease',
            }}
        >
            
            {/* Track decoration — stars (night) / clouds (day), opposite side from the thumb */}
            <svg width="64" height="34" viewBox="0 0 64 34" style={{ position:'absolute', inset:0 }}>
                {dark ? (
                    <>
                        {[[14,9,1],[20,16,.7],[10,20,.6],[24,8,.5],[16,24,.5]].map(([x,y,r],i)=>(
                            <circle key={i} cx={x} cy={y} r={r} fill="#fff" opacity=".85"/>
                        ))}
                    </>
                ) : (
                    <>
                        <ellipse cx="42" cy="12" rx="8" ry="4" fill="#fff" opacity=".75"/>
                        <ellipse cx="48" cy="19" rx="7" ry="3.4" fill="#fff" opacity=".65"/>
                    </>
                )}
            </svg>

            {/* Sliding thumb — moon (night) / sun (day) */}
            <div style={{
                position:'absolute', top:3, left: dark ? 33 : 3, width:28, height:28, borderRadius:'50%',
                transition:'left .35s cubic-bezier(.4,0,.2,1), background .35s',
                background: dark
                    ? 'radial-gradient(circle at 35% 30%, #fdfdfd, #d6deff 70%)'
                    : 'radial-gradient(circle at 35% 30%, #FFEFB0, #F4A23C 75%)',
                boxShadow:'0 2px 8px rgba(0,0,0,.4)',
                display:'flex', alignItems:'center', justifyContent:'center', overflow:'hidden',
            }}>
                {dark ? (
                    <svg width="20" height="20" viewBox="0 0 20 20">
                        <path d="M13,3 a7,7 0 1 0 0,14 a5.4,5.4 0 1 1 0,-14" fill="#aab4dd"/>
                        <circle cx="8" cy="8" r="1.3" fill="#c7cdee"/>
                        <circle cx="12" cy="13" r="1" fill="#c7cdee"/>
                    </svg>
                ) : (
                    <svg width="20" height="20" viewBox="0 0 20 20">
                        <circle cx="10" cy="10" r="6" fill="#FFD25A"/>
                        {Array.from({length:8}).map((_,i)=>{
                            const a = (i/8)*Math.PI*2;
                            const x1 = 10+Math.cos(a)*7.2, y1 = 10+Math.sin(a)*7.2;
                            const x2 = 10+Math.cos(a)*9.2, y2 = 10+Math.sin(a)*9.2;
                            return <line key={i} x1={x1} y1={y1} x2={x2} y2={y2} stroke="#FFD25A" strokeWidth="1.4" strokeLinecap="round"/>;
                        })}
                    </svg>
                )}
            </div>
        </button>
    );
}

/* ── Logo ────────────────────────────────────────────────────── */
function NavLogo({ dark = true }) {
    return (
        <div style={{ display: 'flex', alignItems: 'center', gap: 10, flexShrink: 0 }}>
            <div className="nav-logo-box" style={{
                height: 52, width: 52, borderRadius: 15, flexShrink: 0,
                background: 'linear-gradient(150deg, #0E3A2E, #1F5A45)',
                boxShadow: '0 0 0 3px rgba(201,169,106,.18), 0 6px 18px rgba(14,58,46,.35)',
                display: 'flex', alignItems: 'center', justifyContent: 'center',
            }}>
                <span style={{ fontFamily: "'Reem Kufi', sans-serif", fontSize: 24, color: '#C9A96A' }}>ش</span>
            </div>
            <div style={{ display: 'flex', flexDirection: 'column', lineHeight: 1.15 }}>
                <span style={{ fontFamily: "'Cairo',sans-serif", fontWeight: 900, fontSize: 14, color: dark ? '#F3ECDA' : '#0E3A2E' }}>منصة الشعراوي</span>
                <span style={{ fontFamily: "'Cairo',sans-serif", fontWeight: 600, fontSize: 9.5, letterSpacing: '.1em', color: '#C9A96A' }}>ELSHARAWY PLATFORM</span>
            </div>
        </div>
    );
}

/* ═══════════════════════════════════════════════════════════════
   NAV DROPDOWN — بطاقة منسدلة زجاجية تتمدد فوق الناف بار الثابت أسفل الشاشة
   (بديل قائمة الروابط البسيطة — بطاقة معاينة حقيقية تفتح لأعلى)
═══════════════════════════════════════════════════════════════ */
function NavDropdownItem({ label, dark, T, children, width = 320 }) {
    const [open, setOpen] = useState(false);
    const closeTimer = useRef(null);
    const onEnter = () => { clearTimeout(closeTimer.current); setOpen(true); };
    const onLeave = () => { closeTimer.current = setTimeout(() => setOpen(false), 160); };
    useEffect(() => () => clearTimeout(closeTimer.current), []);

    return (
        <div onMouseEnter={onEnter} onMouseLeave={onLeave} style={{ position: 'relative' }}>
            <button
                type="button"
                className="nav-link-item"
                onClick={() => setOpen(v => !v)}
                style={{
                    color: T.navLink, background: 'none', border: 'none', cursor: 'pointer',
                    fontFamily: "'Cairo',sans-serif",
                    fontSize: 13, fontWeight: 600, padding: '8px 14px', borderRadius: 8,
                    display: 'flex', alignItems: 'center', gap: 5,
                    transition: 'color .2s ease',
                }}
                onFocus={onEnter} onBlur={onLeave}
            >
                {label}
                <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"
                    style={{ transition: 'transform .3s cubic-bezier(.22,1,.36,1)', transform: open ? 'rotate(180deg)' : 'none' }}>
                    <polyline points="6 9 12 15 18 9" />
                </svg>
            </button>

            <div style={{
                position: 'absolute', bottom: 'calc(100% + 18px)', left: '50%', width,
                transform: `translateX(-50%) translateY(${open ? 0 : 12}px) scale(${open ? 1 : 0.92})`,
                transformOrigin: 'bottom center',
                opacity: open ? 1 : 0,
                visibility: open ? 'visible' : 'hidden',
                pointerEvents: open ? 'auto' : 'none',
                transition: 'opacity .3s cubic-bezier(.22,1,.36,1), transform .34s cubic-bezier(.22,1,.36,1), visibility 0s linear ' + (open ? '0s' : '.3s'),
                background: dark ? 'rgba(20,18,16,.7)' : 'rgba(255,252,245,.85)',
                backdropFilter: 'blur(30px) saturate(1.7)', WebkitBackdropFilter: 'blur(30px) saturate(1.7)',
                borderRadius: 20,
                border: `1px solid ${dark ? 'rgba(201,169,106,.2)' : 'rgba(201,169,106,.3)'}`,
                boxShadow: dark ? '0 24px 60px rgba(0,0,0,.6)' : '0 20px 50px rgba(14,58,46,.18)',
                padding: 16, zIndex: 60,
            }}>
                {children}
            </div>
        </div>
    );
}


/* ═══════════════════════════════════════════════════════════════
   فروع اللغة العربية — بطاقات متمددة (Accordion)
═══════════════════════════════════════════════════════════════ */
function LanguageBranches({ dark }) {
    const [active, setActive] = useState(1);
    const panelRef = useRef(null);

    /* اختيار فرع جديد — بيعمل ترانزيشن دائري (ripple) منطلق من مكان الدائرة اللي اتضغطت */
    const selectBranch = (i, e) => {
        if (i === active) return;
        const panel = panelRef.current;
        const reduceMotion = typeof window !== 'undefined' && window.matchMedia('(prefers-reduced-motion: reduce)').matches;

        if (!panel || !panel.animate || reduceMotion) { setActive(i); return; }

        const panelRect = panel.getBoundingClientRect();
        const btnRect   = e.currentTarget.getBoundingClientRect();
        const x = btnRect.left + btnRect.width / 2 - panelRect.left;
        const y = 0;
        const endRadius = Math.hypot(Math.max(x, panelRect.width - x), Math.max(0, panelRect.height - y));

        setActive(i);
        requestAnimationFrame(() => {
            panel.animate(
                { clipPath: [`circle(0px at ${x}px ${y}px)`, `circle(${endRadius}px at ${x}px ${y}px)`] },
                { duration: 550, easing: 'cubic-bezier(.22,1,.36,1)' }
            );
        });
    };

    return (
        <div>
            {/* ── القلادة — دوائر الفروع المعلّقة على سلسلة متدلّية حقيقية ── */}
            <div className="branches-necklace" style={{ position:'relative', display:'flex', justifyContent:'center', gap:'clamp(18px,3.6vw,44px)', paddingTop:26, paddingBottom:28, flexWrap:'wrap' }}>
                {/* سلسلة القلادة — منحنية ومتدلّية بين كل جوهرتين */}
                <svg viewBox="0 0 500 34" preserveAspectRatio="none" style={{ position:'absolute', top:0, left:'6%', right:'6%', width:'88%', height:28, pointerEvents:'none' }}>
                    <path d="M0,4 Q62.5,32 125,4 Q187.5,32 250,4 Q312.5,32 375,4 Q437.5,32 500,4"
                        fill="none" stroke="rgba(201,169,106,.5)" strokeWidth="1.4"/>
                    {[0,125,250,375,500].map(x => (
                        <g key={x}>
                            <circle cx={x} cy="4" r="3.4" fill="#C9A96A" opacity=".85"/>
                            <circle cx={x} cy="4" r="6" fill="none" stroke="#C9A96A" strokeWidth=".7" opacity=".4"/>
                        </g>
                    ))}
                </svg>
                {BRANCHES.map((b, i) => {
                    const isActive = active === i;
                    return (
                        <button key={i}
                            onClick={(e)=>selectBranch(i, e)}
                            style={{
                                position:'relative', background:'none', border:'none', cursor:'pointer', padding:0,
                                display:'flex', flexDirection:'column', alignItems:'center', gap:9,
                            }}
                        >
                            {/* خيط التعليق */}
                            <div style={{ width:1, height:20, background:'linear-gradient(180deg,rgba(201,169,106,.7),rgba(201,169,106,.25))' }}/>

                            {/* الميدالية — حلقة خارجية + شمسة نجمية + جواهر صغيرة حوالين الإطار */}
                            <div style={{ position:'relative', width: isActive?98:72, height: isActive?98:72, display:'flex', alignItems:'center', justifyContent:'center', transition:'all .45s cubic-bezier(.22,1,.36,1)' }}>
                                <svg viewBox="0 0 98 98" style={{ position:'absolute', inset:0, width:'100%', height:'100%', opacity: isActive?1:.6, transition:'opacity .45s ease' }}>
                                    <circle cx="49" cy="49" r="46" fill="none" stroke="#C9A96A" strokeWidth=".8" opacity=".55"/>
                                    <g stroke="#C9A96A" strokeWidth="1" fill="none" opacity={isActive?.85:.4}>
                                        <rect x="20" y="20" width="58" height="58"/>
                                        <rect x="20" y="20" width="58" height="58" transform="rotate(45 49 49)"/>
                                    </g>
                                    {[0,45,90,135,180,225,270,315].map(deg => {
                                        const a = (deg*Math.PI)/180, r = 46;
                                        const cx = 49 + Math.cos(a)*r, cy = 49 + Math.sin(a)*r;
                                        return <circle key={deg} cx={cx} cy={cy} r="1.7" fill="#C9A96A" opacity={isActive?.9:.4}/>;
                                    })}
                                </svg>
                                <div style={{
                                    position:'relative', width: isActive ? 74 : 54, height: isActive ? 74 : 54, borderRadius:'50%',
                                    display:'flex', alignItems:'center', justifyContent:'center', flexShrink:0,
                                    background: isActive ? 'linear-gradient(155deg,#1F5A45,#0E3A2E)' : (dark ? 'rgba(226,232,240,.05)' : '#fff'),
                                    border: `2px solid ${isActive ? '#C9A96A' : 'rgba(201,169,106,.35)'}`,
                                    boxShadow: isActive ? '0 0 0 6px rgba(201,169,106,.14), 0 12px 30px rgba(0,0,0,.35)' : (dark ? 'none' : '0 2px 10px rgba(14,58,46,.1)'),
                                    transition:'all .45s cubic-bezier(.22,1,.36,1)',
                                }}>
                                    <svg width={isActive?28:20} height={isActive?28:20} viewBox="0 0 24 24" fill="none"
                                        stroke={isActive ? '#C9A96A' : (dark ? 'rgba(226,232,240,.6)' : '#0E3A2E')}
                                        strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"
                                        style={{ transition:'all .45s cubic-bezier(.22,1,.36,1)' }}>
                                        {b.icon}
                                    </svg>
                                </div>
                            </div>
                            <span style={{
                                fontFamily:"'Cairo',sans-serif", fontSize:12.5, fontWeight: isActive?800:600,
                                color: isActive ? '#C9A96A' : (dark ? 'rgba(226,232,240,.55)' : 'rgba(14,58,46,.6)'),
                                transition:'color .4s ease', whiteSpace:'nowrap',
                            }}>{b.title}</span>
                        </button>
                    );
                })}
            </div>

            {/* ── لوحة المحتوى — واجهة معبد بعمودين جانبيين، بتضيء عند المرور، وبتتغيّر بترانزيشن دائري عند اختيار فرع جديد ── */}
            <div ref={panelRef} className="branch-temple-panel" style={{
                position:'relative', overflow:'hidden', borderRadius:28, minHeight:440,
                background:'linear-gradient(155deg,#1A3D2E 0%,#1C1916 55%,#141210 100%)',
                border:'1px solid rgba(201,169,106,.35)',
            }}>
                {/* شعار معبد كامل — حجم ضخم، خارج ومقصوص من حدود الكارت، علامة مائية هادية جدًا */}
                <div className="temple-watermark" style={{ position:'absolute', left:-64, bottom:-56, width:320, height:320, pointerEvents:'none', userSelect:'none', opacity:.09, zIndex:0, transition:'opacity .5s ease, filter .5s ease' }}>
                    <svg viewBox="0 0 100 85" style={{ width:'100%', height:'100%', fill:'#E8DCC1' }}>
                        {/* سقف المعبد المثلث المصمت */}
                        <polygon points="50,5 5,30 95,30"/>
                        {/* العارضة العلوية العريضة */}
                        <rect x="3" y="32" width="94" height="6" rx="1"/>
                        {/* الـ 4 أعمدة العريضة المصمتة */}
                        <rect x="10" y="40" width="12" height="32" rx="1"/>
                        <rect x="34" y="40" width="12" height="32" rx="1"/>
                        <rect x="56" y="40" width="12" height="32" rx="1"/>
                        <rect x="78" y="40" width="12" height="32" rx="1"/>
                        {/* القاعدة السفلية السميكة */}
                        <rect x="2" y="74" width="96" height="7" rx="1"/>
                    </svg>
                </div>

                {BRANCHES.map((b, i) => active === i && (
                    <div key={i} style={{ position:'relative', zIndex:1, padding:'clamp(26px,4vw,44px)', animation:'branchIn .5s ease both' }}>
                        <div style={{ display:'flex', alignItems:'center', justifyContent:'space-between', marginBottom:18, flexWrap:'wrap', gap:12 }}>
                            <div style={{ display:'inline-flex', alignItems:'center', gap:8, padding:'5px 14px', borderRadius:999, background:'rgba(201,169,106,.12)', border:'1px solid rgba(201,169,106,.3)' }}>
                                <span style={{ fontSize:12, color:'#C9A96A', fontWeight:700 }}>فرع {b.title}</span>
                            </div>
                        </div>

                        <h3 style={{ fontFamily:"'Ruwudu',serif", fontSize:'clamp(24px,2.6vw,34px)', color:'#F3ECDA', margin:'0 0 14px' }}>{b.title}</h3>

                        <p style={{ fontSize:14, lineHeight:2, color:'rgba(226,232,240,.65)', maxWidth:680, margin:'0 0 20px' }}>{b.desc}</p>

                        <div style={{ fontSize:12.5, color:'#8B5E3C', fontWeight:700, marginBottom:10 }}>أبرز محاور الدراسة:</div>
                        <div style={{ display:'grid', gridTemplateColumns:'repeat(auto-fit,minmax(220px,1fr))', gap:'6px 24px', marginBottom:24 }}>
                            {b.points.map((pt, pi) => (
                                <div key={pi} style={{ display:'flex', alignItems:'flex-start', gap:8, padding:'6px 0' }}>
                                    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#8B5E3C" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" style={{ flexShrink:0, marginTop:3 }}>
                                        <polyline points="20 6 9 17 4 12"/>
                                    </svg>
                                    <span style={{ fontSize:13, color:'rgba(226,232,240,.8)', lineHeight:1.6 }}>{pt}</span>
                                </div>
                            ))}
                        </div>

                        <a href="#courses" style={{ display:'inline-flex', alignItems:'center', gap:9, fontSize:13, color:'#C9A96A', textDecoration:'none', fontWeight:700, paddingTop:18, borderTop:'1px solid rgba(255,255,255,.08)' }}>
                            <span style={{ width:26, height:26, borderRadius:'50%', background:'rgba(201,169,106,.15)', display:'flex', alignItems:'center', justifyContent:'center', flexShrink:0 }}>
                                <svg width="10" height="10" viewBox="0 0 24 24" fill="#C9A96A"><polygon points="6 3 20 12 6 21"/></svg>
                            </span>
                            أوّل محاضرات مجانية في فرع {b.title}
                        </a>
                    </div>
                ))}
            </div>
        </div>
    );
}

/* ═══════════════════════════════════════════════════════════════
   WHY-SUBSCRIBE CARDS — بطاقات أثرية حقيقية (صور جاهزة) بدل الرسم بالكود
═══════════════════════════════════════════════════════════════ */
function WhySideCard({ img, title, text, dark, aspect = '1774/887' }) {
    return (
        <div className="why-side-card" data-reveal style={{ position:'relative', width:'100%', aspectRatio:aspect }}>
            <img src={encodeURI(`/images/${img}`)} alt="" style={{ display:'block', width:'100%', height:'100%', objectFit:'contain' }} />
        </div>
    );
}

function WhyCenterCard({ img, title, text, dark }) {
    return (
        <div data-reveal style={{ position:'relative', width:'100%', maxWidth:340, margin:'0 auto', aspectRatio:'1374/1145' }}>
            <img src={encodeURI(`/images/${img}`)} alt="الأستاذ أحمد الشعراوي" style={{ display:'block', width:'100%', height:'100%', objectFit:'contain' }} />
        </div>
    );
}

/* ═══════════════════════════════════════════════════════════════
   WELCOME PAGE
═══════════════════════════════════════════════════════════════ */
export default function Welcome({ auth, units = [], topStudents = [] }) {
    const [activeFilter,   setActiveFilter]   = useState('الكل');
    const [loading,        setLoading]        = useState(true);
    const [darkMode,       setDarkMode]       = useState(true);
    const [activeTopMonth,  setActiveTopMonth]  = useState(null); /* null = الكل */
    const [hoveredStudent,  setHoveredStudent]  = useState(null);
    const pageRef  = useRef(null);

    /* Build filter list from academic year names present in visible units */
    const filters = ['الكل', ...new Set(units.map(u => u.academic_year?.name).filter(Boolean))];

    /* Top students: available months (desc) + default to latest */
    const topMonths = [...new Set(topStudents.map(s => s.month))].sort((a,b)=>b.localeCompare(a));
    /* null = الكل */
    const filteredTop = activeTopMonth === null
        ? [...topStudents].sort((a,b) => a.rank - b.rank || b.month.localeCompare(a.month))
        : topStudents.filter(s => s.month === activeTopMonth).sort((a,b)=>a.rank - b.rank);

    const monthLabel = m => {
        if (!m) return '';
        const [y, mo] = m.split('-');
        const names = ['يناير','فبراير','مارس','أبريل','مايو','يونيو','يوليو','أغسطس','سبتمبر','أكتوبر','نوفمبر','ديسمبر'];
        return `${names[parseInt(mo)-1]} ${y}`;
    };

    const medalColors = ['#C9A96A','#94a3b8','#cd7f32'];

    useEffect(() => {
        document.body.style.overflow = 'hidden auto';
        const t = setTimeout(() => setLoading(false), 1500);
        return () => clearTimeout(t);
    }, []);

    useEffect(() => {
        if (!pageRef.current) return;
        const ctx = gsap.context(() => {
            pageRef.current.querySelectorAll('[data-reveal]').forEach(el=>{
                gsap.fromTo(el,{y:44,opacity:0},{y:0,opacity:1,duration:1,ease:'power2.out',scrollTrigger:{trigger:el,start:'top 84%',toggleActions:'play none none none'}});
            });
            pageRef.current.querySelectorAll('[data-count]').forEach(el=>{
                const target=parseInt(el.dataset.count,10); const proxy={val:0};
                gsap.to(proxy,{val:target,duration:2.2,ease:'power1.out',scrollTrigger:{trigger:el,start:'top 80%',toggleActions:'play none none none'},onUpdate(){el.textContent=Math.round(proxy.val).toLocaleString('ar-EG');}});
            });
        }, pageRef.current);
        return () => ctx.revert();
    }, []);

    const filteredCourses = activeFilter === 'الكل'
        ? units
        : units.filter(u => u.academic_year?.name === activeFilter);

    const pageBg = darkMode
        ? `linear-gradient(160deg, #141210 0%, #0a1628 35%, #0E3A2E 65%, #090e1a 100%)`
        : '#FAF3E3';
    const pageEdge = darkMode ? C.dark : '#FAF3E3';

    /* Theme tokens — text/backgrounds that sit directly on the page bg flip with it.
       Cards keep a permanent dark "stone tablet" look in both modes (by design). */
    const T = {
        text:      darkMode ? C.white : C.navy,
        textDim2:  darkMode ? 'rgba(245,240,232,.68)' : 'rgba(14,58,46,.68)',
        textDim4:  darkMode ? 'rgba(245,240,232,.52)' : 'rgba(14,58,46,.52)',
        navBg:     darkMode ? 'rgba(20,18,16,.22)'      : 'rgba(255,255,255,.32)',
        navBorder: darkMode ? 'rgba(245,240,232,.16)'  : 'rgba(14,58,46,.12)',
        navLink:   darkMode ? 'rgba(245,240,232,.68)'  : 'rgba(14,58,46,.68)',
        authBorder:darkMode ? 'rgba(255,255,255,.22)'  : 'rgba(14,58,46,.22)',
        authText:  darkMode ? 'rgba(245,240,232,.85)'  : 'rgba(14,58,46,.85)',
    };

    useEffect(() => {
        document.body.style.background = pageEdge;
    }, [pageEdge]);

    return (
        <>
            <Head title="الأستاذ منصور — منصة اللغة العربية" />
            <PageStyles />
            <Preloader visible={loading} />

            {/* Fixed animated background */}
            <HistoryBackground dark={darkMode} />

            <div
                ref={pageRef}
                dir="rtl"
                style={{ minHeight:'100vh', background:pageBg, fontFamily:'Cairo,sans-serif', position:'relative', color:T.text, transition:'background 1s ease, color 1s ease', paddingBottom:112 }}
            >

            {/* ══════════════════════════════════════════════════════
                NAVBAR  —  floating, framed, neoclassical — ثابتة أسفل الشاشة
            ══════════════════════════════════════════════════════ */}
{/* ── NAVBAR GLOW — توهج بيج خفيف خلف الناف بار ── */}
            <div aria-hidden="true" style={{
                position:'fixed', bottom:0, left:'50%', transform:'translateX(-50%)',
                width:'min(920px, 78vw)', height:180, zIndex:49, pointerEvents:'none',
                background:'radial-gradient(ellipse 60% 100% at 50% 100%, rgba(232,220,193,.4) 0%, rgba(201,169,106,.18) 40%, transparent 75%)',
                filter:'blur(6px)',
            }}/>

{/* ── NAVBAR  —  floating, borderless glassmorphism ── */}
            <nav className="site-nav" style={{
                position:       'fixed',
                bottom:         14,
                left:           '50%',
                width:          '60%',
                transform:      'translateX(-50%)',
                zIndex:         50,
                display:        'flex',
                alignItems:     'center',
                justifyContent: 'space-between',
                padding:        '0 clamp(16px,4vw,32px)',
                height:         88, // الارتفاع المتناسق والمريح للوجو الكبير
                borderRadius:   20, // الحواف الدائرية الكبيرة المتناسقة مع الارتفاع
                // زجاج شفاف أكثر ليمرر ألوان الـ 3D والخلفيات بوضوح ونقاء (Glassmorphic)
                background:     darkMode ? 'rgba(20, 18, 16, 0.45)' : 'rgba(255, 252, 245, 0.55)',
                // إزالة الحدود تماماً بناءً على طلبك
                border:         'none', 
                // التظليل العميق والناعم متعدد الطبقات لتظهر الـ Navbar كأنها طافية فوق الصفحة
                boxShadow:      darkMode
                    ? '0 24px 60px rgba(0,0,0,0.75), 0 6px 16px rgba(0,0,0,0.5), inset 0 1px 0 rgba(255,255,255,0.12)'
                    : '0 20px 44px rgba(14,58,46,0.18), 0 4px 12px rgba(14,58,46,0.08), inset 0 1px 0 rgba(255,255,255,0.65)',
                backdropFilter: 'blur(30px) saturate(1.7)',
                WebkitBackdropFilter: 'blur(30px) saturate(1.7)',
                transition:     'background .4s ease, box-shadow .4s ease',
            }}>
                {/* Right group: logo + toggle */}
                <div className="nav-right-group" style={{ display:'flex', alignItems:'center', gap:14 }}>
                    <NavLogo dark={darkMode} />
                    <ThemeToggle dark={darkMode} setDark={setDarkMode} />
                </div>

                {/* Center: nav links (hidden on mobile via CSS) — بطاقتان منسدلتان بمعاينة حقيقية + رابط مباشر */}
                <div className="nav-links" style={{ gap:4, position:'absolute', left:'50%', transform:'translateX(-50%)', alignItems:'center' }}>
                    <a href="#" className="nav-link-item" style={{
                        color:T.navLink, textDecoration:'none',
                        fontFamily:"'Cairo',sans-serif",
                        fontSize:13, fontWeight:600, padding:'8px 14px', borderRadius:8,
                        transition:'color .2s ease',
                    }}
                    onMouseEnter={e=>{e.currentTarget.style.color=C.gold;}}
                    onMouseLeave={e=>{e.currentTarget.style.color=T.navLink;}}
                    >الرئيسية</a>

                    <NavDropdownItem label="المقررات" dark={darkMode} T={T} width={360}>
                        <p style={{ fontFamily:"'Cairo',sans-serif", fontSize:11, fontWeight:700, letterSpacing:'.12em', color:C.gold, margin:'2px 4px 12px' }}>فروع التاريخ</p>
                        <div style={{ display:'grid', gridTemplateColumns:'1fr 1fr', gap:8 }}>
                            {BRANCHES.map(b => (
                                <a key={b.title} href="#branches" style={{
                                    display:'flex', alignItems:'center', gap:9, padding:'10px 11px', borderRadius:12,
                                    textDecoration:'none', color:T.text,
                                    background: darkMode ? 'rgba(201,169,106,.06)' : 'rgba(14,58,46,.04)',
                                    border:`1px solid ${darkMode ? 'rgba(201,169,106,.12)' : 'rgba(14,58,46,.08)'}`,
                                    transition:'background .2s ease, transform .2s ease',
                                }}
                                onMouseEnter={e=>{e.currentTarget.style.background=darkMode?'rgba(201,169,106,.14)':'rgba(14,58,46,.08)'; e.currentTarget.style.transform='translateY(-2px)';}}
                                onMouseLeave={e=>{e.currentTarget.style.background=darkMode?'rgba(201,169,106,.06)':'rgba(14,58,46,.04)'; e.currentTarget.style.transform='none';}}
                                >
                                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke={C.gold} strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" style={{ flexShrink:0 }}>{b.icon}</svg>
                                    <span style={{ fontFamily:"'Cairo',sans-serif", fontSize:12.5, fontWeight:700 }}>{b.title}</span>
                                </a>
                            ))}
                        </div>
                    </NavDropdownItem>

                    <NavDropdownItem label="عن المنصة" dark={darkMode} T={T} width={280}>
                        <div style={{ display:'flex', alignItems:'center', gap:12, marginBottom:12 }}>
                            <div style={{
                                width:44, height:44, borderRadius:13, flexShrink:0,
                                background:'linear-gradient(150deg,#0E3A2E,#1F5A45)',
                                display:'flex', alignItems:'center', justifyContent:'center',
                                boxShadow:'0 0 0 2px rgba(201,169,106,.25)',
                            }}>
                                <span style={{ fontFamily:"'Reem Kufi',sans-serif", fontSize:20, color:'#C9A96A' }}>ش</span>
                            </div>
                            <div>
                                <p style={{ fontFamily:"'Cairo',sans-serif", fontSize:13, fontWeight:800, color:T.text, margin:0 }}>أ. أحمد الشعراوي</p>
                                <p style={{ fontFamily:"'Cairo',sans-serif", fontSize:11, fontWeight:600, color:C.gold, margin:'2px 0 0' }}>أستاذ التاريخ — الثانوية العامة</p>
                            </div>
                        </div>
                        <p style={{ fontFamily:"'Cairo',sans-serif", fontSize:12, lineHeight:1.9, color:T.textDim2, margin:'0 0 12px' }}>
                            منصة متكاملة بتفهّمك التاريخ بأسلوب مبسّط، فيديوهات وخرائط توضيحية، ومتابعة حقيقية لتقدمك.
                        </p>
                        <a href="#about" style={{ display:'inline-flex', alignItems:'center', gap:5, fontFamily:"'Cairo',sans-serif", fontSize:12, fontWeight:800, color:C.gold, textDecoration:'none' }}>
                            اعرف أكتر عن المنصة ←
                        </a>
                    </NavDropdownItem>
                </div>

                {/* Left group: auth buttons */}
                <div className="nav-ctas" style={{ display:'flex', alignItems:'center', gap:10 }}>
                    {auth?.user ? (
                        <Link href="/student/dashboard" className="nav-cta-btn" style={{
                            display:'inline-flex', alignItems:'center', gap:7,
                            padding:'9px 24px', borderRadius:999,
                            background:`linear-gradient(135deg,${C.gold},${C.amber})`,
                            color:C.dark, fontWeight:800, fontSize:13, textDecoration:'none',
                            boxShadow:`0 4px 18px rgba(201,169,106,.4), inset 0 1px 0 rgba(255,255,255,.3)`,
                            transition:'transform .3s cubic-bezier(.22,1,.36,1), box-shadow .3s cubic-bezier(.22,1,.36,1)',
                        }}>
                            <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round"><rect x="3" y="3" width="7" height="9" rx="1.5"/><rect x="14" y="3" width="7" height="5" rx="1.5"/><rect x="14" y="12" width="7" height="9" rx="1.5"/><rect x="3" y="16" width="7" height="5" rx="1.5"/></svg>
                            لوحة التحكم
                        </Link>
                    ) : (<>
                        <Link href="/student/login" className="nav-login-btn" style={{
                            display:'inline-flex', alignItems:'center', gap:7,
                            padding:'9px 20px', borderRadius:999,
                            border:`1.5px solid ${T.authBorder}`,
                            background:'transparent',
                            color:T.authText, fontSize:13, fontWeight:700,
                            textDecoration:'none', transition:'all .3s cubic-bezier(.22,1,.36,1)',
                        }}>
                            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round"><path d="M15 3h4a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2h-4"/><polyline points="10 17 15 12 10 7"/><line x1="15" y1="12" x2="3" y2="12"/></svg>
                            تسجيل الدخول
                        </Link>

                        <Link href="/register" className="nav-cta-btn" style={{
                            display:'inline-flex', alignItems:'center', gap:7,
                            padding:'9px 24px', borderRadius:999,
                            background:`linear-gradient(135deg,${C.gold},${C.amber})`,
                            color:C.dark, fontWeight:800, fontSize:13,
                            textDecoration:'none',
                            boxShadow:`0 4px 18px rgba(201,169,106,.4), inset 0 1px 0 rgba(255,255,255,.3)`,
                            transition:'transform .3s cubic-bezier(.22,1,.36,1), box-shadow .3s cubic-bezier(.22,1,.36,1)',
                        }}>
                            <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round"><path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/><line x1="19" y1="8" x2="19" y2="14"/><line x1="16" y1="11" x2="22" y2="11"/></svg>
                            حساب جديد
                        </Link>
                    </>)}
                </div>
            </nav>  
            {/* ══════════════════════════════════════════════════════
                HERO
            ══════════════════════════════════════════════════════ */}
            <section className="hero-section" style={{
                minHeight:'92vh', display:'flex', alignItems:'center',
                paddingTop:`clamp(20px,4vh,56px)`,
                paddingBottom:`clamp(48px,9vh,110px)`,
                paddingRight:`clamp(24px,5vw,72px)`,
                paddingLeft:`clamp(160px,13vw,240px)`,
                position:'relative', zIndex:10, gap:40,
            }}>
                <div className="hero-right" data-reveal style={{ display:'flex', flexDirection:'column', justifyContent:'center', minHeight:'80vh' }}>
                    {/* ── Brand welcome wordmark — سطر ترحيب + لوجو جنب بعض + خواطر ── */}
                    <h1 className="hero-welcome-img" style={{
                        fontFamily:"'Aref Ruqaa',serif", fontWeight:700,
                        fontSize:'clamp(30px,4.2vw,44px)', lineHeight:1.2,
                        margin:'0 0 8px', color: T.text,
                    }}>
                        أهلاً بيك في
                    </h1>

                    <div style={{ marginBottom:36, display:'flex', alignItems:'flex-start', gap:14 }}>
                        <svg width="22" height="22" viewBox="0 0 18 18" style={{ flexShrink:0, opacity:.75, marginTop:14 }}>
                            <rect x="4" y="4" width="10" height="10" rx="3" fill="#C9A96A" transform="rotate(45 9 9)"/>
                        </svg>
                        <div style={{ width:'fit-content' }}>
                            <span style={{
                                fontFamily:"'Aref Ruqaa',serif", fontWeight:700,
                                fontSize:'clamp(56px,8vw,92px)', color: T.text, letterSpacing:'.01em', lineHeight:1.1,
                                textShadow: darkMode ? '0 0 34px rgba(201,169,106,.45)' : 'none',
                                whiteSpace:'nowrap',
                            }}>
                                رحلة{' '}
                                <span style={{
                                    background:'linear-gradient(135deg,#C9A96A,#8B5E3C)',
                                    WebkitBackgroundClip:'text', WebkitTextFillColor:'transparent', backgroundClip:'text',
                                }}>الشعراوي</span>
                            </span>
                            <svg width="100%" viewBox="0 0 230 34" style={{ display:'block', marginTop:10, aspectRatio:'230/34', animation:'waveGlowPulse 1.8s ease-in-out infinite' }}>
                                <path d="M15,17 Q35,2 55,17 T95,17 T135,17 T175,17 T215,17" stroke="#C9A96A" strokeWidth="4.5" fill="none" strokeLinecap="round"/>
                                <rect x="5"   y="7" width="20" height="20" rx="6" fill="#C9A96A" transform="rotate(45 15 17)"/>
                                <rect x="205" y="7" width="20" height="20" rx="6" fill="#C9A96A" transform="rotate(45 215 17)"/>
                            </svg>
                        </div>
                    </div>

                    <p style={{ fontSize:'clamp(14px,1.6vw,18px)', color:T.textDim2, maxWidth:520, lineHeight:2, margin:'0 0 36px' }}>
                        <span style={{ fontFamily:'Ruwudu,serif', fontSize:'1.35em', color:'#8B5E3C', letterSpacing:'.04em' }}>أهلاً بيك</span> في بيتك التاني — مع الأستاذ أحمد الشعراوي هتذاكر التاريخ بطريقة عمرك ما جربتها.
                        شرح واضح، فيديوهات تفاعلية، ومتابعة مستمرة لحد ما تلم المنهج.
                    </p>

                    <div style={{ display:'flex', gap:14, flexWrap:'wrap', marginBottom:52 }}>
                        <Link
                            href={auth?.user ? '/student/dashboard' : '/register'}
                            style={{ padding:'14px 36px', borderRadius:12, background:`linear-gradient(135deg,${C.gold},${C.amber})`, color:C.dark, fontWeight:800, fontSize:16, textDecoration:'none', boxShadow:`0 8px 32px rgba(139,94,60,.35)`, transition:'transform .2s,box-shadow .2s' }}
                            onMouseEnter={e=>{e.currentTarget.style.transform='translateY(-2px)';e.currentTarget.style.boxShadow=`0 14px 44px rgba(139,94,60,.55)`;}}
                            onMouseLeave={e=>{e.currentTarget.style.transform='none';e.currentTarget.style.boxShadow=`0 8px 32px rgba(139,94,60,.35)`;}}
                        >اشترك دلوقتي !</Link>
                        <a href="#features" style={{ padding:'14px 28px', borderRadius:12, border:`1px solid rgba(201,169,106,.35)`, color:T.text, fontSize:15, textDecoration:'none' }}>اعرف أكتر ←</a>
                    </div>

                </div>
                <TeacherHero dark={darkMode} />
            </section>

            {/* ══════════════════════════════════════════════════════
                WHY JOIN US
            ══════════════════════════════════════════════════════ */}
            <section id="features" style={{ padding:'clamp(80px,12vh,140px) clamp(24px,5vw,72px)', position:'relative', zIndex:10 }}>
                <div style={{ textAlign:'center', marginBottom:56, position:'relative' }}>
                    <span aria-hidden="true" style={{
                        position:'absolute', top:-30, left:'50%', transform:'translateX(-50%)',
                        fontFamily:"'Reem Kufi','Cairo',sans-serif", fontWeight:700, fontSize:'clamp(48px,7vw,84px)', lineHeight:1,
                        color: darkMode ? C.gold : C.navy, opacity: darkMode ? 0.14 : 0.1, whiteSpace:'nowrap', pointerEvents:'none',
                        userSelect:'none', zIndex:0, letterSpacing:'.05em',
                    }}>التاريخ</span>

                    <p style={{ fontSize:12, color:C.gold, letterSpacing:'.22em', marginBottom:12, position:'relative' }} data-reveal>▸ أسباب الاختيار</p>
                    <h2 style={{ fontSize:'clamp(26px,3.5vw,52px)', fontWeight:800, margin:'0 0 14px', color:C.gold, position:'relative' }} data-reveal>ليه تشترك معانا؟</h2>
                    <p style={{ fontSize:15, color:T.textDim4, maxWidth:480, margin:'0 auto 18px', position:'relative' }} data-reveal>مش بس منصة — ده بيت تاني هتلاقي فيه كل اللي محتاجه عشان تنجح وتتفوق</p>
                    <div style={{ display:'flex', alignItems:'center', justifyContent:'center', gap:10, position:'relative' }} data-reveal>
                        <div style={{ width:40, height:1, background:`linear-gradient(90deg,transparent,${C.gold})` }}/>
                        <svg width="14" height="14" viewBox="0 0 18 18" fill="none"><rect x="4" y="4" width="10" height="10" transform="rotate(45 9 9)" stroke={C.gold} strokeWidth="1.6"/></svg>
                        <div style={{ width:40, height:1, background:`linear-gradient(90deg,${C.gold},transparent)` }}/>
                    </div>
                </div>
                <div className="why-grid">
                    <div className="why-left">
                        <WhySideCard {...WHY_FEATURES.around[0]} dark={darkMode} />
                        <WhySideCard {...WHY_FEATURES.around[1]} dark={darkMode} />
                    </div>
                    <div className="why-center">
                        <WhyCenterCard {...WHY_FEATURES.center} dark={darkMode} />
                    </div>
                    <div className="why-right">
                        <WhySideCard {...WHY_FEATURES.around[2]} dark={darkMode} />
                        <WhySideCard {...WHY_FEATURES.around[3]} dark={darkMode} />
                    </div>
                </div>
            </section>

            {/* ══════════════════════════════════════════════════════
                فروع التاريخ — بطاقات متمددة
            ══════════════════════════════════════════════════════ */}
            <section id="branches" style={{ padding:'clamp(60px,10vh,100px) 0', position:'relative', zIndex:10 }}>
                <div style={{ textAlign:'center', marginBottom:48, padding:'0 clamp(24px,5vw,72px)' }}>
                    <p style={{ fontSize:12, color:C.gold, letterSpacing:'.22em', marginBottom:12 }} data-reveal>▸ خارطة التاريخ</p>
                    <h2 style={{ fontSize:'clamp(26px,3.5vw,52px)', fontWeight:800, margin:0 }} data-reveal>فروع التاريخ</h2>
                    <p style={{ fontSize:15, color:T.textDim4, maxWidth:480, margin:'14px auto 0' }} data-reveal>اضغط على أي فرع عشان تعرف هتذاكر فيه إيه قبل أن تبدأ رحلتك.</p>
                </div>

                <div style={{ padding:'0 clamp(24px,5vw,72px)' }} data-reveal>
                    <LanguageBranches dark={darkMode} />
                </div>
            </section>

            {/* ══════════════════════════════════════════════════════
                THREE PORTALS
            ══════════════════════════════════════════════════════ */}
            <section style={{ padding:'clamp(80px,12vh,140px) clamp(24px,5vw,72px)', position:'relative', zIndex:10, background: darkMode ? 'linear-gradient(180deg,#100E0B 0%,#171310 50%,#100E0B 100%)' : 'linear-gradient(180deg,#f0e6d2 0%,#e6d9be 50%,#f0e6d2 100%)', overflow:'hidden', transition:'background 0.4s ease' }}>
                {/* Top & bottom gold lines */}
                <div style={{ position:'absolute', top:0, left:0, right:0, height:1, background:`linear-gradient(90deg,transparent,${C.gold},transparent)` }}/>
                <div style={{ position:'absolute', bottom:0, left:0, right:0, height:1, background:`linear-gradient(90deg,transparent,${C.gold},transparent)` }}/>
                {/* Center atmospheric glow */}
                <div style={{ position:'absolute', top:'35%', left:'50%', transform:'translate(-50%,-50%)', width:'60%', height:'45%', background:'radial-gradient(ellipse,rgba(201,169,106,.08) 0%,transparent 70%)', pointerEvents:'none' }}/>

                <div style={{ textAlign:'center', marginBottom:64, position:'relative' }}>
                    <div style={{ display:'inline-flex', alignItems:'center', gap:14, marginBottom:18 }}>
                        <div style={{ width:32, height:1, background:`linear-gradient(90deg,transparent,${C.gold})` }}/>
                        <p style={{ fontSize:11, color:C.gold, letterSpacing:'.28em', margin:0 }} data-reveal>ما الذي نقدمه</p>
                        <div style={{ width:32, height:1, background:`linear-gradient(90deg,${C.gold},transparent)` }}/>
                    </div>
                    <h2 style={{ fontSize:'clamp(28px,3.5vw,54px)', fontWeight:800, margin:0, color: darkMode ? '#F5EFDF' : C.navy, letterSpacing:'.02em', transition:'color 0.4s ease' }} data-reveal>أقسام المنصة الثلاثة</h2>
                    <p style={{ fontSize:14, color: darkMode ? 'rgba(201,169,106,.55)' : 'rgba(100,70,10,.55)', marginTop:10, letterSpacing:'.06em', transition:'color 0.4s ease' }} data-reveal>اختر بوابتك — وانطلق</p>
                </div>

                <div className="port-grid" style={{ maxWidth:1160, margin:'0 auto', alignItems:'end' }}>
                    {PORTALS.map(({title,text,hero},i)=>(
                        <div key={i} data-reveal style={{ display:'flex', flexDirection:'column', alignItems:'center' }}>

                            {/* قلادة زخرفية نازلة فوق كل قسم — بديل شكل الخنجر القديم */}
                            <svg width="14" height="60" viewBox="0 0 14 60" fill="none"
                                style={{ marginBottom:10, opacity: i===1 ? .88 : .65, animation:`orbitBob ${3.8+i*.5}s ${i*.3}s ease-in-out infinite`, filter:`drop-shadow(0 3px 10px rgba(201,169,106,.25))` }}>
                                <line x1="7" y1="0" x2="7" y2="42" stroke={i===1 ? C.amber : C.gold} strokeWidth="1.4" opacity=".7"/>
                                <rect x="1" y="42" width="12" height="12" transform="rotate(45 7 48)" fill={i===1 ? C.amber : C.gold} opacity={i===1 ? .9 : .75}/>
                            </svg>

                            <PopOutCard
                                hero={hero} title={title} text={text}
                                num={String(i+1).padStart(2,'0')}
                                featured={i === 1}
                                dark={darkMode}
                            />
                        </div>
                    ))}
                </div>
            </section>

            {/* ══════════════════════════════════════════════════════
                COURSES
            ══════════════════════════════════════════════════════ */}
            <section id="courses" style={{ padding:'clamp(80px,12vh,140px) clamp(24px,5vw,72px)', position:'relative', zIndex:10 }}>
                <div style={{ textAlign:'center', marginBottom:48 }}>
                    <p style={{ fontSize:12, color:C.gold, letterSpacing:'.22em', marginBottom:12 }} data-reveal>▸ المحتوى الدراسي</p>
                    <h2 style={{ fontSize:'clamp(26px,3.5vw,52px)', fontWeight:800, margin:'0 0 14px' }} data-reveal>كورساتنا المتاحة للعام الدراسي الحالي</h2>
                    <p style={{ fontSize:15, color:T.textDim4, maxWidth:480, margin:'0 auto' }} data-reveal>كل صف في حزمة كاملة — منهج + تمارين + مراجعات + اختبارات</p>
                </div>
                <div style={{ display:'flex', gap:10, flexWrap:'wrap', marginBottom:32 }} data-reveal>
                    {filters.map(f=>(
                        <button key={f} onClick={()=>setActiveFilter(f)} style={{ padding:'9px 20px', borderRadius:999, cursor:'pointer', fontFamily:'Cairo,sans-serif', fontSize:13, fontWeight:600, transition:'all .2s', border:`1.5px solid ${activeFilter===f ? C.amber : 'rgba(201,169,106,.28)'}`, background:activeFilter===f ? `linear-gradient(135deg,rgba(139,94,60,.18),rgba(201,169,106,.1))` : 'rgba(28,25,22,.5)', color:activeFilter===f ? C.amber : 'rgba(245,240,232,.65)' }}>{f}</button>
                    ))}
                </div>

                {filteredCourses.length === 0 ? (
                    <div style={{ textAlign:'center', padding:'60px 20px', color:'rgba(226,232,240,.38)', fontSize:16 }}>
                        <div style={{ fontSize:48, marginBottom:16, opacity:.4 }}>📚</div>
                        لا توجد وحدات دراسية متاحة حالياً — تابعنا قريباً!
                    </div>
                ) : (
                <div className="courses-grid">
                    {filteredCourses.map((unit) => (
                        <CourseCard key={unit.id} unit={unit} dark={darkMode} auth={auth} />
                    ))}
                </div>
                )}
            </section>


            {/* ══════════════════════════════════════════════════════
                TOP STUDENTS — لوحة الشرف
            ══════════════════════════════════════════════════════ */}
            {topMonths.length > 0 && (
            <section id="top-students" style={{
                padding:'clamp(80px,12vh,140px) clamp(24px,5vw,72px)',
                position:'relative', zIndex:10,
                background: darkMode
                    ? 'linear-gradient(180deg,#100E0B 0%,#171310 50%,#100E0B 100%)'
                    : 'linear-gradient(180deg,#F5EFDF 0%,#F5EFDF 50%,#F5EFDF 100%)',
                overflow:'hidden', transition:'background .4s'
            }}>
                {/* نسيج نجمة ثمانية خفيف يغطي الخلفية بالكامل */}
                <svg style={{ position:'absolute', inset:0, width:'100%', height:'100%', opacity: darkMode?.05:.06, pointerEvents:'none' }}>
                    <defs>
                        <pattern id="honorStarPat" width="52" height="52" patternUnits="userSpaceOnUse">
                            <g stroke={C.gold} fill="none" strokeWidth="1">
                                <rect x="5" y="5" width="42" height="42"/>
                                <rect x="5" y="5" width="42" height="42" transform="rotate(45 26 26)"/>
                            </g>
                        </pattern>
                    </defs>
                    <rect width="100%" height="100%" fill="url(#honorStarPat)"/>
                </svg>
                <div style={{ position:'absolute', top:'40%', left:'50%', transform:'translate(-50%,-50%)', width:'65%', height:'65%', background:'radial-gradient(ellipse,rgba(201,169,106,.06) 0%,transparent 70%)', pointerEvents:'none' }}/>

                {/* Border hairlines */}
                <div style={{ position:'absolute', top:0, left:0, right:0, height:2, background:`linear-gradient(90deg,transparent,${C.gold} 20%,${C.gold} 80%,transparent)` }}/>
                <div style={{ position:'absolute', bottom:0, left:0, right:0, height:2, background:`linear-gradient(90deg,transparent,${C.gold} 20%,${C.gold} 80%,transparent)` }}/>

                {/* ── Header ── */}
                <div style={{ textAlign:'center', marginBottom:52, position:'relative' }}>
                    <span aria-hidden="true" style={{
                        position:'absolute', top:-46, left:'50%', transform:'translateX(-50%)',
                        fontFamily:"'Ruwudu',serif", fontSize:'clamp(120px,16vw,220px)', lineHeight:1,
                        color:C.gold, opacity:0.05, whiteSpace:'nowrap', pointerEvents:'none',
                        userSelect:'none', zIndex:0,
                    }}>ش</span>

                    {/* شمسة صغيرة أعلى العنوان */}
                    <div style={{ display:'flex', justifyContent:'center', marginBottom:14, position:'relative' }}>
                        <svg width="44" height="44" viewBox="0 0 44 44" style={{ opacity: darkMode?.6:.5 }}>
                            <circle cx="22" cy="22" r="20" fill="none" stroke={C.gold} strokeWidth=".8" opacity=".6"/>
                            <g stroke={C.gold} strokeWidth="1.1" fill="none">
                                <rect x="9" y="9" width="26" height="26"/>
                                <rect x="9" y="9" width="26" height="26" transform="rotate(45 22 22)"/>
                            </g>
                            <circle cx="22" cy="22" r="4.5" fill={C.amber}/>
                        </svg>
                    </div>

                    <p style={{ fontSize:12, color:C.gold, letterSpacing:'.22em', marginBottom:12, position:'relative' }} data-reveal>▸ نجوم المنصة</p>
                    <h2 style={{ fontSize:'clamp(28px,3.5vw,52px)', fontWeight:800, margin:'0 0 14px', color: darkMode?'#F5EFDF':C.navy, position:'relative' }} data-reveal>لوحة الشرف</h2>
                    <p style={{ fontSize:15, color:T.textDim4, maxWidth:480, margin:'0 auto 18px', position:'relative' }} data-reveal>تكريماً لاجتهادهم وتفوقهم — الأبطال اللي وصلوا لقمة الترتيب الشهري</p>

                    <div style={{ display:'flex', alignItems:'center', justifyContent:'center', gap:10, position:'relative' }} data-reveal>
                        <div style={{ width:40, height:1, background:`linear-gradient(90deg,transparent,${C.gold})` }}/>
                        <svg width="14" height="14" viewBox="0 0 18 18" fill="none"><rect x="4" y="4" width="10" height="10" transform="rotate(45 9 9)" stroke={C.gold} strokeWidth="1.6"/></svg>
                        <div style={{ width:40, height:1, background:`linear-gradient(90deg,${C.gold},transparent)` }}/>
                    </div>
                </div>

                {/* ── Month filters ── */}
                <div style={{ display:'flex', gap:10, flexWrap:'wrap', justifyContent:'center', marginBottom:44, position:'relative' }} data-reveal>
                    {[{ key:null, label:'الكل' }, ...topMonths.map(m => ({ key:m, label:monthLabel(m) }))].map(({ key, label }) => {
                        const active = activeTopMonth === key;
                        return (
                            <button key={String(key)} onClick={() => setActiveTopMonth(key)}
                                style={{ padding:'9px 24px', borderRadius:999, cursor:'pointer', fontFamily:'Cairo,sans-serif', fontSize:13, fontWeight:700, transition:'all .2s',
                                    border:`1px solid ${active ? C.amber : darkMode ? 'rgba(201,169,106,.22)' : 'rgba(201,169,106,.38)'}`,
                                    background: active ? `linear-gradient(135deg,${C.amber}30,${C.gold}18)` : darkMode ? 'rgba(201,169,106,.04)' : 'rgba(201,169,106,.06)',
                                    color: active ? C.amber : darkMode ? 'rgba(245,240,232,.5)' : 'rgba(14,58,46,.5)',
                                    boxShadow: active ? `0 0 10px ${C.amber}30` : 'none',
                                }}>
                                {label}
                            </button>
                        );
                    })}
                </div>

                {/* ── قائمة الأبطال ── */}
                {filteredTop.length === 0 ? (
                    <div style={{ textAlign:'center', padding:'60px 20px', color: darkMode?'rgba(226,232,240,.3)':'rgba(14,58,46,.25)', fontSize:16, position:'relative' }}>
                        <svg width="44" height="44" viewBox="0 0 44 44" style={{ margin:'0 auto 14px', opacity:.35, display:'block' }}>
                            <g stroke="currentColor" strokeWidth="1" fill="none">
                                <rect x="9" y="9" width="26" height="26"/>
                                <rect x="9" y="9" width="26" height="26" transform="rotate(45 22 22)"/>
                            </g>
                        </svg>
                        لا توجد بيانات للطلاب الأوائل لهذا الشهر.
                    </div>
                ) : (
                    <div style={{ maxWidth:860, margin:'0 auto', display:'flex', flexDirection:'column', gap:14, position:'relative' }}>
                        {filteredTop.map((s) => {
                            const arNum  = { 1:'١', 2:'٢', 3:'٣', 4:'٤', 5:'٥', 6:'٦', 7:'٧', 8:'٨', 9:'٩', 10:'١٠' };
                            const medal  = medalColors[s.rank-1] ?? C.gold;
                            const isTop3 = s.rank <= 3;
                            const hov    = hoveredStudent === s.id;
                            const badgeSz = isTop3 ? 60 : 48;
                            return (
                                <div key={s.id} data-reveal
                                    onMouseEnter={() => setHoveredStudent(s.id)}
                                    onMouseLeave={() => setHoveredStudent(null)}
                                    style={{
                                        position:'relative', overflow:'hidden',
                                        display:'flex', alignItems:'center', gap:22,
                                        padding: isTop3 ? '22px 28px' : '15px 24px',
                                        borderRadius:14,
                                        background: hov
                                            ? darkMode ? `linear-gradient(120deg,${medal}1c,rgba(28,25,22,.98))` : `linear-gradient(120deg,${medal}14,#ffffff)`
                                            : darkMode ? 'linear-gradient(120deg,rgba(28,25,22,.95),rgba(23,19,16,.95))' : 'linear-gradient(120deg,#ffffff,#F7F3E9)',
                                        border:`1px solid ${hov ? medal+'88' : isTop3 ? medal+'38' : darkMode ? 'rgba(201,169,106,.1)' : 'rgba(201,169,106,.18)'}`,
                                        boxShadow: hov ? `0 8px 36px ${medal}30, inset 0 1px 0 ${medal}33` : isTop3 ? `0 3px 16px ${medal}14` : 'none',
                                        transform: hov ? 'translateY(-3px) scale(1.004)' : 'none',
                                        transition:'all .28s cubic-bezier(.22,1,.36,1)',
                                    }}>

                                    {/* زخارف أركان رفيعة بجوهرة صغيرة — لأصحاب المراكز الثلاثة الأولى */}
                                    {isTop3 && ['tl','tr','bl','br'].map(pos => {
                                        const vFlip = pos[0] === 'b', hFlip = pos[1] === 'l' ? false : true;
                                        const scale = `scale(${hFlip?-1:1},${vFlip?-1:1})`;
                                        return (
                                            <div key={pos} style={{
                                                position:'absolute', width:22, height:22, zIndex:3, color: medal,
                                                opacity: hov ? 1 : .7, transition:'opacity .3s',
                                                top: pos[0]==='t' ? 6 : 'auto', bottom: pos[0]==='b' ? 6 : 'auto',
                                                right: pos[1]==='r' ? 6 : 'auto', left: pos[1]==='l' ? 6 : 'auto',
                                                transform: scale,
                                            }}>
                                                <svg viewBox="0 0 30 30" width="22" height="22">
                                                    <path d="M3,19 L3,3 L19,3" stroke="currentColor" strokeWidth="1.4" fill="none" strokeLinecap="round"/>
                                                    <rect x="0" y="0" width="6" height="6" transform="rotate(45 3.2 3.2)" fill="currentColor"/>
                                                </svg>
                                            </div>
                                        );
                                    })}

                                    {/* شمسة الترتيب — بدلاً من العملة القديمة */}
                                    <svg width={badgeSz} height={badgeSz} viewBox="0 0 60 60" fill="none" style={{ flexShrink:0, filter: hov?`drop-shadow(0 0 10px ${medal}99)`:'none', transition:'filter .28s' }}>
                                        <circle cx="30" cy="30" r="27" fill="none" stroke={medal} strokeWidth=".7" opacity={hov?.7:.4}/>
                                        <g stroke={medal} strokeWidth="1.1" fill="none" opacity={hov?.9:.55}>
                                            <rect x="12" y="12" width="36" height="36"/>
                                            <rect x="12" y="12" width="36" height="36" transform="rotate(45 30 30)"/>
                                        </g>
                                        <circle cx="30" cy="30" r="18" fill={hov?`${medal}22`:`${medal}0d`} stroke={medal} strokeWidth="1.4"/>
                                        <text x="30" y="37" textAnchor="middle" fontSize={isTop3?17:14} fontWeight="900" fill={medal} fontFamily="Cairo,sans-serif" opacity={hov?1:.9}>
                                            {arNum[s.rank] ?? s.rank}
                                        </text>
                                    </svg>

                                    {/* Name & info */}
                                    <div style={{ flex:1 }}>
                                        <div style={{ fontSize: isTop3?18:15, fontWeight: isTop3?800:600,
                                            color: hov ? (darkMode?'#fff':C.navy) : isTop3 ? (darkMode?'#F5EFDF':C.navy) : (darkMode?'rgba(245,240,232,.68)':'rgba(14,58,46,.6)'),
                                            transition:'color .2s' }}>
                                            {s.student?.name ?? '—'}
                                        </div>
                                        {s.academic_year?.name && <div style={{ fontSize:12, color: darkMode?'rgba(201,169,106,.6)':'rgba(14,58,46,.55)', marginTop:3 }}>{s.academic_year.name}</div>}
                                        {s.notes && <div style={{ fontSize:12, color: darkMode?'rgba(245,240,232,.36)':'rgba(14,58,46,.4)', marginTop:4, fontStyle:'italic' }}>{s.notes}</div>}
                                    </div>

                                    {/* الرقم المتوهج بالخلفية */}
                                    <div className="ts-rank-num" style={{
                                        fontSize: isTop3?100:76, fontWeight:900, fontFamily:'Cairo,sans-serif',
                                        lineHeight:1, userSelect:'none', pointerEvents:'none',
                                        color:medal, opacity: hov?.5:.055,
                                        textShadow: hov ? `0 0 30px ${medal}cc, 0 0 70px ${medal}66` : 'none',
                                        transition:'opacity .3s, text-shadow .3s', letterSpacing:'-.02em',
                                    }}>
                                        {arNum[s.rank] ?? s.rank}
                                    </div>
                                </div>
                            );
                        })}
                    </div>
                )}
            </section>
            )}

            {/* ══════════════════════════════════════════════════════
                عن الأستاذ
            ══════════════════════════════════════════════════════ */}
            <section id="about" style={{ padding:'clamp(80px,12vh,140px) clamp(8px,1.2vw,16px)', position:'relative', zIndex:10 }}>
                <div style={{ maxWidth:'none', margin:'0 auto', position:'relative' }} data-reveal>

                    {/* زخارف أركان رفيعة بجوهرة صغيرة — طراز تذهيب المخطوطات */}
                    {['tl','tr','bl','br'].map(pos => {
                        const hFlip = pos[1] === 'r', vFlip = pos[0] === 'b';
                        return (
                            <div key={pos} style={{
                                position:'absolute', width:32, height:32, zIndex:6, color:C.gold, opacity:.6,
                                top: pos[0]==='t' ? -12 : 'auto', bottom: pos[0]==='b' ? -12 : 'auto',
                                right: pos[1]==='r' ? -12 : 'auto', left: pos[1]==='l' ? -12 : 'auto',
                                transform:`scale(${hFlip?-1:1},${vFlip?-1:1})`,
                            }}>
                                <svg viewBox="0 0 32 32" width="32" height="32">
                                    <path d="M4,20 L4,4 L20,4" stroke="currentColor" strokeWidth="1.5" fill="none" strokeLinecap="round"/>
                                    <rect x="0" y="0" width="7.5" height="7.5" transform="rotate(45 4 4)" fill="currentColor"/>
                                </svg>
                            </div>
                        );
                    })}

                    <div className="about-full-grid" style={{
                        display:'grid', gridTemplateColumns:'42% 58%', direction:'ltr',
                        borderRadius:26, overflow:'hidden', position:'relative',
                        border:`1px solid ${darkMode ? 'rgba(201,169,106,.25)' : 'rgba(201,169,106,.3)'}`,
                        boxShadow: darkMode ? '0 24px 64px rgba(0,0,0,.45)' : '0 14px 44px rgba(14,58,46,.12)',
                    }}>
                        {/* إطار داخلي مزدوج */}
                        <div style={{ position:'absolute', inset:8, borderRadius:18, border:`1px solid ${darkMode?'rgba(201,169,106,.16)':'rgba(201,169,106,.22)'}`, pointerEvents:'none', zIndex:5 }}/>

                        {/* ── لوحة الصورة (يسار) — صورة كاملة بطراز تحريري ── */}
                        <div className="about-photo-side" style={{
                            position:'relative', overflow:'hidden', minHeight:460,
                            background: darkMode ? '#141210' : '#E3D9C4',
                        }}>
                            {/* الصورة — تملأ اللوحة بالكامل مع ظهورها كاملة بدون قص */}
                            <img
                                src={encodeURI('/images/فوتيه منصور.png')}
                                alt="الأستاذ منصور"
                                style={{
                                    position:'absolute', inset:0, width:'100%', height:'100%',
                                    objectFit:'contain', objectPosition:'center',
                                    filter: darkMode ? 'brightness(.96) saturate(1.05)' : 'none',
                                }}
                            />

                            {/* تدرّج للدمج مع لوحة النص ولتثبيت القراءة عند الحواف */}
                            <div style={{
                                position:'absolute', inset:0, pointerEvents:'none',
                                background: darkMode
                                    ? 'linear-gradient(180deg, rgba(20,18,16,.4) 0%, transparent 20%, transparent 68%, rgba(20,18,16,.88) 100%)'
                                    : 'linear-gradient(180deg, rgba(255,255,255,.25) 0%, transparent 20%, transparent 68%, rgba(255,255,255,.65) 100%)',
                            }}/>

                            {/* نسيج نجمة ثمانية خافت فوق الصورة */}
                            <svg style={{ position:'absolute', inset:0, width:'100%', height:'100%', opacity:.05, pointerEvents:'none' }}>
                                <defs>
                                    <pattern id="aboutStarPat2" width="48" height="48" patternUnits="userSpaceOnUse">
                                        <g stroke={C.gold} fill="none" strokeWidth="1">
                                            <rect x="5" y="5" width="38" height="38"/>
                                            <rect x="5" y="5" width="38" height="38" transform="rotate(45 24 24)"/>
                                        </g>
                                    </pattern>
                                </defs>
                                <rect width="100%" height="100%" fill="url(#aboutStarPat2)"/>
                            </svg>

                            {/* حافة ذهبية علوية رفيعة */}
                            <div style={{ position:'absolute', top:0, left:0, right:0, height:3, background:`linear-gradient(90deg, transparent, ${C.gold}, ${C.amber}, ${C.gold}, transparent)`, opacity:.85 }}/>

                            {/* شارة الاسم أسفل الصورة */}
                            <div style={{ position:'absolute', bottom:22, left:26, right:26, zIndex:2 }}>
                                <div style={{ display:'inline-flex', alignItems:'center', gap:9, marginBottom:8 }}>
                                    <svg width="9" height="9" viewBox="0 0 18 18"><rect x="4" y="4" width="10" height="10" transform="rotate(45 9 9)" fill={C.gold}/></svg>
                                    <span style={{ fontSize:11, color:C.gold, letterSpacing:'.18em', fontWeight:700 }}>الأستاذ</span>
                                </div>
                                <div style={{ fontFamily:"'Ruwudu',serif", fontSize:'clamp(24px,2.6vw,32px)', color:'#F5EFDF', lineHeight:1.1 }}>
                                    محمد منصور
                                </div>
                            </div>
                        </div>

                        {/* ── لوحة المحتوى (يمين) ── */}
                        <div className="about-text-side" style={{
                            background: darkMode ? '#0a1424' : '#ffffff',
                            padding:'clamp(40px,4vw,64px)',
                            display:'flex', flexDirection:'column', justifyContent:'center', gap:24,
                            position:'relative', direction:'rtl',
                        }}>
                            <div style={{ maxWidth:640 }}>
                                {/* Tag */}
                                <div style={{ display:'inline-flex', alignItems:'center', gap:10, alignSelf:'flex-start' }}>
                                    <svg width="12" height="12" viewBox="0 0 18 18" fill="none"><rect x="4" y="4" width="10" height="10" transform="rotate(45 9 9)" stroke={C.gold} strokeWidth="1.6"/></svg>
                                    <span style={{ fontSize:11, color:C.gold, letterSpacing:'.24em', fontWeight:700 }}>عن الأستاذ</span>
                                </div>

                                {/* الاسم */}
                                <div style={{ marginTop:14 }}>
                                    <h2 style={{ fontSize:'clamp(34px,4vw,54px)', fontFamily:"'Ruwudu',serif", color: darkMode ? '#F5EFDF' : C.navy, lineHeight:1.15, margin:'0 0 8px' }}>
                                        منصور
                                    </h2>
                                    <div style={{ display:'flex', alignItems:'center', gap:9 }}>
                                        <svg width="9" height="9" viewBox="0 0 18 18"><rect x="4" y="4" width="10" height="10" transform="rotate(45 9 9)" fill={C.amber}/></svg>
                                        <span style={{ fontSize:13, color:C.amber, fontWeight:700, letterSpacing:'.04em' }}>أستاذ اللغة العربية — الثانوية العامة</span>
                                    </div>
                                </div>

                                {/* اقتباس */}
                                <div style={{ position:'relative', paddingRight:20, marginTop:20, borderRight:`2px solid ${darkMode?'rgba(201,169,106,.35)':'rgba(201,169,106,.4)'}` }}>
                                    <p style={{ fontSize:'clamp(14px,1.4vw,17px)', fontWeight:600, color: darkMode ? 'rgba(240,232,213,.78)' : 'rgba(14,58,46,.78)', lineHeight:2.05, margin:0 }}>
                                        <span style={{ fontFamily:"'Ruwudu',serif", fontSize:'1.3em', color:C.amber, letterSpacing:'.03em' }}>ركّز معايا</span> وجهّز نفسك من النهارده...<br/>
                                        هنذاكر مع بعض بأسلوب مختلف تمامًا — تفهم الدرس مش تحفظه<br/>
                                        لحد ما <span style={{ color:C.amber, fontWeight:900 }}>الدرجة الكاملة تبقى حقك المضمون</span>
                                    </p>
                                </div>
                            </div>

                            {/* إحصائيات — بطاقات مستقلة بدل الخط الفاصل */}
                            <div className="about-stats-grid" style={{ display:'grid', gridTemplateColumns:'repeat(2,1fr)', gap:14, maxWidth:340 }}>
                                {[
                                    { count:98,      suffix:'٪',  label:'نسبة النجاح' },
                                    { count:500,     prefix:'+',  label:'ساعة محتوى' },
                                ].map(({count,prefix='',suffix='',label}) => (
                                    <div key={label} style={{
                                        textAlign:'center', padding:'16px 8px', borderRadius:14,
                                        background: darkMode ? 'rgba(201,169,106,.05)' : 'rgba(14,58,46,.03)',
                                        border:`1px solid ${darkMode?'rgba(201,169,106,.14)':'rgba(14,58,46,.1)'}`,
                                    }}>
                                        <div style={{ fontSize:'clamp(19px,2vw,28px)', fontWeight:900, color:C.gold, lineHeight:1.1 }}>
                                            {prefix}<span data-count={count}>٠</span>{suffix}
                                        </div>
                                        <div style={{ fontSize:11, color: darkMode?'rgba(201,169,106,.55)':'rgba(14,58,46,.5)', marginTop:6, letterSpacing:'.03em' }}>{label}</div>
                                    </div>
                                ))}
                            </div>

                            {/* مميزات — شبكة عمودين لاستغلال العرض المتاح */}
                            <div className="about-feats-grid" style={{ display:'grid', gridTemplateColumns:'1fr 1fr', gap:'4px 20px' }}>
                                {[
                                    'شروحات فيديو تفصيلية لكل درس ووحدة',
                                    'خرائط ذهنية ونماذج إعراب تثبّت المعلومة',
                                    'اختبارات بنظام الوزارة ومتابعة مستمرة',
                                    'دعم مباشر للطالب وولي الأمر طوال الأسبوع',
                                ].map((label, i) => (
                                    <div key={i} style={{ display:'flex', alignItems:'center', gap:13, padding:'10px 0' }}>
                                        <svg width="15" height="15" viewBox="0 0 18 18" style={{ flexShrink:0 }}><rect x="4" y="4" width="10" height="10" transform="rotate(45 9 9)" fill="none" stroke={C.gold} strokeWidth="1.6"/></svg>
                                        <span style={{ fontSize:13.5, color: darkMode ? 'rgba(245,240,232,.68)' : 'rgba(14,58,46,.68)', fontWeight:500 }}>{label}</span>
                                    </div>
                                ))}
                            </div>

                            {/* CTA */}
                            <div style={{ display:'flex', gap:14, alignItems:'center', flexWrap:'wrap', paddingTop:6 }}>
                                <Link
                                    href={auth?.user ? '/student/dashboard' : '/register'}
                                    style={{
                                        display:'inline-flex', alignItems:'center', gap:10,
                                        padding:'13px 30px', borderRadius:10,
                                        background:`linear-gradient(135deg,${C.gold},${C.amber})`,
                                        color:C.dark, fontWeight:800, fontSize:14, textDecoration:'none',
                                        boxShadow:`0 8px 28px rgba(201,169,106,.35)`,
                                        transition:'transform .2s, box-shadow .2s',
                                    }}
                                    onMouseEnter={e=>{e.currentTarget.style.transform='translateY(-2px)';e.currentTarget.style.boxShadow=`0 14px 36px rgba(201,169,106,.55)`;}}
                                    onMouseLeave={e=>{e.currentTarget.style.transform='none';e.currentTarget.style.boxShadow=`0 8px 28px rgba(201,169,106,.35)`;}}
                                >
                                    اشترك دلوقتي
                                    <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                                        <line x1="5" y1="12" x2="19" y2="12"/><polyline points="12 5 19 12 12 19"/>
                                    </svg>
                                </Link>
                                <a href="#courses" style={{ fontSize:13, color: darkMode ? 'rgba(201,169,106,.7)' : 'rgba(14,58,46,.6)', textDecoration:'none', fontWeight:600, transition:'color .2s' }}
                                    onMouseEnter={e=>e.currentTarget.style.color=C.gold}
                                    onMouseLeave={e=>e.currentTarget.style.color= darkMode ? 'rgba(201,169,106,.7)' : 'rgba(14,58,46,.6)'}
                                >شوف الكورسات ←</a>
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            {/* ══════════════════════════════════════════════════════
                LOCATIONS — سناتر الأستاذ
            ══════════════════════════════════════════════════════ */}
            <section style={{ padding:'clamp(72px,11vh,120px) clamp(24px,5vw,72px)', position:'relative', zIndex:10, background: darkMode ? 'linear-gradient(180deg,#060e1c 0%,#030810 100%)' : '#ffffff', transition:'background 0.4s ease' }}>

                {/* Background grid */}
                <svg style={{ position:'absolute', inset:0, width:'100%', height:'100%', opacity: darkMode ? .035 : .055, pointerEvents:'none' }}>
                    <defs><pattern id="locGrid" width="52" height="52" patternUnits="userSpaceOnUse">
                        <path d="M 52 0 L 0 0 0 52" fill="none" stroke={darkMode ? '#C9A96A' : '#0E3A2E'} strokeWidth=".6"/>
                    </pattern></defs>
                    <rect width="100%" height="100%" fill="url(#locGrid)"/>
                </svg>

                {/* Ambient orb */}
                <div style={{ position:'absolute', top:'20%', left:'50%', transform:'translateX(-50%)', width:600, height:300, background:`radial-gradient(ellipse, rgba(201,169,106,.${darkMode?'06':'09'}) 0%, transparent 70%)`, pointerEvents:'none' }}/>

                {/* ── Header ── */}
                <div style={{ textAlign:'center', marginBottom:'clamp(44px,7vh,72px)', position:'relative' }} data-reveal>
                    <p style={{ fontSize:12, color:C.gold, letterSpacing:'.22em', marginBottom:12 }}>▸ تواجدنا</p>
                    <h2 style={{ fontSize:'clamp(28px,3.5vw,50px)', fontWeight:800, margin:'0 0 14px', color: darkMode ? C.white : C.navy }}>
                        أماكن تواجدنا
                    </h2>
                    <p style={{ fontSize:14, color: darkMode ? 'rgba(226,232,240,.5)' : 'rgba(14,58,46,.55)', maxWidth:440, margin:'0 auto 18px' }}>
                        زوروا مقرّنا وابدأوا رحلتكم مع الأستاذ منصور
                    </p>
                    <div style={{ display:'flex', alignItems:'center', justifyContent:'center', gap:10 }}>
                        <div style={{ width:40, height:1, background:`linear-gradient(90deg,transparent,${C.gold})` }}/>
                        <svg width="14" height="14" viewBox="0 0 18 18" fill="none"><rect x="4" y="4" width="10" height="10" transform="rotate(45 9 9)" stroke={C.gold} strokeWidth="1.6"/></svg>
                        <div style={{ width:40, height:1, background:`linear-gradient(90deg,${C.gold},transparent)` }}/>
                    </div>
                </div>

                {/* ── Location card — مقر الأستاذ منصور ── */}
                <div style={{ display:'grid', gridTemplateColumns:'1fr', gap:22, maxWidth:380, margin:'0 auto', position:'relative' }}>
                    {[
                        {
                            name:    'مقر الأستاذ منصور',
                            num:     '01',
                            icon:    'M3 9l9-7 9 7v11a2 2 0 01-2 2H5a2 2 0 01-2-2z M9 22V12h6v10',
                            address: 'المحلة الكبرى — خلف مول الشيشيني — شارع صيدلية الطبال، المقابل لمدرسة الصنايع',
                            detail:  '',
                            featured: true,
                        },
                    ].map(({ name, num, icon, address, detail, featured }, i) => (
                        <LocationCard key={i} name={name} num={num} icon={icon} address={address} detail={detail} featured={!!featured} dark={darkMode} />
                    ))}
                </div>
            </section>

            {/* ══════════════════════════════════════════════════════
                FOOTER
            ══════════════════════════════════════════════════════ */}
            <footer style={{
                position:'relative', zIndex:10,
                background: darkMode
                    ? 'linear-gradient(180deg,#020710 0%,#03080f 60%,#141210 100%)'
                    : '#ffffff',
                borderTop:`1px solid ${darkMode ? 'rgba(201,169,106,.18)' : 'rgba(14,58,46,.08)'}`,
                overflow:'hidden',
            }}>
                {/* Subtle grid overlay */}
                <svg style={{ position:'absolute', inset:0, width:'100%', height:'100%', opacity:.04, pointerEvents:'none' }}>
                    <defs><pattern id="ftGrid" width="60" height="60" patternUnits="userSpaceOnUse">
                        <path d="M 60 0 L 0 0 0 60" fill="none" stroke="#C9A96A" strokeWidth=".6"/>
                    </pattern></defs>
                    <rect width="100%" height="100%" fill="url(#ftGrid)"/>
                </svg>

                {/* Ambient glow top-center */}
                <div style={{ position:'absolute', top:-80, left:'50%', transform:'translateX(-50%)', width:700, height:300, background:'radial-gradient(ellipse, rgba(201,169,106,.07) 0%, transparent 70%)', pointerEvents:'none' }}/>

                {/* ── Brand header ── */}
                <div style={{ textAlign:'center', padding:'clamp(52px,8vh,80px) clamp(24px,5vw,72px) 0', position:'relative' }}>
                    {/* Ornamental divider */}
                    <div style={{ display:'flex', alignItems:'center', justifyContent:'center', gap:16, marginBottom:36 }}>
                        <div style={{ height:1, width:80, background:'linear-gradient(90deg,transparent,rgba(201,169,106,.5))' }}/>
                        <svg width="28" height="28" viewBox="0 0 28 28" fill="none">
                            <path d="M14 2 L16.5 11.5 L26 14 L16.5 16.5 L14 26 L11.5 16.5 L2 14 L11.5 11.5 Z" fill="#C9A96A" opacity=".8"/>
                            <circle cx="14" cy="14" r="3" fill="#8B5E3C" opacity=".9"/>
                        </svg>
                        <div style={{ height:1, width:80, background:'linear-gradient(90deg,rgba(201,169,106,.5),transparent)' }}/>
                    </div>

                    {/* شعار منصور */}
                    <div style={{ display:'flex', justifyContent:'center', marginBottom:28 }}>
                        <div style={{ position:'relative', display:'inline-block' }}>
                            {/* Outer glow ring */}
                            <div style={{
                                position:'absolute', inset:-20,
                                borderRadius:'50%',
                                background:'radial-gradient(ellipse,rgba(201,169,106,.14) 0%,transparent 70%)',
                                filter:'blur(10px)',
                                pointerEvents:'none',
                            }}/>
                            <div style={{
                                width:'clamp(82px,11vw,124px)',
                                height:'clamp(82px,11vw,124px)',
                                overflow:'hidden',
                                position:'relative',
                            }}>
                                <img
                                    src="/images/منصور لوجو.png"
                                    alt="منصور"
                                    style={{
                                        height:'150%',
                                        width:'auto',
                                        objectFit:'contain',
                                        objectPosition:'left center',
                                        filter:'drop-shadow(0 10px 28px rgba(0,0,0,.35))',
                                        display:'block',
                                        transform:'translateY(-16%)',
                                    }}
                                />
                            </div>
                        </div>
                    </div>

                    <div style={{ fontSize:10, color: darkMode ? 'rgba(201,169,106,.45)' : 'rgba(14,58,46,.4)', letterSpacing:'0.34em', marginBottom:14 }}>
                        لغة الضاد
                    </div>
                    <p style={{ fontSize:14, color: darkMode ? 'rgba(226,232,240,.42)' : 'rgba(14,58,46,.5)', maxWidth:400, margin:'0 auto', lineHeight:2 }}>
                        نصنع لسانًا فصيحًا يصنع مستقبلك — العربية مش حفظ، دي ذوق وفهم
                    </p>
                </div>

                {/* ── Social cards ── */}
                <div style={{ display:'flex', alignItems:'center', justifyContent:'center', gap:10, margin:'clamp(36px,5vh,56px) auto 0' }}>
                    <div style={{ width:36, height:1, background:'linear-gradient(90deg,transparent,rgba(201,169,106,.5))' }}/>
                    <span style={{ fontSize:11, color: darkMode ? 'rgba(201,169,106,.6)' : 'rgba(14,58,46,.5)', letterSpacing:'.24em', fontWeight:700 }}>تابعونا</span>
                    <div style={{ width:36, height:1, background:'linear-gradient(90deg,rgba(201,169,106,.5),transparent)' }}/>
                </div>
                <div className="foot-social-grid" style={{
                    display:'grid', gridTemplateColumns:'repeat(2,1fr)',
                    gap:20, maxWidth:640, margin:'clamp(22px,3vh,30px) auto 0',
                    padding:'0 clamp(24px,5vw,72px)',
                }}>
                    {/* Facebook */}
                    <SocialCard
                        dark={darkMode}
                        href="https://www.facebook.com/share/1CCyqXVvxq/?mibextid=wwXIfr"
                        label="فيسبوك"
                        handle="خواطر المنصور"
                        glow="rgba(24,119,242,.28)"
                        borderHover="rgba(24,119,242,.55)"
                        icon={
                            <svg width="32" height="32" viewBox="0 0 24 24" fill="currentColor">
                                <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/>
                            </svg>
                        }
                    />
                    {/* YouTube */}
                    <SocialCard
                        dark={darkMode}
                        href="https://youtube.com/channel/UCmocXEAuiOe1OpEhIjFQA8A?si=osmKAW5VEvem_0jO"
                        label="يوتيوب"
                        handle="خواطر المنصور"
                        glow="rgba(255,0,0,.22)"
                        borderHover="rgba(255,60,60,.55)"
                        icon={
                            <svg width="32" height="32" viewBox="0 0 24 24" fill="currentColor">
                                <path d="M23.498 6.186a3.016 3.016 0 00-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 00.502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 002.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 002.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z"/>
                            </svg>
                        }
                    />
                </div>

                {/* ── Contact numbers ── */}
                <div style={{
                    display:'flex', alignItems:'center', justifyContent:'center', gap:'clamp(14px,3vw,28px)',
                    flexWrap:'wrap', margin:'clamp(28px,4vh,40px) auto 0',
                    padding:'0 clamp(24px,5vw,72px)',
                }}>
                    {[
                        ['01097694425', '+201097694425'],
                        ['0402239520',  '+20402239520'],
                    ].map(([display, tel]) => (
                        <a key={tel} href={`tel:${tel}`} style={{
                            display:'inline-flex', alignItems:'center', gap:8,
                            fontSize:14, fontWeight:700, direction:'ltr',
                            color: darkMode ? 'rgba(226,232,240,.75)' : 'rgba(14,58,46,.75)',
                            textDecoration:'none', letterSpacing:'.02em',
                            transition:'color .25s ease',
                        }}
                        onMouseEnter={e=>e.currentTarget.style.color=C.gold}
                        onMouseLeave={e=>e.currentTarget.style.color= darkMode ? 'rgba(226,232,240,.75)' : 'rgba(14,58,46,.75)'}
                        >
                            <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                <path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72c.127.96.361 1.903.7 2.81a2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45c.907.339 1.85.573 2.81.7A2 2 0 0 1 22 16.92z"/>
                            </svg>
                            {display}
                        </a>
                    ))}
                </div>

                {/* ── Navigation links ── */}
                <div style={{
                    display:'flex', justifyContent:'center', gap:'clamp(16px,3vw,40px)',
                    flexWrap:'wrap', margin:'clamp(36px,5vh,52px) auto 0',
                    padding:'0 clamp(24px,5vw,72px)',
                    borderTop:'1px solid rgba(201,169,106,.08)',
                    paddingTop:'clamp(28px,4vh,40px)',
                    maxWidth:900,
                }}>
                    {[
                        ['الرئيسية',    '/'],
                        ['المقررات',    '#courses'],
                        ['عن المنصة',  '#about'],
                        ['إنشاء حساب', '/register'],
                        ['تسجيل الدخول','/student/login'],
                    ].map(([lbl,href])=>(
                        <a key={lbl} href={href} style={{
                            fontSize:13, color: darkMode ? 'rgba(226,232,240,.4)' : 'rgba(14,58,46,.45)',
                            textDecoration:'none', letterSpacing:'.04em',
                            transition:'color .25s ease',
                        }}
                        onMouseEnter={e=>e.currentTarget.style.color=C.gold}
                        onMouseLeave={e=>e.currentTarget.style.color= darkMode ? 'rgba(226,232,240,.4)' : 'rgba(14,58,46,.45)'}
                        >{lbl}</a>
                    ))}
                </div>

                {/* ── Bottom bar ── */}
                <div style={{
                    display:'flex', alignItems:'center', justifyContent:'center',
                    gap:16, padding:'clamp(20px,3vh,28px) clamp(24px,5vw,72px)',
                    marginTop:'clamp(24px,4vh,36px)',
                    borderTop:'1px solid rgba(201,169,106,.07)',
                }}>
                    <div style={{ width:32, height:1, background:'linear-gradient(90deg,transparent,rgba(201,169,106,.3))' }}/>
                    <div style={{ fontSize:12, color: darkMode ? 'rgba(201,169,106,.28)' : 'rgba(14,58,46,.3)', textAlign:'center', letterSpacing:'.06em' }}>
                        © 2026 منصة منصور التعليمية — جميع الحقوق محفوظة
                    </div>
                    <div style={{ width:32, height:1, background:'linear-gradient(90deg,rgba(201,169,106,.3),transparent)' }}/>
                </div>

                {/* ── Credit line ── */}
                <div dir="ltr" style={{
                    textAlign:'center',
                    paddingBottom:'clamp(20px,3vh,28px)',
                    fontSize:14,
                    color: darkMode ? 'rgba(226,232,240,.65)' : 'rgba(14,58,46,.65)',
                    letterSpacing:'.02em',
                }}>
                    Powered by KABOx / <a
                        href="https://wa.me/201503601350"
                        target="_blank"
                        rel="noopener noreferrer"
                        style={{
                            color: C.gold,
                            fontWeight:800,
                            textDecoration:'none',
                            transition:'text-decoration .2s ease',
                        }}
                        onMouseEnter={e=>e.currentTarget.style.textDecoration='underline'}
                        onMouseLeave={e=>e.currentTarget.style.textDecoration='none'}
                    >Mindly</a>
                </div>
            </footer>

            </div>

            {/* WhatsApp Float */}
            <WelcomeWhatsAppBtn />
        </>
    );
}

function WelcomeWhatsAppBtn() {
    return (
        <>
            <style>{`
                @keyframes waPulseW {
                    0%   { box-shadow: 0 0 0 0 rgba(37,211,102,.55); }
                    70%  { box-shadow: 0 0 0 14px rgba(37,211,102,0); }
                    100% { box-shadow: 0 0 0 0 rgba(37,211,102,0); }
                }
                .wa-float-w { animation: waPulseW 2.2s ease-out infinite; }
                .wa-float-w:hover { transform: scale(1.1) !important; }
            `}</style>
            <a
                href="https://wa.me/201097694425"
                target="_blank"
                rel="noopener noreferrer"
                className="wa-float-w"
                title="تواصل معنا على واتساب"
                style={{
                    position:       'fixed',
                    bottom:         120,
                    left:           20,
                    width:          58,
                    height:         58,
                    borderRadius:   '50%',
                    background:     'linear-gradient(135deg,#25d366,#128c4a)',
                    display:        'flex',
                    alignItems:     'center',
                    justifyContent: 'center',
                    zIndex:         9999,
                    textDecoration: 'none',
                    transition:     'transform .2s ease',
                    boxShadow:      '0 4px 20px rgba(37,211,102,.45)',
                }}
            >
                <svg viewBox="0 0 32 32" width="30" height="30" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path d="M16 3C8.82 3 3 8.82 3 16c0 2.3.61 4.46 1.68 6.33L3 29l6.87-1.64A13 13 0 0 0 16 29c7.18 0 13-5.82 13-13S23.18 3 16 3z" fill="#fff"/>
                    <path d="M21.94 19.47c-.27-.14-1.6-.79-1.85-.88-.25-.09-.43-.14-.61.14-.18.27-.7.88-.86 1.06-.16.18-.32.2-.59.07-.27-.14-1.14-.42-2.17-1.34-.8-.72-1.34-1.6-1.5-1.87-.16-.27-.02-.42.12-.55.12-.12.27-.32.41-.48.14-.16.18-.27.27-.45.09-.18.05-.34-.02-.48-.07-.14-.61-1.47-.84-2.01-.22-.53-.45-.46-.61-.47l-.52-.01c-.18 0-.48.07-.73.34-.25.27-.96.94-.96 2.29 0 1.35.98 2.65 1.12 2.83.14.18 1.93 2.95 4.68 4.14.65.28 1.16.45 1.56.57.65.21 1.25.18 1.72.11.52-.08 1.6-.65 1.83-1.28.22-.62.22-1.16.15-1.27-.06-.12-.24-.19-.51-.33z" fill="#25d366"/>
                </svg>
            </a>
        </>
    );
}
