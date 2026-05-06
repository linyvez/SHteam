import { useMemo, useEffect, useRef } from "react";
import * as THREE from "three";
import { useThree, useFrame } from "@react-three/fiber";

interface ShaderMeshProps {
    fragment: string;
    vertex: string;
    textureUrl: string | null;
    customUniforms?: Record<string, number>;
}

export const ShaderMesh = ({ fragment, vertex, textureUrl, customUniforms = {} }: ShaderMeshProps) => {
    const { viewport } = useThree();
    const materialRef = useRef<THREE.ShaderMaterial>(null);

    const uniforms = useMemo(() => ({
        u_time: { value: 0 },
        u_texture: { value: null as THREE.Texture | null },
    }), []);

    useFrame((state) => {
        if (materialRef.current) {
            materialRef.current.uniforms.u_time.value = state.clock.elapsedTime;
        }
    });

    useEffect(() => {
        if (materialRef.current) {
            Object.entries(customUniforms).forEach(([key, val]) => {
                // If the uniform doesn't exist in Three.js yet, create it. Otherwise, update it.
                if (!materialRef.current!.uniforms[key]) {
                    materialRef.current!.uniforms[key] = { value: val };
                } else {
                    materialRef.current!.uniforms[key].value = val;
                }
            });
            materialRef.current.uniformsNeedUpdate = true;
        }
    }, [customUniforms]); // Reruns every time a slider moves

    useEffect(() => {
        if (!textureUrl) return;

        const loader = new THREE.TextureLoader();
        loader.setCrossOrigin("anonymous");

        loader.load(
            textureUrl,
            (loadedTexture) => {
                loadedTexture.colorSpace = THREE.SRGBColorSpace;
                loadedTexture.flipY = true;

                if (materialRef.current) {
                    materialRef.current.uniforms.u_texture.value = loadedTexture;
                    materialRef.current.uniformsNeedUpdate = true;
                }
            }
        );
    }, [textureUrl]);

    return (
        <mesh>
            <planeGeometry args={[viewport.width, viewport.height]} />
            <shaderMaterial
                ref={materialRef}
                vertexShader={vertex}
                fragmentShader={fragment}
                uniforms={uniforms}
                side={THREE.DoubleSide}
            />
        </mesh>
    );
};