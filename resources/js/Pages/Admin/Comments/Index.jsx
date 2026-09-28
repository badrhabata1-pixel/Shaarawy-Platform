import { useState, useEffect, useRef } from 'react';
import { Head, router, usePage } from '@inertiajs/react';
import AdminLayout from '@/Layouts/AdminLayout';
import AudioRecorder from '@/Components/AudioRecorder';

/* ── detect dark/light from AdminLayout's data-theme attr ── */
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

function initialsOf(name = '') {
    const parts = name.trim().split(' ');
    const first = parts[0]?.[0] || 'ط';
    const last  = parts.length > 1 ? parts[parts.length - 1][0] : '';
    return (first + last).toUpperCase();
}

export default function Index({ comments = [] }) {
    const { props } = usePage();
    const flash = props.flash ?? {};
    const dark  = useAdminDark();

    const [search, setSearch]           = useState('');
    const [unansweredOnly, setUnansweredOnly] = useState(false);
    const [expandedId, setExpandedId]   = useState(null);
    const [replyBody, setReplyBody]     = useState('');
    const [replyImage, setReplyImage]   = useState(null);
    const [replyImagePreview, setReplyImagePreview] = useState(null);
    const [replyVoice, setReplyVoice]   = useState(null);
    const [submittingId, setSubmittingId] = useState(null);
    const [replyError, setReplyError]   = useState(null);
    const recorderKeyRef = useRef(0);
    const replyImageInputRef = useRef(null);

    const filtered = comments.filter(c => {
        if (unansweredOnly && c.is_replied) return false;
        if (!search.trim()) return true;
        const q = search.trim().toLowerCase();
        return (c.student?.name || '').toLowerCase().includes(q)
            || (c.lesson?.title || '').toLowerCase().includes(q)
            || (c.body || '').toLowerCase().includes(q);
    });

    const unansweredCount = comments.filter(c => !c.is_replied).length;

    const openReply = (c) => {
        setExpandedId(c.id);
        setReplyBody(c.reply_body || '');
        setReplyImage(null);
        setReplyImagePreview(c.reply_image_url || null);
        setReplyVoice(null);
        setReplyError(null);
        recorderKeyRef.current += 1;
    };

    const closeReply = () => {
        setExpandedId(null);
        setReplyBody('');
        setReplyImage(null);
        setReplyImagePreview(null);
        setReplyVoice(null);
        setReplyError(null);
    };

    const onPickReplyImage = (e) => {
        const file = e.target.files?.[0];
        if (!file) return;
        setReplyImage(file);
        setReplyImagePreview(URL.createObjectURL(file));
    };

    const submitReply = (id) => {
        if (!replyBody.trim() && !replyImage && !replyVoice) {
            setReplyError('اكتب رد أو أرفق صورة أو سجّل رسالة صوتية أولاً.');
            return;
        }
        setSubmittingId(id);
        setReplyError(null);

        const data = {};
        if (replyBody.trim()) data.reply_body = replyBody.trim();
        if (replyImage) data.reply_image = replyImage;
        if (replyVoice) data.reply_voice = replyVoice;

        router.post(`/admin/comments/${id}/reply`, data, {
            forceFormData: true,
            preserveScroll: true,
            onSuccess: () => { setSubmittingId(null); closeReply(); },
            onError: (errors) => {
                setSubmittingId(null);
                setReplyError(errors.reply_body || 'حصل خطأ أثناء إرسال الرد، حاول تاني.');
            },
        });
    };

    const destroy = (id) => {
        if (!confirm('هل أنت متأكد من حذف هذا السؤال نهائياً؟')) return;
        router.delete(`/admin/comments/${id}`, { preserveScroll: true });
    };

    return (
        <AdminLayout title="دعم المادة الفني">
            <Head title="دعم المادة الفني — لوحة التحكم" />

            <div style={{ padding: '28px 32px', fontFamily: "'Cairo',sans-serif", direction: 'rtl' }}>

                {/* Header */}
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 24, flexWrap: 'wrap', gap: 12 }}>
                    <div>
                        <h1 style={{ fontSize: 22, fontWeight: 800, margin: 0, color: 'var(--a-text)' }}>🎓 دعم المادة الفني</h1>
                        <p style={{ fontSize: 13, color: 'var(--a-text-4)', marginTop: 4 }}>
                            {comments.length} سؤال إجمالي
                            {unansweredCount > 0 && <span style={{ color: '#1F5A45', fontWeight: 700 }}> — {unansweredCount} في انتظار الرد</span>}
                        </p>
                    </div>
                </div>

                {flash.success && (
                    <div style={{
                        background: dark ? 'rgba(5,150,105,.18)' : '#D1FAE5',
                        border: `1px solid ${dark ? 'rgba(52,211,153,.25)' : '#6EE7B7'}`,
                        borderRadius: 10, padding: '10px 16px',
                        color: dark ? '#34d399' : '#065F46',
                        fontSize: 13, marginBottom: 18, fontWeight: 600,
                    }}>
                        ✓ {flash.success}
                    </div>
                )}

                {/* Search + filter */}
                <div style={{ display: 'flex', gap: 10, marginBottom: 20, flexWrap: 'wrap', alignItems: 'center' }}>
                    <input
                        value={search}
                        onChange={e => setSearch(e.target.value)}
                        placeholder="بحث بالاسم أو الدرس أو نص السؤال…"
                        style={{
                            flex: '1 1 260px', maxWidth: 380, padding: '9px 16px', borderRadius: 10,
                            border: '1.5px solid var(--a-input-b)', background: 'var(--a-input)',
                            color: 'var(--a-text)', fontSize: 13, fontFamily: "'Cairo',sans-serif", outline: 'none',
                        }}
                    />
                    <button
                        onClick={() => setUnansweredOnly(v => !v)}
                        style={{
                            padding: '8px 18px', borderRadius: 10, cursor: 'pointer',
                            fontFamily: "'Cairo',sans-serif", fontSize: 13, fontWeight: 700,
                            border: '1.5px solid', borderColor: unansweredOnly ? '#1F5A45' : 'var(--a-border)',
                            background: unansweredOnly ? '#1F5A45' : 'var(--a-card)',
                            color: unansweredOnly ? '#fff' : 'var(--a-text-3)',
                            transition: 'all .2s',
                        }}
                    >
                        🔴 غير المردود عليها فقط
                    </button>
                </div>

                {/* List */}
                {filtered.length === 0 ? (
                    <div style={{
                        textAlign: 'center', padding: '60px',
                        background: 'var(--a-card)', borderRadius: 14,
                        border: '1px solid var(--a-border)', color: 'var(--a-text-4)',
                        fontFamily: "'Cairo',sans-serif",
                    }}>
                        لا توجد أسئلة حالياً
                    </div>
                ) : (
                    <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
                        {filtered.map(c => {
                            const isOpen = expandedId === c.id;
                            return (
                                <div key={c.id} style={{
                                    background: 'var(--a-card)', borderRadius: 16,
                                    border: `1.5px solid ${c.is_replied ? 'var(--a-border)' : 'rgba(31,90,69,.4)'}`,
                                    padding: '16px 18px', boxShadow: '0 2px 10px var(--a-shadow)',
                                }}>
                                    {/* Top row */}
                                    <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 12, flexWrap: 'wrap' }}>
                                        <div style={{
                                            width: 34, height: 34, borderRadius: '50%', flexShrink: 0,
                                            background: c.student?.image ? 'transparent' : 'linear-gradient(135deg,#1F5A45,#8B5E3C)',
                                            display: 'flex', alignItems: 'center', justifyContent: 'center',
                                            color: '#fff', fontSize: 12, fontWeight: 800, overflow: 'hidden',
                                        }}>
                                            {c.student?.image
                                                ? <img src={`/storage/${c.student.image}`} alt="" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                                                : initialsOf(c.student?.name)}
                                        </div>
                                        <div style={{ flex: 1, minWidth: 0 }}>
                                            <div style={{ fontSize: 13.5, fontWeight: 800, color: 'var(--a-text)' }}>{c.student?.name || 'طالب محذوف'}</div>
                                            <div style={{ fontSize: 11, color: 'var(--a-text-4)' }}>
                                                {c.lesson?.title || 'درس محذوف'}
                                                {c.lesson?.unit && <span> · {c.lesson.unit}</span>}
                                                <span> · {c.created_at}</span>
                                            </div>
                                        </div>
                                        {c.is_replied ? (
                                            <span style={{ fontSize: 11, fontWeight: 800, color: '#059669', background: dark ? 'rgba(5,150,105,.15)' : '#D1FAE5', borderRadius: 999, padding: '4px 12px', whiteSpace: 'nowrap' }}>✓ تم الرد</span>
                                        ) : (
                                            <span style={{ fontSize: 11, fontWeight: 800, color: '#1F5A45', background: dark ? 'rgba(31,90,69,.15)' : '#FEF3E2', borderRadius: 999, padding: '4px 12px', whiteSpace: 'nowrap' }}>🔴 في الانتظار</span>
                                        )}
                                        <button
                                            onClick={() => destroy(c.id)}
                                            title="حذف"
                                            style={{
                                                width: 30, height: 30, borderRadius: 9, flexShrink: 0,
                                                background: 'transparent', border: '1.5px solid rgba(239,68,68,.3)',
                                                color: '#ef4444', cursor: 'pointer', fontSize: 13,
                                                display: 'flex', alignItems: 'center', justifyContent: 'center',
                                            }}
                                        >🗑</button>
                                    </div>

                                    {/* Question content */}
                                    <div style={{ marginBottom: c.is_replied || isOpen ? 12 : 0 }}>
                                        {c.body && <p style={{ fontSize: 13.5, color: 'var(--a-text-2)', lineHeight: 1.7, margin: '0 0 8px', whiteSpace: 'pre-wrap' }}>{c.body}</p>}
                                        {c.image_url && (
                                            <a href={c.image_url} target="_blank" rel="noopener noreferrer">
                                                <img src={c.image_url} alt="صورة السؤال" style={{ maxWidth: 200, maxHeight: 150, borderRadius: 10, border: '1px solid var(--a-border)', display: 'block', marginBottom: 8 }} />
                                            </a>
                                        )}
                                        {c.voice_url && <audio controls src={c.voice_url} style={{ height: 34, maxWidth: 260 }} />}
                                    </div>

                                    {/* Existing reply (read-only display) */}
                                    {c.is_replied && !isOpen && (
                                        <div style={{
                                            background: dark ? 'rgba(31,90,69,.08)' : 'rgba(31,90,69,.06)',
                                            border: '1px solid rgba(31,90,69,.3)', borderRadius: 12,
                                            padding: '10px 14px', marginBottom: 10,
                                        }}>
                                            <div style={{ fontSize: 11.5, fontWeight: 800, color: '#1F5A45', marginBottom: c.reply_body || c.reply_image_url || c.reply_voice_url ? 6 : 0 }}>👨‍🏫 ردك</div>
                                            {c.reply_body && <p style={{ fontSize: 13, color: 'var(--a-text-2)', lineHeight: 1.6, margin: '0 0 6px', whiteSpace: 'pre-wrap' }}>{c.reply_body}</p>}
                                            {c.reply_image_url && (
                                                <a href={c.reply_image_url} target="_blank" rel="noopener noreferrer">
                                                    <img src={c.reply_image_url} alt="صورة الرد" style={{ maxWidth: 180, maxHeight: 130, borderRadius: 10, border: '1px solid rgba(31,90,69,.3)', display: 'block', marginBottom: 6 }} />
                                                </a>
                                            )}
                                            {c.reply_voice_url && <audio controls src={c.reply_voice_url} style={{ height: 32, maxWidth: 240 }} />}
                                        </div>
                                    )}

                                    {/* Reply composer */}
                                    {isOpen ? (
                                        <div style={{ background: 'var(--a-input)', border: '1px solid var(--a-input-b)', borderRadius: 12, padding: 12 }}>
                                            <textarea
                                                value={replyBody}
                                                onChange={e => setReplyBody(e.target.value)}
                                                placeholder="اكتب ردك هنا…"
                                                rows={3}
                                                style={{
                                                    width: '100%', resize: 'vertical', border: 'none', outline: 'none',
                                                    background: 'transparent', color: 'var(--a-text)', fontSize: 13.5,
                                                    fontFamily: "'Cairo',sans-serif", lineHeight: 1.7, marginBottom: 10,
                                                }}
                                            />
                                            {replyImagePreview && (
                                                <div style={{ position: 'relative', display: 'inline-block', marginBottom: 10 }}>
                                                    <img src={replyImagePreview} alt="معاينة" style={{ maxWidth: 130, maxHeight: 100, borderRadius: 10, border: '1px solid var(--a-border)', display: 'block' }} />
                                                    <button
                                                        type="button"
                                                        onClick={() => { setReplyImage(null); setReplyImagePreview(null); if (replyImageInputRef.current) replyImageInputRef.current.value = ''; }}
                                                        style={{
                                                            position: 'absolute', top: -8, left: -8, width: 20, height: 20, borderRadius: '50%',
                                                            background: '#ef4444', color: '#fff', border: '2px solid var(--a-input)',
                                                            fontSize: 10, cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center',
                                                        }}
                                                    >✕</button>
                                                </div>
                                            )}
                                            {replyError && <p style={{ color: '#ef4444', fontSize: 12, fontWeight: 700, margin: '0 0 10px' }}>⚠ {replyError}</p>}
                                            <div style={{ display: 'flex', alignItems: 'center', gap: 10, flexWrap: 'wrap' }}>
                                                <input ref={replyImageInputRef} type="file" accept="image/*" onChange={onPickReplyImage} style={{ display: 'none' }} id={`reply-image-${c.id}`} />
                                                <label htmlFor={`reply-image-${c.id}`} style={{
                                                    display: 'flex', alignItems: 'center', gap: 8, cursor: 'pointer',
                                                    background: 'transparent', border: '1.5px solid var(--a-border)',
                                                    borderRadius: 999, padding: '8px 16px', color: 'var(--a-text-3)', fontSize: 12.5, fontWeight: 700,
                                                }}>
                                                    🖼️ إرفاق صورة
                                                </label>
                                                <AudioRecorder key={recorderKeyRef.current} onChange={setReplyVoice} dark={dark} accent="#1F5A45" disabled={submittingId === c.id} />
                                                <div style={{ marginRight: 'auto', display: 'flex', gap: 8 }}>
                                                    <button
                                                        onClick={closeReply}
                                                        style={{
                                                            padding: '9px 18px', borderRadius: 999, cursor: 'pointer',
                                                            background: 'var(--a-cancel-bg)', color: 'var(--a-cancel-text)',
                                                            border: '1.5px solid var(--a-cancel-border)', fontSize: 13, fontWeight: 700,
                                                            fontFamily: "'Cairo',sans-serif",
                                                        }}
                                                    >
                                                        إلغاء
                                                    </button>
                                                    <button
                                                        onClick={() => submitReply(c.id)}
                                                        disabled={submittingId === c.id}
                                                        style={{
                                                            padding: '9px 22px', borderRadius: 999,
                                                            background: submittingId === c.id ? 'rgba(31,90,69,.5)' : 'linear-gradient(135deg,#1F5A45,#8B5E3C)',
                                                            color: '#fff', border: 'none', fontSize: 13, fontWeight: 800,
                                                            cursor: submittingId === c.id ? 'default' : 'pointer',
                                                            fontFamily: "'Cairo',sans-serif",
                                                            boxShadow: submittingId === c.id ? 'none' : '0 4px 14px rgba(31,90,69,.35)',
                                                        }}
                                                    >
                                                        {submittingId === c.id ? 'جاري الإرسال…' : (c.is_replied ? 'تحديث الرد ↑' : 'إرسال الرد ↑')}
                                                    </button>
                                                </div>
                                            </div>
                                        </div>
                                    ) : (
                                        <button
                                            onClick={() => openReply(c)}
                                            style={{
                                                padding: '8px 20px', borderRadius: 999, cursor: 'pointer',
                                                background: 'transparent', border: '1.5px solid #1F5A45',
                                                color: '#1F5A45', fontSize: 12.5, fontWeight: 800,
                                                fontFamily: "'Cairo',sans-serif",
                                            }}
                                        >
                                            {c.is_replied ? '✏️ تعديل الرد' : '💬 الرد على السؤال'}
                                        </button>
                                    )}
                                </div>
                            );
                        })}
                    </div>
                )}
            </div>
        </AdminLayout>
    );
}
