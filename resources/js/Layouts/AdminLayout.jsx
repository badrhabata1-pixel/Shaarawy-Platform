import React, { useState, useEffect, useRef } from 'react';
import { Link, usePage, router } from '@inertiajs/react';
import gsap from 'gsap';

/* ─── ICON LIBRARY ───────────────────────────────── */
const ICONS = {
    dashboard: '<rect x="3" y="3" width="7" height="7" rx="1.5"/><rect x="14" y="3" width="7" height="7" rx="1.5"/><rect x="14" y="14" width="7" height="7" rx="1.5"/><rect x="3" y="14" width="7" height="7" rx="1.5"/>',
    users:     '<path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/><path d="M23 21v-2a4 4 0 0 0-3-3.87"/><path d="M16 3.13a4 4 0 0 1 0 7.75"/>',
    book:      '<path d="M4 19.5A2.5 2.5 0 0 1 6.5 17H20"/><path d="M6.5 2H20v20H6.5A2.5 2.5 0 0 1 4 19.5v-15A2.5 2.5 0 0 1 6.5 2z"/>',
    file:      '<path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/><polyline points="14 2 14 8 20 8"/>',
    groups:    '<path d="M14 19a6 6 0 0 0-12 0"/><circle cx="8" cy="9" r="4"/><path d="M22 19a6 6 0 0 0-6-6 4 4 0 1 0 0-8"/>',
    money:     '<line x1="12" y1="1" x2="12" y2="23"/><path d="M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6"/>',
    ticket:    '<path d="M2 9a3 3 0 0 1 0 6v2a2 2 0 0 0 2 2h16a2 2 0 0 0 2-2v-2a3 3 0 0 1 0-6V7a2 2 0 0 0-2-2H4a2 2 0 0 0-2 2Z"/>',
    tag:       '<path d="M20.59 13.41l-7.17 7.17a2 2 0 0 1-2.83 0L2 12V2h10l8.59 8.59a2 2 0 0 1 0 2.82z"/><line x1="7" y1="7" x2="7.01" y2="7"/>',
    bell:      '<path d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9"/><path d="M13.73 21a2 2 0 0 1-3.46 0"/>',
    search:    '<circle cx="11" cy="11" r="8"/><line x1="21" y1="21" x2="16.65" y2="16.65"/>',
    logout:    '<path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4"/><polyline points="16 17 21 12 16 7"/><line x1="21" y1="12" x2="9" y2="12"/>',
    chevron:   '<polyline points="6 9 12 15 18 9"/>',
    menu:      '<line x1="3" y1="6" x2="21" y2="6"/><line x1="3" y1="12" x2="21" y2="12"/><line x1="3" y1="18" x2="21" y2="18"/>',
    close:     '<line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/>',
    classes:   '<rect x="2" y="3" width="20" height="14" rx="2"/><line x1="8" y1="21" x2="16" y2="21"/><line x1="12" y1="17" x2="12" y2="21"/>',
    sheet:     '<path d="M15 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V7z"/><polyline points="14 2 14 8 20 8"/>',
    exam:      '<path d="M9 5H7a2 2 0 0 0-2 2v12a2 2 0 0 0 2 2h10a2 2 0 0 0 2-2V7a2 2 0 0 0-2-2h-2"/><rect x="9" y="3" width="6" height="4" rx="2"/><path d="M9 12h6"/><path d="M9 16h4"/>',
    comment:   '<path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"/>',
    trophy:    '<path d="M6 9H4.5a2.5 2.5 0 0 1 0-5H6"/><path d="M18 9h1.5a2.5 2.5 0 0 0 0-5H18"/><path d="M4 22h16"/><path d="M10 14.66V17c0 .55-.47.98-.97 1.21C7.85 18.75 7 20.24 7 22"/><path d="M14 14.66V17c0 .55.47.98.97 1.21C16.15 18.75 17 20.24 17 22"/><path d="M18 2H6v7a6 6 0 0 0 12 0V2z"/>',
    sun:       '<circle cx="12" cy="12" r="5"/><line x1="12" y1="1" x2="12" y2="3"/><line x1="12" y1="21" x2="12" y2="23"/><line x1="4.22" y1="4.22" x2="5.64" y2="5.64"/><line x1="18.36" y1="18.36" x2="19.78" y2="19.78"/><line x1="1" y1="12" x2="3" y2="12"/><line x1="21" y1="12" x2="23" y2="12"/><line x1="4.22" y1="19.78" x2="5.64" y2="18.36"/><line x1="18.36" y1="5.64" x2="19.78" y2="4.22"/>',
    moon:      '<path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z"/>',
    arrowRight:'<polyline points="9 18 15 12 9 6"/>',
    arrowLeft: '<polyline points="15 18 9 12 15 6"/>',
    focus:     '<circle cx="12" cy="12" r="3"/><path d="M3 9a9 9 0 0 1 9-6 9 9 0 0 1 9 6"/><path d="M3 15a9 9 0 0 0 9 6 9 9 0 0 0 9-6"/>',
    support:   '<circle cx="12" cy="12" r="10"/><path d="M9.09 9a3 3 0 0 1 5.83 1c0 2-3 3-3 3"/><line x1="12" y1="17" x2="12.01" y2="17"/>',
};

const Icon = ({ name, size = 18 }) => (
    <svg xmlns="http://www.w3.org/2000/svg" width={size} height={size}
        viewBox="0 0 24 24" fill="none" stroke="currentColor"
        strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"
        style={{ flexShrink: 0 }}
        dangerouslySetInnerHTML={{ __html: ICONS[name] || '' }}
    />
);

