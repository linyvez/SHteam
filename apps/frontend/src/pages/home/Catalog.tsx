import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import MainLayout from "../../layouts/MainLayout";
import type { Shader } from "../../../../../packages/shared";
import { useSearchStore } from "../../store/searchStore";
import { Recommendations } from "../social/Recommendations";

const Catalog = () => {
  const [shaders, setShaders] = useState<Shader[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  // Search States
  const searchQuery = useSearchStore((state) => state.searchQuery);
  const [debouncedSearch, setDebouncedSearch] = useState("");

  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedSearch(searchQuery);
    }, 500);
    return () => clearTimeout(timer);
  }, [searchQuery]);
  const currentUserId = "ira123"; // hardcoded user id, change later

  useEffect(() => {
    const fetchShaders = async () => {
      setLoading(true);
      try {
        const url = `/api/catalog/shaders?page=1&limit=20${debouncedSearch ? `&search=${encodeURIComponent(debouncedSearch)}` : ""}`;
        const response = await fetch(url);
        if (!response.ok) throw new Error("Failed to fetch shaders");
        const data = await response.json();
        setShaders(data);
      } catch (err: any) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchShaders();
  }, [debouncedSearch]);

  return (
    <MainLayout>
      <div className="w-full max-w-6xl flex flex-col gap-6">
        <h1 className="text-3xl font-bold">Shader Catalog</h1>

        <Recommendations userId={currentUserId} />

        {loading && <span className="loading loading-spinner loading-lg mx-auto mt-10"></span>}

        {error && (
          <div className="alert alert-error">
            <span>{error}</span>
          </div>
        )}

        {!loading && !error && shaders.length === 0 && (
          <p className="text-gray-400">
            No shaders found. Be the first to upload one!
          </p>
        )}

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {shaders.map((shader) => (
            <div 
              key={shader._id} 
              className="card bg-shteam-comp shadow-xl border border-gray-800 rounded-2xl hover:border-[#5f859d] transition-colors overflow-hidden"
            >
              <figure className="h-48 bg-base-300 border-b border-gray-800 relative">
                <img
                  src={
                    shader.thumbnailUrl ||
                    "https://placehold.co/600x400/1a1a1a/444444?text=No+Preview"
                  }
                  alt={shader.title}
                  className="w-full h-full object-cover transition-transform hover:scale-105"
                />
              </figure>

              <div className="card-body p-5">
                <h2 className="card-title text-lg truncate">{shader.title}</h2>
                <p className="text-sm text-gray-400 line-clamp-2 h-10">
                  {shader.description || "No description provided."}
                </p>
                <div className="card-actions justify-between items-center mt-4 pt-4 border-t border-gray-800">
                  <span className="font-mono text-green-400 font-bold">
                    {shader.price === 0 ? "FREE" : `$${shader.price}`}
                  </span>
                  <Link 
                    to={`/shader/${shader._id}`} 
                    className="btn btn-sm border-none bg-[#5f859d] hover:bg-[#4a6b82] text-white"
                  >
                    View Details
                  </Link>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </MainLayout>
  );
};

export default Catalog;