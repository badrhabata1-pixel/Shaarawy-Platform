const N = '#14213D';
const O = '#F47C20';
const B = '#DCC9A3';

export default function StatCard({ icon, value, label, sub, color }) {
    const accent = color || O;
    return (
        <div style={{
            background: '#fff',
            borderRadius: 16,
            padding: '1.5rem',
            boxShadow: '0 2px 20px rgba(20,33,61,.08)',
            border: '1px solid rgba(220,201,163,.3)',
            display: 'flex', alignItems: 'center', gap: 16,
            transition: 'transform .2s, box-shadow .2s',
            cursor: 'default',
            position: 'relative',
            overflow: 'hidden',
        }}
            onMouseEnter={e => { e.currentTarget.style.transform = 'translateY(-3px)'; e.currentTarget.style.boxShadow = '0 8px 30px rgba(20,33,61,.12)'; }}
            onMouseLeave={e => { e.currentTarget.style.transform = 'none'; e.currentTarget.style.boxShadow = '0 2px 20px rgba(20,33,61,.08)'; }}
        >
            {/* Accent bar */}
            <div style={{ position: 'absolute', top: 0, right: 0, width: 4, height: '100%', background: accent, borderRadius: '0 16px 16px 0' }} />

            {/* Icon */}
            <div style={{
                width: 52, height: 52, borderRadius: 14,
                background: `${accent}18`,
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                fontSize: 24, flexShrink: 0,
            }}>
                {icon}
            </div>

            {/* Text */}
            <div>
                <div style={{ fontSize: 28, fontWeight: 900, color: N, lineHeight: 1 }}>{value}</div>
                <div style={{ fontSize: 13, fontWeight: 700, color: '#666', marginTop: 4 }}>{label}</div>
                {sub && <div style={{ fontSize: 11, color: '#aaa', marginTop: 2 }}>{sub}</div>}
            </div>
        </div>
    );
}
