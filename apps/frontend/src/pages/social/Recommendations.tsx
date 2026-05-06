import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import type { Shader } from '../../../../../packages/shared';

interface Recommendation {
  shaderId: string;
  ownedByFriends: number;
}

interface EnrichedRecommendation extends Recommendation {
  details: Shader | null;
}

export const Recommendations = ({ userId }: { userId: string }) => {
  const [recs, setRecs] = useState<EnrichedRecommendation[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    if (!userId) return;

    const fetchEnrichedRecommendations = async () => {
      setIsLoading(true);
      try {
        const socialRes = await fetch(`http://localhost:3001/api/social/recommendations?userId=${userId}`);
        const baseRecs: Recommendation[] = await socialRes.json();

        if (!Array.isArray(baseRecs) || baseRecs.length === 0) {
          setRecs([]);
          setIsLoading(false);
          return;
        }

        const enrichedPromises = baseRecs.map(async (rec) => {
          try {
            const catalogRes = await fetch(`http://localhost:3000/api/catalog/shaders/${rec.shaderId}`);
            if (catalogRes.ok) {
              const details: Shader = await catalogRes.json();
              return { ...rec, details };
            }
          } catch (e) {
            console.error(`Failed to fetch details for shader ${rec.shaderId}`);
          }
          return { ...rec, details: null };
        });

        const enrichedRecs = await Promise.all(enrichedPromises);
        setRecs(enrichedRecs);
      } catch (err) {
        console.error('Failed to fetch recommendations:', err);
        setRecs([]);
      } finally {
        setIsLoading(false);
      }
    };

    fetchEnrichedRecommendations();
  }, [userId]);

  if (!isLoading && recs.length === 0) return null;

  return (
    <div className="mb-8 p-6 bg-shteam-comp border border-gray-800 rounded-xl shadow-lg">
      <h2 className="text-xl font-bold mb-4 flex items-center gap-2">
        Recommended by Friends
      </h2>
      
      {isLoading ? (
         <div className="flex justify-center items-center h-48">
           <span className="loading loading-spinner text-[#5f859d] loading-lg"></span>
         </div>
      ) : (
        <div className="flex gap-6 overflow-x-auto pb-4 scrollbar-thin scrollbar-thumb-gray-700 scrollbar-track-transparent">
          {recs.map(rec => (
            <div 
              key={rec.shaderId} 
              className="card bg-shteam-comp shadow-xl border border-gray-800 rounded-2xl min-w-[320px] w-[320px] shrink-0 hover:border-[#5f859d] transition-colors overflow-hidden"
            >
              <figure className="h-48 bg-base-300 border-b border-gray-800 relative">
                <div className="absolute top-3 right-3 bg-[#121a14]/90 text-xs px-2 py-1 rounded text-[#5f859d] border border-[#5f859d]/30 backdrop-blur-sm z-10 shadow-lg">
                  {rec.ownedByFriends} friend{rec.ownedByFriends > 1 ? 's' : ''} own this
                </div>
                
                <img
                  src={rec.details?.thumbnailUrl || `https://placehold.co/600x400/1a1a1a/444444?text=${rec.details?.title || rec.shaderId}`}
                  alt={rec.details?.title || rec.shaderId}
                  className="w-full h-full object-cover transition-transform hover:scale-105"
                />
              </figure>
              
              <div className="card-body p-5">
                <h2 className="card-title text-lg truncate">
                  {rec.details ? rec.details.title : rec.shaderId}
                </h2>
                <p className="text-sm text-gray-400 line-clamp-2 h-10">
                  {rec.details?.description || "No description provided."}
                </p>
                
                <div className="card-actions justify-between items-center mt-4 pt-4 border-t border-gray-800">
                  <span className="font-mono text-green-400 font-bold">
                    {rec.details ? (rec.details.price === 0 ? "FREE" : `$${rec.details.price}`) : "..."}
                  </span>
                  <Link 
                    to={`/shader/${rec.shaderId}`} 
                    className="btn btn-sm border-none bg-[#5f859d] hover:bg-[#4a6b82] text-white"
                  >
                    View Details
                  </Link>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};