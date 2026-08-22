import React, { useState } from 'react';
import AdminForm, { AdminField } from '@/Components/Admin/AdminForm';
import { useForm } from '@inertiajs/react';

const O = '#2fbcd4';
const G = '#2fbcd4';

export default function Form({ item, units, exams = [] }) {
    // التنسيق الجديد للفيديوهات والملفات ليدعم الأسماء والأوصاف
    const existingExtraVideos = item?.extra_video_urls ?? [];
    const existingExtraPdfs   = item?.extra_pdfs ?? [];

    const { data, setData, post, put, processing, errors, transform } = useForm({
        title:            item?.title            || '',
        unit_id:          item?.unit_id          || '',
        lesson_number:    item?.lesson_number    || '',
        duration_minutes: item?.duration_minutes || '',
        description:      item?.description      || '',
        video_url:        item?.video_url        || '',
        video_file:       null,
        video_label:      item?.video_label      || 'الفيديو الرئيسي',
        extra_video_urls: existingExtraVideos,
        image:            null,
        pdf_file:         null,
        pdf_label:        item?.pdf_label        || 'الشيت الأساسي',
        pdf_file_2:       null,
        pdf_file_2_label: item?.pdf_file_2_label || 'الملف الإضافي',
        extra_pdfs:       [],
        extra_pdfs_labels: existingExtraPdfs.map(p => p.label || ''),
        is_published:     item?.is_published ?? false,
        is_locked:        item?.is_locked    ?? false,
        gate_exam_id:     item?.gate_exam_id  || null,
    });

    const [hasGateExam, setHasGateExam] = useState(!!item?.gate_exam_id);
    const [primaryVideoMode, setPrimaryVideoMode] = useState('link');

    // فلترة الامتحانات بناءً على الصف الدراسي للوحدة المختارة
    const selectedUnit    = units.find(u => String(u.id) === String(data.unit_id));
    const filteredExams   = selectedUnit
        ? exams.filter(e => String(e.class_id) === String(selectedUnit.academic_year_id))
        : exams;

    // Local state for extra video inputs with labels
    const [extraVideoInputs, setExtraVideoInputs] = useState(
        existingExtraVideos.length > 0
            ? existingExtraVideos.map(v => ({ url: v.url || '', label: v.label || '', file: null, mode: 'link' }))
            : []
    );

    // Local state for extra PDF file inputs with labels
    const [extraPdfInputs, setExtraPdfInputs] = useState(
        existingExtraPdfs.map((p, i) => ({ id: i, existing: p.url, label: p.label || `PDF إضافي ${i + 1}`, file: null }))
    );

    /* ── Extra videos handlers ─────────────────────── */
    const syncVideoData = (next) => {
        setData('extra_video_urls', next.map(({ url, label, file }) => ({ url, label, file })));
    };

    const addVideoUrl = () => {
        const next = [...extraVideoInputs, { url: '', label: '', file: null, mode: 'link' }];
        setExtraVideoInputs(next);
        syncVideoData(next);
    };

    const updateVideoData = (i, field, val) => {
        const next = extraVideoInputs.map((v, idx) => idx === i ? { ...v, [field]: val } : v);
        setExtraVideoInputs(next);
        syncVideoData(next);
    };

    const removeVideoUrl = (i) => {
        const next = extraVideoInputs.filter((_, idx) => idx !== i);
        setExtraVideoInputs(next);
        syncVideoData(next);
    };

    /* ── Extra PDFs handlers ───────────────────────── */
    const addPdfSlot = () => {
        setExtraPdfInputs(prev => [...prev, { id: Date.now(), existing: null, label: '', file: null }]);
    };

    const updatePdfData = (i, field, value) => {
        const updatedInputs = extraPdfInputs.map((p, idx) => idx === i ? { ...p, [field]: value } : p);
        setExtraPdfInputs(updatedInputs);

        // تحديث مصفوفة الملفات ومصفوفة الأسامي المخصصة لإرسالها لـ Laravel
        setData(store => ({
            ...store,
            extra_pdfs: updatedInputs.map(p => p.file).filter(Boolean),
            extra_pdfs_labels: updatedInputs.map(p => p.label || '')
        }));
    };

    const removePdfSlot = (i) => {
        const next = extraPdfInputs.filter((_, idx) => idx !== i);
        setExtraPdfInputs(next);
        setData(store => ({
            ...store,
            extra_pdfs: next.map(p => p.file).filter(Boolean),
            extra_pdfs_labels: next.map(p => p.label || '')
        }));
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        const hasVideoFile = !!data.video_file || (data.extra_video_urls || []).some(v => v && v.file);
        const hasFile = data.image || data.pdf_file || data.pdf_file_2 || (data.extra_pdfs && data.extra_pdfs.length > 0) || hasVideoFile;
        if (item) {
            if (hasFile) {
                transform(d => ({ ...d, _method: 'PUT' }));
                post(`/admin/lessons/${item.id}`, { forceFormData: true });
            } else {
                put(`/admin/lessons/${item.id}`);
            }
        } else {
            post('/admin/lessons', hasFile ? { forceFormData: true } : {});
        }
    };

    return (
        <AdminForm
            title={item ? 'تعديل الدرس' : 'إضافة درس جديد'}
            layoutTitle="الدروس"
            description={item ? 'تعديل بيانات الدرس' : 'إضافة درس جديد للمنصة'}
            cancelLink="/admin/lessons"
            onSubmit={handleSubmit}
            processing={processing}
            submitLabel={item ? 'حفظ التعديلات' : 'إضافة الدرس'}
        >
            <AdminField label="عنوان الدرس"         name="title"            type="text"     value={data.title}            onChange={e => setData('title', e.target.value)}            error={errors.title}            required placeholder="مثال: الدرس الأول - المقدمة" />
            <AdminField label="الوحدة الدراسية"      name="unit_id"          type="select"   value={data.unit_id}          onChange={e => setData('unit_id', e.target.value)}          error={errors.unit_id}          required options={units.map(u => ({ value: u.id, label: u.title }))} />
            <AdminField label="رقم الدرس"            name="lesson_number"    type="number"   value={data.lesson_number}    onChange={e => setData('lesson_number', e.target.value)}    error={errors.lesson_number}    placeholder="رقم الدرس في الوحدة" />
            <AdminField label="مدة الدرس (دقائق)"    name="duration_minutes" type="number"   value={data.duration_minutes} onChange={e => setData('duration_minutes', e.target.value)} error={errors.duration_minutes} placeholder="مدة الدرس بالدقائق" />
            <AdminField label="الوصف"                name="description"      type="textarea" value={data.description}      onChange={e => setData('description', e.target.value)}      error={errors.description}      rows={4} placeholder="وصف مختصر للدرس" />

            {/* ── Videos Section ─────────────────────────── */}
            <DynamicSection
                label="روابط الفيديوهات"
                icon="🎬"
                onAdd={addVideoUrl}
                addLabel="+ إضافة فيديو إضافي"
            >
                {/* Primary video */}
                <VideoRow
                    label="الفيديو الرئيسي"
                    labelValue={data.video_label}
                    onLabelChange={e => setData('video_label', e.target.value)}
                    mode={primaryVideoMode}
                    onModeChange={setPrimaryVideoMode}
                    urlValue={data.video_url}
                    onUrlChange={e => setData('video_url', e.target.value)}
                    urlError={errors.video_url}
                    onFileChange={e => setData('video_file', e.target.files[0])}
                    fileError={errors.video_file}
                    existingFile={!!item?.video_url}
                    removable={false}
                />

                {/* Extra videos */}
                {extraVideoInputs.map((v, i) => (
                    <VideoRow
                        key={i}
                        label={`فيديو إضافي ${i + 1}`}
                        labelValue={v.label}
                        onLabelChange={e => updateVideoData(i, 'label', e.target.value)}
                        mode={v.mode}
                        onModeChange={m => updateVideoData(i, 'mode', m)}
                        urlValue={v.url}
                        onUrlChange={e => updateVideoData(i, 'url', e.target.value)}
                        urlError={errors[`extra_video_urls.${i}.url`]}
                        onFileChange={e => updateVideoData(i, 'file', e.target.files[0])}
                        fileError={errors[`extra_video_urls.${i}.file`]}
                        existingFile={!!v.url}
                        onRemove={() => removeVideoUrl(i)}
                        removable
                    />
                ))}
            </DynamicSection>

            {/* ── PDFs Section ───────────────────────────── */}
            <DynamicSection
                label="ملفات الـ PDF والواجبات"
                icon="📄"
                onAdd={addPdfSlot}
                addLabel="+ إضافة ملف PDF إضافي"
            >
                {/* Primary PDF */}
                <PdfRow
                    label="ملف الـ PDF الأول (شيت الواجب)"
                    labelValue={data.pdf_label}
                    onLabelChange={e => setData('pdf_label', e.target.value)}
                    onChange={e => setData('pdf_file', e.target.files[0])}
                    error={errors.pdf_file}
                    existing={item?.pdf_file}
                    removable={false}
                />

                {/* Second PDF */}
                <PdfRow
                    label="ملف الـ PDF الثاني (ملخص الحصة)"
                    labelValue={data.pdf_file_2_label}
                    onLabelChange={e => setData('pdf_file_2_label', e.target.value)}
                    onChange={e => setData('pdf_file_2', e.target.files[0])}
                    error={errors.pdf_file_2}
                    existing={item?.pdf_file_2}
                    removable={false}
                />

                {/* Extra PDFs */}
                {extraPdfInputs.map((slot, i) => (
                    <PdfRow
                        key={slot.id}
                        label={`ملف PDF إضافي ${i + 1}`}
                        labelValue={slot.label}
                        onLabelChange={e => updatePdfData(i, 'label', e.target.value)}
                        onChange={e => updatePdfData(i, 'file', e.target.files[0])}
                        existing={slot.existing}
                        onRemove={() => removePdfSlot(i)}
                        removable
                    />
                ))}
            </DynamicSection>

            <AdminField label="الصورة"   name="image"       type="file" accept="image/*" onChange={e => setData('image', e.target.files[0])}  error={errors.image} />
            <AdminField label="منشور"    name="is_published" type="toggle" value={data.is_published} onChange={val => setData('is_published', val)} error={errors.is_published} />
            <AdminField label="مقفل"     name="is_locked"    type="toggle" value={data.is_locked}    onChange={val => setData('is_locked', val)}    error={errors.is_locked} />

            {/* ── قسم الامتحان البوابة ─────────────────────────── */}
            <GateExamSection
                hasGateExam={hasGateExam}
                onToggle={() => {
                    const next = !hasGateExam;
                    setHasGateExam(next);
                    if (!next) setData('gate_exam_id', null);
                }}
                filteredExams={filteredExams}
                value={data.gate_exam_id}
                onChange={val => setData('gate_exam_id', val || null)}
                error={errors.gate_exam_id}
                noUnit={!data.unit_id}
            />
        </AdminForm>
    );
}

