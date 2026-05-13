import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { Canvas } from "@react-three/fiber";
import { ShaderMesh } from "../../webgl/ShaderMesh";
import MainLayout from "../../layouts/MainLayout";
import type { Shader } from "../../../../../packages/shared";
import { useAuthStore } from "../../store/authStore";

const ShaderDetails = () => {
    const { id } = useParams<{ id: string }>();
    const navigate = useNavigate();
    const { user } = useAuthStore();

    const [shader, setShader] = useState<Shader | null>(null);
    const [userTextureUrl, setUserTextureUrl] = useState<string | null>(null);
    const [dynamicSliders, setDynamicSliders] = useState<Record<string, number>>(
        {},
    );

    const [isOwned, setIsOwned] = useState<boolean>(false);
    const [isCheckingOwnership, setIsCheckingOwnership] = useState<boolean>(true);

    useEffect(() => {
        if (!id) return;

        fetch(`/api/catalog/shaders/${id}`)
            .then((res) => res.json())
            .then((data: Shader) => {
                setShader(data);

                const regex = /uniform\s+float\s+([a-zA-Z0-9_]+);/g;
                const foundUniforms: Record<string, number> = {};
                let match;

                const combinedCode = data.fragmentShader + "\n" + data.vertexShader;

                while ((match = regex.exec(combinedCode)) !== null) {
                    const uniformName = match[1];
                    if (uniformName !== "u_time") {
                        foundUniforms[uniformName] = 0.5;
                    }
                }
                setDynamicSliders(foundUniforms);
            })
            .catch((err) => console.error(err));
    }, [id]);


    useEffect(() => {
        if (!user || !id) return;

        fetch(`/api/orders/history?userId=${user.id}`)
            .then((res) => res.json())
            .then((data) => {
                const orders = data.user_orders || [];
                setIsOwned(orders.some((order: any) => order.shader_id === id));
            })
            .catch((err) => console.error("Failed to verify ownership:", err))
            .finally(() => setIsCheckingOwnership(false));

    }, [id, user]);

    const handleImageUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
        const file = event.target.files?.[0];
        if (file) {
            const objectUrl = URL.createObjectURL(file);
            setUserTextureUrl(objectUrl);
        }
    };

    const handleSliderChange = (name: string, value: number) => {
        setDynamicSliders((prev) => ({ ...prev, [name]: value }));
    };

    if (!shader || !user)
        return (
            <MainLayout>
                <div className="loading loading-spinner mt-20"></div>
            </MainLayout>
        );

    return (
        <MainLayout>
            <div className="w-full flex flex-col md:flex-row gap-6 h-[80vh]">
                <div className="flex-1 bg-black rounded-box overflow-hidden border border-gray-800 relative">
                    <Canvas camera={{ position: [0, 0, 5] }}>
                        <ShaderMesh
                            fragment={shader.fragmentShader}
                            vertex={shader.vertexShader}
                            textureUrl={
                                userTextureUrl ||
                                shader.thumbnailUrl ||
                                "https://placehold.co/600x600/1a1a1a/ffffff?text=No+Image"
                            }
                            customUniforms={dynamicSliders}
                        />
                    </Canvas>
                </div>

                <div className="w-full md:w-96 flex flex-col gap-4 bg-shteam-comp p-6 rounded-box border border-gray-800 relative overflow-y-auto">
                    <button
                        onClick={() => navigate("/catalog")}
                        className="btn btn-sm btn-circle btn-ghost absolute right-4 top-4 text-gray-400 hover:text-white"
                    >
                        ✕
                    </button>
                    <h1 className="text-3xl font-bold pr-8">{shader.title}</h1>
                    <span className="badge badge-primary">
                        {shader.price === 0 ? "Free" : `$${shader.price}`}
                    </span>
                    <p className="text-gray-400">{shader.description}</p>

                    <div className="divider">Controls</div>

                    {Object.keys(dynamicSliders).length === 0 ? (
                        <p className="text-sm text-gray-500 italic">
                            No custom parameters detected in this shader.
                        </p>
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
                                        value={Number(value) || 0}
                                        className="range range-xs range-secondary"
                                        onChange={(e) =>
                                            handleSliderChange(name, parseFloat(e.target.value))
                                        }
                                    />
                                </div>
                            ))}
                        </div>
                    )}

                    <div className="divider"></div>

                    <h3 className="text-lg font-semibold mb-2">Test Your Image</h3>
                    <input
                        type="file"
                        accept="image/*"
                        className="file-input file-input-bordered file-input-primary w-full"
                        onChange={handleImageUpload}
                    />

                    <div className="mt-auto pt-4">
                        {isCheckingOwnership ? (
                            <button className="btn btn-neutral w-full" disabled>
                                <span className="loading loading-spinner"></span> Checking status...
                            </button>
                        ) : isOwned ? (
                            <button
                                className="btn btn-secondary w-full"
                                onClick={() => navigate('/library')}
                            >
                                Already in Library
                            </button>
                        ) : (
                            <button
                                className="btn btn-success w-full"
                                onClick={() => navigate(`/checkout/${id}`)}
                            >
                                Add to Library
                            </button>
                        )}
                    </div>
                </div>
            </div>
        </MainLayout>
    );
};

export default ShaderDetails;
