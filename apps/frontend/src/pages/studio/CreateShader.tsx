import { useState } from "react";
import { useNavigate } from "react-router-dom";
import MainLayout from "../../layouts/MainLayout";
import { useAuthStore } from "../../store/authStore";

const CreateShader = () => {
  const navigate = useNavigate();
  const { user, token } = useAuthStore();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState("");

  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [price, setPrice] = useState<number>(0);
  const [thumbnail, setThumbnail] = useState<File | null>(null);

  const [vertexShader, setVertexShader] = useState(
    "void main() {\n  gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);\n}",
  );
  const [fragmentShader, setFragmentShader] = useState(
    "void main() {\n  gl_FragColor = vec4(1.0, 0.0, 0.0, 1.0);\n}",
  );

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");

    if (!thumbnail) {
      setError("Please upload a thumbnail image for your shader.");
      return;
    }

    if (!user) {
      setError("You must be logged in to publish.");
      return;
    }

    setIsSubmitting(true);

    try {
      const formData = new FormData();
      formData.append("title", title);
      formData.append("description", description);
      formData.append("price", price.toString());
      formData.append("vertexShader", vertexShader);
      formData.append("fragmentShader", fragmentShader);

      formData.append("thumbnail", thumbnail);

      formData.append("authorId", user.id);

      const response = await fetch("/api/catalog/shaders", {
        method: "POST",
        headers: {
          Authorization: `Bearer ${token}`
        },
        body: formData,
      });

      if (!response.ok) {
        throw new Error("Failed to publish shader");
      }

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

          <fieldset className="fieldset">
            <label className="label font-bold text-secondary">
              Vertex Shader
            </label>
            <textarea
              className="textarea bg-base-300 w-full h-48 font-mono text-sm"
              value={vertexShader}
              onChange={(e) => setVertexShader(e.target.value)}
              required
            />
          </fieldset>

          <fieldset className="fieldset">
            <label className="label font-bold text-accent">
              Fragment Shader
            </label>
            <textarea
              className="textarea bg-base-300 w-full h-64 font-mono text-sm"
              value={fragmentShader}
              onChange={(e) => setFragmentShader(e.target.value)}
              required
            />
          </fieldset>

          <div className="flex justify-end mt-4">
            <button
              type="submit"
              className="btn btn-primary px-8"
              disabled={isSubmitting}
            >
              {isSubmitting ? (
                <span className="loading loading-spinner"></span>
              ) : (
                "Publish Shader"
              )}
            </button>
          </div>
        </form>
      </div>
    </MainLayout>
  );
};

export default CreateShader;
