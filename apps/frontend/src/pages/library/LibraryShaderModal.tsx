import type { Shader } from "../../../../../packages/shared";

interface LibraryShaderModalProps {
  shader: Shader;
  onClose: () => void;
}

const LibraryShaderModal = ({ shader, onClose }: LibraryShaderModalProps) => {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-60">
      <div className="w-full max-w-6xl h-[80vh] flex flex-col md:flex-row bg-shteam-comp rounded-box border border-gray-800 shadow-lg relative animate-fade-in p-0 overflow-hidden">
        <div className="flex-1 bg-black flex items-center justify-center border-r border-gray-800 min-h-75">
          <img
            src={shader.thumbnailUrl || "https://placehold.co/600x600/1a1a1a/ffffff?text=No+Image"}
            alt={shader.title}
            className="object-cover w-full h-full max-h-150"
          />
        </div>
        <div className="w-full md:w-105 flex flex-col gap-4 p-6 relative overflow-y-auto bg-shteam-comp">
          <button
            onClick={onClose}
            className="btn btn-sm btn-circle btn-ghost absolute right-4 top-4 text-gray-400 hover:text-white"
            aria-label="Close"
          >✕</button>
          <h1 className="text-3xl font-bold pr-8">{shader.title}</h1>
          <p className="text-gray-400 mb-2">{shader.description || "No description provided."}</p>
          <span className="text-xs text-gray-500 mb-2">by {shader.authorId}</span>
          <div className="divider before:bg-gray-800 after:bg-gray-800 text-gray-500">Shader Code</div>
          <div className="my-2">
            <p className="text-gray-400 mb-2">
              Thank you for purchasing this shader! The code for the shader can be found below:
            </p>
            <details >
              <summary className="cursor-pointer font-semibold text-blue-400">Vertex Shader</summary>
              <pre className="bg-base-200 rounded p-2 mt-2 text-xs overflow-x-auto whitespace-pre-wrap max-h-32">{shader.vertexShader}</pre>
            </details>
            <details className="mt-2">
              <summary className="cursor-pointer font-semibold text-purple-400">Fragment Shader</summary>
              <pre className="bg-base-200 rounded p-2 mt-2 text-xs overflow-x-auto whitespace-pre-wrap max-h-32">{shader.fragmentShader}</pre>
            </details>
          </div>
        </div>
      </div>
    </div>
  );
};

export default LibraryShaderModal;
