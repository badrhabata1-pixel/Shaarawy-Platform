import { useForm } from '@inertiajs/react';
import { useEffect, useRef } from 'react';

const O = '#F47C20';
const N = '#14213D';
const B = '#DCC9A3';

export default function PromoModal({ lessonId, lessonTitle, onClose, flash }) {
    const { data, setData, post, processing, errors, reset } = useForm({ code: '' });
    const inputRef = useRef(null);

    useEffect(() => {
        // Focus input on open
        setTimeout(() => inputRef.current?.focus(), 50);
        // Close on Escape
        const handler = (e) => { if (e.key === 'Escape') onClose(); };
        window.addEventListener('keydown', handler);
        return () => window.removeEventListener('keydown', handler);
    }, []);

    const handleSubmit = (e) => {
        e.preventDefault();
        post(route('student.lessons.unlock', lessonId), {
            onSuccess: () => { reset(); onClose(); },
        });
    };

    return (
        <>
            {/* Backdrop */}
            <div
                onClick={onClose}
                style={{
                    position: 'fixed', inset: 0,
                    background: 'rgba(20,33,61,.7)',
                    backdropFilter: 'blur(6px)',
                    zIndex: 100,
                    animation: 'fadeIn .2s ease',
                }}
            />

            {/* Modal */}
            <div style={{
                position: 'fixed',
                top: '50%', left: '50%',
                transform: 'translate(-50%, -50%)',
                zIndex: 101,
                width: '90%', maxWidth: 420,
                background: '#F7F3EB',
                borderRadius: 20,
                overflow: 'hidden',
                boxShadow: '0 30px 80px rgba(0,0,0,.5)',
                animation: 'modalIn .3s cubic-bezier(.22,1,.36,1)',
                direction: 'rtl',
                fontFamily: "'Cairo', sans-serif",
            }}>

                {/* Header */}
                <div style={{
                    background: N,
                    padding: '1.5rem 1.75rem',
                    display: 'flex', alignItems: 'center', justifyContent: 'space-between',
                    borderBottom: `3px solid ${O}`,
                }}>
                    <div>
                        <div style={{ color: '#fff', fontWeight: 800, fontSize: 16 }}>🔑 فتح الدرس</div>
                        <div style={{ color: B, fontSize: 11, marginTop: 2, opacity: .8 }}>{lessonTitle}</div>
                    </div>
                    <button
                        onClick={onClose}
                        style={{
                            background: 'rgba(255,255,255,.1)',
                            border: 'none', color: '#fff',
                            width: 32, height: 32, borderRadius: '50%',
                            cursor: 'pointer', fontSize: 16,
                            display: 'flex', alignItems: 'center', justifyContent: 'center',
                        }}
                    >✕</button>
                </div>

                {/* Body */}
                <form onSubmit={handleSubmit} style={{ padding: '1.75rem' }}>

                    {/* Info note */}
                    <div style={{
                        background: 'rgba(20,33,61,.06)',
                        border: `1px solid ${B}`,
                        borderRadius: 10, padding: '10px 14px',
                        fontSize: 12, color: N, lineHeight: 1.7,
                        marginBottom: 16,
                    }}>
                        أدخل كود التفعيل الذي حصلت عليه من مركزك. إذا لم يكن لديك كود، تواصل مع الإدارة.
                    </div>

                    {/* Code input */}
                    <label style={{ display: 'block', fontWeight: 700, fontSize: 13, color: N, marginBottom: 6 }}>
                        كود التفعيل <span style={{ color: O }}>*</span>
                    </label>
                    <input
                        ref={inputRef}
                        type="text"
                        value={data.code}
                        onChange={e => setData('code', e.target.value)}
                        placeholder="أدخل الكود هنا..."
                        style={{
                            width: '100%',
                            border: `1.5px solid ${errors.code ? '#C0392B' : B}`,
                            borderRadius: 10, padding: '12px 14px',
                            fontSize: 14, textAlign: 'center',
                            letterSpacing: 3,
                            background: '#fff', color: N,
                            fontFamily: 'monospace',
                            outline: 'none',
                            boxSizing: 'border-box',
                        }}
                    />
                    {errors.code && (
                        <p style={{ color: '#C0392B', fontSize: 11, marginTop: 5 }}>{errors.code}</p>
                    )}

                    {/* Submit */}
                    <button
                        type="submit"
                        disabled={processing || !data.code}
                        style={{
                            width: '100%',
                            background: processing ? '#ccc' : O,
                            color: '#fff', border: 'none',
                            borderRadius: 10, padding: '13px',
                            fontSize: 14, fontWeight: 800,
                            cursor: processing ? 'not-allowed' : 'pointer',
                            marginTop: 12,
                            fontFamily: "'Cairo', sans-serif",
                            transition: 'opacity .2s',
                        }}
                    >
                        {processing ? 'جارٍ التحقق...' : '🔓 تفعيل الدرس'}
                    </button>
                </form>
            </div>

            <style>{`
                @keyframes fadeIn  { from { opacity: 0 } to { opacity: 1 } }
                @keyframes modalIn { from { opacity:0; transform:translate(-50%,-48%) scale(.96) } to { opacity:1; transform:translate(-50%,-50%) scale(1) } }
            `}</style>
        </>
    );
}
