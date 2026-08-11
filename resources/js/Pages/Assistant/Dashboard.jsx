import { Head, Link } from '@inertiajs/react';
import AssistantLayout from '@/Layouts/AssistantLayout';
import { useState, useEffect, useRef } from 'react';
import ReceiptsReviewModal from '@/Components/ReceiptsReviewModal';

const O = '#F47C20'; // برتقالي
const N = '#14213D'; // كحلي
const B = '#DCC9A3'; // ذهبي
const C = {
    navy: '#14213D', orange: '#F47C20', gold: '#DCC9A3',
    orangeD: '#d96a12', navyL: '#1e2e50',
};

/* ─── Stat Card ───────────────────────────────────── */
function StatCard({ label, value, color, icon, href, delay = 0, theme }) {
    const ref = useRef(null);
    useEffect(() => {
        if (!ref.current) return;
        ref.current.style.opacity = '0';
        ref.current.style.transform = 'translateY(24px)';
        const t = setTimeout(() => {
            if (!ref.current) return;
            ref.current.style.transition = 'opacity .5s ease, transform .5s ease';
            ref.current.style.opacity = '1';
            ref.current.style.transform = 'translateY(0)';
        }, delay);
        return () => clearTimeout(t);
    }, []);

    const inner = (
        <div ref={ref} style={{
            background: theme.bgCard,
            borderRadius: 16,
            padding: '22px 24px',
            border: theme.borderCard,
            boxShadow: theme.darkMode ? '0 4px 20px rgba(0,0,0,.35)' : '0 4px 20px rgba(20,33,61,.06)',
            position: 'relative',
            overflow: 'hidden',
            cursor: href ? 'pointer' : 'default',
            transition: 'box-shadow .25s, transform .25s, background .3s, border .3s',
        }}
            onMouseEnter={e => { e.currentTarget.style.boxShadow = theme.darkMode ? '0 8px 30px rgba(0,0,0,.5)' : '0 8px 30px rgba(20,33,61,.12)'; e.currentTarget.style.transform = 'translateY(-2px)'; }}
            onMouseLeave={e => { e.currentTarget.style.boxShadow = theme.darkMode ? '0 4px 20px rgba(0,0,0,.35)' : '0 4px 20px rgba(20,33,61,.06)'; e.currentTarget.style.transform = 'translateY(0)'; }}
        >
            {/* Accent bar */}
            <div style={{ position: 'absolute', top: 0, left: 0, right: 0, height: 3, background: `linear-gradient(90deg, ${color}, ${color}00)` }} />
            
            <div style={{ display: 'flex', alignItems: 'center', gap: 14 }}>
                <div style={{ width: 46, height: 46, borderRadius: 14, display: 'flex', alignItems: 'center', justifyContent: 'center', background: `${color}15`, fontSize: 20 }}>
                    {icon}
                </div>
                <div>
                    <p style={{ color: '#888', fontSize: 12, fontWeight: 600 }}>{label}</p>
                    <div style={{ display: 'flex', alignItems: 'baseline', gap: 2, marginTop: 4 }}>
                        <span style={{ color: theme.textMain, fontSize: 26, fontWeight: 900 }}>{value}</span>
                    </div>
                </div>
            </div>
        </div>
    );

    return href ? <Link href={href} style={{ textDecoration: 'none' }}>{inner}</Link> : inner;
}

