import React, { useState } from 'react';
import { Link, usePage } from '@inertiajs/react';
import AdminLayout from '@/Layouts/AdminLayout';

/* ═══════════════════════════════════════════════════
   ADMIN FIELD
═══════════════════════════════════════════════════ */
export function AdminField({ label, name, type = 'text', value, onChange, error, hint, options, required, accept, multiple, placeholder, rows: textRows = 4, min, max, step, disabled }) {
    const [preview, setPreview] = useState(null);

    const base = {
        width: '100%', padding: '10px 14px', borderRadius: 12,
        fontSize: 14, fontFamily: 'Cairo, sans-serif', fontWeight: 500,
        outline: 'none', transition: 'border-color 0.2s, box-shadow 0.2s',
        background: 'var(--a-input)',
        border: `1.5px solid ${error ? '#ef4444' : 'var(--a-input-b)'}`,
        color: 'var(--a-text)',
    };

    const focusStyle = (e) => {
        e.target.style.borderColor = error ? '#ef4444' : '#2fbcd4';
        e.target.style.boxShadow = `0 0 0 3px ${error ? '#ef444418' : '#2fbcd418'}`;
    };
    const blurStyle = (e) => {
        e.target.style.borderColor = error ? '#ef4444' : 'var(--a-input-b)';
        e.target.style.boxShadow = 'none';
    };

    const handleFileChange = (e) => {
        const file = multiple ? Array.from(e.target.files) : e.target.files[0];
        if (!multiple && file && file.type.startsWith('image/')) {
            const reader = new FileReader();
            reader.onload = ev => setPreview(ev.target.result);
            reader.readAsDataURL(file);
        }
        onChange(e);
    };

    const renderInput = () => {
        switch (type) {
            case 'textarea':
                return (
                    <textarea name={name} rows={textRows} value={value ?? ''} onChange={onChange}
                        onFocus={focusStyle} onBlur={blurStyle} placeholder={placeholder} disabled={disabled}
                        style={{ ...base, resize: 'vertical', lineHeight: 1.7 }} />
                );
            case 'select':
                return (
                    <select name={name} value={value ?? ''} onChange={onChange}
                        onFocus={focusStyle} onBlur={blurStyle} disabled={disabled}
                        style={{ ...base, cursor: 'pointer' }}>
                        <option value="">— اختر —</option>
                        {options?.map(o => (
                            <option key={o.value} value={o.value}>{o.label}</option>
                        ))}
                    </select>
                );
            case 'toggle':
                return (
                    <label className="flex items-center gap-3 cursor-pointer w-fit">
                        <div className="relative">
                            <input type="checkbox" className="sr-only" checked={!!value} onChange={e => onChange(e.target.checked)} />
                            <div className="w-12 h-6 rounded-full transition-colors"
                                 style={{ background: value ? '#2fbcd4' : 'var(--a-border)' }} />
                            <div className="absolute top-0.5 right-0.5 w-5 h-5 bg-white rounded-full shadow transition-transform"
                                 style={{ transform: value ? 'translateX(-24px)' : 'translateX(0)' }} />
                        </div>
                        <span className="text-sm font-semibold" style={{ color: value ? '#2fbcd4' : 'var(--a-text-4)' }}>
                            {value ? 'نعم' : 'لا'}
                        </span>
                    </label>
                );
            case 'file':
                return (
                    <div>
                        <label className="flex flex-col items-center justify-center gap-2 rounded-2xl cursor-pointer"
                            style={{ border: '2px dashed var(--a-input-b)', padding: '20px', background: 'var(--a-input)' }}>
                            {preview
                                ? <img src={preview} alt="preview" className="w-24 h-24 object-cover rounded-xl mb-2" />
                                : <div className="text-4xl" style={{ opacity: 0.3 }}>📎</div>
                            }
                            <span className="text-sm font-semibold" style={{ color: 'var(--a-text-4)' }}>
                                {preview ? 'اضغط لتغيير الملف' : 'اضغط لرفع ملف'}
                            </span>
                            <input type="file" className="hidden" accept={accept} multiple={multiple} onChange={handleFileChange} />
                        </label>
                    </div>
                );
            default:
                return (
                    <input type={type} name={name} value={value ?? ''} onChange={onChange}
                        onFocus={focusStyle} onBlur={blurStyle} placeholder={placeholder}
                        autoComplete={type === 'password' ? 'new-password' : 'off'}
                        min={min} max={max} step={step} disabled={disabled} style={base} />
                );
        }
    };

    return (
        <div style={{ marginBottom: 20, fontFamily: 'Cairo, sans-serif' }}>
            {label && type !== 'toggle' && (
                <label className="block text-sm font-bold mb-1.5" style={{ color: 'var(--a-text)' }}>
                    {label}
                    {required && <span style={{ color: '#ef4444', marginRight: 4 }}>*</span>}
                </label>
            )}
            {label && type === 'toggle' && (
                <label className="block text-sm font-bold mb-1.5" style={{ color: 'var(--a-text)' }}>{label}</label>
            )}
            {renderInput()}
            {hint && !error && (
                <p className="text-xs mt-1.5 font-medium" style={{ color: 'var(--a-text-4)' }}>{hint}</p>
            )}
            {error && (
                <p className="text-xs mt-1.5 font-bold" style={{ color: '#ef4444' }}>⚠ {error}</p>
            )}
        </div>
    );
}

