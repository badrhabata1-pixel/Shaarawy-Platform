import { useState, useEffect } from 'react';
import { useForm, Head, usePage } from '@inertiajs/react';
import AdminLayout from '@/Layouts/AdminLayout';

function useAdminDark() {
    const [dark, setDark] = useState(() => {
        try { return localStorage.getItem('adminTheme') === 'dark'; } catch { return false; }
    });
    useEffect(() => {
        const el = document.querySelector('[data-theme]');
        if (!el) return;
        setDark(el.dataset.theme === 'dark');
        const obs = new MutationObserver(() => setDark(el.dataset.theme === 'dark'));
        obs.observe(el, { attributes: true, attributeFilter: ['data-theme'] });
        return () => obs.disconnect();
    }, []);
    return dark;
}

export default function PaymentSettings({ settings = {} }) {
    const { props } = usePage();
    const flash = props.flash ?? {};
    const dark  = useAdminDark();

    const { data, setData, post, processing, errors } = useForm({
        vodafone_number: settings.vodafone_number ?? '',
        vodafone_name:   settings.vodafone_name   ?? '',
        instapay_number: settings.instapay_number ?? '',
        instapay_name:   settings.instapay_name   ?? '',
    });

    const submit = (e) => {
        e.preventDefault();
        post(route('admin.payment-settings.update'));
    };

    return (
        <AdminLayout title="إعدادات الدفع">
            <Head title="إعدادات أرقام الدفع" />

            <div style={{ maxWidth: 600, margin: '0 auto', padding: '32px 28px', fontFamily: "'Cairo',sans-serif", direction: 'rtl' }}>

                <div style={{ marginBottom: 28 }}>
                    <h1 style={{ fontSize: 22, fontWeight: 800, color: 'var(--a-text)', margin: 0 }}>⚙️ أرقام الدفع</h1>
                    <p style={{ fontSize: 13, color: 'var(--a-text-4)', marginTop: 6 }}>الأرقام دي هتظهر للطلاب لما يختاروا طريقة الدفع</p>
                </div>

                {flash.success && (
                    <div style={{
                        background: dark ? 'rgba(5,150,105,.18)' : '#D1FAE5',
                        border: `1px solid ${dark ? 'rgba(52,211,153,.25)' : '#6EE7B7'}`,
                        borderRadius: 10, padding: '10px 16px',
                        color: dark ? '#34d399' : '#065F46',
                        fontSize: 13, marginBottom: 20, fontWeight: 600,
                    }}>
                        ✓ {flash.success}
                    </div>
                )}

                <form onSubmit={submit}>

                    {/* Vodafone */}
                    <Section icon="📱" title="فودافون كاش" color="#E40000">
                        <Field label="رقم فودافون" error={errors.vodafone_number}>
                            <input
                                type="text"
                                value={data.vodafone_number}
                                onChange={e => setData('vodafone_number', e.target.value)}
                                placeholder="01xxxxxxxxx"
                                style={inputStyle(!!errors.vodafone_number)}
                                dir="ltr"
                            />
                        </Field>
                        <Field label="اسم الحساب (اللي هيظهر للطالب)" error={errors.vodafone_name}>
                            <input
                                type="text"
                                value={data.vodafone_name}
                                onChange={e => setData('vodafone_name', e.target.value)}
                                placeholder="محمد منصور"
                                style={inputStyle(!!errors.vodafone_name)}
                            />
                        </Field>
                    </Section>

                    {/* InstaPay */}
                    <Section icon="⚡" title="إنستا باي" color="#7C3AED">
                        <Field label="رقم إنستا باي" error={errors.instapay_number}>
                            <input
                                type="text"
                                value={data.instapay_number}
                                onChange={e => setData('instapay_number', e.target.value)}
                                placeholder="01xxxxxxxxx"
                                style={inputStyle(!!errors.instapay_number)}
                                dir="ltr"
                            />
                        </Field>
                        <Field label="اسم الحساب (اللي هيظهر للطالب)" error={errors.instapay_name}>
                            <input
                                type="text"
                                value={data.instapay_name}
                                onChange={e => setData('instapay_name', e.target.value)}
                                placeholder="محمد منصور"
                                style={inputStyle(!!errors.instapay_name)}
                            />
                        </Field>
                    </Section>

                    {/* Preview */}
                    <div style={{
                        background: 'linear-gradient(135deg,#141210,#1C1916)',
                        borderRadius: 14, padding: '20px', marginBottom: 24,
                        border: '1px solid rgba(31,90,69,.2)',
                    }}>
                        <p style={{ fontSize: 12, color: '#1F5A45', marginBottom: 14, fontWeight: 700 }}>معاينة — اللي سيظهر للطالب:</p>
                        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12 }}>
                            {[
                                { label: 'فودافون كاش', icon: '📱', num: data.vodafone_number, name: data.vodafone_name },
                                { label: 'إنستا باي',   icon: '⚡', num: data.instapay_number, name: data.instapay_name },
                            ].map(p => (
                                <div key={p.label} style={{ background: 'rgba(255,255,255,.06)', borderRadius: 10, padding: '14px', textAlign: 'center', border: '1px solid rgba(31,90,69,.2)' }}>
                                    <div style={{ fontSize: 22, marginBottom: 6 }}>{p.icon}</div>
                                    <div style={{ fontSize: 12, color: '#94a3b8', marginBottom: 4 }}>{p.label}</div>
                                    <div style={{ fontSize: 18, fontWeight: 900, color: '#1F5A45', letterSpacing: '.06em', direction: 'ltr', fontFamily: 'monospace' }}>{p.num || '—'}</div>
                                    <div style={{ fontSize: 11, color: '#94a3b8', marginTop: 4 }}>{p.name || '—'}</div>
                                </div>
                            ))}
                        </div>
                    </div>

                    <button type="submit" disabled={processing} style={{
                        width: '100%', padding: '13px', borderRadius: 12,
                        background: processing ? 'var(--a-border)' : 'linear-gradient(135deg,#1F5A45,#8B5E3C)',
                        color: processing ? 'var(--a-text-3)' : '#fff',
                        border: 'none', fontSize: 15, fontWeight: 800,
                        cursor: processing ? 'not-allowed' : 'pointer',
                        fontFamily: "'Cairo',sans-serif",
                        boxShadow: processing ? 'none' : '0 6px 24px rgba(31,90,69,.35)',
                        transition: 'all .2s',
                    }}>
                        {processing ? 'جارٍ الحفظ...' : '💾 حفظ الأرقام'}
                    </button>
                </form>
            </div>
        </AdminLayout>
    );
}

