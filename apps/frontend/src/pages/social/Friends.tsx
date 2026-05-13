import React, { useState, useEffect, useRef } from 'react';
import MainLayout from '../../layouts/MainLayout';
import { useAuthStore } from "../../store/authStore";

export const Friends = () => {
  const { user } = useAuthStore();
  const [friendId, setFriendId] = useState('');
  const [status, setStatus] = useState<{ type: 'success' | 'error' | null; message: string }>({ type: null, message: '' });
  const [isLoading, setIsLoading] = useState(false);

  const [friends, setFriends] = useState<string[]>([]);
  const [isLoadingFriends, setIsLoadingFriends] = useState(true);

  const [suggestions, setSuggestions] = useState<string[]>([]);
  const [showSuggestions, setShowSuggestions] = useState(false);
  const searchTimeoutRef = useRef<NodeJS.Timeout | null>(null);

  const currentUserId = user?.id;

  const fetchFriends = async () => {
    if(!currentUserId) return;

    setIsLoadingFriends(true);
    try {
      const response = await fetch(`/api/social/friends?userId=${currentUserId}`);
      if (response.ok) {
        const data = await response.json();
        setFriends(data);
      }
    } catch (error) {
      console.error('Error fetching friends:', error);
    } finally {
      setIsLoadingFriends(false);
    }
  };

  useEffect(() => {
    fetchFriends();
  }, []);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setFriendId(value);
    setStatus({ type: null, message: '' });
    if (searchTimeoutRef.current) {
      clearTimeout(searchTimeoutRef.current);
    }

    if (value.trim().length > 0) {
      searchTimeoutRef.current = setTimeout(async () => {
        try {
          const res = await fetch(`/api/social/users/search?q=${value}`);
          if (res.ok) {
            const data: string[] = await res.json();
            const filtered = data.filter(id => id !== currentUserId && !friends.includes(id));
            setSuggestions(filtered);
            setShowSuggestions(true);
          }
        } catch (err) {
          console.error('Search failed', err);
        }
      }, 300);
    } else {
      setSuggestions([]);
      setShowSuggestions(false);
    }
  };

  const handleSelectSuggestion = (userId: string) => {
    setFriendId(userId);
    setShowSuggestions(false);
  };

  const handleAddFriend = async () => {
    if (!friendId.trim()) return;

    setIsLoading(true);
    setStatus({ type: null, message: '' });
    setShowSuggestions(false);

    try {
      const response = await fetch('/api/social/friends/add', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ userId: currentUserId, friendId })
      });

      if (response.ok) {
        setStatus({ type: 'success', message: 'Friend added successfully!' });
        setFriendId('');
        fetchFriends();
      } else {
        const errorData = await response.json().catch(() => null);
        setStatus({
          type: 'error',
          message: errorData?.message || 'Failed to add friend. User might not exist.'
        });
      }
    } catch (error) {
      console.error('Error adding friend:', error);
      setStatus({ type: 'error', message: 'Network error. Make sure the server is running.' });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <MainLayout>
      <div className="w-full max-w-3xl mx-auto flex flex-col gap-6">
        <h1 className="text-3xl font-bold">Social Network</h1>

        <div className="card bg-shteam-comp shadow-xl border border-gray-800 overflow-visible">
          <div className="card-body">
            <h2 className="card-title text-xl mb-2 flex items-center gap-2">
              Add a New Friend
            </h2>
            <p className="text-gray-400 text-sm mb-4">
              Search for your friend's ID to connect with them and see their favorite shaders.
            </p>

            <div className="flex flex-col sm:flex-row gap-4 relative">
              <div className="relative w-full">
                <input
                  type="text"
                  placeholder="Search user ID..."
                  value={friendId}
                  onChange={handleInputChange}
                  onFocus={() => friendId.trim() && setSuggestions([...suggestions])}
                  className="input input-bordered w-full bg-base-300 border-gray-700 focus:border-[#5f859d] focus:outline-none"
                  onKeyDown={(e) => e.key === 'Enter' && handleAddFriend()}
                />

                {showSuggestions && suggestions.length > 0 && (
                  <ul className="absolute top-full left-0 right-0 mt-2 bg-base-300 border border-gray-700 rounded-lg shadow-2xl z-50 overflow-hidden">
                    {suggestions.map((suggestId) => (
                      <li
                        key={suggestId}
                        onClick={() => handleSelectSuggestion(suggestId)}
                        className="px-4 py-3 hover:bg-[#5f859d] hover:text-white cursor-pointer transition-colors flex items-center gap-3"
                      >
                        <div className="avatar placeholder">
                          <div className="bg-base-100 text-gray-400 rounded-full w-8">
                            <span className="text-xs">{suggestId.substring(0, 2).toUpperCase()}</span>
                          </div>
                        </div>
                        <span className="font-medium">{suggestId}</span>
                      </li>
                    ))}
                  </ul>
                )}
              </div>

              <button
                onClick={handleAddFriend}
                disabled={isLoading || !friendId.trim()}
                className="btn border-none bg-[#5f859d] hover:bg-[#4a6b82] text-white min-w-[120px]"
              >
                {isLoading ? <span className="loading loading-spinner loading-sm"></span> : 'Add Friend'}
              </button>
            </div>

            {status.type && (
              <div className={`mt-4 px-4 py-3 rounded-lg border ${status.type === 'success'
                  ? 'bg-[#121a14] text-[#5c8a63] border-[#203b26]'
                  : 'bg-red-950/20 text-red-500 border-red-900/50'
                }`}>
                <span>{status.message}</span>
              </div>
            )}
          </div>
        </div>

        <div className="card bg-shteam-comp shadow-xl border border-gray-800">
          <div className="card-body">
            <h2 className="card-title text-xl mb-4">Your Friends</h2>

            {isLoadingFriends ? (
              <div className="flex justify-center py-8">
                <span className="loading loading-spinner text-[#5f859d]"></span>
              </div>
            ) : friends.length === 0 ? (
              <div className="py-8 text-center border-2 border-dashed border-gray-800 rounded-xl">
                <p className="text-gray-500">You haven't added any friends yet.</p>
              </div>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {friends.map((friend, index) => (
                  <div key={index} className="flex items-center gap-3 bg-base-300 p-3 rounded-lg border border-gray-800 hover:border-[#5f859d] transition-colors cursor-default">
                    <div className="avatar placeholder">
                      <div className="bg-[#5f859d] text-white rounded-full w-10">
                        <span>{friend.substring(0, 2).toUpperCase()}</span>
                      </div>
                    </div>
                    <div>
                      <p className="font-semibold">{friend}</p>
                      <p className="text-xs text-gray-500">Connected</p>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>

      </div>
    </MainLayout>
  );
};