/* ── GateExamSection ────────────────────────────────── */
function GateExamSection({ hasGateExam, onToggle, filteredExams, value, onChange, error, noUnit }) {
    return (
        <div style={{ border: `1px solid ${hasGateExam ? 'rgba(47,188,212,.4)' : 'rgba(47,188,212,.2)'}`, borderRadius: 12, overflow: 'hidden', marginBottom: 18, transition: 'border-color .2s' }}>
            {/* Header row */}
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '12px 16px', background: hasGateExam ? 'rgba(47,188,212,.08)' : 'rgba(47,188,212,.04)', transition: 'background .2s' }}>
                <div>
                    <div style={{ fontSize: 13, fontWeight: 700, display: 'flex', alignItems: 'center', gap: 7 }}>
                        <span>🔐</span>
                        <span>امتحان البوابة (Gate Exam)</span>
                    </div>
                    <div style={{ fontSize: 11, color: 'rgba(226,232,240,.55)', marginTop: 3 }}>
                        الدرس اللي بعده هيتقفل على الطالب لحد ما يعدي الامتحان ده بـ 50%
                    </div>
                </div>
                {/* Toggle switch */}
                <button
                    type="button"
                    onClick={onToggle}
                    style={{ width: 46, height: 26, borderRadius: 13, border: 'none', cursor: 'pointer', position: 'relative', flexShrink: 0, background: hasGateExam ? O : 'rgba(255,255,255,.12)', transition: 'background .22s' }}
                >
                    <div style={{ position: 'absolute', top: 3, left: hasGateExam ? 23 : 3, width: 20, height: 20, borderRadius: '50%', background: '#fff', boxShadow: '0 1px 4px rgba(0,0,0,.3)', transition: 'left .22s' }} />
                </button>
            </div>

            {/* Body — shown when toggled on */}
            {hasGateExam && (
                <div style={{ padding: '14px 16px', display: 'flex', flexDirection: 'column', gap: 10 }}>
                    {noUnit && (
                        <p style={{ margin: 0, fontSize: 12, color: '#fbbf24', display: 'flex', alignItems: 'center', gap: 6 }}>
                            ⚠️ اختر الوحدة الدراسية أولاً عشان تظهر الامتحانات المناسبة.
                        </p>
                    )}
                    <label style={{ fontSize: 11, fontWeight: 600, color: 'rgba(226,232,240,.7)' }}>
                        اختر الامتحان — الطالب لازم يعدي 50% من درجته عشان يشوف الدرس اللي بعده
                    </label>
                    <select
                        value={value || ''}
                        onChange={e => onChange(e.target.value)}
                        style={{ width: '100%', border: `1.5px solid ${error ? '#f87171' : 'rgba(47,188,212,.25)'}`, borderRadius: 8, padding: '9px 12px', fontSize: 13, background: 'rgba(255,255,255,.05)', color: 'white', fontFamily: 'inherit', outline: 'none', cursor: 'pointer' }}
                    >
                        <option value="">— اختر الامتحان —</option>
                        {filteredExams.map(e => (
                            <option key={e.id} value={e.id}>
                                {e.title}  (من {e.total_marks} درجة — النجاح: {Math.ceil(e.total_marks * 0.5)} درجة)
                            </option>
                        ))}
                    </select>
                    {filteredExams.length === 0 && !noUnit && (
                        <p style={{ margin: 0, fontSize: 11, color: '#f87171', display: 'flex', alignItems: 'center', gap: 5 }}>
                            ❌ مفيش امتحانات لنفس الصف الدراسي — أضف امتحاناً من صفحة الامتحانات أولاً.
                        </p>
                    )}
                    {error && <p style={{ color: '#f87171', fontSize: 11, margin: 0 }}>{error}</p>}

                    {/* Info note */}
                    {value && (
                        <div style={{ background: 'rgba(47,188,212,.08)', border: '1px solid rgba(47,188,212,.25)', borderRadius: 8, padding: '8px 12px', fontSize: 11, color: 'rgba(47,188,212,.9)', display: 'flex', alignItems: 'flex-start', gap: 7, lineHeight: 1.6 }}>
                            <span style={{ flexShrink: 0 }}>ℹ️</span>
                            <span>الطلاب اللي مش عدوا الامتحان ده هيشوفوا الدرس اللي بعده مقفل — ولازم يحاولوا تاني لحد ما يعدوا الـ 50%.</span>
                        </div>
                    )}
                </div>
            )}
        </div>
    );
}

