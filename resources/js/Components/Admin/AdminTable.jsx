import React, { useState } from 'react';
import { Link, router, usePage } from '@inertiajs/react';
import AdminLayout from '@/Layouts/AdminLayout';

/* ═══════════════════════════════════════════════════
   HELPERS
═══════════════════════════════════════════════════ */
export const imgUrl = (path) => {
    if (!path) return null;
    if (path.startsWith('http') || path.startsWith('/')) return path;
    // ملفات الدروس بتتخزن مباشرة تحت public/uploads (مش عبر قرص storage)
    if (path.startsWith('uploads/')) return `/${path}`;
    return `/storage/${path}`;
};

export const Badge = ({ label, color = 'orange' }) => {
    const schemes = {
        orange: { bg: '#2fbcd418', color: '#2fbcd4' },
        navy:   { bg: 'var(--a-badge-navy-bg)', color: 'var(--a-badge-navy-text)' },
        green:  { bg: '#10b98118', color: '#059669' },
        red:    { bg: '#ef444418', color: '#ef4444' },
        yellow: { bg: '#f59e0b18', color: '#d97706' },
        purple: { bg: '#8b5cf618', color: '#7c3aed' },
        gray:   { bg: '#6b728018', color: '#6b7280' },
    };
    const s = schemes[color] || schemes.orange;
    return (
        <span className="px-2.5 py-1 rounded-full text-xs font-bold"
              style={{ background: s.bg, color: s.color }}>
            {label}
        </span>
    );
};

export const AvatarCell = ({ name, image, sub }) => (
    <div className="flex items-center gap-3">
        {image
            ? <img src={imgUrl(image)} alt={name} className="w-9 h-9 rounded-xl object-cover border-2 flex-shrink-0" style={{ borderColor: '#2fbcd4' }} />
            : <div className="w-9 h-9 rounded-xl flex items-center justify-center text-white font-black text-sm flex-shrink-0"
                   style={{ background: 'linear-gradient(135deg,#2fbcd4,#009688)' }}>
                  {name?.charAt(0)}
              </div>
        }
        <div>
            <p className="font-bold text-sm leading-tight" style={{ color: 'var(--a-text)' }}>{name}</p>
            {sub && <p className="text-xs" style={{ color: 'var(--a-text-4)' }}>{sub}</p>}
        </div>
    </div>
);

/* ═══════════════════════════════════════════════════
   FLASH MESSAGE
═══════════════════════════════════════════════════ */
const Flash = () => {
    const { flash } = usePage().props;
    const [visible, setVisible] = useState(true);
    if (!flash || (!flash.success && !flash.error) || !visible) return null;
    return (
        <div className="flex items-center gap-3 px-5 py-3.5 rounded-2xl font-bold text-sm"
             style={flash.success
                 ? { background: 'var(--a-success-bg, #d1fae530)', color: '#059669', border: '1.5px solid #10b98130' }
                 : { background: 'var(--a-danger-bg, #fee2e230)', color: '#dc2626', border: '1.5px solid #ef444430' }}>
            <span>{flash.success || flash.error}</span>
            <button onClick={() => setVisible(false)} className="mr-auto opacity-50 hover:opacity-100 text-lg">×</button>
        </div>
    );
};

/* ═══════════════════════════════════════════════════
   DELETE MODAL
═══════════════════════════════════════════════════ */
const DeleteModal = ({ item, message = 'هل أنت متأكد من الحذف؟ لا يمكن التراجع عن هذه العملية.', onClose, onConfirm, processing }) => {
    if (!item) return null;
    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4"
             style={{ background: 'rgba(13,24,41,0.75)', backdropFilter: 'blur(6px)' }}>
            <div className="rounded-3xl p-8 w-full max-w-sm text-center shadow-2xl"
                 style={{ background: 'var(--a-card)', border: '1px solid var(--a-border)', direction: 'rtl' }}>
                <div className="w-16 h-16 rounded-2xl flex items-center justify-center mx-auto mb-4"
                     style={{ background: '#fee2e2' }}>
                    <svg viewBox="0 0 24 24" fill="none" stroke="#ef4444" strokeWidth="2.5"
                         strokeLinecap="round" strokeLinejoin="round" className="w-8 h-8">
                        <polyline points="3 6 5 6 21 6"/><path d="M19 6l-1 14H6L5 6"/><path d="M10 11v6"/><path d="M14 11v6"/><path d="M9 6V4h6v2"/>
                    </svg>
                </div>
                <h3 className="font-black text-xl mb-2" style={{ color: 'var(--a-text)' }}>تأكيد الحذف</h3>
                <p className="text-sm mb-7 leading-relaxed" style={{ color: 'var(--a-text-3)' }}>{message}</p>
                <div className="flex gap-3">
                    <button onClick={onClose}
                            className="flex-1 py-3 rounded-2xl font-bold text-sm"
                            style={{ background: 'var(--a-cancel-bg)', color: 'var(--a-cancel-text)', border: '1.5px solid var(--a-cancel-border)' }}>
                        إلغاء
                    </button>
                    <button onClick={onConfirm} disabled={processing}
                            className="flex-1 py-3 rounded-2xl text-white font-bold text-sm"
                            style={{ background: processing ? '#fca5a5' : '#ef4444' }}>
                        {processing ? '...' : 'نعم، احذف'}
                    </button>
                </div>
            </div>
        </div>
    );
};

