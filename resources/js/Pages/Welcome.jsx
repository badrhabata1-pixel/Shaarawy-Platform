import React, { Component, useState, useRef, useEffect } from 'react';
import { Head, Link } from '@inertiajs/react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import PopOutCard from '@/Components/PopOutCard';

gsap.registerPlugin(ScrollTrigger);

/* ── Brand palette ───────────────────────────────────────────── */
const C = {
    gold:   '#2fbcd4',
    amber:  '#8dc63f',
    dark:   '#050b15',
    mid:    '#0c1929',
    navy:   '#1b3a60',
    stone:  '#e2e8f0',
    white:  '#eef2f7',
};

/* ── Static data ─────────────────────────────────────────────── */
const FEATURES = [
    { n:'01', title:'شرح بسيط ومفهوم',              text:'الأستاذ بيشرح بأسلوب سهل وممتع — قواعد اللغة العربية هتبقى سهلة في إيدك',
        icon:(<path d="M21 11.5a8.38 8.38 0 0 1-.9 3.8 8.5 8.5 0 0 1-7.6 4.7 8.38 8.38 0 0 1-3.8-.9L3 21l1.9-5.7a8.38 8.38 0 0 1-.9-3.8 8.5 8.5 0 0 1 4.7-7.6 8.38 8.38 0 0 1 3.8-.9h.5a8.48 8.48 0 0 1 8 8v.5z"/>) },
    { n:'02', title:'فيديوهات ورسومات توضيحية',     text:'تعلّم بصرياً بخرائط ذهنية وأمثلة وشواهد حية وشرح مرئي عالي الجودة',
        icon:(<><circle cx="12" cy="12" r="10"/><polygon points="10 8 16 12 10 16 10 8"/></>) },
    { n:'03', title:'أسئلة تركيز وتقييم فوري',      text:'بعد كل فيديو فيه أسئلة تركيز بتقيس فهمك الفعلي — مش حفظ، ده فهم حقيقي',
        icon:(<><circle cx="12" cy="12" r="10"/><circle cx="12" cy="12" r="6"/><circle cx="12" cy="12" r="2"/></>) },
    { n:'04', title:'الأستاذ بيتابعك بالتفصيل',     text:'من خلال نتايج أسئلة التركيز الأستاذ بيشوف مين فاهم ومين محتاج مساعدة — متابعة حقيقية لكل طالب لوحده',
        icon:(<><path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"/><circle cx="12" cy="12" r="3"/></>) },
    { n:'05', title:'اختبارات بنظام الوزارة',        text:'نماذج نحو وبلاغة وأدب بنفس أسلوب الوزارة عشان تتعود على الجو الفعلي وتدخل الامتحان بثقة',
        icon:(<><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/><polyline points="14 2 14 8 20 8"/><line x1="16" y1="13" x2="8" y2="13"/><line x1="16" y1="17" x2="8" y2="17"/></>) },
    { n:'06', title:'لوحة تحكم سهلة للطالب',        text:'كل حاجة في مكانها — محاضراتك، تقدمك، درجاتك، ومدفوعاتك في شاشة واحدة مرتبة وواضحة',
        icon:(<><rect x="3" y="3" width="7" height="7"/><rect x="14" y="3" width="7" height="7"/><rect x="14" y="14" width="7" height="7"/><rect x="3" y="14" width="7" height="7"/></>) },
    { n:'07', title:'نظام إشعارات ذكي',             text:'هتتنبه على الطبطبة — محاضرة جديدة، نتيجة اختبار، أو رسالة من الأستاذ — مش هتفوتك أي حاجة',
        icon:(<><path d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9"/><path d="M13.73 21a2 2 0 0 1-3.46 0"/></>) },
    { n:'08', title:'أمان وحماية عالية للبيانات',   text:'المنصة محمية بنظام تشفير متقدم — بياناتك وسجل مدفوعاتك في أمان تام ومش بيتشاف إلا منك',
        icon:(<><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/><path d="m9 12 2 2 4-4"/></>) },
];

/* ألوان متدرّجة لشارات الأرقام وزخرفة البلاطات — بالتبادل */
const TILE_ACCENTS = ['#2fbcd4', '#8dc63f', '#1b3a60', '#204080', '#009688'];

/* COURSES: populated dynamically from DB (passed as Inertia prop) */

/* فروع اللغة العربية — بيانات البطاقات المتمددة */
const BRANCHES = [
    {
        title: 'النحو',
        icon: (<><line x1="8" y1="6" x2="21" y2="6"/><line x1="8" y1="12" x2="21" y2="12"/><line x1="8" y1="18" x2="21" y2="18"/><line x1="3" y1="6" x2="3.01" y2="6"/><line x1="3" y1="12" x2="3.01" y2="12"/><line x1="3" y1="18" x2="3.01" y2="18"/></>),
        desc: 'النحو هو العلم اللي بيضبط أواخر الكلمات ويحدد موقعها الإعرابي في الجملة — هو العمود الفقري للغة العربية اللي بيحفظها من اللحن والخطأ.',
        points: [
            'إعراب الجملة الاسمية والفعلية',
            'حالات الرفع والنصب والجر والجزم',
            'المعارف والنكرات وأنواعهما',
            'الأفعال الناقصة والحروف الناسخة',
            'أدوات الشرط والاستثناء',
            'التمييز والحال وأنواعهما',
        ],
    },
    {
        title: 'البلاغة',
        icon: (<polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"/>),
        desc: 'البلاغة فن إيصال المعنى بأجمل صورة وأبلغ أسلوب — بندرس فيها علم البيان والمعاني والبديع عشان نفهم سر جمال النص العربي.',
        points: [
            'علم البيان: التشبيه والاستعارة والكناية',
            'علم المعاني: الإيجاز والإطناب',
            'أساليب الخبر والإنشاء',
            'علم البديع: المحسنات اللفظية والمعنوية',
            'التحليل البلاغي للنصوص الأدبية',
            'التطبيق على نماذج امتحانات الوزارة',
        ],
    },
    {
        title: 'الأدب',
        icon: (<><path d="M2 3h6a4 4 0 0 1 4 4v14a3 3 0 0 0-3-3H2z"/><path d="M22 3h-6a4 4 0 0 0-4 4v14a3 3 0 0 1 3-3h7z"/></>),
        desc: 'الأدب مرآة الحياة العربية عبر العصور — بندرس فيه أهم النصوص وأعلام كل عصر أدبي من الجاهلية لحد العصر الحديث.',
        points: [
            'العصور الأدبية: الجاهلي، الإسلامي، الأموي، العباسي، الحديث',
            'أعلام الأدب وأشهر أعمالهم',
            'خصائص كل عصر أدبي وسماته',
            'فنون النثر: المقالة والقصة والرواية',
            'تحليل النصوص الأدبية ومناسباتها',
        ],
    },
    {
        title: 'القراءة',
        icon: (<><path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"/><circle cx="12" cy="12" r="3"/></>),
        desc: 'القراءة مهارة أساسية بتنمّي حصيلتك اللغوية وفهمك للنصوص — بندرب فيها على القراءة الواعية والاستيعاب والتحليل لأي نص جديد.',
        points: [
            'مهارات الفهم القرائي',
            'استخراج الأفكار الرئيسية والفرعية',
            'التحليل والاستنتاج من النص',
            'الثروة اللفظية ومعاني المفردات',
            'نماذج قراءة متنوعة: علمية وأدبية واجتماعية',
        ],
    },
    {
        title: 'الشعر',
        icon: (<><path d="M20.24 12.24a6 6 0 0 0-8.49-8.49L5 10.5V19h8.5z"/><line x1="16" y1="8" x2="2" y2="22"/><line x1="17.5" y1="15" x2="9" y2="15"/></>),
        desc: 'الشعر ديوان العرب وأصدق تعبير عن وجدانهم — بندرس فيه أشهر القصائد وأعاريض الخليل وأغراض الشعر العربي عبر العصور.',
        points: [
            'بحور الشعر وعلم العروض',
            'أغراض الشعر: مدح، هجاء، رثاء، غزل، حكمة',
            'شرح وتحليل أشهر القصائد',
            'الصورة الشعرية والخيال الأدبي',
            'شعراء بارزون عبر العصور',
        ],
    },
];

/* FILTERS: built dynamically inside the component from live units */

const PORTALS = [
    { icon:'📚', title:'تنظيم الدروس والوحدات',         text:'المنهج كله مرتب قدامك — نحو وبلاغة وأدب ونصوص في مكان واحد. مش هتضيع في الكتاب تاني' },
    { icon:'🎬', title:'دروس بالفيديو والصور التوضيحية', text:'مش هتحفظ القاعدة، هتفهمها — أمثلة وشواهد حية بتخليك حاسس باللغة مش بس عارفها'    },
    { icon:'✍️', title:'تطبيقات وتمارين تفاعلية',       text:'ذاكر وجرّب دماغك — أسئلة بعد كل درس عشان المعلومة تتثبّت وتلاقي نفسك جاهز لأي سؤال'  },
];

/* ── History particles config ────────────────────────────────── */
const PARTICLES = [
    { sym:'ض',   l:5,  d:14, dl:0,   s:13 },
    { sym:'✦',   l:18, d:17, dl:1,   s:10 },
    { sym:'ع',   l:32, d:12, dl:4,   s:12 },
    { sym:'◆',   l:47, d:18, dl:1.5, s:9  },
    { sym:'ب',   l:61, d:13, dl:5,   s:12 },
    { sym:'❖',   l:74, d:16, dl:3.5, s:11 },
    { sym:'م',   l:86, d:14, dl:3.8, s:13 },
    { sym:'✺',   l:93, d:9,  dl:5.5, s:10 },
];

/* ── Global styles ───────────────────────────────────────────── */
function PageStyles() {
    return (
        <style>{`
            @import url('https://fonts.googleapis.com/css2?family=Cinzel:wght@400;700&family=Cairo:wght@400;600;700;800;900&family=Rakkas&display=swap');
            *, *::before, *::after { box-sizing: border-box; }
            h1, h2, h3 { font-family: 'Rakkas', serif !important; letter-spacing: .04em; }
            ::-webkit-scrollbar { width:6px; }
            ::-webkit-scrollbar-track { background:#050b15; }
            ::-webkit-scrollbar-thumb { background:rgba(47,188,212,.35); border-radius:3px; }

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
            @keyframes badgeShimmer  { 0%,100%{box-shadow:0 6px 24px rgba(0,0,0,.35),0 0 0 1px rgba(47,188,212,.14),inset 0 1px 0 rgba(47,188,212,.2)} 50%{box-shadow:0 8px 32px rgba(0,0,0,.45),0 0 16px rgba(47,188,212,.18),0 0 0 1px rgba(47,188,212,.22),inset 0 1px 0 rgba(47,188,212,.28)} }

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

            /* أسباب الاختيار — رقم 1 يمين، رقم 2 شمال، تحت بعض، وزخارف خفيفة تنوّر عند المرور */
            @keyframes tlFromRight { from{opacity:0;transform:translateX(80px)} to{opacity:1;transform:translateX(0)} }
            @keyframes tlFromLeft  { from{opacity:0;transform:translateX(-80px)} to{opacity:1;transform:translateX(0)} }
            .tl-wrap        { position:relative; max-width:900px; margin:0 auto; direction:ltr; }
            .tl-item        { position:relative; width:47%; margin-bottom:36px; opacity:0;
                              display:flex; align-items:center; gap:14px; }
            .tl-item.right  { margin-left:53%; animation:tlFromRight .7s cubic-bezier(.22,1,.36,1) forwards; }
            .tl-item.left   { margin-left:0;    animation:tlFromLeft  .7s cubic-bezier(.22,1,.36,1) forwards; }
            @media(max-width:768px){
                .tl-item,.tl-item.right,.tl-item.left { width:100%; margin-left:0 !important;
                    animation:tlFromRight .7s cubic-bezier(.22,1,.36,1) forwards !important; }
            }
            .feat-num-outside { flex-shrink:0; font-family:'Rakkas',serif; font-size:40px; line-height:1;
                                 user-select:none; opacity:.4; transition:opacity .4s ease, filter .4s ease; }
            .tl-item:hover .feat-num-outside { opacity:1; filter:drop-shadow(0 0 8px currentColor); }

            /* بطاقة على طراز تذهيب المخطوطات — إطار مزدوج، شمسة نجمية، زخارف أركان رفيعة */
            .feat-card  { position:relative; direction:rtl; cursor:default;
                          transition:transform .45s cubic-bezier(.22,1,.36,1); }
            .feat-card:hover { transform:translateY(-8px); }
            .feat-card-inner { position:relative; overflow:hidden; border-radius:16px; padding:40px 26px 26px;
                                border:1px solid var(--frame-c, rgba(47,188,212,.4)); }
            .feat-card-inner::before {
                content:''; position:absolute; inset:7px; border-radius:9px;
                border:1px solid var(--frame-c, rgba(47,188,212,.4)); opacity:.55;
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
            }

            /* ══ MOBILE ══ */
            @media(max-width:768px){
                .port-grid      { grid-template-columns:1fr; gap:20px; }
                .about-grid     { grid-template-columns:1fr; }
                .foot-grid      { grid-template-columns:1fr 1fr; }
                .nav-links      { display:none; }
                .hero-right     { flex:0 0 100%; max-width:100%; }
                .hero-section   { flex-direction:column-reverse !important; padding-top:0 !important; padding-left:20px !important; padding-right:20px !important; padding-bottom:40px !important; gap:0 !important; min-height:auto !important; }
                .teacher-hero-wrap { flex:0 0 100% !important; max-width:100% !important; min-height:55vw !important; max-height:70vw !important; height:65vw !important; overflow:hidden !important; }
                .teacher-hero-wrap .th-deco:nth-child(n+4) { display:none !important; }
                .teacher-hero-img  { max-width:72vw !important; }
                .about-full-grid   { grid-template-columns:1fr !important; min-height:auto !important; max-height:none !important; }
                .about-photo-side  { height:62vw !important; min-height:220px !important; }
                .about-text-side   { padding:clamp(28px,6vw,48px) clamp(20px,5vw,40px) !important; }
                .ts-rank-num       { display:none !important; }
                .hero-stats        { gap:20px !important; flex-wrap:wrap; }
                .port-grid > div   { max-width:100%; margin:0 auto; width:100%; }
                .hero-welcome-img  { max-width:100% !important; margin-bottom:20px !important; }
                .course-scroll > div { flex:0 0 88vw !important; max-width:88vw !important; }
                .branches-row      { height:auto !important; flex-direction:column !important; }
                .branches-row .branch-collapsed { min-width:0 !important; flex:0 0 auto !important; height:64px !important; }
                .branches-row .branch-active    { min-width:0 !important; flex:0 0 auto !important; height:520px !important; }
                .about-text-side .about-stats-grid { grid-template-columns:repeat(3,1fr) !important; }
                .foot-social-grid { grid-template-columns:1fr 1fr !important; }
            }

            /* ══ SMALL MOBILE ══ */
            @media(max-width:480px){
                .foot-grid  { grid-template-columns:1fr; }
                .foot-social-grid { grid-template-columns:1fr !important; }
                .nav-ctas   { gap:6px !important; }
                .nav-ctas a,
                .nav-ctas button { padding:8px 12px !important; font-size:12px !important; }
                .hero-right p  { font-size:14px !important; }
                .teacher-hero-wrap { height:70vw !important; max-height:70vw !important; }
                .hero-stats > div { flex:1 0 auto; min-width:80px; }
            }

            .course-scroll::-webkit-scrollbar { height:4px; }
            .course-scroll::-webkit-scrollbar-thumb { background:rgba(47,188,212,.3); border-radius:2px; }
        `}</style>
    );
}

/* ── Animated history background ────────────────────────────── */
function HistoryBackground({ dark = true }) {
    return (
        <div style={{ position:'fixed', inset:0, zIndex:0, overflow:'hidden', pointerEvents:'none' }}>

            {/* Color gradient orbs — navy in dark mode, warm gold-tinted in light mode */}
            <div style={{ position:'absolute', width:900, height:900, right:'-10%', top:'0%',    borderRadius:'50%', background: dark ? 'radial-gradient(circle, rgba(27,58,96,.9) 0%, transparent 70%)'  : 'radial-gradient(circle, rgba(47,188,212,.16) 0%, transparent 70%)', animation:'orbPulse1 18s ease-in-out infinite' }}/>
            <div style={{ position:'absolute', width:700, height:700, left:'0%',   bottom:'5%',  borderRadius:'50%', background: dark ? 'radial-gradient(circle, rgba(141,198,63,.06) 0%, transparent 70%)' : 'radial-gradient(circle, rgba(141,198,63,.10) 0%, transparent 70%)', animation:'orbPulse2 22s ease-in-out infinite' }}/>
            <div style={{ position:'absolute', width:500, height:500, left:'38%',  top:'30%',    borderRadius:'50%', background: dark ? 'radial-gradient(circle, rgba(47,188,212,.07) 0%, transparent 70%)' : 'radial-gradient(circle, rgba(47,188,212,.12) 0%, transparent 70%)', animation:'orbPulse3 26s ease-in-out infinite' }}/>
            <div style={{ position:'absolute', width:400, height:400, right:'20%', bottom:'20%', borderRadius:'50%', background: dark ? 'radial-gradient(circle, rgba(12,25,41,.8) 0%, transparent 70%)'  : 'radial-gradient(circle, rgba(226,232,240,.4) 0%, transparent 70%)' }}/>

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
                    fontFamily: "'Rakkas', serif",
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
    const active = hovered || featured;
    return (
        <div
            onMouseEnter={() => setHovered(true)}
            onMouseLeave={() => setHovered(false)}
            style={{
                position:'relative', borderRadius:22, overflow:'hidden',
                padding: featured ? '32px 28px 30px' : '26px 24px 26px',
                background: dark
                    ? (active ? 'rgba(12,20,42,.98)' : 'rgba(7,13,28,.82)')
                    : (active ? 'rgba(255,252,240,.97)' : 'rgba(255,248,230,.78)'),
                border:`1.5px solid ${active ? (featured ? 'rgba(141,198,63,.55)' : 'rgba(47,188,212,.5)') : (dark ? 'rgba(47,188,212,.13)' : 'rgba(47,188,212,.28)')}`,
                boxShadow: active
                    ? `0 20px 60px rgba(0,0,0,${dark?'.55':'.14'}), 0 0 0 1px ${featured ? 'rgba(141,198,63,.2)' : 'rgba(47,188,212,.18)'}, inset 0 1px 0 rgba(47,188,212,.18)`
                    : `0 4px 20px rgba(0,0,0,${dark?'.3':'.06'})`,
                transform: active ? 'translateY(-6px)' : 'translateY(0)',
                backdropFilter:'blur(20px)',
                transition:'all 0.45s cubic-bezier(.22,1,.36,1)',
                cursor:'default',
            }}
        >
            {/* Featured amber glow */}
            {featured && <div style={{ position:'absolute', inset:0, background:'radial-gradient(ellipse at center bottom, rgba(141,198,63,.07) 0%, transparent 65%)', pointerEvents:'none' }}/>}

            {/* Top shimmer */}
            <div style={{ position:'absolute', top:0, left:'12%', right:'12%', height:1.5, background:`linear-gradient(90deg,transparent,${featured ? 'rgba(141,198,63,.6)' : 'rgba(47,188,212,.45)'},transparent)`, opacity: active ? 1 : 0.3, transition:'opacity 0.4s ease' }}/>

            {/* Number badge */}
            <div style={{
                display:'inline-flex', alignItems:'center', justifyContent:'center',
                width:38, height:22, borderRadius:99, marginBottom:18,
                background: dark ? 'rgba(47,188,212,.08)' : 'rgba(47,188,212,.12)',
                border:`1px solid ${featured ? 'rgba(141,198,63,.4)' : 'rgba(47,188,212,.3)'}`,
                fontSize:9, fontFamily:'Cinzel,serif', letterSpacing:'.2em',
                color: featured ? C.amber : C.gold,
            }}>{num}</div>

            {/* Icon */}
            <div style={{
                width:52, height:52, borderRadius:14, marginBottom:18,
                background: dark
                    ? (active ? `rgba(${featured?'244,124,32':'201,161,74'},.1)` : 'rgba(47,188,212,.05)')
                    : (active ? `rgba(${featured?'244,124,32':'201,161,74'},.14)` : 'rgba(47,188,212,.08)'),
                border:`1.5px solid ${active ? (featured ? 'rgba(141,198,63,.4)' : 'rgba(47,188,212,.38)') : 'rgba(47,188,212,.16)'}`,
                display:'flex', alignItems:'center', justifyContent:'center',
                transition:'all 0.4s ease',
                boxShadow: active ? `0 0 18px rgba(${featured?'244,124,32':'201,161,74'},.18)` : 'none',
            }}>
                <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke={featured ? C.amber : C.gold} strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
                    <path d={icon}/>
                </svg>
            </div>

            {/* Name */}
            <div style={{
                fontSize: featured ? 22 : 18, fontFamily:'Rakkas,serif',
                color: active ? (featured ? C.amber : C.gold) : (dark ? 'rgba(226,232,240,.75)' : C.navy),
                marginBottom:10, letterSpacing:'.04em',
                transition:'color 0.3s ease',
                textShadow: active ? `0 0 20px rgba(${featured?'244,124,32':'201,161,74'},.3)` : 'none',
            }}>{name}</div>

            {/* Divider */}
            <div style={{ height:1, width: active ? 44 : 22, background:`linear-gradient(90deg,${featured?C.amber:C.gold},transparent)`, marginBottom:12, transition:'width 0.4s ease' }}/>

            {/* Address */}
            <div style={{ fontSize:13, fontWeight:700, color: dark ? 'rgba(226,232,240,.75)' : C.navy, marginBottom:5, lineHeight:1.55 }}>{address}</div>
            <div style={{ fontSize:12, color: dark ? 'rgba(226,232,240,.44)' : 'rgba(27,58,96,.55)', lineHeight:1.8 }}>{detail}</div>

            {/* Bottom accent line */}
            <div style={{ position:'absolute', bottom:0, left:0, right:0, height:3, borderRadius:'0 0 22px 22px', background: active ? `linear-gradient(90deg,transparent,${featured?C.amber:C.gold},transparent)` : 'transparent', transition:'background 0.4s ease', opacity:.7 }}/>
        </div>
    );
}

/* ═══════════════════════════════════════════════════════════════
   SOCIAL CARD — footer platform link
═══════════════════════════════════════════════════════════════ */
function SocialCard({ href, label, handle, glow, borderHover, icon, dark = true }) {
    const [hovered, setHovered] = useState(false);

    const cardBg     = dark
        ? (hovered ? 'rgba(14,22,42,.95)' : 'rgba(8,14,28,.7)')
        : (hovered ? 'rgba(27,58,96,.05)' : '#ffffff');
    const cardBorder = hovered ? borderHover : (dark ? 'rgba(47,188,212,.14)' : 'rgba(27,58,96,.1)');
    const cardShadow = hovered
        ? `0 0 0 1px ${borderHover}, 0 16px 48px rgba(0,0,0,${dark?'.55':'.12'}), 0 0 40px ${glow}`
        : (dark ? '0 4px 20px rgba(0,0,0,.3)' : '0 2px 16px rgba(27,58,96,.07)');
    const labelColor = dark
        ? (hovered ? '#2fbcd4' : 'rgba(226,232,240,.65)')
        : (hovered ? '#8dc63f' : 'rgba(27,58,96,.7)');
    const handleColor = dark ? 'rgba(226,232,240,.35)' : 'rgba(27,58,96,.38)';
    const ctaColor   = hovered ? '#8dc63f' : (dark ? 'rgba(47,188,212,.35)' : 'rgba(27,58,96,.3)');

    return (
        <a
            href={href}
            target="_blank"
            rel="noopener noreferrer"
            onMouseEnter={() => setHovered(true)}
            onMouseLeave={() => setHovered(false)}
            style={{
                display:'flex', flexDirection:'column', alignItems:'center', gap:14,
                padding:'28px 20px 24px',
                borderRadius:20,
                background: cardBg,
                border:`1px solid ${cardBorder}`,
                boxShadow: cardShadow,
                textDecoration:'none',
                transform: hovered ? 'translateY(-6px)' : 'translateY(0)',
                transition:'all 0.4s cubic-bezier(.22,1,.36,1)',
                cursor:'pointer', position:'relative', overflow:'hidden',
                backdropFilter:'blur(20px)',
            }}
        >
            {/* Glow blob inside */}
            <div style={{
                position:'absolute', bottom:-30, left:'50%', transform:'translateX(-50%)',
                width:160, height:80,
                background:`radial-gradient(ellipse, ${glow} 0%, transparent 70%)`,
                filter:'blur(18px)',
                opacity: hovered ? 1 : 0,
                transition:'opacity 0.4s ease',
                pointerEvents:'none',
            }}/>
            {/* Top shimmer line */}
            <div style={{
                position:'absolute', top:0, left:'15%', right:'15%', height:1,
                background:`linear-gradient(90deg,transparent,${borderHover},transparent)`,
                opacity: hovered ? 0.9 : 0.2,
                transition:'opacity 0.4s ease',
            }}/>

            {/* Icon circle */}
            <div style={{
                width:64, height:64, borderRadius:'50%',
                background: hovered ? `rgba(47,188,212,.12)` : (dark ? 'rgba(47,188,212,.06)' : 'rgba(27,58,96,.05)'),
                border:`1.5px solid ${hovered ? 'rgba(47,188,212,.4)' : (dark ? 'rgba(47,188,212,.18)' : 'rgba(27,58,96,.15)')}`,
                display:'flex', alignItems:'center', justifyContent:'center',
                color: hovered ? '#8dc63f' : '#2fbcd4',
                transition:'all 0.4s ease',
                boxShadow: hovered ? `0 0 20px ${glow}` : 'none',
                position:'relative', zIndex:1,
            }}>
                {icon}
            </div>

            {/* Label */}
            <div style={{ textAlign:'center', position:'relative', zIndex:1 }}>
                <div style={{
                    fontSize:17, fontFamily:'Rakkas,serif',
                    color: labelColor,
                    letterSpacing:'.06em', marginBottom:4,
                    transition:'color 0.3s ease',
                }}>{label}</div>
                <div style={{
                    fontSize:11, color: handleColor,
                    letterSpacing:'.04em', fontFamily:'Cinzel,serif',
                    direction:'ltr',
                }}>{handle}</div>
            </div>

            {/* CTA */}
            <div style={{
                fontSize:11, letterSpacing:'.14em',
                color: ctaColor,
                fontFamily:'Cinzel,serif',
                transition:'color 0.3s ease',
                position:'relative', zIndex:1,
            }}>
                {hovered ? 'VISIT NOW ↗' : 'FOLLOW US'}
            </div>
        </a>
    );
}

/* ═══════════════════════════════════════════════════════════════
   HISTORY FLOATING ICONS — decorative background elements
═══════════════════════════════════════════════════════════════ */
const HIST_ICONS = [
    { x:'4%',  y:'8%',  rot:-14, sz:58, d:'4.2s', dl:'0s',   type:'book'    },
    { x:'82%', y:'6%',  rot:10,  sz:48, d:'3.7s', dl:'0.6s', type:'scroll'  },
    { x:'2%',  y:'44%', rot:-6,  sz:54, d:'5.0s', dl:'1.1s', type:'star'    },
    { x:'89%', y:'42%', rot:12,  sz:46, d:'3.9s', dl:'0.4s', type:'inkwell' },
    { x:'72%', y:'74%', rot:-9,  sz:50, d:'4.6s', dl:'1.6s', type:'book'    },
    { x:'10%', y:'72%', rot:7,   sz:44, d:'4.4s', dl:'0.9s', type:'star'    },
    { x:'44%', y:'3%',  rot:0,   sz:40, d:'3.4s', dl:'1.9s', type:'quill'   },
    { x:'90%', y:'22%', rot:-16, sz:40, d:'5.2s', dl:'0.2s', type:'book'    },
    { x:'54%', y:'80%', rot:5,   sz:42, d:'4.0s', dl:'1.3s', type:'scroll'  },
    { x:'22%', y:'12%', rot:8,   sz:48, d:'4.8s', dl:'0.7s', type:'inkwell' },
    { x:'62%', y:'18%', rot:-12, sz:40, d:'3.5s', dl:'1.4s', type:'star'    },
    { x:'18%', y:'56%', rot:15,  sz:44, d:'4.1s', dl:'0.3s', type:'quill'   },
    { x:'76%', y:'58%', rot:-4,  sz:48, d:'4.7s', dl:'1.0s', type:'scroll'  },
    { x:'36%', y:'68%', rot:10,  sz:44, d:'3.8s', dl:'1.7s', type:'inkwell' },
    { x:'93%', y:'62%', rot:-8,  sz:40, d:'5.3s', dl:'0.5s', type:'star'    },
    { x:'6%',  y:'88%', rot:5,   sz:38, d:'4.3s', dl:'1.2s', type:'book'    },
    { x:'48%', y:'54%', rot:-3,  sz:36, d:'6.0s', dl:'2.1s', type:'quill'   },
    { x:'30%', y:'30%', rot:18,  sz:42, d:'4.5s', dl:'0.8s', type:'scroll'  },
    { x:'64%', y:'88%', rot:-11, sz:46, d:'3.6s', dl:'1.5s', type:'star'    },
    { x:'84%', y:'84%', rot:6,   sz:36, d:'5.5s', dl:'0.4s', type:'book'    },
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
    const imgRef  = useRef();
    const mState  = useRef({ tx:0, ty:0, cx:0, cy:0 });
    const raf     = useRef();

    /* Smooth mouse parallax */
    useEffect(() => {
        const onMove = (e) => {
            if (!wrapRef.current) return;
            const r = wrapRef.current.getBoundingClientRect();
            mState.current.tx = ((e.clientX - r.left) / r.width  - 0.5) * 2;
            mState.current.ty = ((e.clientY - r.top)  / r.height - 0.5) * 2;
        };
        window.addEventListener('mousemove', onMove, { passive: true });
        const tick = () => {
            const s = mState.current;
            s.cx += (s.tx - s.cx) * 0.05;
            s.cy += (s.ty - s.cy) * 0.05;
            if (imgRef.current) {
                imgRef.current.style.transform = `translateX(${s.cx * -11}px) translateY(${s.cy * -7}px)`;
            }
            raf.current = requestAnimationFrame(tick);
        };
        raf.current = requestAnimationFrame(tick);
        return () => { window.removeEventListener('mousemove', onMove); cancelAnimationFrame(raf.current); };
    }, []);

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
            minHeight:'80vh', flexShrink:0,
        }}>
            {/* Ambient glow */}
            <div className="th-deco" style={{
                position:'absolute', top:'50%', left:'50%', transform:'translate(-50%,-50%)',
                width:560, height:660,
                background:'radial-gradient(ellipse at center, rgba(141,198,63,.26) 0%, rgba(47,188,212,.12) 38%, transparent 68%)',
                filter:'blur(40px)',
                animation:'teacherGlow 4.5s ease-in-out infinite',
                pointerEvents:'none',
            }}/>

            {/* Rotating light rays */}
            <div className="th-deco" style={{
                position:'absolute', top:'50%', left:'50%',
                width:780, height:780, marginLeft:-390, marginTop:-390,
                background:'conic-gradient(from 0deg, transparent 0deg, rgba(47,188,212,.045) 5deg, transparent 10deg, transparent 22deg, rgba(141,198,63,.03) 27deg, transparent 32deg, transparent 44deg, rgba(47,188,212,.04) 49deg, transparent 54deg, transparent 66deg, rgba(47,188,212,.03) 71deg, transparent 76deg, transparent 88deg, rgba(141,198,63,.04) 93deg, transparent 98deg, transparent 110deg, rgba(47,188,212,.03) 115deg, transparent 120deg)',
                animation:'rayRotate 48s linear infinite',
                pointerEvents:'none',
                opacity: dark ? 1 : 0.4,
            }}/>

            {/* Decorative arch */}
            <svg className="th-deco" viewBox="0 0 400 400" fill="none"
                style={{ position:'absolute', top:'-4%', left:'50%', transform:'translateX(-50%)', width:560, height:560, pointerEvents:'none', opacity: dark ? 0.65 : 0.38 }}>
                <defs>
                    <linearGradient id="ag1" x1="0%" y1="0%" x2="100%" y2="100%">
                        <stop offset="0%"   stopColor="#2fbcd4" stopOpacity=".9"/>
                        <stop offset="50%"  stopColor="#8dc63f" stopOpacity=".6"/>
                        <stop offset="100%" stopColor="#2fbcd4" stopOpacity=".2"/>
                    </linearGradient>
                </defs>
                {/* Outer arc */}
                <path d="M 45 398 A 158 158 0 0 1 355 398" stroke="url(#ag1)" strokeWidth="1.8" fill="none"/>
                {/* Inner arc */}
                <path d="M 68 398 A 135 135 0 0 1 332 398" stroke="#2fbcd4" strokeWidth=".7" fill="none" opacity=".35"/>
                {/* Tick marks */}
                {Array.from({length:15}, (_,i) => {
                    const a  = Math.PI + (i / 14) * Math.PI;
                    const cx = 200, cy = 398;
                    return <line key={i}
                        x1={cx + Math.cos(a)*156} y1={cy + Math.sin(a)*156}
                        x2={cx + Math.cos(a)*164} y2={cy + Math.sin(a)*164}
                        stroke="#2fbcd4" strokeWidth="1.1" opacity=".5"/>;
                })}
                {/* Crown ornament */}
                <circle cx="200" cy="240" r="5"  fill="#2fbcd4" opacity=".55"/>
                <circle cx="200" cy="240" r="10" stroke="#2fbcd4" strokeWidth=".8" fill="none" opacity=".25"/>
                <line x1="176" y1="240" x2="224" y2="240" stroke="#2fbcd4" strokeWidth=".7" opacity=".25"/>
                {/* Side pillars */}
                <line x1="45"  y1="280" x2="45"  y2="398" stroke="url(#ag1)" strokeWidth="2.2" opacity=".55"/>
                <line x1="355" y1="280" x2="355" y2="398" stroke="url(#ag1)" strokeWidth="2.2" opacity=".55"/>
                {/* Pillar capitals */}
                <rect x="35"  y="276" width="20" height="5" rx="1" fill="#2fbcd4" opacity=".45"/>
                <rect x="345" y="276" width="20" height="5" rx="1" fill="#2fbcd4" opacity=".45"/>
            </svg>

            {/* Orbit particles */}
            {ORBIT_PARTICLES.map(({ sym, x, y, d, dl, sz, amber }, i) => (
                <div key={i} className="th-deco" style={{
                    position:'absolute', left:x, top:y,
                    fontSize:sz, color: amber ? '#8dc63f' : '#2fbcd4',
                    opacity: dark ? 0.42 : 0.28,
                    fontFamily:'Cinzel,serif',
                    animation:`orbitBob ${d} ${dl} ease-in-out infinite`,
                    pointerEvents:'none',
                    textShadow: amber ? '0 0 10px rgba(141,198,63,.5)' : '0 0 10px rgba(47,188,212,.45)',
                }}>{sym}</div>
            ))}

            {/* History floating icons */}
            {HIST_ICONS.map(({ x, y, rot, sz, d, dl, type }, i) => (
                <div key={`hi-${i}`} className="th-deco" style={{
                    position:'absolute', left:x, top:y,
                    opacity: dark ? 0.55 : 0.45,
                    animation:`orbitBob ${d} ${dl} ease-in-out infinite`,
                    pointerEvents:'none',
                    transform:`rotate(${rot}deg)`,
                    filter: dark
                        ? 'drop-shadow(0 0 6px rgba(47,188,212,.35))'
                        : 'drop-shadow(0 0 4px rgba(138,104,32,.25))',
                }}>
                    <HistIcon type={type} sz={sz} color={dark ? '#2fbcd4' : '#8a6820'}/>
                </div>
            ))}

            {/* Main image + float wrapper — framed portrait medallion */}
            <div className="th-img" style={{
                position:'relative', zIndex:5, width:'100%',
                display:'flex', flexDirection:'column', justifyContent:'center', alignItems:'center', gap:20,
                animation:'teacherFloat 5.5s ease-in-out infinite',
            }}>
                <div ref={imgRef} className="teacher-hero-img" style={{ width:'100%', maxWidth:600, position:'relative' }}>
                    {/* Thin ring hugging the medallion edge */}
                    <div style={{
                        position:'absolute', inset:'6%', borderRadius:'50%',
                        border:'1px solid rgba(47,188,212,.4)',
                        boxShadow:'0 0 0 1px rgba(141,198,63,.08), inset 0 0 40px rgba(47,188,212,.06)',
                        pointerEvents:'none', zIndex:1,
                    }}/>

                    {/* مدالية "لغة الضاد" — هوية تصميمية بديلة عن الصورة الشخصية */}
                    <div style={{
                        width:'100%', aspectRatio:'1', borderRadius:'50%', position:'relative', zIndex:2,
                        display:'flex', alignItems:'center', justifyContent:'center', overflow:'hidden',
                        background: dark
                            ? 'radial-gradient(circle at 50% 38%, #16304f 0%, #0c1929 60%, #050b15 100%)'
                            : 'radial-gradient(circle at 50% 38%, #eaf7fa 0%, #dcecf3 60%, #cfe3ee 100%)',
                        filter: dark
                            ? 'drop-shadow(0 34px 70px rgba(0,0,0,.6)) drop-shadow(0 0 46px rgba(141,198,63,.22))'
                            : 'drop-shadow(0 24px 50px rgba(0,0,0,.18)) drop-shadow(0 0 34px rgba(141,198,63,.14))',
                    }}>
                        {/* نجمة ثمانية خلفية */}
                        <svg width="72%" height="72%" viewBox="0 0 100 100" style={{ position:'absolute', opacity:.14 }}>
                            <rect x="18" y="18" width="64" height="64" fill="none" stroke="#2fbcd4" strokeWidth="1.2"/>
                            <rect x="18" y="18" width="64" height="64" transform="rotate(45 50 50)" fill="none" stroke="#2fbcd4" strokeWidth="1.2"/>
                        </svg>
                        {/* حرف الضاد */}
                        <span style={{
                            fontFamily:"'Rakkas',serif", fontSize:'clamp(140px,20vw,220px)', lineHeight:1,
                            background:'linear-gradient(160deg,#2fbcd4,#8dc63f)',
                            WebkitBackgroundClip:'text', WebkitTextFillColor:'transparent', backgroundClip:'text',
                            filter:'drop-shadow(0 8px 30px rgba(47,188,212,.35))',
                            position:'relative', zIndex:1,
                        }}>ض</span>
                        {/* مسّة قلم أسفل الحرف */}
                        <svg width="46%" height="40" viewBox="0 0 200 40" style={{ position:'absolute', bottom:'18%', opacity:.85 }}>
                            <path d="M10,30 C 60,5 120,5 190,20" stroke="#8dc63f" strokeWidth="3" fill="none" strokeLinecap="round"/>
                            <circle cx="190" cy="20" r="4.5" fill="#8dc63f"/>
                        </svg>
                    </div>

                    {/* Ground glow */}
                    <div style={{
                        position:'absolute', bottom:'8%', left:'10%', right:'10%', height:55,
                        background:`radial-gradient(ellipse at center, rgba(47,188,212,.${dark?'22':'10'}) 0%, transparent 72%)`,
                        filter:'blur(10px)', pointerEvents:'none', zIndex:0,
                    }}/>
                </div>

                {/* Name badge — now flows directly under the medallion */}
                <div style={{ position:'relative', zIndex:6, whiteSpace:'nowrap' }}>
                    <div style={{
                        padding:'9px 24px', borderRadius:999,
                        background: dark ? 'rgba(5,10,24,.88)' : 'rgba(255,252,240,.90)',
                        border:`1px solid rgba(47,188,212,.6)`,
                        backdropFilter:'blur(18px)',
                        boxShadow:`0 6px 24px rgba(0,0,0,.35), 0 0 0 1px rgba(47,188,212,.14), inset 0 1px 0 rgba(47,188,212,.2)`,
                        display:'flex', alignItems:'center', gap:10,
                        animation:'badgeShimmer 3.5s ease-in-out infinite',
                    }}>
                        <span style={{ width:7, height:7, borderRadius:'50%', background:'#8dc63f', boxShadow:'0 0 9px rgba(141,198,63,.75)', display:'inline-block' }}/>
                        <span style={{ fontSize:13, fontFamily:'Rakkas,serif', color:'#2fbcd4', letterSpacing:'.07em' }}>الأستاذ محمد منصور</span>
                        <span style={{ width:7, height:7, borderRadius:'50%', background:'#8dc63f', boxShadow:'0 0 9px rgba(141,198,63,.75)', display:'inline-block' }}/>
                    </div>
                </div>
            </div>
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
            <span style={{ fontFamily:'Rakkas,serif', fontSize:'clamp(26px,4.5vw,42px)', color:C.gold, letterSpacing:'.18em' }}>
                منصور
            </span>
        </div>
    );
}

/* ── Theme toggle — ONE sliding switch, click anywhere to flip ── */
function ThemeToggle({ dark, setDark }) {
    return (
        <button
            onClick={() => setDark(!dark)}
            title={dark ? 'بدّل للوضع النهاري' : 'بدّل للوضع الليلي'}
            style={{
                width:64, height:34, borderRadius:999, position:'relative',
                border:'none', cursor:'pointer', padding:0, outline:'none', flexShrink:0,
                background: dark
                    ? 'linear-gradient(135deg,#0c1430 0%,#1b2a55 60%,#2c3f7a 100%)'
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
            <div role="img" aria-label="شعار منصة منصور" style={{
                width: 46, height: 46, borderRadius: '50%', flexShrink: 0,
                background: 'linear-gradient(150deg,#1b3a60,#2fbcd4)',
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                boxShadow: '0 0 0 1px rgba(47,188,212,.4), 0 4px 16px rgba(0,0,0,.25)',
            }}>
                <span style={{ fontFamily: "'Rakkas',serif", fontSize: 22, color: '#fff' }}>ض</span>
            </div>
            <span style={{
                fontFamily: "'Rakkas',serif", fontSize: 18, letterSpacing: '.03em',
                color: dark ? '#eef2f7' : '#1b3a60', transition: 'color .4s ease',
            }}>منصة منصور</span>
        </div>
    );
}

/* ── Hieroglyph → Arabic welcome morph ───────────────────────── */
const LETTER_GLYPHS = ['ا','ل','ض','ا','د'];
function HieroglyphIntro({ dark = true }) {
    const [showArabic, setShowArabic] = useState(false);
    useEffect(() => {
        const t = setTimeout(() => setShowArabic(true), 1800);
        return () => clearTimeout(t);
    }, []);
    return (
        <div style={{ minHeight:48, marginBottom:18, display:'flex', alignItems:'center' }}>
            {!showArabic ? (
                <div style={{ display:'flex', gap:10, animation:'hieroOut .6s 1.2s ease forwards' }}>
                    {LETTER_GLYPHS.map((g,i)=>(
                        <span key={i} style={{ fontSize:28, color:C.gold, opacity:.85, fontFamily:"'Rakkas',serif", textShadow:'0 0 12px rgba(47,188,212,.4)' }}>{g}</span>
                    ))}
                </div>
            ) : (
                <div style={{ animation:'arabicIn .7s ease both', fontFamily:"'Rakkas',serif", fontSize:14, letterSpacing:'.1em', color: dark ? C.stone : C.navy }}>
                    أهلاً بك في رحاب الضاد
                </div>
            )}
        </div>
    );
}

/* ═══════════════════════════════════════════════════════════════
   فروع اللغة العربية — بطاقات متمددة (Accordion)
═══════════════════════════════════════════════════════════════ */
function LanguageBranches({ dark }) {
    const [active, setActive] = useState(1);

    return (
        <div className="branches-row" style={{ display:'flex', gap:14, height:520, alignItems:'stretch' }}>
            {BRANCHES.map((b, i) => {
                const isActive = active === i;
                return (
                    <div key={i}
                        onClick={() => setActive(i)}
                        className={isActive ? 'branch-active' : 'branch-collapsed'}
                        style={{
                            position:'relative', overflow:'hidden', cursor:'pointer',
                            flex: isActive ? '1 1 0%' : '0 0 108px',
                            minWidth: isActive ? 320 : 108,
                            borderRadius:28,
                            transition:'flex-basis .55s cubic-bezier(.22,1,.36,1), min-width .55s cubic-bezier(.22,1,.36,1), background .4s ease',
                            background: isActive
                                ? 'linear-gradient(155deg,#122843 0%,#0c1929 55%,#050b15 100%)'
                                : (dark ? 'rgba(226,232,240,.04)' : '#f4f6f9'),
                            border: `1px solid ${isActive ? 'rgba(47,188,212,.35)' : (dark ? 'rgba(226,232,240,.08)' : 'rgba(27,58,96,.08)')}`,
                        }}
                    >
                        {/* نسيج نجمة خافت في حالة الفتح */}
                        {isActive && (
                            <svg style={{ position:'absolute', inset:0, width:'100%', height:'100%', opacity:.05, pointerEvents:'none' }}>
                                <defs><pattern id={`bpat-${i}`} width="46" height="46" patternUnits="userSpaceOnUse">
                                    <g stroke="#2fbcd4" fill="none" strokeWidth="1">
                                        <rect x="6" y="6" width="34" height="34"/>
                                        <rect x="6" y="6" width="34" height="34" transform="rotate(45 23 23)"/>
                                    </g>
                                </pattern></defs>
                                <rect width="100%" height="100%" fill={`url(#bpat-${i})`}/>
                            </svg>
                        )}

                        {!isActive ? (
                            <>
                                {/* أيقونة الفرع — حالة الطي */}
                                <div style={{ position:'absolute', top:24, left:0, right:0, display:'flex', justifyContent:'center' }}>
                                    <div style={{
                                        width:44, height:44, borderRadius:'50%', flexShrink:0,
                                        display:'flex', alignItems:'center', justifyContent:'center',
                                        background: dark ? 'rgba(226,232,240,.07)' : '#fff',
                                        border: '1px solid rgba(47,188,212,.25)',
                                        boxShadow: dark ? 'none' : '0 2px 8px rgba(27,58,96,.08)',
                                    }}>
                                        <svg width="19" height="19" viewBox="0 0 24 24" fill="none" stroke={dark ? 'rgba(226,232,240,.6)' : '#1b3a60'} strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
                                            {b.icon}
                                        </svg>
                                    </div>
                                </div>

                                {/* عنوان رأسي */}
                                <div style={{ position:'absolute', inset:0, display:'flex', alignItems:'center', justifyContent:'center', paddingTop:70 }}>
                                    <span style={{
                                        transform:'rotate(-90deg)', whiteSpace:'nowrap',
                                        fontFamily:"'Rakkas',serif", fontSize:19,
                                        color: dark ? 'rgba(226,232,240,.75)' : '#1b3a60',
                                    }}>{b.title}</span>
                                </div>

                                {/* سهم الفتح */}
                                <div style={{ position:'absolute', bottom:20, left:0, right:0, display:'flex', justifyContent:'center' }}>
                                    <div style={{ width:26, height:26, borderRadius:'50%', display:'flex', alignItems:'center', justifyContent:'center', background: dark ? 'rgba(226,232,240,.08)' : 'rgba(27,58,96,.06)' }}>
                                        <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke={dark ? 'rgba(226,232,240,.5)' : 'rgba(27,58,96,.5)'} strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                                            <line x1="12" y1="19" x2="12" y2="5"/><polyline points="5 12 12 5 19 12"/>
                                        </svg>
                                    </div>
                                </div>
                            </>
                        ) : (
                            /* حالة الفتح — المحتوى الكامل */
                            <div style={{ position:'relative', zIndex:1, height:'100%', display:'flex', flexDirection:'column', padding:'26px 30px 28px', animation:'branchIn .5s ease both' }}>
                                <div style={{ display:'flex', alignItems:'center', justifyContent:'space-between', marginBottom:18 }}>
                                    <div style={{ display:'inline-flex', alignItems:'center', gap:8, padding:'5px 14px', borderRadius:999, background:'rgba(47,188,212,.12)', border:'1px solid rgba(47,188,212,.3)' }}>
                                        <span style={{ fontSize:12, color:'#2fbcd4', fontWeight:700 }}>فرع {b.title}</span>
                                    </div>
                                    <div style={{
                                        width:44, height:44, borderRadius:'50%', flexShrink:0,
                                        display:'flex', alignItems:'center', justifyContent:'center',
                                        background:'rgba(47,188,212,.14)', border:'1px solid rgba(47,188,212,.4)',
                                        boxShadow:'0 0 18px rgba(47,188,212,.25)',
                                    }}>
                                        <svg width="19" height="19" viewBox="0 0 24 24" fill="none" stroke="#2fbcd4" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
                                            {b.icon}
                                        </svg>
                                    </div>
                                </div>

                                <h3 style={{ fontFamily:"'Rakkas',serif", fontSize:'clamp(24px,2.6vw,34px)', color:'#eef2f7', margin:'0 0 14px' }}>{b.title}</h3>

                                <p style={{ fontSize:14, lineHeight:2, color:'rgba(226,232,240,.65)', maxWidth:640, margin:'0 0 20px' }}>{b.desc}</p>

                                <div style={{ fontSize:12.5, color:'#8dc63f', fontWeight:700, marginBottom:10 }}>أبرز محاور الدراسة:</div>
                                <div style={{ display:'grid', gridTemplateColumns:'repeat(auto-fit,minmax(220px,1fr))', gap:'6px 24px', marginBottom:'auto' }}>
                                    {b.points.map((pt, pi) => (
                                        <div key={pi} style={{ display:'flex', alignItems:'flex-start', gap:8, padding:'6px 0' }}>
                                            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#8dc63f" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" style={{ flexShrink:0, marginTop:3 }}>
                                                <polyline points="20 6 9 17 4 12"/>
                                            </svg>
                                            <span style={{ fontSize:13, color:'rgba(226,232,240,.8)', lineHeight:1.6 }}>{pt}</span>
                                        </div>
                                    ))}
                                </div>

                                <a href="#courses" style={{ display:'inline-flex', alignItems:'center', gap:9, fontSize:13, color:'#2fbcd4', textDecoration:'none', fontWeight:700, marginTop:18, paddingTop:18, borderTop:'1px solid rgba(255,255,255,.08)' }}>
                                    <span style={{ width:26, height:26, borderRadius:'50%', background:'rgba(47,188,212,.15)', display:'flex', alignItems:'center', justifyContent:'center', flexShrink:0 }}>
                                        <svg width="10" height="10" viewBox="0 0 24 24" fill="#2fbcd4"><polygon points="6 3 20 12 6 21"/></svg>
                                    </span>
                                    أوّل محاضرات مجانية في فرع {b.title}
                                </a>
                            </div>
                        )}
                    </div>
                );
            })}
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

    const medalColors = ['#2fbcd4','#94a3b8','#cd7f32'];

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
    const [hoveredCourse,   setHoveredCourse]   = useState(null);

    const pageBg = darkMode
        ? `linear-gradient(160deg, #050b15 0%, #0a1628 35%, #1b3a60 65%, #090e1a 100%)`
        : '#ffffff';
    const pageEdge = darkMode ? C.dark : '#ffffff';

    /* Theme tokens — text/backgrounds that sit directly on the page bg flip with it.
       Cards keep a permanent dark "stone tablet" look in both modes (by design). */
    const T = {
        text:      darkMode ? C.white : C.navy,
        textDim2:  darkMode ? 'rgba(245,240,232,.68)' : 'rgba(27,58,96,.68)',
        textDim4:  darkMode ? 'rgba(245,240,232,.52)' : 'rgba(27,58,96,.52)',
        navBg:     darkMode ? 'rgba(5,11,21,.22)'      : 'rgba(255,255,255,.32)',
        navBorder: darkMode ? 'rgba(245,240,232,.16)'  : 'rgba(27,58,96,.12)',
        navLink:   darkMode ? 'rgba(245,240,232,.68)'  : 'rgba(27,58,96,.68)',
        authBorder:darkMode ? 'rgba(255,255,255,.22)'  : 'rgba(27,58,96,.22)',
        authText:  darkMode ? 'rgba(245,240,232,.85)'  : 'rgba(27,58,96,.85)',
    };

    useEffect(() => {
        document.body.style.background = pageEdge;
    }, [pageEdge]);

    return (
        <>
            <Head title="الأستاذ محمد منصور — منصة اللغة العربية" />
            <PageStyles />
            <Preloader visible={loading} />

            {/* Fixed animated background */}
            <HistoryBackground dark={darkMode} />

            <div
                ref={pageRef}
                dir="rtl"
                style={{ minHeight:'100vh', background:pageBg, fontFamily:'Cairo,sans-serif', position:'relative', color:T.text, transition:'background 1s ease, color 1s ease', paddingTop:100 }}
            >

            {/* ══════════════════════════════════════════════════════
                NAVBAR  —  floating, framed, neoclassical
            ══════════════════════════════════════════════════════ */}
{/* ── NAVBAR  —  floating, borderless glassmorphism ── */}
            <nav style={{
                position:       'fixed',
                top:            14,
                left:           8,
                right:          8,
                zIndex:         50,
                display:        'flex',
                alignItems:     'center',
                justifyContent: 'space-between',
                padding:        '0 clamp(16px,4vw,32px)',
                height:         88, // الارتفاع المتناسق والمريح للوجو الكبير
                borderRadius:   20, // الحواف الدائرية الكبيرة المتناسقة مع الارتفاع
                // زجاج شفاف أكثر ليمرر ألوان الـ 3D والخلفيات بوضوح ونقاء (Glassmorphic)
                background:     darkMode ? 'rgba(5, 11, 21, 0.45)' : 'rgba(255, 252, 245, 0.55)',
                // إزالة الحدود تماماً بناءً على طلبك
                border:         'none', 
                // التظليل العميق والناعم متعدد الطبقات لتظهر الـ Navbar كأنها طافية فوق الصفحة
                boxShadow:      darkMode
                    ? '0 24px 60px rgba(0,0,0,0.75), 0 6px 16px rgba(0,0,0,0.5), inset 0 1px 0 rgba(255,255,255,0.12)'
                    : '0 20px 44px rgba(27,58,96,0.18), 0 4px 12px rgba(27,58,96,0.08), inset 0 1px 0 rgba(255,255,255,0.65)',
                backdropFilter: 'blur(30px) saturate(1.7)',
                WebkitBackdropFilter: 'blur(30px) saturate(1.7)',
                transition:     'background .4s ease, box-shadow .4s ease',
            }}>
                {/* Right group: logo + toggle */}
                <div style={{ display:'flex', alignItems:'center', gap:14 }}>
                    <NavLogo dark={darkMode} />
                    <ThemeToggle dark={darkMode} setDark={setDarkMode} />
                </div>

                {/* Center: nav links (hidden on mobile via CSS) */}
                <div className="nav-links" style={{ gap:4, position:'absolute', left:'50%', transform:'translateX(-50%)' }}>
                    {[{label:'الرئيسية',href:'#'},{label:'المقررات',href:'#courses'},{label:'عن المنصة',href:'#about'}].map(({label,href})=>(
                        <a key={label} href={href} style={{
                            color:T.navLink, textDecoration:'none',
                            fontSize:13, fontWeight:600, padding:'8px 14px', borderRadius:8,
                            transition:'color .2s, background .2s',
                        }}
                        onMouseEnter={e=>{e.currentTarget.style.color=C.gold;e.currentTarget.style.background='rgba(47,188,212,.08)';}}
                        onMouseLeave={e=>{e.currentTarget.style.color=T.navLink;e.currentTarget.style.background='transparent';}}
                        >{label}</a>
                    ))}
                </div>

                {/* Left group: auth buttons */}
                <div className="nav-ctas" style={{ display:'flex', alignItems:'center', gap:10 }}>
                    {auth?.user ? (
                        <Link href="/student/dashboard" style={{
                            padding:'9px 22px', borderRadius:10,
                            background:`linear-gradient(135deg,${C.gold},${C.amber})`,
                            color:C.dark, fontWeight:700, fontSize:13, textDecoration:'none',
                        }}>لوحة التحكم</Link>
                    ) : (<>
                        <Link href="/student/login" style={{
                            padding:'9px 20px', borderRadius:10,
                            border:`1.5px solid ${T.authBorder}`,
                            color:T.authText, fontSize:13, fontWeight:600,
                            textDecoration:'none', transition:'border-color .2s',
                        }}
                        onMouseEnter={e=>e.currentTarget.style.borderColor=C.gold}
                        onMouseLeave={e=>e.currentTarget.style.borderColor=T.authBorder}
                        >تسجيل الدخول</Link>

                        <Link href="/register" style={{
                            padding:'9px 22px', borderRadius:10,
                            background:`linear-gradient(135deg,${C.amber},#6ea82d)`,
                            color:'#fff', fontWeight:700, fontSize:13,
                            textDecoration:'none',
                            boxShadow:`0 4px 18px rgba(141,198,63,.4)`,
                            transition:'box-shadow .2s, transform .2s',
                        }}
                        onMouseEnter={e=>{e.currentTarget.style.boxShadow=`0 6px 24px rgba(141,198,63,.6)`;e.currentTarget.style.transform='translateY(-1px)';}}
                        onMouseLeave={e=>{e.currentTarget.style.boxShadow=`0 4px 18px rgba(141,198,63,.4)`;e.currentTarget.style.transform='none';}}
                        >حساب جديد</Link>
                    </>)}
                </div>
            </nav>  
            {/* ══════════════════════════════════════════════════════
                HERO
            ══════════════════════════════════════════════════════ */}
            <section className="hero-section" style={{
                minHeight:'100vh', display:'flex', alignItems:'center',
                paddingTop:`clamp(48px,9vh,110px)`,
                paddingBottom:`clamp(48px,9vh,110px)`,
                paddingRight:`clamp(24px,5vw,72px)`,
                paddingLeft:`clamp(160px,13vw,240px)`,
                position:'relative', zIndex:10, gap:40,
            }}>
                <div className="hero-right" data-reveal>
                    <HieroglyphIntro dark={darkMode}/>

                    <div style={{ display:'inline-flex', alignItems:'center', gap:10, padding:'7px 18px', borderRadius:999, border:`1px solid rgba(47,188,212,.32)`, background:'rgba(47,188,212,.07)', marginBottom:28 }}>
                        <span style={{ width:7, height:7, borderRadius:'50%', background:C.gold, display:'inline-block' }}/>
                        <span style={{ fontSize:13, color:C.gold, letterSpacing:'.12em' }}>منصة اللغة العربية الأولى</span>
                    </div>

                    {/* ── Brand welcome wordmark — نص بدل الصورة القديمة ── */}
                    <h1 className="hero-welcome-img" style={{
                        fontFamily:"'Rakkas',serif", fontWeight:400,
                        fontSize:'clamp(38px,5.5vw,64px)', lineHeight:1.3,
                        margin:'0 0 36px', maxWidth:520,
                        color: T.text,
                    }}>
                        أهلاً بيك في{' '}
                        <span style={{
                            background:'linear-gradient(135deg,#2fbcd4,#8dc63f)',
                            WebkitBackgroundClip:'text', WebkitTextFillColor:'transparent', backgroundClip:'text',
                        }}>منصة منصور</span> التعليمية
                    </h1>

                    <p style={{ fontSize:'clamp(14px,1.6vw,18px)', color:T.textDim2, maxWidth:520, lineHeight:2, margin:'0 0 36px' }}>
                        <span style={{ fontFamily:'Rakkas,serif', fontSize:'1.35em', color:'#8dc63f', letterSpacing:'.04em' }}>يا مولانا</span>، أهلاً بيك في بيتك التاني — مع الأستاذ محمد منصور هتذاكر اللغة العربية بطريقة عمرك ما جربتها.
                        شرح واضح، فيديوهات تفاعلية، ومتابعة مستمرة لحد ما تلم المنهج.
                    </p>

                    <div style={{ display:'flex', gap:14, flexWrap:'wrap', marginBottom:52 }}>
                        <Link
                            href={auth?.user ? '/student/dashboard' : '/register'}
                            style={{ padding:'14px 36px', borderRadius:12, background:`linear-gradient(135deg,${C.gold},${C.amber})`, color:C.dark, fontWeight:800, fontSize:16, textDecoration:'none', boxShadow:`0 8px 32px rgba(141,198,63,.35)`, transition:'transform .2s,box-shadow .2s' }}
                            onMouseEnter={e=>{e.currentTarget.style.transform='translateY(-2px)';e.currentTarget.style.boxShadow=`0 14px 44px rgba(141,198,63,.55)`;}}
                            onMouseLeave={e=>{e.currentTarget.style.transform='none';e.currentTarget.style.boxShadow=`0 8px 32px rgba(141,198,63,.35)`;}}
                        >اشترك دلوقتي !</Link>
                        <a href="#features" style={{ padding:'14px 28px', borderRadius:12, border:`1px solid rgba(47,188,212,.35)`, color:T.text, fontSize:15, textDecoration:'none' }}>اعرف أكتر ←</a>
                    </div>

                    <div className="hero-stats" style={{ display:'flex', gap:32, flexWrap:'wrap', paddingTop:24, borderTop:`1px solid rgba(47,188,212,.15)` }}>
                        {[{count:1000000,label:'متابع على فيسبوك',prefix:'+',color:C.gold},{count:2000000,label:'طالب مسجل',prefix:'+',color:C.amber},{count:98,label:'نسبة النجاح',prefix:'',suffix:'٪',color:C.gold}].map(({count,label,prefix,suffix='',color})=>(
                            <div key={label}>
                                <div style={{ fontSize:'clamp(20px,2.4vw,32px)', fontWeight:800, color }}>{prefix}<span data-count={count}>٠</span>{suffix}</div>
                                <div style={{ fontSize:12, color:T.textDim4, marginTop:2 }}>{label}</div>
                            </div>
                        ))}
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
                        position:'absolute', top:-46, left:'50%', transform:'translateX(-50%)',
                        fontFamily:"'Rakkas',serif", fontSize:'clamp(120px,16vw,220px)', lineHeight:1,
                        color:C.gold, opacity:0.055, whiteSpace:'nowrap', pointerEvents:'none',
                        userSelect:'none', zIndex:0,
                    }}>ض</span>

                    <p style={{ fontSize:12, color:C.gold, letterSpacing:'.22em', marginBottom:12, position:'relative' }} data-reveal>▸ أسباب الاختيار</p>
                    <h2 style={{ fontSize:'clamp(26px,3.5vw,52px)', fontWeight:800, margin:'0 0 14px', color:C.gold, position:'relative' }} data-reveal>ليه تشترك معانا؟</h2>
                    <p style={{ fontSize:15, color:T.textDim4, maxWidth:480, margin:'0 auto 18px', position:'relative' }} data-reveal>مش بس منصة — ده بيت تاني هتلاقي فيه كل اللي محتاجه عشان تنجح وتتفوق</p>
                    <div style={{ display:'flex', alignItems:'center', justifyContent:'center', gap:10, position:'relative' }} data-reveal>
                        <div style={{ width:40, height:1, background:`linear-gradient(90deg,transparent,${C.gold})` }}/>
                        <svg width="14" height="14" viewBox="0 0 18 18" fill="none"><rect x="4" y="4" width="10" height="10" transform="rotate(45 9 9)" stroke={C.gold} strokeWidth="1.6"/></svg>
                        <div style={{ width:40, height:1, background:`linear-gradient(90deg,${C.gold},transparent)` }}/>
                    </div>
                </div>
                <div className="tl-wrap">
                    {FEATURES.map(({n,title,text,icon}, i)=>{
                        const side   = i % 2 === 0 ? 'right' : 'left';
                        const delay  = `${i * 0.1}s`;
                        const accent = TILE_ACCENTS[i % TILE_ACCENTS.length];
                        const numAr  = ['١','٢','٣','٤','٥','٦','٧','٨'][i] ?? (i+1);
                        const patId  = `feat-pat-${i}`;
                        return (
                        <div key={n} className={`tl-item ${side}`} style={{ animationDelay: delay }}>
                            {side === 'left' && (
                                <div className="feat-num-outside" style={{ color: accent }}>{numAr}</div>
                            )}
                            <div className="feat-card" data-reveal>
                                {/* زخارف أركان رفيعة بجوهرة صغيرة — طراز تذهيب المخطوطات */}
                                {['tl','tr','bl','br'].map(pos => (
                                    <div key={pos} className={`feat-corner feat-corner-${pos}`} style={{ color: accent }}>
                                        <svg viewBox="0 0 30 30" width="30" height="30">
                                            <path d="M3,19 L3,3 L19,3" stroke="currentColor" strokeWidth="1.4" fill="none" strokeLinecap="round"/>
                                            <rect x="0" y="0" width="7" height="7" transform="rotate(45 3.2 3.2)" fill="currentColor"/>
                                        </svg>
                                    </div>
                                ))}

                                <div className="feat-card-inner" style={{
                                    background: darkMode ? 'linear-gradient(155deg,#0f1f36,#0a1524)' : '#ffffff',
                                    boxShadow: darkMode ? '0 4px 20px rgba(0,0,0,.3)' : '0 2px 16px rgba(27,58,96,.08)',
                                    '--frame-c': darkMode ? `${accent}66` : `${accent}55`,
                                }}>
                                    {/* نسيج نجمة ثمانية يغطي الكارت كله — بينوّر عند المرور */}
                                    <svg className="feat-pattern" style={{ position:'absolute', inset:0, width:'100%', height:'100%' }}>
                                        <defs>
                                            <pattern id={patId} width="36" height="36" patternUnits="userSpaceOnUse">
                                                <g stroke={accent} fill="none" strokeWidth="1">
                                                    <rect x="4" y="4" width="28" height="28"/>
                                                    <rect x="4" y="4" width="28" height="28" transform="rotate(45 18 18)"/>
                                                </g>
                                            </pattern>
                                        </defs>
                                        <rect width="100%" height="100%" fill={`url(#${patId})`}/>
                                    </svg>

                                    {/* شمسة نجمية — ميدالية الأيقونة بطراز رسوم المخطوطات */}
                                    <div className="feat-medal-wrap">
                                        <div className="feat-medal">
                                            <svg className="feat-medal-deco" width="76" height="76" viewBox="0 0 76 76" style={{ position:'absolute', inset:0 }}>
                                                <circle cx="38" cy="38" r="35" fill="none" stroke={accent} strokeWidth=".7" opacity=".7"/>
                                                <g stroke={accent} strokeWidth="1" fill="none">
                                                    <rect x="15" y="15" width="46" height="46"/>
                                                    <rect x="15" y="15" width="46" height="46" transform="rotate(45 38 38)"/>
                                                </g>
                                                <circle cx="38" cy="38" r="24" fill={darkMode ? '#0c1929' : '#ffffff'} stroke={accent} strokeWidth="1.4"/>
                                            </svg>
                                            <svg className="feat-icon-svg" viewBox="0 0 24 24" fill="none" stroke={accent} strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
                                                {icon}
                                            </svg>
                                        </div>
                                    </div>

                                    <div className="feat-body-wrap">
                                        <div className="feat-title" style={{ color: T.text }}>{title}</div>
                                        <div className="feat-body" style={{ color: T.textDim2 }}>{text}</div>

                                        <div className="feat-div" style={{ color: accent }}>
                                            <div className="feat-div-line"/>
                                            <svg width="10" height="10" viewBox="0 0 18 18" fill="none"><rect x="4" y="4" width="10" height="10" transform="rotate(45 9 9)" stroke="currentColor" strokeWidth="1.6"/></svg>
                                            <div className="feat-div-line" style={{ background:`linear-gradient(90deg, transparent, currentColor)` }}/>
                                        </div>
                                    </div>
                                </div>
                            </div>
                            {side === 'right' && (
                                <div className="feat-num-outside" style={{ color: accent }}>{numAr}</div>
                            )}
                        </div>
                        );
                    })}
                </div>
            </section>

            {/* ══════════════════════════════════════════════════════
                فروع اللغة العربية — بطاقات متمددة
            ══════════════════════════════════════════════════════ */}
            <section style={{ padding:'clamp(60px,10vh,100px) 0', position:'relative', zIndex:10 }}>
                <div style={{ textAlign:'center', marginBottom:48, padding:'0 clamp(24px,5vw,72px)' }}>
                    <p style={{ fontSize:12, color:C.gold, letterSpacing:'.22em', marginBottom:12 }} data-reveal>▸ خارطة اللغة</p>
                    <h2 style={{ fontSize:'clamp(26px,3.5vw,52px)', fontWeight:800, margin:0 }} data-reveal>فروع اللغة العربية</h2>
                    <p style={{ fontSize:15, color:T.textDim4, maxWidth:480, margin:'14px auto 0' }} data-reveal>اضغط على أي فرع عشان تعرف هتذاكر فيه إيه قبل أن تبدأ رحلتك.</p>
                </div>

                <div style={{ padding:'0 clamp(24px,5vw,72px)' }} data-reveal>
                    <LanguageBranches dark={darkMode} />
                </div>
            </section>

            {/* ══════════════════════════════════════════════════════
                THREE PORTALS
            ══════════════════════════════════════════════════════ */}
            <section style={{ padding:'clamp(80px,12vh,140px) clamp(24px,5vw,72px)', position:'relative', zIndex:10, background: darkMode ? 'linear-gradient(180deg,#06101e 0%,#0c1829 50%,#06101e 100%)' : 'linear-gradient(180deg,#f0e6d2 0%,#e6d9be 50%,#f0e6d2 100%)', overflow:'hidden', transition:'background 0.4s ease' }}>
                {/* Top & bottom gold lines */}
                <div style={{ position:'absolute', top:0, left:0, right:0, height:1, background:`linear-gradient(90deg,transparent,${C.gold},transparent)` }}/>
                <div style={{ position:'absolute', bottom:0, left:0, right:0, height:1, background:`linear-gradient(90deg,transparent,${C.gold},transparent)` }}/>
                {/* Center atmospheric glow */}
                <div style={{ position:'absolute', top:'35%', left:'50%', transform:'translate(-50%,-50%)', width:'60%', height:'45%', background:'radial-gradient(ellipse,rgba(47,188,212,.08) 0%,transparent 70%)', pointerEvents:'none' }}/>

                <div style={{ textAlign:'center', marginBottom:64, position:'relative' }}>
                    <div style={{ display:'inline-flex', alignItems:'center', gap:14, marginBottom:18 }}>
                        <div style={{ width:32, height:1, background:`linear-gradient(90deg,transparent,${C.gold})` }}/>
                        <p style={{ fontSize:11, color:C.gold, letterSpacing:'.28em', margin:0 }} data-reveal>ما الذي نقدمه</p>
                        <div style={{ width:32, height:1, background:`linear-gradient(90deg,${C.gold},transparent)` }}/>
                    </div>
                    <h2 style={{ fontSize:'clamp(28px,3.5vw,54px)', fontWeight:800, margin:0, color: darkMode ? '#f5f0e8' : C.navy, letterSpacing:'.02em', transition:'color 0.4s ease' }} data-reveal>أقسام المنصة الثلاثة</h2>
                    <p style={{ fontSize:14, color: darkMode ? 'rgba(47,188,212,.55)' : 'rgba(100,70,10,.55)', marginTop:10, letterSpacing:'.06em', transition:'color 0.4s ease' }} data-reveal>اختر بوابتك — وانطلق</p>
                </div>

                <div className="port-grid" style={{ maxWidth:1160, margin:'0 auto', alignItems:'end' }}>
                    {PORTALS.map(({title,text,icon},i)=>(
                        <div key={i} data-reveal style={{ display:'flex', flexDirection:'column', alignItems:'center' }}>

                            {/* قلادة زخرفية نازلة فوق كل قسم — بديل شكل الخنجر القديم */}
                            <svg width="14" height="60" viewBox="0 0 14 60" fill="none"
                                style={{ marginBottom:10, opacity: i===1 ? .88 : .65, animation:`orbitBob ${3.8+i*.5}s ${i*.3}s ease-in-out infinite`, filter:`drop-shadow(0 3px 10px rgba(47,188,212,.25))` }}>
                                <line x1="7" y1="0" x2="7" y2="42" stroke={i===1 ? C.amber : C.gold} strokeWidth="1.4" opacity=".7"/>
                                <rect x="1" y="42" width="12" height="12" transform="rotate(45 7 48)" fill={i===1 ? C.amber : C.gold} opacity={i===1 ? .9 : .75}/>
                            </svg>

                            <PopOutCard
                                icon={icon} title={title} text={text}
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
                        <button key={f} onClick={()=>setActiveFilter(f)} style={{ padding:'9px 20px', borderRadius:999, cursor:'pointer', fontFamily:'Cairo,sans-serif', fontSize:13, fontWeight:600, transition:'all .2s', border:`1.5px solid ${activeFilter===f ? C.amber : 'rgba(47,188,212,.28)'}`, background:activeFilter===f ? `linear-gradient(135deg,rgba(141,198,63,.18),rgba(47,188,212,.1))` : 'rgba(12,25,41,.5)', color:activeFilter===f ? C.amber : 'rgba(245,240,232,.65)' }}>{f}</button>
                    ))}
                </div>

                {filteredCourses.length === 0 ? (
                    <div style={{ textAlign:'center', padding:'60px 20px', color:'rgba(226,232,240,.38)', fontSize:16 }}>
                        <div style={{ fontSize:48, marginBottom:16, opacity:.4 }}>📚</div>
                        لا توجد وحدات دراسية متاحة حالياً — تابعنا قريباً!
                    </div>
                ) : (
                <div className="course-scroll" style={{ display:'flex', alignItems:'center', justifyContent:'center', gap:24, overflowX:'auto', paddingBottom:12, scrollSnapType:'x mandatory', WebkitOverflowScrolling:'touch', flexWrap:'wrap' }}>
                    {filteredCourses.map((unit) => {
                        const isHovered  = hoveredCourse === unit.id;
                        const imgSrc     = unit.image ? `/storage/${unit.image}` : null;
                        const priceLabel = unit.is_free ? 'مجاني ✓' : (unit.price ? `${unit.price} جنيه` : '—');
                        const gradeName  = unit.academic_year?.name ?? '';
                        const ctaHref    = unit.is_free
                            ? (auth?.user ? '/student/dashboard' : '/student/login')
                            : (auth?.user ? '/student/dashboard' : '/register');
                        const ctaLabel   = unit.is_free ? 'شوف الوحدة مجاناً ←' : (auth?.user ? 'الدخول للوحدة ←' : 'اشترك للدخول ←');
                        return (
                        <div key={unit.id} data-reveal
                            style={{ flex:'0 0 340px', scrollSnapAlign:'start', transition:'transform .25s', cursor:'pointer' }}
                            onMouseEnter={e=>{e.currentTarget.style.transform='translateY(-6px)'; setHoveredCourse(unit.id);}}
                            onMouseLeave={e=>{e.currentTarget.style.transform='none'; setHoveredCourse(null);}}>
                            {imgSrc ? (
                                <img src={imgSrc} alt={unit.title}
                                    style={{ width:'100%', display:'block', maxHeight:320, objectFit:'contain',
                                             filter:'drop-shadow(0 14px 30px rgba(0,0,0,.45))' }} />
                            ) : (
                                <div style={{
                                    width:'100%', height:260, borderRadius:20, position:'relative', overflow:'hidden',
                                    background:'linear-gradient(160deg,#16304f 0%,#0c1929 60%,#050b15 100%)',
                                    border:'1px solid rgba(47,188,212,.25)',
                                    display:'flex', flexDirection:'column', alignItems:'center', justifyContent:'center', gap:12,
                                    filter:'drop-shadow(0 14px 30px rgba(0,0,0,.35))',
                                }}>
                                    <svg width="80%" height="80%" viewBox="0 0 100 100" style={{ position:'absolute', opacity:.08 }}>
                                        <rect x="18" y="18" width="64" height="64" fill="none" stroke="#2fbcd4" strokeWidth="1.2"/>
                                        <rect x="18" y="18" width="64" height="64" transform="rotate(45 50 50)" fill="none" stroke="#2fbcd4" strokeWidth="1.2"/>
                                    </svg>
                                    <svg width="54" height="42" viewBox="0 0 52 40" fill="none" style={{ position:'relative' }}>
                                        <path d="M26,8 Q14,2 4,6 L4,34 Q14,30 26,36 Q38,30 48,34 L48,6 Q38,2 26,8 Z" stroke="#2fbcd4" strokeWidth="1.6" fill="none"/>
                                        <line x1="26" y1="8" x2="26" y2="36" stroke="#2fbcd4" strokeWidth="1.6" opacity=".4"/>
                                    </svg>
                                    <span style={{ fontSize:13, color:'rgba(226,232,240,.5)', fontWeight:600, position:'relative', padding:'0 16px', textAlign:'center' }}>{unit.title}</span>
                                </div>
                            )}
                            <div style={{
                                maxHeight: isHovered ? 300 : 0,
                                opacity: isHovered ? 1 : 0,
                                overflow:'hidden',
                                transition:'max-height .55s cubic-bezier(.22,1,.36,1), opacity .4s ease',
                                background:'rgba(12,25,41,.7)',
                                backdropFilter: isHovered ? 'blur(14px)' : 'none',
                                borderRadius:16,
                                marginTop: isHovered ? 12 : 0,
                            }}>
                                <div style={{ padding:'18px 18px 22px' }}>
                                    <div style={{ display:'flex', alignItems:'center', justifyContent:'space-between', marginBottom:6, gap:8 }}>
                                        <span style={{ fontSize:15, fontWeight:700, color:C.white, flex:1 }}>{unit.title}</span>
                                        <span style={{ fontSize:12, fontWeight:800, color: unit.is_free ? '#4ade80' : C.amber, whiteSpace:'nowrap' }}>{priceLabel}</span>
                                    </div>
                                    {gradeName && (
                                        <div style={{ fontSize:11.5, color:C.gold, marginBottom:10 }}>{gradeName}</div>
                                    )}
                                    {unit.description && (
                                        <div style={{ fontSize:13, color:'rgba(245,240,232,.58)', lineHeight:1.8, marginBottom:18 }}>{unit.description}</div>
                                    )}
                                    <Link href={ctaHref} style={{ display:'block', textAlign:'center', padding:'11px', borderRadius:10, background: unit.is_free ? 'linear-gradient(135deg,#22c55e,#16a34a)' : `linear-gradient(135deg,${C.amber},${C.gold})`, color: unit.is_free ? '#fff' : C.dark, fontWeight:700, fontSize:14, textDecoration:'none' }}>{ctaLabel}</Link>
                                </div>
                            </div>
                        </div>
                        );
                    })}
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
                    ? 'linear-gradient(180deg,#06101e 0%,#0b1827 50%,#06101e 100%)'
                    : 'linear-gradient(180deg,#ece0c8 0%,#e0ceaa 50%,#ece0c8 100%)',
                overflow:'hidden', transition:'background .4s'
            }}>
                {/* Stone grid texture */}
                <div style={{ position:'absolute', inset:0, backgroundImage:`repeating-linear-gradient(0deg,transparent,transparent 59px,rgba(47,188,212,.02) 59px,rgba(47,188,212,.02) 60px),repeating-linear-gradient(90deg,transparent,transparent 59px,rgba(47,188,212,.02) 59px,rgba(47,188,212,.02) 60px)`, pointerEvents:'none' }}/>
                <div style={{ position:'absolute', top:'40%', left:'50%', transform:'translate(-50%,-50%)', width:'65%', height:'65%', background:'radial-gradient(ellipse,rgba(47,188,212,.055) 0%,transparent 70%)', pointerEvents:'none' }}/>

                {/* Border lines */}
                <div style={{ position:'absolute', top:0, left:0, right:0, height:2, background:`linear-gradient(90deg,transparent,${C.gold} 20%,${C.gold} 80%,transparent)` }}/>
                <div style={{ position:'absolute', bottom:0, left:0, right:0, height:2, background:`linear-gradient(90deg,transparent,${C.gold} 20%,${C.gold} 80%,transparent)` }}/>

                {/* SVG columns left & right */}
                {[true,false].map(isLeft => (
                    <div key={String(isLeft)} style={{ position:'absolute', [isLeft?'left':'right']:0, top:0, bottom:0, width:52, display:'flex', alignItems:'center', justifyContent:'center', pointerEvents:'none', opacity: darkMode?.14:.1 }}>
                        <svg width="26" height="340" viewBox="0 0 26 340" fill="none">
                            <circle cx="13" cy="4" r="3" fill={C.gold}/>
                            <rect x="5" y="6" width="16" height="5" rx="2" fill={C.gold}/>
                            <rect x="2" y="10" width="22" height="5" rx="1" fill={C.gold}/>
                            <rect x="10" y="15" width="6" height="268" fill={C.gold}/>
                            <line x1="11.5" y1="15" x2="11.5" y2="283" stroke="rgba(0,0,0,.25)" strokeWidth="1"/>
                            <line x1="14.5" y1="15" x2="14.5" y2="283" stroke="rgba(0,0,0,.25)" strokeWidth="1"/>
                            <rect x="2" y="283" width="22" height="5" rx="1" fill={C.gold}/>
                            <rect x="0" y="288" width="26" height="7" rx="2" fill={C.gold}/>
                        </svg>
                    </div>
                ))}

                {/* ── Header ── */}
                <div style={{ textAlign:'center', marginBottom:52, position:'relative' }}>
                    {/* Mini temple arch */}
                    <div style={{ marginBottom:10 }}>
                        <svg width="150" height="54" viewBox="0 0 150 54" fill="none" style={{ opacity: darkMode?.42:.3 }}>
                            <path d="M12,54 L12,26 Q12,4 34,4 L116,4 Q138,4 138,26 L138,54" stroke={C.gold} strokeWidth="1.5" fill="none" strokeLinecap="round"/>
                            <line x1="34"  y1="4" x2="34"  y2="54" stroke={C.gold} strokeWidth=".9" opacity=".5"/>
                            <line x1="75"  y1="4" x2="75"  y2="54" stroke={C.gold} strokeWidth=".9" opacity=".5"/>
                            <line x1="116" y1="4" x2="116" y2="54" stroke={C.gold} strokeWidth=".9" opacity=".5"/>
                            <rect x="12" y="47" width="126" height="7" fill={C.gold} opacity=".28" rx="1"/>
                            <circle cx="75" cy="4" r="3.5" fill={C.gold} opacity=".6"/>
                        </svg>
                    </div>

                    {/* Eyebrow label */}
                    <div style={{ display:'inline-flex', alignItems:'center', gap:14, marginBottom:16 }}>
                        <div style={{ width:36, height:1, background:`linear-gradient(90deg,transparent,${C.gold})` }}/>
                        <span style={{ fontSize:10, color:C.gold, letterSpacing:'.3em', fontWeight:600 }} data-reveal>📖 &nbsp; طلابنا الأوائل &nbsp; 📖</span>
                        <div style={{ width:36, height:1, background:`linear-gradient(90deg,${C.gold},transparent)` }}/>
                    </div>

                    {/* Papyrus scroll banner */}
                    <div data-reveal style={{ display:'inline-block', position:'relative', marginBottom:20 }}>
                        <svg viewBox="0 0 380 62" width="380" height="62" style={{ position:'absolute', inset:0, width:'100%', height:'100%' }} preserveAspectRatio="none">
                            <path d="M26,4 L354,4 Q374,4 374,31 Q374,58 354,58 L26,58 Q6,58 6,31 Q6,4 26,4Z" fill={`${C.amber}dd`} stroke={C.gold} strokeWidth="1.5"/>
                            <ellipse cx="13" cy="31" rx="11" ry="27" fill={C.amber} stroke={C.gold} strokeWidth="1.2"/>
                            <ellipse cx="13" cy="31" rx="5"  ry="20" fill={C.gold} opacity=".35"/>
                            <ellipse cx="367" cy="31" rx="11" ry="27" fill={C.amber} stroke={C.gold} strokeWidth="1.2"/>
                            <ellipse cx="367" cy="31" rx="5"  ry="20" fill={C.gold} opacity=".35"/>
                        </svg>
                        <div style={{ position:'relative', zIndex:1, padding:'15px 58px', fontSize:17, fontWeight:800, color:'#1a0e00', letterSpacing:'.07em', whiteSpace:'nowrap' }}>
                            ♛ &nbsp; طلابنا الأوائل &nbsp; ♛
                        </div>
                    </div>

                    <h2 style={{ fontSize:'clamp(28px,3.5vw,52px)', fontWeight:800, margin:'0 0 10px', color: darkMode?'#f5f0e8':C.navy }} data-reveal>لوحة الشرف</h2>

                    {/* Star divider */}
                    <div style={{ display:'flex', alignItems:'center', justifyContent:'center', gap:10, marginTop:8 }} data-reveal>
                        <div style={{ width:50, height:1, background:`linear-gradient(90deg,transparent,${C.gold})` }}/>
                        <svg width="18" height="18" viewBox="0 0 20 20" style={{ opacity:.7 }}><path d="M10,1 L12.2,7.6 L19.5,7.6 L13.6,11.8 L15.8,18.4 L10,14.2 L4.2,18.4 L6.4,11.8 L0.5,7.6 L7.8,7.6 Z" fill={C.gold}/></svg>
                        <span style={{ fontSize:14, color:C.amber, fontWeight:700, letterSpacing:'.1em' }}>الأبطال</span>
                        <svg width="18" height="18" viewBox="0 0 20 20" style={{ opacity:.7 }}><path d="M10,1 L12.2,7.6 L19.5,7.6 L13.6,11.8 L15.8,18.4 L10,14.2 L4.2,18.4 L6.4,11.8 L0.5,7.6 L7.8,7.6 Z" fill={C.gold}/></svg>
                        <div style={{ width:50, height:1, background:`linear-gradient(90deg,${C.gold},transparent)` }}/>
                    </div>
                </div>

                {/* ── Month filters ── */}
                <div style={{ display:'flex', gap:10, flexWrap:'wrap', justifyContent:'center', marginBottom:44 }} data-reveal>
                    {[{ key:null, label:'الكل' }, ...topMonths.map(m => ({ key:m, label:monthLabel(m) }))].map(({ key, label }) => {
                        const active = activeTopMonth === key;
                        return (
                            <button key={String(key)} onClick={() => setActiveTopMonth(key)}
                                style={{ padding:'9px 22px', borderRadius:8, cursor:'pointer', fontFamily:'Cairo,sans-serif', fontSize:13, fontWeight:700, transition:'all .2s',
                                    border:`1px solid ${active ? C.amber : darkMode ? 'rgba(47,188,212,.22)' : 'rgba(47,188,212,.38)'}`,
                                    background: active ? `linear-gradient(135deg,${C.amber}30,${C.gold}18)` : darkMode ? 'rgba(47,188,212,.04)' : 'rgba(47,188,212,.06)',
                                    color: active ? C.amber : darkMode ? 'rgba(245,240,232,.5)' : 'rgba(27,58,96,.5)',
                                    boxShadow: active ? `0 0 10px ${C.amber}30` : 'none',
                                }}>
                                {label}
                            </button>
                        );
                    })}
                </div>

                {/* ── Stone tablet cards ── */}
                {filteredTop.length === 0 ? (
                    <div style={{ textAlign:'center', padding:'60px 20px', color: darkMode?'rgba(226,232,240,.3)':'rgba(27,58,96,.25)', fontSize:16 }}>
                        <div style={{ fontSize:44, marginBottom:14, opacity:.4 }}>📖</div>
                        لا توجد بيانات للطلاب الأوائل لهذا الشهر.
                    </div>
                ) : (
                    <div style={{ maxWidth:860, margin:'0 auto', display:'flex', flexDirection:'column', gap:14 }}>
                        {filteredTop.map((s) => {
                            const roman  = { 1:'١', 2:'٢', 3:'٣', 4:'٤', 5:'٥', 6:'٦', 7:'٧', 8:'٨', 9:'٩', 10:'١٠' };
                            const medal  = medalColors[s.rank-1] ?? C.gold;
                            const isTop3 = s.rank <= 3;
                            const hov    = hoveredStudent === s.id;
                            return (
                                <div key={s.id} data-reveal
                                    onMouseEnter={() => setHoveredStudent(s.id)}
                                    onMouseLeave={() => setHoveredStudent(null)}
                                    style={{
                                        position:'relative', overflow:'hidden',
                                        display:'flex', alignItems:'center', gap:22,
                                        padding: isTop3 ? '22px 28px' : '15px 24px',
                                        borderRadius:10,
                                        background: hov
                                            ? darkMode ? `linear-gradient(120deg,${medal}1c,rgba(12,22,38,.98))` : `linear-gradient(120deg,${medal}22,rgba(235,220,195,.98))`
                                            : darkMode ? 'linear-gradient(120deg,rgba(14,24,40,.95),rgba(10,18,32,.95))' : 'linear-gradient(120deg,rgba(238,225,200,.92),rgba(228,212,180,.92))',
                                        border:`1px solid ${hov ? medal+'88' : isTop3 ? medal+'38' : darkMode ? 'rgba(47,188,212,.1)' : 'rgba(47,188,212,.22)'}`,
                                        boxShadow: hov ? `0 8px 36px ${medal}30, inset 0 1px 0 ${medal}33` : isTop3 ? `0 3px 16px ${medal}14` : 'none',
                                        transform: hov ? 'translateY(-3px) scale(1.004)' : 'none',
                                        transition:'all .28s cubic-bezier(.22,1,.36,1)',
                                    }}>

                                    {/* Corner decorations for top 3 */}
                                    {isTop3 && <>
                                        <div style={{ position:'absolute', top:6, right:6,  width:13, height:13, borderTop:`1.5px solid ${medal}66`, borderRight:`1.5px solid ${medal}66` }}/>
                                        <div style={{ position:'absolute', top:6, left:6,   width:13, height:13, borderTop:`1.5px solid ${medal}66`, borderLeft:`1.5px solid ${medal}66` }}/>
                                        <div style={{ position:'absolute', bottom:6, right:6, width:13, height:13, borderBottom:`1.5px solid ${medal}66`, borderRight:`1.5px solid ${medal}66` }}/>
                                        <div style={{ position:'absolute', bottom:6, left:6,  width:13, height:13, borderBottom:`1.5px solid ${medal}66`, borderLeft:`1.5px solid ${medal}66` }}/>
                                    </>}

                                    {/* Ancient coin SVG badge */}
                                    <svg width={isTop3?56:46} height={isTop3?56:46} viewBox="0 0 56 56" fill="none" style={{ flexShrink:0, filter: hov?`drop-shadow(0 0 10px ${medal}99)`:'none', transition:'filter .28s' }}>
                                        <circle cx="28" cy="28" r="26" fill={hov?`${medal}22`:`${medal}0d`} stroke={medal} strokeWidth="1.5" opacity={hov?1:.65}/>
                                        <circle cx="28" cy="28" r="21" fill="none" stroke={medal} strokeWidth=".8" opacity={hov?.5:.28}/>
                                        {[0,60,120,180,240,300].map((deg,di) => (
                                            <circle key={di} cx={28+23*Math.cos((deg-90)*Math.PI/180)} cy={28+23*Math.sin((deg-90)*Math.PI/180)} r="1.2" fill={medal} opacity={hov?.7:.3}/>
                                        ))}
                                        <text x="28" y="34" textAnchor="middle" fontSize={isTop3?14:12} fontWeight="900" fill={medal} fontFamily="Cairo,sans-serif" opacity={hov?1:.85}>
                                            {roman[s.rank] ?? s.rank}
                                        </text>
                                    </svg>

                                    {/* Name & info */}
                                    <div style={{ flex:1 }}>
                                        <div style={{ fontSize: isTop3?18:15, fontWeight: isTop3?800:600,
                                            color: hov ? (darkMode?'#fff':C.navy) : isTop3 ? (darkMode?'#f5f0e8':C.navy) : (darkMode?'rgba(245,240,232,.68)':'rgba(27,58,96,.6)'),
                                            transition:'color .2s' }}>
                                            {s.student?.name ?? '—'}
                                        </div>
                                        {s.academic_year?.name && <div style={{ fontSize:12, color: darkMode?'rgba(47,188,212,.55)':'rgba(130,90,10,.7)', marginTop:3 }}>{s.academic_year.name}</div>}
                                        {s.notes && <div style={{ fontSize:12, color: darkMode?'rgba(245,240,232,.36)':'rgba(27,58,96,.36)', marginTop:4, fontStyle:'italic' }}>{s.notes}</div>}
                                    </div>

                                    {/* Big glowing rank — Roman numeral */}
                                    <div className="ts-rank-num" style={{
                                        fontSize: isTop3?100:76, fontWeight:900, fontFamily:'Cairo,sans-serif',
                                        lineHeight:1, userSelect:'none', pointerEvents:'none',
                                        color:medal, opacity: hov?.5:.055,
                                        textShadow: hov ? `0 0 30px ${medal}cc, 0 0 70px ${medal}66` : 'none',
                                        transition:'opacity .3s, text-shadow .3s', letterSpacing:'-.02em',
                                    }}>
                                        {roman[s.rank] ?? s.rank}
                                    </div>
                                </div>
                            );
                        })}
                    </div>
                )}
            </section>
            )}

            {/* ══════════════════════════════════════════════════════
                ABOUT THE TEACHER
            ══════════════════════════════════════════════════════ */}
            <section id="about" style={{ padding:'clamp(80px,12vh,140px) 0', position:'relative', zIndex:10 }}>
                <div style={{
                    display: 'grid',
                    gridTemplateColumns: '52% 48%',
                    direction: 'ltr',
                    minHeight: '90vh',
                    maxHeight: 800,
                }} className="about-full-grid" data-reveal>

                    {/* ── Decorative panel (left in LTR grid = visually left) ── */}
                    <div className="about-photo-side" style={{
                        position:'relative', overflow:'hidden',
                        background:'radial-gradient(circle at 45% 35%, #16304f 0%, #0c1929 55%, #050b15 100%)',
                        display:'flex', alignItems:'center', justifyContent:'center',
                    }}>
                        {/* نسيج نجمة ثمانية */}
                        <svg style={{ position:'absolute', inset:0, width:'100%', height:'100%', opacity:.07 }}>
                            <defs>
                                <pattern id="aboutStarPat" width="56" height="56" patternUnits="userSpaceOnUse">
                                    <g stroke="#2fbcd4" fill="none" strokeWidth="1">
                                        <rect x="6" y="6" width="44" height="44"/>
                                        <rect x="6" y="6" width="44" height="44" transform="rotate(45 28 28)"/>
                                    </g>
                                </pattern>
                            </defs>
                            <rect width="100%" height="100%" fill="url(#aboutStarPat)"/>
                        </svg>
                        {/* حرف الضاد */}
                        <span style={{
                            fontFamily:"'Rakkas',serif", fontSize:'clamp(220px,26vw,340px)', lineHeight:1,
                            background:'linear-gradient(160deg,#2fbcd4,#8dc63f)',
                            WebkitBackgroundClip:'text', WebkitTextFillColor:'transparent', backgroundClip:'text',
                            opacity:.9, position:'relative',
                        }}>ض</span>
                        {/* Right-side fade into content panel */}
                        <div style={{ position:'absolute', inset:0, background:'linear-gradient(to right, transparent 55%, #060e1c 100%)', pointerEvents:'none' }}/>
                        {/* Bottom fade */}
                        <div style={{ position:'absolute', bottom:0, left:0, right:0, height:'30%', background:'linear-gradient(to top, #060e1c 0%, transparent 100%)', pointerEvents:'none' }}/>
                    </div>

                    {/* ── Content side (right in LTR grid) ── */}
                    <div className="about-text-side" style={{
                        background:'#060e1c',
                        padding:'clamp(40px,5vw,72px) clamp(32px,4vw,60px) clamp(40px,5vw,72px) 0',
                        display:'flex', flexDirection:'column', justifyContent:'center', gap:24,
                        position:'relative', overflow:'hidden', direction:'rtl',
                    }}>

                        {/* Huge watermark number */}
                        <div style={{ position:'absolute', top:-30, right:-10, fontSize:260, fontWeight:900, fontFamily:'Cinzel,serif', color:C.gold, opacity:.028, lineHeight:1, userSelect:'none', pointerEvents:'none' }}>٠٣</div>

                        {/* Gold orb */}
                        <div style={{ position:'absolute', bottom:-100, left:-100, width:400, height:400, borderRadius:'50%', background:`radial-gradient(circle, rgba(47,188,212,.06) 0%, transparent 65%)`, pointerEvents:'none' }}/>

                        {/* Tag */}
                        <div style={{ display:'inline-flex', alignItems:'center', gap:10, alignSelf:'flex-start' }}>
                            <div style={{ width:36, height:1.5, background:`linear-gradient(90deg,${C.gold},transparent)` }}/>
                            <span style={{ fontSize:11, color:C.gold, letterSpacing:'.24em', fontFamily:'Cinzel,serif', opacity:.85 }}>ABOUT THE TEACHER</span>
                        </div>

                        {/* Name block */}
                        <div>
                            <h2 style={{ fontSize:'clamp(40px,4.5vw,64px)', fontFamily:'Rakkas,serif', color:'#f5ede0', lineHeight:1.1, margin:'0 0 6px' }}>
                                محمد منصور
                            </h2>
                            <div style={{ display:'flex', alignItems:'center', gap:10 }}>
                                <div style={{ width:5, height:5, borderRadius:'50%', background:C.amber }}/>
                                <span style={{ fontSize:13, color:C.amber, fontWeight:600, letterSpacing:'.06em' }}>أستاذ اللغة العربية — الثانوية العامة</span>
                            </div>
                        </div>

                        {/* Divider */}
                        <div style={{ display:'flex', alignItems:'center', gap:10 }}>
                            <div style={{ height:1, width:48, background:C.gold }}/>
                            <div style={{ height:1, flex:1, background:`linear-gradient(90deg,rgba(47,188,212,.3),transparent)` }}/>
                        </div>

                        {/* Quote */}
                        <div style={{ position:'relative', paddingRight:20, borderRight:`2px solid rgba(47,188,212,.35)` }}>
                            <p style={{ fontSize:'clamp(14px,1.5vw,18px)', fontWeight:600, color:'rgba(240,232,213,.75)', lineHeight:2.1, margin:0 }}>
                                <span style={{ fontFamily:'Rakkas,serif', fontSize:'1.35em', color:'#8dc63f', letterSpacing:'.04em' }}>يا مولانا</span>، ركّز معايا وجهّز نفسك...<br/>
                                هنذاكر بأسلوب مختلف خالص — فاهم مش حافظ<br/>
                                لحد ما <span style={{ color:C.amber, fontWeight:900 }}>الدرجة الكاملة تبقى حقك</span>
                            </p>
                        </div>

                        {/* Stats */}
                        <div style={{ display:'grid', gridTemplateColumns:'repeat(3,1fr)', gap:0, borderTop:'1px solid rgba(47,188,212,.15)', borderBottom:'1px solid rgba(47,188,212,.15)', padding:'20px 0' }}>
                            {[
                                { count:98,      suffix:'٪',  label:'نسبة النجاح' },
                                { count:2000000, prefix:'+',  label:'طالب مسجل'  },
                                { count:500,     prefix:'+',  label:'ساعة محتوى' },
                            ].map(({count,prefix='',suffix='',label}, i) => (
                                <div key={label} style={{ textAlign:'center', padding:'0 4px', borderLeft: i>0 ? '1px solid rgba(47,188,212,.15)' : 'none' }}>
                                    <div style={{ fontSize:'clamp(22px,2.4vw,34px)', fontWeight:900, color:C.gold, lineHeight:1.1 }}>
                                        {prefix}<span data-count={count}>٠</span>{suffix}
                                    </div>
                                    <div style={{ fontSize:11, color:'rgba(47,188,212,.5)', marginTop:5, letterSpacing:'.05em' }}>{label}</div>
                                </div>
                            ))}
                        </div>

                        {/* Features — minimal line style */}
                        <div style={{ display:'flex', flexDirection:'column', gap:0 }}>
                            {[
                                'شروحات فيديو تفصيلية لكل درس ووحدة',
                                'خرائط ذهنية ونماذج إعراب تثبّت المعلومة',
                                'اختبارات بنظام الوزارة ومتابعة مستمرة',
                                'دعم مباشر للطالب وولي الأمر طوال الأسبوع',
                            ].map((label, i) => (
                                <div key={i} style={{ display:'flex', alignItems:'center', gap:14, padding:'12px 0', borderBottom:'1px solid rgba(255,255,255,.04)' }}>
                                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke={C.gold} strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" style={{ flexShrink:0 }}>
                                        <polyline points="20 6 9 17 4 12"/>
                                    </svg>
                                    <span style={{ fontSize:13.5, color:'rgba(245,240,232,.65)', fontWeight:500 }}>{label}</span>
                                </div>
                            ))}
                        </div>

                        {/* CTA */}
                        <div style={{ display:'flex', gap:14, alignItems:'center', paddingTop:8 }}>
                            <Link
                                href={auth?.user ? '/student/dashboard' : '/register'}
                                style={{
                                    display:'inline-flex', alignItems:'center', gap:10,
                                    padding:'13px 30px', borderRadius:10,
                                    background:`linear-gradient(135deg,${C.amber},#6ea82d)`,
                                    color:'#fff', fontWeight:800, fontSize:14, textDecoration:'none',
                                    boxShadow:`0 8px 28px rgba(141,198,63,.35)`,
                                    transition:'transform .2s, box-shadow .2s',
                                }}
                                onMouseEnter={e=>{e.currentTarget.style.transform='translateY(-2px)';e.currentTarget.style.boxShadow=`0 14px 36px rgba(141,198,63,.55)`;}}
                                onMouseLeave={e=>{e.currentTarget.style.transform='none';e.currentTarget.style.boxShadow=`0 8px 28px rgba(141,198,63,.35)`;}}
                            >
                                اشترك دلوقتي
                                <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                                    <line x1="5" y1="12" x2="19" y2="12"/><polyline points="12 5 19 12 12 19"/>
                                </svg>
                            </Link>
                            <a href="#courses" style={{ fontSize:13, color:'rgba(47,188,212,.7)', textDecoration:'none', fontWeight:600, transition:'color .2s' }}
                                onMouseEnter={e=>e.currentTarget.style.color=C.gold}
                                onMouseLeave={e=>e.currentTarget.style.color='rgba(47,188,212,.7)'}
                            >شوف الكورسات ←</a>
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
                        <path d="M 52 0 L 0 0 0 52" fill="none" stroke={darkMode ? '#2fbcd4' : '#1b3a60'} strokeWidth=".6"/>
                    </pattern></defs>
                    <rect width="100%" height="100%" fill="url(#locGrid)"/>
                </svg>

                {/* Ambient orb */}
                <div style={{ position:'absolute', top:'20%', left:'50%', transform:'translateX(-50%)', width:600, height:300, background:`radial-gradient(ellipse, rgba(47,188,212,.${darkMode?'06':'09'}) 0%, transparent 70%)`, pointerEvents:'none' }}/>

                {/* ── Header ── */}
                <div style={{ textAlign:'center', marginBottom:'clamp(44px,7vh,72px)', position:'relative' }} data-reveal>
                    <div style={{ display:'inline-flex', alignItems:'center', gap:12, marginBottom:18 }}>
                        <div style={{ height:1, width:48, background:`linear-gradient(90deg,transparent,${darkMode?'rgba(47,188,212,.55)':'rgba(27,58,96,.4)'})` }}/>
                        <span style={{ fontSize:10, letterSpacing:'.28em', fontFamily:'Cinzel,serif', color: darkMode ? 'rgba(47,188,212,.6)' : 'rgba(27,58,96,.55)' }}>OUR CENTERS</span>
                        <div style={{ height:1, width:48, background:`linear-gradient(90deg,${darkMode?'rgba(47,188,212,.55)':'rgba(27,58,96,.4)'},transparent)` }}/>
                    </div>
                    <h2 style={{ fontSize:'clamp(28px,3.5vw,50px)', fontFamily:'Rakkas,serif', margin:'0 0 14px', color: darkMode ? C.white : C.navy }}>
                        أماكن تواجدنا
                    </h2>
                    <p style={{ fontSize:13, color: darkMode ? 'rgba(226,232,240,.42)' : 'rgba(27,58,96,.5)', letterSpacing:'.05em' }}>
                        اختار الفرع القريب منك وابدأ رحلتك مع الأستاذ محمد منصور
                    </p>
                </div>

                {/* ── Location cards — عنوان placeholder، يتحدّث ببيانات الفروع الحقيقية ── */}
                <div style={{ display:'grid', gridTemplateColumns:'repeat(auto-fit,minmax(260px,1fr))', gap:22, maxWidth:1060, margin:'0 auto', position:'relative' }}>
                    {[
                        {
                            name:    '[اسم الفرع الأول]',
                            num:     '01',
                            icon:    'M3 9l9-7 9 7v11a2 2 0 01-2 2H5a2 2 0 01-2-2z M9 22V12h6v10',
                            address: '[عنوان الفرع الأول بالتفصيل]',
                            detail:  '[أقرب علامة مميزة]',
                        },
                        {
                            name:    '[اسم الفرع الثاني]',
                            num:     '02',
                            icon:    'M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7zm0 9.5c-1.38 0-2.5-1.12-2.5-2.5s1.12-2.5 2.5-2.5 2.5 1.12 2.5 2.5-1.12 2.5-2.5 2.5z',
                            address: '[عنوان الفرع الثاني بالتفصيل]',
                            detail:  '[أقرب علامة مميزة]',
                            featured: true,
                        },
                        {
                            name:    '[اسم الفرع الثالث]',
                            num:     '03',
                            icon:    'M3 9l9-7 9 7v11a2 2 0 01-2 2H5a2 2 0 01-2-2z M9 22V12h6v10',
                            address: '[عنوان الفرع الثالث بالتفصيل]',
                            detail:  '[أقرب علامة مميزة]',
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
                    ? 'linear-gradient(180deg,#020710 0%,#03080f 60%,#050b15 100%)'
                    : '#ffffff',
                borderTop:`1px solid ${darkMode ? 'rgba(47,188,212,.18)' : 'rgba(27,58,96,.08)'}`,
                overflow:'hidden',
            }}>
                {/* Subtle grid overlay */}
                <svg style={{ position:'absolute', inset:0, width:'100%', height:'100%', opacity:.04, pointerEvents:'none' }}>
                    <defs><pattern id="ftGrid" width="60" height="60" patternUnits="userSpaceOnUse">
                        <path d="M 60 0 L 0 0 0 60" fill="none" stroke="#2fbcd4" strokeWidth=".6"/>
                    </pattern></defs>
                    <rect width="100%" height="100%" fill="url(#ftGrid)"/>
                </svg>

                {/* Ambient glow top-center */}
                <div style={{ position:'absolute', top:-80, left:'50%', transform:'translateX(-50%)', width:700, height:300, background:'radial-gradient(ellipse, rgba(47,188,212,.07) 0%, transparent 70%)', pointerEvents:'none' }}/>

                {/* ── Brand header ── */}
                <div style={{ textAlign:'center', padding:'clamp(52px,8vh,80px) clamp(24px,5vw,72px) 0', position:'relative' }}>
                    {/* Ornamental divider */}
                    <div style={{ display:'flex', alignItems:'center', justifyContent:'center', gap:16, marginBottom:36 }}>
                        <div style={{ height:1, width:80, background:'linear-gradient(90deg,transparent,rgba(47,188,212,.5))' }}/>
                        <svg width="28" height="28" viewBox="0 0 28 28" fill="none">
                            <path d="M14 2 L16.5 11.5 L26 14 L16.5 16.5 L14 26 L11.5 16.5 L2 14 L11.5 11.5 Z" fill="#2fbcd4" opacity=".8"/>
                            <circle cx="14" cy="14" r="3" fill="#8dc63f" opacity=".9"/>
                        </svg>
                        <div style={{ height:1, width:80, background:'linear-gradient(90deg,rgba(47,188,212,.5),transparent)' }}/>
                    </div>

                    {/* شعار منصة منصور — مدالية "ض" بدل الصورة القديمة */}
                    <div style={{ display:'flex', justifyContent:'center', marginBottom:28 }}>
                        <div style={{ position:'relative', display:'inline-block' }}>
                            {/* Outer glow ring */}
                            <div style={{
                                position:'absolute', inset:-20,
                                borderRadius:'50%',
                                background:'radial-gradient(ellipse,rgba(47,188,212,.14) 0%,transparent 70%)',
                                filter:'blur(10px)',
                                pointerEvents:'none',
                            }}/>
                            <div role="img" aria-label="شعار منصة منصور" style={{
                                width:'clamp(84px,11vw,112px)', height:'clamp(84px,11vw,112px)', borderRadius:'50%',
                                background:'linear-gradient(150deg,#1b3a60,#2fbcd4)',
                                display:'flex', alignItems:'center', justifyContent:'center',
                                position:'relative',
                                boxShadow:'0 0 0 1px rgba(47,188,212,.4), 0 10px 40px rgba(0,0,0,.4)',
                            }}>
                                <span style={{ fontFamily:"'Rakkas',serif", fontSize:'clamp(38px,5vw,52px)', color:'#fff' }}>ض</span>
                            </div>
                        </div>
                    </div>

                    <div style={{ fontFamily:'Cinzel,serif', fontSize:10, color: darkMode ? 'rgba(47,188,212,.45)' : 'rgba(27,58,96,.4)', letterSpacing:'0.34em', marginBottom:14 }}>
                        LUGHAT AD-DAD
                    </div>
                    <p style={{ fontSize:14, color: darkMode ? 'rgba(226,232,240,.42)' : 'rgba(27,58,96,.5)', maxWidth:400, margin:'0 auto', lineHeight:2 }}>
                        نصنع لسانًا فصيحًا يصنع مستقبلك — العربية مش حفظ، دي ذوق وفهم
                    </p>
                </div>

                {/* ── Social cards ── */}
                <div className="foot-social-grid" style={{
                    display:'grid', gridTemplateColumns:'repeat(3,1fr)',
                    gap:20, maxWidth:960, margin:'clamp(36px,5vh,56px) auto 0',
                    padding:'0 clamp(24px,5vw,72px)',
                }}>
                    {/* Facebook */}
                    <SocialCard
                        dark={darkMode}
                        href="#"
                        label="فيسبوك"
                        handle="[رابط فيسبوك المدرس]"
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
                        href="#"
                        label="يوتيوب"
                        handle="[رابط يوتيوب المدرس]"
                        glow="rgba(255,0,0,.22)"
                        borderHover="rgba(255,60,60,.55)"
                        icon={
                            <svg width="32" height="32" viewBox="0 0 24 24" fill="currentColor">
                                <path d="M23.498 6.186a3.016 3.016 0 00-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 00.502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 002.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 002.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z"/>
                            </svg>
                        }
                    />
                    {/* TikTok */}
                    <SocialCard
                        dark={darkMode}
                        href="#"
                        label="تيك توك"
                        handle="[رابط تيك توك المدرس]"
                        glow="rgba(255,255,255,.12)"
                        borderHover="rgba(255,255,255,.38)"
                        icon={
                            <svg width="30" height="30" viewBox="0 0 24 24" fill="currentColor">
                                <path d="M19.59 6.69a4.83 4.83 0 01-3.77-4.25V2h-3.45v13.67a2.89 2.89 0 01-2.88 2.5 2.89 2.89 0 01-2.89-2.89 2.89 2.89 0 012.89-2.89c.28 0 .54.04.79.1V9.01a6.34 6.34 0 00-.79-.05 6.34 6.34 0 00-6.34 6.34 6.34 6.34 0 006.34 6.34 6.34 6.34 0 006.33-6.34V8.69a8.18 8.18 0 004.79 1.53V6.77a4.85 4.85 0 01-1.02-.08z"/>
                            </svg>
                        }
                    />
                </div>

                {/* ── Navigation links ── */}
                <div style={{
                    display:'flex', justifyContent:'center', gap:'clamp(16px,3vw,40px)',
                    flexWrap:'wrap', margin:'clamp(36px,5vh,52px) auto 0',
                    padding:'0 clamp(24px,5vw,72px)',
                    borderTop:'1px solid rgba(47,188,212,.08)',
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
                            fontSize:13, color: darkMode ? 'rgba(226,232,240,.4)' : 'rgba(27,58,96,.45)',
                            textDecoration:'none', letterSpacing:'.04em',
                            transition:'color .25s ease',
                        }}
                        onMouseEnter={e=>e.currentTarget.style.color=C.gold}
                        onMouseLeave={e=>e.currentTarget.style.color= darkMode ? 'rgba(226,232,240,.4)' : 'rgba(27,58,96,.45)'}
                        >{lbl}</a>
                    ))}
                </div>

                {/* ── Bottom bar ── */}
                <div style={{
                    display:'flex', alignItems:'center', justifyContent:'center',
                    gap:16, padding:'clamp(20px,3vh,28px) clamp(24px,5vw,72px)',
                    marginTop:'clamp(24px,4vh,36px)',
                    borderTop:'1px solid rgba(47,188,212,.07)',
                }}>
                    <div style={{ width:32, height:1, background:'linear-gradient(90deg,transparent,rgba(47,188,212,.3))' }}/>
                    <div style={{ fontSize:12, color: darkMode ? 'rgba(47,188,212,.28)' : 'rgba(27,58,96,.3)', textAlign:'center', letterSpacing:'.06em' }}>
                        © 2026 منصة منصور التعليمية — جميع الحقوق محفوظة
                    </div>
                    <div style={{ width:32, height:1, background:'linear-gradient(90deg,rgba(47,188,212,.3),transparent)' }}/>
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
                href="https://wa.me/201234567890"
                target="_blank"
                rel="noopener noreferrer"
                className="wa-float-w"
                title="تواصل معنا على واتساب"
                style={{
                    position:       'fixed',
                    bottom:         28,
                    left:           28,
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