/* ═══════════════════════════════════════════════════
   ADMIN FORM
═══════════════════════════════════════════════════ */
export default function AdminForm({ title, layoutTitle, description, cancelLink, onSubmit, processing, children, submitLabel }) {
    const { flash } = usePage().props;
    const [showFlash, setShowFlash] = useState(true);

    return (
        <AdminLayout title={layoutTitle || title}>
            <div style={{ direction: 'rtl', fontFamily: 'Cairo, sans-serif', maxWidth: 720 }}>

                {/* Header */}
                <div className="mb-6">
                    <h1 className="font-black text-2xl" style={{ color: 'var(--a-text)' }}>{title}</h1>
                    {description && <p className="text-sm mt-0.5" style={{ color: 'var(--a-text-4)' }}>{description}</p>}
                </div>

                {/* Flash */}
                {flash?.success && showFlash && (
                    <div className="flex items-center gap-3 px-5 py-3.5 rounded-2xl font-bold text-sm mb-5"
                         style={{ background: '#d1fae530', color: '#059669', border: '1.5px solid #10b98130' }}>
                        ✓ {flash.success}
                        <button onClick={() => setShowFlash(false)} className="mr-auto opacity-50 hover:opacity-100">×</button>
                    </div>
                )}
                {flash?.error && showFlash && (
                    <div className="flex items-center gap-3 px-5 py-3.5 rounded-2xl font-bold text-sm mb-5"
                         style={{ background: '#fee2e230', color: '#dc2626', border: '1.5px solid #ef444430' }}>
                        ⚠ {flash.error}
                        <button onClick={() => setShowFlash(false)} className="mr-auto opacity-50 hover:opacity-100">×</button>
                    </div>
                )}

                {/* Form Card */}
                <form onSubmit={onSubmit} encType="multipart/form-data" autoComplete="off" className="rounded-3xl p-7"
                      style={{ background: 'var(--a-card)', boxShadow: '0 4px 24px var(--a-shadow)', border: '1px solid var(--a-border)' }}>

                    {children}

                    {/* Actions */}
                    <div className="flex gap-3 mt-8 pt-6" style={{ borderTop: '1px solid var(--a-border)' }}>
                        <button type="submit" disabled={processing}
                                className="flex-1 py-3 rounded-2xl text-white font-bold text-sm"
                                style={{
                                    background: processing ? 'rgba(47,188,212,0.5)' : 'linear-gradient(135deg, #2fbcd4, #009688)',
                                    boxShadow: processing ? 'none' : '0 4px 14px rgba(47,188,212,0.35)',
                                }}>
                            {processing ? 'جاري الحفظ...' : (submitLabel || 'حفظ')}
                        </button>
                        {cancelLink && (
                            <Link href={cancelLink}
                                  className="flex-1 py-3 rounded-2xl font-bold text-sm text-center"
                                  style={{ background: 'var(--a-cancel-bg)', color: 'var(--a-cancel-text)', border: '1.5px solid var(--a-cancel-border)' }}>
                                إلغاء
                            </Link>
                        )}
                    </div>
                </form>
            </div>
        </AdminLayout>
    );
}
