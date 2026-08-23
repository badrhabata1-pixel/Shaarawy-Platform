import { Link, usePage, router } from '@inertiajs/react';
import { useState, useEffect, useRef } from 'react';

const O = '#0D9488';   // كان برتقالي (F47C20) → بقى تركواز غامق (زي لوحة الأدمن)
const N = '#14213D';
const B = '#DCC9A3';
const G = '#2DD4BF';   // تركواز فاتح — بديل اللون الدهبي (C9A14A) في كل الملف

/* ── أسماء صور الخلفية — حطهم في public/images/ ─────────
   bg-pattern-light.jpg  → تظهر في الوضع النهاري (الفاتح)
   bg-pattern-dark.jpg   → تظهر في الوضع الليلي (الغامق)
─────────────────────────────────────────────────────── */
const BG_IMAGE_LIGHT = '/images/bg-pattern-light.jpg';
const BG_IMAGE_DARK  = '/images/bg-pattern-dark.jpg';

/* ── History emoji floating layer ─────────────────────── */
const BG_EMOJIS = [
    { e:'🏛️', x: 2,  y: 7,  s:40, d:0,    dr:14 },
    { e:'📜',  x: 7,  y:50,  s:30, d:1.5,  dr:18 },
    { e:'⚔️',  x: 4,  y:76,  s:34, d:3,    dr:12 },
    { e:'🏺',  x:15,  y:28,  s:26, d:2,    dr:16 },
    { e:'🗿',  x:21,  y:67,  s:36, d:0.7,  dr:20 },
    { e:'🧭',  x:84,  y: 6,  s:32, d:1,    dr:15 },
    { e:'📿',  x:91,  y:37,  s:26, d:3.5,  dr:13 },
    { e:'🎭',  x:87,  y:61,  s:28, d:0.5,  dr:17 },
    { e:'🗺️',  x:76,  y:82,  s:34, d:2.8,  dr:11 },
    { e:'⏳',  x:47,  y: 2,  s:26, d:4,    dr:19 },
    { e:'🔭',  x:63,  y:87,  s:30, d:1.2,  dr:14 },
    { e:'🦅',  x:38,  y:84,  s:28, d:2,    dr:16 },
    { e:'🌿',  x:28,  y:90,  s:22, d:3.8,  dr:12 },
    { e:'🔮',  x:70,  y: 4,  s:26, d:0.3,  dr:18 },
    { e:'🏆',  x:53,  y:92,  s:30, d:5,    dr:22 },
    { e:'⚱️',  x:44,  y:14,  s:22, d:2.5,  dr:15 },
    { e:'🏛️',  x:59,  y:46,  s:18, d:6,    dr:20 },
    { e:'📜',  x:33,  y:40,  s:16, d:4.5,  dr:17 },
];

