import { useEffect, useState, useRef } from 'react';

/**
 * Floating diagonal watermark overlay for the secure video player.
 * Renders the student's email, phone, and name across the video.
 * Repositions every 8 seconds to deter screen recording.
 */
export default function Watermark({ email, phone, name }) {
    const positions = [
        { top: '15%', left: '5%' },
        { top: '35%', left: '25%' },
        { top: '55%', left: '10%' },
        { top: '20%', left: '50%' },
        { top: '70%', left: '40%' },
        { top: '45%', left: '60%' },
        { top: '80%', left: '20%' },
    ];

    const [posIdx, setPosIdx] = useState(0);
    const [visible, setVisible] = useState(true);

    useEffect(() => {
        const interval = setInterval(() => {
            // Fade out → change position → fade in
            setVisible(false);
            setTimeout(() => {
                setPosIdx(i => (i + 1) % positions.length);
                setVisible(true);
            }, 400);
        }, 8000);
        return () => clearInterval(interval);
    }, []);

    const pos = positions[posIdx];

    return (
        <div
            style={{
                position: 'absolute',
                inset: 0,
                pointerEvents: 'none',
                zIndex: 20,
                userSelect: 'none',
                WebkitUserSelect: 'none',
            }}
        >
            <div
                style={{
                    position: 'absolute',
                    top: pos.top,
                    left: pos.left,
                    transform: 'rotate(-25deg)',
                    opacity: visible ? 0.28 : 0,
                    transition: 'opacity 0.4s ease',
                    color: '#ffffff',
                    fontSize: 11,
                    fontWeight: 700,
                    fontFamily: 'monospace',
                    letterSpacing: 1,
                    lineHeight: 1.7,
                    textShadow: '0 0 4px rgba(0,0,0,.8)',
                    whiteSpace: 'nowrap',
                }}
            >
                <div>{email}</div>
                <div>{phone}</div>
                <div>{name}</div>
            </div>
        </div>
    );
}