/* ─── NAV DATA (إضافة ميزة إيصالات الدفع بـ المالي والإدارة للمدرس) ─── */
const NAV = [
    {
        section: 'الرئيسية',
        items: [
            { label: 'لوحة التحكم', icon: 'dashboard', href: '/admin/dashboard', inertia: true },
        ],
    },
    {
        section: 'المحتوى التعليمي',
        items: [
            { label: 'الدروس', icon: 'book', children: [
                { label: 'كل الدروس',       href: '/admin/lessons',              inertia: true },
                { label: 'إضافة درس',       href: '/admin/lessons/create',       inertia: true },
                { label: 'أسئلة التركيز 🎯', href: '/admin/video-questions',      inertia: true },
            ]},
            { label: 'الامتحانات', icon: 'exam', children: [
                { label: 'كل الامتحانات', href: '/admin/exams',        inertia: true },
                { label: 'إضافة امتحان', href: '/admin/exams/create',  inertia: true },
            ]},
            { label: 'الشيتات', icon: 'sheet', children: [
                { label: 'كل الشيتات', href: '/admin/sheets',        inertia: true },
                { label: 'رفع شيت',    href: '/admin/sheets/create', inertia: true },
            ]},
            { label: 'دعم المادة الفني', icon: 'support', href: '/admin/comments', inertia: true },
        ],
    },
    {
        section: 'إدارة الطلاب',
        items: [
            { label: 'الطلاب', icon: 'users', children: [
                { label: 'جميع الطلاب',    href: '/admin/students',         inertia: true },
                { label: 'إضافة طالب',     href: '/admin/students/create',  inertia: true },
                { label: 'طلبات التسجيل',  href: '/admin/student-requests', inertia: true },
                { label: 'الطلاب الأوائل', href: '/admin/top-students',      inertia: true },
            ]},
            { label: 'المجموعات', icon: 'groups', children: [
                { label: 'كل المجموعات',  href: '/admin/groups',        inertia: true },
                { label: 'إضافة مجموعة', href: '/admin/groups/create', inertia: true },
            ]},
            { label: 'الصفوف الدراسية', icon: 'classes', children: [
                { label: 'كل الصفوف', href: '/admin/classes',        inertia: true },
                { label: 'إضافة صف',  href: '/admin/classes/create', inertia: true },
            ]},
            { label: 'الوحدات الدراسية', icon: 'book', children: [
                { label: 'كل الوحدات', href: '/admin/units',        inertia: true },
                { label: 'إضافة وحدة', href: '/admin/units/create', inertia: true },
            ]},
            { label: 'درجات الشيتات',    icon: 'file',   href: '/admin/sheet-grades', inertia: true },
            { label: 'درجات الامتحانات', icon: 'trophy', href: '/admin/exam-grades',  inertia: true },
        ],
    },
    {
        section: 'المالي والإدارة',
        items: [
            { label: 'الاشتراكات', icon: 'money', children: [
                { label: 'كل الاشتراكات', href: '/admin/subscriptions',        inertia: true },
                { label: 'اشتراك جديد',   href: '/admin/subscriptions/create', inertia: true },
            ]},
            { label: 'الحجوزات', icon: 'ticket', children: [
                { label: 'كل الحجوزات', href: '/admin/reservations',        inertia: true },
                { label: 'حجز جديد',    href: '/admin/reservations/create', inertia: true },
            ]},
            { label: 'طلبات حجز المقاعد', icon: 'bell', href: '/admin/booking-requests', inertia: true },
            { label: 'أكواد التفعيل', icon: 'tag',   href: '/admin/promo-codes', inertia: true },
            { label: 'طلبات الدفع', icon: 'money', href: '/admin/payments', inertia: true },
            { label: 'إيصالات الدفع', icon: 'sheet', href: '/admin/payment-receipts', inertia: true }, // الزرار المضاف حديثاً كالمساعد تماماً!
            { label: 'المساعدون',     icon: 'users', children: [
                { label: 'كل المساعدين', href: '/admin/assistants',        inertia: true },
                { label: 'إضافة مساعد', href: '/admin/assistants/create', inertia: true },
            ]},
        ],
    },
];

/* ─── FLAT LIST OF ALL SEARCHABLE NAV ITEMS ─── */
const ALL_NAV_ITEMS = NAV.flatMap(group =>
    group.items.flatMap(item =>
        item.href
            ? [{ label: item.label, href: item.href, icon: item.icon, parent: null, section: group.section }]
            : (item.children || []).map(child => ({
                label: child.label,
                href: child.href,
                icon: item.icon,
                parent: item.label,
                section: group.section,
            }))
    )
);

/* ─── SIDEBAR COLORS — dark / light ─── */
function sbColors(dark) {
    return dark ? {
        bg:        'linear-gradient(175deg,#060B16 0%,#0D1829 40%,#101D35 70%,#0A1422 100%)',
        shadow:    '-4px 0 50px rgba(0,0,0,.35),inset 0 0 0 1px rgba(226,232,240,.08)',
        border:    'rgba(226,232,240,.12)',
        text:      'rgba(226,232,240,.65)',
        textHi:    'rgba(226,232,240,.95)',
        textMuted: 'rgba(226,232,240,.3)',
        sectionL:  'rgba(226,232,240,.12)',
        sectionT:  'rgba(226,232,240,.32)',
        hoverBg:   'rgba(255,255,255,.05)',
        hoverTxt:  '#fff',
        activeBg:  'linear-gradient(270deg,rgba(47,188,212,.22) 0%,rgba(47,188,212,.08) 60%,transparent 100%)',
        activeTxt: '#fff',
        barShadow: '0 0 10px rgba(47,188,212,.8),0 0 20px rgba(47,188,212,.4)',
        iconDim:   'rgba(47,188,212,.4)',
        subBorder: 'rgba(47,188,212,.2)',
        subTxt:    'rgba(226,232,240,.5)',
        subHover:  '#fff',
        subHoverBg:'rgba(255,255,255,.04)',
        logoBg:    'rgba(0,0,0,.3)',
        footBg:    'rgba(0,0,0,.2)',
        footBrd:   'rgba(255,255,255,.05)',
        footCard:  'rgba(255,255,255,.04)',
        footBrdC:  'rgba(226,232,240,.1)',
        logoBtnC:  'rgba(255,255,255,.25)',
        logoutHov: '#ef4444',
        logoutHovBg:'rgba(239,68,68,.1)',
    } : {
        bg:        'linear-gradient(175deg,#ffffff 0%,#f4f6fb 40%,#eef1f8 70%,#f0f3fa 100%)',
        shadow:    '-4px 0 30px rgba(27,58,96,.1),inset 0 0 0 1px rgba(27,58,96,.07)',
        border:    'rgba(27,58,96,.1)',
        text:      '#475569',
        textHi:    '#1b3a60',
        textMuted: '#94a3b8',
        sectionL:  'rgba(27,58,96,.1)',
        sectionT:  '#94a3b8',
        hoverBg:   'rgba(47,188,212,.07)',
        hoverTxt:  '#1b3a60',
        activeBg:  'linear-gradient(270deg,rgba(47,188,212,.18) 0%,rgba(47,188,212,.06) 60%,transparent 100%)',
        activeTxt: '#1b3a60',
        barShadow: '0 0 8px rgba(47,188,212,.5)',
        iconDim:   'rgba(47,188,212,.4)',
        subBorder: 'rgba(47,188,212,.2)',
        subTxt:    '#64748b',
        subHover:  '#1b3a60',
        subHoverBg:'rgba(27,58,96,.04)',
        logoBg:    'rgba(27,58,96,.04)',
        footBg:    'rgba(27,58,96,.03)',
        footBrd:   'rgba(27,58,96,.08)',
        footCard:  'rgba(27,58,96,.04)',
        footBrdC:  'rgba(27,58,96,.08)',
        logoBtnC:  '#94a3b8',
        logoutHov: '#ef4444',
        logoutHovBg:'rgba(239,68,68,.08)',
    };
}

