import { Head } from '@inertiajs/react';
import AdminLayout from '@/Layouts/AdminLayout';

const STATUS = {
    graded:   { label: 'مصحح',          bg: '#d1fae5', color: '#059669', border: '#6ee7b7' },
    pending:  { label: 'قيد المراجعة',  bg: '#fef3c7', color: '#d97706', border: '#fcd34d' },
    rejected: { label: 'مرفوض',         bg: '#fee2e2', color: '#dc2626', border: '#fca5a5' },
};

export default function Index({ grades }) {
    const total   = grades.length;
    const graded  = grades.filter(g => g.status === 'graded').length;
    const pending = grades.filter(g => g.status === 'pending').length;

    return (
        <AdminLayout title="درجات الشيتات">
            <Head title="درجات الشيتات" />

            <style>{`
                @keyframes fadeUp{from{opacity:0;transform:translateY(12px)}to{opacity:1;transform:translateY(0)}}
                .sg-row{animation:fadeUp .3s both}
                .sg-row:hover td{background:var(--a-hover)!important}
            `}</style>

            {/* Header */}
            <div style={{ marginBottom: 24 }}>
                <h1 style={{ fontSize: 22, fontWeight: 900, color: 'var(--a-text)', margin: 0 }}>
                    درجات الشيتات
                </h1>
                <p style={{ color: 'var(--a-text-4)', fontSize: 13, margin: '4px 0 0' }}>
                    نتائج الطلاب في شيتات التدريبات
                </p>
            </div>

            {/* Stats */}
            <div style={{
                display: 'grid', gridTemplateColumns: 'repeat(auto-fit,minmax(160px,1fr))',
                gap: 14, marginBottom: 24,
            }}>
                <StatCard icon="📋" label="إجمالي المحاولات" value={total}   color="#1b3a60" />
                <StatCard icon="✅" label="مصححة"             value={graded}  color="#059669" />
                <StatCard icon="⏳" label="قيد المراجعة"      value={pending} color="#d97706" />
            </div>

            {/* Table */}
            <div style={{
                background: 'var(--a-card)', borderRadius: 20,
                border: '1px solid var(--a-border)',
                boxShadow: '0 4px 24px var(--a-shadow)',
                overflow: 'hidden',
            }}>
                {grades.length === 0 ? (
                    <div style={{
                        textAlign: 'center', padding: '4rem 2rem',
                        color: 'var(--a-text-4)', fontSize: 14,
                    }}>
                        <div style={{ fontSize: 48, marginBottom: 12, opacity: .3 }}>📭</div>
                        لا توجد درجات شيتات بعد.
                    </div>
                ) : (
                    <div style={{ overflowX: 'auto' }}>
                        <table style={{
                            width: '100%', borderCollapse: 'collapse',
                            fontSize: 13, fontFamily: 'Cairo, sans-serif',
                        }}>
                            <thead>
                                <tr style={{ background: 'var(--a-th)', borderBottom: '2px solid var(--a-border)' }}>
                                    {['#', 'الطالب', 'الشيت', 'الدرجة', 'الحالة', 'ملاحظة', 'التاريخ'].map(h => (
                                        <th key={h} style={{
                                            padding: '12px 16px', textAlign: 'right',
                                            fontWeight: 800, color: 'var(--a-text-4)',
                                            fontSize: 12, whiteSpace: 'nowrap',
                                        }}>{h}</th>
                                    ))}
                                </tr>
                            </thead>
                            <tbody>
                                {grades.map((g, i) => {
                                    const s = STATUS[g.status] || STATUS.pending;
                                    return (
                                        <tr key={g.id} className="sg-row"
                                            style={{ animationDelay: `${i * 0.03}s` }}>
                                            <td style={td}>{g.id}</td>
                                            <td style={td}>
                                                <span style={{ fontWeight: 700, color: 'var(--a-text)' }}>
                                                    {g.student?.name ?? '—'}
                                                </span>
                                            </td>
                                            <td style={td}>
                                                <span style={{
                                                    fontWeight: 600, color: 'var(--a-text)',
                                                    display: 'block', maxWidth: 220,
                                                    overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap',
                                                }}>
                                                    {g.sheet?.title ?? '—'}
                                                </span>
                                            </td>
                                            <td style={td}>
                                                <span style={{
                                                    fontWeight: 900, fontSize: 15,
                                                    color: g.total_score != null
                                                        ? (g.status === 'graded' ? '#059669' : '#d97706')
                                                        : 'var(--a-text-4)',
                                                }}>
                                                    {g.total_score ?? '—'}
                                                </span>
                                            </td>
                                            <td style={td}>
                                                <span style={{
                                                    display: 'inline-block',
                                                    background: s.bg, color: s.color,
                                                    border: `1px solid ${s.border}`,
                                                    borderRadius: 99, padding: '3px 12px',
                                                    fontSize: 11, fontWeight: 700,
                                                }}>
                                                    {s.label}
                                                </span>
                                            </td>
                                            <td style={{ ...td, color: 'var(--a-text-4)', fontSize: 12, maxWidth: 180 }}>
                                                <span style={{
                                                    display: 'block', overflow: 'hidden',
                                                    textOverflow: 'ellipsis', whiteSpace: 'nowrap',
                                                }}>
                                                    {g.feedback ?? '—'}
                                                </span>
                                            </td>
                                            <td style={{ ...td, color: 'var(--a-text-4)', fontSize: 11 }}>
                                                {g.created_at ?? '—'}
                                            </td>
                                        </tr>
                                    );
                                })}
                            </tbody>
                        </table>
                    </div>
                )}
            </div>
        </AdminLayout>
    );
}

const td = {
    padding: '12px 16px',
    borderBottom: '1px solid var(--a-border)',
    verticalAlign: 'middle',
    background: 'transparent',
    transition: 'background .15s',
};

function StatCard({ icon, label, value, color }) {
    return (
        <div style={{
            background: 'var(--a-card)', borderRadius: 16,
            border: '1px solid var(--a-border)',
            padding: '1rem 1.25rem',
            display: 'flex', alignItems: 'center', gap: 12,
        }}>
            <div style={{
                width: 40, height: 40, borderRadius: 12,
                background: `${color}18`,
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                fontSize: 18, flexShrink: 0,
            }}>
                {icon}
            </div>
            <div>
                <div style={{ fontSize: 20, fontWeight: 900, color: 'var(--a-text)', lineHeight: 1 }}>
                    {value}
                </div>
                <div style={{ fontSize: 11, color: 'var(--a-text-4)', marginTop: 3 }}>
                    {label}
                </div>
            </div>
        </div>
    );
}
