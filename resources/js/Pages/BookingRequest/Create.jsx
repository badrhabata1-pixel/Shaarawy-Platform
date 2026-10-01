import { useState } from 'react';
import { Head, useForm, usePage } from '@inertiajs/react';

/* ── هوية المنصة: ذهبي على داكن + كريمي + أخضر زيتوني ── */
const C = {
    gold:  '#C9A96A',
    light: '#E8C784',
    amber: '#8B5E3C',
    dark:  '#141210',
    navy:  '#0E3A2E',
    cream: '#FBF7EC',
    paper: '#F3ECDA',
};

export default function Create({ groups = [], academicYears = [] }) {
    const { flash } = usePage().props;
    const { data, setData, post, processing, errors, reset } = useForm({
        name:              '',
        phone:             '',
        school:            '',
        academic_year_id:  '',
        address:           '',
        parent_name:       '',
        parent_phone:      '',
        parent_job:        '',
        group_id:          '',
        gender:            '',
    });

    const [submitted, setSubmitted] = useState(false);

    const selectedYear = academicYears.find(a => String(a.id) === String(data.academic_year_id));
    const filteredGroups = data.academic_year_id
        ? groups.filter(g => String(g.academic_year_id) === String(data.academic_year_id))
        : groups;

    const onGradeChange = (value) => {
        setData(prevData => ({
            ...prevData,
            academic_year_id: value,
            group_id: groups.some(g => String(g.id) === String(prevData.group_id) && String(g.academic_year_id) === String(value))
                ? prevData.group_id
                : '',
        }));
    };

    const submit = (e) => {
        e.preventDefault();
        post(route('booking-requests.store'), {
            onSuccess: () => { reset(); setSubmitted(true); },
        });
    };

    const inputStyle = (hasError) => ({
        width: '100%', padding: '13px 16px', borderRadius: 12,
        border: `1.5px solid ${hasError ? '#ef4444' : 'rgba(139,94,60,.22)'}`,
        background: '#fff', fontSize: 14, color: C.navy,
        fontFamily: 'Cairo, sans-serif', outline: 'none',
        transition: 'border-color .2s, box-shadow .2s',
        boxSizing: 'border-box',
    });
    const onFocus = (e) => {
        e.target.style.borderColor = C.gold;
        e.target.style.boxShadow = '0 0 0 3px rgba(201,169,106,.22)';
    };
    const onBlur = (e) => {
        e.target.style.borderColor = 'rgba(139,94,60,.22)';
        e.target.style.boxShadow = 'none';
    };
    const labelStyle = { display: 'block', color: '#3B2A17', fontSize: 13, fontWeight: 700, marginBottom: 7, fontFamily: 'Cairo,sans-serif' };
    const errorStyle = { color: '#ef4444', fontSize: 12, marginTop: 5, fontFamily: 'Cairo,sans-serif' };
    const cardStyle = {
        position: 'relative', display: 'flex', flexDirection: 'column', gap: 18,
        background: '#fff', border: '1px solid rgba(201,169,106,.35)', borderRadius: 18,
        padding: '26px 24px 24px', boxShadow: '0 8px 26px rgba(139,94,60,.07)',
    };
    const sectionTitle = (num, text) => (
        <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 2 }}>
            <span style={{
                width: 30, height: 30, flexShrink: 0, borderRadius: 9, transform: 'rotate(45deg)',
                background: `linear-gradient(145deg,#F0DDA8,${C.gold} 55%,${C.amber})`,
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                boxShadow: '0 4px 12px rgba(139,94,60,.3)',
            }}>
                <span style={{ transform: 'rotate(-45deg)', fontFamily: "'Amiri',serif", fontWeight: 800, fontSize: 14, color: '#2A1A0A' }}>{num}</span>
            </span>
            <span style={{ fontSize: 16, fontWeight: 800, color: C.navy, fontFamily: "'Amiri','Cairo',serif" }}>{text}</span>
            <span style={{ flex: 1, height: 1, background: 'linear-gradient(90deg,rgba(201,169,106,.5),transparent)' }}/>
        </div>
    );

    return (
        <>
            <Head title="احجز مقعدك — منصة الشعراوي" />

            <style>{`
                @import url('https://fonts.googleapis.com/css2?family=Cairo:wght@400;600;700;900&family=Amiri:wght@400;700&family=Aref+Ruqaa:wght@400;700&display=swap');
                * { box-sizing: border-box; }
                html, body { margin: 0; font-family: 'Cairo', sans-serif; background: ${C.cream}; }
                ::placeholder { color: #a8957a; font-family: 'Cairo', sans-serif; }
                .bk-btn { position: relative; overflow: hidden; }
                .bk-btn:hover:not(:disabled) { transform: translateY(-2px); box-shadow: 0 14px 34px rgba(139,94,60,.45) !important; }
                .bk-btn:active { transform: translateY(0); }
                .bk-btn::after {
                    content: ''; position: absolute; top: 0; bottom: 0; width: 50%; left: -70%;
                    background: linear-gradient(105deg, transparent, rgba(255,255,255,.4), transparent);
                    transform: skewX(-18deg); transition: left .7s cubic-bezier(.22,1,.36,1);
                }
                .bk-btn:hover:not(:disabled)::after { left: 130%; }
                .bk-toggle { transition: all .18s ease; cursor: pointer; }
                .bk-toggle:hover { border-color: ${C.gold} !important; }
                .bk-layout { height: 100vh; display: flex; flex-direction: row-reverse; overflow: hidden; }
                .bk-decor  { flex: 0 0 40%; max-width: 40%; height: 100%; }
                .bk-panel  { flex: 1; max-width: 60%; height: 100%; overflow-y: auto; }
                .bk-photo  { object-position: center 18%; }
                @media (max-width: 860px) {
                    .bk-layout { flex-direction: column; height: auto; min-height: 100vh; overflow: visible; }
                    .bk-decor  { flex: 0 0 auto; max-width: 100%; height: 330px; }
                    .bk-panel  { flex: 1; max-width: 100%; height: auto; overflow-y: visible; }
                    .bk-photo  { object-position: center 14%; }
                    .bk-caption { padding-bottom: 22px !important; }
                    .bk-caption h2 { font-size: 22px !important; }
                    .bk-caption p  { display: none; }
                }
                @media (max-width: 480px) {
                    .bk-grid2 { grid-template-columns: 1fr !important; }
                    .bk-decor { height: 290px; }
                }
            `}</style>

            <div dir="rtl" className="bk-layout">
                {/* ══ لوحة الصورة ══ */}
                <div className="bk-decor" style={{
                    position: 'relative', overflow: 'hidden',
                    background: 'linear-gradient(180deg,#060e1c 0%,#030810 100%)',
                }}>
                    {/* الصورة — تملأ اللوحة وتذوب في الخلفية الداكنة */}
                    <img
                        src="/images/booking-hero.jpg" alt="الأستاذ أحمد الشعراوي"
                        className="bk-photo"
                        style={{
                            position: 'absolute', inset: 0, width: '100%', height: '100%', objectFit: 'cover',
                            WebkitMaskImage: 'linear-gradient(to bottom, #000 62%, transparent 100%)',
                            maskImage: 'linear-gradient(to bottom, #000 62%, transparent 100%)',
                        }}
                    />
                    {/* تظليل دافئ يربط الصورة بألوان المنصة */}
                    <div style={{ position: 'absolute', inset: 0, background: 'linear-gradient(180deg, rgba(6,14,28,.55) 0%, rgba(6,14,28,0) 28%, rgba(6,14,28,0) 52%, rgba(3,8,16,.92) 100%)', pointerEvents: 'none' }}/>
                    <div style={{ position: 'absolute', inset: 0, background: 'linear-gradient(270deg, transparent 70%, rgba(3,8,16,.5) 100%)', pointerEvents: 'none' }}/>

                    {/* نسيج نجمة ثمانية */}
                    <svg style={{ position: 'absolute', inset: 0, width: '100%', height: '100%', opacity: .07, pointerEvents: 'none' }}>
                        <defs>
                            <pattern id="bookStarPat" width="48" height="48" patternUnits="userSpaceOnUse">
                                <g stroke={C.gold} fill="none" strokeWidth="1">
                                    <rect x="5" y="5" width="38" height="38"/>
                                    <rect x="5" y="5" width="38" height="38" transform="rotate(45 24 24)"/>
                                </g>
                            </pattern>
                        </defs>
                        <rect width="100%" height="100%" fill="url(#bookStarPat)"/>
                    </svg>

                    {/* إطار ذهبي رفيع بأركان مزخرفة */}
                    <div style={{ position: 'absolute', inset: 14, border: '1px solid rgba(201,169,106,.35)', borderRadius: 18, pointerEvents: 'none' }}/>
                    {['tl','tr','bl','br'].map(pos => (
                        <svg key={pos} viewBox="0 0 30 30" width="26" height="26" style={{
                            position: 'absolute', color: C.gold, opacity: .9, pointerEvents: 'none',
                            top: pos[0]==='t' ? 18 : 'auto', bottom: pos[0]==='b' ? 18 : 'auto',
                            right: pos[1]==='r' ? 18 : 'auto', left: pos[1]==='l' ? 18 : 'auto',
                            transform: `scale(${pos[1]==='r'?-1:1},${pos[0]==='b'?-1:1})`,
                        }}>
                            <path d="M3,19 L3,3 L19,3" stroke="currentColor" strokeWidth="1.4" fill="none" strokeLinecap="round"/>
                            <rect x="0" y="0" width="7" height="7" transform="rotate(45 3.2 3.2)" fill="currentColor"/>
                        </svg>
                    ))}

                    {/* لوجو فوق */}
                    <img src="/images/ahmed-elshaarawy-logo-transparent.png" alt="أحمد الشعراوي"
                        style={{ position: 'absolute', top: 30, right: 34, height: 58, width: 'auto', objectFit: 'contain', filter: 'drop-shadow(0 6px 18px rgba(0,0,0,.6))' }}/>

                    {/* كلام تحت الصورة */}
                    <div className="bk-caption" style={{
                        position: 'absolute', left: 0, right: 0, bottom: 0, textAlign: 'center',
                        padding: '0 34px 46px',
                    }}>
                        <h2 style={{
                            margin: '0 0 10px', fontFamily: "'Aref Ruqaa','Amiri',serif", fontWeight: 700,
                            fontSize: 'clamp(24px,2.6vw,36px)', lineHeight: 1.3, color: '#F5EFDF',
                            textShadow: '0 0 30px rgba(201,169,106,.45)',
                        }}>رحلتك مع التاريخ تبدأ من هنا</h2>
                        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 9, marginBottom: 12 }}>
                            <div style={{ width: 38, height: 1, background: `linear-gradient(90deg,transparent,${C.gold})` }}/>
                            <svg width="9" height="9" viewBox="0 0 18 18"><rect x="4" y="4" width="10" height="10" transform="rotate(45 9 9)" fill={C.gold}/></svg>
                            <div style={{ width: 38, height: 1, background: `linear-gradient(90deg,${C.gold},transparent)` }}/>
                        </div>
                        <p style={{ margin: 0, fontSize: 13.5, lineHeight: 1.9, color: 'rgba(232,220,193,.85)', fontFamily: 'Cairo,sans-serif' }}>
                            احجز مقعدك وانضم لمجموعة الأستاذ أحمد الشعراوي
                        </p>
                    </div>
                </div>

                {/* ══ لوحة الفورم ══ */}
                <div className="bk-panel" style={{
                    position: 'relative',
                    background: `linear-gradient(180deg,${C.cream} 0%,${C.paper} 100%)`,
                    display: 'flex', justifyContent: 'center',
                    padding: 'clamp(28px,5vw,64px) clamp(20px,4vw,56px)', overflowY: 'auto',
                }}>
                    <div style={{ width: '100%', maxWidth: 640, position: 'relative' }}>
                        <div style={{ marginBottom: 34 }}>
                            <p style={{ margin: '0 0 8px', fontSize: 12, color: C.amber, letterSpacing: '.22em', fontWeight: 700 }}>▸ طلب حجز</p>
                            <h1 style={{ color: C.navy, fontSize: 'clamp(26px,3vw,34px)', fontWeight: 700, margin: '0 0 8px', fontFamily: "'Aref Ruqaa','Amiri',serif" }}>
                                احجز مقعدك الآن
                            </h1>
                            <p style={{ color: '#7a6a52', fontSize: 14, margin: 0, fontFamily: 'Cairo,sans-serif' }}>
                                املأ البيانات وهيتم التواصل معاك لتأكيد الحجز
                            </p>
                            <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginTop: 16 }}>
                                <svg width="10" height="10" viewBox="0 0 18 18"><rect x="4" y="4" width="10" height="10" transform="rotate(45 9 9)" fill={C.gold}/></svg>
                                <div style={{ height: 2, width: 56, borderRadius: 2, background: `linear-gradient(90deg,${C.gold},transparent)` }}/>
                            </div>
                        </div>

                        {(flash?.success || submitted) && (
                            <div style={{ background: '#ecfdf3', border: '1px solid #86d9a8', borderRadius: 12, padding: '13px 16px', marginBottom: 26, color: '#0b5d37', fontSize: 13.5, fontFamily: 'Cairo,sans-serif', lineHeight: 1.7 }}>
                                {flash?.success || 'تم إرسال طلب الحجز بنجاح! هيتم مراجعته والتواصل معاك قريباً.'}
                            </div>
                        )}

                        <form onSubmit={submit} style={{ display: 'flex', flexDirection: 'column', gap: 24 }}>
                            {/* بيانات الطالب الأساسية */}
                            <div style={cardStyle}>
                                {sectionTitle('١', 'بيانات الطالب الأساسية')}
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
                                    <label style={labelStyle}>الصف الدراسي</label>
                                    <select value={data.academic_year_id} onChange={e => onGradeChange(e.target.value)}
                                        onFocus={onFocus} onBlur={onBlur} style={{ ...inputStyle(!!errors.academic_year_id), cursor: 'pointer' }}>
                                        <option value="">اختر الصف الدراسي...</option>
                                        {academicYears.map(a => <option key={a.id} value={a.id}>{a.name}</option>)}
                                    </select>
                                    {errors.academic_year_id && <p style={errorStyle}>{errors.academic_year_id}</p>}
                                    {selectedYear && Number(selectedYear.price) > 0 && (
                                        <p style={{ marginTop: 8, fontSize: 13, fontWeight: 700, color: C.amber, fontFamily: 'Cairo,sans-serif' }}>
                                            إجمالي رسوم {selectedYear.name}: {Number(selectedYear.price).toLocaleString('ar-EG')} جنيه
                                        </p>
                                    )}
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
                            <div style={cardStyle}>
                                {sectionTitle('٢', 'بيانات ولي الأمر')}
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
                            <div style={cardStyle}>
                                {sectionTitle('٣', 'بيانات الحجز')}
                                <div className="bk-grid2" style={{ display: 'grid', gridTemplateColumns: '1.3fr 1fr', gap: 18, alignItems: 'start' }}>
                                    <div>
                                        <label style={labelStyle}>المجموعة الدراسية (مجموعات الحجز)</label>
                                        <select value={data.group_id} onChange={e => setData('group_id', e.target.value)}
                                            onFocus={onFocus} onBlur={onBlur} style={{ ...inputStyle(!!errors.group_id), cursor: 'pointer' }}>
                                            <option value="">
                                                {data.academic_year_id ? 'اختر المجموعة المناسبة...' : 'اختر الصف الدراسي أولاً أو اختر من كل المجموعات...'}
                                            </option>
                                            {filteredGroups.map(g => <option key={g.id} value={g.id}>{g.name}</option>)}
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
                                                        border: `1.5px solid ${data.gender === v ? C.gold : 'rgba(139,94,60,.22)'}`,
                                                        background: data.gender === v ? 'linear-gradient(135deg,rgba(201,169,106,.22),rgba(139,94,60,.1))' : '#fff',
                                                        color: data.gender === v ? C.navy : '#7a6a52',
                                                        boxShadow: data.gender === v ? '0 0 0 3px rgba(201,169,106,.18)' : 'none',
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
                                    width: '100%', padding: '16px',
                                    background: processing ? '#b8a98d' : `linear-gradient(135deg,${C.light},${C.gold} 55%,${C.amber})`,
                                    color: '#1E1208', border: 'none', borderRadius: 14,
                                    fontSize: 16, fontWeight: 800, fontFamily: 'Cairo,sans-serif',
                                    cursor: processing ? 'not-allowed' : 'pointer',
                                    boxShadow: '0 8px 24px rgba(139,94,60,.35), inset 0 1px 0 rgba(255,255,255,.4)',
                                    transition: 'all .25s ease', marginTop: 4,
                                }}>
                                {processing ? 'جارٍ الإرسال...' : 'إرسال طلب الحجز'}
                            </button>
                        </form>

                        <p style={{ textAlign: 'center', marginTop: 24, color: '#9a8868', fontSize: 11, fontFamily: 'Cairo,sans-serif' }}>
                            منصة الشعراوي © {new Date().getFullYear()} — جميع الحقوق محفوظة
                        </p>
                    </div>
                </div>
            </div>
        </>
    );
}