/* ─── NAV ITEM ─── */
function NavItem({ item, collapsed, colors, onNavClick }) {
    const pathname = typeof window !== 'undefined' ? window.location.pathname : '';
    const isActive = pathname === item.href || (item.href && item.href !== '/admin/dashboard' && pathname.startsWith(item.href));
    const isChildActive = item.children?.some(c => pathname.startsWith(c.href));
    const hasChildren   = !!item.children?.length;
    const [open, setOpen] = useState(false);
    useEffect(() => { if (isChildActive) setOpen(true); }, []);

    const itemStyle = {
        display: 'flex', alignItems: 'center',
        gap: collapsed ? 0 : 10,
        padding: collapsed ? '10px 0' : '9px 14px',
        justifyContent: collapsed ? 'center' : 'flex-start',
        borderRadius: 12, width: '100%',
        fontSize: 13.5, fontFamily: 'Cairo, sans-serif',
        fontWeight: isActive ? 700 : 500,
        cursor: 'pointer', userSelect: 'none',
        textAlign: 'right', border: 'none', outline: 'none',
        position: 'relative', overflow: 'hidden',
        transition: 'all .2s ease',
        background: isActive ? colors.activeBg : isChildActive ? 'rgba(47,188,212,.07)' : 'transparent',
        color: isActive ? colors.activeTxt : isChildActive ? colors.textHi : colors.text,
        title: collapsed ? item.label : undefined,
    };

    const inner = (
        <>
            {(isActive || isChildActive) && !collapsed && (
                <span style={{
                    position: 'absolute', right: 0, top: '20%', bottom: '20%',
                    width: 3, borderRadius: 4, background: '#2fbcd4',
                    boxShadow: colors.barShadow,
                }} />
            )}
            {item.icon && (
                <span title={collapsed ? item.label : undefined} style={{
                    color: isActive || isChildActive ? '#2fbcd4' : colors.iconDim,
                    display: 'flex', transition: 'color .2s',
                }}>
                    <Icon name={item.icon} size={collapsed ? 18 : 16} />
                </span>
            )}
            {!collapsed && (
                <>
                    <span style={{ flex: 1 }}>{item.label}</span>
                    {hasChildren && (
                        <span style={{
                            display: 'inline-flex', opacity: .5, color: '#94a3b8',
                            transform: open ? 'rotate(180deg)' : 'rotate(0)',
                            transition: 'transform .3s cubic-bezier(.4,0,.2,1)',
                        }}>
                            <Icon name="chevron" size={13} />
                        </span>
                    )}
                </>
            )}
        </>
    );

    const onE = (e) => { if (!isActive) { e.currentTarget.style.background = colors.hoverBg; e.currentTarget.style.color = colors.hoverTxt; } };
    const onL = (e) => { if (!isActive) { e.currentTarget.style.background = isChildActive ? 'rgba(47,188,212,.07)' : 'transparent'; e.currentTarget.style.color = isChildActive ? colors.textHi : colors.text; } };

    return (
        <div>
            {hasChildren
                ? <button onClick={() => setOpen(v => !v)} style={itemStyle} onMouseEnter={onE} onMouseLeave={onL} title={collapsed ? item.label : undefined}>{inner}</button>
                : item.inertia
                    ? <Link href={item.href} onClick={onNavClick} style={itemStyle} onMouseEnter={onE} onMouseLeave={onL} title={collapsed ? item.label : undefined}>{inner}</Link>
                    : <a href={item.href} onClick={onNavClick} style={itemStyle} onMouseEnter={onE} onMouseLeave={onL} title={collapsed ? item.label : undefined}>{inner}</a>
            }

            {/* Sub-menu — hidden when collapsed */}
            {hasChildren && !collapsed && (
                <div style={{
                    maxHeight: open ? '600px' : '0',
                    overflow: 'hidden',
                    transition: 'max-height .4s cubic-bezier(.4,0,.2,1), opacity .3s ease',
                    opacity: open ? 1 : 0,
                }}>
                    <div style={{
                        marginRight: 28, marginTop: 3,
                        paddingRight: 14, paddingBottom: 4,
                        borderRight: `1px solid ${colors.subBorder}`,
                    }}>
                        {item.children.map(child => {
                            const ca = typeof window !== 'undefined' && window.location.pathname === child.href;
                            const cs = {
                                display: 'flex', alignItems: 'center', gap: 8,
                                padding: '7px 10px', borderRadius: 8,
                                fontSize: 12.5, fontFamily: 'Cairo, sans-serif',
                                fontWeight: ca ? 700 : 400,
                                color: ca ? '#2fbcd4' : colors.subTxt,
                                background: ca ? 'rgba(47,188,212,.1)' : 'transparent',
                                textDecoration: 'none', transition: 'all .15s ease',
                            };
                            const dot = <span style={{ width: 5, height: 5, borderRadius: '50%', flexShrink: 0, background: ca ? '#2fbcd4' : 'currentColor', opacity: ca ? 1 : .4 }} />;
                            const ce = (e) => { if (!ca) { e.currentTarget.style.color = colors.subHover; e.currentTarget.style.background = colors.subHoverBg; } };
                            const cl = (e) => { if (!ca) { e.currentTarget.style.color = colors.subTxt; e.currentTarget.style.background = 'transparent'; } };
                            return child.inertia
                                ? <Link key={child.label} href={child.href} onClick={onNavClick} style={cs} onMouseEnter={ce} onMouseLeave={cl}>{dot}{child.label}</Link>
                                : <a    key={child.label} href={child.href} onClick={onNavClick} style={cs} onMouseEnter={ce} onMouseLeave={cl}>{dot}{child.label}</a>;
                        })}
                    </div>
                </div>
            )}
        </div>
    );
}

