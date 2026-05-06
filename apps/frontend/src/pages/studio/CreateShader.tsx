import { useState } from "react";
import { useNavigate } from "react-router-dom";
import MainLayout from "../../layouts/MainLayout";

const CreateShader = () => {
    const navigate = useNavigate();
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [error, setError] = useState("");

    // Form State
    const [title, setTitle] = useState("");
    const [description, setDescription] = useState("");
    const [price, setPrice] = useState<number>(0);
    const [thumbnail, setThumbnail] = useState<File | null>(null);

    // Default boilerplate GLSL to help the user get started
    const [vertexShader, setVertexShader] = useState(
        "void main() {\n  gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);\n}"
    );
    const [fragmentShader, setFragmentShader] = useState(
        "void main() {\n  gl_FragColor = vec4(1.0, 0.0, 0.0, 1.0);\n}"
    );

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setError("");

        if (!thumbnail) {
            setError("Please upload a thumbnail image for your shader.");
            return;
        }

        setIsSubmitting(true);

        try {
            // 1. We MUST use FormData when sending files!
            const formData = new FormData();
            formData.append("title", title);
            formData.append("description", description);
            formData.append("price", price.toString());
            formData.append("vertexShader", vertexShader);
            formData.append("fragmentShader", fragmentShader);

            // The first argument MUST match the name in FileInterceptor('thumbnail')
            formData.append("thumbnail", thumbnail);

            // Temporary Hack: Since Identity Service isn't hooked up yet, 
            // we hardcode an authorId to satisfy the MongoDB schema.
            formData.append("authorId", "temp_user_123");

            // 2. Send to NestJS
            const response = await fetch("http://localhost:3000/api/catalog/shaders", {
                method: "POST",
                // CRITICAL: Do NOT set "Content-Type" manually here! 
                // The browser automatically sets it to multipart/form-data with the correct boundary when it sees FormData.
                body: formData,
            });

            if (!response.ok) {
                throw new Error("Failed to publish shader");
            }

            // 3. Success! Redirect the user back to the catalog to see their new shader
            navigate("/catalog");

        } catch (err: any) {
            setError(err.message);
        } finally {
            setIsSubmitting(false);
        }
    };

    return (
        <MainLayout>
            <div className="max-w-4xl w-full mx-auto bg-shteam-comp p-8 rounded-box border border-gray-800 shadow-xl">
                <h1 className="text-3xl font-bold mb-6">Publish New Shader</h1>

                {error && (
                    <div className="alert alert-error mb-6">
                        <span>{error}</span>
                    </div>
                )}

                <form onSubmit={handleSubmit} className="flex flex-col gap-6">
                    {/* --- Basic Info --- */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <fieldset className="fieldset">
                            <label className="label font-bold">Shader Title</label>
                            <input
                                type="text"
                                className="input bg-base-300 w-full"
                                placeholder="e.g., Neon Grid Glow"
                                value={title}
                                onChange={(e) => setTitle(e.target.value)}
                                required
                            />
                        </fieldset>

                        <fieldset className="fieldset">
                            <label className="label font-bold">Price ($)</label>
                            <input
                                type="number"
                                min="0"
                                step="0.01"
                                className="input bg-base-300 w-full"
                                value={price}
                                onChange={(e) => setPrice(parseFloat(e.target.value))}
                            />
                        </fieldset>
                    </div>

                    <fieldset className="fieldset">
                        <label className="label font-bold">Description</label>
                        <textarea
                            className="textarea bg-base-300 w-full h-24"
                            placeholder="Describe what your shader does..."
                            value={description}
                            onChange={(e) => setDescription(e.target.value)}
                        />
                    </fieldset>

                    {/* --- File Upload --- */}
                    <fieldset className="fieldset">
                        <label className="label font-bold">Preview Thumbnail</label>
                        <input
                            type="file"
                            accept="image/*"
                            className="file-input file-input-bordered file-input-primary w-full bg-base-300"
                            onChange={(e) => setThumbnail(e.target.files?.[0] || null)}
                            required
                        />
                    </fieldset>

                    <div className="divider">GLSL Code</div>

                    {/* --- Shader Code Editors --- */}
                    {/* Note: Using standard textareas for now. Later, you should swap these for @monaco-editor/react! */}
                    <fieldset className="fieldset">
                        <label className="label font-bold text-secondary">Vertex Shader</label>
                        <textarea
                            className="textarea bg-base-300 w-full h-48 font-mono text-sm"
                            value={vertexShader}
                            onChange={(e) => setVertexShader(e.target.value)}
                            required
                        />
                    </fieldset>

                    <fieldset className="fieldset">
                        <label className="label font-bold text-accent">Fragment Shader</label>
                        <textarea
                            className="textarea bg-base-300 w-full h-64 font-mono text-sm"
                            value={fragmentShader}
                            onChange={(e) => setFragmentShader(e.target.value)}
                            required
                        />
                    </fieldset>

                    {/* --- Submit --- */}
                    <div className="flex justify-end mt-4">
                        <button
                            type="submit"
                            className="btn btn-primary px-8"
                            disabled={isSubmitting}
                        >
                            {isSubmitting ? <span className="loading loading-spinner"></span> : "Publish Shader"}
                        </button>
                    </div>
                </form>
            </div>
        </MainLayout>
    );
};

export default CreateShader;