/* ── DynamicSection wrapper ─────────────────────────── */
function DynamicSection({ label, icon, onAdd, addLabel, children }) {
    return (
        <div style={{ border: '1px solid rgba(47,188,212,.2)', borderRadius: 12, overflow: 'hidden', marginBottom: 18 }}>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '10px 16px', background: 'rgba(47,188,212,.06)', borderBottom: '1px solid rgba(47,188,212,.15)' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: 8, fontSize: 13, fontWeight: 700 }}>
                    <span>{icon}</span>
                    <span>{label}</span>
                </div>
                <button
                    type="button"
                    onClick={onAdd}
                    style={{ display: 'flex', alignItems: 'center', gap: 5, padding: '5px 14px', borderRadius: 8, background: `rgba(47,188,212,.12)`, border: `1px solid rgba(47,188,212,.3)`, color: O, fontSize: 12, fontWeight: 700, cursor: 'pointer', transition: 'all .15s', fontFamily: 'inherit' }}
                    onMouseEnter={e => { e.currentTarget.style.background = `rgba(47,188,212,.22)`; }}
                    onMouseLeave={e => { e.currentTarget.style.background = `rgba(47,188,212,.12)`; }}
                >
                    {addLabel}
                </button>
            </div>
            <div style={{ padding: '14px 16px', display: 'flex', flexDirection: 'column', gap: 14 }}>
                {children}
            </div>
        </div>
    );
}