export default function AdminLayout({ children, title = 'لوحة التحكم' }) {
    const [sidebarOpen,  setSidebarOpen]  = useState(false);
    const [isMobile,     setIsMobile]     = useState(() => typeof window !== 'undefined' && window.innerWidth < 1024);
    const [collapsed,    setCollapsed]    = useState(() => {
        try { return localStorage.getItem('adminSbCollapsed') === '1'; } catch { return false; }
    });

    useEffect(() => {
        const onResize = () => setIsMobile(window.innerWidth < 1024);
        window.addEventListener('resize', onResize);
        return () => window.removeEventListener('resize', onResize);
    }, []);

    // On mobile the sidebar is never collapsed — full labels always shown
    const effectiveCollapsed = isMobile ? false : collapsed;
    const [theme, setTheme] = useState(() => {
        try { return localStorage.getItem('adminTheme') || 'light'; } catch { return 'light'; }
    });

    const [searchQuery,  setSearchQuery]  = useState('');
    const [searchOpen,   setSearchOpen]   = useState(false);
    const [bellOpen,     setBellOpen]     = useState(false);
    const [bellPos,      setBellPos]      = useState({ top: 60, left: 60 });

    const sidebarRef   = useRef(null);
    const toggleBtnRef = useRef(null);
    const searchRef    = useRef(null);
    const bellRef      = useRef(null);
    const { auth, adminNotifications } = usePage().props;
    const notifs = adminNotifications ?? { payments: 0, students: 0, total: 0 };

    // Close search dropdown on outside click
    useEffect(() => {
        const handler = (e) => {
            if (searchRef.current && !searchRef.current.contains(e.target)) {
                setSearchOpen(false);
                setSearchQuery('');
            }
        };
        document.addEventListener('mousedown', handler);
        return () => document.removeEventListener('mousedown', handler);
    }, []);

    // Close bell dropdown on outside click
    useEffect(() => {
        const handler = (e) => {
            if (bellRef.current && !bellRef.current.contains(e.target)) {
                setBellOpen(false);
            }
        };
        document.addEventListener('mousedown', handler);
        return () => document.removeEventListener('mousedown', handler);
    }, []);

    const calcBellPos = () => {
        if (!bellRef.current) return;
        const rect    = bellRef.current.getBoundingClientRect();
        const panelW  = 320;
        const margin  = 8;
        const ideal   = rect.left + rect.width / 2 - panelW / 2;
        setBellPos({
            top:  rect.bottom + 10,
            left: Math.max(margin, Math.min(ideal, window.innerWidth - panelW - margin)),
        });
    };

    const openBell = () => {
        calcBellPos();
        setBellOpen(o => !o);
    };

    // Auto-open bell on dashboard when there are notifications
    useEffect(() => {
        const isDashboard = typeof window !== 'undefined' &&
            window.location.pathname === '/admin/dashboard';
        if (isDashboard && notifs.total > 0) {
            const t = setTimeout(() => { calcBellPos(); setBellOpen(true); }, 700);
            return () => clearTimeout(t);
        }
    }, []);

    useEffect(() => {
        const onPageShow = (e) => {
            if (e.persisted) window.location.reload();
        };
        window.addEventListener('pageshow', onPageShow);
        return () => window.removeEventListener('pageshow', onPageShow);
    }, []);
    const adminName    = auth?.user?.name ?? 'الأستاذ محمد منصور';
    const q = searchQuery.trim();
    const searchResults = q.length > 0
        ? ALL_NAV_ITEMS.filter(item =>
            item.label.includes(q) ||
            (item.parent && item.parent.includes(q)) ||
            item.section.includes(q)
          ).slice(0, 8)
        : [];
    const initials     = adminName.charAt(0);
    const dark         = theme === 'dark';
    const C            = sbColors(dark);

    const SB_FULL = 256;
    const SB_MINI = 64;
    const sbW     = collapsed ? SB_MINI : SB_FULL;

    useEffect(() => {
        if (!sidebarRef.current) return;
        gsap.from(sidebarRef.current, { x: 60, opacity: 0, duration: .55, ease: 'power3.out' });
    }, []);

    const toggleTheme = () => {
        const next = dark ? 'light' : 'dark';
        setTheme(next);
        try { localStorage.setItem('adminTheme', next); } catch {}
        if (toggleBtnRef.current) {
            gsap.fromTo(toggleBtnRef.current,
                { scale: .55, rotate: -25 },
                { scale: 1, rotate: 0, duration: .38, ease: 'back.out(2)' }
            );
        }
    };

    const toggleCollapse = () => {
        setCollapsed(v => {
            const next = !v;
            try { localStorage.setItem('adminSbCollapsed', next ? '1' : '0'); } catch {}
            return next;
        });
    };

    const handleLogout = (e) => { e.preventDefault(); router.post('/logout'); };

    return (
        <div dir="rtl" data-theme={theme} style={{
            minHeight: '100vh', background: 'var(--a-bg)',
            fontFamily: 'Cairo, sans-serif', display: 'flex',
        }}>
            <style>{`
                @keyframes bellPulse {
                    0%,100% { box-shadow: 0 0 0 2px var(--a-topbar), 0 0 0 4px rgba(47,188,212,.0); }
                    50%     { box-shadow: 0 0 0 2px var(--a-topbar), 0 0 0 6px rgba(47,188,212,.35); }
                }
                @keyframes dropIn {
                    from { opacity:0; transform:translateY(-8px) scale(.97); }
                    to   { opacity:1; transform:translateY(0)    scale(1);   }
                }
                /* ── Admin Mobile Responsive ── */
                .admin-sidebar {
                    transform: translateX(0);
                    transition: transform .3s cubic-bezier(.4,0,.2,1) !important;
                }
                .admin-main {
                    margin-right: ${sbW}px;
                    transition: margin-right .3s cubic-bezier(.4,0,.2,1);
                }
                @media (max-width: 1023px) {
                    .admin-sidebar          { transform: translateX(110%) !important; }
                    .admin-sidebar.open     { transform: translateX(0)    !important; }
                    .admin-main             { margin-right: 0             !important; }
                    .admin-topbar-search    { display: none               !important; }
                    .admin-topbar-date      { display: none               !important; }
                    .admin-topbar-title     { font-size: 15px             !important; }
                }
            `}</style>

            {/* Mobile overlay */}
            {sidebarOpen && (
                <div onClick={() => setSidebarOpen(false)} style={{ position: 'fixed', inset: 0, zIndex: 30, background: 'rgba(6,11,22,.7)', backdropFilter: 'blur(4px)' }} />
            )}

            {/* ─── SIDEBAR ─── */}
            <aside ref={sidebarRef} className={`admin-sidebar${sidebarOpen ? ' open' : ''}`} style={{
                position: 'fixed', top: 0, right: 0,
                width: sbW, height: '100vh',
                display: 'flex', flexDirection: 'column', zIndex: 40,
                background: C.bg,
                backdropFilter: 'blur(24px)', WebkitBackdropFilter: 'blur(24px)',
                boxShadow: C.shadow,
                borderLeft: `1px solid ${C.border}`,
                transition: 'width .3s cubic-bezier(.4,0,.2,1), background .3s ease, box-shadow .3s ease, border-color .3s ease',
                overflow: 'hidden',
            }}>

                <div style={{ position: 'absolute', top: 0, left: 0, right: 0, height: 1, background: 'linear-gradient(90deg,transparent,rgba(47,188,212,.4),rgba(226,232,240,.2),transparent)' }} />

                {/* Logo */}
                <div style={{
                    display: 'flex', alignItems: 'center',
                    gap: collapsed ? 0 : 12,
                    justifyContent: collapsed ? 'center' : 'flex-start',
                    padding: collapsed ? '16px 0' : '16px',
                    borderBottom: `1px solid ${C.border}`,
                    background: C.logoBg,
                    transition: 'all .3s ease',
                    minHeight: 72,
                }}>
                    <div role="img" aria-label="شعار منصة منصور" style={{
                        width: 44, height: 44, borderRadius: 12, flexShrink: 0,
                        background: 'linear-gradient(135deg, #1b3a60, #2fbcd4)',
                        boxShadow: '0 0 0 2px rgba(47,188,212,.35),0 0 20px rgba(47,188,212,.3)',
                        position: 'relative', overflow: 'hidden',
                        display: 'flex', alignItems: 'center', justifyContent: 'center',
                    }}>
                        <span style={{ color: '#fff', fontFamily: 'Cairo, sans-serif', fontWeight: 900, fontSize: 24, lineHeight: 1 }}>م</span>
                        <svg width="13" height="13" viewBox="0 0 14 14" style={{ position: 'absolute', bottom: 4, left: 4, opacity: 0.55 }}>
                            <rect x="3" y="3" width="8" height="8" transform="rotate(45 7 7)" fill="none" stroke="#fff" strokeWidth="1" />
                        </svg>
                    </div>

                    {!collapsed && (
                        <div style={{ flex: 1, minWidth: 0, overflow: 'hidden' }}>
                            <p style={{ color: C.textHi, fontWeight: 900, fontSize: 14, lineHeight: 1.2, fontFamily: 'Cairo,sans-serif', whiteSpace: 'nowrap' }}>منصة منصور</p>
                            <p style={{ color: '#2fbcd4', fontSize: 9.5, fontWeight: 600, letterSpacing: '.15em', opacity: .85, marginTop: 2, whiteSpace: 'nowrap' }}>MANSOUR PLATFORM</p>
                            <p style={{ color: C.textMuted, fontSize: 9.5, fontWeight: 600, marginTop: 2, whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>أستاذ اللغة العربية للثانوية العامة</p>
                        </div>
                    )}

                    {(!collapsed || isMobile) && (
                        <button onClick={() => setSidebarOpen(false)} style={{ color: C.logoBtnC, background: 'none', border: 'none', cursor: 'pointer', padding: 4 }} className="lg:hidden">
                            <Icon name="close" size={18} />
                        </button>
                    )}
                </div>

                <button
                    onClick={toggleCollapse}
                    title={collapsed ? 'توسيع القائمة' : 'تصغير القائمة'}
                    style={{
                        display: 'flex', alignItems: 'center', justifyContent: 'center',
                        gap: 8, width: '100%',
                        padding: '10px',
                        background: 'transparent',
                        border: 'none',
                        borderBottom: `1px solid ${C.border}`,
                        cursor: 'pointer',
                        color: C.textMuted,
                        fontSize: 12, fontFamily: 'Cairo,sans-serif',
                        transition: 'all .2s ease',
                    }}
                    onMouseEnter={e => { e.currentTarget.style.background = 'rgba(47,188,212,.08)'; e.currentTarget.style.color = '#2fbcd4'; }}
                    onMouseLeave={e => { e.currentTarget.style.background = 'transparent'; e.currentTarget.style.color = C.textMuted; }}
                >
                    <Icon name={collapsed ? 'arrowLeft' : 'arrowRight'} size={14} />
                    {!collapsed && <span>تصغير القائمة</span>}
                </button>

                <nav style={{ flex: 1, overflowY: 'auto', overflowX: 'hidden', padding: collapsed ? '10px 6px' : '12px 10px' }} className="sidebar-scroll">
                    {NAV.map(group => (
                        <div key={group.section} style={{ marginBottom: collapsed ? 8 : 20 }}>
                            {!collapsed && (
                                <div style={{ display: 'flex', alignItems: 'center', gap: 8, padding: '0 6px', marginBottom: 6 }}>
                                    <div style={{ flex: 1, height: 1, background: C.sectionL }} />
                                    <p style={{ fontSize: 9, fontWeight: 800, color: C.sectionT, letterSpacing: '.18em', textTransform: 'uppercase', fontFamily: 'Cairo,sans-serif', whiteSpace: 'nowrap' }}>{group.section}</p>
                                    <div style={{ flex: 1, height: 1, background: C.sectionL }} />
                                </div>
                            )}
                            {collapsed && <div style={{ height: 1, background: C.sectionL, margin: '4px 8px 8px' }} />}

                            <div style={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
                                {group.items.map(item => (
                                    <NavItem key={item.label} item={item} collapsed={effectiveCollapsed} colors={C} onNavClick={() => setSidebarOpen(false)} />
                                ))}
                            </div>
                        </div>
                    ))}
                </nav>

                <div style={{ padding: collapsed ? '10px 8px 14px' : '10px 10px 14px', borderTop: `1px solid ${C.footBrd}`, background: C.footBg, transition: 'all .3s ease' }}>
                    {collapsed ? (
                        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 8 }}>
                            <div style={{ width: 36, height: 36, borderRadius: 10, background: 'linear-gradient(135deg,#2fbcd4,#009688)', boxShadow: '0 0 0 2px rgba(47,188,212,.3)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#fff', fontWeight: 900, fontSize: 14 }} title={adminName}>
                                {initials}
                            </div>
                            <button onClick={handleLogout} title="تسجيل الخروج" style={{ background: 'none', border: 'none', cursor: 'pointer', color: C.logoBtnC, padding: 6, borderRadius: 8, display: 'flex' }}
                                onMouseEnter={e => { e.currentTarget.style.color = '#ef4444'; e.currentTarget.style.background = 'rgba(239,68,68,.1)'; }}
                                onMouseLeave={e => { e.currentTarget.style.color = C.logoBtnC; e.currentTarget.style.background = 'none'; }}>
                                <Icon name="logout" size={15} />
                            </button>
                        </div>
                    ) : (
                        <div style={{ display: 'flex', alignItems: 'center', gap: 10, padding: '10px 12px', borderRadius: 14, background: C.footCard, border: `1px solid ${C.footBrdC}` }}>
                            <div style={{ width: 36, height: 36, borderRadius: 10, flexShrink: 0, background: 'linear-gradient(135deg,#2fbcd4,#009688)', boxShadow: '0 0 0 2px rgba(47,188,212,.3)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#fff', fontWeight: 900, fontSize: 14 }}>{initials}</div>
                            <div style={{ flex: 1, minWidth: 0 }}>
                                <p style={{ color: C.textHi, fontSize: 12, fontWeight: 700, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{adminName}</p>
                                <p style={{ fontSize: 10, display: 'flex', alignItems: 'center', gap: 4, color: 'rgba(47,188,212,.8)', marginTop: 1 }}>
                                    <span style={{ width: 5, height: 5, borderRadius: '50%', background: '#22c55e', display: 'inline-block', boxShadow: '0 0 6px #22c55e' }} />
                                    مسؤول المنصة
                                </p>
                            </div>
                            <button onClick={handleLogout} title="تسجيل الخروج" style={{ background: 'none', border: 'none', cursor: 'pointer', color: C.logoBtnC, padding: 6, borderRadius: 8 }}
                                onMouseEnter={e => { e.currentTarget.style.color = C.logoutHov; e.currentTarget.style.background = C.logoutHovBg; }}
                                onMouseLeave={e => { e.currentTarget.style.color = C.logoBtnC; e.currentTarget.style.background = 'none'; }}>
                                <Icon name="logout" size={15} />
                            </button>
                        </div>
                    )}
                </div>

                <div style={{ position: 'absolute', bottom: 0, left: 0, right: 0, height: 1, background: 'linear-gradient(90deg,transparent,rgba(47,188,212,.3),transparent)' }} />
            </aside>

            {/* ═══ MAIN CONTENT ═══ */}
            <div className="admin-main" style={{
                flex: 1, display: 'flex', flexDirection: 'column', minHeight: '100vh',
            }}>

                {/* Topbar */}
                <header style={{
                    position: 'sticky', top: 0, zIndex: 20,
                    background: 'var(--a-topbar)',
                    backdropFilter: 'blur(16px)', WebkitBackdropFilter: 'blur(16px)',
                    borderBottom: '1px solid var(--a-topbar-b)',
                    boxShadow: `0 1px 0 rgba(255,255,255,${dark ? '.03' : '.7'}),0 4px 16px var(--a-shadow)`,
                }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 14, padding: '14px 24px' }}>

                        <button onClick={() => setSidebarOpen(true)} className="lg:hidden" style={{ background: 'none', border: 'none', cursor: 'pointer', color: 'var(--a-text)', padding: 4 }}>
                            <Icon name="menu" size={22} />
                        </button>

                        <div style={{ flex: 1 }}>
                            <div style={{ display: 'flex', alignItems: 'center', gap: 6, marginBottom: 1 }}>
                                <div style={{ width: 3, height: 16, borderRadius: 2, background: 'linear-gradient(180deg,#2fbcd4,#009688)' }} />
                                <h2 className="admin-topbar-title" style={{ color: 'var(--a-text)', fontWeight: 900, fontSize: 17, fontFamily: 'Cairo,sans-serif', lineHeight: 1 }}>{title}</h2>
                            </div>
                            <p className="admin-topbar-date" style={{ color: 'var(--a-text-4)', fontSize: 11, fontWeight: 500, fontFamily: 'Cairo,sans-serif' }}>
                                {new Date().toLocaleDateString('ar-EG', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}
                            </p>
                        </div>

                        <div ref={searchRef} className="admin-topbar-search" style={{ position: 'relative' }}>
                            <span style={{ position: 'absolute', right: 12, top: '50%', transform: 'translateY(-50%)', color: 'var(--a-text-4)', display: 'flex', pointerEvents: 'none', zIndex: 1 }}>
                                <Icon name="search" size={15} />
                            </span>
                            <input
                                type="text"
                                placeholder="بحث سريع..."
                                value={searchQuery}
                                onChange={e => { setSearchQuery(e.target.value); setSearchOpen(true); }}
                                onFocus={e => { e.target.style.borderColor = '#2fbcd4'; e.target.style.boxShadow = '0 0 0 3px rgba(47,188,212,.12)'; setSearchOpen(true); }}
                                onBlur={e =>  { e.target.style.borderColor = 'var(--a-border)'; e.target.style.boxShadow = 'none'; }}
                                onKeyDown={e => {
                                    if (e.key === 'Escape') { setSearchOpen(false); setSearchQuery(''); }
                                    if (e.key === 'Enter' && searchResults.length > 0) {
                                        router.visit(searchResults[0].href);
                                        setSearchQuery(''); setSearchOpen(false);
                                    }
                                }}
                                style={{
                                    paddingRight: 36, paddingLeft: 16, paddingTop: 8, paddingBottom: 8,
                                    fontSize: 13, borderRadius: 12, width: 200, outline: 'none',
                                    border: '1.5px solid var(--a-border)',
                                    background: 'var(--a-search-bg)', color: 'var(--a-text)',
                                    fontFamily: 'Cairo,sans-serif', fontWeight: 500,
                                    transition: 'border-color .2s, box-shadow .2s',
                                }}
                            />

                            {/* Search Results Dropdown */}
                            {searchOpen && q.length > 0 && (
                                <div style={{
                                    position: 'absolute', top: 'calc(100% + 8px)', right: 0,
                                    minWidth: 260, maxHeight: 360, overflowY: 'auto',
                                    background: dark ? '#0D1829' : '#ffffff',
                                    border: `1.5px solid ${dark ? 'rgba(226,232,240,.14)' : 'rgba(27,58,96,.1)'}`,
                                    borderRadius: 14,
                                    boxShadow: dark ? '0 12px 40px rgba(0,0,0,.5)' : '0 12px 40px rgba(27,58,96,.14)',
                                    zIndex: 9999,
                                    overflow: 'hidden',
                                }}>
                                    {searchResults.length > 0 ? searchResults.map((item, i) => (
                                        <div
                                            key={i}
                                            onClick={() => { router.visit(item.href); setSearchQuery(''); setSearchOpen(false); }}
                                            style={{
                                                display: 'flex', alignItems: 'center', gap: 10,
                                                padding: '10px 14px', cursor: 'pointer',
                                                borderBottom: i < searchResults.length - 1
                                                    ? `1px solid ${dark ? 'rgba(255,255,255,.04)' : 'rgba(0,0,0,.05)'}`
                                                    : 'none',
                                                transition: 'background .12s',
                                            }}
                                            onMouseEnter={e => e.currentTarget.style.background = dark ? 'rgba(47,188,212,.1)' : 'rgba(47,188,212,.07)'}
                                            onMouseLeave={e => e.currentTarget.style.background = 'transparent'}
                                        >
                                            <span style={{ color: '#2fbcd4', display: 'flex', flexShrink: 0 }}>
                                                <Icon name={item.icon} size={15} />
                                            </span>
                                            <div style={{ flex: 1, minWidth: 0 }}>
                                                <p style={{ fontSize: 13, fontWeight: 600, fontFamily: 'Cairo,sans-serif', color: dark ? 'rgba(226,232,240,.92)' : '#1b3a60', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>{item.label}</p>
                                                <p style={{ fontSize: 10.5, fontFamily: 'Cairo,sans-serif', color: item.parent ? '#2fbcd4' : (dark ? 'rgba(226,232,240,.38)' : '#94a3b8'), opacity: item.parent ? .75 : 1, marginTop: 1 }}>
                                                    {item.parent ? `${item.section} ← ${item.parent}` : item.section}
                                                </p>
                                            </div>
                                            <span style={{ color: dark ? 'rgba(226,232,240,.25)' : '#cbd5e1', display: 'flex', flexShrink: 0 }}>
                                                <Icon name="arrowLeft" size={12} />
                                            </span>
                                        </div>
                                    )) : (
                                        <div style={{ padding: '16px', textAlign: 'center', fontFamily: 'Cairo,sans-serif', fontSize: 12.5, color: dark ? 'rgba(226,232,240,.35)' : '#94a3b8' }}>
                                            لا توجد نتائج لـ "{q}"
                                        </div>
                                    )}
                                </div>
                            )}
                        </div>

                        <button ref={toggleBtnRef} onClick={toggleTheme}
                            title={dark ? 'الوضع النهاري' : 'الوضع الليلي'}
                            style={{
                                width: 38, height: 38, borderRadius: 12, flexShrink: 0,
                                border: '1.5px solid var(--a-border)',
                                background: dark ? 'rgba(47,188,212,.12)' : 'var(--a-card)',
                                display: 'flex', alignItems: 'center', justifyContent: 'center',
                                cursor: 'pointer', color: dark ? '#2fbcd4' : 'var(--a-text-3)',
                                transition: 'all .2s ease',
                            }}
                            onMouseEnter={e => { e.currentTarget.style.borderColor = '#2fbcd4'; e.currentTarget.style.color = '#2fbcd4'; e.currentTarget.style.background = 'rgba(47,188,212,.12)'; }}
                            onMouseLeave={e => { e.currentTarget.style.borderColor = 'var(--a-border)'; e.currentTarget.style.color = dark ? '#2fbcd4' : 'var(--a-text-3)'; e.currentTarget.style.background = dark ? 'rgba(47,188,212,.12)' : 'var(--a-card)'; }}>
                            <Icon name={dark ? 'sun' : 'moon'} size={16} />
                        </button>

                        {/* ── Bell Notification ── */}
                        <div ref={bellRef} style={{ position: 'relative' }}>
                            <button
                                onClick={openBell}
                                title="الإشعارات"
                                style={{
                                    width: 38, height: 38, borderRadius: 12, flexShrink: 0,
                                    border: `1.5px solid ${bellOpen ? '#2fbcd4' : 'var(--a-border)'}`,
                                    background: bellOpen ? 'rgba(47,188,212,.12)' : 'var(--a-card)',
                                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                                    cursor: 'pointer', color: bellOpen ? '#2fbcd4' : 'var(--a-text)',
                                    transition: 'all .2s ease',
                                }}
                                onMouseEnter={e => { e.currentTarget.style.background = '#2fbcd4'; e.currentTarget.style.color = '#fff'; e.currentTarget.style.borderColor = '#2fbcd4'; e.currentTarget.style.boxShadow = '0 4px 14px rgba(47,188,212,.35)'; }}
                                onMouseLeave={e => { e.currentTarget.style.background = bellOpen ? 'rgba(47,188,212,.12)' : 'var(--a-card)'; e.currentTarget.style.color = bellOpen ? '#2fbcd4' : 'var(--a-text)'; e.currentTarget.style.borderColor = bellOpen ? '#2fbcd4' : 'var(--a-border)'; e.currentTarget.style.boxShadow = 'none'; }}
                            >
                                <Icon name="bell" size={16} />
                            </button>

                            {/* Badge */}
                            {notifs.total > 0 && (
                                <span style={{
                                    position: 'absolute', top: -5, left: -5,
                                    minWidth: 18, height: 18, borderRadius: 999,
                                    background: '#2fbcd4', color: '#fff',
                                    fontSize: 9, fontWeight: 800,
                                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                                    padding: '0 4px',
                                    boxShadow: '0 0 0 2px var(--a-topbar)',
                                    fontFamily: 'Cairo,sans-serif',
                                    animation: 'bellPulse 2s ease-in-out infinite',
                                }}>
                                    {notifs.total > 99 ? '99+' : notifs.total}
                                </span>
                            )}

                            {/* Dropdown Panel */}
                            {bellOpen && (
                                <div style={{
                                    position: 'fixed',
                                    top: bellPos.top,
                                    left: bellPos.left,
                                    width: 320, zIndex: 9999,
                                    background: 'var(--a-card)',
                                    border: '1px solid var(--a-border)',
                                    borderRadius: 16,
                                    boxShadow: dark
                                        ? '0 20px 60px rgba(0,0,0,.6), 0 0 0 1px rgba(47,188,212,.15)'
                                        : '0 20px 60px rgba(27,58,96,.18), 0 0 0 1px rgba(47,188,212,.12)',
                                    overflow: 'hidden',
                                    fontFamily: 'Cairo,sans-serif',
                                    animation: 'dropIn .2s cubic-bezier(.22,1,.36,1)',
                                    direction: 'rtl',
                                }}>
                                    {/* Header */}
                                    <div style={{
                                        padding: '14px 16px 12px',
                                        borderBottom: '1px solid var(--a-border)',
                                        background: 'var(--a-card-2)',
                                        display: 'flex', alignItems: 'center', justifyContent: 'space-between',
                                    }}>
                                        <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                                            <span style={{ fontSize: 16 }}>🔔</span>
                                            <span style={{ fontSize: 14, fontWeight: 800, color: 'var(--a-text)' }}>الإشعارات</span>
                                        </div>
                                        {notifs.total > 0 ? (
                                            <span style={{
                                                padding: '2px 10px', borderRadius: 999,
                                                background: 'rgba(47,188,212,.14)',
                                                color: '#2fbcd4', fontSize: 11, fontWeight: 800,
                                            }}>
                                                {notifs.total} جديد
                                            </span>
                                        ) : (
                                            <span style={{ fontSize: 11, color: 'var(--a-text-4)' }}>لا يوجد جديد</span>
                                        )}
                                    </div>

                                    {/* Body */}
                                    {notifs.total === 0 ? (
                                        <div style={{ padding: '32px 20px', textAlign: 'center' }}>
                                            <div style={{ fontSize: 36, marginBottom: 10 }}>✅</div>
                                            <p style={{ fontSize: 13, color: 'var(--a-text-4)', lineHeight: 1.7 }}>
                                                كل شيء تمام!<br />لا توجد طلبات معلقة.
                                            </p>
                                        </div>
                                    ) : (
                                        <div style={{ padding: '10px 0' }}>
                                            {/* Student Requests */}
                                            {notifs.students > 0 && (
                                                <Link
                                                    href="/admin/student-requests"
                                                    onClick={() => setBellOpen(false)}
                                                    style={{ textDecoration: 'none', display: 'block' }}
                                                >
                                                    <div style={{
                                                        display: 'flex', alignItems: 'center', gap: 12,
                                                        padding: '11px 16px',
                                                        transition: 'background .15s',
                                                        cursor: 'pointer',
                                                    }}
                                                        onMouseEnter={e => e.currentTarget.style.background = dark ? 'rgba(255,255,255,.04)' : 'rgba(27,58,96,.04)'}
                                                        onMouseLeave={e => e.currentTarget.style.background = 'transparent'}
                                                    >
                                                        <div style={{
                                                            width: 40, height: 40, borderRadius: 12, flexShrink: 0,
                                                            background: 'rgba(47,188,212,.12)',
                                                            display: 'flex', alignItems: 'center', justifyContent: 'center',
                                                            fontSize: 18,
                                                        }}>🎓</div>
                                                        <div style={{ flex: 1, minWidth: 0 }}>
                                                            <div style={{ fontSize: 13, fontWeight: 700, color: 'var(--a-text)', marginBottom: 2 }}>
                                                                طلبات انضمام جديدة
                                                            </div>
                                                            <div style={{ fontSize: 11, color: 'var(--a-text-4)' }}>
                                                                {notifs.students} طالب في انتظار القبول
                                                            </div>
                                                        </div>
                                                        <span style={{
                                                            minWidth: 24, height: 24, borderRadius: 999,
                                                            background: '#2fbcd4', color: '#fff',
                                                            fontSize: 11, fontWeight: 900,
                                                            display: 'flex', alignItems: 'center', justifyContent: 'center',
                                                            padding: '0 6px', flexShrink: 0,
                                                        }}>
                                                            {notifs.students}
                                                        </span>
                                                    </div>
                                                </Link>
                                            )}

                                            {/* Payments */}
                                            {notifs.payments > 0 && (
                                                <Link
                                                    href="/admin/payments"
                                                    onClick={() => setBellOpen(false)}
                                                    style={{ textDecoration: 'none', display: 'block' }}
                                                >
                                                    <div style={{
                                                        display: 'flex', alignItems: 'center', gap: 12,
                                                        padding: '11px 16px',
                                                        transition: 'background .15s',
                                                        cursor: 'pointer',
                                                    }}
                                                        onMouseEnter={e => e.currentTarget.style.background = dark ? 'rgba(255,255,255,.04)' : 'rgba(27,58,96,.04)'}
                                                        onMouseLeave={e => e.currentTarget.style.background = 'transparent'}
                                                    >
                                                        <div style={{
                                                            width: 40, height: 40, borderRadius: 12, flexShrink: 0,
                                                            background: 'rgba(52,211,153,.12)',
                                                            display: 'flex', alignItems: 'center', justifyContent: 'center',
                                                            fontSize: 18,
                                                        }}>💳</div>
                                                        <div style={{ flex: 1, minWidth: 0 }}>
                                                            <div style={{ fontSize: 13, fontWeight: 700, color: 'var(--a-text)', marginBottom: 2 }}>
                                                                طلبات دفع معلقة
                                                            </div>
                                                            <div style={{ fontSize: 11, color: 'var(--a-text-4)' }}>
                                                                {notifs.payments} طلب في انتظار الموافقة
                                                            </div>
                                                        </div>
                                                        <span style={{
                                                            minWidth: 24, height: 24, borderRadius: 999,
                                                            background: '#34d399', color: '#fff',
                                                            fontSize: 11, fontWeight: 900,
                                                            display: 'flex', alignItems: 'center', justifyContent: 'center',
                                                            padding: '0 6px', flexShrink: 0,
                                                        }}>
                                                            {notifs.payments}
                                                        </span>
                                                    </div>
                                                </Link>
                                            )}
                                        </div>
                                    )}

                                    {/* Footer */}
                                    <div style={{
                                        padding: '10px 16px',
                                        borderTop: '1px solid var(--a-border)',
                                        background: 'var(--a-card-2)',
                                        textAlign: 'center',
                                    }}>
                                        <button
                                            onClick={() => setBellOpen(false)}
                                            style={{
                                                background: 'none', border: 'none', cursor: 'pointer',
                                                fontSize: 12, color: 'var(--a-text-4)',
                                                fontFamily: 'Cairo,sans-serif',
                                            }}
                                        >إغلاق ✕</button>
                                    </div>
                                </div>
                            )}
                        </div>

                        <div style={{ width: 38, height: 38, borderRadius: 12, flexShrink: 0, background: 'linear-gradient(135deg,#2fbcd4,#009688)', boxShadow: '0 0 0 2px rgba(47,188,212,.3)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#fff', fontWeight: 900, fontSize: 14, cursor: 'pointer', fontFamily: 'Cairo,sans-serif' }}>
                            {initials}
                        </div>
                    </div>
                </header>

                <main style={{ flex: 1, padding: '24px' }} className="custom-scroll">
                    {children}
                </main>

                <footer style={{ padding: '12px 24px', borderTop: '1px solid var(--a-border)', display: 'flex', alignItems: 'center', justifyContent: 'space-between', background: 'var(--a-footer)' }}>
                    <p style={{ color: 'var(--a-text-4)', fontSize: 11, fontFamily: 'Cairo,sans-serif' }}>
                        © {new Date().getFullYear()} منصة منصور — جميع الحقوق محفوظة
                    </p>
                    <p style={{ color: '#2fbcd4', fontSize: 11, fontWeight: 700, fontFamily: 'Cairo,sans-serif' }}>
                        Powered by KABOx / Mindly
                    </p>
                </footer>
            </div>
        </div>
    );
}
