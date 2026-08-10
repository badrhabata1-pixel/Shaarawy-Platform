import { useRef } from 'react';
import { useFrame } from '@react-three/fiber';
import { useGLTF } from '@react-three/drei';

/* BASE_SCALE normalises the GLTF's native size. "full size" = scaleXZ 1 * BASE_SCALE */
const BASE_SCALE = 0.80;

function TempleModel({ proxyRef }) {
    const { scene } = useGLTF('/assets/3D.gltf');
    const groupRef  = useRef();

    useFrame(({ clock }) => {
        if (!groupRef.current) return;
        const p = proxyRef?.current?.temple;
        if (!p) return;
        const t = clock.elapsedTime;

        groupRef.current.rotation.y = p.ry + Math.sin(t * 0.30) * 0.028;
        groupRef.current.rotation.x = p.rx + Math.cos(t * 0.22) * 0.014;
        groupRef.current.position.x = p.px;
        groupRef.current.position.y = p.py + Math.sin(t * 0.40) * 0.05;

        /* Separate Y and XZ for the extrusion morph effect */
        const sXZ = Math.max(0, p.scaleXZ ?? 0) * BASE_SCALE;
        const sY  = Math.max(0, p.scaleY  ?? 0) * BASE_SCALE;
        groupRef.current.scale.set(sXZ, sY, sXZ);
    });

    return (
        /* scale={0} prevents the 1-frame flash before useFrame runs */
        <group ref={groupRef} scale={0}>
            <primitive object={scene} />
        </group>
    );
}

useGLTF.preload('/assets/3D.gltf');
export default TempleModel;
