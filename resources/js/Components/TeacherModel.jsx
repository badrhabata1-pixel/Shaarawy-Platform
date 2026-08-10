import { useRef, useEffect } from 'react';
import { useFrame, useThree } from '@react-three/fiber';
import { useGLTF } from '@react-three/drei';
import * as THREE from 'three';

const BASE_SCALE = 2.5;
const Y_OFFSET   = -1.0;
const MOUSE_LERP = 0.06;

function TeacherModel({ proxyRef }) {
    const { scene }   = useGLTF('/assets/history_book.glb');
    const groupRef    = useRef();
    const { mouse }   = useThree();
    const smoothMouse = useRef({ x: 0, y: 0 });

    useEffect(() => {
        if (!scene) return;
        scene.traverse(child => {
            if (!child.isMesh) return;

            /* Compute normals as fallback (good for geometry cache) */
            if (child.geometry && !child.geometry.attributes.normal) {
                child.geometry.computeVertexNormals();
            }

            /* Extract original texture then swap to MeshBasicMaterial
               — bypasses lighting entirely, texture renders as-is */
            const originalTexture = child.material?.map ?? null;
            child.material = new THREE.MeshBasicMaterial({
                map:         originalTexture,
                transparent: true,
                side:        THREE.DoubleSide,
            });
            child.material.needsUpdate = true;
        });
    }, [scene]);

    useFrame(({ clock }) => {
        if (!groupRef.current) return;
        const p = proxyRef?.current?.column;
        if (!p) return;
        const t = clock.elapsedTime;

        smoothMouse.current.x += (mouse.x - smoothMouse.current.x) * MOUSE_LERP;
        smoothMouse.current.y += (mouse.y - smoothMouse.current.y) * MOUSE_LERP;

        groupRef.current.rotation.y = p.ry + smoothMouse.current.x * 0.10;
        groupRef.current.rotation.x = p.rx - smoothMouse.current.y * 0.06;
        groupRef.current.position.x = p.px;
        groupRef.current.position.y = p.py + Y_OFFSET + Math.sin(t * 0.40) * 0.05;

        const s = Math.max(0, p.scaleXZ ?? 1) * BASE_SCALE;
        groupRef.current.scale.set(s, s * (p.scaleY ?? 1), s);
    });

    return (
        <group ref={groupRef}>
            <primitive object={scene} />
        </group>
    );
}

useGLTF.preload('/assets/history_book.glb');
export default TeacherModel;
