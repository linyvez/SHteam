import { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import MainLayout from "../../layouts/MainLayout";
import { useAuthStore } from "../../store/authStore";

const Profile = () => {
  const { user, logout, topUpBalance, bankCredits, setBankCredits } =
    useAuthStore();
  const navigate = useNavigate();

  const [isToppingUp, setIsToppingUp] = useState(false);

  const [ownedCount, setOwnedCount] = useState(0);
  const [friends, setFriends] = useState<string[]>([]);

  const displayName = user?.email?.split("@")[0] || "ShaderHunter";

  const formattedDate = user?.created_at
    ? new Date(user.created_at).toLocaleDateString("en-US", {
        month: "long",
        year: "numeric",
      })
    : null;

  useEffect(() => {
    if (!user) return;

    fetch(`/api/orders/history?userId=${user.id}`)
      .then((res) => res.json())
      .then((data) => {
        setOwnedCount(data.user_orders?.length || 0);
      })
      .catch((err) => console.error("Failed to fetch order history:", err));

    fetch(`/api/social/friends?userId=${user.id}`)
      .then((res) => res.json())
      .then((data) => {
        if (Array.isArray(data)) setFriends(data);
      })
      .catch((err) => console.error("Failed to fetch friends:", err));
  }, [user]);

  const handleLogout = async () => {
    try {
      await logout();
      navigate("/login");
    } catch (err) {
      console.error("Failed to logout cleanly", err);
    }
  };

  const handleTopUp = async () => {
    if (bankCredits < 50) return;
    setIsToppingUp(true);
    try {
      await topUpBalance(50); // Add $50 to account
      setBankCredits((prev) => prev - 50); // Deduct from the virtual bank
    } catch (err) {
      console.error("Top up failed", err);
    } finally {
      setIsToppingUp(false);
    }
  };

  return (
    <MainLayout>
      <div className="max-w-4xl mx-auto w-full flex flex-col gap-6 p-4">
        {/* Header Section */}
        <div className="bg-shteam-comp border border-base-300 rounded-box p-8 flex items-center justify-between">
          <div className="flex items-center gap-6">
            <div className="avatar">
              <div className="w-24 rounded-full bg-base-300 ring ring-base-300 ring-offset-base-100 ring-offset-2">
                <img
                  src={`https://api.dicebear.com/9.x/bottts-neutral/svg?seed=${user?.id || "default"}`}
                  alt="Profile Avatar"
                />
              </div>
            </div>
            <div className="flex flex-col">
              <h2 className="text-3xl font-bold capitalize">{displayName}</h2>
              <p className="text-gray-400 mt-1">
                {user?.email || "hunter@example.com"}
              </p>
              <p className="text-xs font-mono text-gray-500 mt-1">
                ID: {user?.id}
              </p>
              {formattedDate && (
                <p className="text-xs text-gray-500 mt-2">
                  Member since {formattedDate}
                </p>
              )}
            </div>
          </div>

          <div className="flex flex-col gap-3">
            <Link
              to="/library"
              className="btn bg-[#88c0d0] hover:bg-[#81b7c6] text-[#1e1e2e] border-none w-36"
            >
              My Library
            </Link>
            <button
              onClick={handleLogout}
              className="btn btn-outline border-[#4c2a2a] text-[#d08787] hover:bg-[#4c2a2a] hover:text-white hover:border-[#4c2a2a] w-36"
            >
              Logout
            </button>
          </div>
        </div>

        {/* Wallet Section */}
        <div className="bg-shteam-comp border border-base-300 rounded-box p-6 flex items-center justify-between shadow-lg">
          <div>
            <h3 className="text-xl font-bold text-gray-200">Wallet Balance</h3>
            <p className="text-4xl font-mono text-green-400 mt-2">
              ${(Number(user?.balance) || 0).toFixed(2)}
            </p>
          </div>

          <div className="flex flex-col items-end gap-2">
            <p className="text-sm text-gray-500">
              External Bank:{" "}
              <span className="font-mono text-gray-400">
                ${bankCredits.toFixed(2)}
              </span>
            </p>
            <button
              onClick={handleTopUp}
              disabled={isToppingUp || bankCredits < 50}
              className="btn btn-primary"
            >
              {isToppingUp ? (
                <span className="loading loading-spinner"></span>
              ) : (
                "+ Add $50.00"
              )}
            </button>
          </div>
        </div>

        {/* Dynamic Stats Grid */}
        <div className="grid grid-cols-4 gap-4">
          {[
            { label: "OWNED SHADERS", val: ownedCount.toString() },
            { label: "FRIENDS", val: friends.length.toString() },
            { label: "REVIEWS", val: "TBD" }, // Placeholder for future feature
            { label: "WISHLIST", val: "TBD" }, // Placeholder for future feature
          ].map((stat, i) => (
            <div
              key={i}
              className="bg-shteam-comp border border-base-300 rounded-box p-6 flex flex-col items-center justify-center"
            >
              <span
                className={`text-2xl font-bold ${stat.val === "TBD" ? "text-gray-600" : "text-white"}`}
              >
                {stat.val}
              </span>
              <span className="text-xs text-gray-500 font-semibold tracking-wider mt-2 text-center">
                {stat.label}
              </span>
            </div>
          ))}
        </div>

        {/* Friends Section */}
        <div className="bg-shteam-comp border border-base-300 rounded-box p-6">
          <div className="flex justify-between items-center mb-6">
            <div>
              <h3 className="text-xl font-bold">Friends</h3>
              <span className="text-sm text-gray-500">
                {friends.length} total
              </span>
            </div>

            {/* THIS BUTTON LINKS TO DEVELOPER 4'S COMPONENT! */}
            <Link
              to="/friends"
              className="btn btn-sm bg-[#5f859d] hover:bg-[#4a6b82] text-white border-none"
            >
              + Manage Friends
            </Link>
          </div>

          <div className="flex flex-col divide-y divide-base-300/50">
            {friends.length === 0 ? (
              <p className="text-center text-gray-500 py-8">
                You haven't added any friends yet. Click 'Manage Friends' to
                search for users!
              </p>
            ) : (
              friends.map((friendId) => {
                const nickname = friendId.split("-")[0];
                return (
                  <div
                    key={friendId}
                    className="flex items-center justify-between py-4"
                  >
                    <div className="flex items-center gap-4">
                      <div className="avatar">
                        <div className="w-12 rounded-full bg-base-300">
                          <img
                            src={`https://api.dicebear.com/9.x/bottts-neutral/svg?seed=${friendId}`}
                            alt={nickname}
                          />
                        </div>
                      </div>
                      <div>
                        <p className="font-bold text-gray-200 capitalize">
                          {nickname}
                        </p>
                        <p className="text-xs text-gray-500 mt-1">
                          ID: {friendId}
                        </p>
                      </div>
                    </div>
                  </div>
                );
              })
            )}
          </div>
        </div>
      </div>
    </MainLayout>
  );
};

export default Profile;
