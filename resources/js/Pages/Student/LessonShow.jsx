import React, { useState, useEffect, useRef, useCallback } from 'react';
import { Head, Link } from '@inertiajs/react';
import axios from 'axios';
import StudentLayout from '@/Layouts/StudentLayout';
import Watermark from '@/Components/Watermark';
import VideoQuizOverlay from '@/Components/VideoQuizOverlay';
import AudioRecorder from '@/Components/AudioRecorder';
import { teacherReactionImage } from '@/Utils/teacherReaction';

const O = '#F47C20';
const N = '#14213D';
const G = '#C9A14A';

/* ── Detect dark mode from the <html class="dark"> toggle in StudentLayout ── */
function useDarkMode() {
    const [dark, setDark] = useState(() =>
        typeof document !== 'undefined' && document.documentElement.classList.contains('dark')
    );
    useEffect(() => {
        const obs = new MutationObserver(() =>
            setDark(document.documentElement.classList.contains('dark'))
        );
        obs.observe(document.documentElement, { attributes: true, attributeFilter: ['class'] });
        return () => obs.disconnect();
    }, []);
    return dark;
}

export default function LessonShow({
    lesson,
    progress,
    watermark,
    quiz_questions = [],
    videos = [],
    focus_questions_by_video = {},
    pdfs = [],
    comments = [],
}) {
    const dark = useDarkMode();

    /* ── Theme tokens (تعديل الألوان لهوية الصيفي) ── */
    const cardBg         = dark ? '#0a1424' : '#fff'; // كحلي داكن متناسق مع الخلفية
    const cardBorder     = dark ? '1px solid rgba(201, 161, 74, 0.15)' : '1px solid #f0ede8'; // حواف بلمسة ذهبية خفيفة في الليل
    const cardShadow     = dark ? '0 8px 32px rgba(0,0,0,0.45)' : '0 4px 24px rgba(20,33,61,.1)';
    const textMain       = dark ? '#F5F0E8' : N; // استخدام الأوف وايت الدافئ للنصوص الرئيسية في الليل
    const textSub        = dark ? '#DCC9A3' : '#64748b'; // استخدام البيج الحجري للنصوص الفرعية
    const textMuted      = dark ? 'rgba(220, 201, 163, 0.6)' : '#94a3b8';
    const divider        = dark ? 'rgba(201, 161, 74, 0.1)' : '#f0ede8';
    const iconBg         = dark ? 'rgba(201, 161, 74, 0.08)' : '#f0ede8';
    const iconColor      = dark ? '#C9A14A' : '#94a3b8'; // الأيقونات بالذهبي في الليل
    const optionBg       = dark ? 'rgba(255,255,255,0.02)' : '#fff';
    const optionBorder   = dark ? 'rgba(201, 161, 74, 0.15)' : '#e5e7eb';
    const optionColor    = dark ? '#DCC9A3' : '#4b5563';
    const cancelBg       = dark ? 'rgba(255,255,255,0.04)' : '#fff';
    const cancelBorder   = dark ? 'rgba(255,255,255,0.08)' : '#e5e7eb';
    const cancelColor    = dark ? '#DCC9A3' : '#64748b';
    const resultBoxBg    = dark ? 'rgba(201, 161, 74, 0.05)' : '#f8f9fa';
    const resultBoxBorder= dark ? 'rgba(201, 161, 74, 0.2)' : '#f0ede8';
    const sidebarItemDiv = dark ? 'rgba(201, 161, 74, 0.08)' : '#f8f5f0';
    const sidebarIconBg  = dark ? 'rgba(201, 161, 74, 0.12)' : '#f0ede8';

    /* ── Videos list ── */
    const allVideos = videos.length > 0
        ? videos
        : (lesson.stream_url ? [{ index: 0, label: 'الفيديو الرئيسي', url: lesson.stream_url }] : []);

    const [activeVideoIdx, setActiveVideoIdx] = useState(allVideos[0]?.index ?? 0);
    const activeVideo = allVideos.find(v => v.index === activeVideoIdx) ?? allVideos[0];

    /* ── End-of-lesson quiz state ── */
    const [quizStarted,  setQuizStarted]  = useState(false);
    const [quizFinished, setQuizFinished] = useState(progress.quiz_passed);
    const [score,        setScore]        = useState(progress.quiz_score || 0);
    const [quizResult,   setQuizResult]   = useState(null);
    const [answers,      setAnswers]      = useState({});
    const [submitting,   setSubmitting]   = useState(false);

    /* ── In-video focus question state ── */
    const [vqQuestions, setVqQuestions] = useState(focus_questions_by_video[0] ?? []);
    const [vqActive,    setVqActive]    = useState(null);

    /* ── Video refs ── */
    const iframeRef    = useRef(null);
    const videoRef     = useRef(null);
    const videoTypeRef = useRef(null);
    const playerWrapRef = useRef(null); // wraps iframe + watermark + cover bars, used for custom fullscreen

    /* ── Fullscreen / mute state ── */
    const [isFullscreen, setIsFullscreen] = useState(false);
    const [isFakeFullscreen, setIsFakeFullscreen] = useState(false); // التكبير البديل المخصص والآمن للآيفون
    const [isMuted, setIsMuted] = useState(true); // start muted so autoplay actually works

    /* ── Focus question refs ── */
    const vqActiveRef  = useRef(null);
    const vqQueueRef   = useRef([]);
    const triggeredRef = useRef(new Set());

    /* ── Pause / resume video ── */
    const pauseVideo = useCallback(() => {
        const type = videoTypeRef.current;
        if (type === 'youtube' && iframeRef.current)
            iframeRef.current.contentWindow?.postMessage(JSON.stringify({ event: 'command', func: 'pauseVideo', args: [] }), 'https://www.youtube.com');
        else if (type === 'vimeo' && iframeRef.current)
            iframeRef.current.contentWindow?.postMessage(JSON.stringify({ method: 'pause' }), 'https://player.vimeo.com');
        else if (type === 'mp4' && videoRef.current)
            videoRef.current.pause();
    }, []);

    const resumeVideo = useCallback(() => {
        const type = videoTypeRef.current;
        if (type === 'youtube' && iframeRef.current)
            iframeRef.current.contentWindow?.postMessage(JSON.stringify({ event: 'command', func: 'playVideo', args: [] }), 'https://www.youtube.com');
        else if (type === 'vimeo' && iframeRef.current)
            iframeRef.current.contentWindow?.postMessage(JSON.stringify({ method: 'play' }), 'https://player.vimeo.com');
        else if (type === 'mp4' && videoRef.current)
            videoRef.current.play();
    }, []);

    /* ── Mute / unmute ── */
    const toggleMute = useCallback(() => {
        const type = videoTypeRef.current;
        setIsMuted(prev => {
            const next = !prev;
            if (type === 'youtube' && iframeRef.current) {
                iframeRef.current.contentWindow?.postMessage(
                    JSON.stringify({ event: 'command', func: next ? 'mute' : 'unMute', args: [] }),
                    'https://www.youtube.com'
                );
            } else if (type === 'vimeo' && iframeRef.current) {
                iframeRef.current.contentWindow?.postMessage(
                    JSON.stringify({ method: 'setVolume', value: next ? 0 : 1 }),
                    'https://player.vimeo.com'
                );
            } else if (type === 'mp4' && videoRef.current) {
                videoRef.current.muted = next;
            }
            return next;
        });
    }, []);

    /* ── Custom fullscreen with iOS fallback ── */
    const toggleFullscreen = useCallback(() => {
        const el = playerWrapRef.current;
        if (!el) return;

        // هل المتصفح يدعم تكبير الـ div الأصلي برمجياً؟ (أندرويد + كمبيوتر)
        const supportsNativeFS = !!(el.requestFullscreen || el.webkitRequestFullscreen || el.msRequestFullscreen);

        if (supportsNativeFS) {
            if (!document.fullscreenElement && !document.webkitFullscreenElement) {
                (el.requestFullscreen || el.webkitRequestFullscreen || el.msRequestFullscreen)?.call(el);
            } else {
                (document.exitFullscreen || document.webkitExitFullscreen || document.msExitFullscreen)?.call(document);
            }
        } else {
            // حل آمن للآيفون (iOS Safari) لتكبير الحاوية وحمايتها تماماً عبر الـ CSS
            setIsFakeFullscreen(prev => !prev);
        }
    }, []);

    // قفل حركة سكرول الصفحة الخلفية عند تفعيل التكبير البديل في الآيفون لراحة الطالب
    useEffect(() => {
        if (isFakeFullscreen) {
            document.body.style.overflow = 'hidden';
        } else {
            document.body.style.overflow = '';
        }
        return () => { document.body.style.overflow = ''; };
    }, [isFakeFullscreen]);

    useEffect(() => {
        const onChange = () => {
            const isNativeFS = !!(document.fullscreenElement || document.webkitFullscreenElement);
            setIsFullscreen(isNativeFS);
            if (!isNativeFS) {
                setIsFakeFullscreen(false); // إلغاء تفعيل التكبير البديل تلقائياً لو خرج من التكبير الأصلي
            }
        };
        document.addEventListener('fullscreenchange', onChange);
        document.addEventListener('webkitfullscreenchange', onChange);
        return () => {
            document.removeEventListener('fullscreenchange', onChange);
            document.removeEventListener('webkitfullscreenchange', onChange);
        };
    }, []);

    const showQuestion = useCallback((q) => {
        pauseVideo();
        vqActiveRef.current = q;
        setVqActive(q);
        axios.post(`/student/lessons/${lesson.id}/video-questions/${q.id}/trigger`).catch(() => {});
    }, [lesson.id, pauseVideo]);

    const switchVideo = useCallback((idx) => {
        vqActiveRef.current  = null;
        vqQueueRef.current   = [];
        triggeredRef.current = new Set();
        setVqActive(null);
        setActiveVideoIdx(idx);
        setVqQuestions(focus_questions_by_video[idx] ?? []);
    }, [focus_questions_by_video]);

    /* ── Focus question timer ── */
    useEffect(() => {
        if (!vqQuestions.length) return;
        const totalSec  = Math.max(lesson.duration || 30, 5) * 60;
        const n         = vqQuestions.length;
        const interval  = totalSec / (n + 1);
        const checkpoints = vqQuestions.map((q, i) => ({
            at: Math.max(Math.round((i + 1) * interval), (i + 1) * 30),
            question: q, idx: i,
        }));
        const start = Date.now();
        const tick  = setInterval(() => {
            const elapsed = Math.floor((Date.now() - start) / 1000);
            for (const { at, question, idx } of checkpoints) {
                if (triggeredRef.current.has(idx) || elapsed < at) continue;
                triggeredRef.current.add(idx);
                if (vqActiveRef.current) vqQueueRef.current.push(question);
                else showQuestion(question);
            }
        }, 1000);
        return () => clearInterval(tick);
    }, [vqQuestions, lesson.duration, showQuestion]);

    const handleQuizDone = useCallback(() => {
        vqActiveRef.current = null;
        setVqActive(null);
        if (vqQueueRef.current.length > 0) {
            const next = vqQueueRef.current.shift();
            setTimeout(() => showQuestion(next), 600);
        } else {
            resumeVideo();
        }
    }, [showQuestion, resumeVideo]);

    const OPTION_LABELS = { a: 'أ', b: 'ب', c: 'ج', d: 'د' };

    const submitQuiz = async (e) => {
        e.preventDefault();
        if (submitting) return;
        setSubmitting(true);
        try {
            const { data } = await axios.post(`/student/lessons/${lesson.id}/quiz-submit`, { answers });
            setScore(data.score);
            setQuizResult(data);
            setQuizFinished(true);
            setQuizStarted(false);
        } catch { /* silent */ } finally {
            setSubmitting(false);
        }
    };

    /* ── Video player renderer ── */
    const renderPlayer = (url) => {
        if (!url) return (
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', height: '100%', color: 'rgba(255,255,255,.5)', fontSize: 14 }}>
                لا يوجد رابط فيديو
            </div>
        );
        if (url.includes('youtube.com') || url.includes('youtu.be')) {
            videoTypeRef.current = 'youtube';
            const match   = url.match(/^.*(youtu\.be\/|v\/|u\/\w\/|embed\/|watch\?v=|&v=)([^#&?]*).*/);
            const videoId = match && match[2].length === 11 ? match[2] : null;
            return (
                <iframe
                    key={`yt-${videoId}`}
                    ref={iframeRef}
                    className="w-full h-full rounded-xl"
                    src={`https://www.youtube.com/embed/${videoId}?autoplay=1&mute=1&rel=0&enablejsapi=1&modestbranding=1&iv_load_policy=3&fs=0&playsinline=1&origin=${typeof window !== 'undefined' ? window.location.origin : ''}`}
                    title={lesson.title}
                    frameBorder="0"
                    allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; fullscreen"
                    allowFullScreen
                />
            );
        }
        if (url.includes('vimeo.com')) {
            videoTypeRef.current = 'vimeo';
            const match   = url.match(/vimeo\.com\/(\d+)/);
            const videoId = match ? match[1] : '';
            return (
                <iframe
                    key={`vimeo-${videoId}`}
                    ref={iframeRef}
                    src={`https://player.vimeo.com/video/${videoId}?autoplay=1`}
                    className="w-full h-full rounded-xl"
                    frameBorder="0"
                    allow="autoplay; fullscreen; picture-in-picture"
                    allowFullScreen
                />
            );
        }
        videoTypeRef.current = 'mp4';
        return (
            <video key={`mp4-${url}`} ref={videoRef} controls className="w-full h-full rounded-xl" controlsList="nodownload">
                <source src={url} type="video/mp4" />
                المتصفح الخاص بك لا يدعم تشغيل الفيديو.
            </video>
        );
    };

    const hasMultipleVideos = allVideos.length > 1;
    const showFS = isFullscreen || isFakeFullscreen; // تفعيل هيئة التكبير عند حدوث أي من الحالتين

    /* ── دعم المادة الفني: أسئلة الطالب تحت الفيديو ── */
    const [qaThread, setQaThread]   = useState(comments);
    const [qBody, setQBody]         = useState('');
    const [qImage, setQImage]       = useState(null);
    const [qImagePreview, setQImagePreview] = useState(null);
    const [qVoice, setQVoice]       = useState(null);
    const [qSubmitting, setQSubmitting] = useState(false);
    const [qError, setQError]       = useState(null);
    const qImageInputRef = useRef(null);
    const qRecorderKey    = useRef(0);

    const onPickImage = (e) => {
        const file = e.target.files?.[0];
        if (!file) return;
        setQImage(file);
        setQImagePreview(URL.createObjectURL(file));
    };

    const clearImage = () => {
        if (qImagePreview) URL.revokeObjectURL(qImagePreview);
        setQImage(null);
        setQImagePreview(null);
        if (qImageInputRef.current) qImageInputRef.current.value = '';
    };

    const submitQuestion = async () => {
        if (!qBody.trim() && !qImage && !qVoice) {
            setQError('اكتب سؤالك أو أرفق صورة أو سجّل رسالة صوتية أولاً.');
            return;
        }
        setQSubmitting(true);
        setQError(null);

        const fd = new FormData();
        if (qBody.trim()) fd.append('body', qBody.trim());
        if (qImage) fd.append('image', qImage);
        if (qVoice) fd.append('voice', qVoice);

        try {
            const { data } = await axios.post(`/student/lessons/${lesson.id}/comments`, fd);
            setQaThread(prev => [...prev, data.comment]);
            setQBody('');
            clearImage();
            setQVoice(null);
            qRecorderKey.current += 1; // إعادة تصفير مكوّن التسجيل الصوتي
        } catch (err) {
            setQError(err?.response?.data?.message || 'حصل خطأ أثناء إرسال سؤالك، حاول تاني.');
        } finally {
            setQSubmitting(false);
        }
    };

    /* ══════════════════════════════════════════════════════ */
    return (
        <StudentLayout title={lesson.title}>
            <Head title={lesson.title} />

            {/* ستايل متجاوب لضبط التوسيع فقط على الموبايل ليتناسب مع الـ Aspect Ratio دون تمدد */}
            <style>{`
                .responsive-player-wrap {
                    min-height: 300px;
                }
                @media (max-width: 768px) {
                    .responsive-player-wrap {
                        min-height: auto !important; /* يلغي الطول الأدنى القسري على الموبايل ليعيد المشغل للنسبة الذهبية ويحميه من التمدد والانحراف */
                    }
                }
            `}</style>

            <div className="max-w-6xl mx-auto px-4 py-6" style={{ direction: 'rtl' }}>

                {/* Back + title row */}
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 20 }}>
                    <Link
                        href={route('student.lessons')}
                        style={{ color: O, fontSize: 13, fontWeight: 700, textDecoration: 'none', display: 'flex', alignItems: 'center', gap: 4 }}
                    >
                        ← العودة للمحاضرات
                    </Link>
                    <div style={{ fontSize: 12, color: textSub, fontWeight: 600 }}>
                        محاضرة {lesson.order}
                    </div>
                </div>

                {/* ── Main layout: player + optional video list sidebar ── */}
                <div style={{
                    display: 'grid',
                    gridTemplateColumns: hasMultipleVideos ? '1fr 280px' : '1fr',
                    gap: 20,
                    alignItems: 'start',
                    marginBottom: 24,
                }}>

                    {/* ── Video player card (frame style) ── */}
                    <div style={{
                        background: cardBg,
                        borderRadius: 20,
                        overflow: 'hidden',
                        boxShadow: '0 20px 50px rgba(0,0,0,0.18)',
                        border: `2px solid ${O}`,
                        transition: 'background .3s, border-color .3s',
                    }}>
                        {/* Player */}
                        <div
                            ref={playerWrapRef}
                            className="responsive-player-wrap"
                            style={{
                                position: showFS ? 'fixed' : 'relative',
                                top: showFS ? 0 : undefined,
                                left: showFS ? 0 : undefined,
                                right: showFS ? 0 : undefined,
                                bottom: showFS ? 0 : undefined,
                                zIndex: showFS ? 99999 : undefined,
                                aspectRatio: showFS ? undefined : '16/9',
                                width: showFS ? '100vw' : undefined,
                                height: showFS ? '100vh' : undefined,
                                background: '#000',
                            }}
                        >
                            {renderPlayer(activeVideo?.url)}
                            <Watermark email={watermark.email} phone={watermark.phone} name={watermark.name} />
                            {vqActive && (
                                <VideoQuizOverlay lessonId={lesson.id} question={vqActive} onDone={handleQuizDone} />
                            )}
                            {/* ── FULL bottom bar cover ── */}
                            <div style={{
                                position: 'absolute',
                                bottom: 0,
                                left: 0,
                                right: 0,
                                height: 62,
                                background: '#000',
                                zIndex: 20,
                                pointerEvents: 'auto',
                            }} />
                            {/* ── FULL top bar cover ── */}
                            <div style={{
                                position: 'absolute',
                                top: 0,
                                left: 0,
                                right: 0,
                                height: 70,
                                background: 'linear-gradient(to bottom, rgba(0,0,0,0.92) 0%, rgba(0,0,0,0.7) 60%, transparent 100%)',
                                zIndex: 20,
                                pointerEvents: 'auto',
                            }} />
                            {/* ── Left side cover ── */}
                            <div style={{
                                position: 'absolute',
                                bottom: 0,
                                left: 0,
                                width: 130,
                                height: 62,
                                background: '#000',
                                zIndex: 21,
                                pointerEvents: 'auto',
                            }} />
                            {/* ── Right side cover ── */}
                            <div style={{
                                position: 'absolute',
                                bottom: 0,
                                right: 0,
                                width: 130,
                                height: 62,
                                background: '#000',
                                zIndex: 21,
                                pointerEvents: 'auto',
                            }} />

                            {/* ── Custom controls ── */}
                            <div style={{
                                position: 'absolute',
                                bottom: 14,
                                left: 14,
                                zIndex: 30,
                                display: 'flex',
                                gap: 8,
                                pointerEvents: 'auto',
                            }}>
                                <button
                                    type="button"
                                    onClick={toggleMute}
                                    title={isMuted ? 'تشغيل الصوت' : 'كتم الصوت'}
                                    style={{
                                        width: 38, height: 38, borderRadius: '50%',
                                        border: 'none', cursor: 'pointer',
                                        background: 'rgba(255,255,255,.15)',
                                        color: '#fff', fontSize: 16,
                                        display: 'flex', alignItems: 'center', justifyContent: 'center',
                                        backdropFilter: 'blur(4px)',
                                    }}
                                >
                                    {isMuted ? '🔇' : '🔊'}
                                </button>
                                <button
                                    type="button"
                                    onClick={toggleFullscreen}
                                    title={showFS ? 'تصغير' : 'تكبير الشاشة'}
                                    style={{
                                        width: 38, height: 38, borderRadius: '50%',
                                        border: 'none', cursor: 'pointer',
                                        background: 'rgba(255,255,255,.15)',
                                        color: '#fff', fontSize: 16,
                                        display: 'flex', alignItems: 'center', justifyContent: 'center',
                                        backdropFilter: 'blur(4px)',
                                    }}
                                >
                                    {showFS ? '⤡' : '⤢'}
                                </button>
                            </div>
                        </div>

                        {/* Current video label strip (when multiple) */}
                        {hasMultipleVideos && (
                            <div style={{
                                padding: '10px 20px',
                                background: dark
                                    ? `linear-gradient(90deg, rgba(244,124,32,.12), transparent)`
                                    : `linear-gradient(90deg, rgba(244,124,32,.08), transparent)`,
                                borderBottom: `1px solid ${divider}`,
                                display: 'flex', alignItems: 'center', gap: 8,
                                transition: 'background .3s',
                            }}>
                                <span style={{ fontSize: 15 }}>▶️</span>
                                <span style={{ fontSize: 13, fontWeight: 700, color: textMain }}>
                                    {activeVideo?.label}
                                </span>
                                {(focus_questions_by_video[activeVideoIdx] ?? []).length > 0 && (
                                    <span style={{
                                        marginRight: 'auto',
                                        fontSize: 11, fontWeight: 700,
                                        color: O,
                                        background: 'rgba(244,124,32,.1)',
                                        padding: '2px 8px', borderRadius: 20,
                                    }}>
                                        {(focus_questions_by_video[activeVideoIdx] ?? []).length} أسئلة تركيز
                                    </span>
                                )}
                            </div>
                        )}

                        {/* Lesson info */}
                        <div style={{ padding: '1.25rem 1.5rem' }}>
                            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', gap: 12, flexWrap: 'wrap' }}>
                                <div style={{ flex: 1 }}>
                                    <h1 style={{ color: textMain, fontSize: 20, fontWeight: 900, margin: '0 0 6px', fontFamily: 'Cairo, sans-serif', transition: 'color .3s' }}>
                                        {lesson.title}
                                    </h1>
                                    {lesson.description && (
                                        <p style={{ color: textSub, fontSize: 13, lineHeight: 1.7, margin: 0, transition: 'color .3s' }}>
                                            {lesson.description}
                                        </p>
                                    )}
                                </div>
                                <div style={{ display: 'flex', flexWrap: 'wrap', gap: 8, flexShrink: 0 }}>
                                    <span style={{
                                        background: dark ? 'rgba(20,33,61,.6)' : N,
                                        color: '#fff',
                                        borderRadius: 20, padding: '4px 12px',
                                        fontSize: 11, fontWeight: 700,
                                    }}>
                                        ⏱️ {lesson.duration} دقيقة
                                    </span>
                                    {progress.is_completed ? (
                                        <span style={{ background: '#059669', color: '#fff', borderRadius: 20, padding: '4px 12px', fontSize: 11, fontWeight: 700 }}>✓ مكتملة</span>
                                    ) : (
                                        <span style={{ background: '#F59E0B', color: '#fff', borderRadius: 20, padding: '4px 12px', fontSize: 11, fontWeight: 700 }}>● قيد المشاهدة</span>
                                    )}
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* ── Video list sidebar ── */}
                    {hasMultipleVideos && (
                        <div style={{
                            background: dark ? '#0e1726' : '#fff',
                            borderRadius: 20,
                            overflow: 'hidden',
                            boxShadow: cardShadow,
                            border: cardBorder,
                            transition: 'background .3s, border-color .3s',
                        }}>
                            {/* Sidebar header */}
                            <div style={{
                                padding: '14px 16px',
                                borderBottom: `1px solid ${divider}`,
                                background: `linear-gradient(135deg, ${N}, #1a2d52)`,
                            }}>
                                <div style={{ color: '#fff', fontSize: 14, fontWeight: 900, marginBottom: 2 }}>
                                    🎬 فيديوهات المحاضرة
                                </div>
                                <div style={{ color: 'rgba(220,201,163,.6)', fontSize: 11 }}>
                                    {allVideos.length} فيديو — اضغط لتشغيل أي منها
                                </div>
                            </div>

                            {/* Video list */}
                            <div style={{ padding: '8px 0' }}>
                                {allVideos.map((v) => {
                                    const isActive = v.index === activeVideoIdx;
                                    const qCount   = (focus_questions_by_video[v.index] ?? []).length;
                                    return (
                                        <button
                                            key={v.index}
                                            type="button"
                                            onClick={() => switchVideo(v.index)}
                                            style={{
                                                width: '100%', textAlign: 'right',
                                                padding: '12px 16px',
                                                background: isActive
                                                    ? (dark ? 'rgba(244,124,32,.1)' : 'rgba(244,124,32,.07)')
                                                    : 'transparent',
                                                borderRight: isActive ? `3px solid ${O}` : '3px solid transparent',
                                                border: 'none',
                                                borderBottom: `1px solid ${sidebarItemDiv}`,
                                                cursor: 'pointer', fontFamily: 'Cairo',
                                                transition: 'all .15s',
                                                display: 'flex', alignItems: 'center', gap: 10,
                                            }}
                                            onMouseEnter={e => { if (!isActive) e.currentTarget.style.background = dark ? 'rgba(255,255,255,.04)' : 'rgba(244,124,32,.03)'; }}
                                            onMouseLeave={e => { if (!isActive) e.currentTarget.style.background = 'transparent'; }}
                                        >
                                            <div style={{
                                                width: 32, height: 32, borderRadius: '50%', flexShrink: 0,
                                                background: isActive ? O : sidebarIconBg,
                                                display: 'flex', alignItems: 'center', justifyContent: 'center',
                                                fontSize: 12, transition: 'all .15s',
                                            }}>
                                                <span style={{ color: isActive ? '#fff' : iconColor, fontSize: 10 }}>▶</span>
                                            </div>
                                            <div style={{ flex: 1, minWidth: 0 }}>
                                                <div style={{
                                                    fontSize: 13, fontWeight: isActive ? 800 : 600,
                                                    color: isActive ? O : textMain,
                                                    marginBottom: 2,
                                                    overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap',
                                                    transition: 'color .3s',
                                                }}>
                                                    {v.label}
                                                </div>
                                                {qCount > 0 ? (
                                                    <div style={{ fontSize: 11, color: textMuted, fontWeight: 500 }}>
                                                        🎯 {qCount} أسئلة تركيز
                                                    </div>
                                                ) : (
                                                    <div style={{ fontSize: 11, color: dark ? 'rgba(148,163,184,.4)' : '#cbd5e1', fontWeight: 500 }}>
                                                        لا أسئلة تركيز
                                                    </div>
                                                )}
                                            </div>
                                        </button>
                                    );
                                })}
                            </div>
                        </div>
                    )}
                </div>

                {/* ── دعم المادة الفني ── */}
                <div style={{
                    background: cardBg,
                    borderRadius: 20,
                    boxShadow: cardShadow,
                    border: cardBorder,
                    padding: '1.25rem 1.5rem 1.5rem',
                    marginBottom: 24,
                    transition: 'background .3s, border-color .3s',
                }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 18 }}>
                        <span style={{ fontSize: 22 }}>🎓</span>
                        <div>
                            <h2 style={{ color: textMain, fontSize: 16, fontWeight: 900, margin: 0, fontFamily: 'Cairo, sans-serif', transition: 'color .3s' }}>
                                دعم المادة الفني
                            </h2>
                            <p style={{ color: textMuted, fontSize: 11, margin: '2px 0 0' }}>
                                معرفتش تفهم حاجة في المحاضرة؟ اسأل الأستاذ هنا وهيرد عليك
                            </p>
                        </div>
                    </div>

                    {/* ── Thread ── */}
                    {qaThread.length > 0 && (
                        <div style={{ display: 'flex', flexDirection: 'column', gap: 16, marginBottom: 20 }}>
                            {qaThread.map(c => (
                                <div key={c.id}>
                                    {/* سؤال الطالب */}
                                    <div style={{
                                        background: dark ? 'rgba(244,124,32,.08)' : 'rgba(244,124,32,.05)',
                                        border: `1px solid ${O}30`,
                                        borderRadius: '16px 16px 4px 16px',
                                        padding: '12px 16px',
                                        marginBottom: 8,
                                    }}>
                                        <div style={{ display: 'flex', alignItems: 'center', gap: 6, marginBottom: c.body || c.image_url || c.voice_url ? 8 : 0 }}>
                                            <span style={{ fontSize: 12, fontWeight: 900, color: O }}>🙋 سؤالك</span>
                                            <span style={{ fontSize: 10.5, color: textMuted }}>{c.created_at}</span>
                                        </div>
                                        {c.body && (
                                            <p style={{ color: textMain, fontSize: 13.5, lineHeight: 1.7, margin: 0, whiteSpace: 'pre-wrap' }}>{c.body}</p>
                                        )}
                                        {c.image_url && (
                                            <a href={c.image_url} target="_blank" rel="noopener noreferrer" style={{ display: 'inline-block', marginTop: 8 }}>
                                                <img src={c.image_url} alt="صورة السؤال" style={{ maxWidth: 220, maxHeight: 160, borderRadius: 10, border: `1px solid ${O}30`, display: 'block' }} />
                                            </a>
                                        )}
                                        {c.voice_url && (
                                            <audio controls src={c.voice_url} style={{ height: 34, marginTop: 8, maxWidth: 260 }} />
                                        )}
                                    </div>

                                    {/* رد الأستاذ */}
                                    {c.replied_at ? (
                                        <div style={{
                                            background: dark ? 'rgba(201,161,74,.08)' : 'rgba(201,161,74,.06)',
                                            border: `1px solid ${G}35`,
                                            borderRadius: '16px 16px 16px 4px',
                                            padding: '12px 16px',
                                            marginRight: 24,
                                        }}>
                                            <div style={{ display: 'flex', alignItems: 'center', gap: 6, marginBottom: c.reply_body || c.reply_image_url || c.reply_voice_url ? 8 : 0 }}>
                                                <span style={{ fontSize: 12, fontWeight: 900, color: G }}>👨‍🏫 رد الأستاذ</span>
                                                <span style={{ fontSize: 10.5, color: textMuted }}>{c.replied_at}</span>
                                            </div>
                                            {c.reply_body && (
                                                <p style={{ color: textMain, fontSize: 13.5, lineHeight: 1.7, margin: 0, whiteSpace: 'pre-wrap' }}>{c.reply_body}</p>
                                            )}
                                            {c.reply_image_url && (
                                                <a href={c.reply_image_url} target="_blank" rel="noopener noreferrer" style={{ display: 'inline-block', marginTop: 8 }}>
                                                    <img src={c.reply_image_url} alt="صورة الرد" style={{ maxWidth: 220, maxHeight: 160, borderRadius: 10, border: `1px solid ${G}35`, display: 'block' }} />
                                                </a>
                                            )}
                                            {c.reply_voice_url && (
                                                <audio controls src={c.reply_voice_url} style={{ height: 34, marginTop: 8, maxWidth: 260 }} />
                                            )}
                                        </div>
                                    ) : (
                                        <div style={{ marginRight: 24, fontSize: 11.5, color: textMuted, display: 'flex', alignItems: 'center', gap: 6 }}>
                                            ⏳ في انتظار رد الأستاذ
                                        </div>
                                    )}
                                </div>
                            ))}
                        </div>
                    )}

                    {/* ── Composer ── */}
                    <div style={{
                        background: dark ? 'rgba(255,255,255,.02)' : '#faf8f4',
                        border: `1px solid ${divider}`,
                        borderRadius: 16,
                        padding: 14,
                    }}>
                        <textarea
                            value={qBody}
                            onChange={e => setQBody(e.target.value)}
                            placeholder="اكتب سؤالك هنا…"
                            rows={2}
                            style={{
                                width: '100%', resize: 'vertical', border: 'none', outline: 'none',
                                background: 'transparent', color: textMain, fontSize: 13.5,
                                fontFamily: 'Cairo, sans-serif', lineHeight: 1.7, marginBottom: 10,
                            }}
                        />

                        {qImagePreview && (
                            <div style={{ position: 'relative', display: 'inline-block', marginBottom: 10 }}>
                                <img src={qImagePreview} alt="معاينة" style={{ maxWidth: 140, maxHeight: 110, borderRadius: 10, border: cardBorder, display: 'block' }} />
                                <button
                                    type="button"
                                    onClick={clearImage}
                                    style={{
                                        position: 'absolute', top: -8, left: -8, width: 22, height: 22, borderRadius: '50%',
                                        background: '#ef4444', color: '#fff', border: '2px solid ' + cardBg,
                                        fontSize: 11, cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center',
                                    }}
                                >✕</button>
                            </div>
                        )}

                        {qError && (
                            <p style={{ color: '#ef4444', fontSize: 12, fontWeight: 700, margin: '0 0 10px' }}>⚠ {qError}</p>
                        )}

                        <div style={{ display: 'flex', alignItems: 'center', gap: 10, flexWrap: 'wrap' }}>
                            <input ref={qImageInputRef} type="file" accept="image/*" onChange={onPickImage} style={{ display: 'none' }} id="qa-image-input" />
                            <label
                                htmlFor="qa-image-input"
                                style={{
                                    display: 'flex', alignItems: 'center', gap: 8, cursor: 'pointer',
                                    background: 'transparent', border: `1.5px solid ${dark ? 'rgba(255,255,255,.15)' : '#e5e7eb'}`,
                                    borderRadius: 999, padding: '8px 16px',
                                    color: dark ? '#cbd5e1' : '#475569', fontSize: 12.5, fontWeight: 700,
                                }}
                            >
                                🖼️ إرفاق صورة
                            </label>

                            <AudioRecorder key={qRecorderKey.current} onChange={setQVoice} dark={dark} accent={O} disabled={qSubmitting} />

                            <button
                                type="button"
                                onClick={submitQuestion}
                                disabled={qSubmitting}
                                style={{
                                    marginRight: 'auto',
                                    display: 'flex', alignItems: 'center', gap: 8,
                                    background: qSubmitting ? 'rgba(244,124,32,.5)' : `linear-gradient(135deg, ${O}, #d96a12)`,
                                    color: '#fff', border: 'none', borderRadius: 999, padding: '9px 22px',
                                    fontSize: 13, fontWeight: 800, cursor: qSubmitting ? 'default' : 'pointer',
                                    boxShadow: qSubmitting ? 'none' : `0 4px 14px rgba(244,124,32,.35)`,
                                    fontFamily: 'Cairo, sans-serif',
                                }}
                            >
                                {qSubmitting ? 'جاري الإرسال…' : 'إرسال السؤال ↑'}
                            </button>
                        </div>
                    </div>
                </div>

                {/* ── PDF Files section ── */}
                {pdfs.length > 0 && (
                    <div style={{
                        background: cardBg,
                        borderRadius: 20,
                        boxShadow: cardShadow,
                        border: cardBorder,
                        padding: '1.25rem 1.5rem',
                        marginBottom: 24,
                        transition: 'background .3s, border-color .3s',
                    }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 16 }}>
                            <span style={{ fontSize: 22 }}>📄</span>
                            <div>
                                <h2 style={{ color: textMain, fontSize: 16, fontWeight: 900, margin: 0, fontFamily: 'Cairo, sans-serif', transition: 'color .3s' }}>
                                    ملفات المحاضرة
                                </h2>
                                <p style={{ color: textMuted, fontSize: 11, margin: '2px 0 0' }}>
                                    اضغط لتحميل أو عرض الملف
                                </p>
                            </div>
                        </div>
                        <div style={{ display: 'flex', flexWrap: 'wrap', gap: 10 }}>
                            {pdfs.map((pdf, i) => (
                                <a
                                    key={i}
                                    href={pdf.url}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    style={{
                                        display: 'flex', alignItems: 'center', gap: 10,
                                        padding: '12px 18px', borderRadius: 14,
                                        border: `1.5px solid ${dark ? 'rgba(201,161,74,.25)' : 'rgba(201,161,74,.3)'}`,
                                        background: dark ? 'rgba(201,161,74,.06)' : 'rgba(201,161,74,.05)',
                                        textDecoration: 'none',
                                        transition: 'all .18s',
                                        flex: '1 1 200px', minWidth: 180, maxWidth: 280,
                                    }}
                                    onMouseEnter={e => {
                                        e.currentTarget.style.background = dark ? 'rgba(201,161,74,.14)' : 'rgba(201,161,74,.12)';
                                        e.currentTarget.style.borderColor = G;
                                        e.currentTarget.style.transform = 'translateY(-2px)';
                                        e.currentTarget.style.boxShadow = '0 6px 18px rgba(201,161,74,.2)';
                                    }}
                                    onMouseLeave={e => {
                                        e.currentTarget.style.background = dark ? 'rgba(201,161,74,.06)' : 'rgba(201,161,74,.05)';
                                        e.currentTarget.style.borderColor = dark ? 'rgba(201,161,74,.25)' : 'rgba(201,161,74,.3)';
                                        e.currentTarget.style.transform = 'translateY(0)';
                                        e.currentTarget.style.boxShadow = 'none';
                                    }}
                                >
                                    <div style={{
                                        width: 40, height: 40, borderRadius: 10, flexShrink: 0,
                                        background: dark ? 'rgba(201,161,74,.15)' : 'rgba(201,161,74,.15)',
                                        display: 'flex', alignItems: 'center', justifyContent: 'center',
                                        fontSize: 20,
                                    }}>
                                        📋
                                    </div>
                                    <div style={{ flex: 1, minWidth: 0 }}>
                                        <div style={{ color: textMain, fontSize: 13, fontWeight: 800, marginBottom: 2, transition: 'color .3s' }}>
                                            {pdf.label}
                                        </div>
                                        <div style={{ color: textMuted, fontSize: 11 }}>
                                            PDF — اضغط للفتح
                                        </div>
                                    </div>
                                    <span style={{ color: G, fontSize: 16, flexShrink: 0 }}>↗</span>
                                </a>
                            ))}
                        </div>
                    </div>
                )}

                {/* ── End-of-lesson quiz ── */}
                <div style={{
                    background: cardBg,
                    borderRadius: 20,
                    boxShadow: cardShadow,
                    border: cardBorder,
                    padding: '1.5rem 2rem',
                    transition: 'background .3s, border-color .3s',
                }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 12, borderBottom: `1px solid ${divider}`, paddingBottom: 16, marginBottom: 20 }}>
                        <span style={{ fontSize: 24 }}>📝</span>
                        <div>
                            <h2 style={{ color: textMain, fontSize: 18, fontWeight: 900, margin: 0, fontFamily: 'Cairo, sans-serif', transition: 'color .3s' }}>
                                الاختبار الدوري للمحاضرة
                            </h2>
                            <p style={{ color: textMuted, fontSize: 12, margin: '2px 0 0' }}>
                                درجة النجاح: {lesson.passing_score || 60}% أو أكثر
                            </p>
                        </div>
                    </div>

                    {/* No questions */}
                    {!quizStarted && !quizFinished && quiz_questions.length === 0 && (
                        <div style={{ textAlign: 'center', padding: '2.5rem 1rem' }}>
                            <div style={{ fontSize: 40, marginBottom: 12 }}>🔒</div>
                            <p style={{ color: textMuted, fontSize: 13, fontWeight: 600 }}>
                                لم يتم إضافة أسئلة لهذه المحاضرة بعد — ستظهر هنا بعد أن يضيفها المدرس.
                            </p>
                        </div>
                    )}

                    {/* Start prompt */}
                    {!quizStarted && !quizFinished && quiz_questions.length > 0 && (
                        <div style={{ textAlign: 'center', padding: '2rem 1rem' }}>
                            <p style={{ color: textSub, fontSize: 14, marginBottom: 20, fontWeight: 500 }}>
                                أجب على {quiz_questions.length} سؤال وسيُحسب درجتك فوراً.
                            </p>
                            <button
                                onClick={() => { setAnswers({}); setQuizStarted(true); }}
                                style={{
                                    padding: '11px 32px', borderRadius: 14,
                                    background: `linear-gradient(135deg, ${O}, #d96a12)`,
                                    color: '#fff', border: 'none',
                                    fontSize: 14, fontWeight: 800, cursor: 'pointer',
                                    fontFamily: 'Cairo',
                                    boxShadow: `0 4px 14px rgba(244,124,32,.4)`,
                                    transition: 'opacity .2s',
                                }}
                                onMouseEnter={e => e.currentTarget.style.opacity = '.88'}
                                onMouseLeave={e => e.currentTarget.style.opacity = '1'}
                            >
                                بدء الاختبار الآن 🎯
                            </button>
                        </div>
                    )}

                    {/* Quiz form */}
                    {quizStarted && (
                        <form onSubmit={submitQuiz} style={{ display: 'flex', flexDirection: 'column', gap: 28 }}>
                            {quiz_questions.map((q, idx) => (
                                <div key={q.id}>
                                    <h3 style={{
                                        color: textMain, fontSize: 14, fontWeight: 800,
                                        display: 'flex', alignItems: 'flex-start', gap: 10, marginBottom: 12,
                                        transition: 'color .3s',
                                    }}>
                                        <span style={{
                                            width: 26, height: 26, borderRadius: '50%', flexShrink: 0,
                                            background: dark ? O : N,
                                            color: '#fff', fontSize: 11, fontWeight: 900,
                                            display: 'flex', alignItems: 'center', justifyContent: 'center',
                                        }}>
                                            {idx + 1}
                                        </span>
                                        {q.question_text}
                                    </h3>
                                    <div style={{ display: 'flex', flexDirection: 'column', gap: 8, paddingRight: 36 }}>
                                        {Object.entries(q.options).map(([key, text]) => {
                                            const isSelected = answers[q.id] === key;
                                            return (
                                                <button
                                                    key={key}
                                                    type="button"
                                                    onClick={() => setAnswers(prev => ({ ...prev, [q.id]: key }))}
                                                    style={{
                                                        textAlign: 'right', padding: '12px 14px',
                                                        borderRadius: 12,
                                                        border: `1.5px solid ${isSelected ? O : optionBorder}`,
                                                        background: isSelected
                                                            ? (dark ? 'rgba(244,124,32,.12)' : 'rgba(244,124,32,.06)')
                                                            : optionBg,
                                                        cursor: 'pointer', fontFamily: 'Cairo',
                                                        fontSize: 13, fontWeight: isSelected ? 700 : 500,
                                                        color: isSelected ? textMain : optionColor,
                                                        transition: 'all .15s',
                                                        display: 'flex', alignItems: 'center', gap: 10,
                                                    }}
                                                >
                                                    <span style={{
                                                        width: 28, height: 28, borderRadius: '50%', flexShrink: 0,
                                                        background: isSelected ? O : (dark ? 'rgba(255,255,255,.1)' : '#f0f0f0'),
                                                        color: isSelected ? '#fff' : (dark ? '#94a3b8' : '#888'),
                                                        fontSize: 12, fontWeight: 900,
                                                        display: 'flex', alignItems: 'center', justifyContent: 'center',
                                                    }}>
                                                        {OPTION_LABELS[key]}
                                                    </span>
                                                    {text}
                                                </button>
                                            );
                                        })}
                                    </div>
                                </div>
                            ))}

                            <div style={{ display: 'flex', justifyContent: 'flex-end', gap: 10, paddingTop: 16, borderTop: `1px solid ${divider}` }}>
                                <button
                                    type="button"
                                    onClick={() => setQuizStarted(false)}
                                    style={{
                                        padding: '9px 20px', borderRadius: 12,
                                        border: `1px solid ${cancelBorder}`,
                                        background: cancelBg, color: cancelColor,
                                        fontSize: 13, fontWeight: 700, cursor: 'pointer', fontFamily: 'Cairo',
                                        transition: 'all .2s',
                                    }}
                                >
                                    إلغاء
                                </button>
                                <button
                                    type="submit"
                                    disabled={Object.keys(answers).length < quiz_questions.length || submitting}
                                    style={{
                                        padding: '9px 24px', borderRadius: 12, border: 'none',
                                        background: (Object.keys(answers).length < quiz_questions.length || submitting)
                                            ? (dark ? 'rgba(255,255,255,.15)' : '#cbd5e1')
                                            : O,
                                        color: '#fff', fontSize: 13, fontWeight: 800,
                                        cursor: (Object.keys(answers).length < quiz_questions.length || submitting) ? 'not-allowed' : 'pointer',
                                        fontFamily: 'Cairo', transition: 'background .2s',
                                    }}
                                >
                                    {submitting ? 'جارٍ التصحيح...' : 'إرسال الإجابات'}
                                </button>
                            </div>
                        </form>
                    )}

                    {/* Result */}
                    {quizFinished && (
                        <div style={{ textAlign: 'center', padding: '1.5rem 1rem' }}>
                            <img
                                src={teacherReactionImage(score)}
                                alt="رد فعل المدرس"
                                style={{ height: 220, width: 'auto', objectFit: 'contain', margin: '0 auto 16px', display: 'block' }}
                            />
                            {(quizResult?.passed || progress.quiz_passed) ? (
                                <h3 style={{ color: '#059669', fontSize: 18, fontWeight: 900, margin: '0 0 8px' }}>
                                    تهانينا! اجتزت الاختبار بنجاح 🎉
                                </h3>
                            ) : (
                                <h3 style={{ color: '#DC2626', fontSize: 18, fontWeight: 900, margin: '0 0 8px' }}>
                                    لم تجتز الاختبار — حاول مرة أخرى 💪
                                </h3>
                            )}
                            <div style={{
                                display: 'inline-block', padding: '16px 32px',
                                background: resultBoxBg,
                                borderRadius: 16,
                                border: `1px solid ${resultBoxBorder}`,
                                margin: '12px 0 20px',
                                transition: 'background .3s, border-color .3s',
                            }}>
                                <div style={{ fontSize: 36, fontWeight: 900, color: O }}>{score}%</div>
                                {quizResult && (
                                    <div style={{ fontSize: 12, color: textMuted, marginTop: 4 }}>
                                        {quizResult.correct} صح من {quizResult.total} سؤال
                                    </div>
                                )}
                            </div>
                            <div style={{ display: 'flex', justifyContent: 'center', gap: 12, flexWrap: 'wrap' }}>
                                {!(quizResult?.passed || progress.quiz_passed) && (
                                    <button
                                        onClick={() => { setQuizFinished(false); setAnswers({}); setQuizResult(null); setScore(0); setQuizStarted(false); }}
                                        style={{
                                            padding: '10px 22px', borderRadius: 12,
                                            border: `2px solid ${O}`, color: O,
                                            background: dark ? 'rgba(244,124,32,.08)' : '#fff',
                                            fontSize: 13, fontWeight: 800, cursor: 'pointer', fontFamily: 'Cairo',
                                            transition: 'background .2s',
                                        }}
                                    >
                                        إعادة الاختبار 🔄
                                    </button>
                                )}
                                <Link
                                    href={route('student.lessons')}
                                    style={{
                                        display: 'inline-block', padding: '10px 22px',
                                        background: N, color: '#fff', borderRadius: 12,
                                        fontSize: 13, fontWeight: 800, textDecoration: 'none',
                                    }}
                                >
                                    الرجوع للمحاضرات 🚀
                                </Link>
                            </div>
                        </div>
                    )}
                </div>
            </div>
        </StudentLayout>
    );
}
