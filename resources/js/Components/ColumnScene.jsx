import { Suspense, useRef, useEffect } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { useGLTF } from '@react-three/drei';
import * as THREE from 'three';

const BASE_SCALE_TEACHER = 2.5;
const Y_OFFSET_TEACHER   = -1.0;
const MOUSE_LERP         = 0.06;

function TeacherModel({ proxyRef }) {
    const { scene }   = useGLTF('/assets/history_book.glb');
    const groupRef    = useRef();
    const smoothMouse = useRef({ x: 0, y: 0 });

    useEffect(() => {
        if (!scene) return;
        scene.traverse(child => {
            if (!child.isMesh) return;
            if (child.geometry && !child.geometry.attributes.normal) {
                child.geometry.computeVertexNormals();
            }
            const embeddedTex = child.material?.map ?? null;
            child.material = new THREE.MeshBasicMaterial({
                map:         embeddedTex,
                transparent: true,
                side:        THREE.DoubleSide,
            });
        });
    }, [scene]);

    useFrame(({ mouse, clock }) => {
        if (!groupRef.current) return;
        const p = proxyRef?.current?.column;
        if (!p) return;
        const t = clock.elapsedTime;

        smoothMouse.current.x += (mouse.x - smoothMouse.current.x) * MOUSE_LERP;
        smoothMouse.current.y += (mouse.y - smoothMouse.current.y) * MOUSE_LERP;

        groupRef.current.rotation.y = p.ry + smoothMouse.current.x * 0.10;
        groupRef.current.rotation.x = p.rx - smoothMouse.current.y * 0.06;
        groupRef.current.position.x = p.px;
        groupRef.current.position.y = p.py + Y_OFFSET_TEACHER + Math.sin(t * 0.40) * 0.05;

        const s = Math.max(0, p.scaleXZ ?? 1) * BASE_SCALE_TEACHER;
        groupRef.current.scale.set(s, s * (p.scaleY ?? 1), s);
    });

    return (
        <group ref={groupRef}>
            <primitive object={scene} />
        </group>
    );
}

/* ── Materials created once at module level — not on every render ── */
const STONE    = '#DCC9A3';
const GOLD     = '#C9A14A';
const stoneMat = new THREE.MeshStandardMaterial({ color: STONE, roughness: 0.85, metalness: 0.02 });
const goldMat  = new THREE.MeshStandardMaterial({ color: GOLD,  roughness: 0.4,  metalness: 0.5  });

const BASE_SCALE_TEMPLE = 0.80;

function CustomColumn({ proxyRef }) {
    const groupRef = useRef();

    useFrame(({ clock }) => {
        if (!groupRef.current) return;
        const p = proxyRef?.current?.temple;
        if (!p) return;
        const t = clock.elapsedTime;

        groupRef.current.rotation.y = p.ry + Math.sin(t * 0.30) * 0.028;
        groupRef.current.rotation.x = p.rx + Math.cos(t * 0.22) * 0.014;
        groupRef.current.position.x = p.px;
        groupRef.current.position.y = p.py + Math.sin(t * 0.40) * 0.05;

        const sXZ = Math.max(0, p.scaleXZ ?? 0) * BASE_SCALE_TEMPLE;
        const sY  = Math.max(0, p.scaleY  ?? 0) * BASE_SCALE_TEMPLE;
        groupRef.current.scale.set(sXZ, sY, sXZ);
    });

    return (
        <group ref={groupRef} scale={0}>

            {/* Stylobate base (3 steps) */}
            {[0, 0.12, 0.24].map((y, i) => (
                <mesh key={`step-${i}`} position={[0, y, 0]} material={stoneMat}>
                    <boxGeometry args={[3.8 - i * 0.3, 0.14, 3.8 - i * 0.3]} />
                </mesh>
            ))}

            {/* Four columns */}
            {[[-1.2, 0], [1.2, 0], [-1.2, -1.2], [1.2, -1.2]].map(([x, z], i) => (
                <group key={`col-${i}`} position={[x, 0.38, z]}>
                    <mesh position={[0, 0, 0]} material={stoneMat}>
                        <cylinderGeometry args={[0.22, 0.24, 0.12, 16]} />
                    </mesh>
                    <mesh position={[0, 1.1, 0]} material={stoneMat}>
                        <cylinderGeometry args={[0.18, 0.22, 2.0, 20]} />
                    </mesh>
                    <mesh position={[0, 2.14, 0]} material={stoneMat}>
                        <cylinderGeometry args={[0.28, 0.18, 0.18, 16]} />
                    </mesh>
                    <mesh position={[0, 2.26, 0]} material={stoneMat}>
                        <boxGeometry args={[0.62, 0.12, 0.62]} />
                    </mesh>
                    <mesh position={[0, 1.8, 0]} material={goldMat}>
                        <torusGeometry args={[0.19, 0.018, 8, 24]} />
                    </mesh>
                </group>
            ))}

            {/* Entablature */}
            <mesh position={[0, 2.72, -0.6]} material={stoneMat}>
                <boxGeometry args={[3.2, 0.22, 2.4]} />
            </mesh>

            {/* Gold frieze strip */}
            <mesh position={[0, 2.84, -0.6]} material={goldMat}>
                <boxGeometry args={[3.2, 0.04, 2.4]} />
            </mesh>

            {/* Pediment */}
            <mesh position={[0, 3.26, -0.6]} material={stoneMat}>
                <cylinderGeometry args={[0, 1.7, 0.7, 3, 1]} />
            </mesh>
        </group>
    );
}

export default function ColumnScene({ proxyRef }) {
    return (
        <Canvas
            style={{ position:'fixed', inset:0, zIndex:0, background:'transparent', pointerEvents:'none' }}
            gl={{ alpha:true, antialias:true, powerPreference:'high-performance', toneMapping:THREE.ACESFilmicToneMapping, toneMappingExposure:1.0 }}
            camera={{ position:[0,0,5.5], fov:48 }}
            dpr={[1, 1]}
        >
            <ambientLight intensity={1.4} color="#c8d4e0" />
            <directionalLight position={[4, 8, 5]}  intensity={2.5} color="#fff8f0" />
            <directionalLight position={[-4, 2, 5]} intensity={1.0} color="#d8e8f4" />
            <hemisphereLight args={['#4a6a9a', '#0a0e18', 0.7]} />

            <Suspense fallback={null}>
                <TeacherModel proxyRef={proxyRef} />
            </Suspense>

            <Suspense fallback={null}>
                <CustomColumn proxyRef={proxyRef} />
            </Suspense>
        </Canvas>
    );
}

useGLTF.preload('/assets/history_book.glb');
