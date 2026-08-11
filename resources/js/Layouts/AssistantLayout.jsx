import React, { useState, useEffect, useRef } from 'react';
import { Link, usePage, useForm } from '@inertiajs/react';

/* ─── Brand Tokens ───────────────────────────────── */
const C = {
    navy:   '#14213D',
    navyD:  '#0D1829',
    navyL:  '#1e2e50',
    orange: '#208ef4',
    orangeD:'#0037af',
    gold:   '#DCC9A3',
    goldD:  '#c9b38e',
};

/* ─── SVG Icons ──────────────────────────────────── */
const ICONS = {
    dashboard: '<rect x="3" y="3" width="7" height="7" rx="1.5"/><rect x="14" y="3" width="7" height="7" rx="1.5"/><rect x="14" y="14" width="7" height="7" rx="1.5"/><rect x="3" y="14" width="7" height="7" rx="1.5"/>',
    users:     '<path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/><path d="M23 21v-2a4 4 0 0 0-3-3.87"/><path d="M16 3.13a4 4 0 0 1 0 7.75"/>',
    check:     '<polyline points="20 6 9 17 4 12"/>',
    exam:      '<path d="M9 5H7a2 2 0 0 0-2 2v12a2 2 0 0 0 2 2h10a2 2 0 0 0 2-2V7a2 2 0 0 0-2-2h-2"/><rect x="9" y="3" width="6" height="4" rx="2"/><path d="M9 12h6"/><path d="M9 16h4"/>',
    sheet:     '<path d="M15 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V7z"/><polyline points="14 2 14 8 20 8"/>',
    attendance:'<path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/><polyline points="16 11 18 13 22 9"/>',
    ticket:    '<path d="M2 9a3 3 0 0 1 0 6v2a2 2 0 0 0 2 2h16a2 2 0 0 0 2-2v-2a3 3 0 0 1 0-6V7a2 2 0 0 0-2-2H4a2 2 0 0 0-2 2Z"/>',
    receipt:   '<path d="M4 2v20l2-1 2 1 2-1 2 1 2-1 2 1 2-1 2 1V2l-2 1-2-1-2 1-2-1-2 1-2-1-2 1-2-1Z"/><path d="M8 7h8"/><path d="M8 11h8"/><path d="M8 15h5"/>',
    money:     '<line x1="12" y1="1" x2="12" y2="23"/><path d="M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6"/>',
    logout:    '<path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4"/><polyline points="16 17 21 12 16 7"/><line x1="21" y1="12" x2="9" y2="12"/>',
    menu:      '<line x1="3" y1="6" x2="21" y2="6"/><line x1="3" y1="12" x2="21" y2="12"/><line x1="3" y1="18" x2="21" y2="18"/>',
    close:     '<line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/>',
    video:     '<polygon points="23 7 16 12 23 17 23 7"/><rect x="1" y="5" width="15" height="14" rx="2" ry="2"/>',
    bell:      '<path d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9"/><path d="M13.73 21a2 2 0 0 1-3.46 0"/>',
};

const Icon = ({ name, size = 18 }) => (
    <svg xmlns="http://www.w3.org/2000/svg" width={size} height={size}
        viewBox="0 0 24 24" fill="none" stroke="currentColor"
        strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"
        style={{ flexShrink: 0 }}
        dangerouslySetInnerHTML={{ __html: ICONS[name] || '' }}
    />
);

/* ─── Navigation Items (تم إزالة الحضور والغياب بنجاح) ─── */
const NAV = [
    {
        section: 'الرئيسية',
        items: [
            { label: 'لوحة التحكم', icon: 'dashboard', href: '/assistant/dashboard' },
        ],
    },
    {
        section: 'إدارة الطلاب',
        items: [
            { label: 'طلبات التفعيل', icon: 'users',      href: '/assistant/student-requests' },
            { label: 'قائمة الطلاب',   icon: 'users',      href: '/assistant/students' },
        ],
    },
    {
        section: 'التصحيح والدرجات',
        items: [
            { label: 'تصحيح الشيتات',   icon: 'sheet', href: '/assistant/pending-sheets' },
            { label: 'تصحيح الامتحانات',icon: 'exam',  href: '/assistant/pending-exams' },
        ],
    },
    {
        section: 'أكواد التفعيل والتنبيهات',
        items: [
            { label: 'أكواد الشحن والفيديوهات', icon: 'ticket', href: '/assistant/promo-codes' },
            { label: 'طلبات الدفع', icon: 'money', href: '/assistant/payments' },
            { label: 'إيصالات الدفع', icon: 'receipt', href: '/assistant/payment-receipts' },
            { label: 'إرسال الإشعارات للطلاب', icon: 'bell',   href: '/assistant/notifications' }, 
        ],
    },
];