/* ── VideoRow ────────────────────────────────────────── */
function VideoRow({ label, labelValue, onLabelChange, mode, onModeChange, urlValue, onUrlChange, urlError, onFileChange, fileError, existingFile, onRemove, removable }) {
    const error = mode === 'file' ? fileError : urlError;
    return (
        <div style={{ display: 'flex', flexWrap: 'wrap', gap: 12, alignItems: 'flex-end', borderBottom: removable ? '1px solid rgba(255,255,255,0.03)' : 'none', paddingBottom: removable ? 12 : 0 }}>
            {/* عنوان الفيديو */}
            <div style={{ flex: '1 1 200px' }}>
                <label style={{ display: 'block', fontSize: 11, fontWeight: 600, color: 'rgba(226,232,240,.7)', marginBottom: 4 }}>اسم / وصف الفيديو (مثال: فيديو حل الشيت)</label>
                <input
                    type="text"
                    value={labelValue}
                    onChange={onLabelChange}
                    placeholder="اكتب عنواناً يوضح محتوى الفيديو للطلاب"
                    style={{ width: '100%', boxSizing: 'border-box', border: '1.5px solid rgba(47,188,212,.2)', borderRadius: 8, padding: '9px 12px', fontSize: 13, outline: 'none', background: 'rgba(255,255,255,.03)', color: 'white' }}
                />
            </div>
            {/* رابط / رفع ملف الفيديو */}
            <div style={{ flex: '2 1 300px' }}>
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 4, flexWrap: 'wrap', gap: 6 }}>
                    <label style={{ fontSize: 11, fontWeight: 600, color: 'rgba(226,232,240,.7)' }}>{label}</label>
                    <div style={{ display: 'flex', gap: 4, background: 'rgba(255,255,255,.04)', borderRadius: 8, padding: 3 }}>
                        <button
                            type="button"
                            onClick={() => onModeChange('link')}
                            style={{ padding: '4px 10px', borderRadius: 6, border: 'none', cursor: 'pointer', fontSize: 11, fontWeight: 700, fontFamily: 'inherit', background: mode !== 'file' ? O : 'transparent', color: mode !== 'file' ? '#04222b' : 'rgba(226,232,240,.6)', transition: 'all .15s' }}
                        >رابط يوتيوب/فيميو</button>
                        <button
                            type="button"
                            onClick={() => onModeChange('file')}
                            style={{ padding: '4px 10px', borderRadius: 6, border: 'none', cursor: 'pointer', fontSize: 11, fontWeight: 700, fontFamily: 'inherit', background: mode === 'file' ? O : 'transparent', color: mode === 'file' ? '#04222b' : 'rgba(226,232,240,.6)', transition: 'all .15s' }}
                        >رفع ملف فيديو</button>
                    </div>
                </div>

                {mode === 'file' ? (
                    <>
                        {existingFile && (
                            <div style={{ fontSize: 11, color: G, marginBottom: 5, display: 'flex', alignItems: 'center', gap: 5 }}>
                                <span>📎</span>
                                <span style={{ opacity: .7 }}>يوجد فيديو مرفوع مسبقاً — اختر ملفاً جديداً لاستبداله</span>
                            </div>
                        )}
                        <input
                            type="file"
                            accept="video/*"
                            onChange={onFileChange}
                            style={{ width: '100%', boxSizing: 'border-box', border: `1.5px dashed ${error ? '#f87171' : 'rgba(47,188,212,.2)'}`, borderRadius: 8, padding: '8px 10px', fontSize: 12, cursor: 'pointer', background: 'rgba(255,255,255,.02)', color: 'white' }}
                        />
                    </>
                ) : (
                    <input
                        type="url"
                        value={urlValue}
                        onChange={onUrlChange}
                        placeholder="https://..."
                        dir="ltr"
                        style={{ width: '100%', boxSizing: 'border-box', border: `1.5px solid ${error ? '#f87171' : 'rgba(47,188,212,.2)'}`, borderRadius: 8, padding: '9px 12px', fontSize: 13, outline: 'none', background: 'rgba(255,255,255,.03)', color: 'inherit', fontFamily: 'monospace', transition: 'border-color .2s' }}
                    />
                )}
                {error && <p style={{ color: '#f87171', fontSize: 11, marginTop: 4 }}>{error}</p>}
            </div>
            {removable && (
                <button type="button" onClick={onRemove}
                    style={{ width: 32, height: 32, borderRadius: 8, flexShrink: 0, background: 'rgba(248,113,113,.1)', border: '1px solid rgba(248,113,113,.25)', color: '#f87171', cursor: 'pointer', fontSize: 14, display: 'flex', alignItems: 'center', justifyContent: 'center', transition: 'all .15s', height: 38 }}
                    onMouseEnter={e => e.currentTarget.style.background = 'rgba(248,113,113,.22)'}
                    onMouseLeave={e => e.currentTarget.style.background = 'rgba(248,113,113,.1)'}
                    title="حذف"
                >✕</button>
            )}
        </div>
    );
}