function Section({ icon, title, color, children }) {
    return (
        <div style={{
            background: 'var(--a-card)',
            borderRadius: 14, padding: '20px 22px', marginBottom: 18,
            border: '1px solid var(--a-border)',
            boxShadow: '0 2px 12px var(--a-shadow)',
        }}>
            <div style={{
                display: 'flex', alignItems: 'center', gap: 10,
                marginBottom: 16, paddingBottom: 12,
                borderBottom: '1px solid var(--a-border)',
            }}>
                <span style={{ fontSize: 22 }}>{icon}</span>
                <span style={{ fontWeight: 800, fontSize: 15, color }}>{title}</span>
            </div>
            {children}
        </div>
    );
}

function Field({ label, error, children }) {
    return (
        <div style={{ marginBottom: 14 }}>
            <label style={{ display: 'block', fontSize: 13, fontWeight: 700, color: 'var(--a-text-2)', marginBottom: 6 }}>
                {label}
            </label>
            {children}
            {error && <p style={{ color: '#ef4444', fontSize: 11, marginTop: 4 }}>{error}</p>}
        </div>
    );
}

const inputStyle = (hasError) => ({
    width: '100%', boxSizing: 'border-box',
    border: `1.5px solid ${hasError ? '#ef4444' : 'var(--a-input-b)'}`,
    borderRadius: 8, padding: '11px 13px', fontSize: 14,
    color: 'var(--a-text)', outline: 'none',
    fontFamily: "'Cairo',sans-serif",
    background: 'var(--a-input)',
    transition: 'border-color .2s',
});
