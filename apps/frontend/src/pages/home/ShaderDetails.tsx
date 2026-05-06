import { useEffect, useState, useMemo } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { Canvas } from "@react-three/fiber";
import * as THREE from "three";
import MainLayout from "../../layouts/MainLayout";
import type { Shader } from "../../../../../packages/shared";

// 1. The WebGL Component that actually renders the shader
const ShaderMesh = ({ fragment, vertex, textureUrl }: { fragment: string, vertex: string, textureUrl: string | null }) => {
    // Memoize uniforms so they don't recreate on every React render cycle
    const uniforms = useMemo(() => ({
        u_time: { value: 0 },
        u_texture: { value: null as THREE.Texture | null }
    }), []);

    // Update the texture uniform whenever the user uploads a new image
    useEffect(() => {
        if (textureUrl) {
            new THREE.TextureLoader().load(textureUrl, (loadedTexture) => {
                // Ensure the texture maps correctly to PBR lighting/rendering standards
                loadedTexture.colorSpace = THREE.SRGBColorSpace;
                uniforms.u_texture.value = loadedTexture;
            });
        }
    }, [textureUrl, uniforms]);

    return (
        <mesh>
            {/* A simple flat plane to display 2D shaders. Change to boxGeometry for 3D */}
            <planeGeometry args={[5, 5]} />
            <shaderMaterial
                vertexShader={vertex}
                fragmentShader={fragment}
                uniforms={uniforms}
                side={THREE.DoubleSide}
            />
        </mesh>
    );
};

// 2. The Main Page Component
const ShaderDetails = () => {
    const { id } = useParams<{ id: string }>();
    const navigate = useNavigate();
    const [shader, setShader] = useState<Shader | null>(null);
    const [userTextureUrl, setUserTextureUrl] = useState<string | null>(null);

    useEffect(() => {
        // Fetch the specific shader by ID
        fetch(`http://localhost:3000/api/catalog/shaders/${id}`)
            .then((res) => res.json())
            .then((data) => setShader(data))
            .catch((err) => console.error(err));
    }, [id]);

    // Handle local file selection without touching the backend
    const handleImageUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
        const file = event.target.files?.[0];
        if (file) {
            // Create a temporary local memory URL for the uploaded file
            const objectUrl = URL.createObjectURL(file);
            setUserTextureUrl(objectUrl);
        }
    };

    if (!shader) return <MainLayout><div className="loading loading-spinner mt-20"></div></MainLayout>;

    return (
        <MainLayout>
            <div className="w-full flex flex-col md:flex-row gap-6 h-[80vh]">

                {/* Left Side: The 3D Canvas */}
                <div className="flex-1 bg-black rounded-box overflow-hidden border border-gray-800 relative">
                    <Canvas camera={{ position: [0, 0, 5] }}>
                        <ShaderMesh
                            fragment={shader.fragmentShader}
                            vertex={shader.vertexShader}
                            textureUrl={userTextureUrl}
                        />
                    </Canvas>
                </div>

                {/* Right Side: Controls and Metadata */}
                <div className="w-full md:w-96 flex flex-col gap-4 bg-shteam-comp p-6 rounded-box border border-gray-800 relative">
                    <button
                        onClick={() => navigate("/catalog")}
                        className="btn btn-sm btn-circle btn-ghost absolute right-4 top-4 text-gray-400 hover:text-white"
                        aria-label="Close"
                    >
                        ✕
                    </button>
                    <h1 className="text-3xl font-bold">{shader.title}</h1>
                    <span className="badge badge-primary">{shader.price === 0 ? "Free" : `$${shader.price}`}</span>
                    <p className="text-gray-400">{shader.description}</p>

                    <div className="divider"></div>

                    <h3 className="text-lg font-semibold mb-2">Test Your Image</h3>
                    <p className="text-sm text-gray-500 mb-4">
                        Upload a local photo to test how it looks through this shader.
                        This happens entirely in your browser memory and will not be saved.
                    </p>

                    <input
                        type="file"
                        accept="image/*"
                        className="file-input file-input-bordered file-input-primary w-full"
                        onChange={handleImageUpload}
                    />

                    <div className="mt-auto">
                        <button className="btn btn-success w-full mt-4">Add to Library</button>
                    </div>
                </div>
            </div>
        </MainLayout>
    );
};

export default ShaderDetails;