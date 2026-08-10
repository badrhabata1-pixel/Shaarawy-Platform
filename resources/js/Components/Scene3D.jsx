import React, { useRef, Suspense } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { useGLTF } from '@react-three/drei';
import * as THREE from 'three';

/* ─────────────────────────────────────────────────────────────
   WireframeFallback
   Shown inside the canvas while the GLTF is still loading.
───────────────────────────────────────────────────────────── */
function WireframeFallback() {
    const ref = useRef();
    useFrame((_, delta) => {
        if (ref.current) {
            ref.current.rotation.y += delta * 0.8;
            ref.current.rotation.x += delta * 0.3;
        }
    });
    return (
        <mesh ref={ref}>
            <octahedronGeometry args={[1.2, 0]} />
            <meshStandardMaterial
                color="#F47C20"
                wireframe
                transparent
                opacity={0.55}
            />
        </mesh>
    );
}

/* ─────────────────────────────────────────────────────────────
   Model
   Reads proxyRef every frame and applies GSAP-driven values
   plus a subtle idle sine-wave so the model never feels static.

   proxyRef.current shape:
     { ry, rx, px, py, scale }
   GSAP mutates these; useFrame syncs them to the Three.js object.
───────────────────────────────────────────────────────────── */
function Model({ proxyRef }) {
    const { scene } = useGLTF('/assets/3D.gltf');
    const groupRef  = useRef();

    useFrame(({ clock }) => {
        if (!groupRef.current || !proxyRef?.current) return;

        const p = proxyRef.current;
        const t = clock.elapsedTime;

        /* GSAP-driven values + subtle idle animation */
        groupRef.current.rotation.y  = p.ry + Math.sin(t * 0.38) * 0.045;
        groupRef.current.rotation.x  = p.rx + Math.cos(t * 0.27) * 0.022;
        groupRef.current.position.x  = p.px;
        groupRef.current.position.y  = p.py + Math.sin(t * 0.46) * 0.07;
        groupRef.current.scale.setScalar(p.scale);
    });

    return (
        <group ref={groupRef}>
            <primitive object={scene} />
        </group>
    );
}

/* Preload so the GLTF starts fetching immediately on import */
useGLTF.preload('/assets/3D.gltf');

/* ─────────────────────────────────────────────────────────────
   Scene3D  —  fixed full-viewport canvas, transparent bg
   z-index: 0  →  content wrapper at z-index: 10 sits above it
───────────────────────────────────────────────────────────── */
export default function Scene3D({ proxyRef }) {
    return (
        <Canvas
            style={{
                position:      'fixed',
                inset:         0,
                zIndex:        0,
                background:    'transparent',
                pointerEvents: 'none', /* canvas is purely visual; scrolling stays on the window */
            }}
            gl={{
                alpha:                true,     /* transparent background */
                antialias:            true,
                toneMapping:          THREE.ACESFilmicToneMapping,
                toneMappingExposure:  1.15,
                powerPreference:      'high-performance',
            }}
            camera={{ position: [0, 0, 5], fov: 50 }}
            dpr={[1, 2]}
        >
            {/* ── Lighting ── */}
            <ambientLight intensity={0.4} color="#8baacf" />
            <directionalLight position={[6, 10, 4]} intensity={1.8} color="#ffffff" />
            <pointLight position={[-5, 2, 3]} intensity={1.5} color="#F47C20" />
            <pointLight position={[4, -3, -2]} intensity={0.7} color="#C9A14A" />
            {/* Hemisphere gives navy sky vs deep ground — flatters the dark model */}
            <hemisphereLight args={['#1e3a6e', '#060D1E', 0.6]} />

            <Suspense fallback={<WireframeFallback />}>
                <Model proxyRef={proxyRef} />
            </Suspense>
        </Canvas>
    );
}
