import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { Canvas } from "@react-three/fiber";
import { ShaderMesh } from "../../webgl/ShaderMesh";
import MainLayout from "../../layouts/MainLayout";
import type { Shader } from "../../../../../packages/shared";


// 2. The Main Page Component
const ShaderDetails = () => {
    const { id } = useParams<{ id: string }>();
    const navigate = useNavigate();
    const [shader, setShader] = useState<Shader | null>(null);
    const [userTextureUrl, setUserTextureUrl] = useState<string | null>(null);

    const [dynamicSliders, setDynamicSliders] = useState<Record<string, number>>({});

    useEffect(() => {
        fetch(`http://localhost:3000/api/catalog/shaders/${id}`)
            .then((res) => res.json())
            .then((data: Shader) => {
                setShader(data);

                // 2. REGEX PARSER: Find all "uniform float something;"
                const regex = /uniform\s+float\s+([a-zA-Z0-9_]+);/g;
                const foundUniforms: Record<string, number> = {};
                let match;

                // Scan both Vertex and Fragment code for floats
                const combinedCode = data.fragmentShader + "\n" + data.vertexShader;

                while ((match = regex.exec(combinedCode)) !== null) {
                    const uniformName = match[1];
                    // Ignore our built-in uniforms
                    if (uniformName !== 'u_time') {
                        // Default all new sliders to 0.5
                        foundUniforms[uniformName] = 0.5;
                    }
                }
                setDynamicSliders(foundUniforms);
            })
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

    const handleSliderChange = (name: string, value: number) => {
        setDynamicSliders(prev => ({ ...prev, [name]: value }));
    };

    if (!shader) return <MainLayout><div className="loading loading-spinner mt-20"></div></MainLayout>;

    return (
        <MainLayout>
            <div className="w-full flex flex-col md:flex-row gap-6 h-[80vh]">
                <div className="flex-1 bg-black rounded-box overflow-hidden border border-gray-800 relative">
                    <Canvas camera={{ position: [0, 0, 5] }}>
                        <ShaderMesh
                            fragment={shader.fragmentShader}
                            vertex={shader.vertexShader}
                            textureUrl={userTextureUrl || shader.thumbnailUrl || "https://placehold.co/600x600/1a1a1a/ffffff?text=No+Image"}
                            customUniforms={dynamicSliders} // 4. Pass the sliders to WebGL!
                        />
                    </Canvas>
                </div>

                <div className="w-full md:w-96 flex flex-col gap-4 bg-shteam-comp p-6 rounded-box border border-gray-800 relative overflow-y-auto">
                    <button onClick={() => navigate("/catalog")} className="btn btn-sm btn-circle btn-ghost absolute right-4 top-4 text-gray-400 hover:text-white">✕</button>
                    <h1 className="text-3xl font-bold pr-8">{shader.title}</h1>
                    <span className="badge badge-primary">{shader.price === 0 ? "Free" : `$${shader.price}`}</span>
                    <p className="text-gray-400">{shader.description}</p>

                    <div className="divider">Controls</div>

                    {/* 5. DYNAMICALLY GENERATE SLIDERS */}
                    {Object.keys(dynamicSliders).length === 0 ? (
                        <p className="text-sm text-gray-500 italic">No custom parameters detected in this shader.</p>
                    ) : (
                        <div className="flex flex-col gap-4 bg-base-300 p-4 rounded-lg">
                            {Object.entries(dynamicSliders).map(([name, value]) => (
                                <div key={name} className="flex flex-col gap-1">
                                    <div className="flex justify-between text-sm">
                                        <label className="font-mono text-secondary">{name}</label>
                                        <span className="text-gray-400">{value.toFixed(2)}</span>
                                    </div>
                                    <input
                                        type="range"
                                        min="0"
                                        max="1"
                                        step="0.01"
                                        value={value}
                                        className="range range-xs range-secondary"
                                        onChange={(e) => handleSliderChange(name, parseFloat(e.target.value))}
                                    />
                                </div>
                            ))}
                        </div>
                    )}

                    <div className="divider"></div>

                    <h3 className="text-lg font-semibold mb-2">Test Your Image</h3>
                    <input type="file" accept="image/*" className="file-input file-input-bordered file-input-primary w-full" onChange={handleImageUpload} />

                    <div className="mt-auto pt-4">
                        <button className="btn btn-success w-full" onClick={() => navigate(`/checkout/${id}`)}>Checkout</button>
                    </div>
                </div>
            </div>
        </MainLayout>
    );
};

export default ShaderDetails;