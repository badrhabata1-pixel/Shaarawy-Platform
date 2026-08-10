import { useState, useRef, useEffect } from 'react';

const MAX_SECONDS = 180; // سقف أمان لمدة التسجيل (3 دقايق)

/**
 * مسجّل صوت قابل لإعادة الاستخدام — بيرجع File جاهز للإرفاق في FormData عبر onChange.
 * onChange(file:File|null) — بيتنادى بالتسجيل الجاهز، أو null لو المستخدم حذفه.
 */
export default function AudioRecorder({ onChange, dark = false, accent = '#F47C20', disabled = false }) {
    const [status, setStatus]     = useState('idle'); // idle | recording | recorded
    const [seconds, setSeconds]   = useState(0);
    const [error, setError]       = useState(null);
    const [previewUrl, setPreviewUrl] = useState(null);

    const recorderRef = useRef(null);
    const chunksRef    = useRef([]);
    const streamRef     = useRef(null);
    const timerRef       = useRef(null);

    useEffect(() => () => {
        clearInterval(timerRef.current);
        streamRef.current?.getTracks().forEach(t => t.stop());
        if (previewUrl) URL.revokeObjectURL(previewUrl);
    }, []); // eslint-disable-line react-hooks/exhaustive-deps

    const startRecording = async () => {
        setError(null);
        try {
            const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
            streamRef.current = stream;

            const mimeType = MediaRecorder.isTypeSupported('audio/webm')
                ? 'audio/webm'
                : (MediaRecorder.isTypeSupported('audio/mp4') ? 'audio/mp4' : '');
            const recorder = mimeType ? new MediaRecorder(stream, { mimeType }) : new MediaRecorder(stream);
            recorderRef.current = recorder;
            chunksRef.current = [];

            recorder.ondataavailable = e => { if (e.data.size > 0) chunksRef.current.push(e.data); };
            recorder.onstop = () => {
                stream.getTracks().forEach(t => t.stop());
                clearInterval(timerRef.current);

                const blob = new Blob(chunksRef.current, { type: mimeType || 'audio/webm' });
                const ext  = mimeType.includes('mp4') ? 'm4a' : 'webm';
                const file = new File([blob], `voice-${Date.now()}.${ext}`, { type: blob.type });

                setPreviewUrl(URL.createObjectURL(blob));
                setStatus('recorded');
                onChange(file);
            };

            recorder.start();
            setStatus('recording');
            setSeconds(0);
            timerRef.current = setInterval(() => {
                setSeconds(s => {
                    if (s + 1 >= MAX_SECONDS) {
                        recorder.stop();
                    }
                    return s + 1;
                });
            }, 1000);
        } catch (err) {
            setError('محتاجين إذن استخدام الميكروفون عشان تسجّل رسالة صوتية 🎙️');
        }
    };

    const stopRecording = () => {
        recorderRef.current?.stop();
    };

    const discard = () => {
        if (previewUrl) URL.revokeObjectURL(previewUrl);
        setPreviewUrl(null);
        setStatus('idle');
        setSeconds(0);
        onChange(null);
    };

    const fmt = s => `${String(Math.floor(s / 60)).padStart(2, '0')}:${String(s % 60).padStart(2, '0')}`;

    if (status === 'recorded' && previewUrl) {
        return (
            <div style={{
                display: 'flex', alignItems: 'center', gap: 10,
                background: dark ? 'rgba(244,124,32,.08)' : 'rgba(244,124,32,.06)',
                border: `1px solid ${accent}40`, borderRadius: 12, padding: '8px 12px',
            }}>
                <span style={{ fontSize: 16 }}>🎙️</span>
                <audio controls src={previewUrl} style={{ height: 32, flex: 1, minWidth: 140 }} />
                <button
                    type="button"
                    onClick={discard}
                    disabled={disabled}
                    title="حذف التسجيل"
                    style={{
                        width: 26, height: 26, borderRadius: '50%', flexShrink: 0,
                        background: 'rgba(239,68,68,.12)', border: '1px solid rgba(239,68,68,.35)',
                        color: '#ef4444', fontSize: 13, cursor: disabled ? 'default' : 'pointer',
                        display: 'flex', alignItems: 'center', justifyContent: 'center',
                    }}
                >✕</button>
            </div>
        );
    }

    if (status === 'recording') {
        return (
            <button
                type="button"
                onClick={stopRecording}
                style={{
                    display: 'flex', alignItems: 'center', gap: 8,
                    background: 'rgba(239,68,68,.1)', border: '1px solid rgba(239,68,68,.4)',
                    borderRadius: 999, padding: '8px 16px', cursor: 'pointer',
                    color: '#ef4444', fontSize: 12.5, fontWeight: 800, fontFamily: 'Cairo, sans-serif',
                }}
            >
                <span style={{
                    width: 9, height: 9, borderRadius: '50%', background: '#ef4444', display: 'inline-block',
                    animation: 'ar-pulse 1s ease-in-out infinite',
                }} />
                جاري التسجيل… {fmt(seconds)}
                <span style={{ marginRight: 4 }}>■ إيقاف</span>
                <style>{`@keyframes ar-pulse{0%,100%{opacity:1}50%{opacity:.25}}`}</style>
            </button>
        );
    }

    return (
        <div>
            <button
                type="button"
                onClick={startRecording}
                disabled={disabled}
                style={{
                    display: 'flex', alignItems: 'center', gap: 8,
                    background: 'transparent', border: `1.5px solid ${dark ? 'rgba(255,255,255,.15)' : '#e5e7eb'}`,
                    borderRadius: 999, padding: '8px 16px', cursor: disabled ? 'default' : 'pointer',
                    color: dark ? '#cbd5e1' : '#475569', fontSize: 12.5, fontWeight: 700, fontFamily: 'Cairo, sans-serif',
                    transition: 'border-color .15s, color .15s',
                }}
                onMouseEnter={e => { if (!disabled) { e.currentTarget.style.borderColor = accent; e.currentTarget.style.color = accent; } }}
                onMouseLeave={e => { e.currentTarget.style.borderColor = dark ? 'rgba(255,255,255,.15)' : '#e5e7eb'; e.currentTarget.style.color = dark ? '#cbd5e1' : '#475569'; }}
            >
                🎙️ تسجيل رسالة صوتية
            </button>
            {error && <p style={{ color: '#ef4444', fontSize: 11, fontWeight: 700, margin: '6px 0 0' }}>{error}</p>}
        </div>
    );
}
