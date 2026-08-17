import { useState } from 'react';
import { Head, useForm, usePage } from '@inertiajs/react';

const DOTS = [
    { x: '14%', y: '18%', sz: 6,  amber: false },
    { x: '80%', y: '14%', sz: 5,  amber: true  },
    { x: '10%', y: '52%', sz: 5,  amber: false },
    { x: '86%', y: '46%', sz: 7,  amber: true  },
    { x: '22%', y: '78%', sz: 4,  amber: false },
    { x: '72%', y: '70%', sz: 6,  amber: true  },
];

const GLYPHS = [
    { ch: 'ن', x: '8%',  y: '30%', rot: -8,  sz: 30 },
    { ch: 'ب', x: '84%', y: '26%', rot: 9,   sz: 26 },
    { ch: 'ث', x: '10%', y: '64%', rot: 6,   sz: 26 },
    { ch: 'ي', x: '82%', y: '60%', rot: -10, sz: 24 },
];

export default function Create({ groups = [] }) {
    const { flash } = usePage().props;
    const { data, setData, post, processing, errors, reset } = useForm({
        name:         '',
        phone:        '',
        school:       '',
        address:      '',
        parent_name:  '',
        parent_phone: '',
        parent_job:   '',
        group_id:     '',
        gender:       '',
    });

    const [submitted, setSubmitted] = useState(false);

    const submit = (e) => {
        e.preventDefault();
        post(route('booking-requests.store'), {
            onSuccess: () => { reset(); setSubmitted(true); },
        });
    };

    const inputStyle = (hasError) => ({
        width: '100%', padding: '13px 16px', borderRadius: 12,
        border: `1.5px solid ${hasError ? '#ef4444' : '#E2E8F0'}`,
        background: '#fff', fontSize: 14, color: '#1b3a60',
        fontFamily: 'Cairo, sans-serif', outline: 'none',
        transition: 'border-color .2s, box-shadow .2s',
        boxSizing: 'border-box',
    });
    const onFocus = (e) => {
        e.target.style.borderColor = '#2fbcd4';
        e.target.style.boxShadow = '0 0 0 3px rgba(47,188,212,.12)';
        e.target.style.background = '#fff';
    };
    const onBlur = (e) => {
        e.target.style.borderColor = '#E2E8F0';
        e.target.style.boxShadow = 'none';
        e.target.style.background = '#fff';
    };
    const labelStyle = { display: 'block', color: '#374151', fontSize: 13, fontWeight: 700, marginBottom: 7, fontFamily: 'Cairo,sans-serif' };
    const errorStyle = { color: '#ef4444', fontSize: 12, marginTop: 5, fontFamily: 'Cairo,sans-serif' };
    const sectionTitle = (icon, text) => (
        <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 4 }}>
            <span style={{ fontSize: 16 }}>{icon}</span>
            <span style={{ fontSize: 14, fontWeight: 800, color: '#1b3a60', fontFamily: 'Cairo,sans-serif' }}>{text}</span>
        </div>
    );

    return (
        <>
            <Head title="احجز مقعدك — منصة منصور" />

            <style>{`
                @import url('https://fonts.googleapis.com/css2?family=Cairo:wght@400;600;700;900&family=Ruwudu:wght@400;700&display=swap');
                * { box-sizing: border-box; }
                html, body { margin: 0; font-family: 'Cairo', sans-serif; }
                ::placeholder { color: #94a3b8; font-family: 'Cairo', sans-serif; }
                .bk-btn:hover { opacity: .92; transform: translateY(-1px); box-shadow: 0 8px 24px rgba(47,188,212,.4) !important; }
                .bk-btn:active { transform: translateY(0); }
                .bk-toggle { transition: all .18s ease; cursor: pointer; }
                .bk-layout { height: 100vh; display: flex; flex-direction: row-reverse; overflow: hidden; }
                .bk-decor  { flex: 0 0 38%; max-width: 38%; height: 100%; }
                .bk-panel  { flex: 1; max-width: 62%; height: 100%; overflow-y: auto; }
                @media (max-width: 860px) {
                    .bk-layout { flex-direction: column; height: auto; min-height: 100vh; overflow: visible; }
                    .bk-decor  { flex: 0 0 240px; max-width: 100%; min-height: 240px; height: auto; }
                    .bk-panel  { flex: 1; max-width: 100%; height: auto; overflow-y: visible; }
                }
                @media (max-width: 480px) {
                    .bk-grid2 { grid-template-columns: 1fr !important; }
                }
            `}</style>

            <div dir="rtl" className="bk-layout">
                {/* ══ لوحة الزخارف — لوجو منصتي واقف تحت ══ */}
                <div className="bk-decor" style={{
                    position: 'relative', overflow: 'hidden',
                    background: 'radial-gradient(circle at 50% 30%, #142b47 0%, #0a1626 55%, #050b15 100%)',
                    display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'flex-end',
                    padding: '48px 24px 0',
                }}>
                    {/* نسيج نجمة ثمانية */}
                    <svg style={{ position: 'absolute', inset: 0, width: '100%', height: '100%', opacity: .06, pointerEvents: 'none' }}>
                        <defs>
                            <pattern id="bookStarPat" width="48" height="48" patternUnits="userSpaceOnUse">
                                <g stroke="#2fbcd4" fill="none" strokeWidth="1">
                                    <rect x="5" y="5" width="38" height="38"/>
                                    <rect x="5" y="5" width="38" height="38" transform="rotate(45 24 24)"/>
                                </g>
                            </pattern>
                        </defs>
                        <rect width="100%" height="100%" fill="url(#bookStarPat)"/>
                    </svg>

                    {/* حلقة مدارية متقطعة */}
                    <svg viewBox="0 0 400 400" style={{ position: 'absolute', top: '32%', left: '50%', transform: 'translate(-50%,-50%)', width: '80%', maxWidth: 420, opacity: .5, pointerEvents: 'none' }}>
                        <circle cx="200" cy="200" r="188" stroke="#2fbcd4" strokeWidth="1.4" strokeDasharray="1 11" fill="none" opacity=".85"/>
                        <circle cx="200" cy="200" r="160" stroke="#009688" strokeWidth=".7" fill="none" opacity=".3"/>
                    </svg>

                    {/* حروف عربية عائمة */}
                    {GLYPHS.map(({ ch, x, y, rot, sz }, i) => (
                        <div key={i} style={{
                            position: 'absolute', left: x, top: y,
                            fontFamily: "'Ruwudu',serif", fontSize: sz, color: 'rgba(47,188,212,.45)',
                            transform: `rotate(${rot}deg)`, pointerEvents: 'none', userSelect: 'none',
                        }}>{ch}</div>
                    ))}

                    {/* نقاط عائمة */}
                    {DOTS.map(({ x, y, sz, amber }, i) => (
                        <div key={i} style={{
                            position: 'absolute', left: x, top: y, width: sz, height: sz, borderRadius: '50%',
                            background: amber ? '#009688' : '#2fbcd4',
                            boxShadow: `0 0 8px ${amber ? 'rgba(0,150,136,.7)' : 'rgba(47,188,212,.7)'}`,
                            opacity: .7, pointerEvents: 'none',
                        }}/>
                    ))}

                    {/* توهج أرضي تحت اللوجو */}
                    <div style={{
                        position: 'absolute', bottom: '0%', left: '50%', transform: 'translateX(-50%)',
                        width: '70%', height: 50, background: 'radial-gradient(ellipse, rgba(47,188,212,.32) 0%, transparent 75%)',
                        filter: 'blur(10px)', pointerEvents: 'none',
                    }}/>

                    {/* لوجو منصتي — واقف على الأرض تمامًا */}
                    <img
                        src="/images/manasety.png.png"
                        alt="منصتي"
                        style={{
                            position: 'relative', zIndex: 1,
                            width: '68%', maxWidth: 320, height: 'auto',
                            marginBottom: -28,
                            filter: 'drop-shadow(0 10px 30px rgba(47,188,212,.35))',
                        }}
                    />
                </div>

                {/* ══ لوحة الفورم ══ */}
                <div className="bk-panel" style={{
                    background: '#fff', display: 'flex', justifyContent: 'center',
                    padding: 'clamp(28px,5vw,64px) clamp(20px,4vw,56px)', overflowY: 'auto',
                }}>
                    <div style={{ width: '100%', maxWidth: 640 }}>
                        <div style={{ marginBottom: 34 }}>
                            <h1 style={{ color: '#1b3a60', fontSize: 26, fontWeight: 900, margin: '0 0 6px', fontFamily: 'Cairo,sans-serif' }}>
                                احجز مقعدك الآن
                            </h1>
                            <p style={{ color: '#94a3b8', fontSize: 13.5, margin: 0, fontFamily: 'Cairo,sans-serif' }}>
                                املأ البيانات وهيتم التواصل معاك لتأكيد الحجز
                            </p>
                            <div style={{ height: 3, width: 48, borderRadius: 2, background: 'linear-gradient(90deg,#2fbcd4,#009688)', marginTop: 14 }}/>
                        </div>

                        {(flash?.success || submitted) && (
                            <div style={{ background: '#d1fae5', border: '1px solid #6ee7b7', borderRadius: 10, padding: '12px 16px', marginBottom: 26, color: '#065f46', fontSize: 13.5, fontFamily: 'Cairo,sans-serif', lineHeight: 1.7 }}>
                                {flash?.success || 'تم إرسال طلب الحجز بنجاح! هيتم مراجعته والتواصل معاك قريباً.'}
                            </div>
                        )}

                        <form onSubmit={submit} style={{ display: 'flex', flexDirection: 'column', gap: 26 }}>
                            {/* بيانات الطالب الأساسية */}
                            <div style={{ display: 'flex', flexDirection: 'column', gap: 18, background: '#F8FAFC', border: '1px solid #EEF2F7', borderRadius: 16, padding: '22px 24px' }}>
                                {sectionTitle('🧑‍🎓', 'بيانات الطالب الأساسية')}
                                <div>
                                    <label style={labelStyle}>اسم الطالب الرباعي</label>
                                    <input type="text" value={data.name} onChange={e => setData('name', e.target.value)}
                                        onFocus={onFocus} onBlur={onBlur} placeholder="أدخل اسم الطالب رباعياً"
                                        style={inputStyle(!!errors.name)} />
                                    {errors.name && <p style={errorStyle}>{errors.name}</p>}
                                </div>
                                <div className="bk-grid2" style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 18 }}>
                                    <div>
                                        <label style={labelStyle}>رقم هاتف الطالب</label>
                                        <input type="tel" value={data.phone} onChange={e => setData('phone', e.target.value)}
                                            onFocus={onFocus} onBlur={onBlur} placeholder="01xxxxxxxxx" dir="ltr" autoComplete="tel"
                                            style={inputStyle(!!errors.phone)} />
                                        {errors.phone && <p style={errorStyle}>{errors.phone}</p>}
                                    </div>
                                    <div>
                                        <label style={labelStyle}>المدرسة</label>
                                        <input type="text" value={data.school} onChange={e => setData('school', e.target.value)}
                                            onFocus={onFocus} onBlur={onBlur} placeholder="اسم المدرسة التابع لها"
                                            style={inputStyle(!!errors.school)} />
                                        {errors.school && <p style={errorStyle}>{errors.school}</p>}
                                    </div>
                                </div>
                                <div>
                                    <label style={labelStyle}>العنوان بالتفصيل</label>
                                    <input type="text" value={data.address} onChange={e => setData('address', e.target.value)}
                                        onFocus={onFocus} onBlur={onBlur} placeholder="المنطقة - الشارع"
                                        style={inputStyle(!!errors.address)} />
                                    {errors.address && <p style={errorStyle}>{errors.address}</p>}
                                </div>
                            </div>

                            {/* بيانات ولي الأمر */}
                            <div style={{ display: 'flex', flexDirection: 'column', gap: 18, background: '#F8FAFC', border: '1px solid #EEF2F7', borderRadius: 16, padding: '22px 24px' }}>
                                {sectionTitle('👪', 'بيانات ولي الأمر')}
                                <div>
                                    <label style={labelStyle}>اسم ولي الأمر (الأب أو الأم)</label>
                                    <input type="text" value={data.parent_name} onChange={e => setData('parent_name', e.target.value)}
                                        onFocus={onFocus} onBlur={onBlur} placeholder="اسم الأب أو الأم"
                                        style={inputStyle(!!errors.parent_name)} />
                                    {errors.parent_name && <p style={errorStyle}>{errors.parent_name}</p>}
                                </div>
                                <div className="bk-grid2" style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 18 }}>
                                    <div>
                                        <label style={labelStyle}>رقم هاتف ولي الأمر</label>
                                        <input type="tel" value={data.parent_phone} onChange={e => setData('parent_phone', e.target.value)}
                                            onFocus={onFocus} onBlur={onBlur} placeholder="رقم متاح للطوارئ" dir="ltr"
                                            style={inputStyle(!!errors.parent_phone)} />
                                        {errors.parent_phone && <p style={errorStyle}>{errors.parent_phone}</p>}
                                    </div>
                                    <div>
                                        <label style={labelStyle}>وظيفة ولي الأمر</label>
                                        <input type="text" value={data.parent_job} onChange={e => setData('parent_job', e.target.value)}
                                            onFocus={onFocus} onBlur={onBlur} placeholder="الوظيفة"
                                            style={inputStyle(!!errors.parent_job)} />
                                        {errors.parent_job && <p style={errorStyle}>{errors.parent_job}</p>}
                                    </div>
                                </div>
                            </div>

                            {/* بيانات الحجز */}
                            <div style={{ display: 'flex', flexDirection: 'column', gap: 18, background: '#F8FAFC', border: '1px solid #EEF2F7', borderRadius: 16, padding: '22px 24px' }}>
                                {sectionTitle('📋', 'بيانات الحجز')}
                                <div className="bk-grid2" style={{ display: 'grid', gridTemplateColumns: '1.3fr 1fr', gap: 18, alignItems: 'start' }}>
                                    <div>
                                        <label style={labelStyle}>المجموعة الدراسية (مجموعات الحجز)</label>
                                        <select value={data.group_id} onChange={e => setData('group_id', e.target.value)}
                                            onFocus={onFocus} onBlur={onBlur} style={{ ...inputStyle(!!errors.group_id), cursor: 'pointer' }}>
                                            <option value="">اختر المجموعة المناسبة...</option>
                                            {groups.map(g => <option key={g.id} value={g.id}>{g.name}</option>)}
                                        </select>
                                        {errors.group_id && <p style={errorStyle}>{errors.group_id}</p>}
                                    </div>
                                    <div>
                                        <label style={labelStyle}>الجنس</label>
                                        <div style={{ display: 'flex', gap: 10 }}>
                                            {[{ v: 'male', l: 'ذكر' }, { v: 'female', l: 'أنثى' }].map(({ v, l }) => (
                                                <div key={v} className="bk-toggle" onClick={() => setData('gender', v)}
                                                    style={{
                                                        flex: 1, textAlign: 'center', padding: '12px', borderRadius: 12,
                                                        border: `1.5px solid ${data.gender === v ? '#2fbcd4' : '#E2E8F0'}`,
                                                        background: data.gender === v ? 'rgba(47,188,212,.08)' : '#fff',
                                                        color: data.gender === v ? '#1b3a60' : '#64748b',
                                                        fontWeight: 700, fontSize: 13.5, fontFamily: 'Cairo,sans-serif',
                                                    }}>{l}</div>
                                            ))}
                                        </div>
                                        {errors.gender && <p style={errorStyle}>{errors.gender}</p>}
                                    </div>
                                </div>
                            </div>

                            {/* Submit */}
                            <button type="submit" disabled={processing} className="bk-btn"
                                style={{
                                    width: '100%', padding: '15px',
                                    background: processing ? '#94a3b8' : 'linear-gradient(135deg, #2fbcd4, #009688)',
                                    color: '#fff', border: 'none', borderRadius: 12,
                                    fontSize: 15.5, fontWeight: 800, fontFamily: 'Cairo,sans-serif',
                                    cursor: processing ? 'not-allowed' : 'pointer',
                                    boxShadow: '0 6px 20px rgba(47,188,212,.35)',
                                    transition: 'all .2s ease', marginTop: 4,
                                }}>
                                {processing ? '⏳ جارٍ الإرسال...' : 'إرسال طلب الحجز'}
                            </button>
                        </form>

                        <p style={{ textAlign: 'center', marginTop: 22, color: '#94a3b8', fontSize: 11, fontFamily: 'Cairo,sans-serif' }}>
                            منصة منصور © {new Date().getFullYear()} — جميع الحقوق محفوظة
                        </p>
                    </div>
                </div>
            </div>
        </>
    );
}