/* ── PdfRow ──────────────────────────────────────────── */
function PdfRow({ label, labelValue, onLabelChange, onChange, error, existing, onRemove, removable }) {
    return (
        <div style={{ display: 'flex', flexWrap: 'wrap', gap: 12, alignItems: 'flex-end', borderBottom: removable ? '1px solid rgba(255,255,255,0.03)' : 'none', paddingBottom: removable ? 12 : 0 }}>
            {/* اسم الملف المخصص */}
            <div style={{ flex: '1 1 200px' }}>
                <label style={{ display: 'block', fontSize: 11, fontWeight: 600, color: 'rgba(226,232,240,.7)', marginBottom: 4 }}>اسم الملف المخصص (مثال: مذكرة الفصل الأول)</label>
                <input
                    type="text"
                    value={labelValue}
                    onChange={onLabelChange}
                    placeholder="اكتب اسم الملف الذي يظهر للطلاب"
                    style={{ width: '100%', boxSizing: 'border-box', border: '1.5px solid rgba(47,188,212,.2)', borderRadius: 8, padding: '9px 12px', fontSize: 13, outline: 'none', background: 'rgba(255,255,255,.03)', color: 'white' }}
                />
            </div>
            {/* رفع الملف */}
            <div style={{ flex: '2 1 300px' }}>
                <label style={{ display: 'block', fontSize: 11, fontWeight: 600, color: 'rgba(226,232,240,.7)', marginBottom: 4 }}>{label}</label>
                {existing && (
                    <div style={{ fontSize: 11, color: G, marginBottom: 5, display: 'flex', alignItems: 'center', gap: 5 }}>
                        <span>📎</span>
                        <span style={{ opacity: .7 }}>ملف موجود ومرفوع مسبقاً</span>
                    </div>
                )}
                <input
                    type="file"
                    accept=".pdf"
                    onChange={onChange}
                    style={{ width: '100%', boxSizing: 'border-box', border: `1.5px dashed ${error ? '#f87171' : 'rgba(47,188,212,.2)'}`, borderRadius: 8, padding: '8px 10px', fontSize: 12, cursor: 'pointer', background: 'rgba(255,255,255,.02)', color: 'white' }}
                />
                {error && <p style={{ color: '#f87171', fontSize: 11, marginTop: 4 }}>{error}</p>}
            </div>
            {removable && (
                <button type="button" onClick={onRemove}
                    style={{ width: 32, height: 32, borderRadius: 8, flexShrink: 0, background: 'rgba(248,113,113,.1)', border: '1px solid rgba(248,113,113,.25)', color: '#f87171', cursor: 'pointer', fontSize: 14, display: 'flex', alignItems: 'center', justifyContent: 'center', transition: 'all .15s', height: 38 }}
                    onMouseEnter={e => e.currentTarget.style.background = 'rgba(248,113,113,.22)'}
                    onMouseLeave={e => e.currentTarget.style.background = 'rgba(248,113,113,.1)'}
                    title="حذف"
                >✕</button>
            )}
        </div>
    );
}