export default function StudentLayout({ children, title, student: studentProp }) {
    const [menuOpen, setMenuOpen] = useState(false);
    const [profileMenuOpen, setProfileMenuOpen] = useState(false);
    const [notifMenuOpen, setNotifMenuOpen] = useState(false);

    // إعداد الوضع الليلي والنهاري التفاعلي
    const [darkMode, setDarkMode] = useState(() => {
        return localStorage.getItem('student-theme') === 'dark';
    });

    const { url, props } = usePage();
    const dropdownRef = useRef(null);
    const notifRef = useRef(null);

    const student = studentProp || props.student || props.auth?.user || props.auth?.student || {
        full_name: 'طالب منصور',
        initials:  'ص',
        avatar:    null,
    };

    const notifications = props.notifications || [
        { id: 1, text: '📢 تم رفع المحاضرة الثانية لصفك الدراسي الآن، بادر بالمشاهدة والحل!', date: 'منذ ساعتين' },
        { id: 2, text: '✍️ تذكير: يجب اجتياز اختبار المحاضرة الأولى لتتمكن من تصفح باقي المنهج.', date: 'منذ يوم' }
    ];

    const navItems = [
        { href: route('student.dashboard'), label: 'الرئيسية',  icon: '🏠', match: '/student/dashboard' },
        { href: route('student.lessons'),   label: 'المحاضرات', icon: '🎬', match: '/student/lessons'   },
        { href: route('student.exams'),     label: 'الامتحانات', icon: '📝', match: '/student/exams'     },
    ];

    const isActive = (match) => url.startsWith(match);
    const logout = () => router.post(route('student.logout'));

    // تفعيل الوضع الليلي وتخزينه
    useEffect(() => {
        if (darkMode) {
            document.documentElement.classList.add('dark');
            localStorage.setItem('student-theme', 'dark');
        } else {
            document.documentElement.classList.remove('dark');
            localStorage.setItem('student-theme', 'light');
        }
    }, [darkMode]);

    useEffect(() => {
        function handleClickOutside(event) {
            if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
                setProfileMenuOpen(false);
            }
            if (notifRef.current && !notifRef.current.contains(event.target)) {
                setNotifMenuOpen(false);
            }
        }
        document.addEventListener('mousedown', handleClickOutside);
        return () => document.removeEventListener('mousedown', handleClickOutside);
    }, []);

    const bgCard = darkMode ? '#152238' : '#ffffff';
    const textMain = darkMode ? '#f8f9fa' : '#14213D';

    return (
        <div style={{ minHeight: '100vh', background: 'transparent', color: textMain, fontFamily: "'Cairo', sans-serif", direction: 'rtl', transition: 'all 0.3s ease' }}>
            <style>{`
                body,html{
                    background:${darkMode
                        ? `linear-gradient(rgba(8,17,31,0.82),rgba(8,17,31,0.82)), url('${BG_IMAGE_DARK}')`
                        : `linear-gradient(rgba(255,255,255,0.55),rgba(255,255,255,0.55)), url('${BG_IMAGE_LIGHT}')`
                    }!important;
                    background-size: cover !important;
                    background-position: center !important;
                    background-repeat: no-repeat !important;
                    background-attachment: fixed !important;
                    margin:0;
                }
                @keyframes bgFloat{
                    0%,100%{transform:translateY(0) rotate(0deg);}
                    33%    {transform:translateY(-16px) rotate(5deg);}
                    66%    {transform:translateY(9px) rotate(-4deg);}
                }
                .nav-desktop    { display:flex; }
                .nav-mobile-btn { display:none; }
                @media(max-width:1023px){
                    .nav-bar        { height:68px!important; padding:0 0.75rem!important; }
                    .nav-logo-img   { height:52px!important; }
                    .nav-desktop    { display:none!important; }
                    .nav-mobile-btn { display:flex!important; }
                }
            `}</style>

            <GoogleFonts />

            {/* ── Navbar wrapper — floating glass ── */}
            <div style={{
                position:  'sticky',
                top:       10,
                zIndex:    50,
                padding:   '0 14px',
                pointerEvents: 'none',
            }}>
            <nav className="nav-bar" style={{
                background:      darkMode ? 'rgba(8,14,26,0.80)' : 'rgba(10,20,44,0.78)',
                backdropFilter:  'blur(28px) saturate(2)',
                WebkitBackdropFilter: 'blur(28px) saturate(2)',
                color:           '#fff',
                padding:         '0 1.5rem',
                height:          110,
                display:         'flex',
                alignItems:      'center',
                justifyContent:  'space-between',
                borderRadius:    18,
                border:          '1px solid rgba(45,212,191,.2)',
                borderTop:       '2px solid rgba(45,212,191,.5)',
                boxShadow:       '0 8px 40px rgba(0,0,0,.55), 0 2px 8px rgba(0,0,0,.3), inset 0 1px 0 rgba(45,212,191,.12)',
                transition:      'background .3s ease, box-shadow .3s ease',
                pointerEvents:   'auto',
                position:        'relative',
                overflow:        'visible',
            }}>

                {/* Logo */}
                <Link href="/" style={{ display:'flex', alignItems:'center', gap:8, textDecoration:'none', flexShrink:0 }}>
                    <LogoRing dark={darkMode} />
                </Link>

                {/* Right side controls */}
                <div style={{ display:'flex', gap:8, alignItems:'center' }}>

                    {/* Nav links — desktop only */}
                    <div className="nav-desktop" style={{ gap:8, alignItems:'center' }}>
                        {navItems.map(item => (
                            <Link
                                key={item.href}
                                href={item.href}
                                style={{
                                    color:          isActive(item.match) ? G : 'rgba(255,255,255,.6)',
                                    textDecoration: 'none',
                                    fontWeight:     700,
                                    fontSize:       13,
                                    padding:        '7px 18px',
                                    borderRadius:   10,
                                    background:     isActive(item.match) ? 'rgba(45,212,191,.1)' : 'transparent',
                                    border:         isActive(item.match) ? '1px solid rgba(45,212,191,.28)' : '1px solid transparent',
                                    transition:     'all .2s',
                                    display:        'flex',
                                    alignItems:     'center',
                                    gap:            7,
                                }}
                                onMouseEnter={e => { if (!isActive(item.match)) { e.currentTarget.style.color='rgba(255,255,255,.9)'; e.currentTarget.style.background='rgba(255,255,255,.05)'; }}}
                                onMouseLeave={e => { if (!isActive(item.match)) { e.currentTarget.style.color='rgba(255,255,255,.6)'; e.currentTarget.style.background='transparent'; }}}
                            >
                                <span style={{ fontSize:15 }}>{item.icon}</span>{item.label}
                            </Link>
                        ))}
                    </div>

                    {/* Theme toggle — desktop only */}
                    <button
                        className="nav-desktop"
                        type="button"
                        onClick={() => setDarkMode(!darkMode)}
                        style={{
                            background: 'rgba(255,255,255,0.06)', border: '1px solid rgba(255,255,255,.1)',
                            width: 36, height: 36, borderRadius: 10,
                            alignItems: 'center', justifyContent: 'center',
                            fontSize: 15, cursor: 'pointer', color: 'rgba(255,255,255,.75)',
                            transition: 'all .2s', flexShrink: 0,
                        }}
                        onMouseEnter={e => { e.currentTarget.style.background='rgba(45,212,191,.12)'; e.currentTarget.style.borderColor='rgba(45,212,191,.3)'; }}
                        onMouseLeave={e => { e.currentTarget.style.background='rgba(255,255,255,0.06)'; e.currentTarget.style.borderColor='rgba(255,255,255,.1)'; }}
                        title="تغيير المظهر"
                    >
                        {darkMode ? '☀️' : '🌙'}
                    </button>

                    {/* Notifications — desktop only */}
                    <div ref={notifRef} className="nav-desktop" style={{ position:'relative' }}>
                        <button
                            type="button"
                            onClick={() => setNotifMenuOpen(!notifMenuOpen)}
                            style={{
                                background: 'rgba(255,255,255,0.06)', border: '1px solid rgba(255,255,255,.1)',
                                width: 36, height: 36, borderRadius: 10,
                                display: 'flex', alignItems: 'center', justifyContent: 'center',
                                fontSize: 15, cursor: 'pointer', color: 'rgba(255,255,255,.75)',
                                transition: 'all .2s', position: 'relative', flexShrink: 0,
                            }}
                            onMouseEnter={e => { e.currentTarget.style.background='rgba(45,212,191,.12)'; e.currentTarget.style.borderColor='rgba(45,212,191,.3)'; }}
                            onMouseLeave={e => { e.currentTarget.style.background='rgba(255,255,255,0.06)'; e.currentTarget.style.borderColor='rgba(255,255,255,.1)'; }}
                        >
                            <span>🔔</span>
                            {notifications.length > 0 && (
                                <span style={{ position:'absolute', top:6, right:6, width:7, height:7, borderRadius:'50%', background:'#ef4444', display:'block' }} />
                            )}
                        </button>
                        {notifMenuOpen && (
                            <div style={{
                                position:'absolute', top:48, left:0,
                                background:bgCard, border:'1px solid rgba(45,212,191,0.3)', borderRadius:12,
                                boxShadow:'0 8px 30px rgba(0,0,0,0.25)', width:280,
                                zIndex:100, display:'flex', flexDirection:'column', overflow:'hidden',
                            }}>
                                <div style={{ padding:'12px 16px', background:N, color:'#fff', fontWeight:900, fontSize:13, textAlign:'right' }}>
                                    📢 الإشعارات الأخيرة
                                </div>
                                <div style={{ display:'flex', flexDirection:'column', maxHeight:300, overflowY:'auto' }}>
                                    {notifications.map(n => (
                                        <div key={n.id} style={{ padding:'12px 16px', borderBottom:'1px solid rgba(0,0,0,0.05)', fontSize:11.5, lineHeight:1.5, textAlign:'right', color:textMain }}>
                                            <div>{n.text}</div>
                                            <span style={{ fontSize:9, color:'#888', marginTop:4, display:'block' }}>{n.date}</span>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        )}
                    </div>

                    {/* Profile Button — always visible, name hidden on mobile */}
                    <div ref={dropdownRef} style={{ position:'relative' }}>
                        <button
                            type="button"
                            onClick={() => setProfileMenuOpen(!profileMenuOpen)}
                            style={{
                                display:'flex', alignItems:'center', gap:8,
                                background:'rgba(255,255,255,.07)', padding:'5px 10px 5px 5px',
                                borderRadius:40, border:'1px solid rgba(255,255,255,.12)',
                                cursor:'pointer', transition:'all .2s',
                            }}
                            onMouseEnter={e => { e.currentTarget.style.background='rgba(45,212,191,.1)'; e.currentTarget.style.borderColor='rgba(45,212,191,.25)'; }}
                            onMouseLeave={e => { e.currentTarget.style.background='rgba(255,255,255,.07)'; e.currentTarget.style.borderColor='rgba(255,255,255,.12)'; }}
                        >
                            <div style={{
                                width:32, height:32, borderRadius:'50%',
                                background:`linear-gradient(135deg,${O},#0b6b62)`,
                                display:'flex', alignItems:'center', justifyContent:'center',
                                fontSize:12, fontWeight:900, color:'#fff', flexShrink:0,
                                boxShadow:'0 2px 8px rgba(13,148,136,.35)',
                            }}>
                                {student.initials || 'ص'}
                            </div>
                            <span className="nav-desktop" style={{ fontSize:12.5, fontWeight:700, color:'rgba(255,255,255,.9)', whiteSpace:'nowrap' }}>
                                {(student.full_name || '').split(' ')[0] || 'طالب'}
                            </span>
                            <span className="nav-desktop" style={{ fontSize:9, color:'rgba(255,255,255,.35)' }}>▾</span>
                        </button>
                        {profileMenuOpen && (
                            <div style={{
                                position:'absolute', top:54, left:0,
                                background:bgCard, border:'1px solid rgba(45,212,191,0.2)', borderRadius:10,
                                boxShadow:'0 8px 24px rgba(0,0,0,.12)', width:200, zIndex:100, overflow:'hidden',
                            }}>
                                <div style={{ padding:'14px 16px', borderBottom:'1px solid rgba(0,0,0,0.05)', background:darkMode?'#1a2636':'#fafafa', textAlign:'right' }}>
                                    <div style={{ fontSize:13, fontWeight:800, color:textMain }}>{student.full_name}</div>
                                    <div style={{ fontSize:11, color:'#888', marginTop:2 }}>{student.email}</div>
                                </div>
                                <Link href={route('student.profile')} onClick={() => setProfileMenuOpen(false)}
                                    style={{ padding:'12px 16px', color:textMain, textDecoration:'none', fontSize:13, fontWeight:800, borderBottom:'1px solid rgba(0,0,0,0.05)', textAlign:'right', display:'flex', alignItems:'center', gap:8 }}>
                                    👤 الملف الشخصي
                                </Link>
                                <button type="button" onClick={logout}
                                    style={{ padding:'12px 16px', color:'#EF4444', border:'none', background:'transparent', textAlign:'right', fontSize:13, fontWeight:800, cursor:'pointer', width:'100%', display:'flex', alignItems:'center', gap:8, fontFamily:"'Cairo',sans-serif" }}>
                                    🚪 تسجيل الخروج
                                </button>
                            </div>
                        )}
                    </div>

                    {/* Logout shortcut — desktop only */}
                    <button
                        className="nav-desktop"
                        onClick={logout}
                        style={{
                            background:'transparent', border:'1px solid rgba(239,68,68,.35)',
                            color:'rgba(239,68,68,.8)', borderRadius:10,
                            width:36, height:36, fontSize:15, cursor:'pointer',
                            alignItems:'center', justifyContent:'center',
                            transition:'all .2s', flexShrink:0,
                        }}
                        onMouseEnter={e => { e.currentTarget.style.background='rgba(239,68,68,.15)'; e.currentTarget.style.borderColor='rgba(239,68,68,.6)'; e.currentTarget.style.color='#ef4444'; }}
                        onMouseLeave={e => { e.currentTarget.style.background='transparent'; e.currentTarget.style.borderColor='rgba(239,68,68,.35)'; e.currentTarget.style.color='rgba(239,68,68,.8)'; }}
                        title="تسجيل الخروج"
                    >
                        🚪
                    </button>

                    {/* Hamburger — mobile only */}
                    <button
                        className="nav-mobile-btn"
                        onClick={() => setMenuOpen(!menuOpen)}
                        style={{
                            background: menuOpen ? 'rgba(45,212,191,.15)' : 'rgba(255,255,255,.06)',
                            border:     '1.5px solid rgba(255,255,255,.18)',
                            color:      '#fff', fontSize:20, cursor:'pointer',
                            width:40, height:40, borderRadius:10,
                            alignItems:'center', justifyContent:'center', flexShrink:0,
                            transition:'all .2s',
                        }}
                    >
                        {menuOpen ? '✕' : '☰'}
                    </button>
                </div>
            </nav>
            </div>{/* end floating wrapper */}

            {/* Mobile Menu — fixed below navbar */}
            {menuOpen && (
                <div style={{
                    position:      'fixed',
                    top:           88,
                    left:          14,
                    right:         14,
                    background:    'rgba(8,16,34,0.97)',
                    backdropFilter:'blur(24px)',
                    WebkitBackdropFilter:'blur(24px)',
                    border:        '1px solid rgba(45,212,191,.22)',
                    borderRadius:  16,
                    padding:       '8px 12px 14px',
                    display:       'flex',
                    flexDirection: 'column',
                    gap:           2,
                    zIndex:        49,
                    boxShadow:     '0 20px 50px rgba(0,0,0,.55)',
                }}>
                    {/* Student info header */}
                    <div style={{ padding:'10px 6px 10px', borderBottom:'1px solid rgba(45,212,191,.12)', marginBottom:4, display:'flex', alignItems:'center', gap:10 }}>
                        <div style={{ width:36, height:36, borderRadius:'50%', background:`linear-gradient(135deg,${O},#0b6b62)`, display:'flex', alignItems:'center', justifyContent:'center', fontSize:14, fontWeight:900, color:'#fff', flexShrink:0 }}>
                            {student.initials || 'ص'}
                        </div>
                        <div>
                            <div style={{ fontSize:13, fontWeight:800, color:G }}>{student.full_name}</div>
                            <div style={{ fontSize:10, color:'rgba(255,255,255,.4)', marginTop:1 }}>{student.email}</div>
                        </div>
                    </div>

                    {/* Nav links */}
                    {navItems.map(item => (
                        <Link key={item.href} href={item.href} onClick={() => setMenuOpen(false)} style={{
                            color:          isActive(item.match) ? O : 'rgba(255,255,255,.88)',
                            textDecoration: 'none', fontWeight:800,
                            padding:        '12px 8px',
                            display:        'flex', alignItems:'center', gap:12,
                            borderBottom:   '1px solid rgba(255,255,255,.05)',
                            fontSize:       14,
                            background:     isActive(item.match) ? 'rgba(13,148,136,.09)' : 'transparent',
                            borderRadius:   8,
                        }}>
                            <span style={{ fontSize:20, width:26, textAlign:'center' }}>{item.icon}</span>
                            {item.label}
                        </Link>
                    ))}

                    {/* Profile link */}
                    <Link href={route('student.profile')} onClick={() => setMenuOpen(false)} style={{
                        color:'rgba(255,255,255,.88)', textDecoration:'none', fontWeight:800,
                        padding:'12px 8px', display:'flex', alignItems:'center', gap:12,
                        borderBottom:'1px solid rgba(255,255,255,.05)', fontSize:14, borderRadius:8,
                    }}>
                        <span style={{ fontSize:20, width:26, textAlign:'center' }}>👤</span>
                        الملف الشخصي
                    </Link>

                    {/* Theme toggle */}
                    <button type="button" onClick={() => { setDarkMode(!darkMode); setMenuOpen(false); }} style={{
                        background:'rgba(255,255,255,.04)', border:'1px solid rgba(255,255,255,.08)',
                        borderRadius:8, padding:'12px 8px',
                        color:'rgba(255,255,255,.88)', fontWeight:800, cursor:'pointer',
                        fontFamily:"'Cairo',sans-serif", fontSize:14,
                        display:'flex', alignItems:'center', gap:12, textAlign:'right',
                    }}>
                        <span style={{ fontSize:20, width:26, textAlign:'center' }}>{darkMode ? '☀️' : '🌙'}</span>
                        {darkMode ? 'الوضع النهاري' : 'الوضع الليلي'}
                    </button>

                    {/* Logout */}
                    <button onClick={logout} style={{
                        background:'rgba(239,68,68,.1)', color:'#f87171',
                        border:'1px solid rgba(239,68,68,.22)', borderRadius:8,
                        padding:'12px 8px', fontWeight:800, cursor:'pointer',
                        fontFamily:"'Cairo',sans-serif", fontSize:14,
                        display:'flex', alignItems:'center', gap:12, marginTop:4,
                    }}>
                        <span style={{ fontSize:20, width:26, textAlign:'center' }}>🚪</span>
                        تسجيل الخروج
                    </button>
                </div>
            )}

            {/* Content */}
            <main style={{ maxWidth:1200, margin:'0 auto', padding:'1.5rem 1rem 2.5rem' }}>
                {title && (
                    <div style={{ marginBottom:'1.5rem', paddingBottom:'1rem', borderBottom:`2px solid ${B}40` }}>
                        <h1 style={{ color: textMain, fontSize:24, fontWeight:900, margin:0 }}>
                            {title}
                        </h1>
                    </div>
                )}
                {children}
            </main>

            {/* WhatsApp Float */}
            <WhatsAppBtn />
        </div>
    );
}

const WA_NUMBER = '201097694425';

function WhatsAppBtn() {
    return (
        <>
            <style>{`
                @keyframes waPulse {
                    0%   { box-shadow: 0 0 0 0 rgba(37,211,102,.55); }
                    70%  { box-shadow: 0 0 0 14px rgba(37,211,102,0); }
                    100% { box-shadow: 0 0 0 0 rgba(37,211,102,0); }
                }
                .wa-float { animation: waPulse 2.2s ease-out infinite; }
                .wa-float:hover { transform: scale(1.1) !important; }
            `}</style>

            <a
                href={`https://wa.me/${WA_NUMBER}`}
                target="_blank"
                rel="noopener noreferrer"
                className="wa-float"
                title="تواصل معنا على واتساب"
                style={{
                    position:        'fixed',
                    bottom:          28,
                    left:            28,
                    width:           58,
                    height:          58,
                    borderRadius:    '50%',
                    background:      'linear-gradient(135deg,#25d366,#128c4a)',
                    display:         'flex',
                    alignItems:      'center',
                    justifyContent:  'center',
                    zIndex:          9999,
                    textDecoration:  'none',
                    transition:      'transform .2s ease',
                    boxShadow:       '0 4px 20px rgba(37,211,102,.45)',
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

function LogoRing({ dark = true }) {
    const logoFilter = dark
        ? 'drop-shadow(0 0 12px rgba(45,212,191,.45))'
        : 'brightness(0) saturate(100%) invert(16%) sepia(26%) saturate(1532%) hue-rotate(175deg) brightness(92%) contrast(94%) drop-shadow(0 2px 8px rgba(20,33,61,.18))';

    return (
        <div
            className="nav-logo-img"
            style={{
                height: 100,
                width: 86,
                overflow: 'hidden',
                flexShrink: 0,
                position: 'relative',
                transition: 'height .3s ease',
            }}
        >
            <img
                src="/images/منصور لوجو.png"
                alt="منصور"
                style={{
                    height: '100%',
                    width: 'auto',
                    objectFit: 'contain',
                    objectPosition: 'left center',
                    filter: logoFilter,
                    display: 'block',
                }}
            />
        </div>
    );
}

function GoogleFonts() {
    return (
        <link
            href="https://fonts.googleapis.com/css2?family=Cinzel:wght@400;700&family=Cairo:wght@400;600;700;800;900&display=swap"
            rel="stylesheet"
        />
    );
}
