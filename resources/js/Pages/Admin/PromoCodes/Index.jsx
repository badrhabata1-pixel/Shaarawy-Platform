import React, { useState, useEffect, useMemo } from 'react';
import { Head, useForm, router } from '@inertiajs/react';
import AdminLayout from '@/Layouts/AdminLayout';

const O   = '#2fbcd4';
const N   = '#1b3a60';
const R   = '#f87171';
const GRN = '#34d399';

function useAdminDark() {
    const [dark, setDark] = useState(() => {
        try { return localStorage.getItem('adminTheme') === 'dark'; } catch { return false; }
    });
    useEffect(() => {
        const el = document.querySelector('[data-theme]');
        if (!el) return;
        const sync = () => setDark(el.getAttribute('data-theme') === 'dark');
        sync();
        const obs = new MutationObserver(sync);
        obs.observe(el, { attributes: true, attributeFilter: ['data-theme'] });
        return () => obs.disconnect();
    }, []);
    return dark;
}

export default function Index({ promoCodes = [], academicYears = [] }) {
    const dark = useAdminDark();

    const [deleteId, setDeleteId]     = useState(null);
    const [copied, setCopied]         = useState(null);
    const [filterStatus, setFilter]   = useState('all');
    const [filterYear, setFilterYear] = useState('');
    const [search, setSearch]         = useState('');

    const { data, setData, post, processing, errors, reset } = useForm({
        academic_year_id: '',
        count: 10,
    });

    const handleSubmit = (e) => {
        e.preventDefault();
        post(route('admin.promo.generate'), { onSuccess: () => reset() });
    };

    const handleDelete = () => {
        if (!deleteId) return;
        router.delete(route('admin.promo.destroy', deleteId), {
            preserveScroll: true,
            onSuccess: () => setDeleteId(null),
        });
    };

    const copyCode = (code) => {
        navigator.clipboard.writeText(code).then(() => {
            setCopied(code);
            setTimeout(() => setCopied(null), 1800);
        }).catch(() => {});
    };

    const total          = promoCodes.length;
    const usedCount      = promoCodes.filter(p => p.is_used).length;
    const availableCount = total - usedCount;

    const filtered = useMemo(() => {
        return promoCodes.filter(p => {
            if (filterStatus === 'available' && p.is_used)  return false;
            if (filterStatus === 'used'      && !p.is_used) return false;
            if (filterYear && String(p.academic_year_id) !== String(filterYear)) return false;
            if (search && !p.code.includes(search.trim())) return false;
            return true;
        });
    }, [promoCodes, filterStatus, filterYear, search]);

    const exportCSV = () => {
        const headers = ['#', 'الكود', 'الصف الدراسي', 'الحالة', 'شحن بواسطة', 'تاريخ الاستخدام'];
        const rows = filtered.map((p, i) => [
            i + 1,
            p.code,
            p.academic_year?.name ?? '',
            p.is_used ? 'مستخدم' : 'متاح',
            p.used_by?.name ?? '',
            p.used_at ? new Date(p.used_at).toLocaleDateString('ar-EG') : '',
        ]);
        const csv = [headers, ...rows]
            .map(row => row.map(v => `"${String(v).replace(/"/g, '""')}"`).join(','))
            .join('\r\n');
        const blob = new Blob(['﻿' + csv], { type: 'text/csv;charset=utf-8' });
        const url  = URL.createObjectURL(blob);
        const a    = document.createElement('a');
        a.href     = url;
        a.download = `promo-codes-${new Date().toISOString().slice(0, 10)}.csv`;
        a.click();
        URL.revokeObjectURL(url);
    };

    /* ── tokens that can't be CSS vars ── */
    const cardBdr  = dark ? 'rgba(47,188,212,.18)'   : 'rgba(47,188,212,.3)';
    const rowHov   = dark ? 'rgba(255,255,255,.03)'  : '#f7f4ee';
    const thBg     = dark ? 'rgba(255,255,255,.04)'  : 'var(--a-card-2)';
    const chipBd   = dark ? 'rgba(255,255,255,.12)'  : 'rgba(226,232,240,.5)';

    const activeChip  = { bg: 'rgba(47,188,212,.14)', bd: O, color: O };
    const normalChip  = { bg: 'transparent', bd: chipBd, color: 'var(--a-text-3)' };

    const chipStyle = (active) => ({
        padding: '6px 16px', borderRadius: 999,
        border: `1.5px solid ${active ? activeChip.bd : normalChip.bd}`,
        background: active ? activeChip.bg : normalChip.bg,
        color: active ? activeChip.color : normalChip.color,
        fontSize: 12, fontWeight: 700,
        cursor: 'pointer', transition: 'all .15s',
        fontFamily: "'Cairo',sans-serif",
    });

    return (
        <AdminLayout title="🎫 أكواد الشحن والتفعيل">
            <Head title="أكواد الشحن والتفعيل" />

            <style>{`
                @keyframes fadeUp { from{opacity:0;transform:translateY(12px)} to{opacity:1;transform:translateY(0)} }
                .pc-row:hover { background: ${rowHov} !important; }
                .copy-btn { opacity:.3; transition:opacity .15s,color .15s; }
                .pc-row:hover .copy-btn { opacity:1; }
                select option { background: var(--a-card); color: var(--a-text); }
                .pc-input { background: var(--a-card) !important; color: var(--a-text) !important; }
                .pc-input::placeholder { color: var(--a-text-4) !important; }
            `}</style>

            <div dir="rtl" style={{ fontFamily: "'Cairo',sans-serif", maxWidth: 1040, margin: '0 auto' }}>

                {/* ── Page title ── */}
                <div style={{ marginBottom: 24 }}>
                    <h1 style={{ fontSize: 22, fontWeight: 800, color: 'var(--a-text)', margin: 0 }}>
                        🎫 أكواد الشحن والتفعيل
                    </h1>
                    <p style={{ fontSize: 13, color: 'var(--a-text-4)', margin: '5px 0 0' }}>
                        توليد وإدارة أكواد تفعيل محاضرات الطلاب
                    </p>
                </div>

                {/* ── Stats ── */}
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3,1fr)', gap: 14, marginBottom: 22 }}>
                    {[
                        { label: 'إجمالي الأكواد',  value: total,          icon: '🎫', color: 'var(--a-text)',  iconBg: dark ? 'rgba(47,188,212,.12)' : 'rgba(27,58,96,.06)'  },
                        { label: 'أكواد متاحة',     value: availableCount, icon: '✓',  color: GRN,              iconBg: 'rgba(52,211,153,.1)'                                  },
                        { label: 'أكواد مستخدمة',   value: usedCount,      icon: '✕',  color: R,                iconBg: 'rgba(248,113,113,.1)'                                 },
                    ].map(s => (
                        <div key={s.label} style={{
                            background: 'var(--a-card)', borderRadius: 14,
                            border: `1px solid ${cardBdr}`,
                            padding: '16px 20px',
                            display: 'flex', alignItems: 'center', gap: 14,
                            boxShadow: dark ? '0 2px 16px rgba(0,0,0,.3)' : '0 2px 12px rgba(27,58,96,.06)',
                            animation: 'fadeUp .35s both',
                        }}>
                            <div style={{
                                width: 46, height: 46, borderRadius: 13,
                                background: s.iconBg,
                                display: 'flex', alignItems: 'center', justifyContent: 'center',
                                fontSize: 20, flexShrink: 0,
                            }}>{s.icon}</div>
                            <div>
                                <div style={{ fontSize: 26, fontWeight: 900, color: s.color, lineHeight: 1, fontVariantNumeric: 'tabular-nums' }}>
                                    {s.value}
                                </div>
                                <div style={{ fontSize: 11, color: 'var(--a-text-4)', marginTop: 3 }}>{s.label}</div>
                            </div>
                        </div>
                    ))}
                </div>

                {/* ── Generate Card ── */}
                <div style={{
                    background: 'var(--a-card)', borderRadius: 18,
                    border: `1px solid ${cardBdr}`,
                    borderTop: `4px solid ${O}`,
                    padding: '24px 28px', marginBottom: 22,
                    boxShadow: dark ? '0 4px 32px rgba(0,0,0,.4)' : '0 4px 24px rgba(27,58,96,.07)',
                    animation: 'fadeUp .4s .05s both',
                }}>
                    <h3 style={{ fontSize: 15, fontWeight: 800, color: 'var(--a-text)', margin: '0 0 18px', paddingBottom: 14, borderBottom: `1px solid var(--a-border)` }}>
                        ⚡ توليد أكواد شحن جديدة
                    </h3>

                    <form onSubmit={handleSubmit}>
                        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr auto', gap: 16, alignItems: 'end' }}>
                            <div>
                                <label style={{ display: 'block', fontSize: 12, fontWeight: 700, color: 'var(--a-text-4)', marginBottom: 7 }}>الصف الدراسي:</label>
                                <select required value={data.academic_year_id}
                                    onChange={e => setData('academic_year_id', e.target.value)}
                                    className="pc-input"
                                    style={{
                                        width: '100%', boxSizing: 'border-box',
                                        border: `1.5px solid ${errors.academic_year_id ? R : 'var(--a-border)'}`,
                                        borderRadius: 10, padding: '11px 14px',
                                        fontSize: 13, outline: 'none',
                                        fontFamily: "'Cairo',sans-serif", direction: 'rtl',
                                        transition: 'border-color .2s',
                                    }}>
                                    <option value="">-- اختر الصف الدراسي --</option>
                                    {academicYears.map(y => <option key={y.id} value={y.id}>{y.name}</option>)}
                                </select>
                                {errors.academic_year_id && <p style={{ color: R, fontSize: 11, marginTop: 4 }}>⚠ {errors.academic_year_id}</p>}
                            </div>

                            <div>
                                <label style={{ display: 'block', fontSize: 12, fontWeight: 700, color: 'var(--a-text-4)', marginBottom: 7 }}>عدد الأكواد:</label>
                                <input type="number" min="1" max="500" required value={data.count}
                                    onChange={e => setData('count', e.target.value)}
                                    className="pc-input"
                                    style={{
                                        width: '100%', boxSizing: 'border-box',
                                        border: `1.5px solid ${errors.count ? R : 'var(--a-border)'}`,
                                        borderRadius: 10, padding: '11px 14px',
                                        fontSize: 13, outline: 'none', textAlign: 'center', fontWeight: 800,
                                        fontFamily: "'Cairo',sans-serif",
                                        transition: 'border-color .2s',
                                    }} />
                                {errors.count && <p style={{ color: R, fontSize: 11, marginTop: 4 }}>⚠ {errors.count}</p>}
                            </div>

                            <button type="submit" disabled={processing} style={{
                                background: processing ? 'var(--a-text-4)' : `linear-gradient(135deg,${N},#1a2d52)`,
                                color: '#fff', border: 'none', borderRadius: 10,
                                padding: '12px 24px', fontSize: 13, fontWeight: 800,
                                cursor: processing ? 'not-allowed' : 'pointer',
                                fontFamily: "'Cairo',sans-serif", whiteSpace: 'nowrap',
                                boxShadow: processing ? 'none' : '0 4px 16px rgba(27,58,96,.35)',
                                transition: 'all .2s', height: 44,
                            }}>
                                {processing ? 'جارٍ التوليد...' : '⚡ توليد الأكواد'}
                            </button>
                        </div>
                    </form>
                </div>

                {/* ── Codes Table Card ── */}
                <div style={{
                    background: 'var(--a-card)', borderRadius: 18,
                    border: `1px solid ${cardBdr}`,
                    overflow: 'hidden',
                    boxShadow: dark ? '0 4px 32px rgba(0,0,0,.4)' : '0 4px 24px rgba(27,58,96,.07)',
                    animation: 'fadeUp .45s .1s both',
                }}>
                    {/* Card header */}
                    <div style={{
                        padding: '18px 24px',
                        borderBottom: `1px solid var(--a-border)`,
                        background: 'var(--a-card-2)',
                    }}>
                        {/* Title + CSV row */}
                        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 14, flexWrap: 'wrap', gap: 10 }}>
                            <div>
                                <h3 style={{ fontSize: 15, fontWeight: 800, color: 'var(--a-text)', margin: 0 }}>
                                    🎫 جميع الأكواد
                                </h3>
                                <p style={{ fontSize: 11, color: 'var(--a-text-4)', margin: '3px 0 0' }}>
                                    {filtered.length} كود{(filterStatus !== 'all' || filterYear || search) ? ' — (بعد الفلتر)' : ''}
                                </p>
                            </div>

                            <button onClick={exportCSV} style={{
                                display: 'flex', alignItems: 'center', gap: 6,
                                padding: '8px 18px', borderRadius: 10,
                                border: `1.5px solid rgba(52,211,153,.4)`,
                                background: 'rgba(52,211,153,.1)', color: GRN,
                                fontSize: 12, fontWeight: 700, cursor: 'pointer',
                                fontFamily: "'Cairo',sans-serif", transition: 'background .15s',
                            }}
                                onMouseEnter={e => e.currentTarget.style.background = 'rgba(52,211,153,.2)'}
                                onMouseLeave={e => e.currentTarget.style.background = 'rgba(52,211,153,.1)'}
                            >
                                📥 تصدير CSV
                            </button>
                        </div>

                        {/* Filter bar */}
                        <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap', alignItems: 'center' }}>
                            <button onClick={() => setFilter('all')}      style={chipStyle(filterStatus === 'all')}>الكل</button>
                            <button onClick={() => setFilter('available')} style={chipStyle(filterStatus === 'available')}>✓ متاح</button>
                            <button onClick={() => setFilter('used')}     style={chipStyle(filterStatus === 'used')}>✕ مستخدم</button>

                            <select value={filterYear} onChange={e => setFilterYear(e.target.value)}
                                className="pc-input"
                                style={{
                                    padding: '6px 12px', borderRadius: 999,
                                    border: `1.5px solid ${filterYear ? O : chipBd}`,
                                    background: filterYear ? 'rgba(47,188,212,.1)' : 'transparent',
                                    color: filterYear ? O : 'var(--a-text-3)',
                                    fontSize: 12, fontWeight: 700, cursor: 'pointer',
                                    fontFamily: "'Cairo',sans-serif", outline: 'none',
                                    direction: 'rtl',
                                }}>
                                <option value="">كل الصفوف</option>
                                {academicYears.map(y => <option key={y.id} value={y.id}>{y.name}</option>)}
                            </select>

                            <input
                                type="text"
                                placeholder="🔍 ابحث بالكود..."
                                value={search}
                                onChange={e => setSearch(e.target.value)}
                                className="pc-input"
                                style={{
                                    padding: '6px 14px', borderRadius: 999,
                                    border: `1.5px solid ${search ? O : chipBd}`,
                                    background: search ? 'rgba(47,188,212,.08)' : 'transparent',
                                    fontSize: 12, outline: 'none',
                                    fontFamily: "'Cairo',sans-serif", direction: 'ltr',
                                    minWidth: 160, transition: 'border-color .15s',
                                }}
                            />
                        </div>
                    </div>

                    {/* Table */}
                    <div style={{ overflowX: 'auto' }}>
                        <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'center', fontSize: 13 }}>
                            <thead>
                                <tr style={{ background: thBg, borderBottom: `1px solid var(--a-border)` }}>
                                    {['#', 'كود التفعيل', 'الصف الدراسي', 'الحالة', 'شُحن بواسطة', 'تاريخ الاستخدام', 'الإجراء'].map(h => (
                                        <th key={h} style={{
                                            padding: '11px 16px', color: 'var(--a-text-4)',
                                            fontWeight: 700, fontSize: 11, whiteSpace: 'nowrap',
                                            letterSpacing: '.04em',
                                        }}>{h}</th>
                                    ))}
                                </tr>
                            </thead>
                            <tbody>
                                {filtered.length === 0 ? (
                                    <tr>
                                        <td colSpan={7} style={{ padding: '60px 20px', color: 'var(--a-text-4)', textAlign: 'center' }}>
                                            <div style={{ fontSize: 42, marginBottom: 12 }}>
                                                {promoCodes.length === 0 ? '🎫' : '🔍'}
                                            </div>
                                            {promoCodes.length === 0
                                                ? 'لا توجد أكواد نشطة — قم بتوليد أكواد من الأعلى'
                                                : 'لا توجد نتائج تطابق الفلاتر المختارة'}
                                        </td>
                                    </tr>
                                ) : filtered.map((promo, idx) => (
                                    <tr key={promo.id} className="pc-row"
                                        style={{ borderBottom: `1px solid var(--a-border)`, transition: 'background .15s' }}>

                                        <td style={{ padding: '12px 16px', color: 'var(--a-text-4)', fontWeight: 600, fontSize: 12 }}>
                                            {idx + 1}
                                        </td>

                                        <td style={{ padding: '12px 16px' }}>
                                            <div style={{ display: 'inline-flex', alignItems: 'center', gap: 7 }}>
                                                <span style={{
                                                    fontWeight: 900, fontSize: 14, letterSpacing: '.14em',
                                                    color: 'var(--a-text)', direction: 'ltr', fontFamily: 'monospace',
                                                    background: dark ? 'rgba(255,255,255,.06)' : 'rgba(27,58,96,.05)',
                                                    borderRadius: 7, padding: '3px 9px',
                                                }}>
                                                    {promo.code}
                                                </span>
                                                <button
                                                    className="copy-btn"
                                                    onClick={() => copyCode(promo.code)}
                                                    title="نسخ الكود"
                                                    style={{
                                                        border: 'none', background: 'transparent',
                                                        cursor: 'pointer', fontSize: 14, padding: 2,
                                                        color: copied === promo.code ? GRN : 'var(--a-text-3)',
                                                    }}
                                                >
                                                    {copied === promo.code ? '✓' : '⎘'}
                                                </button>
                                            </div>
                                        </td>

                                        <td style={{ padding: '12px 16px', color: 'var(--a-text)', fontWeight: 600 }}>
                                            {promo.academic_year?.name || '—'}
                                        </td>

                                        <td style={{ padding: '12px 16px' }}>
                                            {promo.is_used ? (
                                                <span style={{
                                                    background: 'rgba(248,113,113,.12)', color: R,
                                                    border: '1px solid rgba(248,113,113,.25)',
                                                    borderRadius: 99, padding: '4px 14px',
                                                    fontSize: 11, fontWeight: 700,
                                                }}>✕ مستخدم</span>
                                            ) : (
                                                <span style={{
                                                    background: 'rgba(52,211,153,.1)', color: GRN,
                                                    border: '1px solid rgba(52,211,153,.2)',
                                                    borderRadius: 99, padding: '4px 14px',
                                                    fontSize: 11, fontWeight: 700,
                                                }}>✓ متاح</span>
                                            )}
                                        </td>

                                        <td style={{ padding: '12px 16px', color: 'var(--a-text-3)', fontWeight: 600 }}>
                                            {promo.used_by?.name || '—'}
                                        </td>

                                        <td style={{ padding: '12px 16px', color: 'var(--a-text-4)', fontSize: 12, direction: 'ltr', fontVariantNumeric: 'tabular-nums' }}>
                                            {promo.used_at
                                                ? new Date(promo.used_at).toLocaleDateString('ar-EG', { year: 'numeric', month: 'short', day: 'numeric' })
                                                : '—'}
                                        </td>

                                        <td style={{ padding: '12px 16px' }}>
                                            {!promo.is_used ? (
                                                <button
                                                    onClick={() => setDeleteId(promo.id)}
                                                    title="حذف الكود"
                                                    style={{
                                                        width: 32, height: 32, borderRadius: '50%',
                                                        background: 'rgba(248,113,113,.1)',
                                                        border: '1px solid rgba(248,113,113,.2)',
                                                        color: R, cursor: 'pointer', fontSize: 14,
                                                        display: 'inline-flex', alignItems: 'center', justifyContent: 'center',
                                                        transition: 'all .15s',
                                                    }}
                                                    onMouseEnter={e => e.currentTarget.style.background = 'rgba(248,113,113,.25)'}
                                                    onMouseLeave={e => e.currentTarget.style.background = 'rgba(248,113,113,.1)'}
                                                >🗑</button>
                                            ) : (
                                                <span style={{ color: 'var(--a-text-4)', fontSize: 12 }}>—</span>
                                            )}
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </div>
            </div>

            {/* ── Delete Modal ── */}
            {deleteId && (
                <div
                    style={{
                        position: 'fixed', inset: 0, background: 'rgba(0,0,0,.55)',
                        display: 'flex', alignItems: 'center', justifyContent: 'center',
                        zIndex: 9999, padding: 20,
                    }}
                    onClick={() => setDeleteId(null)}
                >
                    <div
                        style={{
                            background: 'var(--a-card)', borderRadius: 18, padding: '28px 32px',
                            border: `1px solid ${cardBdr}`,
                            maxWidth: 380, width: '100%', direction: 'rtl',
                            fontFamily: "'Cairo',sans-serif",
                            boxShadow: dark ? '0 24px 80px rgba(0,0,0,.65)' : '0 24px 80px rgba(0,0,0,.18)',
                            animation: 'fadeUp .18s both',
                        }}
                        onClick={e => e.stopPropagation()}
                    >
                        <div style={{ fontSize: 46, textAlign: 'center', marginBottom: 10 }}>🗑</div>
                        <h3 style={{ fontSize: 16, fontWeight: 800, color: 'var(--a-text)', margin: '0 0 8px', textAlign: 'center' }}>
                            تأكيد حذف الكود
                        </h3>
                        <p style={{ fontSize: 13, color: 'var(--a-text-3)', marginBottom: 26, textAlign: 'center', lineHeight: 1.6 }}>
                            هل أنت متأكد من حذف هذا الكود نهائياً؟<br />لا يمكن التراجع عن هذا الإجراء.
                        </p>
                        <div style={{ display: 'flex', gap: 10 }}>
                            <button onClick={() => setDeleteId(null)} style={{
                                flex: 1, padding: '11px', borderRadius: 10,
                                border: `1px solid var(--a-border)`,
                                background: 'var(--a-card-2)',
                                color: 'var(--a-text-3)', cursor: 'pointer',
                                fontFamily: "'Cairo',sans-serif", fontWeight: 700, fontSize: 13,
                                transition: 'background .15s',
                            }}>إلغاء</button>
                            <button onClick={handleDelete} style={{
                                flex: 1, padding: '11px', borderRadius: 10, border: 'none',
                                background: 'linear-gradient(135deg,#ef4444,#dc2626)',
                                color: '#fff', cursor: 'pointer',
                                fontFamily: "'Cairo',sans-serif", fontWeight: 700, fontSize: 13,
                                boxShadow: '0 4px 14px rgba(220,38,38,.35)',
                            }}>تأكيد الحذف</button>
                        </div>
                    </div>
                </div>
            )}
        </AdminLayout>
    );
}