/* ─── NavItem Component ──────────────────────────── */
function NavItem({ item, collapsed, dark }) {
    const pathname = typeof window !== 'undefined' ? window.location.pathname : '';
    const isActive = pathname === item.href || (item.href !== '/assistant/dashboard' && pathname.startsWith(item.href));

    const [hovered, setHovered] = useState(false);

    return (
        <Link
            href={item.href}
            style={{
                display: 'flex',
                alignItems: 'center',
                gap: collapsed ? 0 : 10,
                padding: collapsed ? '10px 0' : '9px 14px',
                justifyContent: collapsed ? 'center' : 'flex-start',
                borderRadius: 12,
                fontSize: 13.5,
                fontFamily: 'Cairo, sans-serif',
                fontWeight: isActive ? 700 : 500,
                cursor: 'pointer',
                textDecoration: 'none',
                position: 'relative',
                overflow: 'hidden',
                transition: 'all .2s ease',
                color: isActive
                    ? (dark ? '#fff' : C.orange)
                    : (hovered ? (dark ? '#fff' : C.navy) : (dark ? 'rgba(220,201,163,.7)' : '#475569')),
                background: isActive
                    ? (dark
                        ? 'linear-gradient(270deg,rgba(244,124,32,.22) 0%,rgba(244,124,32,.08) 60%,transparent 100%)'
                        : 'rgba(244,124,32,.09)')
                    : hovered
                        ? (dark ? 'rgba(255,255,255,.05)' : 'rgba(244,124,32,.06)')
                        : 'transparent',
            }}
            onMouseEnter={() => setHovered(true)}
            onMouseLeave={() => setHovered(false)}
        >
            {isActive && (
                <span style={{
                    position: 'absolute', right: 0, top: '15%', height: '70%',
                    width: 3, borderRadius: '2px 0 0 2px',
                    background: C.orange,
                    boxShadow: `0 0 10px ${C.orange}cc`,
                }} />
            )}
            <span style={{
                color: isActive ? C.orange : (hovered ? C.orange : (dark ? 'rgba(220,201,163,.5)' : '#94a3b8')),
                transition: 'color .2s',
            }}>
                <Icon name={item.icon} size={17} />
            </span>
            {!collapsed && <span style={{ whiteSpace: 'nowrap' }}>{item.label}</span>}
        </Link>
    );
}

