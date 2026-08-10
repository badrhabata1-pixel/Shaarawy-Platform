import { useRef } from 'react';
import { useFrame } from '@react-three/fiber';

/**
 * Greek column — reads proxyRef.current.column every frame.
 * Supports separate scaleY / scaleXZ so the morph animation
 * can compress the Y-axis independently (extrusion effect).
 */
export default function CustomColumn({ proxyRef }) {
    const groupRef = useRef();

    useFrame(({ clock }) => {
        if (!groupRef.current) return;
        const p = proxyRef?.current?.column;
        if (!p) return;
        const t = clock.elapsedTime;

        /* Continuous idle spin — one full rotation every ~14 seconds */
        groupRef.current.rotation.y = p.ry + t * 0.45;
        groupRef.current.rotation.x = p.rx + Math.cos(t * 0.27) * 0.018;
        groupRef.current.position.x = p.px;
        groupRef.current.position.y = p.py + Math.sin(t * 0.46) * 0.05;

        /* Separate Y and XZ scale for the squeeze-morph effect */
        const sXZ = Math.max(0, p.scaleXZ ?? 1);
        const sY  = Math.max(0, p.scaleY  ?? 1);
        groupRef.current.scale.set(sXZ, sY, sXZ);
    });

    const stone = { roughness: 0.82, metalness: 0.05 };
    const gold  = { roughness: 0.55, metalness: 0.28 };

    return (
        <group ref={groupRef}>
            <mesh position={[0, 1.65, 0]}>
                <boxGeometry args={[0.8, 0.15, 0.8]} />
                <meshStandardMaterial color="#C9A14A" {...gold} />
            </mesh>
            <mesh position={[0, 1.47, 0]}>
                <cylinderGeometry args={[0.41, 0.30, 0.24, 24]} />
                <meshStandardMaterial color="#DCC9A3" {...stone} />
            </mesh>
            <mesh position={[0, 0, 0]}>
                <cylinderGeometry args={[0.3, 0.3, 3, 32]} />
                <meshStandardMaterial color="#DCC9A3" {...stone} />
            </mesh>
            {Array.from({ length: 8 }, (_, i) => {
                const a = (i / 8) * Math.PI * 2;
                return (
                    <mesh key={i} position={[Math.cos(a) * 0.31, 0, Math.sin(a) * 0.31]}>
                        <cylinderGeometry args={[0.032, 0.032, 3, 6]} />
                        <meshStandardMaterial color="#C9B489" {...stone} />
                    </mesh>
                );
            })}
            <mesh position={[0, 1.36, 0]} rotation={[Math.PI / 2, 0, 0]}>
                <torusGeometry args={[0.30, 0.028, 10, 32]} />
                <meshStandardMaterial color="#C9A14A" {...gold} />
            </mesh>
            <mesh position={[0, -1.36, 0]} rotation={[Math.PI / 2, 0, 0]}>
                <torusGeometry args={[0.30, 0.028, 10, 32]} />
                <meshStandardMaterial color="#C9A14A" {...gold} />
            </mesh>
            <mesh position={[0, -1.47, 0]}>
                <cylinderGeometry args={[0.30, 0.41, 0.24, 24]} />
                <meshStandardMaterial color="#DCC9A3" {...stone} />
            </mesh>
            <mesh position={[0, -1.65, 0]}>
                <boxGeometry args={[0.8, 0.15, 0.8]} />
                <meshStandardMaterial color="#C9A14A" {...gold} />
            </mesh>
        </group>
    );
}