/* ═══════════════════════════════════════════════════
   MAIN AdminTable COMPONENT
═══════════════════════════════════════════════════ */
export default function AdminTable({
    layoutTitle, title, description, createLink, createLabel = 'إضافة جديد',
    columns, rows = [], editRoute, deleteRoute, deleteMessage,
    searchKeys, searchPlaceholder = 'بحث...', filters = [],
    total, extraActions, topContent,
}) {
    const [search, setSearch]             = useState('');
    const [filterVals, setFilterVals]     = useState({});
    const [deleting, setDeleting]         = useState(null);
    const [delProcessing, setDelProcessing] = useState(false);

    let filtered = rows;
    if (search && searchKeys?.length) {
        const q = search.toLowerCase();
        filtered = rows.filter(row => searchKeys.some(k => String(row[k] ?? '').toLowerCase().includes(q)));
    }
    filters.forEach(f => {
        if (filterVals[f.key]) filtered = filtered.filter(row => String(row[f.key]) === String(filterVals[f.key]));
    });

    const handleDelete = (row) => setDeleting(row);
    const confirmDelete = () => {
        if (!deleting || !deleteRoute) return;
        setDelProcessing(true);
        router.delete(deleteRoute(deleting), {
            onFinish: () => { setDelProcessing(false); setDeleting(null); },
        });
    };

    return (
        <AdminLayout title={layoutTitle || title}>
            <div className="space-y-5" style={{ direction: 'rtl', fontFamily: 'Cairo, sans-serif' }}>

                {/* Header */}
                <div className="flex flex-wrap items-center justify-between gap-3">
                    <div>
                        <h1 className="font-black text-2xl" style={{ color: 'var(--a-text)' }}>{title}</h1>
                        {description && <p className="text-sm mt-0.5" style={{ color: 'var(--a-text-4)' }}>{description}</p>}
                    </div>
                    {createLink && (
                        <Link href={createLink}
                              className="flex items-center gap-2 px-5 py-2.5 rounded-2xl text-white font-bold text-sm"
                              style={{ background: 'linear-gradient(135deg, #2fbcd4, #009688)', boxShadow: '0 4px 14px rgba(47,188,212,0.35)' }}>
                            <span className="text-lg">+</span>
                            {createLabel}
                        </Link>
                    )}
                </div>

                {/* Flash */}
                <Flash />

                {/* Top Content slot */}
                {topContent && topContent}

                {/* Search + Filters */}
                {(searchKeys?.length || filters.length) && (
                    <div className="rounded-2xl px-5 py-4 flex flex-wrap gap-3 items-center shadow-sm"
                         style={{ background: 'var(--a-card)', border: '1px solid var(--a-border)' }}>
                        {searchKeys?.length > 0 && (
                            <div className="relative flex-1 min-w-48">
                                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"
                                     className="w-4 h-4 absolute right-3 top-1/2 -translate-y-1/2"
                                     style={{ color: 'var(--a-text-4)' }}>
                                    <circle cx="11" cy="11" r="8"/><line x1="21" y1="21" x2="16.65" y2="16.65"/>
                                </svg>
                                <input type="text" value={search}
                                    onChange={e => setSearch(e.target.value)}
                                    placeholder={searchPlaceholder}
                                    className="w-full pr-9 pl-4 py-2.5 rounded-xl text-sm font-medium outline-none"
                                    style={{ background: 'var(--a-input)', border: '1.5px solid var(--a-input-b)', color: 'var(--a-text)' }}
                                />
                            </div>
                        )}
                        {filters.map(f => (
                            <select key={f.key}
                                    value={filterVals[f.key] || ''}
                                    onChange={e => setFilterVals({...filterVals, [f.key]: e.target.value})}
                                    className="px-4 py-2.5 rounded-xl text-sm font-medium outline-none"
                                    style={{ background: 'var(--a-input)', border: '1.5px solid var(--a-input-b)', color: 'var(--a-text)', minWidth: 150 }}>
                                <option value="">{f.label} — الكل</option>
                                {f.options.map(o => (
                                    <option key={o.value} value={o.value}>{o.label}</option>
                                ))}
                            </select>
                        ))}
                    </div>
                )}

                {/* Table */}
                <div className="rounded-3xl overflow-hidden"
                     style={{ boxShadow: '0 4px 24px var(--a-shadow)', background: 'var(--a-card)' }}>
                    <div className="overflow-x-auto custom-scroll">
                        <table className="w-full" style={{ direction: 'rtl', fontFamily: 'Cairo, sans-serif' }}>
                            <thead>
                                <tr style={{ background: 'var(--a-thead)' }}>
                                    <th className="px-5 py-3.5 text-right text-xs font-bold" style={{ color: 'var(--a-thead-text)', width: 50 }}>#</th>
                                    {columns.map(col => (
                                        <th key={col.key}
                                            className="px-5 py-3.5 text-xs font-bold"
                                            style={{ color: 'var(--a-thead-text)', textAlign: col.center ? 'center' : 'right', width: col.width }}>
                                            {col.label}
                                        </th>
                                    ))}
                                    {(editRoute || deleteRoute || extraActions) && (
                                        <th className="px-5 py-3.5 text-center text-xs font-bold" style={{ color: 'var(--a-thead-text)', width: 120 }}>
                                            الإجراءات
                                        </th>
                                    )}
                                </tr>
                            </thead>
                            <tbody>
                                {filtered.length === 0 ? (
                                    <tr>
                                        <td colSpan={columns.length + 2}
                                            className="text-center py-20" style={{ color: 'var(--a-text-4)' }}>
                                            <div className="text-5xl mb-4" style={{ opacity: 'var(--a-empty-opacity, 0.2)' }}>📋</div>
                                            <p className="font-semibold text-sm">لا توجد بيانات حالياً</p>
                                            {createLink && (
                                                <Link href={createLink}
                                                      className="mt-3 inline-block px-5 py-2 rounded-xl text-sm font-bold text-white"
                                                      style={{ background: '#2fbcd4' }}>
                                                    + {createLabel}
                                                </Link>
                                            )}
                                        </td>
                                    </tr>
                                ) : filtered.map((row, idx) => (
                                    <tr key={row.id ?? idx}
                                        style={{ borderBottom: '1px solid var(--a-border-2)', transition: 'background 0.12s' }}
                                        onMouseEnter={e => e.currentTarget.style.background = 'var(--a-row-hover)'}
                                        onMouseLeave={e => e.currentTarget.style.background = ''}>
                                        <td className="px-5 py-3.5 text-xs" style={{ color: 'var(--a-text-4)' }}>{idx + 1}</td>
                                        {columns.map(col => (
                                            <td key={col.key}
                                                className="px-5 py-3.5 text-sm font-medium"
                                                style={{ color: 'var(--a-text)', textAlign: col.center ? 'center' : 'right' }}>
                                                {col.render ? col.render(row) : (row[col.key] ?? '—')}
                                            </td>
                                        ))}
                                        {(editRoute || deleteRoute || extraActions) && (
                                            <td className="px-5 py-3.5">
                                                <div className="flex gap-2 justify-center">
                                                    {extraActions?.(row)}
                                                    {editRoute && (
                                                        <Link href={editRoute(row)}
                                                              className="w-8 h-8 rounded-xl flex items-center justify-center text-xs font-bold transition-all hover:scale-110"
                                                              style={{ background: 'var(--a-badge-navy-bg)', color: 'var(--a-text)' }}
                                                              title="تعديل">
                                                            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" className="w-4 h-4">
                                                                <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"/>
                                                                <path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"/>
                                                            </svg>
                                                        </Link>
                                                    )}
                                                    {deleteRoute && (
                                                        <button onClick={() => handleDelete(row)}
                                                                className="w-8 h-8 rounded-xl flex items-center justify-center transition-all hover:scale-110"
                                                                style={{ background: '#ef444418', color: '#ef4444' }}
                                                                title="حذف">
                                                            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" className="w-4 h-4">
                                                                <polyline points="3 6 5 6 21 6"/><path d="M19 6l-1 14H6L5 6"/><path d="M10 11v6"/><path d="M14 11v6"/>
                                                            </svg>
                                                        </button>
                                                    )}
                                                </div>
                                            </td>
                                        )}
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>

                    {/* Footer */}
                    <div className="px-6 py-3 flex items-center justify-between"
                         style={{ borderTop: '1px solid var(--a-border)', background: 'var(--a-card-2)' }}>
                        <span className="text-xs" style={{ color: 'var(--a-text-4)' }}>
                            عرض <span className="font-bold" style={{ color: 'var(--a-text)' }}>{filtered.length}</span>
                            {total !== undefined && total !== filtered.length && ` من ${total}`}
                            &nbsp;سجل
                        </span>
                        {search && (
                            <button onClick={() => setSearch('')}
                                    className="text-xs font-bold px-3 py-1 rounded-lg"
                                    style={{ color: '#2fbcd4', background: '#2fbcd410' }}>
                                مسح البحث ×
                            </button>
                        )}
                    </div>
                </div>

                <DeleteModal item={deleting} message={deleteMessage} onClose={() => setDeleting(null)} onConfirm={confirmDelete} processing={delProcessing} />
            </div>
        </AdminLayout>
    );
}
