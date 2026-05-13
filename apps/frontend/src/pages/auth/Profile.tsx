import { Link, useNavigate } from "react-router-dom";
import MainLayout from "../../layouts/MainLayout";
import { useAuthStore } from "../../store/authStore";

// placeholder for social service
const mockFriends = [
  {
    id: 1,
    name: "VoxelMaster",
    stats: "45 shaders • 67 reviews",
    avatar: "Voxel",
  },
  {
    id: 2,
    name: "WaveWeaver",
    stats: "28 shaders • 34 reviews",
    avatar: "Wave",
  },
  {
    id: 3,
    name: "RayWizard",
    stats: "89 shaders • 120 reviews",
    avatar: "Ray",
  },
  {
    id: 4,
    name: "RetroDev",
    stats: "15 shaders • 18 reviews",
    avatar: "Retro",
  },
  {
    id: 5,
    name: "AtmoCraft",
    stats: "33 shaders • 45 reviews",
    avatar: "Atmo",
  },
];

const Profile = () => {
  const { user, logout } = useAuthStore();
  const navigate = useNavigate();

  const displayName = user?.email?.split("@")[0] || "ShaderHunter";

  const formattedDate = user?.created_at
    ? new Date(user.created_at).toLocaleDateString("en-US", {
        month: "long",
        year: "numeric",
      })
    : null;

  const handleLogout = async () => {
    try {
      await logout();
      navigate("/login");
    } catch (err) {
      console.error("Failed to logout cleanly", err);
    }
  };

  return (
    <MainLayout>
      <div className="max-w-4xl mx-auto w-full flex flex-col gap-6 p-4">
        <div className="bg-shteam-comp border border-base-300 rounded-box p-8 flex items-center justify-between">
          <div className="flex items-center gap-6">
            <div className="avatar">
              <div className="w-24 rounded-full bg-base-300 ring ring-base-300 ring-offset-base-100 ring-offset-2">
                <img
                  src={`https://api.dicebear.com/9.x/bottts-neutral/svg?seed=${user?.email || "default"}`}
                  alt="Profile Avatar"
                />
              </div>
            </div>
            <div className="flex flex-col">
              <h2 className="text-3xl font-bold capitalize">{displayName}</h2>
              <p className="text-gray-400 mt-1">
                {user?.email || "hunter@example.com"}
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
              className="btn bg-[#88c0d0] hover:bg-[#81b7c6] text-[#1e1e2e] border-none w-32"
            >
              My Library
            </Link>
            <button
              onClick={handleLogout}
              className="btn btn-outline border-[#4c2a2a] text-[#d08787] hover:bg-[#4c2a2a] hover:text-white hover:border-[#4c2a2a] w-32"
            >
              Logout
            </button>
          </div>
        </div>

        <div className="grid grid-cols-4 gap-4">
          {[
            { label: "OWNED SHADERS", val: "12" },
            { label: "FRIENDS", val: "5" },
            { label: "REVIEWS", val: "24" },
            { label: "WISHLIST", val: "5" },
          ].map((stat, i) => (
            <div
              key={i}
              className="bg-shteam-comp border border-base-300 rounded-box p-6 flex flex-col items-center justify-center"
            >
              <span className="text-2xl font-bold">{stat.val}</span>
              <span className="text-xs text-gray-500 font-semibold tracking-wider mt-2">
                {stat.label}
              </span>
            </div>
          ))}
        </div>

        <div className="bg-shteam-comp border border-base-300 rounded-box p-6">
          <div className="flex justify-between items-center mb-4">
            <h3 className="text-xl font-bold">Friends</h3>
            <span className="text-sm text-gray-500">
              {mockFriends.length} total
            </span>
          </div>

          <div className="flex flex-col divide-y divide-base-300/50">
            {mockFriends.map((friend) => (
              <div
                key={friend.id}
                className="flex items-center justify-between py-4"
              >
                <div className="flex items-center gap-4">
                  <div className="avatar">
                    <div className="w-12 rounded-full bg-base-300">
                      <img
                        src={`https://api.dicebear.com/9.x/bottts-neutral/svg?seed=${friend.avatar}`}
                        alt={friend.name}
                      />
                    </div>
                  </div>
                  <div>
                    <p className="font-semibold text-gray-200">{friend.name}</p>
                    <p className="text-xs text-gray-500 mt-1">{friend.stats}</p>
                  </div>
                </div>
                <button className="btn btn-sm btn-outline border-base-300 text-gray-400 hover:bg-base-300">
                  Remove
                </button>
              </div>
            ))}
          </div>
        </div>
      </div>
    </MainLayout>
  );
};

export default Profile;
