
import { useState, useEffect } from "react";
import type { Shader } from "../../../../../packages/shared";
import MainLayout from "../../layouts/MainLayout";
import { useAuthStore } from "../../store/authStore";
import { useSearchStore } from "../../store/searchStore";
import LibraryShaderModal from "./LibraryShaderModal";


const Library = () => {
  const { user } = useAuthStore();
  const searchQuery = useSearchStore((state) => state.searchQuery);
  const [shaders, setShaders] = useState<Shader[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [selectedShaderId, setSelectedShaderId] = useState<string | null>(null);
  const [showModal, setShowModal] = useState(false);

  useEffect(() => {
    if (!user) return;

    const fetchOrders = async () => {
      try {
        const response = await fetch(`/api/orders/history?userId=${user.id}`);
        if (!response.ok) throw new Error("Error: Library temporarily unavailible. Please try again later...");
        const data = await response.json();
        return data["user_orders"];
      } catch (err: any) {
        setError(err.message);
        return null;
      }
    };
    const fetchShaders = async () => {
      try {
        const orders = await fetchOrders();
        if (!orders) {
          setLoading(false);
          return;
        }

        const shaderPromises = orders.map(async (order: any) => {
          const response = await fetch(
            `/api/catalog/shaders/${order.shader_id}`,
          );
          return await response.json();
        });

        const fetchedShaders = await Promise.all(shaderPromises);

        setShaders(fetchedShaders);
      } catch (err: any) {
        setError("Error while fetching one of the shaders: " + err);
      } finally {
        setLoading(false);
      }
    };

    fetchShaders();
  }, [user]);

  const filteredShaders = shaders.filter(
    (shader) =>
      shader.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      (shader.description &&
        shader.description.toLowerCase().includes(searchQuery.toLowerCase())),
  );

  return (
    <MainLayout>
      <div className="w-full max-w-6xl flex flex-col gap-6">
        <h1 className="text-3xl font-bold">Library</h1>

        {loading && (
          <span className="loading loading-spinner loading-lg mx-auto mt-10"></span>
        )}

        {error && (
          <div className="alert alert-error">
            <span>{error}</span>
          </div>
        )}

        {!loading && !error && filteredShaders.length === 0 && (
          <p className="text-gray-400">
            {searchQuery
              ? `No owned shaders match "${searchQuery}".`
              : "No shaders found. Want to get new shaders in the library?"}
          </p>
        )}

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredShaders.map((shader) => (
            <div
              key={shader._id}
              className="card bg-shteam-comp shadow-xl border border-gray-800 hover:border-[#5f859d] transition-colors overflow-hidden"
            >
              <figure className="h-48 bg-base-300 overflow-hidden border-b border-base-300">
                <img
                  src={
                    shader.thumbnailUrl ||
                    "https://placehold.co/600x400/1a1a1a/444444?text=No+Preview"
                  }
                  alt={shader.title}
                  className="w-full h-full object-cover transition-transform hover:scale-105"
                />
              </figure>

              <div className="card-body p-4 ">
                <h2 className="card-title text-lg">{shader.title}</h2>
                <p className="text-sm text-gray-400 line-clamp-2">
                  {shader.description || "No description provided."}
                </p>
                <div className="card-actions justify-between items-center mt-4">
                  <span className="font-mono text-green-400 font-bold">
                    Owned
                  </span>
                  <button
                    className="btn btn-sm border-none bg-[#5f859d] hover:bg-[#4a6b82] text-whit"
                    onClick={() => {
                      setSelectedShaderId(shader._id);
                      setShowModal(true);
                    }}
                  >
                    View Details
                  </button>
                </div>
                {showModal && selectedShaderId && (
                  (() => {
                    const shader = shaders.find(s => s._id === selectedShaderId);
                    if (!shader) return null;
                    return (
                      <LibraryShaderModal shader={shader} onClose={() => setShowModal(false)} />
                    );
                  })()
                )}
              </div>
            </div>
          ))}
        </div>
      </div>
    </MainLayout>
  );
};

export default Library;