/* ─── Group Card ──────────────────────────────────── */
function GroupCard({ group, delay, theme }) {
    const [hov, setHov] = useState(false);
    const ref = useRef(null);
    
    useEffect(() => {
        if (!ref.current) return;
        ref.current.style.opacity = '0';
        ref.current.style.transform = 'translateX(16px)';
        const t = setTimeout(() => {
            if (!ref.current) return;
            ref.current.style.transition = 'opacity .4s ease, transform .4s ease';
            ref.current.style.opacity = '1';
            ref.current.style.transform = 'translateX(0)';
        }, delay);
        return () => clearTimeout(t);
    }, [delay]);

    return (
        <div ref={ref} style={{
            background: theme.bgCard,
            border: theme.borderCard,
            borderRadius: 12,
            padding: '16px 18px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            boxShadow: theme.darkMode ? '0 2px 10px rgba(0,0,0,.25)' : '0 2px 10px rgba(20,33,61,.04)',
            transition: 'all 0.3s ease'
        }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
                <div style={{
                    width: 42, height: 42, borderRadius: 10,
                    background: `linear-gradient(135deg, ${C.navy}, ${C.navyL})`,
                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                    color: C.gold, fontSize: 18,
                }}>
                    👥
                </div>
                <div>
                    <div style={{ fontWeight: 700, color: theme.textMain, fontSize: 14 }}>{group.name}</div>
                    <div style={{ fontSize: 12, color: theme.textMuted }}>{group.year} {group.hour ? `• ${group.hour}` : ''}</div>
                </div>
            </div>
            <div style={{
                background: `${C.orange}15`, color: C.orange,
                borderRadius: 20, padding: '4px 12px',
                fontSize: 13, fontWeight: 700,
            }}>
                {group.students_count} طالب
            </div>
        </div>
    );
}

/* ─── Dashboard Page ──────────────────────────────── */
export default function AssistantDashboard({ assistant, stats, my_groups = [], receipts = [] }) {
    const [darkMode, setDarkMode] = useState(false);
    const [showReceipts, setShowReceipts] = useState(false);
    const pendingReceiptsCount = receipts.filter(r => r.status === 'pending').length;

    // MutationObserver لمراقبة الوضع المظلم وتحديث الألوان فوراً للمساعدين
    useEffect(() => {
        setDarkMode(document.documentElement.classList.contains('dark'));

        const observer = new MutationObserver((mutations) => {
            mutations.forEach((mutation) => {
                if (mutation.attributeName === 'class') {
                    setDarkMode(document.documentElement.classList.contains('dark'));
                }
            });
        });

        observer.observe(document.documentElement, {
            attributes: true,
            attributeFilter: ['class'],
        });

        return () => observer.disconnect();
    }, []);

    // ألوان تفاعلية بناءً على تفعيل الوضع المظلم
    const bgCard = darkMode ? '#152238' : '#ffffff';
    const borderCard = darkMode ? '1px solid rgba(220,201,163,0.15)' : '1px solid #e8edf5';
    const borderCell = darkMode ? '1px solid rgba(255,255,255,0.05)' : '1px solid #f1f5f9';
    const textMain = darkMode ? '#f8f9fa' : '#14213D';
    const textMuted = darkMode ? '#94a3b8' : '#64748b';
    const bgRowHover = darkMode ? 'rgba(255,255,255,0.02)' : '#fafbff';

    const theme = { darkMode, bgCard, borderCard, borderCell, textMain, textMuted, bgRowHover };

    return (
        <AssistantLayout assistant={assistant} title="لوحة التحكم">
            <Head title="لوحة السكرتارية — منصة الصيفي" />

            <style>{`
                @keyframes fadeInUp {
                    from { opacity: 0; transform: translateY(16px); }
                    to   { opacity: 1; transform: translateY(0); }
                }
            `}</style>

            {/* ── Greeting ── */}
            <div style={{
                background: `linear-gradient(135deg, ${C.navy} 0%, ${C.navyL} 100%)`,
                borderRadius: 20,
                padding: '24px 28px',
                marginBottom: 28,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                flexWrap: 'wrap',
                gap: 14,
                boxShadow: '0 8px 32px rgba(20,33,61,.2)',
                position: 'relative',
                overflow: 'hidden',
            }}>
                <div style={{
                    position: 'absolute', top: -40, left: -40,
                    width: 200, height: 200, borderRadius: '50%',
                    background: 'rgba(244,124,32,.08)', pointerEvents: 'none',
                }} />
                <div>
                    <h2 style={{ color: '#fff', fontSize: 22, fontWeight: 900, margin: '0 0 6px' }}>
                        أهلاً، سكرتارية المنصة 👋
                    </h2>
                    <p style={{ color: C.gold, fontSize: 14, margin: 0, opacity: .8 }}>
                        {new Date().toLocaleDateString('ar-EG', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}
                    </p>
                </div>
                <div style={{ display: 'flex', alignItems: 'center', gap: 10, position: 'relative', zIndex: 2 }}>
                    <div style={{
                        background: `linear-gradient(135deg, ${C.orange}, ${C.orangeD})`,
                        borderRadius: 12, padding: '10px 18px',
                        color: '#fff', fontSize: 13, fontWeight: 700,
                        boxShadow: `0 4px 16px rgba(244,124,32,.4)`,
                    }}>
                        {assistant?.role === 'admin' ? '🔑 مدير النظام' : '🎓 مساعد / سكرتير'}
                    </div>
                </div>
            </div>

            {/* ── Stat Cards ── */}
            <div style={{
                display: 'grid',
                gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))',
                gap: 16,
                marginBottom: 28,
            }}>
                <StatCard
                    label="الطلاب المفعلين"
                    value={stats?.my_students ?? 0}
                    color={C.orange}
                    icon="👨‍🎓"
                    delay={0}
                    theme={theme}
                />
                <StatCard
                    label="امتحانات تنتظر التصحيح"
                    value={stats?.pending_exams ?? 0}
                    color="#2563eb"
                    icon="📝"
                    href={route('assistant.exams.pending')}
                    delay={80}
                    theme={theme}
                />
                <StatCard
                    label="شيتات تنتظر التصحيح"
                    value={stats?.pending_sheets ?? 0}
                    color="#16a34a"
                    icon="📋"
                    href={route('assistant.sheets.pending')}
                    delay={160}
                    theme={theme}
                />
                <StatCard
                    label="طلاب متأخرون في الفيديوهات"
                    value={stats?.unwatched_count ?? 0}
                    color="#dc2626"
                    icon="🎬"
                    delay={240}
                    theme={theme}
                />
            </div>

            {/* ── Two-column: Groups + Quick Actions ── */}
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: 20, marginBottom: 28 }}>
                {/* My Groups */}
                <div style={{
                    background: bgCard, borderRadius: 16, padding: '20px 22px',
                    border: borderCard,
                    boxShadow: '0 4px 20px rgba(0,0,0,.02)',
                    transition: 'all 0.3s ease'
                }}>
                    <h3 style={{ color: textMain, fontSize: 16, fontWeight: 800, marginBottom: 16, display: 'flex', alignItems: 'center', gap: 8 }}>
                        <span style={{ background: `${C.orange}18`, color: C.orange, borderRadius: 8, padding: '4px 8px' }}>👥</span>
                        مجموعاتي
                    </h3>
                    {my_groups.length === 0 ? (
                        <p style={{ color: '#94a3b8', textAlign: 'center', padding: '20px 0', fontSize: 14 }}>
                            لا توجد مجموعات مُعيّنة لك بعد
                        </p>
                    ) : (
                        <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
                            {my_groups.map((group, i) => (
                                <GroupCard key={group.id} group={group} delay={i * 60} theme={theme} />
                            ))}
                        </div>
                    )}
                </div>

                {/* Quick Actions */}
                <div style={{
                    background: bgCard, borderRadius: 16, padding: '20px 22px',
                    border: borderCard,
                    boxShadow: '0 4px 20px rgba(0,0,0,.02)',
                    transition: 'all 0.3s ease'
                }}>
                    <h3 style={{ color: textMain, fontSize: 16, fontWeight: 800, marginBottom: 16, display: 'flex', alignItems: 'center', gap: 8 }}>
                        <span style={{ background: `${C.orange}18`, color: C.orange, borderRadius: 8, padding: '4px 8px' }}>⚡</span>
                        إجراءات سريعة
                    </h3>
                    <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
                        {[
                            { label: 'تفعيل طلاب جدد', href: route('assistant.students.requests'), color: C.orange, icon: '✅' },
                            { label: 'إيصالات الدفع', onClick: () => setShowReceipts(true), count: pendingReceiptsCount, color: '#d97706', icon: '🧾' },
                            { label: 'تصحيح الشيتات',   href: route('assistant.sheets.pending'),  color: '#16a34a', icon: '📋' },
                            { label: 'تصحيح الامتحانات',href: route('assistant.exams.pending'),   color: '#2563eb', icon: '📝' },
                            { label: 'أكواد التفعيل',   href: route('assistant.promo.index'),     color: '#0891b2', icon: '🎫' },
                        ].map(action => {
                            const actionStyle = {
                                display: 'flex', alignItems: 'center', gap: 12,
                                padding: '12px 14px', borderRadius: 12,
                                background: `${action.color}0d`,
                                border: `1px solid ${action.color}22`,
                                textDecoration: 'none', color: action.color,
                                fontWeight: 700, fontSize: 14,
                                transition: 'all .2s',
                            };
                            const content = (
                                <>
                                    <span style={{ fontSize: 18 }}>{action.icon}</span>
                                    <span>{action.label}</span>
                                    {action.count > 0 && (
                                        <span style={{
                                            background: action.color, color: '#fff', borderRadius: 99,
                                            minWidth: 20, height: 20, display: 'inline-flex',
                                            alignItems: 'center', justifyContent: 'center',
                                            fontSize: 11, fontWeight: 900, padding: '0 5px',
                                        }}>
                                            {action.count}
                                        </span>
                                    )}
                                    <span style={{ marginRight: 'auto', opacity: .5, fontSize: 16 }}>←</span>
                                </>
                            );

                            return action.onClick ? (
                                <button key={action.label} type="button" onClick={action.onClick} style={{ ...actionStyle, cursor: 'pointer', fontFamily: 'Cairo, sans-serif' }}
                                    onMouseEnter={e => { e.currentTarget.style.background = `${action.color}1a`; e.currentTarget.style.transform = 'translateX(-4px)'; }}
                                    onMouseLeave={e => { e.currentTarget.style.background = `${action.color}0d`; e.currentTarget.style.transform = 'translateX(0)'; }}
                                >
                                    {content}
                                </button>
                            ) : (
                                <Link key={action.href} href={action.href} style={actionStyle}
                                onMouseEnter={e => { e.currentTarget.style.background = `${action.color}1a`; e.currentTarget.style.transform = 'translateX(-4px)'; }}
                                onMouseLeave={e => { e.currentTarget.style.background = `${action.color}0d`; e.currentTarget.style.transform = 'translateX(0)'; }}
                                >
                                    {content}
                                </Link>
                            );
                        })}
                    </div>
                </div>
            </div>

            {/* ═══ RECEIPTS MODAL ═══ */}
            <ReceiptsReviewModal
                open={showReceipts}
                onClose={() => setShowReceipts(false)}
                receipts={receipts}
                routePrefix="assistant"
            />

        </AssistantLayout>
    );
}

