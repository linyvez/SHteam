import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import type { Shader } from "../../../../../packages/shared";
import MainLayout from "../../layouts/MainLayout";
import { useAuthStore } from "../../store/authStore";

interface Order {
    shader_id: string;
}

const Library = () => {
    const { user } = useAuthStore();
    // const [orders, setOrders] = useState<Order[]>([])
    const [shaders, setShaders] = useState<Shader[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");

    useEffect(() => {
        if (!user) return;

        const fetchOrders = async () => {
            try {
                const response = await fetch(`/api/orders/history?userId=${user.id}`);
                if (!response.ok) throw new Error("Failed to fetch user's orders");
                const data = await response.json();
                console.log(data)
                // setOrders(data['user_orders']);
                return data['user_orders'];
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

                for (const order of orders) {

                    const response = await fetch(`/api/catalog/shaders/${order.shader_id}`)
                    const shader = await response.json();

                    setShaders(prev => [...prev, shader]);
                }
            } catch (err: any) {
                setError('Error while fetching one of the shaders: ' + err);
            } finally {
                setLoading(false);
            }
        }

        fetchShaders();
    }, [user]);

    return (
        <MainLayout>
            <div className="w-full max-w-6xl flex flex-col gap-6">
                <h1 className="text-3xl font-bold">Library</h1>

                {loading && <span className="loading loading-spinner loading-lg mx-auto mt-10"></span>}

                {error && (
                    <div className="alert alert-error">
                        <span>{error}</span>
                    </div>
                )}

                {!loading && !error && shaders.length === 0 && (
                    <p className="text-gray-400">No shaders found. Want to get new shaders in the library?</p>
                )}

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {shaders.map((shader) => (
                        <div key={shader._id} className="card bg-shteam-comp shadow-xl border border-gray-800">
                            {/* Placeholder for the Three.js thumbnail later */}
                            <figure className="h-48 bg-base-300 overflow-hidden border-b border-base-300">
                                <img
                                    src={shader.thumbnailUrl || "https://placehold.co/600x400/1a1a1a/444444?text=No+Preview"}
                                    alt={shader.title}
                                    className="w-full h-full object-cover transition-transform hover:scale-105"
                                />
                            </figure>

                            <div className="card-body p-4">
                                <h2 className="card-title text-lg">{shader.title}</h2>
                                <p className="text-sm text-gray-400 line-clamp-2">
                                    {shader.description || "No description provided."}
                                </p>
                                <div className="card-actions justify-between items-center mt-4">
                                    <span className="font-mono text-green-400 font-bold">
                                        {shader.price === 0 ? "FREE" : `$${shader.price}`}
                                    </span>
                                    <Link to={`/shader/${shader._id}`} className="btn btn-sm btn-primary">
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

export default Library;