import { useState } from 'react';
import { router } from '@inertiajs/react';

/* ── Brand Palette (matches Dashboard.jsx) ─────────────── */
const O = '#1F5A45';
const N = '#0E3A2E';
const G = '#1F5A45';

/**
 * أرقام الدفع (فودافون كاش / انستاباي) اللي بتظهر للطلاب.
 * المدرس بس هو اللي يقدر يعدّلها — متعرضش المكون ده أصلاً في داش السكرتارية.
 *
 * الاستخدام (في داش المدرس فقط):
 *
 *   {auth.user.role === 'teacher' && (
 *       <PaymentNumbersEditor numbers={paymentNumbers} />
 *   )}
 *
 * "numbers" prop المتوقعة:
 *   { vodafone_number: '01012345678', instapay_number: 'yourname@instapay' }
 */
export default function PaymentNumbersEditor({ numbers = {} }) {
    const [vodafone, setVodafone] = useState(numbers.vodafone_number || '');
    const [instapay, setInstapay] = useState(numbers.instapay_number || numbers.instapay_handle || '');
    const [saving, setSaving] = useState(false);
    const [saved, setSaved]   = useState(false);

    const handleSave = () => {
        setSaving(true);
        setSaved(false);
        router.post(route('admin.payment-settings.update'), {
            vodafone_number: vodafone,
            vodafone_name: 'فودافون كاش', // الاسم الثابت المطلوب في الـ Controller
            instapay_number: instapay,
            instapay_name: 'انستاباي',    // الاسم الثابت المطلوب في الـ Controller
        }, {
            preserveScroll: true,
            onSuccess: () => { setSaving(false); setSaved(true); setTimeout(() => setSaved(false), 2500); },
            onError:   (err) => { setSaving(false); console.error(err); alert('خطأ في الحفظ!'); },
        });
    };

    return (
        <div style={{
            background: 'var(--a-card, var(--db-card, #fff))',
            borderRadius: 20,
            padding: '1.5rem 1.75rem',
            border: `1px solid var(--a-border, var(--db-border, rgba(31,90,69,.35)))`,
            boxShadow: '0 2px 20px var(--a-shadow, var(--db-shadow, rgba(14,58,46,.07)))',
            textAlign: 'right',
        }}>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '1rem' }}>
                <h2 style={{ margin: 0, fontSize: 16, fontWeight: 800, color: 'var(--a-text, var(--db-text, #0E3A2E))' }}>
                    ⚙️ أرقام استقبال الدفع
                </h2>
                <span style={{
                    background: `${G}18`, color: '#0f6a78',
                    borderRadius: 20, padding: '4px 12px', fontSize: 11, fontWeight: 700,
                }}>
                    🔒 خاص بالمدرس فقط
                </span>
            </div>

            <p style={{ color: 'var(--a-text-4, var(--db-muted, #64748B))', fontSize: 12.5, lineHeight: 1.7, marginBottom: '1.1rem' }}>
                الأرقام دي هي اللي بتظهر للطلاب في صفحة تأكيد الاشتراك عشان يحوّلوا عليها.
            </p>

            <div style={{ display: 'flex', flexDirection: 'column', gap: 12, marginBottom: '1.1rem' }}>
                <label style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
                    <span style={{ fontSize: 12.5, fontWeight: 700, color: 'var(--a-text, var(--db-text, #0E3A2E))' }}>
                        📱 رقم فودافون كاش
                    </span>
                    <input
                        type="text"
                        value={vodafone}
                        onChange={e => setVodafone(e.target.value)}
                        placeholder="01000000000"
                        style={{
                            border: '1px solid var(--a-border, var(--db-rowbdr, #E2E8F0))',
                            borderRadius: 10, padding: '10px 14px', fontSize: 13,
                            background: 'var(--a-card-2, var(--db-row, #F8FAFC))', color: 'var(--a-text, var(--db-text, #0E3A2E))',
                            fontFamily: 'Cairo, sans-serif',
                        }}
                    />
                </label>

                <label style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
                    <span style={{ fontSize: 12.5, fontWeight: 700, color: 'var(--a-text, var(--db-text, #0E3A2E))' }}>
                        💳 حساب انستاباي
                    </span>
                    <input
                        type="text"
                        value={instapay}
                        onChange={e => setInstapay(e.target.value)}
                        placeholder="yourname@instapay"
                        style={{
                            border: '1px solid var(--a-border, var(--db-rowbdr, #E2E8F0))',
                            borderRadius: 10, padding: '10px 14px', fontSize: 13,
                            background: 'var(--a-card-2, var(--db-row, #F8FAFC))', color: 'var(--a-text, var(--db-text, #0E3A2E))',
                            fontFamily: 'Cairo, sans-serif',
                        }}
                    />
                </label>
            </div>

            <button
                onClick={handleSave}
                disabled={saving}
                style={{
                    width: '100%',
                    background: saved ? '#059669' : O,
                    color: '#fff',
                    padding: '11px 24px',
                    borderRadius: 10,
                    fontSize: 13,
                    fontWeight: 800,
                    fontFamily: 'Cairo, sans-serif',
                    border: 'none',
                    cursor: saving ? 'default' : 'pointer',
                    opacity: saving ? .7 : 1,
                    transition: 'background .2s, opacity .2s',
                }}
            >
                {saved ? '✅ تم الحفظ' : saving ? 'جارٍ الحفظ...' : 'حفظ الأرقام 💾'}
            </button>
        </div>
    );
}
