import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import MainLayout from "../../layouts/MainLayout";
import type { Shader } from "../../../../../packages/shared";
import { useAuthStore } from "../../store/authStore";

const Checkout = () => {
    const { shaderId } = useParams<{ shaderId: string }>();
    const [shader, setShader] = useState<Shader | null>(null);
    const navigate = useNavigate();

    const { user } = useAuthStore();

    useEffect(() => {
        fetch(`/api/catalog/shaders/${shaderId}`)
            .then((res) => res.json())
            .then((data: Shader) => {
                setShader(data);

            })
            .catch((err) => console.error(err));
    }, [shaderId]);


    if (!shader || !user) return <MainLayout><div className="loading loading-spinner mt-20"></div></MainLayout>;

    const isFree = shader.price === 0;
    const platformFee = isFree ? 0 : 0.50;
    const totalPrice = isFree ? 0 : Number(shader.price) + platformFee;

    const canAfford = (Number(user.balance) || 0) >= totalPrice;


    return (
        <MainLayout>
            <div className="w-full max-w-3xl mx-auto bg-shteam-comp rounded-xl shadow-2xl border border-gray-800 p-8 mt-10 flex flex-col md:flex-row gap-8">
                <div className="flex-1 flex flex-col items-center gap-4">
                    <img
                        src={shader.thumbnailUrl || "https://placehold.co/400x400/1a1a1a/444444?text=No+Preview"}
                        alt={shader.title}
                        className="w-64 h-64 object-cover rounded-lg border border-base-300 shadow-md mb-4"
                    />
                    <h2 className="text-2xl font-bold text-center mb-2">{shader.title}</h2>
                    <span className="badge badge-primary text-lg px-4 py-2 mb-2">
                        {shader.price === 0 ? "FREE" : `$${shader.price}`}
                    </span>
                    <p className="text-gray-400 text-center mb-2">{shader.description || "No description provided."}</p>
                </div>

                <div className="flex-1 flex flex-col gap-6 justify-between">
                    <div>
                        <h3 className="text-xl font-semibold mb-4">Billing Information</h3>
                        <div className="bg-base-300 rounded-lg p-4 flex flex-col gap-3 border border-base-200">
                            <div className="flex justify-between">
                                <span className="font-medium">Item</span>
                                <span>{shader.title}</span>
                            </div>
                            <div className="flex justify-between">
                                <span className="font-medium">Price</span>
                                <span>{shader.price === 0 ? "FREE" : `$${shader.price}`}</span>
                            </div>
                            <div className="flex justify-between">
                                <span className="font-medium">Platform Fee</span>
                                <span>{shader.price === 0 ? "$0.00" : "$0.50"}</span>
                            </div>
                            <div className="flex justify-between border-t border-base-200 pt-2 mt-2 text-lg font-bold">
                                <span>Total</span>
                                <span>
                                    {shader.price === 0 ? "$0.00" : `$${totalPrice.toFixed(2)}`}
                                </span>
                            </div>
                        </div>
                        <div className="mt-6 flex flex-col gap-2">
                            <div className="flex justify-between items-center text-sm">
                                <span className="text-gray-400">Current Wallet Balance:</span>
                                <span className={`font-mono font-bold ${canAfford ? 'text-green-400' : 'text-red-400'}`}>
                                    ${(Number(user.balance) || 0).toFixed(2)}
                                </span>
                            </div>

                            {!canAfford && (
                                <div className="alert alert-error mt-2 shadow-sm rounded-lg p-3">
                                    <span className="text-sm font-semibold">Insufficient funds. Please top up your wallet in your profile.</span>
                                </div>
                            )}
                        </div>
                    </div>
                    <button
                        className="btn btn-success btn-lg w-full mt-6 shadow-lg"
                        disabled={!canAfford}
                        onClick={async () => {
                            await fetch('/api/orders/purchase', {
                                method: 'POST',
                                headers: { 'Content-Type': 'application/json' },
                                body: JSON.stringify({ shaderId, userId: user.id, price: totalPrice }),
                            })
                            navigate('/library');
                        }}
                    >
                        {canAfford ? "Confirm Purchase" : "Cannot Afford"}
                    </button>
                </div>
            </div>
        </MainLayout>
    );
};

export default Checkout;