/* ─── Main Layout ────────────────────────────────── */
export default function AssistantLayout({ children, assistant, title }) {
    const { post, processing } = useForm();
    const [collapsed, setCollapsed] = useState(false);
    const [mobileOpen, setMobileOpen] = useState(false);
    
    // إعداد تتبع مظهر الوضع الليلي والنهاري لحساب السكرتارية
    const [darkMode, setDarkMode] = useState(() => {
        return localStorage.getItem('student-theme') === 'dark';
    });

    const sidebarRef = useRef(null);

    // تفعيل الوضع الليلي
    useEffect(() => {
        if (darkMode) {
            document.documentElement.classList.add('dark');
            localStorage.setItem('student-theme', 'dark');
        } else {
            document.documentElement.classList.remove('dark');
            localStorage.setItem('student-theme', 'light');
        }
    }, [darkMode]);

    useEffect(() => { setMobileOpen(false); }, []);

    const logout = (e) => {
        e.preventDefault();
        post(route('assistant.logout'));
    };

    const sidebarW = collapsed ? 72 : 260;

    // ألوان تفاعلية بناءً على الوضع الليلي المختار
    const bgBody = darkMode ? '#0e1726' : '#f0f3fa';
    const bgHeader = darkMode ? '#101c2c' : '#ffffff';
    const textMain = darkMode ? '#f8f9fa' : '#14213D';
    const borderTop = darkMode ? 'rgba(255,255,255,0.05)' : '#e8edf5';

    return (
        <>
            <style>{`
                @import url('https://fonts.googleapis.com/css2?family=Cairo:wght@400;500;600;700;900&display=swap');
                * { box-sizing: border-box; margin: 0; padding: 0; }
                body { font-family: 'Cairo', sans-serif; background: ${bgBody}; color: ${textMain}; transition: all 0.3s ease; }
                ::-webkit-scrollbar { width: 5px; }
                ::-webkit-scrollbar-track { background: rgba(0,0,0,.15); }
                ::-webkit-scrollbar-thumb { background: rgba(244,124,32,.4); border-radius: 4px; }
                .sb-link { text-decoration: none !important; }
                @media (max-width: 768px) {
                    .sidebar-desktop { display: none !important; }
                    .main-content { margin-right: 0 !important; }
                }
                @media (min-width: 769px) {
                    .sidebar-mobile-overlay { display: none !important; }
                    .mobile-header { display: none !important; }
                }
                @keyframes fadeInUp {
                    from { opacity: 0; transform: translateY(20px); }
                    to   { opacity: 1; transform: translateY(0); }
                }
                .page-anim { animation: fadeInUp .4s ease both; }
            `}</style>

            <div dir="rtl" style={{ display: 'flex', minHeight: '100vh', position: 'relative' }}>

                {/* ── Desktop Sidebar ── */}
                <aside
                    ref={sidebarRef}
                    className="sidebar-desktop"
                    style={{
                        width: sidebarW,
                        minHeight: '100vh',
                        position: 'fixed',
                        right: 0,
                        top: 0,
                        zIndex: 100,
                        background: darkMode
                            ? 'linear-gradient(175deg,#060B16 0%,#0D1829 40%,#101D35 70%,#0A1422 100%)'
                            : '#ffffff',
                        boxShadow: darkMode
                            ? '-4px 0 50px rgba(0,0,0,.35),inset 0 0 0 1px rgba(220,201,163,.08)'
                            : '-1px 0 0 #e2e8f0, -4px 0 24px rgba(20,33,61,.06)',
                        display: 'flex',
                        flexDirection: 'column',
                        transition: 'width .3s cubic-bezier(.4,0,.2,1), background .3s ease, box-shadow .3s ease',
                        overflow: 'hidden',
                    }}
                >
                    {/* Logo */}
                    <div style={{
                        padding: collapsed ? '22px 0' : '22px 20px',
                        borderBottom: `1px solid ${darkMode ? 'rgba(220,201,163,.1)' : '#f1f5f9'}`,
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: collapsed ? 'center' : 'space-between',
                        gap: 12,
                    }}>
                        {!collapsed && (
                            <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                                <div style={{
                                    width: 38, height: 38, borderRadius: 10,
                                    background: `linear-gradient(135deg, ${C.orange}, ${C.orangeD})`,
                                    boxShadow: `0 0 0 3px rgba(244,124,32,.2), 0 4px 12px rgba(244,124,32,.3)`,
                                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                                    flexShrink: 0,
                                    overflow: 'hidden',
                                }}>
                                    <img src="/images/teacher-logo.jpg" alt="Logo" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                                </div>
                                <div>
                                    <div style={{ color: darkMode ? C.gold : C.navy, fontSize: 13, fontWeight: 700, lineHeight: 1.2 }}>السكرتارية</div>
                                    <div style={{ color: darkMode ? 'rgba(220,201,163,.4)' : '#94a3b8', fontSize: 10 }}>الصيفي للتاريخ</div>
                                </div>
                            </div>
                        )}
                        <button
                            onClick={() => setCollapsed(v => !v)}
                            style={{
                                background: darkMode ? 'rgba(255,255,255,.06)' : 'rgba(20,33,61,.05)',
                                border: `1px solid ${darkMode ? 'rgba(220,201,163,.12)' : 'rgba(20,33,61,.1)'}`,
                                borderRadius: 8,
                                color: darkMode ? 'rgba(220,201,163,.6)' : '#64748b',
                                cursor: 'pointer',
                                padding: '6px 8px',
                                display: 'flex',
                                transition: 'all .2s',
                                flexShrink: 0,
                            }}
                        >
                            <Icon name={collapsed ? 'close' : 'menu'} size={15} />
                        </button>
                    </div>

                    {/* Nav */}
                    <nav style={{ flex: 1, overflowY: 'auto', overflowX: 'hidden', padding: collapsed ? '16px 8px' : '16px 12px' }}>
                        {NAV.map((section) => (
                            <div key={section.section} style={{ marginBottom: 20 }}>
                                {!collapsed && (
                                    <div style={{
                                        fontSize: 10, fontWeight: 700,
                                        color: darkMode ? 'rgba(220,201,163,.3)' : '#94a3b8',
                                        letterSpacing: '0.08em',
                                        textTransform: 'uppercase',
                                        padding: '0 14px',
                                        marginBottom: 6,
                                        borderBottom: `1px solid ${darkMode ? 'rgba(220,201,163,.07)' : '#f1f5f9'}`,
                                        paddingBottom: 6,
                                    }}>
                                        {section.section}
                                    </div>
                                )}
                                <div style={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
                                    {section.items.map(item => (
                                        <NavItem key={item.href} item={item} collapsed={collapsed} dark={darkMode} />
                                    ))}
                                </div>
                            </div>
                        ))}
                    </nav>

                    {/* User Footer */}
                    <div style={{
                        padding: collapsed ? '16px 8px' : '16px 14px',
                        borderTop: `1px solid ${darkMode ? 'rgba(255,255,255,.06)' : '#f1f5f9'}`,
                        background: darkMode ? 'rgba(0,0,0,.2)' : '#f8fafc',
                    }}>
                        {!collapsed && (
                            <div style={{
                                display: 'flex', alignItems: 'center', gap: 10,
                                padding: '10px 12px', borderRadius: 12,
                                background: darkMode ? 'rgba(255,255,255,.04)' : 'rgba(20,33,61,.04)',
                                border: `1px solid ${darkMode ? 'rgba(220,201,163,.1)' : '#e8edf5'}`,
                                marginBottom: 10,
                            }}>
                                <div style={{
                                    width: 36, height: 36, borderRadius: '50%',
                                    background: `linear-gradient(135deg, ${C.orange}, ${C.orangeD})`,
                                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                                    fontSize: 14, fontWeight: 700, color: '#fff', flexShrink: 0,
                                }}>
                                    {assistant?.name?.[0] ?? 'A'}
                                </div>
                                <div style={{ minWidth: 0 }}>
                                    <div style={{ color: darkMode ? C.gold : C.navy, fontSize: 13, fontWeight: 700, whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                                        {assistant?.name ?? 'المساعد'}
                                    </div>
                                    <div style={{ color: darkMode ? 'rgba(220,201,163,.4)' : '#64748b', fontSize: 10 }}>
                                        {assistant?.role === 'admin' ? 'مدير النظام' : 'مساعد / سكرتير'}
                                    </div>
                                </div>
                            </div>
                        )}
                        <form onSubmit={logout}>
                            <button
                                type="submit"
                                disabled={processing}
                                style={{
                                    width: '100%',
                                    display: 'flex', alignItems: 'center',
                                    justifyContent: collapsed ? 'center' : 'flex-start',
                                    gap: 8,
                                    padding: collapsed ? '10px 0' : '9px 14px',
                                    borderRadius: 10,
                                    background: 'transparent',
                                    border: `1px solid ${darkMode ? 'rgba(239,68,68,.2)' : 'rgba(239,68,68,.25)'}`,
                                    color: darkMode ? 'rgba(239,68,68,.7)' : '#dc2626',
                                    cursor: processing ? 'not-allowed' : 'pointer',
                                    fontSize: 13,
                                    fontFamily: 'Cairo, sans-serif',
                                    fontWeight: 600,
                                    transition: 'all .2s',
                                }}
                                onMouseEnter={e => {
                                    e.currentTarget.style.background = 'rgba(239,68,68,.1)';
                                    e.currentTarget.style.color = '#ef4444';
                                }}
                                onMouseLeave={e => {
                                    e.currentTarget.style.background = 'transparent';
                                    e.currentTarget.style.color = darkMode ? 'rgba(239,68,68,.7)' : '#dc2626';
                                }}
                            >
                                <Icon name="logout" size={15} />
                                {!collapsed && <span>تسجيل الخروج</span>}
                            </button>
                        </form>
                    </div>
                </aside>

                {/* ── Mobile Header ── */}
                <header className="mobile-header" style={{
                    position: 'fixed', top: 0, left: 0, right: 0, zIndex: 200,
                    background: darkMode ? '#101c2c' : C.navy,
                    boxShadow: '0 4px 20px rgba(0,0,0,.3)',
                    display: 'flex', alignItems: 'center', justifyContent: 'space-between',
                    padding: '14px 20px',
                    transition: 'background 0.3s ease'
                }}>
                    <span style={{ color: C.gold, fontSize: 16, fontWeight: 700 }}>السكرتارية</span>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 14 }}>
                        <button 
                            type="button"
                            onClick={() => setDarkMode(!darkMode)}
                            style={{ background: 'none', border: 'none', color: '#fff', cursor: 'pointer', fontSize: 16 }}
                        >
                            {darkMode ? '☀️' : '🌙'}
                        </button>
                        <button
                            onClick={() => setMobileOpen(v => !v)}
                            style={{ background: 'none', border: 'none', color: C.gold, cursor: 'pointer' }}
                        >
                            <Icon name={mobileOpen ? 'close' : 'menu'} size={22} />
                        </button>
                    </div>
                </header>

                {/* ── Mobile Sidebar Overlay ── */}
                {mobileOpen && (
                    <div
                        className="sidebar-mobile-overlay"
                        onClick={() => setMobileOpen(false)}
                        style={{
                            position: 'fixed', inset: 0, zIndex: 300,
                            background: 'rgba(0,0,0,.6)', backdropFilter: 'blur(4px)',
                        }}
                    />
                )}

                {/* ── Main Content ── */}
                <main
                    className="main-content page-anim"
                    style={{
                        flex: 1,
                        marginRight: sidebarW,
                        minHeight: '100vh',
                        transition: 'margin-right .3s cubic-bezier(.4,0,.2,1)',
                        background: bgBody,
                    }}
                >
                    {/* Top Bar */}
                    <div style={{
                        background: bgHeader,
                        borderBottom: `1px solid ${borderTop}`,
                        padding: '16px 28px',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'space-between',
                        boxShadow: '0 2px 12px rgba(20,33,61,.06)',
                        transition: 'all 0.3s ease'
                    }}>
                        <h1 style={{ fontSize: 18, fontWeight: 800, color: textMain, margin: 0 }}>
                            {title || 'لوحة السكرتارية'}
                        </h1>
                        <div style={{ display: 'flex', alignItems: 'center', gap: 14 }}>
                            <button 
                                type="button"
                                onClick={() => setDarkMode(!darkMode)}
                                style={{
                                    border: 'none',
                                    width: 36, height: 36, borderRadius: '50%',
                                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                                    fontSize: 16, cursor: 'pointer', color: darkMode ? '#F47C20' : '#475569', transition: '0.2s',
                                    boxShadow: '0 2px 8px rgba(0,0,0,0.08)',
                                    background: darkMode ? 'rgba(255,255,255,0.1)' : '#f1f5f9'
                                }}
                                onMouseEnter={e => e.currentTarget.style.background = 'rgba(255,255,255,0.15)'}
                                onMouseLeave={e => { e.currentTarget.style.background = darkMode ? 'rgba(255,255,255,0.1)' : '#f1f5f9'; }}
                                title="تغيير مظهر المنصة"
                            >
                                {darkMode ? '☀️' : '🌙'}
                            </button>
                            
                            <div style={{
                                padding: '6px 14px', borderRadius: 20,
                                background: `linear-gradient(135deg, ${C.navy}, ${C.navyL})`,
                                color: C.gold, fontSize: 12, fontWeight: 700,
                            }}>
                                {assistant?.name ?? 'المساعد'}
                            </div>
                        </div>
                    </div>

                    {/* Page Content */}
                    <div style={{ padding: '28px', maxWidth: 1200, margin: '0 auto' }}>
                        {children}
                    </div>
                </main>
            </div>
        </>
    );
}

function LogoRing() {
    return (
        <div style={{
            width: 42, height: 42, borderRadius: '50%',
            border: `2.5px solid ${O}`,
            background: 'rgba(244,124,32,.12)',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            flexShrink: 0,
            overflow: 'hidden',
            boxShadow: '0 2px 8px rgba(244,124,32,0.25)'
        }}>
            <img 
                src="/images/teacher-logo.jpg" 
                alt="Teacher Logo" 
                style={{ width: '100%', height: '100%', objectFit: 'cover' }}
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
